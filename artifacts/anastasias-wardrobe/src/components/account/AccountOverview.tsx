"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  User,
  Heart,
  Crown,
  LogOut,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { OrdersList } from "./OrdersList";
import { AddressBook } from "./AddressBook";
import { ProfileView } from "./ProfileView";

export function AccountOverview() {
  const router = useRouter();
  const { user, orders, addresses, wishlist, returnRequests, logout } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  if (!user) return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Welcome Card */}
      <div className="p-6 sm:p-8 bg-[#FFFDFA] border border-[#D8CFC6] shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#713A48] uppercase">
              THE ATELIER PORTAL
            </span>
            <span className="text-[#D8CFC6]">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3E6545] bg-[#EAF2EC] px-2 py-0.5 border border-[#3E6545]/20">
              <Crown className="w-3 h-3" />
              <span>{user.tier}</span>
            </span>
          </div>

          <h1 className="font-editorial text-[32px] sm:text-[38px] text-[#302B28] leading-tight">
            Welcome back, {user.firstName}
          </h1>

          <p className="text-[14px] text-[#69615B] mt-1">
            {user.email} · Patron since {user.memberSince}
          </p>
        </div>

        {/* Quick Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className="p-3 bg-[#FAF8F5] border border-[#D8CFC6] text-center hover:border-[#713A48] transition-colors cursor-pointer"
          >
            <span className="font-editorial text-[22px] font-semibold text-[#302B28] block">
              {orders.length}
            </span>
            <span className="text-[11px] text-[#69615B] uppercase tracking-wider">
              Orders
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className="p-3 bg-[#FAF8F5] border border-[#D8CFC6] text-center hover:border-[#713A48] transition-colors cursor-pointer"
          >
            <span className="font-editorial text-[22px] font-semibold text-[#302B28] block">
              {addresses.length}
            </span>
            <span className="text-[11px] text-[#69615B] uppercase tracking-wider">
              Addresses
            </span>
          </button>

          <Link
            href="/wishlist"
            className="p-3 bg-[#FAF8F5] border border-[#D8CFC6] text-center hover:border-[#713A48] transition-colors"
          >
            <span className="font-editorial text-[22px] font-semibold text-[#302B28] block">
              {wishlist.length}
            </span>
            <span className="text-[11px] text-[#69615B] uppercase tracking-wider">
              Saved Pieces
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className="p-3 bg-[#FAF8F5] border border-[#D8CFC6] text-center hover:border-[#713A48] transition-colors cursor-pointer"
          >
            <span className="font-editorial text-[22px] font-semibold text-[#713A48] block">
              {returnRequests.length}
            </span>
            <span className="text-[11px] text-[#69615B] uppercase tracking-wider">
              Returns
            </span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#D8CFC6] mb-8 overflow-x-auto">
        <div className="flex gap-2 sm:gap-6 min-w-max">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`py-3.5 px-3 sm:px-4 text-[14px] font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "text-[#713A48] border-b-2 border-[#713A48] font-semibold"
                : "text-[#69615B] hover:text-[#302B28]"
            }`}
          >
            <Package className="w-4 h-4 stroke-[1.5]" />
            <span>Orders & Returns</span>
            {orders.length > 0 && (
              <span className="text-[11px] bg-[#FAF8F5] border border-[#D8CFC6] px-1.5 py-0.2 rounded-full text-[#302B28]">
                {orders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`py-3.5 px-3 sm:px-4 text-[14px] font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "addresses"
                ? "text-[#713A48] border-b-2 border-[#713A48] font-semibold"
                : "text-[#69615B] hover:text-[#302B28]"
            }`}
          >
            <MapPin className="w-4 h-4 stroke-[1.5]" />
            <span>Saved Addresses</span>
            <span className="text-[11px] bg-[#FAF8F5] border border-[#D8CFC6] px-1.5 py-0.2 rounded-full text-[#302B28]">
              {addresses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3.5 px-3 sm:px-4 text-[14px] font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "text-[#713A48] border-b-2 border-[#713A48] font-semibold"
                : "text-[#69615B] hover:text-[#302B28]"
            }`}
          >
            <User className="w-4 h-4 stroke-[1.5]" />
            <span>Profile & Privileges</span>
          </button>

          <Link
            href="/wishlist"
            className="py-3.5 px-3 sm:px-4 text-[14px] font-medium text-[#69615B] hover:text-[#302B28] transition-colors flex items-center gap-2"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
            <span>Wishlist ({wishlist.length})</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/account");
          }}
          className="text-[12px] text-[#69615B] hover:text-[#963D37] inline-flex items-center gap-1.5 py-2 pl-4 cursor-pointer hidden md:inline-flex"
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "orders" && <OrdersList />}
        {activeTab === "addresses" && <AddressBook />}
        {activeTab === "profile" && <ProfileView />}
      </div>
    </div>
  );
}
