"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full bg-[#F8F5EF] min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Bar */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-8">
          <Link href="/" className="hover:underline text-inherit">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#302B28]">Page not found</span>
        </nav>

        {/* 2-Column Not Found Composition (Figma Frame 22 Desktop & Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Recovery Copy Column (6 or 7 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div>
              <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-3 font-utility">
                404 / A LITTLE OUT OF PLACE
              </span>
              <h1 className="font-editorial text-[38px] sm:text-[48px] text-[#302B28] leading-[1.15] mb-4">
                This corner of the wardrobe is empty.
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#69615B] leading-relaxed">
                The page may have moved, or the address might not be quite right.
                Let’s find you something lovely instead.
              </p>
            </div>

            {/* Quick Search Form */}
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <label
                htmlFor="not-found-search"
                className="text-[12px] font-medium text-[#69615B] uppercase tracking-wider block mb-2"
              >
                Search for a piece
              </label>
              <div className="relative flex items-center">
                <input
                  id="not-found-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try cardigan, dress, or knitwear..."
                  className="w-full px-4 py-3 pr-11 bg-[#FFFDFA] border border-[#D8CFC6] text-[14px] text-[#302B28] placeholder-[#69615B]/70 focus:outline-none focus:border-[#713A48] transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-2 p-2 text-[#69615B] hover:text-[#713A48] transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            </form>

            {/* Recovery Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wider uppercase hover:bg-[#582D38] transition-colors cursor-pointer shadow-xs text-center"
              >
                <Home className="w-4 h-4 stroke-[1.5]" />
                <span>Back to the wardrobe</span>
              </Link>

              <Link
                href="/search?q=dress"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FFFDFA] border border-[#713A48] text-[#713A48] text-[13px] font-medium tracking-wider uppercase hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors cursor-pointer text-center"
              >
                <span>Explore new arrivals</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>

            {/* Helpful Quick Links */}
            <div className="pt-4 border-t border-[#D8CFC6] flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#69615B]">
              <span className="font-medium text-[#302B28]">Popular places:</span>
              <Link href="/account" className="hover:text-[#713A48] hover:underline">
                Customer Account
              </Link>
              <Link href="/wishlist" className="hover:text-[#713A48] hover:underline">
                Saved Wishlist
              </Link>
              <Link href="/shipping-returns" className="hover:text-[#713A48] hover:underline">
                Shipping & Returns
              </Link>
              <Link href="/contact" className="hover:text-[#713A48] hover:underline">
                Contact Concierge
              </Link>
            </div>
          </div>

          {/* Editorial Photography Column (5 or 6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              className="relative w-full max-w-lg h-[380px] sm:h-[560px] aspect-[4/5] bg-[#EAE4D9] border border-[#D8CFC6] shadow-sm overflow-hidden"
              style={{ minHeight: "380px" }}
            >
              <Image
                src="/images/hero.png"
                alt="Anastasia's Wardrobe Curated Collection"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
                <div className="text-[#FFFDFA]">
                  <span className="text-[11px] font-medium tracking-[0.2em] uppercase opacity-90 block mb-1">
                    ANASTASIA’S ATELIER
                  </span>
                  <p className="font-editorial text-[18px] sm:text-[20px] leading-snug">
                    “Every piece has a place, every story a beginning.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
