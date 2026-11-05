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
  pickupSlot: string;
  courier: string;
  status: "Pickup Scheduled" | "In Transit to Atelier" | "Inspected" | "Refund Completed";
  notes?: string;
}

export interface StaffPermissions {
  isStaff?: boolean;
  isSuperuser?: boolean;
  canManageOrders: boolean;
  canManageInquiries: boolean;
  canManageCatalog: boolean;
  department?: string | null;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  phone?: string;
  memberSince?: string;
  newsletterConsent?: boolean;
  tier?: "Atelier Patron" | "Privilege Member" | "Collector" | "Atelier Staff Member" | "Administrator" | string;
  preferredCurrency?: "INR";
  isStaff?: boolean;
  isSuperuser?: boolean;
  permissions?: StaffPermissions;
  staffPermissions?: StaffPermissions;
}

export interface OrderHistoryItem extends OrderDetails {
  status: "Preparing" | "Dispatched" | "In Transit" | "Delivered" | "Confirmed" | "Processing" | "Cancelled";
  trackingNumber: string;
  trackingCourier: string;
  returnEligibleUntil: string;
  returns?: ReturnRequest[];
}
