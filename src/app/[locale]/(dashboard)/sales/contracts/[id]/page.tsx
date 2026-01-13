"use client";

import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Building2,
  Download,
  Mail,
  FileText,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
  Send,
  AlertTriangle,
  FileSignature,
} from "lucide-react";

// Mock contract data
const mockContract = {
  id: "1",
  name: "Annual Service Agreement 2026",
  customerId: "1",
  customerName: "TechCorp Inc.",
  customerContact: "John Anderson",
  customerEmail: "john.anderson@techcorp.com",
  value: 125000,
  status: "sent" as const,
  startDate: new Date("2026-02-01"),
  endDate: new Date("2027-01-31"),
  createdAt: new Date("2026-01-10"),
  sentAt: new Date("2026-01-15"),
  terms: {
    paymentTerms: "Net 30",
    billingCycle: "Annual (Upfront)",
    autoRenewal: true,
    terminationNotice: "60 days",
    currency: "USD",
  },
  description: "Annual service agreement covering enterprise licensing, premium support, and integration services for the 2026 fiscal year.",
};

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

function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ContractDetailPage() {
  const t = useTranslations("contracts");
  const commonT = useTranslations("common");
  const ts = useTranslations("status");
  const locale = useLocale();
  const contract = mockContract;
  
  const statusLabel = ts(contract.status.toUpperCase());
  const daysRemaining = daysUntil(contract.endDate);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/sales/contracts">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {commonT("previous")}
          </Button>
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/sales/contracts" className="hover:text-indigo-600 transition-colors">
            {t("title")}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{contract.name}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              {contract.name}
            </h1>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
              {statusLabel}
            </Badge>
          </div>
          <Link
            href={`/sales/customers/${contract.customerId}`}
            className="flex items-center gap-2 mt-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Building2 className="h-4 w-4" />
            {contract.customerName}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {commonT("export")}
          </Button>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t("table.amount")}</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(contract.value, locale)}
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
                <p className="text-xs text-slate-500 mb-1">{commonT("details")}</p>
                <p className="text-lg font-bold text-indigo-600">
                  {formatDate(contract.startDate, locale)} - {formatDate(contract.endDate, locale)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-indigo-100">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-white border-slate-200/60 shadow-sm border-t-4 ${daysRemaining <= 30 ? "border-t-amber-500" : "border-t-blue-500"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Time Remaining</p>
                <p className={`text-2xl font-bold ${daysRemaining <= 30 ? "text-amber-600" : "text-blue-600"}`}>
                  {daysRemaining} days
                </p>
              </div>
              <div className={`p-3 rounded-full ${daysRemaining <= 30 ? "bg-amber-100" : "bg-blue-100"}`}>
                <Clock className={`h-5 w-5 ${daysRemaining <= 30 ? "text-amber-600" : "text-blue-600"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contract Document
            </CardTitle>
            <CardDescription>Preview of the contract PDF</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="aspect-[8.5/11] bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center">
              <FileSignature className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">{contract.name}</p>
              <Button variant="outline" className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                {commonT("export")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Contract Terms</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">{t("table.start_date")}</span>
                <span className="text-sm font-medium text-slate-900">{formatDate(contract.startDate, locale)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">{t("table.end_date")}</span>
                <span className="text-sm font-medium text-slate-900">{formatDate(contract.endDate, locale)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Payment Terms</span>
                <span className="text-sm font-medium text-slate-900">{contract.terms.paymentTerms}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Customer Contact</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{contract.customerContact}</p>
                <p className="text-xs text-slate-500">{contract.customerName}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4" />
                {contract.customerEmail}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
