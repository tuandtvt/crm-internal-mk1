"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations, useLocale } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  DollarSign,
  Target,
  Calendar,
  Building2,
  Phone,
  Mail,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertTriangle,
} from "lucide-react";

// Mock deal data
const mockDeal = {
  id: "1",
  name: "Enterprise License 2026",
  customerId: "1",
  customerName: "TechCorp Inc.",
  customerPhone: "+1-555-0123",
  customerEmail: "john.anderson@techcorp.com",
  amount: 125000,
  stage: "proposal",
  probability: 60,
  closeDate: new Date("2026-02-15"),
  createdAt: new Date("2026-01-02"),
  owner: "Jane Smith",
  ownerAvatar: "JS",
  description: "Enterprise licensing agreement for TechCorp's entire development team. Includes premium support, training sessions, and custom integration services.",
  nextSteps: "Schedule product demo with CTO. Prepare ROI presentation for executive team.",
};

// Mock products/items for this deal
const mockProducts = [
  { id: "1", name: "Enterprise License", quantity: 50, unitPrice: 2000, total: 100000 },
  { id: "2", name: "Premium Support (1 year)", quantity: 1, unitPrice: 15000, total: 15000 },
  { id: "3", name: "Custom Integration", quantity: 1, unitPrice: 10000, total: 10000 },
];

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: locale === "vi" ? "VND" : "USD",
    minimumFractionDigits: 0,
  }).format(locale === "vi" ? value * 25000 : value);
}

function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

function formatDateTime(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { 
    month: "short", 
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isOverdue(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function StageStepper({ currentStage, locale }: { currentStage: string; locale: string }) {
  const ts = useTranslations("Status");
  const stages = [
    { id: "new", label: ts("NEW"), color: "bg-slate-500" },
    { id: "contacted", label: ts("CONTACTED"), color: "bg-blue-500" },
    { id: "qualified", label: ts("QUALIFIED"), color: "bg-indigo-500" },
    { id: "proposal", label: ts("PROPOSAL"), color: "bg-purple-500" },
    { id: "negotiation", label: ts("NEGOTIATION"), color: "bg-orange-500" },
    { id: "won", label: ts("WON"), color: "bg-emerald-500" },
  ];
  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? `${stage.color} text-white ring-4 ring-offset-2 ring-indigo-200`
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-medium ${
                    isCurrent ? "text-indigo-600" : isCompleted ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DealDetailPage() {
  const t = useTranslations("deals");
  const commonT = useTranslations("common");
  const ts = useTranslations("status");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("overview");
  const deal = mockDeal;
  const overdue = isOverdue(deal.closeDate);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/sales/pipeline">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {commonT("previous")}
          </Button>
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/sales/deals" className="hover:text-indigo-600 transition-colors">
            {t("title")}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{deal.name}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {deal.name}
          </h1>
          <Link
            href={`/sales/customers/${deal.customerId}`}
            className="flex items-center gap-2 mt-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Building2 className="h-4 w-4" />
            {deal.customerName}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            {commonT("edit")}
          </Button>
          <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
            <Trash2 className="h-4 w-4 mr-2" />
            {commonT("delete")}
          </Button>
        </div>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardContent className="p-6 overflow-x-auto">
          <StageStepper currentStage={deal.stage} locale={locale} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t("value")}</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(deal.amount, locale)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Probability</p>
                <p className="text-2xl font-bold text-indigo-600">{deal.probability}%</p>
              </div>
              <div className="p-3 rounded-full bg-indigo-100">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-white border-slate-200/60 shadow-sm border-t-4 ${overdue ? "border-t-rose-500" : "border-t-blue-500"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t("closeDate")}</p>
                <p className={`text-2xl font-bold ${overdue ? "text-rose-600" : "text-blue-600"}`}>
                  {formatDate(deal.closeDate, locale)}
                </p>
                {overdue && (
                  <Badge className="mt-1 bg-rose-100 text-rose-700 hover:bg-rose-100">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
              <div className={`p-3 rounded-full ${overdue ? "bg-rose-100" : "bg-blue-100"}`}>
                <Calendar className={`h-5 w-5 ${overdue ? "text-rose-600" : "text-blue-600"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            {commonT("overview")}
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white">
            {commonT("details")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="bg-white border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{commonT("details")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {deal.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{commonT("note")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Textarea
                    defaultValue={deal.nextSteps}
                    placeholder="..."
                    rows={3}
                    className="resize-none"
                  />
                  <Button size="sm" className="mt-3 bg-indigo-600 hover:bg-indigo-700">
                    {commonT("save")}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{t("table.owner")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700">
                        {deal.ownerAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{deal.owner}</p>
                      <p className="text-xs text-slate-500">{commonT("new")} {formatDate(deal.createdAt, locale)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-slate-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Products / Items</CardTitle>
                <CardDescription>Items included in this deal</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="text-right font-semibold">Qty</TableHead>
                      <TableHead className="text-right font-semibold">Price</TableHead>
                      <TableHead className="text-right font-semibold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.unitPrice, locale)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(product.total, locale)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">{t("value")}</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(deal.amount, locale)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{commonT("details")} Timeline</CardTitle>
              <CardDescription>Recent interactions and updates</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-500 italic">{commonT("noData")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
