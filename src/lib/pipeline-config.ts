import { Lead, PipelineStage } from "@/types";

// Stage configuration with colors and order
export const PIPELINE_STAGES: {
  id: PipelineStage;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  order: number;
}[] = [
  {
    id: "new",
    label: "New",
    color: "slate",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    order: 1,
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    order: 2,
  },
  {
    id: "proposal",
    label: "Proposal",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    order: 3,
  },
  {
    id: "negotiation",
    label: "Negotiation",
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    order: 4,
  },
  {
    id: "won",
    label: "Won",
    color: "emerald",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    order: 5,
  },
  {
    id: "lost",
    label: "Lost",
    color: "rose",
    bgColor: "bg-rose-100",
    textColor: "text-rose-700",
    order: 6,
  },
];

export function getStageConfig(stageId: PipelineStage) {
  return PIPELINE_STAGES.find((s) => s.id === stageId) || PIPELINE_STAGES[0];
}

export function getStageProgress(stageId: PipelineStage): number {
  const stage = getStageConfig(stageId);
  // Won/Lost are terminal states
  if (stageId === "won") return 100;
  if (stageId === "lost") return 0;
  // Calculate progress based on order (excluding won/lost)
  return (stage.order / 4) * 100;
}

// Mock data for demonstration
export const mockLeads: Lead[] = [
  {
    id: "1",
    title: "Enterprise License - TechCorp",
    customerId: "c1",
    customerName: "TechCorp Inc.",
    value: 125000,
    stage: "proposal",
    probability: 60,
    priority: "high",
    owner: "John Doe",
    ownerAvatar: "",
    closingDate: new Date("2026-02-15"),
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "2",
    title: "Annual Subscription - StartupXYZ",
    customerId: "c2",
    customerName: "StartupXYZ",
    value: 45000,
    stage: "negotiation",
    probability: 75,
    priority: "medium",
    owner: "Jane Smith",
    ownerAvatar: "",
    closingDate: new Date("2026-01-25"),
    createdAt: new Date("2025-11-15"),
    updatedAt: new Date("2026-01-12"),
  },
  {
    id: "3",
    title: "Consulting Package - MegaCorp",
    customerId: "c3",
    customerName: "MegaCorp Ltd.",
    value: 250000,
    stage: "new",
    probability: 20,
    priority: "high",
    owner: "John Doe",
    ownerAvatar: "",
    closingDate: new Date("2026-03-30"),
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
  {
    id: "4",
    title: "Platform Migration - FinanceHub",
    customerId: "c4",
    customerName: "FinanceHub",
    value: 85000,
    stage: "contacted",
    probability: 40,
    priority: "medium",
    owner: "Sarah Connor",
    ownerAvatar: "",
    closingDate: new Date("2026-02-28"),
    createdAt: new Date("2025-12-20"),
    updatedAt: new Date("2026-01-08"),
  },
  {
    id: "5",
    title: "Support Contract - RetailMax",
    customerId: "c5",
    customerName: "RetailMax",
    value: 32000,
    stage: "won",
    probability: 100,
    priority: "low",
    owner: "Jane Smith",
    ownerAvatar: "",
    closingDate: new Date("2026-01-10"),
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "6",
    title: "Custom Development - HealthCare+",
    customerId: "c6",
    customerName: "HealthCare+",
    value: 175000,
    stage: "proposal",
    probability: 55,
    priority: "high",
    owner: "John Doe",
    ownerAvatar: "",
    closingDate: new Date("2026-01-05"), // Overdue!
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: "7",
    title: "SaaS Integration - LogiTech",
    customerId: "c7",
    customerName: "LogiTech Solutions",
    value: 68000,
    stage: "lost",
    probability: 0,
    priority: "medium",
    owner: "Sarah Connor",
    ownerAvatar: "",
    closingDate: new Date("2025-12-31"),
    createdAt: new Date("2025-09-20"),
    updatedAt: new Date("2025-12-31"),
  },
  {
    id: "8",
    title: "Pilot Program - EduLearn",
    customerId: "c8",
    customerName: "EduLearn Academy",
    value: 15000,
    stage: "negotiation",
    probability: 80,
    priority: "medium",
    owner: "Jane Smith",
    ownerAvatar: "",
    closingDate: new Date("2026-01-20"),
    createdAt: new Date("2025-12-10"),
    updatedAt: new Date("2026-01-11"),
  },
];

// Helper functions
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculatePipelineStats(leads: Lead[]) {
  const openLeads = leads.filter(
    (l) => l.stage !== "won" && l.stage !== "lost"
  );
  const wonLeads = leads.filter((l) => l.stage === "won");

  const totalValue = openLeads.reduce((sum, l) => sum + l.value, 0);
  const avgDealSize =
    openLeads.length > 0 ? totalValue / openLeads.length : 0;
  const winRate =
    leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0;
  const totalDeals = openLeads.length;

  return { totalValue, avgDealSize, winRate, totalDeals };
}
