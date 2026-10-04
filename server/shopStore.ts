import crypto from 'crypto';

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  subTitle: string;
  brand: string;
  priceHKD: number;
  originalPriceHKD: number;
  starsRedeemCost?: number;
  category: string;
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
  suitableDreams: string[];
  matchingKeywords: string[];
  recommendationReason: string;
  usageGuide: string;
  cautions: string[];
  imageUrl: string;
  badge: string;
  inStock: boolean;
  availabilityStatus: string;
}

// 預設分類數據（禁紫色、純身心靈與榮格心理反思輔助語境）
let categories: Category[] = [
  { id: 'all', name: '全部商品', description: '探索所有潛意識守護與身心靈日常輔助物件', order: 0 },
  { id: 'purify', name: '淨化去霉', description: '嶺南傳統草本提振磁場，驅散夢魘陰影與沉重滯塞', order: 1 },
  { id: 'sleep', name: '深眠安神', description: '安撫夜間焦慮神經，引導心率放緩與無夢好眠', order: 2 },
  { id: 'incense', name: '空間結界', description: '白鼠尾草與聖木煙燻，深層重塑臥室安寧結界', order: 3 },
  { id: 'crystal', name: '靈性直覺', description: '天然原礦晶簇，守護第三眼直覺與清明夢覺察', order: 4 },
  { id: 'herb', name: '草本調校', description: '無咖啡因晚安舒緩茶包，睡前溫潤放鬆身心', order: 5 },
  { id: 'bundle', name: '熱賣套裝', description: '專屬心靈儀式優惠組合，守護一整晚安歇', order: 6 },
];

