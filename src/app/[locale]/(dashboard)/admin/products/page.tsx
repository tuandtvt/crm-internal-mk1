"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Settings2,
  MoreVertical,
  Layers,
  Box
} from "lucide-react";
import { mockProducts, Product, formatCurrency } from "@/lib/mock-data/products";
import { ProductFormSheet } from "@/components/products/product-form-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const tc = useTranslations("common");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState(mockProducts);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.error(tc("delete") + " " + tc("success"));
  };

  const toggleStatus = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, is_active: !p.is_active } : p
      )
    );
    toast.info("Status updated");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
              <Package className="h-6 w-6 text-white" />
            </div>
            {t("title")}
          </h1>
          <p className="text-slate-500 font-medium ml-12">
            {t("subtitle")}
          </p>
        </div>
        
        <Button 
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-100 border-none px-6 h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t("addProduct")}
        </Button>
      </div>

      {/* Stats Quick View (Optional aesthetic touch) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Items", value: products.length, icon: Box, color: "bg-blue-500" },
          { label: "Software", value: products.filter(p => p.category === "Software").length, icon: Layers, color: "bg-indigo-500" },
          { label: "Services", value: products.filter(p => p.category === "Service").length, icon: Settings2, color: "bg-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-4">
             <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
             </div>
             <div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <Card className="border-none bg-white/60 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden overflow-x-auto">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={tc("search") + " " + t("form.name").toLowerCase() + " / " + t("form.code").toLowerCase()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-indigo-500/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/50 text-slate-500 px-3 py-1 rounded-lg">
              {filteredProducts.length} {tc("all").toLowerCase()}
            </Badge>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 border-b border-slate-100 hover:bg-slate-50/30">
              <TableHead className="w-[350px] font-bold text-slate-800 py-4">{t("table.info")}</TableHead>
              <TableHead className="font-bold text-slate-800">{t("table.category")}</TableHead>
              <TableHead className="font-bold text-slate-800">{t("table.price")}</TableHead>
              <TableHead className="font-bold text-slate-800">{t("table.status")}</TableHead>
              <TableHead className="text-right font-bold text-slate-800 pr-8">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 truncate">
                          {product.name}
                        </span>
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                          {product.code}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`
                        px-2.5 py-0.5 rounded-lg font-semibold text-[11px] uppercase tracking-wider border-none
                        ${product.category === 'Software' ? 'bg-blue-100 text-blue-700 shadow-sm shadow-blue-100' : ''}
                        ${product.category === 'Service' ? 'bg-purple-100 text-purple-700 shadow-sm shadow-purple-100' : ''}
                        ${product.category === 'Hardware' ? 'bg-amber-100 text-amber-700 shadow-sm shadow-amber-100' : ''}
                      `}
                    >
                      {t(`categories.${product.category}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(product.unit_price, product.currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.is_active}
                      onCheckedChange={() => toggleStatus(product.id)}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl border-slate-200/60 shadow-xl bg-white/90 backdrop-blur-xl">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-slate-700 focus:bg-indigo-50 focus:text-indigo-600 transition-colors">
                          <Edit2 className="h-4 w-4" />
                          <span className="font-medium text-sm">{tc("edit")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-rose-600 focus:bg-rose-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                          <span className="font-medium text-sm">{tc("delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                      <Search className="h-8 w-8" />
                    </div>
                    <p className="text-slate-400 font-medium">{tc("noData")}</p>
                    <Button variant="link" onClick={() => setSearchQuery("")} className="text-indigo-600 font-bold">
                       {tc("clear")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <ProductFormSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        product={selectedProduct} 
      />
    </div>
  );
}
