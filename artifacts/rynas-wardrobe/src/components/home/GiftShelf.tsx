"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { LuxuryProductCard } from "@/components/ui/LuxuryProductCard";

interface GiftShelfProps {
  products: Product[];
}

export function GiftShelf({ products }: GiftShelfProps) {
  // Curate gifts specifically featuring authentic Jewelry and Handcrafted Luxury Bags:
  // 1. Luna Baroque Pearl Choker (Jewelry)
  // 2. Celeste Structured Leather Crossbody (Luxury Bag)
  // 3. Aurelia Ribbed Gold Bangle (Jewelry)
  const curatedGiftSlugs = [
    "luna-baroque-pearl-choker",
    "celeste-structured-leather-crossbody",
    "aurelia-ribbed-gold-bangle",
    "pave-dome-statement-ring",
    "cloud-knit-scarf",
  ];

  const matchedItems = curatedGiftSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  const giftItems =
    matchedItems.length >= 3
      ? matchedItems.slice(0, 3)
      : products
          .filter((p) => p.category === "gifts" || p.category === "jewellery")
          .slice(0, 3);

  return (
    <section className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-b border-[#E6E0D8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[11px] font-medium tracking-[0.22em] text-[#713A48] uppercase mb-2">
              Curated Finds &amp; Keepsakes
            </div>
            <h2 className="font-editorial text-[34px] sm:text-[44px] text-[#2C2623] leading-tight">
              The Atelier Gift Shelf
            </h2>
            <p className="text-[14px] text-[#69615B] mt-1.5 max-w-xl">
              Handcrafted velvet evening pouches, freshwater baroque pearls, and tactile cashmere wraps — packaged in our archival linen presentation box.
            </p>
          </div>

          <Link
            href="/category/gifts"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.15em] uppercase text-[#713A48] hover:text-[#582B37] transition-colors whitespace-nowrap"
          >
            <span>Explore All Gifts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Luxury Gift Cards Grid: Jewelry & Bags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftItems.map((product) => (
            <LuxuryProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