// 預設商品數據（全部禁用治療/醫治等醫療字眼，強調身心靈輔助）
let products: Product[] = [
  {
    id: 'prod_pomelo_spray',
    name: '零離 · 廣東精選碌柚葉好運香水噴霧',
    subTitle: '去霉開運 · 日進斗金 · 鴻運當頭 · 凝神淨場',
    brand: '零離 (LINGLI)',
    priceHKD: 68,
    originalPriceHKD: 98,
    starsRedeemCost: 15,
    category: 'purify',
    categoryLabel: '淨化去霉 · 好運轉化',
    volumeOrSpec: '100ML 噴霧裝',
    shelfLife: '2 年 (未拆封)',
    ingredients: ['水', '乙醇', '新鮮柚葉提取物 (CITRUS GRANDIS)', '去離子水', '微量植物芳香精華'],
    keyBenefits: [
      '嶺南民俗傳承：去霉氣、祛晦氣、轉好運，提振個人磁場',
      '植物萃取富含天然黃酮類物質，有助淨化空氣與清新環境',
      '芳香調理：促進放鬆，舒緩夢醒後精神緊繃與滯塞感',
      '每天輕噴於睡房或隨身攜帶，自帶清新吉慶氣場',
    ],
    scentNotes: {
      top: '柑橘清香 · 吉慶有餘 (前調清新醒腦)',
      middle: '文旦甜香 · 大吉大利 (中調溫潤安神)',
      base: '橙香四溢 · 八方來財 (後調沉穩聚氣)',
    },
    suitableDreams: [
      '噩夢驚醒 / 被不明力量追趕 / 鬼壓床感',
      '夢見神枱、先人託夢或家族沉重事宜',
      '夢中感到污糟、泥濘、滯塞或沾染污濁',
      '考試失利、破財、掉牙或感到時運不濟',
    ],
    matchingKeywords: ['噩夢', '追', '鬼', '神枱', '祖', '死', '泥', '黑', '沉', '霉', '跌', '病', '髒', '考', '牙'],
    recommendationReason:
      '醒來若感心有餘悸或沉重滯塞，廣東傳統以碌柚葉水淨身去霉。零離好運噴霧萃取天然大吉葉黃酮，一噴驅散夢魘陰影，重塑清爽個人能量場。',
    usageGuide: '外用：適量噴於手腕脈搏處；亦可直接噴於枕頭四周、睡房空氣、辦公桌或進門玄關處淨化空間。',
    cautions: [
      '1. 易燃物品，請遠離火源與高溫處。',
      '2. 嚴禁食用！請置於兒童及寵物不易觸及處。',
      '3. 如不慎入眼，請立即用大量清水沖洗。',
      '4. 本品為身心靈芳香輔助品，非藥品。',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    badge: '👑 人氣熱賣 · 解夢推薦',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
  {
    id: 'prod_lavender_pillow_mist',
    name: '深眠白噪音薰衣草舒緩枕頭噴霧',
    subTitle: '助眠放鬆 · 撫平夜間焦慮 · 減少反覆多夢',
    brand: 'DreamWisdom Herbal Lab',
    priceHKD: 88,
    originalPriceHKD: 128,
    starsRedeemCost: 18,
    category: 'sleep',
    categoryLabel: '深眠安神 · 夢境撫慰',
    volumeOrSpec: '80ML',
    shelfLife: '3 年',
    ingredients: ['普羅旺斯高地真正薰衣草精油', '羅馬洋甘菊水', '岩蘭草根油', '植物甘油'],
    keyBenefits: [
      '撫平自主神經亢奮，引導心率放緩，釋放日常緊繃',
      '減少半夜驚醒與淺眠多夢頻率',
      '營造安全被包裹的睡前香氛儀式感',
    ],
    scentNotes: {
      top: '草本薰衣草淡香',
      middle: '洋甘菊微甜蜜香',
      base: '岩蘭草大地木質煙燻調',
    },
    suitableDreams: [
      '反覆多夢、醒來像沒睡過一樣累',
      '夢見趕時間、搭錯車、不停奔跑疲憊不堪',
      '日常工作高壓引起的淺眠焦慮',
    ],
    matchingKeywords: ['累', '趕', '車', '急', '工', '逃', '跌', '空', '亂', '飛', '跑'],
    recommendationReason:
      '多夢與醒後疲累是清醒期神經未能徹底關機的訊號。睡前於枕畔輕噴，利用天然酯類分子安撫副交感神經，享受安穩寧靜夜晚。',
    usageGuide: '睡前 10 分鐘，距離枕頭與被褥 20-30 厘米均勻按壓噴灑 2-3 下。',
    cautions: ['避免直接對眼睛噴灑，孕婦及蠶豆症患者請先諮詢醫生。非醫療用品。'],
    imageUrl: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=800&q=80',
    badge: '🌙 安睡之選',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
  {
    id: 'prod_sage_cleansing_bundle',
    name: '加州白鼠尾草空間煙燻淨化杖',
    subTitle: '深層空間能量重置 · 驅散雜念與滯留負能量',
    brand: 'Mystic Hearth',
    priceHKD: 52,
    originalPriceHKD: 75,
    starsRedeemCost: 12,
    category: 'incense',
    categoryLabel: '空間結界 · 深層淨化',
    volumeOrSpec: '約 10-12cm 草杖單支裝',
    shelfLife: '長期乾燥保存',
    ingredients: ['天然野生採集白鼠尾草 (Salvia Apiana)'],
    keyBenefits: [
      '古老原住民空間淨化儀式傳承',
      '煙燻能中和室內空氣沉悶微粒，提升心境專注度',
      '強效重塑臥室能量結界，阻絕外界雜訊',
    ],
    suitableDreams: [
      '搬入新居後頻頻做怪夢',
      '夢中場景陰暗封閉、老舊房屋、找不到出口',
      '經歷情感斷捨離或重大人生變動時期',
    ],
    matchingKeywords: ['屋', '房', '迷路', '暗', '鎖', '走廊', '困', '門', '舊', '牆'],
    recommendationReason:
      '若夢境屢次困於老舊壓抑的房舍走廊，代表心靈空間累積了過多未代謝的滯塞雜訊。以白鼠尾草煙燻臥室四角，重啟清明心境。',
    usageGuide: '點燃草杖頂端後輕輕吹滅明火，讓白煙在房間角落繞行，最後置於耐熱器皿中靜置熄滅。',
    cautions: ['使用時保持門窗通風，務必確保完全熄滅後方可離開。純屬香氛煙燻，非醫療用品。'],
    imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
    badge: '🌿 純天然草本',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
  {
    id: 'prod_amethyst_cluster',
    name: '天然烏拉圭原礦晶簇 · 靈性深海藍',
    subTitle: '安撫眉心輪直覺 · 增強理性覺察 · 防夢魘侵擾',
    brand: 'Aura Crystals',
    priceHKD: 128,
    originalPriceHKD: 168,
    starsRedeemCost: 28,
    category: 'crystal',
    categoryLabel: '靈性直覺 · 夢境守護',
    volumeOrSpec: '約 80-120g 獨特原石',
    shelfLife: '永久 (定期消磁)',
    ingredients: ['100% 天然未打磨原礦水晶石'],
    keyBenefits: [
      '轉化紊亂雜思為清明直覺，提升內在平靜',
      '擺放於床頭櫃，守護夜間安寧夢境磁場',
      '幫助清明夢（Lucid Dream）覺察練習',
    ],
    suitableDreams: [
      '面臨人生十字路口、考試或重大抉擇時的糾結夢',
      '靈感枯竭、創作瓶頸時的迷霧夢境',
      '夢中出現強烈直覺或先知性意象',
    ],
    matchingKeywords: ['考', '書', '飛', '海', '水', '眼', '光', '路', '星', '霧'],
    recommendationReason:
      '水體、浩瀚星空或高空飛行之夢，往往與內在直覺啟蒙有關。原礦晶簇能穩定心緒，使夢境啟示在清醒時清晰轉化為生活智慧。',
    usageGuide: '置於床頭櫃、書桌或枕頭旁 30cm 處，每隔月圓之夜以白鼠尾草煙燻消磁淨化。',
    cautions: ['天然原礦邊緣微尖，避免摔落磕碰。非醫療器械。'],
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
    badge: '💎 守護原石',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
  {
    id: 'prod_herbal_sleep_tea',
    name: '有機晚安洋甘菊纈草草本舒緩茶',
    subTitle: '睡前儀式 · 深層放鬆神經 · 撫平多夢與緊繃感',
    brand: 'Serene Herbal Lab',
    priceHKD: 78,
    originalPriceHKD: 108,
    starsRedeemCost: 16,
    category: 'herb',
    categoryLabel: '草本調校 · 睡前舒緩',
    volumeOrSpec: '20 包立體三角茶包 / 盒',
    shelfLife: '18 個月',
    ingredients: ['有機德國洋甘菊', '纈草根', '香蜂草', '西番蓮', '天然薰衣草花瓣'],
    keyBenefits: [
      '天然植物黃酮與纈草草本，自然引導肌肉鬆弛與心神沉靜',
      '無咖啡因配方，睡前溫熱飲用不給腸胃添負擔',
      '建立睡前溫潤安撫儀式，顯著改善淺眠焦躁',
    ],
    scentNotes: {
      top: '清新甘菊微甜香氣',
      middle: '西番蓮果香清潤感',
      base: '纈草大地沉靜草本香',
    },
    suitableDreams: [
      '醒來渾身肌肉緊繃、牙關緊咬',
      '反覆夢見考試、死線、追趕工作進度',
      '夜間頻頻驚醒或難以進入安歇狀態',
    ],
    matchingKeywords: ['追', '忙', '工', '痛', '咬', '驚', '醒', '逼', '緊', '鬧鐘'],
    recommendationReason:
      '夢中反覆追趕或醒後肌肉緊繃，是日間累積之生活壓力未獲紓解。睡前一杯溫潤草本茶，由內而外溫和鬆綁神經，迎向安歇好眠。',
    usageGuide: '睡前 30-45 分鐘，以 90°C 熱水 250ml 沖泡 5-8 分鐘後溫熱慢飲。',
    cautions: ['孕婦、哺乳期婦女或特殊體質者飲用前請先諮詢醫師。本品非藥品，不可代替藥物。'],
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    badge: '☕ 溫暖深眠',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
  {
    id: 'prod_palo_santo_sticks',
    name: '秘魯特選野生老料聖木淨化條 (Palo Santo)',
    subTitle: '原木甜暖乳香 · 提振空間正頻率 · 驅散雜念',
    brand: 'Sacred Woods',
    priceHKD: 62,
    originalPriceHKD: 88,
    starsRedeemCost: 14,
    category: 'incense',
    categoryLabel: '空間結界 · 聖木煙燻',
    volumeOrSpec: '約 5-6 支精選原木袋裝',
    shelfLife: '長期乾燥保存',
    ingredients: ['100% 秘魯天然自然倒伏老料聖木 (Bursera Graveolens)'],
    keyBenefits: [
      '天然高含量檸檬烯樹脂，燃燒釋放甜暖木質香與乳香氣息',
      '南美原住民千年傳統，驅除滯留濁氣，提升靜心冥想品質',
      '睡前於臥室點燃片刻，迅速構築清明安定之防護氣場',
    ],
    suitableDreams: [
      '夢境混亂喧鬧、人多嘈雜、醒後頭痛腦脹',
      '夢見舊居或不熟悉的陰涼空間',
      '感到個人運勢低迷、缺乏動力或磁場受擾',
    ],
    matchingKeywords: ['亂', '吵', '頭', '黑', '沉', '怪', '鬼', '舊', '壓', '嘈'],
    recommendationReason:
      '混亂喧囂的夢境代表氣場受到外在雜訊干擾過甚。聖木的甜美煙燻能溫和轉化低頻雜思，為心靈創造一處沉靜神聖的避風港。',
    usageGuide: '點燃木條一端燃燒約 30 秒後吹熄，持木條在房間空間繞行，最後置於陶瓷皿中自然熄滅。',
    cautions: ['使用時請保持適當通風，遠離易燃物品，確保完全熄滅。非醫療用品。'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    badge: '🔥 空間淨化',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
  {
    id: 'prod_bundle_sleep',
    name: '【深眠無夢】夜間心靈安神舒緩套組',
    subTitle: '枕頭噴霧 + 晚安洋甘菊纈草茶包 · 雙重身心放鬆',
    brand: 'DreamWisdom 精選組合',
    priceHKD: 148,
    originalPriceHKD: 236,
    starsRedeemCost: 32,
    category: 'bundle',
    categoryLabel: '儀式套裝 · 團隊精選',
    volumeOrSpec: '80ML 噴霧 + 20包立體茶包',
    shelfLife: '18 個月',
    ingredients: ['普羅旺斯薰衣草精油', '洋甘菊水', '有機纈草根茶包'],
    keyBenefits: [
      '內外兼修：外以天然香氛安撫感官，內以溫熱草本放鬆神經',
      '建立神聖睡前儀式，降低多夢驚醒機率',
      '套裝特惠現省 HK$88，香港本地免運包郵',
    ],
    suitableDreams: ['反覆多夢', '淺眠易醒', '工作焦慮', '夜驚'],
    matchingKeywords: ['累', '急', '工', '逃', '亂', '醒', '追'],
    recommendationReason:
      '若長期受困於反覆疲憊的夢境，單一芳香或許不夠。此套裝結合理療級枕頭噴霧與溫潤洋甘菊茶，全面呵護睡眠品質。',
    usageGuide: '睡前 40 分鐘飲用溫茶，睡前 10 分鐘噴灑枕畔。',
    cautions: ['本套組純屬日常身心靈調理生活用品，非醫療製品。'],
    imageUrl: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=800&q=80',
    badge: '🌟 團隊力薦 · 限時特惠',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
  {
    id: 'prod_bundle_purify',
    name: '【嶺南除晦】去霉轉運磁場重生組',
    subTitle: '碌柚葉好運噴霧 + 秘魯特選聖木條 · 開運淨場雙重守護',
    brand: 'DreamWisdom 精選組合',
    priceHKD: 118,
    originalPriceHKD: 186,
    starsRedeemCost: 26,
    category: 'bundle',
    categoryLabel: '儀式套裝 · 團隊精選',
    volumeOrSpec: '100ML 好運噴霧 + 5支秘魯聖木',
    shelfLife: '2 年',
    ingredients: ['天然柚葉提取物', '秘魯天然老料聖木原木'],
    keyBenefits: [
      '嶺南民俗智慧與南美聖木神聖煙燻雙效結合',
      '迅速驅散夢魘陰霾與居家沈悶負能量',
      '新年／新居／運滯期磁場重置必備',
    ],
    suitableDreams: ['噩夢', '被追', '泥濘', '鬼壓床', '舊屋迷路'],
    matchingKeywords: ['噩夢', '鬼', '死', '泥', '黑', '霉', '跌', '病'],
    recommendationReason:
      '連續夢見污濁、迷路或噩夢，提示身心氣場需要大掃除。先以聖木煙燻房間四角，再以碌柚葉噴霧隨身護佑，重現開朗氣場。',
    usageGuide: '先煙燻淨化空間，再於門口與隨身物品輕噴噴霧。',
    cautions: ['使用聖木時請保持通風，確保完全熄滅。非醫療用品。'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    badge: '🏮 轉運力薦 · 限量優惠',
    inStock: true,
    availabilityStatus: '現貨供應',
  },
];

// 後端記憶體快取層（亦支援拓展 Redis）
const apiCache = new Map<string, { data: any; expiry: number }>();

export function getCached<T>(key: string): T | null {
  const item = apiCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    apiCache.delete(key);
    return null;
  }
  return item.data as T;
}

export function setCached<T>(key: string, data: T, ttlSeconds: number = 60): void {
  apiCache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.startsWith(prefix)) {
      apiCache.delete(key);
    }
  }
}

// 分類 CRUD 操作
export function getAllCategories(): Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}

export function addCategory(name: string, description: string, order?: number): Category {
  const id = 'cat_' + crypto.randomBytes(4).toString('hex');
  const newCat: Category = {
    id,
    name: name.trim(),
    description: description.trim(),
    order: order ?? categories.length,
  };
  categories.push(newCat);
  invalidateCache(); // 清空所有快取
  return newCat;
}

export function updateCategory(id: string, name: string, description: string, order?: number): Category | null {
  const cat = categories.find((c) => c.id === id);
  if (!cat) return null;
  if (name !== undefined) cat.name = name.trim();
  if (description !== undefined) cat.description = description.trim();
  if (order !== undefined) cat.order = order;
  invalidateCache();
  return cat;
}

export function deleteCategory(id: string): boolean {
  const initialLen = categories.length;
  categories = categories.filter((c) => c.id !== id);
  if (categories.length < initialLen) {
    invalidateCache();
    return true;
  }
  return false;
}

// 商品查詢與推薦
export function getProducts(categoryId?: string, page: number = 1, limit: number = 12): {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  let filtered = products;
  if (categoryId && categoryId !== 'all') {
    filtered = products.filter((p) => p.category === categoryId);
  }
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    page,
    limit,
    totalPages,
  };
}

export function getShopBootstrap(): {
  categories: Category[];
  initialProducts: Product[];
  bundles: Product[];
  totalProducts: number;
} {
  const cats = getAllCategories();
  const res = getProducts('all', 1, 12);
  const bundles = products.filter((p) => p.category === 'bundle');
  return {
    categories: cats,
    initialProducts: res.products,
    bundles,
    totalProducts: res.total,
  };
}

export function getRecommendProducts(theme: string = '', limit: number = 3): Product[] {
  const search = (theme || '').toLowerCase().trim();
  if (!search) {
    return products.slice(0, limit);
  }

  // 根據匹配關鍵字加權打分
  const scored = products.map((prod) => {
    let score = 0;
    if (prod.category.toLowerCase().includes(search)) score += 5;
    for (const kw of prod.matchingKeywords) {
      if (search.includes(kw) || kw.includes(search)) {
        score += 3;
      }
    }
    for (const d of prod.suitableDreams) {
      if (d.includes(search)) {
        score += 2;
      }
    }
    return { prod, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.prod);
}

// 管理員 Token 記憶體儲存 (HttpOnly Cookie 驗證)
const activeAdminTokens = new Set<string>();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dreamwisdom888';

export function verifyAdminPassword(password: string): string | null {
  if (password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    activeAdminTokens.add(token);
    return token;
  }
  return null;
}

export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  return activeAdminTokens.has(token);
}

export function revokeAdminToken(token: string | undefined): void {
  if (token) {
    activeAdminTokens.delete(token);
  }
}
