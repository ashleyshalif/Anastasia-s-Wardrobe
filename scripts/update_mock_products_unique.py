import json
import re
import sys
sys.path.insert(0, '.')

path = 'artifacts/rynas-wardrobe/src/lib/products.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

from scripts.eliminate_duplicate_photos import DISTINCT_MAPPINGS

# For each product slug in DISTINCT_MAPPINGS, update image and secondaryImage in products.ts
updated = 0
for slug, data in DISTINCT_MAPPINGS.items():
    # Find block for slug
    pattern = rf'(\"slug\":\s*\"{slug}\"[\s\S]*?\"image\":\s*\")([^\"]+)(\"[\s\S]*?\"secondaryImage\":\s*\")([^\"]*)(\")'
    m = re.search(pattern, text)
    if m:
        new_block = m.group(1) + data['image'] + m.group(3) + data.get('secondaryImage', '') + m.group(5)
        text = text[:m.start()] + new_block + text[m.end():]
        updated += 1
        print(f"Updated mock product for {slug}")
    else:
        # Try finding just image if secondaryImage not adjacent
        p2 = rf'(\"slug\":\s*\"{slug}\"[\s\S]*?\"image\":\s*\")([^\"]+)(\")'
        m2 = re.search(p2, text)
        if m2:
            new_block = m2.group(1) + data['image'] + m2.group(3)
            text = text[:m2.start()] + new_block + text[m2.end():]
            updated += 1
            print(f"Updated mock product image for {slug}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Total mock products updated: {updated}")
