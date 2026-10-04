import React, { useState, useEffect, useMemo } from 'react';
import { ProductItem, User, PurchaseOrder, normalizeRole, ProductAvailabilityStatus } from '../types';
import { trackShopVisitEvent } from '../utils/auditLogger';
import {
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  Check,
  Truck,
  CreditCard,
  ChevronRight,
  X,
  Heart,
  RefreshCw,
  Flame,
  ExternalLink,
  PackageCheck,
  Clock,
  CheckCircle,
  Plus,
  AlertCircle,
  FileText,
  BadgeCheck,
  Edit3,
  Trash2,
} from 'lucide-react';
import { MemberProductSubmitModal } from './MemberProductSubmitModal';
import { EditProductModal } from './EditProductModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const getProductStatus = (product: ProductItem): ProductAvailabilityStatus => {
  if (product.availabilityStatus) return product.availabilityStatus;
  if (product.inStock === false) return '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。';
  return '現貨供應';
};

export const getStatusButtonLabel = (status: ProductAvailabilityStatus): string => {
  switch (status) {
    case '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。':
      return '登記補貨通知';
    case '本活動已圓滿結束':
      return '本活動已結束';
    case '等待活動開始':
      return '提醒我活動開始';
    case '候補中':
      return '登記候補名額';
    default:
      return '登記通知';
  }
};

export interface ProductThemeStyles {
  key: string;
  themeName: string;
  cardBorder: string;
  cardBg: string;
  cardHover: string;
  badgeStyle: string;
  categoryLabelStyle: string;
  titleHover: string;
  availabilityPill: string;
  effectBox: string;
  effectTitle: string;
  effectText: string;
  actionBtn: string;
  actionBtnDisabled: string;
  starBadge: string;
  accentIconColor: string;
}

export const getProductTheme = (product: ProductItem): ProductThemeStyles => {
  const cat = product.category;
  const name = product.name;

  // 1. Purify / Pomelo / Citrus (碌柚葉 / 開運淨化) -> 暖金柑橘 (Amber & Tangerine Gold)
  if (cat === 'purify' || name.includes('碌柚') || name.includes('柚') || name.includes('開運') || name.includes('吉')) {
    return {
      key: 'amber',
      themeName: '暖金柑橘 · 吉慶好運',
      cardBorder: 'border-2 border-amber-400/80 shadow-lg shadow-amber-950/40',
      cardBg: 'bg-gradient-to-b from-amber-500/[0.08] via-amber-950/[0.04] to-slate-900/80',
      cardHover: 'hover:border-amber-400 hover:shadow-amber-500/25 hover:bg-amber-500/[0.12]',
      badgeStyle: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md',
      categoryLabelStyle: 'text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md font-bold',
      titleHover: 'group-hover:text-amber-300',
      availabilityPill: 'bg-amber-400/20 border-2 border-amber-400/60 text-amber-300 font-black',
      effectBox: 'bg-amber-950/50 border-2 border-amber-500/40 text-amber-100',
      effectTitle: 'text-amber-300 font-black',
      effectText: 'text-amber-100 font-semibold',
      actionBtn: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-md shadow-amber-500/30 active:scale-95',
      actionBtnDisabled: 'bg-amber-950/60 text-amber-300/60 border border-amber-500/30',
      starBadge: 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold',
      accentIconColor: 'text-amber-400',
    };
  }

  // 2. Sleep / Lavender (薰衣草 / 枕頭噴霧 / 助眠撫慰) -> 薰衣草紫 (Lavender Violet & Indigo)
  if (cat === 'sleep' || name.includes('薰衣草') || name.includes('枕頭') || name.includes('眠') || name.includes('安神')) {
    return {
      key: 'purple',
      themeName: '薰衣草紫 · 沉靜安神',
      cardBorder: 'border-2 border-purple-400/80 shadow-lg shadow-purple-950/40',
      cardBg: 'bg-gradient-to-b from-purple-500/[0.08] via-purple-950/[0.04] to-slate-900/80',
      cardHover: 'hover:border-purple-400 hover:shadow-purple-500/25 hover:bg-purple-500/[0.12]',
      badgeStyle: 'bg-gradient-to-r from-purple-500 to-indigo-400 text-white font-black shadow-md',
      categoryLabelStyle: 'text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded-md font-bold',
      titleHover: 'group-hover:text-purple-300',
      availabilityPill: 'bg-purple-400/20 border-2 border-purple-400/60 text-purple-300 font-black',
      effectBox: 'bg-purple-950/50 border-2 border-purple-500/40 text-purple-100',
      effectTitle: 'text-purple-300 font-black',
      effectText: 'text-purple-100 font-semibold',
      actionBtn: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-md shadow-purple-600/30 active:scale-95',
      actionBtnDisabled: 'bg-purple-900/80 hover:bg-purple-800 text-purple-100 border-2 border-purple-400/50 font-black',
      starBadge: 'bg-purple-400/20 text-purple-300 border border-purple-400/40 font-bold',
      accentIconColor: 'text-purple-400',
    };
  }

  // 3. Incense / Sage (白鼠尾草 / 空間煙燻 / 草杖) -> 森林翡翠綠 (Forest Sage & Emerald Green)
  if (cat === 'incense' || name.includes('鼠尾草') || name.includes('煙燻') || name.includes('杖') || name.includes('香')) {
    return {
      key: 'emerald',
      themeName: '森林翡翠 · 鼠尾草綠',
      cardBorder: 'border-2 border-emerald-400/80 shadow-lg shadow-emerald-950/40',
      cardBg: 'bg-gradient-to-b from-emerald-500/[0.08] via-emerald-950/[0.04] to-slate-900/80',
      cardHover: 'hover:border-emerald-400 hover:shadow-emerald-500/25 hover:bg-emerald-500/[0.12]',
      badgeStyle: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md',
      categoryLabelStyle: 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold',
      titleHover: 'group-hover:text-emerald-300',
      availabilityPill: 'bg-emerald-400/20 border-2 border-emerald-400/60 text-emerald-300 font-black',
      effectBox: 'bg-emerald-950/50 border-2 border-emerald-500/40 text-emerald-100',
      effectTitle: 'text-emerald-300 font-black',
      effectText: 'text-emerald-100 font-semibold',
      actionBtn: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black shadow-md shadow-emerald-600/30 active:scale-95',
      actionBtnDisabled: 'bg-emerald-950/60 text-emerald-300/60 border border-emerald-500/30',
      starBadge: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-bold',
      accentIconColor: 'text-emerald-400',
    };
  }

  // 4. Crystal (水晶原石 / 晶簇) -> 冰晶湛藍 (Cyan / Ice Crystal Blue)
  if (cat === 'crystal' || name.includes('水晶') || name.includes('晶') || name.includes('石') || name.includes('原礦')) {
    return {
      key: 'cyan',
      themeName: '冰晶湛藍 · 靈性守護',
      cardBorder: 'border-2 border-cyan-400/80 shadow-lg shadow-cyan-950/40',
      cardBg: 'bg-gradient-to-b from-cyan-500/[0.08] via-cyan-950/[0.04] to-slate-900/80',
      cardHover: 'hover:border-cyan-400 hover:shadow-cyan-500/25 hover:bg-cyan-500/[0.12]',
      badgeStyle: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-md',
      categoryLabelStyle: 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded-md font-bold',
      titleHover: 'group-hover:text-cyan-300',
      availabilityPill: 'bg-cyan-400/20 border-2 border-cyan-400/60 text-cyan-300 font-black',
      effectBox: 'bg-cyan-950/50 border-2 border-cyan-500/40 text-cyan-100',
      effectTitle: 'text-cyan-300 font-black',
      effectText: 'text-cyan-100 font-semibold',
      actionBtn: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black shadow-md shadow-cyan-500/30 active:scale-95',
      actionBtnDisabled: 'bg-cyan-950/60 text-cyan-300/60 border border-cyan-500/30',
      starBadge: 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold',
      accentIconColor: 'text-cyan-400',
    };
  }

  // 5. Herb / Tea (草本花茶 / 舒緩茶飲) -> 珊瑚玫瑰紅 (Rose / Coral / Warm Tea)
  if (cat === 'herb' || name.includes('茶') || name.includes('飲') || name.includes('花')) {
    return {
      key: 'rose',
      themeName: '玫瑰洋甘菊 · 暖茶舒緩',
      cardBorder: 'border-2 border-rose-400/80 shadow-lg shadow-rose-950/40',
      cardBg: 'bg-gradient-to-b from-rose-500/[0.08] via-rose-950/[0.04] to-slate-900/80',
      cardHover: 'hover:border-rose-400 hover:shadow-rose-500/25 hover:bg-rose-500/[0.12]',
      badgeStyle: 'bg-gradient-to-r from-rose-400 to-pink-500 text-white font-black shadow-md',
      categoryLabelStyle: 'text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded-md font-bold',
      titleHover: 'group-hover:text-rose-300',
      availabilityPill: 'bg-rose-400/20 border-2 border-rose-400/60 text-rose-300 font-black',
      effectBox: 'bg-rose-950/50 border-2 border-rose-500/40 text-rose-100',
      effectTitle: 'text-rose-300 font-black',
      effectText: 'text-rose-100 font-semibold',
      actionBtn: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-black shadow-md shadow-rose-500/30 active:scale-95',
      actionBtnDisabled: 'bg-rose-950/60 text-rose-300/60 border border-rose-500/30',
      starBadge: 'bg-rose-400/20 text-rose-300 border border-rose-400/40 font-bold',
      accentIconColor: 'text-rose-400',
    };
  }

  // 6. Default (Royal Sky Blue)
  return {
    key: 'blue',
    themeName: '皇家寶藍 · 能量調校',
    cardBorder: 'border-2 border-blue-400/80 shadow-lg shadow-blue-950/40',
    cardBg: 'bg-gradient-to-b from-blue-500/[0.08] via-blue-950/[0.04] to-slate-900/80',
    cardHover: 'hover:border-blue-400 hover:shadow-blue-500/25 hover:bg-blue-500/[0.12]',
    badgeStyle: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black shadow-md',
    categoryLabelStyle: 'text-blue-300 bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 rounded-md font-bold',
    titleHover: 'group-hover:text-blue-300',
    availabilityPill: 'bg-blue-400/20 border-2 border-blue-400/60 text-blue-300 font-black',
    effectBox: 'bg-blue-950/50 border-2 border-blue-500/40 text-blue-100',
    effectTitle: 'text-blue-300 font-black',
    effectText: 'text-blue-100 font-semibold',
    actionBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black shadow-md shadow-blue-600/30 active:scale-95',
    actionBtnDisabled: 'bg-blue-950/60 text-blue-300/60 border border-blue-500/30',
    starBadge: 'bg-blue-400/20 text-blue-300 border border-blue-400/40 font-bold',
    accentIconColor: 'text-blue-400',
  };
};

