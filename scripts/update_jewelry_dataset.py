import os, sys

# 1. Update catalog.ts for Jewellery subcategories
path_catalog = 'artifacts/rynas-wardrobe/src/config/catalog.ts'
with open(path_catalog, 'r', encoding='utf-8') as f:
    cat_content = f.read()

target_jewel_sub = '''    subcategories: [
      { id: "earrings", name: "Drop & stud earrings", slug: "earrings" },
      { id: "necklaces", name: "Fine chains & pendants", slug: "necklaces" },
      { id: "rings", name: "Brushed gold rings", slug: "rings" },
    ],'''

replacement_jewel_sub = '''    subcategories: [
      { id: "bangles", name: "Cuffs & Sculptural Bangles", slug: "bangles" },
      { id: "necklaces", name: "Freshwater Pearls & Chokers", slug: "necklaces" },
      { id: "rings", name: "Sculptural Rings", slug: "rings" },
    ],'''

if target_jewel_sub in cat_content:
    cat_content = cat_content.replace(target_jewel_sub, replacement_jewel_sub)
    with open(path_catalog, 'w', encoding='utf-8') as f:
        f.write(cat_content)
    print('Updated Jewellery subcategories in catalog.ts!')
else:
    print('Jewellery subcategories target not found in catalog.ts')


# 2. Update SUBCAT_KEYWORDS in CategoryView.tsx
path_catview = 'artifacts/rynas-wardrobe/src/components/catalog/CategoryView.tsx'
with open(path_catview, 'r', encoding='utf-8') as f:
    cv_content = f.read()

target_keywords = '''  earrings: ["earring"],
  necklaces: ["necklace", "choker", "pendant", "chain"],
  rings: ["ring"],'''

replacement_keywords = '''  bangles: ["bangle", "cuff", "bracelet"],
  necklaces: ["necklace", "choker", "pendant", "chain"],
  rings: ["ring"],
  earrings: ["earring"],'''

if target_keywords in cv_content:
    cv_content = cv_content.replace(target_keywords, replacement_keywords)
    with open(path_catview, 'w', encoding='utf-8') as f:
        f.write(cv_content)
    print('Updated SUBCAT_KEYWORDS in CategoryView.tsx!')


# 3. Update products.ts for the 3 jewelry items with full 6 dataset images
path_products = 'artifacts/rynas-wardrobe/src/lib/products.ts'
with open(path_products, 'r', encoding='utf-8') as f:
    prod_content = f.read()

# Aurelia Bangle
target_aurelia = '''    "image": "/images/products/aurelia-ribbed-gold-bangle/front.jpg",
    "description": "Sculptural ribbed bangle hand-cast in recycled brass with heavy 18k gold vermeil finish.",'''

replacement_aurelia = '''    "image": "/images/products/aurelia-ribbed-gold-bangle/front.jpg",
    "secondaryImage": "/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg",
    "galleryImages": [
      "/images/products/aurelia-ribbed-gold-bangle/front.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/side.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/detail.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/back.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/walking.jpg"
    ],
    "description": "Sculptural ribbed bangle hand-cast in recycled brass with heavy 18k gold vermeil finish.",'''

if target_aurelia in prod_content:
    prod_content = prod_content.replace(target_aurelia, replacement_aurelia)
    print('Added all 6 images to Aurelia Bangle in products.ts!')

# Luna Choker
target_luna = '''    "image": "/images/products/luna-baroque-pearl-choker/front.jpg",
    "description": "Individually knotted hand-selected organic baroque freshwater pearls with 18k gold toggle clasp.",'''

replacement_luna = '''    "image": "/images/products/luna-baroque-pearl-choker/front.jpg",
    "secondaryImage": "/images/products/luna-baroque-pearl-choker/three-quarter.jpg",
    "galleryImages": [
      "/images/products/luna-baroque-pearl-choker/front.jpg",
      "/images/products/luna-baroque-pearl-choker/three-quarter.jpg",
      "/images/products/luna-baroque-pearl-choker/side.jpg",
      "/images/products/luna-baroque-pearl-choker/detail.jpg",
      "/images/products/luna-baroque-pearl-choker/back.jpg",
      "/images/products/luna-baroque-pearl-choker/walking.jpg"
    ],
    "description": "Individually knotted hand-selected organic baroque freshwater pearls with 18k gold toggle clasp.",'''

if target_luna in prod_content:
    prod_content = prod_content.replace(target_luna, replacement_luna)
    print('Added all 6 images to Luna Choker in products.ts!')

# Pave Ring
target_pave = '''    "image": "/images/products/pave-dome-statement-ring/front.jpg",
    "description": "Smooth sculptural croissant dome ring with brushed satin finish and comfort-fit interior curve.",'''

replacement_pave = '''    "image": "/images/products/pave-dome-statement-ring/front.jpg",
    "secondaryImage": "/images/products/pave-dome-statement-ring/three-quarter.jpg",
    "galleryImages": [
      "/images/products/pave-dome-statement-ring/front.jpg",
      "/images/products/pave-dome-statement-ring/three-quarter.jpg",
      "/images/products/pave-dome-statement-ring/side.jpg",
      "/images/products/pave-dome-statement-ring/detail.jpg",
      "/images/products/pave-dome-statement-ring/back.jpg",
      "/images/products/pave-dome-statement-ring/walking.jpg"
    ],
    "description": "Smooth sculptural croissant dome ring with brushed satin finish and comfort-fit interior curve.",'''

