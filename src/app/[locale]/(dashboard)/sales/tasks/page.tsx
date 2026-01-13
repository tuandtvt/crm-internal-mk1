"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";

// Priority configuration
const PRIORITIES = {
  high: { labelKey: "HIGH", bgColor: "bg-rose-100", textColor: "text-rose-700", dotColor: "bg-rose-500" },
  medium: { labelKey: "MEDIUM", bgColor: "bg-amber-100", textColor: "text-amber-700", dotColor: "bg-amber-500" },
  low: { labelKey: "LOW", bgColor: "bg-blue-100", textColor: "text-blue-700", dotColor: "bg-blue-500" },
} as const;

// Mock tasks data
const mockTasks = [
  {
    id: "1",
    title: "Follow up with TechCorp on renewal proposal",
    description: "Call Sarah to discuss Q2 contract terms",
    dueDate: new Date("2026-01-13"),
    priority: "high" as const,
    customerId: "1",
    customerName: "TechCorp Inc.",
    completed: false,
  },
  {
    id: "2",
    title: "Send proposal to HealthCare+",
    description: "Prepare and send custom development proposal",
    dueDate: new Date("2026-01-14"),
    priority: "high" as const,
    customerId: "6",
    customerName: "HealthCare+",
    completed: false,
  },
  {
    id: "3",
    title: "Update CRM with meeting notes",
    description: "Log notes from yesterday's client calls",
    dueDate: new Date("2026-01-12"),
    priority: "medium" as const,
    customerId: null,
    customerName: null,
    completed: true,
  },
  {
    id: "4",
    title: "Prepare quarterly report",
    description: "Compile sales metrics for Q4 2025",
    dueDate: new Date("2026-01-15"),
    priority: "medium" as const,
    customerId: null,
    customerName: null,
    completed: false,
  },
  {
    id: "5",
    title: "Schedule demo with EduLearn Academy",
    description: "Coordinate demo time with product team",
    dueDate: new Date("2026-01-16"),
    priority: "low" as const,
    customerId: "8",
    customerName: "EduLearn Academy",
    completed: false,
  },
];

// Formatting helper
function formatDueDate(date: Date, completed: boolean, locale: string, t: any) {
  if (completed) {
    return { text: t("Status.RESOLVED"), className: "text-slate-400" };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  const overdue = compareDate < today;
  const isToday = compareDate.getTime() === today.getTime();
  
  if (overdue) {
    return { 
      text: `${t("Tasks.overdue", { count: "" }).replace(" trễ hạn", "").trim()}: ${date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "short", day: "numeric" })}`,
      className: "text-rose-600 font-medium"
    };
  }
  
  if (isToday) {
    return { text: t("Tasks.dueToday"), className: "text-amber-600 font-medium" };
  }
  
  return { 
    text: date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "short", day: "numeric" }),
    className: "text-slate-500"
  };
}

export default function TasksPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("Tasks");
  const tc = useTranslations("Common");
  const ts = useTranslations("Status");
  const tg = useTranslations(); // For global access
  
  const [tasks, setTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesCompleted = showCompleted || !task.completed;
    return matchesSearch && matchesPriority && matchesCompleted;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = tasks.filter((tk) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !tk.completed && tk.dueDate < today;
  }).length;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("subtitle", { completed: completedCount, total: tasks.length })}
            {overdueCount > 0 && (
              <span className="text-rose-600 ml-2">
                · {t("overdue", { count: overdueCount })}
              </span>
            )}
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25">
              <Plus className="mr-2 h-4 w-4" />
              {t("createTask")}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
            <SheetHeader className="px-6 py-5 border-b bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <SheetTitle className="text-lg">{t("createTask")}</SheetTitle>
                  <SheetDescription className="text-sm text-slate-500">
                    {t("description")}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Task Details Section */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-slate-500" />
                  {tc("details")}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("table.title")}</Label>
                    <Input id="title" placeholder="Nhập tiêu đề nhiệm vụ..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{tc("details")}</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Mô tả chi tiết nhiệm vụ..." 
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Priority Section */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {t("table.dueDate")} & {t("table.priority")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">{t("table.dueDate")}</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">{t("table.priority")}</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">{ts("HIGH")}</SelectItem>
                        <SelectItem value="medium">{ts("MEDIUM")}</SelectItem>
                        <SelectItem value="low">{ts("LOW")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Related Customer Section */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  {t("table.assignee")}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="customer">Khách hàng liên quan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khách hàng (tùy chọn)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techcorp">TechCorp Inc.</SelectItem>
                      <SelectItem value="healthcare">HealthCare+</SelectItem>
                      <SelectItem value="edulearn">EduLearn Academy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsSheetOpen(false)}
              >
                {tc("cancel")}
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]"
                onClick={() => setIsSheetOpen(false)}
              >
                {t("createTask")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={tc("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder={t("filterByPriority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tc("all")}</SelectItem>
                <SelectItem value="high">{ts("HIGH")}</SelectItem>
                <SelectItem value="medium">{ts("MEDIUM")}</SelectItem>
                <SelectItem value="low">{ts("LOW")}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="showCompleted"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(checked === true)}
              />
              <Label htmlFor="showCompleted" className="text-sm text-slate-600 cursor-pointer">
                {t("showCompleted")}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <Card className="bg-white border-slate-200/60 shadow-sm">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">{t("noTasks")}</h3>
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map((task) => {
            const priority = PRIORITIES[task.priority];
            const dueInfo = formatDueDate(task.dueDate, task.completed, locale, tg);
            const overdue = !task.completed && task.dueDate < (new Date().setHours(0,0,0,0) as any);

            return (
              <Card 
                key={task.id}
                className={`bg-white border-slate-200/60 shadow-sm transition-all duration-200 hover:shadow-md ${
                  task.completed ? "opacity-60" : ""
                } ${overdue ? "border-l-4 border-l-rose-500" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 flex-shrink-0 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className={`h-5 w-5 ${overdue ? "text-rose-400" : "text-slate-300"} hover:text-indigo-500 transition-colors`} />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className={`font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm mt-0.5 ${task.completed ? "text-slate-300" : "text-slate-500"}`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                        <Badge className={`${priority.bgColor} ${priority.textColor} hover:${priority.bgColor} flex-shrink-0`}>
                          {ts(priority.labelKey)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className={`flex items-center gap-1.5 text-sm ${dueInfo.className}`}>
                          {overdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                          {dueInfo.text}
                        </div>
                        
                        {task.customerName && (
                          <Link 
                            href={`/sales/customers/${task.customerId}`}
                            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            <User className="h-3.5 w-3.5" />
                            {task.customerName}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
