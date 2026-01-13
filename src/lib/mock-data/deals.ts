import type { Deal, DealProduct } from "@/types";
import { mockProducts } from "./products";

/**
 * Mock Deals
 * Aligned with database schema: deals table + deal_products table
 * IMPORTANT: Includes deal_products array and calculated total_amount
 */

export const mockDeals: Deal[] = [
  {
    id: 1,
    name: "Enterprise License - TechCorp",
    discount_rate: 10, // 10% discount
    total_amount: 108000000, // Calculated from products below
    probability: 75,
    expected_close_date: new Date("2026-02-15"),
    status_id: 12, // PROPOSAL
    owner_id: 1, // John Doe
    customer_id: 1, // TechCorp
    deal_products: [
      {
        deal_id: 1,
        product_id: 3, // CRM Enterprise License
        quantity: 1,
        unit_price: 120000000,
        line_total: 120000000,
      },
    ],
    created_by: 1,
    created_at: new Date("2025-12-01"),
    updated_at: new Date("2026-01-10"),
  },
  {
    id: 2,
    name: "Professional Package - StartupXYZ",
    discount_rate: 5,
    total_amount: 60325000, // 45M + 18M - 5% discount
    probability: 85,
    expected_close_date: new Date("2026-01-25"),
    status_id: 13, // NEGOTIATION
    owner_id: 2, // Jane Smith
    customer_id: 2, // StartupXYZ
    deal_products: [
      {
        deal_id: 2,
        product_id: 2, // CRM Professional
        quantity: 1,
        unit_price: 45000000,
        line_total: 45000000,
      },
      {
        deal_id: 2,
        product_id: 5, // Support Ticketing Module
        quantity: 1,
        unit_price: 18000000,
        line_total: 18000000,
      },
    ],
    created_by: 2,
    created_at: new Date("2025-11-15"),
    updated_at: new Date("2026-01-12"),
  },
  {
    id: 3,
    name: "Consulting Package - MegaCorp",
    discount_rate: 0,
    total_amount: 50000000,
    probability: 30,
    expected_close_date: new Date("2026-03-30"),
    status_id: 11, // NEW
    owner_id: 1,
    customer_id: 3, // MegaCorp (LEAD)
    deal_products: [
      {
        deal_id: 3,
        product_id: 6, // Custom Integration Service
        quantity: 1,
        unit_price: 30000000,
        line_total: 30000000,
      },
      {
        deal_id: 3,
        product_id: 9, // Data Migration Service
        quantity: 1,
        unit_price: 20000000,
        line_total: 20000000,
      },
    ],
    created_by: 1,
    created_at: new Date("2026-01-05"),
    updated_at: new Date("2026-01-05"),
  },
  {
    id: 4,
    name: "Platform Migration + Training - FinanceHub",
    discount_rate: 15,
    total_amount: 73950000, // (45M + 20M + 22M) - 15%
    probability: 60,
    expected_close_date: new Date("2026-02-28"),
    status_id: 12, // PROPOSAL
    owner_id: 2,
    customer_id: 4, // FinanceHub
    deal_products: [
      {
        deal_id: 4,
        product_id: 2, // CRM Professional
        quantity: 1,
        unit_price: 45000000,
        line_total: 45000000,
      },
      {
        deal_id: 4,
        product_id: 9, // Data Migration
        quantity: 1,
        unit_price: 20000000,
        line_total: 20000000,
      },
      {
        deal_id: 4,
        product_id: 7, // Training Basic
        quantity: 1,
        unit_price: 8000000,
        line_total: 8000000,
      },
      {
        deal_id: 4,
        product_id: 8, // Premium Support
        quantity: 1,
        unit_price: 12000000,
        line_total: 12000000,
      },
    ],
    created_by: 2,
    created_at: new Date("2025-12-20"),
    updated_at: new Date("2026-01-08"),
  },
  {
    id: 5,
    name: "Support Contract Renewal - RetailMax",
    discount_rate: 0,
    total_amount: 30000000,
    probability: 95,
    expected_close_date: new Date("2026-01-20"),
    status_id: 14, //WON
    owner_id: 2,
    customer_id: 5, // RetailMax
    deal_products: [
      {
        deal_id: 5,
        product_id: 8, // Premium Support SLA
        quantity: 1,
        unit_price: 12000000,
        line_total: 12000000,
      },
      {
        deal_id: 5,
        product_id: 5, // Support Ticketing Module
        quantity: 1,
        unit_price: 18000000,
        line_total: 18000000,
      },
    ],
    created_by: 2,
    created_at: new Date("2025-11-01"),
    updated_at: new Date("2026-01-10"),
  },
  {
    id: 6,
    name: "Custom Development - HealthCare+",
    discount_rate: 20,
    total_amount: 108000000, // (120M + 15M) - 20%
    probability: 45,
    expected_close_date: new Date("2026-03-15"),
    status_id: 12, // PROPOSAL
    owner_id: 3,
    customer_id: 6, // HealthCare+ (LEAD)
    deal_products: [
      {
        deal_id: 6,
        product_id: 3, // CRM Enterprise
        quantity: 1,
        unit_price: 120000000,
        line_total: 120000000,
      },
      {
        deal_id: 6,
        product_id: 1, // CRM Standard (addon)
        quantity: 1,
        unit_price: 15000000,
        line_total: 15000000,
      },
    ],
    created_by: 3,
    created_at: new Date("2025-10-15"),
    updated_at: new Date("2026-01-02"),
  },
];

// Helper function to calculate deal total from products
export function calculateDealTotal(dealProducts: DealProduct[], discountRate: number = 0): number {
  const subtotal = dealProducts.reduce((sum, dp) => {
    const lineTotal = dp.quantity * dp.unit_price;
    return sum + lineTotal;
  }, 0);
  
  const discount = subtotal * (discountRate / 100);
  return subtotal - discount;
}

// Helper function to enrich deal with product names
export function enrichDealProducts(dealProducts: DealProduct[]): DealProduct[] {
  return dealProducts.map((dp) => {
    const product = mockProducts.find((p) => p.id === dp.product_id);
    return {
      ...dp,
      product,
      line_total: dp.quantity * dp.unit_price,
    };
  });
}

export function getDealById(id: number): Deal | undefined {
  return mockDeals.find((d) => d.id === id);
}

export function getDealsByCustomer(customerId: number): Deal[] {
  return mockDeals.filter((d) => d.customer_id === customerId);
}

export function getDealsByOwner(ownerId: number): Deal[] {
  return mockDeals.filter((d) => d.owner_id === ownerId);
}

export function getTotalDealValue(deals: Deal[]): number {
  return deals.reduce((sum, d) => sum + d.total_amount, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
