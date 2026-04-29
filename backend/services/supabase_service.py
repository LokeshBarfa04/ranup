import os
import logging
from datetime import datetime
from typing import Optional
from supabase import create_client, Client

logger = logging.getLogger(__name__)

_client: Optional[Client] = None


def get_supabase() -> Client:
    """
    Return a singleton Supabase client using the SERVICE ROLE key
    (bypasses Row Level Security — safe for server-side use only).
    """
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise EnvironmentError(
                "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
            )

        _client = create_client(url, key)
        logger.info("Supabase client initialised.")

    return _client


# ── Contact Submissions ──────────────────────────────────────────────────────

def save_contact_submission(
    name: str,
    phone: str,
    email: str,
    message: str,
) -> dict:
    """
    Insert a new contact form submission into the contact_submissions table.
    Returns the inserted row.
    """
    db = get_supabase()

    payload = {
        "name":    name,
        "phone":   phone,
        "email":   email,
        "message": message,
        "status":  "new",
    }

    response = (
        db.table("contact_submissions")
        .insert(payload)
        .execute()
    )

    if not response.data:
        raise RuntimeError("Supabase insert returned no data for contact submission.")

    row = response.data[0]
    logger.info(f"Contact saved to Supabase: id={row['id']} email={email}")
    return row


# ── Catalogue Queries (used by API routes) ───────────────────────────────────

def get_all_categories() -> list[dict]:
    """Return all categories ordered by sort_order."""
    db = get_supabase()
    resp = (
        db.table("categories")
        .select("*")
        .order("sort_order")
        .execute()
    )
    return resp.data or []


def get_sub_categories(category_id: str | None = None) -> list[dict]:
    """Return sub-categories, optionally filtered by category."""
    db = get_supabase()
    q = db.table("sub_categories").select("*").order("sort_order")
    if category_id:
        q = q.eq("category_id", category_id)
    return q.execute().data or []


def get_products(
    sub_category_id: str | None = None,
    category_id: str | None = None,
    active_only: bool = True,
) -> list[dict]:
    """
    Return products with their primary image URL attached.
    Optionally filter by sub_category or category.
    """
    db = get_supabase()

    # Fetch products
    q = db.table("products").select("*").order("sort_order")
    if active_only:
        q = q.eq("is_active", True)
    if sub_category_id:
        q = q.eq("sub_category_id", sub_category_id)
    elif category_id:
        # Filter by joining sub_categories
        sub_ids = [
            s["id"]
            for s in get_sub_categories(category_id=category_id)
        ]
        if not sub_ids:
            return []
        q = q.in_("sub_category_id", sub_ids)

    products = q.execute().data or []

    if not products:
        return []

    # Attach primary images
    product_ids = [p["id"] for p in products]
    img_resp = (
        db.table("product_images")
        .select("product_id, url, alt_text")
        .in_("product_id", product_ids)
        .eq("is_primary", True)
        .execute()
    )
    img_map = {row["product_id"]: row for row in (img_resp.data or [])}

    for p in products:
        img = img_map.get(p["id"])
        p["image_url"]  = img["url"]      if img else None
        p["image_alt"]  = img["alt_text"] if img else None

    return products


def get_product_by_id(product_id: int) -> dict | None:
    """Return a single product with ALL its images."""
    db = get_supabase()

    prod_resp = (
        db.table("products")
        .select("*")
        .eq("id", product_id)
        .single()
        .execute()
    )
    product = prod_resp.data
    if not product:
        return None

    img_resp = (
        db.table("product_images")
        .select("*")
        .eq("product_id", product_id)
        .order("sort_order")
        .execute()
    )
    product["images"] = img_resp.data or []
    return product


def get_full_catalogue() -> list[dict]:
    """
    Return the full nested catalogue:
    categories → sub_categories → products (with primary image).
    Used to hydrate the frontend on load.
    """
    db = get_supabase()

    categories = get_all_categories()
    if not categories:
        return []

    cat_ids = [c["id"] for c in categories]

    # All sub-categories for these categories
    subs_resp = (
        db.table("sub_categories")
        .select("*")
        .in_("category_id", cat_ids)
        .order("sort_order")
        .execute()
    )
    subs = subs_resp.data or []
    sub_ids = [s["id"] for s in subs]

    # All active products
    prods_resp = (
        db.table("products")
        .select("*")
        .in_("sub_category_id", sub_ids)
        .eq("is_active", True)
        .order("sort_order")
        .execute()
    )
    products = prods_resp.data or []
    prod_ids = [p["id"] for p in products]

    # Primary images
    if prod_ids:
        img_resp = (
            db.table("product_images")
            .select("product_id, url, alt_text")
            .in_("product_id", prod_ids)
            .eq("is_primary", True)
            .execute()
        )
        img_map = {row["product_id"]: row for row in (img_resp.data or [])}
    else:
        img_map = {}

    for p in products:
        img = img_map.get(p["id"])
        p["image_url"] = img["url"]      if img else None
        p["image_alt"] = img["alt_text"] if img else None

    # Nest products → sub-categories
    prod_by_sub: dict[str, list] = {}
    for p in products:
        prod_by_sub.setdefault(p["sub_category_id"], []).append(p)

    sub_by_cat: dict[str, list] = {}
    for s in subs:
        s["products"] = prod_by_sub.get(s["id"], [])
        sub_by_cat.setdefault(s["category_id"], []).append(s)

    # Nest sub-categories → categories
    for c in categories:
        c["sub_categories"] = sub_by_cat.get(c["id"], [])

    return categories


# ── Image Upload ─────────────────────────────────────────────────────────────

def upload_product_image(
    product_id: int,
    file_bytes: bytes,
    filename: str,
    content_type: str,
    is_primary: bool = False,
    alt_text: str = "",
) -> dict:
    """
    Upload an image to Supabase Storage and register it in product_images.
    Returns the inserted product_images row.
    """
    db = get_supabase()
    bucket = "product-images"

    # Unique path inside the bucket
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
    timestamp = int(datetime.now().timestamp())
    storage_path = f"products/{product_id}/{timestamp}.{ext}"

    # Upload to Storage
    db.storage.from_(bucket).upload(
        path=storage_path,
        file=file_bytes,
        file_options={"content-type": content_type},
    )

    # Get public URL
    public_url = db.storage.from_(bucket).get_public_url(storage_path)

    # If this is being set as primary, unset any existing primary
    if is_primary:
        db.table("product_images").update({"is_primary": False}).eq(
            "product_id", product_id
        ).eq("is_primary", True).execute()

    # Insert image record
    row_resp = (
        db.table("product_images")
        .insert({
            "product_id":   product_id,
            "url":          public_url,
            "storage_path": storage_path,
            "alt_text":     alt_text,
            "is_primary":   is_primary,
        })
        .execute()
    )

    row = row_resp.data[0]
    logger.info(f"Image uploaded for product {product_id}: {public_url}")
    return row
