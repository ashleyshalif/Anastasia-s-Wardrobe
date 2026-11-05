"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package,
  MessageSquare,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Send,
  RefreshCw,
  User,
  Lock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Check,
  X,
  Mail,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { apiUrl, safeFetchJson, getAuthHeaders } from "@/config/api";
import { CURRENCY, formatPrice } from "@/config/currency";

interface Metrics {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalInquiries: number;
  openInquiries: number;
  pendingReturns: number;
  totalProducts: number;
}

interface StaffOrder {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  total: number;
  currency: string;
  payment_method: string;
  delivery_method?: string;
  tracking_number?: string;
  tracking_courier?: string;
  created_at: string;
  items: Array<{
    id: number;
    product_name: string;
    product_slug?: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

interface StaffInquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submitted_at: string;
  is_replied: boolean;
  reply_notes?: string;
  replied_at?: string;
}

interface StaffReturn {
  id: number;
  return_number: string;
  order_number: string;
  product_name: string;
  reason: string;
  resolution: string;
  requested_exchange_size?: string;
  status: string;
  pickup_slot: string;
  courier: string;
  created_at: string;
}

interface StaffCatalogItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  in_stock: boolean;
  color?: string;
  image?: string;
}

export function StaffPortalView() {
  const { user } = useStore();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"orders" | "inquiries" | "catalog">("orders");

  // Metrics
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<StaffOrder | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState("shipped");
  const [newTrackingCourier, setNewTrackingCourier] = useState("Blue Dart Express");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [statusUpdateSubmitting, setStatusUpdateSubmitting] = useState(false);
  const [statusFeedbackMsg, setStatusFeedbackMsg] = useState<string | null>(null);

  // Returns Sub-tab State
  const [returns, setReturns] = useState<StaffReturn[]>([]);
  const [loadingReturns, setLoadingReturns] = useState(false);
  const [showReturnsView, setShowReturnsView] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState<StaffInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "open" | "replied">("all");
  const [selectedInquiry, setSelectedInquiry] = useState<StaffInquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccessMsg, setReplySuccessMsg] = useState<string | null>(null);

  // Catalog State
  const [catalog, setCatalog] = useState<StaffCatalogItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);

  // Permission resolution
  const isSuperuser = !!(user?.isSuperuser || user?.permissions?.isSuperuser);
  const isStaff = !!(user?.isStaff || user?.permissions?.isStaff || isSuperuser);
  const canManageOrders = !!(user?.permissions?.canManageOrders || user?.staffPermissions?.canManageOrders || isSuperuser);
  const canManageInquiries = !!(user?.permissions?.canManageInquiries || user?.staffPermissions?.canManageInquiries || isSuperuser);
  const canManageCatalog = !!(user?.permissions?.canManageCatalog || user?.staffPermissions?.canManageCatalog || isSuperuser);

  const staffEmail = user?.email || user?.username || "user";
  const departmentName =
    user?.permissions?.department ||
    user?.staffPermissions?.department ||
    (isSuperuser ? "Executive Atelier Administration" : "Atelier Staff");

  // Determine initial active tab based on assigned permissions
  useEffect(() => {
    if (!canManageOrders && canManageInquiries) {
      setActiveTab("inquiries");
    } else if (!canManageOrders && !canManageInquiries && canManageCatalog) {
      setActiveTab("catalog");
    }
  }, [canManageOrders, canManageInquiries, canManageCatalog]);

  // Load Overview Metrics
  const fetchOverviewMetrics = useCallback(async () => {
    if (!isStaff) return;
    setLoadingMetrics(true);
    try {
      const res = await fetch(
        apiUrl(`/staff/overview/?email=${encodeURIComponent(staffEmail)}`),
        { headers: getAuthHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.error("Failed to load staff metrics", e);
    } finally {
      setLoadingMetrics(false);
    }
  }, [isStaff, staffEmail]);

  // Load Orders
  const fetchOrders = useCallback(async () => {
    if (!canManageOrders) return;
    setLoadingOrders(true);
    try {
      const url = new URL(apiUrl("/staff/orders/"));
      url.searchParams.set("email", staffEmail);
      if (orderStatusFilter !== "all") {
        url.searchParams.set("status", orderStatusFilter);
      }
      if (orderSearchQuery.trim()) {
        url.searchParams.set("q", orderSearchQuery.trim());
      }
      const res = await fetch(url.toString(), { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to load staff orders", e);
    } finally {
      setLoadingOrders(false);
    }
  }, [canManageOrders, staffEmail, orderStatusFilter, orderSearchQuery]);

  // Load Returns
  const fetchReturns = useCallback(async () => {
    if (!canManageOrders) return;
    setLoadingReturns(true);
    try {
      const res = await fetch(
        apiUrl(`/staff/returns/?email=${encodeURIComponent(staffEmail)}`),
        { headers: getAuthHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setReturns(data);
      }
    } catch (e) {
      console.error("Failed to load returns", e);
    } finally {
      setLoadingReturns(false);
    }
  }, [canManageOrders, staffEmail]);

  // Load Inquiries
  const fetchInquiries = useCallback(async () => {
    if (!canManageInquiries) return;
    setLoadingInquiries(true);
    try {
      const url = new URL(apiUrl("/staff/inquiries/"));
      url.searchParams.set("email", staffEmail);
      if (inquiryFilter !== "all") {
        url.searchParams.set("status", inquiryFilter);
      }
      const res = await fetch(url.toString(), { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (e) {
      console.error("Failed to load staff inquiries", e);
    } finally {
      setLoadingInquiries(false);
    }
  }, [canManageInquiries, staffEmail, inquiryFilter]);

  // Load Catalog
  const fetchCatalog = useCallback(async () => {
    if (!canManageCatalog) return;
    setLoadingCatalog(true);
    try {
      const res = await fetch(
        apiUrl(`/staff/catalog/?email=${encodeURIComponent(staffEmail)}`),
        { headers: getAuthHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setCatalog(data);
      }
    } catch (e) {
      console.error("Failed to load staff catalog", e);
    } finally {
      setLoadingCatalog(false);
    }
  }, [canManageCatalog, staffEmail]);

  useEffect(() => {
    fetchOverviewMetrics();
  }, [fetchOverviewMetrics]);

  useEffect(() => {
    if (activeTab === "orders" && canManageOrders) {
      if (showReturnsView) {
        fetchReturns();
      } else {
        fetchOrders();
      }
    } else if (activeTab === "inquiries" && canManageInquiries) {
      fetchInquiries();
    } else if (activeTab === "catalog" && canManageCatalog) {
      fetchCatalog();
    }
  }, [activeTab, canManageOrders, canManageInquiries, canManageCatalog, showReturnsView, fetchOrders, fetchReturns, fetchInquiries, fetchCatalog]);

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForStatus) return;

    setStatusUpdateSubmitting(true);
    setStatusFeedbackMsg(null);

    try {
      const res = await fetch(
        apiUrl(`/staff/orders/${selectedOrderForStatus.order_number}/status/`),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            staffEmail,
            status: newOrderStatus,
            trackingCourier: newTrackingCourier,
            trackingNumber: newTrackingNumber || `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update order status");
      }
      setStatusFeedbackMsg(`Order ${selectedOrderForStatus.order_number} updated to ${newOrderStatus.toUpperCase()}`);
      setTimeout(() => {
        setSelectedOrderForStatus(null);
        setStatusFeedbackMsg(null);
        fetchOrders();
        fetchOverviewMetrics();
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating status";
      setStatusFeedbackMsg(`Error: ${msg}`);
    } finally {
      setStatusUpdateSubmitting(false);
    }
  };

  // Handle Return Request Status Transition
  const handleUpdateReturnStatus = async (returnId: string, status: string) => {
    try {
      const res = await fetch(apiUrl(`/staff/returns/${returnId}/status/`), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ staffEmail, status }),
      });
      if (res.ok) {
        fetchReturns();
        fetchOverviewMetrics();
      }
    } catch (e) {
      console.error("Failed to update return status", e);
    }
  };

  // Handle Inquiry Reply via SMTP
  const handleSendInquiryReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;

    setSendingReply(true);
    setReplySuccessMsg(null);

    try {
      const res = await fetch(
        apiUrl(`/staff/inquiries/${selectedInquiry.id}/reply/`),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            staffEmail,
            reply: replyText.trim(),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email reply");
      }

      setReplySuccessMsg(data.message || `Reply successfully dispatched to ${selectedInquiry.email} via Atelier SMTP.`);
      setReplyText("");
      fetchInquiries();
      fetchOverviewMetrics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch reply";
      setReplySuccessMsg(`Error: ${msg}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Handle Stock Toggle
  const handleToggleProductStock = async (productId: string) => {
    setTogglingProductId(productId);
    try {
      const res = await fetch(
        apiUrl(`/staff/catalog/${productId}/toggle-stock/`),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ staffEmail }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCatalog((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, in_stock: data.inStock } : item
          )
        );
      }
    } catch (e) {
      console.error("Failed to toggle product stock", e);
    } finally {
      setTogglingProductId(null);
    }
  };

  // Non-staff guard
  if (!isStaff) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center px-4 py-16">
        <div className="max-w-[520px] w-full bg-[#FFFDFA] border border-[#D8CFC6] p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 bg-[#F8F5EF] border border-[#D8CFC6] flex items-center justify-center text-[#713A48]">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-[#713A48] tracking-widest uppercase block mb-1">
            Restricted Atelier Zone
          </span>
          <h1 className="font-editorial text-[28px] text-[#302B28] mb-3">
            Staff Access Required
          </h1>
          <p className="text-[14px] text-[#69615B] leading-relaxed mb-6">
            The Staff Management Console is reserved for verified team members with assigned permissions in Order Fulfillment, Customer Concierge, or Inventory.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account"
              className="px-6 py-3 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors"
            >
              Sign In with Staff Account
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-transparent border border-[#D8CFC6] text-[#302B28] text-[13px] font-medium tracking-wide hover:bg-[#F8F5EF] transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Active Staff Session Bar - Light Luxury Palette */}
      <div className="bg-[#EDE7DE] text-[#302B28] border-b border-[#D8CFC6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#713A48] text-[#FFFDFA] rounded-xs shadow-xs">
              Staff Session Active
            </span>
            <div className="text-[12px]">
              <span className="text-[#69615B]">Logged In: </span>
              <strong className="text-[#302B28]">
                {user?.firstName} {user?.lastName} ({user?.username || staffEmail})
              </strong>
              <span className="hidden sm:inline text-[#713A48] ml-2 font-medium">
                · {departmentName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <a
              href="http://127.0.0.1:8000/admin/store/staffprofile/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#713A48] hover:text-[#302B28] font-medium transition-colors"
              title="Manage roles and toggle staff permissions in Django Admin"
            >
              <span>Django RBAC Admin Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-semibold text-[#713A48] tracking-widest uppercase block mb-1">
              Ryna&apos;s Wardrobe · Internal Operations
            </span>
            <h1 className="font-editorial text-[32px] sm:text-[38px] text-[#302B28] leading-tight">
              Atelier Management Portal
            </h1>
            <p className="text-[14px] text-[#69615B] mt-1">
              Live storefront synchronization · Role-based access for fulfillment & concierge workflows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchOverviewMetrics();
                if (activeTab === "orders") fetchOrders();
                if (activeTab === "inquiries") fetchInquiries();
                if (activeTab === "catalog") fetchCatalog();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFDFA] border border-[#D8CFC6] text-[13px] text-[#302B28] hover:bg-[#F8F5EF] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics ? "animate-spin" : ""}`} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 sm:p-5 bg-[#FFFDFA] border border-[#D8CFC6] shadow-xs">
            <div className="flex items-center justify-between text-[#69615B] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Orders Queue</span>
              <Package className="w-4 h-4 text-[#713A48]" />
            </div>
            <div className="text-[28px] font-editorial text-[#302B28]">
              {metrics ? metrics.totalOrders : "—"}
            </div>
            <div className="text-[12px] text-[#69615B] mt-1">
              <strong className="text-[#713A48]">{metrics?.pendingOrders ?? 0}</strong> pending ·{" "}
              <strong className="text-[#3E6545]">{metrics?.confirmedOrders ?? 0}</strong> confirmed
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#FFFDFA] border border-[#D8CFC6] shadow-xs">
            <div className="flex items-center justify-between text-[#69615B] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Concierge Inquiries</span>
              <MessageSquare className="w-4 h-4 text-[#713A48]" />
            </div>
            <div className="text-[28px] font-editorial text-[#302B28]">
              {metrics ? metrics.totalInquiries : "—"}
            </div>
            <div className="text-[12px] text-[#69615B] mt-1">
              <strong className="text-[#963D37]">{metrics?.openInquiries ?? 0}</strong> awaiting reply
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#FFFDFA] border border-[#D8CFC6] shadow-xs">
            <div className="flex items-center justify-between text-[#69615B] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Returns & Exchanges</span>
              <Truck className="w-4 h-4 text-[#713A48]" />
            </div>
            <div className="text-[28px] font-editorial text-[#302B28]">
              {metrics ? metrics.pendingReturns : "—"}
            </div>
            <div className="text-[12px] text-[#69615B] mt-1">
              Active courier pickup requests
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#FFFDFA] border border-[#D8CFC6] shadow-xs">
            <div className="flex items-center justify-between text-[#69615B] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Active Catalog</span>
              <Layers className="w-4 h-4 text-[#713A48]" />
            </div>
            <div className="text-[28px] font-editorial text-[#302B28]">
              {metrics ? metrics.totalProducts : "—"}
            </div>
            <div className="text-[12px] text-[#3E6545] mt-1">
              Synchronized with inventory
            </div>
          </div>
        </div>

        {/* Portal Module Tabs with Permission Indicators */}
        <div className="flex border-b border-[#D8CFC6] mb-8 bg-[#FFFDFA]">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2.5 px-6 py-4 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "border-[#713A48] text-[#713A48] font-semibold"
                : "border-transparent text-[#69615B] hover:text-[#302B28]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Fulfillment</span>
            {!canManageOrders && (
              <span className="text-[10px] px-1.5 py-0.5 bg-[#F0EAE1] text-[#69615B] rounded-xs uppercase">
                Restricted
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2.5 px-6 py-4 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "inquiries"
                ? "border-[#713A48] text-[#713A48] font-semibold"
                : "border-transparent text-[#69615B] hover:text-[#302B28]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Concierge & Inquiries</span>
            {!canManageInquiries && (
              <span className="text-[10px] px-1.5 py-0.5 bg-[#F0EAE1] text-[#69615B] rounded-xs uppercase">
                Restricted
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2.5 px-6 py-4 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "catalog"
                ? "border-[#713A48] text-[#713A48] font-semibold"
                : "border-transparent text-[#69615B] hover:text-[#302B28]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventory & Stock</span>
            {!canManageCatalog && (
              <span className="text-[10px] px-1.5 py-0.5 bg-[#F0EAE1] text-[#69615B] rounded-xs uppercase">
                Restricted
              </span>
            )}
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: ORDERS & FULFILLMENT                                 */}
        {/* ============================================================ */}
        {activeTab === "orders" && (
          <div>
            {!canManageOrders ? (
              <div className="p-8 bg-[#FFFDFA] border border-[#D8CFC6] text-center">
                <Lock className="w-8 h-8 text-[#963D37] mx-auto mb-3" />
                <h3 className="font-editorial text-[22px] text-[#302B28] mb-2">
                  Orders Access Restricted
                </h3>
                <p className="text-[14px] text-[#69615B] max-w-[500px] mx-auto">
                  Your staff profile is assigned to <strong>{departmentName}</strong> and does not have the <code>can_manage_orders</code> privilege. An Atelier Administrator can grant order permissions through the backend admin.
                </p>
              </div>
            ) : (
              <div>
                {/* Orders / Returns Toggle Sub-bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="inline-flex p-1 bg-[#F0EAE1] rounded-xs border border-[#D8CFC6]">
                    <button
                      type="button"
                      onClick={() => setShowReturnsView(false)}
                      className={`px-4 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                        !showReturnsView
                          ? "bg-[#FFFDFA] text-[#713A48] font-semibold shadow-xs"
                          : "text-[#69615B] hover:text-[#302B28]"
                      }`}
                    >
                      Orders List ({orders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReturnsView(true);
                        fetchReturns();
                      }}
                      className={`px-4 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                        showReturnsView
                          ? "bg-[#FFFDFA] text-[#713A48] font-semibold shadow-xs"
                          : "text-[#69615B] hover:text-[#302B28]"
                      }`}
                    >
                      Return & Exchange Requests ({returns.length})
                    </button>
                  </div>

                  {!showReturnsView && (
                    <div className="flex items-center gap-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-[#69615B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") fetchOrders();
                          }}
                          placeholder="Search order #, customer, email..."
                          className="pl-9 pr-3 py-2 text-[13px] bg-[#FFFDFA] border border-[#D8CFC6] focus:border-[#713A48] outline-none w-[220px] sm:w-[260px]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!showReturnsView ? (
                  <>
                    {/* Status Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <span className="text-[12px] text-[#69615B] mr-2 flex items-center gap-1 font-medium">
                        <Filter className="w-3.5 h-3.5" /> Filter:
                      </span>
                      {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setOrderStatusFilter(st)}
                            className={`px-3 py-1 text-[11px] uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
                              orderStatusFilter === st
                                ? "bg-[#713A48] text-[#FFFDFA] border-[#713A48]"
                                : "bg-[#FFFDFA] text-[#69615B] border-[#D8CFC6] hover:border-[#713A48]"
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>

                    {/* Orders Table */}
                    {loadingOrders ? (
                      <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6] text-[#69615B]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#713A48]" />
                        <span>Loading orders queue...</span>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6] text-[#69615B]">
                        <Package className="w-8 h-8 mx-auto mb-2 text-[#D8CFC6]" />
                        <p className="text-[14px]">No orders found matching this filter.</p>
                      </div>
                    ) : (
                      <div className="bg-[#FFFDFA] border border-[#D8CFC6] overflow-x-auto shadow-xs">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-[#F8F5EF] border-b border-[#D8CFC6] text-[11px] uppercase tracking-wider text-[#69615B]">
                            <tr>
                              <th className="py-3 px-4">Order #</th>
                              <th className="py-3 px-4">Customer</th>
                              <th className="py-3 px-4">Items</th>
                              <th className="py-3 px-4">Total</th>
                              <th className="py-3 px-4">Payment</th>
                              <th className="py-3 px-4">Fulfillment Status</th>
                              <th className="py-3 px-4">Tracking</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F0EAE1]">
                            {orders.map((ord) => {
                              const badgeColor =
                                ord.status === "delivered"
                                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                                  : ord.status === "shipped"
                                  ? "bg-[#E3F2FD] text-[#1565C0]"
                                  : ord.status === "confirmed"
                                  ? "bg-[#FFF8E1] text-[#F57F17]"
                                  : ord.status === "pending"
                                  ? "bg-[#FBE9E7] text-[#D84315]"
                                  : "bg-[#F5F5F5] text-[#616161]";

                              return (
                                <tr key={ord.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                  <td className="py-3.5 px-4 font-mono font-medium text-[#302B28]">
                                    {ord.order_number}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <div className="font-medium text-[#302B28]">
                                      {ord.first_name} {ord.last_name}
                                    </div>
                                    <div className="text-[11px] text-[#69615B]">{ord.email}</div>
                                  </td>
                                  <td className="py-3.5 px-4 text-[12px] text-[#69615B] max-w-[200px]">
                                    {ord.items && ord.items.length > 0 ? (
                                      <div>
                                        <div className="font-medium text-[#302B28] truncate">
                                          {ord.items[0].product_name}
                                        </div>
                                        {ord.items.length > 1 && (
                                          <div className="text-[11px] text-[#713A48]">
                                            +{ord.items.length - 1} more item(s)
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      "No items"
                                    )}
                                  </td>
                                  <td className="py-3.5 px-4 font-semibold text-[#302B28]">
                                    {formatPrice(ord.total)} {CURRENCY.code}
                                  </td>
                                  <td className="py-3.5 px-4 text-[12px]">
                                    <span className="capitalize text-[#302B28]">
                                      {ord.payment_method || "Razorpay / Prepaid"}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span
                                      className={`inline-block px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs ${badgeColor}`}
                                    >
                                      {ord.status}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 text-[11px] text-[#69615B]">
                                    {ord.tracking_number ? (
                                      <div>
                                        <div className="font-mono text-[#302B28]">{ord.tracking_number}</div>
                                        <div>{ord.tracking_courier || "Blue Dart"}</div>
                                      </div>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                  <td className="py-3.5 px-4 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedOrderForStatus(ord);
                                        setNewOrderStatus(ord.status);
                                        setNewTrackingNumber(ord.tracking_number || "");
                                        setNewTrackingCourier(ord.tracking_courier || "Blue Dart Express");
                                      }}
                                      className="px-3 py-1.5 bg-[#713A48] text-[#FFFDFA] text-[11px] font-medium uppercase tracking-wider hover:bg-[#582D38] transition-colors cursor-pointer"
                                    >
                                      Update
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  /* Returns Queue View */
                  <div className="bg-[#FFFDFA] border border-[#D8CFC6]">
                    <div className="p-4 border-b border-[#D8CFC6] bg-[#F8F5EF] flex items-center justify-between">
                      <h3 className="font-editorial text-[18px] text-[#302B28]">
                        Customer Return & Exchange Requests
                      </h3>
                      <span className="text-[12px] text-[#69615B]">
                        30-Day Atelier Complimentary Returns
                      </span>
                    </div>

                    {loadingReturns ? (
                      <div className="p-8 text-center text-[#69615B]">Loading return requests...</div>
                    ) : returns.length === 0 ? (
                      <div className="p-8 text-center text-[#69615B]">No active return requests.</div>
                    ) : (
                      <div className="divide-y divide-[#F0EAE1]">
                        {returns.map((ret) => (
                          <div key={ret.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono font-semibold text-[#713A48] text-[13px]">
                                  {ret.return_number}
                                </span>
                                <span className="text-[11px] text-[#69615B]">· Order {ret.order_number}</span>
                                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#FFF8E1] text-[#F57F17] rounded-xs">
                                  {ret.status}
                                </span>
                              </div>
                              <div className="font-medium text-[#302B28] text-[14px]">
                                {ret.product_name}
                              </div>
                              <div className="text-[12px] text-[#69615B] mt-1">
                                Reason: <span className="text-[#302B28]">{ret.reason}</span> · Resolution:{" "}
                                <strong className="text-[#713A48] uppercase">{ret.resolution}</strong>
                                {ret.requested_exchange_size && (
                                  <span> (Size: {ret.requested_exchange_size})</span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#69615B] mt-0.5">
                                Pickup Slot: {ret.pickup_slot} ({ret.courier})
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {ret.status !== "pickup_scheduled" && ret.status !== "delivered" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateReturnStatus(ret.return_number, "pickup_scheduled")}
                                  className="px-3 py-1.5 bg-[#FFFDFA] border border-[#713A48] text-[#713A48] text-[11px] font-medium tracking-wide hover:bg-[#713A48] hover:text-[#FFFDFA] transition-colors cursor-pointer"
                                >
                                  Schedule Pickup
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleUpdateReturnStatus(ret.return_number, "completed")}
                                className="px-3 py-1.5 bg-[#3E6545] text-[#FFFDFA] text-[11px] font-medium tracking-wide hover:bg-[#2C4A32] transition-colors cursor-pointer"
                              >
                                Mark Completed
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Status Update Modal */}
                {selectedOrderForStatus && (
                  <div className="fixed inset-0 z-50 bg-[#302B28]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#FFFDFA] border border-[#D8CFC6] max-w-[500px] w-full p-6 shadow-xl relative">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForStatus(null)}
                        className="absolute right-4 top-4 text-[#69615B] hover:text-[#302B28] cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#713A48] block mb-1">
                        Fulfillment Update
                      </span>
                      <h3 className="font-editorial text-[22px] text-[#302B28] mb-1">
                        Order #{selectedOrderForStatus.order_number}
                      </h3>
                      <p className="text-[12px] text-[#69615B] mb-5">
                        Customer: {selectedOrderForStatus.first_name} {selectedOrderForStatus.last_name} ({selectedOrderForStatus.email})
                      </p>

                      {statusFeedbackMsg && (
                        <div className="p-3 mb-4 text-[12px] bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                          {statusFeedbackMsg}
                        </div>
                      )}

                      <form onSubmit={handleUpdateOrderStatus} className="flex flex-col gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-semibold">
                            Order Status
                          </label>
                          <select
                            value={newOrderStatus}
                            onChange={(e) => setNewOrderStatus(e.target.value)}
                            className="w-full px-3 py-2 text-[13px] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing / Tailoring</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {newOrderStatus === "shipped" && (
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-semibold">
                                Courier Partner
                              </label>
                              <input
                                type="text"
                                value={newTrackingCourier}
                                onChange={(e) => setNewTrackingCourier(e.target.value)}
                                className="w-full px-3 py-2 text-[13px] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-semibold">
                                Tracking Number
                              </label>
                              <input
                                type="text"
                                value={newTrackingNumber}
                                onChange={(e) => setNewTrackingNumber(e.target.value)}
                                placeholder="e.g. BD-84920198"
                                className="w-full px-3 py-2 text-[13px] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none font-mono"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForStatus(null)}
                            className="px-4 py-2 border border-[#D8CFC6] text-[12px] text-[#69615B] hover:text-[#302B28] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={statusUpdateSubmitting}
                            className="px-5 py-2 bg-[#713A48] text-[#FFFDFA] text-[12px] font-medium tracking-wide hover:bg-[#582D38] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {statusUpdateSubmitting ? "Saving..." : "Save Status"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CUSTOMER CONCIERGE & INQUIRIES                        */}
        {/* ============================================================ */}
        {activeTab === "inquiries" && (
          <div>
            {!canManageInquiries ? (
              <div className="p-8 bg-[#FFFDFA] border border-[#D8CFC6] text-center">
                <Lock className="w-8 h-8 text-[#963D37] mx-auto mb-3" />
                <h3 className="font-editorial text-[22px] text-[#302B28] mb-2">
                  Concierge Access Restricted
                </h3>
                <p className="text-[14px] text-[#69615B] max-w-[500px] mx-auto">
                  Your staff profile is assigned to <strong>{departmentName}</strong> and does not have the <code>can_manage_inquiries</code> privilege. The Atelier Administrator can toggle customer concierge access in the backend admin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inquiries List Column */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-[#FFFDFA] p-3 border border-[#D8CFC6]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInquiryFilter("all")}
                        className={`px-3 py-1 text-[11px] uppercase tracking-wider font-semibold cursor-pointer ${
                          inquiryFilter === "all" ? "bg-[#713A48] text-[#FFFDFA]" : "text-[#69615B]"
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setInquiryFilter("open")}
                        className={`px-3 py-1 text-[11px] uppercase tracking-wider font-semibold cursor-pointer ${
                          inquiryFilter === "open" ? "bg-[#713A48] text-[#FFFDFA]" : "text-[#69615B]"
                        }`}
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => setInquiryFilter("replied")}
                        className={`px-3 py-1 text-[11px] uppercase tracking-wider font-semibold cursor-pointer ${
                          inquiryFilter === "replied" ? "bg-[#713A48] text-[#FFFDFA]" : "text-[#69615B]"
                        }`}
                      >
                        Responded
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => fetchInquiries()}
                      className="p-1 text-[#69615B] hover:text-[#302B28] cursor-pointer"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {loadingInquiries ? (
                    <div className="p-8 text-center bg-[#FFFDFA] border border-[#D8CFC6] text-[#69615B]">
                      Loading concierge inquiries...
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="p-8 text-center bg-[#FFFDFA] border border-[#D8CFC6] text-[#69615B]">
                      No inquiries in this queue.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setReplySuccessMsg(null);
                          }}
                          className={`p-4 bg-[#FFFDFA] border transition-all cursor-pointer ${
                            selectedInquiry?.id === inq.id
                              ? "border-[#713A48] ring-1 ring-[#713A48] shadow-xs"
                              : "border-[#D8CFC6] hover:border-[#713A48]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-[#302B28] text-[13px]">
                              {inq.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-xs ${
                                inq.is_replied
                                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                                  : "bg-[#FFEBEE] text-[#C62828]"
                              }`}
                            >
                              {inq.is_replied ? "Responded" : "Open"}
                            </span>
                          </div>
                          <div className="text-[12px] font-medium text-[#713A48] mb-1 truncate">
                            {inq.subject || "Customer Inquiry"}
                          </div>
                          <p className="text-[12px] text-[#69615B] line-clamp-2">
                            {inq.message}
                          </p>
                          <div className="text-[10px] text-[#A0988E] mt-2">
                            {new Date(inq.submitted_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inquiry Detail & Reply Composer Column */}
                <div className="lg:col-span-7">
                  {selectedInquiry ? (
                    <div className="bg-[#FFFDFA] border border-[#D8CFC6] p-6 shadow-xs flex flex-col gap-5">
                      <div className="border-b border-[#F0EAE1] pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#713A48]">
                            Inquiry #{selectedInquiry.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-xs ${
                              selectedInquiry.is_replied
                                ? "bg-[#E8F5E9] text-[#2E7D32]"
                                : "bg-[#FFEBEE] text-[#C62828]"
                            }`}
                          >
                            {selectedInquiry.is_replied ? "Replied via Email" : "Awaiting Staff Reply"}
                          </span>
                        </div>
                        <h2 className="font-editorial text-[24px] text-[#302B28]">
                          {selectedInquiry.subject || "Inquiry from Patron"}
                        </h2>
                        <div className="text-[13px] text-[#69615B] mt-1">
                          From: <strong className="text-[#302B28]">{selectedInquiry.name}</strong> ·{" "}
                          <a
                            href={`mailto:${selectedInquiry.email}`}
                            className="text-[#713A48] underline"
                          >
                            {selectedInquiry.email}
                          </a>
                          {selectedInquiry.phone && <span> · {selectedInquiry.phone}</span>}
                        </div>
                      </div>

                      {/* Patron Message */}
                      <div className="p-4 bg-[#FAF8F5] border border-[#F0EAE1]">
                        <span className="text-[11px] font-semibold text-[#69615B] uppercase tracking-wider block mb-1">
                          Patron&apos;s Message:
                        </span>
                        <p className="text-[14px] text-[#302B28] leading-relaxed whitespace-pre-wrap">
                          {selectedInquiry.message}
                        </p>
                      </div>

                      {/* Previous Replies if any */}
                      {selectedInquiry.reply_notes && (
                        <div className="p-4 bg-[#E8F5E9]/50 border border-[#C8E6C9]">
                          <span className="text-[11px] font-semibold text-[#2E7D32] uppercase tracking-wider block mb-1">
                            Dispatched Reply ({selectedInquiry.replied_at ? new Date(selectedInquiry.replied_at).toLocaleDateString() : "Sent"}):
                          </span>
                          <p className="text-[13px] text-[#302B28] whitespace-pre-wrap">
                            {selectedInquiry.reply_notes}
                          </p>
                        </div>
                      )}

                      {/* Reply Form */}
                      <form onSubmit={handleSendInquiryReply} className="flex flex-col gap-3 pt-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#69615B] flex items-center justify-between">
                          <span>Compose Concierge Email Response (Sent via SMTP)</span>
                          <span className="text-[10px] text-[#713A48] lowercase font-normal">
                            smtp.gmail.com:587
                          </span>
                        </label>

                        {replySuccessMsg && (
                          <div className="p-3 text-[12px] bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>{replySuccessMsg}</span>
                          </div>
                        )}

                        <textarea
                          rows={4}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Dear Patron, thank you for reaching out to Ryna's Wardrobe atelier. Regarding your query..."
                          className="w-full p-3.5 text-[13px] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none resize-none leading-relaxed"
                          required
                        />

                        {/* Quick Reply Snippets */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-[#69615B]">Quick templates:</span>
                          <button
                            type="button"
                            onClick={() =>
                              setReplyText(
                                `Dear ${selectedInquiry.name},\n\nThank you for reaching out. Your parcel is in priority packing at our boutique atelier and is scheduled for dispatch via Blue Dart Express. You will receive an SMS and live tracking code shortly.\n\nWarm regards,\nRyna's Wardrobe Concierge`
                              )
                            }
                            className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D8CFC6] text-[#713A48] hover:bg-[#F0EAE1] cursor-pointer"
                          >
                            + Delivery Update
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setReplyText(
                                `Dear ${selectedInquiry.name},\n\nWe would be delighted to arrange a private styling session or size exchange for you. Our Mumbai atelier team is at your complete disposal.\n\nWarm regards,\nRyna's Wardrobe Concierge`
                              )
                            }
                            className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D8CFC6] text-[#713A48] hover:bg-[#F0EAE1] cursor-pointer"
                          >
                            + Styling Advice
                          </button>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={sendingReply}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#713A48] text-[#FFFDFA] text-[12px] font-medium tracking-wide hover:bg-[#582D38] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{sendingReply ? "Dispatching via SMTP..." : "Send Response to Customer"}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-[#FFFDFA] border border-[#D8CFC6] text-[#69615B]">
                      <Mail className="w-8 h-8 mx-auto mb-2 text-[#D8CFC6]" />
                      <p className="text-[14px]">Select an inquiry from the queue to review and dispatch a response.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: INVENTORY & STOCK                                     */}
        {/* ============================================================ */}
        {activeTab === "catalog" && (
          <div>
            {!canManageCatalog ? (
              <div className="p-8 bg-[#FFFDFA] border border-[#D8CFC6] text-center">
                <Lock className="w-8 h-8 text-[#963D37] mx-auto mb-3" />
                <h3 className="font-editorial text-[22px] text-[#302B28] mb-2">
                  Catalog Access Restricted
                </h3>
                <p className="text-[14px] text-[#69615B] max-w-[500px] mx-auto">
                  Your staff profile is assigned to <strong>{departmentName}</strong> and does not have the <code>can_manage_catalog</code> privilege. Toggle stock in the Django Admin or request permission.
                </p>
              </div>
            ) : (
              <div className="bg-[#FFFDFA] border border-[#D8CFC6] shadow-xs">
                <div className="p-4 border-b border-[#D8CFC6] bg-[#F8F5EF] flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-[20px] text-[#302B28]">
                      Storefront Product Inventory & Availability
                    </h3>
                    <p className="text-[12px] text-[#69615B]">
                      Instantly toggle in-stock availability across storefront product cards and PDPs.
                    </p>
                  </div>
                  <span className="text-[12px] font-medium text-[#713A48]">
                    {catalog.length} Products Synchronized
                  </span>
                </div>

                {loadingCatalog ? (
                  <div className="p-8 text-center text-[#69615B]">Loading inventory catalog...</div>
                ) : (
                  <div className="divide-y divide-[#F0EAE1]">
                    {catalog.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#F8F5EF] border border-[#D8CFC6] overflow-hidden flex items-center justify-center flex-shrink-0">
                            {prod.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Layers className="w-5 h-5 text-[#A0988E]" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[#302B28] text-[14px]">
                              {prod.name}
                            </div>
                            <div className="text-[12px] text-[#69615B]">
                              Category: <span className="capitalize">{prod.category}</span> · {formatPrice(prod.price)} {CURRENCY.code}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs ${
                              prod.in_stock
                                ? "bg-[#E8F5E9] text-[#2E7D32]"
                                : "bg-[#FFEBEE] text-[#C62828]"
                            }`}
                          >
                            {prod.in_stock ? "In Stock" : "Sold Out"}
                          </span>

                          <button
                            type="button"
                            disabled={togglingProductId === prod.id}
                            onClick={() => handleToggleProductStock(prod.id)}
                            className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider border transition-colors cursor-pointer disabled:opacity-50 ${
                              prod.in_stock
                                ? "border-[#963D37] text-[#963D37] hover:bg-[#963D37] hover:text-[#FFFDFA]"
                                : "border-[#3E6545] text-[#3E6545] hover:bg-[#3E6545] hover:text-[#FFFDFA]"
                            }`}
                          >
                            {togglingProductId === prod.id
                              ? "Updating..."
                              : prod.in_stock
                              ? "Mark Out of Stock"
                              : "Mark In Stock"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

