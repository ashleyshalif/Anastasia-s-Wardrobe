"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, X, Copy, Check, Gift } from "lucide-react";

export function FestiveDiwaliPrivilege() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only show once per session after a gentle 1.4s delay
    const hasSeen = sessionStorage.getItem("aw_diwali_privilege_2026");
    if (hasSeen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("aw_diwali_privilege_2026", "true");
    setIsOpen(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("DIWALI2026");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300 select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#C2A684]/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-[#302B28]/10 hover:bg-[#302B28]/20 text-[#302B28] transition-colors cursor-pointer"
          aria-label="Close privilege modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Card with Deep Wine Gradient & Imagery */}
        <div className="relative w-full h-52 sm:h-56 bg-gradient-to-br from-[#582B37] via-[#713A48] to-[#3B1B24] overflow-hidden flex items-center justify-between p-6 sm:p-8">
          {/* Subtle Festive Glow / Sparkles */}
          <div className="absolute inset-0 bg-radial-[circle_at_top_right,_var(--tw-gradient-stops)] from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none" />

          {/* Text Left */}
          <div className="relative z-10 max-w-[62%]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5]/15 border border-[#C2A684]/40 text-[#FAF8F5] text-[10px] uppercase font-mono tracking-widest backdrop-blur-md mb-2.5">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Festive Privilege 2026</span>
            </div>
            <h3
              className="text-2xl sm:text-3xl text-[#FAF8F5] font-light leading-tight drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Diwali Atelier Gift
            </h3>
            <p className="text-[12px] text-[#EAE4D9]/90 mt-1 leading-relaxed">
              Complimentary Keepsake Velvet Pouch on orders above ₹5,000
            </p>
          </div>

          {/* Velvet Pouch Visual Right */}
          <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden border border-[#C2A684]/40 shadow-xl bg-[#3B1B24]">
            <Image
              src="/images/keepsake-velvet-pouch.jpg"
              alt="Keepsake Velvet Pouch"
              fill
              sizes="140px"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Body Details */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          <p className="text-[14px] text-[#302B28] leading-relaxed max-w-sm mb-6">
            Celebrate the season of light with curated Haute Couture &amp; 18K Fine Jewellery. Enjoy <strong>20% privileged savings</strong> on your festive order.
          </p>

          {/* Promo Code Box */}
          <div className="w-full max-w-xs p-3 bg-[#FFFDFA] border border-[#D8CFC6] rounded-xl flex items-center justify-between gap-3 shadow-xs mb-6">
            <div className="text-left pl-2">
              <span className="text-[10px] uppercase tracking-wider text-[#69615B] font-mono block">
                Privilege Code
              </span>
              <span className="font-mono text-[16px] font-bold text-[#713A48] tracking-widest">
                DIWALI2026
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? "bg-[#2E5C38] text-white"
                  : "bg-[#713A48] hover:bg-[#582B37] text-white shadow-xs"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleClose}
            className="w-full max-w-xs py-3.5 bg-[#713A48] hover:bg-[#582B37] text-[#FAF8F5] text-xs uppercase font-medium tracking-[0.16em] rounded-full shadow-lg transition-all duration-200 cursor-pointer"
          >
            Claim Privilege &amp; Enter Atelier
          </button>

          <p className="text-[11px] text-[#69615B] font-mono mt-3">
            Valid through the Diwali Festive Season 2026 · Auto-applies at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
