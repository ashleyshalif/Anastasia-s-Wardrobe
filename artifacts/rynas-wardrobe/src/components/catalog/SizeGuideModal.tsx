"use client";

import React, { useState } from "react";
import { X, Sparkles, Check, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: string;
  onSelectSize?: (size: string) => void;
  currentSize?: string;
  availableSizes?: string[];
}

export function SizeGuideModal({
  isOpen,
  onClose,
  department = "Women",
  onSelectSize,
  currentSize,
  availableSizes = ["XS", "S", "M", "L", "XL"],
}: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"calculator" | "chart">("calculator");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [bust, setBust] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [hips, setHips] = useState<string>("");
  const [fitPreference, setFitPreference] = useState<"relaxed" | "fitted">("relaxed");

  if (!isOpen) return null;

  // Measurement ranges in cm
  const sizeData = [
    { size: "XS", uk: "6–8", bustMin: 80, bustMax: 84, waistMin: 62, waistMax: 66, hipsMin: 88, hipsMax: 92 },
    { size: "S", uk: "8–10", bustMin: 85, bustMax: 89, waistMin: 67, waistMax: 71, hipsMin: 93, hipsMax: 97 },
    { size: "M", uk: "10–12", bustMin: 90, bustMax: 95, waistMin: 72, waistMax: 77, hipsMin: 98, hipsMax: 103 },
    { size: "L", uk: "12–14", bustMin: 96, bustMax: 102, waistMin: 78, waistMax: 84, hipsMin: 104, hipsMax: 110 },
    { size: "XL", uk: "14–16", bustMin: 103, bustMax: 110, waistMin: 85, waistMax: 92, hipsMin: 111, hipsMax: 118 },
  ];

  // Convert inputs to cm if in inches
  const bustCm = bust ? (unit === "in" ? parseFloat(bust) * 2.54 : parseFloat(bust)) : 0;
  const waistCm = waist ? (unit === "in" ? parseFloat(waist) * 2.54 : parseFloat(waist)) : 0;
  const hipsCm = hips ? (unit === "in" ? parseFloat(hips) * 2.54 : parseFloat(hips)) : 0;

  // Determine recommendation
  let recommendedSize: string | null = null;
  let recommendationNote = "";

  if (bustCm > 0 || waistCm > 0 || hipsCm > 0) {
    const scores: Record<string, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0 };

    sizeData.forEach((row) => {
      let score = 0;
      if (bustCm > 0) {
        if (bustCm >= row.bustMin && bustCm <= row.bustMax) score += 3;
        else score -= Math.abs(bustCm - (row.bustMin + row.bustMax) / 2) * 0.15;
      }
      if (waistCm > 0) {
        if (waistCm >= row.waistMin && waistCm <= row.waistMax) score += 2;
        else score -= Math.abs(waistCm - (row.waistMin + row.waistMax) / 2) * 0.1;
      }
      if (hipsCm > 0) {
        if (hipsCm >= row.hipsMin && hipsCm <= row.hipsMax) score += 2.5;
        else score -= Math.abs(hipsCm - (row.hipsMin + row.hipsMax) / 2) * 0.1;
      }
      scores[row.size] = score;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    let topSize = sorted[0][0];

    // If customer prefers relaxed and is on upper boundary, nudge up if available
    if (fitPreference === "relaxed") {
      const idx = sizeData.findIndex((s) => s.size === topSize);
      if (idx !== -1 && idx < sizeData.length - 1) {
        const currentBracket = sizeData[idx];
        if (bustCm > currentBracket.bustMax - 2 || waistCm > currentBracket.waistMax - 2) {
          topSize = sizeData[idx + 1].size;
        }
      }
    }

    // Check if available for this product
    if (availableSizes.includes(topSize)) {
      recommendedSize = topSize;
      recommendationNote =
        fitPreference === "relaxed"
          ? `Size ${topSize} will give you an effortless, comfortable drape.`
          : `Size ${topSize} offers a tailored silhouette for your proportions.`;
    } else {
      // Fallback to closest available
      recommendedSize = availableSizes[0] || topSize;
      recommendationNote = `Size ${recommendedSize} is best suited from current in-stock sizing.`;
    }
  }

  const handleApplySize = (sz: string) => {
    if (onSelectSize) {
      onSelectSize(sz);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(48, 43, 40, 0.65)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFDFA",
          border: "1px solid #D8CFC6",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "36px 32px",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            color: "#69615B",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
          aria-label="Close size guide"
        >
          <X style={{ width: "20px", height: "20px" }} />
        </button>

        {/* Modal Header */}
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "#713A48",
            textTransform: "uppercase",
            fontWeight: 600,
            display: "block",
            marginBottom: "6px",
          }}
        >
          ATELIER FIT CONCIERGE
        </span>
        <h2
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontSize: "28px",
            color: "#302B28",
            margin: "0 0 10px",
            lineHeight: 1.2,
          }}
        >
          Size &amp; Fit Guide — {department}
        </h2>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            borderBottom: "1px solid #D8CFC6",
            marginBottom: "24px",
            paddingBottom: "2px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("calculator")}
            style={{
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: activeTab === "calculator" ? 600 : 400,
              color: activeTab === "calculator" ? "#713A48" : "#69615B",
              borderBottom: activeTab === "calculator" ? "2px solid #713A48" : "2px solid transparent",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles style={{ width: "14px", height: "14px" }} />
            Find Your Recommended Size
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chart")}
            style={{
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: activeTab === "chart" ? 600 : 400,
              color: activeTab === "chart" ? "#713A48" : "#69615B",
              borderBottom: activeTab === "chart" ? "2px solid #713A48" : "2px solid transparent",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Ruler style={{ width: "14px", height: "14px" }} />
            Standard Size Chart
          </button>
        </div>

        {activeTab === "calculator" ? (
          <div>
            <p style={{ fontSize: "14px", color: "#69615B", margin: "0 0 18px", lineHeight: 1.5 }}>
              Enter your measurements below. Our atelier sizing engine matches your silhouette and fit preference directly to our garment patterns.
            </p>

            {/* Units & Preference Toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "20px",
                padding: "12px 16px",
                backgroundColor: "#F8F5EF",
                border: "1px solid #D8CFC6",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#69615B", fontWeight: 500 }}>Unit:</span>
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: unit === "cm" ? 600 : 400,
                    backgroundColor: unit === "cm" ? "#302B28" : "#FFFDFA",
                    color: unit === "cm" ? "#FFFDFA" : "#302B28",
                    border: "1px solid #D8CFC6",
                    cursor: "pointer",
                  }}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("in")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: unit === "in" ? 600 : 400,
                    backgroundColor: unit === "in" ? "#302B28" : "#FFFDFA",
                    color: unit === "in" ? "#FFFDFA" : "#302B28",
                    border: "1px solid #D8CFC6",
                    cursor: "pointer",
                  }}
                >
                  inches
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#69615B", fontWeight: 500 }}>Fit:</span>
                <button
                  type="button"
                  onClick={() => setFitPreference("relaxed")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: fitPreference === "relaxed" ? 600 : 400,
                    backgroundColor: fitPreference === "relaxed" ? "#713A48" : "#FFFDFA",
                    color: fitPreference === "relaxed" ? "#FFFDFA" : "#302B28",
                    border: "1px solid #D8CFC6",
                    cursor: "pointer",
                  }}
                >
                  Relaxed drape
                </button>
                <button
                  type="button"
                  onClick={() => setFitPreference("fitted")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: fitPreference === "fitted" ? 600 : 400,
                    backgroundColor: fitPreference === "fitted" ? "#713A48" : "#FFFDFA",
                    color: fitPreference === "fitted" ? "#FFFDFA" : "#302B28",
                    border: "1px solid #D8CFC6",
                    cursor: "pointer",
                  }}
                >
                  Fitted silhouette
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#69615B", marginBottom: "6px" }}>
                  Bust ({unit})
                </label>
                <input
                  type="number"
                  value={bust}
                  onChange={(e) => setBust(e.target.value)}
                  placeholder={unit === "cm" ? "e.g. 88" : "e.g. 35"}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#FFFDFA",
                    border: "1px solid #D8CFC6",
                    fontSize: "14px",
                    color: "#302B28",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#69615B", marginBottom: "6px" }}>
                  Waist ({unit})
                </label>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder={unit === "cm" ? "e.g. 70" : "e.g. 27"}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#FFFDFA",
                    border: "1px solid #D8CFC6",
                    fontSize: "14px",
                    color: "#302B28",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#69615B", marginBottom: "6px" }}>
                  Hips ({unit})
                </label>
                <input
                  type="number"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  placeholder={unit === "cm" ? "e.g. 96" : "e.g. 38"}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#FFFDFA",
                    border: "1px solid #D8CFC6",
                    fontSize: "14px",
                    color: "#302B28",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Recommendation Result Card */}
            {recommendedSize ? (
              <div
                style={{
                  padding: "20px 24px",
                  backgroundColor: "#FBF7F0",
                  border: "1px solid #713A48",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#713A48", fontWeight: 600 }}>
                      RECOMMENDED SIZE
                    </span>
                    <div style={{ fontSize: "28px", fontFamily: "var(--font-lora), Georgia, serif", color: "#302B28", fontWeight: 600 }}>
                      Size {recommendedSize}
                    </div>
                  </div>

                  {onSelectSize && (
                    <button
                      type="button"
                      onClick={() => handleApplySize(recommendedSize!)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#713A48",
                        color: "#FFFDFA",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Check style={{ width: "16px", height: "16px" }} />
                      Apply Size {recommendedSize}
                    </button>
                  )}
                </div>
                <p style={{ fontSize: "13px", color: "#69615B", margin: 0 }}>
                  {recommendationNote}
                </p>
              </div>
            ) : (
              <div
                style={{
                  padding: "16px 20px",
                  backgroundColor: "#F8F5EF",
                  border: "1px dashed #D8CFC6",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#69615B",
                  marginBottom: "20px",
                }}
              >
                Enter at least one measurement above to calculate your atelier size recommendation.
              </div>
            )}
          </div>
        ) : (
          /* Table View */
          <div style={{ overflowX: "auto", marginBottom: "28px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #D8CFC6" }}>
                  <th style={{ padding: "12px 16px", color: "#302B28", fontWeight: 600 }}>Size</th>
                  <th style={{ padding: "12px 16px", color: "#302B28", fontWeight: 600 }}>UK</th>
                  <th style={{ padding: "12px 16px", color: "#302B28", fontWeight: 600 }}>Bust (cm)</th>
                  <th style={{ padding: "12px 16px", color: "#302B28", fontWeight: 600 }}>Waist (cm)</th>
                  <th style={{ padding: "12px 16px", color: "#302B28", fontWeight: 600 }}>Hips (cm)</th>
                </tr>
              </thead>
              <tbody>
                {sizeData.map((row, idx) => (
                  <tr
                    key={row.size}
                    style={{
                      borderBottom: "1px solid #D8CFC6",
                      backgroundColor: currentSize === row.size ? "#FBF7F0" : idx % 2 === 1 ? "#F8F5EF" : "transparent",
                    }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: currentSize === row.size ? "#713A48" : "#302B28" }}>
                      {row.size} {currentSize === row.size && " (Selected)"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.uk}</td>
                    <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.bustMin}–{row.bustMax}</td>
                    <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.waistMin}–{row.waistMax}</td>
                    <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.hipsMin}–{row.hipsMax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Measuring Tip */}
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "#F8F5EF",
            border: "1px solid #D8CFC6",
            fontSize: "13px",
            color: "#69615B",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#302B28" }}>Need personal fit guidance?</strong> Our atelier team is available via our{" "}
          <a href="/contact" style={{ color: "#713A48", textDecoration: "underline" }}>contact concierge</a> to assist with garment lengths and custom fit advice.
        </div>
      </div>
    </div>
  );
}
