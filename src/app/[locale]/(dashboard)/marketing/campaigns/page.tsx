"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Facebook,
  Globe,
  Mail,
  Music2,
  Linkedin,
  Youtube,
  Share2,
} from "lucide-react";
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
  mockCampaigns,
  getCampaignStatusColor,
} from "@/lib/mock-data/marketing";
import { Plus, Search, Filter, X, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { CampaignWizard } from "@/components/marketing/campaign-wizard";
import { DateRangeFilter } from "@/components/common/date-range-filter";

export default function CampaignsPage() {
  const t = useTranslations("marketing");
  const ts = useTranslations("status");
  const tc = useTranslations("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [wizardOpen, setWizardOpen] = useState(false);
  const itemsPerPage = 6;

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesDate = !dateRange?.from || !dateRange?.to || !campaign.createdAt ||
      (new Date(campaign.createdAt) >= dateRange.from && new Date(campaign.createdAt) <= dateRange.to);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "facebook": return <Facebook className="h-4 w-4 text-blue-600" />;
      case "google": return <Globe className="h-4 w-4 text-emerald-600" />;
      case "tiktok": return <Music2 className="h-4 w-4 text-pink-600" />;
      case "linkedin": return <Linkedin className="h-4 w-4 text-blue-700" />;
      case "youtube": return <Youtube className="h-4 w-4 text-red-600" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select 
          value={statusFilter} 
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
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
        <DateRangeFilter
          date={dateRange}
          setDate={(date) => { setDateRange(date); setCurrentPage(1); }}
          placeholder={t("createdAt") || tc("createdAt")}
        />

        {(searchQuery || statusFilter !== "all" || dateRange) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setDateRange(undefined);
              setCurrentPage(1);
            }}
            className="h-10 px-2 text-slate-500 hover:text-slate-900"
          >
            <X className="h-4 w-4 mr-1" />
            {tc("clear")}
          </Button>
        )}
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-slate-700">{t("campaignName")}</TableHead>
                <TableHead className="font-semibold text-slate-700">{t("status")}</TableHead>
                <TableHead className="font-semibold text-slate-700">{t("performance")}</TableHead>
                <TableHead className="font-semibold text-slate-700">{t("type")}</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">{tc("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    {tc("noData")}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-slate-100 shrink-0">
                          {getChannelIcon(campaign.type)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-slate-900 truncate">{campaign.name}</span>
                          {campaign.subject && <span className="text-xs text-slate-500 truncate max-w-[200px]">{campaign.subject}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCampaignStatusColor(campaign.status)}>
                        {ts(campaign.status.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.status === "sent" ? (
                        <div className="flex items-center gap-3 text-xs">
                          {campaign.type === "email" ? (
                            <>
                              <div className="flex flex-col">
                                <span className="text-slate-500">{t("open")}</span>
                                <span className="font-medium text-emerald-600">{campaign.openRate}%</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-500">{t("click")}</span>
                                <span className="font-medium text-blue-600">{campaign.clickRate}%</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col">
                                <span className="text-slate-500">{t("metrics.reach")}</span>
                                <span className="font-medium text-slate-900">{campaign.reach ? (campaign.reach / 1000).toFixed(1) + "K" : "-"}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-500">{t("click")}</span>
                                <span className="font-medium text-blue-600">{campaign.clickRate}%</span>
                              </div>
                            </>
                          )}
                        </div>
                      ) : campaign.status === "sending" ? (
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span>{Math.round(((campaign.sentCount || 0) / (campaign.recipientCount || 1)) * 100)}%</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500" 
                              style={{ width: `${((campaign.sentCount || 0) / (campaign.recipientCount || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        {t("channels." + campaign.type)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <BarChart3 className="h-4 w-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {t("showing")} <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
              {t("to")}{" "}
              <span className="font-medium text-slate-900">
                {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)}
              </span>{" "}
              {t("of")} <span className="font-medium text-slate-900">{filteredCampaigns.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {tc("previous")}
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 p-0 ${currentPage === page ? "bg-indigo-600" : ""}`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2"
              >
                {tc("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <CampaignWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
