import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function WardsAdminTab() {
  const { data: wards, isLoading, refetch } = trpc.wards.list.useQuery();
  const createWardMutation = trpc.wards.create.useMutation();
  const updateWardMutation = trpc.wards.update.useMutation();
  const deleteWardMutation = trpc.wards.delete.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const resetForm = () => {
    setName('');
    setDistrict('');
    setLatitude('');
    setLongitude('');
    setEditingWard(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (ward: any) => {
    setEditingWard(ward);
    setName(ward.name);
    setDistrict(ward.district);
    setLatitude(ward.latitude);
    setLongitude(ward.longitude);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phường/quận này?')) return;

    try {
      await deleteWardMutation.mutateAsync({ id });
      toast.success('Xóa phường/quận thành công');
      refetch();
    } catch (error) {
      toast.error('Lỗi khi xóa phường/quận');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !district.trim() || !latitude.trim() || !longitude.trim()) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường');
      return;
    }

    const payload = {
      name: name.trim(),
      district: district.trim(),
      latitude: latitude.trim(),
      longitude: longitude.trim(),
    };

    try {
      if (editingWard) {
        await updateWardMutation.mutateAsync({ id: editingWard.id, ...payload });
        toast.success('Cập nhật phường/quận thành công');
      } else {
        await createWardMutation.mutateAsync(payload);
        toast.success('Thêm phường/quận thành công');
      }
      setIsOpen(false);
      refetch();
    } catch {
      toast.error('Lỗi khi lưu thông tin');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách phường/quận</h2>
        <Button size="sm" className="gap-2" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" />
          Thêm phường/quận
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner className="w-6 h-6" />
          </div>
        ) : wards && wards.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phường/quận</TableHead>
                  <TableHead>Quận</TableHead>
                  <TableHead>Vĩ độ</TableHead>
                  <TableHead>Kinh độ</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wards.map((ward) => (
                  <TableRow key={ward.id}>
                    <TableCell className="font-medium">
                      {ward.name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ward.district}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ward.latitude}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ward.longitude}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleOpenEdit(ward)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(ward.id)}
                        disabled={deleteWardMutation.isPending}
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
            Không có phường/quận nào
          </div>
        )}
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingWard ? 'Chỉnh sửa phường/quận' : 'Thêm phường/quận mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Tên phường/quận *</label>
              <Input placeholder="Ví dụ: Phường Hòa Khánh Bắc" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Quận/Huyện *</label>
              <Input placeholder="Ví dụ: Quận Liên Chiểu" value={district} onChange={(e) => setDistrict(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Vĩ độ (Latitude) *</label>
                <Input placeholder="Ví dụ: 16.0678" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Kinh độ (Longitude) *</label>
                <Input placeholder="Ví dụ: 108.2212" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>Hủy</Button>
              <Button type="submit" size="sm" disabled={createWardMutation.isPending || updateWardMutation.isPending}>
                {editingWard ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
