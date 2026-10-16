"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Truck,
  RotateCcw,
  Ruler,
  CreditCard,
  Mail,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "Orders & Shipping",
    q: "How long does shipping take within India?",
    a: "All domestic orders are dispatched from our Mumbai atelier within 24–48 hours. Express deliveries to metro cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Kolkata, Hyderabad) take 2–3 business days. Other destinations generally take 3–5 business days.",
  },
  {
    category: "Orders & Shipping",
    q: "Are shipping and taxes included?",
    a: "Orders above ₹4,999 enjoy complimentary express delivery across India. Standard orders incur a ₹250 flat courier fee. All prices shown across Anastasia's Wardrobe are inclusive of 12% GST.",
  },
  {
    category: "Returns & Exchanges",
    q: "What is your 30-Day Complimentary Return Policy?",
    a: "We offer complimentary 30-day doorstep returns and exchanges for all unworn garments with original atelier tags attached. A Blue Dart courier representative will collect your parcel directly from your home with a tamper-evident satchel.",
  },
  {
    category: "Returns & Exchanges",
    q: "How fast are refunds or store credits processed?",
    a: "Once our atelier team inspects the returned piece (within 24 hours of receipt), original payment refunds reflect within 3–5 business days. Atelier store credits are generated immediately and carry a +10% bonus value.",
  },
  {
    category: "Garment Fit & Sizing",
    q: "How do I choose between sizes?",
    a: "Our garments feature tailored yet relaxed European silhouettes. Please refer to our detailed Size Guide or contact our atelier concierge for bespoke measurements before placing an order.",
  },
  {
    category: "Payments & Security",
    q: "What payment methods are supported?",
    a: "We accept all major credit/debit cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), NetBanking across 50+ Indian banks, and Apple Pay with 256-bit SSL encryption.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Orders & Shipping", "Returns & Exchanges", "Garment Fit & Sizing", "Payments & Security"];

  const filteredFaqs =
    activeCategory === "All"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((f) => f.category === activeCategory);

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:underline text-inherit">Home</Link>
          <span>/</span>
          <span className="text-[#302B28]">Support Hub</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-[700px] mx-auto mb-12">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
            ATELIER CLIENT CARE
          </span>
          <h1 className="font-editorial text-[36px] sm:text-[46px] text-[#302B28] leading-tight mb-4">
            How may we assist your wardrobe?
          </h1>
          <p className="text-[15px] text-[#69615B] leading-relaxed">
            Find immediate answers on deliveries, complimentary doorstep returns, bespoke fit guidance, and order tracking.
          </p>
        </div>

        {/* Quick Topic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link
            href="/shipping-returns"
            className="p-6 bg-[#FFFDFA] border border-[#D8CFC6] hover:border-[#713A48] transition-all group shadow-2xs"
          >
            <Truck className="w-6 h-6 text-[#713A48] mb-3 stroke-[1.5]" />
            <h3 className="font-editorial text-[18px] text-[#302B28] mb-1 group-hover:text-[#713A48] transition-colors">
              Shipping & Delivery
            </h3>
            <p className="text-[12px] text-[#69615B] leading-relaxed">
              Express courier timelines, free shipping thresholds, and tracking.
            </p>
          </Link>

          <Link
            href="/shipping-returns#returns"
            className="p-6 bg-[#FFFDFA] border border-[#D8CFC6] hover:border-[#713A48] transition-all group shadow-2xs"
          >
            <RotateCcw className="w-6 h-6 text-[#713A48] mb-3 stroke-[1.5]" />
            <h3 className="font-editorial text-[18px] text-[#302B28] mb-1 group-hover:text-[#713A48] transition-colors">
              30-Day Returns
            </h3>
            <p className="text-[12px] text-[#69615B] leading-relaxed">
              Complimentary doorstep pickup with Blue Dart and exchange guidance.
            </p>
          </Link>

          <Link
            href="/size-guide"
            className="p-6 bg-[#FFFDFA] border border-[#D8CFC6] hover:border-[#713A48] transition-all group shadow-2xs"
          >
            <Ruler className="w-6 h-6 text-[#713A48] mb-3 stroke-[1.5]" />
            <h3 className="font-editorial text-[18px] text-[#302B28] mb-1 group-hover:text-[#713A48] transition-colors">
              Size & Fit Guide
            </h3>
            <p className="text-[12px] text-[#69615B] leading-relaxed">
              Body measurement charts, conversions, and silhouette notes.
            </p>
          </Link>

          <Link
            href="/contact"
            className="p-6 bg-[#FFFDFA] border border-[#D8CFC6] hover:border-[#713A48] transition-all group shadow-2xs"
          >
            <Mail className="w-6 h-6 text-[#713A48] mb-3 stroke-[1.5]" />
            <h3 className="font-editorial text-[18px] text-[#302B28] mb-1 group-hover:text-[#713A48] transition-colors">
              Direct Atelier Concierge
            </h3>
            <p className="text-[12px] text-[#69615B] leading-relaxed">
              Email or chat with our team in Mumbai for personalized assistance.
            </p>
          </Link>
        </div>

        {/* FAQs Section */}
        <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-10 shadow-2xs mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#D8CFC6] gap-4 mb-6">
            <div>
              <h2 className="font-editorial text-[26px] text-[#302B28]">
                Frequently Asked Questions
              </h2>
              <p className="text-[13px] text-[#69615B]">
                Curated guidance for our bespoke boutique clients.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 text-[12px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#713A48] text-[#FFFDFA] font-medium"
                      : "bg-[#F8F5EF] text-[#302B28] hover:bg-[#EAE4D9]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#D8CFC6]">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 font-editorial text-[18px] text-[#302B28] hover:text-[#713A48] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#69615B] transition-transform flex-shrink-0 ${
                        isOpen ? "rotate-180 text-[#713A48]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-[14px] text-[#69615B] leading-relaxed font-sans pr-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="p-8 bg-[#FAF8F5] border border-[#713A48] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#713A48] text-[#FFFDFA] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-editorial text-[20px] text-[#302B28]">
                Need one-on-one styling or sizing advice?
              </h3>
              <p className="text-[13px] text-[#69615B]">
                Our atelier concierge is available Monday to Saturday, 10:00 AM – 6:00 PM IST.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors whitespace-nowrap shadow-xs"
          >
            <span>Message Atelier Concierge</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
