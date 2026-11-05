p = 'artifacts/rynas-wardrobe/src/components/layout/Footer.tsx'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''  // When viewing staff portal or logged in as staff, render strictly the Staff Console Footer
  if (pathname.startsWith("/staff") || isStaff) {
    return (
      <footer className="w-full bg-[#1F1B18] border-t border-[#3D352F] text-[#A0988E] py-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[#E0D8D0] font-medium">Ryna&apos;s Wardrobe Atelier Management Portal</span>
            <span className="text-[#5C534D]">|</span>
            <span className="text-[#D8CFC6]">Staff RBAC Operations Console</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#A0988E]">
            <span>Django REST API v5.1 Connected</span>
            <span>·</span>
            <span>Internal Atelier Operations</span>
            <span>·</span>
            <span>Authorized Personnel Only</span>
          </div>
        </div>
      </footer>
    );
  }'''

replacement = '''  // When viewing staff portal or logged in as staff, render strictly the Staff Console Footer - Light Luxury Palette
  if (pathname.startsWith("/staff") || isStaff) {
    return (
      <footer className="w-full bg-[#EDE7DE] border-t border-[#D8CFC6] text-[#69615B] py-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[#302B28] font-medium">Ryna&apos;s Wardrobe Atelier Management Portal</span>
            <span className="text-[#C2B7AC]">|</span>
            <span className="text-[#713A48] font-medium">Staff RBAC Operations Console</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#69615B]">
            <span>Django REST API v5.1 Connected</span>
            <span>·</span>
            <span>Internal Atelier Operations</span>
            <span>·</span>
            <span>Authorized Personnel Only</span>
          </div>
        </div>
      </footer>
    );
  }'''

assert target in text, 'target not found in Footer.tsx'
new_text = text.replace(target, replacement, 1)
with open(p, 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated Footer.tsx to light luxury theme!')

