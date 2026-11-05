import os

path = 'artifacts/rynas-wardrobe/src/lib/products.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '"image": "/images/garden-dress-garden.jpg",'
replacement = '''"image": "/images/products/primrose-sundress/front.jpg",
    "secondaryImage": "/images/products/primrose-sundress/detail.jpg",
    "galleryImages": [
      "/images/products/primrose-sundress/front.jpg",
      "/images/products/primrose-sundress/detail.jpg",
      "/images/products/primrose-sundress/movement.jpg"
    ],'''

if target in content:
    new_content = content.replace(target, replacement, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Successfully updated products.ts for primrose sundress')
else:
    print('Target not found in products.ts')

