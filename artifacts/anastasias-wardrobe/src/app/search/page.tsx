"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Search, Heart, X } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/products";
import { isCategoryEnabled } from "@/config/catalog";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/config/currency";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const { toggleWishlist, isInWishlist, addToCart } = useStore();

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const suggestions = ["Knitwear", "Dresses", "Cardigan", "Co-ord", "Rosewood", "Gifts", "Oat"];

  const filteredProducts = useMemo(() => {
    const clean = query.trim().toLowerCase();
    const enabledProducts = MOCK_PRODUCTS.filter((p) => isCategoryEnabled(p.category));

    if (!clean) return enabledProducts;

    return enabledProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(clean) ||
        product.description.toLowerCase().includes(clean) ||
        product.department.toLowerCase().includes(clean) ||
        product.color.toLowerCase().includes(clean)
      );
    });
  }, [query]);

  return (
    <div style={{ width: "100%", backgroundColor: "#F8F5EF", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "36px 48px 80px",
        }}
        className="aw-search-container"
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "24px", fontSize: "13px", color: "#69615B" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }} className="hover:underline">
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#302B28" }}>Search</span>
        </nav>

        {/* Search Header (Figma #28:478) */}
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
            DISCOVERY
          </span>
          <h1
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "44px",
              color: "#302B28",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            {query.trim() ? `Search results for “${query}”` : "Search the wardrobe"}
          </h1>
          <p style={{ fontSize: "15px", color: "#69615B", margin: 0, lineHeight: 1.5 }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? "piece found" : "pieces found"} in our current edit.
          </p>
        </div>

        {/* Search Input Bar */}
        <div
          style={{
            maxWidth: "680px",
            marginBottom: "28px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            style={{
              position: "absolute",
              left: "16px",
              width: "18px",
              height: "18px",
              color: "#713A48",
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, knitwear, coats, co-ords..."
            style={{
              width: "100%",
              padding: "16px 44px 16px 48px",
              backgroundColor: "#FFFDFA",
              border: "1px solid #D8CFC6",
              fontSize: "15px",
              color: "#302B28",
              outline: "none",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#69615B",
              }}
              aria-label="Clear search query"
            >
              <X style={{ width: "16px", height: "16px" }} />
            </button>
          )}
        </div>

        {/* Suggestion Chips (Figma #28:398) */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
          <span style={{ fontSize: "13px", color: "#69615B" }}>Popular searches:</span>
          {suggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setQuery(sug)}
              style={{
                fontSize: "12px",
                padding: "6px 12px",
                backgroundColor: query.toLowerCase() === sug.toLowerCase() ? "#713A48" : "#FFFDFA",
                color: query.toLowerCase() === sug.toLowerCase() ? "#FFFDFA" : "#302B28",
                border: "1px solid #D8CFC6",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              backgroundColor: "#FFFDFA",
              border: "1px solid #D8CFC6",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <p style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "22px", color: "#302B28", marginBottom: "8px" }}>
              No pieces match “{query}”
            </p>
            <p style={{ fontSize: "14px", color: "#69615B", marginBottom: "24px" }}>
              Try searching for broader terms like “dress”, “knitwear”, or explore our departments.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="btn-secondary"
            >
              View all garments
            </button>
          </div>
        ) : (
          <div className="aw-search-grid">
            {filteredProducts.map((product) => {
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

                    {/* Wishlist Button */}
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
                        }}
                      />
                    </button>

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
                      <span style={{ fontWeight: 500, fontSize: "16px", color: "#302B28" }}>
                        {formatPrice(product.price)}
                      </span>
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
      </div>

      <style>{`
        .aw-search-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
        }
        .aw-product-card:hover img {
          transform: scale(1.04);
        }
        @media (max-width: 1279px) and (min-width: 1024px) {
          .aw-search-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 1023px) {
          .aw-search-container {
            padding: 24px 20px 60px !important;
          }
          .aw-search-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }
        @media (max-width: 639px) {
          .aw-search-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
