p = 'artifacts/rynas-wardrobe/src/components/staff/StaffPortalView.tsx'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''      {/* Active Staff Session Bar */}
      <div className="bg-[#24201D] text-[#FFFDFA] border-b border-[#362F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#713A48] text-[#FFFDFA] rounded-xs">
              Staff Session Active
            </span>
            <div className="text-[12px]">
              <span className="text-[#D8CFC6]">Logged In: </span>
              <strong className="text-[#FFFDFA]">
                {user?.firstName} {user?.lastName} ({user?.username || staffEmail})
              </strong>
              <span className="hidden sm:inline text-[#A0988E] ml-2">
                · {departmentName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <a
              href="http://127.0.0.1:8000/admin/store/staffprofile/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#D8CFC6] hover:text-[#FFFDFA] transition-colors"
              title="Manage roles and toggle staff permissions in Django Admin"
            >
              <span>Django RBAC Admin Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>'''

replacement = '''      {/* Active Staff Session Bar - Light Luxury Palette */}
      <div className="bg-[#EDE7DE] text-[#302B28] border-b border-[#D8CFC6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#713A48] text-[#FFFDFA] rounded-xs shadow-xs">
              Staff Session Active
            </span>
            <div className="text-[12px]">
              <span className="text-[#69615B]">Logged In: </span>
              <strong className="text-[#302B28]">
                {user?.firstName} {user?.lastName} ({user?.username || staffEmail})
              </strong>
              <span className="hidden sm:inline text-[#713A48] ml-2 font-medium">
                · {departmentName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <a
              href="http://127.0.0.1:8000/admin/store/staffprofile/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#713A48] hover:text-[#302B28] font-medium transition-colors"
              title="Manage roles and toggle staff permissions in Django Admin"
            >
              <span>Django RBAC Admin Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>'''

assert target in text, 'target not found'
new_text = text.replace(target, replacement, 1)
with open(p, 'w', encoding='utf-8') as f:
    f.write(new_text)
print('Updated StaffPortalView to light luxury theme!')