interface ProductStoreViewProps {
  products: ProductItem[];
  currentUser: User | null;
  currentDreamSummary?: string;
  recommendedProductId?: string;
  onOpenLogin: () => void;
  onOpenEarnStars: () => void;
  onUpdateUserStars?: (newStars: number) => void;
  onNavigateToWorkspace?: () => void;
  onUpdateProducts?: (products: ProductItem[]) => void;
  onNavigateToAdmin?: () => void;
  onGoBackToAstrolabe?: () => void;
}

export const ProductStoreView: React.FC<ProductStoreViewProps> = ({
  products,
  currentUser,
  currentDreamSummary,
  recommendedProductId,
  onOpenLogin,
  onOpenEarnStars,
  onUpdateUserStars,
  onNavigateToWorkspace,
  onUpdateProducts,
  onNavigateToAdmin,
  onGoBackToAstrolabe,
}) => {
  const [storeViewMode, setStoreViewMode] = useState<'public' | 'my_submissions' | 'pending_admin'>('public');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDetailProduct, setActiveDetailProduct] = useState<ProductItem | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<ProductItem | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Track Curated Shop visit event for Super Admin audit analytics
  useEffect(() => {
    try {
      const targetProd = recommendedProductId ? products.find((p) => p.id === recommendedProductId) : undefined;
      const entrySource = recommendedProductId ? 'workspace_recommend' : 'nav_bar';
      trackShopVisitEvent(currentUser, entrySource, {
        targetProductId: targetProd?.id || recommendedProductId,
        targetProductName: targetProd?.name,
        dreamContextSnippet: currentDreamSummary ? currentDreamSummary.slice(0, 120) : undefined,
      });
    } catch (err) {
      console.warn('Failed to track shop visit', err);
    }
  }, [recommendedProductId]);

  // If entering with a recommendedProductId from astrolabe or dream, focus and scroll to it
  const recommendedProduct = useMemo(() => {
    if (!recommendedProductId) return null;
    return products.find((p) => p.id === recommendedProductId) || null;
  }, [recommendedProductId, products]);

  useEffect(() => {
    if (recommendedProductId) {
      setSelectedCategory('all');
      const timer = setTimeout(() => {
        const el = document.getElementById(`product-card-${recommendedProductId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [recommendedProductId]);

  // Admin & Super Admin Management State
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

  const normRole = normalizeRole(currentUser?.role);
  const isSuperAdmin = normRole === 'super_admin';
  const isAdmin = normRole === 'admin';
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

  const isProductSubmitter = (p: ProductItem | null, user: User | null): boolean => {
    if (!p || !user) return false;
    if (p.submittedByUserId && p.submittedByUserId === user.id) return true;
    if (
      p.submittedByUserEmail &&
      user.email &&
      p.submittedByUserEmail.trim().toLowerCase() === user.email.trim().toLowerCase()
    ) {
      return true;
    }
    return false;
  };

  const canUserEditProduct = (p: ProductItem | null, user: User | null): boolean => {
    if (!p || !user) return false;
    const role = normalizeRole(user.role);
    if (role === 'admin' || role === 'super_admin') return true;
    return isProductSubmitter(p, user);
  };

  const approvedProducts = products.filter((p) => !p.status || p.status === 'approved');
  const mySubmissions = currentUser ? products.filter((p) => isProductSubmitter(p, currentUser)) : [];
  const pendingAdminProducts = products.filter((p) => p.status === 'pending');

  const handleSaveEditedProduct = (updatedProduct: ProductItem) => {
    if (!canUserEditProduct(updatedProduct, currentUser)) {
      alert('⚠️ 權限不足：只有管理員、高級管理員及申請上架的會員本人有資格更改！');
      return;
    }

    const updatedList = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    if (onUpdateProducts) onUpdateProducts(updatedList);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updatedList));
    } catch {}

    if (activeDetailProduct?.id === updatedProduct.id) {
      setActiveDetailProduct(updatedProduct);
    }
    const roleLabel = isSuperAdmin
      ? '高級管理員'
      : isAdmin
      ? '管理員'
      : isProductSubmitter(updatedProduct, currentUser)
      ? '申請上架會員'
      : '權限用戶';
    setSubmissionFeedback(`✅ ${roleLabel}操作成功：已更新「${updatedProduct.name}」專屬狀態及產品詳情！`);
    setProductToEdit(null);
  };

  const handleConfirmDeleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const canDelete = isAdminOrSuperAdmin || isProductSubmitter(target, currentUser);
    if (!canDelete) {
      alert('⚠️ 權限不足：只有管理員、高級管理員或申請上架會員本人可刪除此商品！');
      return;
    }

    const updatedList = products.filter((p) => p.id !== productId);
    if (onUpdateProducts) onUpdateProducts(updatedList);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updatedList));
    } catch {}

    if (activeDetailProduct?.id === productId) {
      setActiveDetailProduct(null);
    }
    if (productToEdit?.id === productId) {
      setProductToEdit(null);
    }
    setProductToDelete(null);
    setSubmissionFeedback(`🗑️ 操作成功：已從選物店刪除產品「${target?.name || ''}」！`);
  };

  // Keyboard shortcut: ESC to safely close any active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDetailProduct) setActiveDetailProduct(null);
        if (checkoutProduct) setCheckoutProduct(null);
        if (showOrderHistory) setShowOrderHistory(false);
        if (productToEdit) setProductToEdit(null);
        if (productToDelete) setProductToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDetailProduct, checkoutProduct, showOrderHistory, productToEdit, productToDelete]);

  // Checkout form state
  const [customerName, setCustomerName] = useState(currentUser?.display_name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'sf_express' | 'store_pickup'>('sf_express');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'fps' | 'payme' | 'alipay_hk' | 'wechat_pay' | 'credit_card'>('fps');
  const [useStarsDiscount, setUseStarsDiscount] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<PurchaseOrder | null>(null);

  const getSavedOrders = (): PurchaseOrder[] => {
    try {
      return JSON.parse(localStorage.getItem('dreamwisdom_orders') || '[]');
    } catch {
      return [];
    }
  };

  const savedOrdersList = getSavedOrders();

  const filteredProducts = approvedProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleOpenSubmitModal = () => {
    if (!currentUser) {
      alert('請先登入會員以提交選物產品上架申請！新產品將經由高級管理員審批後公開。');
      onOpenLogin();
      return;
    }
    setIsSubmitModalOpen(true);
  };

  const handleSuccessSubmitProduct = (newProduct: ProductItem) => {
    const updated = [newProduct, ...products];
    if (onUpdateProducts) {
      onUpdateProducts(updated);
    }
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {}

    setIsSubmitModalOpen(false);

    if (newProduct.status === 'approved') {
      setSubmissionFeedback(`✅ 高級管理員核准：產品「${newProduct.name}」已直接於解夢選物店公開上架！`);
      setStoreViewMode('public');
    } else {
      setSubmissionFeedback(
        `🎉 產品「${newProduct.name}」上架申請已成功送出！\n\n根據平台規範，此產品已進入待審批佇列，需經由高級管理員審批核准後方會公開上架。\n你可隨時在「我的上架申請」標籤追蹤審核進度。`
      );
      setStoreViewMode('my_submissions');
    }
  };

  const handleQuickApprove = (productId: string) => {
    if (!isSuperAdmin) return;
    const target = products.find((p) => p.id === productId);
    const updated = products.map((p) =>
      p.id === productId
        ? {
            ...p,
            status: 'approved' as const,
            reviewedByUserId: currentUser?.id,
            reviewedAt: new Date().toISOString(),
          }
        : p
    );
    if (onUpdateProducts) onUpdateProducts(updated);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {}
    setSubmissionFeedback(`✅ 高級管理員審批完成：產品「${target?.name || ''}」已正式公開上架！`);
  };

  const handleQuickReject = (productId: string) => {
    if (!isSuperAdmin) return;
    const target = products.find((p) => p.id === productId);
    const reason = window.prompt(
      `請輸入退回產品「${target?.name || ''}」的理由：`,
      '暫不符合解夢選物店選品標準，請補充詳細規格或調整內容後再次提交'
    );
    if (reason === null) return;
    const updated = products.map((p) =>
      p.id === productId
        ? {
            ...p,
            status: 'rejected' as const,
            rejectionReason: reason || '暫不符合選品標準',
            reviewedByUserId: currentUser?.id,
            reviewedAt: new Date().toISOString(),
          }
        : p
    );
    if (onUpdateProducts) onUpdateProducts(updated);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {}
    setSubmissionFeedback(`❌ 已退回產品「${target?.name || ''}」的上架申請。`);
  };

  const handleNonStockAction = (product: ProductItem, status: ProductAvailabilityStatus) => {
    if (status === '本活動已圓滿結束') {
      alert(`【${product.name}】\n本活動已圓滿結束，感謝關注！請留意日後全新專題選物活動。`);
      return;
    }
    const emailNotice = currentUser?.email
      ? `已登記您的會員信箱：${currentUser.email}`
      : '已記錄您的登記意向';
    alert(
      `【${product.name}】\n已成功登記狀態提醒：${status}\n${emailNotice}。到貨或開放時將優先為您發送通知！`
    );
    setSubmissionFeedback(`📋 已為您登記「${product.name}」狀態通知（${status}）！`);
  };

  const handleStartCheckout = (product: ProductItem) => {
    setCheckoutProduct(product);
    setOrderSuccess(null);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutProduct) return;

    const starsAvail = currentUser?.stars ?? 0;
    const canUseStars = useStarsDiscount && checkoutProduct.starsRedeemCost && starsAvail >= checkoutProduct.starsRedeemCost;
    const finalPrice = canUseStars ? Math.max(0, checkoutProduct.priceHKD - 20) : checkoutProduct.priceHKD;

    const newOrder: PurchaseOrder = {
      id: 'ORD_' + Date.now().toString().slice(-6),
      productId: checkoutProduct.id,
      productName: checkoutProduct.name,
      quantity: 1,
      unitPrice: checkoutProduct.priceHKD,
      totalHKD: finalPrice,
      starsUsed: canUseStars ? checkoutProduct.starsRedeemCost : 0,
      customerName,
      customerPhone,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'store_pickup' ? '旺角/銅鑼灣自取點 (下單後通知)' : deliveryAddress,
      paymentMethod,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      associatedDreamSummary: currentDreamSummary,
    };

    // Save order history locally
    try {
      const savedOrders = JSON.parse(localStorage.getItem('dreamwisdom_orders') || '[]');
      localStorage.setItem('dreamwisdom_orders', JSON.stringify([newOrder, ...savedOrders]));
    } catch {
      // ignore
    }

    // Deduct user stars if stars discount was applied
    if (canUseStars && checkoutProduct.starsRedeemCost && onUpdateUserStars) {
      const remainingStars = Math.max(0, starsAvail - checkoutProduct.starsRedeemCost);
      onUpdateUserStars(remainingStars);
    }

    setOrderSuccess(newOrder);
  };

  return (
    <div className="shell py-8 space-y-8 min-h-screen" id="product-store-view">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-amber-950/30 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              🌿 夢後療癒與氣場轉化產品庫
            </span>
            <span className="text-xs text-amber-300 flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              支援星星幣抵扣
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            解夢選物店 · 身心能量調校與心靈療癒
          </h1>
          <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
            夢境是潛意識的呼喚，清醒後更是轉化能量的契機。為你精選助眠草本香氛、空間煙燻淨化、守護水晶原石與身心調校等不同類型療癒產品，配合你的夢境診斷，為生活注入好運與安寧。
          </p>

          {currentDreamSummary && (
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#aa9cff]">💭 最近解夢關聯：</span>
                <span className="truncate max-w-[280px] sm:max-w-md text-amber-200">
                  「{currentDreamSummary}」
                </span>
              </div>
              {onNavigateToWorkspace && (
                <button
                  type="button"
                  onClick={onNavigateToWorkspace}
                  className="text-[11px] text-[#78e1b5] hover:underline shrink-0"
                >
                  查看報告 →
                </button>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
          {isAdminOrSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                const newBlankProduct: ProductItem = {
                  id: 'prod_' + Date.now(),
                  name: '',
                  subTitle: '',
                  brand: 'DreamWisdom Atelier',
                  priceHKD: 128,
                  originalPriceHKD: 168,
                  starsRedeemCost: 15,
                  category: 'purify',
                  categoryLabel: '好運淨化',
                  volumeOrSpec: '100ml',
                  shelfLife: '2 年',
                  ingredients: ['天然草本提取物'],
                  keyBenefits: ['身心舒緩與淨化磁場'],
                  suitableDreams: ['噩夢', '心神不寧'],
                  matchingKeywords: ['淨化', '開運'],
                  recommendationReason: '解夢後身心調節推薦',
                  usageGuide: '睡前噴於枕頭或身心周遭',
                  cautions: ['避免入眼，置於陰涼乾燥處'],
                  imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                  inStock: true,
                  status: 'approved',
                  reviewedByUserId: currentUser?.id,
                  reviewedAt: new Date().toISOString(),
                };
                setProductToEdit(newBlankProduct);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ 管理員新增/上架產品</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenSubmitModal}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isAdminOrSuperAdmin
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold shadow-lg shadow-emerald-500/25'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ 會員申請上架產品</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOrderHistory(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/15 shadow-sm transition-all cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>我的訂單記錄 ({savedOrdersList.length})</span>
          </button>
          {currentUser && (
            <div className="text-[11px] text-[#aab3d2] text-center sm:text-left md:text-center">
              持星：<span className="text-amber-300 font-bold font-mono">{currentUser.stars ?? 0}</span> 顆星可抵扣
            </div>
          )}
        </div>
      </div>

      {/* Submission Feedback Toast / Notice */}
      {submissionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-start justify-between gap-3 text-xs shadow-lg shadow-emerald-950/30">
          <div className="flex items-start gap-2.5 text-white leading-relaxed whitespace-pre-line">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{submissionFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmissionFeedback(null)}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Senior Admin Pending Notification Banner */}
      {isSuperAdmin && pendingAdminProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-2.5 text-amber-200">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-white">👑 高級管理員審批提醒：</strong>
              <span>
                目前有 <strong className="text-amber-300 font-bold">{pendingAdminProducts.length}</strong> 件會員提交的選物產品正等待審批核准！
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setStoreViewMode('pending_admin')}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs cursor-pointer shadow-sm"
            >
              即時審批 ({pendingAdminProducts.length})
            </button>
            {onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs border border-white/20 cursor-pointer"
              >
                前往控制室 →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Store View Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStoreViewMode('public')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              storeViewMode === 'public'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🛍️ 探索公開選品 ({approvedProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                alert('請先登入會員以查看你的產品上架申請！');
                onOpenLogin();
                return;
              }
              setStoreViewMode('my_submissions');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              storeViewMode === 'my_submissions'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📋 我的上架申請 ({mySubmissions.length})</span>
            {mySubmissions.some((p) => p.status === 'pending') && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setStoreViewMode('pending_admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                storeViewMode === 'pending_admin'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>👑 高級管理員審批佇列</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono font-bold">
                {pendingAdminProducts.length}
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenSubmitModal}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>申請上架新產品（需審批）</span>
        </button>
      </div>

      {/* TAB 1: PUBLIC PRODUCTS STOREFRONT */}
      {storeViewMode === 'public' && (
        <div className="space-y-6">
          {/* 來自天體星盤之今日守護物導航頂部導引卡 */}
          {recommendedProduct && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-teal-500/10 to-indigo-500/15 border-2 border-amber-400 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-3xl p-2.5 rounded-2xl bg-white/90 border border-amber-300 shadow-xs shrink-0">🌿</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✦ 潛意識天體星盤 · 今日對應守護物 ✦
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                      星盤即時定位
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">
                    {recommendedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                    {recommendedProduct.recommendationReason || recommendedProduct.subtitle || '與今日星盤原型深度共振，淨化磁場、轉化潛意識能量。'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-center">
                <button
                  type="button"
                  onClick={() => setActiveDetailProduct(recommendedProduct)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer whitespace-nowrap hover:scale-102 transition-transform"
                >
                  查看守護物詳情
                </button>
                {onGoBackToAstrolabe && (
                  <button
                    type="button"
                    onClick={onGoBackToAstrolabe}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs shadow-2xs cursor-pointer whitespace-nowrap"
                  >
                    ← 返回星盤占卜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-300'
                  : 'bg-white/10 text-white hover:bg-white/15 border border-white/15'
              }`}
            >
              全部公開產品 ({approvedProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('purify')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                selectedCategory === 'purify'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 ring-2 ring-amber-300'
                  : 'bg-amber-950/30 text-amber-200 hover:bg-amber-950/50 border border-amber-500/30'
              }`}
            >
              🍃 暖金開運 · 碌柚葉香氛
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('sleep')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                selectedCategory === 'sleep'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-300'
                  : 'bg-purple-950/30 text-purple-200 hover:bg-purple-950/50 border border-purple-500/30'
              }`}
            >
              🌙 沉靜紫 · 薰衣草舒緩噴霧
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('incense')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                selectedCategory === 'incense'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300'
                  : 'bg-emerald-950/30 text-emerald-200 hover:bg-emerald-950/50 border border-emerald-500/30'
              }`}
            >
              🌿 翡翠綠 · 白鼠尾草煙燻杖
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('crystal')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                selectedCategory === 'crystal'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300'
                  : 'bg-cyan-950/30 text-cyan-200 hover:bg-cyan-950/50 border border-cyan-500/30'
              }`}
            >
              💎 湛青藍 · 靈性守護水晶
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('herb')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                selectedCategory === 'herb'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-300'
                  : 'bg-rose-950/30 text-rose-200 hover:bg-rose-950/50 border border-rose-500/30'
              }`}
            >
              ☕ 玫瑰紅 · 草本晚安舒緩茶
            </button>
          </div>

          {/* Status & Distinct Color Legend Bar (清晰視覺分區說明) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white/[0.04] border-2 border-white/10 text-xs shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-black text-white flex items-center gap-1.5">
                <span>🌈 專屬色系識別：</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                暖金（開運碌柚葉）
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-400/20 text-purple-300 border border-purple-400/40 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                沉靜紫（薰衣草舒緩）
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                翡翠綠（白鼠尾草）
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                冰晶藍（守護水晶）
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black">
                ● 現貨供應 {approvedProducts.filter((p) => getProductStatus(p) === '現貨供應').length} 件
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-300 border border-white/15">
                ○ 補貨預訂 {approvedProducts.filter((p) => getProductStatus(p) !== '現貨供應').length} 件
              </span>
            </div>
          </div>

          {/* Products Grid (每款產品專屬色系大字清晰呈現) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isRecommended = recommendedProductId === product.id;
              const status = getProductStatus(product);
              const isAvailable = status === '現貨供應';
              const theme = getProductTheme(product);

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className={`rounded-3xl transition-all flex flex-col justify-between overflow-hidden group ${theme.cardBorder} ${theme.cardBg} ${theme.cardHover} ${
                    isAvailable ? '' : 'opacity-90'
                  } ${
                    isRecommended ? 'ring-4 ring-amber-400 shadow-2xl scale-[1.01]' : ''
                  }`}
                >
                  {/* Product Image & Badges */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        isAvailable ? '' : 'grayscale-[15%]'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 flex-wrap z-10">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge on Image */}
                        {isAvailable ? (
                          <span className={`text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 ${theme.badgeStyle}`}>
                            <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                            現貨供應
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/80 text-amber-200 border border-amber-400/40 backdrop-blur-md shadow-md">
                            ⏳ 補貨中
                          </span>
                        )}

                        {product.badge && (
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-md">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 ml-auto">
                        {isRecommended && (
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                            解夢推薦
                          </span>
                        )}
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/75 text-white/90 backdrop-blur-md border border-white/10">
                          {product.volumeOrSpec}
                        </span>
                      </div>
                    </div>

                    {/* Scent notes pill if applicable */}
                    {product.scentNotes && (
                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <div className="text-xs text-amber-100 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/40 truncate font-bold">
                          🍊 {product.scentNotes.top.split('(')[0]}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-bold">{product.brand}</span>
                        <span className={theme.categoryLabelStyle}>{product.categoryLabel}</span>
                      </div>

                      <h3 className={`text-lg font-black transition-colors leading-snug text-white ${theme.titleHover}`}>
                        {product.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-medium">
                        {product.subTitle}
                      </p>

                      {/* Dedicated Availability Status Display Area */}
                      <div className="pt-1">
                        {isAvailable ? (
                          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs shadow-xs ${theme.availabilityPill}`}>
                            <span className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
                            <span>現貨在庫 · 即刻下單</span>
                          </div>
                        ) : (
                          <div className="p-3 rounded-2xl bg-purple-950/70 border-2 border-purple-400/50 text-purple-100 text-xs font-bold leading-relaxed shadow-sm">
                            ⏳ 目前已售罄，正安排補貨 · 點擊右下角可登記優先通知
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Why recommended for dreams (大字高對比專屬色框) */}
                    <div className={`p-4 rounded-2xl space-y-1.5 shadow-sm ${theme.effectBox}`}>
                      <span className={`text-xs font-black flex items-center gap-1.5 ${theme.effectTitle}`}>
                        <Sparkles className="w-4 h-4 shrink-0" /> 解夢對應功效：
                      </span>
                      <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${theme.effectText}`}>
                        {product.recommendationReason}
                      </p>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-4 border-t-2 border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            HK${product.priceHKD}
                          </span>
                          {product.originalPriceHKD && (
                            <span className="text-xs text-slate-400 font-bold line-through">
                              HK${product.originalPriceHKD}
                            </span>
                          )}
                        </div>
                        {product.starsRedeemCost && (
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg mt-1.5 inline-block ${theme.starBadge}`}>
                            ⭐ 可扣減 {product.starsRedeemCost} 粒星折抵 $20
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveDetailProduct(product)}
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/15 text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
                        >
                          詳情
                        </button>
                        {isAvailable ? (
                          <button
                            type="button"
                            onClick={() => handleStartCheckout(product)}
                            className={`px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all ${theme.actionBtn}`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>立即選購</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleNonStockAction(product, status)}
                            className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all ${theme.actionBtnDisabled}`}
                          >
                            <span>{getStatusButtonLabel(status)}</span>
                          </button>
                        )}
                      </div>
                    </div>

                {/* Admin, Senior Admin & Submitter Quick Edit / Delete Toolbar */}
                {canUserEditProduct(product, currentUser) && (
                  <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] bg-white/[0.03] -mx-5 -mb-5 px-5 py-2.5 rounded-b-2xl">
                    <span className="font-bold flex items-center gap-1">
                      {isSuperAdmin ? (
                        <span className="text-amber-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>👑 高級管理員</span>
                        </span>
                      ) : isAdmin ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>🛡️ 管理員</span>
                        </span>
                      ) : (
                        <span className="text-purple-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>✨ 上架會員本人</span>
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToEdit(product);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer transition-all border border-white/10 text-xs"
                        title="更改此商品的專屬狀態及詳細資料"
                      >
                        <Edit3 className="w-3 h-3 text-emerald-400" />
                        <span>更改詳情與狀態</span>
                      </button>
                      {(isAdminOrSuperAdmin || isProductSubmitter(product, currentUser)) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductToDelete(product);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center gap-1 font-medium cursor-pointer transition-all border border-red-500/20 text-xs"
                          title="刪除此商品"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>刪除</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

      {/* TAB 2: MEMBER'S OWN SUBMISSIONS & APPROVAL TRACKER */}
      {storeViewMode === 'my_submissions' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-purple-500/20 text-purple-300 border-purple-500/40">
                  <FileText className="w-3 h-3 text-purple-400" />
                  MEMBER SUBMISSION STATUS
                </span>
                <span className="text-xs text-[#cbd2ef]">
                  登入帳號：<strong className="text-white">{currentUser?.display_name || currentUser?.email}</strong>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">
                我的產品上架申請進度 ({mySubmissions.length})
              </h2>
              <p className="text-xs text-[#aab3d2] mt-1">
                解夢選物店落實品質保證：所有會員申請之選品均需經由高級管理員審批通過後，才會正式公開於選物店展示。
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenSubmitModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>申請上架新產品</span>
            </button>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <PackageCheck className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
              <h3 className="text-base font-bold text-white">你目前尚未提交任何選物產品上架申請</h3>
              <p className="text-xs text-[#8d97b5] max-w-md mx-auto leading-relaxed">
                你有自製安眠枕頭香氛、天然手工皂、空間聖木草杖、靜心水晶或草本舒緩茶嗎？歡迎提交給解夢選物店，經高級管理員審批後即可公開展示！
              </p>
              <button
                type="button"
                onClick={handleOpenSubmitModal}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>立即提交第一件產品上架申請</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mySubmissions.map((p) => {
                const isPending = p.status === 'pending';
                const isApproved = !p.status || p.status === 'approved';
                const isRejected = p.status === 'rejected';

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                      isPending
                        ? 'bg-amber-950/15 border-amber-500/40 shadow-lg shadow-amber-950/20'
                        : isApproved
                        ? 'bg-emerald-950/15 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                        : 'bg-red-950/15 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 rounded-2xl object-cover bg-black/40 shrink-0 border border-white/10"
                      />

                      <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Status Tag */}
                        <div className="flex items-center justify-between gap-2">
                          {isPending && (
                            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 animate-spin" />
                              <span>⏳ 待高級管理員審批中</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>✅ 已核准公開上架</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-bold flex items-center gap-1.5">
                              <X className="w-3.5 h-3.5" />
                              <span>❌ 上架申請已退回</span>
                            </span>
                          )}

                          <span className="text-sm font-black text-white font-mono">
                            HK${p.priceHKD}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                        <p className="text-xs text-[#aab3d2] line-clamp-1">{p.subTitle}</p>

                        <div className="text-[11px] text-[#8d97b5]">
                          分類：{p.categoryLabel} · 規格：{p.volumeOrSpec}
                        </div>

                        <div className="text-[10px] text-[#8d97b5]">
                          申請時間：{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('zh-HK') : '近期'}
                        </div>
                      </div>
                    </div>

                    {/* Explanatory status card */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                      {isPending && (
                        <p className="text-amber-200/90 text-[11px] leading-relaxed">
                          🛡️ 產品審核中：已送交進駐佇列，等待高級管理員 (Super Admin) 審閱身心調校規格。審核通過後，該產品將自動公開於選物店展示。
                        </p>
                      )}
                      {isApproved && (
                        <div className="flex items-center justify-between text-[11px] text-emerald-300">
                          <span>🎉 恭喜！產品已通過高級管理員審批，正式在選物店公開展示。</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('all');
                              setStoreViewMode('public');
                              setActiveDetailProduct(p);
                            }}
                            className="text-white hover:underline shrink-0 font-medium ml-2 cursor-pointer"
                          >
                            前往商品頁 →
                          </button>
                        </div>
                      )}
                      {isRejected && (
                        <div className="space-y-1">
                          <p className="text-red-300 text-[11px]">
                            ⚠️ 審批退回原因：{p.rejectionReason || '暫不符合選品標準'}
                          </p>
                          <p className="text-[10px] text-[#aab3d2]">
                            提示：你可以點擊右上方「申請上架新產品」補充成分或調整說明後重新送出。
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Admin or Submitter Action Controls */}
                    {canUserEditProduct(p, currentUser) && (
                      <div className="pt-2.5 flex items-center justify-between border-t border-white/10 text-xs">
                        <span className="text-[11px] text-[#8d97b5]">
                          {isAdminOrSuperAdmin
                            ? '管理員具備隨時更改或移除此產品之權限'
                            : '身為申請上架會員，您有資格隨時更改專屬狀態與產品詳情'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProductToEdit(p)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 text-xs flex items-center gap-1 cursor-pointer border border-white/10 transition-all"
                            title="更改專屬狀態及產品詳情"
                          >
                            <Edit3 className="w-3 h-3 text-emerald-400" />
                            <span>更改狀態與詳情</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs flex items-center gap-1 cursor-pointer border border-red-500/20 transition-all"
                            title="刪除此商品"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{isAdminOrSuperAdmin ? '刪除' : '撤回 / 刪除'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SENIOR ADMIN REVIEW QUEUE (SUPER ADMIN ONLY) */}
      {storeViewMode === 'pending_admin' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-amber-500/20 text-amber-300 border-amber-500/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  SUPER ADMIN APPROVAL QUEUE
                </span>
                <span className="text-xs text-amber-200 font-bold">
                  👑 高級管理員專屬權限
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">
                會員提交產品審批佇列 ({pendingAdminProducts.length})
              </h2>
              <p className="text-xs text-[#aab3d2] mt-1">
                會員登入後提交的選物產品在此匯集。審批通過後，產品將立即向全體客人公開展示；高級管理員亦可隨時修改產品規格或直接刪除。
              </p>
            </div>

            {onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs border border-white/20 cursor-pointer self-start sm:self-auto shrink-0 transition-all"
              >
                前往完整 Admin 控制室 →
              </button>
            )}
          </div>

          {pendingAdminProducts.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">目前無等待審批之產品！</h3>
              <p className="text-xs text-[#8d97b5] max-w-sm mx-auto">
                所有會員申請項目皆已完成審批處理。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingAdminProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-amber-950/15 border-2 border-amber-500/50 flex flex-col justify-between gap-4 shadow-xl shadow-amber-950/30"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-28 h-28 rounded-2xl object-cover bg-black/40 shrink-0 border border-white/10"
                    />

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {p.categoryLabel}
                        </span>
                        <span className="text-base font-black text-white font-mono">
                          HK${p.priceHKD}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-xs text-[#cbd2ef] line-clamp-2">{p.subTitle}</p>

                      <div className="text-[11px] text-[#aab3d2]">
                        品牌：{p.brand} · 規格：{p.volumeOrSpec}
                      </div>

                      <div className="text-[10px] text-amber-200 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                        👤 提交會員：<strong className="text-white">{p.submittedByUserName}</strong>
                        {p.submittedByUserEmail ? ` (${p.submittedByUserEmail})` : ''} ·{' '}
                        {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('zh-HK') : '近期'}
                      </div>
                    </div>
                  </div>

                  {/* Product Details for Approval Verification */}
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                    <div>
                      <span className="text-[#8d97b5] block text-[10px]">成分 / 原料：</span>
                      <span className="text-white text-[11px]">
                        {p.ingredients?.join('、') || '天然草本'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8d97b5] block text-[10px]">核心功效：</span>
                      <span className="text-emerald-300 text-[11px]">
                        {p.keyBenefits?.join(' · ') || '舒緩放鬆'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8d97b5] block text-[10px]">推薦理由 / 創作心意：</span>
                      <span className="text-[#cbd2ef] text-[11px]">
                        {p.recommendationReason || '無'}
                      </span>
                    </div>
                  </div>

                  {/* Action Controls for Senior Admin */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-500/20">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProductToEdit(p)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer border border-white/10"
                        title="更改產品規格"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>更改</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(p)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-red-500/30"
                        title="刪除此商品"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>刪除</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickReject(p.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>退回</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickApprove(p.id)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>核准上架</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {activeDetailProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveDetailProduct(null);
          }}
        >
          <div
            className="w-full max-w-2xl bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-8 space-y-5 my-8 relative cursor-default shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Highly visible top-right close button */}
            <button
              type="button"
              onClick={() => setActiveDetailProduct(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-all z-30 cursor-pointer shadow-sm border border-slate-300"
              aria-label="關閉"
              title="關閉返回選物店 (ESC)"
            >
              <X className="w-4 h-4 text-emerald-600" />
              <span>關閉</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={activeDetailProduct.imageUrl}
                  alt={activeDetailProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:w-1/2 space-y-3">
                <span className="badge bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[10px] shadow-xs">
                  {activeDetailProduct.categoryLabel}
                </span>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {activeDetailProduct.name}
                </h2>
                <div className="text-xs text-emerald-700 font-medium">
                  {activeDetailProduct.subTitle}
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-black text-slate-900">
                    HK${activeDetailProduct.priceHKD}
                  </span>
                  {activeDetailProduct.originalPriceHKD && (
                    <span className="text-sm text-slate-400 line-through">
                      HK${activeDetailProduct.originalPriceHKD}
                    </span>
                  )}
                  <span className="text-xs text-amber-800 font-mono font-bold">
                    (規格: {activeDetailProduct.volumeOrSpec})
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-slate-200">
                  <div><b>品牌：</b><span className="text-slate-800">{activeDetailProduct.brand}</span></div>
                  <div><b>保質期：</b><span className="text-slate-800">{activeDetailProduct.shelfLife}</span></div>
                </div>

                {/* Dedicated Availability Status in Modal */}
                {(() => {
                  const modalStatus = getProductStatus(activeDetailProduct);
                  const isModalAvailable = modalStatus === '現貨供應';

                  return (
                    <div className="space-y-3 pt-1">
                      <div>
                        {isModalAvailable ? (
                          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span>【現貨供應】確認訂單後 24 小時內安排順豐速運寄出</span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1" />
                            <span className="leading-relaxed">【狀態標示】{modalStatus}</span>
                          </div>
                        )}
                      </div>

                      {isModalAvailable ? (
                        <button
                          type="button"
                          onClick={() => {
                            const prod = activeDetailProduct;
                            setActiveDetailProduct(null);
                            handleStartCheckout(prod);
                          }}
                          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          以 HK${activeDetailProduct.priceHKD} 選購
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const prod = activeDetailProduct;
                            setActiveDetailProduct(null);
                            handleNonStockAction(prod, modalStatus);
                          }}
                          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm flex items-center justify-center gap-2 border border-slate-300 transition-all cursor-pointer"
                        >
                          <span>{getStatusButtonLabel(modalStatus)}</span>
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* Admin, Senior Admin & Submitter Management Controls */}
                {canUserEditProduct(activeDetailProduct, currentUser) && (
                  <div className="pt-2 mt-1 border-t border-slate-200 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const prod = activeDetailProduct;
                        setProductToEdit(prod);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>更改專屬狀態及產品詳情</span>
                    </button>
                    {(isAdminOrSuperAdmin || isProductSubmitter(activeDetailProduct, currentUser)) && (
                      <button
                        type="button"
                        onClick={() => {
                          const prod = activeDetailProduct;
                          setProductToDelete(prod);
                        }}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>刪除商品</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scent notes & Key benefits */}
            {activeDetailProduct.scentNotes && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  🌿 天然植萃香氛金字塔調配
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60 shadow-xs">
                    <span className="text-[10px] text-amber-800 block font-mono font-bold">TOP 前調</span>
                    <span className="text-slate-800 font-medium">{activeDetailProduct.scentNotes.top}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60 shadow-xs">
                    <span className="text-[10px] text-amber-800 block font-mono font-bold">HEART 中調</span>
                    <span className="text-slate-800 font-medium">{activeDetailProduct.scentNotes.middle}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60 shadow-xs">
                    <span className="text-[10px] text-amber-800 block font-mono font-bold">BASE 後調</span>
                    <span className="text-slate-800 font-medium">{activeDetailProduct.scentNotes.base}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits & Medical / Folk Background */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                ✨ 功效與成份認證
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeDetailProduct.keyBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suitable Dreams */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                💭 特別適合以下夢境體驗：
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeDetailProduct.suitableDreams.map((sd, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-medium"
                  >
                    • {sd}
                  </span>
                ))}
              </div>
            </div>

            {/* Usage guide and Cautions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div>
                <b className="text-slate-900">使用指南：</b>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{activeDetailProduct.usageGuide}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <b className="text-amber-800">注意事項：</b>
                <div className="text-[11px] text-slate-600 space-y-0.5 mt-0.5">
                  {activeDetailProduct.cautions.map((c, i) => (
                    <div key={i}>{c}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveDetailProduct(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-300"
              >
                <X className="w-4 h-4 text-emerald-600" />
                <span>返回選物店</span>
              </button>

              <div className="text-[11px] text-slate-600">
                按鍵盤 <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] border border-slate-300">ESC</kbd> 或點擊空白處亦可退出
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {/* Checkout Modal */}
      {checkoutProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCheckoutProduct(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-8 space-y-5 my-8 relative cursor-default shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setCheckoutProduct(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-all z-30 cursor-pointer shadow-sm border border-slate-300"
              aria-label="關閉"
              title="關閉 (ESC)"
            >
              <X className="w-4 h-4 text-emerald-600" />
              <span>關閉</span>
            </button>

            {!orderSuccess ? (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div>
                  <span className="badge bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold shadow-xs">
                    FAST CHECKOUT · 香港直送 / 順豐自取
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">選購確認</h3>
                </div>

                {/* Selected Item Recap */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img
                    src={checkoutProduct.imageUrl}
                    alt={checkoutProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {checkoutProduct.name}
                    </h4>
                    <div className="text-[11px] text-slate-600">
                      規格：{checkoutProduct.volumeOrSpec}
                    </div>
                    <div className="text-sm font-black text-emerald-700 mt-0.5">
                      HK${checkoutProduct.priceHKD}
                    </div>
                  </div>
                </div>

                {/* Stars Discount Option */}
                {checkoutProduct.starsRedeemCost && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs flex items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-0.5">
                      <span className="text-amber-900 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        使用星星幣折抵 $20
                      </span>
                      <span className="text-[11px] text-slate-700 block">
                        目前持有: {currentUser?.stars ?? 0} 顆 (需 {checkoutProduct.starsRedeemCost} 顆)
                      </span>
                    </div>

                    {(currentUser?.stars ?? 0) >= checkoutProduct.starsRedeemCost ? (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800 font-bold">
                        <input
                          type="checkbox"
                          checked={useStarsDiscount}
                          onChange={(e) => setUseStarsDiscount(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>使用折抵</span>
                      </label>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenEarnStars}
                        className="text-[11px] text-amber-800 underline font-bold cursor-pointer"
                      >
                        睇片賺星 →
                      </button>
                    )}
                  </div>
                )}

                {/* Recipient Details */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-800 font-bold block mb-1">收件人姓名 *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="例如：Chan Tai Man"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-800 font-bold block mb-1">香港聯絡電話 (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="例如：91234567"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-800 font-bold block mb-1">取件方式</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('sf_express')}
                        className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                          deliveryMethod === 'sf_express'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        📦 順豐速運 / 智能櫃
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('store_pickup')}
                        className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                          deliveryMethod === 'store_pickup'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        🏪 旺角 / 銅鑼灣自取
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'sf_express' && (
                    <div>
                      <label className="text-xs text-slate-800 font-bold block mb-1">順豐點碼 / 工商住宅地址 *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="例如：順豐智能櫃 H852XXXX / 九龍旺角彌敦道..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-slate-800 font-bold block mb-1">支付方式</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('fps')}
                        className={`p-2 rounded-xl border text-[11px] text-center cursor-pointer ${
                          paymentMethod === 'fps'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        轉數快 FPS
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('payme')}
                        className={`p-2 rounded-xl border text-[11px] text-center cursor-pointer ${
                          paymentMethod === 'payme'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        PayMe
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-2 rounded-xl border text-[11px] text-center cursor-pointer ${
                          paymentMethod === 'credit_card'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        信用卡 (Stripe)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Final Total */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-700 font-medium">
                    應付總額 (免香港本地運費)：
                  </div>
                  <div className="text-xl font-black text-emerald-700">
                    HK${useStarsDiscount ? Math.max(0, checkoutProduct.priceHKD - 20) : checkoutProduct.priceHKD}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setCheckoutProduct(null)}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer border border-slate-300 active:scale-95"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    確認送出訂單
                  </button>
                </div>
              </form>
            ) : (
              /* Order Success Screen */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-black">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">訂單已成功建立！</h3>
                  <p className="text-xs text-emerald-800 font-mono font-bold">
                    訂單編號：{orderSuccess.id}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">選購產品：</span>
                    <span className="text-slate-900 font-bold">{orderSuccess.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">收件人：</span>
                    <span className="text-slate-800">{orderSuccess.customerName} ({orderSuccess.customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">取件方式：</span>
                    <span className="text-slate-800">{orderSuccess.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-700 font-bold">應付金額：</span>
                    <span className="text-emerald-700 font-black text-sm">HK${orderSuccess.totalHKD}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-left text-[11px] text-slate-800 space-y-1 shadow-xs">
                  <span className="text-amber-900 font-bold block">📲 付款及出貨說明：</span>
                  <p>
                    我們已將訂單確認通知發送至你的聯絡號碼。透過 FPS 或 PayMe 付款後，訂單將於 24 小時內安排順豐出貨。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutProduct(null)}
                  className="btn w-full text-xs py-2.5"
                >
                  返回產品庫
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOrderHistory(false);
          }}
        >
          <div
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowOrderHistory(false)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border border-slate-300 z-30"
              aria-label="關閉"
              title="關閉 (ESC)"
            >
              <X className="w-4 h-4 text-emerald-600" />
              <span>關閉</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center">
                <PackageCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">我的解夢選物訂單記錄</h3>
                <p className="text-xs text-slate-600">
                  你所購買的身心轉運與療癒商品訂單狀態
                </p>
              </div>
            </div>

            {savedOrdersList.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
                <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto opacity-70" />
                <p className="text-xs text-slate-700 font-bold">目前暫無任何選物訂單記錄</p>
                <p className="text-[11px] text-slate-500">
                  完成解夢後，可於選物店瀏覽各類身心調校、助眠草本與能量淨化產品。
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedOrdersList.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 space-y-2.5 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-800">
                          {order.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                          處理中 (已建檔)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{order.productName}</h4>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          收件人：{order.customerName} · {order.customerPhone}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5 truncate max-w-sm">
                          地址/取件：{order.deliveryAddress}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-emerald-700 font-mono">
                          HK${order.totalHKD}
                        </div>
                        {order.starsUsed && order.starsUsed > 0 ? (
                          <div className="text-[10px] text-amber-800 font-bold flex items-center justify-end gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            已抵扣 {order.starsUsed} 星
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {order.associatedDreamSummary && (
                      <div className="text-[10px] text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-300">
                        關聯夢境：{order.associatedDreamSummary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOrderHistory(false)}
                className="btn text-xs py-2 px-4"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Product Submission Modal */}
      {currentUser && (
        <MemberProductSubmitModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          currentUser={currentUser}
          onSuccessSubmit={handleSuccessSubmitProduct}
        />
      )}

      {/* Edit Product Modal for Admin, Senior Admin & Submitter Member */}
      {productToEdit && (
        <EditProductModal
          isOpen={!!productToEdit}
          onClose={() => setProductToEdit(null)}
          product={productToEdit}
          onSaveProduct={handleSaveEditedProduct}
          onDeleteProduct={(id) => {
            const prod = products.find((p) => p.id === id);
            if (prod) {
              setProductToDelete(prod);
            }
          }}
          isSuperAdmin={isSuperAdmin}
          isAdmin={isAdmin}
          currentUser={currentUser}
        />
      )}

      {/* In-App Confirmation Modal for Safe Product Deletion */}
      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        product={productToDelete}
        onConfirm={handleConfirmDeleteProduct}
      />
    </div>
  );
};
