export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // e.g., 'women', 'girls', 'teens', 'jewellery', 'footwear'
  department: string; // Display department label, e.g. 'Women', 'Girls · 2–12'
  price: number; // in INR
  originalPrice?: number;
  saleNote?: string;
  currency: string; // 'INR'
  color: string;
  colorHex?: string;
  availableColors?: { name: string; hex: string }[];
  sizes: string[];
  image: string;
  galleryImages?: string[];
  description: string;
  details?: string[];
  fabric?: string;
  care?: string;
  badge?: string; // 'BESTSELLER', 'JUST IN', 'SOFT COTTON', 'NEW COLOUR'
  inStock: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface OrderDetails {
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryMethod: string;
  estimatedDelivery: string;
  total: number;
  currency: string;
  address: DeliveryAddress;
  giftNote?: string;
  paymentMethod: string;
  cardLast4?: string;
}
