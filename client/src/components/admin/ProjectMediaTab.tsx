import { useState } from 'react';
import { Plus, Trash2, ImageIcon, ExternalLink, Upload } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { AMENITY_ICONS, AMENITY_TYPE_LABELS } from '@shared/const';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface ProjectMediaTabProps {
  projectId: number;
  projectName: string;
}

export function ProjectMediaTab({ projectId, projectName }: ProjectMediaTabProps) {
  const { data: project, isLoading, refetch } = trpc.projects.getById.useQuery({ id: projectId });

  // Image form
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  // Amenity form
  const [amenityType, setAmenityType] = useState('school');
  const [amenityName, setAmenityName] = useState('');
  const [amenityDistance, setAmenityDistance] = useState('');

  // Pricing form
  const [unitType, setUnitType] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');

  const createImageMutation = trpc.projectImages.create.useMutation();
  const deleteImageMutation = trpc.projectImages.delete.useMutation();
  const createAmenityMutation = trpc.projectAmenities.create.useMutation();
  const deleteAmenityMutation = trpc.projectAmenities.delete.useMutation();
  const createPricingMutation = trpc.projectPricing.create.useMutation();
  const deletePricingMutation = trpc.projectPricing.delete.useMutation();
  const uploadImageMutation = trpc.projectImages.upload.useMutation();

  const [uploading, setUploading] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File quá lớn. Vui lòng chọn file dưới 10MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        if (!base64Data) throw new Error('Không thể đọc file');

        await uploadImageMutation.mutateAsync({
          projectId,
          fileName: file.name,
          fileType: file.type,
          base64Data,
          caption: imageCaption.trim() || undefined,
        });

        toast.success('Tải ảnh lên thành công');
        setImageCaption('');
        refetch();
      } catch (error: any) {
        toast.error('Lỗi khi tải ảnh: ' + (error.message || 'Lỗi hệ thống'));
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      toast.error('Lỗi đọc file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return;
    try {
      await createImageMutation.mutateAsync({ projectId, imageUrl: imageUrl.trim(), caption: imageCaption.trim() || undefined });
      toast.success('Thêm ảnh thành công');
      setImageUrl('');
      setImageCaption('');
      refetch();
    } catch { toast.error('Lỗi khi thêm ảnh'); }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Xóa ảnh này?')) return;
    try {
      await deleteImageMutation.mutateAsync({ id });
      toast.success('Xóa ảnh thành công');
      refetch();
    } catch { toast.error('Lỗi khi xóa ảnh'); }
  };

  const handleAddAmenity = async () => {
    if (!amenityName.trim()) return;
    try {
      await createAmenityMutation.mutateAsync({
        projectId,
        type: amenityType as any,
        name: amenityName.trim(),
        distance: amenityDistance.trim() || undefined,
      });
      toast.success('Thêm tiện ích thành công');
      setAmenityName('');
      setAmenityDistance('');
      refetch();
    } catch { toast.error('Lỗi khi thêm tiện ích'); }
  };

  const handleDeleteAmenity = async (id: number) => {
    try {
      await deleteAmenityMutation.mutateAsync({ id });
      toast.success('Xóa tiện ích thành công');
      refetch();
    } catch { toast.error('Lỗi khi xóa tiện ích'); }
  };

  const handleAddPricing = async () => {
    if (!unitType.trim() || !area.trim() || !price.trim()) return;
    try {
      await createPricingMutation.mutateAsync({ projectId, unitType: unitType.trim(), area: area.trim(), price: price.trim() });
      toast.success('Thêm giá thành công');
      setUnitType('');
      setArea('');
      setPrice('');
      refetch();
    } catch { toast.error('Lỗi khi thêm giá'); }
  };

  const handleDeletePricing = async (id: number) => {
    try {
      await deletePricingMutation.mutateAsync({ id });
      toast.success('Xóa giá thành công');
      refetch();
    } catch { toast.error('Lỗi khi xóa giá'); }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{projectName}</h2>
        <p className="text-sm text-muted-foreground">Quản lý hình ảnh, tiện ích và giá</p>
      </div>

      {/* Images Section */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          Hình ảnh dự án ({project?.images?.length || 0})
        </h3>

        {/* Add image form */}
        <div className="flex gap-2 flex-wrap items-center">
          <Input
            placeholder="URL hình ảnh..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 min-w-0 h-9 text-sm"
            disabled={uploading}
          />
          <Input
            placeholder="Chú thích (tùy chọn)"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            className="w-40 h-9 text-sm"
            disabled={uploading}
          />
          <Button
            size="sm"
            onClick={handleAddImage}
            disabled={!imageUrl.trim() || createImageMutation.isPending || uploading}
            className="gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm bằng URL
          </Button>

          <div className="relative flex-shrink-0">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={handleUploadImage}
              disabled={uploading}
            />
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 pointer-events-none"
              disabled={uploading}
            >
              {uploading ? (
                <Spinner className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
            </Button>
          </div>
        </div>

        {/* Image grid */}
        {project?.images && project.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {project.images.map((img: any) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-video">
                <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display = 'none'; }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                  <a href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="secondary" className="h-7 w-7 p-0"><ExternalLink className="w-3.5 h-3.5" /></Button>
                  </a>
                  <Button size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => handleDeleteImage(img.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate">{img.caption}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-lg">
            <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Chưa có hình ảnh nào</p>
          </div>
        )}
      </Card>

      {/* Amenities Section */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">🏙️ Tiện ích lân cận ({project?.amenities?.length || 0})</h3>

        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={amenityType} onValueChange={setAmenityType}>
            <SelectTrigger className="w-36 h-9 flex-shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AMENITY_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {AMENITY_ICONS[key]} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Tên tiện ích..."
            value={amenityName}
            onChange={(e) => setAmenityName(e.target.value)}
            className="flex-1 min-w-0 h-9"
          />
          <Input
            placeholder="Khoảng cách (vd: 500m)"
            value={amenityDistance}
            onChange={(e) => setAmenityDistance(e.target.value)}
            className="w-36 h-9"
          />
          <Button
            size="sm"
            onClick={handleAddAmenity}
            disabled={!amenityName.trim() || createAmenityMutation.isPending}
            className="gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm
          </Button>
        </div>

        {project?.amenities && project.amenities.length > 0 ? (
          <div className="divide-y divide-border">
            {project.amenities.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-2.5 gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{AMENITY_ICONS[a.type] || '📍'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{AMENITY_TYPE_LABELS[a.type]}{a.distance ? ` • ${a.distance}` : ''}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive flex-shrink-0"
                  onClick={() => handleDeleteAmenity(a.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có tiện ích nào</p>
        )}
      </Card>

      {/* Pricing Section */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">💰 Bảng giá ({project?.pricing?.length || 0})</h3>

        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Input
            placeholder="Loại căn (vd: 1 phòng ngủ)"
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            className="flex-1 min-w-0 h-9"
          />
          <Input
            placeholder="Diện tích (vd: 45-55m²)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-36 h-9"
          />
          <Input
            placeholder="Giá (vd: 1.2-1.5 tỷ)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-36 h-9"
          />
          <Button
            size="sm"
            onClick={handleAddPricing}
            disabled={!unitType.trim() || !area.trim() || !price.trim() || createPricingMutation.isPending}
            className="gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm
          </Button>
        </div>

        {project?.pricing && project.pricing.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Loại căn</th>
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Diện tích</th>
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Giá</th>
                  <th className="py-2 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {project.pricing.map((p: any) => (
                  <tr key={p.id} className="group">
                    <td className="py-2.5 font-medium">{p.unitType}</td>
                    <td className="py-2.5 text-muted-foreground">{p.area}</td>
                    <td className="py-2.5 font-semibold text-primary">{p.price}</td>
                    <td className="py-2.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeletePricing(p.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có bảng giá nào</p>
        )}
      </Card>
    </div>
  );
}
