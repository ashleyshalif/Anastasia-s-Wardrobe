"use client";

import React from "react";
import { X } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: string;
}

export function SizeGuideModal({ isOpen, onClose, department = "Women" }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(48, 43, 40, 0.6)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFDFA",
          border: "1px solid #D8CFC6",
          maxWidth: "680px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "36px",
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
            fontWeight: 500,
            display: "block",
            marginBottom: "8px",
          }}
        >
          FIT &amp; MEASUREMENTS
        </span>
        <h2
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontSize: "32px",
            color: "#302B28",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          Size guide — {department}
        </h2>
        <p style={{ fontSize: "14px", color: "#69615B", margin: "0 0 24px", lineHeight: 1.5 }}>
          Our silhouettes are cut for relaxed, comfortable movement. If you fall between sizes, we recommend sizing up for layering knits, or sizing down for tailored dresses.
        </p>

        {/* Measurements Table */}
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
              {[
                { size: "XS", uk: "6–8", bust: "80–84", waist: "62–66", hips: "88–92" },
                { size: "S", uk: "8–10", bust: "85–89", waist: "67–71", hips: "93–97" },
                { size: "M", uk: "10–12", bust: "90–95", waist: "72–77", hips: "98–103" },
                { size: "L", uk: "12–14", bust: "96–102", waist: "78–84", hips: "104–110" },
                { size: "XL", uk: "14–16", bust: "103–110", waist: "85–92", hips: "111–118" },
              ].map((row, idx) => (
                <tr
                  key={row.size}
                  style={{
                    borderBottom: "1px solid #D8CFC6",
                    backgroundColor: idx % 2 === 1 ? "#F8F5EF" : "transparent",
                  }}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#302B28" }}>{row.size}</td>
                  <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.uk}</td>
                  <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.bust}</td>
                  <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.waist}</td>
                  <td style={{ padding: "12px 16px", color: "#69615B" }}>{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
          <strong style={{ color: "#302B28" }}>Need personal advice?</strong> Our atelier team is available via our{" "}
          <span style={{ color: "#713A48", textDecoration: "underline" }}>contact concierge</span> to assist with garment lengths and custom fit advice.
        </div>
      </div>
    </div>
  );
}
