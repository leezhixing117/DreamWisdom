import React from 'react';
import { Crown, Check, ArrowRight, Star, Sparkles } from 'lucide-react';
import { User, normalizeRole } from '../types';
import { CelestialRotatingAstrolabe } from './CelestialRotatingAstrolabe';

interface PricingViewProps {
  currentUser?: User | null;
  onOpenEarnStars?: () => void;
  onUpgradeToPaid: () => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onOpenLogin?: () => void;
  onGoToStars?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  onUpgradeToPaid,
  onGoToApp,
  onGoToStars,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';

  return (
    <div className="shell py-8 sm:py-12 max-w-5xl mx-auto" id="pricing-page-root">
      {/* 👑 付費會員尊享專區 · 潛意識天體星盤 */}
      <section
        className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-amber-300 shadow-2xl relative overflow-hidden space-y-6"
        id="pricing-astrolabe-vip-section"
      >
        {/* VIP 頂部橫幅 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-300 text-amber-900 text-xs font-bold mb-2 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>👑 付費會員尊享專區 · VIP EXCLUSIVE</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
              ✦ 潛意識天體星盤 · 12 宿原型共振 ✦
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 font-medium leading-relaxed">
              專為深度心靈探索者打造的天體原型共振儀。按住圓盤隨意探索天體軌道；
              <strong className="text-blue-700 font-bold">「撥動星盤」為付費會員專屬特權</strong>，與心靈原型深度共振並汲取每日潛意識指引。
            </p>
          </div>

          <div className="shrink-0">
            {isPaid ? (
              <span className="px-4 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>已尊享付費會員特權</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onUpgradeToPaid}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
              >
                <Crown className="w-4 h-4" />
                <span>立即開通付費會員</span>
              </button>
            )}
          </div>
        </div>

        {/* 潛意識天體星盤核心組件 */}
        <CelestialRotatingAstrolabe
          isPaidMember={isPaid}
          onRequirePaid={onUpgradeToPaid}
          onSelectArchetype={() => {
            onGoToApp('workspace');
          }}
        />

        {/* 底部引導至星星幣與方案明細頁面 */}
        <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-blue-50/50 to-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
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
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-amber-400 hover:text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
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
