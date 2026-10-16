"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getEnabledCategories } from "@/config/catalog";

export function Footer() {
  const pathname = usePathname();
  const enabledCategories = getEnabledCategories();

  if (pathname === "/checkout") {
    return (
      <footer className="w-full bg-[#EAE4D9] border-t border-[#D8CFC6] text-[#69615B] py-6 text-xs text-center mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Anastasia’s Wardrobe · Thoughtfully Chosen Styles</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Secure 256-Bit SSL Encrypted</span>
            <span>·</span>
            <Link href="/privacy" className="hover:text-[#302B28] transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#302B28] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#EAE4D9] border-t border-[#D8CFC6] text-[#302B28] mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12 lg:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#D8CFC6]">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <Link href="/" className="block -ml-2" aria-label="Anastasia's Wardrobe Home">
              <Image
                src="/images/logo.png"
                alt="Anastasia's Wardrobe"
                width={1333}
                height={856}
                style={{ height: "100px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <p className="font-editorial text-[20px] text-[#302B28] leading-[1.3] max-w-[320px]">
              Beautifully chosen.
              <br />
              <span className="italic">For every chapter of her life.</span>
            </p>
            <p className="text-[13px] text-[#69615B] leading-[1.5] max-w-[340px]">
              Clothes for the days you’ll remember. Thoughtful silhouettes, tactile fabrics and timeless European design.
            </p>
          </div>

          {/* Explore Column (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h4 className="text-[11px] font-medium tracking-[0.15em] text-[#713A48] uppercase mb-1">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-[13px]">
              {enabledCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-[#302B28] hover:text-[#713A48] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Here to Help Column (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h4 className="text-[11px] font-medium tracking-[0.15em] text-[#713A48] uppercase mb-1">
              HERE TO HELP
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link
                  href="/support"
                  className="text-[#302B28] hover:text-[#713A48] transition-colors"
                >
                  Support hub
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-[#302B28] hover:text-[#713A48] transition-colors"
                >
                  Size guide
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-[#302B28] hover:text-[#713A48] transition-colors"
                >
                  Shipping & returns
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="text-[#302B28] hover:text-[#713A48] transition-colors"
                >
                  Track your order
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#302B28] hover:text-[#713A48] transition-colors"
                >
                  Contact support
                </Link>
              </li>
            </ul>
          </div>

          {/* Region & Contact Column (2 cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-4 text-[13px]">
            <div>
              <h4 className="text-[11px] font-medium tracking-[0.15em] text-[#713A48] uppercase mb-2">
                REGION & CURRENCY
              </h4>
              <p className="text-[#302B28] font-medium">India</p>
              <p className="text-[#69615B] text-[12px]">English · INR ₹</p>
            </div>

            <div className="pt-2">
              <h4 className="text-[11px] font-medium tracking-[0.15em] text-[#713A48] uppercase mb-2">
                ASSISTANCE
              </h4>
              <p className="text-[#302B28] text-[12px]">hello@anastasiaswardrobe.com</p>
              <p className="text-[#69615B] text-[11px] mt-0.5">Monday–Saturday · 10 am–6 pm IST</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Figma #29:390 / #29:521) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#69615B]">
          <p>
            © {new Date().getFullYear()} Anastasia’s Wardrobe · Clothes for the days you’ll remember.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#302B28] transition-colors">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#302B28] transition-colors">
              Terms
            </Link>
            <span>·</span>
            {/* Payment badges */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#69615B]">
              <span className="px-1.5 py-0.5 border border-[#D8CFC6] bg-[#FFFDFA] text-[10px]">
                Visa
              </span>
              <span className="px-1.5 py-0.5 border border-[#D8CFC6] bg-[#FFFDFA] text-[10px]">
                Mastercard
              </span>
              <span className="px-1.5 py-0.5 border border-[#D8CFC6] bg-[#FFFDFA] text-[10px]">
                RuPay
              </span>
              <span className="px-1.5 py-0.5 border border-[#D8CFC6] bg-[#FFFDFA] text-[10px]">
                UPI
              </span>
              <span className="px-1.5 py-0.5 border border-[#D8CFC6] bg-[#FFFDFA] text-[10px]">
                NetBanking
              </span>
              <span className="px-1.5 py-0.5 border border-[#D8CFC6] bg-[#FFFDFA] text-[10px]">
                Apple Pay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
