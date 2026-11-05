import sys

path = 'artifacts/rynas-wardrobe/src/components/layout/Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

old_logo = '''        {/* Center Column: Official Brand Logo */}
        <div className="flex items-center justify-center aw-header-center">
          <Link href="/" className="inline-flex items-center justify-center focus:outline-none" aria-label="Ryna\'s Wardrobe Home">
            {/* Desktop Logo */}
            <div className="hidden lg:block aw-desktop-logo max-w-[360px] max-h-[140px] overflow-visible">
              <Image
                src="/images/logo.png"
                alt="Ryna\'s Wardrobe"
                width={360}
                height={130}
                priority
                style={{ height: "125px", width: "auto", maxWidth: "360px", maxHeight: "125px", objectFit: "contain", display: "block" }}
              />
            </div>
            {/* Mobile Logo */}
            <div className="block lg:hidden aw-mobile-logo max-w-[220px] max-h-[80px] overflow-visible">
              <Image
                src="/images/logo.png"
                alt="Ryna\'s Wardrobe"
                width={220}
                height={75}
                priority
                style={{ height: "68px", width: "auto", maxWidth: "220px", maxHeight: "68px", objectFit: "contain", display: "block" }}
              />
            </div>
          </Link>
        </div>'''

new_logo = '''        {/* Center Column: Official Brand Logo - Discreet & Refined */}
        <div className="flex items-center justify-center aw-header-center">
          <Link href="/" className="inline-flex items-center justify-center focus:outline-none group" aria-label="Anastasia\'s Wardrobe Home">
            {/* Desktop Logo - Minimalist & Refined */}
            <div className="hidden lg:flex items-center gap-2 aw-desktop-logo">
              <Image
                src="/images/logo.png"
                alt="Anastasia\'s Wardrobe"
                width={120}
                height={36}
                priority
                style={{ height: "34px", width: "auto", maxWidth: "130px", maxHeight: "34px", objectFit: "contain", display: "block", opacity: 0.88 }}
              />
            </div>
            {/* Mobile Logo - Understated */}
            <div className="flex lg:hidden items-center aw-mobile-logo">
              <Image
                src="/images/logo.png"
                alt="Anastasia\'s Wardrobe"
                width={90}
                height={26}
                priority
                style={{ height: "24px", width: "auto", maxWidth: "100px", maxHeight: "24px", objectFit: "contain", display: "block", opacity: 0.88 }}
              />
            </div>
          </Link>
        </div>'''

text_norm = text.replace('\r\n', '\n')
old_norm = old_logo.replace('\r\n', '\n')
new_norm = new_logo.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_norm)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Header logo updated successfully!")
else:
    print("Could not find old logo block in Header.tsx")

