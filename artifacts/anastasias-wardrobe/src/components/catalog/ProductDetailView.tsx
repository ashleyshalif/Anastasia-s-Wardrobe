"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ChevronDown, ChevronUp, Check, Truck, RefreshCw } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/products";
import { isCategoryEnabled } from "@/config/catalog";
import { useStore } from "@/lib/store";
import { SizeGuideModal } from "@/components/catalog/SizeGuideModal";

interface ProductDetailViewProps {
  slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"fabric" | "fit" | "delivery">("fabric");
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Find product
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  const isEnabled = product ? isCategoryEnabled(product.category) : false;

  // Initialize selected color and size
  React.useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.availableColors && product.availableColors.length > 0 && !selectedColor) {
        setSelectedColor(product.availableColors[0].name);
      }
    }
  }, [product, selectedSize, selectedColor]);

  if (!product || !isEnabled) {
    return (
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "36px", marginBottom: "16px" }}>
          Piece Not Found
        </h1>
        <p style={{ color: "#69615B", marginBottom: "32px" }}>
          This garment is either retired or belongs to a collection not yet launched.
        </p>
        <Link href="/" className="btn-primary">
          Return to wardrobe
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize || product.sizes[0]);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Complementary pieces for "Wear it with"
  const complementaryProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && isCategoryEnabled(p.category)
  ).slice(0, 3);

  return (
    <div style={{ width: "100%", backgroundColor: "#F8F5EF", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "36px 48px 80px",
        }}
        className="aw-pdp-container"
      >
        {/* Breadcrumb Navigation */}
        <nav style={{ marginBottom: "32px", fontSize: "13px", color: "#69615B" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }} className="hover:underline">
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link
            href={`/category/${product.category}`}
            style={{ color: "inherit", textDecoration: "none" }}
            className="hover:underline"
          >
            {product.department.split("·")[0].trim()}
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#302B28" }}>{product.name}</span>
        </nav>

        {/* Main Product Layout (Figma #28:756) */}
        <div className="aw-pdp-layout">
          {/* Left: Product Photography */}
          <div className="aw-pdp-media">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "640px",
                backgroundColor: "#EAE4D9",
                border: "1px solid #D8CFC6",
                overflow: "hidden",
              }}
              className="aw-pdp-main-image"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 680px"
                style={{ objectFit: "cover" }}
              />

              {product.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    backgroundColor: "rgba(255,253,250,0.9)",
                    color: "#713A48",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "4px 10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "1px solid #D8CFC6",
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            <p style={{ fontSize: "12px", color: "#69615B", marginTop: "12px", textAlign: "center" }}>
              01 / 03 · Front, back &amp; texture
            </p>
          </div>

          {/* Right: Product Actions & Editorial Info */}
          <div className="aw-pdp-details">
            {/* Eyebrow */}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                color: "#713A48",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {product.badge ? product.badge : "THE EDITORIAL COLLECTION"}
            </span>

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "40px",
                color: "#302B28",
                margin: "0 0 12px",
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "24px" }}>
              <span style={{ fontSize: "24px", fontWeight: 500, color: "#302B28" }}>
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: "16px", color: "#69615B", textDecoration: "line-through" }}>
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {product.saleNote && (
                <span style={{ fontSize: "13px", color: "#713A48", fontWeight: 500 }}>
                  {product.saleNote}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: "15px", color: "#302B28", lineHeight: 1.6, marginBottom: "32px" }}>
              {product.description}
            </p>

            {/* Colour Choice */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "13px", color: "#69615B", display: "block", marginBottom: "10px" }}>
                  Colour: <strong style={{ color: "#302B28" }}>{selectedColor}</strong>
                </span>
                <div style={{ display: "flex", gap: "12px" }}>
                  {product.availableColors.map((col) => {
                    const isSelected = selectedColor === col.name;
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col.name)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: col.hex,
                          border: isSelected ? "2px solid #713A48" : "1px solid #D8CFC6",
                          outline: isSelected ? "2px solid #FFFDFA" : "none",
                          cursor: "pointer",
                          transition: "transform 0.2s ease",
                          transform: isSelected ? "scale(1.1)" : "scale(1)",
                        }}
                        aria-label={`Select colour ${col.name}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#69615B" }}>
                    Select Size: <strong style={{ color: "#302B28" }}>{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    style={{
                      fontSize: "12px",
                      color: "#713A48",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Size guide &amp; fit notes
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        style={{
                          minWidth: "52px",
                          height: "44px",
                          padding: "0 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: 500,
                          backgroundColor: isSelected ? "#302B28" : "#FFFDFA",
                          color: isSelected ? "#FFFDFA" : "#302B28",
                          border: `1px solid ${isSelected ? "#302B28" : "#D8CFC6"}`,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Purchase Action Buttons */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "36px" }}>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {addedAnimation ? (
                  <>
                    <Check style={{ width: "18px", height: "18px" }} />
                    <span>Added to bag ✓</span>
                  </>
                ) : (
                  <span>Add to bag · ₹{product.price.toLocaleString("en-IN")}</span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                style={{
                  width: "52px",
                  height: "52px",
                  border: "1px solid #D8CFC6",
                  backgroundColor: "#FFFDFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
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
            </div>

            {/* Accordion Panels (Figma #28:790) */}
            <div style={{ borderTop: "1px solid #D8CFC6", borderBottom: "1px solid #D8CFC6" }}>
              {/* Tab 1: Fabric & Care */}
              <div style={{ borderBottom: "1px solid #D8CFC6" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "fabric" ? (null as any) : "fabric")}
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#302B28",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span>Fabric &amp; garment care</span>
                  {activeTab === "fabric" ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
                </button>
                {activeTab === "fabric" && (
                  <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#69615B", lineHeight: 1.6 }}>
                    <p style={{ margin: "0 0 8px" }}><strong>Material:</strong> {product.fabric || "Merino wool and natural horn buttons"}</p>
                    <p style={{ margin: "0 0 8px" }}><strong>Care instructions:</strong> {product.care || "Cool hand wash gently or specialist dry clean."}</p>
                    {product.details && (
                      <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        {product.details.map((dt, i) => (
                          <li key={i}>{dt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Tab 2: Fit & measurements */}
              <div style={{ borderBottom: "1px solid #D8CFC6" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "fit" ? (null as any) : "fit")}
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#302B28",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span>Fit &amp; sizing notes</span>
                  {activeTab === "fit" ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
                </button>
                {activeTab === "fit" && (
                  <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#69615B", lineHeight: 1.6 }}>
                    <p style={{ margin: "0 0 8px" }}>
                      Cut for everyday ease with subtle drop shoulders. If you prefer a snugger silhouette, consider taking one size down.
                    </p>
                    <p style={{ margin: 0 }}>
                      Model wears size S. Length from shoulder to hem: 58cm.
                    </p>
                  </div>
                )}
              </div>

              {/* Tab 3: Delivery & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "delivery" ? (null as any) : "delivery")}
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#302B28",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span>Complimentary delivery &amp; returns</span>
                  {activeTab === "delivery" ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
                </button>
                {activeTab === "delivery" && (
                  <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#69615B", lineHeight: 1.6 }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
                      <Truck style={{ width: "16px", height: "16px", color: "#713A48", flexShrink: 0, marginTop: "2px" }} />
                      <span>Standard delivery: 2–4 working days (complimentary on all orders over ₹4,999).</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <RefreshCw style={{ width: "16px", height: "16px", color: "#713A48", flexShrink: 0, marginTop: "2px" }} />
                      <span>Free 30-day doorstep returns with prepaid return courier pickup.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* "Wear it with" Complementary Pieces (Figma #28:795) */}
        <section style={{ marginTop: "100px", borderTop: "1px solid #D8CFC6", paddingTop: "60px" }}>
          <h2
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "36px",
              color: "#302B28",
              marginBottom: "36px",
            }}
          >
            Wear it with
          </h2>

          <div className="aw-wear-grid">
            {complementaryProducts.map((comp) => (
              <div
                key={comp.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#FFFDFA",
                  border: "1px solid #D8CFC6",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "320px", overflow: "hidden" }}>
                  <Image
                    src={comp.image}
                    alt={comp.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ fontSize: "12px", color: "#69615B", margin: 0 }}>
                    {comp.department}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      fontSize: "18px",
                      color: "#302B28",
                      margin: 0,
                    }}
                  >
                    <Link href={`/product/${comp.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {comp.name}
                    </Link>
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                    <span style={{ fontWeight: 500, fontSize: "15px" }}>₹{comp.price.toLocaleString("en-IN")}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(comp, comp.sizes[0])}
                      style={{
                        fontSize: "13px",
                        color: "#713A48",
                        fontWeight: 500,
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
            ))}
          </div>
        </section>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        department={product.department}
      />

      {/* Scoped CSS for PDP */}
      <style>{`
        .aw-pdp-layout {
          display: flex;
          gap: 64px;
          align-items: flex-start;
        }
        .aw-pdp-media {
          flex: 1;
          max-width: 680px;
        }
        .aw-pdp-details {
          flex: 1;
          max-width: 580px;
        }
        .aw-wear-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }
        @media (max-width: 1023px) {
          .aw-pdp-container {
            padding: 24px 20px 60px !important;
          }
          .aw-pdp-layout {
            flex-direction: column;
            gap: 40px;
          }
          .aw-pdp-media, .aw-pdp-details {
            max-width: 100%;
          }
          .aw-pdp-main-image {
            height: 440px !important;
          }
          .aw-wear-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
