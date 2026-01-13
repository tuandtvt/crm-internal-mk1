"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  PhoneCall,
  Send,
  DollarSign,
  TrendingUp,
  Check,
  Clock,
  MessageSquare,
} from "lucide-react";

// Mock customer data
const customer = {
  id: "1",
  name: "John Anderson",
  title: "VP of Technology",
  email: "john.anderson@techcorp.com",
  phone: "+1-555-0123",
  address: "123 Tech Boulevard, San Francisco, CA 94102",
  website: "www.techcorp.com",
  company: "TechCorp Inc.",
  type: "vip",
  industry: "Technology",
  source: "website",
  owner: "Jane Smith",
  totalRevenue: 485000,
  activeDeals: 3,
  createdAt: new Date("2024-06-15"),
};

// Mock activity timeline
const activities = [
  {
    id: 1,
    type: "call",
    title: "Call with Sarah",
    description: "Discussed Q2 renewal options",
    time: "10:00 AM",
    date: "Today",
    icon: Phone,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: 2,
    type: "email",
    title: "Email: Proposal Sent",
    description: "Enterprise license proposal for 2026",
    time: "2:30 PM",
    date: "Yesterday",
    icon: Mail,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 3,
    type: "system",
    title: "Updated to VIP status",
    description: "Customer tier upgraded based on revenue",
    time: "9:15 AM",
    date: "Jan 10, 2026",
    icon: TrendingUp,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    type: "note",
    title: "Meeting Notes Added",
    description: "Quarterly business review summary",
    time: "3:00 PM",
    date: "Jan 8, 2026",
    icon: MessageSquare,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 5,
    type: "task",
    title: "Task Completed",
    description: "Follow-up on contract terms",
    time: "11:30 AM",
    date: "Jan 5, 2026",
    icon: Check,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: locale === "vi" ? "VND" : "USD",
    minimumFractionDigits: 0,
  }).format(locale === "vi" ? value * 25000 : value);
}

export default function CustomerDetailPage() {
  const t = useTranslations("customers");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <Link 
        href="/sales/customers" 
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {commonT("previous")}
      </Link>

      <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-indigo-500">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 lg:h-20 lg:w-20">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl lg:text-2xl font-bold">
                  {customer.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                    {customer.name}
                  </h1>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    VIP
                  </Badge>
                </div>
                <p className="text-slate-600 mt-1">{customer.title}</p>
                <p className="text-sm text-slate-500">{customer.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {commonT("edit")}
              </Button>
              <Button variant="outline" size="sm">
                <PhoneCall className="h-4 w-4 mr-2" />
                {commonT("note")}
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">
                <Send className="h-4 w-4 mr-2" />
                {commonT("export")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="overview">{commonT("overview")}</TabsTrigger>
          <TabsTrigger value="activity">{commonT("details")}</TabsTrigger>
          <TabsTrigger value="deals">{commonT("team")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white border-slate-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {commonT("details")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Mail className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <a href={`mailto:${customer.email}`} className="text-sm text-indigo-600 hover:underline">
                        {customer.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Phone className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t("table.phone")}</p>
                      <p className="text-sm text-slate-900">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <MapPin className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{commonT("details")}</p>
                      <p className="text-sm text-slate-900">{customer.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Globe className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Website</p>
                      <a href={`https://${customer.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                        {customer.website}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-white border-slate-200/60 shadow-sm border-l-4 border-l-emerald-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{t("totalRevenue") || "Revenue"}</p>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">
                        {formatCurrency(customer.totalRevenue, locale)}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-emerald-100">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200/60 shadow-sm border-l-4 border-l-indigo-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{t("activeDeal") || "Deals"}</p>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">
                        {customer.activeDeals}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-100">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {commonT("details")} Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200" />
                <div className="space-y-6">
                  {activities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="relative flex gap-4">
                        <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${activity.iconBg}`}>
                          <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-900">
                              {activity.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">
                              <Clock className="h-3 w-3" />
                              {activity.time} · {activity.date}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
