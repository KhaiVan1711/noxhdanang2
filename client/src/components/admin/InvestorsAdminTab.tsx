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

export function InvestorsAdminTab() {
  const { data: investors, isLoading, refetch } = trpc.investors.list.useQuery();
  const createInvestorMutation = trpc.investors.create.useMutation();
  const updateInvestorMutation = trpc.investors.update.useMutation();
  const deleteInvestorMutation = trpc.investors.delete.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setEditingInvestor(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (investor: any) => {
    setEditingInvestor(investor);
    setName(investor.name);
    setPhone(investor.phone || '');
    setEmail(investor.email || '');
    setWebsite(investor.website || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhà đầu tư này?')) return;

    try {
      await deleteInvestorMutation.mutateAsync({ id });
      toast.success('Xóa nhà đầu tư thành công');
      refetch();
    } catch (error) {
      toast.error('Lỗi khi xóa nhà đầu tư');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Tên nhà đầu tư là bắt buộc');
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
    };

    try {
      if (editingInvestor) {
        await updateInvestorMutation.mutateAsync({ id: editingInvestor.id, ...payload });
        toast.success('Cập nhật nhà đầu tư thành công');
      } else {
        await createInvestorMutation.mutateAsync(payload);
        toast.success('Thêm nhà đầu tư thành công');
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
        <h2 className="text-lg font-semibold">Danh sách nhà đầu tư</h2>
        <Button size="sm" className="gap-2" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" />
          Thêm nhà đầu tư
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner className="w-6 h-6" />
          </div>
        ) : investors && investors.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nhà đầu tư</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell className="font-medium">
                      {investor.name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {investor.phone || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {investor.email || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {investor.website || '-'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleOpenEdit(investor)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(investor.id)}
                        disabled={deleteInvestorMutation.isPending}
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
            Không có nhà đầu tư nào
          </div>
        )}
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingInvestor ? 'Chỉnh sửa nhà đầu tư' : 'Thêm nhà đầu tư mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Tên nhà đầu tư *</label>
              <Input placeholder="Ví dụ: Tập đoàn Viglacera" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Số điện thoại</label>
              <Input placeholder="Ví dụ: 0236.3666.666" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Email</label>
              <Input type="email" placeholder="Ví dụ: contact@viglacera.vn" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Website</label>
              <Input placeholder="Ví dụ: www.viglacera.com.vn" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>Hủy</Button>
              <Button type="submit" size="sm" disabled={createInvestorMutation.isPending || updateInvestorMutation.isPending}>
                {editingInvestor ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
