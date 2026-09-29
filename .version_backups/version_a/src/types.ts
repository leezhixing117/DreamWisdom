export type UserRole = 'free' | 'paid' | 'admin' | 'super_admin' | 'user';

export function normalizeRole(role?: string): 'free' | 'paid' | 'admin' | 'super_admin' {
  if (role === 'super_admin') return 'super_admin';
  if (role === 'admin') return 'admin';
  if (role === 'paid') return 'paid';
  return 'free';
}

export function getRoleDisplayName(role?: string): string {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'super_admin':
      return '高級管理員';
    case 'admin':
      return '管理員';
    case 'paid':
      return '付費會員';
    case 'free':
      return '一般會員';
  }
}

export interface User {
  id: string;
  email: string;
  display_name?: string;
  role: UserRole;
  password?: string; // 預設密碼 Abc123，可經 Email 重設
  stars?: number; // 一般會員透過隨機彈出片儲備之星星數
  storage_quota?: number; // 免費預設 3 條，星星幣可兌換至上限 10 條，付費版為無限
  privacy_local_only?: boolean; // 本地模式概念：數據只留存瀏覽器 LocalStorage
  created_at?: string;
  is_banned?: boolean; // 高級管理員封禁停權標記
  banned_at?: string; // 封禁時間
  banned_reason?: string; // 封禁原因
}

export interface BannedRecord {
  email: string;
  reason?: string;
  banned_at: string;
  banned_by?: string;
}

export interface DreamSymbol {
  symbol: string;
  meaning: string;
  culturalContext?: string; // 東方文化或本土生活象徵
}

export interface DreamPerspective {
  name: string;
  text: string;
}

export interface BookSource {
  book_title: string;
  page_start: number;
  page_end?: number;
}

export interface DetectiveQuestion {
  id: string;
  question: string;
  options: string[];
  selectedAnswer?: string;
}

export interface BookBrainTheory {
  theoryName: string;
  bookTitle: string;
  citation: string;
  coreInsight: string;
}

export interface PastDreamComparison {
  matchedPatterns: string[];
  pastOccurrencesSummary: string;
  keyNoteworthyMessage: string;
}

export interface QuickAnalysis {
  title: string;
  simpleSummary: string;
  primarySymbol: {
    symbol: string;
    meaning: string;
  };
  quickTakeaway: string;
  suggestedQuestions: DetectiveQuestion[];
  bookBrainSnippet?: {
    bookTitle: string;
    theory: string;
  };
  noteworthyMessage?: string;
}

export interface FourLayerReading {
  asianCulturalLayer: {
    title: string;
    description: string;
    keywords: string[];
  };
  jungianLayer: {
    title: string;
    description: string;
    archetype: string;
  };
  personalLayer: {
    title: string;
    description: string;
  };
  integrationAction: {
    title: string;
    advice: string;
  };
}

export interface DreamReport {
  title: string;
  summary: string;
  symbols: DreamSymbol[];
  perspectives: DreamPerspective[];
  questions: string[];
  sources: BookSource[];
  fourLayers?: FourLayerReading;
  detectiveAnswers?: Record<string, string>;
  bookBrainTheory?: BookBrainTheory;
  pastDreamComparison?: PastDreamComparison;
  noteworthyMessage?: string;
  dnaContribution?: {
    dominantSymbol: string;
    dominantEmotion: string;
    themeDetected: string;
  };
}

export interface DreamEntry {
  id: string;
  title: string;
  dream_text: string;
  created_at: string; // 每條夢境自動記錄精確時間
  sleepPeriod?: 'early_night' | 'midnight' | 'dawn_waking'; // 睡眠時段（入睡前期 / 深夜 / 清晨醒前）
  dreamType?: 'normal' | 'nightmare' | 'lucid' | 'recurring' | 'prophetic'; // 夢境分類標籤（普通夢 / 噩夢 / 清醒夢 / 重複夢 / 預感夢）
  emotionRating?: number; // 1-5 分情緒評分
  guidedData?: {
    characters?: string;
    scene?: string;
    emotion?: string;
    keyObjects?: string;
    plot?: string;
  };
  report_json: DreamReport;
  rawCantoneseTranscription?: string;
  tags?: string[];
}

