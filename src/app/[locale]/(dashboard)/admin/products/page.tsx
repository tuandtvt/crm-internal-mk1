"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Package,
  DollarSign,
  Tag,
  Layers,
  Image as ImageIcon,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";

// Product categories
const CATEGORIES = ["Software", "Hardware", "Services", "Consulting", "Training", "Support"];

// Mock products data
const mockProducts = [
  { id: "1", name: "Enterprise CRM License", sku: "CRM-ENT-001", price: 15000, category: "Software", stock: "ACTIVE" as const, image: null },
  { id: "2", name: "Professional CRM License", sku: "CRM-PRO-001", price: 5000, category: "Software", stock: "ACTIVE" as const, image: null },
  { id: "3", name: "Basic CRM License", sku: "CRM-BAS-001", price: 1500, category: "Software", stock: "ACTIVE" as const, image: null },
  { id: "4", name: "Implementation Package", sku: "SVC-IMP-001", price: 25000, category: "Services", stock: "ACTIVE" as const, image: null },
  { id: "5", name: "Custom Integration", sku: "SVC-INT-001", price: 50000, category: "Consulting", stock: "PENDING" as const, image: null },
  { id: "6", name: "Training Workshop", sku: "TRN-WRK-001", price: 3000, category: "Training", stock: "ACTIVE" as const, image: null },
  { id: "7", name: "Premium Support", sku: "SUP-PRM-001", price: 12000, category: "Support", stock: "ACTIVE" as const, image: null },
  { id: "8", name: "API Access Module", sku: "CRM-API-001", price: 8000, category: "Software", stock: "PENDING" as const, image: null },
  { id: "9", name: "Legacy Migration", sku: "SVC-MIG-001", price: 35000, category: "Services", stock: "INACTIVE" as const, image: null },
];

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: locale === "vi" ? "VND" : "USD",
    minimumFractionDigits: 0,
  }).format(locale === "vi" ? value * 25000 : value);
}

function CreateProductSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Sidebar");
  const commonT = useTranslations("Common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    category: "",
    description: "",
    stock: "ACTIVE",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({ name: "", sku: "", price: "", category: "", description: "", stock: "ACTIVE" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <div className="px-6 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t("products")}</h2>
              <p className="text-sm text-slate-500">{commonT("create")}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6">
            <div>
              <Label>{commonT("details")}</Label>
              <div className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Upload</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">{commonT("profile")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">{commonT("save")}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {commonT("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {commonT("loading")}
              </>
            ) : (
              commonT("create")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminProductsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("Sidebar");
  const commonT = useTranslations("Common");
  const ts = useTranslations("Status");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("products")}
          </h1>
          <p className="text-slate-600 mt-1">
            {commonT("team")}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsSheetOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          {commonT("add")}
        </Button>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={commonT("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={commonT("filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{commonT("all")}</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 ml-auto">
              {filteredProducts.length} {t("products").toLowerCase()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          return (
            <Card 
              key={product.id} 
              className="bg-white border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-0">
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-b relative">
                  <Package className="h-16 w-16 text-slate-200" />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="h-8">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      {commonT("edit")}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      SKU: {product.sku}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(product.price, locale)}
                    </span>
                    <Badge className="text-xs bg-emerald-100 text-emerald-700">
                      {ts(product.stock)}
                    </Badge>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CreateProductSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
