import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Crown,
  Check,
  X,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Tv,
  Coins,
  Database,
  FileDown,
  Lock,
  Zap,
} from 'lucide-react';
import { User, normalizeRole } from '../types';
import { CelestialRotatingAstrolabe } from './CelestialRotatingAstrolabe';

interface PricingViewProps {
  currentUser?: User | null;
  onOpenEarnStars: () => void;
  onUpgradeToPaid: () => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onOpenLogin?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  onOpenEarnStars,
  onUpgradeToPaid,
  onGoToApp,
  onOpenLogin,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
  const stars = currentUser?.stars ?? 0;
  const currentQuota = isPaid ? '無限存檔 (VIP)' : '不可儲存（免費探索）/ 扣星解鎖報告永久存檔';

  const pricingFaqs = [
    {
      q: '⭐ 星星幣主要是用來做什麼的？',
      a: '星星幣是專為「一般會員（免費用戶）」量身打造的探索代幣，核心用途如下：\n1. 【初步解夢分析】：消耗 3 顆星星幣，獲取主意象象徵解析、心理狀態與日常啟示。\n2. 【Dream Master 深度解夢】：直接執行四大維度深度解剖（榮格潛意識原型、弗洛伊德精神分析、東方周公吉凶、現代認知腦科學）需 6 顆星星幣。\n3. 【初析後智能升級補差額】：若已執行過初步分析，再升級深度解密時自動折抵，只需加 3 顆星星幣（絕不重覆扣費）！\n4. 【解鎖 CONSTELLATION™️ 夢境星圖與 DREAM DNA】：串聯潛意識關聯圖譜與情緒軌跡。\n5. 【解鎖紀錄永久保存】：凡扣星解鎖之夢境報告永久儲存於個人帳戶，星星幣亦永久有效不作廢！',
    },
    {
      q: '睇廣告短片攞到嘅星星幣，會唔會過期？',
      a: '完全唔會！星星幣永久保存在你的帳戶中，永不過期。你可以隨心按照自己的節奏睇短片儲星（每次 +1 星），隨時使用。',
    },
    {
      q: '用星星幣解鎖咗深度解夢後，報告會唔會消失？',
      a: '絕不會消失。只要你用星星幣解鎖了某個夢境的初步分析或 Dream Master 深度解密，該夢境的所有四大維度心理學報告與指引都會永久保存於你的夢境歷史記錄中。',
    },
    {
      q: '付費會員還需要消耗星星幣嗎？',
      a: '不需要！付費會員（VIP）享有「全免扣星尊享特權」，無論是初步解夢還是 Dream Master 深度解讀均可無限次直接解鎖，完全免睇片、免扣星。之前累積的星星幣也會繼續永久保留在帳戶中。',
    },
    {
      q: '免費探索、星星幣體驗與付費 VIP 的核心區別是什麼？',
      a: '1. 【免費探索】：可即時免費輸入夢境獲得基礎意象分析，但「不可儲存夢境」，解讀結果僅供當次即時瀏覽，不佔存檔亦不存入日記。\n2. 【星星幣體驗】：免費用戶睇短片賺幣，3 星解鎖初步分析、6 星解鎖 Dream Master 深度解夢，凡扣星解鎖之夢境報告永久保存於帳戶日記中！\n3. 【付費 VIP 會員】：全面免廣告、免扣星無限次解夢、享有無限夢境存檔、CONSTELLATION™️ 互動星圖、30 日全息總結報告與 PDF 匯出隨身珍藏。',
    },
  ];

