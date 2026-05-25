import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, TrendingUp, ChevronRight } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS, PROJECT_TYPE_LABELS } from '@shared/const';

interface ProjectCardProps {
  id: number;
  name: string;
  address: string;
  status: string;
  projectType: string;
  progress: number;
  totalUnits: number;
  soldUnits: number;
  pricePerM2: string;
  investorName: string;
  onHover: (id: number | null) => void;
  onClick: (id: number) => void;
  isHighlighted: boolean;
}

export function ProjectCard({
  id, name, address, status, projectType, progress,
  totalUnits, soldUnits, pricePerM2, investorName,
  onHover, onClick, isHighlighted,
}: ProjectCardProps) {
  const soldPercentage = totalUnits > 0 ? Math.round((soldUnits / totalUnits) * 100) : 0;
  const statusColor = STATUS_COLORS[status] || '#6b7280';
  const availableUnits = totalUnits - soldUnits;

  return (
    <motion.div
      onHoverStart={() => onHover(id)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`
        group relative p-4 rounded-xl border cursor-pointer transition-all select-none overflow-hidden
        ${isHighlighted
          ? 'border-primary/60 bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg shadow-primary/10 ring-1 ring-primary/20'
          : 'border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:bg-gradient-to-r hover:from-primary/[0.02] hover:to-primary/[0.05]'
        }
      `}
    >
      {/* Status indicator line */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all group-hover:w-1.5"
        style={{ backgroundColor: statusColor }}
      />

      <div className="pl-3 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0 text-primary/60" />
              <span className="truncate">{address}</span>
            </p>
          </div>
          <Badge
            className="text-[10px] whitespace-nowrap flex-shrink-0 font-semibold shadow-sm"
            style={{ backgroundColor: statusColor, color: 'white', border: 'none' }}
          >
            {STATUS_LABELS[status] || status}
          </Badge>
        </div>

        {/* Type + Investor */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-semibold">
            {PROJECT_TYPE_LABELS[projectType] || projectType}
          </span>
          <span className="text-border">•</span>
          <span className="truncate">{investorName}</span>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Tiến độ
            </span>
            <span className="font-bold text-foreground tabular-nums">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground leading-none mb-1">Tổng căn</p>
            <p className="text-sm font-bold text-foreground tabular-nums">{totalUnits}</p>
          </div>
          <div className="text-center border-x border-border/40">
            <p className="text-[10px] text-muted-foreground leading-none mb-1">Còn trống</p>
            <p className="text-sm font-bold text-emerald-600 tabular-nums">{availableUnits}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground leading-none mb-1">Đã bán</p>
            <p className="text-sm font-bold text-foreground tabular-nums">{soldPercentage}%</p>
          </div>
        </div>

        {/* Price + Detail link */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Giá/m²</span>
            <span className="text-xs font-bold text-primary ml-1.5">{pricePerM2}</span>
          </div>
          <span className="text-xs text-primary/70 font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem chi tiết <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Highlight glow */}
      {isHighlighted && (
        <motion.div
          layoutId="card-highlight"
          className="absolute inset-0 rounded-xl border-2 border-primary/40 pointer-events-none"
          initial={false}
        />
      )}

      {/* Bottom gradient accent on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
