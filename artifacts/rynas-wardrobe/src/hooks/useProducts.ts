"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/products";
import { ProductFilterParams } from "@/lib/api/types";

export interface UseProductsOptions extends ProductFilterParams {
  initialProducts?: Product[];
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(options.initialProducts || []);
  const [isLoading, setIsLoading] = useState(!options.initialProducts);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [category, setCategory] = useState<string | undefined>(options.category);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(options.color);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(options.size);
  const [searchQuery, setSearchQuery] = useState<string>(options.search || "");
  const [sortBy, setSortBy] = useState<ProductFilterParams["sortBy"]>(options.sortBy || "featured");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts({
        category,
        sortBy,
        search: searchQuery || undefined,
        color: selectedColor,
        size: selectedSize,
      });
      setProducts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load collection.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [category, sortBy, searchQuery, selectedColor, selectedSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Derived filtered & sorted list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedColor && p.color.toLowerCase() !== selectedColor.toLowerCase()) {
        const hasColor = p.availableColors?.some(
          (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
        );
        if (!hasColor) return false;
      }
      if (selectedSize && !p.sizes.includes(selectedSize)) {
        return false;
      }
      return true;
    });
  }, [products, selectedColor, selectedSize]);

  return {
    products: filteredProducts,
    allProducts: products,
    isLoading,
    error,
    category,
    setCategory,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refetch: fetchProducts,
  };
}
