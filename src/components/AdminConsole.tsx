import React, { useState, useEffect, useMemo } from 'react';
import { BookBrainItem, EngineSettings, EnginePresetType, User, UserRole, ProductItem, AdVideoItem, TherapistItem, BannedRecord, LoginRecord, AdWatchRecord, ShopVisitRecord, normalizeRole, getRoleDisplayName } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_AD_VIDEOS, ENGINE_PRESETS, EnginePresetDefinition, INITIAL_SETTINGS } from '../data';
import { INITIAL_THERAPISTS } from '../data/therapists';
import { BookOpen, Sliders, Users, Upload, Check, AlertCircle, RefreshCw, UserCheck, Trash2, Edit3, Plus, Minus, ShieldCheck, ShieldAlert, ShieldBan, Star, Crown, Settings, ShoppingBag, Package, Sparkles, Tv, Play, Video, Eye, Heart, UserX, Search, Filter, Activity, LogIn, HeartHandshake, Compass, Feather, BookMarked, HelpCircle, RotateCcw } from 'lucide-react';
import { TherapistAdminManager } from './TherapistAdminManager';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ConfirmDeleteUserModal } from './ConfirmDeleteUserModal';
import { StarAdjustModal } from './StarAdjustModal';
import { AdminAuditDashboard } from './AdminAuditDashboard';
import { getLocalLoginRecords, getLocalAdWatchRecords, getLocalShopVisitRecords } from '../utils/auditLogger';

interface BookTheoryItem {
  id: string;
  theoryName: string;
  bookTitle: string;
  citation: string;
  coreInsight: string;
}

const INITIAL_THEORIES: BookTheoryItem[] = [
  {
    id: 'theory_jung_shadow',
    theoryName: '榮格陰影追逐與補償假說 (Shadow Archetype)',
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    citation: 'p. 168-175',
    coreInsight: '夢中追逐你的未知力量，實為被清醒意識壓抑的內在特質（陰影）。直面而非逃避是自我整合的第一步。',
  },
  {
    id: 'theory_freud_repression',
    theoryName: '潛抑願望與日間殘留 (Wish-Fulfillment & Day Residue)',
    bookTitle: 'The Interpretation of Dreams (Sigmund Freud)',
    citation: 'p. 210-218',
    coreInsight: '夢是清醒時未滿足願望的象徵性變形滿足，常借用前一日的琐碎細節（殘留記憶）作為化妝偽裝。',
  },
  {
    id: 'theory_asian_exam',
    theoryName: '集體考場烙印與家族倫理 (Collective Examination Trauma)',
    bookTitle: '當代華人夢境象徵與心理原鄉',
    citation: 'p. 82-89',
    coreInsight: '成年後反覆夢見赤腳考試、忘記準考證，對應華人社會成長過程中深植的評核焦慮與對群體期望的恐懼。',
  },
  {
    id: 'theory_water_ocean',
    theoryName: '無意識之海與情緒水位假說 (Oceanic Subconscious)',
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    citation: 'p. 112-118',
    coreInsight: '水位的起伏是潛意識情感蓄積程度的晴雨表。浪潮上升象徵壓抑情感突破臨界點，尋找高處象徵理性自保防線。',
  },
];

