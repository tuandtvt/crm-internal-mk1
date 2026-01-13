export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "SALE";
  department: string;
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@mk1.com",
    name: "System Admin",
    role: "ADMIN",
    department: "Board",
    avatar: "/avatars/admin.png",
  },
  {
    id: "2",
    email: "manager@mk1.com",
    name: "Sarah Manager",
    role: "MANAGER",
    department: "Sales",
    avatar: "/avatars/manager.png",
  },
  {
    id: "3",
    email: "sale@mk1.com",
    name: "John Sales",
    role: "SALE",
    department: "Sales",
    avatar: "/avatars/sale.png",
  },
];
