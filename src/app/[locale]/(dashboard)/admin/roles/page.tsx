"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Shield,
  Users,
  Loader2,
  Edit,
  Crown,
  Briefcase,
  HeadphonesIcon,
  X,
} from "lucide-react";

// Permission modules configuration
const PERMISSION_MODULES = [
  { id: "customers", permissions: ["read", "create", "update", "delete"] },
  { id: "deals", permissions: ["read", "create", "update", "delete"] },
  { id: "contracts", permissions: ["read", "create", "update", "delete"] },
  { id: "pipeline", permissions: ["read", "manage"] },
  { id: "reports", permissions: ["read", "export"] },
  { id: "users", permissions: ["read", "create", "update", "delete"] },
  { id: "settings", permissions: ["read", "update"] },
];

// Mock roles data
const mockRoles = [
  { 
    id: "1", 
    name: "Administrator", 
    description: "Full system access with all permissions. Can manage users, settings, and all data.",
    userCount: 2,
    icon: Crown,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    isSystem: true,
  },
  { 
    id: "2", 
    name: "Sales Manager", 
    description: "Can manage sales team, view all deals and customers, generate reports.",
    userCount: 4,
    icon: Briefcase,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    isSystem: false,
  },
  { 
    id: "3", 
    name: "Sales Staff", 
    description: "Can view and manage own deals and customers. Limited report access.",
    userCount: 15,
    icon: Users,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    isSystem: false,
  },
  { 
    id: "4", 
    name: "Support Agent", 
    description: "Read-only access to customer data. Can log activities and notes.",
    userCount: 10,
    icon: HeadphonesIcon,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    isSystem: false,
  },
];

function CreateRoleSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.roleSheet");
  const commonT = useTranslations("common");
  const moduleT = useTranslations("admin.modules");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  const togglePermission = (moduleId: string, permission: string) => {
    setPermissions((prev) => {
      const modulePerms = prev[moduleId] || [];
      if (modulePerms.includes(permission)) {
        return {
          ...prev,
          [moduleId]: modulePerms.filter((p) => p !== permission),
        };
      } else {
        return {
          ...prev,
          [moduleId]: [...modulePerms, permission],
        };
      }
    });
  };

  const isPermissionChecked = (moduleId: string, permission: string) => {
    return permissions[moduleId]?.includes(permission) || false;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({ name: "", description: "" });
    setPermissions({});
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <div className="px-6 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t("title") || commonT("role")}</h2>
              <p className="text-sm text-slate-500">{t("description")}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                {t("roleInfo")}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("roleName")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("namePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t("roleDescription")}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t("descPlaceholder")}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                {t("permissions")}
              </h3>
              <div className="space-y-4">
                {PERMISSION_MODULES.map((module) => (
                  <div 
                    key={module.id} 
                    className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <p className="font-medium text-slate-900 mb-3">{moduleT(module.id)}</p>
                    <div className="flex flex-wrap gap-4">
                      {module.permissions.map((perm) => (
                        <div key={perm} className="flex items-center gap-2">
                          <Checkbox
                            id={`${module.id}-${perm}`}
                            checked={isPermissionChecked(module.id, perm)}
                            onCheckedChange={() => togglePermission(module.id, perm)}
                          />
                          <Label 
                            htmlFor={`${module.id}-${perm}`}
                            className="text-sm text-slate-600 capitalize cursor-pointer"
                          >
                            {perm}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const allPerms: Record<string, string[]> = {};
                  PERMISSION_MODULES.forEach((m) => {
                    allPerms[m.id] = m.permissions;
                  });
                  setPermissions(allPerms);
                }}
              >
                {t("selectAll")}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPermissions({})}
              >
                {t("clearAll")}
              </Button>
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
              commonT("create")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function RolesPage() {
  const t = useTranslations("admin");
  const commonT = useTranslations("common");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredRoles = mockRoles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("rolesTitle")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("rolesDescription")}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsSheetOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("createRole")}
        </Button>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("searchRoles")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="h-9 px-2 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4 mr-1" />
                {commonT("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredRoles.map((role) => {
          const Icon = role.icon;
          return (
            <Card 
              key={role.id}
              className="bg-white border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${role.iconBg}`}>
                    <Icon className={`h-6 w-6 ${role.iconColor}`} />
                  </div>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">
                      {t("system")}
                    </Badge>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{role.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {role.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                    <Users className="h-3 w-3 mr-1" />
                    {t("usersCount", { count: role.userCount })}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {commonT("edit")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRoles.length === 0 && (
        <Card className="bg-white border-slate-200/60 shadow-sm">
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">{t("noRolesFound")}</h3>
            <p className="text-slate-500 mt-1">
              {t("adjustSearch")}
            </p>
          </CardContent>
        </Card>
      )}

      <CreateRoleSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