  return (
    <div className="shell py-8 sm:py-14" id="pricing-page-root">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-[#c3b9ff] text-xs font-semibold mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
          <span>雙軌透明架構 · 付費 / 睇廣告賺星星幣</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          揀適合你嘅探索方式
        </h1>
        <p className="text-sm sm:text-base text-[#aab3d2] mt-3 max-w-2xl mx-auto leading-relaxed">
          核心原則：<b>星星幣 = 免費用戶嘅代幣</b>，睇廣告賺，唔使俾真金白銀都可以試進階功能；付費就直接全解鎖、唔使睇廣告。
        </p>

        {/* Current user status indicator */}
        {currentUser && (
          <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white">
            <span>目前身份：<b className="text-[#aa9cff]">{currentUser.display_name || currentUser.email}</b></span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>餘額：{stars} 顆星星幣</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[#78e1b5]">儲存配額：{currentQuota}</span>
          </div>
        )}
      </div>

      {/* THREE CARDS: Free, Star Coins, Paid (Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch max-w-6xl mx-auto mb-14" id="pricing-cards-grid">
        {/* CARD 1: 🆓 免費探索 */}
        <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10 bg-[#0c0f20]/90 hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8d97b5]">Free Tier</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#aab3d2] border border-white/10">
                毋須付款
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>🆓 免費探索</span>
            </h2>
            <p className="text-xs text-[#aab3d2] mt-2 leading-relaxed min-h-[36px]">
              輸入夢境獲取即時單次簡易解析；<b>免費探索不提供夢境儲存</b>，解析結果僅供當次即時瀏覽體驗。
            </p>

            <div className="my-5 pb-5 border-b border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">HK$0</span>
                <span className="text-xs text-[#8d97b5]">/ 永久免費</span>
              </div>
              <p className="text-[11px] text-[#78e1b5] mt-1 font-mono">
                無需星星幣 · 即開即試
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="text-[11px] font-bold text-white uppercase tracking-wider">包含功能：</div>
              <ul className="space-y-2 text-[#cbd2ef]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>單次夢境即時簡易解析（主意象、日常啟發）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>建立個人帳戶同步登入</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>即開即解、無門檻探索心靈意象</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] font-bold text-[#ff8b9d] uppercase tracking-wider">限制與尚未包含：</div>
              <ul className="space-y-1.5 text-[#8d97b5]">
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d] shrink-0 mt-0.5" />
                  <span className="text-[#ff8b9d] font-bold">不可儲存夢境（不提供歷史日記存檔）</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>無 AI 深入解密（四層心理深度剖析，需星星幣或付費）</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>無 DREAM DNA 統計、無 CONSTELLATION 星圖</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>無 30 NIGHTS MYSTERY™️ 計劃與全息報告</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>不能匯出 PDF 檔案</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => onGoToApp('workspace')}
              className="btn dark w-full text-xs py-3 justify-center cursor-pointer"
            >
              <span>即刻免費試解一個夢 →</span>
            </button>
          </div>
        </div>

        {/* CARD 2: ⭐ 星星幣解鎖 (Highlighted Freemium Track) */}
        <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-amber-400/50 bg-gradient-to-b from-[#161208]/90 via-[#0f1225] to-[#0a0d1d] shadow-xl shadow-amber-500/10 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-[11px] tracking-wide uppercase shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-black" />
            <span>免費用戶首選 · 睇片賺幣</span>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-2 mt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300">Ad-Supported Token</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                唔使真金白銀
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>⭐ 星星幣體驗</span>
            </h2>
            <p className="text-xs text-[#cbd2ef] mt-2 leading-relaxed min-h-[36px]">
              消耗星星幣，逐次 / 限期開啟進階功能，適合想試下深度解夢、暫時唔想直接付費嘅用戶。
            </p>

            <div className="my-5 pb-5 border-b border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">0 元</span>
                <span className="text-xs text-[#aab3d2]">/ 睇短片廣告賺幣</span>
              </div>
              <p className="text-[11px] text-amber-200/80 mt-1 font-mono">
                每睇 1 段心靈短片 ➔ 即賺 1 顆星星幣 ⭐
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>星星幣核心用途與開啟功能：</span>
              </div>
              <ul className="space-y-2 text-[#cbd2ef]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>初步解夢分析（3 顆星 ⭐）</b>：一般會員執行時扣除 3 顆星星幣，獲取核心象徵解讀與關鍵指引。</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>Dream Master 深度解夢（直接執行 6 顆星 ⭐）</b>：跨榮格潛意識、弗洛伊德精神分析、東方周公與現代腦科學四大權威維度。</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>初析後智能升級補差額（折抵只需 +3 顆星 ⭐）</b>：先初析後升級自動補差額，絕不重複扣星。</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>CONSTELLATION™️ 夢境星圖與 DREAM DNA</b>：即時串連個人夢境意象宇宙、情緒共鳴與潛意識頻率。</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>解鎖紀錄永久保存</b>：凡扣星解鎖之夢境深度報告永久保存於帳戶中，隨時重溫。</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>短片隨心免費儲星</b>：每睇 1 段身心靈短片廣告即送 +1 顆星，無有效期限、永不過期！</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] font-bold text-[#8d97b5] uppercase tracking-wider">說明與限制：</div>
              <ul className="space-y-1.5 text-[#8d97b5]">
                <li className="flex items-start gap-2">
                  <span className="text-white/40 shrink-0 mt-0.5 font-mono text-[10px]">•</span>
                  <span>免費探索不提供存檔；凡使用星星幣解鎖之初步/深度報告永久保存於帳戶（付費 VIP 享無限存檔）</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <span>高清星圖下載、PDF 匯出備份及 30 日全息總結需付費 VIP 權限</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <span>星星幣為平台功能體驗代幣，純作功能解鎖，不可兌換現金</span>
                </li>
              </ul>
            </div>

            {/* Micro Rules Notice */}
            <div className="mt-4 p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-[11px] text-amber-200/90 space-y-1">
              <div className="font-semibold text-amber-300">💡 星星幣使用守則：</div>
              <div>• 初步分析 3 星 · 深度解夢直接執行 6 星（先初析後升級只需加 3 星）</div>
              <div>• 星星幣永久有效<b>永不過期</b>；解鎖報告<b>永久保存</b>於你的歷史中</div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer shadow-md shadow-amber-500/20"
              id="pricing-watch-ad-btn"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>睇片賺星星幣 (+1 顆 ⭐) · 現有 {stars} 顆</span>
            </button>

            <button
              type="button"
              onClick={() => onGoToApp('workspace')}
              className="w-full py-2.5 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer font-medium"
            >
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span>前往解夢工作台體驗（初步3星 · 深度6星）</span>
            </button>
          </div>
        </div>

        {/* CARD 3: 💎 付費全解鎖方案 */}
        <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#aa9cff]/40 bg-gradient-to-b from-[#13112a]/95 via-[#0d1024] to-[#080a18] shadow-xl shadow-[#aa9cff]/10">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#aa9cff]">Unlimited Premium</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#aa9cff]/20 text-[#c3b9ff] border border-[#aa9cff]/30 font-semibold">
                全功能解鎖
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>💎 付費進階方案</span>
            </h2>
            <p className="text-xs text-[#cbd2ef] mt-2 leading-relaxed min-h-[36px]">
              一次開晒全部功能：完整互動星圖、30 日全息報告、無限儲存、PDF 匯出備份，完全唔使睇廣告！
            </p>

            {/* Billing switcher: 月費 / 年費 (年費有優惠) / 終身 */}
            <div className="my-4 p-1 rounded-xl bg-white/5 border border-white/10 flex items-center text-xs gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-center ${
                  billingCycle === 'monthly' ? 'bg-[#aa9cff] text-black font-bold shadow' : 'text-[#aab3d2] hover:text-white'
                }`}
              >
                月費方案
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-center relative ${
                  billingCycle === 'yearly' ? 'bg-[#aa9cff] text-black font-bold shadow' : 'text-amber-300 hover:text-amber-200'
                }`}
              >
                <span>年費方案</span>
                <span className="ml-1 text-[10px] px-1 py-0.2 rounded bg-amber-400 text-black font-extrabold">
                  慳35%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('lifetime')}
                className={`py-1.5 px-2.5 rounded-lg font-medium transition-all cursor-pointer text-center ${
                  billingCycle === 'lifetime' ? 'bg-[#aa9cff] text-black font-bold shadow' : 'text-[#aab3d2] hover:text-white'
                }`}
              >
                終身
              </button>
            </div>

