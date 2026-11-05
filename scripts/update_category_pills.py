path = 'artifacts/rynas-wardrobe/src/components/catalog/CategoryView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''        {/* Capsule / Subcategory Filter Pills */}
        {categoryConfig?.subcategories && categoryConfig.subcategories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
            <button
              type="button"
              onClick={() => setSelectedDept("All")}
              style={{
                padding: "8px 18px",
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: selectedDept === "All" ? "#713A48" : "#D8CFC6",
                backgroundColor: selectedDept === "All" ? "#713A48" : "#FFFDFA",
                color: selectedDept === "All" ? "#FFFDFA" : "#69615B",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              All Pieces ({allProducts.filter(p => p.category === categoryConfig.id).length})
            </button>
            {categoryConfig.subcategories.filter(s => s.slug !== "all").map((sub) => {
              const keywords = SUBCAT_KEYWORDS[sub.id] || [sub.name.toLowerCase().split(" ")[0]];
              const catIds = slug === "accessories-and-bags" ? ["accessories-bags", "gifts"] : [categoryConfig.id];
              const count = allProducts.filter(p => {
                if (!catIds.includes(p.category)) return false;
                const text = `${p.name} ${p.department} ${p.description}`.toLowerCase();
                return keywords.some(kw => text.includes(kw));
              }).length;
              const isSelected = selectedDept.toLowerCase() === sub.name.toLowerCase();
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedDept(isSelected ? "All" : sub.name)}
                  style={{
                    padding: "8px 18px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: isSelected ? "#713A48" : "#D8CFC6",
                    backgroundColor: isSelected ? "#713A48" : "#FFFDFA",
                    color: isSelected ? "#FFFDFA" : "#69615B",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {sub.name} {count > 0 ? `(${count})` : ""}
                </button>
              );
            })}
          </div>
        )}'''

replacement = '''        {/* Capsule / Subcategory Filter Pills - Strictly display subcategories with real items */}
        {categoryConfig?.subcategories && categoryConfig.subcategories.length > 0 && (() => {
          const catIds = slug === "accessories-and-bags" ? ["accessories-bags", "gifts"] : [categoryConfig.id];
          const activeSubcategories = categoryConfig.subcategories
            .filter((s) => s.slug !== "all")
            .map((sub) => {
              const keywords = SUBCAT_KEYWORDS[sub.id] || [sub.name.toLowerCase().split(" ")[0]];
              const count = allProducts.filter((p) => {
                if (!catIds.includes(p.category)) return false;
                const text = `${p.name} ${p.department} ${p.description}`.toLowerCase();
                return keywords.some((kw) => text.includes(kw));
              }).length;
              return { sub, count };
            })
            .filter((item) => item.count > 0);

          const totalCategoryCount = allProducts.filter((p) => catIds.includes(p.category)).length;

          return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
              <button
                type="button"
                onClick={() => setSelectedDept("All")}
                style={{
                  padding: "8px 18px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: selectedDept === "All" ? "#713A48" : "#D8CFC6",
                  backgroundColor: selectedDept === "All" ? "#713A48" : "#FFFDFA",
                  color: selectedDept === "All" ? "#FFFDFA" : "#69615B",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                All Pieces ({totalCategoryCount})
              </button>
              {activeSubcategories.map(({ sub, count }) => {
                const isSelected = selectedDept.toLowerCase() === sub.name.toLowerCase();
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedDept(isSelected ? "All" : sub.name)}
                    style={{
                      padding: "8px 18px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: isSelected ? "#713A48" : "#D8CFC6",
                      backgroundColor: isSelected ? "#713A48" : "#FFFDFA",
                      color: isSelected ? "#FFFDFA" : "#69615B",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {sub.name} ({count})
                  </button>
                );
              })}
            </div>
          );
        })()}'''

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("CategoryView pills updated successfully!")
else:
    print("WARNING: Target not found in CategoryView.tsx")

