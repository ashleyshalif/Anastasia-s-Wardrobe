"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useStore } from "@/lib/store";

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#F8F5EF",
        paddingTop: "80px",
        paddingBottom: "80px",
        borderTop: "1px solid #D8CFC6",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          paddingLeft: "48px",
          paddingRight: "48px",
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: "48px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#713A48",
              textTransform: "uppercase",
              fontFamily: "var(--font-inter)",
            }}
          >
            JUST UNPACKED
          </span>
          <h2
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "44px",
              color: "#302B28",
              lineHeight: 1.2,
              margin: "4px 0 8px",
            }}
          >
            New things to fall for
          </h2>
          <p style={{ fontSize: "15px", color: "#69615B", margin: 0 }}>
            Small details, good textures, room to move.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="aw-arrivals-grid" style={{ marginBottom: "48px" }}>
          {products.slice(0, 3).map((product) => {
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
                {/* Image Container */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "380px",
                    backgroundColor: "#EAE4D9",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 420px"
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                  />

                  {/* Wishlist Heart */}
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
                      transition: "background-color 0.2s ease",
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

                {/* Product Meta */}
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "13px", color: "#69615B", marginBottom: "4px", margin: "0 0 4px" }}>
                      {product.department} · {product.color}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-lora), Georgia, serif",
                        fontSize: "20px",
                        color: "#302B28",
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      <Link
                        href={`/product/${product.slug}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                        className="aw-product-name"
                      >
                        {product.name}
                      </Link>
                    </h3>
                  </div>

                  <div
                    style={{
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(216,207,198,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        color: "#302B28",
                      }}
                    >
                      ₹{product.price.toLocaleString("en-IN")}
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
                        transition: "color 0.2s ease",
                      }}
                      className="aw-quick-add"
                    >
                      Quick add +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link href="/category/new-in" className="btn-secondary">
            Browse all new arrivals
          </Link>
        </div>
      </div>

      <style>{`
        .aw-arrivals-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
        }
        .aw-product-card:hover img {
          transform: scale(1.05);
        }
        .aw-product-name:hover {
          color: #713A48;
        }
        .aw-quick-add:hover {
          color: #582B37;
        }
        @media (max-width: 767px) {
          .aw-arrivals-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        @media (max-width: 1023px) and (min-width: 640px) {
          .aw-arrivals-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
}
