// ==========================================
// BASE TYPES
// ==========================================

/** Base entity with audit fields (matches database common fields) */
export interface BaseEntity {
  created_by?: number;
  created_at?: Date;
  updated_by?: number;
  updated_at?: Date;
}

// ==========================================
// STATUS SYSTEM
// ==========================================

export type EntityType = "LEAD" | "DEAL" | "CONTRACT" | "TASK" | "TICKET";

export interface Status extends BaseEntity {
  id: number;
  entity_type: EntityType;
  code: string;
  name: string;
  order_index: number;
  is_final: boolean;
  is_active: boolean;
}

export interface StatusHistory {
  id: number;
  entity_type: EntityType;
  entity_id: number;
  from_status_id: number;
  to_status_id: number;
  changed_by: number;
  changed_at: Date;
}

// ==========================================
// USER MANAGEMENT
// ==========================================

export type UserStatus = "active" | "block" | "deleted";

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  avatar_url?: string;
  department_id?: number;
  // Relationships
  department?: Department;
  roles?: Role[];
}

export interface Role extends BaseEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  // Relationships
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  module: string;
  code: string;
  name: string;
}

export interface UserRole {
  user_id: number;
  role_id: number;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface Department {
  id: number;
  name: string;
  parent_id?: number;
  is_active: boolean;
  // Relationships
  parent?: Department;
  children?: Department[];
}

// ==========================================
// CUSTOMERS & LEADS
// ==========================================

export type CustomerType = "LEAD" | "CUSTOMER";

export interface Customer extends BaseEntity {
  id: number;
  type: CustomerType;
  code: string;
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  source?: string; // Facebook, Google, Zalo, etc.
  logo_url?: string;
  owner_id?: number;
  status_id?: number;
  // B2B Tracking Fields (IS Team Requirements)
  website?: string; // Company website URL (e.g., "fitx.co.jp")
  industry?: string; // Industry category (EdTech, HealthTech, FinTech, etc.)
  linkedin_url?: string; // LinkedIn or social profile URL
  lead_note?: string; // Lead status/intelligence (e.g., "Just raised Series B", "Released new app")
  competitors?: string; // Similar projects/competitors (e.g., "Giống Fluentgo")
  // Relationships
  owner?: User;
  status?: Status;
  contacts?: Contact[];
  deals?: Deal[];
  contracts?: Contract[];
}

export interface Contact {
  id: number;
  customer_id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  // Relationships
  customer?: Customer;
}

// ==========================================
// PRODUCTS
// ==========================================

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  unit_price: number;
  is_active: boolean;
}

// ==========================================
// DEALS
// ==========================================

export interface Deal extends BaseEntity {
  id: number;
  name: string;
  discount_rate: number;
  total_amount: number;
  probability: number;
  expected_close_date?: Date;
  status_id?: number;
  owner_id?: number;
  customer_id?: number;
  // Relationships
  status?: Status;
  owner?: User;
  customer?: Customer;
  deal_products: DealProduct[]; // REQUIRED relationship
}

export interface DealProduct {
  deal_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  // Relationships
  product?: Product;
  // Calculated
  line_total?: number; // quantity * unit_price
}

// ==========================================
// CONTRACTS
// ==========================================

export interface Contract extends BaseEntity {
  id: number;
  code: string;
  name: string;
  discount_rate: number;
  total_amount: number;
  signed_date?: Date;
  start_date?: Date;
  end_date?: Date;
  status_id?: number;
  owner_id?: number;
  customer_id?: number;
  deal_id?: number;
  // Relationships
  status?: Status;
  owner?: User;
  customer?: Customer;
  deal?: Deal;
  contract_products: ContractProduct[]; // REQUIRED relationship
}

export interface ContractProduct {
  contract_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  // Relationships
  product?: Product;
  // Calculated
  line_total?: number; // quantity * unit_price
}

// ==========================================
// TASKS
// ==========================================

export type TaskType = "CALL" | "EMAIL" | "MEETING" | "TODO";
export type TaskPriority = 1 | 2 | 3; // 1=LOW, 2=MEDIUM, 3=HIGH
export type TaskRelatedType = "CUSTOMER" | "DEAL" | "CONTRACT";

export interface Task extends BaseEntity {
  id: number;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  estimate?: number;
  due_date?: Date;
  status_id?: number;
  assignee_id?: number;
  related_type?: TaskRelatedType;
  related_id?: number;
  // Relationships
  status?: Status;
  assignee?: User;
}

// ==========================================
// TICKETS (SUPPORT)
// ==========================================

export type TicketPriority = 1 | 2 | 3; // 1=LOW, 2=MEDIUM, 3=HIGH

export interface Ticket extends BaseEntity {
  id: number;
  code: string;
  customer_id?: number;
  subject: string;
  priority: TicketPriority;
  status_id?: number;
  assignee_id?: number;
  // Relationships
  status?: Status;
  customer?: Customer;
  assignee?: User;
  comments?: TicketComment[];
}

export interface TicketComment extends BaseEntity {
  id: number;
  ticket_id: number;
  content: string;
  // Relationships
  ticket?: Ticket;
}

// ==========================================
// DOCUMENTS
// ==========================================

export type DocumentRelatedType = "CUSTOMER" | "CONTRACT" | "TICKET";

export interface Document extends BaseEntity {
  id: number;
  name: string;
  file_path: string;
  file_type: string;
  size: number;
  owner_id?: number;
  related_type?: DocumentRelatedType;
  related_id?: number;
  // Relationships
  owner?: User;
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export type NotificationType = "SYSTEM" | "TASK" | "TICKET";
export type NotificationRelatedType = "CUSTOMER" | "CONTRACT" | "TICKET";

export interface Notification extends BaseEntity {
  id: number;
  user_id: number;
  title: string;
  content: string;
  type: NotificationType;
  related_type?: NotificationRelatedType;
  related_id?: number;
  is_read: boolean;
  // Relationships
  user?: User;
}

// ==========================================
// AUDIT LOG
// ==========================================

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export interface AuditLog {
  id: number;
  entity_type: string;
  entity_id: number;
  action: AuditAction;
  old_value?: any; // JSON
  new_value?: any; // JSON;
  created_by?: number;
  created_at?: Date;
}

// ==========================================
// INTEGRATIONS
// ==========================================

export type IntegrationType = "FACEBOOK" | "GA" | "EMAIL" | "LABEL" | "NOTIFICATION";

export interface Integration {
  id: number;
  type: IntegrationType;
  name: string;
  is_active: boolean;
}

export interface IntegrationConfig {
  integration_id: number;
  config_key: string;
  config_value: string;
}

// ==========================================
// SYSTEM SETTINGS
// ==========================================

export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  description?: string;
}

// ==========================================
// KNOWLEDGE BASE
// ==========================================

export interface KBCategory {
  id: number;
  name: string;
  parent_id?: number;
  // Relationships
  parent?: KBCategory;
  children?: KBCategory[];
  articles?: KBArticle[];
}

export interface KBArticle extends BaseEntity {
  id: number;
  category_id: number;
  title: string;
  content: string;
  is_public: boolean;
  // Relationships
  category?: KBCategory;
}

// ==========================================
// LEGACY TYPES (for backwards compatibility)
// ==========================================

/** @deprecated Use Customer instead */
export type { Customer as Lead };

/** @deprecated Use TaskPriority instead */
export type Priority = "low" | "medium" | "high";

/** @deprecated Use Status.code instead */
export type PipelineStage = "new" | "contacted" | "proposal" | "negotiation" | "won" | "lost";

/** Navigation types */
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  children?: NavItem[];
}
