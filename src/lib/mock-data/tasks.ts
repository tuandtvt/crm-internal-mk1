import type { Task } from "@/types";
import { TASK_STATUSES } from "./status";

/**
 * Mock Tasks with Polymorphic Relationships
 * Aligned with database schema: tasks table
 * Includes related_type and related_id for Customer/Deal/Contract links
 */

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Follow-up call với TechCorp",
    description: "Gọi điện xác nhận yêu cầu về Enterprise License",
    type: "CALL",
    priority: 2, // MEDIUM
    estimate: 0.5,
    due_date: new Date("2026-01-15T10:00:00"),
    status_id: 31, // TODO
    assignee_id: 1, // John Doe
    related_type: "CUSTOMER",
    related_id: 1, // TechCorp
    created_by: 1,
    created_at: new Date("2026-01-13"),
    updated_at: new Date("2026-01-13"),
  },
  {
    id: 2,
    title: "Chuẩn bị proposal cho StartupXYZ",
    description: "Soạn tài liệu đề xuất gói Professional Package",
    type: "TODO",
    priority: 3, // HIGH
    estimate: 4,
    due_date: new Date("2026-01-16T17:00:00"),
    status_id: 32, // IN_PROGRESS
    assignee_id: 2, // Jane Smith
    related_type: "DEAL",
    related_id: 2, // Professional Package deal
    created_by: 2,
    created_at: new Date("2026-01-12"),
    updated_at: new Date("2026-01-13"),
  },
  {
    id: 3,
    title: "Họp kick-off dự án FinanceHub",
    description: "Meeting đầu tiên với khách hàng để bàn về triển khai",
    type: "MEETING",
    priority: 3, // HIGH
    estimate: 2,
    due_date: new Date("2026-01-14T14:00:00"),
    status_id: 33, // COMPLETED
    assignee_id: 2,
    related_type: "DEAL",
    related_id: 4,
    created_by: 2,
    created_at: new Date("2026-01-10"),
    updated_at: new Date("2026-01-14"),
  },
  {
    id: 4,
    title: "Gửi email giới thiệu sản phẩm",
    description: "Gửi catalogue và bảng giá cho MegaCorp",
    type: "EMAIL",
    priority: 1, // LOW
    estimate: 0.5,
    due_date: new Date("2026-01-17T09:00:00"),
    status_id: 31, // TODO
    assignee_id: 1,
    related_type: "CUSTOMER",
    related_id: 3, // MegaCorp (LEAD)
    created_by: 1,
    created_at: new Date("2026-01-13"),
    updated_at: new Date("2026-01-13"),
  },
  {
    id: 5,
    title: "Kiểm tra tiến độ triển khai RetailMax",
    description: "Review implementation progress và giải quyết vấn đề",
    type: "MEETING",
    priority: 2,
    estimate: 1.5,
    due_date: new Date("2026-01-18T15:00:00"),
    status_id: 31, // TODO
    assignee_id: 1,
    related_type: "CONTRACT",
    related_id: 1, // Mock contract
    created_by: 1,
    created_at: new Date("2026-01-13"),
    updated_at: new Date("2026-01-13"),
  },
  {
    id: 6,
    title: "Demo sản phẩm cho HealthCare+",
    description: "Product demonstration và Q&A session",
    type: "MEETING",
    priority: 2,
    estimate: 1,
    due_date: new Date("2026-01-20T10:30:00"),
    status_id: 31, // TODO
    assignee_id: 3, // Sarah Connor
    related_type: "CUSTOMER",
    related_id: 6, // HealthCare+ (LEAD)
    created_by: 3,
    created_at: new Date("2026-01-13"),
    updated_at: new Date("2026-01-13"),
  },
  {
    id: 7,
    title: "Update thông tin deal LogiTech",
    description: "Cập nhật probability và expected close date",
    type: "TODO",
    priority: 1,
    estimate: 0.25,
    due_date: new Date("2026-01-16T12:00:00"),
    status_id: 33, // COMPLETED
    assignee_id: 2,
    related_type: "DEAL",
    related_id: 6,
    created_by: 2,
    created_at: new Date("2026-01-12"),
    updated_at: new Date("2026-01-15"),
  },
];

// Helper functions
export function getTaskById(id: number): Task | undefined {
  return mockTasks.find((t) => t.id === id);
}

export function getTasksByAssignee(assigneeId: number): Task[] {
  return mockTasks.filter((t) => t.assignee_id === assigneeId);
}

export function getTasksByRelatedEntity(type: string, id: number): Task[] {
  return mockTasks.filter((t) => t.related_type === type && t.related_id === id);
}

export function getPriorityLabel(priority: 1 | 2 | 3): string {
  const labels = {
    1: "Thấp",
    2: "Trung bình",
    3: "Cao",
  };
  return labels[priority];
}

export function getPriorityColor(priority: 1 | 2 | 3): string {
  const colors = {
    1: "bg-slate-100 text-slate-700",
    2: "bg-blue-100 text-blue-700",
    3: "bg-red-100 text-red-700",
  };
  return colors[priority];
}

export function getTaskTypeColor(type: Task["type"]): string {
  const colors = {
    CALL: "bg-green-100 text-green-700",
    EMAIL: "bg-blue-100 text-blue-700",
    MEETING: "bg-purple-100 text-purple-700",
    TODO: "bg-slate-100 text-slate-700",
  };
  return colors[type];
}
