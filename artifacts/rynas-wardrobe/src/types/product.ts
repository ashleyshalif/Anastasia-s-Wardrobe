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
  secondaryImage?: string; // Used for hover preview on product cards
  galleryImages?: string[];
  images?: ProductImage[]; // Multi-angle uploaded photos
  variants?: ProductVariant[]; // Photos grouped per color swatch
  description: string;
  details?: string[];
  fabric?: string;
  care?: string;
  fit?: string;
  materialComposition?: string;
  occasion?: string;
  badge?: string; // 'BESTSELLER', 'JUST IN', 'SOFT COTTON', 'NEW COLOUR'
  inStock: boolean;
}

/** A single photo angle from the ProductImage backend model */
export interface ProductImage {
  id: number | string;
  url: string;
  thumbnailUrl: string;
  color?: string;
  angle: 'front' | 'side' | 'back' | 'detail' | 'lifestyle' | string;
  alt: string;
  position: number;
  isPrimary?: boolean;
  is_primary?: boolean;
}

/** Photos grouped by color swatch – returned by /api/products/<slug>/ as variants[] */
export interface ProductVariant {
  color: string;
  hex: string;
  hasImages: boolean;
  images: ProductImage[];
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  /** Snapshot of the image URL at the time the item was added (for the selected color) */
  colorImage?: string;
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
