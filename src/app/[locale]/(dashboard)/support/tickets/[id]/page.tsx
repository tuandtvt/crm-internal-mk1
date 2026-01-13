"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations, useLocale } from "next-intl";
import {
  mockTickets,
  mockConversations,
  getTicketStatusColor,
  getTicketPriorityColor,
  getSLATimeRemaining,
  calculateSLAProgress,
} from "@/lib/mock-data/support";
import { Clock, Send, Paperclip } from "lucide-react";
import { ConversationBubble } from "@/components/support/conversation-bubble";

export default function TicketDetailPage({ 
  params: { id, locale } 
}: { 
  params: { id: string; locale: string } 
}) {
  const t = useTranslations("support");
  const commonT = useTranslations("common");
  const ts = useTranslations("status");
  
  const ticket = mockTickets.find((t) => t.id === id) || mockTickets[0];
  const messages = mockConversations[ticket.id] || [];
  const slaProgress = calculateSLAProgress(ticket);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{ticket.title}</h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
          <span>{ticket.customerName}</span>
          <span>•</span>
          <span>{ticket.customerEmail}</span>
          <span>•</span>
          <span>{t("title")} #{ticket.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg">{t("viewFullConversation")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <ConversationBubble key={message.id} message={message} />
                ))}
              </div>

              <div className="border-t border-slate-100 p-4">
                <Textarea
                  placeholder="..."
                  rows={3}
                  className="mb-3 resize-none"
                />
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Paperclip className="h-4 w-4 mr-2" />
                    {commonT("import")}
                  </Button>
                  <Button className="bg-gradient-premium cursor-pointer">
                    <Send className="h-4 w-4 mr-2" />
                    {commonT("export")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">{t("details.assignedTo") || "Customer"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-premium text-white">
                    {ticket.customerName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">{ticket.customerName}</p>
                  <p className="text-sm text-slate-600">{ticket.customerEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-slate-200/60 shadow-sm ${slaProgress > 80 ? "bg-red-50" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("details.slaDeadline")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold text-slate-900">
                {getSLATimeRemaining(ticket.slaDeadline)}
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    slaProgress > 80 ? "bg-red-500" : slaProgress > 50 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${slaProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-600">
                Deadline: {ticket.slaDeadline.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">{t("details.status")} & {t("details.priority")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-slate-500 block mb-1">{t("details.status")}</span>
                <Badge className={`${getTicketStatusColor(ticket.status)} w-full justify-center`}>
                  {ts(ticket.status.toUpperCase())}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-slate-500 block mb-1">{t("details.priority")}</span>
                <Badge className={`${getTicketPriorityColor(ticket.priority)} w-full justify-center`}>
                  {ts(ticket.priority)}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-slate-500 block mb-1">{t("details.category")}</span>
                <Badge variant="outline" className="w-full justify-center capitalize">
                  {ticket.category}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {ticket.assignedTo && (
            <Card className="bg-white border-slate-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">{t("details.assignedTo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                      {ticket.assignedTo.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-900">{ticket.assignedTo}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">{t("details.tags")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                {ticket.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
