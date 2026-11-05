"use client";



import React, { useState, useEffect } from "react";

import {

  X,

  Lock,

  ShieldCheck,

  Smartphone,

  CreditCard,

  Building2,

  Wallet,

  QrCode,

  CheckCircle2,

  ChevronRight,

  ChevronDown,

  ChevronUp,

  AlertCircle,

  Clock,

  ArrowRight,

  Sparkles,

} from "lucide-react";

import { formatPrice } from "@/config/currency";



export interface RazorpayItem {

  id?: string;

  name: string;

  price: number;

  quantity: number;

  size?: string;

  color?: string;

  image?: string;

}



export interface RazorpayModalProps {

  isOpen: boolean;

  orderNumber: string;

  amount: number;

  currency?: string;

  customer: {

    name: string;

    email: string;

    phone: string;

    address?: string;

  };

  items?: RazorpayItem[];

  subtotal?: number;

  deliveryFee?: number;

  discount?: number;

  defaultTab?: "upi" | "card" | "netbanking" | "wallet";

  onSuccess: (paymentData: {

    razorpay_payment_id: string;

    razorpay_order_id: string;

    razorpay_signature: string;

    method: string;

  }) => void;

  onDismiss: () => void;

  onFailure?: (error: string) => void;

}



const POPULAR_BANKS = [

  { id: "HDFC", name: "HDFC Bank", short: "HDFC", color: "#004c8f" },

  { id: "ICICI", name: "ICICI Bank", short: "ICICI", color: "#b02a30" },

  { id: "SBI", name: "State Bank of India", short: "SBI", color: "#280071" },

  { id: "AXIS", name: "Axis Bank", short: "Axis", color: "#97144d" },

  { id: "KOTAK", name: "Kotak Mahindra", short: "Kotak", color: "#ee1c25" },

  { id: "PNB", name: "Punjab National", short: "PNB", color: "#a20021" },

];



const OTHER_BANKS = [

  "Bank of Baroda",

  "Canara Bank",

  "Union Bank of India",

  "Bank of India",

  "Indian Bank",

  "Central Bank of India",

  "IDFC FIRST Bank",

  "IndusInd Bank",

  "Yes Bank",

  "Federal Bank",

  "South Indian Bank",

  "RBL Bank",

  "Standard Chartered Bank",

  "HSBC Bank",

  "Citibank",

];



const UPI_APPS = [

  { id: "gpay", name: "Google Pay", icon: "GPay", color: "#4285F4" },

  { id: "phonepe", name: "PhonePe", icon: "Pe", color: "#5f259f" },

  { id: "paytm", name: "Paytm UPI", icon: "Paytm", color: "#00b9f5" },

  { id: "cred", name: "CRED UPI", icon: "CRED", color: "#1c1c1c" },

];



