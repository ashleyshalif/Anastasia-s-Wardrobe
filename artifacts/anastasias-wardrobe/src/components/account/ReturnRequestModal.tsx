"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  RotateCcw,
  CheckCircle2,
  Package,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { OrderHistoryItem, ReturnRequest } from "@/types/account";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/config/currency";

interface ReturnRequestModalProps {
  order: OrderHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReturnSubmitted?: (ret: ReturnRequest) => void;
}

export function ReturnRequestModal({
  order,
  isOpen,
  onClose,
  onReturnSubmitted,
}: ReturnRequestModalProps) {
  const { submitReturnRequest } = useStore();

  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [reason, setReason] = useState<ReturnRequest["reason"]>("Size too small");
  const [resolution, setResolution] = useState<"exchange" | "refund_original" | "store_credit">("exchange");
  const [exchangeSize, setExchangeSize] = useState<string>("L");
  const [pickupSlot, setPickupSlot] = useState<string>("Tomorrow, 10:00 AM – 2:00 PM (Blue Dart)");
  const [customerNotes, setCustomerNotes] = useState<string>("");

  const [submittedReturn, setSubmittedReturn] = useState<ReturnRequest | null>(null);

  if (!isOpen || !order) return null;

  // Default to first item if not selected
  const activeItemId = selectedItemId || order.items[0]?.id;
  const activeItem = order.items.find((i) => i.id === activeItemId) || order.items[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    const result = submitReturnRequest({
      orderNumber: order.orderNumber,
      item: {
        cartItemId: activeItem.id,
        productName: activeItem.product.name,
        size: activeItem.size,
        color: activeItem.color,
        quantity: activeItem.quantity,
        price: activeItem.product.price,
        image: activeItem.product.image,
      },
      reason,
      resolution,
      requestedExchangeSize: resolution === "exchange" ? exchangeSize : undefined,
      pickupSlot,
      notes: customerNotes.trim() || undefined,
    });

    setSubmittedReturn(result);
    if (onReturnSubmitted) onReturnSubmitted(result);
  };

  const handleClose = () => {
    setSubmittedReturn(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#FDFBF7] rounded-none shadow-2xl flex flex-col overflow-hidden border border-stone-200 my-auto"
        style={{ maxHeight: "min(90vh, calc(100vh - 3rem))" }}
      >
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-stone-200 flex items-center justify-between bg-[#F8F5EF]">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-1">
              30-DAY COMPLIMENTARY SERVICE
            </span>
            <h2 className="font-editorial text-[24px] sm:text-[28px] text-[#302B28]">
              {submittedReturn ? "Return & Exchange Scheduled" : `Return / Exchange · ${order.orderNumber}`}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-[#69615B] hover:text-[#713A48] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 sm:p-8 overflow-y-auto space-y-6 grow min-h-0"
          style={{ minHeight: 0, overflowY: "auto" }}
        >
          {submittedReturn ? (
            /* Success Confirmation State */
            <div className="flex flex-col items-center text-center gap-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF2EC] border border-[#3E6545]/30 flex items-center justify-center text-[#3E6545]">
                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div>
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-1">
                  AUTHORIZATION CODE: {submittedReturn.id}
                </span>
                <h3 className="font-editorial text-[26px] text-[#302B28] mb-2">
                  Doorstep Pickup Confirmed
                </h3>
                <p className="text-[14px] text-[#69615B] max-w-[480px] mx-auto leading-relaxed">
                  Our courier will collect your garment directly from your delivery address:
                </p>
                <div className="mt-3 p-4 bg-[#FAF8F5] border border-[#D8CFC6] text-[13px] text-[#302B28] text-left max-w-[480px] mx-auto">
                  <p className="font-semibold text-[#713A48] mb-1">Pickup Summary:</p>
                  <p>• <strong>Courier:</strong> {submittedReturn.courier}</p>
                  <p>• <strong>Scheduled Window:</strong> {submittedReturn.pickupSlot}</p>
                  <p>• <strong>Item:</strong> {submittedReturn.item.productName} ({submittedReturn.item.color}, Size {submittedReturn.item.size})</p>
                  <p>• <strong>Resolution:</strong> {
                    submittedReturn.resolution === "exchange"
                      ? `Exchange for Size ${submittedReturn.requestedExchangeSize}`
                      : submittedReturn.resolution === "store_credit"
                      ? "Atelier Store Credit (+10% Bonus)"
                      : "Full Refund to Original Payment"
                  }</p>
                </div>
              </div>

              <div className="p-4 bg-[#F8F5EF] border border-[#D8CFC6] text-[12px] text-[#69615B] text-left w-full">
                <p className="font-semibold text-[#302B28] mb-1">No need to print any labels:</p>
                <p>The Blue Dart courier representative will arrive with a tamper-evident luxury return satchel and affix the pre-printed return barcode at pickup.</p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors shadow-xs cursor-pointer"
              >
                Return to account orders
              </button>
            </div>
          ) : (
            /* Interactive Return Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Step 1: Select Garment */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-2 font-medium">
                  1. Select piece to exchange or return
                </label>
                <div className="flex flex-col gap-2.5">
                  {order.items.map((item) => (
                    <label
                      key={item.id}
                      className={`p-3.5 border flex items-center justify-between cursor-pointer transition-colors ${
                        activeItemId === item.id
                          ? "border-[#713A48] bg-[#FAF8F5]"
                          : "border-[#D8CFC6] bg-[#FFFDFA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="returnItem"
                          checked={activeItemId === item.id}
                          onChange={() => setSelectedItemId(item.id)}
                          className="w-4 h-4 accent-[#713A48]"
                        />
                        <div className="relative w-12 h-14 bg-[#EAE4D9] flex-shrink-0 overflow-hidden border border-[#D8CFC6]">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-editorial text-[15px] text-[#302B28]">
                            {item.product.name}
                          </p>
                          <p className="text-[12px] text-[#69615B]">
                            {item.color} · Size {item.size}
                          </p>
                        </div>
                      </div>
                      <span className="text-[14px] font-semibold text-[#302B28]">
                        {formatPrice(item.product.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Reason for Return */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-2 font-medium">
                  2. Reason for exchange / return
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReturnRequest["reason"])}
                  className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none cursor-pointer"
                >
                  <option value="Size too small">Size too small (need larger size)</option>
                  <option value="Size too large">Size too large (need smaller size)</option>
                  <option value="Fabric or colour differs from photo">Fabric or colour differs from photo</option>
                  <option value="Style did not suit">Style did not suit my silhouette</option>
                  <option value="Quality / workmanship inquiry">Quality / workmanship inquiry</option>
                  <option value="Changed mind">Changed mind</option>
                </select>
              </div>

              {/* Step 3: Preferred Resolution */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-2 font-medium">
                  3. How would you like this resolved?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Exchange */}
                  <label
                    className={`p-3.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                      resolution === "exchange"
                        ? "border-[#713A48] bg-[#FAF8F5]"
                        : "border-[#D8CFC6] bg-[#FFFDFA]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        name="resolution"
                        checked={resolution === "exchange"}
                        onChange={() => setResolution("exchange")}
                        className="w-4 h-4 accent-[#713A48]"
                      />
                      <span className="text-[13px] font-semibold text-[#302B28]">
                        Size Exchange
                      </span>
                    </div>
                    <span className="text-[11px] text-[#69615B]">
                      Replacement dispatched immediately
                    </span>
                  </label>

                  {/* Store Credit */}
                  <label
                    className={`p-3.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                      resolution === "store_credit"
                        ? "border-[#713A48] bg-[#FAF8F5]"
                        : "border-[#D8CFC6] bg-[#FFFDFA]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        name="resolution"
                        checked={resolution === "store_credit"}
                        onChange={() => setResolution("store_credit")}
                        className="w-4 h-4 accent-[#713A48]"
                      />
                      <span className="text-[13px] font-semibold text-[#302B28]">
                        Store Credit (+10%)
                      </span>
                    </div>
                    <span className="text-[11px] text-[#3E6545] font-medium">
                      Bonus 10% wardrobe privilege
                    </span>
                  </label>

                  {/* Original Refund */}
                  <label
                    className={`p-3.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                      resolution === "refund_original"
                        ? "border-[#713A48] bg-[#FAF8F5]"
                        : "border-[#D8CFC6] bg-[#FFFDFA]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        name="resolution"
                        checked={resolution === "refund_original"}
                        onChange={() => setResolution("refund_original")}
                        className="w-4 h-4 accent-[#713A48]"
                      />
                      <span className="text-[13px] font-semibold text-[#302B28]">
                        Original Refund
                      </span>
                    </div>
                    <span className="text-[11px] text-[#69615B]">
                      UPI or Card in 3–5 working days
                    </span>
                  </label>
                </div>

                {/* If Exchange: Size Selector */}
                {resolution === "exchange" && (
                  <div className="mt-3 p-3.5 bg-[#FAF8F5] border border-[#D8CFC6]">
                    <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-2 font-medium">
                      Select replacement size:
                    </label>
                    <div className="flex gap-2">
                      {["XS", "S", "M", "L", "XL"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setExchangeSize(s)}
                          className={`w-10 h-10 border text-[13px] font-medium transition-colors cursor-pointer ${
                            exchangeSize === s
                              ? "bg-[#713A48] text-[#FFFDFA] border-[#713A48]"
                              : "bg-[#FFFDFA] text-[#302B28] border-[#D8CFC6] hover:border-[#713A48]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Doorstep Pickup Window */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-2 font-medium">
                  4. Select convenient doorstep pickup time
                </label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none cursor-pointer"
                >
                  <option value="Tomorrow, 10:00 AM – 2:00 PM (Blue Dart)">
                    Tomorrow, 10:00 AM – 2:00 PM (Blue Dart Courier)
                  </option>
                  <option value="Tomorrow, 2:00 PM – 6:00 PM (Blue Dart)">
                    Tomorrow, 2:00 PM – 6:00 PM (Blue Dart Courier)
                  </option>
                  <option value="Day after tomorrow, 10:00 AM – 2:00 PM">
                    Day after tomorrow, 10:00 AM – 2:00 PM
                  </option>
                </select>
                <p className="text-[12px] text-[#69615B] mt-1.5">
                  Pickup address: {order.address.addressLine1}, {order.address.city} {order.address.postcode}
                </p>
              </div>

              {/* Step 5: Customer Notes */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                  Notes for the atelier tailor / team · optional
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Would love the sleeve length to fit slightly more relaxed."
                  className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap text-[#69615B] hover:text-[#713A48] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 flex-shrink-0" />
                  <span>Confirm Doorstep Return Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
