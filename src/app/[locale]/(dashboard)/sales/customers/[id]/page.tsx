"use client";

import { useState, useMemo, use } from "react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Send,
  DollarSign,
  TrendingUp,
  Clock,
  MessageSquare,
  Copy,
  Check,
  Plus,
  X,
  PhoneCall,
  CalendarPlus,
  Tag,
  Hash,
  Users,
  Building2,
} from "lucide-react";

import { mockCustomers, getCustomerById } from "@/lib/mock-data/customers";
import { LEAD_STATUSES, getStatusById, getStatusColor } from "@/lib/mock-data/status";
import type { Customer, InteractionHistoryItem } from "@/types";

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: locale === "vi" ? "VND" : "USD",
    minimumFractionDigits: 0,
  }).format(locale === "vi" ? value * 25000 : value);
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const interactionTypeConfig = {
  NOTE: { icon: MessageSquare, bgColor: "bg-amber-100", textColor: "text-amber-600" },
  CALL: { icon: PhoneCall, bgColor: "bg-emerald-100", textColor: "text-emerald-600" },
  MEETING: { icon: Users, bgColor: "bg-indigo-100", textColor: "text-indigo-600" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations("customers");
  const commonT = useTranslations("common");
  const locale = useLocale();
  
  // Get customer from mock data
  const customerId = parseInt(id, 10);
  const initialCustomer = getCustomerById(customerId);
  
  // Local state for customer data (simulating edits)
  const [customer, setCustomer] = useState<Customer | undefined>(initialCustomer);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Tags management
  const [newTag, setNewTag] = useState("");
  
  // Interaction history
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"NOTE" | "CALL" | "MEETING">("NOTE");
  
  // Copy state
  const [copied, setCopied] = useState(false);
  
  // Task dialog
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Customer not found</p>
      </div>
    );
  }

  // Get status info
  const status = customer.status_id ? getStatusById(customer.status_id) : null;
  const statusColorClass = status ? getStatusColor("LEAD", status.code) : "bg-slate-100 text-slate-700";

  // Handlers
  const handleAddTag = () => {
    if (newTag.trim() && customer) {
      const updatedTags = [...(customer.tags || []), newTag.trim()];
      setCustomer({ ...customer, tags: updatedTags });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (customer) {
      const updatedTags = (customer.tags || []).filter((tag) => tag !== tagToRemove);
      setCustomer({ ...customer, tags: updatedTags });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCopyRefCode = async () => {
    if (customer?.ref_code) {
      await navigator.clipboard.writeText(customer.ref_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() && customer) {
      const newEntry: InteractionHistoryItem = {
        id: `ih-${Date.now()}`,
        content: newNote.trim(),
        type: noteType,
        created_at: new Date().toISOString(),
        created_by: "Current User",
      };
      const updatedHistory = [newEntry, ...(customer.interaction_history || [])];
      setCustomer({ ...customer, interaction_history: updatedHistory });
      setNewNote("");
    }
  };

  const handleCreateTask = () => {
    // In real app, this would create a task linked to this customer
    console.log("Creating task:", { title: taskTitle, dueDate: taskDueDate, customerId: customer.id });
    setIsTaskDialogOpen(false);
    setTaskTitle("");
    setTaskDueDate("");
  };

  // Calculate metrics
  const totalRevenue = 485000; // Mock value
  const activeDeals = 3; // Mock value

  return (
    <div className="space-y-6">
      <Link 
        href="/sales/customers" 
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {commonT("previous")}
      </Link>

      {/* Header Card */}
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
                  {status && (
                    <Badge className={statusColorClass}>
                      {status.name}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 mt-1">{customer.company_name}</p>
                <p className="text-sm text-slate-500">{customer.code}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {commonT("edit")}
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">
                <Send className="h-4 w-4 mr-2" />
                {commonT("export")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Settings */}
        <div className="space-y-6">
          {/* Contact Details */}
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900">
                {commonT("details")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a href={`mailto:${customer.email}`} className="text-sm text-indigo-600 hover:underline">
                    {customer.email || "-"}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Phone className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{t("table.phone")}</p>
                  <p className="text-sm text-slate-900">{customer.phone || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <MapPin className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Địa chỉ</p>
                  <p className="text-sm text-slate-900">{customer.address || "-"}</p>
                </div>
              </div>
              {customer.website && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Globe className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Website</p>
                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                      {customer.website}
                    </a>
                  </div>
                </div>
              )}
              {customer.industry && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Building2 className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Ngành</p>
                    <p className="text-sm text-slate-900">{customer.industry}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags Section */}
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-600" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(customer.tags || []).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-indigo-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(!customer.tags || customer.tags.length === 0) && (
                  <span className="text-sm text-slate-500">Chưa có tags</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tag mới..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Referral Code Section */}
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Hash className="h-5 w-5 text-indigo-600" />
                Mã giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <code className="flex-1 font-mono text-sm text-slate-900">
                  {customer.ref_code || "N/A"}
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleCopyRefCode}
                  disabled={!customer.ref_code}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-white border-slate-200/60 shadow-sm border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">{t("totalRevenue") || "Revenue"}</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">
                    {formatCurrency(totalRevenue, locale)}
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
                    {activeDeals}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs for Interaction */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white border shadow-sm">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="history">Lịch sử tương tác</TabsTrigger>
              <TabsTrigger value="tasks">Lịch hẹn</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-white border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Ghi chú Lead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{customer.lead_note || "Không có ghi chú"}</p>
                </CardContent>
              </Card>

              {customer.competitors && (
                <Card className="bg-white border-slate-200/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Đối thủ cạnh tranh
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">{customer.competitors}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Interaction History Tab */}
            <TabsContent value="history" className="space-y-4">
              {/* Add Note Section */}
              <Card className="bg-white border-slate-200/60 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Thêm ghi chú mới
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-3">
                    {(["NOTE", "CALL", "MEETING"] as const).map((type) => {
                      const config = interactionTypeConfig[type];
                      const Icon = config.icon;
                      return (
                        <Button
                          key={type}
                          size="sm"
                          variant={noteType === type ? "default" : "outline"}
                          onClick={() => setNoteType(type)}
                          className={noteType === type ? "bg-indigo-600" : ""}
                        >
                          <Icon className="h-4 w-4 mr-1" />
                          {type === "NOTE" ? "Ghi chú" : type === "CALL" ? "Cuộc gọi" : "Meeting"}
                        </Button>
                      );
                    })}
                  </div>
                  <Textarea
                    placeholder="Nhập nội dung ghi chú..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddNote} 
                    disabled={!newNote.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm ghi chú
                  </Button>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-white border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(!customer.interaction_history || customer.interaction_history.length === 0) ? (
                    <p className="text-slate-500 text-center py-8">Chưa có lịch sử tương tác</p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200" />
                      <div className="space-y-6">
                        {customer.interaction_history.map((item) => {
                          const config = interactionTypeConfig[item.type];
                          const Icon = config.icon;
                          return (
                            <div key={item.id} className="relative flex gap-4">
                              <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${config.bgColor}`}>
                                <Icon className={`h-5 w-5 ${config.textColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-slate-900">
                                    {item.type === "NOTE" ? "Ghi chú" : item.type === "CALL" ? "Cuộc gọi" : "Meeting"}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">
                                    <Clock className="h-3 w-3" />
                                    {formatDateTime(item.created_at)}
                                  </div>
                                </div>
                                <p className="text-sm text-slate-600 mt-0.5">
                                  {item.content}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  bởi {item.created_by}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
              <Card className="bg-white border-slate-200/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Lịch hẹn & Nhắc nhở
                  </CardTitle>
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Tạo nhắc nhở
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tạo nhắc nhở mới</DialogTitle>
                        <DialogDescription>
                          Tạo nhắc nhở cho khách hàng {customer.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="taskTitle">Tiêu đề</Label>
                          <Input
                            id="taskTitle"
                            placeholder="VD: Gọi lại khách hàng"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taskDueDate">Thời gian</Label>
                          <Input
                            id="taskDueDate"
                            type="datetime-local"
                            value={taskDueDate}
                            onChange={(e) => setTaskDueDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                          Hủy
                        </Button>
                        <Button 
                          onClick={handleCreateTask}
                          disabled={!taskTitle.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Tạo nhắc nhở
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 text-center py-8">
                    Chưa có lịch hẹn nào. Nhấn "Tạo nhắc nhở" để thêm mới.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
