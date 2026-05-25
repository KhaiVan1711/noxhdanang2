import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle2, Circle, FileText, Landmark, Users, 
  Briefcase, ShieldCheck, UserCheck, HardHat, 
  CalendarDays, ChevronDown, Phone, MapPin, 
  Mail, Globe, Clock
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Kiểm tra điều kiện',
    description: 'Xác định xem bạn có đủ điều kiện mua NOXH hay không.',
    icon: UserCheck,
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Thu nhập không quá 11 triệu/tháng',
      'Chưa có nhà ở thuộc sở hữu của mình',
      'Có hộ khẩu thường trú tại Đà Nẵng',
      'Hoặc có đăng ký tạm trú và đóng BHXH tại Đà Nẵng từ 1 năm trở lên'
    ]
  },
  {
    id: 2,
    title: 'Chuẩn bị hồ sơ',
    description: 'Chuẩn bị đầy đủ các giấy tờ theo quy định.',
    icon: FileText,
    color: 'from-cyan-500 to-teal-500',
    details: [
      'Đơn đăng ký mua nhà ở xã hội',
      'Bản sao CMND/CCCD/Hộ chiếu',
      'Giấy xác nhận tình trạng hôn nhân/Bản sao Giấy chứng nhận kết hôn',
      'Giấy xác nhận đối tượng, thực trạng nhà ở',
      'Giấy chứng minh điều kiện thu nhập'
    ]
  },
  {
    id: 3,
    title: 'Nộp hồ sơ',
    description: 'Nộp hồ sơ tại địa điểm được chỉ định.',
    icon: Landmark,
    color: 'from-teal-500 to-emerald-500',
    details: [
      'Nộp trực tiếp tại Chủ đầu tư dự án',
      'Hoặc nộp qua Sở Xây dựng TP Đà Nẵng',
      'Nhận giấy biên nhận hồ sơ'
    ]
  },
  {
    id: 4,
    title: 'Xét duyệt',
    description: 'Cơ quan chức năng thẩm định hồ sơ.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-green-500',
    details: [
      'Thời gian xét duyệt: 30-45 ngày làm việc',
      'Chủ đầu tư báo cáo Sở Xây dựng kiểm tra danh sách',
      'Công bố danh sách người mua hợp lệ'
    ]
  },
  {
    id: 5,
    title: 'Ký hợp đồng',
    description: 'Hoàn tất thủ tục mua bán và nhận nhà.',
    icon: Briefcase,
    color: 'from-green-500 to-lime-500',
    details: [
      'Thỏa thuận và ký Hợp đồng mua bán',
      'Thanh toán theo tiến độ quy định',
      'Nhận bàn giao căn hộ'
    ]
  }
];

const eligibilityCriteria = [
  { title: 'Người thu nhập thấp', icon: Users, desc: 'Người lao động có thu nhập thấp, hộ nghèo, cận nghèo' },
  { title: 'Cán bộ, công chức', icon: Briefcase, desc: 'Cán bộ, công chức, viên chức theo quy định' },
  { title: 'Lực lượng vũ trang', icon: ShieldCheck, desc: 'Sĩ quan, quân nhân, công an nhân dân' },
  { title: 'Công nhân KCN', icon: HardHat, desc: 'Người lao động đang làm việc tại các khu công nghiệp' },
  { title: 'Hộ gia đình trẻ', icon: Users, desc: 'Hộ gia đình trẻ (dưới 35 tuổi), phụ nữ đơn thân' }
];

const faqs = [
  {
    q: 'Ai được mua nhà ở xã hội?',
    a: 'Đối tượng được mua NOXH bao gồm: Người có công với cách mạng; người thu nhập thấp, hộ nghèo, cận nghèo; người lao động đang làm việc tại các doanh nghiệp trong và ngoài khu công nghiệp; sĩ quan, hạ sĩ quan nghiệp vụ; cán bộ, công chức, viên chức...'
  },
  {
    q: 'Giá nhà ở xã hội bao nhiêu?',
    a: 'Giá bán NOXH do Chủ đầu tư xây dựng, được cơ quan nhà nước cấp tỉnh thẩm định. Tại Đà Nẵng, giá thường dao động từ 12-16 triệu đồng/m2 tùy dự án và vị trí.'
  },
  {
    q: 'Có được bán lại nhà ở xã hội không?',
    a: 'Người mua NOXH không được chuyển nhượng dưới mọi hình thức trong thời gian tối thiểu 5 năm kể từ ngày trả hết tiền mua nhà. Sau 5 năm, người mua mới được phép bán, thế chấp, cho thuê.'
  },
  {
    q: 'Thời gian chờ đợi bao lâu?',
    a: 'Thời gian từ lúc nộp hồ sơ đến khi có kết quả xét duyệt thường là 30-45 ngày làm việc. Tuy nhiên, thời gian nhận nhà phụ thuộc vào tiến độ xây dựng của từng dự án.'
  },
  {
    q: 'Có hỗ trợ vay ngân hàng không?',
    a: 'Có. Người mua NOXH được vay vốn ưu đãi từ Ngân hàng Chính sách xã hội hoặc các tổ chức tín dụng được chỉ định với lãi suất thấp (thường 4.8% - 5%/năm) và thời hạn vay tối đa lên đến 25 năm.'
  },
  {
    q: 'Hồ sơ nộp ở đâu?',
    a: 'Hồ sơ đăng ký mua NOXH nộp trực tiếp tại Văn phòng Ban quản lý dự án của Chủ đầu tư dự án đó. Bạn nên theo dõi thông báo tiếp nhận hồ sơ trên Cổng thông tin điện tử Sở Xây dựng.'
  }
];

