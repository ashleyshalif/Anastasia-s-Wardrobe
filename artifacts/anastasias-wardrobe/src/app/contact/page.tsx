"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Order & Delivery Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[#69615B] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:underline text-inherit">Home</Link>
          <span>/</span>
          <span className="text-[#302B28]">Contact Concierge</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-[700px] mx-auto mb-12">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-utility">
            ATELIER CLIENT CARE
          </span>
          <h1 className="font-editorial text-[36px] sm:text-[46px] text-[#302B28] leading-tight mb-4">
            Connect with our atelier
          </h1>
          <p className="text-[15px] text-[#69615B] leading-relaxed">
            Whether you have questions regarding tailored sizing, bespoke gifting, or delivery to your residence,
            our personal styling concierge is dedicated to your assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Atelier Info Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-8 shadow-2xs">
              <h2 className="font-editorial text-[22px] text-[#302B28] mb-6">
                Atelier Concierge Details
              </h2>

              <div className="space-y-6 text-[13px]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FAF5EE] border border-[#713A48]/20 flex items-center justify-center text-[#713A48] flex-shrink-0">
                    <Mail className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <strong className="text-[#302B28] block text-[14px]">Direct Email</strong>
                    <p className="text-[#69615B] mt-0.5">hello@anastasiaswardrobe.com</p>
                    <span className="text-[11px] text-[#713A48] mt-0.5 block">Response within 4 business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FAF5EE] border border-[#713A48]/20 flex items-center justify-center text-[#713A48] flex-shrink-0">
                    <Phone className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <strong className="text-[#302B28] block text-[14px]">Telephone & WhatsApp</strong>
                    <p className="text-[#69615B] mt-0.5">+91 98200 12345</p>
                    <span className="text-[11px] text-[#69615B] mt-0.5 block">Monday to Saturday · 10:00 AM – 6:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FAF5EE] border border-[#713A48]/20 flex items-center justify-center text-[#713A48] flex-shrink-0">
                    <MapPin className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <strong className="text-[#302B28] block text-[14px]">Mumbai Flagship Atelier</strong>
                    <p className="text-[#69615B] mt-0.5">
                      Anastasia's Wardrobe Atelier<br />
                      Altamount Road, Cumballa Hill<br />
                      Mumbai 400026, Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Appointments Box */}
            <div className="bg-[#FAF8F5] border border-[#713A48] p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 text-[#713A48] mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase">Private Trunk Shows</span>
              </div>
              <h3 className="font-editorial text-[18px] text-[#302B28] mb-1">
                Bespoke Styling Sessions
              </h3>
              <p className="text-[13px] text-[#69615B] leading-relaxed">
                Enjoy a private tea and personalized wardrobe consultation at our Mumbai studio. Inquire below to schedule.
              </p>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFDFA] border border-[#D8CFC6] p-6 sm:p-10 shadow-2xs">
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#EAF2EC] border border-[#3E6545]/30 flex items-center justify-center text-[#3E6545] mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-[26px] text-[#302B28] mb-2">
                  Message Received with Thanks
                </h3>
                <p className="text-[14px] text-[#69615B] max-w-[420px] leading-relaxed mb-6">
                  Thank you, <strong>{name}</strong>. Your note has been delivered to our atelier concierge. We will respond to <strong>{email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="px-6 py-2.5 border border-[#713A48] text-[#713A48] hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors text-[13px] font-medium"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="font-editorial text-[24px] text-[#302B28] mb-1">
                  Send an Inquiry
                </h2>
                <p className="text-[13px] text-[#69615B] -mt-3 mb-2">
                  Please provide your details below and our team will be delighted to reply.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Maya Kapoor"
                      className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya.kapoor@example.com"
                      className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                    Nature of Inquiry
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none cursor-pointer"
                  >
                    <option value="Order & Delivery Inquiry">Order & Delivery Inquiry</option>
                    <option value="Complimentary Doorstep Return">Complimentary Doorstep Return</option>
                    <option value="Bespoke Sizing & Garment Fit">Bespoke Sizing & Garment Fit</option>
                    <option value="Private Studio Appointment">Private Studio Appointment</option>
                    <option value="Press & Trunk Show Invitations">Press & Trunk Show Invitations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1.5 font-medium">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How may our atelier team assist your wardrobe today?"
                    className="w-full px-3.5 py-2.5 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Concierge</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
