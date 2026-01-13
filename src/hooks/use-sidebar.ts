"use client";

import { useSidebarStore } from "@/lib/store";

export function useSidebar() {
  const { isCollapsed, toggle, setCollapsed } = useSidebarStore();

  return {
    isCollapsed,
    toggle,
    setCollapsed,
  };
}
