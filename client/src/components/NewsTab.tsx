import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Newspaper,
  Building2,
  ShieldCheck,
  TrendingUp,
  MapPinned,
  CalendarDays,
  ArrowRight,
  Landmark,
  HardHat,
  HandCoins,
  FileText,
  Star,
  Clock,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type Category = 'all' | 'chinh-sach' | 'mo-ban' | 'tien-do' | 'quy-hoach';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: Category;
  categoryLabel: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  badgeColor: string;
  readTime: string;
  featured?: boolean;
}

// ── Category filter config ───────────────────────────────────────────────────
const CATEGORIES: { key: Category; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Tất cả', icon: Newspaper },
  { key: 'chinh-sach', label: 'Chính sách', icon: ShieldCheck },
  { key: 'mo-ban', label: 'Mở bán', icon: Building2 },
  { key: 'tien-do', label: 'Tiến độ', icon: TrendingUp },
  { key: 'quy-hoach', label: 'Quy hoạch', icon: MapPinned },
];

// ── Static news data ─────────────────────────────────────────────────────────
const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: 'Đà Nẵng phê duyệt 3 dự án nhà ở xã hội mới tại quận Liên Chiểu',
    summary:
      'UBND thành phố Đà Nẵng vừa phê duyệt chủ trương đầu tư 3 dự án nhà ở xã hội quy mô lớn tại quận Liên Chiểu, dự kiến cung cấp hơn 2.500 căn hộ cho người thu nhập thấp. Các dự án nằm trong kế hoạch phát triển nhà ở giai đoạn 2025–2030 với tổng vốn đầu tư trên 4.800 tỷ đồng.',
    date: '24/05/2026',
    category: 'quy-hoach',
    categoryLabel: 'Quy hoạch',
    icon: Landmark,
    gradient: 'from-violet-600 via-purple-600 to-indigo-700',
    accentColor: 'text-violet-600',
    badgeColor: 'bg-violet-100 text-violet-700 border-violet-200',
    readTime: '5 phút đọc',
    featured: true,
  },
  {
    id: 2,
    title: 'Hướng dẫn đăng ký mua nhà ở xã hội năm 2025 tại Đà Nẵng',
    summary:
      'Sở Xây dựng Đà Nẵng ban hành hướng dẫn chi tiết quy trình đăng ký, hồ sơ cần thiết và điều kiện để người dân đăng ký mua nhà ở xã hội trên địa bàn thành phố năm 2025.',
    date: '22/05/2026',
    category: 'chinh-sach',
    categoryLabel: 'Chính sách',
    icon: FileText,
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    accentColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    readTime: '4 phút đọc',
  },
  {
    id: 3,
    title: 'Tiến độ xây dựng dự án NOXH Khu đô thị Phước Lý đạt 78%',
    summary:
      'Dự án nhà ở xã hội tại Khu đô thị Phước Lý (quận Cẩm Lệ) đã hoàn thành 78% khối lượng xây dựng. Dự kiến bàn giao cho cư dân vào quý IV/2026 với 680 căn hộ.',
    date: '20/05/2026',
    category: 'tien-do',
    categoryLabel: 'Tiến độ',
    icon: HardHat,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    accentColor: 'text-amber-600',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    readTime: '3 phút đọc',
  },
  {
    id: 4,
    title: 'Chính sách hỗ trợ lãi suất cho người mua nhà ở xã hội tại Đà Nẵng',
    summary:
      'Ngân hàng Chính sách xã hội chi nhánh Đà Nẵng triển khai gói vay ưu đãi với lãi suất chỉ 4,8%/năm dành cho đối tượng mua nhà ở xã hội, thời hạn vay lên đến 25 năm.',
    date: '18/05/2026',
    category: 'chinh-sach',
    categoryLabel: 'Chính sách',
    icon: HandCoins,
    gradient: 'from-emerald-600 via-green-600 to-teal-600',
    accentColor: 'text-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    readTime: '4 phút đọc',
  },
  {
    id: 5,
    title: 'Mở bán 450 căn hộ NOXH tại dự án Hoà Xuân – Đợt 2',
    summary:
      'Chủ đầu tư chính thức mở bán đợt 2 dự án nhà ở xã hội tại khu vực Hoà Xuân, quận Cẩm Lệ. Giá bán từ 16,5 triệu đồng/m², tiếp nhận hồ sơ từ ngày 01/06/2026.',
    date: '15/05/2026',
    category: 'mo-ban',
    categoryLabel: 'Mở bán',
    icon: Building2,
    gradient: 'from-pink-600 via-rose-500 to-red-500',
    accentColor: 'text-pink-600',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    readTime: '3 phút đọc',
  },
  {
    id: 6,
    title: 'Quy hoạch khu nhà ở xã hội 12ha tại quận Ngũ Hành Sơn',
    summary:
      'Thành phố công bố quy hoạch chi tiết khu nhà ở xã hội rộng 12ha tại phường Hoà Quý, quận Ngũ Hành Sơn. Dự kiến xây dựng 3.200 căn hộ phục vụ công nhân khu công nghiệp.',
    date: '12/05/2026',
    category: 'quy-hoach',
    categoryLabel: 'Quy hoạch',
    icon: MapPinned,
    gradient: 'from-sky-600 via-blue-600 to-indigo-600',
    accentColor: 'text-sky-600',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    readTime: '5 phút đọc',
  },
  {
    id: 7,
    title: 'Dự án NOXH Sơn Trà hoàn thành đúng tiến độ, chuẩn bị bàn giao',
    summary:
      'Dự án nhà ở xã hội tại phường An Hải Bắc, quận Sơn Trà đã hoàn thành 100% hạng mục xây dựng. Lễ bàn giao căn hộ cho 320 hộ dân dự kiến tổ chức vào đầu tháng 7/2026.',
    date: '10/05/2026',
    category: 'tien-do',
    categoryLabel: 'Tiến độ',
    icon: TrendingUp,
    gradient: 'from-lime-600 via-green-600 to-emerald-600',
    accentColor: 'text-lime-600',
    badgeColor: 'bg-lime-100 text-lime-700 border-lime-200',
    readTime: '3 phút đọc',
  },
  {
    id: 8,
    title: 'Đà Nẵng ban hành tiêu chí xét duyệt đối tượng mua NOXH mới',
    summary:
      'HĐND thành phố thông qua nghị quyết mới về tiêu chí xét duyệt đối tượng được mua nhà ở xã hội, ưu tiên gia đình trẻ, công nhân lao động và cán bộ công chức có thu nhập dưới 15 triệu đồng/tháng.',
    date: '08/05/2026',
    category: 'chinh-sach',
    categoryLabel: 'Chính sách',
    icon: ShieldCheck,
    gradient: 'from-fuchsia-600 via-purple-600 to-violet-600',
    accentColor: 'text-fuchsia-600',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    readTime: '6 phút đọc',
  },
  {
    id: 9,
    title: 'Mở bán dự án NOXH KCN Hoà Khánh cho công nhân lao động',
    summary:
      'Dự án nhà ở xã hội dành cho công nhân Khu công nghiệp Hoà Khánh chính thức mở bán với 280 căn hộ, diện tích 45–65m². Hỗ trợ trả góp lãi suất ưu đãi từ ngân hàng đối tác.',
    date: '05/05/2026',
    category: 'mo-ban',
    categoryLabel: 'Mở bán',
    icon: Building2,
    gradient: 'from-teal-600 via-cyan-600 to-blue-600',
    accentColor: 'text-teal-600',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    readTime: '4 phút đọc',
  },
  {
    id: 10,
    title: 'Thành phố đặt mục tiêu xây 10.000 căn NOXH đến năm 2030',
    summary:
      'Đà Nẵng công bố kế hoạch phát triển nhà ở xã hội giai đoạn 2025–2030, đặt mục tiêu hoàn thành 10.000 căn hộ, đáp ứng nhu cầu nhà ở cho hơn 30.000 người dân thu nhập thấp trên địa bàn.',
    date: '01/05/2026',
    category: 'quy-hoach',
    categoryLabel: 'Quy hoạch',
    icon: Landmark,
    gradient: 'from-indigo-600 via-blue-700 to-slate-700',
    accentColor: 'text-indigo-600',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    readTime: '7 phút đọc',
  },
];

// ── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  exit: { opacity: 0, y: -20, scale: 0.96, transition: { duration: 0.2 } },
};

const heroVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 24, delay: 0.05 },
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.25 } },
};

const chipVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// ── Component ────────────────────────────────────────────────────────────────
export function NewsTab() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredArticles =
    activeCategory === 'all'
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((a) => a.category === activeCategory);

  const heroArticle = filteredArticles.find((a) => a.featured) ?? filteredArticles[0];
  const gridArticles = filteredArticles.filter((a) => a.id !== heroArticle?.id);

  return (
    <div className="min-h-full space-y-8 pb-10">
      {/* ─── Page header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
            <Newspaper className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tin tức NOXH Đà Nẵng
            </h1>
            <p className="text-sm text-muted-foreground">
              Cập nhật mới nhất về nhà ở xã hội trên địa bàn thành phố
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Category filter chips ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {CATEGORIES.map(({ key, label, icon: Icon }) => {
          const isActive = activeCategory === key;
          return (
            <motion.button
              key={key}
              variants={chipVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setActiveCategory(key)}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium
                transition-all duration-200 cursor-pointer select-none border
                ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                    : 'bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground hover:bg-accent/30'
                }
              `}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {isActive && (
                <motion.span
                  layoutId="chip-count"
                  className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-[10px] font-bold"
                >
                  {filteredArticles.length}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ─── Hero featured article ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        {heroArticle && (
          <motion.div
            key={`hero-${heroArticle.id}`}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="group relative overflow-hidden border-0 p-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Gradient hero header */}
              <div
                className={`relative bg-gradient-to-br ${heroArticle.gradient} px-6 py-10 sm:px-10 sm:py-14`}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
                  <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                </div>

                {/* Grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                  {/* Icon area */}
                  <motion.div
                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 sm:h-20 sm:w-20"
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <heroArticle.icon className="h-8 w-8 text-white sm:h-10 sm:w-10" />
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-sm text-[11px]">
                        <Star className="h-3 w-3 mr-0.5" />
                        Nổi bật
                      </Badge>
                      <Badge className={`${heroArticle.badgeColor} border text-[11px]`}>
                        {heroArticle.categoryLabel}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold leading-snug text-white sm:text-2xl lg:text-3xl">
                      {heroArticle.title}
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                      {heroArticle.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/60 sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {heroArticle.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {heroArticle.readTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA button */}
                <motion.button
                  whileHover={{ x: 4 }}
                  className="relative z-10 mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors hover:bg-white/25 cursor-pointer sm:mt-8"
                >
                  Đọc chi tiết
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Articles grid ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {gridArticles.map((article) => (
            <motion.div key={article.id} variants={cardVariants} layout>
              <NewsCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ─── Empty state ─────────────────────────────────────────── */}
      {filteredArticles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Newspaper className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Chưa có tin tức</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Không tìm thấy bài viết trong danh mục này
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ── NewsCard sub-component ───────────────────────────────────────────────────
function NewsCard({ article }: { article: NewsArticle }) {
  const Icon = article.icon;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 p-0 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
      {/* Card gradient header */}
      <div className={`relative bg-gradient-to-br ${article.gradient} px-5 py-6`}>
        {/* Subtle decorative blobs */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <motion.div
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>
          <Badge className={`${article.badgeColor} border text-[10px] font-semibold`}>
            {article.categoryLabel}
          </Badge>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h3>

        <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          </div>

          <motion.span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${article.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            whileHover={{ x: 3 }}
          >
            Đọc thêm
            <ArrowRight className="h-3 w-3" />
          </motion.span>
        </div>
      </div>

      {/* Hover accent bar at bottom */}
      <div
        className={`h-0.5 w-full bg-gradient-to-r ${article.gradient} origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}
      />
    </Card>
  );
}
