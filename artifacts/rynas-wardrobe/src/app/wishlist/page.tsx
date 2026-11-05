"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/config/currency";
import { LuxuryProductCard } from "@/components/ui/LuxuryProductCard";
import { Product } from "@/types/product";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from the API on mount
  useEffect(() => {
    getProducts()
      .then((data) => setAllProducts(data))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const wishlistProducts = allProducts.filter((p) =>
    wishlist.includes(p.id)
  );

  const handleMoveToCart = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {wishlistProducts.map((product) => (
                <LuxuryProductCard key={product.id} product={product} />
              ))}            </div>

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
