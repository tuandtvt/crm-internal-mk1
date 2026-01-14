"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Users,
  UserPlus,
  Phone,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  ArrowRightLeft,
  Star,
  CheckCircle,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { mockCustomers } from "@/lib/mock-data/customers";
import { mockUsers } from "@/lib/mock-data/users";
import { Customer } from "@/types";
import { ImportLeadsDialog } from "@/components/leads/import-leads-dialog";
import { DataTableCellStatus, StatusOption } from "@/components/ui/data-table-cell-status";
import { CompactFilterCard } from "@/components/dashboard/compact-filter-card";

// Format date
function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Status options for inline editor
const LEAD_STATUS_OPTIONS: StatusOption[] = [
  { value: 1, label: "Lead mới", bgColor: "bg-amber-100", textColor: "text-amber-700" },
  { value: 2, label: "Đã liên hệ", bgColor: "bg-blue-100", textColor: "text-blue-700" },
  { value: 3, label: "Đủ điều kiện", bgColor: "bg-emerald-100", textColor: "text-emerald-700" },
];

export default function LeadsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("leads");
  const tc = useTranslations("common");
  const tcu = useTranslations("customers");

  const allLeads = mockCustomers.filter((c) => c.type === "LEAD");
  const [leads, setLeads] = useState<Customer[]>(allLeads);
  const searchParams = useSearchParams();
  
  // Read filters from URL
  const searchTerm = searchParams.get("q") || "";
  const statusParam = searchParams.get("status") || "";
  const ownerParam = searchParams.get("owner_id")?.split(",").filter(Boolean) || [];
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const dateRange: DateRange | undefined = fromDate && toDate ? {
    from: new Date(fromDate),
    to: new Date(toDate),
  } : undefined;

  const [leadToDelete, setLeadToDelete] = useState<Customer | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Stats (always show total counts)
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status_id === 1).length,
    contacted: leads.filter((l) => l.status_id === 2).length,
    qualified: leads.filter((l) => l.status_id === 3).length,
  };

  // Filter leads based on URL params
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    // Status filter - match by status_id
    const matchesStatus = !statusParam || String(lead.status_id) === statusParam;
    
    const matchesOwner = ownerParam.length === 0 || ownerParam.includes(String(lead.owner_id));
    const matchesDate = !dateRange?.from || !dateRange?.to || !lead.created_at ||
      (lead.created_at >= dateRange.from && lead.created_at <= dateRange.to);
    return matchesSearch && matchesStatus && matchesOwner && matchesDate;
  });

  // Handle inline status change
  const handleStatusChange = (rowId: string | number, newValue: string | number) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === rowId ? { ...lead, status_id: newValue as number } : lead
      )
    );
  };

  // Export CSV
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
    
    toast.success("Leads exported successfully");
  };

  // Import handler
  const handleImportComplete = (importedLeads: Customer[]) => {
    setLeads(prev => [...prev, ...importedLeads]);
    setIsImportOpen(false);
    toast.success(`${importedLeads.length} leads imported successfully`);
  };

  const handleConvertToCustomer = (lead: Customer) => {
    setLeads(leads.filter((l) => l.id !== lead.id));
    toast.success(t("convertSuccess"));
  };

  const handleDeleteConfirm = () => {
    if (!leadToDelete) return;
    setLeads(leads.filter((l) => l.id !== leadToDelete.id));
    toast.success(`${leadToDelete.name} deleted`);
    setLeadToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">{t("description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {tc("export")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            {tc("import")}
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25">
            <UserPlus className="mr-2 h-4 w-4" />
            {tcu("addNew")}
          </Button>
        </div>
      </div>

      {/* Compact Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CompactFilterCard
          label={tc("all")}
          value={stats.total}
          icon={Users}
          statusValue={null}
          iconBgColor="bg-slate-100"
          iconTextColor="text-slate-600"
          activeColor="slate"
        />
        <CompactFilterCard
          label={t("newLeads")}
          value={stats.new}
          icon={Star}
          statusValue="1"
          iconBgColor="bg-amber-100"
          iconTextColor="text-amber-600"
          activeColor="amber"
        />
        <CompactFilterCard
          label={t("contacted")}
          value={stats.contacted}
          icon={Phone}
          statusValue="2"
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          activeColor="blue"
        />
        <CompactFilterCard
          label={t("qualified")}
          value={stats.qualified}
          icon={CheckCircle}
          statusValue="3"
          iconBgColor="bg-emerald-100"
          iconTextColor="text-emerald-600"
          activeColor="emerald"
        />
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
                                  className="font-medium text-slate-900 hover:text-indigo-600 hover:underline"
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
                                {owner?.name || "-"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DataTableCellStatus
                              value={lead.status_id || 1}
                              rowId={lead.id}
                              options={LEAD_STATUS_OPTIONS}
                              onChange={handleStatusChange}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-600">
                              {lead.created_at ? formatDate(lead.created_at, locale) : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleConvertToCustomer(lead)}
                                  className="text-emerald-600"
                                >
                                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                                  {t("convertToCustomer")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  {tc("edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setLeadToDelete(lead)}
                                  className="text-red-600"
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
              {tcu("deleteConfirm")} <strong>{leadToDelete?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
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
