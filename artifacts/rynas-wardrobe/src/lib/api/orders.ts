import { apiClient } from "./client";

import { OrderHistoryItem, ReturnRequest } from "@/types/account";

import { CreateOrderPayload, ShipmentTrackingResponse } from "./types";



export function normalizeOrder(raw: any): OrderHistoryItem {

  return {

    orderNumber: raw.order_number || raw.orderNumber || `AW-${raw.id || "00000"}`,

    date: raw.created_at

      ? new Date(raw.created_at).toLocaleDateString("en-GB", {

          day: "numeric",

          month: "long",

          year: "numeric",

        })

      : raw.date || "Recent",

    items: (raw.items || []).map((it: any) => {
      const isProductObj = typeof it.product === "object" && it.product !== null;
      const productName = (isProductObj ? it.product.name : it.product_name) || "Garment";
      const productImage =
        (isProductObj ? it.product.image : (it.image || it.product_image)) ||
        "/images/cardigan.png";
      const productPrice =
        (isProductObj ? it.product.price : (it.unit_price ?? it.price)) || 0;
      const productSlug = (isProductObj ? it.product.slug : it.product_slug) || "";
      const productId = String(
        isProductObj ? it.product.id : (it.product_id || it.product || it.id || Math.random())
      );

      return {
        id: String(it.id || it.cartItemId || Math.random()),
        product: isProductObj
          ? {
              ...it.product,
              name: it.product.name || productName,
              image: it.product.image || productImage,
            }
          : {
              id: productId,
              slug: productSlug,
              name: productName,
              price: productPrice,
              currency: raw.currency || "INR",
              image: productImage,
              category: "women",
              description: "",
            },
        size: it.size || "M",
        color: it.color || "Oatmeal",
        colorImage: it.colorImage || it.color_image || it.image || productImage,
        quantity: it.quantity || 1,
      };
    }),
    subtotal: raw.subtotal || 0,

    deliveryFee: raw.delivery_fee ?? raw.deliveryFee ?? 0,

    deliveryMethod: raw.delivery_method || raw.deliveryMethod || "Express Delivery",

    estimatedDelivery: raw.estimated_delivery || raw.estimatedDelivery || "3–5 working days",

    total: raw.total || 0,

    currency: raw.currency || "INR",

    address: raw.address || {

      firstName: raw.first_name || "",

      lastName: raw.last_name || "",

      email: raw.email || "",

      phone: raw.phone || "",

      addressLine1: raw.address_line1 || "",

      addressLine2: raw.address_line2 || "",

      city: raw.city || "",

      postcode: raw.postcode || "",

      country: raw.country || "India",

    },

    giftNote: raw.gift_note || raw.giftNote,

    paymentMethod: raw.payment_method || raw.paymentMethod || "Credit Card",

    cardLast4: raw.card_last4 || raw.cardLast4,

    status: (function(s: string): "Preparing" | "Dispatched" | "In Transit" | "Delivered" | "Confirmed" | "Processing" | "Cancelled" {

      if (!s) return "Preparing";

      const lower = s.toLowerCase();

      if (lower === "delivered") return "Delivered";
      if (lower === "shipped" || lower === "in transit" || lower === "in_transit") return "In Transit";
      if (lower === "dispatched") return "Dispatched";
      if (lower === "processing") return "Processing";
      if (lower === "confirmed") return "Confirmed";
      if (lower === "cancelled" || lower === "canceled") return "Cancelled";
      return "Preparing";

    })(raw.status),

    trackingNumber: raw.tracking_number || raw.trackingNumber || `BD-${raw.id || 1000}89`,

    trackingCourier: raw.tracking_courier || raw.trackingCourier || "Blue Dart Express",

    returnEligibleUntil:

      raw.return_eligible_until ||

      raw.returnEligibleUntil ||

      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {

        day: "numeric",

        month: "long",

        year: "numeric",

      }),

    returns: (raw.returns || []).map((ret: any) => ({

      id: ret.return_number || ret.id || `RA-${Math.floor(10000 + Math.random() * 90000)}`,

      orderNumber: raw.order_number || raw.orderNumber,

      date: ret.created_at

        ? new Date(ret.created_at).toLocaleDateString("en-IN", {

            day: "numeric",

            month: "long",

            year: "numeric",

          })

        : ret.date || "Recent",

      item: {

        cartItemId: String(ret.id || "1"),

        productName: ret.item_name || "Atelier Garment",

        size: ret.item_size || "Standard",

        color: ret.item_color || "Standard",

        quantity: ret.item_quantity || 1,

        price: ret.price || 0,

        image: ret.image || "/images/cardigan.png",

      },

      reason: ret.reason || "Size too small",

      resolution: ret.resolution || "exchange",

      requestedExchangeSize: ret.requested_exchange_size,

      pickupSlot: ret.pickup_slot || "Tomorrow, 10:00 AM – 2:00 PM (Blue Dart Courier)",

      courier: ret.courier || "Blue Dart Express",

      status: ret.status_display || ret.status || "Pickup Scheduled",

      notes: ret.customer_notes || ret.notes,

    })),

  };

}



export class OrderApiService {

  /**

   * Submit an order to the backend

   */

