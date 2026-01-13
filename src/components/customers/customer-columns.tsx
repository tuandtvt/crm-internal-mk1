"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types";
import {
  CUSTOMER_TYPES,
  CUSTOMER_SOURCES,
  formatRelativeTime,
} from "@/lib/customer-config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Globe, Users, MessageSquare, Phone, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

// Get source icon
function getSourceIcon(source: string) {
  const icons: Record<string, React.ReactNode> = {
    website: <Globe className="h-4 w-4" />,
    referral: <Users className="h-4 w-4" />,
    social: <MessageSquare className="h-4 w-4" />,
    "cold-call": <Phone className="h-4 w-4" />,
    event: <Calendar className="h-4 w-4" />,
    partner: <Zap className="h-4 w-4" />,
  };
  return icons[source] || <Globe className="h-4 w-4" />;
}

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const initials = row.original.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Company
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.company_name || '-'}</p>
        <Badge variant="secondary" className="mt-1 text-xs font-normal">
          {row.original.source || '-'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const sourceConfig = CUSTOMER_SOURCES.find(
        (s) => s.id === row.original.source
      );
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          {getSourceIcon(row.original.source || '')}
          <span className="text-sm">{sourceConfig?.label || row.original.source || '-'}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: "Status",
    cell: ({ row }) => {
      const typeConfig = CUSTOMER_TYPES[row.original.type as keyof typeof CUSTOMER_TYPES];
      if (!typeConfig) return <span>-</span>;
      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            typeConfig.bgColor,
            typeConfig.textColor
          )}
        >
          {typeConfig.label}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Last Activity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.updated_at ? formatRelativeTime(row.original.updated_at) : '-'}
      </span>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const ownerName = row.original.owner?.name || '-';
      const initials = ownerName !== '-' 
        ? ownerName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
        : '?';

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground hidden lg:inline">
            {ownerName}
          </span>
        </div>
      );
    },
  },
];
