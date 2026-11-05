"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
import { CATALOG_CATEGORIES, isCategoryEnabled, getCategoryBySlug } from "@/config/catalog";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/config/currency";
import { FilterDrawer } from "@/components/catalog/FilterDrawer";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/products";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import { LuxuryProductCard } from "@/components/ui/LuxuryProductCard";

interface CategoryViewProps {
  slug: string;
  initialProducts?: Product[];
}


const SUBCAT_KEYWORDS: Record<string, string[]> = {
  knitwear: ["knit", "cardigan", "jumper", "sweater"],
  dresses: ["dress", "sundress", "slip"],
  tops: ["shirt", "blouse", "top", "tee", "co-ord"],
  "trousers-and-skirts": ["trousers", "jeans", "skirt", "pants"],
  outerwear: ["blazer", "coat", "jacket"],
  bangles: ["bangle", "cuff", "bracelet"],
  necklaces: ["necklace", "choker", "pendant", "chain"],
  rings: ["ring"],
  earrings: ["earring"],
  bags: ["bag", "pouch", "crossbody", "tote"],
  scarves: ["scarf"],
};

export function CategoryView({ slug, initialProducts }: CategoryViewProps) {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useStore();

  const [loading, setLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);
  const [allProducts, setAllProducts] = useState<Product[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : []
  );

  React.useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setAllProducts(initialProducts);
      setLoading(false);
    } else {
      setLoading(true);
      getProducts()
        .then((data) => {
          if (data && data.length > 0) {
            setAllProducts(data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [initialProducts]);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Find category config — works for any category (including new ones from admin)
  const categoryConfig = getCategoryBySlug(slug) || CATALOG_CATEGORIES.find((c) => c.slug === slug);
  const isEnabled = isCategoryEnabled(categoryConfig?.id || slug);

  // Filter and sort products — dynamic, no hardcoded slug ladder
  const products = useMemo(() => {
    let list = allProducts.filter((p) => isCategoryEnabled(p.category));

    // Category filter — robust resolution across category IDs and aliases
    if (slug === "new-in") {
      // Special: "New in" shows items with badges, sale notes, or latest arrivals
      list = list.filter((p) => p.badge || p.saleNote).concat(list.filter((p) => !p.badge && !p.saleNote)).slice(0, 12);
    } else if (slug === "accessories-and-bags" || slug === "gifts") {
      list = list.filter((p) => p.category === "accessories-bags" || p.category === "gifts" || p.category === "accessories-and-bags");
    } else if (slug === "girls-2-12" || slug === "girls") {
      list = list.filter((p) => p.category === "girls" || p.category === "girls-2-12");
    } else if (slug === "teens-13-17" || slug === "teens") {
      list = list.filter((p) => p.category === "teens" || p.category === "teens-13-17");
    } else if (categoryConfig) {
      list = list.filter((p) => p.category === categoryConfig.id || p.category === categoryConfig.slug);
    } else {
      list = list.filter((p) => p.category === slug);
    }

    // Subcategory / Department filter with intelligent keyword matching
    if (selectedDept !== "All") {
      const targetSub = categoryConfig?.subcategories?.find(
        (s) => s.name.toLowerCase() === selectedDept.toLowerCase() || s.slug === selectedDept.toLowerCase()
      );
      const subId = targetSub?.id || selectedDept.toLowerCase().replace(/\s*&\s*/g, "-");
      const keywords = SUBCAT_KEYWORDS[subId] || [selectedDept.toLowerCase().split(" ")[0]];

      list = list.filter((p) => {
        const text = `${p.name} ${p.department} ${p.description} ${p.fabric}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
    }

// Color filter removed per user specification (clothes curated by department and price)

    // Price filter
    if (selectedPrice === "under-3500") {
      list = list.filter((p) => p.price < 3500);
    } else if (selectedPrice === "3500-7500") {
      list = list.filter((p) => p.price >= 3500 && p.price <= 7500);
    } else if (selectedPrice === "over-7500") {
      list = list.filter((p) => p.price > 7500);
    }

    // Sort
    if (sortOption === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [slug, categoryConfig, allProducts, selectedDept, selectedPrice, sortOption]);

  const categoryName = categoryConfig?.name || "Collection";
  const categoryTagline =
    categoryConfig?.tagline ||
    "A cardigan to settle into. A dress to go somewhere in. Our latest little discoveries.";

  if (!isEnabled) {
    return (
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "36px", marginBottom: "16px" }}>
          Coming Soon
        </h1>
        <p style={{ color: "#69615B", marginBottom: "32px" }}>
          This department is currently in curation for future release.
        </p>
        <Link href="/" className="btn-primary">
          Return to wardrobe
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", backgroundColor: "#F8F5EF", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "36px 48px 80px",
        }}
        className="aw-category-container"
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "24px", fontSize: "13px", color: "#69615B" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }} className="hover:underline">
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#302B28" }}>{categoryName}</span>
        </nav>

        {/* Category Header (Figma #28:553) */}
        <div style={{ marginBottom: "36px", maxWidth: "800px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#713A48",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "6px",
            }}
          >
            FRESHLY CHOSEN
          </span>
          <h1
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "44px",
              color: "#302B28",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            {categoryName}
          </h1>
          <p style={{ fontSize: "15px", color: "#69615B", margin: 0, lineHeight: 1.5 }}>
            {categoryTagline}
          </p>
        </div>

        {/* Capsule / Subcategory Filter Pills - Strictly display subcategories with real items */}
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
        })()}

        {/* Listing Controls Bar (Figma #28:554) */}
        <div
          style={{
            borderTop: "1px solid #D8CFC6",
            borderBottom: "1px solid #D8CFC6",
            padding: "16px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#302B28" }}>
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                color: "#302B28",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal style={{ width: "16px", height: "16px" }} />
              <span>Filters +</span>
            </button>

            {/* Sort Control */}
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  appearance: "none",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "14px",
                  color: "#302B28",
                  paddingRight: "20px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              >
                <option value="newest">Sort: Newest ↓</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                style={{
                  position: "absolute",
                  right: 0,
                  width: "14px",
                  height: "14px",
                  pointerEvents: "none",
                  color: "#302B28",
                }}
              />
            </div>
          </div>
        </div>

        {/* Catalogue Layout: Sidebar + Product Grid (Figma #28:558) */}
        <div className="aw-catalogue-layout">
          {/* Desktop Left Sidebar Filters (Figma #28:559) */}
          <aside className="aw-filters-sidebar">
            <h2
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "24px",
                color: "#302B28",
                margin: "0 0 20px",
              }}
            >
              Refine your wardrobe
            </h2>

            {/* Department */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#302B28", marginBottom: "8px" }}>
                Department
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
              </div>
            </div>



            {/* Price */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#302B28", marginBottom: "8px" }}>
                Price
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { label: "All prices", val: "all" },
                  { label: "Under ₹3,500", val: "under-3500" },
                  { label: "₹3,500 – ₹7,500", val: "3500-7500" },
                  { label: "Over ₹7,500", val: "over-7500" },
                ].map((pr) => (
                  <button
                    key={pr.val}
                    type="button"
                    onClick={() => setSelectedPrice(pr.val)}
                    style={{
                      textAlign: "left",
                      fontSize: "13px",
                      color: selectedPrice === pr.val ? "#713A48" : "#69615B",
                      fontWeight: selectedPrice === pr.val ? 600 : 400,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 0",
                    }}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            {(selectedDept !== "All" || selectedPrice !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("All");
                  setSelectedPrice("all");
                }}
                style={{
                  fontSize: "13px",
                  color: "#713A48",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 0",
                  textDecoration: "underline",
                }}
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <main style={{ flex: 1 }}>
            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : products.length === 0 ? (
              <div
                style={{
                  padding: "60px 24px",
                  textAlign: "center",
                  backgroundColor: "#FFFDFA",
                  border: "1px solid #D8CFC6",
                }}
              >
                <p style={{ fontSize: "16px", color: "#302B28", marginBottom: "12px" }}>
                  No garments match your current filter selection.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDept("All");
                    setSelectedPrice("all");
                  }}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <LuxuryProductCard key={product.id} product={product} />
                ))}              </div>
            )}

            {/* End of Catalog Note (Figma #28:608) */}
            <div style={{ marginTop: "60px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "#69615B", marginBottom: "20px" }}>
                You’ve seen all {products.length} {products.length === 1 ? "piece" : "pieces"}. A small edit, on purpose.
              </p>
              <Link href="/category/women" className="btn-secondary">
                Explore the autumn edit
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* Filter Drawer Component */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        selectedDepartment={selectedDept}
        onSelectDepartment={setSelectedDept}
        selectedPriceRange={selectedPrice}
        onSelectPriceRange={setSelectedPrice}
        onClearAll={() => {
          setSelectedDept("All");
          setSelectedPrice("all");
        }}
        totalPieces={products.length}
      />

      {/* Scoped CSS for PLP */}
      <style>{`
        .aw-catalogue-layout {
          display: flex;
          gap: 48px;
          align-items: flex-start;
        }
        .aw-filters-sidebar {
          width: 224px;
          flex-shrink: 0;
          display: block;
        }
        .aw-plp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }
        .aw-product-card:hover img {
          transform: scale(1.04);
        }
        @media (max-width: 1023px) {
          .aw-category-container {
            padding: 24px 20px 60px !important;
          }
          .aw-filters-sidebar {
            display: none !important;
          }
          .aw-plp-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }
        @media (max-width: 639px) {
          .aw-plp-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
