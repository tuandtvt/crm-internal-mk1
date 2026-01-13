"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/pipeline-config";
import { StageProgress } from "./stage-progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Deal interface for pipeline
export interface Deal {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  amount: number;
  stage: string;
  probability: number;
  owner: string;
  ownerAvatar: string;
  closingDate: Date;
}

// Check if date is in the past
function isOverdue(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

// Format date with relative indicator
function formatClosingDate(date: Date): { text: string; overdue: boolean } {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatted = target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: target.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });

  return {
    text: formatted,
    overdue: isOverdue(date),
  };
}

export const pipelineColumns: ColumnDef<Deal>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Deal Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.customerName}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Value
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-bold text-foreground">
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <StageProgress
        currentStage={row.original.stage}
        onStageChange={(newStage) => {
          // TODO: Implement actual stage update
          console.log("Stage changed to:", newStage);
        }}
      />
    ),
  },
  {
    accessorKey: "probability",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Probability
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const prob = row.original.probability;
      return (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                prob >= 70
                  ? "bg-emerald-500"
                  : prob >= 40
                  ? "bg-amber-500"
                  : "bg-slate-400"
              )}
              style={{ width: `${prob}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground w-10">{prob}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "closingDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Closing Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { text, overdue } = formatClosingDate(row.original.closingDate);
      const isTerminal =
        row.original.stage === "won" || row.original.stage === "lost";

      return (
        <span
          className={cn(
            "text-sm",
            overdue && !isTerminal
              ? "text-rose-600 font-medium"
              : "text-muted-foreground"
          )}
        >
          {text}
          {overdue && !isTerminal && (
            <span className="ml-1 text-xs text-rose-500">(Overdue)</span>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const initials = row.original.owner
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground hidden lg:inline">
            {row.original.owner}
          </span>
        </div>
      );
    },
  },
];
