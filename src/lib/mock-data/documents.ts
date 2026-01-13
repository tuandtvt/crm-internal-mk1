import type { Document } from "@/types";

/**
 * Mock Documents with Polymorphic Relationships
 * Aligned with database schema: documents table
 */

export const mockDocuments: Document[] = [
  {
    id: 1,
    name: "Hợp đồng Enterprise License - TechCorp.pdf",
    file_path: "/documents/contracts/techcorp-enterprise-2026.pdf",
    file_type: "application/pdf",
    size: 2458624, // ~2.4 MB
    owner_id: 1,
    related_type: "CONTRACT",
    related_id: 1,
    created_by: 1,
    created_at: new Date("2026-01-10"),
    updated_at: new Date("2026-01-10"),
  },
  {
    id: 2,
    name: "Báo giá Professional Package - StartupXYZ.xlsx",
    file_path: "/documents/quotes/startupxyz-professional-quote.xlsx",
    file_type: "application/vnd.ms-excel",
    size: 45672,
    owner_id: 2,
    related_type: "CUSTOMER",
    related_id: 2,
    created_by: 2,
    created_at: new Date("2026-01-12"),
    updated_at: new Date("2026-01-12"),
  },
  {
    id: 3,
    name: "Presentation - CRM Features.pptx",
    file_path: "/documents/presentations/crm-features-demo.pptx",
    file_type: "application/vnd.ms-powerpoint",
    size: 8945231, // ~8.9 MB
    owner_id: 1,
    related_type: "CUSTOMER",
    related_id: 3, // MegaCorp
    created_by: 1,
    created_at: new Date("2026-01-13"),
   updated_at: new Date("2026-01-13"),
  },
  {
    id: 4,
    name: "Ticket #t4 - Dashboard Error Screenshot.png",
    file_path: "/documents/tickets/ticket-t4-screenshot.png",
    file_type: "image/png",
    size: 245789,
    owner_id: 3,
    related_type: "TICKET",
    related_id: 4,
    created_by: 3,
    created_at: new Date("2026-01-13"),
    updated_at: new Date("2026-01-13"),
  },
  {
    id: 5,
    name: "SOW - FinanceHub Implementation.docx",
    file_path: "/documents/sow/financehub-implementation.docx",
    file_type: "application/msword",
    size: 123456,
    owner_id: 2,
    related_type: "CONTRACT",
    related_id: 2,
    created_by: 2,
    created_at: new Date("2026-01-11"),
    updated_at: new Date("2026-01-11"),
  },
  {
    id: 6,
    name: "Logo - HealthCare+.svg",
    file_path: "/documents/logos/healthcareplus-logo.svg",
    file_type: "image/svg+xml",
    size: 12456,
    owner_id: 3,
    related_type: "CUSTOMER",
    related_id: 6,
    created_by: 3,
    created_at: new Date("2026-01-09"),
    updated_at: new Date("2026-01-09"),
  },
];

// Helper functions
export function getDocumentById(id: number): Document | undefined {
  return mockDocuments.find((d) => d.id === id);
}

export function getDocumentsByRelatedEntity(type: string, id: number): Document[] {
  return mockDocuments.filter((d) => d.related_type === type && d.related_id === id);
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  }
  return bytes + " B";
}

export function getFileTypeIcon(fileType: string): string {
  if (fileType.includes("pdf")) return "📄";
  if (fileType.includes("word") || fileType.includes("document")) return "📝";
  if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊";
  if (fileType.includes("powerpoint") || fileType.includes("presentation")) return "📽️";
  if (fileType.includes("image")) return "🖼️";
  if (fileType.includes("video")) return "🎥";
  return "📁";
}
