"use client";

import React from "react";
import { X } from "lucide-react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;
  onClearAll: () => void;
  totalPieces: number;
}

export function FilterDrawer({
  isOpen,
  onClose,
  selectedDepartment,
  onSelectDepartment,
  selectedColor,
  onSelectColor,
  selectedPriceRange,
  onSelectPriceRange,
  onClearAll,
  totalPieces,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const departments = ["All", "Women", "Girls", "Teens", "Gifts", "Footwear"];
  const colors = ["All", "Oat", "Rosewood", "Burgundy", "Wine", "Chestnut", "Black"];
  const priceRanges = [
    { label: "All prices", value: "all" },
    { label: "Under ₹3,500", value: "under-3500" },
    { label: "₹3,500 – ₹7,500", value: "3500-7500" },
    { label: "Over ₹7,500", value: "over-7500" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(48, 43, 40, 0.6)",
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "100%",
          backgroundColor: "#FFFDFA",
          borderLeft: "1px solid #D8CFC6",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "-10px 0 25px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
              paddingBottom: "16px",
              borderBottom: "1px solid #D8CFC6",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  color: "#713A48",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                FILTER &amp; REFINE
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "26px",
                  color: "#302B28",
                  margin: 0,
                }}
              >
                Refine your wardrobe
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                color: "#69615B",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
              }}
              aria-label="Close filters"
            >
              <X style={{ width: "20px", height: "20px" }} />
            </button>
          </div>

          {/* Department Filter */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#302B28",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 12px",
              }}
            >
              Department
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {departments.map((dept) => {
                const isSelected = selectedDepartment.toLowerCase() === dept.toLowerCase();
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => onSelectDepartment(dept)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      backgroundColor: isSelected ? "#713A48" : "#F8F5EF",
                      color: isSelected ? "#FFFDFA" : "#302B28",
                      border: `1px solid ${isSelected ? "#713A48" : "#D8CFC6"}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colour Filter */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#302B28",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 12px",
              }}
            >
              Colour
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {colors.map((color) => {
                const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onSelectColor(color)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      backgroundColor: isSelected ? "#713A48" : "#F8F5EF",
                      color: isSelected ? "#FFFDFA" : "#302B28",
                      border: `1px solid ${isSelected ? "#713A48" : "#D8CFC6"}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#302B28",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 12px",
              }}
            >
              Price
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {priceRanges.map((range) => {
                const isSelected = selectedPriceRange === range.value;
                return (
                  <label
                    key={range.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      color: "#302B28",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={isSelected}
                      onChange={() => onSelectPriceRange(range.value)}
                      style={{ accentColor: "#713A48" }}
                    />
                    <span>{range.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ paddingTop: "24px", borderTop: "1px solid #D8CFC6" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary"
              style={{ flex: 1, textAlign: "center", padding: "12px" }}
            >
              View {totalPieces} {totalPieces === 1 ? "piece" : "pieces"}
            </button>
          </div>
          <button
            type="button"
            onClick={onClearAll}
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "13px",
              color: "#713A48",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
            }}
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
}
