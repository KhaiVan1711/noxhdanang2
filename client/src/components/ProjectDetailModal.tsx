import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin, Building2, Phone, Mail, Globe, TrendingUp, Home, DollarSign, TreePine, Info } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { STATUS_LABELS, STATUS_COLORS, PROJECT_TYPE_LABELS, AMENITY_ICONS } from '@shared/const';

interface ProjectDetailModalProps {
  projectId: number;
  onClose: () => void;
}

export function ProjectDetailModal({
  projectId,
  onClose,
}: ProjectDetailModalProps) {
  const { data: project, isLoading, error } = trpc.projects.getById.useQuery({
    id: projectId,
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<'info' | 'pricing' | 'amenities'>('info');

  const soldPercentage = project
    ? Math.round((project.soldUnits / project.totalUnits) * 100)
    : 0;

  const currentImage = project?.images?.[currentImageIndex];

  const sections = [
    { id: 'info' as const, label: 'Thông tin', icon: Info },
    { id: 'pricing' as const, label: 'Bảng giá', icon: DollarSign },
    { id: 'amenities' as const, label: 'Tiện ích', icon: TreePine },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
        className="fixed inset-4 sm:inset-6 md:inset-x-auto md:inset-y-6 md:max-w-2xl md:mx-auto z-50 bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border/50"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          ) : error ? (
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
              <div className="text-4xl">⚠️</div>
              <p className="text-sm font-medium text-foreground">Không thể tải thông tin dự án</p>
              <p className="text-xs text-muted-foreground">Vui lòng thử lại sau</p>
              <button
                onClick={onClose}
                className="text-sm text-primary hover:underline mt-2"
              >
                Đóng
              </button>
            </div>
          ) : project ? (
            <>
              {/* Image Gallery */}
              {project.images && project.images.length > 0 ? (
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 aspect-[16/9]">
                  <img
                    src={currentImage?.imageUrl || ''}
                    alt={currentImage?.caption || 'Project image'}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Image counter */}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white font-medium">
                    {currentImageIndex + 1} / {project.images.length}
                  </div>

                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(
                            (prev) => (prev - 1 + project.images!.length) % project.images!.length
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(
                            (prev) => (prev + 1) % project.images!.length
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition backdrop-blur-sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Thumbnail strip */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      {project.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition shadow-lg ${
                            idx === currentImageIndex
                              ? 'border-white scale-110'
                              : 'border-white/40 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* No image placeholder */
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 h-32 flex items-center justify-center">
                  <div className="text-center text-white/80">
                    <Building2 className="w-8 h-8 mx-auto mb-1.5 opacity-60" />
                    <p className="text-xs font-medium">Chưa có hình ảnh</p>
                  </div>
                </div>
              )}

              {/* Project header */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex flex-wrap gap-2 mb-2.5">
                  <Badge
                    className="text-[10px] font-semibold"
                    style={{ backgroundColor: STATUS_COLORS[project.status] || '#6b7280', color: 'white', border: 'none' }}
                  >
                    {STATUS_LABELS[project.status] || project.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {PROJECT_TYPE_LABELS[project.projectType] || project.projectType}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-foreground leading-tight">{project.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                  {project.address}
                </p>
              </div>

              {/* Section tabs */}
              <div className="px-5 flex gap-1 border-b border-border/50">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all border-b-2 ${
                      activeSection === section.id
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    <section.icon className="w-3.5 h-3.5" />
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Section content */}
              <div className="px-5 py-4">
                <AnimatePresence mode="wait">
                  {activeSection === 'info' && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-5"
                    >
                      {/* Progress */}
                      <div className="space-y-2 p-3.5 bg-muted/50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Tiến độ xây dựng
                          </span>
                          <span className="text-sm font-bold text-primary">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        {project.completionDate && (
                          <p className="text-[10px] text-muted-foreground">
                            Dự kiến hoàn thành: <span className="font-medium">{project.completionDate}</span>
                          </p>
                        )}
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5">Tổng căn hộ</p>
                          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{project.totalUnits}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mb-0.5">Đã bán</p>
                          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{project.soldUnits} <span className="text-sm">({soldPercentage}%)</span></p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mb-0.5">Diện tích</p>
                          <p className="text-base font-bold text-amber-700 dark:text-amber-300">{project.unitArea || '—'}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 rounded-xl border border-violet-200/50 dark:border-violet-800/30">
                          <p className="text-[10px] text-violet-600 dark:text-violet-400 font-medium mb-0.5">Giá/m²</p>
                          <p className="text-sm font-bold text-violet-700 dark:text-violet-300">{project.pricePerM2 || '—'}</p>
                        </div>
                      </div>

                      {/* Description */}
                      {project.description && (
                        <div className="space-y-1.5">
                          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Mô tả dự án</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                        </div>
                      )}

                      {/* Investor */}
                      {project.investorName && (
                        <div className="p-4 bg-card rounded-xl border border-border/50 space-y-3">
                          <h3 className="text-xs font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                            Nhà đầu tư
                          </h3>
                          <p className="text-sm font-semibold text-foreground">{project.investorName}</p>
                          <div className="space-y-1.5">
                            {project.investorPhone && (
                              <a href={`tel:${project.investorPhone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition">
                                <Phone className="w-3.5 h-3.5" /> {project.investorPhone}
                              </a>
                            )}
                            {project.investorEmail && (
                              <a href={`mailto:${project.investorEmail}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition">
                                <Mail className="w-3.5 h-3.5" /> {project.investorEmail}
                              </a>
                            )}
                            {project.investorWebsite && (
                              <a href={project.investorWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition">
                                <Globe className="w-3.5 h-3.5" /> {project.investorWebsite}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeSection === 'pricing' && (
                    <motion.div
                      key="pricing"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {project.pricing && project.pricing.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-border/50">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loại căn</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diện tích</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giá</th>
                              </tr>
                            </thead>
                            <tbody>
                              {project.pricing.map((p, idx) => (
                                <tr key={idx} className="border-t border-border/30 hover:bg-muted/30 transition-colors">
                                  <td className="py-3 px-4 font-medium">{p.unitType}</td>
                                  <td className="py-3 px-4 text-muted-foreground">{p.area}</td>
                                  <td className="text-right py-3 px-4 font-bold text-primary">{p.price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 space-y-2">
                          <DollarSign className="w-8 h-8 mx-auto text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">Chưa có thông tin bảng giá</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeSection === 'amenities' && (
                    <motion.div
                      key="amenities"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {project.amenities && project.amenities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {project.amenities.map((amenity, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/30 hover:bg-muted/50 transition-colors"
                            >
                              <span className="text-lg">{AMENITY_ICONS[amenity.type] || '📍'}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{amenity.name}</p>
                                <p className="text-xs text-muted-foreground">{amenity.distance}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 space-y-2">
                          <TreePine className="w-8 h-8 mx-auto text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">Chưa có thông tin tiện ích</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </>
  );
}
