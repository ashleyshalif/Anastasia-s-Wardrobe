"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Receipt,
} from "lucide-react";
import { OrderHistoryItem, ReturnRequest } from "@/types/account";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/config/currency";
import { OrderDetailModal } from "./OrderDetailModal";
import { ReturnRequestModal } from "./ReturnRequestModal";

export function OrdersList() {
  const { orders } = useStore();

  const [selectedOrderForDetail, setSelectedOrderForDetail] =
    useState<OrderHistoryItem | null>(null);
  const [selectedOrderForReturn, setSelectedOrderForReturn] =
    useState<OrderHistoryItem | null>(null);

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6]">
        <Package className="w-12 h-12 text-[#D8CFC6] mx-auto mb-4 stroke-[1.5]" />
        <h3 className="font-editorial text-[24px] text-[#302B28] mb-2">
          No orders placed yet
        </h3>
        <p className="text-[14px] text-[#69615B] max-w-[400px] mx-auto mb-6 leading-relaxed">
          When you purchase garments from our seasonal edits, your tracking updates and
          receipts will appear here.
        </p>
        <Link
          href="/category/women"
          className="inline-block px-8 py-3 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors"
        >
          Explore the wardrobe
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC6]">
        <div>
          <h2 className="font-editorial text-[24px] sm:text-[28px] text-[#302B28]">
            Your Orders ({orders.length})
          </h2>
          <p className="text-[13px] text-[#69615B]">
            Review delivery status, live courier tracking, or schedule a 30-day return.
          </p>
        </div>
      </div>

      {/* Orders Loop */}
      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const isDelivered = order.status === "Delivered";
          const hasReturn = order.returns && order.returns.length > 0;

          return (
            <div
              key={order.orderNumber}
              className="bg-[#FFFDFA] border border-[#D8CFC6] shadow-sm overflow-hidden"
            >
              {/* Order Card Top Bar */}
              <div className="p-4 sm:p-5 bg-[#F8F5EF] border-b border-[#D8CFC6] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[13px]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block">
                      Order Reference
                    </span>
                    <strong className="text-[#302B28] font-mono text-[14px]">
                      {order.orderNumber}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block">
                      Date Placed
                    </span>
                    <span className="text-[#302B28]">{order.date}</span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-medium block">
                      Total
                    </span>
                    <strong className="text-[#302B28]">
                      {formatPrice(order.total)}
                    </strong>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 border ${
                      isDelivered
                        ? "bg-[#EAF2EC] text-[#3E6545] border-[#3E6545]/30"
                        : "bg-[#F5EFE6] text-[#713A48] border-[#713A48]/30"
                    }`}
                  >
                    {isDelivered ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{order.status}</span>
                  </span>
                </div>
              </div>

              {/* Active Return Alert Banner */}
              {hasReturn && (
                <div className="p-4 pl-5 bg-[#FAF5EE] border-b border-[#713A48]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px]">
                  <div className="flex items-center gap-3 text-[#713A48]">
                    <RotateCcw className="w-4 h-4 flex-shrink-0" />
                    <span>
                      <strong>Return Authorization Active ({order.returns![0].id}):</strong> Doorstep pickup scheduled with {order.returns![0].courier}.
                    </span>
                  </div>
                  <span className="ml-7 sm:ml-0 text-[11px] uppercase font-semibold text-[#713A48] bg-[#FFFDFA] px-2 py-0.5 border border-[#713A48]/40 whitespace-nowrap">
                    {order.returns![0].status}
                  </span>
                </div>
              )}

              {/* Items List inside Order */}
              <div className="p-5 sm:p-6 divide-y divide-[#F0EAE1]">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
                        <span className="text-[11px] text-[#69615B] block mt-1">
                          Shipped via {order.trackingCourier} (AWB: {order.trackingNumber})
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                      <span className="text-[15px] font-medium text-[#302B28]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Card Action Footer */}
              <div className="p-4 bg-[#FAF8F5] border-t border-[#D8CFC6] flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px]">
                <div className="text-[#69615B] text-[12px] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#713A48] flex-shrink-0" />
                  <span>
                    {isDelivered
                      ? `Delivered to ${order.address.city} on ${order.estimatedDelivery}`
                      : `In transit via ${order.trackingCourier}`}
                  </span>
                </div>

                <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
                  {isDelivered && (
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForReturn(order)}
                      className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap border border-[#713A48] text-[#713A48] hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors cursor-pointer"
                    >
                      {hasReturn ? "View Return Details" : "Request Return / Exchange"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedOrderForDetail(order)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors cursor-pointer shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrderForDetail}
        isOpen={!!selectedOrderForDetail}
        onClose={() => setSelectedOrderForDetail(null)}
        onRequestReturn={(ord) => setSelectedOrderForReturn(ord)}
      />

      <ReturnRequestModal
        order={selectedOrderForReturn}
        isOpen={!!selectedOrderForReturn}
        onClose={() => setSelectedOrderForReturn(null)}
      />
    </div>
  );
}
