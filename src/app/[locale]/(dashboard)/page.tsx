"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  CheckSquare, 
  LifeBuoy,
  Download,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { kpiMetrics } from "@/lib/mock-data/dashboard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CustomerGrowthChart } from "@/components/dashboard/CustomerGrowthChart";
import { SourcePieChart } from "@/components/dashboard/SourcePieChart";
import { ConversionGauge } from "@/components/dashboard/ConversionGauge";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "@/components/common/date-range-filter";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tf = useTranslations("filters");
  // Date range filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Mock filter effect: adjust KPIs based on date range
  const filteredKpiMetrics = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return kpiMetrics;
    
    // Calculate days in range for mock adjustment
    const daysDiff = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    const factor = Math.max(0.3, Math.min(1.5, daysDiff / 30)); // Scale based on range
    
    return {
      newLeads: Math.round(kpiMetrics.newLeads * factor),
      newContracts: Math.round(kpiMetrics.newContracts * factor),
      pendingTasks: Math.round(kpiMetrics.pendingTasks * (factor > 1 ? 1.1 : 0.9)),
      pendingTickets: Math.round(kpiMetrics.pendingTickets * factor),
    };
  }, [dateRange]);

  const kpis = [
    {
      title: t("newLeads"),
      value: filteredKpiMetrics.newLeads,
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: t("newContracts"),
      value: filteredKpiMetrics.newContracts,
      change: "+8.2%",
      trend: "up",
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: t("pendingTasks"),
      value: filteredKpiMetrics.pendingTasks,
      change: "-2",
      trend: "down",
      icon: CheckSquare,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: t("openTickets"),
      value: filteredKpiMetrics.pendingTickets,
      change: "+1",
      trend: "up",
      icon: LifeBuoy,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-500 mt-1">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
            <Download className="mr-2 h-4 w-4" />
            {t("exportReport")}
          </Button>
        </div>
      </div>

      {/* KPI Row (Grid of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="bento-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", kpi.bg)}>
                    <Icon className={cn("h-5 w-5", kpi.color)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                    kpi.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{kpi.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts Row (2/3 + 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ConversionGauge />
        </div>
      </div>

      {/* Secondary Charts Row (1/2 + 1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerGrowthChart />
        <SourcePieChart />
      </div>
    </div>
  );
}

// Utility function (re-defined here since we use cn)
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
