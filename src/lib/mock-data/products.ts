import type { Product } from "@/types";

/**
 * Mock Products
 * Aligned with database schema: products table
 */

export const mockProducts: Product[] = [
  {
    id: 1,
    code: "PROD-001",
    name: "CRM Standard License",
    description: "Giấy phép CRM chuẩn cho đội ngũ nhỏ (tối đa 10 người dùng)",
    unit_price: 15000000, // 15,000,000 VND
    is_active: true,
  },
  {
    id: 2,
    code: "PROD-002",
    name: "CRM Professional License",
    description: "Giấy phép CRM chuyên nghiệp cho doanh nghiệp vừa (tối đa 50 người dùng)",
    unit_price: 45000000, // 45,000,000 VND
    is_active: true,
  },
  {
    id: 3,
    code: "PROD-003",
    name: "CRM Enterprise License",
    description: "Giấy phép CRM doanh nghiệp không giới hạn người dùng",
    unit_price: 120000000, // 120,000,000 VND
    is_active: true,
  },
  {
    id: 4,
    code: "PROD-004",
    name: "Marketing Automation Module",
    description: "Module tự động hóa marketing với email campaigns và analytics",
    unit_price: 25000000, // 25,000,000 VND
    is_active: true,
  },
  {
    id: 5,
    code: "PROD-005",
    name: "Support Ticketing Module",
    description: "Module quản lý ticket hỗ trợ khách hàng với SLA tracking",
    unit_price: 18000000, // 18,000,000 VND
    is_active: true,
  },
  {
    id: 6,
    code: "PROD-006",
    name: "Custom Integration Service",
    description: "Dịch vụ tích hợp hệ thống theo yêu cầu (giá theo dự án)",
    unit_price: 30000000, // 30,000,000 VND base
    is_active: true,
  },
  {
    id: 7,
    code: "PROD-007",
    name: "Training Package - Basic",
    description: "Gói đào tạo cơ bản cho 10 người dùng (1 ngày onsite)",
    unit_price: 8000000, // 8,000,000 VND
    is_active: true,
  },
  {
    id: 8,
    code: "PROD-008",
    name: "Premium Support SLA",
    description: "Gói hỗ trợ cao cấp với SLA phản hồi trong 2 giờ",
    unit_price: 12000000, // 12,000,000 VND/năm
    is_active: true,
  },
  {
    id: 9,
    code: "PROD-009",
    name: "Data Migration Service",
    description: "Dịch vụ chuyển đổi dữ liệu từ hệ thống cũ sang CRM",
    unit_price: 20000000, // 20,000,000 VND
    is_active: true,
  },
  {
    id: 10,
    code: "PROD-010",
    name: "API Access License",
    description: "Giấy phép truy cập API cho tích hợp bên ngoài",
    unit_price: 10000000, // 10,000,000 VND/năm
    is_active: true,
  },
];

// Helper functions
export function getProductById(id: number): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductByCode(code: string): Product | undefined {
  return mockProducts.find((p) => p.code === code);
}

export function getActiveProducts(): Product[] {
  return mockProducts.filter((p) => p.is_active);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
