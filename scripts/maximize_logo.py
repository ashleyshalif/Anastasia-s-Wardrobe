path = 'artifacts/rynas-wardrobe/src/components/layout/Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''        {/* Center Column: Official Brand Logo - Discreet & Refined */}
        <div className="flex items-center justify-center aw-header-center">
          <Link href="/" className="inline-flex items-center justify-center focus:outline-none group" aria-label="Ryna\'s Wardrobe Home">
            {/* Desktop Logo - Minimalist & Refined */}
            <div className="hidden lg:flex items-center gap-2 aw-desktop-logo">
              <Image
                src="/images/logo.png"
                alt="Ryna\'s Wardrobe"
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
                alt="Ryna\'s Wardrobe"
                width={90}
                height={26}
                priority
                style={{ height: "24px", width: "auto", maxWidth: "100px", maxHeight: "24px", objectFit: "contain", display: "block", opacity: 0.88 }}
              />
            </div>
          </Link>
        </div>'''

replacement = '''        {/* Center Column: Official Brand Logo - Clear, Refined & Prominent */}
        <div className="flex items-center justify-center aw-header-center">
          <Link href="/" className="inline-flex items-center justify-center focus:outline-none group py-1" aria-label="Ryna\'s Wardrobe Home">
            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center justify-center aw-desktop-logo">
              <Image
                src="/images/logo.png"
                alt="Ryna\'s Wardrobe"
                width={260}
                height={72}
                priority
                style={{ height: "64px", width: "auto", maxWidth: "260px", maxHeight: "68px", objectFit: "contain", display: "block" }}
              />
            </div>
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center aw-mobile-logo">
              <Image
                src="/images/logo.png"
                alt="Ryna\'s Wardrobe"
                width={180}
                height={48}
                priority
                style={{ height: "44px", width: "auto", maxWidth: "180px", maxHeight: "48px", objectFit: "contain", display: "block" }}
              />
            </div>
          </Link>
        </div>'''

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Header logo maximized to clear, visible proportions!")
else:
    print("WARNING: target not matched in Header.tsx")

