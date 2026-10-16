import { Product } from "@/types/product";
import { apiClient } from "./client";
import { ProductFilterParams, PaginatedResponse } from "./types";
import { isCategoryEnabled } from "@/config/catalog";

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
        if (params?.search) queryParams.search = params.search;
        if (params?.page) queryParams.page = params.page;
        if (params?.pageSize) queryParams.page_size = params.pageSize;

        const res = await apiClient.get<PaginatedResponse<Product> | Product[]>(
          "/products/",
          queryParams
        );

        const list = Array.isArray(res) ? res : res.results;
        return list.filter((p) => isCategoryEnabled(p.category));
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
        return product;
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
        return list.filter((p) => isCategoryEnabled(p.category));
      },
      () => {
        if (mockFallback) return mockFallback();
        return [];
      },
      `getProductsByCategory(${category})`
    );
  }

  /**
   * Search catalog by query string
   */
  public async searchProducts(
    query: string,
    mockFallback?: () => Product[]
  ): Promise<Product[]> {
    const clean = query.trim();
    if (!clean) return [];

    return apiClient.withMockFallback(
      async () => {
        const res = await apiClient.get<PaginatedResponse<Product> | Product[]>(
          "/products/search/",
          { q: clean }
        );
        const list = Array.isArray(res) ? res : res.results;
        return list.filter((p) => isCategoryEnabled(p.category));
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
