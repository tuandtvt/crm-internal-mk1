"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export interface StatusOption {
  value: string | number;
  label: string;
  bgColor: string;
  textColor: string;
}

interface DataTableCellStatusProps {
  value: string | number;
  rowId: string | number;
  options: StatusOption[];
  onChange?: (rowId: string | number, newValue: string | number) => void;
}

export function DataTableCellStatus({
  value,
  rowId,
  options,
  onChange,
}: DataTableCellStatusProps) {
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const currentOption = options.find((opt) => opt.value === currentValue) || options[0];

  const handleSelect = (option: StatusOption) => {
    if (option.value === currentValue) {
      setOpen(false);
      return;
    }

    // Optimistic update
    const previousValue = currentValue;
    setCurrentValue(option.value);
    setOpen(false);

    // Notify parent
    if (onChange) {
      onChange(rowId, option.value);
    }

    // Show toast
    toast.success(`Đã cập nhật trạng thái thành "${option.label}"`, {
      action: {
        label: "Hoàn tác",
        onClick: () => {
          setCurrentValue(previousValue);
          if (onChange) {
            onChange(rowId, previousValue);
          }
        },
      },
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
            "hover:ring-2 hover:ring-offset-1 hover:ring-slate-300",
            currentOption.bgColor,
            currentOption.textColor
          )}
        >
          {currentOption.label}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="start" sideOffset={4}>
        <div className="space-y-0.5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-sm transition-colors cursor-pointer",
                "hover:bg-slate-100",
                option.value === currentValue && "bg-slate-50"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                    option.bgColor,
                    option.textColor
                  )}
                >
                  {option.label}
                </span>
              </div>
              {option.value === currentValue && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
