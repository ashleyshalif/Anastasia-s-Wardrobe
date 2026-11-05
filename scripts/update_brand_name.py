path = 'artifacts/rynas-wardrobe/src/components/layout/Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("alt=\"Anastasia's Wardrobe\"", "alt=\"Ryna's Wardrobe\"")
text = text.replace("aria-label=\"Anastasia's Wardrobe Home\"", "aria-label=\"Ryna's Wardrobe Home\"")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Header.tsx brand name to Ryna's Wardrobe")

path2 = 'artifacts/rynas-wardrobe/src/components/festive/FestiveDiwaliPrivilege.tsx'
with open(path2, 'r', encoding='utf-8') as f:
    text2 = f.read()

text2 = text2.replace("Anastasia's Wardrobe", "Ryna's Wardrobe")
with open(path2, 'w', encoding='utf-8') as f:
    f.write(text2)

print("Updated FestiveDiwaliPrivilege.tsx to Ryna's Wardrobe")
