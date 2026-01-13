"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockTickets,
  getTicketStatusColor,
  getTicketPriorityColor,
  getSLATimeRemaining,
} from "@/lib/mock-data/support";
import { Search, Clock, User } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function TicketsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("support");
  const ts = useTranslations("status");
  const tc = useTranslations("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="text-slate-600 mt-1">{t("description")}</p>
      </div>

      {/* Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchTickets")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("status.all")}</SelectItem>
                <SelectItem value="new">{t("status.new")}</SelectItem>
                <SelectItem value="open">{t("status.open")}</SelectItem>
                <SelectItem value="pending">{t("status.pending")}</SelectItem>
                <SelectItem value="resolved">{t("status.resolved")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets List */}
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTicket.id === ticket.id
                    ? "border-violet-300 bg-violet-50/50"
                    : "border-slate-200 hover:border-violet-200"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-premium text-white text-sm">
                        {ticket.customerName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-slate-900 line-clamp-1 mb-1">
                        {ticket.title}
                      </h3>
                      <p className="text-xs text-slate-600 mb-2">{ticket.customerName}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getTicketPriorityColor(ticket.priority)} text-xs`}>
                          {ts(ticket.priority.toUpperCase())}
                        </Badge>
                        <Badge className={`${getTicketStatusColor(ticket.status)} text-xs`}>
                          {ts(ticket.status === "new" ? "NEW" : ticket.status === "open" ? "OPEN" : ticket.status === "pending" ? "PENDING" : "RESOLVED")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{t("sla")}: {getSLATimeRemaining(ticket.slaDeadline)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Ticket Detail Preview */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200/60 shadow-sm h-full">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{selectedTicket.title}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{selectedTicket.customerName}</span>
                    </div>
                    <span>•</span>
                    <span>{selectedTicket.customerEmail}</span>
                  </div>
                </div>
                <Link href={`/support/tickets/${selectedTicket.id}`}>
                  <Badge className="bg-violet-100 text-violet-700 cursor-pointer hover:bg-violet-200">
                    {t("viewFullConversation")}
                  </Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Status & Priority */}
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-slate-500 block mb-1">{t("details.status")}</span>
                  <Badge className={getTicketStatusColor(selectedTicket.status)}>
                    {ts(selectedTicket.status === "new" ? "NEW" : selectedTicket.status === "open" ? "OPEN" : selectedTicket.status === "pending" ? "PENDING" : "RESOLVED")}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-slate-500 block mb-1">{t("details.priority")}</span>
                  <Badge className={getTicketPriorityColor(selectedTicket.priority)}>
                    {ts(selectedTicket.priority.toUpperCase())}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-slate-500 block mb-1">{t("details.category")}</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedTicket.category}
                  </Badge>
                </div>
                <div className="ml-auto">
                  <span className="text-sm text-slate-500 block mb-1">{t("details.slaDeadline")}</span>
                  <div className="text-sm font-medium text-slate-900">
                    {getSLATimeRemaining(selectedTicket.slaDeadline)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">{t("details.description")}</h4>
                <p className="text-sm text-slate-600">{selectedTicket.description}</p>
              </div>

              {/* Assigned To */}
              {selectedTicket.assignedTo && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">{t("details.assignedTo")}</h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                        {selectedTicket.assignedTo.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-700">{selectedTicket.assignedTo}</span>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">{t("details.tags")}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTicket.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-sm text-slate-500 block">{t("details.created")}</span>
                  <span className="text-sm text-slate-900">{selectedTicket.createdAt.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}</span>
                </div>
                <div>
                  <span className="text-sm text-slate-500 block">{t("details.lastUpdated")}</span>
                  <span className="text-sm text-slate-900">{selectedTicket.updatedAt.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
