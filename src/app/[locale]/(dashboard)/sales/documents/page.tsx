import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockDocuments,
  formatFileSize,
  getFileTypeIcon,
} from "@/lib/mock-data/documents";
import { RelatedEntityLink } from "@/components/common/related-entity-link";
import { FileText, Upload, Download } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tài liệu</h1>
          <p className="text-slate-600 mt-1">Quản lý tài liệu và file đính kèm</p>
        </div>
        <Button className="bg-gradient-premium hover:shadow-lg transition-shadow cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          Tải lên tài liệu
        </Button>
      </div>

      {/* Documents Table */}
      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Danh sách tài liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Tên tài liệu</TableHead>
                <TableHead>Loại file</TableHead>
                <TableHead className="text-right">Kích thước</TableHead>
                <TableHead>Liên kết đến</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-slate-50">
                  <TableCell>
                    <span className="text-2xl">{getFileTypeIcon(doc.file_type)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{doc.name}</span>
                      <span className="text-xs text-slate-500 truncate max-w-xs">
                        {doc.file_path}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {doc.file_type.split("/")[1]?.toUpperCase() || "FILE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatFileSize(doc.size)}
                  </TableCell>
                  <TableCell>
                    {doc.related_type && doc.related_id ? (
                      <RelatedEntityLink
                        relatedType={doc.related_type}
                        relatedId={doc.related_id}
                      />
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {/* TODO: Get user name from owner_id */}
                    User #{doc.owner_id}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {doc.created_at?.toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      title="Tải xuống"
                    >
                      <Download className="h-4 w-4 text-slate-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {mockDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Chưa có tài liệu nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
