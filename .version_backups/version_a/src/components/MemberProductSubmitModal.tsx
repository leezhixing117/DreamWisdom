import React, { useState } from 'react';
import { ProductItem, User, normalizeRole } from '../types';
import { X, Sparkles, Package, ShieldCheck, Check, Info, Image, Upload } from 'lucide-react';

interface MemberProductSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSuccessSubmit: (newProduct: ProductItem) => void;
}

const PRESET_IMAGES = [
  {
    label: '薰衣草深眠噴霧',
    category: 'sleep' as const,
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '秘魯野生聖木條',
    category: 'incense' as const,
    url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '白鼠尾草煙燻草杖',
    category: 'incense' as const,
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '烏拉圭紫水晶原礦',
    category: 'crystal' as const,
    url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '洋甘菊纈草舒緩茶',
    category: 'herb' as const,
    url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '草本大吉開運香氛',
    category: 'purify' as const,
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  },
];

export const MemberProductSubmitModal: React.FC<MemberProductSubmitModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccessSubmit,
}) => {
  const isSuperAdmin = normalizeRole(currentUser.role) === 'super_admin';

  const [name, setName] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [brand, setBrand] = useState(currentUser.display_name || '手作身心選物坊');
  const [category, setCategory] = useState<'purify' | 'sleep' | 'herb' | 'incense' | 'crystal'>('sleep');
  const [priceHKD, setPriceHKD] = useState('78');
  const [originalPriceHKD, setOriginalPriceHKD] = useState('98');
  const [starsRedeemCost, setStarsRedeemCost] = useState('15');
  const [volumeOrSpec, setVolumeOrSpec] = useState('100ML');
  const [shelfLife, setShelfLife] = useState('2 年');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [ingredients, setIngredients] = useState('天然植物萃取精油、蒸餾水、純淨能量泉');
  const [keyBenefits, setKeyBenefits] = useState('睡前安撫神經、重整夢境能量、撫平焦慮緊繃');
  const [suitableDreams, setSuitableDreams] = useState('噩夢驚醒、心神不寧、被追趕焦慮、多夢淺眠');
  const [recommendationReason, setRecommendationReason] = useState('夢後若感心神不寧或身心緊繃，適量使用能溫和轉化低頻雜思，找回內在平靜。');
  const [usageGuide, setUsageGuide] = useState('睡前或靜心時適量噴灑於枕畔或周圍空氣中。');
  const [cautions, setCautions] = useState('外用避開眼部，請置於陰涼乾燥處。');
  const [autoApproveAsSuperAdmin, setAutoApproveAsSuperAdmin] = useState(isSuperAdmin);

  if (!isOpen) return null;

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'purify':
        return '淨化開運 · 氣場轉化';
      case 'sleep':
        return '深眠安神 · 枕頭噴霧';
      case 'herb':
        return '草本調校 · 晚安舒緩茶';
      case 'incense':
        return '空間結界 · 煙燻淨化';
      case 'crystal':
        return '靈性直覺 · 守護水晶';
      default:
        return '身心調校選物';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !priceHKD) return;

    const willApproveImmediately = isSuperAdmin && autoApproveAsSuperAdmin;

    const newProduct: ProductItem = {
      id: 'prod_mem_' + Date.now(),
      name: name.trim(),
      subTitle: subTitle.trim() || '身心調校 · 夢境療癒選品',
      brand: brand.trim() || '獨立手作工坊',
      priceHKD: Number(priceHKD) || 60,
      originalPriceHKD: originalPriceHKD ? Number(originalPriceHKD) : undefined,
      starsRedeemCost: Number(starsRedeemCost) || 15,
      category,
      categoryLabel: getCategoryLabel(category),
      volumeOrSpec: volumeOrSpec.trim() || '標準裝',
      shelfLife: shelfLife.trim() || '2 年',
      ingredients: ingredients
        .split(/[,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      keyBenefits: keyBenefits
        .split(/[,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      suitableDreams: suitableDreams
        .split(/[,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      matchingKeywords: ['夢', '醒', '神', '安', '淨', '氣'],
      recommendationReason:
        recommendationReason.trim() || '解夢後能量調節推薦，撫平夜間不安氣場。',
      usageGuide: usageGuide.trim() || '睡前或靜心時使用。',
      cautions: cautions ? [cautions.trim()] : ['置於陰涼乾燥處保存。'],
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      badge: '✨ 會員手作',
      inStock: true,
      availabilityStatus: '現貨供應',
      status: willApproveImmediately ? 'approved' : 'pending',
      submittedByUserId: currentUser.id,
      submittedByUserName: currentUser.display_name || currentUser.email.split('@')[0],
      submittedByUserEmail: currentUser.email,
      submittedAt: new Date().toISOString(),
      ...(willApproveImmediately
        ? {
            reviewedByUserId: currentUser.id,
            reviewedAt: new Date().toISOString(),
          }
        : {}),
    };

    onSuccessSubmit(newProduct);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      id="member-product-submit-modal"
    >
      <div className="relative w-full max-w-2xl bg-[#0f111a] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                MEMBER CURATION SUBMISSION
              </span>
              <span className="text-[11px] text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                🛡️ 需高級管理員審批後公開
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <span>會員選物產品上架申請</span>
            </h2>
            <p className="text-xs text-[#aab3d2] mt-1">
              申請人：<span className="text-white font-medium">{currentUser.display_name || currentUser.email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Senior Admin Approval Policy Explanatory Notice */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>解夢選物店 · 高級管理員審批規範</span>
          </div>
          <p className="text-[#cbd2ef] leading-relaxed text-[11px]">
            為保障客人於解夢後的身心調校品質與產品真實性，所有會員申請上架之選物（安眠草本、淨化煙燻、守護水晶、能量香氛等），在正式對外公開展示前，均需經由
            <strong className="text-amber-200"> 高級管理員 (Super Admin) 審批</strong>
            。審批核准後將自動公開於選物店，你可於「我的上架申請」隨時追蹤進度。
          </p>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Preset Images Quick Pick */}
          <div className="space-y-2">
            <label className="text-white font-medium flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-emerald-400" />
              <span>快速挑選產品展示照片（或自訂圖片網址）</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageUrl(img.url);
                    setCategory(img.category);
                  }}
                  className={`p-1.5 rounded-xl border transition-all text-left flex flex-col items-center gap-1 cursor-pointer ${
                    imageUrl === img.url
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-sm'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-12 object-cover rounded-lg bg-black/40"
                  />
                  <span className="text-[10px] text-white truncate max-w-full text-center">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="自訂圖片 URL (例如 Unsplash 連結)"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#cbd2ef] block mb-1">
                產品名稱 <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：手作深層助眠洋甘菊香氛枕頭噴霧"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[#cbd2ef] block mb-1">
                副標題 / 核心特色 <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="例如：睡前儀式 · 撫平夜間焦慮 · 溫暖深眠"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[#cbd2ef] block mb-1">品牌 / 手作坊名稱</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="你的工坊或品牌"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[#cbd2ef] block mb-1">選物分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="sleep">🌙 深眠安神 · 枕頭噴霧</option>
                <option value="herb">☕ 草本調校 · 晚安舒緩茶</option>
                <option value="incense">🌿 空間結界 · 煙燻淨化</option>
                <option value="crystal">💎 靈性直覺 · 守護水晶</option>
                <option value="purify">🍃 淨化開運 · 氣場轉化</option>
              </select>
            </div>

            <div>
              <label className="text-[#cbd2ef] block mb-1">規格 / 容量</label>
              <input
                type="text"
                value={volumeOrSpec}
                onChange={(e) => setVolumeOrSpec(e.target.value)}
                placeholder="例如：100ML 或 20入茶包 或 原石 1 份"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[#cbd2ef] block mb-1">
                售價 (HKD) <span className="text-emerald-400">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={priceHKD}
                onChange={(e) => setPriceHKD(e.target.value)}
                placeholder="78"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[#cbd2ef] block mb-1">原價 (HKD，選填)</label>
              <input
                type="number"
                min={1}
                value={originalPriceHKD}
                onChange={(e) => setOriginalPriceHKD(e.target.value)}
                placeholder="98"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[#cbd2ef] block mb-1">星星幣可折抵數</label>
              <input
                type="number"
                min={0}
                value={starsRedeemCost}
                onChange={(e) => setStarsRedeemCost(e.target.value)}
                placeholder="15"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#cbd2ef] block mb-1">原料成分 / 材質 (以逗號分隔)</label>
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="例如：德國洋甘菊精油、真正薰衣草、純水"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[#cbd2ef] block mb-1">核心功效 / 亮點 (以逗號分隔)</label>
              <input
                type="text"
                value={keyBenefits}
                onChange={(e) => setKeyBenefits(e.target.value)}
                placeholder="例如：深層放鬆、撫平夜間緊繃、提升深睡比例"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[#cbd2ef] block mb-1">適合對應之夢境意象 (以逗號分隔)</label>
            <input
              type="text"
              value={suitableDreams}
              onChange={(e) => setSuitableDreams(e.target.value)}
              placeholder="例如：噩夢驚醒、被追趕、死線壓力、多夢淺眠、運勢低迷"
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[#cbd2ef] block mb-1">推薦理由 / 創作初衷 (選物介紹)</label>
            <textarea
              rows={2}
              value={recommendationReason}
              onChange={(e) => setRecommendationReason(e.target.value)}
              placeholder="向客人說明此產品如何幫助夢後調校身心與轉化氣場..."
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#cbd2ef] block mb-1">使用方法與儀式指引</label>
              <input
                type="text"
                value={usageGuide}
                onChange={(e) => setUsageGuide(e.target.value)}
                placeholder="例如：睡前 15 分鐘噴於枕頭兩側或胸口前方空氣中"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[#cbd2ef] block mb-1">保存方式與注意事項</label>
              <input
                type="text"
                value={cautions}
                onChange={(e) => setCautions(e.target.value)}
                placeholder="例如：避光陰涼處保存、外用請勿飲用"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Super Admin Override checkbox */}
          {isSuperAdmin && (
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between text-xs">
              <span className="text-purple-300 font-medium">👑 高級管理員特權：直接核准公開上架</span>
              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={autoApproveAsSuperAdmin}
                  onChange={(e) => setAutoApproveAsSuperAdmin(e.target.checked)}
                  className="rounded border-purple-400 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span>直接公開（免審批佇列）</span>
              </label>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#cbd2ef] text-xs cursor-pointer transition-all"
            >
              取消
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>
                {isSuperAdmin && autoApproveAsSuperAdmin
                  ? '直接核准並公開上架'
                  : '提交高級管理員審批'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
