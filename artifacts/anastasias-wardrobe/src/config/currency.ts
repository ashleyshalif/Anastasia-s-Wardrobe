/**
 * Currency and regional market configuration for Anastasia's Wardrobe.
 * Localized for Indian market (INR ₹) with European luxury heritage.
 */

export const CURRENCY = {
  symbol: "₹",
  code: "INR",
  name: "Indian Rupee",
  regionLabel: "India · English · INR ₹",
  topNotice: "Thoughtfully chosen. Worn your way. · India / INR ₹",
  freeShippingThreshold: 4999, // Complimentary delivery on orders over ₹4,999
  standardShippingFee: 250,
  expressShippingFee: 500,
  gstRate: 0.12, // 12% GST included
};

/**
 * Format a numeric amount into Indian Rupee string (e.g. ₹6,490)
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
