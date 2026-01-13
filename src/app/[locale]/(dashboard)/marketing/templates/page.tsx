import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTemplates } from "@/lib/mock-data/marketing";
import { Eye } from "lucide-react";

export default function TemplatesPage() {
  const categories = ["all", "promotional", "newsletter", "transactional", "announcement"] as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Email Templates</h1>
        <p className="text-slate-600 mt-1">Browse and use professional email templates</p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant="outline"
            className="cursor-pointer hover:bg-violet-50 hover:border-violet-300 capitalize"
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {mockTemplates.map((template) => (
          <Card
            key={template.id}
            className="break-inside-avoid bg-white border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover-lift cursor-pointer group overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Template Preview */}
              <div className="aspect-[4/5] bg-gradient-subtle border-b border-slate-200 flex items-center justify-center text-6xl relative overflow-hidden">
                <span>📧</span>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white cursor-pointer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <Badge variant="outline" className="capitalize text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Used {template.usageCount}x</span>
                  <span>{template.lastModified.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
