import re

path = 'artifacts/rynas-wardrobe/next.config.mjs'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"10.130.250.129"', '"10.114.247.129",\n    "10.130.250.129"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated next.config.mjs successfully")

