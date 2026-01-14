"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  DollarSign,
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  Calendar,
  FileText,
  Building2,
  Loader2,
  X,
} from "lucide-react";

// Mock customers
const CUSTOMERS = [
  { id: "1", name: "TechCorp Inc." },
  { id: "2", name: "StartupXYZ" },
  { id: "3", name: "MegaCorp Ltd." },
  { id: "4", name: "FinanceHub" },
  { id: "5", name: "RetailMax" },
  { id: "6", name: "HealthCare+" },
];

// Mock pipeline data
const mockDeals = [
  { id: "1", name: "Enterprise License 2026", customerId: "1", customerName: "TechCorp Inc.", amount: 125000, stage: "PROPOSAL", probability: 60, owner: "Jane Smith", ownerAvatar: "JS", closingDate: new Date("2026-02-15") },
  { id: "2", name: "Support Contract Extension", customerId: "1", customerName: "TechCorp Inc.", amount: 45000, stage: "NEGOTIATION", probability: 80, owner: "Jane Smith", ownerAvatar: "JS", closingDate: new Date("2026-01-30") },
  { id: "3", name: "Custom Integration Project", customerId: "3", customerName: "MegaCorp Ltd.", amount: 85000, stage: "NEW", probability: 20, owner: "John Doe", ownerAvatar: "JD", closingDate: new Date("2026-03-20") },
  { id: "4", name: "Platform Migration", customerId: "4", customerName: "FinanceHub", amount: 250000, stage: "QUALIFIED", probability: 45, owner: "John Doe", ownerAvatar: "JD", closingDate: new Date("2026-04-10") },
  { id: "5", name: "Annual Subscription", customerId: "5", customerName: "RetailMax", amount: 32000, stage: "WON", probability: 100, owner: "Sarah Connor", ownerAvatar: "SC", closingDate: new Date("2026-01-05") },
  { id: "6", name: "Consulting Package", customerId: "6", customerName: "HealthCare+", amount: 175000, stage: "PROPOSAL", probability: 55, owner: "Sarah Connor", ownerAvatar: "SC", closingDate: new Date("2026-02-28") },
  { id: "7", name: "Training Workshop", customerId: "2", customerName: "StartupXYZ", amount: 15000, stage: "CONTACTED", probability: 30, owner: "Jane Smith", ownerAvatar: "JS", closingDate: new Date("2026-01-25") },
  { id: "8", name: "API Integration", customerId: "3", customerName: "MegaCorp Ltd.", amount: 68000, stage: "NEGOTIATION", probability: 70, owner: "John Doe", ownerAvatar: "JD", closingDate: new Date("2026-02-05") },
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
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "short", day: "numeric" });
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
  const t = useTranslations("pipeline");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const td = useTranslations("deals");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    customer: "",
    amount: "",
    stage: "NEW",
    probability: "10",
    closeDate: "",
    description: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({ name: "", customer: "", amount: "", stage: "NEW", probability: "10", closeDate: "", description: "" });
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
                  <Label htmlFor="probability">{t("probability")} (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    placeholder="60"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-slate-500" />
                {t("stage")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">{t("stage")}</Label>
                  <Select 
                    value={formData.stage} 
                    onValueChange={(val) => setFormData({ ...formData, stage: val })}
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
                <div className="space-y-2">
                  <Label htmlFor="closeDate">{t("closeDate")}</Label>
                  <Input
                    id="closeDate"
                    type="date"
                    value={formData.closeDate}
                    onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                  />
                </div>
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

export default function PipelinePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("pipeline");
  const td = useTranslations("deals");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const [deals, setDeals] = useState(mockDeals);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Stage configuration
  const STAGES_CONFIG = [
    { id: "NEW", label: ts("NEW"), color: "bg-slate-500", bgColor: "bg-slate-100", textColor: "text-slate-700", progress: 10, probability: 10 },
    { id: "CONTACTED", label: ts("CONTACTED"), color: "bg-blue-500", bgColor: "bg-blue-100", textColor: "text-blue-700", progress: 25, probability: 20 },
    { id: "QUALIFIED", label: ts("QUALIFIED"), color: "bg-indigo-500", bgColor: "bg-indigo-100", textColor: "text-indigo-700", progress: 40, probability: 40 },
    { id: "PROPOSAL", label: ts("PROPOSAL"), color: "bg-purple-500", bgColor: "bg-purple-100", textColor: "text-purple-700", progress: 60, probability: 60 },
    { id: "NEGOTIATION", label: ts("NEGOTIATION"), color: "bg-orange-500", bgColor: "bg-orange-100", textColor: "text-orange-700", progress: 80, probability: 80 },
    { id: "WON", label: ts("WON"), color: "bg-emerald-500", bgColor: "bg-emerald-100", textColor: "text-emerald-700", progress: 100, probability: 100 },
    { id: "LOST", label: ts("LOST"), color: "bg-rose-500", bgColor: "bg-rose-100", textColor: "text-rose-700", progress: 0, probability: 0 },
  ];

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === "all" || deal.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const updateDealStage = (dealId: string, newStage: string) => {
    const stage = STAGES_CONFIG.find((s) => s.id === newStage);
    setDeals(deals.map((deal) =>
      deal.id === dealId 
        ? { ...deal, stage: newStage, probability: stage?.probability || deal.probability } 
        : deal
    ));
  };

  const pipelineValue = deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST").reduce((sum, d) => sum + d.amount, 0);
  const wonValue = deals.filter((d) => d.stage === "WON").reduce((sum, d) => sum + d.amount, 0);
  const avgDeal = pipelineValue / deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST").length || 0;
  const winRate = Math.round((deals.filter((d) => d.stage === "WON").length / deals.filter((d) => d.stage === "WON" || d.stage === "LOST").length) * 100) || 0;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("subtitle")}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{t("pipelineValue")}</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(pipelineValue, locale)}</p>
              </div>
              <div className="p-2 rounded-full bg-indigo-100">
                <DollarSign className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{t("wonValue")}</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(wonValue, locale)}</p>
              </div>
              <div className="p-2 rounded-full bg-emerald-100">
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{t("avgDealSize")}</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(avgDeal, locale)}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{t("winRate")}</p>
                <p className="text-xl font-bold text-blue-600">{winRate}%</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-3 items-center w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={tc("search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={td("stage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tc("all")}</SelectItem>
                  {STAGES_CONFIG.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || stageFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStageFilter("all");
                  }}
                  className="h-9 px-2 text-slate-500 hover:text-slate-900"
                >
                  <X className="h-4 w-4 mr-1" />
                  {tc("clear")}
                </Button>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {filteredDeals.length} {td("title").toLowerCase()}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[900px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700">{td("table.name")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{td("table.amount")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{td("table.stage")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{tc("overview")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{td("table.close_date")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{td("table.owner")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.map((deal) => {
                    const stageConfig = STAGES_CONFIG.find((s) => s.id === deal.stage);
                    const overdue = isOverdue(deal.closingDate, deal.stage);
                    
                    return (
                      <TableRow key={deal.id} className="hover:bg-slate-50/50 cursor-pointer">
                        <TableCell>
                          <div>
                            <Link 
                              href={`/sales/deals/${deal.id}`}
                              className="font-medium text-slate-900 hover:text-indigo-600 hover:underline decoration-indigo-500 underline-offset-4 transition-colors"
                            >
                              {deal.name}
                            </Link>
                            <Link 
                              href={`/sales/customers/${deal.customerId}`}
                              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                              <Building2 className="h-3 w-3" />
                              {deal.customerName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(deal.amount, locale)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="cursor-pointer">
                                <Badge className={`${stageConfig?.bgColor} ${stageConfig?.textColor} hover:${stageConfig?.bgColor} gap-1`}>
                                  {stageConfig?.label}
                                  <ChevronRight className="h-3 w-3" />
                                </Badge>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="start">
                              <p className="text-xs font-medium text-slate-500 mb-2 px-2">{tc("edit")} {td("stage")}</p>
                              <div className="space-y-1">
                                {STAGES_CONFIG.map((stage) => (
                                  <button
                                    key={stage.id}
                                    onClick={() => updateDealStage(deal.id, stage.id)}
                                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                                      deal.stage === stage.id 
                                        ? "bg-indigo-50 text-indigo-700" 
                                        : "hover:bg-slate-100 text-slate-700"
                                    }`}
                                  >
                                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                    {stage.label}
                                  </button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-32">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${stageConfig?.color}`}
                                style={{ width: `${stageConfig?.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-8">{stageConfig?.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1.5 text-sm ${overdue ? "text-rose-600 font-medium" : "text-slate-600"}`}>
                            <Calendar className="h-3.5 w-3.5" />
                            {overdue && "⚠ "}
                            {formatDate(deal.closingDate, locale)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                                {deal.ownerAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-600 hidden xl:inline">
                              {deal.owner}
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
