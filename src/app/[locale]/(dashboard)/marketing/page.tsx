"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  mockCampaignAnalytics,
  mockCampaigns,
  formatNumber,
  getCampaignStatusColor,
} from "@/lib/mock-data/marketing";
import { TrendingUp, Mail, MousePointerClick, Users, Plus, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function MarketingPage() {
  const t = useTranslations("marketing");
  const ts = useTranslations("status");
  const tc = useTranslations("common");
  const analytics = mockCampaignAnalytics;
  const recentCampaigns = mockCampaigns.slice(0, 5);

  const stats = [
    {
      title: t("totalCampaigns"),
      value: analytics.totalCampaigns.toString(),
      change: "+12",
      changeLabel: t("thisMonth"),
      icon: Mail,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      borderColor: "border-t-violet-500",
    },
    {
      title: t("avgOpenRate"),
      value: `${analytics.avgOpenRate}%`,
      change: "+2.5%",
      changeLabel: t("vsLastMonth"),
      icon: TrendingUp,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-t-emerald-500",
    },
    {
      title: t("avgClickRate"),
      value: `${analytics.avgClickRate}%`,
      change: "+1.8%",
      changeLabel: t("vsLastMonth"),
      icon: MousePointerClick,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-t-blue-500",
    },
    {
      title: t("totalRecipients"),
      value: formatNumber(analytics.totalRecipients),
      change: "+18%",
      changeLabel: t("vsLastMonth"),
      icon: Users,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      borderColor: "border-t-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("title")}</h1>
          <p className="text-slate-600 mt-1">{t("description")}</p>
        </div>
        <Link href="/marketing/campaigns">
          <Button className="bg-gradient-premium hover:shadow-lg transition-shadow cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            {t("createCampaign")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`bg-white border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 ${stat.borderColor} hover-lift cursor-pointer`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`p-3 rounded-full ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-medium text-emerald-600">{stat.change}</span>
                  <span className="text-xs text-slate-500">{stat.changeLabel}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">{t("recentCampaigns")}</CardTitle>
          <Link href="/marketing/campaigns">
            <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 cursor-pointer">
              {t("viewAll")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-violet-200 hover:bg-slate-50/50 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-slate-900 truncate">{campaign.name}</h3>
                    <Badge className={getCampaignStatusColor(campaign.status)}>{ts(campaign.status.toUpperCase())}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{campaign.subject}</p>
                  {campaign.status === "sent" && (
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-slate-600">
                        📧 {formatNumber(campaign.recipientCount)} {t("sent")}
                      </span>
                      <span className="text-emerald-600">📊 {campaign.openRate}% {t("open")}</span>
                      <span className="text-blue-600">👆 {campaign.clickRate}% {t("click")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">{t("performanceTrend")}</CardTitle>
          <p className="text-sm text-slate-500">{t("last7Days")}</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.trend.map((day, idx) => {
              const maxSent = Math.max(...analytics.trend.map((d) => d.sent));
              const height = (day.sent / maxSent) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full bg-slate-100 rounded-t-lg overflow-hidden" style={{ height: `${height}%` }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-premium opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${(day.opened / day.sent) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{day.date.split("-")[2]}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-slate-200" />
              <span className="text-slate-600">{t("legendSent")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-gradient-premium" />
              <span className="text-slate-600">{t("legendOpened")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