            {/* Price & Billing Cycle Display */}
            <div className="pb-4 mb-4 border-b border-white/10">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  {billingCycle === 'yearly'
                    ? 'HK$298'
                    : billingCycle === 'monthly'
                    ? 'HK$38'
                    : 'HK$588'}
                </span>
                <span className="text-xs text-[#aab3d2]">
                  {billingCycle === 'yearly'
                    ? '/ 年費 (HKD)'
                    : billingCycle === 'monthly'
                    ? '/ 月費 (HKD)'
                    : '/ 終身買斷 (HKD)'}
                </span>
              </div>

              {/* Annual Discount Banner */}
              {billingCycle === 'yearly' && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
                  <span>🔥 年費限時特惠：折合約 HK$24.8 / 月 · 享 35% 優惠（即慳 HK$158）！</span>
                </div>
              )}

              <p className="text-[11px] text-[#78e1b5] mt-1.5 font-mono">
                {billingCycle === 'yearly'
                  ? '週期：按年扣款 · 全年無限解夢 · 送完整星圖與 30 晚檔案'
                  : billingCycle === 'monthly'
                  ? '週期：按月扣款 · 彈性自由 · 隨時可取消訂閱無合約束縛'
                  : '週期：一次付款 · 終生永久無限探索潛意識'}
              </p>

              {/* Cycle Comparison Bar */}
              <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#aab3d2]">月費週期：</span>
                  <span className="font-mono text-white">HK$38 / 月（按月扣款，隨時取消）</span>
                </div>
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center gap-1">
                    <span>年費週期：</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      有優惠
                    </span>
                  </span>
                  <span className="font-mono">HK$298 / 年（折合 HK$24.8/月，慳 HK$158）</span>
                </div>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[#c3b9ff] uppercase tracking-wider">全部特權直通解鎖：</div>
              <ul className="space-y-2 text-[#cbd2ef]">
                <li className="flex items-start gap-2 font-semibold text-white">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>全免扣星尊享特權</b>：無限次直接執行初步分析與 Dream Master 深度解夢，免看片免扣星</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>完整 CONSTELLATION™️ 可交互夢境星圖</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>30 NIGHTS MYSTERY™️ 最終全息完整報告</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>無限夢境存檔</b>（無數量上限，記得你一生的夢）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>所有夢境記錄可匯出 PDF 檔案</b> 隨身珍藏</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>優先解析排隊，減少 AI 運算等待時間</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>星圖圖片高畫質下載、自訂私密夢境標籤</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            {isPaid ? (
              <div className="p-3 rounded-xl bg-[#78e1b5]/15 border border-[#78e1b5]/30 text-[#78e1b5] text-xs text-center font-bold flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4" />
                <span>你現已尊享付費會員全部特權！</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onUpgradeToPaid}
                className="btn w-full text-xs py-3 justify-center cursor-pointer shadow-lg shadow-[#aa9cff]/20 font-bold"
                id="pricing-upgrade-btn"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>
                  {billingCycle === 'yearly'
                    ? '立即啟用付費會員（年費特惠 HK$298/年 · 慳35%）'
                    : billingCycle === 'monthly'
                    ? '立即啟用付費會員（月費 HK$38/月）'
                    : '立即啟用付費會員（終生買斷 HK$588）'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULL FEATURE COMPARISON TABLE (功能詳細對比表格) */}
      <section className="max-w-6xl mx-auto mb-16 pt-4" id="feature-comparison-table-section">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-[#c3b9ff] text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
            <span>三種方案權益透明對比 · FEATURE MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            方案功能一覽表
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-1.5">
            無論你想即時零門檻試玩、睇片儲星解鎖，定係一次擁有全功能，權益完全透明。
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0c0f22]/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="py-4 px-5 text-xs font-bold text-[#8d97b5] uppercase tracking-wider w-[36%]">
                    功能項目
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white text-center w-[21%]">
                    <span className="block font-serif text-sm">🆓 免費探索</span>
                    <span className="text-[10px] text-[#8d97b5] font-normal font-mono">HK$0 永久免費</span>
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-amber-300 text-center w-[21%] bg-amber-400/5">
                    <span className="block font-serif text-sm flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>⭐ 星星幣體驗</span>
                    </span>
                    <span className="text-[10px] text-amber-200/80 font-normal font-mono">睇短片賺幣 (每次+1星)</span>
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-white text-center w-[22%] bg-[#aa9cff]/10">
                    <span className="block font-serif text-sm flex items-center justify-center gap-1 text-[#c3b9ff]">
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      <span>💎 付費 VIP 進階</span>
                    </span>
                    <span className="text-[10px] text-[#78e1b5] font-normal font-mono">HK$38/月 或 HK$298/年</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-xs">
                {/* CATEGORY 1: 基礎夢境記錄 */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-[#aa9cff] uppercase tracking-wider text-[11px]">
                    壹 · 夢境記錄與儲存權益
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">即時簡易分析</div>
                    <div className="text-[11px] text-[#8d97b5]">主意象提取、當前情緒梳理、日常心靈提示</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#78e1b5]">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#8d97b5] block">當次瀏覽</span>
                  </td>
                  <td className="py-3 px-4 text-center text-[#78e1b5] bg-amber-400/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-amber-300 block">扣 3 星永久保存</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">無限次使用</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">夢境日記歷史儲存</div>
                    <div className="text-[11px] text-[#8d97b5]">跨裝置同步、歷史回顧與個人夢境檔案管理</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]" />
                    <span className="text-[10px] text-[#ff8b9d] block">不提供存檔</span>
                  </td>
                  <td className="py-3 px-4 text-center text-amber-300 bg-amber-400/5">
                    <span className="font-mono text-xs font-bold">永久保存</span>
                    <span className="text-[10px] text-[#cbd2ef] block">凡扣星解鎖報告永久存檔</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <span className="font-mono text-xs font-bold">無限永久存檔</span>
                    <span className="text-[10px] text-[#78e1b5] block">無條數上限</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">香港本土與華人家宅象徵對照</div>
                    <div className="text-[11px] text-[#8d97b5]">神枱香火、舊居祖屋、公屋長廊、叮叮電車、茶餐廳等原型解碼</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#cbd2ef]">
                    <span className="text-[11px]">基礎識別</span>
                  </td>
                  <td className="py-3 px-4 text-center text-[#78e1b5] bg-amber-400/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-amber-300 block">深度家庭情結剖析</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">完整深層文化層解析</span>
                  </td>
                </tr>

                {/* CATEGORY 2: 深度心理學剖析 */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-[#71d9ff] uppercase tracking-wider text-[11px]">
                    貳 · 深度心理學剖析 (Dream Master)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">Dream Master 400-800 字深度分析</div>
                    <div className="text-[11px] text-[#8d97b5]">榮格分析心理學、潛意識陰影、心靈天平平衡補償</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-4 text-center text-amber-300 bg-amber-400/5">
                    <span className="font-mono text-xs font-bold">6 顆星 ⭐</span>
                    <span className="text-[10px] text-[#8d97b5] block">初析後升級只需 +3 星</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <span className="font-mono text-xs font-bold">全免扣星無限次</span>
                    <span className="text-[10px] text-[#78e1b5] block">免看片免扣星</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">Book Brain 典籍出處與頁碼引用</div>
                    <div className="text-[11px] text-[#8d97b5]">比對榮格、弗洛伊德與華人典籍，拒絕憑空胡猜</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-4 text-center text-[#78e1b5] bg-amber-400/5">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">多輪對話追問（對話輪次管理）</div>
                    <div className="text-[11px] text-[#8d97b5]">針對夢中推不開的門或特定細節向 AI 深入提問</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-4 text-center text-[#cbd2ef] bg-amber-400/5">
                    <span className="text-[11px]">標準追問</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">無限次深度對話</span>
                  </td>
                </tr>

                {/* CATEGORY 3: 長期心靈檔案 */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    叄 · 長期心靈指紋與星圖網絡
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">DREAM DNA™️ 夢境指紋雷達</div>
                    <div className="text-[11px] text-[#8d97b5]">統計高頻出現意象、時間軸情緒光譜與潛意識演進</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-4 text-center text-[#cbd2ef] bg-amber-400/5">
                    <span className="text-[11px]">星星幣解鎖</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">動態實時演進</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">CONSTELLATION™️ 互動式夢境星圖</div>
                    <div className="text-[11px] text-[#8d97b5]">跨時空夢境連線、星系節點可視化網絡、高清星圖下載</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-4 text-center text-[#cbd2ef] bg-amber-400/5">
                    <span className="text-[11px]">星星幣解鎖</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">完整交互 + 高清下載</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">30 NIGHTS MYSTERY™️ 偵探解密旅程</div>
                    <div className="text-[11px] text-[#8d97b5]">連續 30 晚潛意識拼圖、終身全息報告書與年度行動指南</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-4 text-center text-[#cbd2ef] bg-amber-400/5">
                    <span className="text-[11px]">逐步解鎖線索</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">解鎖全息報告與指南</span>
                  </td>
                </tr>

                {/* CATEGORY 4: 服務與尊享特權 */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-[#78e1b5] uppercase tracking-wider text-[11px]">
                    肆 · 格式匯出與尊享特權
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">匯出 PDF 檔案</div>
                    <div className="text-[11px] text-[#8d97b5]">精美版面排版，可匯出為 PDF 檔案隨身備份珍藏</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-4 text-center text-[#ff8b9d]">
                    <X className="w-4 h-4 mx-auto text-[#ff8b9d]/60" />
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">一鍵匯出 PDF</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">社交分享打碼匿名洞察報告</div>
                    <div className="text-[11px] text-[#8d97b5]">自動遮蔽私密細節，安全生成 WhatsApp/IG 分享文案</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#78e1b5]">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center text-[#78e1b5] bg-amber-400/5">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-[#cbd2ef]">
                    <div className="font-semibold text-white">免看短片廣告 / 零等待尊享通道</div>
                    <div className="text-[11px] text-[#8d97b5]">享受純淨專注的心靈日記體驗，AI 運算優先通道</div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#8d97b5]">
                    <span className="text-[11px]">標準運算</span>
                  </td>
                  <td className="py-3 px-4 text-center text-amber-300 bg-amber-400/5">
                    <span className="text-[11px]">需睇片儲星</span>
                  </td>
                  <td className="py-3 px-5 text-center text-[#78e1b5] bg-[#aa9cff]/5">
                    <Check className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] text-[#78e1b5] block">完全免廣告 · 優先通道</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer Callout */}
          <div className="p-4 sm:p-5 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#aab3d2]">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-[#78e1b5] shrink-0" />
              <span>所有方案均享有「絕不用戶夢境數據訓練外部通用 AI 模型」最高私隱保護承諾</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenEarnStars}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 hover:bg-amber-400/30 cursor-pointer"
              >
                免費睇片儲星 (+1 ⭐)
              </button>
              <button
                type="button"
                onClick={onUpgradeToPaid}
                className="px-3.5 py-1.5 rounded-lg bg-[#aa9cff] text-black font-bold hover:brightness-105 cursor-pointer shadow-md"
              >
                立即啟用 VIP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 👑 付費會員尊享專區 · 潛意識天體星盤 */}
      <section className="my-10 p-6 sm:p-10 rounded-3xl bg-white border-2 border-amber-300 shadow-2xl relative overflow-hidden" id="pricing-astrolabe-vip-section">
        {/* VIP 頂部橫幅 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>👑 付費會員專區 · VIP EXCLUSIVE</span>
            </div>
            <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900">
              ✦ 潛意識天體星盤 · 12 宿原型共振 ✦
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              按住圓盤隨意探索天體軌道；<strong className="text-blue-700">「撥動星盤」為付費會員專屬特權</strong>，與心靈原型深度共振。
            </p>
          </div>

          <div>
            {isPaid ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>已尊享付費會員特權</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onUpgradeToPaid}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>立即開通付費會員</span>
              </button>
            )}
          </div>
        </div>

        <CelestialRotatingAstrolabe
          isPaidMember={isPaid}
          onRequirePaid={onUpgradeToPaid}
          onSelectArchetype={() => {
            onGoToApp('workspace');
          }}
        />
      </section>

      {/* PRICING FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto pt-6 border-t border-white/10" id="pricing-faq-section">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            關於星星幣與方案的常見問題
          </h2>
          <p className="text-xs text-[#aab3d2] mt-1">清晰明確，杜絕任何隱形收費與規則陷阱</p>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="card rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-white">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8d97b5] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-300' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#cbd2ef] leading-relaxed border-t border-white/5">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
