import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { ProductItem, ProductStatus, ProductAvailabilityStatus, User, normalizeRole } from '../types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onSaveProduct: (updated: ProductItem) => void;
  onDeleteProduct?: (productId: string) => void;
  isSuperAdmin: boolean;
  isAdmin?: boolean;
  currentUser?: User | null;
}

const PRESET_IMAGES = [
  {
    name: '淨化開運草本',
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '深眠安神枕頭噴霧',
    url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '草本舒緩晚安茶',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '秘魯聖木與白鼠尾草',
    url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '守護紫水晶能量原石',
    url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '身心調校精油瓶',
    url: 'https://images.unsplash.com/photo-1508759073847-9ca702cec7d2?auto=format&fit=crop&w=800&q=80',
  },
];

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveProduct,
  onDeleteProduct,
  isSuperAdmin,
  isAdmin,
  currentUser,
}) => {
  const [formData, setFormData] = useState<Partial<ProductItem>>({});
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [suitableDreamsInput, setSuitableDreamsInput] = useState('');

  const normRole = normalizeRole(currentUser?.role);
  const actualIsSuperAdmin = isSuperAdmin || normRole === 'super_admin';
  const actualIsAdmin = Boolean(isAdmin || normRole === 'admin');
  const isAdminOrSuperAdmin = actualIsSuperAdmin || actualIsAdmin;

  const isSubmitter = Boolean(
    currentUser &&
      product &&
      ((product.submittedByUserId && product.submittedByUserId === currentUser.id) ||
        (product.submittedByUserEmail &&
          currentUser.email &&
          product.submittedByUserEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase()))
  );

  const hasEditPermission = isAdminOrSuperAdmin || isSubmitter;

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setIngredientsInput(product.ingredients ? product.ingredients.join('、') : '');
      setBenefitsInput(product.keyBenefits ? product.keyBenefits.join('、') : '');
      setSuitableDreamsInput(product.suitableDreams ? product.suitableDreams.join('、') : '');
    } else {
      setFormData({});
      setIngredientsInput('');
      setBenefitsInput('');
      setSuitableDreamsInput('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  if (!hasEditPermission) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="w-full max-w-md bg-[#0f1422] border border-red-500/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl relative text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">權限不足</h3>
          <p className="text-xs text-[#cbd2ef] leading-relaxed">
            只有<b>平台管理員</b>、<b>高級管理員</b>，或<b>申請此商品上架的會員本人</b>有資格更改專屬狀態及產品詳情。
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
          >
            返回選物店
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.priceHKD) {
      alert('請填寫完整的產品名稱與定價！');
      return;
    }

    const parseList = (str: string, fallback: string[]) => {
      const arr = str
        .split(/[、,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      return arr.length > 0 ? arr : fallback;
    };

    const categoryLabels: Record<string, string> = {
      purify: '好運淨化',
      sleep: '深眠安神',
      herb: '草本調校',
      incense: '空間結界',
      crystal: '能量水晶',
    };

    const chosenCategory = (formData.category || 'purify') as ProductItem['category'];

    const updatedProduct: ProductItem = {
      ...product,
      name: formData.name.trim(),
      subTitle: formData.subTitle?.trim() || product.subTitle,
      brand: formData.brand?.trim() || product.brand || 'DreamWisdom',
      priceHKD: Number(formData.priceHKD) || product.priceHKD,
      originalPriceHKD: formData.originalPriceHKD ? Number(formData.originalPriceHKD) : undefined,
      starsRedeemCost: formData.starsRedeemCost ? Number(formData.starsRedeemCost) : 15,
      category: chosenCategory,
      categoryLabel: categoryLabels[chosenCategory] || '解夢選物',
      volumeOrSpec: formData.volumeOrSpec?.trim() || product.volumeOrSpec || '標準裝',
      shelfLife: formData.shelfLife?.trim() || product.shelfLife || '2 年',
      imageUrl: formData.imageUrl?.trim() || product.imageUrl,
      badge: formData.badge?.trim() || undefined,
      availabilityStatus: (formData.availabilityStatus || (formData.inStock === false ? '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。' : '現貨供應')) as ProductAvailabilityStatus,
      inStock: formData.availabilityStatus ? formData.availabilityStatus === '現貨供應' : (formData.inStock ?? true),
      status: (isAdminOrSuperAdmin ? (formData.status || 'approved') : (product.status || 'approved')) as ProductStatus,
      ingredients: parseList(ingredientsInput, product.ingredients || ['天然草本提取物']),
      keyBenefits: parseList(benefitsInput, product.keyBenefits || ['身心舒緩放鬆']),
      suitableDreams: parseList(suitableDreamsInput, product.suitableDreams || ['噩夢', '心神不寧']),
      recommendationReason: formData.recommendationReason?.trim() || product.recommendationReason || '解夢後身心調節推薦',
      usageGuide: formData.usageGuide?.trim() || product.usageGuide || '適量使用於空間或個人靜心處',
    };

    onSaveProduct(updatedProduct);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="edit-product-modal-backdrop"
    >
      <div
        className="w-full max-w-3xl bg-[#0f1422] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 my-8 shadow-2xl relative"
        id="edit-product-modal-dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {actualIsSuperAdmin ? (
                <span className="badge bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  👑 高級管理員（Super Admin）修改資格
                </span>
              ) : actualIsAdmin ? (
                <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  🛡️ 平台管理員（Admin）修改資格
                </span>
              ) : (
                <span className="badge bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  ✨ 申請上架會員（原創作者）修改資格
                </span>
              )}
              <span className="text-xs text-[#aab3d2]">
                產品編號：<strong className="text-white font-mono">{product.id}</strong>
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
              <span>編輯專屬狀態及產品詳情</span>
            </h2>
            <p className="text-xs text-[#aab3d2] mt-0.5">
              只有管理員、高級管理員及申請上架的會員本人有資格更改專屬狀態及產品詳情。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                產品名稱 <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：普羅旺斯高地薰衣草 · 深眠安神枕頭噴霧"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                副標題 / 宣傳特色
              </label>
              <input
                type="text"
                value={formData.subTitle || ''}
                onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：緩解多夢易醒與驚懼，營造靜心能量結界"
              />
            </div>
          </div>

          {/* Row 2: Category, Brand & Spec */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                產品分類 <span className="text-emerald-400">*</span>
              </label>
              <select
                value={formData.category || 'purify'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ProductItem['category'],
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#141a2c] border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
              >
                <option value="purify">🍃 淨化開運 · 氣場轉化</option>
                <option value="sleep">🌙 深眠安神 · 枕頭噴霧</option>
                <option value="herb">☕ 草本調校 · 晚安舒緩茶</option>
                <option value="incense">🌿 空間結界 · 煙燻淨化</option>
                <option value="crystal">💎 靈性直覺 · 守護水晶</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                品牌或手作品牌
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：DreamWisdom Atelier"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                容量或規格
              </label>
              <input
                type="text"
                value={formData.volumeOrSpec || ''}
                onChange={(e) => setFormData({ ...formData, volumeOrSpec: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：100ml / 盒裝 15 入 / 80g 原木"
              />
            </div>
          </div>

          {/* Row 3: Pricing & Stars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                售價 (HKD) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#8d97b5] font-mono">HK$</span>
                <input
                  type="number"
                  min="1"
                  value={formData.priceHKD || ''}
                  onChange={(e) => setFormData({ ...formData, priceHKD: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono font-bold focus:border-emerald-400 focus:outline-none"
                  placeholder="128"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                原價標籤 (HKD，可留空)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#8d97b5] font-mono">HK$</span>
                <input
                  type="number"
                  min="1"
                  value={formData.originalPriceHKD || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPriceHKD: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                  placeholder="168"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                折抵星幣數 (Stars)
              </label>
              <input
                type="number"
                min="0"
                value={formData.starsRedeemCost ?? 15}
                onChange={(e) =>
                  setFormData({ ...formData, starsRedeemCost: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-amber-300 text-xs font-mono focus:border-emerald-400 focus:outline-none"
                placeholder="15"
              />
            </div>
          </div>

          {/* Row 4: Status & Stock */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-white">
                  產品上架審批狀態 (Product Status)
                </label>
                <p className="text-[11px] text-[#8d97b5]">
                  {isAdminOrSuperAdmin
                    ? '管理員及高級管理員具備隨時調整此商品公開展示、待審批或退回之權限。'
                    : '審批由管理員維護；身為申請上架會員，您具備隨時更改下方專屬供應狀態及所有產品詳情之資格。'}
                </p>
              </div>

              {isAdminOrSuperAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'approved' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      formData.status === 'approved' || !formData.status
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                        : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    ✅ 公開上架 (approved)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'pending' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      formData.status === 'pending'
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                        : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    ⏳ 待審批 (pending)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'rejected' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      formData.status === 'rejected'
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                        : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    ❌ 已退回 (rejected)
                  </button>
                </div>
              ) : (
                <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#cbd2ef] flex items-center gap-1.5">
                  <span>目前平台審批：</span>
                  <span className="font-bold text-emerald-400">
                    {formData.status === 'pending' ? '⏳ 待管理員審批' : formData.status === 'rejected' ? '❌ 已退回' : '✅ 已核准公開'}
                  </span>
                </div>
              )}
            </div>

            {/* Availability / Activity Status */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <label className="block text-xs font-bold text-[#cbd2ef]">
                供應與活動狀態 (Status) · 管理員 / 高級管理員 / 上架會員皆可更改
              </label>
              <select
                value={
                  formData.availabilityStatus ||
                  (formData.inStock === false
                    ? '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。'
                    : '現貨供應')
                }
                onChange={(e) => {
                  const val = e.target.value as ProductAvailabilityStatus;
                  setFormData({
                    ...formData,
                    availabilityStatus: val,
                    inStock: val === '現貨供應',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b2d] border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
              >
                <option value="現貨供應">🟢 現貨供應 (全彩亮色 · 正常下單)</option>
                <option value="目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。">
                  ⚪ 目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。 (淺色識別)
                </option>
                <option value="本活動已圓滿結束">⚪ 本活動已圓滿結束 (淺色識別)</option>
                <option value="等待活動開始">⚪ 等待活動開始 (淺色識別)</option>
                <option value="候補中">⚪ 候補中 (淺色識別)</option>
              </select>
              <p className="text-[11px] text-[#8d97b5]">
                依據規則：除了「現貨供應」呈現鮮明亮色外，其餘狀態均自動轉為淺色識別。
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <div className="text-xs text-[#8d97b5]">
                目前狀態識別：
                {(formData.availabilityStatus || (formData.inStock === false ? '目前已售罄' : '現貨供應')) === '現貨供應' ? (
                  <span className="text-emerald-400 font-bold ml-1">● 現貨供應 (正常色彩)</span>
                ) : (
                  <span className="text-white/60 ml-1">○ 非現貨 (自動轉淺色)</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#8d97b5] text-[11px]">促銷標籤：</span>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-white text-xs w-28 focus:border-emerald-400 focus:outline-none"
                  placeholder="如：熱賣推薦"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Image Selection & URL */}
          <div>
            <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
              產品圖片網址 (Image URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="https://..."
                required
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="預覽"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-[#8d97b5]">快捷套用預設圖：</span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-[#cbd2ef] border border-white/10 cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 6: Ingredients & Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                成分 / 原料（頓號或逗號分隔）
              </label>
              <input
                type="text"
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：天然大馬士革玫瑰、高地薰衣草精油"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                核心身心功效（頓號或逗號分隔）
              </label>
              <input
                type="text"
                value={benefitsInput}
                onChange={(e) => setBenefitsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：安神助眠、消除焦慮夢境、淨化磁場"
              />
            </div>
          </div>

          {/* Row 7: Suitable Dreams & Recommendation Reason */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                對應夢境類型（例如：噩夢追逐、墜落焦慮、心神不寧）
              </label>
              <input
                type="text"
                value={suitableDreamsInput}
                onChange={(e) => setSuitableDreamsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：噩夢驚醒、考試落空、追逐焦慮"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                解夢調校推薦理由 / 創作心意
              </label>
              <textarea
                rows={2}
                value={formData.recommendationReason || ''}
                onChange={(e) => setFormData({ ...formData, recommendationReason: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none resize-none leading-relaxed"
                placeholder="說明為何此產品能幫助夢者改善睡眠或轉化潛意識能量..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd2ef] mb-1.5">
                使用方式指南
              </label>
              <input
                type="text"
                value={formData.usageGuide || ''}
                onChange={(e) => setFormData({ ...formData, usageGuide: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                placeholder="例如：睡前 15 分鐘輕噴 2-3 下於枕頭兩側"
              />
            </div>
          </div>

          {/* Actions: Save & Delete */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {(isAdminOrSuperAdmin || isSubmitter) && onDeleteProduct ? (
              <button
                type="button"
                onClick={() => {
                  if (product.id) {
                    onDeleteProduct(product.id);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAdminOrSuperAdmin ? '刪除此產品' : '撤回 / 刪除此產品'}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs cursor-pointer font-medium"
              >
                取消
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>儲存專屬狀態與產品詳情</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
