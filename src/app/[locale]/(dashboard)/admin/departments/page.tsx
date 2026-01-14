"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations, useLocale } from "next-intl";
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
  Building2,
  Users,
  Calendar,
  Loader2,
  MoreHorizontal,
  X,
} from "lucide-react";

// Mock managers data
const MANAGERS = [
  { id: "1", name: "John Doe", email: "john.doe@company.com" },
  { id: "2", name: "Jane Smith", email: "jane.smith@company.com" },
  { id: "6", name: "Robert Wilson", email: "r.wilson@company.com" },
  { id: "8", name: "David Lee", email: "david.lee@company.com" },
];

// Mock departments data
const mockDepartments = [
  { id: "1", name: "Sales", managerId: "2", managerName: "Jane Smith", memberCount: 12, createdAt: new Date("2024-01-15"), description: "Sales and business development team" },
  { id: "2", name: "Marketing", managerId: "6", managerName: "Robert Wilson", memberCount: 8, createdAt: new Date("2024-01-15"), description: "Marketing and brand management" },
  { id: "3", name: "Engineering", managerId: "1", managerName: "John Doe", memberCount: 25, createdAt: new Date("2024-01-15"), description: "Product development and engineering" },
  { id: "4", name: "Support", managerId: "8", managerName: "David Lee", memberCount: 15, createdAt: new Date("2024-02-01"), description: "Customer support and success" },
  { id: "5", name: "Finance", managerId: null, managerName: null, memberCount: 6, createdAt: new Date("2024-03-10"), description: "Financial operations and accounting" },
  { id: "6", name: "HR", managerId: null, managerName: null, memberCount: 4, createdAt: new Date("2024-03-10"), description: "Human resources and talent management" },
];

function CreateDepartmentSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.departmentSheet");
  const commonT = useTranslations("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    description: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({ name: "", manager: "", description: "" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <div className="px-6 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t("title") || commonT("add")}</h2>
              <p className="text-sm text-slate-500">{t("description")}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" />
                {commonT("details")}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{commonT("department")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">{commonT("role")}</Label>
                  <Select 
                    value={formData.manager} 
                    onValueChange={(value) => setFormData({ ...formData, manager: value })}
                  >
                    <SelectTrigger id="manager">
                      <SelectValue placeholder={commonT("all")} />
                    </SelectTrigger>
                    <SelectContent>
                      {MANAGERS.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          <div className="flex items-center gap-2">
                            <span>{manager.name}</span>
                            <span className="text-xs text-slate-400">({manager.email})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{commonT("details")}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="..."
                    rows={4}
                  />
                </div>
              </div>
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
                {commonT("loading")}
              </>
            ) : (
              commonT("create")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function DepartmentsPage() {
  const t = useTranslations("admin");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredDepartments = mockDepartments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const totalMembers = mockDepartments.reduce((sum, d) => sum + d.memberCount, 0);

  function formatDate(date: Date) {
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("departmentsTitle")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("departmentsDescription")}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsSheetOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          {commonT("add")}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-blue-500">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{commonT("department")}</p>
            <p className="text-2xl font-bold text-slate-900">{mockDepartments.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-indigo-500">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{commonT("team")}</p>
            <p className="text-2xl font-bold text-indigo-600">{totalMembers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <p className="text-sm text-slate-500">
              {filteredDepartments.length} {commonT("department").toLowerCase()}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[700px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700">{commonT("department")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{commonT("role")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{commonT("team")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{commonT("details")}</TableHead>
                    <TableHead className="font-semibold text-slate-700 w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((dept) => (
                    <TableRow key={dept.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{dept.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {dept.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dept.managerName ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                                {dept.managerName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-700">{dept.managerName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">---</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                          <Users className="h-3 w-3 mr-1" />
                          {dept.memberCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(dept.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateDepartmentSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
