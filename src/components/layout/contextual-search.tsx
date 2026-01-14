"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Get placeholder based on route
function getPlaceholder(pathname: string, t: (key: string) => string): string {
  if (pathname.includes("/customers")) return t("searchCustomers");
  if (pathname.includes("/leads")) return t("searchLeads");
  if (pathname.includes("/deals")) return t("searchDeals");
  if (pathname.includes("/contracts")) return t("searchContracts");
  if (pathname.includes("/tasks")) return t("searchTasks");
  if (pathname.includes("/tickets")) return t("searchTickets");
  if (pathname.includes("/templates")) return t("searchTemplates");
  return t("search");
}

export function ContextualSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  // Initialize from URL
  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const debouncedValue = useDebounce(inputValue, 300);

  // Sync debounced value to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedValue) {
      params.set("q", debouncedValue);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newUrl, { scroll: false });
  }, [debouncedValue, pathname, router, searchParams]);

  // Use ref to track if last change was from URL (avoid sync loop)
  // The URL is the source of truth when navigating

  const handleClear = useCallback(() => {
    setInputValue("");
  }, []);

  const placeholder = getPlaceholder(pathname, t);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 h-9 bg-white/80 backdrop-blur-sm border-slate-200 focus:bg-white focus:border-indigo-300 transition-colors"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
        >
          <X className="h-3 w-3 text-slate-400" />
        </Button>
      )}
    </div>
  );
}
