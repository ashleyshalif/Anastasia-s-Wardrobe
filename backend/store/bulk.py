"""
store/bulk.py
Enterprise bulk product import/export engine for Anastasia's Wardrobe.
Supports:
- Multi-category CSV and Excel (.xlsx) export and import
- Template downloads (CSV and Excel) with sample rows
- Dry-run validation preview with row-level error reporting
- ZIP archive upload for product images with automatic slug & color matching
"""

import io
import os
import csv
import zipfile
import re
from datetime import datetime
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.cache import cache
from django.http import HttpResponse
from django.utils.text import slugify
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from .models import Product, Category, ProductImage

EXPORT_COLUMNS = [
    ("slug", "Product Slug (Unique ID)"),
    ("name", "Product Name"),
    ("category", "Category (Slug or Name)"),
    ("department", "Department Heading"),
    ("price", "Price (INR ₹)"),
    ("original_price", "Original Price (INR ₹)"),
    ("sale_note", "Sale Note"),
    ("currency", "Currency"),
    ("color", "Primary Color"),
    ("color_hex", "Color Hex Code"),
    ("sizes", "Sizes (comma-separated)"),
    ("image", "Cover Image Path/URL"),
    ("badge", "Badge (e.g. BESTSELLER)"),
    ("in_stock", "In Stock (TRUE/FALSE)"),
    ("fabric", "Fabric Blend"),
    ("care", "Care Instructions"),
    ("description", "Description"),
]


def export_products_csv(queryset):
    """Exports selected product queryset to a cleanly formatted CSV file."""
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([col[0] for col in EXPORT_COLUMNS])

    for prod in queryset:
        sizes_str = ", ".join(prod.sizes) if isinstance(prod.sizes, list) else str(prod.sizes or "")
        writer.writerow([
            prod.slug,
            prod.name,
            prod.category.slug if prod.category else "",
            prod.department,
            prod.price,
            prod.original_price or "",
            prod.sale_note or "",
            prod.currency,
            prod.color,
            prod.color_hex or "",
            sizes_str,
            prod.primary_image_url or prod.image or "",
            prod.badge or "",
            "TRUE" if prod.in_stock else "FALSE",
            prod.fabric or "",
            prod.care or "",
            prod.description or "",
        ])

    response = HttpResponse(output.getvalue(), content_type="text/csv; charset=utf-8")
    filename = f"rynas_wardrobe_products_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response


def export_products_excel(queryset):
    """Exports selected product queryset to a beautifully styled Excel (.xlsx) workbook."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Ryna Wardrobe Products"

    # Styling definitions (Atelier Burgundy #713A48 & Ivory #F8F5EF theme)
    header_fill = PatternFill(start_color="713A48", end_color="713A48", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    border_side = Side(border_style="thin", color="D8CFC6")
    cell_border = Border(left=border_side, right=border_side, top=border_side, bottom=border_side)
    alt_fill = PatternFill(start_color="FAF7F2", end_color="FAF7F2", fill_type="solid")

    headers = [col[1] for col in EXPORT_COLUMNS]
    ws.append(headers)

    # Style Header Row
    for col_num in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_num)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    ws.row_dimensions[1].height = 28

    # Rows
    for row_idx, prod in enumerate(queryset, start=2):
        sizes_str = ", ".join(prod.sizes) if isinstance(prod.sizes, list) else str(prod.sizes or "")
        row_vals = [
            prod.slug,
            prod.name,
            prod.category.slug if prod.category else "",
            prod.department,
            prod.price,
            prod.original_price or "",
            prod.sale_note or "",
            prod.currency,
            prod.color,
            prod.color_hex or "",
            sizes_str,
            prod.primary_image_url or prod.image or "",
            prod.badge or "",
            "TRUE" if prod.in_stock else "FALSE",
            prod.fabric or "",
            prod.care or "",
            prod.description or "",
        ]
        ws.append(row_vals)

        # Style data row
        for col_num in range(1, len(row_vals) + 1):
            cell = ws.cell(row=row_idx, column=col_num)
            cell.font = data_font
            cell.border = cell_border
            if row_idx % 2 == 1:
                cell.fill = alt_fill

    # Auto-adjust column widths
    for col in ws.columns:
        max_len = max(len(str(cell.value or "")) for cell in col)
        col_letter = col[0].column_letter
        ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 40)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    response = HttpResponse(
        output.getvalue(),
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    filename = f"rynas_wardrobe_products_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response


def generate_template_csv():
    """Generates an empty or sample CSV template for merchants to fill out."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([col[0] for col in EXPORT_COLUMNS])

    # Sample rows
    writer.writerow([
        "heritage-tweed-coat",
        "Heritage Tweed Overcoat",
        "women",
        "Women · Tailoring",
        "8990",
        "10990",
        "Sale · Save ₹2,000",
        "INR",
        "Houndstooth Charcoal",
        "#3B3736",
        "XS, S, M, L, XL",
        "/images/cardigan.png",
        "JUST IN",
        "TRUE",
        "100% Scottish Virgin Wool",
        "Specialist Dry Clean Only",
        "Expertly tailored double-breasted tweed overcoat with hand-stitched horn buttons.",
    ])
    writer.writerow([
        "velvet-party-dress",
        "Velvet Bow Party Dress",
        "girls-2-12",
        "Girls · 2–12",
        "4290",
        "",
        "",
        "INR",
        "Bordeaux Plum",
        "#582D38",
        "2-3 Y, 4-5 Y, 6-7 Y, 8-9 Y",
        "/images/coord.png",
        "BESTSELLER",
        "TRUE",
        "Silk-Cotton Blend Velvet",
        "Hand Wash Cold / Flat Dry",
        "Charming velvet dress finished with an oversized grosgrain silk bow at the back.",
    ])

    response = HttpResponse(output.getvalue(), content_type="text/csv; charset=utf-8")
    response["Content-Disposition"] = 'attachment; filename="rynas_wardrobe_import_template.csv"'
    return response


