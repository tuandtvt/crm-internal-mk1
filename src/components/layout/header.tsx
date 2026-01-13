"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Users,
  Kanban,
  FileText,
} from "lucide-react";

export function Header() {
  const { isCollapsed } = useSidebar();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/login");
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-4 right-4 z-30 flex h-16 items-center justify-between rounded-2xl px-6 transition-all duration-300",
          "bg-white/60 backdrop-blur-md border border-white/20 shadow-soft",
          isCollapsed ? "left-[112px]" : "left-[292px]"
        )}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <Button
            variant="outline"
            className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 xl:mr-2" />
            <span className="hidden xl:inline-flex">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search customers, deals, tasks..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => {
                router.push("/sales/customers");
                setSearchOpen(false);
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>View Customers</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/sales/pipeline");
                setSearchOpen(false);
              }}
            >
              <Kanban className="mr-2 h-4 w-4" />
              <span>View Pipeline</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/sales/deals");
                setSearchOpen(false);
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>View Deals</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
