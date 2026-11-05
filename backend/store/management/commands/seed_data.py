"""
store/management/commands/seed_data.py

A management command that populates the database with the categories
and products from Anastasia's Wardrobe catalog.

Run with:
    python manage.py seed_data

Run with --clear to wipe and re-seed:
    python manage.py seed_data --clear
"""

import os
import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.cache import cache
from django.conf import settings
from store.models import Category, Product, ProductImage


CATEGORIES = [
    {"id": "new-in", "name": "New in", "slug": "new-in", "enabled": True, "tagline": "Fresh silhouettes and seasonal discoverables."},
    {"id": "girls", "name": "Girls 2–12", "slug": "girls-2-12", "enabled": True, "tagline": "Soft cottons, smocked yokes and room to grow."},
    {"id": "teens", "name": "Teens 13–17", "slug": "teens-13-17", "enabled": True, "tagline": "Easy shapes, brushed textures and everyday ease."},
    {"id": "women", "name": "Women", "slug": "women", "enabled": True, "tagline": "Thoughtfully cut silhouettes for work, home and celebration."},
    {"id": "footwear", "name": "Footwear", "slug": "footwear", "enabled": True, "tagline": "Handcrafted leather loafers, boots and ballet flats."},
    {"id": "gifts", "name": "Gifts", "slug": "gifts", "enabled": True, "tagline": "Curated cashmere, pouches and keepsake tokens."},
    {"id": "the-edits", "name": "The edits", "slug": "the-edits", "enabled": True, "tagline": "Curated capsules for travel, weekend and evening."},
    {"id": "jewellery", "name": "Jewellery", "slug": "jewellery", "enabled": False, "tagline": ""},
    {"id": "accessories-bags", "name": "Accessories & bags", "slug": "accessories-and-bags", "enabled": False, "tagline": ""},
]


class Command(BaseCommand):
    help = "Seeds the database with Anastasia's Wardrobe categories and full products catalog."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing products and categories before seeding.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared all products and categories."))

        # ── 1. Seed categories ───────────────────────────────────────────────
        self.stdout.write("Seeding categories...")
        cat_map = {}
        for cat_data in CATEGORIES:
            category, created = Category.objects.update_or_create(
                id=cat_data["id"],
                defaults={
                    "name": cat_data["name"],
                    "slug": cat_data["slug"],
                    "enabled": cat_data["enabled"],
                    "tagline": cat_data["tagline"],
                },
            )
            cat_map[category.id] = category
            cat_map[category.slug] = category
            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {category.name} (id: {category.id}, slug: {category.slug})")

        # ── 2. Seed products from JSON ───────────────────────────────────────
        json_path = settings.BASE_DIR / "mock_products.json"
        if not json_path.exists():
            json_path = settings.BASE_DIR.parent / "backend" / "mock_products.json"

        products_data = []
        if json_path.exists():
            with open(json_path, "r", encoding="utf-8") as f:
                products_data = json.load(f)
            self.stdout.write(f"Loaded {len(products_data)} products from {json_path.name}")
        else:
            self.stdout.write(self.style.ERROR(f"mock_products.json not found at {json_path}"))
            return

        for p_data in products_data:
            cat_id = p_data.get("category", "women")
            category = cat_map.get(cat_id)
            if not category:
                # Try finding by slug or id in DB
                category = Category.objects.filter(id=cat_id).first() or Category.objects.filter(slug=cat_id).first()
            if not category:
                category = Category.objects.create(
                    id=cat_id,
                    name=cat_id.replace("-", " ").capitalize(),
                    slug=cat_id,
                    enabled=True,
                )
                cat_map[cat_id] = category

            slug = p_data.get("slug")
            price = p_data.get("price", 0)
            orig_price = p_data.get("originalPrice") or p_data.get("original_price")
            sale_note = p_data.get("saleNote") or p_data.get("sale_note", "")
            in_stock = p_data.get("inStock", p_data.get("in_stock", True))

            product, created = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": p_data.get("name", slug),
                    "category": category,
                    "department": p_data.get("department", category.name),
                    "price": price,
                    "original_price": orig_price,
                    "sale_note": sale_note,
                    "currency": p_data.get("currency", "INR"),
                    "color": p_data.get("color", ""),
                    "color_hex": p_data.get("colorHex") or p_data.get("color_hex", ""),
                    "available_colors": p_data.get("availableColors") or p_data.get("available_colors", []),
                    "sizes": p_data.get("sizes", []),
                    "image": p_data.get("image", "/images/cardigan.png"),
                    "gallery_images": p_data.get("galleryImages") or p_data.get("gallery_images", []),
                    "description": p_data.get("description", ""),
                    "details": p_data.get("details", []),
                    "fabric": p_data.get("fabric", ""),
                    "care": p_data.get("care", ""),
                    "badge": p_data.get("badge", ""),
                    "in_stock": in_stock,
                },
            )

            # Ensure ProductImage rows exist
            # 1. If explicit 'images' array provided
            if p_data.get("images") and isinstance(p_data["images"], list):
                # Clean up existing to avoid duplicates on re-seed
                product.images.all().delete()
                for i, img_obj in enumerate(p_data["images"]):
                    angle = img_obj.get("angle", "front")
                    if angle not in ["front", "side", "back", "detail", "lifestyle"]:
                        angle = "detail" if "detail" in angle else "front"
                    ProductImage.objects.create(
                        product=product,
                        image_url=img_obj.get("url", ""),
                        color=img_obj.get("color") or product.color or "",
                        angle=angle,
                        alt_text=img_obj.get("alt") or f"{product.name} - View {i + 1}",
                        position=img_obj.get("position", i),
                        is_primary=img_obj.get("isPrimary", i == 0),
                    )
            elif not product.images.exists():
                # Build from primary image + galleryImages
                all_urls = []
                if product.image:
                    all_urls.append(product.image)
                if product.gallery_images:
                    for g in product.gallery_images:
                        if g not in all_urls:
                            all_urls.append(g)

                angle_cycle = ["front", "back", "side", "detail", "lifestyle"]
                for i, img_url in enumerate(all_urls):
                    ang = angle_cycle[i % len(angle_cycle)]
                    ProductImage.objects.create(
                        product=product,
                        image_url=img_url,
                        color=product.color or "",
                        angle=ang,
                        alt_text=f"{product.name} - {ang.capitalize()} View",
                        position=i,
                        is_primary=(i == 0),
                    )

            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {product.name} ({product.images.count()} photos)")

        cache.clear()
        self.stdout.write(self.style.SUCCESS("\nDatabase seeded successfully!"))
        self.stdout.write(f"   Categories: {Category.objects.count()}")
        self.stdout.write(f"   Products:   {Product.objects.count()}")
        self.stdout.write(f"   Images:     {ProductImage.objects.count()}")
