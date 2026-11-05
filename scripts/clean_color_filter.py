# 1. Fix line 485 in CategoryView.tsx
p_cat = 'artifacts/rynas-wardrobe/src/components/catalog/CategoryView.tsx'
with open(p_cat, 'r', encoding='utf-8') as f:
    cat_text = f.read()

target_cat = '''                  onClick={() => {
                    setSelectedDept("All");
                    setSelectedColor("All");
                    setSelectedPrice("all");
                  }}'''

replacement_cat = '''                  onClick={() => {
                    setSelectedDept("All");
                    setSelectedPrice("all");
                  }}'''

if target_cat in cat_text:
    cat_text = cat_text.replace(target_cat, replacement_cat)
    with open(p_cat, 'w', encoding='utf-8') as f:
        f.write(cat_text)
    print('Cleaned up CategoryView.tsx empty state onClick!')
else:
    print('Target not found in CategoryView.tsx')


# 2. Fix lines 157-195 in FilterDrawer.tsx (strictly remove Colour section)
p_drawer = 'artifacts/rynas-wardrobe/src/components/catalog/FilterDrawer.tsx'
with open(p_drawer, 'r', encoding='utf-8') as f:
    drawer_text = f.read()

colour_block_target = '''          {/* Colour Filter */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#302B28",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 12px",
              }}
            >
              Colour
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {colors.map((color) => {
                const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onSelectColor(color)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      backgroundColor: isSelected ? "#713A48" : "#F8F5EF",
                      color: isSelected ? "#FFFDFA" : "#302B28",
                      border: `1px solid ${isSelected ? "#713A48" : "#D8CFC6"}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>'''

if colour_block_target in drawer_text:
    drawer_text = drawer_text.replace(colour_block_target, '')
    with open(p_drawer, 'w', encoding='utf-8') as f:
        f.write(drawer_text)
    print('Removed Colour Filter block from FilterDrawer.tsx!')
else:
    print('Colour block not matched directly in FilterDrawer.tsx, using line slice')
    lines = drawer_text.splitlines()
    start_idx, end_idx = None, None
    for idx, l in enumerate(lines):
        if '{/* Colour Filter */}' in l or 'Colour' in l and '<h3>' in lines[idx-1] or '{/* Colour Filter */}' in lines[max(0, idx-1)]:
            if start_idx is None:
                start_idx = idx
        if '{/* Price Range Filter */}' in l:
            end_idx = idx
            break
    if start_idx is not None and end_idx is not None:
        new_lines = lines[:start_idx] + lines[end_idx:]
        with open(p_drawer, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        print(f'Removed lines {start_idx} to {end_idx} from FilterDrawer.tsx')

