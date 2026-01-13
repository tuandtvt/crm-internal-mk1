"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { revenueData } from "@/lib/mock-data/dashboard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function RevenueChart() {
  const t = useTranslations("dashboard");

  return (
    <Card className="bento-card border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-lg font-bold tracking-tight">
          {t("revenueByMonth")}
        </CardTitle>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-50/50 border-slate-100">
            <SelectValue placeholder={t("viewBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Data</SelectItem>
            <SelectItem value="dept">Department</SelectItem>
            <SelectItem value="me">My Data</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              >
                {revenueData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === revenueData.length - 1 ? "#4f46e5" : "#818cf8"} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