if target_pave in prod_content:
    prod_content = prod_content.replace(target_pave, replacement_pave)
    print('Added all 6 images to Pave Ring in products.ts!')

# Unpublish petal-drop-earrings (which had only 1 photo)
prod_content = prod_content.replace(
    '"slug": "petal-drop-earrings",\n    "name": "Petal drop earrings",\n    "category": "jewellery",',
    '"slug": "petal-drop-earrings",\n    "name": "Petal drop earrings",\n    "category": "archived",'
)

with open(path_products, 'w', encoding='utf-8') as f:
    f.write(prod_content)
print('Updated products.ts with all jewelry dataset images!')


# 4. Update Django SQLite DB
sys.path.insert(0, 'backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()
from store.models import Product, ProductImage
from django.core.cache import cache

# Update Aurelia
p1 = Product.objects.filter(slug='aurelia-ribbed-gold-bangle').first()
if p1:
    p1.image = '/images/products/aurelia-ribbed-gold-bangle/front.jpg'
    p1.gallery_images = [
        '/images/products/aurelia-ribbed-gold-bangle/front.jpg',
        '/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg',
        '/images/products/aurelia-ribbed-gold-bangle/side.jpg',
        '/images/products/aurelia-ribbed-gold-bangle/detail.jpg',
        '/images/products/aurelia-ribbed-gold-bangle/back.jpg',
        '/images/products/aurelia-ribbed-gold-bangle/walking.jpg'
    ]
    p1.save()
    p1.images.all().delete()
    for idx, (ang, img) in enumerate([
        ('front', '/images/products/aurelia-ribbed-gold-bangle/front.jpg'),
        ('three_quarter', '/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg'),
        ('side', '/images/products/aurelia-ribbed-gold-bangle/side.jpg'),
        ('detail', '/images/products/aurelia-ribbed-gold-bangle/detail.jpg'),
        ('back', '/images/products/aurelia-ribbed-gold-bangle/back.jpg'),
        ('model', '/images/products/aurelia-ribbed-gold-bangle/walking.jpg'),
    ]):
        ProductImage.objects.create(product=p1, image_url=img, alt_text=f'Aurelia Bangle - {ang}', is_primary=(idx==0), position=idx, angle=ang)
    print('Updated Django DB for Aurelia Bangle with all 6 images!')

# Update Luna Choker
p2 = Product.objects.filter(slug='luna-baroque-pearl-choker').first()
if p2:
    p2.image = '/images/products/luna-baroque-pearl-choker/front.jpg'
    p2.gallery_images = [
        '/images/products/luna-baroque-pearl-choker/front.jpg',
        '/images/products/luna-baroque-pearl-choker/three-quarter.jpg',
        '/images/products/luna-baroque-pearl-choker/side.jpg',
        '/images/products/luna-baroque-pearl-choker/detail.jpg',
        '/images/products/luna-baroque-pearl-choker/back.jpg',
        '/images/products/luna-baroque-pearl-choker/walking.jpg'
    ]
    p2.save()
    p2.images.all().delete()
    for idx, (ang, img) in enumerate([
        ('front', '/images/products/luna-baroque-pearl-choker/front.jpg'),
        ('three_quarter', '/images/products/luna-baroque-pearl-choker/three-quarter.jpg'),
        ('side', '/images/products/luna-baroque-pearl-choker/side.jpg'),
        ('detail', '/images/products/luna-baroque-pearl-choker/detail.jpg'),
        ('back', '/images/products/luna-baroque-pearl-choker/back.jpg'),
        ('model', '/images/products/luna-baroque-pearl-choker/walking.jpg'),
    ]):
        ProductImage.objects.create(product=p2, image_url=img, alt_text=f'Luna Choker - {ang}', is_primary=(idx==0), position=idx, angle=ang)
    print('Updated Django DB for Luna Choker with all 6 images!')

# Update Pave Dome Ring
p3 = Product.objects.filter(slug='pave-dome-statement-ring').first()
if p3:
    p3.image = '/images/products/pave-dome-statement-ring/front.jpg'
    p3.gallery_images = [
        '/images/products/pave-dome-statement-ring/front.jpg',
        '/images/products/pave-dome-statement-ring/three-quarter.jpg',
        '/images/products/pave-dome-statement-ring/side.jpg',
        '/images/products/pave-dome-statement-ring/detail.jpg',
        '/images/products/pave-dome-statement-ring/back.jpg',
        '/images/products/pave-dome-statement-ring/walking.jpg'
    ]
    p3.save()
    p3.images.all().delete()
    for idx, (ang, img) in enumerate([
        ('front', '/images/products/pave-dome-statement-ring/front.jpg'),
        ('three_quarter', '/images/products/pave-dome-statement-ring/three-quarter.jpg'),
        ('side', '/images/products/pave-dome-statement-ring/side.jpg'),
        ('detail', '/images/products/pave-dome-statement-ring/detail.jpg'),
        ('back', '/images/products/pave-dome-statement-ring/back.jpg'),
        ('model', '/images/products/pave-dome-statement-ring/walking.jpg'),
    ]):
        ProductImage.objects.create(product=p3, image_url=img, alt_text=f'Pave Ring - {ang}', is_primary=(idx==0), position=idx, angle=ang)
    print('Updated Django DB for Pave Ring with all 6 images!')

# Archive petal-drop-earrings in DB so it doesn't display with only 1 photo
Product.objects.filter(slug='petal-drop-earrings').update(is_active=False)
print('Archived petal-drop-earrings in DB!')

cache.clear()
print('Cleared Django cache!')

