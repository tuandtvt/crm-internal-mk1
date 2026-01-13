"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Globe,
  Users as UsersIcon,
  MessageSquare,
  Phone,
  Calendar,
  Zap,
  User,
  Mail,
  Building2,
  MapPin,
  Camera,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
  Lightbulb,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/types";
import { mockCustomers } from "@/lib/mock-data/customers";

// Company options (should probably come from translations/DB too, but keeping ID based for now)
const COMPANIES = [
  { id: "techcorp", label: "TechCorp Inc." },
  { id: "startupxyz", label: "StartupXYZ" },
  { id: "megacorp", label: "MegaCorp Ltd." },
  { id: "financehub", label: "FinanceHub" },
  { id: "retailmax", label: "RetailMax" },
  { id: "healthcare", label: "HealthCare+" },
  { id: "other", label: "Other (New Company)" },
];

// Format relative time (localized)
function formatRelativeTime(date: Date, locale: string, t: (key: string, values?: any) => string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays > 30) {
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "short", day: "numeric" });
  }
  if (diffDays > 0) return t("recentActivity.hoursAgo", { count: diffDays * 24 });
  if (diffHours > 0) return t("recentActivity.hoursAgo", { count: diffHours });
  return t("recentActivity.justNow");
}

// Enhanced Side Sheet for Creating/Editing Customers
function CustomerSheet({ 
  open, 
  onOpenChange,
  customer,
  onSave,
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  onSave: (data: Partial<Customer>) => void;
}) {
  const t = useTranslations("customers");
  const isEditing = !!customer;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: customer?.name.split(" ")[0] || "",
    lastName: customer?.name.split(" ")[1] || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    company: customer?.company_name || "",
    position: "",
    source: customer?.source || "",
    status: customer?.type || "lead",
    address: "",
    // B2B Fields
    website: customer?.website || "",
    industry: customer?.industry || "",
    linkedIn: customer?.linkedin_url || "",
    leadNote: customer?.lead_note || "",
    competitors: customer?.competitors || "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    toast.loading(isEditing ? t("updating") : t("creating"));
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.dismiss();
    setIsSubmitting(false);
    
    onSave({
      ...customer,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.company,
      source: formData.source,
      type: formData.status as "lead" | "prospect" | "vip",
    });
    
    toast.success(isEditing ? t("updateCustomer") : t("createCustomer"));
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <div className="px-6 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditing ? t("editCustomer") : t("addNew")}
              </h2>
              <p className="text-sm text-slate-500">
                {isEditing ? t("updateCustomer") : t("createCustomer")}
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-slate-300" />
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                {t("personalInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder={t("firstName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder={t("lastName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      placeholder="email@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder={t("phone")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" />
                {t("companyInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">{t("company")}</Label>
                  <Select 
                    value={formData.company} 
                    onValueChange={(value) => setFormData({ ...formData, company: value })}
                  >
                    <SelectTrigger id="company">
                      <SelectValue placeholder={t("company")} />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANIES.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">{t("position")}</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder={t("position")}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                {t("sourceAndStatus")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">{t("leadSource")}</Label>
                  <Select 
                    value={formData.source} 
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder={t("leadSource")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="cold-call">Cold Call</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t("customerStatus")}</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">{t("lead")}</SelectItem>
                      <SelectItem value="prospect">{t("prospect")}</SelectItem>
                      <SelectItem value="vip">{t("vip")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Company Profile Section - B2B Fields */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" />
                {t("companyProfile")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">{t("website")}</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="pl-10"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">{t("industry")}</Label>
                  <Select 
                    value={formData.industry} 
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder={t("industry")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EdTech">EdTech</SelectItem>
                      <SelectItem value="HealthTech">HealthTech</SelectItem>
                      <SelectItem value="FinTech">FinTech</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="linkedIn">{t("linkedIn")}</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="linkedIn"
                      value={formData.linkedIn}
                      onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                      className="pl-10"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Intelligence Section - B2B Fields */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-slate-500" />
                {t("intelligence")}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leadNote">{t("leadNote")}</Label>
                  <Textarea
                    id="leadNote"
                    value={formData.leadNote}
                    onChange={(e) => setFormData({ ...formData, leadNote: e.target.value })}
                    placeholder="e.g., Vừa gọi vốn Series B 15 tỷ, đang mở rộng thị trường..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitors">{t("competitors")}</Label>
                  <Input
                    id="competitors"
                    value={formData.competitors}
                    onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                    placeholder="e.g., Giống Fluentgo, ELSA Speak, Topica"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                {t("address")}
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t("address")}
                rows={3}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("cancel", { namespace: "common" })}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? t("updating") : t("creating")}
              </>
            ) : (
              isEditing ? t("updateCustomer") : t("createCustomer")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function CustomersPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("customers");
  const td = useTranslations("dashboard");
  const tc = useTranslations("common");
  const tt = useTranslations("toast");
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "John Anderson", email: "john.anderson@techcorp.com", phone: "+1-555-0123", company: "TechCorp Inc.", industry: "Technology", source: "website", type: "vip", owner: "Jane Smith", updatedAt: new Date("2026-01-10") },
    { id: "2", name: "Sarah Williams", email: "sarah.w@startupxyz.io", phone: "+1-555-0124", company: "StartupXYZ", industry: "Technology", source: "referral", type: "prospect", owner: "John Doe", updatedAt: new Date("2026-01-08") },
    { id: "3", name: "Michael Chen", email: "m.chen@megacorp.com", phone: "+1-555-0125", company: "MegaCorp Ltd.", industry: "Manufacturing", source: "event", type: "lead", owner: "Sarah Connor", updatedAt: new Date("2026-01-05") },
    { id: "4", name: "Emily Davis", email: "emily.davis@financehub.com", phone: "+1-555-0126", company: "FinanceHub", industry: "Finance", source: "cold-call", type: "prospect", owner: "Jane Smith", updatedAt: new Date("2026-01-03") },
    { id: "5", name: "Robert Johnson", email: "r.johnson@retailmax.com", phone: "+1-555-0127", company: "RetailMax", industry: "Retail", source: "partner", type: "vip", owner: "John Doe", updatedAt: new Date("2026-01-12") },
    { id: "6", name: "Lisa Thompson", email: "lisa.t@healthcare-plus.org", phone: "+1-555-0128", company: "HealthCare+", industry: "Healthcare", source: "website", type: "lead", owner: "Sarah Connor", updatedAt: new Date("2025-12-28") },
  ]);

  const CUSTOMER_TYPES = {
    lead: { label: t("lead"), bgColor: "bg-blue-100", textColor: "text-blue-700" },
    prospect: { label: t("prospect"), bgColor: "bg-indigo-100", textColor: "text-indigo-700" },
    vip: { label: t("vip"), bgColor: "bg-emerald-100", textColor: "text-emerald-700" },
  } as const;

  const SOURCES = [
    { id: "website", label: "Website", icon: Globe },
    { id: "referral", label: "Referral", icon: UsersIcon },
    { id: "social", label: "Social Media", icon: MessageSquare },
    { id: "cold-call", label: "Cold Call", icon: Phone },
    { id: "event", label: "Event", icon: Calendar },
    { id: "partner", label: "Partner", icon: Zap },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === "all" || customer.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsSheetOpen(true);
  };

  const handleSave = (data: Partial<Customer>) => {
    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.id === selectedCustomer.id ? { ...c, ...data, updatedAt: new Date() } : c
      ));
    } else {
      const { id: _id, ...rest } = data; // Prefix with _ to show it's intentionally unused
      const newCustomer: Customer = {
        id: String(customers.length + 1),
        ...rest as Omit<Customer, 'id'>,
        industry: "Technology",
        owner: "Current User",
        updatedAt: new Date(),
      };
      setCustomers([...customers, newCustomer]);
    }
  };

  const handleDeleteConfirm = () => {
    if (!customerToDelete) return;
    
    toast.loading(tt("deletingCustomer"));
    setTimeout(() => {
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      toast.dismiss();
      toast.success(`${customerToDelete.name} ${tt("customerDeleted")}`);
      setCustomerToDelete(null);
    }, 1000);
  };

  const handleImport = () => {
    toast.loading(tt("importingCSV"));
    setTimeout(() => {
      toast.dismiss();
      toast.success(`6 ${tt("customersImported")}`);
    }, 2000);
  };

  const handleExport = () => {
    toast.loading(tt("preparingExport"));
    setTimeout(() => {
      toast.dismiss();
      toast.success(tt("downloadStarted"));
    }, 1500);
  };

  function getSourceIcon(sourceId: string) {
    const source = SOURCES.find((s) => s.id === sourceId);
    if (!source) return <Globe className="h-4 w-4" />;
    const Icon = source.icon;
    return <Icon className="h-4 w-4" />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("description")}
          </p>
        </div>
        
        <Button 
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("newCustomer")}
        </Button>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-1 gap-3 items-center flex-wrap w-full lg:w-auto">
              <div className="relative flex-1 min-w-[200px] lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t("source")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allSources")}</SelectItem>
                  {SOURCES.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleImport} className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {tc("import")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                {tc("export")}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 mt-3">
            {filteredCustomers.length} {t("customersCount")}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="min-w-[800px] px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="text-slate-700 font-semibold">{t("table.name")}</TableHead>
                    <TableHead className="text-slate-700 font-semibold">{t("table.company")}</TableHead>
                    <TableHead className="text-slate-700 font-semibold">{t("source")}</TableHead>
                    <TableHead className="text-slate-700 font-semibold">{t("table.status")}</TableHead>
                    <TableHead className="text-slate-700 font-semibold">{t("lastActivity")}</TableHead>
                    <TableHead className="text-slate-700 font-semibold">{t("table.owner")}</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const typeConfig = CUSTOMER_TYPES[customer.type];
                    const sourceConfig = SOURCES.find((s) => s.id === customer.source);
                    
                    return (
                      <TableRow key={customer.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-medium">
                                {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link 
                                href={`/sales/customers/${customer.id}`}
                                className="font-medium text-slate-900 hover:text-indigo-600 hover:underline decoration-indigo-500 underline-offset-4 transition-colors"
                              >
                                {customer.name}
                              </Link>
                              <p className="text-xs text-slate-500">{customer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{customer.company}</p>
                            <Badge variant="secondary" className="mt-1 text-xs font-normal">
                              {customer.industry}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-600">
                            {getSourceIcon(customer.source)}
                            <span className="text-sm">{sourceConfig?.label || customer.source}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${typeConfig.bgColor} ${typeConfig.textColor} hover:${typeConfig.bgColor}`}>
                            {typeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">
                            {formatRelativeTime(customer.updatedAt, locale, td)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                                {customer.owner.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-600 hidden xl:inline">
                              {customer.owner}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(customer)} className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                {tc("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setCustomerToDelete(customer)}
                                className="text-red-600 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {tc("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomerSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen}
        customer={selectedCustomer}
        onSave={handleSave}
      />

      <AlertDialog open={!!customerToDelete} onOpenChange={() => setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteCustomer")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirm")} <strong>{customerToDelete?.name}</strong>? 
              {t("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
