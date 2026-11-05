"use client";

import React from "react";
import Link from "next/link";
import {
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Gift,
  ArrowRight,
  Package,
} from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:underline text-inherit">Home</Link>
          <span>/</span>
          <span className="text-[#302B28]">Shipping & Returns</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
            SEAMLESS LOGISTICS & CARE
          </span>
          <h1 className="font-editorial text-[36px] sm:text-[46px] text-[#302B28] leading-tight mb-4">
            Shipping & Doorstep Returns
          </h1>
          <p className="text-[15px] text-[#69615B] leading-relaxed">
            Every garment is carefully wrapped in tissue paper and dispatched in our signature rigid boxes.
            We ensure an effortless experience from atelier dispatch to your front door.
          </p>
        </div>

        {/* 2-Column Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Shipping Section */}
          <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#713A48] text-[#FFFDFA] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h2 className="font-editorial text-[26px] text-[#302B28] mb-3">
                Express Domestic Shipping
              </h2>
              <p className="text-[14px] text-[#69615B] leading-relaxed mb-6">
                We partner exclusively with Blue Dart Express and Delhivery to guarantee tracked, rapid deliveries across India.
              </p>

              <div className="space-y-4 border-t border-[#F0EAE1] pt-6 text-[13px]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6545] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#302B28] block">Complimentary Shipping above ₹4,999</strong>
                    <span className="text-[#69615B]">Orders below ₹4,999 incur a flat ₹250 express courier fee.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6545] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#302B28] block">Metro Timelines (2–3 Days)</strong>
                    <span className="text-[#69615B]">Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, and Kolkata.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6545] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#302B28] block">Live Tracking Updates</strong>
                    <span className="text-[#69615B]">Real-time SMS and email updates with direct Blue Dart courier AWB.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D8CFC6]">
              <Link
                href="/track"
                className="text-[13px] font-medium text-[#713A48] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Track an active parcel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Returns Section */}
          <div id="returns" className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#713A48] text-[#FFFDFA] flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h2 className="font-editorial text-[26px] text-[#302B28] mb-3">
                30-Day Doorstep Returns
              </h2>
              <p className="text-[14px] text-[#69615B] leading-relaxed mb-6">
                Try your garments in the comfort of your home. If the fit isn't sublime, we collect the parcel right from your door.
              </p>

              <div className="space-y-4 border-t border-[#F0EAE1] pt-6 text-[13px]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6545] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#302B28] block">No Printing Required</strong>
                    <span className="text-[#69615B]">Courier delivers the security bag and prints the return label on the spot.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6545] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#302B28] block">Size Exchanges or Full Refund</strong>
                    <span className="text-[#69615B]">Exchange size instantly or refund to original payment source in 3–5 business days.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6545] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#302B28] block">+10% Bonus Store Credit</strong>
                    <span className="text-[#69615B]">Opt for atelier store credit and receive an extra 10% credit bonus immediately.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D8CFC6]">
              <Link
                href="/account"
                className="text-[13px] font-medium text-[#713A48] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Initiate a return from your account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Step Return Process */}
        <div className="bg-[#FAF8F5] border border-[#D8CFC6] p-8 sm:p-10 mb-14">
          <h2 className="font-editorial text-[26px] text-[#302B28] text-center mb-8">
            How Doorstep Returns Work in 4 Simple Steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
              <span className="text-[28px] font-editorial text-[#713A48] font-bold block mb-1">01</span>
              <h4 className="font-medium text-[15px] text-[#302B28] mb-1">Request Online</h4>
              <p className="text-[12px] text-[#69615B] leading-relaxed">
                Log into your Atelier Account, find your order, and choose your reason and resolution.
              </p>
            </div>

            <div className="p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
              <span className="text-[28px] font-editorial text-[#713A48] font-bold block mb-1">02</span>
              <h4 className="font-medium text-[15px] text-[#302B28] mb-1">Choose Pickup Window</h4>
              <p className="text-[12px] text-[#69615B] leading-relaxed">
                Select your preferred morning or afternoon collection slot with our Blue Dart representative.
              </p>
            </div>

            <div className="p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
              <span className="text-[28px] font-editorial text-[#713A48] font-bold block mb-1">03</span>
              <h4 className="font-medium text-[15px] text-[#302B28] mb-1">Doorstep Handover</h4>
              <p className="text-[12px] text-[#69615B] leading-relaxed">
                Hand the unworn piece with tags intact to the courier in its original atelier box.
              </p>
            </div>

            <div className="p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
              <span className="text-[28px] font-editorial text-[#713A48] font-bold block mb-1">04</span>
              <h4 className="font-medium text-[15px] text-[#302B28] mb-1">Instant Resolution</h4>
              <p className="text-[12px] text-[#69615B] leading-relaxed">
                Receive your replacement size dispatch or original payment refund within 3–5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 bg-[#FFFDFA] border border-[#713A48] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-editorial text-[22px] text-[#302B28] mb-1">
              Have questions regarding an active delivery?
            </h3>
            <p className="text-[13px] text-[#69615B]">
              Our dispatch team in Mumbai is ready to assist you.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors whitespace-nowrap shadow-xs"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
