export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  hasMegaMenu?: boolean;
  tagline?: string;
  subcategories?: SubCategory[];
}

export const CATALOG_CATEGORIES: CategoryConfig[] = [
  {
    id: "new-in",
    name: "New in",
    slug: "new-in",
    enabled: true,
  },
  {
    id: "girls",
    name: "Girls 2–12",
    slug: "girls-2-12",
    enabled: true,
    tagline: "Soft cottons, smocked yokes and room to grow.",
  },
  {
    id: "teens",
    name: "Teens 13–17",
    slug: "teens-13-17",
    enabled: true,
    tagline: "Easy shapes, brushed textures and everyday ease.",
  },
  {
    id: "women",
    name: "Women",
    slug: "women",
    enabled: true,
    hasMegaMenu: true,
    tagline: "Thoughtfully cut silhouettes for work, home and celebration.",
    subcategories: [
      { id: "knitwear", name: "Knitwear & cardigans", slug: "knitwear" },
      { id: "dresses", name: "Dresses & midi silhouettes", slug: "dresses" },
      { id: "tops", name: "Tops & linen shirts", slug: "tops" },
      { id: "bottoms", name: "Trousers & relaxed skirts", slug: "trousers-and-skirts" },
      { id: "outerwear", name: "Coats & wool outerwear", slug: "outerwear" },
      { id: "loungewear", name: "Loungewear & soft sets", slug: "loungewear" },
      { id: "nightwear", name: "Nightwear & slips", slug: "nightwear" },
      { id: "occasionwear", name: "Occasionwear", slug: "occasionwear" },
      { id: "all", name: "View all women’s", slug: "all" },
    ],
  },
  {
    id: "jewellery",
    name: "Jewellery",
    slug: "jewellery",
    enabled: false, // NOT launching yet - toggle to true when ready to launch
    subcategories: [
      { id: "earrings", name: "Drop & stud earrings", slug: "earrings" },
      { id: "necklaces", name: "Fine chains & pendants", slug: "necklaces" },
      { id: "rings", name: "Brushed gold rings", slug: "rings" },
    ],
  },
  {
    id: "accessories-bags",
    name: "Accessories & bags",
    slug: "accessories-and-bags",
    enabled: false, // NOT launching yet - toggle to true when ready to launch
    subcategories: [
      { id: "bags", name: "Leather & woven bags", slug: "bags" },
      { id: "scarves", name: "Wool & silk scarves", slug: "scarves" },
      { id: "belts", name: "Leather belts", slug: "belts" },
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    slug: "footwear",
    enabled: true,
  },
  {
    id: "gifts",
    name: "Gifts",
    slug: "gifts",
    enabled: true,
  },
  {
    id: "the-edits",
    name: "The edits",
    slug: "the-edits",
    enabled: true,
  },
];

/**
 * Returns all active categories launching right now.
 * Jewellery and Accessories & bags will automatically be excluded until enabled is set to true.
 */
export function getEnabledCategories(): CategoryConfig[] {
  return CATALOG_CATEGORIES.filter((category) => category.enabled);
}

/**
 * Check whether a category ID or slug is currently enabled for shopping.
 */
export function isCategoryEnabled(idOrSlug: string): boolean {
  const cat = CATALOG_CATEGORIES.find(
    (c) => c.id === idOrSlug || c.slug === idOrSlug
  );
  return cat ? cat.enabled : false;
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATALOG_CATEGORIES.find((c) => c.slug === slug);
}
