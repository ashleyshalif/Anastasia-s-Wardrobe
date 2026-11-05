import os

path = 'artifacts/rynas-wardrobe/src/components/layout/Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add StaffHeader component
staff_header_component = '''interface StaffHeaderProps {
  user: any;
  logout: () => void;
}

function StaffHeader({ user, logout }: StaffHeaderProps) {
  const router = useRouter();
  const staffEmail = user?.email || user?.username || "staff_orders";
  const departmentName =
    user?.permissions?.department ||
    user?.staffPermissions?.department ||
    (user?.isSuperuser ? "Executive Atelier Administration" : "Order Fulfillment & Logistics");

  return (
    <header className="relative w-full bg-[#1F1B18] text-[#F8F5EF] border-b border-[#3D352F] z-50 shadow-md">
      {/* 1. Internal Operations Top Status Bar */}
      <div className="bg-[#141210] text-[#A0988E] py-2 px-4 sm:px-8 border-b border-[#2C2622] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-[#FFFDFA] tracking-wider uppercase">ATELIER BACKEND OPERATIONS CONSOLE</span>
          <span className="text-[#5C534D]">|</span>
          <span className="text-[#D8CFC6]">Restricted Staff RBAC Workspace</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline text-[#8C8379]">Backend API: Port 8000</span>
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:text-[#FFFDFA] transition-colors font-medium flex items-center gap-1"
          >
            <span>Django Admin Console ↗</span>
          </a>
        </div>
      </div>

      {/* 2. Main Staff Operations Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Console Title */}
        <div className="flex items-center gap-4">
          <Link href="/staff" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="Ryna's Wardrobe"
              width={160}
              height={50}
              priority
              style={{ height: "46px", width: "auto", objectFit: "contain", filter: "brightness(1.2) contrast(1.05)" }}
            />
            <div className="border-l border-[#3D352F] pl-3">
              <span className="block text-[11px] font-semibold tracking-widest text-[#D4AF37] uppercase">
                Atelier Operations
              </span>
              <span className="block text-[13px] font-medium text-[#FFFDFA]">
                Staff Management Console
              </span>
            </div>
          </Link>
        </div>

        {/* Operational Modules Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xs text-[12px] font-medium bg-[#713A48] text-[#FFFDFA]">
            Orders & Fulfillment Queue
          </span>
          <a
            href="http://127.0.0.1:8000/admin/store/order/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xs text-[12px] font-medium text-[#D8CFC6] hover:text-[#FFFDFA] hover:bg-[#2C2622] transition-colors"
          >
            Orders DB ↗
          </a>
          <a
            href="http://127.0.0.1:8000/admin/store/staffinquiry/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xs text-[12px] font-medium text-[#D8CFC6] hover:text-[#FFFDFA] hover:bg-[#2C2622] transition-colors"
          >
            Concierge DB ↗
          </a>
          <a
            href="http://127.0.0.1:8000/admin/store/product/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xs text-[12px] font-medium text-[#D8CFC6] hover:text-[#FFFDFA] hover:bg-[#2C2622] transition-colors"
          >
            Stock DB ↗
          </a>
        </div>

        {/* Staff Identity & Sign Out */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[12px] font-medium text-[#FFFDFA]">
              {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Staff Member"}
            </div>
            <div className="text-[10px] text-[#A0988E]">
              {departmentName}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/account");
            }}
            className="px-3.5 py-1.5 bg-[#2C2622] hover:bg-[#3D352F] text-[#FFFDFA] border border-[#433B36] rounded-xs text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="End shift and return to staff sign in"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E0A899]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
'''

# Insert StaffHeader before export function Header()
content = content.replace('export function Header() {', staff_header_component + '\nexport function Header() {', 1)

# Inside Header, add redirect effect and conditional return for /staff
header_start_target = '''  if (pathname === "/checkout") {
    return null;
  }'''

header_start_replacement = '''  React.useEffect(() => {
    // If logged in as staff and browsing consumer storefront routes,
    // restrict view strictly to the Atelier Management Console
    if (isStaff && pathname !== "/staff" && pathname !== "/account") {
      router.replace("/staff");
    }
  }, [isStaff, pathname, router]);

  if (pathname === "/checkout") {
    return null;
  }

  // When viewing staff portal, render strictly the Backend Atelier Console Header
  if (pathname.startsWith("/staff")) {
    return <StaffHeader user={user} logout={logout} />;
  }'''

content = content.replace(header_start_target, header_start_replacement, 1)

# Enlarge Logo in Header
desktop_logo_target = '''            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center justify-center aw-desktop-logo">
              <Image
                src="/images/logo.png"
                alt="Ryna's Wardrobe"
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
                alt="Ryna's Wardrobe"
                width={180}
                height={48}
                priority
                style={{ height: "44px", width: "auto", maxWidth: "180px", maxHeight: "48px", objectFit: "contain", display: "block" }}
              />
            </div>'''

desktop_logo_replacement = '''            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center justify-center aw-desktop-logo">
              <Image
                src="/images/logo.png"
                alt="Ryna's Wardrobe"
                width={280}
                height={96}
                priority
                style={{ height: "88px", width: "auto", maxWidth: "280px", maxHeight: "92px", objectFit: "contain", display: "block" }}
              />
            </div>
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center aw-mobile-logo">
              <Image
                src="/images/logo.png"
                alt="Ryna's Wardrobe"
                width={180}
                height={56}
                priority
                style={{ height: "54px", width: "auto", maxWidth: "180px", maxHeight: "56px", objectFit: "contain", display: "block" }}
              />
            </div>'''

content = content.replace(desktop_logo_target, desktop_logo_replacement, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Header.tsx updated successfully!')

