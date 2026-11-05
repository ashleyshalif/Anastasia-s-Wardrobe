import os

bulk_path = os.path.abspath('backend/store/bulk.py')
with open(bulk_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = '                products = {p.slug.lower(): p for p in Product.objects.all()}\n                default_category = Category.objects.filter(slug="jewellery").first() or Category.objects.first()\n\n                for img_name in image_files:'

replacement = '''                products = {p.slug.lower(): p for p in Product.objects.all()}
                default_category = Category.objects.filter(slug="jewellery").first() or Category.objects.first()

                # Extract zip archive base name if available (e.g. 10.2-luna-baroque-pearl-choker.zip)
                zip_name = getattr(file_obj, "name", "") or ""
                zip_base = os.path.splitext(os.path.basename(zip_name))[0].lower()
                cleaned_zip_name = re.sub(r"^\\d+(\\.\\d+)?[-_ ]*", "", zip_base)

                for img_name in image_files:'''

if target in code:
    code = code.replace(target, replacement, 1)
else:
    print('Target 1 not found')

target2 = '                    dir_name = os.path.basename(os.path.dirname(clean_path))\n                    cleaned_dir = re.sub(r"^\\d+(\\.\\d+)?[-_ ]*", "", dir_name)'

replacement2 = '''                    dir_name = os.path.basename(os.path.dirname(clean_path))
                    cleaned_dir = re.sub(r"^\\d+(\\.\\d+)?[-_ ]*", "", dir_name)
                    if not cleaned_dir and cleaned_zip_name:
                        cleaned_dir = cleaned_zip_name

                    full_search = f"{zip_base}/{clean_path}" if zip_base else clean_path'''

if target2 in code:
    code = code.replace(target2, replacement2, 1)
else:
    print('Target 2 not found')

target3 = 'if slug == cleaned_dir or slug in clean_path or slug.replace("the-", "") in clean_path:'
replacement3 = 'if slug == cleaned_dir or slug in clean_path or slug in full_search or slug.replace("the-", "") in full_search:'

if target3 in code:
    code = code.replace(target3, replacement3, 1)
else:
    print('Target 3 not found')

target4 = 'if prod.name.lower() in clean_path:'
replacement4 = 'if prod.name.lower() in clean_path or prod.name.lower() in full_search:'

if target4 in code:
    code = code.replace(target4, replacement4, 1)
else:
    print('Target 4 not found')

with open(bulk_path, 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated bulk.py successfully!')

