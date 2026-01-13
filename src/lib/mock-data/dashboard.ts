export interface KPIMetric {
  labelKey: string;
  value: number;
  change: number;
  trend: "up" | "down" | "neutral";
}

export const kpiMetrics = {
  newLeads: 45,
  newContracts: 12,
  pendingTasks: 8,
  pendingTickets: 5,
};

export const revenueData = [
  { month: "Jan", revenue: 4500, target: 4000 },
  { month: "Feb", revenue: 5200, target: 4000 },
  { month: "Mar", revenue: 4800, target: 4500 },
  { month: "Apr", revenue: 6100, target: 5000 },
  { month: "May", revenue: 5900, target: 5000 },
  { month: "Jun", revenue: 7200, target: 6000 },
  { month: "Jul", revenue: 6800, target: 6000 },
  { month: "Aug", revenue: 7500, target: 7000 },
  { month: "Sep", revenue: 8200, target: 7500 },
  { month: "Oct", revenue: 8900, target: 8000 },
  { month: "Nov", revenue: 9500, target: 8500 },
  { month: "Dec", revenue: 10200, target: 9000 },
];

export const customerGrowthData = [
  { month: "Jan", customers: 120 },
  { month: "Feb", customers: 135 },
  { month: "Mar", customers: 150 },
  { month: "Apr", customers: 180 },
  { month: "May", customers: 210 },
  { month: "Jun", customers: 245 },
  { month: "Jul", customers: 280 },
  { month: "Aug", customers: 310 },
  { month: "Sep", customers: 350 },
  { month: "Oct", customers: 400 },
  { month: "Nov", customers: 460 },
  { month: "Dec", customers: 520 },
];

export const sourceData = [
  { name: "Facebook", value: 400, color: "#1877F2" },
  { name: "Google", value: 300, color: "#EA4335" },
  { name: "Referral", value: 200, color: "#34A853" },
  { name: "Direct", value: 100, color: "#FBBC05" },
];

export const conversionData = {
  totalLeads: 120,
  signedContracts: 35,
};
