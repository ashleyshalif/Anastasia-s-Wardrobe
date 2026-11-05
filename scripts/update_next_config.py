with open('artifacts/rynas-wardrobe/next.config.mjs', 'r', encoding='utf-8') as f:
    content = f.read()

target = '"localhost",'
replacement = '"localhost",\n    "192.168.29.239",\n    "192.168.*",'
if target in content:
    new_content = content.replace(target, replacement, 1)
    with open('artifacts/rynas-wardrobe/next.config.mjs', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Updated next.config.mjs successfully')
else:
    print('Target not found')

