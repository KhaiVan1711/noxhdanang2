import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { STATUS_LABELS } from '@shared/const';

export function ProjectsAdminTab() {
  const { data: projects, isLoading, refetch } = trpc.projects.list.useQuery();
  const deleteProjectMutation = trpc.projects.delete.useMutation();

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;

    try {
      await deleteProjectMutation.mutateAsync({ id });
      toast.success('Xóa dự án thành công');
      refetch();
    } catch (error) {
      toast.error('Lỗi khi xóa dự án');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách dự án</h2>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm dự án
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner className="w-6 h-6" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên dự án</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tổng căn</TableHead>
                  <TableHead>Đã bán</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {project.address}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {STATUS_LABELS[project.status] || project.status}
                      </span>
                    </TableCell>
                    <TableCell>{project.totalUnits}</TableCell>
                    <TableCell>{project.soldUnits}</TableCell>
                    <TableCell>{project.progress}%</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(project.id)}
                        disabled={deleteProjectMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Không có dự án nào
          </div>
        )}
      </Card>
    </div>
  );
}
