"use client";

import React, { useState } from "react";
import Link from "next/link";

export function WardrobeLetters() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="w-full bg-[#F8F5EF] py-16 lg:py-24 border-t border-[#D8CFC6]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start justify-between">
          {/* Left: Letter Invitation (Figma #28:125 / #28:269) */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-4">
            <h2 className="font-editorial text-[32px] sm:text-[38px] lg:text-[44px] text-[#302B28] leading-[1.2]">
              Letters from the wardrobe
            </h2>
            <p className="text-[15px] text-[#302B28] leading-[1.6] max-w-[460px]">
              New arrivals, seasonal notes and a few things worth keeping. Never a daily deluge.
            </p>
          </div>

          {/* Right: Newsletter Form (Figma #28:128 / #28:272) */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-4 max-w-[520px]">
            {submitted ? (
              <div className="p-6 bg-[#FFFDFA] border border-[#713A48] text-center">
                <p className="font-editorial text-[22px] text-[#713A48] mb-1">
                  Thank you for joining.
                </p>
                <p className="text-[13px] text-[#69615B]">
                  We look forward to writing to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="newsletter-email" className="text-[13px] text-[#69615B]">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#FFFDFA] border border-[#D8CFC6] text-[15px] text-[#302B28] placeholder-[#69615B] focus:border-[#713A48] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-center py-3.5 text-[14px]"
                >
                  Join the wardrobe letters
                </button>

                <p className="text-[12px] text-[#69615B] leading-[1.4] pt-1">
                  By subscribing, you agree to receive our emails. Unsubscribe whenever you like.{" "}
                  <Link href="/privacy" className="underline hover:text-[#302B28]">
                    Privacy notice
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