export interface DreamDnaSymbol {
  name: string;
  count: number;
  category: 'element' | 'place' | 'character' | 'action';
  evolution: Array<{
    dreamId: string;
    dreamTitle: string;
    date: string;
    state: string; // e.g. "第一次：平靜", "第二次：洪水"
  }>;
}

export interface DreamDNA {
  totalDreams: number;
  symbols: DreamDnaSymbol[];
  emotionRatios: Array<{
    emotion: string;
    percentage: number;
    color: string;
  }>;
  recurringThemes: Array<{
    theme: string;
    count: number;
    description: string;
  }>;
  narrativeFingerprint: string;
  updatedAt: string;
}

export interface ConstellationNode {
  id: string;
  dreamId: string;
  title: string;
  date: string;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  primarySymbol: string;
  place?: string;
  character?: string;
  emotion: string;
  size: number;
  magnitude: number;
}

export interface ConstellationLink {
  sourceId: string;
  targetId: string;
  relationType: 'character' | 'place' | 'symbol' | 'emotion' | 'opposite_ending';
  relationLabel: string;
}

export interface ThirtyNightsClue {
  night: number;
  dreamId?: string;
  date: string;
  clueTitle: string;
  clueText: string;
  unlocked: boolean;
}

export interface ThirtyNightsJourney {
  completedNights: number;
  targetNights: number;
  currentStreak: number;
  clues: ThirtyNightsClue[];
  overallMysteryReport?: {
    title: string;
    coreMetaphor: string;
    deepSynthesis: string;
    subconsciousDirective: string;
  };
}

export interface DreamSynthesis {
  headline: string;
  summary: string;
  patterns: string[];
  next: string;
}

export interface BookBrainItem {
  id: string;
  title: string;
  file_name: string;
  status: 'queued' | 'processing' | 'ready' | 'error';
  total_pages: number;
  processed_pages: number;
  created_at?: string;
}

export type ProductStatus = 'approved' | 'pending' | 'rejected';

export type ProductAvailabilityStatus =
  | '現貨供應'
  | '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。'
  | '本活動已圓滿結束'
  | '等待活動開始'
  | '候補中';

export interface ProductItem {
  id: string;
  name: string;
  subTitle: string;
  brand: string;
  priceHKD: number;
  originalPriceHKD?: number;
  starsRedeemCost?: number; // 可以用星星幣折抵或換購
  category: 'purify' | 'sleep' | 'crystal' | 'incense' | 'herb';
  categoryLabel: string;
  volumeOrSpec: string;
  shelfLife: string;
  ingredients: string[];
  keyBenefits: string[];
  scentNotes?: {
    top: string;
    middle: string;
    base: string;
  };
  suitableDreams: string[]; // 例如：['噩夢/鬼怪追逐', '神枱/祖先/家人牽絆', '考場焦慮/心神不寧', '轉運/去霉氣']
  matchingKeywords: string[]; // 匹配關鍵字
  recommendationReason: string; // 廣東話推薦理由
  usageGuide: string;
  cautions: string[];
  imageUrl: string;
  badge?: string;
  inStock: boolean;
  availabilityStatus?: ProductAvailabilityStatus;
  status?: ProductStatus; // 審批狀態：'approved' (公開) | 'pending' (待高級管理員審批) | 'rejected' (已退回)
  submittedByUserId?: string;
  submittedByUserName?: string;
  submittedByUserEmail?: string;
  submittedAt?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface PurchaseOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalHKD: number;
  starsUsed?: number;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'sf_express' | 'store_pickup';
  deliveryAddress: string;
  paymentMethod: 'fps' | 'payme' | 'alipay_hk' | 'wechat_pay' | 'credit_card';
  status: 'pending_payment' | 'paid' | 'dispatched';
  createdAt: string;
  associatedDreamSummary?: string;
}

export type EnginePresetType = 'balanced' | 'empathetic' | 'scholar' | 'asianMentor' | 'poeticZen' | 'custom';

export interface EngineSettings {
  personality: number; // 親和與共情溫度 (0% 客觀分析 - 100% 溫暖共情陪伴)
  decisiveness: number; // 決斷行動指引 (0% 開放探索 - 100% 提煉核心方針)
  depth: number; // 典籍學理深度 (20% 通俗解讀 - 100% 深度文獻溯源)
  culturalResonance: number; // 當代東方文化共鳴 (0% 普世符號 - 100% 深度嶺南與華人集體記憶)
  poeticTone: number; // 意象詩意與修辭感 (0% 樸實白話 - 100% 哲思詩意美感)
  shadowSensitivity: number; // 陰影與噩夢安全防護 (0% 原始直面 - 100% 高度心理賦權緩衝)
  preset?: EnginePresetType; // 風格預設模式
  temperature: number; // 模型發散度 (0.10 - 0.95)
  model: string; // 底層推論模型
}

