"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
import { CATALOG_CATEGORIES, isCategoryEnabled } from "@/config/catalog";
import { MOCK_PRODUCTS } from "@/lib/products";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/config/currency";
import { FilterDrawer } from "@/components/catalog/FilterDrawer";

interface CategoryViewProps {
  slug: string;
}

export function CategoryView({ slug }: CategoryViewProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Find category config
  const categoryConfig = CATALOG_CATEGORIES.find((c) => c.slug === slug);
  const isEnabled = isCategoryEnabled(categoryConfig?.id || slug);

  // Filter and sort products
  const products = useMemo(() => {
    let list = MOCK_PRODUCTS.filter((p) => isCategoryEnabled(p.category));

    // Category filter
    if (slug === "women") {
      list = list.filter((p) => p.category === "women");
    } else if (slug === "girls-2-12" || slug === "girls") {
      list = list.filter((p) => p.category === "girls");
    } else if (slug === "teens-13-17" || slug === "teens") {
      list = list.filter((p) => p.category === "teens");
    } else if (slug === "gifts") {
      list = list.filter((p) => p.category === "gifts");
    } else if (slug === "footwear") {
      list = list.filter((p) => p.category === "footwear");
    } else if (slug === "new-in") {
      list = list.slice(0, 8);
    }

    // Department filter
    if (selectedDept !== "All") {
      list = list.filter((p) => p.department.toLowerCase().includes(selectedDept.toLowerCase()));
    }

    // Color filter
    if (selectedColor !== "All") {
      list = list.filter((p) => p.color.toLowerCase().includes(selectedColor.toLowerCase()));
    }

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
  }, [slug, selectedDept, selectedColor, selectedPrice, sortOption]);

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
              </div>
            </div>

            {/* Colour */}
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

            {(selectedDept !== "All" || selectedColor !== "All" || selectedPrice !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("All");
                  setSelectedColor("All");
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
            {products.length === 0 ? (
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
                    setSelectedColor("All");
                    setSelectedPrice("all");
                  }}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="aw-plp-grid">
                {products.map((product) => {
                  const inWishlist = isInWishlist(product.id);
                  return (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#FFFDFA",
                        border: "1px solid #D8CFC6",
                        position: "relative",
                      }}
                      className="aw-product-card"
                    >
                      {/* Image */}
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "360px",
                          backgroundColor: "#EAE4D9",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                        />

                        {/* Wishlist Toggle Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.id);
                          }}
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            width: "40px",
                            height: "40px",
                            backgroundColor: "rgba(255,253,250,0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #D8CFC6",
                            cursor: "pointer",
                            zIndex: 10,
                          }}
                          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "#713A48",
                              fill: inWishlist ? "#713A48" : "none",
                              transition: "fill 0.2s ease",
                            }}
                          />
                        </button>

                        {/* Badge */}
                        {product.badge && (
                          <span
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: "12px",
                              backgroundColor: "rgba(255,253,250,0.9)",
                              color: "#713A48",
                              fontSize: "10px",
                              fontWeight: 500,
                              padding: "4px 8px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              border: "1px solid #D8CFC6",
                            }}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div
                        style={{
                          padding: "20px",
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          justifyContent: "space-between",
                          gap: "14px",
                        }}
                      >
                        <div>
                          <p style={{ fontSize: "13px", color: "#69615B", margin: "0 0 4px" }}>
                            {product.department} · {product.color}
                          </p>
                          <h3
                            style={{
                              fontFamily: "var(--font-lora), Georgia, serif",
                              fontSize: "19px",
                              color: "#302B28",
                              margin: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            <Link
                              href={`/product/${product.slug}`}
                              style={{ color: "inherit", textDecoration: "none" }}
                            >
                              {product.name}
                            </Link>
                          </h3>
                        </div>

                        <div
                          style={{
                            paddingTop: "12px",
                            borderTop: "1px solid #D8CFC6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 500, fontSize: "16px", color: "#302B28" }}>
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#69615B",
                                  textDecoration: "line-through",
                                  marginLeft: "8px",
                                }}
                              >
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(product, product.sizes[0])}
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#713A48",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Quick add +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        selectedPriceRange={selectedPrice}
        onSelectPriceRange={setSelectedPrice}
        onClearAll={() => {
          setSelectedDept("All");
          setSelectedColor("All");
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
