path = 'artifacts/rynas-wardrobe/src/components/catalog/CategoryView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {["All", "Women", "Girls", "Teens", "Gifts"].map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    style={{
                      textAlign: "left",
                      fontSize: "13px",
                      color: selectedDept.toLowerCase() === dept.toLowerCase() ? "#713A48" : "#69615B",
                      fontWeight: selectedDept.toLowerCase() === dept.toLowerCase() ? 600 : 400,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 0",
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>'''

replacement = '''              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedDept("All")}
                  style={{
                    textAlign: "left",
                    fontSize: "13px",
                    color: selectedDept === "All" ? "#713A48" : "#69615B",
                    fontWeight: selectedDept === "All" ? 600 : 400,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 0",
                  }}
                >
                  All Pieces
                </button>
                {categoryConfig?.subcategories
                  ?.filter((s) => s.slug !== "all")
                  .map((sub) => {
                    const keywords = SUBCAT_KEYWORDS[sub.id] || [sub.name.toLowerCase().split(" ")[0]];
                    const catIds = slug === "accessories-and-bags" ? ["accessories-bags", "gifts"] : [categoryConfig.id];
                    const count = allProducts.filter((p) => {
                      if (!catIds.includes(p.category)) return false;
                      const text = `${p.name} ${p.department} ${p.description}`.toLowerCase();
                      return keywords.some((kw) => text.includes(kw));
                    }).length;
                    if (count === 0) return null;
                    const isSelected = selectedDept.toLowerCase() === sub.name.toLowerCase();
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedDept(isSelected ? "All" : sub.name)}
                        style={{
                          textAlign: "left",
                          fontSize: "13px",
                          color: isSelected ? "#713A48" : "#69615B",
                          fontWeight: isSelected ? 600 : 400,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                      >
                        {sub.name} ({count})
                      </button>
                    );
                  })}
              </div>'''

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Sidebar updated successfully!")
else:
    print("WARNING: Sidebar target not found")

