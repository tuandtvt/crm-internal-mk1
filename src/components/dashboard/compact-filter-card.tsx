"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useCallback } from "react";

interface CompactFilterCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  statusValue: string | null; // null = clear filter (All)
  paramName?: string;
  iconBgColor?: string; // e.g., "bg-blue-100"
  iconTextColor?: string; // e.g., "text-blue-600"
  activeColor?: string; // e.g., "blue" | "indigo" | "emerald"
}

export function CompactFilterCard({
  label,
  value,
  icon: Icon,
  statusValue,
  paramName = "status",
  iconBgColor = "bg-slate-100",
  iconTextColor = "text-slate-600",
  activeColor = "indigo",
}: CompactFilterCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if this card is currently active
  const currentStatus = searchParams.get(paramName);
  const isActive = statusValue === null 
    ? !currentStatus || currentStatus === ""
    : currentStatus === statusValue;

  // Create updated query string
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleClick = () => {
    const queryString = createQueryString(paramName, statusValue);
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  // Dynamic active colors
  const activeColorClasses: Record<string, string> = {
    indigo: "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/50",
    blue: "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50",
    emerald: "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/50",
    amber: "border-amber-500 ring-1 ring-amber-500 bg-amber-50/50",
    purple: "border-purple-500 ring-1 ring-purple-500 bg-purple-50/50",
    slate: "border-slate-500 ring-1 ring-slate-500 bg-slate-50/50",
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "cursor-pointer transition-all duration-200 border bg-white",
        "hover:shadow-md hover:border-slate-300",
        isActive
          ? activeColorClasses[activeColor] || activeColorClasses.indigo
          : "border-slate-200 shadow-sm"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex-shrink-0 p-2 rounded-lg",
              iconBgColor
            )}
          >
            <Icon className={cn("h-4 w-4", iconTextColor)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 truncate">{label}</p>
            <p className={cn(
              "text-xl font-bold",
              isActive ? `text-${activeColor}-600` : "text-slate-900"
            )}>
              {value}
            </p>
          </div>
          {isActive && (
            <div className={cn(
              "flex-shrink-0 h-2 w-2 rounded-full",
              `bg-${activeColor}-500`
            )} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
