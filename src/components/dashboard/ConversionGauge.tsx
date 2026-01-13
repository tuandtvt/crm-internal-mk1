"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { conversionData } from "@/lib/mock-data/dashboard";

export function ConversionGauge() {
  const t = useTranslations("dashboard");
  const percentage = Math.round((conversionData.signedContracts / conversionData.totalLeads) * 100);

  return (
    <Card className="bento-card border-0 flex flex-col justify-between">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold tracking-tight">
          {t("conversionRate")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Progress Ring Background */}
          <svg className="h-32 w-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100"
            />
            {/* Progress Ring Foreground */}
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * percentage) / 100}
              strokeLinecap="round"
              className="text-indigo-600 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{percentage}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Hợp đồng đã ký</span>
            <span className="font-bold text-slate-900">{conversionData.signedContracts}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Tổng lượng Lead</span>
            <span className="font-bold text-slate-900">{conversionData.totalLeads}</span>
          </div>
          <div className="pt-2">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
