import type { Customer } from "@/types";
import { LEAD_STATUSES } from "./status";

/**
 * Mock Customers
 * Aligned with database schema: customers table
 * Updated to include code and logo_url
 */

export const mockCustomers: Customer[] = [
  {
    id: 1,
    type: "CUSTOMER",
    code: "CUS-001",
    name: "Nguyễn Văn An",
    company_name: "Công ty TNHH TechCorp Việt Nam",
    email: "nguyen.van.an@techcorp.vn",
    phone: "+84-28-1234-5678",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    source: "Website",
    logo_url: "/logos/techcorp.png",
    owner_id: 1, // John Doe
    status_id: 4, // CONVERTED
    created_at: new Date("2025-06-15"),
    updated_at: new Date("2026-01-10"),
  },
  {
    id: 2,
    type: "CUSTOMER",
    code: "CUS-002",
    name: "Trần Thị Bình",
    company_name: "StartupXYZ",
    email: "tran.thi.binh@startupxyz.io",
    phone: "+84-28-2345-6789",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    source: "Referral",
    logo_url: "/logos/startupxyz.png",
    owner_id: 2, // Jane Smith
    status_id: 4, // CONVERTED
    created_at: new Date("2025-09-20"),
    updated_at: new Date("2026-01-08"),
  },
  {
    id: 3,
    type: "LEAD",
    code: "LEAD-001",
    name: "Lê Hoàng Chính",
    company_name: "MegaCorp Ltd.",
    email: "le.hoang.chinh@megacorp.com.vn",
    phone: "+84-24-3456-7890",
    address: "789 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    source: "Event",
    logo_url: "/logos/megacorp.png",
    owner_id: 1, // John Doe
    status_id: 1, // NEW
    created_at: new Date("2026-01-05"),
    updated_at: new Date("2026-01-05"),
  },
  {
    id: 4,
    type: "CUSTOMER",
    code: "CUS-003",
    name: "Phạm Thị Dung",
    company_name: "FinanceHub Vietnam",
    email: "pham.thi.dung@financehub.vn",
    phone: "+84-28-4567-8901",
    address: "321 Võ Văn Tần, Quận 3, TP.HCM",
    source: "Cold Call",
    logo_url: "/logos/financehub.png",
    owner_id: 2, // Jane Smith
    status_id: 4, // CONVERTED
    created_at: new Date("2025-11-10"),
    updated_at: new Date("2026-01-03"),
  },
  {
    id: 5,
    type: "CUSTOMER",
    code: "CUS-004",
    name: "Hoàng Minh Em",
    company_name: "RetailMax Vietnam",
    email: "hoang.minh.em@retailmax.vn",
    phone: "+84-24-5678-9012",
    address: "654 Láng Hạ, Đống Đa, Hà Nội",
    source: "Partner",
    logo_url: "/logos/retailmax.png",
    owner_id: 1, // John Doe
    status_id: 4, // CONVERTED
    created_at: new Date("2025-03-22"),
    updated_at: new Date("2026-01-12"),
  },
  {
    id: 6,
    type: "LEAD",
    code: "LEAD-002",
    name: "Vũ Thị Phượng",
    company_name: "HealthCare+ Vietnam",
    email: "vu.thi.phuong@healthcareplus.vn",
    phone: "+84-28-6789-0123",
    address: "987 Pasteur, Quận 3, TP.HCM",
    source: "Facebook",
    logo_url: "/logos/healthcareplus.png",
    owner_id: 3, // Sarah Connor
    status_id: 2, // CONTACTED
    created_at: new Date("2025-12-18"),
    updated_at: new Date("2025-12-28"),
  },
  {
    id: 7,
    type: "CUSTOMER",
    code: "CUS-005",
    name: "Đỗ Văn Giang",
    company_name: "LogiTech Solutions VN",
    email: "do.van.giang@logitech.vn",
    phone: "+84-24-7890-1234",
    address: "159 Xã Đàn, Đống Đa, Hà Nội",
    source: "Google Ads",
    logo_url: "/logos/logitech.png",
    owner_id: 2, // Jane Smith
    status_id: 4, // CONVERTED
    created_at: new Date("2025-08-05"),
    updated_at: new Date("2025-12-15"),
  },
  {
    id: 8,
    type: "LEAD",
    code: "LEAD-003",
    name: "Bùi Thị Hoa",
    company_name: "EduLearn Academy",
    email: "bui.thi.hoa@edulearn.edu.vn",
    phone: "+84-28-8901-2345",
    address: "753 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    source: "Zalo",
    logo_url: "/logos/edulearn.png",
    owner_id: 1, // John Doe
    status_id: 3, // QUALIFIED
    created_at: new Date("2025-12-01"),
    updated_at: new Date("2026-01-11"),
  },
];

// Helper functions
export function getCustomerById(id: number): Customer | undefined {
  return mockCustomers.find((c) => c.id === id);
}

export function getCustomerByCode(code: string): Customer | undefined {
  return mockCustomers.find((c) => c.code === code);
}

export function getCustomersByType(type: "LEAD" | "CUSTOMER"): Customer[] {
  return mockCustomers.filter((c) => c.type === type);
}

export function getCustomersByOwner(ownerId: number): Customer[] {
  return mockCustomers.filter((c) => c.owner_id === ownerId);
}
