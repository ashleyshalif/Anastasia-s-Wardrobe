"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronDown, ChevronUp, User, Heart, ShoppingBag, Search } from "lucide-react";
import { getEnabledCategories, CATALOG_CATEGORIES } from "@/config/catalog";
import { useStore } from "@/lib/store";
import { CURRENCY } from "@/config/currency";

export function MobileDrawer() {
  const { mobileMenuOpen, setMobileMenuOpen, cartCount, wishlist, setSearchOpen } = useStore();
  const [womenExpanded, setWomenExpanded] = useState(true);

  if (!mobileMenuOpen) return null;

  const enabledCategories = getEnabledCategories();
  const womenCategory = CATALOG_CATEGORIES.find((c) => c.id === "women");

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer content: strictly styled to fit 390px mobile viewports without horizontal overflow */}
      <div className="relative w-[85vw] max-w-[340px] bg-[#FDFBF7] h-full overflow-y-auto overflow-x-hidden flex flex-col shadow-2xl z-10">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#D8CFC6]">
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Anastasia's Wardrobe"
              width={1333}
              height={856}
              priority
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
            />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-[#302B28] hover:text-[#713A48] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Region & Currency notice */}
        <div className="bg-[#713A48] text-[#FFFDFA] px-4 py-2 text-[11px] text-center font-utility">
          {CURRENCY.topNotice}
        </div>

        {/* Search quick button */}
        <div className="p-4 border-b border-[#D8CFC6]">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-[#FFFDFA] border border-[#D8CFC6] text-[13px] text-[#69615B] text-left hover:border-[#713A48] transition-colors"
          >
            <Search className="w-4 h-4 text-[#713A48] flex-shrink-0" />
            <span className="truncate">Search dresses, knitwear, coats...</span>
          </button>
        </div>

        {/* Categories list */}
        <div className="flex-1 px-4 py-4 overflow-x-hidden">
          <p className="text-[11px] font-medium tracking-[0.15em] text-[#713A48] uppercase mb-2">
            EXPLORE THE WARDROBE
          </p>

          <nav className="flex flex-col divide-y divide-[#D8CFC6]/50">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-[15px] text-[#302B28] hover:text-[#713A48] transition-colors"
            >
              <span>Home</span>
            </Link>
            {enabledCategories.map((category) => {
              const isWomen = category.id === "women";
              if (isWomen) {
                return (
                  <div key={category.id} className="py-1">
                    <button
                      onClick={() => setWomenExpanded(!womenExpanded)}
                      className="w-full flex items-center justify-between py-2.5 text-[15px] font-medium text-[#713A48] text-left"
                    >
                      <span>{category.name}</span>
                      {womenExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#713A48]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#713A48]" />
                      )}
                    </button>
                    {womenExpanded && (
                      <div className="pl-3 pb-2 pt-1 flex flex-col space-y-1.5 border-l-2 border-[#713A48] my-1">
                        {womenCategory?.subcategories?.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/women?sub=${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-[13px] text-[#302B28] hover:text-[#713A48] py-1 block truncate"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-[15px] text-[#302B28] hover:text-[#713A48] transition-colors"
                >
                  <span>{category.name}</span>
                  <span className="text-[15px] text-[#69615B]">+</span>
                </Link>
              );
            })}
          </nav>

          {/* Curated feature card */}
          <div className="mt-6 p-3.5 bg-[#FFFDFA] border border-[#D8CFC6]">
            <div className="relative w-full h-[140px] mb-2.5 overflow-hidden bg-[#EAE4D9]">
              <Image
                src="/images/cardigan.png"
                alt="The soft hours"
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
            <h4 className="font-editorial text-[18px] text-[#302B28] leading-[1.2] mb-1">
              The soft hours
            </h4>
            <p className="text-[12px] text-[#69615B] leading-[1.4] mb-2.5">
              A collection of brushed knits and easy evening silhouettes.
            </p>
            <Link
              href="/category/women?sub=knitwear"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block w-full text-center py-2 px-3 border border-[#713A48] text-[#713A48] text-[12px] font-medium tracking-wide hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors"
            >
              Explore the knitwear edit
            </Link>
          </div>
        </div>

        {/* Quick action footer */}
        <div className="p-4 bg-[#EAE4D9] border-t border-[#D8CFC6] space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center text-[12px] text-[#302B28]">
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 p-2 bg-[#FFFDFA] border border-[#D8CFC6]"
            >
              <User className="w-4 h-4 text-[#713A48]" />
              <span className="text-[11px]">Account</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 p-2 bg-[#FFFDFA] border border-[#D8CFC6] relative"
            >
              <Heart className="w-4 h-4 text-[#713A48]" />
              <span className="text-[11px]">Wishlist ({wishlist.length})</span>
            </Link>
            <Link
              href="/bag"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 p-2 bg-[#FFFDFA] border border-[#D8CFC6] relative"
            >
              <ShoppingBag className="w-4 h-4 text-[#713A48]" />
              <span className="text-[11px]">Bag ({cartCount})</span>
            </Link>
          </div>

          <div className="pt-1 text-center">
            <p className="text-[11px] text-[#69615B]">{CURRENCY.regionLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
