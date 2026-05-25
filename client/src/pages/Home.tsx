import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Menu, X, Map, List, SlidersHorizontal, LayoutGrid, Newspaper, FileText, Shield, ChevronRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { DashboardKPI } from '@/components/DashboardKPI';
import { ProjectFilters, FilterState } from '@/components/ProjectFilters';
import { ProjectCard } from '@/components/ProjectCard';
import { GISMap } from '@/components/GISMap';
import { ProjectDetailModal } from '@/components/ProjectDetailModal';
import { NewsTab } from '@/components/NewsTab';
import { ProcedureGuideTab } from '@/components/ProcedureGuideTab';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/_core/hooks/useAuth';

type MainTab = 'map' | 'news' | 'guide';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>('map');
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '' });
  const [highlightedProjectId, setHighlightedProjectId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = trpc.projects.list.useQuery();
  const { data: kpiData, isLoading: kpiLoading } = trpc.projects.kpi.useQuery();
  const { data: wardsData, isLoading: wardsLoading } = trpc.projects.wards.useQuery();

  const filteredProjects = useMemo(() => {
    if (!projectsData) return [];
    return projectsData.filter((project) => {
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (!project.name.toLowerCase().includes(term) && !project.address.toLowerCase().includes(term)) {
          return false;
        }
      }
      if (filters.wardId && project.wardId !== filters.wardId) return false;
      if (filters.status && project.status !== filters.status) return false;
      if (filters.projectType && project.projectType !== filters.projectType) return false;
      return true;
    });
  }, [projectsData, filters]);

  const isLoading = projectsLoading || kpiLoading || wardsLoading;

  const handleFilterChange = useCallback((f: FilterState) => setFilters(f), []);

  const activeFilterCount = [filters.wardId, filters.status, filters.projectType, filters.searchTerm].filter(Boolean).length;

  const tabs = [
    { id: 'map' as MainTab, label: 'Bản đồ', icon: Map, mobileLabel: 'Bản đồ' },
    { id: 'news' as MainTab, label: 'Tin tức', icon: Newspaper, mobileLabel: 'Tin tức' },
    { id: 'guide' as MainTab, label: 'Hướng dẫn thủ tục', icon: FileText, mobileLabel: 'Thủ tục' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 header-gradient shadow-xl"
      >
        {/* Top bar */}
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight tracking-tight">
                NOXH Đà Nẵng
              </h1>
              <p className="text-[10px] sm:text-xs text-blue-200/70 hidden sm:block">
                Hệ thống tra cứu nhà ở xã hội thành phố Đà Nẵng
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-md shadow-white/20'
                    : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {activeTab === 'map' && (
              <>
                {/* Desktop sidebar toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex gap-2 text-blue-100/80 hover:text-white hover:bg-white/10 h-8"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-xs">{sidebarCollapsed ? 'Hiện' : 'Ẩn'}</span>
                </Button>

                {/* Mobile filter button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden relative gap-1.5 h-8 px-3 text-blue-100/80 hover:text-white hover:bg-white/10"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-xs">Lọc</span>
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-emerald-400 text-slate-900 border-0">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </>
            )}

            {user?.role === 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/admin'}
                className="gap-1.5 h-8 text-blue-100/80 hover:text-white hover:bg-white/10"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Quản lý</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden border-t border-white/10 flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-white bg-white/10 border-b-2 border-emerald-400'
                  : 'text-blue-200/60 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.mobileLabel}
            </button>
          ))}
        </div>

        {/* Map tab: Mobile view toggle */}
        {activeTab === 'map' && (
          <div className="md:hidden border-t border-white/5 flex bg-slate-900/50">
            <button
              onClick={() => setMobileView('list')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                mobileView === 'list'
                  ? 'text-emerald-300 border-b-2 border-emerald-400 bg-white/5'
                  : 'text-blue-200/50'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Danh sách ({filteredProjects.length})
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                mobileView === 'map'
                  ? 'text-emerald-300 border-b-2 border-emerald-400 bg-white/5'
                  : 'text-blue-200/50'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Bản đồ
            </button>
          </div>
        )}

        {/* Mobile filter panel */}
        <AnimatePresence>
          {showFilters && activeTab === 'map' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-slate-900/80 backdrop-blur-lg px-4 py-3 overflow-hidden"
            >
              <div className="bg-background rounded-xl p-3">
                <ProjectFilters
                  wards={wardsData || []}
                  onFilterChange={handleFilterChange}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'map' && (
          <motion.div
            key="map-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 overflow-hidden"
            style={{ height: 'calc(100vh - var(--header-height, 96px))' }}
          >
            {/* Sidebar */}
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.aside
                  key="sidebar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 384, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="hidden lg:flex flex-col border-r border-border/50 bg-background/70 backdrop-blur-sm overflow-hidden flex-shrink-0"
                >
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* KPI */}
                    <DashboardKPI data={kpiData || null} isLoading={kpiLoading} />

                    {/* Filters */}
                    <ProjectFilters
                      wards={wardsData || []}
                      onFilterChange={handleFilterChange}
                      isLoading={isLoading}
                    />

                    {/* Project list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <h2 className="font-semibold text-foreground text-sm">
                          Dự Án
                          <span className="ml-1.5 text-muted-foreground font-normal">({filteredProjects.length})</span>
                        </h2>
                        {isLoading && <Spinner className="w-3.5 h-3.5" />}
                      </div>

                      {isLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
                          ))}
                        </div>
                      ) : projectsError ? (
                        <div className="text-center py-10 space-y-2">
                          <div className="text-3xl">⚠️</div>
                          <p className="text-sm font-medium text-foreground">Không thể tải dữ liệu</p>
                          <p className="text-xs text-muted-foreground">Vui lòng thử lại sau</p>
                        </div>
                      ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-10 space-y-2">
                          <div className="text-3xl">🔍</div>
                          <p className="text-sm font-medium text-foreground">Không tìm thấy dự án</p>
                          <p className="text-xs text-muted-foreground">Thử thay đổi bộ lọc tìm kiếm</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(index * 0.04, 0.3) }}
                            >
                              <ProjectCard
                                {...project}
                                onHover={setHighlightedProjectId}
                                onClick={setSelectedProjectId}
                                isHighlighted={highlightedProjectId === project.id}
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Map */}
            <main className={`flex-1 flex flex-col overflow-hidden ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
              {/* Desktop KPI strip when sidebar collapsed */}
              {sidebarCollapsed && (
                <div className="hidden lg:block border-b border-border/50 bg-background/60 backdrop-blur-sm p-3">
                  <DashboardKPI data={kpiData || null} isLoading={kpiLoading} compact />
                </div>
              )}

              <div className="flex-1 relative">
                <GISMap
                  projects={filteredProjects}
                  onProjectClick={setSelectedProjectId}
                  highlightedProjectId={highlightedProjectId}
                  isLoading={isLoading}
                />
              </div>
            </main>

            {/* Mobile list view */}
            {mobileView === 'list' && (
              <div className="lg:hidden flex-1 overflow-y-auto bg-background p-4 space-y-4">
                <DashboardKPI data={kpiData || null} isLoading={kpiLoading} />

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="font-semibold text-foreground text-sm">
                      Dự Án <span className="text-muted-foreground font-normal">({filteredProjects.length})</span>
                    </h2>
                    {isLoading && <Spinner className="w-3.5 h-3.5" />}
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : projectsError ? (
                    <div className="text-center py-10 space-y-2">
                      <div className="text-3xl">⚠️</div>
                      <p className="text-sm font-medium">Không thể tải dữ liệu</p>
                      <p className="text-xs text-muted-foreground">Vui lòng thử lại sau</p>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <div className="text-3xl">🔍</div>
                      <p className="text-sm font-medium">Không tìm thấy dự án</p>
                      <p className="text-xs text-muted-foreground">Thử thay đổi bộ lọc</p>
                    </div>
                  ) : (
                    filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.04, 0.3) }}
                      >
                        <ProjectCard
                          {...project}
                          onHover={setHighlightedProjectId}
                          onClick={(id) => {
                            setSelectedProjectId(id);
                            setMobileView('map');
                          }}
                          isHighlighted={highlightedProjectId === project.id}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'news' && (
          <motion.div
            key="news-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
          >
            <NewsTab />
          </motion.div>
        )}

        {activeTab === 'guide' && (
          <motion.div
            key="guide-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
          >
            <ProcedureGuideTab />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}
