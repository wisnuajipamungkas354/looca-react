export interface Category {
  id: number;
  categories_name: string;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  images: string[];
  description: string | null;
  action_link: string;
  action_label: string;
  total_click: number;
}

export interface Workshop {
  id: number;
  title: string;
  sub_title: string | null;
  description: string;
  thumbnail: string;
  video: string | null;
  total_play: number;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  sub_title: string | null;
  description: string | null;
  poster: string;
  start_date: string | null;
  start_time: string | null;
  place: string;
  admission_fee: number | null;
  origin_link: string | null;
  short_link: string | null;
  is_coming_soon: boolean;
  is_active: boolean;
}

export interface SiteSettings {
  whatsapp_number: string;
  instagram_url: string;
  tiktok_url: string;
  shopee_url: string;
}

export interface VisitorStat {
  label: string;
  visitors: number;
}

export interface AnalyticsData {
  daily: VisitorStat[];
  weekly: VisitorStat[];
  monthly: VisitorStat[];
}
