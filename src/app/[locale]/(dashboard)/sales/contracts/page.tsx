"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FileText,
  Calendar,
  DollarSign,
  Check,
  AlertCircle,
  Send,
  Loader2,
  Users,
} from "lucide-react";
import { CompactFilterCard } from "@/components/dashboard/compact-filter-card";
import { DataTableCellStatus, StatusOption } from "@/components/ui/data-table-cell-status";
import { toast } from "sonner";

// Contract type
interface Contract {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  value: number;
  startDate: Date;
  endDate: Date;
  status: "DRAFT" | "SENT" | "SIGNED" | "EXPIRED";
}

// Mock contracts data
const initialContracts: Contract[] = [
  { id: "1", name: "Enterprise License Agreement - TechCorp", customerId: "1", customerName: "TechCorp Inc.", value: 125000, startDate: new Date("2026-01-15"), endDate: new Date("2027-01-14"), status: "SIGNED" },
  { id: "2", name: "Annual Support Contract - StartupXYZ", customerId: "2", customerName: "StartupXYZ", value: 45000, startDate: new Date("2026-02-01"), endDate: new Date("2027-01-31"), status: "SENT" },
  { id: "3", name: "Consulting Agreement - MegaCorp", customerId: "3", customerName: "MegaCorp Ltd.", value: 250000, startDate: new Date("2026-03-01"), endDate: new Date("2026-08-31"), status: "DRAFT" },
  { id: "4", name: "Platform License - FinanceHub", customerId: "4", customerName: "FinanceHub", value: 85000, startDate: new Date("2025-01-01"), endDate: new Date("2025-12-31"), status: "EXPIRED" },
  { id: "5", name: "Extended Support - RetailMax", customerId: "5", customerName: "RetailMax", value: 32000, startDate: new Date("2026-01-10"), endDate: new Date("2026-07-09"), status: "SIGNED" },
  { id: "6", name: "Custom Development - HealthCare+", customerId: "6", customerName: "HealthCare+", value: 175000, startDate: new Date("2026-02-15"), endDate: new Date("2026-11-14"), status: "DRAFT" },
  { id: "7", name: "Integration Services - LogiTech", customerId: "7", customerName: "LogiTech Solutions", value: 68000, startDate: new Date("2024-06-01"), endDate: new Date("2025-05-31"), status: "EXPIRED" },
  { id: "8", name: "Pilot Program - EduLearn", customerId: "8", customerName: "EduLearn Academy", value: 15000, startDate: new Date("2026-01-20"), endDate: new Date("2026-04-19"), status: "SENT" },
];

// Status options for inline editor
const CONTRACT_STATUS_OPTIONS: StatusOption[] = [
  { value: "DRAFT", label: "Nháp", bgColor: "bg-slate-100", textColor: "text-slate-700" },
  { value: "SENT", label: "Đã gửi", bgColor: "bg-blue-100", textColor: "text-blue-700" },
  { value: "SIGNED", label: "Đã ký", bgColor: "bg-emerald-100", textColor: "text-emerald-700" },
  { value: "EXPIRED", label: "Hết hạn", bgColor: "bg-rose-100", textColor: "text-rose-700" },
];

// Format currency
function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: locale === "vi" ? "VND" : "USD",
    minimumFractionDigits: 0,
  }).format(locale === "vi" ? value * 25000 : value);
}

// Format date
function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

// Enhanced Side Sheet for Creating Contracts
function CreateContractSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("contracts");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    customer: "",
    value: "",
    startDate: "",
    endDate: "",
    status: "DRAFT",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({ name: "", customer: "", value: "", startDate: "", endDate: "", status: "DRAFT" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <div className="px-6 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t("title")}</h2>
              <p className="text-sm text-slate-500">{tc("details")}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                {tc("details")}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("table.name")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("table.name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">{t("table.customer")}</Label>
                  <Select 
                    value={formData.customer} 
                    onValueChange={(value) => setFormData({ ...formData, customer: value })}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder={tc("all")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">TechCorp Inc.</SelectItem>
                      <SelectItem value="2">StartupXYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-500" />
                {tc("overview")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="value">{t("table.amount")}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="pl-9"
                      placeholder="125000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                {tc("overview")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t("table.start_date")}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t("table.end_date")}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("table.status")}</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">{ts("DRAFT")}</SelectItem>
                  <SelectItem value="SENT">{ts("SENT")}</SelectItem>
                  <SelectItem value="SIGNED">{ts("SIGNED")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {tc("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {tc("loading")}
              </>
            ) : (
              tc("add")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function ContractsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("contracts");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const searchParams = useSearchParams();
  
  // Read filters from URL
  const searchTerm = searchParams.get("q") || "";
  const statusParam = searchParams.get("status") || "";

  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Stats
  const stats = {
    total: contracts.length,
    draft: contracts.filter((c) => c.status === "DRAFT").length,
    sent: contracts.filter((c) => c.status === "SENT").length,
    signed: contracts.filter((c) => c.status === "SIGNED").length,
    expired: contracts.filter((c) => c.status === "EXPIRED").length,
  };

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = 
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusParam || contract.status === statusParam;
    return matchesSearch && matchesStatus;
  });

  // Handle inline status change
  const handleStatusChange = (rowId: string | number, newValue: string | number) => {
    setContracts(prev => 
      prev.map(contract => 
        contract.id === rowId ? { ...contract, status: newValue as Contract["status"] } : contract
      )
    );
  };

  const signedValue = contracts.filter((c) => c.status === "SIGNED").reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">
            {tc("overview")}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsSheetOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          {tc("add")}
        </Button>
      </div>

      {/* Compact Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
          label={ts("DRAFT")}
          value={stats.draft}
          icon={FileText}
          statusValue="DRAFT"
          iconBgColor="bg-slate-100"
          iconTextColor="text-slate-600"
          activeColor="slate"
        />
        <CompactFilterCard
          label={ts("SENT")}
          value={stats.sent}
          icon={Send}
          statusValue="SENT"
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          activeColor="blue"
        />
        <CompactFilterCard
          label={ts("SIGNED")}
          value={stats.signed}
          icon={Check}
          statusValue="SIGNED"
          iconBgColor="bg-emerald-100"
          iconTextColor="text-emerald-600"
          activeColor="emerald"
        />
        <CompactFilterCard
          label={ts("EXPIRED")}
          value={stats.expired}
          icon={AlertCircle}
          statusValue="EXPIRED"
          iconBgColor="bg-rose-100"
          iconTextColor="text-rose-600"
          activeColor="purple"
        />
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <p className="text-sm text-slate-500">
            {filteredContracts.length} {t("title").toLowerCase()}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[800px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700">{t("table.name")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.customer")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.amount")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.start_date")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.end_date")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Link 
                          href={`/sales/contracts/${contract.id}`}
                          className="font-medium text-slate-900 hover:text-indigo-600 hover:underline"
                        >
                          {contract.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`/sales/customers/${contract.customerId}`}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          {contract.customerName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(contract.value, locale)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {formatDate(contract.startDate, locale)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {formatDate(contract.endDate, locale)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DataTableCellStatus
                          value={contract.status}
                          rowId={contract.id}
                          options={CONTRACT_STATUS_OPTIONS}
                          onChange={handleStatusChange}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateContractSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
