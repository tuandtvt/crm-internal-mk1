"use client";

import { useState } from "react";
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
import type { DealProduct } from "@/types";
import { mockProducts } from "@/lib/mock-data/products";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface ProductSelectorProps {
  value: DealProduct[];
  onChange: (products: DealProduct[]) => void;
  discountRate?: number;
}

export function ProductSelector({ value, onChange, discountRate = 0 }: ProductSelectorProps) {
  const t = useTranslations("productSelector");
  const [lineItems, setLineItems] = useState<DealProduct[]>(
    value.length > 0 ? value : [createEmptyLineItem()]
  );

  function createEmptyLineItem(): DealProduct {
    return {
      deal_id: 0,
      product_id: 0,
      quantity: 1,
      unit_price: 0,
      line_total: 0,
    };
  }

  function handleProductChange(index: number, productId: number) {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return;

    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      product_id: productId,
      unit_price: product.unit_price,
      line_total: product.unit_price * updated[index].quantity,
      product,
    };
    setLineItems(updated);
    onChange(updated);
  }

  function handleQuantityChange(index: number, quantity: number) {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      quantity: Math.max(1, quantity),
      line_total: updated[index].unit_price * Math.max(1, quantity),
    };
    setLineItems(updated);
    onChange(updated);
  }

  function addLineItem() {
    const updated = [...lineItems, createEmptyLineItem()];
    setLineItems(updated);
    onChange(updated);
  }

  function removeLineItem(index: number) {
    if (lineItems.length === 1) return; // Keep at least one row
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
    onChange(updated);
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (item.line_total || 0), 0);
  const discountAmount = subtotal * (discountRate / 100);
  const total = subtotal - discountAmount;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-slate-600 px-2">
        <div className="col-span-5">{t("product")}</div>
        <div className="col-span-2 text-right">{t("quantity")}</div>
        <div className="col-span-2 text-right">{t("unitPrice")}</div>
        <div className="col-span-2 text-right">{t("lineTotal")}</div>
        <div className="col-span-1"></div>
      </div>

      {/* Line Items */}
      <div className="space-y-2">
        {lineItems.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            {/* Product Select */}
            <div className="col-span-5">
              <Select
                value={item.product_id?.toString() || ""}
                onValueChange={(val) => handleProductChange(index, parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectProduct")} />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts
                    .filter((p) => p.is_active)
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-slate-500">{product.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="col-span-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                className="text-right"
              />
            </div>

            {/* Unit Price (Read-only) */}
            <div className="col-span-2">
              <Input
                value={formatCurrency(item.unit_price)}
                readOnly
                className="text-right bg-slate-50"
              />
            </div>

            {/* Line Total */}
            <div className="col-span-2">
              <Input
                value={formatCurrency(item.line_total || 0)}
                readOnly
                className="text-right bg-slate-50 font-medium"
              />
            </div>

            {/* Remove Button */}
            <div className="col-span-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLineItem(index)}
                disabled={lineItems.length === 1}
                className="h-8 w-8 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Line Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addLineItem}
        className="w-full cursor-pointer"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("addProduct")}
      </Button>

      {/* Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{t("subtotal")}</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        {discountRate > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">{t("discount")} ({discountRate}%):</span>
            <span className="font-medium text-orange-600">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold border-t pt-2">
          <span>{t("total")}</span>
          <span className="text-violet-600">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
