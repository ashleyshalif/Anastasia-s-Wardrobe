"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getEnabledCategories, CATALOG_CATEGORIES } from "@/config/catalog";

interface WomenMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WomenMegaMenu({ isOpen, onClose }: WomenMegaMenuProps) {
  if (!isOpen) return null;

  const enabledCategories = getEnabledCategories();
  const womenCategory = CATALOG_CATEGORIES.find((c) => c.id === "women");

  return (
    <div
      className="aw-megamenu-dropdown"
      role="region"
      aria-label="Women navigation menu"
    >
      <div className="aw-megamenu-inner">
        {/* Title row */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#713A48",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            EXPLORE THE WARDROBE
          </p>
          <h2
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "36px",
              color: "#302B28",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Women
          </h2>
        </div>

        {/* 3 Column Grid Layout */}
        <div className="aw-megamenu-grid">
          {/* Column 1: Department selector (Figma #28:307) */}
          <div className="aw-megamenu-col1">
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "#69615B",
                textTransform: "uppercase",
                marginBottom: "12px",
                display: "block",
              }}
            >
              DEPARTMENTS
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {enabledCategories.map((category) => {
                const isWomen = category.id === "women";
                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "14px",
                      borderBottom: isWomen
                        ? "1px solid #713A48"
                        : "1px solid rgba(216, 207, 198, 0.5)",
                      color: isWomen ? "#713A48" : "#302B28",
                      fontWeight: isWomen ? 500 : 400,
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    className="hover:text-[#713A48]"
                  >
                    <span>{category.name}</span>
                    <span
                      style={{
                        fontSize: "15px",
                        lineHeight: 1,
                        color: "#69615B",
                      }}
                    >
                      {isWomen ? "−" : "+"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Column 2: Selected department categories */}
          <div className="aw-megamenu-col2">
            <h3
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "#713A48",
                textTransform: "uppercase",
                marginBottom: "16px",
                marginTop: 0,
              }}
            >
              WOMEN / SHOP BY CATEGORY
            </h3>
            <div className="aw-megamenu-subgrid">
              {womenCategory?.subcategories?.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/women?sub=${sub.slug}`}
                  onClick={onClose}
                  style={{
                    fontSize: "14px",
                    color: "#302B28",
                    padding: "4px 0",
                    display: "block",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "color 0.15s ease",
                  }}
                  className="hover:text-[#713A48]"
                  title={sub.name}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Curated feature card */}
          <div className="aw-megamenu-col3">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "180px",
                marginBottom: "12px",
                overflow: "hidden",
                backgroundColor: "#EAE4D9",
              }}
            >
              <Image
                src="/images/cardigan.png"
                alt="The soft hours - knitwear edit"
                fill
                sizes="360px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <h4
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "20px",
                color: "#302B28",
                lineHeight: 1.2,
                margin: "0 0 4px",
              }}
            >
              The soft hours
            </h4>
            <p
              style={{
                fontSize: "12px",
                color: "#69615B",
                lineHeight: 1.4,
                margin: "0 0 12px",
              }}
            >
              A collection of brushed knits and easy evening silhouettes.
            </p>
            <Link
              href="/category/women?sub=knitwear"
              onClick={onClose}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "10px 16px",
                backgroundColor: "transparent",
                border: "1px solid #713A48",
                color: "#713A48",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textDecoration: "none",
                transition: "all 0.15s ease",
                boxSizing: "border-box",
              }}
              className="hover:bg-[#713A48] hover:text-[#FFFDFA]"
            >
              Explore the knitwear edit
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .aw-megamenu-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 50;
          background-color: #FDFBF7;
          border-bottom: 1px solid #D8CFC6;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
        }
        .aw-megamenu-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 32px 48px;
          box-sizing: border-box;
        }
        .aw-megamenu-grid {
          display: grid;
          grid-template-columns: 240px 1fr 340px;
          gap: 36px;
          align-items: start;
          border-top: 1px solid #D8CFC6;
          padding-top: 24px;
        }
        .aw-megamenu-col1 {
          padding-right: 24px;
          border-right: 1px solid #D8CFC6;
          display: flex;
          flex-direction: column;
        }
        .aw-megamenu-col2 {
          padding: 0 8px;
          min-width: 0;
        }
        .aw-megamenu-subgrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px 24px;
        }
        .aw-megamenu-col3 {
          background-color: #FFFDFA;
          border: 1px solid #D8CFC6;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 1023px) {
          .aw-megamenu-dropdown {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
