import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface JewellerySectionProps {
  products?: Product[];
}

export function JewellerySection({ products = [] }: JewellerySectionProps) {
  const jewelleryItem = products.find(
    (p) => p.category === "jewellery" || p.slug === "petal-drop-earrings"
  );
  const imageSrc = jewelleryItem?.image || "/images/petal-drop-earrings.jpg";

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#F8F5EF",
        paddingTop: "48px",
        paddingBottom: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          paddingLeft: "48px",
          paddingRight: "48px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "48px",
        }}
        className="aw-jewellery-container"
      >
        {/* Jewellery Story Left (Figma #28:95 / #28:239) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
          }}
          className="aw-jewellery-story"
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: 1.45,
              color: "#713A48",
              textTransform: "uppercase",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            THE FINISHING TOUCH
          </span>

          <h2
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "48px",
              fontWeight: 400,
              color: "#302B28",
              lineHeight: 1.2,
              margin: 0,
            }}
            className="aw-jewellery-title"
          >
            Small pieces. Long stories.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "15px",
              fontWeight: 400,
              color: "#302B28",
              lineHeight: 1.45,
              maxWidth: "460px",
              margin: 0,
            }}
          >
            A petal-shaped earring, a fine chain, a keepsake for someone close. Jewellery that leaves a little room for you.
          </p>

          <Link
            href="/category/jewellery"
            className="btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "13px 20px",
              backgroundColor: "#F8F5EF",
              border: "1px solid #713A48",
              color: "#713A48",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.4,
              textDecoration: "none",
            }}
          >
            Discover jewellery
          </Link>
        </div>

        {/* Photography Image Right (Figma #28:101 / #28:245) */}
        <div
          style={{
            flex: 1,
            position: "relative",
            height: "460px",
            overflow: "hidden",
            backgroundColor: "#EAE4D9",
          }}
          className="aw-jewellery-image"
        >
          <Image
            src={imageSrc}
            alt="Petal drop earrings - handcrafted jewellery"
            fill
            sizes="(max-width: 1024px) 100vw, 650px"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .aw-jewellery-container {
            flex-direction: column !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            gap: 24px !important;
          }
          .aw-jewellery-story {
            width: 100% !important;
          }
          .aw-jewellery-title {
            font-size: 32px !important;
          }
          .aw-jewellery-image {
            width: 100% !important;
            height: 320px !important;
          }
        }
      `}</style>
    </section>
  );
}
