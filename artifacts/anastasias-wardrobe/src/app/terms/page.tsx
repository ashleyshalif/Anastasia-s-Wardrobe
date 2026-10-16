"use client";

import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-[850px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:underline text-inherit">Home</Link>
          <span>/</span>
          <span className="text-[#302B28]">Terms of Service</span>
        </nav>

        {/* Content Card */}
        <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-8 sm:p-12 shadow-2xs">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
            LEGAL
          </span>
          <h1 className="font-editorial text-[32px] sm:text-[40px] text-[#302B28] mb-6">
            Terms of Service
          </h1>
          <p className="text-[13px] text-[#69615B] mb-8 pb-6 border-b border-[#D8CFC6]">
            Effective Date: October 2026 · Anastasia's Wardrobe Atelier Private Limited
          </p>

          <div className="space-y-8 text-[14px] text-[#302B28] leading-relaxed font-sans">
            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">1. Atelier Purchases & Authenticity</h2>
              <p className="text-[#69615B]">
                All garments purchased on Anastasia's Wardrobe are authentic, handcrafted pieces crafted under rigorous European quality standards. All orders are subject to acceptance and availability.
              </p>
            </section>

            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">2. Pricing & Currency</h2>
              <p className="text-[#69615B]">
                Prices are listed in Indian Rupees (INR ₹) and include all applicable taxes (12% Goods and Services Tax). Complimentary shipping applies to orders above ₹4,999.
              </p>
            </section>

            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">3. 30-Day Doorstep Returns Policy</h2>
              <p className="text-[#69615B]">
                Returns and exchanges must be scheduled within 30 days of parcel delivery. Garments must be unworn, unwashed, and returned in their original packaging with atelier swing tags and security ribbons undamaged.
              </p>
            </section>

            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">4. Contact & Jurisdiction</h2>
              <p className="text-[#69615B]">
                These terms are governed by the laws of India, with exclusive jurisdiction in the courts of Mumbai. For inquiries, contact hello@anastasiaswardrobe.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
