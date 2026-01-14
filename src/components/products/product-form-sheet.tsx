"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Product } from "@/lib/mock-data/products";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import Image from "next/image";

interface ProductFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormSheet({ open, onOpenChange, product }: ProductFormSheetProps) {
  const t = useTranslations("Products");
  const tc = useTranslations("common");
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    code: "",
    category: "Software",
    unit_price: 0,
    currency: "USD",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        code: "",
        category: "Software",
        unit_price: 0,
        currency: "USD",
        description: "",
        is_active: true,
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(product ? t("editProduct") + " " + tc("success") : t("addProduct") + " " + tc("success"));
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] flex flex-col p-0 overflow-hidden border-l border-white/20 bg-white/80 backdrop-blur-xl">
        <SheetHeader className="p-6 border-b bg-slate-50/50">
          <SheetTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {product ? t("editProduct") : t("addProduct")}
          </SheetTitle>
          <SheetDescription>
            {t("subtitle")}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Image Upload Placeholder */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">{t("form.image")}</Label>
            <div className="relative group cursor-pointer">
              <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center transition-all group-hover:border-indigo-300 group-hover:bg-indigo-50/30 overflow-hidden">
                {formData.image_url ? (
                   <div className="relative w-full h-full">
                     <Image 
                       src={formData.image_url} 
                       alt="Preview" 
                       fill
                       className="object-cover" 
                     />
                   </div>
                ) : (
                  <>
                    <div className="p-4 rounded-full bg-white shadow-sm border border-slate-100 mb-2 group-hover:scale-110 transition-transform">
                      <Camera className="h-6 w-6 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{t("form.clickToUpload")}</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t("form.name")}</Label>
              <Input
                placeholder={t("form.namePlaceholder")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/50 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t("form.code")}</Label>
              <Input
                placeholder="SKU..."
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="bg-white/50 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t("form.category")}</Label>
              <Select
                value={formData.category}
                onValueChange={(value: "Software" | "Service" | "Hardware") => 
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-white/50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software">💻 {t("categories.Software")}</SelectItem>
                  <SelectItem value="Service">🛠️ {t("categories.Service")}</SelectItem>
                  <SelectItem value="Hardware">🖥️ {t("categories.Hardware")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t("form.price")}</Label>
              <Input
                type="number"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
                className="bg-white/50 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t("form.currency")}</Label>
              <Select
                value={formData.currency}
                onValueChange={(value: "USD" | "VND") => 
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger className="bg-white/50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="VND">VND (₫)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t("form.description")}</Label>
              <Textarea
                placeholder={t("form.descriptionPlaceholder")}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/50 border-slate-200 min-h-[120px] resize-none"
              />
            </div>

            <div className="col-span-2 flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-slate-700">{t("form.activeStatus")}</Label>
                <p className="text-xs text-slate-500">
                  {formData.is_active ? t("form.active") : t("form.inactive")}
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
        </form>

        <SheetFooter className="p-6 border-t bg-slate-50/50">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-200 hover:bg-white transition-colors"
            >
              {tc("cancel")}
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 border-none transition-all active:scale-[0.98]"
            >
              {tc("save")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
