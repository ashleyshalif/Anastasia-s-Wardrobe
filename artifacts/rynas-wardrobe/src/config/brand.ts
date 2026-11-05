/**
 * src/config/brand.ts
 * =========================================================================
 * Central Brand Configuration — Single Source of Truth for Rebranding
 * Edit this single file to rename, rebrand, re-theme, or re-localize the
 * entire boutique storefront.
 * =========================================================================
 */

export const brandConfig = {
  name: "Ryna's Wardrobe",
  shortName: "Ryna's",
  legalName: "Ryna's Wardrobe Pvt. Ltd.",
  domain: "rynaswardrobe.com",
  year: 2026,

  tagline: "Thoughtfully chosen styles for every age, every day and every occasion.",
  subTagline: "A little everyday. A little extraordinary.",
  announcement: "A little something lovely. Complimentary shipping on orders over ₹2,999.",
  founderNote:
    "We think a wardrobe can be small and full of possibility. Our edit brings together wearable shapes, tactile fabrics and those unexpected little finds that feel like you.",

  contact: {
    email: "hello@rynaswardrobe.com",
    conciergePhone: "+91 (0) 22 6900 4200",
    whatsappNumber: "919999999999",
    whatsappLink:
      "https://wa.me/919999999999?text=Hi%20Ryna%27s%20Wardrobe%2C%20I%20have%20a%20question%20about%20your%20collection",
    hours: "Monday–Saturday · 10 am–6 pm IST",
    atelierAddress: "18 Altamount Road, Cumballa Hill, Mumbai 400026, India",
  },

  social: {
    instagram: "https://www.instagram.com/rynas.wardrobe.official/?hl=en",
    pinterest: "https://pinterest.com",
    facebook: "https://facebook.com",
  },

  commerce: {
    currencyCode: "INR",
    currencySymbol: "₹",
    freeShippingThreshold: 2999,
    expressShippingRate: 450,
    codAvailable: true,
    returnWindowDays: 30,
  },

  theme: {
    primaryBurgundy: "#713A48",
    darkWine: "#582B37",
    lightBurgundy: "#8E4C5D",
    canvasPaper: "#F8F5EF",
    cardPorcelain: "#FFFDFA",
    borderLinen: "#D8CFC6",
    charcoalInk: "#302B28",
    mutedTaupe: "#69615B",
    goldVermeil: "#C9A765",
  },

  assets: {
    logo: "/images/logo.png",
    logoAlt: "Ryna's Wardrobe Atelier Logo",
    favicon: "/favicon.png",
    ogImage: "/og-image.png",
  },
} as const;

export type BrandConfig = typeof brandConfig;
