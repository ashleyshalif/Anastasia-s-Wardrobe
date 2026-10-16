import { apiClient } from "./client";
import { OrderHistoryItem, ReturnRequest } from "@/types/account";
import { CreateOrderPayload, ShipmentTrackingResponse } from "./types";

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
   * Fetch all orders for current user
   */
  public async getOrders(
    mockFallback?: () => OrderHistoryItem[]
  ): Promise<OrderHistoryItem[]> {
    return apiClient.withMockFallback(
      async () => {
        return await apiClient.get<OrderHistoryItem[]>("/orders/");
      },
      () => {
        if (mockFallback) return mockFallback();
        return [];
      },
      "orders.getOrders"
    );
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
