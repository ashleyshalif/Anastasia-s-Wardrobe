import { Product } from "@/types/product";
import { apiClient } from "./client";
import { ProductFilterParams, PaginatedResponse } from "./types";
import { isCategoryEnabled } from "@/config/catalog";

// Helper to guarantee typed Product format even if backend sends numeric ID or snake_case
function normalizeProduct(raw: any): Product {
  if (!raw) return raw;
  return {
    id: String(raw.id),
    slug: raw.slug,
    name: raw.name,
    category: typeof raw.category === "object" ? raw.category?.id || "" : String(raw.category || ""),
    department: raw.department || "",
    price: Number(raw.price) || 0,
    originalPrice: raw.originalPrice ?? raw.original_price ?? undefined,
    saleNote: raw.saleNote ?? raw.sale_note ?? undefined,
    currency: raw.currency || "INR",
    color: Array.isArray(raw.color)
      ? String(raw.color[0] || "")
      : typeof raw.color === "string"
      ? raw.color.replace(/[\[\]"']/g, "").trim()
      : "",
    colorHex: raw.colorHex ?? raw.color_hex ?? undefined,
    availableColors: (() => {
      const list = Array.isArray(raw.availableColors)
        ? raw.availableColors
        : Array.isArray(raw.available_colors)
        ? raw.available_colors
        : [];
      return list.map((item: any) => {
        if (typeof item === "string") {
          const clean = item.replace(/[\[\]"']/g, "").trim();
          const hex =
            clean.toLowerCase() === "brown"
              ? "#6E473B"
              : clean.toLowerCase() === "apricot"
              ? "#E7C9A9"
              : "#C8B6A6";
          return { name: clean, hex };
        }
        return item;
      });
    })(),
    sizes: Array.isArray(raw.sizes) ? raw.sizes : [],
    image: raw.image || "/images/cardigan.png",
    // secondaryImage: second photo angle for card hover preview
    secondaryImage: raw.secondaryImage ?? raw.secondary_image ?? undefined,
    galleryImages: Array.isArray(raw.galleryImages)
      ? raw.galleryImages
      : Array.isArray(raw.gallery_images)
      ? raw.gallery_images
      : [],
    // Flat images array (all angles, all colors)
    images: Array.isArray(raw.images)
      ? raw.images.map((img: any) => ({
          id: img.id,
          url: img.url,
          thumbnailUrl: img.thumbnailUrl ?? img.thumbnail_url ?? img.url,
          color: img.color ?? "",
          angle: img.angle ?? "front",
          alt: img.alt ?? img.alt_text ?? "",
          position: img.position ?? 0,
          isPrimary: img.is_primary ?? img.isPrimary ?? false,
        }))
      : undefined,
    // Variants: photos grouped per color swatch
    variants: Array.isArray(raw.variants)
      ? raw.variants.map((v: any) => ({
          color: v.color,
          hex: v.hex,
          hasImages: v.hasImages ?? false,
          images: Array.isArray(v.images)
            ? v.images.map((img: any) => ({
                id: img.id,
                url: img.url,
                thumbnailUrl: img.thumbnailUrl ?? img.thumbnail_url ?? img.url,
                color: img.color ?? v.color,
                angle: img.angle ?? "front",
                alt: img.alt ?? img.alt_text ?? "",
                position: img.position ?? 0,
                isPrimary: img.is_primary ?? img.isPrimary ?? false,
              }))
            : [],
        }))
      : undefined,
    description: raw.description || "",
    details: Array.isArray(raw.details) ? raw.details : [],
    fabric: raw.fabric || "",
    care: raw.care || "",
    badge: raw.badge || "",
    inStock:
      raw.inStock !== undefined
        ? Boolean(raw.inStock)
        : raw.in_stock !== undefined
        ? Boolean(raw.in_stock)
        : true,
  };
}


// Deduplicate products by normalized slug or clean name
export function deduplicateProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  const deduped: Product[] = [];

  for (const p of products) {
    if (!p) continue;
    // Normalize key by stripping 'the-', '-night-market', and trailing dashes
    const cleanName = (p.name || "")
      .toLowerCase()
      .replace(/^the\s+/, "")
      .replace(/\s*[-–]\s*night\s*market/i, "")
      .replace(/\s+/g, " ")
      .trim();
    const cleanSlug = (p.slug || "")
      .toLowerCase()
      .replace(/-night-market$/, "")
      .replace(/^the-/, "")
      .trim();
    const key = cleanSlug || cleanName;

    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(p);
  }
  return deduped;
}

export class ProductApiService {
  /**
   * Fetch list of products with optional category, price, and pagination filtering
   */
  public async getProducts(
    params?: ProductFilterParams,
    mockFallback?: () => Product[]
  ): Promise<Product[]> {
    return apiClient.withMockFallback(
      async () => {
        const queryParams: Record<string, string | number | undefined> = {};
        if (params?.category) queryParams.category = params.category;
        if (params?.department) queryParams.department = params.department;
        if (params?.minPrice !== undefined) queryParams.min_price = params.minPrice;
        if (params?.maxPrice !== undefined) queryParams.max_price = params.maxPrice;
        if (params?.sortBy) queryParams.sort = params.sortBy;
        if (params?.search) {
          queryParams.q = params.search;
          queryParams.search = params.search;
        }
        if (params?.page) queryParams.page = params.page;
        if (params?.pageSize) queryParams.page_size = params.pageSize;

        const res = await apiClient.get<PaginatedResponse<Product> | Product[]>(
          "/products/",
          queryParams
        );

        const list = Array.isArray(res) ? res : res.results;
        return deduplicateProducts(list.map(normalizeProduct).filter((p) => isCategoryEnabled(p.category)));
      },
      () => {
        if (mockFallback) return mockFallback();
        return [];
      },
      "getProducts"
    );
  }

  /**
   * Fetch a single product by its unique URL slug
   */
  public async getProductBySlug(
    slug: string,
    mockFallback?: () => Product | null
  ): Promise<Product | null> {
    return apiClient.withMockFallback(
      async () => {
        const product = await apiClient.get<Product>(`/products/${slug}/`);
        if (!product || !isCategoryEnabled(product.category)) return null;
        return normalizeProduct(product);
      },
      () => {
        if (mockFallback) return mockFallback();
        return null;
      },
      `getProductBySlug(${slug})`
    );
  }

  /**
   * Fetch products belonging to a category
   */
  public async getProductsByCategory(
    category: string,
    mockFallback?: () => Product[]
  ): Promise<Product[]> {
    if (!isCategoryEnabled(category)) return [];

    return apiClient.withMockFallback(
      async () => {
        const res = await apiClient.get<PaginatedResponse<Product> | Product[]>(
          "/products/",
          { category }
        );
        const list = Array.isArray(res) ? res : res.results;
        return deduplicateProducts(list.map(normalizeProduct).filter((p) => isCategoryEnabled(p.category)));
      },
      () => {
        if (mockFallback) return mockFallback();
        return [];
      },
      `getProductsByCategory(${category})`
    );
  }

  /**
   * Search catalog by query string.
   * Django endpoint: GET /api/products/?q=<term>
   */
  public async searchProducts(
    query: string,
    mockFallback?: () => Product[]
  ): Promise<Product[]> {
    const clean = query.trim();
    if (!clean) return [];

    return apiClient.withMockFallback(
      async () => {
        // Django uses ?q= for search on the /products/ endpoint (not a separate /search/ route)
        const res = await apiClient.get<PaginatedResponse<Product> | Product[]>(
          "/products/",
          { q: clean }
        );
        const list = Array.isArray(res) ? res : res.results;
        return deduplicateProducts(list.map(normalizeProduct).filter((p) => isCategoryEnabled(p.category)));
      },
      () => {
        if (mockFallback) return mockFallback();
        return [];
      },
      `searchProducts(${clean})`
    );
  }
}

export const productsApi = new ProductApiService();
