with open('artifacts/rynas-wardrobe/src/lib/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"category":\s*"([^"]+)"', text)
for m in matches:
    if m[3] in ['jewellery', 'gifts', 'accessories-bags']:
        print(m[1], '|', m[3], '|', m[2])

