"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCustomers } from "@/lib/mock-data/customers";
import { mockDeals } from "@/lib/mock-data/deals";

interface EntityItem {
  id: number;
  name: string;
  code?: string;
}

interface RelatedEntitySelectorProps {
  relatedType?: string;
  relatedId?: number;
  onTypeChange: (type: string) => void;
  onEntityChange: (id: number) => void;
  allowedTypes?: ("CUSTOMER" | "DEAL" | "CONTRACT")[];
}

export function RelatedEntitySelector({
  relatedType,
  relatedId,
  onTypeChange,
  onEntityChange,
  allowedTypes = ["CUSTOMER", "DEAL", "CONTRACT"],
}: RelatedEntitySelectorProps) {
  const t = useTranslations("relatedEntitySelector");
  const [selectedType, setSelectedType] = useState<string>(relatedType || "");
  const [selectedEntity, setSelectedEntity] = useState<number>(relatedId || 0);

  // Derive entities from selectedType (no useEffect needed)
  const entities = useMemo<EntityItem[]>(() => {
    if (!selectedType) return [];

    switch (selectedType) {
      case "CUSTOMER":
        return mockCustomers;
      case "DEAL":
        return mockDeals;
      case "CONTRACT":
        // Mock contracts not yet created
        return [
          { id: 1, name: "Contract #1 - TechCorp", code: "CNT-001" },
          { id: 2, name: "Contract #2 - StartupXYZ", code: "CNT-002" },
        ];
      default:
        return [];
    }
  }, [selectedType]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedEntity(0);
    onTypeChange(type);
    onEntityChange(0);
  };

  const handleEntityChange = (entityId: string) => {
    const id = parseInt(entityId);
    setSelectedEntity(id);
    onEntityChange(id);
  };

  const getEntityTypeLabel = (type: string) => {
    switch (type) {
      case "CUSTOMER": return t("entityTypes.customer");
      case "DEAL": return t("entityTypes.deal");
      case "CONTRACT": return t("entityTypes.contract");
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Type Selection */}
      <div>
        <Label>{t("relatedType")}</Label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("selectType")} />
          </SelectTrigger>
          <SelectContent>
            {allowedTypes.includes("CUSTOMER") && (
              <SelectItem value="CUSTOMER">{t("entityTypes.customerCaps")}</SelectItem>
            )}
            {allowedTypes.includes("DEAL") && (
              <SelectItem value="DEAL">{t("entityTypes.dealCaps")}</SelectItem>
            )}
            {allowedTypes.includes("CONTRACT") && (
              <SelectItem value="CONTRACT">{t("entityTypes.contractCaps")}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Entity Selection */}
      {selectedType && (
        <div>
          <Label>{t("selectEntity", { entity: getEntityTypeLabel(selectedType) })}</Label>
          <Select 
            value={selectedEntity?.toString() || ""} 
            onValueChange={handleEntityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{entity.name}</span>
                    {entity.code && (
                      <span className="text-xs text-slate-500">{entity.code}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
