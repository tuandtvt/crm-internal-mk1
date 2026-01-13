import type { User, Department } from "@/types";

/**
 * Mock Departments
 * Aligned with database schema: departments table
 */

export const mockDepartments: Department[] = [
  {
    id: 1,
    name: "Ban Giám Đốc",
    parent_id: undefined,
    is_active: true,
  },
  {
    id: 2,
    name: "Phòng Kinh Doanh",
    parent_id: undefined,
    is_active: true,
  },
  {
    id: 3,
    name: "Phòng Marketing",
    parent_id: undefined,
    is_active: true,
  },
  {
    id: 4,
    name: "Phòng Hỗ Trợ Khách Hàng",
    parent_id: undefined,
    is_active: true,
  },
  {
    id: 5,
    name: "Phòng Kỹ Thuật",
    parent_id: undefined,
    is_active: true,
  },
  {
    id: 6,
    name: "Phòng Nhân Sự",
    parent_id: undefined,
    is_active: true,
  },
];

/**
 * Mock Users
 * Aligned with database schema: users table
 * Updated to include department_id
 */

export const mockUsers: User[] = [
  {
    id: 1,
    username: "john.doe",
    password: "hashed_password_1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+84-123-456-789",
    status: "active",
    avatar_url: "/avatars/john.jpg",
    department_id: 2, // Sales
  },
  {
    id: 2,
    username: "jane.smith",
    password: "hashed_password_2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    phone: "+84-123-456-790",
    status: "active",
    avatar_url: "/avatars/jane.jpg",
    department_id: 2, // Sales
  },
  {
    id: 3,
    username: "sarah.connor",
    password: "hashed_password_3",
    name: "Sarah Connor",
    email: "sarah.connor@company.com",
    phone: "+84-123-456-791",
    status: "active",
    avatar_url: "/avatars/sarah.jpg",
    department_id: 4, // Support
  },
  {
    id: 4,
    username: "mike.chen",
    password: "hashed_password_4",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    phone: "+84-123-456-792",
    status: "active",
    avatar_url: "/avatars/mike.jpg",
    department_id: 3, // Marketing
  },
  {
    id: 5,
    username: "lisa.wong",
    password: "hashed_password_5",
    name: "Lisa Wong",
    email: "lisa.wong@company.com",
    phone: "+84-123-456-793",
    status: "active",
    avatar_url: "/avatars/lisa.jpg",
    department_id: 5, // Engineering
  },
  {
    id: 6,
    username: "david.miller",
    password: "hashed_password_6",
    name: "David Miller",
    email: "david.miller@company.com",
    phone: "+84-123-456-794",
    status: "active",
    avatar_url: "/avatars/david.jpg",
    department_id: 1, // Management
  },
  {
    id: 7,
    username: "emily.davis",
    password: "hashed_password_7",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "+84-123-456-795",
    status: "active",
    department_id: 6, // HR
  },
  {
    id: 8,
    username: "robert.johnson",
    password: "hashed_password_8",
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    phone: "+84-123-456-796",
    status: "active",
    department_id: 2, // Sales
  },
];

// Helper functions
export function getUserById(id: number): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getUsersByDepartment(departmentId: number): User[] {
  return mockUsers.filter((u) => u.department_id === departmentId);
}

export function getDepartmentById(id: number): Department | undefined {
  return mockDepartments.find((d) => d.id === id);
}

export function getActiveDepartments(): Department[] {
  return mockDepartments.filter((d) => d.is_active);
}
