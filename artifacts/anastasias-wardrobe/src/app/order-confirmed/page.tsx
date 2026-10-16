"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Gift,
  Heart,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { OrderDetails } from "@/types/product";
import { CURRENCY, formatPrice } from "@/config/currency";

export default function OrderConfirmedPage() {
  const { lastOrder } = useStore();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  // Default fallback mock order if user navigates directly
  const fallbackOrder: OrderDetails = {
    orderNumber: "AW-84192",
    date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    items: [
      {
        id: "prod-sunday-cardigan-sample",
        product: {
          id: "prod-sunday-cardigan",
          slug: "sunday-wool-cardigan",
          name: "Sunday wool cardigan",
          category: "women",
          department: "Women",
          price: 6490,
          currency: "INR",
          color: "Oat",
          sizes: ["M"],
          image: "/images/cardigan.png",
          description: "Spun from heavyweight merino wool.",
          inStock: true,
        },
        size: "M",
        color: "Oat",
        quantity: 1,
      },
    ],
    subtotal: 6490,
    deliveryFee: 0,
    deliveryMethod: "Standard courier (Blue Dart / Delhivery Express)",
    estimatedDelivery: "3–5 working days",
    total: 6490,
    currency: "INR",
    address: {
      firstName: "Maya",
      lastName: "Kapoor",
      email: "maya.kapoor@example.com",
      phone: "+91 98200 12345",
      addressLine1: "18 Altamount Road",
      city: "Mumbai",
      postcode: "400026",
      country: "India",
    },
    paymentMethod: "UPI / Credit Card",
    cardLast4: "4242",
  };

  useEffect(() => {
    if (lastOrder) {
      setOrder(lastOrder);
    } else {
      setOrder(fallbackOrder);
    }
  }, [lastOrder]);

  const displayOrder = order || fallbackOrder;

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-12 lg:py-16">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header (Figma frame #28:3687) */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#EFE9DF] border border-[#D8CFC6] flex items-center justify-center text-[#713A48]">
            <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
          </div>

          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2">
            ORDER CONFIRMED · {displayOrder.orderNumber}
          </span>

          <h1 className="font-editorial text-[36px] sm:text-[46px] text-[#302B28] mb-3 leading-tight">
            Thank you for your order
          </h1>

          <p className="text-[15px] text-[#69615B] max-w-[560px] mx-auto leading-relaxed">
            Paid {formatPrice(displayOrder.total)} {CURRENCY.code} with {displayOrder.paymentMethod}
            {displayOrder.cardLast4 ? ` ending ${displayOrder.cardLast4}` : ""}. A confirmation
            email and receipt have been sent to{" "}
            <strong className="text-[#302B28] font-semibold">{displayOrder.address.email}</strong>.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="flex flex-col gap-8">
          {/* Delivery & Timeline Card (Figma #28:3641) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-7 bg-[#FFFDFA] border border-[#D8CFC6]">
            {/* Arrival Date */}
            <div className="flex items-start gap-3.5">
              <Calendar className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block mb-1">
                  Estimated arrival
                </span>
                <p className="text-[15px] font-semibold text-[#302B28]">
                  {displayOrder.estimatedDelivery}
                </p>
                <p className="text-[12px] text-[#69615B] mt-0.5">
                  {displayOrder.deliveryMethod}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block mb-1">
                  Delivery address
                </span>
                <p className="text-[14px] text-[#302B28] leading-snug">
                  {displayOrder.address.firstName} {displayOrder.address.lastName}
                  <br />
                  {displayOrder.address.addressLine1}
                  {displayOrder.address.addressLine2 ? `, ${displayOrder.address.addressLine2}` : ""}
                  <br />
                  {displayOrder.address.city} {displayOrder.address.postcode}
                  <br />
                  {displayOrder.address.country}
                </p>
              </div>
            </div>

            {/* Tracking Status */}
            <div className="flex items-start gap-3.5">
              <Package className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block mb-1">
                  Parcel status
                </span>
                <p className="text-[14px] text-[#3E6545] font-medium">
                  Preparing at boutique atelier
                </p>
                <p className="text-[12px] text-[#69615B] mt-0.5">
                  We’ll send an email with a live courier tracking link once dispatched.
                </p>
              </div>
            </div>
          </div>

          {/* Ordered Garments Table */}
          <div className="p-6 sm:p-7 bg-[#FFFDFA] border border-[#D8CFC6]">
            <h2 className="font-editorial text-[22px] text-[#302B28] mb-5 pb-3 border-b border-[#F0EAE1]">
              Items ordered ({displayOrder.items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            <div className="divide-y divide-[#F0EAE1]">
              {displayOrder.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 bg-[#EAE4D9] border border-[#D8CFC6] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-editorial text-[17px] text-[#302B28] leading-snug">
                        {item.product.name}
                      </h3>
                      <p className="text-[13px] text-[#69615B] mt-0.5">
                        {item.color} · Size {item.size} · Quantity {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="text-[15px] font-medium text-[#302B28]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Handwritten Gift Note (if present) */}
            {displayOrder.giftNote && (
              <div className="mt-5 p-4 bg-[#FAF8F5] border border-[#D8CFC6] flex items-start gap-3">
                <Gift className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[12px] uppercase tracking-wider text-[#713A48] font-medium block">
                    Handwritten gift note requested
                  </span>
                  <p className="text-[13px] italic text-[#302B28] mt-1">
                    “{displayOrder.giftNote}”
                  </p>
                </div>
              </div>
            )}

            {/* Total Recap */}
            <div className="mt-6 pt-5 border-t border-[#D8CFC6] flex flex-col gap-2 text-[14px]">
              <div className="flex justify-between text-[#302B28]">
                <span>Subtotal</span>
                <span>{formatPrice(displayOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#302B28]">
                <span>Delivery</span>
                <span>
                  {displayOrder.deliveryFee === 0 ? "Complimentary" : formatPrice(displayOrder.deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-[#F0EAE1] flex justify-between items-baseline">
                <span className="font-editorial text-[18px] text-[#302B28]">Total paid</span>
                <span className="font-editorial text-[24px] font-semibold text-[#302B28]">
                  {formatPrice(displayOrder.total)} {CURRENCY.code}
                </span>
              </div>
            </div>
          </div>

          {/* Account Prompt Card (Figma frame #28:3669) */}
          <div className="p-6 sm:p-8 bg-[#FFFDFA] border border-[#D8CFC6] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-[500px]">
              <h2 className="font-editorial text-[24px] text-[#302B28] mb-2">
                Keep your wardrobe together
              </h2>
              <p className="text-[14px] text-[#69615B] leading-relaxed">
                Create an account using{" "}
                <strong className="text-[#302B28]">{displayOrder.address.email}</strong> to review
                order history, request easy 30-day returns, and access your saved pieces anytime.
              </p>
            </div>

            <Link
              href="/account"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#713A48] text-[#713A48] text-[14px] font-medium tracking-wide hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors text-center whitespace-nowrap"
            >
              Create an account
            </Link>
          </div>

          {/* Navigation Action Buttons - Fixed Responsive Alignment without Overlaps (User item #3) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
            <Link
              href="/category/women"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 bg-[#713A48] text-[#FFFDFA] border border-[#713A48] text-[14px] font-medium tracking-wide hover:bg-[#582D38] transition-colors text-center shadow-xs"
            >
              <span>Continue exploring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/wishlist"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 bg-[#FFFDFA] border border-[#713A48] text-[#713A48] text-[14px] font-medium tracking-wide hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors text-center shadow-xs"
            >
              <Heart className="w-4 h-4 text-inherit" />
              <span>View saved pieces</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
