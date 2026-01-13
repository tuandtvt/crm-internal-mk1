"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageSwitcher } from "@/components/language-switcher";
import { GlobalSearch } from "@/components/global-search";
import {
  Menu,
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
  Bell,
  Search,
  User,
  LogOut,
  TrendingUp,
  Mail,
  Layout,
  Headphones,
} from "lucide-react";

// Navigation configuration with translation keys
const navSections = [
  {
    titleKey: "overview",
    items: [
      { titleKey: "dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    titleKey: "sales",
    items: [
      { titleKey: "customers", href: "/sales/customers", icon: Users },
      { titleKey: "pipeline", href: "/sales/pipeline", icon: Kanban },
      { titleKey: "deals", href: "/sales/deals", icon: FileText },
      { titleKey: "contracts", href: "/sales/contracts", icon: ScrollText },
      { titleKey: "tasks", href: "/sales/tasks", icon: CheckSquare },
    ],
  },
  {
    titleKey: "marketing",
    items: [
      { titleKey: "marketingOverview", href: "/marketing", icon: TrendingUp },
      { titleKey: "campaigns", href: "/marketing/campaigns", icon: Mail },
      { titleKey: "templates", href: "/marketing/templates", icon: Layout },
    ],
  },
  {
    titleKey: "support",
    items: [
      { titleKey: "tickets", href: "/support/tickets", icon: Headphones },
    ],
  },
  {
    titleKey: "admin",
    items: [
      { titleKey: "users", href: "/admin/users", icon: UserCog },
      { titleKey: "departments", href: "/admin/departments", icon: Building2 },
      { titleKey: "roles", href: "/admin/roles", icon: Shield },
      { titleKey: "shareConfig", href: "/admin/share", icon: Share2 },
      { titleKey: "products", href: "/admin/products", icon: Package },
    ],
  },
];

// Sidebar Content Component
function SidebarContent({ 
  isCollapsed = false, 
  onNavClick 
}: { 
  isCollapsed?: boolean;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { user } = useAuthStore();

  // Filter sections based on user role
  const filteredSections = navSections.filter(section => {
    if (!user) return false;

    // SALE role restrictions
    if (user.role === 'SALE') {
      if (section.titleKey === 'admin') return false;
      if (section.titleKey === 'reports') return false; // In case reports is added later
    }

    return true;
  }).map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (!user) return false;

      // MANAGER role restrictions
      if (user.role === 'MANAGER') {
        if (item.titleKey === 'roles' || item.titleKey === 'shareConfig') return false;
      }

      // SALE role restrictions (additional item-level checks if needed)
      if (user.role === 'SALE') {
        // SALE doesn't see admin at all (handled at section level), 
        // but if items were in other shared sections, we'd filter here.
      }

      return true;
    })
  }));

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-zinc-200/50">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-6">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2.5" onClick={onNavClick}>
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
            {idx > 0 && isCollapsed && <Separator className="mb-4 bg-white/10" />}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (
                  item.href !== "/" && 
                  pathname.startsWith(item.href + "/") && 
                  !filteredSections.some(s => s.items.some(i => 
                    i.href.length > item.href.length && pathname.startsWith(i.href)
                  ))
                );
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavClick}
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
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    )} strokeWidth={1.5} />
                    {!isCollapsed && <span>{t(item.titleKey)}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

// Desktop Sidebar
function DesktopSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-4 top-4 bottom-4 z-40 hidden lg:block transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "absolute top-4 -right-3 h-6 w-6 rounded-full border border-violet-500/30 bg-gradient-premium text-white hover:shadow-lg shadow-violet-500/50 z-50 cursor-pointer"
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

// Mobile Header with Sheet Sidebar
function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 lg:hidden flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-[290px] bg-slate-900 border-r border-white/10">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-premium">
            <span className="text-xs font-bold text-white">CRM</span>
          </div>
          <span className="text-lg font-bold text-slate-900">MK1 CRM</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5 text-slate-600" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}

// Desktop Header
function DesktopHeader({ sidebarWidth }: { sidebarWidth: string }) {

  return (
    <header
      className={cn(
        "fixed top-4 right-4 z-30 hidden lg:flex h-16 items-center justify-between rounded-2xl px-6 transition-all duration-300",
        "bg-white/60 backdrop-blur-md border border-white/20 shadow-soft",
        sidebarWidth
      )}
    >
      <div className="flex items-center gap-4">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}

// User Menu Dropdown (Simplified: Profile + Logout only)
function UserMenu() {
  const t = useTranslations("nav");
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback className="bg-gradient-premium text-white">JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user?.name || "John Doe"}</span>
            <span className="text-xs text-slate-500">{user?.email || "john@company.com"}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {t("profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Main Layout Component
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
    }
  };

  const sidebarWidth = isCollapsed ? "left-[112px]" : "left-[292px]";

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-mesh selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Sidebar */}
      <DesktopSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      
      {/* Desktop Header */}
      <DesktopHeader sidebarWidth={sidebarWidth} />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "pt-14 lg:pt-24 lg:pr-4",
          "lg:pl-[276px]",
          isCollapsed && "lg:pl-[96px]"
        )}
      >
        <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
