export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// Vietnamese UI Constants

export const STATUS_LABELS: Record<string, string> = {
  opening_sale: 'Mở bán',
  coming_soon: 'Sắp ra mắt',
  completed: 'Hoàn thành',
  under_construction: 'Đang xây dựng',
  handed_over: 'Bàn giao',
};

export const STATUS_COLORS: Record<string, string> = {
  opening_sale: '#10b981', // emerald
  coming_soon: '#f59e0b', // amber
  completed: '#8b5cf6', // violet
  under_construction: '#3b82f6', // blue
  handed_over: '#06b6d4', // cyan
};

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  apartment: 'Căn hộ',
  townhouse: 'Nhà phố',
  mixed: 'Hỗn hợp',
};

export const AMENITY_TYPE_LABELS: Record<string, string> = {
  school: 'Trường học',
  hospital: 'Bệnh viện',
  market: 'Chợ',
  park: 'Công viên',
  transport: 'Giao thông',
  shopping: 'Mua sắm',
};

export const AMENITY_ICONS: Record<string, string> = {
  school: '🎓',
  hospital: '🏥',
  market: '🛒',
  park: '🌳',
  transport: '🚌',
  shopping: '🛍️',
};

export const VIETNAMESE_MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export const EMPTY_STATES = {
  noProjects: 'Không có dự án nào',
  noResults: 'Không tìm thấy dự án phù hợp',
  noImages: 'Không có hình ảnh',
  noAmenities: 'Không có tiện ích xung quanh',
  noPricing: 'Không có thông tin giá',
};

export const ADMIN_LABELS = {
  dashboard: 'Bảng điều khiển',
  projects: 'Dự án',
  investors: 'Nhà đầu tư',
  wards: 'Phường/Quận',
  images: 'Hình ảnh',
  amenities: 'Tiện ích',
  pricing: 'Giá',
  add: 'Thêm mới',
  edit: 'Chỉnh sửa',
  delete: 'Xóa',
  save: 'Lưu',
  cancel: 'Hủy',
  confirm: 'Xác nhận',
  deleteConfirm: 'Bạn có chắc chắn muốn xóa?',
  success: 'Thành công',
  error: 'Lỗi',
};
