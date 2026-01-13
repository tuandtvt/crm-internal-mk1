"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockCampaigns,
  getCampaignStatusColor,
} from "@/lib/mock-data/marketing";
import { formatNumber } from "@/lib/utils";
import { Plus, Search, Filter } from "lucide-react";
import { CampaignWizard } from "@/components/marketing/campaign-wizard";

export default function CampaignsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("marketing");
  const ts = useTranslations("status");
  const tc = useTranslations("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [wizardOpen, setWizardOpen] = useState(false);

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("campaigns")}</h1>
          <p className="text-slate-600 mt-1">{t("managerDescription") || t("description")}</p>
        </div>
        <Button
          className="bg-gradient-premium hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setWizardOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("createCampaign")}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={tc("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("all")}</SelectItem>
            <SelectItem value="draft">{ts("DRAFT")}</SelectItem>
            <SelectItem value="scheduled">{ts("SCHEDULED")}</SelectItem>
            <SelectItem value="sending">{ts("SENDING")}</SelectItem>
            <SelectItem value="sent">{ts("SENT")}</SelectItem>
            <SelectItem value="paused">{ts("PAUSED")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="bg-white border-slate-200/60 shadow-sm hover:shadow-md transition-all hover-lift cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-32 h-24 rounded-lg bg-gradient-subtle border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl">📧</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                        <Badge className={getCampaignStatusColor(campaign.status)}>
                          {ts(campaign.status.toUpperCase())}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{campaign.subject}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>📤 {campaign.type.toUpperCase()}</span>
                        <span>👤 {campaign.createdBy}</span>
                        <span>📁 {campaign.audienceSegment}</span>
                      </div>
                    </div>
                  </div>

                  {campaign.status === "sending" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">{t("sendingProgress")}</span>
                        <span className="text-slate-700 font-medium">
                          {campaign.sentCount} / {campaign.recipientCount}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-premium transition-all"
                          style={{
                            width: `${(campaign.sentCount / campaign.recipientCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {campaign.status === "sent" && (
                    <div className="flex items-center gap-6 mt-3">
                      <div className="text-sm">
                        <span className="text-slate-500">{t("totalRecipients")}: </span>
                        <span className="font-medium text-slate-900">
                          {formatNumber(campaign.recipientCount)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500">{t("open")}: </span>
                        <span className="font-medium text-emerald-600">{campaign.openRate}%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500">{t("click")}: </span>
                        <span className="font-medium text-blue-600">{campaign.clickRate}%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500">{t("conversion")}: </span>
                        <span className="font-medium text-violet-600">{campaign.conversionRate}%</span>
                      </div>
                    </div>
                  )}

                  {campaign.status === "scheduled" && campaign.scheduledDate && (
                    <div className="mt-3 text-sm text-blue-600">
                      📅 {t("scheduledFor")} {campaign.scheduledDate.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCampaigns.length === 0 && (
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">{tc("noData")}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <CampaignWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
