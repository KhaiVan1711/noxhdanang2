import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Home, TrendingUp, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { STATUS_LABELS, STATUS_COLORS } from '@shared/const';

interface KPIData {
  totalProjects: number;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  soldPercentage: number;
  opening_sale: number;
  coming_soon: number;
  under_construction: number;
  completed: number;
  handed_over: number;
}

interface DashboardKPIProps {
  data: KPIData | null;
  isLoading: boolean;
  compact?: boolean;
}

export function DashboardKPI({ data, isLoading, compact = false }: DashboardKPIProps) {
  const [displayValues, setDisplayValues] = useState({
    totalProjects: 0,
    totalUnits: 0,
    availableUnits: 0,
    soldPercentage: 0,
  });

  useEffect(() => {
    if (!data) return;
    const duration = 1200;
    const steps = 25;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setDisplayValues({
        totalProjects: Math.round(data.totalProjects * progress),
        totalUnits: Math.round(data.totalUnits * progress),
        availableUnits: Math.round(data.availableUnits * progress),
        soldPercentage: Math.round(data.soldPercentage * progress),
      });
      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValues({
          totalProjects: data.totalProjects,
          totalUnits: data.totalUnits,
          availableUnits: data.availableUnits,
          soldPercentage: data.soldPercentage,
        });
      }
    }, stepDuration);
    return () => clearInterval(interval);
  }, [data]);

  if (isLoading) {
    if (compact) {
      return (
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 flex-shrink-0 rounded-lg" />
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-7 w-14 mb-1.5" />
            <Skeleton className="h-3.5 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const kpiItems = [
    { icon: Building2, label: 'Tổng dự án', value: displayValues.totalProjects, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
    { icon: Home, label: 'Tổng căn hộ', value: displayValues.totalUnits.toLocaleString('vi-VN'), color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { icon: TrendingUp, label: 'Còn trống', value: displayValues.availableUnits.toLocaleString('vi-VN'), color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950/30' },
    { icon: CheckCircle, label: 'Tỷ lệ bán', value: `${displayValues.soldPercentage}%`, color: 'text-violet-600', bgColor: 'bg-violet-50 dark:bg-violet-950/30' },
  ];

  // Compact mode: horizontal strip for collapsed sidebar
  if (compact) {
    return (
      <div className="flex items-center gap-4 overflow-x-auto pb-1">
        {kpiItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 flex-shrink-0">
            <div className={`p-1.5 rounded-md ${item.bgColor}`}>
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">{item.label}</p>
              <p className="text-sm font-bold text-foreground">{typeof item.value === 'string' ? item.value : item.value.toLocaleString('vi-VN')}</p>
            </div>
          </div>
        ))}
        <div className="w-px h-8 bg-border/50 mx-1 flex-shrink-0" />
        {[
          { key: 'opening_sale', color: STATUS_COLORS.opening_sale },
          { key: 'coming_soon', color: STATUS_COLORS.coming_soon },
          { key: 'under_construction', color: STATUS_COLORS.under_construction },
          { key: 'completed', color: STATUS_COLORS.completed },
        ].map((item) => (
          <div key={item.key} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{STATUS_LABELS[item.key]}</span>
            <span className="text-xs font-semibold text-foreground">{data[item.key as keyof KPIData]}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="p-3.5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5 truncate">{item.label}</p>
                  <p className="text-xl font-bold text-foreground tabular-nums">
                    {typeof item.value === 'string' ? item.value : item.value.toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className={`p-2 rounded-lg flex-shrink-0 ${item.bgColor}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { key: 'opening_sale', label: STATUS_LABELS.opening_sale },
          { key: 'coming_soon', label: STATUS_LABELS.coming_soon },
          { key: 'under_construction', label: STATUS_LABELS.under_construction },
          { key: 'completed', label: STATUS_LABELS.completed },
          { key: 'handed_over', label: STATUS_LABELS.handed_over },
        ].map((item) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-2.5 text-center hover:shadow-md transition-shadow">
              <div
                className="w-2 h-2 rounded-full mx-auto mb-1.5"
                style={{ backgroundColor: STATUS_COLORS[item.key] }}
              />
              <p className="text-base font-bold text-foreground tabular-nums">
                {data[item.key as keyof KPIData]}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{item.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
