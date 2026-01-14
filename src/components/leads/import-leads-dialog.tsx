"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Customer } from "@/types";

interface ImportLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (leads: Customer[]) => void;
}

export function ImportLeadsDialog({
  open,
  onOpenChange,
  onImport,
}: ImportLeadsDialogProps) {
  const t = useTranslations("leads");
  const tc = useTranslations("common");
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    
    // Simulate import with mock data
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Generate mock imported leads
    const mockImportedLeads: Customer[] = [
      {
        id: Date.now(),
        code: `LEAD-${Date.now()}`,
        name: "Imported Lead 1",
        email: "lead1@example.com",
        phone: "0901234567",
        company_name: "Import Corp",
        source: "csv_import",
        type: "LEAD",
        status_id: 1,
        owner_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Date.now() + 1,
        code: `LEAD-${Date.now() + 1}`,
        name: "Imported Lead 2",
        email: "lead2@example.com",
        phone: "0902345678",
        company_name: "New Business Ltd",
        source: "csv_import",
        type: "LEAD",
        status_id: 1,
        owner_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    
    onImport(mockImportedLeads);
    setIsImporting(false);
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-600" />
            {t("importLeads") || "Import Leads"}
          </DialogTitle>
          <DialogDescription>
            {t("importDescription") || "Upload a CSV file to import leads"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <FileSpreadsheet className="h-8 w-8" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Check className="h-5 w-5" />
              </div>
            ) : (
              <div className="text-slate-500">
                <Upload className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">{tc("dropFile") || "Click to upload or drag and drop"}</p>
                <p className="text-xs text-slate-400 mt-1">CSV, XLSX (max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tc("loading")}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {tc("import") || "Import"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
