import os, sys, django
sys.path.append(os.path.abspath('backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from store.models import Product, ProductImage

for slug in ['aurelia-ribbed-gold-bangle', 'luna-baroque-pearl-choker', 'pave-dome-statement-ring', 'celeste-structured-leather-crossbody']:
    p = Product.objects.filter(slug=slug).first()
    if p:
        imgs = list(ProductImage.objects.filter(product=p).values_list('image', flat=True))
        cat_name = p.category.name if p.category else 'None'
        print(f"{slug} (category={cat_name}): main={p.image}, images_count={len(imgs)}")
        for img in imgs:
            print(f"   {img}")
    else:
        print(f"{slug}: NOT IN DB")