export interface AdVideoItem {
  id: string;
  title: string;
  advertiser: string;
  tagline: string;
  videoUrl?: string; // 影片真實連結 (如 mp4 / webm / YouTube embed / 本地 blob)
  posterUrl?: string; // 影片封面圖
  dialogueDialogue?: Array<{
    speaker: string; // '外星導師' | '地球探求者' | '旁白'
    text: string;
    speakerAvatar?: string;
  }>;
  durationSeconds: number; // 規定觀看秒數 (例如 10 - 15 秒)
  rewardStars: number; // 觀看完獲得星星數 (預設 1 顆)
  category: 'alien_philosophy' | 'healing_sound' | 'meditation_scene' | 'brand_sponsor';
  bgGradient: string;
  accentColor: string;
  isActive: boolean; // 是否啟用 (隨機播放池)
  createdAt: string;
}

export interface TherapistItem {
  id: string;
  name: string;
  title: string; // 例如「資深頌缽音療師 & 潛意識導引師」
  avatarUrl?: string;
  specialties: string[]; // 專長，例如 ['頌缽音療', '睡眠障礙', '潛意識解夢', '情緒釋放', '創傷整合']
  regions: string[]; // 地區，例如 ['香港 · 旺角', '香港 · 銅鑼灣', '線上視像 (Zoom/Google Meet)', '台灣 · 台北']
  bookingUrl: string; // 預約或聯絡連結 (WhatsApp / IG / 官網)
  contactPhone?: string; // WhatsApp 或電話
  status: 'available' | 'busy' | 'rest'; // 狀態：可即時預約 / 預約爆滿 / 休假中
  matchDreamKeywords: string[]; // 適合推薦的夢境需求關鍵詞，例如 ['噩夢', '被追', '失眠', '胸口發悶', '焦慮', '驚醒']
  bio: string; // 詳細簡介
  experienceYears?: number; // 從業年資
  rating?: number; // 評分 (例如 4.9)
  consultationFee?: string; // 諮詢收費 (例如 HK$800 / 60分鐘)
  featured?: boolean; // 是否置頂推薦
  createdAt: string;
}

export interface UserDreamContext {
  gender?: string;
  recent_status?: string;
  is_recurring?: boolean;
}

export interface DreamMasterAnalysisResult {
  success: boolean;
  analysis_text: string;
  word_count: number;
  disclaimer: string;
  retrieved_data_used: string;
  retrieved_counts: {
    symbols: number;
    themes: number;
    books_and_rules: number;
  };
  compressed_summary_for_followup: string;
  cleaned_dream: string;
  is_follow_up: boolean;
  source: 'gemini' | 'fallback';
}

// -------------------------------------------------------------
// 高級管理員審計與營運監控數據模型 (Super Admin Audit & Analytics)
// -------------------------------------------------------------

export interface LoginRecord {
  id: string;
  userId: string;
  email: string;
  displayName?: string;
  role: UserRole;
  loginAt: string; // ISO 格式時間
  ip?: string;
  userAgent?: string;
  deviceType?: 'Desktop' | 'Mobile' | 'Tablet';
  browser?: string;
  authMethod?: 'password' | 'quick_select' | 'auto_registered' | 'restored_session';
  status?: 'success' | 'blocked_banned' | 'failed_password';
}

export interface AdWatchRecord {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName?: string;
  userRole?: UserRole;
  adId: string;
  adTitle: string;
  advertiser?: string;
  rewardStars: number;
  durationSeconds: number;
  watchedAt: string; // ISO 格式時間
  completed: boolean;
}

export interface ShopVisitRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  userDisplayName?: string;
  userRole?: UserRole;
  enteredAt: string; // ISO 格式時間
  entrySource: 'nav_bar' | 'workspace_recommend' | 'dream_report_link' | 'direct_url' | 'admin_switch' | 'stars_exchange';
  sourceLabel?: string;
  targetProductId?: string;
  targetProductName?: string;
  dreamContextSnippet?: string;
}


