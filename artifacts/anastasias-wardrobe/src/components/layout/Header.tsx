"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { getEnabledCategories } from "@/config/catalog";
import { useStore } from "@/lib/store";
import { CURRENCY } from "@/config/currency";
import { WomenMegaMenu } from "./WomenMegaMenu";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, setMobileMenuOpen, searchOpen, setSearchOpen, user, logout } =
    useStore();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  if (pathname === "/checkout") {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const enabledCategories = getEnabledCategories();

  return (
    <header className="relative w-full bg-[#F8F5EF] z-50">
      {/* 1. Regional Notice Bar (Figma #28:5) */}
      <div className="bg-[#713A48] text-[#FFFDFA] py-2 px-4 sm:px-12 text-center">
        <p className="text-[11px] font-utility tracking-wide">
          {CURRENCY.topNotice}
        </p>
      </div>

      {/* 2. Main Brand Navigation (Figma #28:7) - 3-Column Grid */}
      <div
        className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-3 lg:py-4 grid grid-cols-3 items-center aw-header-container"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center"
        }}
      >
        {/* Left Column: Region Selector (Desktop) or Hamburger (Mobile) */}
        <div className="flex items-center justify-start aw-header-left">
          {/* Desktop: Region / Language Selector */}
          <div className="hidden lg:flex items-center text-xs text-[#69615B] hover:text-[#302B28] transition-colors whitespace-nowrap aw-desktop-region">
            <span>{CURRENCY.regionLabel}</span>
          </div>

          {/* Mobile: Hamburger Menu Button */}
          <div className="flex lg:hidden items-center aw-mobile-hamburger">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#302B28] hover:text-[#713A48] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Column: Official Brand Logo */}
        <div className="flex items-center justify-center aw-header-center">
          <Link href="/" className="inline-flex items-center justify-center focus:outline-none" aria-label="Anastasia's Wardrobe Home">
            {/* Desktop Logo (145px) */}
            <div className="hidden lg:block aw-desktop-logo">
              <Image
                src="/images/logo.png"
                alt="Anastasia's Wardrobe"
                width={1333}
                height={856}
                priority
                style={{ height: "145px", width: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
            {/* Mobile Logo (58px) */}
            <div className="block lg:hidden aw-mobile-logo">
              <Image
                src="/images/logo.png"
                alt="Anastasia's Wardrobe"
                width={1333}
                height={856}
                priority
                style={{ height: "58px", width: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
          </Link>
        </div>

        {/* Right Column: Utility Icons Container - Pushed to the far right margin */}
        <div
          className="flex items-center justify-end gap-4 lg:gap-6 text-[#302B28] ml-auto aw-header-right"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%"
          }}
        >
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="inline-flex items-center gap-1.5 p-1 text-[#302B28] hover:text-[#713A48] transition-colors cursor-pointer aw-action-btn"
            aria-label="Search catalog"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
            <span className="hidden lg:inline text-xs text-[#69615B] hover:text-[#713A48] aw-action-label">Search</span>
          </button>

          {/* Account */}
          <div className="relative group hidden lg:block">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 p-1 text-[#302B28] hover:text-[#713A48] transition-colors aw-action-btn aw-account-link"
              aria-label="Your account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
              <span className="text-xs text-[#69615B] group-hover:text-[#713A48] aw-action-label">
                {user ? user.firstName : "Account"}
              </span>
            </Link>
            {user && (
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50">
                <div className="w-48 bg-[#FFFDFA] border border-[#D8CFC6] shadow-lg py-1.5">
                  <div className="px-4 py-2 border-b border-[#D8CFC6] text-[11px] text-[#69615B]">
                    Signed in as <strong className="text-[#302B28] block truncate">{user.firstName} {user.lastName}</strong>
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-[12px] text-[#302B28] hover:bg-[#F8F5EF] hover:text-[#713A48]"
                  >
                    Atelier Portal
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      router.push("/account");
                    }}
                    className="w-full text-left px-4 py-2 text-[12px] text-[#963D37] hover:bg-[#F8F5EF] cursor-pointer flex items-center justify-between"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-1.5 p-1 text-[#302B28] hover:text-[#713A48] transition-colors aw-action-btn"
            aria-label={`Wishlist with ${wishlist.length} items`}
          >
            <div className="relative inline-flex items-center justify-center flex-shrink-0 w-5 h-5 aw-icon-wrapper">
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#713A48] text-[#FFFDFA] text-[10px] font-semibold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center leading-none pointer-events-none aw-badge-counter">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="hidden lg:inline text-xs text-[#69615B] hover:text-[#713A48] aw-action-label">Wishlist</span>
          </Link>

          {/* Bag */}
          <Link
            href="/bag"
            className="inline-flex items-center gap-2 p-1 text-[#302B28] hover:text-[#713A48] transition-colors whitespace-nowrap aw-action-btn aw-bag-link"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <div className="relative inline-flex items-center justify-center flex-shrink-0 w-5 h-5 aw-icon-wrapper">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#713A48] text-[#FFFDFA] text-[10px] font-semibold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center leading-none pointer-events-none aw-badge-counter">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden lg:inline text-xs font-medium text-[#302B28] hover:text-[#713A48] whitespace-nowrap aw-bag-label">
              Bag ({cartCount})
            </span>
          </Link>
        </div>
      </div>

      {/* Quick Search Bar Drawer (when search is toggled) */}
      {searchOpen && (
        <div className="border-t border-b border-[#D8CFC6] bg-[#FFFDFA] py-4 px-4 sm:px-12 transition-all">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-[700px] mx-auto flex items-center gap-3"
          >
            <button
              type="submit"
              className="p-0 bg-transparent border-none cursor-pointer flex-shrink-0"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5 text-[#713A48]" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dresses, knitwear, coats, co-ords..."
              className="flex-1 bg-transparent text-[14px] text-[#302B28] placeholder-[#69615B] outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#69615B] hover:text-[#302B28] text-xs cursor-pointer flex-shrink-0"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              className="p-1 text-[#69615B] hover:text-[#302B28] cursor-pointer flex-shrink-0"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 3. Departments Navigation Bar & Mega Menu Wrapper (Desktop - Figma #28:16) */}
      <div
        className="hidden lg:block relative z-40"
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <nav className="aw-desktop-dept-nav">
          <div className="max-w-[1440px] mx-auto px-12 py-3.5 flex items-center justify-center gap-9">
            <Link
              href="/"
              className={`text-[13px] tracking-wide transition-colors py-1 cursor-pointer ${
                pathname === "/"
                  ? "text-[#713A48] font-medium border-b-2 border-[#713A48]"
                  : "text-[#302B28] hover:text-[#713A48]"
              }`}
            >
              Home
            </Link>
            {enabledCategories.map((category) => {
              const isWomen = category.id === "women";
              if (isWomen) {
                return (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                  >
                    <button
                      type="button"
                      onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                      className={`text-[13px] tracking-wide transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                        megaMenuOpen
                          ? "text-[#713A48] font-medium border-b-2 border-[#713A48]"
                          : "text-[#302B28] hover:text-[#713A48]"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-[10px] text-[#69615B]">
                        {megaMenuOpen ? "▴" : "▾"}
                      </span>
                    </button>
                  </div>
                );
              }

              return (
                <div key={category.id} className="relative">
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-[13px] tracking-wide transition-colors py-1 text-[#302B28] hover:text-[#713A48]"
                  >
                    {category.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Women Mega Menu */}
        <WomenMegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Header CSS System */}
      <style>{`
        .aw-header-container {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 20px 48px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
        }
        .aw-header-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .aw-desktop-region {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #69615B;
          white-space: nowrap;
        }
        .aw-desktop-region:hover {
          color: #302B28;
        }
        .aw-mobile-hamburger {
          display: none;
        }
        .aw-header-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .aw-desktop-logo {
          display: block;
        }
        .aw-mobile-logo {
          display: none;
        }
        .aw-header-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 24px;
          color: #302B28;
        }
        .aw-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #302B28;
          text-decoration: none;
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .aw-action-btn:hover {
          color: #713A48;
        }
        .aw-action-label {
          font-size: 13px;
          color: #69615B;
          font-weight: 400;
          white-space: nowrap;
        }
        .aw-action-btn:hover .aw-action-label {
          color: #713A48;
        }
        .aw-bag-label {
          font-size: 13px;
          color: #302B28;
          font-weight: 500;
          white-space: nowrap;
        }
        .aw-action-btn:hover .aw-bag-label {
          color: #713A48;
        }
        .aw-icon-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        .aw-badge-counter {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: #713A48;
          color: #FFFDFA;
          font-size: 10px;
          font-weight: 600;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
        }
        .aw-desktop-dept-nav {
          display: block;
          border-top: 1px solid #D8CFC6;
          border-bottom: 1px solid #D8CFC6;
          background-color: #F8F5EF;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1023px) {
          .aw-header-container {
            padding: 12px 20px;
          }
          .aw-desktop-region {
            display: none !important;
          }
          .aw-mobile-hamburger {
            display: flex !important;
          }
          .aw-desktop-logo {
            display: none !important;
          }
          .aw-mobile-logo {
            display: block !important;
          }
          .aw-desktop-dept-nav {
            display: none !important;
          }
          .aw-action-label {
            display: none !important;
          }
          .aw-bag-label {
            display: none !important;
          }
          .aw-account-link {
            display: none !important;
          }
          .aw-header-right {
            gap: 16px;
          }
        }

        @media (max-width: 1279px) and (min-width: 1024px) {
          .aw-header-container {
            padding: 16px 32px;
          }
          .aw-header-right {
            gap: 16px;
          }
        }
      `}</style>
    </header>
  );
}
