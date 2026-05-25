import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ArrowLeft, Image, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { useLocation } from 'wouter';
import { InvestorsAdminTab } from '@/components/admin/InvestorsAdminTab';
import { WardsAdminTab } from '@/components/admin/WardsAdminTab';
import { ProjectMediaTab } from '@/components/admin/ProjectMediaTab';
import { STATUS_LABELS, STATUS_COLORS } from '@shared/const';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function ProjectsAdminTab({ onManageMedia }: { onManageMedia: (id: number, name: string) => void }) {
  const { data: projects, isLoading, refetch } = trpc.projects.list.useQuery();
  const { data: wards } = trpc.wards.list.useQuery();
  const { data: investors } = trpc.investors.list.useQuery();

  const createProjectMutation = trpc.projects.create.useMutation();
  const updateProjectMutation = trpc.projects.update.useMutation();
  const deleteProjectMutation = trpc.projects.delete.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [wardId, setWardId] = useState<number>(0);
  const [investorId, setInvestorId] = useState<number>(0);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [soldUnits, setSoldUnits] = useState<number>(0);
  const [unitArea, setUnitArea] = useState('');
  const [pricePerM2, setPricePerM2] = useState('');
  const [status, setStatus] = useState<'opening_sale' | 'coming_soon' | 'completed' | 'under_construction' | 'handed_over'>('coming_soon');
  const [progress, setProgress] = useState<number>(0);
  const [completionDate, setCompletionDate] = useState('');
  const [projectType, setProjectType] = useState<'apartment' | 'townhouse' | 'mixed'>('apartment');

  const resetForm = () => {
    setName('');
    setDescription('');
    setAddress('');
    setWardId(wards?.[0]?.id || 0);
    setInvestorId(investors?.[0]?.id || 0);
    setLatitude('');
    setLongitude('');
    setTotalUnits(0);
    setSoldUnits(0);
    setUnitArea('');
    setPricePerM2('');
    setStatus('coming_soon');
    setProgress(0);
    setCompletionDate('');
    setProjectType('apartment');
    setEditingProject(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    if (wards && wards.length > 0) setWardId(wards[0].id);
    if (investors && investors.length > 0) setInvestorId(investors[0].id);
    setIsOpen(true);
  };

  const handleOpenEdit = (project: any) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || '');
    setAddress(project.address);
    setWardId(project.wardId);
    setInvestorId(project.investorId);
    setLatitude(project.latitude);
    setLongitude(project.longitude);
    setTotalUnits(project.totalUnits);
    setSoldUnits(project.soldUnits);
    setUnitArea(project.unitArea || '');
    setPricePerM2(project.pricePerM2 || '');
    setStatus(project.status);
    setProgress(project.progress);
    setCompletionDate(project.completionDate || '');
    setProjectType(project.projectType);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    try {
      await deleteProjectMutation.mutateAsync({ id });
      toast.success('Xóa dự án thành công');
      refetch();
    } catch { toast.error('Lỗi khi xóa dự án'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !latitude.trim() || !longitude.trim() || !totalUnits || !wardId || !investorId) {
      toast.error('Vui lòng nhập đầy đủ các thông tin bắt buộc');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      address: address.trim(),
      wardId,
      investorId,
      latitude: latitude.trim(),
      longitude: longitude.trim(),
      totalUnits,
      soldUnits,
      unitArea: unitArea.trim(),
      pricePerM2: pricePerM2.trim(),
      status,
      progress,
      completionDate: completionDate.trim(),
      projectType,
    };

    try {
      if (editingProject) {
        await updateProjectMutation.mutateAsync({ id: editingProject.id, ...payload });
        toast.success('Cập nhật dự án thành công');
      } else {
        await createProjectMutation.mutateAsync(payload);
        toast.success('Thêm dự án thành công');
      }
      setIsOpen(false);
      refetch();
    } catch {
      toast.error('Lỗi khi lưu thông tin dự án');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Danh sách dự án ({projects?.length || 0})</h2>
        <Button size="sm" className="gap-1.5 h-8" onClick={handleOpenAdd}>
          <Plus className="w-3.5 h-3.5" />
          Thêm dự án
        </Button>
      </div>
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-10"><Spinner /></div>
        ) : projects && projects.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên dự án</TableHead>
                  <TableHead className="hidden md:table-cell">Trạng thái</TableHead>
                  <TableHead className="hidden lg:table-cell">Tổng căn</TableHead>
                  <TableHead className="hidden lg:table-cell">Đã bán</TableHead>
                  <TableHead className="hidden md:table-cell">Tiến độ</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="group">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{project.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{project.address}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: STATUS_COLORS[project.status] || '#6b7280' }}
                      >
                        {STATUS_LABELS[project.status] || project.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{project.totalUnits}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{project.soldUnits}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{project.progress}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 gap-1 text-xs text-muted-foreground hover:text-primary"
                          onClick={() => onManageMedia(project.id, project.name)}
                          title="Quản lý media"
                        >
                          <Image className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Media</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Chỉnh sửa" onClick={() => handleOpenEdit(project)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(project.id)}
                          disabled={deleteProjectMutation.isPending}
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3">🏗️</div>
            <p className="text-sm text-muted-foreground">Chưa có dự án nào</p>
          </div>
        )}
      </Card>

      {/* Add / Edit Project Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Tên dự án *</label>
                  <Input placeholder="Tên dự án..." value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Địa chỉ *</label>
                  <Input placeholder="Địa chỉ..." value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Vĩ độ (Lat) *</label>
                    <Input placeholder="16.0xxx" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Kinh độ (Lng) *</label>
                    <Input placeholder="108.2xxx" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Phường/Quận *</label>
                  {wards && wards.length > 0 ? (
                    <Select value={wardId.toString()} onValueChange={(val) => setWardId(parseInt(val))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phường/quận..." />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((w) => (
                          <SelectItem key={w.id} value={w.id.toString()}>
                            {w.name} ({w.district})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-xs text-destructive">Chưa có phường/quận nào. Hãy thêm ở tab bên cạnh trước.</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Nhà đầu tư *</label>
                  {investors && investors.length > 0 ? (
                    <Select value={investorId.toString()} onValueChange={(val) => setInvestorId(parseInt(val))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn nhà đầu tư..." />
                      </SelectTrigger>
                      <SelectContent>
                        {investors.map((i) => (
                          <SelectItem key={i.id} value={i.id.toString()}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-xs text-destructive">Chưa có nhà đầu tư nào. Hãy thêm ở tab bên cạnh trước.</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Loại hình *</label>
                  <Select value={projectType} onValueChange={(val: any) => setProjectType(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Chung cư</SelectItem>
                      <SelectItem value="townhouse">Nhà liền kề</SelectItem>
                      <SelectItem value="mixed">Hỗn hợp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Tổng số căn *</label>
                    <Input type="number" min={0} value={totalUnits} onChange={(e) => setTotalUnits(parseInt(e.target.value) || 0)} required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Số căn đã bán</label>
                    <Input type="number" min={0} value={soldUnits} onChange={(e) => setSoldUnits(parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Diện tích căn hộ</label>
                  <Input placeholder="Ví dụ: 45 - 75m²" value={unitArea} onChange={(e) => setUnitArea(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Đơn giá m²</label>
                  <Input placeholder="Ví dụ: 15 - 20 triệu/m²" value={pricePerM2} onChange={(e) => setPricePerM2(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Trạng thái bán hàng *</label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Tiến độ xây dựng (%)</label>
                    <Input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Thời gian hoàn thành</label>
                    <Input placeholder="Ví dụ: Quý 4/2025" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Mô tả chi tiết</label>
              <Textarea placeholder="Nhập mô tả dự án..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>Hủy</Button>
              <Button type="submit" size="sm" disabled={createProjectMutation.isPending || updateProjectMutation.isPending}>
                {editingProject ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [selectedProject, setSelectedProject] = useState<{ id: number; name: string } | null>(null);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-foreground mb-2">Truy cập bị từ chối</h1>
          <p className="text-sm text-muted-foreground mb-5">Bạn không có quyền truy cập trang quản lý.</p>
          <Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-muted-foreground h-8 px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Trang chủ</span>
            </Button>
            <div className="w-px h-5 bg-border" />
            <div>
              <h1 className="text-base font-bold text-foreground">Bảng Điều Khiển</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Xin chào, {user?.name || 'Quản trị viên'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { logout(); navigate('/'); }}
            className="gap-1.5 h-8"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Đăng xuất</span>
          </Button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div
              key="media"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-sm">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dự án
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-foreground font-medium truncate max-w-xs">{selectedProject.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProject(null)}
                className="gap-1.5 h-8"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại
              </Button>
              <ProjectMediaTab projectId={selectedProject.id} projectName={selectedProject.name} />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tabs defaultValue="projects" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="projects">Dự Án</TabsTrigger>
                  <TabsTrigger value="investors">Nhà Đầu Tư</TabsTrigger>
                  <TabsTrigger value="wards">Phường/Quận</TabsTrigger>
                </TabsList>
                <TabsContent value="projects">
                  <ProjectsAdminTab
                    onManageMedia={(id, name) => setSelectedProject({ id, name })}
                  />
                </TabsContent>
                <TabsContent value="investors">
                  <InvestorsAdminTab />
                </TabsContent>
                <TabsContent value="wards">
                  <WardsAdminTab />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
