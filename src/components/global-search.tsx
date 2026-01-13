"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Calendar,
  User,
  Users,
  FileText,
  Building2,
  Kanban,
  ScrollText,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Navigation pages with translation keys
const PAGES = [
  { titleKey: "dashboard", href: "/", icon: LayoutDashboard },
  { titleKey: "customers", href: "/sales/customers", icon: Users },
  { titleKey: "pipeline", href: "/sales/pipeline", icon: Kanban },
  { titleKey: "deals", href: "/sales/deals", icon: FileText },
  { titleKey: "contracts", href: "/sales/contracts", icon: ScrollText },
  { titleKey: "tasks", href: "/sales/tasks", icon: Calendar },
  { titleKey: "profile", href: "/profile", icon: User },
];

// Mock Data
const DATA = {
  customers: [
    { id: "1", name: "TechCorp Inc.", type: "customer" },
    { id: "2", name: "StartupXYZ", type: "customer" },
    { id: "3", name: "MegaCorp Ltd.", type: "customer" },
    { id: "4", name: "FinanceHub", type: "customer" },
    { id: "5", name: "RetailMax", type: "customer" },
  ],
  deals: [
    { id: "1", name: "Enterprise License 2026", customer: "TechCorp Inc.", type: "deal" },
    { id: "2", name: "Annual Support Contract", customer: "StartupXYZ", type: "deal" },
    { id: "3", name: "Consulting Agreement", customer: "MegaCorp Ltd.", type: "deal" },
    { id: "4", name: "Platform License", customer: "FinanceHub", type: "deal" },
  ],
};

export function GlobalSearch() {
  const t = useTranslations("globalSearch");
  const tn = useTranslations("nav");
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-slate-500 sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">{t("placeholder")}</span>
        <span className="inline-flex lg:hidden">{t("placeholder")}</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("inputPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          
          <CommandGroup heading={t("pages")}>
            {PAGES.map((page) => {
              const Icon = page.icon;
              const title = tn(page.titleKey);
              return (
                <CommandItem
                  key={page.href}
                  value={title}
                  onSelect={() => {
                    runCommand(() => router.push(page.href));
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading={t("customers")}>
            {DATA.customers.map((customer) => (
              <CommandItem
                key={customer.id}
                value={customer.name}
                onSelect={() => {
                  runCommand(() => router.push(`/sales/customers/${customer.id}`));
                }}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>{customer.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
 
          <CommandGroup heading={t("deals")}>
            {DATA.deals.map((deal) => (
              <CommandItem
                key={deal.id}
                value={`${deal.name} ${deal.customer}`}
                onSelect={() => {
                  runCommand(() => router.push(`/sales/deals/${deal.id}`));
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{deal.name}</span>
                <span className="ml-2 text-xs text-slate-400">({deal.customer})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
