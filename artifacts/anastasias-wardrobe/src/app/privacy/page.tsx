"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-[850px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:underline text-inherit">Home</Link>
          <span>/</span>
          <span className="text-[#302B28]">Privacy Policy</span>
        </nav>

        {/* Content Card */}
        <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-8 sm:p-12 shadow-2xs">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
            LEGAL & CLIENT TRUST
          </span>
          <h1 className="font-editorial text-[32px] sm:text-[40px] text-[#302B28] mb-6">
            Privacy Policy
          </h1>
          <p className="text-[13px] text-[#69615B] mb-8 pb-6 border-b border-[#D8CFC6]">
            Effective Date: October 2026 · Anastasia's Wardrobe Atelier Private Limited
          </p>

          <div className="space-y-8 text-[14px] text-[#302B28] leading-relaxed font-sans">
            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">1. Our Commitment to Discretion</h2>
              <p className="text-[#69615B]">
                Anastasia's Wardrobe treats the privacy and personal details of our patrons with utmost discretion. We collect information solely to provide personalized atelier garments, doorstep courier logistics, and bespoke seasonal correspondence.
              </p>
            </section>

            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">2. Information We Collect</h2>
              <p className="text-[#69615B]">
                When placing an order or registering for an Atelier Account, we collect contact credentials (name, delivery address, phone number, email) and transaction records. Payment details are processed directly via PCI-DSS compliant banking gateways and are never stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">3. Courier & Logistics Disclosure</h2>
              <p className="text-[#69615B]">
                Your delivery address and phone number are securely shared with our bonded courier partners (Blue Dart Express and Delhivery) exclusively for doorstep dispatch, delivery tracking, and authorized returns.
              </p>
            </section>

            <section>
              <h2 className="font-editorial text-[20px] text-[#302B28] mb-2">4. Your Rights</h2>
              <p className="text-[#69615B]">
                You retain complete control over your data. You may review, modify, or request deletion of your account and saved addresses at any time via your Customer Account or by emailing hello@anastasiaswardrobe.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
