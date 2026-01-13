import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { mockCustomers } from "@/lib/mock-data/customers";
import { mockDeals } from "@/lib/mock-data/deals";
import type { TaskRelatedType, DocumentRelatedType } from "@/types";
import { FileText, Users, DollarSign } from "lucide-react";

interface RelatedEntityLinkProps {
  relatedType: TaskRelatedType | DocumentRelatedType | string;
  relatedId: number;
  showIcon?: boolean;
}

export function RelatedEntityLink({ relatedType, relatedId, showIcon = true }: RelatedEntityLinkProps) {
  if (!relatedType || !relatedId) {
    return <span className="text-slate-400 text-sm">-</span>;
  }

  // Fetch entity based on type
  let entityName = "";
  let entityUrl = "";
  let icon = null;
  let badgeColor = "";

  switch (relatedType) {
    case "CUSTOMER":
      const customer = mockCustomers.find((c) => c.id === relatedId);
      if (customer) {
        entityName = customer.name;
        entityUrl = `/sales/customers`;
        icon = <Users className="h-3 w-3" />;
        badgeColor = "bg-blue-100 text-blue-700";
      }
      break;

    case "DEAL":
      const deal = mockDeals.find((d) => d.id === relatedId);
      if (deal) {
        entityName = deal.name;
        entityUrl = `/sales/deals`;
        icon = <DollarSign className="h-3 w-3" />;
        badgeColor = "bg-emerald-100 text-emerald-700";
      }
      break;

    case "CONTRACT":
      // Mock contract data not yet created, fallback
      entityName = `Contract #${relatedId}`;
      entityUrl = `/sales/contracts`;
      icon = <FileText className="h-3 w-3" />;
      badgeColor = "bg-purple-100 text-purple-700";
      break;

    case "TICKET":
      entityName = `Ticket #${relatedId}`;
      entityUrl = `/support/tickets/${relatedId}`;
      icon = <FileText className="h-3 w-3" />;
      badgeColor = "bg-orange-100 text-orange-700";
      break;

    default:
      return <span className="text-slate-400 text-sm">Unknown</span>;
  }

  if (!entityName) {
    return <span className="text-slate-400 text-sm">Not Found</span>;
  }

  return (
    <Link href={entityUrl}>
      <Badge variant="outline" className={`${badgeColor} cursor-pointer hover:shadow-sm transition-shadow`}>
        {showIcon && icon}
        <span className={showIcon ? "ml-1" : ""}>{entityName}</span>
      </Badge>
    </Link>
  );
}
