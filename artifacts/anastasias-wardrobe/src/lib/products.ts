import { Product } from "@/types/product";
import { isCategoryEnabled } from "@/config/catalog";

// TODO: replace with API / database fetch
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-sunday-cardigan",
    slug: "sunday-wool-cardigan",
    name: "Sunday wool cardigan",
    category: "women",
    department: "Women",
    price: 6490,
    currency: "INR",
    color: "Oat",
    colorHex: "#D9CDB8",
    availableColors: [
      { name: "Oat", hex: "#D9CDB8" },
      { name: "Rosewood", hex: "#713A48" },
      { name: "Sage", hex: "#5C6A53" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/cardigan.png",
    description: "Spun from heavyweight merino wool with horn buttons and a relaxed, drop-shoulder silhouette.",
    details: [
      "100% extra-fine merino wool",
      "Natural horn button fastening",
      "Subtle ribbed cuffs and hem",
      "Designed for a relaxed fit; take your usual size",
    ],
    fabric: "100% Merino Wool",
    care: "Hand wash cold or dry clean gently.",
    badge: "SOFT COTTON",
    inStock: true,
  },
  {
    id: "prod-garden-dress",
    slug: "garden-cotton-dress",
    name: "Garden cotton dress",
    category: "girls",
    department: "Girls · 2–12",
    price: 5290,
    currency: "INR",
    color: "Rosewood",
    colorHex: "#713A48",
    availableColors: [
      { name: "Rosewood", hex: "#713A48" },
      { name: "Oat", hex: "#E8DFC5" },
    ],
    sizes: ["2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y", "10-12 Y"],
    image: "/images/dress.png",
    description: "Cut from airy washed poplin with delicate smocking, hand-stitched details and soft gathered sleeves.",
    details: [
      "100% organic cotton poplin",
      "Hand-finished smocking at bodice",
      "Concealed mother-of-pearl buttons at back",
    ],
    fabric: "100% Organic Cotton",
    care: "Machine wash delicate at 30°C.",
    badge: "BESTSELLER",
    inStock: true,
  },
  {
    id: "prod-amelie-wrap-dress",
    slug: "amelie-wrap-midi-dress",
    name: "Amelie wrap midi dress",
    category: "women",
    department: "Women",
    price: 7490,
    currency: "INR",
    color: "Burgundy",
    colorHex: "#5E2533",
    availableColors: [
      { name: "Burgundy", hex: "#5E2533" },
      { name: "Forest", hex: "#354637" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "/images/wrap-dress.png",
    description: "An elegant wrap dress cut in draped modal-linen with flutter sleeves and an adjustable waist sash.",
    details: [
      "70% Lenzing Modal, 30% Belgian Linen",
      "Graceful midi hemline",
      "Inner stay button for secure closure",
    ],
    fabric: "Modal Linen Blend",
    care: "Cool hand wash or gentle cycle.",
    badge: "NEW COLOUR",
    inStock: true,
  },
  {
    id: "prod-daisy-co-ord",
    slug: "daisy-cotton-co-ord",
    name: "Daisy cotton co-ord",
    category: "girls",
    department: "Girls · 2–6",
    price: 3990,
    currency: "INR",
    color: "Buttercream Floral",
    colorHex: "#F2E8D5",
    availableColors: [
      { name: "Buttercream Floral", hex: "#F2E8D5" },
      { name: "Sage Floral", hex: "#D8E0D2" },
    ],
    sizes: ["2-3 Y", "4-5 Y", "5-6 Y"],
    image: "/images/coord.png",
    description: "Lightweight summer two-piece with scalloped collar and elasticated bloomer shorts.",
    details: [
      "100% printed lawn cotton",
      "Scalloped Peter Pan collar",
      "Soft elastic waistband",
    ],
    fabric: "100% Lawn Cotton",
    care: "Machine wash at 30°C.",
    badge: "JUST IN",
    inStock: true,
  },
  {
    id: "prod-willow-coat",
    slug: "willow-wool-coat",
    name: "Willow wool coat",
    category: "teens",
    department: "Teens · 13–17",
    price: 10990,
    currency: "INR",
    color: "Chestnut",
    colorHex: "#8B4513",
    sizes: ["XS", "S", "M", "L"],
    image: "/images/boutique.png",
    description: "Tailored in boiled wool with a double-breasted closure and roomy welt pockets.",
    details: [
      "100% boiled wool",
      "Satin twill lining",
      "Horn buttons",
    ],
    fabric: "100% Boiled Wool",
    care: "Dry clean only.",
    badge: "WINTER EDIT",
    inStock: true,
  },
  {
    id: "prod-cloud-scarf",
    slug: "cloud-knit-scarf",
    name: "Cloud knit scarf",
    category: "gifts",
    department: "Gifts · Accessories",
    price: 2990,
    currency: "INR",
    color: "Mulberry",
    colorHex: "#5C2434",
    sizes: ["One Size"],
    image: "/images/cardigan.png",
    description: "Fluffy ribbed scarf in an alpaca-wool blend with fringed ends.",
    details: ["60% Alpaca, 40% Merino Wool", "Super-soft brushed finish"],
    fabric: "Alpaca Merino Blend",
    care: "Hand wash cold.",
    badge: "GIFT IDEA",
    inStock: true,
  },
  {
    id: "prod-velvet-pouch",
    slug: "keepsake-velvet-pouch",
    name: "Keepsake velvet pouch",
    category: "gifts",
    department: "Gifts · Wine",
    price: 1490,
    originalPrice: 1990,
    saleNote: "Sale · save ₹500",
    currency: "INR",
    color: "Wine",
    colorHex: "#713A48",
    sizes: ["One Size"],
    image: "/images/dress.png",
    description: "Quilted silk-velvet pouch with gold cord tassel drawstring, ideal for treasured small items.",
    details: ["Silk-rayon velvet", "Braided metallic cord drawstring", "Satin lined"],
    fabric: "Silk-Rayon Velvet",
    care: "Spot clean only.",
    badge: "SALE",
    inStock: true,
  },
  {
    id: "prod-petal-earrings",
    slug: "petal-drop-earrings",
    name: "Petal drop earrings",
    category: "jewellery", // Disabled category! Will automatically be hidden by catalog config
    department: "Jewellery · Brushed gold",
    price: 2490,
    currency: "INR",
    color: "Brushed gold",
    colorHex: "#C9A765",
    sizes: ["One Size"],
    image: "/images/boutique.png",
    description: "Cast in recycled brass with 18k brushed gold vermeil and freshwater pearl droplets.",
    details: [
      "18k gold vermeil over recycled brass",
      "Hypoallergenic sterling silver posts",
      "Natural baroque freshwater pearl",
    ],
    fabric: "18k Gold Vermeil",
    care: "Keep away from perfumes and water.",
    inStock: true,
  },
];

import { productsApi } from "./api/products";
import { ProductFilterParams } from "./api/types";

export { productsApi };

/**
 * Fetch products from the backend API with fallback to MOCK_PRODUCTS
 */
export async function getProducts(params?: ProductFilterParams): Promise<Product[]> {
  return productsApi.getProducts(params, () => {
    let list = MOCK_PRODUCTS.filter((product) => isCategoryEnabled(product.category));
    if (params?.category) {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= (params.minPrice ?? 0));
    }
    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= (params.maxPrice ?? Infinity));
    }
    if (params?.sortBy === "price_asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (params?.sortBy === "price_desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  });
}

/**
 * All catalog products including draft/disabled categories
 */
export async function getAllProductsIncludingDisabled(): Promise<Product[]> {
  return MOCK_PRODUCTS;
}

/**
 * Fetch a single product by slug via API or fallback
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return productsApi.getProductBySlug(slug, () => {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!product) return null;
    if (!isCategoryEnabled(product.category)) return null;
    return product;
  });
}

/**
 * Fetch products belonging to a specific category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!isCategoryEnabled(category)) return [];
  return productsApi.getProductsByCategory(category, () =>
    MOCK_PRODUCTS.filter((p) => p.category === category)
  );
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  return productsApi.searchProducts(query, () =>
    MOCK_PRODUCTS.filter((product) => {
      if (!isCategoryEnabled(product.category)) return false;
      return (
        product.name.toLowerCase().includes(clean) ||
        product.description.toLowerCase().includes(clean) ||
        product.department.toLowerCase().includes(clean) ||
        product.color.toLowerCase().includes(clean)
      );
    })
  );
}
