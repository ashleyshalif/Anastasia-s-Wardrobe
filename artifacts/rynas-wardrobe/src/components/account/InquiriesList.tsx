"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, Clock, Mail, AlertCircle, RefreshCw } from "lucide-react";
import { useStore } from "@/lib/store";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
  is_read: boolean;
  is_replied: boolean;
  replied_at?: string;
  admin_reply?: string;
}

export function InquiriesList() {
  const { user } = useStore();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Inquiry Form State
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchInquiries = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      const res = await fetch(`${apiUrl}/contact/my/?email=${encodeURIComponent(user.email)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(Array.isArray(data) ? data : []);
      } else {
        setError("Unable to retrieve atelier inquiries at this moment.");
      }
    } catch {
      setError("Atelier inquiry server currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [user?.email]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim() || !user) return;
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      const res = await fetch(`${apiUrl}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          subject: newSubject.trim(),
          message: newMessage.trim(),
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setNewSubject("");
        setNewMessage("");
        setShowNewForm(false);
        // Refresh inquiry list
        setTimeout(() => {
          fetchInquiries();
        }, 300);
      } else {
        alert("Failed to submit inquiry. Please try again.");
      }
    } catch {
      alert("Network error sending inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#D8CFC6]">
        <div>
          <h2 className="font-editorial text-[24px] sm:text-[28px] text-[#302B28]">
            Atelier Inquiries & Support ({inquiries.length})
          </h2>
          <p className="text-[13px] text-[#69615B] mt-0.5">
            Send questions regarding tailoring, fit, fabric care, or order dispatches. Our team responds directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchInquiries}
            className="p-2 border border-[#D8CFC6] text-[#69615B] hover:text-[#713A48] hover:border-[#713A48] transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowNewForm(!showNewForm)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{showNewForm ? "Close Form" : "New Inquiry"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="p-4 bg-[#EAF2EC] border border-[#3E6545]/30 flex items-center gap-3 text-[13px] text-[#3E6545]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>
            Your inquiry has been received by the Ryna’s Wardrobe Atelier team. Staff will reply here and by email.
          </span>
        </div>
      )}

      {/* Interactive New Inquiry Form Drawer */}
      {showNewForm && (
        <div className="p-6 bg-[#FFFDFA] border border-[#713A48]/40 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-4 text-[#713A48]">
            <MessageSquare className="w-4 h-4" />
            <h3 className="font-editorial text-[18px] text-[#302B28]">
              Compose Inquiry for Atelier Staff
            </h3>
          </div>

          <form onSubmit={handleSendInquiry} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] font-medium mb-1.5">
                Subject / Topic
              </label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Size advice for Midnight Velvet Dress, Delivery schedule inquiry..."
                required
                className="w-full px-3.5 py-2.5 text-[14px] bg-[#FAF8F5] border border-[#D8CFC6] text-[#302B28] focus:border-[#713A48] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] font-medium mb-1.5">
                Your Message
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your question or request in detail..."
                required
                rows={4}
                className="w-full px-3.5 py-2.5 text-[14px] bg-[#FAF8F5] border border-[#D8CFC6] text-[#302B28] focus:border-[#713A48] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#69615B] hover:text-[#302B28]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors cursor-pointer disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Submit Inquiry"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inquiries Listing */}
      {loading && inquiries.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6]">
          <Clock className="w-8 h-8 text-[#713A48] animate-spin mx-auto mb-3" />
          <p className="font-editorial text-[18px] text-[#302B28]">
            Checking atelier message desk...
          </p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6]">
          <MessageSquare className="w-12 h-12 text-[#D8CFC6] mx-auto mb-4 stroke-[1.5]" />
          <h3 className="font-editorial text-[22px] text-[#302B28] mb-2">
            No inquiries recorded
          </h3>
          <p className="text-[14px] text-[#69615B] max-w-[440px] mx-auto mb-6 leading-relaxed">
            Have a question about garments, custom adjustments, or your parcel? Send an inquiry and the atelier team will respond directly.
          </p>
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center justify-center px-6 py-3 text-xs font-medium tracking-wider uppercase whitespace-nowrap bg-[#713A48] text-[#FFFDFA] hover:bg-[#582D38] transition-colors cursor-pointer shadow-xs"
          >
            Ask Atelier Team
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-[#FFFDFA] border border-[#D8CFC6] shadow-sm overflow-hidden"
            >
              {/* Inquiry Header */}
              <div className="p-4 sm:p-5 bg-[#F8F5EF] border-b border-[#D8CFC6] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] text-[#69615B]">
                    #{inq.id}
                  </span>
                  <h3 className="font-editorial text-[18px] sm:text-[20px] text-[#302B28]">
                    {inq.subject || "General Atelier Inquiry"}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-[#69615B]">
                    {new Date(inq.submitted_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  {inq.is_replied ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 border border-[#166534]/30 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Atelier Replied</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9A3412] bg-[#FFEDD5] px-2.5 py-1 border border-[#9A3412]/30 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Awaiting Reply</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Inquiry Body */}
              <div className="p-5 sm:p-6 flex flex-col gap-4">
                {/* Customer's message */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#69615B] font-semibold block mb-1">
                    Your Question:
                  </span>
                  <p className="text-[14px] text-[#302B28] leading-relaxed bg-[#FAF8F5] p-3.5 border border-[#EDE7DF]">
                    {inq.message}
                  </p>
                </div>

                {/* Staff Response (if available) */}
                {inq.is_replied && inq.admin_reply ? (
                  <div className="p-4 bg-[#FAF5EE] border border-[#713A48]/30 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#713A48]" />
                        <span className="font-editorial text-[16px] text-[#713A48] font-semibold">
                          Ryna’s Wardrobe Atelier Team Reply
                        </span>
                      </div>
                      {inq.replied_at && (
                        <span className="text-[11px] text-[#69615B]">
                          {new Date(inq.replied_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-[#302B28] leading-relaxed whitespace-pre-wrap">
                      {inq.admin_reply}
                    </p>
                  </div>
                ) : (
                  <div className="text-[12px] text-[#69615B] italic flex items-center gap-2 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#713A48]" />
                    <span>
                      Our atelier team reviews incoming inquiries throughout the day. Replies will appear here directly.
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

