"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Package,
  Gift,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { CURRENCY, formatPrice } from "@/config/currency";

export default function BagPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    isInWishlist,
    giftNote,
    setGiftNote,
    promoCode,
    discount,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const [giftNoteOpen, setGiftNoteOpen] = useState(Boolean(giftNote));
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Delivery calculation: Complimentary over ₹4,999, else standard ₹250
  const freeShippingThreshold = CURRENCY.freeShippingThreshold;
  const isFreeDelivery = cartTotal >= freeShippingThreshold;
  const deliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : CURRENCY.standardShippingFee;
  const discountAmount = cartTotal * discount;
  const finalTotal = Math.max(0, cartTotal - discountAmount + deliveryFee);
  const gstAmount = (finalTotal * CURRENCY.gstRate) / (1 + CURRENCY.gstRate); // 12% GST included

  const handleMoveToWishlist = (item: (typeof cart)[0]) => {
    if (!isInWishlist(item.product.id)) {
      toggleWishlist(item.product.id);
    }
    removeFromCart(item.id);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput);
    if (result.success) {
      setPromoMessage({ text: result.message, isError: false });
      setPromoInput("");
    } else {
      setPromoMessage({ text: result.message, isError: true });
    }
  };

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-[13px] text-[#69615B] flex items-center gap-2">
          <Link href="/" className="hover:text-[#713A48] hover:underline transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#302B28] font-medium">Shopping bag</span>
        </nav>

        {/* Empty Bag State (Figma #28:4671) */}
        {cart.length === 0 ? (
          <div className="max-w-[620px] mx-auto my-12 text-center py-16 px-8 bg-[#FFFDFA] border border-[#D8CFC6]">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-3">
              BAG / EMPTY
            </span>
            <h1 className="font-editorial text-[32px] sm:text-[38px] text-[#302B28] mb-4 leading-tight">
              Your bag is taking a breath.
            </h1>
            <p className="text-[15px] text-[#69615B] max-w-[440px] mx-auto mb-10 leading-relaxed">
              No pieces here yet. Begin with a soft layer, or visit your saved favourites.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/category/new-in"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#713A48] text-[#FFFDFA] text-[14px] font-medium tracking-wide hover:bg-[#582D38] transition-colors"
              >
                Explore new arrivals
              </Link>
              <Link
                href="/wishlist"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-[#713A48] text-[#713A48] text-[14px] font-medium tracking-wide hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors"
              >
                Visit your wishlist
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Bag View */
          <div>
            {/* Page Header */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8CFC6] pb-6 gap-4">
              <div>
                <span className="text-[11px] font-medium tracking-[0.18em] text-[#713A48] uppercase block mb-1.5">
                  YOUR WARDROBE SELECTION
                </span>
                <h1 className="font-editorial text-[36px] sm:text-[44px] text-[#302B28] leading-tight">
                  Shopping bag
                </h1>
              </div>
              <p className="text-[14px] text-[#69615B]">
                {cartCount} {cartCount === 1 ? "piece" : "pieces"} · {formatPrice(cartTotal)} {CURRENCY.code}
              </p>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mb-8 p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] text-[#302B28] mb-2 font-medium gap-2">
                <span>
                  {isFreeDelivery ? (
                    <span className="text-[#3E6545] flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> You have unlocked complimentary delivery!
                    </span>
                  ) : (
                    `Add ${formatPrice(freeShippingThreshold - cartTotal)} more to qualify for complimentary delivery.`
                  )}
                </span>
                <span className="text-xs text-[#69615B]">Threshold: {formatPrice(freeShippingThreshold)}</span>
              </div>
              <div className="w-full h-1.5 bg-[#EAE4D9] rounded-none overflow-hidden">
                <div
                  className="h-full bg-[#713A48] transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Main Content Layout: Items on Left, Summary on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Items List & Extras */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                {/* Cart Items List */}
                <div className="border border-[#D8CFC6] bg-[#FFFDFA] divide-y divide-[#D8CFC6]">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-7 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="relative w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 bg-[#EAE4D9] overflow-hidden border border-[#D8CFC6] block"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="120px"
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Product Info & Controls */}
                      <div className="flex-1 min-w-0 w-full flex flex-col justify-between self-stretch">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[11px] font-medium text-[#69615B] tracking-wider uppercase block">
                              {item.product.department}
                            </span>
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="font-editorial text-[20px] text-[#302B28] hover:text-[#713A48] transition-colors leading-snug block mt-0.5"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-[13px] text-[#69615B] mt-1.5 flex flex-wrap items-center gap-3">
                              <span>
                                Colour: <strong className="text-[#302B28] font-normal">{item.color}</strong>
                              </span>
                              <span>·</span>
                              <span>
                                Size: <strong className="text-[#302B28] font-normal">{item.size}</strong>
                              </span>
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="font-medium text-[16px] text-[#302B28]">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="block text-[11px] text-[#69615B] mt-0.5">
                                {formatPrice(item.product.price)} each
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-4 border-t border-[#F0EAE1]">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-[#D8CFC6] bg-[#F8F5EF]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-[#302B28] hover:bg-[#EAE4D9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-[13px] font-medium text-[#302B28]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#302B28] hover:bg-[#EAE4D9] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Secondary Actions */}
                          <div className="flex items-center gap-5 text-[12px]">
                            <button
                              type="button"
                              onClick={() => handleMoveToWishlist(item)}
                              className="inline-flex items-center gap-1.5 text-[#69615B] hover:text-[#713A48] transition-colors cursor-pointer"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              Move to wishlist
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="inline-flex items-center gap-1.5 text-[#69615B] hover:text-[#963D37] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Complimentary Gift Note Section (Figma frame #29:825) */}
                <div className="p-6 bg-[#FFFDFA] border border-[#D8CFC6]">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={giftNoteOpen}
                      onChange={(e) => {
                        setGiftNoteOpen(e.target.checked);
                        if (!e.target.checked) setGiftNote("");
                      }}
                      className="mt-1 w-4 h-4 flex-shrink-0 accent-[#713A48] cursor-pointer"
                    />
                    <div>
                      <span className="text-[14px] font-medium text-[#302B28] flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#713A48] flex-shrink-0" />
                        Add a complimentary handwritten gift note
                      </span>
                      <span className="block text-[12px] text-[#69615B] mt-0.5 leading-relaxed">
                        Your words will be inscribed by hand on heavy rag paper and tucked inside our signature linen ribbon wrapping.
                      </span>
                    </div>
                  </label>

                  {giftNoteOpen && (
                    <div className="mt-4 pt-4 border-t border-[#F0EAE1]">
                      <label className="block text-[12px] uppercase tracking-wider text-[#69615B] mb-2 font-medium">
                        Your gift note · optional (max 250 characters)
                      </label>
                      <textarea
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value.slice(0, 250))}
                        rows={3}
                        placeholder="A little something, just for you. With love..."
                        className="w-full p-3 text-[13px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none resize-none"
                      />
                      <div className="flex justify-between items-center mt-1 text-[11px] text-[#69615B]">
                        <span>Tied with our seasonal emerald & ruby ribbon</span>
                        <span>{giftNote.length}/250</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Promotional Code Form (Figma frame #29:841) */}
                <div className="p-6 bg-[#FFFDFA] border border-[#D8CFC6]">
                  <h3 className="text-[13px] font-medium uppercase tracking-wider text-[#302B28] mb-3">
                    Promotional privilege or gift voucher
                  </h3>
                  {discount > 0 ? (
                    <div className="flex items-center justify-between p-3 bg-[#F4F1EA] border border-[#713A48]/30">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#3E6545]" />
                        <span className="text-[13px] text-[#302B28]">
                          Code <strong className="font-semibold text-[#713A48]">{promoCode}</strong> applied (10% privilege savings)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-xs text-[#69615B] hover:text-[#963D37] underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Try code WELCOME10 or AUTUMN"
                        className="flex-1 px-3.5 py-2.5 text-[13px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none uppercase placeholder:normal-case"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#302B28] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#713A48] transition-colors cursor-pointer"
                      >
                        Apply code
                      </button>
                    </form>
                  )}
                  {promoMessage && (
                    <p
                      className={`text-[12px] mt-2 ${
                        promoMessage.isError ? "text-[#963D37]" : "text-[#3E6545]"
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </div>

                {/* Reassurance Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-start gap-3 p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
                    <RotateCcw className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-medium text-[#302B28]">Free 30-day returns</h4>
                      <p className="text-[11px] text-[#69615B] mt-0.5">Complimentary doorstep return courier pickup arranged with every order.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
                    <Package className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-medium text-[#302B28]">Boutique packaging</h4>
                      <p className="text-[11px] text-[#69615B] mt-0.5">Wrapped in tissue paper and sealed with an embossed wax crest.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-[#FFFDFA] border border-[#D8CFC6]">
                    <ShieldCheck className="w-5 h-5 text-[#713A48] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-medium text-[#302B28]">Secure checkout</h4>
                      <p className="text-[11px] text-[#69615B] mt-0.5">Encrypted 256-bit bank standard SSL transaction guarantee.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary (Figma frame #29:864) */}
              <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
                <div className="p-7 bg-[#FFFDFA] border border-[#D8CFC6] flex flex-col gap-6">
                  <h2 className="font-editorial text-[24px] text-[#302B28] pb-4 border-b border-[#D8CFC6]">
                    Order summary
                  </h2>

                  {/* Line Items */}
                  <div className="flex flex-col gap-3 text-[14px]">
                    <div className="flex justify-between text-[#302B28]">
                      <span>Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})</span>
                      <span className="font-medium">{formatPrice(cartTotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-[#3E6545]">
                        <span>Promotional privilege (10%)</span>
                        <span className="font-medium">−{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#302B28]">
                      <div>
                        <span>Standard delivery</span>
                        <span className="block text-[11px] text-[#69615B]">Express Courier (Blue Dart / Delhivery)</span>
                      </div>
                      <span className="font-medium">
                        {deliveryFee === 0 ? (
                          <span className="text-[#3E6545]">Complimentary</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>

                    {giftNote && (
                      <div className="flex justify-between text-[#713A48] text-xs pt-1">
                        <span>Handwritten gift note</span>
                        <span>Included</span>
                      </div>
                    )}
                  </div>

                  {/* Total & Taxes */}
                  <div className="pt-5 border-t border-[#D8CFC6] flex flex-col gap-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-editorial text-[20px] text-[#302B28]">Total · {CURRENCY.code}</span>
                      <span className="font-editorial text-[28px] text-[#302B28] font-semibold">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#69615B] leading-relaxed">
                      Includes {formatPrice(gstAmount)} GST (12%). No hidden duties or delivery surcharges.
                    </p>
                  </div>

                  {/* Primary CTA */}
                  <Link
                    href="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#713A48] text-[#FFFDFA] text-[14px] font-medium tracking-wide hover:bg-[#582D38] transition-colors shadow-sm"
                  >
                    Proceed to checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Continue Shopping Secondary Link */}
                  <div className="text-center">
                    <Link
                      href="/category/women"
                      className="text-[13px] text-[#69615B] hover:text-[#713A48] hover:underline"
                    >
                      Or continue browsing our garments
                    </Link>
                  </div>

                  {/* Accepted Payment Icons */}
                  <div className="pt-4 border-t border-[#F0EAE1] text-center">
                    <p className="text-[11px] text-[#69615B] mb-2 uppercase tracking-wider">
                      Accepted payment methods
                    </p>
                    <p className="text-[12px] text-[#302B28] font-medium tracking-wide">
                      UPI · Cards (Visa, Mastercard, RuPay) · NetBanking · Apple Pay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
