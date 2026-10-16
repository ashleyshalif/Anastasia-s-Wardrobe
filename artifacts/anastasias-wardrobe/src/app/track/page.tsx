"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { OrderHistoryItem } from "@/types/account";

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<OrderHistoryItem | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    setSearched(true);
    // Find matching order in store
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase().includes(clean) ||
        (o.trackingNumber && o.trackingNumber.toUpperCase().includes(clean))
    );

    if (found) {
      setMatchedOrder(found);
    } else {
      // Mock order matching for realistic demonstration if query entered
      setMatchedOrder({
        orderNumber: clean.startsWith("AW-") ? clean : `AW-${clean}`,
        date: "October 14, 2026",
        status: "Dispatched",
        trackingNumber: clean.startsWith("BD-") ? clean : "BD-88421903",
        trackingCourier: "Blue Dart Express",
        estimatedDelivery: "October 17, 2026",
        returnEligibleUntil: "November 16, 2026",
        deliveryMethod: "Blue Dart Express",
        currency: "INR",
        items: [
          {
            id: "trk-item-1",
            product: {
              id: "aw-silk-blouse",
              name: "The Aurelia Silk Bow Blouse",
              slug: "aurelia-silk-blouse",
              description: "Fluid mulberry silk with romantic neck bow.",
              price: 8490,
              currency: "INR",
              category: "women",
              department: "Women",
              image: "/images/cardigan.png",
              color: "Champagne Cream",
              sizes: ["S", "M", "L"],
              inStock: true,
            },
            quantity: 1,
            size: "M",
            color: "Champagne Cream",
          },
        ],
        subtotal: 8490,
        deliveryFee: 0,
        total: 8490,
        address: {
          firstName: "Maya",
          lastName: "Kapoor",
          email: "maya.kapoor@example.com",
          addressLine1: "14 Altamount Road, Cumballa Hill",
          city: "Mumbai",
          postcode: "400026",
          country: "India",
          phone: "+91 98200 12345",
        },
        paymentMethod: "Credit Card (Visa)",
      });
    }
  };

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:underline text-inherit">Home</Link>
          <span>/</span>
          <span className="text-[#302B28]">Track Parcel</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-[640px] mx-auto mb-10">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
            LIVE COURIER TRACKING
          </span>
          <h1 className="font-editorial text-[36px] sm:text-[44px] text-[#302B28] leading-tight mb-3">
            Track your wardrobe parcel
          </h1>
          <p className="text-[15px] text-[#69615B] leading-relaxed">
            Enter your Anastasia’s Wardrobe order reference (e.g. <strong>AW-2026-1042</strong>) or Blue Dart AWB to track real-time delivery progress.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-8 shadow-2xs mb-10">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#69615B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order Number (AW-2026-1042) or Courier AWB"
                required
                className="w-full pl-11 pr-4 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Truck className="w-4 h-4" />
              <span>Track Parcel</span>
            </button>
          </form>

          {/* Quick Demo Pill */}
          <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[12px] text-[#69615B]">
            <span>Try sample tracking reference:</span>
            <button
              type="button"
              onClick={() => {
                setQuery("AW-2026-1042");
              }}
              className="text-[#713A48] hover:underline font-mono font-medium"
            >
              AW-2026-1042
            </button>
          </div>
        </div>

        {/* Results Display */}
        {searched && matchedOrder && (
          <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-8 shadow-2xs mb-10">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#D8CFC6] gap-3">
              <div>
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-1">
                  PARCEL IN TRANSIT · {matchedOrder.trackingCourier}
                </span>
                <h2 className="font-editorial text-[26px] text-[#302B28]">
                  {matchedOrder.orderNumber}
                </h2>
                <p className="text-[13px] text-[#69615B] mt-0.5">
                  Courier AWB: <strong className="text-[#302B28] font-mono">{matchedOrder.trackingNumber}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[12px] uppercase tracking-wider font-semibold px-3 py-1 bg-[#FAF5EE] text-[#713A48] border border-[#713A48]/30">
                  {matchedOrder.status}
                </span>
                <p className="text-[12px] text-[#69615B] mt-1.5">
                  Estimated Delivery: <strong>{matchedOrder.estimatedDelivery}</strong>
                </p>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="py-8 border-b border-[#D8CFC6]">
              <h3 className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium mb-6">
                Real-Time Courier Milestones
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-[12px]">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#3E6545] text-[#FFFDFA] flex items-center justify-center mb-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <strong className="text-[#302B28]">Order Placed</strong>
                  <span className="text-[11px] text-[#69615B]">{matchedOrder.date}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#3E6545] text-[#FFFDFA] flex items-center justify-center mb-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <strong className="text-[#302B28]">Handcrafted & Checked</strong>
                  <span className="text-[11px] text-[#69615B]">Mumbai Atelier</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#713A48] text-[#FFFDFA] flex items-center justify-center mb-2 shadow-xs ring-4 ring-[#713A48]/20">
                    <Truck className="w-4 h-4" />
                  </div>
                  <strong className="text-[#302B28]">With Courier</strong>
                  <span className="text-[11px] text-[#713A48] font-medium">In Transit</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#EAE4D9] text-[#69615B] flex items-center justify-center mb-2 shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <strong className="text-[#69615B]">Delivered</strong>
                  <span className="text-[11px] text-[#69615B]">{matchedOrder.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px]">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium mb-1">
                  Destination Address
                </p>
                <p className="text-[#302B28] font-medium">{matchedOrder.address.firstName} {matchedOrder.address.lastName}</p>
                <p className="text-[#69615B]">{matchedOrder.address.addressLine1}, {matchedOrder.address.city} {matchedOrder.address.postcode}</p>
              </div>

              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-[#713A48] text-[#713A48] hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors text-[13px] font-medium whitespace-nowrap"
              >
                <span>View in Customer Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Client Support Help */}
        <div className="p-6 bg-[#FAF8F5] border border-[#D8CFC6] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-editorial text-[18px] text-[#302B28]">
              Need to reschedule delivery or change address?
            </h4>
            <p className="text-[13px] text-[#69615B] mt-0.5">
              Contact our client care concierge with your order reference.
            </p>
          </div>
          <Link
            href="/contact"
            className="text-[13px] text-[#713A48] font-medium hover:underline whitespace-nowrap"
          >
            Contact Client Concierge →
          </Link>
        </div>
      </div>
    </div>
  );
}
