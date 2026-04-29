import os
import logging
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from dotenv import load_dotenv

from services.email_service import send_contact_email
from services.supabase_service import (
    save_contact_submission,
    get_full_catalogue,
    get_all_categories,
    get_sub_categories,
    get_products,
    get_product_by_id,
    upload_product_image,
    get_supabase,
)

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AgroSeeds API",
    description="Backend for Agriculture/Seed company website — powered by Supabase",
    version="2.0.0",
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ════════════════════════════════════════════════════════════════

class ContactRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    message: str

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty")
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v

    @field_validator("phone")
    @classmethod
    def phone_must_be_valid(cls, v: str) -> str:
        v = v.strip()
        digits = "".join(c for c in v if c.isdigit())
        if len(digits) < 7 or len(digits) > 15:
            raise ValueError("Phone number must be between 7 and 15 digits")
        return v

    @field_validator("message")
    @classmethod
    def message_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty")
        if len(v) < 10:
            raise ValueError("Message must be at least 10 characters")
        return v


class CategoryCreate(BaseModel):
    id: str                        # e.g. "vegetable-seeds"
    label: str
    tagline: Optional[str] = None
    icon: Optional[str] = None
    accent: Optional[str] = None
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    label: Optional[str] = None
    tagline: Optional[str] = None
    icon: Optional[str] = None
    accent: Optional[str] = None
    sort_order: Optional[int] = None


class SubCategoryCreate(BaseModel):
    id: str                        # e.g. "tomato"
    category_id: str
    label: str
    icon: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0


class SubCategoryUpdate(BaseModel):
    label: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    category_id: Optional[str] = None


class ProductCreate(BaseModel):
    sub_category_id: str
    name: str
    variety: Optional[str] = None
    short_desc: Optional[str] = None
    full_desc: Optional[str] = None
    germination: Optional[str] = None
    season: Optional[str] = None
    maturity: Optional[str] = None
    seed_rate: Optional[str] = None
    sowing_instructions: Optional[str] = None
    npk_ratio: Optional[str] = None
    dosage: Optional[str] = None
    application_method: Optional[str] = None
    packaging_sizes: list[str] = []
    suitable_crops: list[str] = []
    tags: list[str] = []
    key_benefits: list[str] = []
    is_active: bool = True
    sort_order: int = 0


class ProductUpdate(BaseModel):
    sub_category_id: Optional[str] = None
    name: Optional[str] = None
    variety: Optional[str] = None
    short_desc: Optional[str] = None
    full_desc: Optional[str] = None
    germination: Optional[str] = None
    season: Optional[str] = None
    maturity: Optional[str] = None
    seed_rate: Optional[str] = None
    sowing_instructions: Optional[str] = None
    npk_ratio: Optional[str] = None
    dosage: Optional[str] = None
    application_method: Optional[str] = None
    packaging_sizes: Optional[list[str]] = None
    suitable_crops: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    key_benefits: Optional[list[str]] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


# ════════════════════════════════════════════════════════════════
# HEALTH
# ════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    return {"status": "ok", "message": "AgroSeeds API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# ════════════════════════════════════════════════════════════════
# CONTACT FORM
# ════════════════════════════════════════════════════════════════

@app.post("/contact")
async def contact(payload: ContactRequest):
    logger.info(f"New contact request from: {payload.email}")

    try:
        save_contact_submission(
            name=payload.name,
            phone=payload.phone,
            email=payload.email,
            message=payload.message,
        )
    except Exception as e:
        logger.error(f"Supabase contact save failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Could not save your message. Please try again or contact us directly.",
        )

    email_sent = False
    try:
        send_contact_email(
            name=payload.name,
            phone=payload.phone,
            email=payload.email,
            message=payload.message,
        )
        email_sent = True
    except Exception as e:
        logger.warning(f"Email notification failed (non-critical): {e}")

    return {
        "success": True,
        "message": "Thank you! Your message has been received. We'll get back to you within 24 hours.",
        "email_sent": email_sent,
    }


