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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
  Calendar as CalendarIcon,
  DollarSign,
  ArrowUpDown,
  Loader2,
  Users,
  Building2,
  Target,
  X,
} from "lucide-react";
import { DateRangeFilter } from "@/components/common/date-range-filter";

// Mock owners
const OWNERS = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Sarah Connor" },
];

// Mock customers
const CUSTOMERS = [
  { id: "1", name: "TechCorp Inc." },
  { id: "2", name: "StartupXYZ" },
  { id: "3", name: "MegaCorp Ltd." },
  { id: "4", name: "FinanceHub" },
  { id: "5", name: "RetailMax" },
  { id: "6", name: "HealthCare+" },
];

// Mock deals data
const mockDeals = [
  { id: "1", name: "Enterprise License 2026", customerId: "1", customerName: "TechCorp Inc.", amount: 125000, stage: "PROPOSAL" as const, closeDate: new Date("2026-02-15"), ownerId: "1", ownerName: "Jane Smith", probability: 60 },
  { id: "2", name: "Support Contract Extension", customerId: "1", customerName: "TechCorp Inc.", amount: 45000, stage: "NEGOTIATION" as const, closeDate: new Date("2026-01-30"), ownerId: "1", ownerName: "Jane Smith", probability: 80 },
  { id: "3", name: "Custom Integration Project", customerId: "3", customerName: "MegaCorp Ltd.", amount: 85000, stage: "NEW" as const, closeDate: new Date("2026-03-20"), ownerId: "2", ownerName: "John Doe", probability: 30 },
  { id: "4", name: "Platform Migration", customerId: "4", customerName: "FinanceHub", amount: 250000, stage: "CONTACTED" as const, closeDate: new Date("2026-04-10"), ownerId: "2", ownerName: "John Doe", probability: 45 },
  { id: "5", name: "Annual Subscription", customerId: "5", customerName: "RetailMax", amount: 32000, stage: "WON" as const, closeDate: new Date("2026-01-05"), ownerId: "3", ownerName: "Sarah Connor", probability: 100 },
  { id: "6", name: "Consulting Package", customerId: "6", customerName: "HealthCare+", amount: 175000, stage: "PROPOSAL" as const, closeDate: new Date("2026-02-28"), ownerId: "3", ownerName: "Sarah Connor", probability: 55 },
  { id: "7", name: "Training Workshop", customerId: "2", customerName: "StartupXYZ", amount: 15000, stage: "LOST" as const, closeDate: new Date("2025-12-20"), ownerId: "1", ownerName: "Jane Smith", probability: 0 },
  { id: "8", name: "API Integration", customerId: "3", customerName: "MegaCorp Ltd.", amount: 68000, stage: "NEGOTIATION" as const, closeDate: new Date("2026-02-05"), ownerId: "2", ownerName: "John Doe", probability: 70 },
];

// Format currency
function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: locale === "vi" ? "VND" : "USD",
    minimumFractionDigits: 0,
  }).format(locale === "vi" ? value * 25000 : value); // Simple mock conversion for VND
}

// Format date
function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

