import type { Status } from "@/types";

/**
 * Master Status List
 * Aligned with database schema: status table
 * Contains statuses for all entity types: LEAD, DEAL, CONTRACT, TASK, TICKET
 */

// LEAD Statuses
export const LEAD_STATUSES: Status[] = [
  {
    id: 1,
    entity_type: "LEAD",
    code: "NEW",
    name: "Mới",
    order_index: 1,
    is_final: false,
    is_active: true,
  },
  {
    id: 2,
    entity_type: "LEAD",
    code: "CONTACTED",
    name: "Đã liên hệ",
    order_index: 2,
    is_final: false,
    is_active: true,
  },
  {
    id: 3,
    entity_type: "LEAD",
    code: "QUALIFIED",
    name: "Đã đủ điều kiện",
    order_index: 3,
    is_final: false,
    is_active: true,
  },
  {
    id: 4,
    entity_type: "LEAD",
    code: "CONVERTED",
    name: "Đã chuyển đổi",
    order_index: 4,
    is_final: true,
    is_active: true,
  },
  {
    id: 5,
    entity_type: "LEAD",
    code: "LOST",
    name: "Mất khách",
    order_index: 5,
    is_final: true,
    is_active: true,
  },
];

// DEAL Statuses
export const DEAL_STATUSES: Status[] = [
  {
    id: 11,
    entity_type: "DEAL",
    code: "NEW",
    name: "Mới tạo",
    order_index: 1,
    is_final: false,
    is_active: true,
  },
  {
    id: 12,
    entity_type: "DEAL",
    code: "PROPOSAL",
    name: "Đề xuất",
    order_index: 2,
    is_final: false,
    is_active: true,
  },
  {
    id: 13,
    entity_type: "DEAL",
    code: "NEGOTIATION",
    name: "Đàm phán",
    order_index: 3,
    is_final: false,
    is_active: true,
  },
  {
    id: 14,
    entity_type: "DEAL",
    code: "WON",
    name: "Thắng",
    order_index: 4,
    is_final: true,
    is_active: true,
  },
  {
    id: 15,
    entity_type: "DEAL",
    code: "LOST",
    name: "Thua",
    order_index: 5,
    is_final: true,
    is_active: true,
  },
];

// CONTRACT Statuses
export const CONTRACT_STATUSES: Status[] = [
  {
    id: 21,
    entity_type: "CONTRACT",
    code: "DRAFT",
    name: "Nháp",
    order_index: 1,
    is_final: false,
    is_active: true,
  },
  {
    id: 22,
    entity_type: "CONTRACT",
    code: "SENT",
    name: "Đã gửi",
    order_index: 2,
    is_final: false,
    is_active: true,
  },
  {
    id: 23,
    entity_type: "CONTRACT",
    code: "SIGNED",
    name: "Đã ký",
    order_index: 3,
    is_final: false,
    is_active: true,
  },
  {
    id: 24,
    entity_type: "CONTRACT",
    code: "ACTIVE",
    name: "Đang hoạt động",
    order_index: 4,
    is_final: false,
    is_active: true,
  },
  {
    id: 25,
    entity_type: "CONTRACT",
    code: "EXPIRED",
    name: "Hết hạn",
    order_index: 5,
    is_final: true,
    is_active: true,
  },
  {
    id: 26,
    entity_type: "CONTRACT",
    code: "CANCELLED",
    name: "Đã hủy",
    order_index: 6,
    is_final: true,
    is_active: true,
  },
];

// TASK Statuses
export const TASK_STATUSES: Status[] = [
  {
    id: 31,
    entity_type: "TASK",
    code: "TODO",
    name: "Cần làm",
    order_index: 1,
    is_final: false,
    is_active: true,
  },
  {
    id: 32,
    entity_type: "TASK",
    code: "IN_PROGRESS",
    name: "Đang thực hiện",
    order_index: 2,
    is_final: false,
    is_active: true,
  },
  {
    id: 33,
    entity_type: "TASK",
    code: "COMPLETED",
    name: "Hoàn thành",
    order_index: 3,
    is_final: true,
    is_active: true,
  },
  {
    id: 34,
    entity_type: "TASK",
    code: "CANCELLED",
    name: "Đã hủy",
    order_index: 4,
    is_final: true,
    is_active: true,
  },
];

