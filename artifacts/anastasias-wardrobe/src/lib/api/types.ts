import { Product, CartItem, DeliveryAddress, OrderDetails } from "@/types/product";
import { UserProfile, SavedAddress, OrderHistoryItem, ReturnRequest } from "@/types/account";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductFilterParams {
  category?: string;
  department?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "featured";
  page?: number;
  pageSize?: number;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  newsletterConsent?: boolean;
}

export interface AuthTokenResponse {
  token: string;
  refreshToken?: string;
  user: UserProfile;
}

export interface CreateOrderPayload {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryMethod: string;
  total: number;
  currency: string;
  address: DeliveryAddress;
  giftNote?: string;
  paymentMethod: string;
  paymentId?: string;
}

export interface PaymentSessionPayload {
  orderId: string;
  amount: number;
  currency: string;
  provider: "razorpay" | "stripe" | "upi" | "cod";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentSessionResponse {
  sessionId: string;
  orderId: string;
  provider: string;
  amount: number;
  currency: string;
  keyId?: string; // e.g. Razorpay key id
  clientSecret?: string; // e.g. Stripe client secret
}

export interface PaymentVerificationPayload {
  orderId: string;
  paymentId: string;
  signature?: string;
  provider: string;
}

export interface ShipmentMilestone {
  stage: string;
  label: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

export interface ShipmentTrackingResponse {
  awb: string;
  orderNumber: string;
  carrier: string;
  status: "Order Confirmed" | "Atelier Packing" | "Blue Dart Transit" | "Out for Delivery" | "Delivered";
  estimatedDelivery: string;
  milestones: ShipmentMilestone[];
}
