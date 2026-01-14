import type { Customer } from "@/types";
import { LEAD_STATUSES } from "./status";

/**
 * Mock Customers
 * Aligned with database schema: customers table
 * Updated to include code and logo_url
 */

export const mockCustomers: Customer[] = [
  // B2B EdTech - Manabie
  {
    id: 1,
    type: "LEAD",
    code: "LEAD-001",
    name: "Nguyễn Minh Tuấn",
    company_name: "Manabie Vietnam",
    email: "tuan.nguyen@manabie.com",
    phone: "+84-28-1234-5678",
    address: "Tầng 5, Tòa nhà Sài Gòn Centre, Quận 1, TP.HCM",
    source: "LinkedIn",
    logo_url: "/logos/manabie.png",
    owner_id: 1,
    status_id: 3, // QUOTED
    // B2B Fields
    website: "https://manabie.com",
    industry: "EdTech",
    linkedin_url: "https://linkedin.com/company/manabie",
    lead_note: "Vừa gọi vốn Series B $15M từ Softbank, đang mở rộng thị trường Đông Nam Á",
    competitors: "Fluentgo, ELSA Speak, Topica",
    // Sales Interaction Fields
    tags: ["VIP", "High Potential"],
    ref_code: "REF-2024-001",
    interaction_history: [
      {
        id: "ih-1",
        content: "Đã gọi điện tư vấn gói Enterprise, khách hàng quan tâm đến tính năng báo cáo",
        type: "CALL",
        created_at: "2026-01-10T10:30:00Z",
        created_by: "Jane Smith",
      },
      {
        id: "ih-2",
        content: "Gửi báo giá gói Enterprise - 50 users, $2000/tháng",
        type: "NOTE",
        created_at: "2026-01-08T14:00:00Z",
        created_by: "Jane Smith",
      },
    ],
    created_at: new Date("2025-12-15"),
    updated_at: new Date("2026-01-10"),
  },
  // B2B HealthTech - FitX
  {
    id: 2,
    type: "LEAD",
    code: "LEAD-002",
    name: "Trần Thị Mai",
    company_name: "FitX Vietnam",
    email: "mai.tran@fitx.vn",
    phone: "+84-24-2345-6789",
    address: "Tầng 12, Keangnam Landmark, Hà Nội",
    source: "Event",
    logo_url: "/logos/fitx.png",
    owner_id: 2,
    status_id: 2, // CONSULTING
    // B2B Fields
    website: "https://fitx.vn",
    industry: "HealthTech",
    linkedin_url: "https://linkedin.com/company/fitx-vietnam",
    lead_note: "Ra mắt app fitness mới tháng 12/2025, có 50K+ downloads trong tháng đầu",
    competitors: "Jio Health, Doctor Anywhere, Halodoc",
    // Sales Interaction Fields
    tags: ["Price Sensitive"],
    ref_code: "REF-2024-002",
    interaction_history: [
      {
        id: "ih-3",
        content: "Meeting tại văn phòng khách hàng, demo sản phẩm thành công",
        type: "MEETING",
        created_at: "2026-01-05T09:00:00Z",
        created_by: "John Doe",
      },
    ],
    created_at: new Date("2025-11-20"),
    updated_at: new Date("2026-01-08"),
  },
  // B2B FinTech - Timo
  {
    id: 3,
    type: "CUSTOMER",
    code: "CUS-001",
    name: "Lê Hoàng Anh",
    company_name: "Timo Digital Bank",
    email: "anh.le@timo.vn",
    phone: "+84-28-3456-7890",
    address: "Tầng 8, Vincom Center, Quận 1, TP.HCM",
    source: "Referral",
    logo_url: "/logos/timo.png",
    owner_id: 1,
    status_id: 5, // CLOSED_WON
    // B2B Fields
    website: "https://timo.vn",
    industry: "FinTech",
    linkedin_url: "https://linkedin.com/company/timo-digital-bank",
    lead_note: "Đã ký hợp đồng Enterprise, đang tích hợp API thanh toán",
    competitors: "MoMo, ZaloPay, VNPay",
    // Sales Interaction Fields
    tags: ["VIP"],
    ref_code: "REF-2024-003",
    interaction_history: [
      {
        id: "ih-4",
        content: "Ký hợp đồng thành công, giá trị $50,000/năm",
        type: "NOTE",
        created_at: "2026-01-12T16:00:00Z",
        created_by: "Jane Smith",
      },
    ],
    created_at: new Date("2025-06-15"),
    updated_at: new Date("2026-01-12"),
  },
  // B2B EdTech - ELSA Speak
  {
    id: 4,
    type: "LEAD",
    code: "LEAD-003",
    name: "Phạm Văn Đức",
    company_name: "ELSA Corp",
    email: "duc.pham@elsaspeak.com",
    phone: "+84-28-4567-8901",
    address: "Tầng 15, Bitexco Financial Tower, Quận 1, TP.HCM",
    source: "Website",
    logo_url: "/logos/elsa.png",
    owner_id: 3,
    status_id: 1, // NEW
    // B2B Fields
    website: "https://elsaspeak.com",
    industry: "EdTech",
    linkedin_url: "https://linkedin.com/company/elsa-speak",
    lead_note: "Có 30M+ users toàn cầu, đang tìm đối tác B2B cho thị trường doanh nghiệp VN",
    competitors: "Duolingo, Cake, Fluentgo",
    // Sales Interaction Fields
    tags: ["High Potential"],
    ref_code: "REF-2024-004",
    created_at: new Date("2026-01-05"),
    updated_at: new Date("2026-01-05"),
  },
  // Traditional Customer (no B2B fields)
  {
    id: 5,
    type: "CUSTOMER",
    code: "CUS-002",
    name: "Nguyễn Văn An",
    company_name: "Công ty TNHH TechCorp Việt Nam",
    email: "nguyen.van.an@techcorp.vn",
    phone: "+84-28-5678-9012",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    source: "Cold Call",
    logo_url: "/logos/techcorp.png",
    owner_id: 2,
    status_id: 6, // OLD_CUSTOMER
    // Sales Interaction Fields
    tags: ["Returning"],
    ref_code: "REF-2024-005",
    created_at: new Date("2025-09-20"),
    updated_at: new Date("2026-01-08"),
  },
  // B2B E-commerce
  {
    id: 6,
    type: "LEAD",
    code: "LEAD-004",
    name: "Vũ Thị Lan",
    company_name: "Shopee Vietnam",
    email: "lan.vu@shopee.vn",
    phone: "+84-28-6789-0123",
    address: "Tầng 28, Vietcombank Tower, Quận 1, TP.HCM",
    source: "Partner",
    logo_url: "/logos/shopee.png",
    owner_id: 1,
    status_id: 2, // CONSULTING
    // B2B Fields
    website: "https://shopee.vn",
    industry: "E-commerce",
    linkedin_url: "https://linkedin.com/company/shopee",
    lead_note: "Top 1 e-commerce platform VN, đang mở rộng Shopee Mall cho brands",
    competitors: "Lazada, Tiki, Sendo",
    // Sales Interaction Fields
    tags: ["VIP", "Enterprise"],
    ref_code: "REF-2024-006",
    created_at: new Date("2025-12-18"),
    updated_at: new Date("2025-12-28"),
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
