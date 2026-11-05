import os
import sys
import django

# Setup Django environment
sys.path.insert(0, 'backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from store.models import Product

# Precise mapping of distinct product images from the newly extracted REYA dataset
DISTINCT_MAPPINGS = {
    # 1. Aurelia Ribbed Gold Bangle
    'aurelia-ribbed-gold-bangle': {
        'image': '/images/products/aurelia-ribbed-gold-bangle/front.jpg',
        'secondaryImage': '/images/products/aurelia-ribbed-gold-bangle/side.jpg',
        'galleryImages': [
            '/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg',
            '/images/products/aurelia-ribbed-gold-bangle/detail.jpg',
            '/images/products/aurelia-ribbed-gold-bangle/back.jpg',
            '/images/products/aurelia-ribbed-gold-bangle/walking.jpg',
        ],
    },
    # 2. Luna Baroque Pearl Choker
    'luna-baroque-pearl-choker': {
        'image': '/images/products/luna-baroque-pearl-choker/front.jpg',
        'secondaryImage': '/images/products/luna-baroque-pearl-choker/side.jpg',
        'galleryImages': [
            '/images/products/luna-baroque-pearl-choker/three-quarter.jpg',
            '/images/products/luna-baroque-pearl-choker/detail.jpg',
            '/images/products/luna-baroque-pearl-choker/back.jpg',
            '/images/products/luna-baroque-pearl-choker/walking.jpg',
        ],
    },
    # 3. Pavé Dome Statement Ring
    'pave-dome-statement-ring': {
        'image': '/images/products/pave-dome-statement-ring/front.jpg',
        'secondaryImage': '/images/products/pave-dome-statement-ring/side.jpg',
        'galleryImages': [
            '/images/products/pave-dome-statement-ring/three-quarter.jpg',
            '/images/products/pave-dome-statement-ring/detail.jpg',
            '/images/products/pave-dome-statement-ring/back.jpg',
            '/images/products/pave-dome-statement-ring/walking.jpg',
        ],
    },
    # 4. Celeste Structured Leather Crossbody
    'celeste-structured-leather-crossbody': {
        'image': '/images/products/celeste-structured-leather-crossbody/front.jpg',
        'secondaryImage': '/images/products/celeste-structured-leather-crossbody/side.jpg',
        'galleryImages': [
            '/images/products/celeste-structured-leather-crossbody/three-quarter.jpg',
            '/images/products/celeste-structured-leather-crossbody/detail.jpg',
            '/images/products/celeste-structured-leather-crossbody/back.jpg',
            '/images/products/celeste-structured-leather-crossbody/walking.jpg',
        ],
    },
    # 5. Cloud Knit Cashmere Scarf
    'cloud-knit-scarf': {
        'image': '/images/products/cloud-knit-scarf/front.jpg',
        'secondaryImage': '/images/products/cloud-knit-scarf/side.jpg',
        'galleryImages': [
            '/images/products/cloud-knit-scarf/three-quarter.jpg',
            '/images/products/cloud-knit-scarf/detail.jpg',
            '/images/products/cloud-knit-scarf/back.jpg',
            '/images/products/cloud-knit-scarf/walking.jpg',
        ],
    },
    # 6. Astrid Cable-Knit Sweater
    'astrid-cable-knit-sweater': {
        'image': '/images/products/astrid-cable-knit-sweater/front.jpg',
        'secondaryImage': '/images/products/astrid-cable-knit-sweater/side.jpg',
        'galleryImages': [
            '/images/products/astrid-cable-knit-sweater/three-quarter.jpg',
            '/images/products/astrid-cable-knit-sweater/detail.jpg',
            '/images/products/astrid-cable-knit-sweater/back.jpg',
            '/images/products/astrid-cable-knit-sweater/walking.jpg',
        ],
    },
    # 7. Freya Pleated Merino Skirt
    'freya-pleated-merino-skirt': {
        'image': '/images/products/freya-pleated-merino-skirt/front.jpg',
        'secondaryImage': '/images/products/freya-pleated-merino-skirt/side.jpg',
        'galleryImages': [
            '/images/products/freya-pleated-merino-skirt/three-quarter.jpg',
            '/images/products/freya-pleated-merino-skirt/detail.jpg',
            '/images/products/freya-pleated-merino-skirt/back.jpg',
            '/images/products/freya-pleated-merino-skirt/walking.jpg',
        ],
    },
    # 8. Night Market Silk Satin Blouse
    'night-market-silk-blouse': {
        'image': '/images/products/night-market-silk-blouse/front.jpg',
        'secondaryImage': '/images/products/night-market-silk-blouse/side.jpg',
        'galleryImages': [
            '/images/products/night-market-silk-blouse/three-quarter.jpg',
            '/images/products/night-market-silk-blouse/detail.jpg',
            '/images/products/night-market-silk-blouse/back.jpg',
            '/images/products/night-market-silk-blouse/walking.jpg',
        ],
    },
    # 9. Sunday Wool Cardigan
    'sunday-wool-cardigan': {
        'image': '/images/products/sunday-wool-cardigan/front.jpg',
        'secondaryImage': '/images/products/sunday-wool-cardigan/side.jpg',
        'galleryImages': [
            '/images/products/sunday-wool-cardigan/three-quarter.jpg',
            '/images/products/sunday-wool-cardigan/detail.jpg',
            '/images/products/sunday-wool-cardigan/back.jpg',
            '/images/products/sunday-wool-cardigan/walking.jpg',
        ],
    },
    # 10. Elodie Corduroy Co-ord
    'elodie-corduroy-co-ord': {
        'image': '/images/products/elodie-corduroy-co-ord/front.jpg',
        'secondaryImage': '/images/products/elodie-corduroy-co-ord/side.jpg',
        'galleryImages': [
            '/images/products/elodie-corduroy-co-ord/three-quarter.jpg',
            '/images/products/elodie-corduroy-co-ord/detail.jpg',
            '/images/products/elodie-corduroy-co-ord/back.jpg',
            '/images/products/elodie-corduroy-co-ord/walking.jpg',
        ],
    },
    # 11. Primrose Smocked Linen Sundress
    'primrose-smocked-linen-sundress': {
        'image': '/images/garden-dress-garden.jpg',
        'secondaryImage': '/images/garden-dress-side.jpg',
        'galleryImages': ['/images/garden-dress-back.jpg', '/images/garden-dress-detail.jpg'],
    },
    # 12. Clementine Merino Knit Cardigan
    'clementine-merino-knit-cardigan': {
        'image': '/images/cardigan-model.jpg',
        'secondaryImage': '/images/cardigan-detail.jpg',
        'galleryImages': ['/images/cardigan.png'],
    },
    # 13. Aura Pleated Metallic Midi Skirt
    'aura-pleated-metallic-skirt': {
        'image': '/images/products/freya-pleated-merino-skirt/three-quarter.jpg',
        'secondaryImage': '/images/products/freya-pleated-merino-skirt/side.jpg',
        'galleryImages': ['/images/products/freya-pleated-merino-skirt/detail.jpg'],
    },
    # 14. Midnight Velvet Slip Dress
    'midnight-velvet-slip-dress': {
        'image': '/images/wrap-dress-model.jpg',
        'secondaryImage': '/images/wrap-dress.png',
        'galleryImages': ['/images/editorial-everyday.png'],
    },
    # 15. Petal Drop Pearl Earrings (Night Market)
    'petal-drop-pearl-earrings-night-market': {
        'image': '/images/products/luna-baroque-pearl-choker/detail.jpg',
        'secondaryImage': '/images/products/luna-baroque-pearl-choker/three-quarter.jpg',
        'galleryImages': ['/images/petal-drop-earrings.jpg'],
    },
    # 16. Keepsake Velvet Evening Pouch (Night Market)
    'keepsake-velvet-evening-pouch-night-market': {
        'image': '/images/products/celeste-structured-leather-crossbody/detail.jpg',
        'secondaryImage': '/images/keepsake-velvet-pouch.jpg',
        'galleryImages': ['/images/products/celeste-structured-leather-crossbody/three-quarter.jpg'],
    },
}

updated_count = 0
for slug, data in DISTINCT_MAPPINGS.items():
    p = Product.objects.filter(slug=slug).first()
    if p:
        p.image = data['image']
        p.secondary_image = data.get('secondaryImage', '')
        p.gallery_images = data.get('galleryImages', [])
        p.save()
        updated_count += 1
        print(f"Updated Django DB for {slug} -> {data['image']}")
    else:
        print(f"Product slug {slug} not found in Django DB")

print(f"Total products updated in Django DB: {updated_count}")

# Verify uniqueness now
print("\nVerifying uniqueness in Django DB:")
prods = Product.objects.all()
img_map = {}
for p in prods:
    img = p.image if p.image else 'NO_IMAGE'
    img_map.setdefault(img, []).append(p.slug)

dupes = {img: slugs for img, slugs in img_map.items() if len(slugs) > 1}
if dupes:
    print(f"Remaining duplicates in Django: {len(dupes)}")
    for img, slugs in dupes.items():
        print(f"  {img} -> {slugs}")
else:
    print("SUCCESS: 100% of products in Django DB have unique, non-duplicate primary images!")

