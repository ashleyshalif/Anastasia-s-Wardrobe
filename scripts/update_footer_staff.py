import os

path = 'artifacts/rynas-wardrobe/src/components/layout/Footer.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add useStore import
content = content.replace(
    'import { getEnabledCategories } from "@/config/catalog";',
    'import { getEnabledCategories } from "@/config/catalog";\nimport { useStore } from "@/lib/store";',
    1
)

target = '''export function Footer() {
  const pathname = usePathname();
  const enabledCategories = getEnabledCategories();

  if (pathname === "/checkout") {'''

replacement = '''export function Footer() {
  const pathname = usePathname();
  const enabledCategories = getEnabledCategories();
  const { user } = useStore();
  const isStaff = !!(user?.isStaff || user?.isSuperuser || user?.permissions?.isStaff);

  // When viewing staff portal or logged in as staff, render strictly the Staff Console Footer
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
  }

  if (pathname === "/checkout") {'''

content = content.replace(target, replacement, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Footer.tsx updated successfully!')

