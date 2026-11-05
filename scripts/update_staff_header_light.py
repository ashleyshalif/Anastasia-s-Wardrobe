path_header = 'artifacts/rynas-wardrobe/src/components/layout/Header.tsx'
with open(path_header, 'r', encoding='utf-8') as f:
    text = f.read()

target_staff_header = '''function StaffHeader({ user, logout }: StaffHeaderProps) {
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
}'''

replacement_staff_header = '''function StaffHeader({ user, logout }: StaffHeaderProps) {
  const router = useRouter();
  const staffEmail = user?.email || user?.username || "staff_orders";
  const departmentName =
    user?.permissions?.department ||
    user?.staffPermissions?.department ||
    (user?.isSuperuser ? "Executive Atelier Administration" : "Order Fulfillment & Logistics");

  return (
    <header className="relative w-full bg-[#FAF7F2] text-[#302B28] border-b border-[#D8CFC6] z-50 shadow-xs">
      {/* 1. Internal Operations Top Status Ribbon - Warm Luxury Light Theme */}
      <div className="bg-[#EDE7DE] text-[#69615B] py-2 px-4 sm:px-8 border-b border-[#D8CFC6] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="font-semibold text-[#713A48] tracking-wider uppercase">ATELIER BACKEND OPERATIONS CONSOLE</span>
          <span className="text-[#C2B7AC]">|</span>
          <span className="text-[#69615B]">Restricted Staff RBAC Workspace</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline text-[#7A726A]">Backend API: Port 8000</span>
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#713A48] hover:text-[#302B28] transition-colors font-medium flex items-center gap-1"
          >
            <span>Django Admin Console ↗</span>
          </a>
        </div>
      </div>

      {/* 2. Main Staff Operations Navigation - Perfectly Crisp Logo & Clear Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Console Title */}
        <div className="flex items-center gap-4">
          <Link href="/staff" className="flex items-center gap-3.5 group">
            <Image
              src="/images/logo.png"
              alt="Ryna's Wardrobe"
              width={200}
              height={64}
              priority
              style={{ height: "54px", width: "auto", maxWidth: "200px", objectFit: "contain", display: "block" }}
            />
            <div className="border-l border-[#D8CFC6] pl-3.5">
              <span className="block text-[11px] font-semibold tracking-widest text-[#713A48] uppercase">
                Atelier Operations
              </span>
              <span className="block text-[14px] font-medium text-[#302B28]">
                Staff Management Console
              </span>
            </div>
          </Link>
        </div>

        {/* Operational Modules Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xs text-[12px] font-medium bg-[#713A48] text-[#FFFDFA] shadow-xs">
            Orders &amp; Fulfillment Queue
          </span>
          <a
            href="http://127.0.0.1:8000/admin/store/order/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xs text-[12px] font-medium text-[#69615B] hover:text-[#302B28] bg-[#F2ECE4] hover:bg-[#E8E1D7] border border-[#D8CFC6] transition-colors"
          >
            Orders DB ↗
          </a>
          <a
            href="http://127.0.0.1:8000/admin/store/staffinquiry/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xs text-[12px] font-medium text-[#69615B] hover:text-[#302B28] bg-[#F2ECE4] hover:bg-[#E8E1D7] border border-[#D8CFC6] transition-colors"
          >
            Concierge DB ↗
          </a>
          <a
            href="http://127.0.0.1:8000/admin/store/product/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xs text-[12px] font-medium text-[#69615B] hover:text-[#302B28] bg-[#F2ECE4] hover:bg-[#E8E1D7] border border-[#D8CFC6] transition-colors"
          >
            Stock DB ↗
          </a>
        </div>

        {/* Staff Identity & Sign Out */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-medium text-[#302B28]">
              {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Staff Member"}
            </div>
            <div className="text-[11px] text-[#713A48] font-medium">
              {departmentName}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/account");
            }}
            className="px-3.5 py-1.5 bg-[#713A48] hover:bg-[#582D38] text-[#FFFDFA] rounded-xs text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="End shift and return to staff sign in"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}'''

assert target_staff_header in text, 'target_staff_header not found'
new_text = text.replace(target_staff_header, replacement_staff_header, 1)
with open(path_header, 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated StaffHeader to light luxury theme in Header.tsx!')

