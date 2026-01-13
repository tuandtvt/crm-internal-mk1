// Support Mock Data

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "new" | "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "feature-request" | "bug" | "general";
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  assignedTo?: string;
  assignedToAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  slaDeadline: Date;
  tags: string[];
}

export interface ConversationMessage {
  id: string;
  ticketId: string;
  sender: "customer" | "agent" | "system";
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: "t1",
    title: "Unable to export customer data to CSV",
    description: "When I try to export customer list to CSV, I get a blank file. This worked last week.",
    status: "open",
    priority: "high",
    category: "technical",
    customerId: "c1",
    customerName: "John Anderson",
    customerEmail: "john.anderson@techcorp.com",
    assignedTo: "Sarah Connor",
    assignedToAvatar: "/avatars/sarah.jpg",
    createdAt: new Date("2026-01-12T09:30:00"),
    updatedAt: new Date("2026-01-13T11:15:00"),
    slaDeadline: new Date("2026-01-14T09:30:00"),
    tags: ["export", "csv", "data"],
  },
  {
    id: "t2",
    title: "Billing discrepancy on January invoice",
    description: "The invoice shows $2,500 but my plan should be $1,999. Please clarify.",
    status: "pending",
    priority: "medium",
    category: "billing",
    customerId: "c2",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@financehub.com",
    assignedTo: "John Doe",
    assignedToAvatar: "/avatars/john.jpg",
    createdAt: new Date("2026-01-11T14:20:00"),
    updatedAt: new Date("2026-01-13T10:45:00"),
    slaDeadline: new Date("2026-01-15T14:20:00"),
    tags: ["invoice", "billing"],
  },
  {
    id: "t3",
    title: "Feature Request: Bulk email scheduling",
    description: "Would love to have the ability to schedule multiple campaigns at once instead of one by one.",
    status: "new",
    priority: "low",
    category: "feature-request",
    customerId: "c3",
    customerName: "Michael Chen",
    customerEmail: "m.chen@megacorp.com",
    createdAt: new Date("2026-01-13T08:15:00"),
    updatedAt: new Date("2026-01-13T08:15:00"),
    slaDeadline: new Date("2026-01-20T08:15:00"),
    tags: ["feature", "enhancement", "marketing"],
  },
  {
    id: "t4",
    title: "Dashboard not loading - Error 500",
    description: "Getting internal server error when accessing /dashboard. Chrome browser on Windows 11.",
    status: "open",
    priority: "urgent",
    category: "bug",
    customerId: "c4",
    customerName: "Sarah Williams",
    customerEmail: "sarah.w@startupxyz.io",
    assignedTo: "Sarah Connor",
    assignedToAvatar: "/avatars/sarah.jpg",
    createdAt: new Date("2026-01-13T12:00:00"),
    updatedAt: new Date("2026-01-13T12:30:00"),
    slaDeadline: new Date("2026-01-13T16:00:00"),
    tags: ["critical", "dashboard", "error"],
  },
  {
    id: "t5",
    title: "How to integrate with Salesforce?",
    description: "Looking for documentation on connecting our Salesforce account to import contacts.",
    status: "resolved",
    priority: "medium",
    category: "general",
    customerId: "c5",
    customerName: "Robert Johnson",
    customerEmail: "r.johnson@retailmax.com",
    assignedTo: "Jane Smith",
    assignedToAvatar: "/avatars/jane.jpg",
    createdAt: new Date("2026-01-10T10:00:00"),
    updatedAt: new Date("2026-01-12T15:20:00"),
    resolvedAt: new Date("2026-01-12T15:20:00"),
    slaDeadline: new Date("2026-01-14T10:00:00"),
    tags: ["integration", "salesforce", "documentation"],
  },
  {
    id: "t6",
    title: "API rate limit too restrictive",
    description: "We're hitting the 1000 requests/hour limit. Can we upgrade to higher tier?",
    status: "open",
    priority: "high",
    category: "technical",
    customerId: "c6",
    customerName: "Lisa Thompson",
    customerEmail: "lisa.t@healthcare-plus.org",
    assignedTo: "John Doe",
    assignedToAvatar: "/avatars/john.jpg",
    createdAt: new Date("2026-01-12T16:45:00"),
    updatedAt: new Date("2026-01-13T09:00:00"),
    slaDeadline: new Date("2026-01-14T16:45:00"),
    tags: ["api", "rate-limit", "upgrade"],
  },
  {
    id: "t7",
    title: "Request for training session",
    description: "Our team would like a live demo/training on advanced pipeline features.",
    status: "pending",
    priority: "low",
    category: "general",
    customerId: "c7",
    customerName: "David Miller",
    customerEmail: "d.miller@logitech-solutions.com",
    assignedTo: "Jane Smith",
    assignedToAvatar: "/avatars/jane.jpg",
    createdAt: new Date("2026-01-11T11:30:00"),
    updatedAt: new Date("2026-01-12T14:00:00"),
    slaDeadline: new Date("2026-01-18T11:30:00"),
    tags: ["training", "demo", "pipeline"],
  },
  {
    id: "t8",
    title: "Mobile app crashes on iOS 17",
    description: "App freezes and crashes when trying to view deal details. iPhone 15 Pro, iOS 17.2.",
    status: "new",
    priority: "high",
    category: "bug",
    customerId: "c8",
    customerName: "Jennifer Brown",
    customerEmail: "j.brown@edulearn.edu",
    createdAt: new Date("2026-01-13T13:20:00"),
    updatedAt: new Date("2026-01-13T13:20:00"),
    slaDeadline: new Date("2026-01-14T13:20:00"),
    tags: ["mobile", "ios", "crash", "critical"],
  },
];

