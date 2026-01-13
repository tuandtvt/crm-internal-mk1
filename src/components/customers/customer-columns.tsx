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
import { ArrowUpDown, Globe, Users, MessageSquare, Phone, Calendar, Zap, ExternalLink } from "lucide-react";
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
        {row.original.lead_note && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1" title={row.original.lead_note}>
            {row.original.lead_note}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => {
      if (!row.original.industry) return <span className="text-muted-foreground">-</span>;
      
      // Industry color mapping
      const industryColors: Record<string, { bg: string; text: string }> = {
        EdTech: { bg: "bg-blue-100", text: "text-blue-700" },
        HealthTech: { bg: "bg-green-100", text: "text-green-700" },
        FinTech: { bg: "bg-purple-100", text: "text-purple-700" },
        "E-commerce": { bg: "bg-orange-100", text: "text-orange-700" },
        SaaS: { bg: "bg-indigo-100", text: "text-indigo-700" },
      };
      
      const colors = industryColors[row.original.industry] || { bg: "bg-slate-100", text: "text-slate-700" };
      
      return (
        <Badge className={cn(colors.bg, colors.text, "hover:" + colors.bg)}>
          {row.original.industry}
        </Badge>
      );
    },
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      if (!row.original.website) return <span className="text-muted-foreground">-</span>;
      
      return (
        <a
          href={row.original.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <Globe className="h-4 w-4" />
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    },
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