@app.get("/contacts")
async def get_contacts(status: Optional[str] = None):
    """Admin — list all contact submissions."""
    try:
        db = get_supabase()
        q = db.table("contact_submissions").select("*").order("created_at", desc=True)
        if status:
            q = q.eq("status", status)
        resp = q.execute()
        return {"success": True, "data": resp.data or []}
    except Exception as e:
        logger.error(f"Failed to fetch contacts: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch contacts.")


@app.patch("/contacts/{contact_id}")
async def update_contact_status(contact_id: str, payload: dict):
    """Admin — mark contact as read / replied, add notes."""
    try:
        db = get_supabase()
        allowed = {"status", "notes"}
        data = {k: v for k, v in payload.items() if k in allowed}
        if not data:
            raise HTTPException(status_code=400, detail="Nothing to update.")
        resp = db.table("contact_submissions").update(data).eq("id", contact_id).execute()
        return {"success": True, "data": resp.data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update contact: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update contact.")


# ════════════════════════════════════════════════════════════════
# CATALOGUE (full nested, read-only)
# ════════════════════════════════════════════════════════════════

@app.get("/catalogue")
async def catalogue():
    try:
        data = get_full_catalogue()
        return {"success": True, "data": data}
    except Exception as e:
        logger.error(f"Failed to fetch catalogue: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch catalogue.")


# ════════════════════════════════════════════════════════════════
# CATEGORIES — CRUD
# ════════════════════════════════════════════════════════════════

@app.get("/categories")
async def list_categories():
    try:
        return {"success": True, "data": get_all_categories()}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch categories.")


@app.post("/categories", status_code=201)
async def create_category(payload: CategoryCreate):
    try:
        db = get_supabase()
        resp = db.table("categories").insert(payload.model_dump()).execute()
        return {"success": True, "data": resp.data[0]}
    except Exception as e:
        logger.error(f"Failed to create category: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create category: {str(e)}")


@app.get("/categories/{category_id}")
async def get_category(category_id: str):
    try:
        db = get_supabase()
        resp = db.table("categories").select("*").eq("id", category_id).single().execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Category not found.")
        return {"success": True, "data": resp.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch category.")


@app.put("/categories/{category_id}")
async def update_category(category_id: str, payload: CategoryUpdate):
    try:
        db = get_supabase()
        data = {k: v for k, v in payload.model_dump().items() if v is not None}
        if not data:
            raise HTTPException(status_code=400, detail="Nothing to update.")
        resp = db.table("categories").update(data).eq("id", category_id).execute()
        return {"success": True, "data": resp.data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update category: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update category.")


@app.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    try:
        db = get_supabase()
        db.table("categories").delete().eq("id", category_id).execute()
        return {"success": True, "message": f"Category '{category_id}' deleted."}
    except Exception as e:
        logger.error(f"Failed to delete category: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete category.")


# ════════════════════════════════════════════════════════════════
# SUB-CATEGORIES — CRUD
# ════════════════════════════════════════════════════════════════

@app.get("/categories/{category_id}/sub-categories")
async def list_sub_categories(category_id: str):
    try:
        data = get_sub_categories(category_id=category_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch sub-categories.")


@app.post("/sub-categories", status_code=201)
async def create_sub_category(payload: SubCategoryCreate):
    try:
        db = get_supabase()
        resp = db.table("sub_categories").insert(payload.model_dump()).execute()
        return {"success": True, "data": resp.data[0]}
    except Exception as e:
        logger.error(f"Failed to create sub-category: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create sub-category: {str(e)}")


@app.get("/sub-categories/{sub_category_id}")
async def get_sub_category(sub_category_id: str):
    try:
        db = get_supabase()
        resp = db.table("sub_categories").select("*").eq("id", sub_category_id).single().execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Sub-category not found.")
        return {"success": True, "data": resp.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch sub-category.")


@app.put("/sub-categories/{sub_category_id}")
async def update_sub_category(sub_category_id: str, payload: SubCategoryUpdate):
    try:
        db = get_supabase()
        data = {k: v for k, v in payload.model_dump().items() if v is not None}
        if not data:
            raise HTTPException(status_code=400, detail="Nothing to update.")
        resp = db.table("sub_categories").update(data).eq("id", sub_category_id).execute()
        return {"success": True, "data": resp.data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update sub-category: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update sub-category.")


@app.delete("/sub-categories/{sub_category_id}")
async def delete_sub_category(sub_category_id: str):
    try:
        db = get_supabase()
        db.table("sub_categories").delete().eq("id", sub_category_id).execute()
        return {"success": True, "message": f"Sub-category '{sub_category_id}' deleted."}
    except Exception as e:
        logger.error(f"Failed to delete sub-category: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete sub-category.")


# ════════════════════════════════════════════════════════════════
# PRODUCTS — CRUD
# ════════════════════════════════════════════════════════════════

@app.get("/products")
async def list_products(
    category_id: Optional[str] = None,
    sub_category_id: Optional[str] = None,
):
    try:
        data = get_products(sub_category_id=sub_category_id, category_id=category_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch products.")


@app.post("/products", status_code=201)
async def create_product(payload: ProductCreate):
    try:
        db = get_supabase()
        resp = db.table("products").insert(payload.model_dump()).execute()
        return {"success": True, "data": resp.data[0]}
    except Exception as e:
        logger.error(f"Failed to create product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


@app.get("/products/{product_id}")
async def product_detail(product_id: int):
    try:
        product = get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found.")
        return {"success": True, "data": product}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch product.")


@app.put("/products/{product_id}")
async def update_product(product_id: int, payload: ProductUpdate):
    try:
        db = get_supabase()
        data = {k: v for k, v in payload.model_dump().items() if v is not None}
        if not data:
            raise HTTPException(status_code=400, detail="Nothing to update.")
        resp = db.table("products").update(data).eq("id", product_id).execute()
        return {"success": True, "data": resp.data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update product.")


@app.delete("/products/{product_id}")
async def delete_product(product_id: int):
    try:
        db = get_supabase()
        db.table("products").delete().eq("id", product_id).execute()
        return {"success": True, "message": f"Product {product_id} deleted."}
    except Exception as e:
        logger.error(f"Failed to delete product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete product.")


# ════════════════════════════════════════════════════════════════
# PRODUCT IMAGES
# ════════════════════════════════════════════════════════════════

@app.post("/products/{product_id}/images")
async def add_product_image(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = Form(False),
    alt_text: str = Form(""),
):
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG, PNG, WebP, or GIF.",
        )

    max_size = 5 * 1024 * 1024
    file_bytes = await file.read()
    if len(file_bytes) > max_size:
        raise HTTPException(status_code=400, detail="Image must be under 5 MB.")

    try:
        row = upload_product_image(
            product_id=product_id,
            file_bytes=file_bytes,
            filename=file.filename or "image.jpg",
            content_type=file.content_type,
            is_primary=is_primary,
            alt_text=alt_text,
        )
        return {"success": True, "data": row}
    except Exception as e:
        logger.error(f"Image upload failed for product {product_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Image upload failed.")


@app.delete("/products/{product_id}/images/{image_id}")
async def delete_product_image(product_id: int, image_id: str):
    try:
        db = get_supabase()
        # Get storage path first for deletion from bucket
        resp = db.table("product_images").select("storage_path").eq("id", image_id).single().execute()
        if resp.data and resp.data.get("storage_path"):
            try:
                db.storage.from_("product-images").remove([resp.data["storage_path"]])
            except Exception as e:
                logger.warning(f"Could not delete from storage: {e}")
        db.table("product_images").delete().eq("id", image_id).execute()
        return {"success": True, "message": "Image deleted."}
    except Exception as e:
        logger.error(f"Failed to delete image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete image.")