"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a value from URL params
  const getValue = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  // Get multiple values (for multi-select filters)
  const getValues = useCallback(
    (key: string): string[] => {
      const value = searchParams.get(key);
      return value ? value.split(",").filter(Boolean) : [];
    },
    [searchParams]
  );

  // Set a single value
  const setValue = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Set multiple values (for multi-select filters)
  const setValues = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (values.length === 0) {
        params.delete(key);
      } else {
        params.set(key, values.join(","));
      }
      
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Remove a specific param
  const removeValue = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Reset all filters (keep search query if desired)
  const resetFilters = useCallback(
    (keepSearch = false) => {
      const params = new URLSearchParams();
      
      if (keepSearch) {
        const q = searchParams.get("q");
        if (q) params.set("q", q);
      }
      
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Check if any filters are active (excluding search)
  const hasActiveFilters = useCallback(
    (excludeKeys: string[] = ["q"]): boolean => {
      const entries = Array.from(searchParams.entries());
      return entries.some(([key]) => !excludeKeys.includes(key));
    },
    [searchParams]
  );

  return {
    getValue,
    getValues,
    setValue,
    setValues,
    removeValue,
    resetFilters,
    hasActiveFilters,
    searchParams,
  };
}
