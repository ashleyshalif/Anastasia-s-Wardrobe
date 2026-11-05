with open('artifacts/rynas-wardrobe/src/lib/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
items = text.split('{')
for item in items:
    if any(k in item for k in ['aurelia-ribbed-gold-bangle', 'luna-baroque-pearl-choker', 'pave-dome-statement-ring', 'celeste-structured-leather-crossbody']):
        lines = [line.strip() for line in item.splitlines() if any(line.strip().startswith(x) for x in ['slug:', 'name:', 'image:', 'images:', 'category:'])]
        print('---')
        for l in lines:
            print(l)

