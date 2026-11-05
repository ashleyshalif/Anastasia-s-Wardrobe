"use client";







import React, { useState, useEffect } from "react";



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



  Loader2,



  RefreshCw,



} from "lucide-react";



import { OrderHistoryItem, ReturnRequest } from "@/types/account";



import { useStore } from "@/lib/store";



import { ordersApi } from "@/lib/api/orders";



import { ApiError } from "@/lib/api/client";



import { formatPrice } from "@/config/currency";



import { OrderDetailModal } from "./OrderDetailModal";



import { ReturnRequestModal } from "./ReturnRequestModal";







export function OrdersList() {



  const { orders: localOrders, user, setOrders: setStoreOrders } = useStore();



  const [orders, setOrders] = useState<OrderHistoryItem[]>(localOrders);



  const [loading, setLoading] = useState(true);



  const [authRequired, setAuthRequired] = useState(false);







  const [selectedOrderForDetail, setSelectedOrderForDetail] =



    useState<OrderHistoryItem | null>(null);



  const [selectedOrderForReturn, setSelectedOrderForReturn] =



    useState<OrderHistoryItem | null>(null);







  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);







  const fetchLiveOrders = async (silent: boolean = false) => {
    let targetEmail = user?.email;
    if (!targetEmail && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aw_user');
        if (saved) {
          targetEmail = JSON.parse(saved)?.email;
        }
      } catch {}
    }
    targetEmail = targetEmail || 'maya.kapoor@example.com';

    if (!silent) {
      setIsRefreshing(true);
    }

    try {
      const apiOrders = await ordersApi.getOrders(targetEmail);
      if (apiOrders && apiOrders.length > 0) {
        setOrders(apiOrders);
        if (setStoreOrders) {
          setStoreOrders(apiOrders);
        }
        setLastSyncedAt(new Date().toLocaleTimeString());
      } else if (localOrders && localOrders.length > 0) {
        setOrders(localOrders);
      }
    } catch (err) {
      console.warn('Could not sync orders from backend, using cached orders:', err);
      if (localOrders && localOrders.length > 0) {
        setOrders(localOrders);
      }
    } finally {
      setLoading(false);
      if (!silent) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    // 1. Initial sync
    fetchLiveOrders();

    // 2. Auto-sync instantly when returning from Django Admin tab
    const handleFocusOrVisible = () => {
      fetchLiveOrders(true);
    };

    window.addEventListener('focus', handleFocusOrVisible);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveOrders(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 3. Live continuous sync: poll every 3 seconds while viewing order history
    const pollTimer = setInterval(() => {
      fetchLiveOrders(true);
    }, 3000);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(pollTimer);
    };
  }, [user]);







  if (loading) {



    return (



      <div className="p-16 text-center bg-[#FFFDFA] border border-[#D8CFC6]">



        <Loader2 className="w-8 h-8 text-[#713A48] animate-spin mx-auto mb-3" />



        <p className="font-editorial text-[18px] text-[#302B28]">Retrieving your orders...</p>



      </div>



    );



  }







  // Show sign-in prompt only if there is genuinely no logged-in user



  if (!user) {



    return (



      <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6]">



        <Package className="w-12 h-12 text-[#D8CFC6] mx-auto mb-4 stroke-[1.5]" />



        <h3 className="font-editorial text-[24px] text-[#302B28] mb-2">



          Sign in to view your orders



        </h3>



        <p className="text-[14px] text-[#69615B] max-w-[440px] mx-auto mb-6 leading-relaxed">



          Order history is protected. Please sign in to your Ryna&apos;s Wardrobe account to access



          your past orders, invoices, and live tracking.



        </p>



        <Link



          href="/account"



          className="inline-block px-8 py-3 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors"



        >



          Sign in to account



        </Link>



      </div>



    );



  }







  if (orders.length === 0) {



    return (



      <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6]">



        <Package className="w-12 h-12 text-[#D8CFC6] mx-auto mb-4 stroke-[1.5]" />



        <h3 className="font-editorial text-[22px] text-[#302B28] mb-2">No past orders yet</h3>



        <p className="text-[14px] text-[#69615B] max-w-[440px] mx-auto mb-6 leading-relaxed">



          Your wardrobe order archive is currently empty. Explore our latest pieces and timeless designs.



        </p>



        <Link



          href="/"



          className="inline-block px-8 py-3 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide uppercase hover:bg-[#582D38] transition-colors"



        >



          Explore Collections



        </Link>



      </div>



    );



  }







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



        <button



          type="button"



          onClick={() => fetchLiveOrders()}



          disabled={isRefreshing}



          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDFA] border border-[#D8CFC6] text-[12px] font-medium text-[#302B28] hover:bg-[#F8F5EF] hover:border-[#713A48] transition-colors cursor-pointer shadow-xs disabled:opacity-50"



          title="Sync latest delivery updates from Atelier backend"



        >



          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#713A48]" : ""}`} />



          <span>{isRefreshing ? "Syncing..." : "Sync Orders"}</span>



        </button>



      </div>







      {/* Orders Loop */}



      <div className="flex flex-col gap-6">



        {orders.map((order) => {



          const isDelivered = (order.status || "").toLowerCase() === "delivered";



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



              {/* Items List inside Order */}

              <div className="p-5 sm:p-6 divide-y divide-[#F0EAE1]">

                {order.items.map((item) => {

                  const itemImg = (item.colorImage && item.colorImage.trim() !== "")

                    ? item.colorImage

                    : (item.product?.image && item.product.image.trim() !== "")

                      ? item.product.image

                      : "/images/cardigan.png";

                  const itemAlt = item.product?.name || "Ryna's Wardrobe Atelier Garment";

                  const itemPrice = (item.product?.price ?? 0) * (item.quantity || 1);



                  return (

                    <div

                      key={item.id}

                      className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"

                    >

                      <div className="flex items-center gap-4">

                        <div className="relative w-16 h-20 bg-[#EAE4D9] border border-[#D8CFC6] flex-shrink-0 overflow-hidden">

                          <Image

                            src={itemImg}

                            alt={itemAlt}

                            fill

                            sizes="64px"

                            className="object-cover"

                          />

                        </div>

                        <div>

                          <h4 className="font-editorial text-[17px] text-[#302B28] leading-snug">

                            {itemAlt}

                          </h4>

                          <p className="text-[13px] text-[#69615B] mt-0.5">

                            {item.color || "Standard"} · Size {item.size || "Standard"} · Quantity {item.quantity || 1}

                          </p>

                          <span className="text-[11px] text-[#69615B] block mt-1">

                            Shipped via {order.trackingCourier} (AWB: {order.trackingNumber})

                          </span>

                        </div>

                      </div>



                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">

                        <span className="text-[15px] font-medium text-[#302B28]">

                          {formatPrice(itemPrice)}

                        </span>

                      </div>

                    </div>

                  );

                })}

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



