// Marketing Mock Data

export interface Campaign {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused";
  type: "email" | "sms" | "push";
  thumbnail?: string;
  subject: string;
  recipientCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  scheduledDate?: Date;
  sentDate?: Date;
  createdAt: Date;
  createdBy: string;
  template: string;
  audienceSegment: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: "promotional" | "newsletter" | "transactional" | "announcement";
  thumbnail: string;
  description: string;
  usageCount: number;
  createdAt: Date;
  lastModified: Date;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  criteria: string;
}

export interface CampaignAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalRecipients: number;
  totalSent: number;
  trend: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
  }[];
}

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "Spring Sale 2026 - New Product Launch",
    status: "sent",
    type: "email",
    subject: "🌸 Exclusive Spring Deals - Up to 50% Off!",
    recipientCount: 15420,
    sentCount: 15420,
    openRate: 42.5,
    clickRate: 18.3,
    conversionRate: 5.2,
    sentDate: new Date("2026-01-10T10:00:00"),
    createdAt: new Date("2026-01-08"),
    createdBy: "Jane Smith",
    template: "Modern Promotional",
    audienceSegment: "Active Customers",
  },
  {
    id: "c2",
    name: "Weekly Newsletter - Industry Insights",
    status: "scheduled",
    type: "email",
    subject: "Your Weekly Dose of CRM Excellence 📊",
    recipientCount: 8750,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    scheduledDate: new Date("2026-01-15T09:00:00"),
    createdAt: new Date("2026-01-12"),
    createdBy: "John Doe",
    template: "Newsletter Clean",
    audienceSegment: "Newsletter Subscribers",
  },
  {
    id: "c3",
    name: "Re-engagement Campaign - Inactive Users",
    status: "sending",
    type: "email",
    subject: "We miss you! Come back for exclusive rewards 🎁",
    recipientCount: 5240,
    sentCount: 3890,
    openRate: 28.5,
    clickRate: 12.1,
    conversionRate: 3.4,
    scheduledDate: new Date("2026-01-13T14:00:00"),
    createdAt: new Date("2026-01-11"),
    createdBy: "Sarah Connor",
    template: "Re-engagement Bold",
    audienceSegment: "Inactive 30 Days",
  },
  {
    id: "c4",
    name: "Product Update Announcement Q1",
    status: "draft",
    type: "email",
    subject: "🚀 New Features Alert - Transform Your Workflow",
    recipientCount: 0,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    createdAt: new Date("2026-01-13"),
    createdBy: "Jane Smith",
    template: "Feature Announcement",
    audienceSegment: "All Users",
  },
  {
    id: "c5",
    name: "VIP Customer Appreciation",
    status: "sent",
    type: "email",
    subject: "Thank you for being a valued partner ⭐",
    recipientCount: 1250,
    sentCount: 1250,
    openRate: 68.3,
    clickRate: 34.7,
    conversionRate: 15.2,
    sentDate: new Date("2026-01-05T11:00:00"),
    createdAt: new Date("2026-01-03"),
    createdBy: "John Doe",
    template: "Premium VIP",
    audienceSegment: "VIP Customers",
  },
  {
    id: "c6",
    name: "Flash Sale - 24 Hours Only",
    status: "paused",
    type: "email",
    subject: "⚡ FLASH SALE: 60% OFF - Ends Tonight!",
    recipientCount: 22350,
    sentCount: 12100,
    openRate: 51.2,
    clickRate: 23.8,
    conversionRate: 8.9,
    createdAt: new Date("2026-01-09"),
    createdBy: "Sarah Connor",
    template: "Urgent Sale",
    audienceSegment: "All Active",
  },
];

