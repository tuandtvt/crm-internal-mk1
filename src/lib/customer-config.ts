import { Customer } from "@/types";

// Source options
export const CUSTOMER_SOURCES = [
  { id: "website", label: "Website" },
  { id: "referral", label: "Referral" },
  { id: "social", label: "Social Media" },
  { id: "cold-call", label: "Cold Call" },
  { id: "event", label: "Event" },
  { id: "partner", label: "Partner" },
] as const;

// Customer type config with colors
export const CUSTOMER_TYPES = {
  lead: {
    label: "Lead",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
  },
  prospect: {
    label: "Prospect",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  vip: {
    label: "VIP",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
} as const;

// Industry options
export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Consulting",
  "Media",
  "Other",
];

// Mock customer data
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "John Anderson",
    email: "john.anderson@techcorp.com",
    phone: "+1-555-0123",
    company: "TechCorp Inc.",
    industry: "Technology",
    source: "website",
    customerType: "vip",
    owner: "Jane Smith",
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2026-01-10"),
    tags: ["enterprise", "priority"],
  },
  {
    id: "c2",
    name: "Sarah Williams",
    email: "sarah.w@startupxyz.io",
    phone: "+1-555-0124",
    company: "StartupXYZ",
    industry: "Technology",
    source: "referral",
    customerType: "prospect",
    owner: "John Doe",
    createdAt: new Date("2025-09-20"),
    updatedAt: new Date("2026-01-08"),
    tags: ["startup", "growth"],
  },
  {
    id: "c3",
    name: "Michael Chen",
    email: "m.chen@megacorp.com",
    phone: "+1-555-0125",
    company: "MegaCorp Ltd.",
    industry: "Manufacturing",
    source: "event",
    customerType: "lead",
    owner: "Sarah Connor",
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
    tags: ["new"],
  },
  {
    id: "c4",
    name: "Emily Davis",
    email: "emily.davis@financehub.com",
    phone: "+1-555-0126",
    company: "FinanceHub",
    industry: "Finance",
    source: "cold-call",
    customerType: "prospect",
    owner: "Jane Smith",
    createdAt: new Date("2025-11-10"),
    updatedAt: new Date("2026-01-03"),
    tags: ["fintech"],
  },
  {
    id: "c5",
    name: "Robert Johnson",
    email: "r.johnson@retailmax.com",
    phone: "+1-555-0127",
    company: "RetailMax",
    industry: "Retail",
    source: "partner",
    customerType: "vip",
    owner: "John Doe",
    createdAt: new Date("2025-03-22"),
    updatedAt: new Date("2026-01-12"),
    tags: ["retail", "enterprise"],
  },
  {
    id: "c6",
    name: "Lisa Thompson",
    email: "lisa.t@healthcare-plus.org",
    phone: "+1-555-0128",
    company: "HealthCare+",
    industry: "Healthcare",
    source: "website",
    customerType: "lead",
    owner: "Sarah Connor",
    createdAt: new Date("2025-12-18"),
    updatedAt: new Date("2025-12-28"),
    tags: ["healthcare"],
  },
  {
    id: "c7",
    name: "David Miller",
    email: "d.miller@logitech-solutions.com",
    phone: "+1-555-0129",
    company: "LogiTech Solutions",
    industry: "Technology",
    source: "social",
    customerType: "prospect",
    owner: "Jane Smith",
    createdAt: new Date("2025-08-05"),
    updatedAt: new Date("2025-12-15"),
    tags: ["logistics"],
  },
  {
    id: "c8",
    name: "Jennifer Brown",
    email: "j.brown@edulearn.edu",
    phone: "+1-555-0130",
    company: "EduLearn Academy",
    industry: "Education",
    source: "referral",
    customerType: "lead",
    owner: "John Doe",
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-01-11"),
    tags: ["education", "pilot"],
  },
];

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
}
