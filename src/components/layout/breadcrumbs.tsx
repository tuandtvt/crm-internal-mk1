"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Dashboard" }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/" }];

  const labelMap: Record<string, string> = {
    sales: "Sales",
    admin: "Admin",
    customers: "Customers",
    pipeline: "Pipeline",
    deals: "Deals",
    contracts: "Contracts",
    tasks: "Tasks",
    users: "Users",
    departments: "Departments",
    roles: "Roles",
    share: "Share Config",
    products: "Products",
    profile: "Profile",
  };

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav className="flex items-center space-x-1 text-sm">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 && (
            <Home className="mr-1 h-4 w-4 text-muted-foreground" />
          )}
          {index > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "font-medium text-muted-foreground transition-colors hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
