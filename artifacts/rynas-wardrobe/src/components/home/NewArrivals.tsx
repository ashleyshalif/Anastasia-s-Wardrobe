"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { LuxuryProductCard } from "@/components/ui/LuxuryProductCard";

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Arrivals" },
    { id: "women", label: "Dresses & Silks" },
    { id: "knitwear", label: "Merino Knits" },
    { id: "jewellery", label: "Demi-Fine Jewellery" },
  ];

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === activeFilter.toLowerCase() ||
            p.department?.toLowerCase() === activeFilter.toLowerCase()
        );

  const displayProducts = filteredProducts.length > 0 ? filteredProducts.slice(0, 4) : products.slice(0, 4);

  return (
    <section className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-t border-[#E6E0D8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[11px] font-medium tracking-[0.22em] text-[#713A48] uppercase mb-2">
              Autumn / Winter 2026 Release
            </div>
            <h2 className="font-editorial text-[34px] sm:text-[44px] text-[#2C2623] leading-tight">
              New Things to Fall For
            </h2>
            <p className="text-[14px] text-[#69615B] mt-1.5 max-w-xl">
              Weightless wools, hand-draped silks, and timeless silhouettes tailored for everyday moments and modern occasions.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 text-[12px] font-medium tracking-wide transition-colors cursor-pointer ${
                  activeFilter === cat.id
                    ? "bg-[#713A48] text-[#FAF8F5]"
                    : "bg-[#FFFDFA] text-[#69615B] border border-[#E6E0D8] hover:text-[#2C2623] hover:border-[#713A48]/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayProducts.map((product) => (
            <LuxuryProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="flex justify-center">
          <Link
            href="/category/women"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFFDFA] border border-[#713A48] text-[#713A48] hover:bg-[#713A48] hover:text-[#FAF8F5] text-[12px] font-medium tracking-[0.15em] uppercase transition-all duration-300 shadow-xs"
          >
            <span>View Complete Edit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
