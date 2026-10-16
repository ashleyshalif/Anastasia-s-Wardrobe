"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";

interface SignInViewProps {
  onSuccess?: () => void;
}

export function SignInView({ onSuccess }: SignInViewProps) {
  const { login, setIsAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState<"signin" | "register" | "guest">("signin");

  // Sign In Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [resetSent, setResetSent] = useState(false);

  // Register Form State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(true);

  // Guest Lookup State
  const [guestOrderNumber, setGuestOrderNumber] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestError, setGuestError] = useState("");

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const effectiveEmail = email.trim() || "maya.kapoor@example.com";
    login(effectiveEmail, "Maya", "Kapoor");
    setIsAuthenticated(true);
    if (onSuccess) onSuccess();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmail = regEmail.trim() || "maya.kapoor@example.com";
    login(
      effectiveEmail,
      regFirstName.trim() || "Maya",
      regLastName.trim() || "Kapoor"
    );
    setIsAuthenticated(true);
    if (onSuccess) onSuccess();
  };

  const handleDemoLogin = () => {
    login("maya.kapoor@example.com", "Maya", "Kapoor");
    setIsAuthenticated(true);
    if (onSuccess) onSuccess();
  };

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestOrderNumber.trim() || !guestEmail.trim()) {
      setGuestError("Please enter both your order number and email address.");
      return;
    }
    // Log in as guest associated with the email
    login(guestEmail.trim(), "Guest", "Customer");
    if (onSuccess) onSuccess();
  };

  return (
    <div className="w-full max-w-[620px] mx-auto px-4 py-8 sm:py-12">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
          THE ATELIER ACCOUNT
        </span>
        <h1 className="font-editorial text-[32px] sm:text-[40px] text-[#302B28] mb-3 leading-tight">
          Welcome to your wardrobe
        </h1>
        <p className="text-[14px] text-[#69615B] max-w-[440px] mx-auto leading-relaxed">
          Access your orders, manage 30-day returns, review saved addresses, and enjoy
          curated private invitations.
        </p>
      </div>

      {/* Quick Demo Login Pill for reviewer convenience */}
      <div className="mb-6 p-3.5 bg-[#FAF8F5] border border-[#D8CFC6] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#713A48] flex-shrink-0" />
          <span className="text-[12px] text-[#302B28]">
            <strong>Preview Demo:</strong> Maya Kapoor (with active orders & Mumbai addresses)
          </span>
        </div>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="px-4 py-1.5 bg-[#713A48] text-[#FFFDFA] text-[12px] font-medium tracking-wide hover:bg-[#582D38] transition-colors whitespace-nowrap cursor-pointer"
        >
          Instant Demo Sign In
        </button>
      </div>

      {/* Card Container */}
      <div className="bg-[#FFFDFA] border border-[#D8CFC6] shadow-sm">
        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-[#D8CFC6] text-center text-[13px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`py-3.5 px-3 transition-colors cursor-pointer ${
              activeTab === "signin"
                ? "text-[#713A48] border-b-2 border-[#713A48] font-semibold bg-[#FFFDFA]"
                : "text-[#69615B] hover:text-[#302B28] bg-[#F8F5EF]/50"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`py-3.5 px-3 transition-colors cursor-pointer ${
              activeTab === "register"
                ? "text-[#713A48] border-b-2 border-[#713A48] font-semibold bg-[#FFFDFA]"
                : "text-[#69615B] hover:text-[#302B28] bg-[#F8F5EF]/50"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guest")}
            className={`py-3.5 px-3 transition-colors cursor-pointer ${
              activeTab === "guest"
                ? "text-[#713A48] border-b-2 border-[#713A48] font-semibold bg-[#FFFDFA]"
                : "text-[#69615B] hover:text-[#302B28] bg-[#F8F5EF]/50"
            }`}
          >
            Track Order
          </button>
        </div>

        {/* Tab 1: Sign In */}
        {activeTab === "signin" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn(e);
            }}
            className="p-6 sm:p-8 flex flex-col gap-5"
          >
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com (or leave blank for demo)"
                className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="text-[11px] text-[#713A48] hover:underline cursor-pointer"
                >
                  Forgotten password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
              {resetSent && (
                <p className="mt-1.5 text-[12px] text-[#3E6545] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  Password reset link dispatched to your email address.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-[13px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#302B28]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#713A48] cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors shadow-xs cursor-pointer"
            >
              <span>Sign in to wardrobe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Register */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                  First name
                </label>
                <input
                  type="text"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="e.g. Maya"
                  required
                  className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                  Last name
                </label>
                <input
                  type="text"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="e.g. Kapoor"
                  required
                  className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                Email address
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="maya.kapoor@example.com"
                required
                className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                Create password
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none text-[13px] text-[#302B28] leading-snug">
              <input
                type="checkbox"
                checked={newsletterConsent}
                onChange={(e) => setNewsletterConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#713A48] cursor-pointer"
              />
              <span>
                Receive occasional wardrobe letters, invitations to private trunk shows, and seasonal privileges.
              </span>
            </label>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#713A48] text-[#FFFDFA] text-[14px] font-medium tracking-wide hover:bg-[#582D38] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create my wardrobe account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 3: Guest Order Lookup */}
        {activeTab === "guest" && (
          <form onSubmit={handleGuestLookup} className="p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                Order reference number
              </label>
              <input
                type="text"
                value={guestOrderNumber}
                onChange={(e) => setGuestOrderNumber(e.target.value)}
                placeholder="e.g. AW-84192"
                required
                className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                Billing or delivery email
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="email used during checkout"
                required
                className="w-full px-3.5 py-3 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>

            {guestError && (
              <p className="text-[12px] text-[#963D37]">{guestError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#713A48] text-[#FFFDFA] text-[14px] font-medium tracking-wide hover:bg-[#582D38] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Find & track my order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#D8CFC6] flex items-center justify-center gap-2 text-[12px] text-[#69615B]">
          <ShieldCheck className="w-4 h-4 text-[#3E6545]" />
          <span>Encrypted 256-bit SSL · Strict confidentiality for all patron details</span>
        </div>
      </div>
    </div>
  );
}