export function ProcedureGuideTab() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-8 sm:p-12 rounded-b-3xl shadow-xl mb-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        
        <div className="relative z-10">
          <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30 mb-4 px-3 py-1 text-xs">
            Cập nhật 2025
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Hướng dẫn thủ tục <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mua nhà ở xã hội</span>
          </h1>
          <p className="text-blue-100/80 max-w-xl text-sm sm:text-base mb-8">
            Quy trình 5 bước chi tiết và điều kiện cần thiết để đăng ký mua Nhà ở xã hội tại thành phố Đà Nẵng.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <CalendarDays className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-white">30-45 ngày xét duyệt</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <Landmark className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-white">Sở Xây dựng Đà Nẵng</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-16">
        {/* Step-by-step Timeline */}
        <section>
          <div className="text-center mb-10">
            <Badge variant="outline" className="text-primary border-primary/30 mb-2">Quy trình</Badge>
            <h2 className="text-2xl font-bold text-foreground">5 Bước Đăng Ký Mua NOXH</h2>
          </div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-cyan-100 to-emerald-100 dark:from-blue-900/50 dark:via-cyan-900/50 dark:to-emerald-900/50 sm:-translate-x-1/2 rounded-full" />
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-0 ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-6 sm:left-1/2 w-12 h-12 bg-background border-4 border-background rounded-full sm:-translate-x-1/2 flex items-center justify-center shadow-lg z-10 -ml-6 sm:ml-0 mt-4 sm:mt-0">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`pl-16 sm:pl-0 sm:w-1/2 ${index % 2 === 0 ? 'sm:pl-12' : 'sm:pr-12'}`}>
                    <Card className="p-5 sm:p-6 hover:shadow-lg transition-all border-border/50 hover:border-primary/30 group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color} text-white opacity-90 group-hover:opacity-100 transition-opacity`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility Section */}
        <section>
          <div className="text-center mb-10">
            <Badge variant="outline" className="text-primary border-primary/30 mb-2">Đối tượng</Badge>
            <h2 className="text-2xl font-bold text-foreground">Ai Được Mua NOXH?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {eligibilityCriteria.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-5 h-full hover:shadow-md transition-all text-center border-border/50 group hover:border-primary/30">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2 text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-10">
            <Badge variant="outline" className="text-primary border-primary/30 mb-2">FAQ</Badge>
            <h2 className="text-2xl font-bold text-foreground">Câu Hỏi Thường Gặp</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <Card 
                key={idx} 
                className="overflow-hidden border-border/50 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <div className="p-4 flex items-center justify-between gap-4">
                  <h3 className="font-medium text-sm sm:text-base text-foreground">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <div className="p-1 h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500" />
            <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Cần hỗ trợ thêm?</h2>
                <p className="text-slate-300 text-sm max-w-md">
                  Vui lòng liên hệ Sở Xây dựng Thành phố Đà Nẵng để được giải đáp thắc mắc và hướng dẫn chi tiết về thủ tục mua Nhà ở xã hội.
                </p>
              </div>
              <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                  <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="text-sm">
                    <p className="text-slate-400 text-xs">Hotline</p>
                    <p className="font-medium">0236 3822 571</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                  <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="text-sm">
                    <p className="text-slate-400 text-xs">Website</p>
                    <p className="font-medium">sxd.danang.gov.vn</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg sm:col-span-2">
                  <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="text-sm">
                    <p className="text-slate-400 text-xs">Địa chỉ</p>
                    <p className="font-medium">Tầng 15 Trung tâm Hành chính TP Đà Nẵng, 24 Trần Phú</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
