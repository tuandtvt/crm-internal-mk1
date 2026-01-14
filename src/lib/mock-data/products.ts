export interface Product {
  id: number;
  code: string; // SKU (e.g., LIC-ENT-001)
  name: string;
  category: "Software" | "Service" | "Hardware";
  description: string;
  unit_price: number;
  currency: "USD" | "VND";
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    code: "LIC-ENT-001",
    name: "Enterprise License Year 1",
    category: "Software",
    description: "Full access to MK1 CRM enterprise features for one year, including up to 50 users.",
    unit_price: 5000,
    currency: "USD",
    is_active: true,
    created_at: "2025-01-10T08:30:00Z",
  },
  {
    id: 2,
    code: "SRV-IMP-001",
    name: "Implementation Package",
    category: "Service",
    description: "Professional onboarding and data migration service for enterprise customers.",
    unit_price: 2500,
    currency: "USD",
    is_active: true,
    created_at: "2025-01-12T10:15:00Z",
  },
  {
    id: 3,
    code: "SRV-AIC-002",
    name: "AI Consulting Hour",
    category: "Service",
    description: "Direct consultation with our AI engineers to optimize your CRM workflow.",
    unit_price: 250,
    currency: "USD",
    is_active: true,
    created_at: "2025-01-15T14:20:00Z",
  },
  {
    id: 4,
    code: "HRD-SVR-003",
    name: "On-premise Server Setup",
    category: "Hardware",
    description: "High-performance specialized server for hosting MK1 CRM on-site.",
    unit_price: 12000,
    currency: "USD",
    is_active: false,
    created_at: "2025-02-01T09:00:00Z",
  },
  {
    id: 5,
    code: "LIC-PRO-002",
    name: "Professional License Year 1",
    category: "Software",
    description: "Standard access features for small to medium teams, up to 15 users.",
    unit_price: 1500,
    currency: "USD",
    is_active: true,
    created_at: "2025-02-10T11:45:00Z",
  },
  {
    id: 6,
    code: "SRV-TRN-004",
    name: "User Training Workshop",
    category: "Service",
    description: "Full-day workshop for end-users to maximize CRM adoption.",
    unit_price: 800,
    currency: "USD",
    is_active: true,
    created_at: "2025-02-20T13:00:00Z",
  },
];

export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat(currency === "VND" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
