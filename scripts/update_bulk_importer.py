import os, re

bulk_path = os.path.abspath('backend/store/bulk.py')
with open(bulk_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Ensure 'import re' is at top
if 'import re\n' not in code:
    code = code.replace('import zipfile\n', 'import zipfile\nimport re\n')

# 2. Replace zip extraction logic
old_block_start = '    # Handle image ZIP extraction\n    if is_zip:'
old_block_end = '    # Read rows from Excel or CSV'

idx_start = code.find(old_block_start)
idx_end = code.find(old_block_end)

if idx_start == -1 or idx_end == -1:
    print('Failed to find zip block bounds')
    exit(1)

new_zip_block = '''    # Handle image ZIP extraction
    if is_zip:
        try:
            with zipfile.ZipFile(file_obj, "r") as z:
                image_files = [f for f in z.namelist() if not f.startswith("__MACOSX") and f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]
                result["zip_images_count"] = len(image_files)

                # Map existing products for quick lookup
                products = {p.slug.lower(): p for p in Product.objects.all()}
                default_category = Category.objects.filter(slug="jewellery").first() or Category.objects.first()

                for img_name in image_files:
                    base_name = os.path.basename(img_name)
                    name_without_ext = os.path.splitext(base_name)[0]
                    clean_path = img_name.lower().replace("\\\\", "/")
                    dir_name = os.path.basename(os.path.dirname(clean_path))
                    cleaned_dir = re.sub(r"^\\d+(\\.\\d+)?[-_ ]*", "", dir_name)

                    # Match by product slug across folder name, full path, or base name
                    matched_prod = None
                    matched_color = ""

                    # 1. Direct match on cleaned directory name (e.g. products/celeste-crossbody/...)
                    if cleaned_dir and cleaned_dir in products:
                        matched_prod = products[cleaned_dir]

                    # 2. Search all existing product slugs in full relative path
                    if not matched_prod:
                        for slug, prod in products.items():
                            if slug == cleaned_dir or slug in clean_path or slug.replace("the-", "") in clean_path:
                                matched_prod = prod
                                break

                    # 3. Match by product display name
                    if not matched_prod:
                        for slug, prod in products.items():
                            if prod.name.lower() in clean_path:
                                matched_prod = prod
                                break

                    # 4. Auto-create product if auto_create_categories is enabled and product does not exist
                    if not matched_prod and auto_create_categories and cleaned_dir and len(cleaned_dir) > 2:
                        prod_name = cleaned_dir.replace("-", " ").title()
                        cat = default_category
                        if any(w in cleaned_dir for w in ["dress", "skirt", "coat", "blazer", "shirt"]):
                            cat = Category.objects.filter(slug="women").first() or default_category
                        elif any(w in cleaned_dir for w in ["jewel", "bangle", "pearl", "earring", "ring", "choker"]):
                            cat = Category.objects.filter(slug="jewellery").first() or default_category
                        elif any(w in cleaned_dir for w in ["bag", "crossbody", "pouch"]):
                            cat = Category.objects.filter(slug="gifts").first() or default_category

                        if not is_dry_run:
                            matched_prod, _ = Product.objects.get_or_create(
                                slug=cleaned_dir,
                                defaults={
                                    "name": prod_name,
                                    "category": cat,
                                    "department": f"{cat.name} · Curated Edit" if cat else "Atelier Edit",
                                    "price": 3490,
                                    "original_price": 4200,
                                    "currency": "INR",
                                    "in_stock": True,
                                }
                            )
                            products[cleaned_dir] = matched_prod
                        else:
                            # Mock for dry run preview
                            matched_prod = type("MockProduct", (), {"name": prod_name, "slug": cleaned_dir, "color": "Studio", "available_colors": []})()

                    if matched_prod:
                        # Check if filename or path indicates a color variant
                        for c in (getattr(matched_prod, "available_colors", []) or []):
                            c_name = c["name"] if isinstance(c, dict) else str(c)
                            if c_name.lower() in clean_path:
                                matched_color = c_name
                                break

                        result["zip_images_attached"].append({
                            "file": f"{cleaned_dir}/{base_name}" if cleaned_dir else base_name,
                            "product": matched_prod.name,
                            "slug": matched_prod.slug,
                            "color": matched_color or getattr(matched_prod, "color", "") or "Primary",
                        })

                        if not is_dry_run and hasattr(matched_prod, "id"):
                            file_content = z.read(img_name)
                            
                            # 1. Save to Django MEDIA_ROOT
                            dest_rel = f"products/{matched_prod.slug}_{base_name}"
                            dest_path = os.path.join(settings.MEDIA_ROOT, "products")
                            os.makedirs(dest_path, exist_ok=True)
                            full_path = os.path.join(settings.MEDIA_ROOT, dest_rel)
                            with open(full_path, "wb") as f_out:
                                f_out.write(file_content)

                            # 2. Also mirror to Next.js public/images/products folder for 0ms frontend rendering
                            frontend_prod_dir = os.path.join(settings.BASE_DIR.parent, "artifacts", "rynas-wardrobe", "public", "images", "products", matched_prod.slug)
                            os.makedirs(frontend_prod_dir, exist_ok=True)
                            frontend_img_path = os.path.join(frontend_prod_dir, base_name)
                            with open(frontend_img_path, "wb") as f_out:
                                f_out.write(file_content)

                            # Determine angle
                            base_lower = base_name.lower()
                            if "front" in base_lower:
                                angle_val = "front"
                            elif any(k in base_lower for k in ["three", "quarter", "side"]):
                                angle_val = "side"
                            elif any(k in base_lower for k in ["back", "rear"]):
                                angle_val = "back"
                            elif "detail" in base_lower:
                                angle_val = "detail"
                            else:
                                angle_val = "lifestyle"

                            # Update main image if front or currently empty
                            if not matched_prod.image or "front" in base_lower:
                                matched_prod.image = f"/images/products/{matched_prod.slug}/{base_name}"
                                matched_prod.save(update_fields=["image"])

                            # Create or update ProductImage
                            frontend_rel_url = f"/images/products/{matched_prod.slug}/{base_name}"
                            pimg = ProductImage.objects.filter(product=matched_prod, image_url=frontend_rel_url).first()
                            if not pimg:
                                ProductImage.objects.create(
                                    product=matched_prod,
                                    image_url=frontend_rel_url,
                                    color=matched_color or getattr(matched_prod, "color", ""),
                                    alt_text=f"{matched_prod.name} - {angle_val.title()}",
                                    angle=angle_val,
                                )

            if not is_dry_run:
                result["updated_count"] = len(result["zip_images_attached"])
                cache.clear()
            else:
                result["valid_count"] = len(result["zip_images_attached"])
            return result
        except Exception as e:
            result["errors"].append({"row": 0, "column": "ZIP", "message": f"Failed to unpack ZIP archive: {str(e)}"})
            return result

'''

code = code[:idx_start] + new_zip_block + code[idx_end:]

with open(bulk_path, 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated backend/store/bulk.py successfully')

