"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Share2,
  Lock,
  Eye,
  Edit as EditIcon,
  Users,
  Shield,
  Building2,
  Settings,
  AlertTriangle,
} from "lucide-react";

// Access level configuration (handled via translations)

// Modules for sharing rules
const MODULES = [
  { id: "leads", name: "Leads", currentAccess: "private" as const },
  { id: "deals", name: "Deals", currentAccess: "private" as const },
  { id: "customers", name: "Customers", currentAccess: "publicRead" as const },
  { id: "contracts", name: "Contracts", currentAccess: "private" as const },
  { id: "tasks", name: "Tasks", currentAccess: "private" as const },
];

// Mock sharing rules
const sharingRules = [
  {
    id: "1",
    name: "Manager Team Access",
    description: "Allow Sales Managers to view data of Sales Staff within the same Department",
    fromRole: "Sales Staff",
    toRole: "Sales Manager",
    scope: "Same Department",
    accessType: "Read Only",
    active: true,
  },
  {
    id: "2",
    name: "Cross-Department Visibility",
    description: "Allow Marketing team to view Customer data from Sales for campaign targeting",
    fromRole: "Sales Staff",
    toRole: "Marketing",
    scope: "All Departments",
    accessType: "Read Only",
    active: true,
  },
  {
    id: "3",
    name: "Executive Dashboard",
    description: "Allow Executives to view all Deals and Pipeline data across departments",
    fromRole: "All Roles",
    toRole: "Administrator",
    scope: "Organization-wide",
    accessType: "Read Only",
    active: true,
  },
  {
    id: "4",
    name: "Support Customer Access",
    description: "Allow Support team read-only access to Customer profiles and history",
    fromRole: "Sales Staff",
    toRole: "Support Agent",
    scope: "All Departments",
    accessType: "Read Only",
    active: false,
  },
];

export default function ShareConfigPage() {
  const t = useTranslations("admin");
  const commonT = useTranslations("common");
  const [modules, setModules] = useState(MODULES);
  const [rules, setRules] = useState(sharingRules);

  const updateModuleAccess = (moduleId: string, access: string) => {
    setModules(modules.map((m) => 
      m.id === moduleId ? { ...m, currentAccess: access as typeof m.currentAccess } : m
    ));
  };

  const toggleRuleActive = (ruleId: string) => {
    setRules(rules.map((r) => 
      r.id === ruleId ? { ...r, active: !r.active } : r
    ));
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("shareTitle")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("shareDescription")}
          </p>
        </div>
        
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25">
          <Settings className="mr-2 h-4 w-4" />
          {t("advancedSettings")}
        </Button>
      </div>

      {/* Warning Banner */}
      <Card className="bg-amber-50 border-amber-200 shadow-sm">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">{t("sharingImpact")}</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {t("sharingImpactDesc")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Default Sharing Rules */}
      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-slate-600" />
            {t("defaultSharing")}
          </CardTitle>
          <CardDescription>
            {t("defaultSharingDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[600px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700">{t("module")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("accessLevel")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{commonT("description")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => {
                    return (
                      <TableRow key={module.id}>
                        <TableCell>
                          <span className="font-medium text-slate-900">{module.name}</span>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={module.currentAccess}
                            onValueChange={(value) => updateModuleAccess(module.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">
                                <div className="flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  {t("accessLevels.private")}
                                </div>
                              </SelectItem>
                              <SelectItem value="publicRead">
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  {t("accessLevels.publicRead")}
                                </div>
                              </SelectItem>
                              <SelectItem value="publicReadWrite">
                                <div className="flex items-center gap-2">
                                  <EditIcon className="h-4 w-4" />
                                  {t("accessLevels.publicReadWrite")}
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-500">
                            {t(`accessLevelDesc.${module.currentAccess}`)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              {t("saveDefaults")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sharing Rules */}
      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-slate-600" />
              {t("sharingRules")}
            </CardTitle>
            <CardDescription>
              {t("sharingRulesDesc")}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            {t("addRule")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className={`p-4 rounded-lg border transition-all ${
                rule.active 
                  ? "bg-white border-slate-200" 
                  : "bg-slate-50 border-slate-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-slate-900">{rule.name}</h4>
                    <Badge 
                      className={
                        rule.active 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                          : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                      }
                    >
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{rule.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      From: <span className="font-medium text-slate-700">{rule.fromRole}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Shield className="h-3.5 w-3.5" />
                      To: <span className="font-medium text-slate-700">{rule.toRole}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Building2 className="h-3.5 w-3.5" />
                      Scope: <span className="font-medium text-slate-700">{rule.scope}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {rule.accessType}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => toggleRuleActive(rule.id)}
                  />
                  <Button variant="ghost" size="sm">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-blue-50 border-blue-100 shadow-sm">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 {t("bestPractices")}</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {(t.raw("bestPracticesList") as string[]).map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
