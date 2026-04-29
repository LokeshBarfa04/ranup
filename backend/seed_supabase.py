"""
seed_supabase.py
────────────────
One-time script to seed Supabase with the product catalogue
that currently lives in frontend/src/lib/ProductData.ts.

Run from the backend/ directory:
    python seed_supabase.py

Requirements:
    pip install supabase python-dotenv
    .env must have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set.
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")
    sys.exit(1)

db = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# ── Catalogue data (copied & adapted from ProductData.ts) ────────────────────
# Each product maps to the DB schema (snake_case column names).

CATALOGUE = [
    {
        "id": "vegetable-seeds",
        "label": "Vegetable Seeds",
        "tagline": "Certified F1 hybrids & open-pollinated varieties",
        "icon": "🥦",
        "accent": "#4d7d1a",
        "sort_order": 1,
        "sub_categories": [
            {
                "id": "tomato",
                "label": "Tomato",
                "icon": "🍅",
                "description": "Round, cherry, and roma types for fresh market and processing.",
                "sort_order": 1,
                "products": [
                    {
                        "name": "Arka Rakshak F1",
                        "variety": "Indeterminate · Round",
                        "short_desc": "Triple-disease resistant hybrid with 60–80 t/ha potential.",
                        "full_desc": (
                            "Arka Rakshak F1 is India's first triple-disease resistant tomato hybrid, "
                            "carrying resistance to ToLCV, TSV, and early blight simultaneously. "
                            "Fruits are round, firm, deep-red with 7–8 mm pericarp; shelf life 12–14 days."
                        ),
                        "germination": "94%",
                        "season": "Year Round",
                        "maturity": "65–70 days",
                        "seed_rate": "150–200 g/acre",
                        "packaging_sizes": ["10 g", "50 g", "100 g"],
                        "suitable_crops": ["Open field", "Polyhouse", "Shade net"],
                        "tags": ["Triple Disease Resistant", "F1 Hybrid", "Long Shelf Life"],
                        "key_benefits": [
                            "Resistant to ToLCV, TSV, and early blight",
                            "Firm fruits — shelf life 12–14 days",
                            "Yield potential 60–80 t/ha",
                            "Suitable for fresh market and processing",
                        ],
                        "sowing_instructions": (
                            "Raise in pro-trays with cocopeat. Transplant 25-day seedlings at 60 × 45 cm. "
                            "Stake at 30 cm. Use drip irrigation with fertigation schedule."
                        ),
                        "sort_order": 1,
                    },
                ],
            },
        ],
    },
    # Add more categories here following the same structure,
    # or copy from frontend/src/lib/ProductData.ts DEFAULT_DATA.
]


def seed():
    print("🌱 Starting Supabase seed...")

    for cat in CATALOGUE:
        sub_categories = cat.pop("sub_categories", [])

        print(f"  → Upserting category: {cat['id']}")
        db.table("categories").upsert(cat, on_conflict="id").execute()

        for i, sub in enumerate(sub_categories):
            products = sub.pop("products", [])
            sub["category_id"] = cat["id"]

            print(f"    → Upserting sub-category: {sub['id']}")
            db.table("sub_categories").upsert(sub, on_conflict="id").execute()

            for j, prod in enumerate(products):
                prod["sub_category_id"] = sub["id"]
                prod.setdefault("sort_order", j + 1)
                prod.setdefault("is_active", True)

                # Check if product with same name + sub_category already exists
                existing = (
                    db.table("products")
                    .select("id")
                    .eq("sub_category_id", sub["id"])
                    .eq("name", prod["name"])
                    .execute()
                )

                if existing.data:
                    pid = existing.data[0]["id"]
                    db.table("products").update(prod).eq("id", pid).execute()
                    print(f"      ↺ Updated product: {prod['name']} (id={pid})")
                else:
                    resp = db.table("products").insert(prod).execute()
                    pid = resp.data[0]["id"]
                    print(f"      ✓ Inserted product: {prod['name']} (id={pid})")

    print("\n✅ Seed complete!")
    print("\nNext steps:")
    print("  1. Upload product images via:  POST /products/{id}/images")
    print("  2. Or directly in Supabase Storage → product-images bucket")
    print("  3. Add full catalogue rows by extending CATALOGUE in this file")


if __name__ == "__main__":
    seed()
