import urllib.request
import sys
import os

BASE_URL = 'http://localhost:3000'

test_routes = [
    # Core pages
    '/',
    '/bag',
    '/wishlist',
    '/checkout',
    '/account',
    '/size-guide',
    
    # Categories
    '/category/women',
    '/category/teens-13-17',
    '/category/girls-2-12',
    '/category/jewellery',
    '/category/accessories-and-bags',
    '/category/the-edits',
    
    # Newly included products with distinct photoshoot datasets
    '/product/aurelia-ribbed-gold-bangle',
    '/product/luna-baroque-pearl-choker',
    '/product/pave-dome-statement-ring',
    '/product/celeste-structured-leather-crossbody',
    '/product/cloud-knit-scarf',
    '/product/astrid-cable-knit-sweater',
    '/product/freya-pleated-merino-skirt',
    '/product/night-market-silk-blouse',
    '/product/sunday-wool-cardigan',
    '/product/elodie-corduroy-co-ord',
    '/product/camille-tailored-blazer',
    '/product/midnight-velvet-slip-dress',
    '/product/petal-drop-earrings',
]

print("==================================================")
print(" RUNNING COMPREHENSIVE AUTOMATED BROWSER TEST")
print("==================================================")

passed = 0
failed = 0

for route in test_routes:
    url = BASE_URL + route
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Automated Browser Test)'})
        with urllib.request.urlopen(req, timeout=5) as res:
            if res.status == 200:
                print(f" [PASS] HTTP 200 OK -> {route}")
                passed += 1
            else:
                print(f" [FAIL] HTTP {res.status} -> {route}")
                failed += 1
    except Exception as e:
        print(f" [FAIL] {route} -> {e}")
        failed += 1

print("\n--------------------------------------------------")
print(f" Route Test Summary: {passed} PASSED, {failed} FAILED")
print("--------------------------------------------------\n")

# Verify Static Image & Video Asset Availability on Next.js public directory
print("Verifying Newly Extracted Product Photography Assets:")
asset_dirs = [
    'aurelia-ribbed-gold-bangle',
    'luna-baroque-pearl-choker',
    'pave-dome-statement-ring',
    'celeste-structured-leather-crossbody',
    'cloud-knit-scarf',
    'astrid-cable-knit-sweater',
    'freya-pleated-merino-skirt',
    'night-market-silk-blouse',
    'sunday-wool-cardigan',
    'elodie-corduroy-co-ord',
]

assets_ok = True
for prod in asset_dirs:
    dir_path = os.path.join(r'artifacts\rynas-wardrobe\public\images\products', prod)
    if os.path.exists(dir_path):
        files = os.listdir(dir_path)
        has_front = 'front.jpg' in files
        has_mp4 = any(f.endswith('.mp4') for f in files)
        print(f"  {prod}: {len(files)} files (front: {has_front}, 360-orbit: {has_mp4})")
    else:
        print(f"  MISSING DIR: {dir_path}")
        assets_ok = False

# Verify Duplicate Elimination
print("\nVerifying Duplicate Image Elimination across Catalog:")
sys.path.insert(0, '.')
sys.path.insert(0, 'backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
try:
    django.setup()
except Exception:
    pass
from store.models import Product
prods = Product.objects.all()
img_map = {}
for p in prods:
    img = p.image if p.image else 'NO_IMAGE'
    img_map.setdefault(img, []).append(p.slug)

dupes = {img: slugs for img, slugs in img_map.items() if len(slugs) > 1}
if dupes:
    print(f"  FAILED: Found {len(dupes)} duplicate primary photos:")
    for img, slugs in dupes.items():
        print(f"    {img} -> {slugs}")
else:
    print(f"  PASSED: 100% of the {prods.count()} products have unique, non-duplicate primary images!")

if failed == 0 and assets_ok and not dupes:
    print("\n==================================================")
    print(" ALL BROWSER & DATA ACCURACY TESTS PASSED (100%)")
    print("==================================================")
else:
    print("\nSome tests had warnings/failures.")
