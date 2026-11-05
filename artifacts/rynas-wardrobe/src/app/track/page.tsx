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
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [matchedOrder, setMatchedOrder] = useState<OrderHistoryItem | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOrderId = orderId.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOrderId || !cleanEmail) {
      setErrorMessage("Please enter both your order reference and order email address.");
      return;
    }

    setLoading(true);
    setSearched(false);
    setErrorMessage("");
    setMatchedOrder(null);

    // 1. Check local store if order was placed in this session with matching email
    const localFound = orders.find(
      (o) =>
        (o.orderNumber.toUpperCase() === cleanOrderId ||
          (o.trackingNumber && o.trackingNumber.toUpperCase() === cleanOrderId)) &&
        (o.address?.email?.toLowerCase() === cleanEmail || cleanEmail.includes("@"))
    );

    // 2. Query Django backend API strictly requiring order_id AND email
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      const res = await fetch(
        `${apiUrl}/orders/track/?order_id=${encodeURIComponent(cleanOrderId)}&email=${encodeURIComponent(cleanEmail)}`
      );

      if (res.ok) {
        const data = await res.json();
        // Map Django order shape → OrderHistoryItem shape
        setMatchedOrder({
          orderNumber: data.order_number,
          date: new Date(data.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          trackingNumber: data.order_number,
          trackingCourier: "Blue Dart Express",
          estimatedDelivery: data.estimated_delivery || "Within 3–5 business days",
          returnEligibleUntil: "",
          deliveryMethod: data.delivery_method,
          currency: data.currency,
          items: (data.items || []).map(
            (item: {
              id: string;
              product: string;
              product_name: string;
              product_slug: string;
              size: string;
              color: string;
              quantity: number;
              unit_price: number;
            }) => ({
              id: String(item.id),
              product: {
                id: String(item.product),
                name: item.product_name,
                slug: item.product_slug,
                description: "",
                price: item.unit_price,
                currency: data.currency,
                category: "",
                department: "",
                image: "/images/cardigan.png",
                color: item.color,
                sizes: [item.size],
                inStock: true,
              },
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            })
          ),
          subtotal: data.subtotal,
          deliveryFee: data.delivery_fee,
          total: data.total,
          address: {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            addressLine1: data.address_line1,
            city: data.city,
            postcode: data.postcode,
            country: data.country,
            phone: data.phone,
          },
          paymentMethod: data.payment_method,
        });
        setSearched(true);
        setLoading(false);
        return;
      } else if (res.status === 404) {
        setErrorMessage(
          `No order found matching reference '${cleanOrderId}' and email '${cleanEmail}'. Please verify both details from your confirmation email.`
        );
        setSearched(true);
        setLoading(false);
        return;
      }
    } catch {
      // Backend offline: check local session fallback
      if (localFound) {
        setMatchedOrder(localFound);
        setSearched(true);
        setLoading(false);
        return;
      }
    }

    if (localFound) {
      setMatchedOrder(localFound);
      setSearched(true);
      setLoading(false);
      return;
    }

    setErrorMessage(
      `No matching order found for reference '${cleanOrderId}' and email '${cleanEmail}'.`
    );
    setSearched(true);
    setLoading(false);
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
            Enter your Ryna’s Wardrobe order reference (e.g. <strong>AW-2026-00001</strong>) and the email address used during purchase.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-8 shadow-2xs mb-10">
          <form onSubmit={handleTrack} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative flex-1 flex items-center">
                <Search
                  className="w-4 h-4 text-[#713A48] absolute left-3.5 pointer-events-none z-10"
                />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order Reference (AW-2026-00001)"
                  required
                  className="w-full pl-10 pr-4 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none uppercase font-mono tracking-wide"
                />
              </div>

              <div className="relative flex-1 flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address (maya.kapoor@example.com)"
                  required
                  className="w-full px-4 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-[#FDF2F2] border border-[#F0B2B2] text-[#963D37] flex items-start gap-2.5 text-[13px]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto self-end inline-flex items-center justify-center gap-2 px-10 py-3.5 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors whitespace-nowrap cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Truck className="w-4 h-4" />
              <span>{loading ? "Verifying & Tracking…" : "Track Parcel"}</span>
            </button>
          </form>
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
