"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Crown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogOut,
  Send,
} from "lucide-react";
import { useStore } from "@/lib/store";

export function ProfileView() {
  const router = useRouter();
  const { user, updateProfile, logout } = useStore();

  const [firstName, setFirstName] = useState(user?.firstName || "Maya");
  const [lastName, setLastName] = useState(user?.lastName || "Kapoor");
  const [email, setEmail] = useState(user?.email || "maya.kapoor@example.com");
  const [phone, setPhone] = useState(user?.phone || "+91 98200 12345");
  const [newsletterConsent, setNewsletterConsent] = useState(
    user?.newsletterConsent ?? true
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password Modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  if (!user) return null;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      email,
      phone,
      newsletterConsent,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="pb-2 border-b border-[#D8CFC6]">
        <h2 className="font-editorial text-[24px] sm:text-[28px] text-[#302B28]">
          Wardrobe Profile & Privileges
        </h2>
        <p className="text-[13px] text-[#69615B]">
          Manage your personal details, bespoke tailor preferences, and member invitations.
        </p>
      </div>

      {/* Atelier Membership Tier Card */}
      <div className="p-6 bg-[#FAF8F5] border border-[#713A48] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#713A48] text-[#FFFDFA] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Crown className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-1">
              TIER MEMBERSHIP · {user.memberSince}
            </span>
            <h3 className="font-editorial text-[22px] text-[#302B28]">
              {user.tier}
            </h3>
            <p className="text-[13px] text-[#69615B] mt-1 leading-relaxed max-w-[500px]">
              Enjoy complimentary doorstep courier returns, early access to new autumn edits,
              and bespoke styling concierge assistance.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[12px] text-[#302B28] bg-[#FFFDFA] p-4 border border-[#D8CFC6] w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#713A48]" />
            <span>Complimentary 30-Day Doorstep Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#713A48]" />
            <span>Handwritten Gift Notes on Every Order</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#713A48]" />
            <span>Free Express Shipping over ₹4,999</span>
          </div>
        </div>
      </div>

      {/* Personal Details Form */}
      <div className="p-6 sm:p-8 bg-[#FFFDFA] border border-[#D8CFC6]">
        <h3 className="font-editorial text-[20px] text-[#302B28] mb-4">
          Personal Details
        </h3>

        <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                Phone Number (with country code)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
              />
            </div>
          </div>

          {/* Newsletter Toggle */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none text-[13px] text-[#302B28]">
              <input
                type="checkbox"
                checked={newsletterConsent}
                onChange={(e) => setNewsletterConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#713A48] cursor-pointer"
              />
              <span className="leading-snug">
                Send me seasonal wardrobe letters, boutique opening notices, and invitations to trunk shows.
              </span>
            </label>
          </div>

          {/* Save Status & Button */}
          <div className="pt-4 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center justify-between gap-4">
            {saveSuccess ? (
              <span className="text-[13px] text-[#3E6545] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your profile details have been updated.</span>
              </span>
            ) : (
              <span className="text-[12px] text-[#69615B]">
                Preferred store currency: <strong>Indian Rupees (₹ / INR)</strong>
              </span>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 min-h-[42px] text-xs font-medium tracking-[0.12em] uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors shadow-xs cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security & Sign Out Section */}
      <div className="p-6 bg-[#FFFDFA] border border-[#D8CFC6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-editorial text-[18px] text-[#302B28] mb-1">
            Account Security & Access
          </h4>
          <p className="text-[13px] text-[#69615B]">
            Change your password or sign out from this browser session.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 min-h-[42px] text-xs font-medium tracking-[0.12em] uppercase whitespace-nowrap border border-[#D8CFC6] text-[#302B28] hover:border-[#713A48] hover:text-[#713A48] transition-colors cursor-pointer"
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/account");
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[42px] text-xs font-medium tracking-[0.12em] uppercase whitespace-nowrap border border-[#963D37] text-[#963D37] hover:bg-[#963D37] hover:text-[#FFFDFA] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Password Change Dialog */}
      {passwordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-[480px] bg-[#FFFDFA] border border-[#D8CFC6] shadow-2xl p-6 sm:p-7">
            <h3 className="font-editorial text-[22px] text-[#302B28] mb-4">
              Update Password
            </h3>

            {passwordSuccess ? (
              <div className="p-6 text-center text-[#3E6545]">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
                <p className="font-semibold text-[15px]">Password Updated</p>
                <p className="text-[12px] text-[#69615B] mt-1">
                  Your new security credentials have been saved.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); setForgotPasswordSent(false); }}
                    required
                    className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                  />
                  {forgotPasswordSent ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#3E6545]">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      Reset link sent to <strong>{user.email}</strong>. Check your inbox.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordSent(true)}
                      className="mt-1.5 flex items-center gap-1 text-[12px] text-[#713A48] hover:underline cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      Forgot your current password?
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#D8CFC6] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="inline-flex items-center justify-center px-4 py-2 text-[13px] text-[#69615B] hover:text-[#302B28] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-2 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium hover:bg-[#582D38] transition-colors cursor-pointer"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