// Mock Email Templates
export const mockTemplates: EmailTemplate[] = [
  {
    id: "t1",
    name: "Modern Promotional",
    category: "promotional",
    thumbnail: "/templates/modern-promo.jpg",
    description: "Clean, modern design perfect for product launches and sales",
    usageCount: 145,
    createdAt: new Date("2025-11-20"),
    lastModified: new Date("2026-01-05"),
  },
  {
    id: "t2",
    name: "Newsletter Clean",
    category: "newsletter",
    thumbnail: "/templates/newsletter-clean.jpg",
    description: "Professional newsletter layout with blog-style content sections",
    usageCount: 89,
    createdAt: new Date("2025-10-15"),
    lastModified: new Date("2025-12-20"),
  },
  {
    id: "t3",
    name: "Re-engagement Bold",
    category: "promotional",
    thumbnail: "/templates/reengagement-bold.jpg",
    description: "Eye-catching design to win back inactive customers",
    usageCount: 56,
    createdAt: new Date("2025-12-01"),
    lastModified: new Date("2026-01-10"),
  },
  {
    id: "t4",
    name: "Feature Announcement",
    category: "announcement",
    thumbnail: "/templates/feature-announcement.jpg",
    description: "Showcase new features with screenshots and clear CTAs",
    usageCount: 34,
    createdAt: new Date("2025-11-10"),
    lastModified: new Date("2025-12-15"),
  },
  {
    id: "t5",
    name: "Premium VIP",
    category: "promotional",
    thumbnail: "/templates/premium-vip.jpg",
    description: "Elegant, sophisticated design for high-value customers",
    usageCount: 28,
    createdAt: new Date("2025-10-25"),
    lastModified: new Date("2025-12-01"),
  },
  {
    id: "t6",
    name: "Urgent Sale",
    category: "promotional",
    thumbnail: "/templates/urgent-sale.jpg",
    description: "High-urgency design with countdown timers and bold CTAs",
    usageCount: 112,
    createdAt: new Date("2025-09-30"),
    lastModified: new Date("2026-01-08"),
  },
  {
    id: "t7",
    name: "Minimal Transactional",
    category: "transactional",
    thumbnail: "/templates/minimal-transactional.jpg",
    description: "Simple, clean design for order confirmations and receipts",
    usageCount: 523,
    createdAt: new Date("2025-08-15"),
    lastModified: new Date("2025-10-20"),
  },
  {
    id: "t8",
    name: "Event Invitation",
    category: "announcement",
    thumbnail: "/templates/event-invitation.jpg",
    description: "  Stylish template for webinar and event invitations",
    usageCount: 41,
    createdAt: new Date("2025-11-05"),
    lastModified: new Date("2025-12-28"),
  },
];

// Mock Audience Segments
export const mockAudienceSegments: AudienceSegment[] = [
  {
    id: "s1",
    name: "Active Customers",
    description: "Customers who made a purchase in the last 30 days",
    count: 15420,
    criteria: "Last purchase < 30 days",
  },
  {
    id: "s2",
    name: "Newsletter Subscribers",
    description: "Users who opted in to newsletter emails",
    count: 8750,
    criteria: "Newsletter opt-in = true",
  },
  {
    id: "s3",
    name: "Inactive 30 Days",
    description: "Users who haven't engaged in 30 days",
    count: 5240,
    criteria: "Last activity > 30 days",
  },
  {
    id: "s4",
    name: "All Users",
    description: "All registered users in the system",
    count: 45680,
    criteria: "Status = active",
  },
  {
    id: "s5",
    name: "VIP Customers",
    description: "Customers with lifetime value > $5,000",
    count: 1250,
    criteria: "LTV > $5000",
  },
  {
    id: "s6",
    name: "All Active",
    description: "All active customers and prospects",
    count: 22350,
    criteria: "Last login < 90 days",
  },
];

// Mock Analytics
export const mockCampaignAnalytics: CampaignAnalytics = {
  totalCampaigns: 127,
  activeCampaigns: 8,
  avgOpenRate: 38.5,
  avgClickRate: 16.2,
  totalRecipients: 458920,
  totalSent: 389450,
  trend: [
    { date: "2026-01-07", sent: 12400, opened: 5208, clicked: 1984 },
    { date: "2026-01-08", sent: 15600, opened: 6552, clicked: 2496 },
    { date: "2026-01-09", sent: 18200, opened: 7644, clicked: 2912 },
    { date: "2026-01-10", sent: 22100, opened: 9282, clicked: 3536 },
    { date: "2026-01-11", sent: 19800, opened: 8316, clicked: 3168 },
    { date: "2026-01-12", sent: 16500, opened: 6930, clicked: 2640 },
    { date: "2026-01-13", sent: 14300, opened: 6006, clicked: 2288 },
  ],
};

// Helper function to format numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Helper function to get status color
export function getCampaignStatusColor(status: Campaign["status"]) {
  const colors = {
    draft: "bg-slate-100 text-slate-700",
    scheduled: "bg-blue-100 text-blue-700",
    sending: "bg-amber-100 text-amber-700",
    sent: "bg-emerald-100 text-emerald-700",
    paused: "bg-orange-100 text-orange-700",
  };
  return colors[status];
}
