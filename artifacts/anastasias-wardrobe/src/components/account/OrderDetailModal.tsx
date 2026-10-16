"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Gift,
  Printer,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  Truck,
} from "lucide-react";
import { OrderHistoryItem } from "@/types/account";
import { formatPrice } from "@/config/currency";

interface OrderDetailModalProps {
  order: OrderHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestReturn: (order: OrderHistoryItem) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onRequestReturn,
}: OrderDetailModalProps) {
  const [showTrackingToast, setShowTrackingToast] = useState(false);
  const scrollBodyRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top every time the modal opens
  useEffect(() => {
    if (isOpen && scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
    if (isOpen) setShowTrackingToast(false);
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isDelivered = order.status === "Delivered";
  const hasReturns = order.returns && order.returns.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FDFBF7] rounded-none shadow-2xl flex flex-col overflow-hidden border border-stone-200 my-auto"
        style={{ maxHeight: "min(90vh, calc(100vh - 3rem))" }}
      >
        {/* Modal Header (Fixed top bar) */}
        <div className="p-6 border-b border-stone-200 shrink-0 flex items-center justify-between bg-[#F8F5EF]">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-1">
              ORDER RECEIPT
            </span>
            <div className="flex items-center gap-3">
              <h2 className="font-editorial text-[24px] sm:text-[28px] text-[#302B28]">
                {order.orderNumber}
              </h2>
              <span
                className={`text-[12px] font-medium px-2.5 py-0.5 border ${
                  order.status === "Delivered"
                    ? "bg-[#EAF2EC] text-[#3E6545] border-[#3E6545]/30"
                    : "bg-[#F5EFE6] text-[#713A48] border-[#713A48]/30"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-[12px] text-[#69615B] mt-1">
              Placed on {order.date}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-[#69615B] hover:text-[#302B28] transition-colors cursor-pointer hidden sm:inline-flex"
              title="Print receipt"
            >
              <Printer className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#69615B] hover:text-[#713A48] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={scrollBodyRef}
          key={order.orderNumber}
          className="p-6 overflow-y-auto space-y-6 grow min-h-0"
          style={{ minHeight: 0, overflowY: "auto" }}
        >
          {/* Timeline Milestones */}
          <div className="p-5 bg-[#FAF8F5] border border-[#D8CFC6]">
            <h3 className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium mb-4">
              Dispatch & Delivery Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 text-center text-[12px] relative">
              {/* Step 1: Confirmed */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#3E6545] text-[#FFFDFA] flex items-center justify-center mb-1.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-[#302B28]">Confirmed</span>
                <span className="text-[11px] text-[#69615B]">{order.date}</span>
              </div>

              {/* Step 2: Boutique Crafted */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#3E6545] text-[#FFFDFA] flex items-center justify-center mb-1.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-[#302B28]">Prepared</span>
                <span className="text-[11px] text-[#69615B]">Atelier Checked</span>
              </div>

              {/* Step 3: Courier Dispatch */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-xs ${
                    isDelivered
                      ? "bg-[#3E6545] text-[#FFFDFA]"
                      : "bg-[#713A48] text-[#FFFDFA]"
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-semibold text-[#302B28]">Dispatched</span>
                <span className="text-[11px] text-[#69615B]">
                  {order.trackingCourier}
                </span>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-xs ${
                    isDelivered
                      ? "bg-[#3E6545] text-[#FFFDFA]"
                      : "bg-[#EAE4D9] text-[#69615B]"
                  }`}
                >
                  {isDelivered ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <span className="font-semibold text-[#302B28]">Delivered</span>
                <span className="text-[11px] text-[#69615B]">
                  {isDelivered ? order.estimatedDelivery : "Estimated: 3–5 days"}
                </span>
              </div>
            </div>

            {/* Courier Reference Box */}
            <div className="mt-4 pt-3 border-t border-[#D8CFC6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px]">
              <span className="text-[#69615B]">
                Courier Reference: <strong className="text-[#302B28]">{order.trackingNumber}</strong> ({order.trackingCourier})
              </span>
              <button
                type="button"
                onClick={() => setShowTrackingToast(!showTrackingToast)}
                className="inline-flex items-center gap-1 text-[#713A48] hover:underline font-medium cursor-pointer"
              >
                <span>Track live courier status</span>
                <Truck className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tracking Status Toast */}
            {showTrackingToast && (
              <div className="mt-3 p-4 bg-[#FAF8F5] border border-[#D8CFC6]">
                <p className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium mb-2">Live Tracking — {order.trackingCourier}</p>
                <div className="flex flex-col gap-1.5 text-[13px]">
                  <div className="flex items-center gap-2 text-[#3E6545]">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span><strong>Picked up from warehouse</strong> · {order.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3E6545]">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span><strong>In transit to destination hub</strong> · Mumbai Sorting Centre</span>
                  </div>
                  {isDelivered ? (
                    <div className="flex items-center gap-2 text-[#3E6545]">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span><strong>Delivered</strong> · {order.estimatedDelivery} · Signed for at door</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#713A48]">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <span><strong>Out for delivery</strong> · Estimated: {order.estimatedDelivery}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#69615B] mt-2">AWB: <span className="font-mono">{order.trackingNumber}</span></p>
              </div>
            )}
          </div>

          {/* Active Return Notice (if submitted) */}
          {hasReturns && (
            <div className="p-4 bg-[#FAF5EE] border border-[#713A48] flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#713A48] font-semibold block">
                  Return Authorization Active · {order.returns![0].id}
                </span>
                <p className="text-[13px] text-[#302B28] mt-0.5">
                  Doorstep courier pickup scheduled with {order.returns![0].courier} ({order.returns![0].pickupSlot}).
                </p>
                <p className="text-[12px] text-[#69615B] mt-0.5">
                  Resolution:{" "}
                  {order.returns![0].resolution === "exchange"
                    ? "Size exchange"
                    : order.returns![0].resolution === "store_credit"
                    ? "Atelier store credit (+10% bonus)"
                    : "Full refund to original payment source"}
                </p>
              </div>
            </div>
          )}

          {/* Ordered Garments Table */}
          <div>
            <h3 className="text-[12px] uppercase tracking-wider text-[#69615B] font-medium mb-3">
              Garments in this parcel ({order.items.length})
            </h3>

            <div className="border border-[#D8CFC6] divide-y divide-[#F0EAE1]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
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
                      <h4 className="font-editorial text-[17px] text-[#302B28] leading-snug">
                        {item.product.name}
                      </h4>
                      <p className="text-[13px] text-[#69615B] mt-0.5">
                        {item.color} · Size {item.size} · Quantity {item.quantity}
                      </p>
                      <p className="text-[12px] text-[#69615B] mt-0.5">
                        Department: {item.product.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <span className="text-[15px] font-semibold text-[#302B28]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <span className="text-[12px] text-[#69615B]">
                      {formatPrice(item.product.price)} each
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-[#FAF8F5] border border-[#D8CFC6]">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block mb-1.5">
                Delivery destination
              </span>
              <p className="text-[14px] text-[#302B28] leading-relaxed">
                <strong>{order.address.firstName} {order.address.lastName}</strong>
                <br />
                {order.address.addressLine1}
                {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}
                <br />
                {order.address.city} {order.address.postcode}
                <br />
                {order.address.country}
                <br />
                <span className="text-[12px] text-[#69615B]">Phone: {order.address.phone}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block mb-1.5">
                Payment & Billing
              </span>
              <p className="text-[14px] text-[#302B28] leading-relaxed">
                Method: <strong>{order.paymentMethod}</strong>
                {order.cardLast4 ? ` (Card ending in ${order.cardLast4})` : ""}
                <br />
                Courier: {order.deliveryMethod}
                <br />
                Receipt Email: {order.address.email}
              </p>
            </div>
          </div>

          {/* Handwritten Gift Note (if present) */}
          {order.giftNote && (
            <div className="p-4 bg-[#FFFDFA] border border-[#D8CFC6] flex items-start gap-3">
              <Gift className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#713A48] font-medium block">
                  Complimentary handwritten note included
                </span>
                <p className="text-[13px] italic text-[#302B28] mt-1 font-editorial">
                  “{order.giftNote}”
                </p>
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="border-t border-[#D8CFC6] pt-4 flex flex-col gap-2 text-[14px]">
            <div className="flex justify-between text-[#69615B]">
              <span>Subtotal</span>
              <span className="text-[#302B28]">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#69615B]">
              <span>Standard courier delivery</span>
              <span className="text-[#3E6545] font-medium">
                {order.deliveryFee === 0 ? "Complimentary" : formatPrice(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-[#69615B]">
              <span>GST (Included, 12%)</span>
              <span className="text-[#302B28]">
                {formatPrice(Math.round((order.total * 0.12) / 1.12))}
              </span>
            </div>
            <div className="pt-3 border-t border-[#D8CFC6] flex justify-between items-baseline">
              <span className="font-editorial text-[18px] text-[#302B28]">
                Total paid
              </span>
              <span className="font-editorial text-[24px] font-semibold text-[#302B28]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Footer Bar */}
        <div className="p-4 bg-[#FDFBF7] border-t border-stone-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12px] text-[#69615B] text-center sm:text-left">
            Eligible for 30-day atelier exchange or return until{" "}
            <strong>{order.returnEligibleUntil}</strong>.
          </div>

          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
            {isDelivered && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestReturn(order);
                }}
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-transparent border border-[#713A48] text-[#713A48] hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors cursor-pointer"
              >
                {hasReturns ? "View / Modify Return" : "Request Return / Exchange"}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