def generate_template_excel():
    """Generates a styled Excel template workbook with sample rows and guidelines."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Import Template"

    header_fill = PatternFill(start_color="713A48", end_color="713A48", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    headers = [col[0] for col in EXPORT_COLUMNS]
    ws.append(headers)

    for col_num in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_num)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")

    sample_rows = [
        [
            "heritage-tweed-coat",
            "Heritage Tweed Overcoat",
            "women",
            "Women · Tailoring",
            8990,
            10990,
            "Sale · Save ₹2,000",
            "INR",
            "Houndstooth Charcoal",
            "#3B3736",
            "XS, S, M, L, XL",
            "/images/cardigan.png",
            "JUST IN",
            "TRUE",
            "100% Scottish Virgin Wool",
            "Specialist Dry Clean Only",
            "Double-breasted tailored coat with natural horn buttons.",
        ],
        [
            "velvet-party-dress",
            "Velvet Bow Party Dress",
            "girls-2-12",
            "Girls · 2–12",
            4290,
            "",
            "",
            "INR",
            "Bordeaux Plum",
            "#582D38",
            "2-3 Y, 4-5 Y, 6-7 Y, 8-9 Y",
            "/images/coord.png",
            "BESTSELLER",
            "TRUE",
            "Silk-Cotton Blend Velvet",
            "Hand Wash Cold",
            "Charming party dress with silk back bow.",
        ],
    ]

    for r in sample_rows:
        ws.append(r)

    for col in ws.columns:
        max_len = max(len(str(cell.value or "")) for cell in col)
        col_letter = col[0].column_letter
        ws.column_dimensions[col_letter].width = max(max_len + 4, 14)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    response = HttpResponse(
        output.getvalue(),
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    response["Content-Disposition"] = 'attachment; filename="rynas_wardrobe_import_template.xlsx"'
    return response


def parse_and_validate_import(file_obj, is_dry_run=True, auto_create_categories=False):
    """
    Parses CSV, Excel, or ZIP files.
    Validates every row and either returns preview report or commits changes to SQLite.
    Returns:
    {
        "is_dry_run": bool,
        "total_rows": int,
        "valid_count": int,
        "error_count": int,
        "created_count": int,
        "updated_count": int,
        "errors": [{"row": int, "column": str, "message": str}],
        "preview_rows": list,
        "zip_images_count": int,
        "zip_images_attached": list
    }
    """
    filename = getattr(file_obj, "name", "").lower()
    is_zip = filename.endswith(".zip")
    is_excel = filename.endswith(".xlsx") or filename.endswith(".xls")

    result = {
        "is_dry_run": is_dry_run,
        "total_rows": 0,
        "valid_count": 0,
        "error_count": 0,
        "created_count": 0,
        "updated_count": 0,
        "errors": [],
        "preview_rows": [],
        "zip_images_count": 0,
        "zip_images_attached": [],
    }

    # Handle image ZIP extraction
    if is_zip:
        try:
            with zipfile.ZipFile(file_obj, "r") as z:
                image_files = [f for f in z.namelist() if not f.startswith("__MACOSX") and f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]
                result["zip_images_count"] = len(image_files)

                # Map existing products for quick lookup
                products = {p.slug.lower(): p for p in Product.objects.all()}
                default_category = Category.objects.filter(slug="jewellery").first() or Category.objects.first()

                # Extract zip archive base name if available (e.g. 10.2-luna-baroque-pearl-choker.zip)
                zip_name = getattr(file_obj, "name", "") or ""
                zip_base = os.path.splitext(os.path.basename(zip_name))[0].lower()
                cleaned_zip_name = re.sub(r"^\d+(\.\d+)?[-_ ]*", "", zip_base)

                for img_name in image_files:
                    base_name = os.path.basename(img_name)
                    name_without_ext = os.path.splitext(base_name)[0]
                    clean_path = img_name.lower().replace("\\", "/")
                    dir_name = os.path.basename(os.path.dirname(clean_path))
                    cleaned_dir = re.sub(r"^\d+(\.\d+)?[-_ ]*", "", dir_name)
                    if not cleaned_dir and cleaned_zip_name:
                        cleaned_dir = cleaned_zip_name

                    full_search = f"{zip_base}/{clean_path}" if zip_base else clean_path

                    # Match by product slug across folder name, full path, or base name
                    matched_prod = None
                    matched_color = ""

                    # 1. Direct match on cleaned directory name (e.g. products/celeste-crossbody/...)
                    if cleaned_dir and cleaned_dir in products:
                        matched_prod = products[cleaned_dir]

                    # 2. Search all existing product slugs in full relative path
                    if not matched_prod:
                        for slug, prod in products.items():
                            if slug == cleaned_dir or slug in clean_path or slug in full_search or slug.replace("the-", "") in full_search:
                                matched_prod = prod
                                break

                    # 3. Match by product display name
                    if not matched_prod:
                        for slug, prod in products.items():
                            if prod.name.lower() in clean_path or prod.name.lower() in full_search:
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

    # Read rows from Excel or CSV
    rows_data = []
    if is_excel:
        try:
            wb = openpyxl.load_workbook(file_obj, data_only=True)
            ws = wb.active
            header_keys = [str(cell.value or "").strip().lower() for cell in ws[1]]
            for row_num, row_cells in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
                if not any(row_cells):
                    continue
                row_dict = {}
                for idx, val in enumerate(row_cells):
                    if idx < len(header_keys) and header_keys[idx]:
                        row_dict[header_keys[idx]] = "" if val is None else str(val).strip()
                rows_data.append((row_num, row_dict))
        except Exception as e:
            result["errors"].append({"row": 0, "column": "File", "message": f"Failed to parse Excel file: {str(e)}"})
            return result
    else:
        # CSV parsing
        try:
            content = file_obj.read()
            if isinstance(content, bytes):
                content = content.decode("utf-8-sig", errors="replace")
            reader = csv.DictReader(io.StringIO(content))
            for row_num, row in enumerate(reader, start=2):
                if not any(row.values()):
                    continue
                cleaned_row = {k.strip().lower(): str(v or "").strip() for k, v in row.items() if k}
                rows_data.append((row_num, cleaned_row))
        except Exception as e:
            result["errors"].append({"row": 0, "column": "File", "message": f"Failed to parse CSV file: {str(e)}"})
            return result

    result["total_rows"] = len(rows_data)

    # Cache categories for validation
    categories_by_slug = {c.slug.lower(): c for c in Category.objects.all()}
    categories_by_name = {c.name.lower(): c for c in Category.objects.all()}

    for row_num, r in rows_data:
        row_has_error = False
        name = r.get("name") or r.get("product name")
        price_val = r.get("price") or r.get("price (inr ₹)")
        cat_val = r.get("category") or r.get("category (slug or name)")

        # Validate Name
        if not name:
            result["errors"].append({"row": row_num, "column": "name", "message": "Product name is required."})
            row_has_error = True

        # Validate Price
        price_int = 0
        if not price_val:
            result["errors"].append({"row": row_num, "column": "price", "message": "Price is required."})
            row_has_error = True
        else:
            try:
                # Remove commas, currency symbols
                clean_price = price_val.replace("₹", "").replace(",", "").replace(" ", "").split(".")[0]
                price_int = int(clean_price)
                if price_int < 0:
                    raise ValueError()
            except ValueError:
                result["errors"].append({"row": row_num, "column": "price", "message": f"Invalid price format '{price_val}'. Must be a whole positive number in INR."})
                row_has_error = True

        # Validate Category
        matched_category = None
        if cat_val:
            clean_cat = cat_val.strip().lower()
            matched_category = categories_by_slug.get(clean_cat) or categories_by_name.get(clean_cat)
            if not matched_category:
                if auto_create_categories and not is_dry_run:
                    matched_category = Category.objects.create(
                        name=cat_val.strip().title(),
                        slug=slugify(cat_val.strip()),
                        enabled=True,
                    )
                    categories_by_slug[matched_category.slug] = matched_category
                elif not auto_create_categories:
                    result["errors"].append({
                        "row": row_num,
                        "column": "category",
                        "message": f"Category '{cat_val}' does not exist in store. (Enable 'Auto-create categories' or use an existing category).",
                    })
                    row_has_error = True
        else:
            result["errors"].append({"row": row_num, "column": "category", "message": "Category is required."})
            row_has_error = True

        # Parse sizes
        sizes_raw = r.get("sizes") or r.get("sizes (comma-separated)") or ""
        if "," in sizes_raw:
            sizes_list = [s.strip() for s in sizes_raw.split(",") if s.strip()]
        elif sizes_raw:
            sizes_list = [sizes_raw.strip()]
        else:
            sizes_list = ["XS", "S", "M", "L"]

        # Parse slug
        slug = r.get("slug") or r.get("product slug (unique id)")
        if not slug and name:
            slug = slugify(name)

        # Parse in_stock
        stock_val = r.get("in_stock") or r.get("in stock (true/false)") or "true"
        in_stock = stock_val.lower() in ("true", "1", "yes", "in stock")

        # Parse original_price
        orig_price = None
        orig_val = r.get("original_price") or r.get("original price (inr ₹)")
        if orig_val:
            try:
                orig_price = int(orig_val.replace("₹", "").replace(",", "").split(".")[0])
            except ValueError:
                orig_price = None

        if row_has_error:
            result["error_count"] += 1
            status_label = "Error"
        else:
            result["valid_count"] += 1
            status_label = "Valid"

        preview_entry = {
            "row": row_num,
            "status": status_label,
            "name": name or "(blank)",
            "slug": slug or "(auto)",
            "category": cat_val,
            "price": price_int,
            "color": r.get("color") or r.get("primary color") or "Oatmeal",
            "in_stock": in_stock,
        }
        result["preview_rows"].append(preview_entry)

        # If not dry run and no errors, commit to SQLite
        if not is_dry_run and not row_has_error:
            prod_defaults = {
                "name": name,
                "category": matched_category,
                "department": r.get("department") or r.get("department heading") or (matched_category.name if matched_category else "Women"),
                "price": price_int,
                "original_price": orig_price,
                "sale_note": r.get("sale_note") or "",
                "currency": r.get("currency") or "INR",
                "color": r.get("color") or r.get("primary color") or "Oatmeal",
                "color_hex": r.get("color_hex") or "#D8CFC6",
                "sizes": sizes_list,
                "image": r.get("image") or "/images/cardigan.png",
                "badge": r.get("badge") or "",
                "in_stock": in_stock,
                "fabric": r.get("fabric") or "",
                "care": r.get("care") or "",
                "description": r.get("description") or f"Luxurious {name} crafted for effortless elegance.",
            }

            prod, created = Product.objects.update_or_create(slug=slug, defaults=prod_defaults)
            if created:
                result["created_count"] += 1
            else:
                result["updated_count"] += 1

    if not is_dry_run:
        cache.clear()

    return result
