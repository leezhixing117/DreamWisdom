import React from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Compass,
  ArrowRight,
  Coins,
} from 'lucide-react';
import { User, normalizeRole } from '../types';
import { CelestialRotatingAstrolabe } from './CelestialRotatingAstrolabe';

interface PricingViewProps {
  currentUser?: User | null;
  onOpenEarnStars: () => void;
  onUpgradeToPaid: () => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onOpenLogin?: () => void;
  onGoToStars?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  onOpenEarnStars,
  onUpgradeToPaid,
  onGoToApp,
  onGoToStars,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';

  return (
    <div className="shell py-8 sm:py-14 max-w-5xl mx-auto" id="vip-exclusive-page-root">
      {/* 1. 頁面標題與尊榮徽章 */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-300/80 text-amber-900 text-xs sm:text-sm font-bold mb-3 shadow-2xs">
          <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>👑 付費會員專區 · VIP EXCLUSIVE AREA</span>
        </div>
        <h1 className="font-celestial-serif font-black text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
          付費會員專區 · 潛意識天體星盤
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
          付費會員專屬天體軌道共振空間。輕按撥動星盤，感應榮格 12 原型意象頻率，並享全站免看廣告、免扣星無限次深度解夢特權。
        </p>

        {/* VIP 會員資格橫幅 */}
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white/95 border border-slate-200/90 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">當前會員狀態：</span>
            {isPaid ? (
              <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>尊貴 VIP 付費會員（全特權已開通）</span>
              </span>
            ) : (
              <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-0.5 rounded-full">
                一般訪客 / 免費用戶
              </span>
            )}
          </div>

          {!isPaid && (
            <button
              type="button"
              onClick={onUpgradeToPaid}
              className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>立即開通付費會員（HK$9/月起）</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. 核心主體：潛意識天體星盤 (Celestial Rotating Astrolabe) - 付費會員專區核心唯一 */}
      <section className="card-featured-dream p-5 sm:p-8 mb-10 relative overflow-hidden" id="vip-astrolabe-main-card">
        {/* 卡片頂部指引 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl">
              <Compass className="w-5 h-5 text-[var(--primary-600)]" />
              <span>✦ 12 宿潛意識天體旋轉星盤 ✦</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              按住圓盤隨意探索天體軌道；<strong className="text-[var(--primary-700)]">「撥動星盤」為付費會員專屬特權</strong>，與心靈原型深度共振。
            </p>
          </div>

          <div>
            {isPaid ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>已解鎖無限次撥盤特權</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onUpgradeToPaid}
                className="btn-primary-cta px-5 py-2.5 text-xs shadow-md shadow-amber-500/20"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>升級解鎖撥盤特權 →</span>
              </button>
            )}
          </div>
        </div>

        {/* 嵌入天體星盤組件 */}
        <CelestialRotatingAstrolabe
          hideHeader={true}
          isPaidMember={isPaid}
          onRequirePaid={onUpgradeToPaid}
          onSelectArchetype={(arch) => {
            onGoToApp('workspace');
          }}
        />

        {/* 星盤連動說明 */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>感應原型後，點選即可直接帶入解夢工作台進行榮格心理深度解析</span>
          </div>

          <button
            type="button"
            onClick={() => onGoToApp('workspace')}
            className="text-[var(--primary-700)] hover:text-[var(--primary-800)] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>前往解夢工作台</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. 底部雙向導航與星星幣引導 */}
      <div className="p-6 rounded-3xl bg-white/95 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>想查看詳細方案價目或睇廣告賺星？</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            免費探索、星星幣兌換規則、月費 / 年費 / 終身方案詳情已整合至「星星幣中心」。
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onGoToStars && (
            <button
              type="button"
              onClick={onGoToStars}
              className="btn-secondary-outline px-4 py-2.5 text-xs flex-1 sm:flex-initial"
            >
              <span>查看星星幣與方案詳情 →</span>
            </button>
          )}

          {!isPaid && (
            <button
              type="button"
              onClick={onUpgradeToPaid}
              className="btn-primary-cta px-6 py-2.5 text-xs flex-1 sm:flex-initial shadow-md"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>立即升級 VIP</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
