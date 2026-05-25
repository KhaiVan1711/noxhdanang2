import { useEffect, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { STATUS_LABELS, STATUS_COLORS, PROJECT_TYPE_LABELS } from '@shared/const';

export interface FilterState {
  searchTerm?: string;
  wardId?: number;
  status?: string;
  projectType?: string;
}

interface Ward { id: number; name: string; }

interface ProjectFiltersProps {
  wards: Ward[];
  onFilterChange: (filters: FilterState) => void;
  isLoading: boolean;
}

export function ProjectFilters({ wards, onFilterChange, isLoading }: ProjectFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '' });

  const updateFilter = useCallback((patch: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const hasActiveFilters = !!(filters.searchTerm || filters.wardId || filters.status || filters.projectType);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bộ lọc</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ searchTerm: '' })}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="w-3 h-3" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, địa chỉ..."
          value={filters.searchTerm || ''}
          onChange={(e) => updateFilter({ searchTerm: e.target.value })}
          disabled={isLoading}
          className="h-9 pl-8 pr-3 text-sm"
        />
        {filters.searchTerm && (
          <button
            onClick={() => updateFilter({ searchTerm: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* Ward */}
        <Select
          value={filters.wardId?.toString() || '__all__'}
          onValueChange={(v) => updateFilter({ wardId: v !== '__all__' ? parseInt(v) : undefined })}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Tất cả phường/quận" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tất cả phường/quận</SelectItem>
            {wards.map((ward) => (
              <SelectItem key={ward.id} value={ward.id.toString()}>{ward.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status || '__all__'}
          onValueChange={(v) => updateFilter({ status: v !== '__all__' ? v : undefined })}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[key] }} />
                  {label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Project Type */}
        <Select
          value={filters.projectType || '__all__'}
          onValueChange={(v) => updateFilter({ projectType: v !== '__all__' ? v : undefined })}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Tất cả loại dự án" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tất cả loại dự án</SelectItem>
            {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {filters.status && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
              style={{ backgroundColor: STATUS_COLORS[filters.status] }}
            >
              {STATUS_LABELS[filters.status]}
              <button onClick={() => updateFilter({ status: undefined })} className="hover:opacity-70">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {filters.projectType && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">
              {PROJECT_TYPE_LABELS[filters.projectType]}
              <button onClick={() => updateFilter({ projectType: undefined })} className="hover:opacity-70">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {filters.wardId && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[10px] font-medium">
              Phường đã chọn
              <button onClick={() => updateFilter({ wardId: undefined })} className="hover:opacity-70">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