// Mock Conversation Messages
export const mockConversations: { [ticketId: string]: ConversationMessage[] } = {
  t1: [
    {
      id: "m1",
      ticketId: "t1",
      sender: "customer",
      senderName: "John Anderson",
      content: "Hi, I'm trying to export our customer list to CSV but the file comes out empty. This feature was working perfectly last week. Can you help?",
      timestamp: new Date("2026-01-12T09:30:00"),
    },
    {
      id: "m2",
      ticketId: "t1",
      sender: "agent",
      senderName: "Sarah Connor",
      senderAvatar: "/avatars/sarah.jpg",
      content: "Hello John! Thanks for reaching out. I see you're experiencing issues with CSV export. Let me check a few things. Could you tell me approximately how many customers you're trying to export?",
      timestamp: new Date("2026-01-12T10:15:00"),
    },
    {
      id: "m3",
      ticketId: "t1",
      sender: "customer",
      senderName: "John Anderson",
      content: "It's around 2,300 customers. I've tried both \"Export All\" and filtering to specific segments, same result - blank CSV file.",
      timestamp: new Date("2026-01-12T10:45:00"),
    },
    {
      id: "m4",
      ticketId: "t1",
      sender: "agent",
      senderName: "Sarah Connor",
      senderAvatar: "/avatars/sarah.jpg",
      content: "Thank you for that information. I've identified the issue - there was a bug introduced in last week's deployment affecting exports over 2,000 records. Our engineering team is working on a fix that should be deployed within the next few hours. I'll keep you updated.",
      timestamp: new Date("2026-01-13T11:15:00"),
    },
    {
      id: "m5",
      ticketId: "t1",
      sender: "system",
      senderName: "System",
      content: "Ticket priority updated to High by Sarah Connor",
      timestamp: new Date("2026-01-13T11:16:00"),
    },
  ],
  t2: [
    {
      id: "m6",
      ticketId: "t2",
      sender: "customer",
      senderName: "Emily Davis",
      content: "I just received my January invoice and noticed the amount is $2,500, but according to my plan details, it should be $1,999. Could you please clarify this discrepancy?",
      timestamp: new Date("2026-01-11T14:20:00"),
    },
    {
      id: "m7",
      ticketId: "t2",
      sender: "agent",
      senderName: "John Doe",
      senderAvatar: "/avatars/john.jpg",
      content: "Hi Emily, I've reviewed your account and invoice. The additional $501 is for the Analytics add-on that was activated on December 15th. This add-on costs $501/month and was added per the request from your account administrator.",
      timestamp: new Date("2026-01-11T15:30:00"),
    },
    {
      id: "m8",
      ticketId: "t2",
      sender: "customer",
      senderName: "Emily Davis",
      content: "Oh, I wasn't aware of that addon. Can you send me details about what's included? We might want to reconsider if it's not essential.",
      timestamp: new Date("2026-01-12T09:00:00"),
    },
    {
      id: "m9",
      ticketId: "t2",
      sender: "agent",
      senderName: "John Doe",
      senderAvatar: "/avatars/john.jpg",
      content: "Absolutely! I've sent you a detailed email with the Analytics addon features and pricing. I've also put this ticket on pending while you review. Feel free to reach out if you have any questions or want to make changes to your plan.",
      timestamp: new Date("2026-01-13T10:45:00"),
    },
  ],
  t4: [
    {
      id: "m10",
      ticketId: "t4",
      sender: "customer",
      senderName: "Sarah Williams",
      content: "URGENT: Our entire team cannot access the dashboard. We're getting Error 500 - Internal Server Error. This is blocking our work! Using Chrome on Windows 11.",
      timestamp: new Date("2026-01-13T12:00:00"),
    },
    {
      id: "m11",
      ticketId: "t4",
      sender: "system",
      senderName: "System",
      content: "Ticket automatically escalated to Urgent priority",
      timestamp: new Date("2026-01-13T12:01:00"),
    },
    {
      id: "m12",
      ticketId: "t4",
      sender: "agent",
      senderName: "Sarah Connor",
      senderAvatar: "/avatars/sarah.jpg",
      content: "Hi Sarah, I'm so sorry you're experiencing this issue. This is indeed urgent and I've escalated this to our engineering team. Can you try accessing the dashboard in an incognito/private window and let me know if the issue persists?",
      timestamp: new Date("2026-01-13T12:05:00"),
    },
    {
      id: "m13",
      ticketId: "t4",
      sender: "customer",
      senderName: "Sarah Williams",
      content: "Just tried incognito mode - same error. Also tested on Firefox, same result.",
      timestamp: new Date("2026-01-13T12:10:00"),
    },
    {
      id: "m14",
      ticketId: "t4",
      sender: "agent",
      senderName: "Sarah Connor",
      senderAvatar: "/avatars/sarah.jpg",
      content: "Thank you for testing that. I'm working with engineering right now. It appears to be affecting a small subset of accounts. We're rolling out a fix - you should have access restored within the next 15 minutes. I'll confirm once it's resolved.",
      timestamp: new Date("2026-01-13T12:30:00"),
    },
  ],
};

// Helper functions
export function getTicketStatusColor(status: Ticket["status"]) {
  const colors = {
    new: "bg-blue-100 text-blue-700",
    open: "bg-amber-100 text-amber-700",
    pending: "bg-purple-100 text-purple-700",
    resolved: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-100 text-slate-700",
  };
  return colors[status];
}

export function getTicketPriorityColor(priority: Ticket["priority"]) {
  const colors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };
  return colors[priority];
}

export function calculateSLAProgress(ticket: Ticket): number {
  const now = new Date();
  const total = ticket.slaDeadline.getTime() - ticket.createdAt.getTime();
  const elapsed = now.getTime() - ticket.createdAt.getTime();
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

export function getSLATimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff < 0) return "Overdue";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
}
