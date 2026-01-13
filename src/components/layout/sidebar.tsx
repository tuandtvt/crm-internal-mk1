"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Kanban,
  FileText,
  ScrollText,
  CheckSquare,
  UserCog,
  Building2,
  Shield,
  Share2,
  Package,
} from "lucide-react";

interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavSection {
  titleKey: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    titleKey: "overview",
    items: [
      {
        titleKey: "dashboard",
        href: "/",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    titleKey: "sales",
    items: [
      {
        titleKey: "customers",
        href: "/sales/customers",
        icon: <Users className="h-5 w-5" />,
      },
      {
        titleKey: "pipeline",
        href: "/sales/pipeline",
        icon: <Kanban className="h-5 w-5" />,
      },
      {
        titleKey: "deals",
        href: "/sales/deals",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        titleKey: "contracts",
        href: "/sales/contracts",
        icon: <ScrollText className="h-5 w-5" />,
      },
      {
        titleKey: "tasks",
        href: "/sales/tasks",
        icon: <CheckSquare className="h-5 w-5" />,
      },
    ],
  },
  {
    titleKey: "admin",
    items: [
      {
        titleKey: "users",
        href: "/admin/users",
        icon: <UserCog className="h-5 w-5" />,
      },
      {
        titleKey: "departments",
        href: "/admin/departments",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        titleKey: "roles",
        href: "/admin/roles",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        titleKey: "shareConfig",
        href: "/admin/share",
        icon: <Share2 className="h-5 w-5" />,
      },
      {
        titleKey: "products",
        href: "/admin/products",
        icon: <Package className="h-5 w-5" />,
      },
    ],
  },
];

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { user } = useAuthStore();

  // Filter sections based on user role
  const filteredSections = navSections.filter(section => {
    if (!user) return false;
    if (user.role === 'SALE') {
      if (section.titleKey === 'admin') return false;
    }
    return true;
  }).map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (!user) return false;
      if (user.role === 'MANAGER') {
        if (item.titleKey === 'roles' || item.titleKey === 'shareConfig') return false;
      }
      return true;
    })
  }));

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-4 top-4 bottom-4 z-40 hidden lg:block transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-zinc-200/50">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-6">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">MK1 CRM</span>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            {filteredSections.map((section, idx) => (
              <div key={section.titleKey} className="mb-8">
                {!isCollapsed && (
                  <h4 className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {t(section.titleKey)}
                  </h4>
                )}
                {idx > 0 && isCollapsed && (
                  <Separator className="mb-4 bg-zinc-100" />
                )}
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (
                      item.href !== "/" && 
                      pathname.startsWith(item.href + "/") && 
                      !filteredSections.some(s => s.items.some(i => 
                        i.href.length > item.href.length && pathname.startsWith(i.href)
                      ))
                    );

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-indigo-600" />
                        )}
                        <div className={cn(
                          "transition-colors",
                          isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        )}>
                          {item.icon}
                        </div>
                        {!isCollapsed && <span>{t(item.titleKey)}</span>}
                        {!isCollapsed && item.badge && (
                          <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-100 px-1.5 text-[10px] font-bold text-indigo-700">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );

                    if (isCollapsed) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {t(item.titleKey)}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <div key={item.href}>{linkContent}</div>;
                  })}
                </nav>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Floating Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn(
            "absolute top-4 -right-3 h-6 w-6 rounded-full border border-indigo-100 bg-white shadow-lg shadow-indigo-500/10 z-50 text-indigo-600 hover:bg-indigo-50",
            isCollapsed && "right-[-12px]"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </aside>
    </TooltipProvider>
  );
}