// Check if overdue
function isOverdue(date: Date, stage: string): boolean {
  if (stage === "WON" || stage === "LOST") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// Enhanced Side Sheet for Creating Deals
function CreateDealSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("deals");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    customer: "",
    amount: "",
    stage: "NEW",
    closeDate: "",
    description: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({ name: "", customer: "", amount: "", stage: "NEW", closeDate: "", description: "" });
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
              <Target className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t("newDeal")}</h2>
              <p className="text-sm text-slate-500">{t("description")}</p>
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
                  <Label htmlFor="customer">{tc("overview")}</Label>
                  <Select 
                    value={formData.customer} 
                    onValueChange={(value) => setFormData({ ...formData, customer: value })}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder={tc("all")} />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOMERS.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-500" />
                {t("value")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">{t("table.amount")}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="pl-9"
                      placeholder="125000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">{t("table.stage")}</Label>
                  <Select 
                    value={formData.stage} 
                    onValueChange={(value) => setFormData({ ...formData, stage: value })}
                  >
                    <SelectTrigger id="stage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">{ts("NEW")}</SelectItem>
                      <SelectItem value="PROPOSAL">{ts("PROPOSAL")}</SelectItem>
                      <SelectItem value="NEGOTIATION">{ts("NEGOTIATION")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-500" />
                {t("closeDate")}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="closeDate">{t("table.close_date")}</Label>
                <Input
                  id="closeDate"
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{tc("details")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="..."
                rows={4}
              />
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
              t("newDeal")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function DealsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("deals");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const td = useTranslations("dashboard");
  const searchParams = useSearchParams();
  
  // Read filters from URL
  const searchTerm = searchParams.get("q") || "";
  const stageParam = searchParams.get("stage")?.split(",").filter(Boolean) || [];
  const ownerParam = searchParams.get("owner_id")?.split(",").filter(Boolean) || [];
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const dateRange: DateRange | undefined = fromDate && toDate ? {
    from: new Date(fromDate),
    to: new Date(toDate),
  } : undefined;

  const [sortBy, setSortBy] = useState<"amount" | "closeDate">("closeDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Stage configuration (localized)
  const STAGES = {
    NEW: { label: ts("NEW"), bgColor: "bg-slate-100", textColor: "text-slate-700", order: 1 },
    CONTACTED: { label: ts("CONTACTED"), bgColor: "bg-blue-100", textColor: "text-blue-700", order: 2 },
    PROPOSAL: { label: ts("PROPOSAL"), bgColor: "bg-purple-100", textColor: "text-purple-700", order: 3 },
    NEGOTIATION: { label: ts("NEGOTIATION"), bgColor: "bg-orange-100", textColor: "text-orange-700", order: 4 },
    WON: { label: ts("WON"), bgColor: "bg-emerald-100", textColor: "text-emerald-700", order: 5 },
    LOST: { label: ts("LOST"), bgColor: "bg-rose-100", textColor: "text-rose-700", order: 6 },
  } as const;

  // Map header stage values to deal stage values
  const stageMapping: Record<string, string> = {
    "discovery": "NEW",
    "proposal": "PROPOSAL",
    "negotiation": "NEGOTIATION",
    "closed_won": "WON",
    "closed_lost": "LOST",
  };

  const filteredDeals = mockDeals.filter((deal) => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageParam.length === 0 || stageParam.some(s => stageMapping[s] === deal.stage || s.toUpperCase() === deal.stage);
    const matchesOwner = ownerParam.length === 0 || ownerParam.includes(deal.ownerId);
    const matchesDate = !dateRange?.from || !dateRange?.to || 
      (deal.closeDate >= dateRange.from && deal.closeDate <= dateRange.to);
    return matchesSearch && matchesStage && matchesOwner && matchesDate;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "amount") {
      comparison = a.amount - b.amount;
    } else {
      comparison = a.closeDate.getTime() - b.closeDate.getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: "amount" | "closeDate") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const totalValue = mockDeals.reduce((sum, d) => sum + d.amount, 0);
  const wonValue = mockDeals.filter((d) => d.stage === "WON").reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("description")}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsSheetOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("newDeal")}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-indigo-500">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{td("stats.activeLeads")}</p>
            <p className="text-2xl font-bold text-slate-900">{mockDeals.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-purple-500">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Pipeline Value</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue, locale)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-emerald-500">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Won Value</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(wonValue, locale)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-blue-500">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">{td("stats.openDeals")}</p>
            <p className="text-2xl font-bold text-blue-600">
              {mockDeals.filter((d) => d.stage !== "WON" && d.stage !== "LOST").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <p className="text-sm text-slate-500">
            {filteredDeals.length} {t("title").toLowerCase()}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[900px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700">{t("table.name")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{tc("overview")}</TableHead>
                    <TableHead 
                      className="font-semibold text-slate-700 cursor-pointer hover:text-slate-900"
                      onClick={() => toggleSort("amount")}
                    >
                      <div className="flex items-center gap-1">
                        {t("table.amount")}
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortBy === "amount" ? "text-indigo-600" : ""}`} />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.stage")}</TableHead>
                    <TableHead 
                      className="font-semibold text-slate-700 cursor-pointer hover:text-slate-900"
                      onClick={() => toggleSort("closeDate")}
                    >
                      <div className="flex items-center gap-1">
                        {t("table.close_date")}
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortBy === "closeDate" ? "text-indigo-600" : ""}`} />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.owner")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDeals.map((deal) => {
                    const stageConfig = STAGES[deal.stage as keyof typeof STAGES];
                    const overdue = isOverdue(deal.closeDate, deal.stage);
                    return (
                      <TableRow key={deal.id} className="hover:bg-slate-50/50 cursor-pointer">
                        <TableCell>
                          <p className="font-medium text-slate-900">{deal.name}</p>
                        </TableCell>
                        <TableCell>
                          <Link 
                            href={`/sales/customers/${deal.customerId}`}
                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            <Building2 className="h-3.5 w-3.5" />
                            {deal.customerName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(deal.amount, locale)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${stageConfig.bgColor} ${stageConfig.textColor} hover:${stageConfig.bgColor}`}>
                            {stageConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm ${overdue ? "text-rose-600 font-medium" : "text-slate-600"}`}>
                            {overdue && "⚠ "}
                            {formatDate(deal.closeDate, locale)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                                {deal.ownerName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-600 hidden xl:inline">
                              {deal.ownerName}
                            </span>
                          </div>
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

      <CreateDealSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
