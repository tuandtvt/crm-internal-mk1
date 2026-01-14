"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  mockTickets,
  mockTicketAuditLogs,
  getTicketStatusColor,
  getTicketPriorityColor,
  getSLATimeRemaining,
  Ticket,
  TicketAuditLog,
} from "@/lib/mock-data/support";
import {
  Search,
  Clock,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Ticket as TicketIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
  History,
  UserPlus,
  ArrowRight,
  FileText,
  Tag,
  X,
  Edit2,
  Save,
} from "lucide-react";
import { DateRangeFilter } from "@/components/common/date-range-filter";

// Constants
const PAGE_SIZE = 10;

// Audit log action descriptions
function getAuditLogDescription(log: TicketAuditLog, t: (key: string) => string): string {
  switch (log.action) {
    case "created":
      return t("auditLog.created");
    case "status_changed":
      return `${t("auditLog.statusChanged")} ${log.previousValue} → ${log.newValue}`;
    case "priority_changed":
      return `${t("auditLog.priorityChanged")} ${log.previousValue} → ${log.newValue}`;
    case "assigned":
      return `${t("auditLog.assigned")} ${log.newValue}`;
    case "updated":
      return t("auditLog.updated");
    case "category_changed":
      return `${t("auditLog.categoryChanged")} ${log.previousValue} → ${log.newValue}`;
    default:
      return t("auditLog.updated");
  }
}

function getAuditLogIcon(action: TicketAuditLog["action"]) {
  switch (action) {
    case "created":
      return <Plus className="h-3.5 w-3.5" />;
    case "status_changed":
      return <ArrowRight className="h-3.5 w-3.5" />;
    case "priority_changed":
      return <AlertCircle className="h-3.5 w-3.5" />;
    case "assigned":
      return <UserPlus className="h-3.5 w-3.5" />;
    default:
      return <History className="h-3.5 w-3.5" />;
  }
}

