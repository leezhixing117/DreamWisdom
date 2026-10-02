import React from 'react';
import { Crown, Check, ArrowRight, Star, Sparkles, BookOpen } from 'lucide-react';
import { User, normalizeRole, DreamEntry } from '../types';
import { CelestialRotatingAstrolabe, Archetype } from './CelestialRotatingAstrolabe';

interface PricingViewProps {
  currentUser?: User | null;
  dreams?: DreamEntry[];
  onOpenEarnStars?: () => void;
  onUpgradeToPaid: () => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onOpenLogin?: () => void;
  onGoToStars?: () => void;
  onStartWithDream?: (dreamText: string) => void;
  onOpenReportDetail?: (entry: DreamEntry) => void;
  onNavigateToShop?: (productId?: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  dreams = [],
  onUpgradeToPaid,
  onGoToApp,
  onGoToStars,
  onStartWithDream,
  onOpenReportDetail,
  onNavigateToShop,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';

  return (
    <div className="shell py-6 sm:py-10 max-w-5xl mx-auto px-2 sm:px-4" id="pricing-page-root">
      {/* 👑 付費會員尊享專區 · 潛意識天體星盤 */}
      <section
        className="px-3.5 py-6 sm:px-8 sm:py-8 lg:p-10 rounded-3xl bg-white/95 backdrop-blur-xs border-2 border-amber-200/90 shadow-2xl relative overflow-hidden space-y-6"
        id="pricing-astrolabe-vip-section"
      >
        {/* 背景柔美天體光芒與線條飾紋 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" preserveAspectRatio="none">
            <path d="M 0 100 Q 200 40 400 120 T 800 80" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
            <path d="M 0 300 Q 300 360 500 280 T 800 320" fill="none" stroke="#818CF8" strokeWidth="1" strokeOpacity="0.3" />
            <circle cx="750" cy="80" r="100" fill="none" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 5" />
          </svg>
        </div>

        {/* VIP 頂部橫幅 (單一清晰標頭，排版在手機與電腦端均流暢優雅) */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-300/80 text-amber-900 text-xs font-bold mb-2 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>👑 付費會員尊享專區 · VIP EXCLUSIVE</span>
            </div>

            <h1 className="font-celestial-serif font-black text-xl sm:text-3xl text-slate-900 tracking-tight leading-snug">
              ✦ 潛意識天體星盤 · 12 宿原型共振 ✦
            </h1>

            {/* 柔和典雅星軌中軸線 */}
            <div className="flex items-center gap-2 my-2 opacity-60">
              <div className="w-8 h-px bg-amber-400" />
              <span className="text-[10px] text-amber-700">✦ ☾ ✦</span>
              <div className="w-16 h-px bg-indigo-300" />
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              專為深度心靈探索者打造的天體原型共振儀。整合<strong className="text-indigo-700 font-bold">「🔮 每日心靈卦象占卜」</strong>與<strong className="text-purple-700 font-bold">「💭 客人夢境天體共振」</strong>。按住圓盤隨意探索天體軌道；
              <strong className="text-amber-800 font-bold">「撥動星盤」為付費會員專屬特權</strong>，與心靈原型深度共振並汲取每日潛意識指引。
            </p>
          </div>

          <div className="shrink-0 self-stretch sm:self-center flex sm:block justify-end">
            {isPaid ? (
              <span className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>已尊享付費會員特權</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onUpgradeToPaid}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
              >
                <Crown className="w-4 h-4" />
                <span>立即開通付費會員</span>
              </button>
            )}
          </div>
        </div>

        {/* 潛意識天體星盤核心組件 (hideTopBanner={true} 消除內部重覆標題) */}
        <CelestialRotatingAstrolabe
          hideTopBanner={true}
          isPaidMember={isPaid}
          dreams={dreams}
          onRequirePaid={onUpgradeToPaid}
          onStartWithDream={onStartWithDream}
          onOpenReportDetail={onOpenReportDetail}
          onNavigateToShop={onNavigateToShop}
        />

        {/* 底部引導至星星幣與方案明細頁面 */}
        <div className="pt-5 mt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 via-indigo-50/40 to-white border border-slate-200/90 shadow-xs relative z-10">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                <span>想了解星星幣獲取與所有解夢方案細節？</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-900 font-bold">
                  免費 / 星星幣 / VIP
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                所有會員方案比較、睇片儲星中心與功能權益對比矩陣已整合至星星幣頁。
              </p>
            </div>
          </div>

          {onGoToStars && (
            <button
              type="button"
              onClick={onGoToStars}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-amber-400 hover:text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
            >
              <span>前往星星幣中心查看方案</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
