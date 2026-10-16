"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { MOCK_PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/config/currency";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const wishlistProducts = MOCK_PRODUCTS.filter((p) =>
    wishlist.includes(p.id)
  );

  const handleMoveToCart = (productId: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    addToCart(product, product.sizes[0]);
    toggleWishlist(productId); // remove from wishlist after adding
  };

  return (
    <div style={{ width: "100%", backgroundColor: "#F8F5EF", minHeight: "100vh" }}>
      <div
        style={{ maxWidth: "1440px", margin: "0 auto", padding: "48px 48px 100px" }}
        className="aw-wishlist-container"
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "28px", fontSize: "13px", color: "#69615B" }}>
          <Link href="/" style={{ color: "inherit" }} className="hover:underline">
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#302B28" }}>Saved pieces</span>
        </nav>

        {/* Page Header */}
        <div style={{ marginBottom: "48px" }}>
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
            YOUR CURATION
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
            Saved pieces
          </h1>
          <p style={{ fontSize: "15px", color: "#69615B", margin: 0 }}>
            {wishlistProducts.length > 0
              ? `${wishlistProducts.length} ${wishlistProducts.length === 1 ? "piece" : "pieces"} you've set aside.`
              : "Your saved pieces will appear here."}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              backgroundColor: "#FFFDFA",
              border: "1px solid #D8CFC6",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            <Heart
              style={{
                width: "40px",
                height: "40px",
                color: "#D8CFC6",
                margin: "0 auto 20px",
                display: "block",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "24px",
                color: "#302B28",
                marginBottom: "12px",
              }}
            >
              Nothing saved yet
            </h2>
            <p style={{ fontSize: "14px", color: "#69615B", marginBottom: "28px", lineHeight: 1.6 }}>
              Tap the heart icon on any garment to save it here for later.
            </p>
            <Link href="/category/women" className="btn-primary">
              Browse the wardrobe
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="aw-wishlist-grid">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: "#FFFDFA",
                    border: "1px solid #D8CFC6",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  {/* Product Image */}
                  <Link href={`/product/${product.slug}`}>
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
                        sizes="(max-width: 768px) 100vw, 400px"
                        style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                        className="aw-wishlist-img"
                      />
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
                  </Link>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      backgroundColor: "rgba(255,253,250,0.92)",
                      border: "1px solid #D8CFC6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    aria-label="Remove from wishlist"
                  >
                    <Heart
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#713A48",
                        fill: "#713A48",
                      }}
                    />
                  </button>

                  {/* Info */}
                  <div
                    style={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: "16px",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "12px", color: "#69615B", margin: "0 0 4px" }}>
                        {product.department} · {product.color}
                      </p>
                      <Link href={`/product/${product.slug}`}>
                        <h3
                          style={{
                            fontFamily: "var(--font-lora), Georgia, serif",
                            fontSize: "18px",
                            color: "#302B28",
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                          className="hover:text-[#713A48] transition-colors"
                        >
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Price & Actions */}
                    <div
                      style={{
                        paddingTop: "14px",
                        borderTop: "1px solid #D8CFC6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontWeight: 500, fontSize: "16px", color: "#302B28" }}>
                        {formatPrice(product.price)}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          style={{
                            fontSize: "12px",
                            color: "#69615B",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          aria-label="Remove"
                        >
                          <Trash2 style={{ width: "13px", height: "13px" }} />
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveToCart(product.id)}
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#713A48",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <ShoppingBag style={{ width: "14px", height: "14px" }} />
                          Move to bag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping CTA */}
            <div style={{ marginTop: "60px", textAlign: "center" }}>
              <Link
                href="/category/women"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#713A48",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
                className="hover:underline"
              >
                Continue browsing
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        .aw-wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
        }
        .aw-wishlist-img:hover {
          transform: scale(1.04);
        }
        @media (max-width: 1279px) and (min-width: 1024px) {
          .aw-wishlist-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 1023px) {
          .aw-wishlist-container {
            padding: 28px 20px 80px !important;
          }
          .aw-wishlist-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }
        @media (max-width: 639px) {
          .aw-wishlist-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
