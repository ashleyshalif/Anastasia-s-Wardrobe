"use client";

import { useState, useEffect } from "react";
import {
  CategoryConfig,
  getEnabledCategories,
  fetchCategoriesFromAPI,
} from "@/config/catalog";

/**
 * React hook that fetches categories from the Django API on mount,
 * then updates the in-memory cache so all consumers get live data.
 *
 * Returns the synchronous fallback immediately (from cache or hardcoded),
 * then re-renders once the API call resolves.
 */
export function useCategories(): CategoryConfig[] {
  const [categories, setCategories] = useState<CategoryConfig[]>(getEnabledCategories);

  useEffect(() => {
    let cancelled = false;
    fetchCategoriesFromAPI().then((all) => {
      if (!cancelled) {
        setCategories(all.filter((c) => c.enabled));
      }
    });
    return () => { cancelled = true; };
  }, []);

  return categories;
}
