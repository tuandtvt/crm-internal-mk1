import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Status } from "@/types";
import { ALL_STATUSES } from "@/lib/mock-data/status";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get status by entity type and code
 * @param entityType - Entity type (LEAD, DEAL, CONTRACT, TASK, TICKET)
 * @param code - Status code (NEW, WON, etc.)
 * @returns Status object or undefined
 */
export function getStatus(entityType: string, code: string): Status | undefined {
  return ALL_STATUSES.find(
    (s) => s.entity_type === entityType && s.code === code
  );
}

/**
 * Get status by ID
 * @param id - Status ID
 * @returns Status object or undefined
 */
export function getStatusById(id: number): Status | undefined {
  return ALL_STATUSES.find((s) => s.id === id);
}

/**
 * Format number as Vietnamese currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format large numbers (e.g., 1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