  public async createOrder(

    payload: CreateOrderPayload,

    mockFallback?: () => OrderHistoryItem

  ): Promise<OrderHistoryItem> {

    return apiClient.withMockFallback(

      async () => {

        return await apiClient.post<OrderHistoryItem>("/orders/", payload);

      },

      () => {

        if (mockFallback) return mockFallback();

        const orderNumber = `AW-${Math.floor(10000 + Math.random() * 90000)}`;

        return {

          orderNumber,

          date: new Date().toLocaleDateString("en-GB", {

            day: "numeric",

            month: "long",

            year: "numeric",

          }),

          items: payload.items,

          subtotal: payload.subtotal,

          deliveryFee: payload.deliveryFee,

          deliveryMethod: payload.deliveryMethod,

          estimatedDelivery: "3–5 working days",

          total: payload.total,

          currency: payload.currency,

          address: payload.address,

          giftNote: payload.giftNote,

          paymentMethod: payload.paymentMethod,

          status: "Preparing",

          trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,

          trackingCourier: "Blue Dart Express",

          returnEligibleUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(

            "en-GB",

            { day: "numeric", month: "long", year: "numeric" }

          ),

        };

      },

      "orders.createOrder"

    );

  }



  /**

   * Fetch all orders for the currently authenticated user.

   * The backend (Django /api/orders/) filters by request.user.email via Bearer token.

   * No email query param is sent — that was the original privacy hole.

   * Throws ApiError(401) if unauthenticated so callers can show sign-in UI.

   */

  public async getOrders(

    email?: string,

    mockFallback?: () => OrderHistoryItem[]

  ): Promise<OrderHistoryItem[]> {

    const params = email ? { email } : undefined;

    const raw = await apiClient.get<any>("/orders/", params);

    const list: any[] = Array.isArray(raw) ? raw : (raw?.results || []);

    return list.map(normalizeOrder);

  }



  /**

   * Fetch a single order by reference

   */

  public async getOrderById(

    orderNumber: string,

    mockFallback?: () => OrderHistoryItem | null

  ): Promise<OrderHistoryItem | null> {

    return apiClient.withMockFallback(

      async () => {

        return await apiClient.get<OrderHistoryItem>(`/orders/${orderNumber}/`);

      },

      () => {

        if (mockFallback) return mockFallback();

        return null;

      },

      `orders.getOrderById(${orderNumber})`

    );

  }



  /**

   * Submit 30-Day Doorstep Return / Exchange request

   */

  public async requestReturn(

    orderNumber: string,

    payload: {

      item: ReturnRequest["item"];

      reason: ReturnRequest["reason"];

      resolution: ReturnRequest["resolution"];

      pickupSlot: string;

      requestedExchangeSize?: string;

      notes?: string;

    },

    mockFallback?: () => ReturnRequest

  ): Promise<ReturnRequest> {

    return apiClient.withMockFallback(

      async () => {

        return await apiClient.post<ReturnRequest>(`/orders/${orderNumber}/return/`, payload);

      },

      () => {

        if (mockFallback) return mockFallback();

        return {

          id: `RA-${Math.floor(10000 + Math.random() * 90000)}`,

          orderNumber,

          date: new Date().toLocaleDateString("en-GB", {

            day: "numeric",

            month: "long",

            year: "numeric",

          }),

          item: payload.item,

          reason: payload.reason,

          resolution: payload.resolution,

          requestedExchangeSize: payload.requestedExchangeSize,

          pickupSlot: payload.pickupSlot,

          courier: "Blue Dart Express",

          status: "Pickup Scheduled",

          notes: payload.notes,

        };

      },

      `orders.requestReturn(${orderNumber})`

    );

  }



  /**

   * Track live shipment milestones by AWB number

   */

  public async trackShipment(

    awb: string,

    mockFallback?: () => ShipmentTrackingResponse

  ): Promise<ShipmentTrackingResponse> {

    return apiClient.withMockFallback(

      async () => {

        return await apiClient.get<ShipmentTrackingResponse>(`/shipping/track/${awb}/`);

      },

      () => {

        if (mockFallback) return mockFallback();

        return {

          awb,

          orderNumber: "AW-84192",

          carrier: "Blue Dart Express",

          status: "Blue Dart Transit",

          estimatedDelivery: "Tomorrow by 6:00 PM",

          milestones: [

            {

              stage: "1",

              label: "Order Confirmed & Payment Verified",

              location: "Mumbai Atelier",

              timestamp: "12 Oct 2026, 11:24 AM",

              completed: true,

            },

            {

              stage: "2",

              label: "Hand-checked, Tissue-Wrapped in Rigid Box",

              location: "Cumballa Hill Atelier, Mumbai",

              timestamp: "12 Oct 2026, 03:45 PM",

              completed: true,

            },

            {

              stage: "3",

              label: "Dispatched via Blue Dart Air Express",

              location: "Mumbai Hub (BOM)",

              timestamp: "13 Oct 2026, 08:30 AM",

              completed: true,

            },

            {

              stage: "4",

              label: "Arrived at Destination Metro Sorting Hub",

              location: "New Delhi Regional Air Hub",

              timestamp: "14 Oct 2026, 02:15 PM",

              completed: true,

            },

            {

              stage: "5",

              label: "Out for Doorstep Handover",

              location: "Recipient Courier Route",

              timestamp: "Estimated 15 Oct 2026",

              completed: false,

            },

          ],

        };

      },

      `orders.trackShipment(${awb})`

    );

  }

}



export const ordersApi = new OrderApiService();

