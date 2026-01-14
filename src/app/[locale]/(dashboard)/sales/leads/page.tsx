"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Users,
  UserPlus,
  Phone,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  ArrowRightLeft,
  X,
  TrendingUp,
  Target,
  Clock,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { mockCustomers } from "@/lib/mock-data/customers";
import { mockUsers } from "@/lib/mock-data/users";
import { Customer } from "@/types";
import { DateRangeFilter } from "@/components/common/date-range-filter";
import { ImportLeadsDialog } from "@/components/leads/import-leads-dialog";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";

// Format date
function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LeadsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("leads");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const tcu = useTranslations("customers");

  const allLeads = mockCustomers.filter((c) => c.type === "LEAD");
  const [leads, setLeads] = useState<Customer[]>(allLeads);
  const searchParams = useSearchParams();
  
  // Read all filters from URL
  const searchTerm = searchParams.get("q") || "";
  const statusParam = searchParams.get("status")?.split(",").filter(Boolean) || [];
  const ownerParam = searchParams.get("owner_id")?.split(",").filter(Boolean) || [];
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const dateRange: DateRange | undefined = fromDate && toDate ? {
    from: new Date(fromDate),
    to: new Date(toDate),
  } : undefined;

  const [leadToDelete, setLeadToDelete] = useState<Customer | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Status options for FacetedFilter
  const statusOptions = [
    { label: ts("NEW"), value: "1" },
    { label: ts("CONTACTED"), value: "2" },
    { label: ts("QUALIFIED"), value: "3" },
  ];

  // Owner options for FacetedFilter (searchable by name)
  const ownerOptions = mockUsers.map(user => ({
    label: user.name,
    value: String(user.id),
  }));

  // Export CSV function
  const handleExport = () => {
    const headers = ["Name", "Company", "Email", "Phone", "Source", "Status"];
    const csvData = leads.map(lead => [
      lead.name,
      lead.company_name || "",
      lead.email || "",
      lead.phone || "",
      lead.source || "",
      lead.status_id === 1 ? "New" : lead.status_id === 2 ? "Contacted" : "Qualified",
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads_export.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    
    toast.success(tcu("exportSuccess") || "Leads exported successfully");
  };

  // Import handler - adds mock data to leads
  const handleImportComplete = (importedLeads: Customer[]) => {
    setLeads(prev => [...prev, ...importedLeads]);
    setIsImportOpen(false);
    toast.success(`${importedLeads.length} leads imported successfully`);
  };

  // Status configuration for leads
  const LEAD_STATUSES = {
    1: { label: ts("NEW"), bgColor: "bg-slate-100", textColor: "text-slate-700" },
    2: { label: ts("CONTACTED"), bgColor: "bg-blue-100", textColor: "text-blue-700" },
    3: { label: ts("QUALIFIED"), bgColor: "bg-indigo-100", textColor: "text-indigo-700" },
  } as const;

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusParam.length === 0 || statusParam.includes(String(lead.status_id));
    const matchesOwner = ownerParam.length === 0 || ownerParam.includes(String(lead.owner_id));
    const matchesDate = !dateRange?.from || !dateRange?.to || !lead.created_at ||
      (lead.created_at >= dateRange.from && lead.created_at <= dateRange.to);
    return matchesSearch && matchesStatus && matchesOwner && matchesDate;
  });

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status_id === 1).length,
    contacted: leads.filter((l) => l.status_id === 2).length,
    qualified: leads.filter((l) => l.status_id === 3).length,
  };

  const handleConvertToCustomer = (lead: Customer) => {
    setLeads(leads.filter((l) => l.id !== lead.id));
    toast.success(t("convertSuccess"));
  };

  const handleDeleteConfirm = () => {
    if (!leadToDelete) return;
    setLeads(leads.filter((l) => l.id !== leadToDelete.id));
    toast.success(`${leadToDelete.name} ${tcu("deleteDescription")}`);
    setLeadToDelete(null);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">{t("description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            {tc("export") || "Export"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="cursor-pointer"
          >
            <Upload className="mr-2 h-4 w-4" />
            {tc("import") || "Import"}
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 cursor-pointer">
            <UserPlus className="mr-2 h-4 w-4" />
            {tcu("addNew")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-slate-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{tc("all")}</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("newLeads")}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("contacted")}</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.contacted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("qualified")}</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.qualified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <p className="text-sm text-slate-500">
            {filteredLeads.length} leads
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[900px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700">{tcu("table.name")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{tcu("table.company")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{tcu("phone")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{tcu("table.owner")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{tc("status")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{tcu("table.created_at")}</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => {
                      const statusConfig = LEAD_STATUSES[lead.status_id as keyof typeof LEAD_STATUSES] || LEAD_STATUSES[1];
                      const owner = mockUsers.find((u) => u.id === lead.owner_id);

                      return (
                        <TableRow key={lead.id} className="hover:bg-slate-50/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-medium">
                                  {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <Link
                                  href={`/sales/customers/${lead.id}`}
                                  className="font-medium text-slate-900 hover:text-indigo-600 hover:underline decoration-indigo-500 underline-offset-4 transition-colors"
                                >
                                  {lead.name}
                                </Link>
                                <p className="text-xs text-slate-500">{lead.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-700">{lead.company_name || "-"}</span>
                            </div>
                            {lead.industry && (
                              <Badge variant="secondary" className="mt-1 text-xs font-normal">
                                {lead.industry}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span className="text-sm">{lead.phone || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                                  {owner?.name.split(" ").map((n: string) => n[0]).join("") || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-slate-600 hidden xl:inline">
                                {owner?.name || tcu("unassigned")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} hover:${statusConfig.bgColor}`}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-600">
                              {lead.created_at ? formatDate(lead.created_at, locale) : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleConvertToCustomer(lead)}
                                  className="cursor-pointer text-emerald-600"
                                >
                                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                                  {t("convertToCustomer")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" />
                                  {tc("edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setLeadToDelete(lead)}
                                  className="text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {tc("delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Users className="h-8 w-8 mb-2 text-slate-300" />
                          <p>{tc("noData")}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!leadToDelete} onOpenChange={() => setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tcu("deleteCustomer")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {tcu("deleteConfirm")} <strong>{leadToDelete?.name}</strong>?{" "}
              {tcu("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <ImportLeadsDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportComplete}
      />
    </div>
  );
}
