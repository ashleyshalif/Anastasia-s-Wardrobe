import os

# 1. Update CategoryView.tsx
p_cat = 'artifacts/rynas-wardrobe/src/components/catalog/CategoryView.tsx'
with open(p_cat, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove selectedColor state
text = text.replace(
    '  const [selectedDept, setSelectedDept] = useState("All");\n  const [selectedColor, setSelectedColor] = useState("All");\n  const [selectedPrice, setSelectedPrice] = useState("all");',
    '  const [selectedDept, setSelectedDept] = useState("All");\n  const [selectedPrice, setSelectedPrice] = useState("all");'
)

# Remove color filter logic
color_filter_target = '''    // Color filter
    if (selectedColor !== "All") {
      list = list.filter((p) => p.color.toLowerCase().includes(selectedColor.toLowerCase()));
    }'''
if color_filter_target in text:
    text = text.replace(color_filter_target, '// Color filter removed per user specification (clothes curated by department and price)')

# Remove selectedColor from useMemo dependencies
text = text.replace(
    '[slug, categoryConfig, allProducts, selectedDept, selectedColor, selectedPrice, sortOption]',
    '[slug, categoryConfig, allProducts, selectedDept, selectedPrice, sortOption]'
)

# Remove Colour sidebar block
colour_sidebar_target = '''            {/* Colour */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#302B28", marginBottom: "8px" }}>
                Colour
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {["All", "Oat", "Rosewood", "Burgundy", "Wine"].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    style={{
                      textAlign: "left",
                      fontSize: "13px",
                      color: selectedColor.toLowerCase() === col.toLowerCase() ? "#713A48" : "#69615B",
                      fontWeight: selectedColor.toLowerCase() === col.toLowerCase() ? 600 : 400,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 0",
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>'''

if colour_sidebar_target in text:
    text = text.replace(colour_sidebar_target, '')

# Update Clear filters condition in sidebar
text = text.replace(
    '(selectedDept !== "All" || selectedColor !== "All" || selectedPrice !== "all")',
    '(selectedDept !== "All" || selectedPrice !== "all")'
)

# Update Clear filters buttons
text = text.replace(
    '''                  setSelectedDept("All");
                  setSelectedColor("All");
                  setSelectedPrice("all");''',
    '''                  setSelectedDept("All");
                  setSelectedPrice("all");'''
)

# Update FilterDrawer usage
text = text.replace(
    '''        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        selectedPriceRange={selectedPrice}
        onSelectPriceRange={setSelectedPrice}
        onClearAll={() => {
          setSelectedDept("All");
          setSelectedColor("All");
          setSelectedPrice("all");
        }}''',
    '''        selectedPriceRange={selectedPrice}
        onSelectPriceRange={setSelectedPrice}
        onClearAll={() => {
          setSelectedDept("All");
          setSelectedPrice("all");
        }}'''
)

with open(p_cat, 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated CategoryView.tsx successfully (Colour filter removed)!')


# 2. Update FilterDrawer.tsx
p_drawer = 'artifacts/rynas-wardrobe/src/components/catalog/FilterDrawer.tsx'
with open(p_drawer, 'r', encoding='utf-8') as f:
    d_text = f.read()

# Remove selectedColor from interface
drawer_iface_target = '''  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  selectedPriceRange: string;'''

drawer_iface_replacement = '''  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  selectedPriceRange: string;'''

if drawer_iface_target in d_text:
    d_text = d_text.replace(drawer_iface_target, drawer_iface_replacement)

# Remove from component signature
drawer_sig_target = '''  selectedDepartment,
  onSelectDepartment,
  selectedColor,
  onSelectColor,
  selectedPriceRange,'''

drawer_sig_replacement = '''  selectedDepartment,
  onSelectDepartment,
  selectedPriceRange,'''

if drawer_sig_target in d_text:
    d_text = d_text.replace(drawer_sig_target, drawer_sig_replacement)

# Remove colors array
d_text = d_text.replace(
    '  const colors = ["All", "Oat", "Rosewood", "Burgundy", "Wine", "Chestnut", "Black"];\n',
    ''
)

# Remove Colour section in JSX
import re
d_text = re.sub(r'{\/\*\s*Colour\s*\*\/}[\s\S]*?{\/\*\s*Price\s*\*\/}', '{/* Price */}', d_text)

with open(p_drawer, 'w', encoding='utf-8') as f:
    f.write(d_text)
print('Updated FilterDrawer.tsx successfully (Colour filter removed)!')

