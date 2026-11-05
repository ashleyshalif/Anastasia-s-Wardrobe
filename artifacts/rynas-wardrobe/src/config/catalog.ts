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

/**
 * HARDCODED FALLBACK — used ONLY when Django API is unreachable.
 * The frontend tries the API first; if it fails these are shown.
 */
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
      { id: "all", name: "View all women's", slug: "all" },
    ],
  },
  {
    id: "jewellery",
    name: "Jewellery",
    slug: "jewellery",
    enabled: true,
    subcategories: [
      { id: "bangles", name: "Cuffs & Sculptural Bangles", slug: "bangles" },
      { id: "necklaces", name: "Freshwater Pearls & Chokers", slug: "necklaces" },
      { id: "rings", name: "Sculptural Rings", slug: "rings" },
    ],
  },
  {
    id: "accessories-bags",
    name: "Accessories & bags",
    slug: "accessories-and-bags",
    enabled: true,
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
    tagline: "Curated capsules for evening, weekend and celebration.",
    subcategories: [
      { id: "the-night-market", name: "The Night Market", slug: "the-night-market" },
      { id: "evening-wear", name: "Evening Tailoring & Silk", slug: "evening-wear" },
      { id: "capsule-all", name: "All Edits", slug: "all" },
    ],
  },
];

// In-memory cache for API-fetched categories (0ms in dev for instant admin sync)
let _cachedApiCategories: CategoryConfig[] | null = null;
let _cacheTimestamp = 0;
const CACHE_TTL_MS = 0;

/**
 * Fetch categories from the Django API. Falls back to the hardcoded list above.
 */
export async function fetchCategoriesFromAPI(): Promise<CategoryConfig[]> {
  // Return cache if fresh
  if (_cachedApiCategories && CACHE_TTL_MS > 0 && Date.now() - _cacheTimestamp < CACHE_TTL_MS) {
    return _cachedApiCategories;
  }

  const apiUrl =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")) ||
    "http://localhost:8000/api";

  try {
    const res = await fetch(`${apiUrl}/categories/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = await res.json();
    const data: Array<{ id: string; name: string; slug: string; enabled: boolean; tagline?: string }> =
      Array.isArray(raw) ? raw : raw?.results || [];

    // Merge API data with local subcategory / hasMegaMenu metadata
    const orderMap = new Map(CATALOG_CATEGORIES.map((c, i) => [c.slug, i]));
    const merged: CategoryConfig[] = data.map((apiCat) => {
      const local = CATALOG_CATEGORIES.find((c) => c.id === apiCat.id || c.slug === apiCat.slug);
      return {
        id: apiCat.id,
        name: apiCat.name,
        slug: apiCat.slug,
        enabled: apiCat.enabled,
        tagline: apiCat.tagline || local?.tagline,
        hasMegaMenu: local?.hasMegaMenu,
        subcategories: local?.subcategories,
      };
    }).sort((a, b) => {
      const orderA = orderMap.has(a.slug) ? (orderMap.get(a.slug) as number) : 999;
      const orderB = orderMap.has(b.slug) ? (orderMap.get(b.slug) as number) : 999;
      return orderA - orderB;
    });

    _cachedApiCategories = merged;
    _cacheTimestamp = Date.now();
    return merged;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Catalog] API unreachable, using fallback categories:", err instanceof Error ? err.message : err);
    }
    return CATALOG_CATEGORIES;
  }
}

/**
 * Synchronous fallback: returns enabled categories from the hardcoded list.
 * Used during SSR / initial render before the API call completes.
 */
export function getEnabledCategories(): CategoryConfig[] {
  if (_cachedApiCategories) {
    return _cachedApiCategories.filter((c) => c.enabled);
  }
  return CATALOG_CATEGORIES.filter((category) => category.enabled);
}

/**
 * Check whether a category ID or slug is currently enabled for shopping.
 */
export function isCategoryEnabled(idOrSlug: string): boolean {
  const source = _cachedApiCategories || CATALOG_CATEGORIES;
  const cat = source.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  // If found in config/API, return its enabled status; if not found (new category in DB), allow it by default
  return cat ? cat.enabled : true;
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  const source = _cachedApiCategories || CATALOG_CATEGORIES;
  return source.find((c) => c.slug === slug);
}

/**
 * Force-refresh the category cache (e.g. after admin changes).
 */
export function invalidateCategoryCache(): void {
  _cachedApiCategories = null;
  _cacheTimestamp = 0;
}