// TICKET Statuses
export const TICKET_STATUSES: Status[] = [
  {
    id: 41,
    entity_type: "TICKET",
    code: "NEW",
    name: "Mới",
    order_index: 1,
    is_final: false,
    is_active: true,
  },
  {
    id: 42,
    entity_type: "TICKET",
    code: "OPEN",
    name: "Đang mở",
    order_index: 2,
    is_final: false,
    is_active: true,
  },
  {
    id: 43,
    entity_type: "TICKET",
    code: "PENDING",
    name: "Đang chờ",
    order_index: 3,
    is_final: false,
    is_active: true,
  },
  {
    id: 44,
    entity_type: "TICKET",
    code: "RESOLVED",
    name: "Đã giải quyết",
    order_index: 4,
    is_final: false,
    is_active: true,
  },
  {
    id: 45,
    entity_type: "TICKET",
    code: "CLOSED",
    name: "Đã đóng",
    order_index: 5,
    is_final: true,
    is_active: true,
  },
];

// Combined list of all statuses
export const ALL_STATUSES: Status[] = [
  ...LEAD_STATUSES,
  ...DEAL_STATUSES,
  ...CONTRACT_STATUSES,
  ...TASK_STATUSES,
  ...TICKET_STATUSES,
];

// Helper functions
export function getStatusesByEntityType(entityType: string): Status[] {
  return ALL_STATUSES.filter((s) => s.entity_type === entityType);
}

export function getStatusByCode(entityType: string, code: string): Status | undefined {
  return ALL_STATUSES.find((s) => s.entity_type === entityType && s.code === code);
}

export function getStatusById(id: number): Status | undefined {
  return ALL_STATUSES.find((s) => s.id === id);
}

// Status color helpers (for UI)
export function getStatusColor(entityType: string, code: string): string {
  const colorMap: Record<string, Record<string, string>> = {
    LEAD: {
      NEW: "bg-blue-100 text-blue-700",
      CONTACTED: "bg-indigo-100 text-indigo-700",
      QUALIFIED: "bg-purple-100 text-purple-700",
      CONVERTED: "bg-emerald-100 text-emerald-700",
      LOST: "bg-slate-100 text-slate-700",
    },
    DEAL: {
      NEW: "bg-slate-100 text-slate-700",
      PROPOSAL: "bg-purple-100 text-purple-700",
      NEGOTIATION: "bg-amber-100 text-amber-700",
      WON: "bg-emerald-100 text-emerald-700",
      LOST: "bg-rose-100 text-rose-700",
    },
    CONTRACT: {
      DRAFT: "bg-slate-100 text-slate-700",
      SENT: "bg-blue-100 text-blue-700",
      SIGNED: "bg-indigo-100 text-indigo-700",
      ACTIVE: "bg-emerald-100 text-emerald-700",
      EXPIRED: "bg-orange-100 text-orange-700",
      CANCELLED: "bg-rose-100 text-rose-700",
    },
    TASK: {
      TODO: "bg-slate-100 text-slate-700",
      IN_PROGRESS: "bg-amber-100 text-amber-700",
      COMPLETED: "bg-emerald-100 text-emerald-700",
      CANCELLED: "bg-rose-100 text-rose-700",
    },
    TICKET: {
      NEW: "bg-blue-100 text-blue-700",
      OPEN: "bg-amber-100 text-amber-700",
      PENDING: "bg-purple-100 text-purple-700",
      RESOLVED: "bg-emerald-100 text-emerald-700",
      CLOSED: "bg-slate-100 text-slate-700",
    },
  };

  return colorMap[entityType]?.[code] || "bg-gray-100 text-gray-700";
}