export function RazorpayModal({

  isOpen,

  orderNumber,

  amount,

  currency = "INR",

  customer,

  items,

  subtotal,

  deliveryFee,

  discount,

  defaultTab = "upi",

  onSuccess,

  onDismiss,

  onFailure,

}: RazorpayModalProps) {

  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking" | "wallet">(defaultTab);

  const [upiSubTab, setUpiSubTab] = useState<"qr" | "apps" | "vpa">("qr");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("4532 8920 1827 9412");

  const [cardExpiry, setCardExpiry] = useState("12/28");

  const [cardCvc, setCardCvc] = useState("482");

  const [cardName, setCardName] = useState(customer.name || "Maya Kapoor");

  const [selectedBank, setSelectedBank] = useState("HDFC");

  const [selectedWallet, setSelectedWallet] = useState("amazonpay");

  const [showBreakdown, setShowBreakdown] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const [processingStep, setProcessingStep] = useState<string>("");

  const [isSuccess, setIsSuccess] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(899); // 14:59



  useEffect(() => {

    setActiveTab(defaultTab);

  }, [defaultTab]);



  useEffect(() => {

    if (!isOpen) return;

    const interval = setInterval(() => {

      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));

    }, 1000);

    return () => clearInterval(interval);

  }, [isOpen]);



  if (!isOpen) return null;



  const minutes = Math.floor(timerSeconds / 60);

  const seconds = timerSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;



  const formattedAmount = formatPrice(amount);



  const handleSimulatePayment = (forcedSuccess: boolean = true) => {

    setIsProcessing(true);

    setProcessingStep("Connecting to secure banking gateway...");



    setTimeout(() => {

      setProcessingStep("Validating 256-bit bank authorization token...");

    }, 600);



    setTimeout(() => {

      if (forcedSuccess) {

        setProcessingStep("Payment Approved · Generating digital signature...");

        setTimeout(() => {

          setIsProcessing(false);

          setIsSuccess(true);

          setTimeout(() => {

            const paymentId = `pay_rzp_${Date.now()}`;

            onSuccess({

              razorpay_payment_id: paymentId,

              razorpay_order_id: `order_${orderNumber.replace(/[^a-zA-Z0-9]/g, "")}`,

              razorpay_signature: "test_verified_signature",

              method: activeTab,

            });

          }, 800);

        }, 600);

      } else {

        setIsProcessing(false);

        if (onFailure) {

          onFailure("Payment was declined by the issuing bank. Please retry or choose another method.");

        }

      }

    }, 1400);

  };



  return (

    <div

      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-xs p-2 sm:p-4 md:py-8 flex justify-center items-center"

      role="dialog"

      aria-modal="true"

      aria-labelledby="rzp-modal-title"

    >

      <div className="relative w-full max-w-[760px] max-h-[92vh] bg-[#FFFFFF] rounded-xl shadow-2xl overflow-hidden border border-[#D8CFC6] my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Top Razorpay Header Bar - Sticky to guarantee visibility */}

        <div className="bg-[#713A48] text-white px-5 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md border-b border-white/15">

          <div className="flex items-center gap-3">

            {/* Atelier Crest / Logo */}

            <div className="w-10 h-10 rounded-full bg-[#582B37] border border-white/20 shadow-xs flex items-center justify-center text-white font-serif text-lg font-bold">

              R

            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="font-semibold text-[15px] sm:text-[16px] text-white tracking-wide">

                  Ryna's Wardrobe

                </span>

                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white/15 text-white/95 px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">

                  <ShieldCheck className="w-3 h-3 text-emerald-300" />

                  Verified Atelier

                </span>

              </div>

              <p className="text-[12px] text-slate-300 font-mono">

                Order {orderNumber}

              </p>

            </div>

          </div>



          <div className="flex items-center gap-4">

            <div className="text-right">

              <span className="text-[10px] uppercase tracking-wider text-slate-300 block">

                Amount to Pay

              </span>

              <span className="text-[18px] sm:text-[20px] font-bold text-white font-mono tracking-tight">

                {formattedAmount} <span className="text-[12px] font-normal">{currency}</span>

              </span>

            </div>



            <button

              onClick={onDismiss}

              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"

              title="Close payment window"

              aria-label="Close payment modal"

            >

              <X className="w-5 h-5" />

            </button>

          </div>

        </div>



        {/* Customer & Breakdown Quick Bar */}

        <div className="bg-[#F8FAFC] border-b border-[#D8CFC6] px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-[12px] text-slate-600 gap-2">

          <div className="flex items-center gap-2">

            <span className="font-medium text-slate-800">{customer.name || "Patron"}</span>

            <span className="text-slate-400">·</span>

            <span>{customer.email || "maya.kapoor@example.com"}</span>

            <span className="text-slate-400 hidden sm:inline">·</span>

            <span className="hidden sm:inline font-mono">{customer.phone || "+91 98200 12345"}</span>

          </div>



          <button

            onClick={() => setShowBreakdown(!showBreakdown)}

            className="text-[#713A48] hover:text-[#582D38] font-medium inline-flex items-center gap-1 cursor-pointer"

          >

            <span>{showBreakdown ? "Hide breakdown" : "View breakdown"}</span>

            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}

          </button>

        </div>



        {/* Collapsible Order Breakdown */}

        {showBreakdown && (

          <div className="bg-[#FAF8F5] border-b border-[#D8CFC6] px-5 sm:px-6 py-3.5 text-[12px] text-[#302B28] animate-in slide-in-from-top-2">

            <div className="max-w-xl mx-auto space-y-2.5">

              <div className="flex items-center justify-between pb-1.5 border-b border-[#D8CFC6]">

                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#713A48]">

                  Order Items ({items && items.length > 0 ? items.reduce((acc, i) => acc + i.quantity, 0) : 1})

                </span>

                <span className="text-[11px] text-[#69615B]">

                  Verified Atelier Selection

                </span>

              </div>



              {items && items.length > 0 ? (

                <div className="divide-y divide-[#EAE4D9] max-h-48 overflow-y-auto pr-1">

                  {items.map((item, idx) => (

                    <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-[12px] gap-3">

                      <div className="flex items-center gap-3">

                        {item.image && (

                          <div className="w-9 h-11 relative bg-[#EAE4D9] border border-[#D8CFC6] rounded-xs overflow-hidden flex-shrink-0">

                            {/* eslint-disable-next-line @next/next/no-img-element */}

                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />

                          </div>

                        )}

                        <div>

                          <div className="font-medium text-[#302B28] line-clamp-1">{item.name}</div>

                          <div className="text-[11px] text-[#69615B]">

                            {item.color ? `${item.color} · ` : ""}{item.size ? `Size ${item.size} · ` : ""}Qty {item.quantity}

                          </div>

                        </div>

                      </div>

                      <span className="font-mono font-medium text-[#302B28] whitespace-nowrap">

                        {formatPrice(item.price * item.quantity)}

                      </span>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="flex justify-between py-1">

                  <span>Atelier Garments</span>

                  <span className="font-mono">{formattedAmount}</span>

                </div>

              )}



              <div className="pt-2 border-t border-[#D8CFC6] space-y-1">

                {subtotal !== undefined && (

                  <div className="flex justify-between text-[#69615B]">

                    <span>Items Subtotal</span>

                    <span className="font-mono">{formatPrice(subtotal)}</span>

                  </div>

                )}

                {discount !== undefined && discount > 0 && (

                  <div className="flex justify-between text-emerald-700 font-medium">

                    <span>Privilege Offer / Promo Code</span>

                    <span className="font-mono">-{formatPrice(discount)}</span>

                  </div>

                )}

                <div className="flex justify-between text-[#69615B]">

                  <span>Atelier Standard Delivery</span>

                  <span className={deliveryFee === 0 || !deliveryFee ? "text-emerald-700 font-medium" : ""}>

                    {deliveryFee === 0 || !deliveryFee ? "Complimentary" : formatPrice(deliveryFee)}

                  </span>

                </div>

                <div className="flex justify-between text-[#69615B] text-[11px]">

                  <span>Taxes & GST (12% Included)</span>

                  <span>Included in price</span>

                </div>

                <div className="flex justify-between font-bold text-[14px] text-[#302B28] pt-2 border-t border-[#D8CFC6]">

                  <span>Total Payable</span>

                  <span className="font-mono text-[#713A48]">{formattedAmount} {currency}</span>

                </div>

              </div>

            </div>

          </div>

        )}



        {/* Main Body: Tabs on Left, Interactive Form on Right */}

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">

          {/* Methods Navigation (Left 4 cols) */}

          <div className="md:col-span-4 bg-[#FAF8F5] border-r border-[#D8CFC6] p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto">

            <button

              onClick={() => setActiveTab("upi")}

              className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-[13px] font-medium transition-all cursor-pointer ${

                activeTab === "upi"

                  ? "bg-[#FFFFFF] text-[#0C2340] shadow-xs border border-[#CBD5E1]"

                  : "text-slate-600 hover:bg-[#F1F5F9] hover:text-slate-900 border border-transparent"

              }`}

            >

              <div className="flex items-center gap-2.5">

                <div

                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${

                    activeTab === "upi" ? "bg-[#FAF0F2] text-[#713A48]" : "bg-slate-200 text-slate-600"

                  }`}

                >

                  <Smartphone className="w-4 h-4" />

                </div>

                <div>

                  <div className="font-semibold text-slate-800">UPI / QR Code</div>

                  <div className="text-[11px] text-slate-500 hidden sm:block">Google Pay, PhonePe, QR</div>

                </div>

              </div>

              <span className="hidden md:inline text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">

                INSTANT

              </span>

            </button>



            <button

              onClick={() => setActiveTab("card")}

              className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-[13px] font-medium transition-all cursor-pointer ${

                activeTab === "card"

                  ? "bg-[#FFFFFF] text-[#0C2340] shadow-xs border border-[#CBD5E1]"

                  : "text-slate-600 hover:bg-[#F1F5F9] hover:text-slate-900 border border-transparent"

              }`}

            >

              <div className="flex items-center gap-2.5">

                <div

                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${

                    activeTab === "card" ? "bg-[#FAF0F2] text-[#713A48]" : "bg-slate-200 text-slate-600"

                  }`}

                >

                  <CreditCard className="w-4 h-4" />

                </div>

                <div>

                  <div className="font-semibold text-slate-800">Card</div>

                  <div className="text-[11px] text-slate-500 hidden sm:block">Visa, Mastercard, RuPay</div>

                </div>

              </div>

            </button>



            <button

              onClick={() => setActiveTab("netbanking")}

              className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-[13px] font-medium transition-all cursor-pointer ${

                activeTab === "netbanking"

                  ? "bg-[#FFFFFF] text-[#0C2340] shadow-xs border border-[#CBD5E1]"

                  : "text-slate-600 hover:bg-[#F1F5F9] hover:text-slate-900 border border-transparent"

              }`}

            >

              <div className="flex items-center gap-2.5">

                <div

                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${

                    activeTab === "netbanking" ? "bg-[#FAF0F2] text-[#713A48]" : "bg-slate-200 text-slate-600"

                  }`}

                >

                  <Building2 className="w-4 h-4" />

                </div>

                <div>

                  <div className="font-semibold text-slate-800">NetBanking</div>

                  <div className="text-[11px] text-slate-500 hidden sm:block">All 50+ Indian banks</div>

                </div>

              </div>

            </button>



            <button

              onClick={() => setActiveTab("wallet")}

              className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-[13px] font-medium transition-all cursor-pointer ${

                activeTab === "wallet"

                  ? "bg-[#FFFFFF] text-[#0C2340] shadow-xs border border-[#CBD5E1]"

                  : "text-slate-600 hover:bg-[#F1F5F9] hover:text-slate-900 border border-transparent"

              }`}

            >

              <div className="flex items-center gap-2.5">

                <div

                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${

                    activeTab === "wallet" ? "bg-[#FAF0F2] text-[#713A48]" : "bg-slate-200 text-slate-600"

                  }`}

                >

                  <Wallet className="w-4 h-4" />

                </div>

                <div>

                  <div className="font-semibold text-slate-800">Wallets</div>

                  <div className="text-[11px] text-slate-500 hidden sm:block">Amazon Pay, Mobikwik</div>

                </div>

              </div>

            </button>

          </div>



          {/* Interactive Payment View (Right 8 cols) */}

          <div className="md:col-span-8 p-5 sm:p-6 bg-[#FFFFFF] flex flex-col justify-between">

            {/* 1. UPI VIEW */}

            {activeTab === "upi" && (

              <div className="space-y-4">

                {/* Sub tabs: QR / Apps / VPA */}

                <div className="flex border-b border-[#D8CFC6] gap-4 text-[13px] font-medium">

                  <button

                    onClick={() => setUpiSubTab("qr")}

                    className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${

                      upiSubTab === "qr"

                        ? "border-[#713A48] text-[#713A48] font-semibold"

                        : "border-transparent text-slate-500 hover:text-slate-800"

                    }`}

                  >

                    Scan QR Code

                  </button>

                  <button

                    onClick={() => setUpiSubTab("apps")}

                    className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${

                      upiSubTab === "apps"

                        ? "border-[#713A48] text-[#713A48] font-semibold"

                        : "border-transparent text-slate-500 hover:text-slate-800"

                    }`}

                  >

                    UPI Apps

                  </button>

                  <button

                    onClick={() => setUpiSubTab("vpa")}

                    className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${

                      upiSubTab === "vpa"

                        ? "border-[#713A48] text-[#713A48] font-semibold"

                        : "border-transparent text-slate-500 hover:text-slate-800"

                    }`}

                  >

                    UPI ID / VPA

                  </button>

                </div>



                {/* Subview A: Dynamic QR Code */}

                {upiSubTab === "qr" && (

                  <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">

                    <div className="p-3 bg-white border-2 border-slate-200 rounded-xl shadow-xs text-center flex-shrink-0">

                      {/* Generative QR visual */}

                      <div className="w-40 h-40 bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">

                        {/* Custom styled SVG QR representation with Razorpay token */}

                        <svg

                          viewBox="0 0 100 100"

                          className="w-full h-full text-white"

                          fill="currentColor"

                        >

                          {/* Corner alignment markers */}

                          <rect x="5" y="5" width="26" height="26" fill="white" />

                          <rect x="9" y="9" width="18" height="18" fill="#0C2340" />

                          <rect x="13" y="13" width="10" height="10" fill="white" />



                          <rect x="69" y="5" width="26" height="26" fill="white" />

                          <rect x="73" y="9" width="18" height="18" fill="#0C2340" />

                          <rect x="77" y="13" width="10" height="10" fill="white" />



                          <rect x="5" y="69" width="26" height="26" fill="white" />

                          <rect x="9" y="73" width="18" height="18" fill="#0C2340" />

                          <rect x="13" y="77" width="10" height="10" fill="white" />



                          {/* Data points */}

                          <rect x="36" y="8" width="6" height="6" fill="white" />

                          <rect x="46" y="8" width="6" height="6" fill="white" />

                          <rect x="56" y="8" width="6" height="6" fill="white" />

                          <rect x="36" y="18" width="6" height="6" fill="white" />

                          <rect x="50" y="24" width="6" height="6" fill="white" />

                          <rect x="8" y="38" width="6" height="6" fill="white" />

                          <rect x="18" y="38" width="6" height="6" fill="white" />

                          <rect x="28" y="38" width="6" height="6" fill="white" />

                          <rect x="38" y="38" width="8" height="8" fill="white" />

                          <rect x="54" y="38" width="6" height="6" fill="white" />

                          <rect x="68" y="38" width="6" height="6" fill="white" />

                          <rect x="82" y="38" width="6" height="6" fill="white" />

                          <rect x="38" y="52" width="6" height="6" fill="white" />

                          <rect x="50" y="52" width="8" height="8" fill="white" />

                          <rect x="68" y="52" width="6" height="6" fill="white" />

                          <rect x="80" y="52" width="6" height="6" fill="white" />

                          <rect x="38" y="66" width="6" height="6" fill="white" />

                          <rect x="52" y="66" width="6" height="6" fill="white" />

                          <rect x="68" y="66" width="6" height="6" fill="white" />

                          <rect x="82" y="66" width="6" height="6" fill="white" />

                          <rect x="38" y="80" width="8" height="8" fill="white" />

                          <rect x="54" y="80" width="6" height="6" fill="white" />

                          <rect x="68" y="80" width="6" height="6" fill="white" />

                          <rect x="80" y="80" width="6" height="6" fill="white" />

                        </svg>



                        {/* Center UPI Badge */}

                        <div className="absolute inset-0 flex items-center justify-center">

                          <div className="bg-[#713A48] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">

                            UPI

                          </div>

                        </div>

                      </div>



                      <div className="mt-2 text-[11px] font-medium text-slate-700 flex items-center justify-center gap-1">

                        <Clock className="w-3 h-3 text-[#713A48]" />

                        <span>Expires in {formattedTime}</span>

                      </div>

                    </div>



                    <div className="space-y-3">

                      <div>

                        <h4 className="font-semibold text-slate-800 text-[14px]">

                          Scan &amp; Pay with any UPI App

                        </h4>

                        <p className="text-[12px] text-slate-500 leading-relaxed mt-0.5">

                          Open Google Pay, PhonePe, Paytm, or BHIM on your mobile phone to scan the QR code and authorize payment of <strong className="text-slate-800">{formattedAmount}</strong>.

                        </p>

                      </div>



                      <div className="flex flex-wrap gap-2 pt-1">

                        {UPI_APPS.map((app) => (

                          <span

                            key={app.id}

                            className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium rounded flex items-center gap-1.5"

                          >

                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: app.color }} />

                            {app.name}

                          </span>

                        ))}

                      </div>



                      <div className="pt-1">

                        <button

                          onClick={() => handleSimulatePayment(true)}

                          className="text-[12px] font-medium text-[#713A48] hover:text-[#582B37] hover:underline flex items-center gap-1 cursor-pointer"

                        >

                          <Sparkles className="w-3.5 h-3.5 text-[#713A48]" />

                          <span>Simulate instant QR phone scan approval</span>

                        </button>

                      </div>

                    </div>

                  </div>

                )}



                {/* Subview B: Direct UPI Apps */}

                {upiSubTab === "apps" && (

                  <div className="space-y-3 pt-2">

                    <p className="text-[12px] text-slate-600">

                      Select your preferred UPI application to send an instant collect request:

                    </p>

                    <div className="grid grid-cols-2 gap-2.5">

                      {UPI_APPS.map((app) => (

                        <button

                          key={app.id}

                          onClick={() => handleSimulatePayment(true)}

                          className="flex items-center gap-3 p-3 border border-slate-200 hover:border-[#0070BA] hover:bg-blue-50/50 rounded-lg text-left transition-all cursor-pointer group"

                        >

                          <div

                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"

                            style={{ backgroundColor: app.color }}

                          >

                            {app.icon}

                          </div>

                          <div>

                            <div className="font-semibold text-[13px] text-slate-800 group-hover:text-[#0070BA]">

                              {app.name}

                            </div>

                            <div className="text-[11px] text-slate-500">Pay {formattedAmount}</div>

                          </div>

                        </button>

                      ))}

                    </div>

                  </div>

                )}



                {/* Subview C: Manual VPA */}

                {upiSubTab === "vpa" && (

                  <div className="space-y-3 pt-2">

                    <label className="block text-[12px] font-medium text-slate-700">

                      Enter your UPI ID / Virtual Payment Address (VPA)

                    </label>

                    <div className="flex gap-2">

                      <input

                        type="text"

                        value={upiId}

                        onChange={(e) => setUpiId(e.target.value)}

                        placeholder="e.g. mobile@upi or username@okhdfcbank"

                        className="flex-1 px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:border-[#0070BA] focus:ring-1 focus:ring-[#0070BA] outline-none"

                      />

                      <button

                        onClick={() => handleSimulatePayment(true)}

                        className="px-4 py-2 bg-[#0070BA] text-white text-[13px] font-medium rounded-md hover:bg-[#005a9c] cursor-pointer"

                      >

                        Verify &amp; Pay

                      </button>

                    </div>

                    <p className="text-[11px] text-slate-500">

                      A payment request notification for {formattedAmount} will be triggered in your UPI application.

                    </p>

                  </div>

                )}

              </div>

            )}



            {/* 2. CARD VIEW */}

            {activeTab === "card" && (

              <div className="space-y-3.5">

                <div>

                  <h4 className="font-semibold text-slate-800 text-[14px]">

                    Enter Card Details

                  </h4>

                  <p className="text-[11px] text-slate-500">

                    Supports domestic &amp; international Visa, Mastercard, RuPay &amp; American Express.

                  </p>

                </div>



                <div>

                  <label className="block text-[11px] uppercase font-semibold text-slate-600 mb-1">

                    Card Number

                  </label>

                  <div className="relative">

                    <input

                      type="text"

                      value={cardNumber}

                      onChange={(e) => setCardNumber(e.target.value)}

                      placeholder="4532 •••• •••• 9412"

                      className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md font-mono focus:border-[#0070BA] outline-none"

                    />

                    <div className="absolute right-3 top-2.5 flex items-center gap-1.5">

                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded">VISA</span>

                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1 rounded">MC</span>

                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1 rounded">RuPay</span>

                    </div>

                  </div>

                </div>



                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label className="block text-[11px] uppercase font-semibold text-slate-600 mb-1">

                      Expiry (MM/YY)

                    </label>

                    <input

                      type="text"

                      value={cardExpiry}

                      onChange={(e) => setCardExpiry(e.target.value)}

                      placeholder="MM/YY"

                      maxLength={5}

                      className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md font-mono focus:border-[#0070BA] outline-none"

                    />

                  </div>



                  <div>

                    <label className="block text-[11px] uppercase font-semibold text-slate-600 mb-1">

                      CVV

                    </label>

                    <input

                      type="password"

                      value={cardCvc}

                      onChange={(e) => setCardCvc(e.target.value)}

                      placeholder="3 digits"

                      maxLength={4}

                      className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md font-mono focus:border-[#0070BA] outline-none"

                    />

                  </div>

                </div>



                <div>

                  <label className="block text-[11px] uppercase font-semibold text-slate-600 mb-1">

                    Cardholder Name

                  </label>

                  <input

                    type="text"

                    value={cardName}

                    onChange={(e) => setCardName(e.target.value)}

                    placeholder="Name as printed on card"

                    className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:border-[#0070BA] outline-none"

                  />

                </div>



                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">

                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />

                  <span>Encrypted &amp; tokenized securely per RBI guidelines</span>

                </div>

              </div>

            )}



            {/* 3. NETBANKING VIEW */}

            {activeTab === "netbanking" && (

              <div className="space-y-3.5">

                <div>

                  <h4 className="font-semibold text-slate-800 text-[14px]">

                    Select Your Bank

                  </h4>

                  <p className="text-[11px] text-slate-500">

                    Fast &amp; secure redirection to your retail bank portal.

                  </p>

                </div>



                {/* Popular Bank Badges */}

                <div className="grid grid-cols-3 gap-2">

                  {POPULAR_BANKS.map((b) => (

                    <button

                      key={b.id}

                      onClick={() => setSelectedBank(b.id)}

                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${

                        selectedBank === b.id

                          ? "border-[#0070BA] bg-blue-50/60 font-semibold"

                          : "border-slate-200 hover:border-slate-300 bg-white"

                      }`}

                    >

                      <div className="flex items-center gap-1.5">

                        <span

                          className="w-2.5 h-2.5 rounded-full"

                          style={{ backgroundColor: b.color }}

                        />

                        <span className="text-[12px] text-slate-800">{b.short}</span>

                      </div>

                      <div className="text-[10px] text-slate-500 truncate">{b.name}</div>

                    </button>

                  ))}

                </div>



                {/* All other banks dropdown */}

                <div>

                  <label className="block text-[11px] uppercase font-semibold text-slate-600 mb-1">

                    Or choose from all Indian banks

                  </label>

                  <select

                    value={selectedBank}

                    onChange={(e) => setSelectedBank(e.target.value)}

                    className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md bg-white focus:border-[#0070BA] outline-none"

                  >

                    <option value="" disabled>

                      Select another bank...

                    </option>

                    {OTHER_BANKS.map((b) => (

                      <option key={b} value={b}>

                        {b}

                      </option>

                    ))}

                  </select>

                </div>

              </div>

            )}



            {/* 4. WALLETS VIEW */}

            {activeTab === "wallet" && (

              <div className="space-y-3.5">

                <div>

                  <h4 className="font-semibold text-slate-800 text-[14px]">

                    Pay with Wallet

                  </h4>

                  <p className="text-[11px] text-slate-500">

                    Link and pay using your active mobile wallet balance.

                  </p>

                </div>



                <div className="space-y-2">

                  {[

                    { id: "amazonpay", name: "Amazon Pay", desc: "Fast 1-click checkout" },

                    { id: "mobikwik", name: "MobiKwik", desc: "Instant wallet payment" },

                    { id: "airtel", name: "Airtel Payments Bank", desc: "Safe savings & wallet" },

                  ].map((w) => (

                    <label

                      key={w.id}

                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${

                        selectedWallet === w.id

                          ? "border-[#0070BA] bg-blue-50/40"

                          : "border-slate-200 hover:bg-slate-50"

                      }`}

                    >

                      <div className="flex items-center gap-3">

                        <input

                          type="radio"

                          name="wallet"

                          checked={selectedWallet === w.id}

                          onChange={() => setSelectedWallet(w.id)}

                          className="accent-[#0070BA]"

                        />

                        <div>

                          <div className="font-semibold text-[13px] text-slate-800">{w.name}</div>

                          <div className="text-[11px] text-slate-500">{w.desc}</div>

                        </div>

                      </div>

                      <span className="text-[12px] font-mono font-medium text-slate-700">

                        {formattedAmount}

                      </span>

                    </label>

                  ))}

                </div>

              </div>

            )}



            {/* Bottom Modal CTA Bar */}

            <div className="pt-6 mt-4 border-t border-[#D8CFC6]">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                <div className="flex items-center gap-2 text-[11px] text-slate-500">

                  <Lock className="w-3.5 h-3.5 text-emerald-600" />

                  <span>Secured by Razorpay · 256-bit SSL</span>

                </div>



                <div className="flex items-center gap-2 w-full sm:w-auto">

                  <button

                    type="button"

                    onClick={onDismiss}

                    className="px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md font-medium cursor-pointer"

                  >

                    Cancel

                  </button>



                  <button

                    type="button"

                    onClick={() => handleSimulatePayment(true)}

                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#713A48] hover:bg-[#582D38] text-white text-[13px] font-semibold rounded-md shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"

                  >

                    <Lock className="w-3.5 h-3.5" />

                    <span>Pay {formattedAmount}</span>

                  </button>

                </div>

              </div>



              {/* Developer Sandbox Testing Controls */}

              <div className="mt-3 pt-2 border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1.5">

                <span className="font-mono text-slate-400">Atelier Sandbox Environment</span>

                <div className="flex items-center gap-2">

                  <button

                    type="button"

                    onClick={() => handleSimulatePayment(true)}

                    className="text-emerald-700 hover:underline font-medium cursor-pointer"

                  >

                    ✓ Simulate Success

                  </button>

                  <span className="text-slate-300">|</span>

                  <button

                    type="button"

                    onClick={() => handleSimulatePayment(false)}

                    className="text-rose-600 hover:underline font-medium cursor-pointer"

                  >

                    ✕ Simulate Decline

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Processing Overlay Screen */}

        {isProcessing && (

          <div className="absolute inset-0 bg-[#FFFFFF]/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-50 text-center animate-in fade-in">

            <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-[#713A48] animate-spin mb-4" />

            <h3 className="font-editorial text-[20px] text-slate-900 mb-1 font-semibold">

              Authorizing Payment

            </h3>

            <p className="text-[13px] text-slate-600 max-w-sm font-mono mb-2">

              {processingStep}

            </p>

            <p className="text-[11px] text-slate-400">

              Please do not refresh or close this browser window.

            </p>

          </div>

        )}



        {/* Success Confirmation Overlay */}

        {isSuccess && (

          <div className="absolute inset-0 bg-[#FFFFFF] flex flex-col items-center justify-center p-6 z-50 text-center animate-in fade-in zoom-in-95">

            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">

              <CheckCircle2 className="w-8 h-8" />

            </div>

            <h3 className="font-editorial text-[22px] text-slate-900 font-semibold mb-1">

              Payment Successful

            </h3>

            <p className="text-[13px] text-slate-600 mb-2">

              Authorized {formattedAmount} {currency} · Order {orderNumber}

            </p>

            <p className="text-[11px] text-slate-400 font-mono">

              Finalizing confirmation with Ryna's Wardrobe atelier...

            </p>

          </div>

        )}

      </div>

    </div>

  );

}



