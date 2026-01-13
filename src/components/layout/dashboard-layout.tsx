"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50/90">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          isCollapsed ? "pl-[60px]" : "pl-[280px]"
        )}
      >
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
