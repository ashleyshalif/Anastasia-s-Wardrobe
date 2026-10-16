"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  ArrowLeft,
  Check,
  CreditCard,
  Gift,
  ChevronRight,
  Smartphone,
  Building2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { OrderDetails, DeliveryAddress } from "@/types/product";
import { CURRENCY, formatPrice } from "@/config/currency";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    discount,
    promoCode,
    giftNote,
    clearCart,
    setLastOrder,
    addOrderToHistory,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [formData, setFormData] = useState<DeliveryAddress>({
    firstName: "Maya",
    lastName: "Kapoor",
    email: "maya.kapoor@example.com",
    phone: "+91 98200 12345",
    addressLine1: "18 Altamount Road",
    addressLine2: "Apt 4B, Hill Crest",
    city: "Mumbai",
    postcode: "400026",
    country: "India",
  });

  const [newsletterConsent, setNewsletterConsent] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("maya@oksbi");
  const [cardName, setCardName] = useState("Maya Kapoor");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvc, setCardCvc] = useState("892");
  const [sameBilling, setSameBilling] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Pricing
  const isFreeStandard = cartTotal >= CURRENCY.freeShippingThreshold;
  const deliveryFee =
    deliveryMethod === "standard"
      ? isFreeStandard
        ? 0
        : CURRENCY.standardShippingFee
      : CURRENCY.expressShippingFee;
  const discountAmount = cartTotal * discount;
  const finalTotal = Math.max(0, cartTotal - discountAmount + deliveryFee);
  const gstAmount = (finalTotal * CURRENCY.gstRate) / (1 + CURRENCY.gstRate);

  // Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errors.email = "Please enter a valid email address.";
    if (!formData.addressLine1.trim())
      errors.addressLine1 = "Street address is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.postcode.trim()) errors.postcode = "PIN code / Postal code is required.";
    if (!formData.phone.trim()) errors.phone = "Phone number is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      alert("Please agree to the terms of purchase before placing your order.");
      return;
    }

    setIsSubmitting(true);

    const generatedOrderNumber = `AW-${Math.floor(10000 + Math.random() * 90000)}`;
    const estimatedDate =
      deliveryMethod === "standard" ? "3–5 working days" : "1–2 working days";

    const completedOrder: OrderDetails = {
      orderNumber: generatedOrderNumber,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      items: [...cart],
      subtotal: cartTotal,
      deliveryFee,
      deliveryMethod:
        deliveryMethod === "standard"
          ? "Standard courier (Blue Dart / Delhivery Express)"
          : "Priority Air Express (Guaranteed 1–2 days)",
      estimatedDelivery: estimatedDate,
      total: finalTotal,
      currency: CURRENCY.code,
      address: formData,
      giftNote: giftNote || undefined,
      paymentMethod:
        paymentMethod === "upi"
          ? `UPI (${upiId})`
          : paymentMethod === "card"
          ? "Credit / Debit Card"
          : "NetBanking",
      cardLast4: paymentMethod === "card" ? "4242" : undefined,
    };

    setLastOrder(completedOrder);
    addOrderToHistory(completedOrder);
    clearCart();

    setTimeout(() => {
      router.push("/order-confirmed");
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#F8F5EF] min-h-screen py-20 px-4 text-center">
        <div className="max-w-[480px] mx-auto p-10 bg-[#FFFDFA] border border-[#D8CFC6]">
          <h1 className="font-editorial text-[28px] text-[#302B28] mb-3">
            Your bag is empty
          </h1>
          <p className="text-[14px] text-[#69615B] mb-8 leading-relaxed">
            Please select at least one garment before proceeding to checkout.
          </p>
          <Link
            href="/category/women"
            className="inline-block px-8 py-3.5 bg-[#713A48] text-[#FFFDFA] text-[14px] font-medium tracking-wide"
          >
            Explore the wardrobe
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen">
      {/* Dedicated Checkout Header (Figma frame #29:967) */}
      <header className="border-b border-[#D8CFC6] bg-[#FFFDFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link
            href="/bag"
            className="inline-flex items-center gap-2 text-[13px] text-[#69615B] hover:text-[#713A48] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to bag</span>
          </Link>

          {/* Centered Brand Crest */}
          <Link href="/" className="flex flex-col items-center">
            <span className="font-editorial text-[22px] sm:text-[26px] text-[#302B28] tracking-wide font-normal">
              Anastasia’s Wardrobe
            </span>
          </Link>

          {/* Security & Region Indicator */}
          <div className="flex items-center gap-4 text-[12px] text-[#69615B]">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#3E6545]">
              <Lock className="w-3.5 h-3.5" />
              Secure 256-bit SSL
            </span>
            <span>{CURRENCY.regionLabel}</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Stepper Progress Bar (Figma frame #29:967) */}
        <div className="max-w-[900px] mb-10 flex items-center gap-3 text-[13px] font-medium tracking-wide">
          <Link
            href="/bag"
            className="text-[#69615B] hover:text-[#713A48] transition-colors"
          >
            Bag
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#D8CFC6]" />

          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentStep === 1
                ? "text-[#713A48] font-semibold underline underline-offset-4"
                : "text-[#302B28] hover:text-[#713A48]"
            }`}
          >
            {currentStep === 2 && <Check className="w-3.5 h-3.5 text-[#3E6545]" />}
            <span>1. Contact & delivery</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#D8CFC6]" />

          <span
            className={
              currentStep === 2
                ? "text-[#713A48] font-semibold underline underline-offset-4"
                : "text-[#69615B]"
            }
          >
            2. Payment & review
          </span>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Interactive Form Steps */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            {/* STEP 1: Contact & Delivery */}
            {currentStep === 1 && (
              <form onSubmit={handleContinueToPayment} className="flex flex-col gap-8">
                {/* Contact Information (Figma #28:3204) */}
                <div className="p-6 sm:p-7 bg-[#FFFDFA] border border-[#D8CFC6]">
                  <h2 className="font-editorial text-[24px] text-[#302B28] mb-4">
                    Contact
                  </h2>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                      />
                      {formErrors.email && (
                        <p className="text-[12px] text-[#963D37] mt-1">
                          {formErrors.email}
                        </p>
                      )}
                      <p className="text-[12px] text-[#69615B] mt-1.5">
                        Order confirmation and dispatch courier updates will go here.
                      </p>
                    </div>

                    {/* Fixed Checkbox Alignment without text overlap */}
                    <label className="flex items-start gap-3 mt-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newsletterConsent}
                        onChange={(e) => setNewsletterConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#713A48] cursor-pointer"
                      />
                      <span className="text-[13px] text-[#302B28] leading-snug">
                        Send me occasional wardrobe letters & seasonal invitations · optional
                      </span>
                    </label>
                  </div>
                </div>

                {/* Delivery Address (Figma #28:3234) */}
                <div className="p-6 sm:p-7 bg-[#FFFDFA] border border-[#D8CFC6]">
                  <h2 className="font-editorial text-[24px] text-[#302B28] mb-5">
                    Delivery address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country */}
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        Country / region
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none cursor-pointer"
                      >
                        <option value="India">India</option>
                        <option value="United Kingdom">United Kingdom (UK)</option>
                        <option value="United States">United States</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        First name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                      />
                      {formErrors.firstName && (
                        <p className="text-[12px] text-[#963D37] mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                      />
                      {formErrors.lastName && (
                        <p className="text-[12px] text-[#963D37] mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Address Line 1 */}
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        Address line 1
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) =>
                          setFormData({ ...formData, addressLine1: e.target.value })
                        }
                        required
                        placeholder="House / flat number, building and street name"
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                      />
                      {formErrors.addressLine1 && (
                        <p className="text-[12px] text-[#963D37] mt-1">
                          {formErrors.addressLine1}
                        </p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        Address line 2 · optional
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine2 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, addressLine2: e.target.value })
                        }
                        placeholder="Apartment, suite, unit, floor, landmark"
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        City / town
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                      />
                      {formErrors.city && (
                        <p className="text-[12px] text-[#963D37] mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>

                    {/* PIN / Postcode */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        PIN / Postal code
                      </label>
                      <input
                        type="text"
                        value={formData.postcode}
                        onChange={(e) =>
                          setFormData({ ...formData, postcode: e.target.value })
                        }
                        required
                        placeholder="e.g. 400026"
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none uppercase"
                      />
                      {formErrors.postcode && (
                        <p className="text-[12px] text-[#963D37] mt-1">
                          {formErrors.postcode}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                      />
                      {formErrors.phone && (
                        <p className="text-[12px] text-[#963D37] mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                      <p className="text-[12px] text-[#69615B] mt-1">
                        Only used by the delivery courier to send dispatch and time-slot SMS alerts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Method Selector (Figma #28:3310) */}
                <div className="p-6 sm:p-7 bg-[#FFFDFA] border border-[#D8CFC6]">
                  <h2 className="font-editorial text-[24px] text-[#302B28] mb-4">
                    Delivery method
                  </h2>

                  <div className="flex flex-col gap-3">
                    {/* Standard */}
                    <label
                      className={`p-4 border flex items-center justify-between cursor-pointer transition-colors ${
                        deliveryMethod === "standard"
                          ? "border-[#713A48] bg-[#FAF8F5]"
                          : "border-[#D8CFC6] bg-[#FFFDFA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "standard"}
                          onChange={() => setDeliveryMethod("standard")}
                          className="w-4 h-4 accent-[#713A48]"
                        />
                        <div>
                          <span className="text-[14px] font-medium text-[#302B28] block">
                            Standard courier (Blue Dart / Delhivery Express)
                          </span>
                          <span className="text-[12px] text-[#69615B]">
                            Estimated arrival within 3–5 working days
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-medium text-[#302B28]">
                        {isFreeStandard ? (
                          <span className="text-[#3E6545]">Complimentary</span>
                        ) : (
                          formatPrice(CURRENCY.standardShippingFee)
                        )}
                      </span>
                    </label>

                    {/* Express */}
                    <label
                      className={`p-4 border flex items-center justify-between cursor-pointer transition-colors ${
                        deliveryMethod === "express"
                          ? "border-[#713A48] bg-[#FAF8F5]"
                          : "border-[#D8CFC6] bg-[#FFFDFA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "express"}
                          onChange={() => setDeliveryMethod("express")}
                          className="w-4 h-4 accent-[#713A48]"
                        />
                        <div>
                          <span className="text-[14px] font-medium text-[#302B28] block">
                            Priority Air Express
                          </span>
                          <span className="text-[12px] text-[#69615B]">
                            Guaranteed dispatch with 1–2 working days arrival
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-medium text-[#302B28]">
                        {formatPrice(CURRENCY.expressShippingFee)}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit to Step 2 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <Link
                    href="/bag"
                    className="text-[13px] text-[#69615B] hover:text-[#713A48] hover:underline"
                  >
                    ← Return to bag
                  </Link>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-4 bg-[#713A48] text-[#FFFDFA] text-[14px] font-medium tracking-wide hover:bg-[#582D38] transition-colors shadow-sm cursor-pointer"
                  >
                    Continue to payment & review
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment & Final Review (Figma #28:3437) */}
            {currentStep === 2 && (
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-8">
                {/* Contact & Delivery Review Card (Figma #28:3443) */}
                <div className="p-6 bg-[#FFFDFA] border border-[#D8CFC6] divide-y divide-[#F0EAE1]">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <span className="text-[11px] font-medium text-[#69615B] uppercase tracking-wider block mb-0.5">
                        Contact
                      </span>
                      <p className="text-[14px] text-[#302B28] font-medium">
                        {formData.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[12px] text-[#713A48] hover:underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <span className="text-[11px] font-medium text-[#69615B] uppercase tracking-wider block mb-0.5">
                        Ship to
                      </span>
                      <p className="text-[14px] text-[#302B28]">
                        {formData.firstName} {formData.lastName} · {formData.addressLine1}
                        {formData.addressLine2 ? `, ${formData.addressLine2}` : ""},{" "}
                        {formData.city} {formData.postcode}, {formData.country}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[12px] text-[#713A48] hover:underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <span className="text-[11px] font-medium text-[#69615B] uppercase tracking-wider block mb-0.5">
                        Method
                      </span>
                      <p className="text-[14px] text-[#302B28]">
                        {deliveryMethod === "standard"
                          ? "Standard courier"
                          : "Priority Air Express"}{" "}
                        · {deliveryFee === 0 ? "Complimentary" : formatPrice(deliveryFee)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[12px] text-[#713A48] hover:underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector (Figma #28:3485) */}
                <div className="p-6 sm:p-7 bg-[#FFFDFA] border border-[#D8CFC6]">
                  <h2 className="font-editorial text-[24px] text-[#302B28] mb-1">
                    Payment method
                  </h2>
                  <p className="text-[12px] text-[#69615B] mb-5">
                    All transactions are secure, encrypted, and processed in {CURRENCY.code} ({CURRENCY.symbol}).
                  </p>

                  <div className="flex flex-col gap-4">
                    {/* UPI Option */}
                    <div
                      className={`border p-5 transition-colors ${
                        paymentMethod === "upi"
                          ? "border-[#713A48] bg-[#FAF8F5]"
                          : "border-[#D8CFC6] bg-[#FFFDFA]"
                      }`}
                    >
                      <label className="flex items-center justify-between cursor-pointer mb-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "upi"}
                            onChange={() => setPaymentMethod("upi")}
                            className="w-4 h-4 accent-[#713A48]"
                          />
                          <span className="text-[14px] font-medium text-[#302B28] flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-[#713A48]" />
                            UPI (Google Pay, PhonePe, Paytm, BHIM)
                          </span>
                        </div>
                        <span className="text-[11px] text-[#3E6545] font-medium">Instant & Secure</span>
                      </label>

                      {paymentMethod === "upi" && (
                        <div className="pt-3 border-t border-[#F0EAE1]">
                          <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                            Enter UPI ID / VPA
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. mobile@upi or username@okhdfcbank"
                            className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                          />
                          <p className="text-[11px] text-[#69615B] mt-1.5">
                            A payment approval request will be sent to your UPI app.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Credit / Debit Card Option */}
                    <div
                      className={`border p-5 transition-colors ${
                        paymentMethod === "card"
                          ? "border-[#713A48] bg-[#FAF8F5]"
                          : "border-[#D8CFC6] bg-[#FFFDFA]"
                      }`}
                    >
                      <label className="flex items-center justify-between cursor-pointer mb-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                            className="w-4 h-4 accent-[#713A48]"
                          />
                          <span className="text-[14px] font-medium text-[#302B28] flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#713A48]" />
                            Credit or debit card
                          </span>
                        </div>
                        <span className="text-[11px] text-[#69615B]">
                          Visa · Mastercard · RuPay · Amex
                        </span>
                      </label>

                      {paymentMethod === "card" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-[#F0EAE1]">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                              Name on card
                            </label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              required
                              className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                              Card number
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                                placeholder="4242 •••• •••• ••••"
                                className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none font-mono"
                              />
                              <CreditCard className="w-4 h-4 text-[#69615B] absolute right-3 top-3" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                              Expiry date
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              required
                              placeholder="MM/YY"
                              className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                              CVV / CVC
                            </label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              required
                              maxLength={4}
                              placeholder="3 digits"
                              className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none font-mono"
                            />
                          </div>

                          <div className="sm:col-span-2 pt-2">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={sameBilling}
                                onChange={(e) => setSameBilling(e.target.checked)}
                                className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#713A48] cursor-pointer"
                              />
                              <span className="text-[13px] text-[#302B28]">
                                Billing address matches delivery address
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* NetBanking Option */}
                    <div
                      className={`border p-4 transition-colors ${
                        paymentMethod === "netbanking"
                          ? "border-[#713A48] bg-[#FAF8F5]"
                          : "border-[#D8CFC6] bg-[#FFFDFA]"
                      }`}
                    >
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "netbanking"}
                            onChange={() => setPaymentMethod("netbanking")}
                            className="w-4 h-4 accent-[#713A48]"
                          />
                          <span className="text-[14px] font-medium text-[#302B28] flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#713A48]" />
                            NetBanking
                          </span>
                        </div>
                        <span className="text-[12px] text-[#69615B]">All Indian Banks</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Terms of Purchase Consent (Figma #28:3627) */}
                <div className="p-5 bg-[#FFFDFA] border border-[#D8CFC6]">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#713A48] cursor-pointer"
                    />
                    <span className="text-[13px] text-[#302B28] leading-relaxed">
                      I agree to the terms of purchase and have read the return eligibility
                      (unworn garments with tags attached are eligible for 30-day complimentary returns).
                    </span>
                  </label>
                </div>

                {/* Submit Order Button (Figma #28:3607) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[13px] text-[#69615B] hover:text-[#713A48] hover:underline cursor-pointer"
                  >
                    ← Back to delivery details
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 bg-[#713A48] text-[#FFFDFA] text-[15px] font-medium tracking-wide hover:bg-[#582D38] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Confirming payment with bank..."
                    ) : (
                      `Pay ${formatPrice(finalTotal)} ${CURRENCY.code} · Place order`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary (Figma #28:3358) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="p-6 bg-[#FFFDFA] border border-[#D8CFC6] flex flex-col gap-6">
              <h2 className="font-editorial text-[22px] text-[#302B28] pb-3.5 border-b border-[#D8CFC6]">
                Your selection ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>

              {/* Items Mini List */}
              <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 bg-[#EAE4D9] flex-shrink-0 border border-[#D8CFC6] overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#713A48] text-[#FFFDFA] text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-editorial text-[16px] text-[#302B28] truncate leading-tight">
                        {item.product.name}
                      </h3>
                      <p className="text-[12px] text-[#69615B] mt-0.5">
                        {item.color} · Size {item.size}
                      </p>
                    </div>
                    <span className="text-[14px] font-medium text-[#302B28]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Handwritten Gift Note Indicator */}
              {giftNote && (
                <div className="p-3 bg-[#FAF8F5] border border-[#D8CFC6] text-[12px] text-[#302B28] flex items-start gap-2.5">
                  <Gift className="w-4 h-4 text-[#713A48] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block text-[#713A48]">Gift note included:</span>
                    <span className="italic text-[#69615B]">“{giftNote}”</span>
                  </div>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="pt-4 border-t border-[#D8CFC6] flex flex-col gap-2.5 text-[14px]">
                <div className="flex justify-between text-[#302B28]">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#3E6545]">
                    <span>Promotional discount ({promoCode})</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#302B28]">
                  <span>Delivery ({deliveryMethod === "standard" ? "Standard" : "Priority Express"})</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-[#3E6545]">Complimentary</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#D8CFC6] flex justify-between items-baseline">
                  <span className="font-editorial text-[18px] text-[#302B28]">Total · {CURRENCY.code}</span>
                  <span className="font-editorial text-[26px] text-[#302B28] font-semibold">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                <p className="text-[11px] text-[#69615B] leading-relaxed">
                  Includes {formatPrice(gstAmount)} GST (12%).
                </p>
              </div>

              {/* Help & Privacy notes */}
              <div className="pt-3 border-t border-[#F0EAE1] text-[11px] text-[#69615B] leading-relaxed">
                <p className="mb-1">
                  Need assistance? Our concierge is on hand at{" "}
                  <a
                    href="mailto:care@anastasiaswardrobe.com"
                    className="text-[#713A48] underline"
                  >
                    care@anastasiaswardrobe.com
                  </a>
                </p>
                <p>
                  Your personal details are used strictly to fulfill your order and are never sold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
