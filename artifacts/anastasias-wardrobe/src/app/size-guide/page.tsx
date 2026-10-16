"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Ruler, HelpCircle, Sparkles, ArrowRight } from "lucide-react";

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<"women" | "girls">("women");

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:underline text-inherit">Home</Link>
          <span>/</span>
          <span className="text-[#302B28]">Size & Fit Guide</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-[700px] mx-auto mb-12">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
            PERFECT SILHOUETTES
          </span>
          <h1 className="font-editorial text-[36px] sm:text-[46px] text-[#302B28] leading-tight mb-4">
            Size & Fit Guide
          </h1>
          <p className="text-[15px] text-[#69615B] leading-relaxed">
            Every garment at Anastasia’s Wardrobe is patterned for effortless grace and tactile comfort.
            Use our sizing tables below to find your tailored match.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex border border-[#D8CFC6] bg-[#FFFDFA] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("women")}
              className={`px-6 py-2 text-[13px] font-medium tracking-wide transition-colors cursor-pointer ${
                activeTab === "women"
                  ? "bg-[#713A48] text-[#FFFDFA]"
                  : "text-[#69615B] hover:text-[#302B28]"
              }`}
            >
              Women's Atelier Collection
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("girls")}
              className={`px-6 py-2 text-[13px] font-medium tracking-wide transition-colors cursor-pointer ${
                activeTab === "girls"
                  ? "bg-[#713A48] text-[#FFFDFA]"
                  : "text-[#69615B] hover:text-[#302B28]"
              }`}
            >
              Girls 2–12 Years
            </button>
          </div>
        </div>

        {/* Size Tables */}
        {activeTab === "women" ? (
          <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-10 shadow-2xs mb-12">
            <h2 className="font-editorial text-[24px] text-[#302B28] mb-2">
              Women's Sizing (Standard Garment Proportions)
            </h2>
            <p className="text-[13px] text-[#69615B] mb-6">
              All body measurements are in inches. If you fall between sizes, we recommend sizing up for structured pieces, or your typical size for relaxed knitwear.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#713A48] text-[#713A48] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">UK / India</th>
                    <th className="py-3 px-4">US</th>
                    <th className="py-3 px-4">EU</th>
                    <th className="py-3 px-4">Bust (in)</th>
                    <th className="py-3 px-4">Waist (in)</th>
                    <th className="py-3 px-4">Hip (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8CFC6] text-[#302B28]">
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">XS</td>
                    <td className="py-3.5 px-4">6 – 8</td>
                    <td className="py-3.5 px-4">2 – 4</td>
                    <td className="py-3.5 px-4">34</td>
                    <td className="py-3.5 px-4">31 – 32.5</td>
                    <td className="py-3.5 px-4">24 – 25.5</td>
                    <td className="py-3.5 px-4">34 – 35.5</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">S</td>
                    <td className="py-3.5 px-4">8 – 10</td>
                    <td className="py-3.5 px-4">4 – 6</td>
                    <td className="py-3.5 px-4">36</td>
                    <td className="py-3.5 px-4">33 – 34.5</td>
                    <td className="py-3.5 px-4">26 – 27.5</td>
                    <td className="py-3.5 px-4">36 – 37.5</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">M</td>
                    <td className="py-3.5 px-4">10 – 12</td>
                    <td className="py-3.5 px-4">6 – 8</td>
                    <td className="py-3.5 px-4">38</td>
                    <td className="py-3.5 px-4">35 – 36.5</td>
                    <td className="py-3.5 px-4">28 – 29.5</td>
                    <td className="py-3.5 px-4">38 – 39.5</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">L</td>
                    <td className="py-3.5 px-4">12 – 14</td>
                    <td className="py-3.5 px-4">8 – 10</td>
                    <td className="py-3.5 px-4">40</td>
                    <td className="py-3.5 px-4">37 – 39</td>
                    <td className="py-3.5 px-4">30 – 32</td>
                    <td className="py-3.5 px-4">40 – 42</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">XL</td>
                    <td className="py-3.5 px-4">14 – 16</td>
                    <td className="py-3.5 px-4">10 – 12</td>
                    <td className="py-3.5 px-4">42</td>
                    <td className="py-3.5 px-4">39.5 – 42</td>
                    <td className="py-3.5 px-4">32.5 – 35</td>
                    <td className="py-3.5 px-4">42.5 – 45</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-10 shadow-2xs mb-12">
            <h2 className="font-editorial text-[24px] text-[#302B28] mb-2">
              Girls Sizing (Age 2 to 12 Years)
            </h2>
            <p className="text-[13px] text-[#69615B] mb-6">
              Children develop at unique paces. We suggest checking height and chest measurements rather than relying solely on age.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#713A48] text-[#713A48] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Age Bracket</th>
                    <th className="py-3 px-4">Height (cm)</th>
                    <th className="py-3 px-4">Chest (in)</th>
                    <th className="py-3 px-4">Waist (in)</th>
                    <th className="py-3 px-4">Fit Characteristics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8CFC6] text-[#302B28]">
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">2–3 Years</td>
                    <td className="py-3.5 px-4">92 – 98 cm</td>
                    <td className="py-3.5 px-4">20.5 – 21.5"</td>
                    <td className="py-3.5 px-4">20 – 20.5"</td>
                    <td className="py-3.5 px-4 text-[#69615B]">Gentle elasticated waist, lined cotton</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">4–5 Years</td>
                    <td className="py-3.5 px-4">104 – 110 cm</td>
                    <td className="py-3.5 px-4">22 – 23"</td>
                    <td className="py-3.5 px-4">21 – 21.5"</td>
                    <td className="py-3.5 px-4 text-[#69615B]">Knee-length flared hem</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">6–7 Years</td>
                    <td className="py-3.5 px-4">116 – 122 cm</td>
                    <td className="py-3.5 px-4">23.5 – 24.5"</td>
                    <td className="py-3.5 px-4">22 – 22.5"</td>
                    <td className="py-3.5 px-4 text-[#69615B]">Tailored bodice with room for growth</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">8–9 Years</td>
                    <td className="py-3.5 px-4">128 – 134 cm</td>
                    <td className="py-3.5 px-4">25 – 26.5"</td>
                    <td className="py-3.5 px-4">23 – 24"</td>
                    <td className="py-3.5 px-4 text-[#69615B]">Classic silhouette with sash closure</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold">10–12 Years</td>
                    <td className="py-3.5 px-4">140 – 152 cm</td>
                    <td className="py-3.5 px-4">27 – 29.5"</td>
                    <td className="py-3.5 px-4">24.5 – 26"</td>
                    <td className="py-3.5 px-4 text-[#69615B]">Clean architectural cut</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Measuring Tips Card */}
        <div className="p-8 bg-[#FFFDFA] border border-[#D8CFC6] grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 shadow-2xs">
          <div>
            <h3 className="font-editorial text-[18px] text-[#302B28] mb-1">1. Bust / Chest</h3>
            <p className="text-[13px] text-[#69615B] leading-relaxed">
              Wrap the measuring tape horizontally around the fullest part of your bust, keeping the tape level and relaxed.
            </p>
          </div>
          <div>
            <h3 className="font-editorial text-[18px] text-[#302B28] mb-1">2. Natural Waist</h3>
            <p className="text-[13px] text-[#69615B] leading-relaxed">
              Measure around your natural waistline, usually the narrowest point of your torso, keeping one finger between tape and body.
            </p>
          </div>
          <div>
            <h3 className="font-editorial text-[18px] text-[#302B28] mb-1">3. Hips</h3>
            <p className="text-[13px] text-[#69615B] leading-relaxed">
              Stand with your heels together and measure around the fullest curve of your hips and seat.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 bg-[#FAF8F5] border border-[#713A48] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#713A48] text-[#FFFDFA] flex items-center justify-center flex-shrink-0">
              <Ruler className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-editorial text-[20px] text-[#302B28]">
                Complimentary 30-Day Size Exchange
              </h3>
              <p className="text-[13px] text-[#69615B]">
                Ordered a size that doesn't fit like a glove? We provide doorstep courier exchanges at zero additional cost.
              </p>
            </div>
          </div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors whitespace-nowrap shadow-xs"
          >
            <span>Manage Orders & Returns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
