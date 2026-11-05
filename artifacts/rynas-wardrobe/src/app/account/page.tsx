"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { AccountOverview } from "@/components/account/AccountOverview";
import { AuthView } from "@/components/account/AuthView";

export default function AccountPage() {
  const { isAuthenticated } = useStore();

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen">
      {/* Breadcrumb Bar */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2">
          <Link href="/" className="hover:underline text-inherit">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#302B28]">Customer Account</span>
        </nav>
      </div>

      {/* Main Account Portal: Signed-In vs Guest/Sign-In View */}
      {isAuthenticated ? <AccountOverview /> : <AuthView />}
    </div>
  );
}
