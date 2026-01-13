"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockTemplates as initialTemplates, EmailTemplate } from "@/lib/mock-data/marketing";
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
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Plus, Search, Edit2, Copy, Trash2, Mail, Calendar, BarChart3, X } from "lucide-react";

export default function TemplatesPage() {
  const t = useTranslations("marketing");
  const tt = useTranslations("templates");
  const tc = useTranslations("common");

  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "promotional" as EmailTemplate["category"],
    description: "",
    htmlContent: "",
  });

  const categories = ["all", "promotional", "newsletter", "transactional", "announcement"] as const;

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetail = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setDetailOpen(true);
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) return;

    const template: EmailTemplate = {
      id: `t${templates.length + 1}`,
      name: newTemplate.name,
      category: newTemplate.category,
      thumbnail: "/templates/custom.jpg",
      description: newTemplate.description,
      usageCount: 0,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    setTemplates([template, ...templates]);
    setNewTemplate({ name: "", category: "promotional", description: "", htmlContent: "" });
    setCreateOpen(false);
  };

  const handleDuplicate = (template: EmailTemplate) => {
    const duplicate: EmailTemplate = {
      ...template,
      id: `t${templates.length + 1}`,
      name: `${template.name} (${tt("copy")})`,
      usageCount: 0,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    setTemplates([duplicate, ...templates]);
  };

  const handleDelete = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    setDetailOpen(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "promotional":
        return "bg-violet-100 text-violet-700 border-violet-200";
      case "newsletter":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "transactional":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "announcement":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{tt("title")}</h1>
          <p className="text-slate-600 mt-1">{tt("description")}</p>
        </div>
        <Button
          className="bg-gradient-premium hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {tt("createTemplate")}
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={tc("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={tt("filterByCategory")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat === "all" ? tc("all") : tt(`categories.${cat}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Compact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            onClick={() => handleViewDetail(template)}
            className="bg-white border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover-lift cursor-pointer group overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Compact Preview */}
              <div className="h-32 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 border-b border-slate-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-24 bg-white rounded shadow-md flex flex-col items-center justify-center border">
                    <Mail className="h-6 w-6 text-violet-400 mb-1" />
                    <div className="w-12 h-1 bg-slate-200 rounded mb-1" />
                    <div className="w-10 h-1 bg-slate-100 rounded mb-1" />
                    <div className="w-8 h-1 bg-slate-100 rounded" />
                  </div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" className="bg-white cursor-pointer shadow-lg">
                    <Eye className="h-4 w-4 mr-1" />
                    {tt("viewDetail")}
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{template.name}</h3>
                  <Badge className={`${getCategoryColor(template.category)} text-[10px] px-1.5 py-0 shrink-0`}>
                    {tt(`categories.${template.category}`)}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{template.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {template.usageCount}x {tt("used")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {template.lastModified.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="bg-white border-slate-200/60 shadow-sm">
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{tc("noData")}</p>
          </CardContent>
        </Card>
      )}

      {/* Template Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto p-0">
          {selectedTemplate && (
            <>
              <div className="bg-gradient-premium p-6 text-white">
                <SheetHeader className="text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <SheetTitle className="text-white text-xl">{selectedTemplate.name}</SheetTitle>
                      <SheetDescription className="text-violet-100 mt-1">
                        {selectedTemplate.description}
                      </SheetDescription>
                    </div>
                    <Badge className={`${getCategoryColor(selectedTemplate.category)} shadow-lg`}>
                      {tt(`categories.${selectedTemplate.category}`)}
                    </Badge>
                  </div>
                </SheetHeader>
              </div>

              {/* Template Preview */}
              <div className="p-6">
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-4">{tt("preview")}</h4>
                  <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                    {/* Email Header */}
                    <div className="bg-gradient-premium p-4 text-white text-center">
                      <div className="text-2xl mb-2">🎉</div>
                      <h3 className="font-bold text-lg">{tt("sampleSubject")}</h3>
                    </div>
                    {/* Email Body */}
                    <div className="p-6 space-y-4">
                      <p className="text-slate-600 text-sm">{tt("sampleGreeting")}</p>
                      <p className="text-slate-600 text-sm">{tt("sampleBody")}</p>
                      <div className="text-center py-4">
                        <Button className="bg-gradient-premium cursor-pointer">
                          {tt("sampleCTA")}
                        </Button>
                      </div>
                      <p className="text-slate-500 text-xs text-center">{tt("sampleFooter")}</p>
                    </div>
                  </div>
                </div>

                {/* Template Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-violet-50 rounded-lg p-4 text-center border border-violet-100">
                    <div className="text-2xl font-bold text-violet-600">{selectedTemplate.usageCount}</div>
                    <div className="text-xs text-violet-500">{tt("timesUsed")}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                    <div className="text-sm font-medium text-blue-600">
                      {selectedTemplate.createdAt.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-blue-500">{tt("created")}</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100">
                    <div className="text-sm font-medium text-emerald-600">
                      {selectedTemplate.lastModified.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-emerald-500">{tt("lastModified")}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button className="flex-1 bg-gradient-premium cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" />
                    {tt("useTemplate")}
                  </Button>
                  <Button variant="outline" className="cursor-pointer" onClick={() => handleDuplicate(selectedTemplate)}>
                    <Copy className="h-4 w-4 mr-2" />
                    {tt("duplicate")}
                  </Button>
                  <Button variant="outline" className="cursor-pointer">
                    <Edit2 className="h-4 w-4 mr-2" />
                    {tc("edit")}
                  </Button>
                  <Button
                    variant="outline"
                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(selectedTemplate.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Template Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-violet-500" />
              {tt("createTemplate")}
            </DialogTitle>
            <DialogDescription>{tt("createDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="template-name" className="text-slate-700 font-medium">
                {tt("templateName")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="template-name"
                placeholder={tt("templateNamePlaceholder")}
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-slate-700 font-medium">
                {tt("category")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value) =>
                  setNewTemplate({ ...newTemplate, category: value as EmailTemplate["category"] })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">{tt("categories.promotional")}</SelectItem>
                  <SelectItem value="newsletter">{tt("categories.newsletter")}</SelectItem>
                  <SelectItem value="transactional">{tt("categories.transactional")}</SelectItem>
                  <SelectItem value="announcement">{tt("categories.announcement")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-700 font-medium">
                {tt("templateDescription")} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder={tt("templateDescriptionPlaceholder")}
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="mt-1.5 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="html-content" className="text-slate-700 font-medium">
                {tt("htmlContent")}
              </Label>
              <Textarea
                id="html-content"
                rows={6}
                placeholder={tt("htmlContentPlaceholder")}
                value={newTemplate.htmlContent}
                onChange={(e) => setNewTemplate({ ...newTemplate, htmlContent: e.target.value })}
                className="mt-1.5 resize-none font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5 italic">💡 {tt("htmlNote")}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="cursor-pointer">
              {tc("cancel")}
            </Button>
            <Button
              className="bg-gradient-premium cursor-pointer"
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name || !newTemplate.description}
            >
              <Plus className="h-4 w-4 mr-2" />
              {tt("createTemplate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