interface AdminConsoleProps {
  initialBooks: BookBrainItem[];
  initialUsers: User[];
  initialSettings: EngineSettings;
  initialProducts?: ProductItem[];
  initialAdVideos?: AdVideoItem[];
  initialTherapists?: TherapistItem[];
  bannedRecords?: BannedRecord[];
  currentUserId: string;
  currentUserRole?: UserRole;
  onUpdateSettings: (settings: EngineSettings) => void;
  onUpdateUsers?: (users: User[]) => void;
  onUpdateBooks?: (books: BookBrainItem[]) => void;
  onUpdateProducts?: (products: ProductItem[]) => void;
  onUpdateAdVideos?: (adVideos: AdVideoItem[]) => void;
  onUpdateTherapists?: (therapists: TherapistItem[]) => void;
  onUpdateBannedRecords?: (records: BannedRecord[]) => void;
  onSwitchUser?: (user: User) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  initialBooks,
  initialUsers,
  initialSettings,
  initialProducts = INITIAL_PRODUCTS,
  initialAdVideos = INITIAL_AD_VIDEOS,
  initialTherapists = INITIAL_THERAPISTS,
  bannedRecords = [],
  currentUserId,
  currentUserRole = 'super_admin',
  onUpdateSettings,
  onUpdateUsers,
  onUpdateBooks,
  onUpdateProducts,
  onUpdateAdVideos,
  onUpdateTherapists,
  onUpdateBannedRecords,
  onSwitchUser,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'advideos' | 'products' | 'therapists' | 'engine'>('audit');
  const [books, setBooks] = useState<BookBrainItem[]>(initialBooks);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);

  // Super Admin Audit & Monitoring Data States
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>(() => getLocalLoginRecords());
  const [adWatchRecords, setAdWatchRecords] = useState<AdWatchRecord[]>(() => getLocalAdWatchRecords());
  const [shopVisitRecords, setShopVisitRecords] = useState<ShopVisitRecord[]>(() => getLocalShopVisitRecords());

  // Fetch latest audit records from API on mount
  useEffect(() => {
    async function loadAuditData() {
      try {
        const lRes = await fetch('/api/audit/logins');
        if (lRes.ok) {
          const lData = await lRes.json();
          if (Array.isArray(lData.logins) && lData.logins.length > 0) {
            setLoginRecords(lData.logins);
          }
        }
      } catch {}

      try {
        const aRes = await fetch('/api/audit/ad-views');
        if (aRes.ok) {
          const aData = await aRes.json();
          if (Array.isArray(aData.adWatches) && aData.adWatches.length > 0) {
            setAdWatchRecords(aData.adWatches);
          }
        }
      } catch {}

      try {
        const sRes = await fetch('/api/audit/shop-visits');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (Array.isArray(sData.shopVisits) && sData.shopVisits.length > 0) {
            setShopVisitRecords(sData.shopVisits);
          }
        }
      } catch {}
    }
    loadAuditData();
  }, []);

  // Compute Per-User Activity Stats Map (Logins, Ads, Shop visits)
  const userStatsMap = useMemo(() => {
    const stats: Record<
      string,
      {
        loginCount: number;
        lastLogin?: string;
        adCount: number;
        starsEarned: number;
        shopCount: number;
      }
    > = {};

    loginRecords.forEach((l) => {
      const email = l.email.toLowerCase();
      if (!stats[email]) stats[email] = { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
      stats[email].loginCount += 1;
      if (!stats[email].lastLogin || new Date(l.loginAt) > new Date(stats[email].lastLogin!)) {
        stats[email].lastLogin = l.loginAt;
      }
    });

    adWatchRecords.forEach((a) => {
      const email = a.userEmail.toLowerCase();
      if (!stats[email]) stats[email] = { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
      stats[email].adCount += 1;
      stats[email].starsEarned += a.rewardStars || 1;
    });

    shopVisitRecords.forEach((s) => {
      const email = (s.userEmail || '').toLowerCase();
      if (email) {
        if (!stats[email]) stats[email] = { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
        stats[email].shopCount += 1;
      }
    });

    return stats;
  }, [loginRecords, adWatchRecords, shopVisitRecords]);

  // Handler to clear audit logs
  const handleClearAuditLogs = async (type: 'all' | 'logins' | 'ads' | 'shop') => {
    try {
      await fetch(`/api/audit/clear?type=${type}`, {
        method: 'DELETE',
        headers: { 'x-user-role': currentUserRole },
      });
    } catch {}

    if (type === 'all' || type === 'logins') {
      setLoginRecords([]);
      localStorage.removeItem('dreamwisdom_audit_logins');
    }
    if (type === 'all' || type === 'ads') {
      setAdWatchRecords([]);
      localStorage.removeItem('dreamwisdom_audit_ads');
    }
    if (type === 'all' || type === 'shop') {
      setShopVisitRecords([]);
      localStorage.removeItem('dreamwisdom_audit_shop');
    }
    setNotice(`✓ 已清空審計日誌 (${type === 'all' ? '全部' : type === 'logins' ? '登入人員' : type === 'ads' ? '廣告收看' : '入選物店'})`);
  };

  const handleRefreshAuditData = async () => {
    try {
      const lRes = await fetch('/api/audit/logins');
      if (lRes.ok) {
        const lData = await lRes.json();
        if (Array.isArray(lData.logins)) setLoginRecords(lData.logins);
      }
      const aRes = await fetch('/api/audit/ad-views');
      if (aRes.ok) {
        const aData = await aRes.json();
        if (Array.isArray(aData.adWatches)) setAdWatchRecords(aData.adWatches);
      }
      const sRes = await fetch('/api/audit/shop-visits');
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData.shopVisits)) setShopVisitRecords(sData.shopVisits);
      }
      setNotice('✓ 審計日誌已成功同步刷新至最新狀態。');
    } catch {
      setNotice('已刷新本地日誌快取。');
    }
  };

  const [therapists, setTherapists] = useState<TherapistItem[]>(() => {
    if (initialTherapists && initialTherapists.length > 0) return initialTherapists;
    try {
      const saved = localStorage.getItem('dreamwisdom_therapists');
      return saved ? JSON.parse(saved) : INITIAL_THERAPISTS;
    } catch {
      return INITIAL_THERAPISTS;
    }
  });

  const handleSaveTherapists = (updated: TherapistItem[]) => {
    setTherapists(updated);
    if (onUpdateTherapists) {
      onUpdateTherapists(updated);
    }
    try {
      localStorage.setItem('dreamwisdom_therapists', JSON.stringify(updated));
    } catch {}
  };
  const [adVideos, setAdVideos] = useState<AdVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_ad_videos');
      return saved ? JSON.parse(saved) : initialAdVideos;
    } catch {
      return initialAdVideos;
    }
  });
  const [theories, setTheories] = useState<BookTheoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_theories');
      return saved ? JSON.parse(saved) : INITIAL_THEORIES;
    } catch {
      return INITIAL_THEORIES;
    }
  });
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [settings, setSettings] = useState<EngineSettings>(() => ({
    ...INITIAL_SETTINGS,
    ...(initialSettings || {}),
  }));
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  // Synchronize users when initialUsers changes
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Synchronize settings when initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setSettings((prev) => ({
        ...INITIAL_SETTINGS,
        ...prev,
        ...initialSettings,
      }));
    }
  }, [initialSettings]);

  // Banned records state
  const [bannedRecordsState, setBannedRecordsState] = useState<BannedRecord[]>(() => {
    if (bannedRecords && bannedRecords.length > 0) return bannedRecords;
    try {
      const saved = localStorage.getItem('dreamwisdom_banned_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (bannedRecords) {
      setBannedRecordsState(bannedRecords);
    }
  }, [bannedRecords]);

  // User Management State (Super Admin)
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToAdjustStars, setUserToAdjustStars] = useState<User | null>(null);
  const [newBannedEmailInput, setNewBannedEmailInput] = useState('');
  const [newBannedReasonInput, setNewBannedReasonInput] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'banned' | 'free' | 'paid' | 'admin' | 'super_admin'>('all');

  // Editing theory state
  const [editingTheory, setEditingTheory] = useState<BookTheoryItem | null>(null);
  const [isAddingTheory, setIsAddingTheory] = useState(false);
  const [theoryForm, setTheoryForm] = useState<Partial<BookTheoryItem>>({
    theoryName: '',
    bookTitle: '',
    citation: '',
    coreInsight: '',
  });

  // Product management state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<ProductItem>>({
    name: '',
    subTitle: '',
    brand: '',
    priceHKD: 68,
    category: 'purify',
    categoryLabel: '淨化去霉 · 好運轉化',
    volumeOrSpec: '100ML',
    shelfLife: '2 年',
    recommendationReason: '',
    usageGuide: '',
    imageUrl: '',
    badge: '',
    inStock: true,
  });
  const [productApprovalFilter, setProductApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Ad Video Management State
  const [editingAd, setEditingAd] = useState<AdVideoItem | null>(null);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [previewingAd, setPreviewingAd] = useState<AdVideoItem | null>(null);
  const [adForm, setAdForm] = useState<Partial<AdVideoItem>>({
    title: '',
    advertiser: '',
    tagline: '',
    durationSeconds: 10,
    rewardStars: 1,
    category: 'alien_philosophy',
    bgGradient: 'from-[#0b051d] via-[#1a0c3b] to-[#04010a]',
    accentColor: '#aa9cff',
    isActive: true,
    posterUrl: '',
    videoUrl: '',
  });
  const [dialogueRows, setDialogueRows] = useState<Array<{ speaker: string; text: string }>>([
    { speaker: '外星導師', text: '' },
  ]);

  const isSuperAdmin = normalizeRole(currentUserRole) === 'super_admin';

  // Save products
  const saveProducts = (updated: ProductItem[]) => {
    setProducts(updated);
    if (onUpdateProducts) onUpdateProducts(updated);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.priceHKD) return;

    if (editingProduct) {
      const availStatus = productForm.availabilityStatus || (productForm.inStock === false ? '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。' : '現貨供應');
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...productForm,
              name: productForm.name || p.name,
              priceHKD: Number(productForm.priceHKD) || p.priceHKD,
              availabilityStatus: availStatus,
              inStock: availStatus === '現貨供應',
            }
          : p
      );
      saveProducts(updated);
      setNotice(`已更新產品「${productForm.name}」資料`);
      setEditingProduct(null);
    } else {
      const availStatus = productForm.availabilityStatus || '現貨供應';
      const newProd: ProductItem = {
        id: 'prod_' + Date.now(),
        name: productForm.name || '新產品',
        subTitle: productForm.subTitle || '',
        brand: productForm.brand || 'DreamWisdom',
        priceHKD: Number(productForm.priceHKD) || 50,
        originalPriceHKD: productForm.originalPriceHKD ? Number(productForm.originalPriceHKD) : undefined,
        starsRedeemCost: 15,
        category: productForm.category || 'purify',
        categoryLabel: productForm.categoryLabel || '好運淨化',
        volumeOrSpec: productForm.volumeOrSpec || '標準裝',
        shelfLife: productForm.shelfLife || '2 年',
        ingredients: productForm.ingredients || ['天然草本提取物'],
        keyBenefits: productForm.keyBenefits || ['淨化空間與身心氣場'],
        suitableDreams: ['噩夢', '心神不寧', '去霉轉運'],
        matchingKeywords: ['霉', '鬼', '驚', '亂', '沉'],
        recommendationReason: productForm.recommendationReason || '解夢後身心調節推薦',
        usageGuide: productForm.usageGuide || '適量噴於空氣中或脈搏處',
        cautions: ['避免入眼，置於陰涼乾燥處'],
        imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        badge: productForm.badge,
        availabilityStatus: availStatus,
        inStock: availStatus === '現貨供應',
        status: 'approved',
        reviewedByUserId: currentUserId,
        reviewedAt: new Date().toISOString(),
      };
      const updated = [newProd, ...products];
      saveProducts(updated);
      setNotice(`已成功新增產品條目：「${newProd.name}」（已直接公開）`);
      setIsAddingProduct(false);
    }
  };

  const handleApproveProduct = (id: string) => {
    if (!isSuperAdmin) {
      setNotice('⚠️ 只有高級管理員 (Super Admin) 具備核准公開上架的審批權限！');
      return;
    }
    const target = products.find((p) => p.id === id);
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            status: 'approved' as const,
            reviewedByUserId: currentUserId,
            reviewedAt: new Date().toISOString(),
          }
        : p
    );
    saveProducts(updated);
    setNotice(`✅ 已成功核准並公開上架產品「${target?.name || ''}」！`);
  };

  const handleRejectProduct = (id: string) => {
    if (!isSuperAdmin) {
      setNotice('⚠️ 只有高級管理員 (Super Admin) 具備審批權限！');
      return;
    }
    const target = products.find((p) => p.id === id);
    const reason = window.prompt(
      `請輸入退回產品「${target?.name || ''}」的原因：`,
      '暫不符合解夢選物店選品標準，請補充詳細產品規格與成分後重新提交'
    );
    if (reason === null) return;

    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            status: 'rejected' as const,
            rejectionReason: reason || '暫不符合選品標準',
            reviewedByUserId: currentUserId,
            reviewedAt: new Date().toISOString(),
          }
        : p
    );
    saveProducts(updated);
    setNotice(`❌ 已退回產品「${target?.name || ''}」的上架申請。`);
  };

  const handleConfirmDeleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setNotice(`已成功從產品庫中移除商品「${target?.name || ''}」`);
    setProductToDelete(null);
  };

  // Save Ad Videos
  const saveAdVideos = (updated: AdVideoItem[]) => {
    setAdVideos(updated);
    if (onUpdateAdVideos) onUpdateAdVideos(updated);
    try {
      localStorage.setItem('dreamwisdom_ad_videos', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveAdVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title || !adForm.advertiser) {
      alert('請填寫廣告標題及贊助商名稱');
      return;
    }

    const filteredDialogues = dialogueRows.filter((d) => d.text.trim().length > 0);

    if (editingAd) {
      const updated = adVideos.map((ad) =>
        ad.id === editingAd.id
          ? {
              ...ad,
              ...adForm,
              title: adForm.title || ad.title,
              advertiser: adForm.advertiser || ad.advertiser,
              tagline: adForm.tagline || ad.tagline,
              durationSeconds: Number(adForm.durationSeconds) || ad.durationSeconds,
              rewardStars: Number(adForm.rewardStars) || ad.rewardStars,
              category: adForm.category || ad.category,
              dialogueDialogue: filteredDialogues.length > 0 ? filteredDialogues : ad.dialogueDialogue,
              bgGradient: adForm.bgGradient || ad.bgGradient,
              accentColor: adForm.accentColor || ad.accentColor,
              posterUrl: adForm.posterUrl,
              videoUrl: adForm.videoUrl,
            }
          : ad
      );
      saveAdVideos(updated);
      setNotice(`已更新廣告短片「${adForm.title}」`);
      setEditingAd(null);
    } else {
      const newAd: AdVideoItem = {
        id: 'ad_' + Date.now(),
        title: adForm.title || '全新心靈贊助廣告',
        advertiser: adForm.advertiser || '品牌贊助商',
        tagline: adForm.tagline || '觀看獲取星星幣，解鎖進階夢境探索。',
        durationSeconds: Number(adForm.durationSeconds) || 10,
        rewardStars: Number(adForm.rewardStars) || 1,
        category: adForm.category || 'alien_philosophy',
        bgGradient: adForm.bgGradient || 'from-[#0b051d] via-[#1a0c3b] to-[#04010a]',
        accentColor: adForm.accentColor || '#aa9cff',
        isActive: adForm.isActive ?? true,
        posterUrl: adForm.posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        videoUrl: adForm.videoUrl,
        dialogueDialogue: filteredDialogues.length > 0 ? filteredDialogues : undefined,
        createdAt: new Date().toISOString(),
      };
      const updated = [newAd, ...adVideos];
      saveAdVideos(updated);
      setNotice(`已成功新增廣告短片：「${newAd.title}」（現已加入隨機播放池）`);
      setIsAddingAd(false);
    }
  };

  const handleDeleteAdVideo = (id: string) => {
    if (!window.confirm('確定要從廣告資料庫刪除此廣告短片嗎？客人將不再隨機觀看到此廣告。')) return;
    const updated = adVideos.filter((a) => a.id !== id);
    saveAdVideos(updated);
    setNotice('已從廣告庫刪除該短片');
  };

  const handleToggleAdActive = (id: string) => {
    const updated = adVideos.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    saveAdVideos(updated);
    const target = updated.find((a) => a.id === id);
    setNotice(`廣告「${target?.title}」狀態已更改為：${target?.isActive ? '啟用 (隨機播放)' : '已下架停播'}`);
  };

  // Save theories to localStorage
  const saveTheories = (updated: BookTheoryItem[]) => {
    setTheories(updated);
    localStorage.setItem('dreamwisdom_theories', JSON.stringify(updated));
  };

  // Handle uploading book
  async function handleUpload(file: File) {
    setBusy('upload');
    setNotice('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const totalEstimatedPages = Math.floor(Math.random() * 200) + 50;
      const newBook: BookBrainItem = {
        id: 'book_' + Date.now(),
        title: file.name.replace(/\.[^.]+$/, ''),
        file_name: file.name,
        status: 'queued',
        total_pages: totalEstimatedPages,
        processed_pages: 0,
        created_at: new Date().toISOString(),
      };
      const updated = [newBook, ...books];
      setBooks(updated);
      if (onUpdateBooks) onUpdateBooks(updated);
      setNotice(`書本「${newBook.title}」已加入 OCR 與知識庫建構佇列。點擊「開始 OCR 索引」即可提取理論段落。`);
    } catch (e: any) {
      alert(e.message || '上傳失敗');
    } finally {
      setBusy('');
    }
  }

  // Handle OCR processing of a book
  async function processBook(id: string) {
    setBusy(id);
    setNotice('');
    try {
      const book = books.find((b) => b.id === id);
      if (!book) return;

      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'processing' } : b))
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const updated = books.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'ready' as const,
              processed_pages: b.total_pages,
            }
          : b
      );
      setBooks(updated);
      if (onUpdateBooks) onUpdateBooks(updated);
      setNotice(`「${book.title}」Book Brain 處理完成！文字已向量化儲存，解夢時會自動引用。`);
    } catch (e: any) {
      alert(e.message || '處理失敗');
    } finally {
      setBusy('');
    }
  }

  // Delete a book
  function handleDeleteBook(id: string) {
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);
    if (onUpdateBooks) onUpdateBooks(updated);
    setNotice('已從 Book Brain 中移除該典籍。');
  }

  // Save settings
  function saveSettings() {
    setBusy('settings');
    setTimeout(() => {
      onUpdateSettings(settings);
      setNotice('✓ AI 解夢引擎風格參數與 Prompt 已成功儲存。');
      setBusy('');
    }, 250);
  }

  // Handle Role Change (ONLY SUPER ADMIN CAN CALL THIS)
  function handleRoleChange(userToChange: User, newRole: UserRole) {
    if (!isSuperAdmin) {
      alert('權限不足：只有高級管理員 (Super Admin) 可以更改會員等級。');
      return;
    }

    if (userToChange.id === currentUserId && newRole !== 'super_admin') {
      const confirmChange = window.confirm('你正在將自己降級，確定要執行嗎？');
      if (!confirmChange) return;
    }

    const normNewRole = normalizeRole(newRole);
    setBusy(userToChange.id);

    const updatedUsers = users.map((u) =>
      u.id === userToChange.id ? { ...u, role: normNewRole } : u
    );

    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);

    setNotice(
      `✓ 已成功將「${userToChange.display_name || userToChange.email}」的等級更改為：${getRoleDisplayName(
        normNewRole
      )}`
    );
    setBusy('');
  }

  // Adjust Stars for a user with delta (Super admin only)
  function handleAdjustStars(userToChange: User, delta: number) {
    if (!isSuperAdmin) {
      alert('只有高級管理員可以手動調整會員星星。');
      return;
    }
    const current = userToChange.stars ?? 0;
    const nextStars = Math.max(0, current + delta);
    const updatedUsers = users.map((u) =>
      u.id === userToChange.id ? { ...u, stars: nextStars } : u
    );
    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    setNotice(`⭐ 已為「${userToChange.display_name || userToChange.email}」調整星星數為：${nextStars} 顆！`);
  }

  // Set Exact Stars for a user (Super admin only)
  function handleSetExactStars(userToChange: User, newStars: number) {
    if (!isSuperAdmin) {
      alert('只有高級管理員可以手動調整會員星星。');
      return;
    }
    const sanitizedStars = Math.max(0, newStars);
    const updatedUsers = users.map((u) =>
      u.id === userToChange.id ? { ...u, stars: sanitizedStars } : u
    );
    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    setNotice(`⭐ 已成功為會員「${userToChange.display_name || userToChange.email}」設定星星為：${sanitizedStars} 顆！`);
  }

  // DELETE Member (Super admin only)
  function handleDeleteUser(userToDeleteTarget: User, alsoBan: boolean, reason: string) {
    if (!isSuperAdmin) {
      alert('只有高級管理員具備刪除會員之最高權限。');
      return;
    }
    if (userToDeleteTarget.id === currentUserId) {
      alert('⚠️ 操作無效：高級管理員無法刪除當前登入的自己帳號！');
      return;
    }

    const targetEmail = userToDeleteTarget.email.trim().toLowerCase();

    // 1. Remove from users list
    const updatedUsers = users.filter((u) => u.id !== userToDeleteTarget.id);
    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);

    // 2. Track deleted user ID to prevent automatic resurrection
    try {
      const savedDeleted = localStorage.getItem('dreamwisdom_deleted_user_ids');
      const list: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
      if (!list.includes(userToDeleteTarget.id)) {
        list.push(userToDeleteTarget.id);
        localStorage.setItem('dreamwisdom_deleted_user_ids', JSON.stringify(list));
      }
    } catch {}

    // 3. If also banned, add email to persistent blacklist
    if (alsoBan) {
      const newRecord: BannedRecord = {
        email: targetEmail,
        reason: reason || '高級管理員執行會員刪除並永久封鎖',
        banned_at: new Date().toISOString(),
        banned_by: currentUserId,
      };
      const updatedBanned = [
        newRecord,
        ...bannedRecordsState.filter((b) => b.email.toLowerCase() !== targetEmail),
      ];
      setBannedRecordsState(updatedBanned);
      if (onUpdateBannedRecords) onUpdateBannedRecords(updatedBanned);
      try {
        localStorage.setItem('dreamwisdom_banned_records', JSON.stringify(updatedBanned));
      } catch {}
    }

    setNotice(
      `🗑️ 已徹底刪除會員「${userToDeleteTarget.display_name || userToDeleteTarget.email}」${
        alsoBan ? '，並已將其 Email 列入黑名單（禁止再次登記與登入）！' : '！'
      }`
    );
    setUserToDelete(null);
  }

  // Toggle Ban / Unban for existing user
  function handleToggleBanUser(targetUser: User) {
    if (!isSuperAdmin) {
      alert('只有高級管理員具備停權或解禁會員之權限。');
      return;
    }
    if (targetUser.id === currentUserId) {
      alert('⚠️ 無法對當前登入的自己帳號執行封禁停權！');
      return;
    }

    const targetEmail = targetUser.email.trim().toLowerCase();
    const isCurrentlyBanned =
      targetUser.is_banned ||
      bannedRecordsState.some((b) => b.email.toLowerCase() === targetEmail);

    if (isCurrentlyBanned) {
      // Unban
      const updatedUsers = users.map((u) =>
        u.id === targetUser.id
          ? { ...u, is_banned: false, banned_at: undefined, banned_reason: undefined }
          : u
      );
      setUsers(updatedUsers);
      if (onUpdateUsers) onUpdateUsers(updatedUsers);

      const updatedBanned = bannedRecordsState.filter((b) => b.email.toLowerCase() !== targetEmail);
      setBannedRecordsState(updatedBanned);
      if (onUpdateBannedRecords) onUpdateBannedRecords(updatedBanned);
      try {
        localStorage.setItem('dreamwisdom_banned_records', JSON.stringify(updatedBanned));
      } catch {}

      setNotice(`✅ 已解除會員「${targetUser.email}」的停權封禁，現已恢復登入與使用權限！`);
    } else {
      // Ban
      const reason = window.prompt(
        `請輸入停權封禁會員「${targetUser.email}」的原因（將禁止其登入）：`,
        '違反平台使用守則或帳號異常'
      );
      if (reason === null) return;

      const updatedUsers = users.map((u) =>
        u.id === targetUser.id
          ? {
              ...u,
              is_banned: true,
              banned_at: new Date().toISOString(),
              banned_reason: reason || '由高級管理員停權',
            }
          : u
      );
      setUsers(updatedUsers);
      if (onUpdateUsers) onUpdateUsers(updatedUsers);

      const newRecord: BannedRecord = {
        email: targetEmail,
        reason: reason || '由高級管理員停權',
        banned_at: new Date().toISOString(),
        banned_by: currentUserId,
      };
      const updatedBanned = [
        newRecord,
        ...bannedRecordsState.filter((b) => b.email.toLowerCase() !== targetEmail),
      ];
      setBannedRecordsState(updatedBanned);
      if (onUpdateBannedRecords) onUpdateBannedRecords(updatedBanned);
      try {
        localStorage.setItem('dreamwisdom_banned_records', JSON.stringify(updatedBanned));
      } catch {}

      setNotice(`🚫 已將會員「${targetUser.email}」停權封禁，已禁止其登入！`);
    }
  }

  // Manually add Email to Blacklist (Preemptively forbid registration & login)
  function handleAddBannedEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!isSuperAdmin) return;
    const emailToBan = newBannedEmailInput.trim().toLowerCase();
    if (!emailToBan || !emailToBan.includes('@')) {
      alert('請輸入有效的 Email 地址！');
      return;
    }

    const newRecord: BannedRecord = {
      email: emailToBan,
      reason: newBannedReasonInput.trim() || '由高級管理員手動列入黑名單',
      banned_at: new Date().toISOString(),
      banned_by: currentUserId,
    };

    const updatedBanned = [
      newRecord,
      ...bannedRecordsState.filter((b) => b.email.toLowerCase() !== emailToBan),
    ];
    setBannedRecordsState(updatedBanned);
    if (onUpdateBannedRecords) onUpdateBannedRecords(updatedBanned);
    try {
      localStorage.setItem('dreamwisdom_banned_records', JSON.stringify(updatedBanned));
    } catch {}

    // Also mark any existing member with this email as banned
    const updatedUsers = users.map((u) =>
      u.email.toLowerCase() === emailToBan
        ? {
            ...u,
            is_banned: true,
            banned_at: new Date().toISOString(),
            banned_reason: newRecord.reason,
          }
        : u
    );
    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);

    setNewBannedEmailInput('');
    setNewBannedReasonInput('');
    setNotice(`🚫 已將「${emailToBan}」加入封禁黑名單，該 Email 將無法登記或登入！`);
  }

  // Remove Email from Blacklist
  function handleRemoveBannedEmail(emailToRemove: string) {
    if (!isSuperAdmin) return;
    const targetEmail = emailToRemove.trim().toLowerCase();
    const updatedBanned = bannedRecordsState.filter((b) => b.email.toLowerCase() !== targetEmail);
    setBannedRecordsState(updatedBanned);
    if (onUpdateBannedRecords) onUpdateBannedRecords(updatedBanned);
    try {
      localStorage.setItem('dreamwisdom_banned_records', JSON.stringify(updatedBanned));
    } catch {}

    // Unmark any existing user
    const updatedUsers = users.map((u) =>
      u.email.toLowerCase() === targetEmail
        ? { ...u, is_banned: false, banned_at: undefined, banned_reason: undefined }
        : u
    );
    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);

    setNotice(`✅ 已將「${targetEmail}」從封禁黑名單中移除！`);
  }

  // Add / Edit Theory logic
  function handleSaveTheory(e: React.FormEvent) {
    e.preventDefault();
    if (!theoryForm.theoryName || !theoryForm.coreInsight) return;

    if (editingTheory) {
      const updated = theories.map((t) =>
        t.id === editingTheory.id
          ? {
              ...t,
              theoryName: theoryForm.theoryName || t.theoryName,
              bookTitle: theoryForm.bookTitle || t.bookTitle,
              citation: theoryForm.citation || t.citation,
              coreInsight: theoryForm.coreInsight || t.coreInsight,
            }
          : t
      );
      saveTheories(updated);
      setNotice(`已成功修改理論條目：「${theoryForm.theoryName}」`);
      setEditingTheory(null);
    } else {
      const newTheory: BookTheoryItem = {
        id: 'theory_' + Date.now(),
        theoryName: theoryForm.theoryName || '未命名理論',
        bookTitle: theoryForm.bookTitle || '自訂典籍文獻',
        citation: theoryForm.citation || 'p. 1',
        coreInsight: theoryForm.coreInsight || '',
      };
      saveTheories([newTheory, ...theories]);
      setNotice(`已新增理論條目：「${newTheory.theoryName}」`);
      setIsAddingTheory(false);
    }
    setTheoryForm({ theoryName: '', bookTitle: '', citation: '', coreInsight: '' });
  }

  function handleDeleteTheory(id: string) {
    const updated = theories.filter((t) => t.id !== id);
    saveTheories(updated);
    setNotice('已刪除該理論條目。');
  }

  // Real-time Interpretation Style Preview calculation
  const livePreview = useMemo(() => {
    const p = settings.personality ?? 70;
    const d = settings.decisiveness ?? 65;
    const dep = settings.depth ?? 85;
    const c = settings.culturalResonance ?? 85;
    const pt = settings.poeticTone ?? 65;
    const s = settings.shadowSensitivity ?? 85;

    const tags: Array<{ label: string; color: string }> = [];
    if (p >= 80) tags.push({ label: '🌿 溫潤治癒型', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' });
    else if (p <= 40) tags.push({ label: '🏛️ 客觀臨床型', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' });
    else tags.push({ label: '⚖️ 專業共情型', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' });

    if (d >= 75) tags.push({ label: '🎯 果斷行動導向', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' });
    else if (d <= 45) tags.push({ label: '🧭 開放探索反思', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' });
    else tags.push({ label: '🌱 穩健導引', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' });

    if (dep >= 80) tags.push({ label: '📖 榮格原著考證', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' });
    if (c >= 75) tags.push({ label: '🏮 東方集體記憶高度敏感', color: 'bg-amber-600/20 text-amber-200 border-amber-500/30' });
    if (pt >= 75) tags.push({ label: '🌌 散文詩意留白', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' });
    if (s >= 75) tags.push({ label: '🛡️ 噩夢安全賦權著陸', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' });

    let summary = '';
    if (p >= 80) {
      summary = '「這是一場帶著深層情緒釋放的心靈撫慰。你的潛意識正在溫柔地替你梳理這段日子以來的疲憊與緊繃，夢中走廊上無人相認並非要孤立你，而是藉由夢境的庇護空間提醒你：你可以放下沉重防備，接納那個脆弱卻無比努力的自己。」';
    } else if (p <= 40) {
      summary = '「該夢境呈現出典型的無意識心理防禦機制與補償結構。藉由昔日學校與赤腳意象的具象化，個體心智系統正在對近期積累的評價焦慮進行結構性代謝，反映出自我面具 (Persona) 與深層驅力之間的張力。」';
    } else if (pt >= 75) {
      summary = '「夜夢如鏡，映照心湖微瀾。重返校舍與赤腳尋路的意象，如同心靈深處遞來的一枚落葉，在無聲處提醒你：清醒時被生活喧囂掩蓋的心事，正在靜候一場溫柔的體認與歸途。」';
    } else {
      summary = '「這個夢境並非隨機神經雜訊，而是你的潛意識正透過具象化的情境（昔日校舍、推門找課室、赤腳暴露）處理近期的心理轉變與張力。當你試圖在變動中找到立足點時，內在正在尋找調適與自我整合的平衡。」';
    }

    let symbolInsight = '';
    if (c >= 75) {
      symbolInsight = '【當代東方文化層】：校舍與公開試是華人社會集體潛意識中的「考場烙印」。即使成年多年，每逢現實面臨家庭責任、職場評核或角色轉折，心靈便會本能召喚這份赤腳應試的無力感；赤腳在嶺南語境中更映射出對「體面」與「家庭交代」的焦慮投射。';
    } else {
      symbolInsight = '【普世心理學象徵層】：學校象徵規範體系與成就評價，推門尋找課室反映方向焦慮與身份過渡；赤腳則代表基本心理防禦被剝奪時的脆弱性與對接地的渴求。';
    }

    let actionAdvice = '';
    if (d >= 75) {
      actionAdvice = '【果斷生活轉化指南】：1. 今日立刻劃出 15 分鐘無人打擾的心理邊界；2. 將最讓你牽掛的一項責任或外界眼光寫下，標註「這並非我一人能負」；3. 深呼吸三次，主動卸下無效防禦，今晚早睡半小時。';
    } else if (p >= 80) {
      actionAdvice = '【溫柔心靈陪伴】：今天給自己十分鐘放空時間，對那個在夢中奔忙無措、赤腳尋路的自己輕聲說一句：「我知道你很努力了，現在的我們是安全的，你不需要再孤軍作戰。」';
    } else {
      actionAdvice = '【自我探索反思】：最近生活中是否有某個情境讓你感到「熟悉卻又有些格格不入」？試著在安靜的片刻，傾聽那個在夢中尋找出口的內在聲音。';
    }

    return { tags, summary, symbolInsight, actionAdvice };
  }, [settings]);

  const handleSelectPreset = (presetItem: EnginePresetDefinition) => {
    setSettings((prev) => ({
      ...prev,
      ...presetItem.settings,
      preset: presetItem.id,
    }));
    setNotice(`已套用「${presetItem.name}」模式，各項參數已同步調整，請點擊「儲存 AI 引擎配置」以生效。`);
  };

  const handleResetToDefault = () => {
    setSettings({ ...INITIAL_SETTINGS });
    setNotice('已恢復為系統推薦之「平衡全維度標準」預設值。');
  };

  return (
    <div className="space-y-6" id="admin-console-wrapper">
      {notice && (
        <div className="callout text-sm flex items-center justify-between" id="admin-notice-callout">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#78e1b5]" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="text-xs text-[#aab3d2] hover:text-white cursor-pointer"
          >
            關閉
          </button>
        </div>
      )}

      {/* Role permission status banner */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isSuperAdmin 
          ? 'bg-[#aa9cff]/10 border-[#aa9cff]/30 text-[#c3b9ff]'
          : 'bg-[#71d9ff]/10 border-[#71d9ff]/30 text-[#71d9ff]'
      }`}>
        <div className="flex items-center gap-2.5">
          {isSuperAdmin ? (
            <ShieldCheck className="w-5 h-5 text-[#aa9cff]" />
          ) : (
            <Settings className="w-5 h-5 text-[#71d9ff]" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">
              {isSuperAdmin ? '🛡️ 高級管理員模式 (SUPER ADMIN)' : '⚙️ 內容管理員模式 (ADMIN)'}
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {isSuperAdmin
                ? '您擁有最高權限：可管理廣告賺星影片庫、更改所有會員等級與星星配置、調整 AI 語氣模型參數，以及管理選物店與諮詢師。'
                : '您擁有內容管理權限：可管理廣告賺星影片庫、選物店產品、療癒諮詢師團隊，以及調整 AI 引擎參數。（更改會員等級需高級管理員權限）'}
            </p>
          </div>
        </div>

        <span className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
          isSuperAdmin 
            ? 'bg-[#aa9cff]/20 text-[#aa9cff] border-[#aa9cff]/40' 
            : 'bg-[#71d9ff]/20 text-[#71d9ff] border-[#71d9ff]/40'
        }`}>
          {isSuperAdmin ? '最高權限' : '內容管理權限'}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-purple-500/25 text-purple-200 border border-purple-400/50 shadow-sm shadow-purple-500/20'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
          id="admin-audit-tab-btn"
        >
          <Activity className="w-4 h-4 text-purple-400" />
          <span>📊 營運審計中心 ({loginRecords.length + adWatchRecords.length + shopVisitRecords.length})</span>
          {isSuperAdmin && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 font-bold text-[9px] border border-purple-400/30">
              高級專用
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>🌿 解夢選物產品庫 ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('therapists')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'therapists'
              ? 'bg-[#78e1b5]/20 text-[#78e1b5] border border-[#78e1b5]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
          id="admin-therapists-tab-btn"
        >
          <Heart className="w-4 h-4 text-[#78e1b5]" />
          <span>🧘 治療師資料庫 ({therapists.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advideos')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'advideos'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Tv className="w-4 h-4 text-amber-400" />
          <span>📺 賺星廣告影片庫 ({adVideos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('engine')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'engine'
              ? 'bg-[#ffd27a]/20 text-white border border-[#ffd27a]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#ffd27a]" />
          <span>🎛️ AI 引擎個性參數</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#aa9cff]/20 text-white border border-[#aa9cff]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4 text-[#aa9cff]" />
          <span>👥 會員等級管理 ({users.length})</span>
          {isSuperAdmin && (
            <span className="w-2 h-2 rounded-full bg-[#aa9cff] animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: BOOK BRAIN MANAGEMENT */}
      {activeTab === 'books' && (
        <section className="card p-6" id="admin-book-brain-card">
          <div className="flex items-center justify-between">
            <span className="badge">
              <BookOpen className="w-3 h-3 text-[#71d9ff]" />
              BOOK BRAIN KNOWLEDGE REPOSITORY
            </span>
            <span className="text-xs text-[#8d97b5]">已收錄 {books.length} 本典籍</span>
          </div>

          <h2 style={{ fontSize: 24, marginTop: 12 }} className="text-white font-bold">
            書本知識庫管理與索引
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
            管理員與高級管理員皆可在此上傳專業典籍、觸發 OCR 向量化處理，或刪除過時文獻。
            解夢時系統優先根據此處的知識庫檢索心理學依據。
          </p>

          <label
            className="filedrop block mt-4 p-5 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#71d9ff]/50 bg-white/[0.02] text-center cursor-pointer transition-all"
            id="book-upload-dropzone"
          >
            <div className="text-3xl mb-1">📚</div>
            <b className="text-sm text-white block">
              {busy === 'upload' ? '上傳與解析中…' : '加入 PDF / 書籍掃描圖檔 (JPG, PNG, WebP)'}
            </b>
            <div className="tiny muted mt-1">
              單檔最高支援 50MB · 文字型直接切段，掃描圖檔啟用 OCR 視覺分析
            </div>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp,text/plain"
              disabled={busy === 'upload'}
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.currentTarget.value = '';
              }}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
            {books.map((b) => {
              const p = Math.round((b.processed_pages / Math.max(1, b.total_pages)) * 100);
              return (
                <div
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  key={b.id}
                  id={`book-item-${b.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span
                        className={
                          b.status === 'ready'
                            ? 'text-[#78e1b5] font-semibold flex items-center gap-1'
                            : b.status === 'processing'
                            ? 'text-[#ffd27a]'
                            : 'text-[#8d97b5]'
                        }
                      >
                        {b.status === 'ready' ? '✓ Ready (已建庫)' : b.status === 'processing' ? '⚡ 索引中…' : '⏳ 待處理'}
                      </span>
                      <span className="text-[11px] text-[#8d97b5] font-mono">
                        {b.processed_pages}/{b.total_pages} 頁 ({p}%)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{b.title}</h3>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden my-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#71d9ff] to-[#78e1b5] transition-all"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    {b.status !== 'ready' ? (
                      <button
                        type="button"
                        className="btn dark text-xs py-1.5 px-3"
                        disabled={busy === b.id}
                        onClick={() => processBook(b.id)}
                      >
                        {busy === b.id ? '處理中…' : '開始 OCR 索引'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#78e1b5]">已可用於 AI 檢索</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteBook(b.id)}
                      className="p-1.5 text-xs text-[#8d97b5] hover:text-[#ff8b9d] transition-colors cursor-pointer"
                      title="刪除此典籍"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: THEORY & CONTENT MANAGEMENT (管理及修改內容) */}
      {activeTab === 'theories' && (
        <section className="card p-6" id="admin-theories-card">
          <div className="flex items-center justify-between">
            <div>
              <span className="badge">
                <Edit3 className="w-3 h-3 text-[#78e1b5]" />
                CONTENT EDITING & PSYCHOLOGICAL THEORIES
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                心理學理論與核心象徵內容管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1">
                管理員與高級管理員均可新增、修訂或更新 Book Brain 的核心理論條目與引文見解。
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingTheory(true);
                setEditingTheory(null);
                setTheoryForm({ theoryName: '', bookTitle: '', citation: '', coreInsight: '' });
              }}
              className="btn text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增理論條目</span>
            </button>
          </div>

          {/* Form Modal / Inline Editor */}
          {(isAddingTheory || editingTheory) && (
            <form
              onSubmit={handleSaveTheory}
              className="p-5 rounded-2xl bg-white/[0.04] border border-[#78e1b5]/30 mt-4 space-y-3"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#78e1b5]" />
                <span>{editingTheory ? '編輯理論內容' : '新增理論內容'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1">理論名稱 *</label>
                  <input
                    type="text"
                    required
                    value={theoryForm.theoryName}
                    onChange={(e) => setTheoryForm({ ...theoryForm, theoryName: e.target.value })}
                    placeholder="例如：榮格原型理論、東方集體考場烙印"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1">出處典籍 *</label>
                  <input
                    type="text"
                    required
                    value={theoryForm.bookTitle}
                    onChange={(e) => setTheoryForm({ ...theoryForm, bookTitle: e.target.value })}
                    placeholder="例如：Man and His Symbols (Carl G. Jung)"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#cbd2ef] block mb-1">引文頁碼 / 章節</label>
                <input
                  type="text"
                  value={theoryForm.citation}
                  onChange={(e) => setTheoryForm({ ...theoryForm, citation: e.target.value })}
                  placeholder="例如：p. 168-175, 第二章"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                />
              </div>

              <div>
                <label className="text-xs text-[#cbd2ef] block mb-1">核心理論闡釋與心理洞察 *</label>
                <textarea
                  rows={3}
                  required
                  value={theoryForm.coreInsight}
                  onChange={(e) => setTheoryForm({ ...theoryForm, coreInsight: e.target.value })}
                  placeholder="詳細說明該理論如何闡明特定夢境意象……"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTheory(false);
                    setEditingTheory(null);
                  }}
                  className="btn2 text-xs py-1.5 px-3"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn text-xs py-1.5 px-4"
                >
                  儲存修改
                </button>
              </div>
            </form>
          )}

          {/* Theory List */}
          <div className="space-y-3 mt-4">
            {theories.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#78e1b5]/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{t.theoryName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#78e1b5]/10 text-[#78e1b5] font-mono">
                      {t.citation}
                    </span>
                  </div>
                  <div className="text-xs text-[#71d9ff] font-medium">
                    📚 {t.bookTitle}
                  </div>
                  <p className="text-xs text-[#cbd2ef] leading-relaxed">
                    {t.coreInsight}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTheory(t);
                      setIsAddingTheory(false);
                      setTheoryForm(t);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#aab3d2] hover:text-white transition-colors"
                    title="編輯此條目"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTheory(t.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-xs text-[#8d97b5] hover:text-[#ff8b9d] transition-colors"
                    title="刪除此條目"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: PRODUCTS DATABASE MANAGEMENT */}
      {activeTab === 'products' && (
        <section className="card p-6" id="admin-products-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <Package className="w-3 h-3 text-emerald-400" />
                POST-DREAM PRODUCTS DATABASE
              </span>
              <h2 style={{ fontSize: 24, marginTop: 12 }} className="text-white font-bold">
                解夢選物店產品資料庫管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed mt-1">
                管理可供客人在完成夢境分析後選購之各類身心轉運與療癒產品（包含安眠草本、空間淨化、守護水晶與氣場噴霧等）。
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingProduct(true);
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  subTitle: '',
                  brand: '零離 (LINGLI)',
                  priceHKD: 68,
                  category: 'purify',
                  categoryLabel: '淨化去霉 · 好運轉化',
                  volumeOrSpec: '100ML',
                  shelfLife: '2 年',
                  recommendationReason: '',
                  usageGuide: '',
                  imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                  badge: '🌿 新品推薦',
                  inStock: true,
                });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>新增產品條目</span>
            </button>
          </div>

          {/* Add / Edit Product Form */}
          {(isAddingProduct || editingProduct) && (
            <form
              onSubmit={handleSaveProduct}
              className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4 mb-6"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>{editingProduct ? '編輯產品資料' : '新增選物產品條目'}</span>
                </h3>
                <span className="text-xs text-emerald-300">
                  {editingProduct ? `ID: ${editingProduct.id}` : '草稿'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#cbd2ef] block mb-1">產品名稱 *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="例如：深眠白噪音薰衣草舒緩枕頭噴霧 / 白鼠尾草淨化杖"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">副標題 / 宣傳特點</label>
                  <input
                    type="text"
                    value={productForm.subTitle || ''}
                    onChange={(e) => setProductForm({ ...productForm, subTitle: e.target.value })}
                    placeholder="例如：助眠放鬆 · 撫平夜間焦慮 · 重整能量磁場"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">品牌名稱</label>
                  <input
                    type="text"
                    value={productForm.brand || ''}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="例如：DreamWisdom Herbal Lab / Aura Crystals"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">售價 (HK$) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.priceHKD || 0}
                      onChange={(e) => setProductForm({ ...productForm, priceHKD: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">原價 (HK$)</label>
                    <input
                      type="number"
                      value={productForm.originalPriceHKD || ''}
                      onChange={(e) => setProductForm({ ...productForm, originalPriceHKD: Number(e.target.value) })}
                      placeholder="98"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">產品分類</label>
                  <select
                    value={productForm.category || 'purify'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="purify">🍃 淨化開運 · 氣場轉化 (草本噴霧等)</option>
                    <option value="sleep">🌙 深眠安神 · 夢境撫慰 (枕頭噴霧)</option>
                    <option value="incense">🌿 空間結界 · 白鼠尾草</option>
                    <option value="crystal">💎 靈性直覺 · 守護水晶</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">供應與活動狀態</label>
                  <select
                    value={
                      productForm.availabilityStatus ||
                      (productForm.inStock === false
                        ? '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。'
                        : '現貨供應')
                    }
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setProductForm({
                        ...productForm,
                        availabilityStatus: val,
                        inStock: val === '現貨供應',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="現貨供應">🟢 現貨供應 (全彩亮色 · 即刻下單)</option>
                    <option value="目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。">
                      ⚪ 目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。 (淺色識別)
                    </option>
                    <option value="本活動已圓滿結束">⚪ 本活動已圓滿結束 (淺色識別)</option>
                    <option value="等待活動開始">⚪ 等待活動開始 (淺色識別)</option>
                    <option value="候補中">⚪ 候補中 (淺色識別)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">規格容量 / 包裝</label>
                  <input
                    type="text"
                    value={productForm.volumeOrSpec || ''}
                    onChange={(e) => setProductForm({ ...productForm, volumeOrSpec: e.target.value })}
                    placeholder="100ML 噴霧裝"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#cbd2ef] block mb-1">產品圖片 URL</label>
                  <input
                    type="text"
                    value={productForm.imageUrl || ''}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="圖片網址"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#cbd2ef] block mb-1">解夢後推薦理由 (廣東話)</label>
                  <textarea
                    rows={2}
                    value={productForm.recommendationReason || ''}
                    onChange={(e) => setProductForm({ ...productForm, recommendationReason: e.target.value })}
                    placeholder="例如：醒來若感心神不寧或沉重滯塞，推薦睡前枕畔噴灑或煙燻淨化空間..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="btn2 text-xs py-1.5 px-3"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-md"
                >
                  儲存產品
                </button>
              </div>
            </form>
          )}

          {/* Products Approval Filter and Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setProductApprovalFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  productApprovalFilter === 'all'
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/5'
                }`}
              >
                全部產品 ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setProductApprovalFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
                  productApprovalFilter === 'pending'
                    ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                    : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                }`}
              >
                <span>⏳ 待高級管理員審批</span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] font-mono font-bold">
                  {products.filter((p) => p.status === 'pending').length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setProductApprovalFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  productApprovalFilter === 'approved'
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/5'
                }`}
              >
                ✅ 已公開上架 ({products.filter((p) => !p.status || p.status === 'approved').length})
              </button>
              <button
                type="button"
                onClick={() => setProductApprovalFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  productApprovalFilter === 'rejected'
                    ? 'bg-red-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/5'
                }`}
              >
                ❌ 已退回 ({products.filter((p) => p.status === 'rejected').length})
              </button>
            </div>

            <div className="text-xs text-[#aab3d2] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isSuperAdmin
                  ? '👑 高級管理員身分：具備核准公開與退回權限'
                  : '一般管理員：審批由高級管理員 (Super Admin) 執行'}
              </span>
            </div>
          </div>

          {/* Products List */}
          {products.filter((p) => {
            if (productApprovalFilter === 'pending') return p.status === 'pending';
            if (productApprovalFilter === 'approved') return !p.status || p.status === 'approved';
            if (productApprovalFilter === 'rejected') return p.status === 'rejected';
            return true;
          }).length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 text-[#8d97b5] text-xs">
              目前篩選分類下暫無產品。
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {products
                .filter((p) => {
                  if (productApprovalFilter === 'pending') return p.status === 'pending';
                  if (productApprovalFilter === 'approved') return !p.status || p.status === 'approved';
                  if (productApprovalFilter === 'rejected') return p.status === 'rejected';
                  return true;
                })
                .map((p) => {
                  const isPending = p.status === 'pending';
                  const isRejected = p.status === 'rejected';

                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl transition-all flex items-start gap-4 ${
                        isPending
                          ? 'bg-amber-950/15 border-2 border-amber-500/50 shadow-lg shadow-amber-950/20'
                          : isRejected
                          ? 'bg-red-950/10 border border-red-500/30'
                          : 'bg-white/[0.03] border border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-22 h-22 rounded-xl object-cover bg-black/40 shrink-0 border border-white/10"
                      />

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-emerald-400 font-medium">
                              {p.categoryLabel}
                            </span>
                            {isPending && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                                ⏳ 待高級管理員審批
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                                ❌ 已退回
                              </span>
                            )}
                            {!isPending && !isRejected && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                ✅ 已公開
                              </span>
                            )}
                            {(p.availabilityStatus === '現貨供應' || (!p.availabilityStatus && p.inStock !== false)) ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                                🟢 現貨供應
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/5 text-white/50 border border-white/10">
                                ⚪ {p.availabilityStatus || '已售罄補貨中'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black text-white font-mono shrink-0">
                            HK${p.priceHKD}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white truncate">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-[#aab3d2] line-clamp-1">
                          {p.subTitle}
                        </p>

                        <div className="text-[10px] text-[#8d97b5]">
                          規格：{p.volumeOrSpec} · 品牌/手作：{p.brand}
                        </div>

                        {p.submittedByUserName && (
                          <div className="text-[10px] text-amber-200/90 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 flex flex-wrap items-center justify-between gap-1">
                            <span>
                              👤 會員提交：<strong className="text-white">{p.submittedByUserName}</strong>
                              {p.submittedByUserEmail ? ` (${p.submittedByUserEmail})` : ''}
                            </span>
                            {p.submittedAt && (
                              <span className="text-[9px] text-[#aab3d2]">
                                {new Date(p.submittedAt).toLocaleDateString('zh-HK')}
                              </span>
                            )}
                          </div>
                        )}

                        {isRejected && p.rejectionReason && (
                          <div className="text-[10px] text-red-300 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
                            ⚠️ 退回理由：{p.rejectionReason}
                          </div>
                        )}

                        {/* Actions row */}
                        <div className="pt-2 flex items-center justify-between border-t border-white/5 flex-wrap gap-2">
                          <div>
                            {isPending && (
                              <div className="flex items-center gap-1.5">
                                {isSuperAdmin ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleApproveProduct(p.id)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>核准公開上架</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectProduct(p.id)}
                                      className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[11px] cursor-pointer"
                                    >
                                      退回
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-amber-300">
                                    待高級管理員審批
                                  </span>
                                )}
                              </div>
                            )}

                            {isRejected && isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => handleApproveProduct(p.id)}
                                className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                              >
                                重新核准公開 →
                              </button>
                            )}

                            {!isPending && !isRejected && (
                              <span className="text-[10px] text-[#8d97b5]">
                                適用關鍵字：{p.matchingKeywords?.slice(0, 3).join('、') || '療癒身心'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setIsAddingProduct(false);
                                setProductForm(p);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs cursor-pointer"
                              title="編輯此產品"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#8d97b5] hover:text-[#ff8b9d] text-xs cursor-pointer"
                              title="刪除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      )}

      {/* TAB: AD VIDEO DATABASE MANAGEMENT (只有管理員及高級管理員加減，隨意出給客人觀看賺星星) */}
      {activeTab === 'advideos' && (
        <section className="card p-6" id="admin-advideos-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
            <div>
              <span className="badge bg-amber-500/20 text-amber-300 border-amber-500/40">
                <Tv className="w-3 h-3 text-amber-400" />
                ADVERTISEMENT & SPONSOR VIDEO DATABASE
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                賺星星廣告資料庫管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1">
                此處所管理的廣告短片將於客人點擊「睇片儲星」時，隨機挑選播放。只有管理員及高級管理員有權新增、編輯、下架或刪除。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingAd(true);
                  setEditingAd(null);
                  setAdForm({
                    title: '',
                    advertiser: '',
                    tagline: '',
                    durationSeconds: 10,
                    rewardStars: 1,
                    category: 'alien_philosophy',
                    bgGradient: 'from-[#0b051d] via-[#1a0c3b] to-[#04010a]',
                    accentColor: '#aa9cff',
                    isActive: true,
                    posterUrl: '',
                    videoUrl: '',
                  });
                  setDialogueRows([{ speaker: '外星導師', text: '' }]);
                }}
                className="btn primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
                id="btn-add-advideo"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增廣告短片</span>
              </button>
            </div>
          </div>

          {/* Add / Edit Ad Video Form */}
          {(isAddingAd || editingAd) && (
            <form
              onSubmit={handleSaveAdVideo}
              className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4 mb-6 animate-fade-in"
              id="advideo-form"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-amber-400" />
                  <span>{editingAd ? '編輯廣告短片內容' : '新增廣告短片資料'}</span>
                </h3>
                <span className="text-xs text-amber-300">
                  {editingAd ? `ID: ${editingAd.id}` : '全新廣告條目'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="text-[#cbd2ef] block mb-1">廣告標題 / 主題 *</label>
                  <input
                    type="text"
                    required
                    value={adForm.title || ''}
                    onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                    placeholder="例如：👽 星際對話 · 外星導師解密夢境的唯一真實"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">贊助商 / 廣告商品牌 *</label>
                  <input
                    type="text"
                    required
                    value={adForm.advertiser || ''}
                    onChange={(e) => setAdForm({ ...adForm, advertiser: e.target.value })}
                    placeholder="例如：Intergalactic Consciousness Lab 或 零離 LINGLI"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#cbd2ef] block mb-1">宣傳標語 / 口號 (Tagline)</label>
                  <input
                    type="text"
                    value={adForm.tagline || ''}
                    onChange={(e) => setAdForm({ ...adForm, tagline: e.target.value })}
                    placeholder="例如：「做夢才是真的？夢境是來自真實心靈的投射，它比你自認為的內心還要真實。」"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">播放秒數 (秒)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={adForm.durationSeconds || 10}
                      onChange={(e) => setAdForm({ ...adForm, durationSeconds: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[#cbd2ef] block mb-1">完播獎勵星星 (顆)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={adForm.rewardStars || 1}
                      onChange={(e) => setAdForm({ ...adForm, rewardStars: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">廣告類別</label>
                    <select
                      value={adForm.category || 'alien_philosophy'}
                      onChange={(e) => setAdForm({ ...adForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="alien_philosophy">👽 星際哲學 / 心靈對話</option>
                      <option value="brand_sponsor">🌿 選物商品 / 品牌贊助</option>
                      <option value="healing_sound">🌙 療癒聲景 / 深眠導引</option>
                      <option value="meditation_scene">💎 冥想水晶 / 能量場景</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#cbd2ef] block mb-1">播放狀態</label>
                    <select
                      value={adForm.isActive ? 'true' : 'false'}
                      onChange={(e) => setAdForm({ ...adForm, isActive: e.target.value === 'true' })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="true">✓ 啟用中 (客人隨機觀看)</option>
                      <option value="false">⏸️ 下架停播 (不提供觀看)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">背景封面海報 URL</label>
                  <input
                    type="url"
                    value={adForm.posterUrl || ''}
                    onChange={(e) => setAdForm({ ...adForm, posterUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">影片連結 URL (可選 mp4 / 嵌入)</label>
                  <input
                    type="text"
                    value={adForm.videoUrl || ''}
                    onChange={(e) => setAdForm({ ...adForm, videoUrl: e.target.value })}
                    placeholder="可選填影片網址或留空使用沉浸式聲畫"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Dynamic Subtitles / Dialogue Lines */}
              <div className="pt-2 border-t border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>廣告播放對白／語音字幕流（按秒數分段自動滾動）：</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setDialogueRows([...dialogueRows, { speaker: '外星導師', text: '' }])}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>新增一段對白</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {dialogueRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        value={row.speaker}
                        onChange={(e) => {
                          const updated = [...dialogueRows];
                          updated[idx].speaker = e.target.value;
                          setDialogueRows(updated);
                        }}
                        placeholder="說話者 (如 外星導師)"
                        className="w-28 px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-amber-300 font-bold text-xs"
                      />
                      <input
                        type="text"
                        value={row.text}
                        onChange={(e) => {
                          const updated = [...dialogueRows];
                          updated[idx].text = e.target.value;
                          setDialogueRows(updated);
                        }}
                        placeholder="字幕內容 (如：我們認為夢境是唯一的真實，夢境來自真實心靈的投射...)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                      />
                      {dialogueRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDialogueRows(dialogueRows.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                          title="移除此句"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAd(false);
                    setEditingAd(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-[#aab3d2] hover:text-white bg-white/5 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {editingAd ? '更新廣告' : '確認新增入庫'}
                </button>
              </div>
            </form>
          )}

          {/* Ad Videos List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {adVideos.map((ad) => (
              <div
                key={ad.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  ad.isActive
                    ? 'bg-white/[0.03] border-white/10 hover:border-amber-400/40'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ad.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                        }`}
                      />
                      <span className="text-[11px] font-bold text-amber-300">
                        {ad.advertiser}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        👁️ {adWatchRecords.filter((a) => a.adId === ad.id || a.adTitle === ad.title).length} 次收看
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                        ⏱️ {ad.durationSeconds}s
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        ⭐ +{ad.rewardStars}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {ad.title}
                  </h3>

                  <p className="text-xs text-[#aab3d2] mt-1.5 leading-relaxed line-clamp-2">
                    {ad.tagline}
                  </p>

                  {/* Subtitle dialogue count preview */}
                  {ad.dialogueDialogue && ad.dialogueDialogue.length > 0 && (
                    <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-white/10 text-[11px] text-[#cbd2ef] flex items-center gap-2">
                      <span className="text-amber-400 font-semibold shrink-0">
                        💬 {ad.dialogueDialogue[0].speaker}：
                      </span>
                      <span className="truncate">
                        {ad.dialogueDialogue[0].text}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAdActive(ad.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-all ${
                        ad.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-white/5 text-[#8d97b5] border-white/10 hover:text-white'
                      }`}
                    >
                      {ad.isActive ? '✓ 播放中' : '⏸️ 已停播'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAd(ad);
                        setIsAddingAd(false);
                        setAdForm(ad);
                        setDialogueRows(
                          ad.dialogueDialogue && ad.dialogueDialogue.length > 0
                            ? ad.dialogueDialogue
                            : [{ speaker: '外星導師', text: '' }]
                        );
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs cursor-pointer"
                      title="編輯廣告內容"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAdVideo(ad.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#8d97b5] hover:text-[#ff8b9d] text-xs cursor-pointer"
                      title="從資料庫刪除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: AI ENGINE SETTINGS & PERSONALITY STUDIO */}
      {activeTab === 'engine' && (
        <section className="card p-6 space-y-7" id="admin-dream-engine-card">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="badge">
                <Sliders className="w-3 h-3 text-[#ffd27a]" />
                AI ENGINE PERSONALITY & INTERPRETATION STUDIO
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold flex items-center gap-2">
                <span>AI 引擎個性參數與解夢風格調校</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffd27a]/20 text-[#ffd27a] font-normal border border-[#ffd27a]/30">
                  即時雙向聯動
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1 leading-relaxed max-w-3xl">
                配合當代東方文化深度解夢與榮格原型理論，管理員可微調 AI 輸出的共情溫度、決斷指引、典籍溯源深度、嶺南文化共鳴、修辭美感與噩夢安全防護，全方位提升解夢品質與使用者的心理療癒體驗。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#aab3d2] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                title="恢復系統預設推薦參數"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#ffd27a]" />
                <span>恢復推薦基準</span>
              </button>
            </div>
          </div>

          {/* Section 1: Preset Style Templates */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚡ 經典風格模板一鍵套用</span>
                <span className="text-xs text-[#8d97b5] font-normal">（可一鍵套用或於下方微調）</span>
              </h3>
              <span className="text-xs font-mono text-[#ffd27a]">
                當前模式：{ENGINE_PRESETS.find((p) => p.id === settings.preset)?.name || '🛠️ 自訂微調模式 (Custom)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {ENGINE_PRESETS.map((preset) => {
                const isActive = settings.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-3.5 rounded-2xl transition-all border cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                      isActive
                        ? 'bg-[#ffd27a]/15 border-[#ffd27a] shadow-lg shadow-[#ffd27a]/10 ring-1 ring-[#ffd27a]'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-[#ffd27a] transition-colors">
                          {preset.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-[#cbd2ef] font-mono whitespace-nowrap">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#cbd2ef] font-medium leading-snug line-clamp-1 mb-1">
                        {preset.tagline}
                      </p>
                      <p className="text-[10px] text-[#8d97b5] leading-relaxed line-clamp-2">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#aab3d2]">
                      <span>親和 {preset.settings.personality}%</span>
                      <span>決斷 {preset.settings.decisiveness}%</span>
                      <span>深度 {preset.settings.depth}%</span>
                    </div>

                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffd27a] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Fine-Tuning Multi-Dimensional Sliders */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎚️ 六大核心維度精細微調</span>
              <span className="text-xs text-[#8d97b5] font-normal">（手動拉動任一滑桿將自動轉為自訂模式）</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. 親和與共情溫度 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-[#aa9cff]" />
                    <span>親和與共情溫度</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[#aa9cff] px-2 py-0.5 rounded-lg bg-[#aa9cff]/10 border border-[#aa9cff]/20">
                    {settings.personality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.personality}
                  onChange={(e) =>
                    setSettings({ ...settings, personality: +e.target.value, preset: 'custom' })
                  }
                  className="w-full accent-[#aa9cff] cursor-pointer"
                />
                <div className="text-[10px] text-[#8d97b5] flex justify-between">
                  <span>0% 客觀冷靜臨床剖析</span>
                  <span>100% 溫潤共情深度撫慰</span>
                </div>
              </div>

              {/* 2. 決斷性與行動指引 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#71d9ff]" />
                    <span>決斷性與行動指引</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[#71d9ff] px-2 py-0.5 rounded-lg bg-[#71d9ff]/10 border border-[#71d9ff]/20">
                    {settings.decisiveness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.decisiveness}
                  onChange={(e) =>
                    setSettings({ ...settings, decisiveness: +e.target.value, preset: 'custom' })
                  }
                  className="w-full accent-[#71d9ff] cursor-pointer"
                />
                <div className="text-[10px] text-[#8d97b5] flex justify-between">
                  <span>0% 開放探索多元假設</span>
                  <span>100% 一針見血提煉方針</span>
                </div>
              </div>

              {/* 3. 典籍學理溯源深度 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-[#78e1b5]" />
                    <span>典籍學理溯源深度</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[#78e1b5] px-2 py-0.5 rounded-lg bg-[#78e1b5]/10 border border-[#78e1b5]/20">
                    {settings.depth}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.depth}
                  onChange={(e) =>
                    setSettings({ ...settings, depth: +e.target.value, preset: 'custom' })
                  }
                  className="w-full accent-[#78e1b5] cursor-pointer"
                />
                <div className="text-[10px] text-[#8d97b5] flex justify-between">
                  <span>20% 通俗生活化解讀</span>
                  <span>100% 嚴格原著文獻溯源</span>
                </div>
              </div>

              {/* 4. 當代東方文化共鳴 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>當代東方文化共鳴</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {settings.culturalResonance ?? 85}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.culturalResonance ?? 85}
                  onChange={(e) =>
                    setSettings({ ...settings, culturalResonance: +e.target.value, preset: 'custom' })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] text-[#8d97b5] flex justify-between">
                  <span>0% 普世符號視角</span>
                  <span>100% 嶺南/華人集體記憶深度融合</span>
                </div>
              </div>

              {/* 5. 意象修辭與詩意感 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Feather className="w-4 h-4 text-violet-400" />
                    <span>意象修辭與詩意感</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-violet-400 px-2 py-0.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    {settings.poeticTone ?? 65}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.poeticTone ?? 65}
                  onChange={(e) =>
                    setSettings({ ...settings, poeticTone: +e.target.value, preset: 'custom' })
                  }
                  className="w-full accent-violet-400 cursor-pointer"
                />
                <div className="text-[10px] text-[#8d97b5] flex justify-between">
                  <span>0% 乾脆直白實用白話</span>
                  <span>100% 散文詩意留白之美</span>
                </div>
              </div>

              {/* 6. 噩夢心理安全防護 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>噩夢心理安全防護</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-teal-400 px-2 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    {settings.shadowSensitivity ?? 85}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.shadowSensitivity ?? 85}
                  onChange={(e) =>
                    setSettings({ ...settings, shadowSensitivity: +e.target.value, preset: 'custom' })
                  }
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="text-[10px] text-[#8d97b5] flex justify-between">
                  <span>0% 直面恐懼原型</span>
                  <span>100% 強力心理著陸與賦權</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Model & Inference Controls */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#8d97b5] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#ffd27a]" />
              <span>推論底層模型與發散度配置</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1.5">
                  底層推論模型 (Engine Model)
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-xs focus:outline-none focus:border-[#ffd27a]"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (極速響應 · 當代東方文化深度融合 · 推薦)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (超深度榮格原型與複雜情結分析)</option>
                  <option value="deepseek/deepseek-v4.1-flash">deepseek/deepseek-v4.1-flash (哲學與隱喻適配)</option>
                </select>
                <p className="text-[11px] text-[#8d97b5] mt-1">
                  推薦使用 gemini-3.8-flash，具備毫秒級響應與極致的繁體中文東方語境理解。
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-white/90">
                    Temperature (發散想像度 vs 收斂精準度)
                  </label>
                  <span className="font-mono text-xs font-bold text-[#ffd27a]">
                    {settings.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => setSettings({ ...settings, temperature: +e.target.value })}
                  className="w-full accent-[#ffd27a] cursor-pointer"
                />
                <div className="text-[10px] text-[#8d97b5] flex justify-between mt-1">
                  <span>0.10 嚴謹理性·精確收斂</span>
                  <span>0.90 詩意跳躍·隱喻發散</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Live Real-time Interpretation Style Preview */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#ffd27a]/10 to-transparent border border-[#ffd27a]/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#ffd27a]" />
                <h3 className="text-sm font-bold text-white">
                  即時解夢風格模擬效果預覽 (Live Simulation)
                </h3>
              </div>
              <span className="text-xs text-[#cbd2ef]">
                測試夢境：<b>「回到舊校舍，同學老師都不認得我，到處找課室最後發現自己赤腳……」</b>
              </span>
            </div>

            {/* Dynamic Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#8d97b5]">當前運算風格特徵：</span>
              {livePreview.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${tag.color}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Simulated Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                <span className="text-[11px] font-bold text-[#aa9cff] uppercase tracking-wider block">
                  ① 心理主題摘要開場語氣
                </span>
                <p className="text-xs text-white/90 leading-relaxed font-serif">
                  {livePreview.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  ② 東方文化與象徵剖析深度
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  {livePreview.symbolInsight}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                <span className="text-[11px] font-bold text-[#78e1b5] uppercase tracking-wider block">
                  ③ 生活轉化行動指南語氣
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  {livePreview.actionAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[#8d97b5]">
              變更將即時同步至雲端伺服器與資料庫，所有會員的後續解夢皆會套用此套最新個性規則。
            </span>
            <button
              type="button"
              className="btn px-6 py-2.5 text-xs font-bold shadow-lg shadow-[#ffd27a]/20 cursor-pointer min-w-[180px]"
              disabled={busy === 'settings'}
              onClick={saveSettings}
              id="admin-save-settings-btn"
            >
              {busy === 'settings' ? '正在同步配置…' : '💾 儲存 AI 引擎配置'}
            </button>
          </div>
        </section>
      )}

      {/* TAB 4: USER & TIER MANAGEMENT (高級管理員可更改等級、增減星星、封禁、刪除會員) */}
      {activeTab === 'users' && (
        <section className="card p-6 space-y-6" id="admin-access-control-card">
          {/* Header & Permissions Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="badge">
                <Users className="w-3 h-3 text-[#aa9cff]" />
                MEMBER ROLES, SECURITY & ACCESS CONTROL
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                會員等級、安全封禁與星星管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1 leading-relaxed">
                {isSuperAdmin ? (
                  <span className="text-[#78e1b5] font-semibold">
                    ✓ 高級管理員專屬最高權限：可增減會員星星（+/- 或自訂）、變更會員等級、停權封禁（禁止再登記與登入）、DELETE 永久刪除會員，以及管理黑名單庫。
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold">
                    🔒 內容管理員權限：您可檢視會員列表與點數，修改等級、增減星星、封禁或刪除會員僅限高級管理員操作。
                  </span>
                )}
              </p>
            </div>

            {/* Total Stats Counters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono">
                總會員：<b className="text-white">{users.length}</b> 名
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 font-mono">
                黑名單/封禁：<b className="text-red-400">{bannedRecordsState.length}</b> 筆
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#78e1b5]/10 border border-[#78e1b5]/20 text-[#78e1b5] font-mono">
                VIP付費：<b className="text-[#78e1b5]">{users.filter((u) => normalizeRole(u.role) === 'paid').length}</b> 名
              </span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/30 border border-white/10">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative w-full">
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="搜尋會員 Email 或姓名..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                />
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#8d97b5]" />
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#0e1224] border border-white/20 text-white text-xs focus:outline-none focus:border-[#aa9cff] cursor-pointer"
              >
                <option value="all">全部會員 ({users.length})</option>
                <option value="banned">🚫 僅看已停權封禁</option>
                <option value="free">🌱 一般會員</option>
                <option value="paid">👑 付費會員 (VIP)</option>
                <option value="admin">⚙️ 內容管理員</option>
                <option value="super_admin">🛡️ 高級管理員</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="table w-full text-left" id="admin-users-table">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs text-[#8d97b5]">
                  <th className="py-3 px-3">會員資訊</th>
                  <th className="py-3 px-3">當前等級</th>
                  <th className="py-3 px-3">星星餘額 (可增減)</th>
                  <th className="py-3 px-3">
                    {isSuperAdmin ? '等級調整 (高級管理員專用)' : '等級權限'}
                  </th>
                  <th className="py-3 px-3">安全封禁狀態</th>
                  <th className="py-3 px-3 text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(() => {
                  const filteredUsers = users.filter((u) => {
                    const normSearch = userSearchTerm.trim().toLowerCase();
                    const matchesSearch =
                      !normSearch ||
                      u.email.toLowerCase().includes(normSearch) ||
                      (u.display_name && u.display_name.toLowerCase().includes(normSearch));

                    if (!matchesSearch) return false;

                    const isBanned =
                      u.is_banned ||
                      bannedRecordsState.some((b) => b.email.toLowerCase() === u.email.toLowerCase());

                    if (userRoleFilter === 'banned') return isBanned;
                    if (userRoleFilter === 'all') return true;
                    return normalizeRole(u.role) === userRoleFilter;
                  });

                  if (filteredUsers.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-[#8d97b5] text-xs">
                          查無符合條件的會員
                        </td>
                      </tr>
                    );
                  }

                  return filteredUsers.map((u) => {
                    const roleNorm = normalizeRole(u.role);
                    const isBanned =
                      u.is_banned ||
                      bannedRecordsState.some((b) => b.email.toLowerCase() === u.email.toLowerCase());
                    const isSelf = u.id === currentUserId;

                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-white/[0.02] transition-colors ${
                          isBanned ? 'bg-red-950/15' : ''
                        }`}
                      >
                        {/* 1. Member Information */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">
                              {u.display_name || u.email.split('@')[0]}
                            </span>
                            {isBanned && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/35 font-bold flex items-center gap-1">
                                <ShieldBan className="w-3 h-3" />
                                🚫 已封禁停權
                              </span>
                            )}
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#aa9cff]/20 text-[#c3b9ff] border border-[#aa9cff]/30">
                                你
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8d97b5] font-mono mt-0.5">{u.email}</div>
                          {u.created_at && (
                            <div className="text-[10px] text-[#8d97b5]/60 mt-0.5">
                              註冊於：{new Date(u.created_at).toLocaleDateString()}
                            </div>
                          )}

                          {/* Member Activity Badges (Logins, Ads, Store visits) */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25 text-[10px] font-mono">
                              🚪 登入 {userStatsMap[u.email.toLowerCase()]?.loginCount || 0} 次
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-mono">
                              📺 廣告 {userStatsMap[u.email.toLowerCase()]?.adCount || 0} 次
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-mono">
                              🛍️ 選物 {userStatsMap[u.email.toLowerCase()]?.shopCount || 0} 次
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveTab('audit')}
                              className="text-[10px] text-purple-400 hover:text-purple-300 underline cursor-pointer"
                              title="前往審計中心查看詳細日誌"
                            >
                              日誌明細 →
                            </button>
                          </div>
                        </td>

                        {/* 2. Current Role */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[11px] px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                              roleNorm === 'super_admin'
                                ? 'bg-[#aa9cff]/20 border-[#aa9cff]/40 text-[#c3b9ff]'
                                : roleNorm === 'admin'
                                ? 'bg-[#71d9ff]/20 border-[#71d9ff]/40 text-[#71d9ff]'
                                : roleNorm === 'paid'
                                ? 'bg-[#78e1b5]/20 border-[#78e1b5]/40 text-[#78e1b5]'
                                : 'bg-amber-400/15 border-amber-400/30 text-amber-300'
                            }`}
                          >
                            {roleNorm === 'super_admin' && <ShieldCheck className="w-3 h-3" />}
                            {roleNorm === 'admin' && <Settings className="w-3 h-3" />}
                            {roleNorm === 'paid' && <Crown className="w-3 h-3" />}
                            {roleNorm === 'free' && <Star className="w-3 h-3" />}
                            <span>{getRoleDisplayName(roleNorm)}</span>
                          </span>
                        </td>

                        {/* 3. Star Balance with Quick +/- and Custom Adjust */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-black text-amber-300">
                                ⭐ {u.stars ?? (roleNorm === 'free' ? 2 : 999)}
                              </span>
                              {isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() => setUserToAdjustStars(u)}
                                  className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 font-semibold cursor-pointer transition-colors"
                                  title="點擊精準自訂該會員星星數量"
                                >
                                  ✏️ 自訂
                                </button>
                              )}
                            </div>

                            {/* Quick Add / Deduct Buttons */}
                            {isSuperAdmin && (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStars(u, -5)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-mono cursor-pointer active:scale-95"
                                  title="扣減 5 顆星星"
                                >
                                  -5
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStars(u, -1)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-mono cursor-pointer active:scale-95"
                                  title="扣減 1 顆星星"
                                >
                                  -1
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStars(u, 1)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-mono cursor-pointer active:scale-95"
                                  title="增加 1 顆星星"
                                >
                                  +1
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStars(u, 5)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-mono cursor-pointer active:scale-95"
                                  title="增加 5 顆星星"
                                >
                                  +5
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStars(u, 20)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-mono cursor-pointer active:scale-95"
                                  title="增加 20 顆星星"
                                >
                                  +20
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 4. Role Modification Dropdown */}
                        <td className="py-3.5 px-3">
                          {isSuperAdmin ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={roleNorm}
                                disabled={busy === u.id}
                                onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                                className="px-2.5 py-1 rounded-lg bg-[#0e1224] border border-white/25 text-white text-xs font-medium focus:outline-none focus:border-[#aa9cff] cursor-pointer"
                                id={`select-role-${u.id}`}
                              >
                                <option value="free">🌱 一般會員 (睇片儲星)</option>
                                <option value="paid">👑 付費會員 (直接解鎖)</option>
                                <option value="admin">⚙️ 管理員 (內容管理)</option>
                                <option value="super_admin">🛡️ 高級管理員 (更改等級)</option>
                              </select>
                              {busy === u.id && (
                                <span className="text-[10px] text-[#78e1b5]">更新中…</span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[11px] text-[#8d97b5]">
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                              <span>僅高級管理員可更改</span>
                            </div>
                          )}
                        </td>

                        {/* 5. Ban / Unban Security Control */}
                        <td className="py-3.5 px-3">
                          {isSuperAdmin ? (
                            <div className="flex items-center gap-2">
                              {isBanned ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleBanUser(u)}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                  title="解除此會員之停權封禁，恢復正常登入"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>解除封禁</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isSelf}
                                  onClick={() => handleToggleBanUser(u)}
                                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors inline-flex items-center gap-1 ${
                                    isSelf
                                      ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/10 text-white/50'
                                      : 'bg-red-500/15 hover:bg-red-500/25 border-red-500/30 text-red-300 cursor-pointer'
                                  }`}
                                  title={isSelf ? '無法對自己帳號封禁' : '封禁此會員，禁止其登入'}
                                >
                                  <ShieldBan className="w-3 h-3" />
                                  <span>封禁會員</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#8d97b5]">
                              {isBanned ? '🚫 停權中' : '正常'}
                            </span>
                          )}
                        </td>

                        {/* 6. Management Actions: Delete & Identity Switch */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Switch user */}
                            {onSwitchUser && (
                              <button
                                type="button"
                                onClick={() => onSwitchUser(u)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                                  isSelf
                                    ? 'border-[#aa9cff] text-[#aa9cff] bg-[#aa9cff]/10'
                                    : 'border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
                                }`}
                                title="模擬以該會員身份登入系統"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>{isSelf ? '當前登入者' : '以此登入'}</span>
                              </button>
                            )}

                            {/* DELETE Member Button (Super Admin Only) */}
                            {isSuperAdmin && (
                              <button
                                type="button"
                                disabled={isSelf}
                                onClick={() => setUserToDelete(u)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors inline-flex items-center gap-1 ${
                                  isSelf
                                    ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/10 text-white/40'
                                    : 'bg-red-600/15 hover:bg-red-600/30 border-red-500/40 text-red-300 hover:text-white cursor-pointer'
                                }`}
                                title={isSelf ? '高級管理員無法刪除當前登入的自己' : '永久刪除該會員帳號'}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>DELETE 刪除</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>

          {/* PERMANENT BLACKLIST REPOSITORY (禁止再次登記 & 登入) */}
          {isSuperAdmin && (
            <div className="p-5 rounded-2xl bg-[#090d1a] border border-red-500/25 space-y-4" id="admin-blacklist-section">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                    <ShieldBan className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>永久封禁黑名單庫（禁止再次登記與登入）</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono">
                        {bannedRecordsState.length} 個已封禁 Email
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#cbd2ef]">
                      凡名單內之 Email，系統均全面阻擋登入；即使重新登記註冊，亦會直接被系統即時拒絕。
                    </p>
                  </div>
                </div>
              </div>

              {/* Form to Preemptively Add Banned Email */}
              <form onSubmit={handleAddBannedEmail} className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <div className="flex-1 min-w-[220px]">
                  <input
                    type="email"
                    required
                    value={newBannedEmailInput}
                    onChange={(e) => setNewBannedEmailInput(e.target.value)}
                    placeholder="輸入欲封鎖之 Email (例如 spammer@domain.com)..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-red-400"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={newBannedReasonInput}
                    onChange={(e) => setNewBannedReasonInput(e.target.value)}
                    placeholder="封禁原因 (例如：濫用服務 / 灌水攻擊)..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-red-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>＋ 加入封禁黑名單</span>
                </button>
              </form>

              {/* Blacklist List */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="table w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[#8d97b5]">
                      <th className="py-2.5 px-3">封禁 Email (禁止登記&登入)</th>
                      <th className="py-2.5 px-3">封鎖原因備註</th>
                      <th className="py-2.5 px-3">封禁時間</th>
                      <th className="py-2.5 px-3 text-right">解禁操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bannedRecordsState.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-[#8d97b5] text-xs">
                          目前黑名單為空，尚未有任何被永久封禁之 Email。
                        </td>
                      </tr>
                    ) : (
                      bannedRecordsState.map((rec) => (
                        <tr key={rec.email} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 px-3 font-mono text-red-300 font-semibold">
                            {rec.email}
                          </td>
                          <td className="py-2.5 px-3 text-[#cbd2ef]">
                            {rec.reason || '由高級管理員列入黑名單'}
                          </td>
                          <td className="py-2.5 px-3 text-[#8d97b5] text-[11px]">
                            {new Date(rec.banned_at).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveBannedEmail(rec.email)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-[#cbd2ef] hover:text-white cursor-pointer transition-colors"
                            >
                              解除黑名單
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Confirm Delete Member Modal */}
          <ConfirmDeleteUserModal
            isOpen={!!userToDelete}
            onClose={() => setUserToDelete(null)}
            user={userToDelete}
            onConfirm={handleDeleteUser}
          />

          {/* Star Adjust Modal */}
          <StarAdjustModal
            isOpen={!!userToAdjustStars}
            onClose={() => setUserToAdjustStars(null)}
            user={userToAdjustStars}
            onSave={handleSetExactStars}
          />
        </section>
      )}
      {/* TAB: THERAPISTS REPOSITORY & MATCHING */}
      {activeTab === 'therapists' && (
        <TherapistAdminManager
          therapists={therapists}
          onSaveTherapists={handleSaveTherapists}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
      )}

      {/* TAB: AUDIT & OPERATIONAL TRACKING (高級管理員專屬) */}
      {activeTab === 'audit' && (
        <AdminAuditDashboard
          loginRecords={loginRecords}
          adWatchRecords={adWatchRecords}
          shopVisitRecords={shopVisitRecords}
          users={users}
          isSuperAdmin={isSuperAdmin}
          currentUserId={currentUserId}
          onRefresh={handleRefreshAuditData}
          onClearLogs={handleClearAuditLogs}
        />
      )}

      {/* Confirm Delete Product Modal */}
      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        product={productToDelete}
        onConfirm={handleConfirmDeleteProduct}
      />
    </div>
  );
};
