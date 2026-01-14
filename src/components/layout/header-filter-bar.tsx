"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { X, Globe, MessageSquare, Phone, Calendar, Zap, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { DateRangeFilter } from "@/components/common/date-range-filter";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { mockUsers } from "@/lib/mock-data/users";
import { DateRange } from "react-day-picker";

// Filter options configurations
const INDUSTRY_OPTIONS = [
  { label: "EdTech", value: "EdTech" },
  { label: "HealthTech", value: "HealthTech" },
  { label: "FinTech", value: "FinTech" },
  { label: "E-commerce", value: "E-commerce" },
  { label: "SaaS", value: "SaaS" },
];

const SOURCE_OPTIONS = [
  { label: "Website", value: "website", icon: Globe },
  { label: "Referral", value: "referral", icon: UsersIcon },
  { label: "Social Media", value: "social", icon: MessageSquare },
  { label: "Cold Call", value: "cold-call", icon: Phone },
  { label: "Event", value: "event", icon: Calendar },
  { label: "Partner", value: "partner", icon: Zap },
];

const STATUS_OPTIONS = [
  { label: "New", value: "1" },
  { label: "Contacted", value: "2" },
  { label: "Qualified", value: "3" },
];

const STAGE_OPTIONS = [
  { label: "Discovery", value: "discovery" },
  { label: "Proposal", value: "proposal" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Closed Won", value: "closed_won" },
  { label: "Closed Lost", value: "closed_lost" },
];

const PRIORITY_OPTIONS = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const TICKET_STATUS_OPTIONS = [
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Sales", value: "sales" },
  { label: "Support", value: "support" },
];

const TEMPLATE_CATEGORY_OPTIONS = [
  { label: "Promotional", value: "promotional" },
  { label: "Newsletter", value: "newsletter" },
  { label: "Transactional", value: "transactional" },
  { label: "Announcement", value: "announcement" },
];

// Owner options from mock users
const OWNER_OPTIONS = mockUsers.map(user => ({
  label: user.name,
  value: String(user.id),
}));

export function HeaderFilterBar() {
  const pathname = usePathname();
  const t = useTranslations("filters");
  const tc = useTranslations("common");
  const tcust = useTranslations("customers");
  const { getValues, setValues, getValue, setValue, hasActiveFilters, resetFilters } = useUrlFilters();

  // Determine which route we're on
  const isCustomers = pathname.includes("/sales/customers");
  const isLeads = pathname.includes("/sales/leads");
  const isDashboard = pathname === "/" || pathname.endsWith("/en") || pathname.endsWith("/vi");
  const isDeals = pathname.includes("/sales/deals");
  const isContracts = pathname.includes("/sales/contracts");
  const isTasks = pathname.includes("/sales/tasks");
  const isTickets = pathname.includes("/support/tickets");
  const isMarketingOverview = pathname.includes("/marketing") && !pathname.includes("/templates") && !pathname.includes("/campaigns");
  const isTemplates = pathname.includes("/marketing/templates");
  const isAdminUsers = pathname.includes("/admin/users");
  const isAdminDepts = pathname.includes("/admin/departments");
  const isAdminRoles = pathname.includes("/admin/roles");

  // Don't show filter bar on routes without filters
  const hasFilters = isCustomers || isLeads || isDashboard || isDeals || isContracts || isTasks || isTickets || isMarketingOverview || isTemplates || isAdminUsers || isAdminDepts || isAdminRoles;
  if (!hasFilters) {
    return null;
  }

  // Convert URL values to Set for FacetedFilter
  const industryValues = new Set(getValues("industry"));
  const sourceValues = new Set(getValues("source"));
  const ownerValues = new Set(getValues("owner_id"));
  const statusValues = new Set(getValues("status"));
  const stageValues = new Set(getValues("stage"));
  const priorityValues = new Set(getValues("priority"));
  const roleValues = new Set(getValues("role"));
  const categoryValues = new Set(getValues("category"));

  // Date range from URL
  const fromDate = getValue("from");
  const toDate = getValue("to");
  const dateRange: DateRange | undefined = fromDate && toDate ? {
    from: new Date(fromDate),
    to: new Date(toDate),
  } : undefined;

  // Handlers
  const handleIndustryChange = (values: Set<string>) => {
    setValues("industry", Array.from(values));
  };

  const handleSourceChange = (values: Set<string>) => {
    setValues("source", Array.from(values));
  };

  const handleOwnerChange = (values: Set<string>) => {
    setValues("owner_id", Array.from(values));
  };

  const handleStatusChange = (values: Set<string>) => {
    setValues("status", Array.from(values));
  };

  const handleStageChange = (values: Set<string>) => {
    setValues("stage", Array.from(values));
  };

  const handlePriorityChange = (values: Set<string>) => {
    setValues("priority", Array.from(values));
  };

  const handleRoleChange = (values: Set<string>) => {
    setValues("role", Array.from(values));
  };

  const handleCategoryChange = (values: Set<string>) => {
    setValues("category", Array.from(values));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setValue("from", range.from.toISOString().split("T")[0]);
      setValue("to", range.to.toISOString().split("T")[0]);
    } else {
      setValue("from", null);
      setValue("to", null);
    }
  };

  const handleReset = () => {
    resetFilters(true); // Keep search query
  };

  const showReset = hasActiveFilters(["q"]);

  return (
    <div className="flex items-center gap-2">
      {/* Customers Filters */}
      {isCustomers && (
        <>
          <DataTableFacetedFilter
            title={t("industry")}
            options={INDUSTRY_OPTIONS}
            selectedValues={industryValues}
            onSelectionChange={handleIndustryChange}
          />
          <DataTableFacetedFilter
            title={tcust("source")}
            options={SOURCE_OPTIONS}
            selectedValues={sourceValues}
            onSelectionChange={handleSourceChange}
          />
          <DataTableFacetedFilter
            title={t("owner")}
            options={OWNER_OPTIONS}
            selectedValues={ownerValues}
            onSelectionChange={handleOwnerChange}
          />
        </>
      )}

      {/* Leads Filters */}
      {isLeads && (
        <>
          <DataTableFacetedFilter
            title={tc("status")}
            options={STATUS_OPTIONS}
            selectedValues={statusValues}
            onSelectionChange={handleStatusChange}
          />
          <DataTableFacetedFilter
            title={t("owner")}
            options={OWNER_OPTIONS}
            selectedValues={ownerValues}
            onSelectionChange={handleOwnerChange}
          />
          <DateRangeFilter
            date={dateRange}
            setDate={handleDateRangeChange}
            placeholder={t("dateRange")}
          />
        </>
      )}

      {/* Dashboard Date Filter */}
      {isDashboard && (
        <DateRangeFilter
          date={dateRange}
          setDate={handleDateRangeChange}
          placeholder={t("dateRange")}
        />
      )}

      {/* Deals Filters */}
      {isDeals && (
        <>
          <DataTableFacetedFilter
            title="Stage"
            options={STAGE_OPTIONS}
            selectedValues={stageValues}
            onSelectionChange={handleStageChange}
          />
          <DataTableFacetedFilter
            title={t("owner")}
            options={OWNER_OPTIONS}
            selectedValues={ownerValues}
            onSelectionChange={handleOwnerChange}
          />
          <DateRangeFilter
            date={dateRange}
            setDate={handleDateRangeChange}
            placeholder={t("dateRange")}
          />
        </>
      )}

      {/* Contracts Filters */}
      {isContracts && (
        <DateRangeFilter
          date={dateRange}
          setDate={handleDateRangeChange}
          placeholder={t("dateRange")}
        />
      )}

      {/* Tasks Filters */}
      {isTasks && (
        <>
          <DataTableFacetedFilter
            title="Priority"
            options={PRIORITY_OPTIONS}
            selectedValues={priorityValues}
            onSelectionChange={handlePriorityChange}
          />
          <DateRangeFilter
            date={dateRange}
            setDate={handleDateRangeChange}
            placeholder={t("dateRange")}
          />
        </>
      )}

      {/* Tickets Filters */}
      {isTickets && (
        <>
          <DataTableFacetedFilter
            title={tc("status")}
            options={TICKET_STATUS_OPTIONS}
            selectedValues={statusValues}
            onSelectionChange={handleStatusChange}
          />
          <DataTableFacetedFilter
            title="Priority"
            options={PRIORITY_OPTIONS}
            selectedValues={priorityValues}
            onSelectionChange={handlePriorityChange}
          />
        </>
      )}

      {/* Marketing Overview Filters */}
      {isMarketingOverview && (
        <DateRangeFilter
          date={dateRange}
          setDate={handleDateRangeChange}
          placeholder={t("dateRange")}
        />
      )}

      {/* Templates Filters */}
      {isTemplates && (
        <DataTableFacetedFilter
          title="Category"
          options={TEMPLATE_CATEGORY_OPTIONS}
          selectedValues={categoryValues}
          onSelectionChange={handleCategoryChange}
        />
      )}

      {/* Admin Users Filters */}
      {isAdminUsers && (
        <DataTableFacetedFilter
          title={tc("role")}
          options={ROLE_OPTIONS}
          selectedValues={roleValues}
          onSelectionChange={handleRoleChange}
        />
      )}

      {/* Reset Button */}
      {showReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-9 px-2 text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <X className="h-4 w-4 mr-1" />
          {tc("clear")}
        </Button>
      )}
    </div>
  );
}
