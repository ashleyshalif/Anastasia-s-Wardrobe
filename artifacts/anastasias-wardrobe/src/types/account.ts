import { CartItem, DeliveryAddress, OrderDetails } from "./product";

export interface SavedAddress extends DeliveryAddress {
  id: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  label: "Home" | "Work" | "Atelier" | "Other";
}

export interface ReturnRequest {
  id: string; // e.g. 'RA-61928'
  orderNumber: string;
  date: string;
  item: {
    cartItemId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  };
  reason:
    | "Size too small"
    | "Size too large"
    | "Fabric or colour differs from photo"
    | "Style did not suit"
    | "Quality / workmanship inquiry"
    | "Changed mind";
  resolution: "exchange" | "refund_original" | "store_credit";
  requestedExchangeSize?: string;
  pickupSlot: string; // e.g. "Tomorrow, 10:00 AM – 2:00 PM (Blue Dart Courier)"
  courier: string; // "Blue Dart Express"
  status: "Pickup Scheduled" | "In Transit to Atelier" | "Inspected" | "Refund Completed";
  notes?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: string;
  newsletterConsent: boolean;
  tier: "Atelier Patron" | "Privilege Member" | "Collector";
  preferredCurrency: "INR";
}

export interface OrderHistoryItem extends OrderDetails {
  status: "Preparing" | "Dispatched" | "In Transit" | "Delivered";
  trackingNumber: string;
  trackingCourier: string;
  returnEligibleUntil: string;
  returns?: ReturnRequest[];
}
