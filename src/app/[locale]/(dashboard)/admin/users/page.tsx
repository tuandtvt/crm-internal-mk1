"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Filter,
  UserPlus,
  Mail,
  Shield,
  User,
  MoreHorizontal,
  Loader2,
  X,
} from "lucide-react";

// Role configuration
const ROLES = {
  admin: { labelKey: "admin", bgColor: "bg-rose-100", textColor: "text-rose-700" },
  manager: { labelKey: "manager", bgColor: "bg-blue-100", textColor: "text-blue-700" },
  sales: { labelKey: "sales", bgColor: "bg-slate-100", textColor: "text-slate-700" },
  support: { labelKey: "support", bgColor: "bg-purple-100", textColor: "text-purple-700" },
} as const;

// Departments
const DEPARTMENTS = ["Sales", "Marketing", "Engineering", "Support", "Finance", "HR"];

// Mock users data
const mockUsers = [
  { id: "1", name: "John Doe", email: "john.doe@company.com", role: "admin" as const, department: "Engineering", active: true },
  { id: "2", name: "Jane Smith", email: "jane.smith@company.com", role: "manager" as const, department: "Sales", active: true },
  { id: "3", name: "Sarah Connor", email: "sarah.connor@company.com", role: "sales" as const, department: "Sales", active: true },
  { id: "4", name: "Mike Johnson", email: "mike.j@company.com", role: "sales" as const, department: "Sales", active: false },
  { id: "5", name: "Emily Davis", email: "emily.d@company.com", role: "support" as const, department: "Support", active: true },
  { id: "6", name: "Robert Wilson", email: "r.wilson@company.com", role: "manager" as const, department: "Marketing", active: true },
  { id: "7", name: "Lisa Brown", email: "lisa.b@company.com", role: "sales" as const, department: "Sales", active: true },
  { id: "8", name: "David Lee", email: "david.lee@company.com", role: "admin" as const, department: "Engineering", active: true },
];

// Enhanced Side Sheet Component for Creating Users
function CreateUserSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.createSheet");
  const commonT = useTranslations("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      department: "",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <div className="px-6 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100">
              <UserPlus className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t("title")}</h2>
              <p className="text-sm text-slate-500">{t("description")}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                {t("personalInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                {t("accountDetails")}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@company.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                {t("roleDept")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">{commonT("role")}</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder={t("selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{commonT("roles.admin")}</SelectItem>
                      <SelectItem value="manager">{commonT("roles.manager")}</SelectItem>
                      <SelectItem value="sales">{commonT("roles.sales")}</SelectItem>
                      <SelectItem value="support">{commonT("roles.support")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{commonT("department")}</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder={t("selectDept")} />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> {t("note")}
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {commonT("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("title")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminUsersPage() {
  const t = useTranslations("admin");
  const ct = useTranslations("common");
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user) =>
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const hasActiveFilters = searchTerm || roleFilter !== "all";

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("users")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("usersDescription")}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsSheetOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("createUser")}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{t("totalUsers")}</p>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{t("active")}</p>
            <p className="text-2xl font-bold text-emerald-600">
              {users.filter((u) => u.active).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{t("admins")}</p>
            <p className="text-2xl font-bold text-rose-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{t("inactive")}</p>
            <p className="text-2xl font-bold text-slate-400">
              {users.filter((u) => !u.active).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-end">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-2 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4 mr-1" />
                {ct("clear")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[700px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700">{t("table.user")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.role")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.department")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.status")}</TableHead>
                    <TableHead className="font-semibold text-slate-700 w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleConfig = ROLES[user.role];
                    return (
                      <TableRow key={user.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className={`text-sm font-medium ${
                                user.active ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"
                              }`}>
                                {user.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className={`font-medium ${user.active ? "text-slate-900" : "text-slate-400"}`}>
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${roleConfig.bgColor} ${roleConfig.textColor} hover:${roleConfig.bgColor}`}>
                            {ct(`roles.${roleConfig.labelKey}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{user.department}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.active}
                              onCheckedChange={() => toggleUserStatus(user.id)}
                            />
                            <span className={`text-xs ${user.active ? "text-emerald-600" : "text-slate-400"}`}>
                              {user.active ? t("active") : t("inactive")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateUserSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