export default function TicketsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("support");
  const ts = useTranslations("status");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  
  // Read filters from URL
  const searchQuery = searchParams.get("q") || "";
  const statusParam = searchParams.get("status")?.split(",").filter(Boolean) || [];
  const priorityParam = searchParams.get("priority")?.split(",").filter(Boolean) || [];

  // State for non-URL filters and other state
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTicket, setEditingTicket] = useState<{
    title: string;
    description: string;
    status: Ticket["status"];
    priority: Ticket["priority"];
    category: Ticket["category"];
    assignedTo: string;
  } | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium" as Ticket["priority"],
    category: "general" as Ticket["category"],
    customerName: "",
    customerEmail: "",
  });

  // Filter tickets
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusParam.length === 0 || statusParam.includes(ticket.status);
    const matchesPriority = priorityParam.length === 0 || priorityParam.includes(ticket.priority);
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const pageCount = Math.ceil(filteredTickets.length / PAGE_SIZE);
  const paginatedTickets = filteredTickets.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  // Stats
  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter((t) => t.status === "open").length,
    pending: mockTickets.filter((t) => t.status === "pending").length,
    resolved: mockTickets.filter((t) => t.status === "resolved").length,
    newCount: mockTickets.filter((t) => t.status === "new").length,
  };

  // Handlers
  const handleViewDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditMode(false);
    setEditingTicket(null);
    setDetailOpen(true);
  };

  const handleStartEdit = () => {
    if (selectedTicket) {
      setEditingTicket({
        title: selectedTicket.title,
        description: selectedTicket.description,
        status: selectedTicket.status,
        priority: selectedTicket.priority,
        category: selectedTicket.category,
        assignedTo: selectedTicket.assignedTo || "",
      });
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingTicket(null);
  };

  const handleSaveEdit = async () => {
    if (!editingTicket || !selectedTicket) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, would update the ticket
    setIsSubmitting(false);
    setIsEditMode(false);
    setEditingTicket(null);
    setDetailOpen(false);
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description || !newTicket.customerName || !newTicket.customerEmail) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setCreateOpen(false);
    setNewTicket({
      title: "",
      description: "",
      priority: "medium",
      category: "general",
      customerName: "",
      customerEmail: "",
    });
  };

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "new": return ts("NEW");
      case "open": return ts("OPEN");
      case "pending": return ts("PENDING");
      case "resolved": return ts("RESOLVED");
      case "closed": return ts("CLOSED");
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">{t("description")}</p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/25 cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("newTicket")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-slate-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <TicketIcon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("stats.total")}</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("status.new")}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.newCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("status.open")}</p>
                <p className="text-2xl font-bold text-amber-600">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("status.pending")}</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("status.resolved")}</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <p className="text-sm text-slate-500">
            {filteredTickets.length} {t("tickets")}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[900px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-700 w-[80px]">ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.title")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("table.customer")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("details.status")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("details.priority")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("details.category")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("details.assignedTo")}</TableHead>
                    <TableHead className="font-semibold text-slate-700">{t("sla")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        onClick={() => handleViewDetail(ticket)}
                        className="hover:bg-slate-50/50 cursor-pointer"
                      >
                        <TableCell className="font-mono text-xs text-slate-500">
                          #{ticket.id}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-900 line-clamp-1">
                            {ticket.title}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gradient-premium text-white text-xs">
                                {ticket.customerName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-600">{ticket.customerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTicketStatusColor(ticket.status)}>
                            {getStatusTranslation(ticket.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTicketPriorityColor(ticket.priority)}>
                            {ts(ticket.priority.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-xs">
                            {ticket.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ticket.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                  {ticket.assignedTo.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-slate-600 hidden xl:inline">
                                {ticket.assignedTo}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={`text-sm ${getSLATimeRemaining(ticket.slaDeadline) === "Overdue" ? "text-red-600 font-medium" : "text-slate-600"}`}>
                            {getSLATimeRemaining(ticket.slaDeadline)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <TicketIcon className="h-8 w-8 mb-2 text-slate-300" />
                          <p>{t("noTickets")}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                {t("page")} {currentPage + 1} / {pageCount}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {tc("previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={currentPage >= pageCount - 1}
                  className="cursor-pointer"
                >
                  {tc("next")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
          {selectedTicket && (
            <>
              {/* Header */}
              <SheetHeader className="px-6 py-5 border-b bg-gradient-to-r from-violet-50 to-white">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <TicketIcon className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-lg line-clamp-2">{selectedTicket.title}</SheetTitle>
                    <SheetDescription className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <span className="font-mono">#{selectedTicket.id}</span>
                      <span>•</span>
                      <span>{selectedTicket.customerName}</span>
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Content - Scrollable */}
              <ScrollArea className="flex-1">
                <div className="px-6 py-6 space-y-6">
                  {/* Status & Priority - Editable in edit mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-slate-500 block mb-1">{t("details.status")}</span>
                      {isEditMode && editingTicket ? (
                        <Select
                          value={editingTicket.status}
                          onValueChange={(v) => setEditingTicket({ ...editingTicket, status: v as Ticket["status"] })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">{t("status.new")}</SelectItem>
                            <SelectItem value="open">{t("status.open")}</SelectItem>
                            <SelectItem value="pending">{t("status.pending")}</SelectItem>
                            <SelectItem value="resolved">{t("status.resolved")}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getTicketStatusColor(selectedTicket.status)}>
                          {getStatusTranslation(selectedTicket.status)}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 block mb-1">{t("details.priority")}</span>
                      {isEditMode && editingTicket ? (
                        <Select
                          value={editingTicket.priority}
                          onValueChange={(v) => setEditingTicket({ ...editingTicket, priority: v as Ticket["priority"] })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">{ts("LOW")}</SelectItem>
                            <SelectItem value="medium">{ts("MEDIUM")}</SelectItem>
                            <SelectItem value="high">{ts("HIGH")}</SelectItem>
                            <SelectItem value="urgent">{ts("URGENT")}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getTicketPriorityColor(selectedTicket.priority)}>
                          {ts(selectedTicket.priority.toUpperCase())}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 block mb-1">{t("details.category")}</span>
                      {isEditMode && editingTicket ? (
                        <Select
                          value={editingTicket.category}
                          onValueChange={(v) => setEditingTicket({ ...editingTicket, category: v as Ticket["category"] })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="bug">Bug</SelectItem>
                            <SelectItem value="feature-request">Feature Request</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className="capitalize">{selectedTicket.category}</Badge>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 block mb-1">{t("details.slaDeadline")}</span>
                      <div className={`text-sm font-medium ${getSLATimeRemaining(selectedTicket.slaDeadline) === "Overdue" ? "text-red-600" : "text-slate-900"}`}>
                        {getSLATimeRemaining(selectedTicket.slaDeadline)}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info - View only */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-500" />
                      {t("table.customer")}
                    </h4>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-premium text-white">
                          {selectedTicket.customerName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{selectedTicket.customerName}</p>
                        <p className="text-sm text-slate-500">{selectedTicket.customerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description - Editable */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      {t("details.description")}
                    </h4>
                    {isEditMode && editingTicket ? (
                      <Textarea
                        value={editingTicket.description}
                        onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
                        rows={4}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                        {selectedTicket.description}
                      </p>
                    )}
                  </div>

                  {/* Assigned To - Editable */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-slate-500" />
                      {t("details.assignedTo")}
                    </h4>
                    {isEditMode && editingTicket ? (
                      <Input
                        value={editingTicket.assignedTo}
                        onChange={(e) => setEditingTicket({ ...editingTicket, assignedTo: e.target.value })}
                        placeholder={t("assigneePlaceholder")}
                      />
                    ) : selectedTicket.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                            {selectedTicket.assignedTo.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-700">{selectedTicket.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </div>

                  {/* Tags - View only */}
                  {!isEditMode && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-500" />
                        {t("details.tags")}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedTicket.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audit Log - View only */}
                  {!isEditMode && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-500" />
                        {t("auditLog.title")}
                      </h4>
                      <div className="space-y-3">
                        {(mockTicketAuditLogs[selectedTicket.id] || []).map((log) => (
                          <div key={log.id} className="flex items-start gap-3 text-sm">
                            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {getAuditLogIcon(log.action)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-700">
                                {getAuditLogDescription(log, t)}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {log.performedBy} • {log.timestamp.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamps - View only */}
                  {!isEditMode && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-sm text-slate-500 block">{t("details.created")}</span>
                        <span className="text-sm text-slate-900">
                          {selectedTicket.createdAt.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block">{t("details.lastUpdated")}</span>
                        <span className="text-sm text-slate-900">
                          {selectedTicket.updatedAt.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit} disabled={isSubmitting} className="cursor-pointer">
                      {tc("cancel")}
                    </Button>
                    <Button 
                      onClick={handleSaveEdit} 
                      disabled={isSubmitting}
                      className="bg-violet-600 hover:bg-violet-700 cursor-pointer min-w-[100px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {tc("loading")}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {tc("save")}
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setDetailOpen(false)} className="cursor-pointer">
                      {tc("close")}
                    </Button>
                    <Button onClick={handleStartEdit} className="bg-violet-600 hover:bg-violet-700 cursor-pointer">
                      <Edit2 className="h-4 w-4 mr-2" />
                      {tc("edit")}
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Ticket Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
          {/* Header */}
          <SheetHeader className="px-6 py-5 border-b bg-gradient-to-r from-violet-50 to-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                <TicketIcon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <SheetTitle className="text-lg">{t("newTicket")}</SheetTitle>
                <SheetDescription className="text-sm text-slate-500">
                  {t("newTicketDescription")}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Form Content - Scrollable */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-500" />
                  {tc("details")}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {t("table.title")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder={t("titlePlaceholder")}
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {t("details.description")} <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder={t("descriptionPlaceholder")}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  {t("table.customer")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      {t("customerName")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      placeholder={t("customerNamePlaceholder")}
                      value={newTicket.customerName}
                      onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={newTicket.customerEmail}
                      onChange={(e) => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Priority & Category */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-slate-500" />
                  {t("details.priority")} & {t("details.category")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">{t("details.priority")}</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as Ticket["priority"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{ts("LOW")}</SelectItem>
                        <SelectItem value="medium">{ts("MEDIUM")}</SelectItem>
                        <SelectItem value="high">{ts("HIGH")}</SelectItem>
                        <SelectItem value="urgent">{ts("URGENT")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t("details.category")}</Label>
                    <Select
                      value={newTicket.category}
                      onValueChange={(value) => setNewTicket({ ...newTicket, category: value as Ticket["category"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="feature-request">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {tc("cancel")}
            </Button>
            <Button
              onClick={handleCreateTicket}
              disabled={isSubmitting || !newTicket.title || !newTicket.description || !newTicket.customerName || !newTicket.customerEmail}
              className="bg-violet-600 hover:bg-violet-700 min-w-[120px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {tc("loading")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("newTicket")}
                </>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
