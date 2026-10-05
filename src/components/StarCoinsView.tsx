import React, { useState } from 'react';
import {
  Star,
  Play,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Check,
  X,
  Clock,
  Coins,
  ArrowRight,
  HelpCircle,
  Film,
  Zap,
  Gift,
  Crown,
  ChevronDown,
  ChevronUp,
  Tv,
  Database,
  FileDown,
  Lock,
  Compass,
} from 'lucide-react';
import { User, normalizeRole } from '../types';

interface StarCoinsViewProps {
  currentUser: User | null;
  onOpenEarnStars: () => void;
  onGoToWorkspace: () => void;
  onGoToPricing: () => void;
  onUpgradeToPaid?: () => void;
}

export const StarCoinsView: React.FC<StarCoinsViewProps> = ({
  currentUser,
  onOpenEarnStars,
  onGoToWorkspace,
  onGoToPricing,
  onUpgradeToPaid,
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
      a: '1. 【免費探索】：可即時免費輸入夢境獲得基礎意象分析，但「不可儲存夢境」，解讀結果僅供當次即時瀏覽，不佔存檔亦不存入日記。\n2. 【星星幣體驗】：免費用戶睇短片賺幣，3 星解鎖初步分析、6 星解鎖 Dream Master 深度解夢，凡扣星解鎖之夢境報告永久保存於帳戶日記中！\n3. 【付費 VIP 會員】：全面免廣告、免扣星無限次解夢、享有無限夢境存檔、CONSTELLATION™️ 互動星圖、30 日全息總結報告、可進入「👑 付費會員專區」探索潛意識天體星盤，並可一鍵匯出 PDF 隨身珍藏。',
    },
    {
      q: '升級付費會員後，如何進入「付費會員專區」體驗天體星盤？',
      a: '升級後，頂部導航與側邊欄將常駐「👑 付費會員專區」。點擊即可直接進入專屬的「12 宿潛意識天體星盤」，享有無限次隨機撥盤、與心靈原型感應共振，並一鍵連動至解夢工作台！',
    },
  ];

  return (
    <div className="shell py-8 sm:py-14 max-w-6xl mx-auto" id="star-coins-page-root">
      {/* 1. Page Title & Breadcrumb Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-300" />
          <span>雙軌透明架構 · 星星幣中心與方案定價</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          星星幣中心 · 方案定價與權益全覽
        </h1>
        <p className="text-xs sm:text-sm text-[#cbd2ef] mt-2.5 max-w-2xl mx-auto leading-relaxed">
          免費用戶可透過睇身心靈隨機短片免費賺取「星星幣」解鎖深度解析；亦可隨時開通付費會員，享受全站免廣告、免扣星與天體星盤尊貴特權！
        </p>

        {/* Current user status indicator */}
        {currentUser && (
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white shadow-xs">
            <span>目前身份：<b className="text-[#aa9cff]">{currentUser.display_name || currentUser.email}</b></span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>餘額：{stars} 顆星星幣</span>
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-[#78e1b5]">儲存配額：{currentQuota}</span>
          </div>
        )}
      </div>

      {/* 2. Top Prominent Action Banner: 立即免費獲取星星幣 */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-400/20 via-amber-500/15 to-[#aa9cff]/20 border-2 border-amber-400/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-amber-400/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold text-xl shrink-0 shadow">
            📺
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>立即免費獲取星星幣</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold font-mono">
                +1 顆星 ⭐
              </span>
            </div>
            <p className="text-xs text-[#cbd2ef] mt-0.5">
              點擊即睇 15~30 秒身心靈放鬆短片廣告，播完即入帳，永久有效不作廢！
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEarnStars}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/30 transition-all shrink-0 hover:scale-[1.02]"
          id="star-coins-top-direct-btn"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>觀看廣告獲取星星幣</span>
        </button>
      </div>

      {/* 3. Hero Stats Card: Current Balance & Instant Earning Action */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#181326] to-[#0c0d1c] border border-amber-400/30 shadow-2xl shadow-amber-400/10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-amber-400/20">
            <Star className="w-8 h-8 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="text-xs text-amber-300/90 font-mono uppercase tracking-wider">
              {currentUser ? `${currentUser.display_name || currentUser.email} 的帳戶` : '目前訪客狀態'}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{stars}</span>
              <span className="text-sm text-[#cbd2ef]">顆星星幣餘額</span>
            </div>
            <p className="text-xs text-[#aab3d2] mt-1">
              {isPaid
                ? '💎 尊貴 VIP 會員：享有「免扣星」無限次深度解夢，星星幣永保留存！'
                : '⭐ 一般會員：可自由扣星解鎖深度心理學剖析，解鎖紀錄永久保存。'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenEarnStars}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/25 transition-all transform hover:-translate-y-0.5"
            id="star-coins-hero-earn-btn"
          >
            <Film className="w-4 h-4" />
            <span>觀看廣告獲取星星幣 (+1 顆 ⭐)</span>
          </button>

          <button
            type="button"
            onClick={onGoToWorkspace}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>前往解夢工作台</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. THREE CARDS: Free, Star Coins, Paid Plans (合併自付費專區) */}
      <div className="mb-12">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-white">
            三大探索與解鎖模式
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1.5">
            自由選擇適合你的節奏：0元即開即試、睇片賺星扣次解密、或一鍵開通付費會員全解鎖
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch" id="pricing-cards-grid">
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
                onClick={onGoToWorkspace}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
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
                onClick={onGoToWorkspace}
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
                    慳49%
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
                      ? 'HK$549'
                      : billingCycle === 'monthly'
                      ? 'HK$89'
                      : 'HK$919'}
                  </span>
                  <span className="text-xs text-[#aab3d2]">
                    {billingCycle === 'yearly'
                      ? '/ 年（約 HK$45.8/月）'
                      : billingCycle === 'monthly'
                      ? '/ 月'
                      : '/ 終身買斷'}
                  </span>
                </div>
                <p className="text-[11px] text-[#78e1b5] mt-1 font-mono">
                  {billingCycle === 'yearly'
                    ? '比月費慳近 49% · 尊享 365 日無間斷解密'
                    : billingCycle === 'monthly'
                    ? '隨時可取消 · 無綁約彈性暢玩'
                    : '一次付清 · 永久尊享所有最新解夢模組更新'}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] font-bold text-[#c3b9ff] uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>VIP 付費會員尊享全特權：</span>
                </div>
                <ul className="space-y-2 text-[#cbd2ef]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                    <span><b>全站免睇廣告 · 免扣星星幣</b>：所有夢境初步與深度解讀無限次暢玩。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                    <span><b>👑 獨享「付費會員專區」</b>：無限次撥動天體星盤，共振榮格 12 原型意象頻率。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                    <span><b>無限夢境存檔配額</b>：建立個人一生的心靈潛意識資料庫，永久備份。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                    <span><b>CONSTELLATION™️ 4K 高畫質星圖下載</b>：解鎖星圖超高清匯出珍藏。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                    <span><b>30 NIGHTS MYSTERY™️ 全息報告</b>：30 晚潛意識成長軌跡全景心理檔案。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                    <span><b>一鍵匯出排版精美 PDF 檔案</b>：隨時打印或與心理諮詢師深度探討。</span>
                  </li>
                </ul>

                <div className="pt-2 text-[11px] font-bold text-[#78e1b5] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#78e1b5]" />
                  <span>保障承諾：</span>
                </div>
                <ul className="space-y-1 text-[#8d97b5]">
                  <li className="flex items-start gap-2">
                    <span className="text-white/40 shrink-0 mt-0.5 font-mono text-[10px]">•</span>
                    <span>Stripe 國際安全加密支付，資料絕不用作 AI 訓練。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white/40 shrink-0 mt-0.5 font-mono text-[10px]">•</span>
                    <span>可隨時於個人資料中心一鍵管理或取消訂閱。</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
              {isPaid ? (
                <div className="w-full py-3 rounded-xl bg-emerald-500/20 text-[#78e1b5] border border-emerald-400/30 text-xs font-bold flex items-center justify-center gap-1.5 shadow">
                  <Check className="w-4 h-4" />
                  <span>你已是尊貴 VIP 會員（全特權開通中）</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onUpgradeToPaid || onGoToPricing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20 hover:brightness-110 transition-all hover:scale-[1.01]"
                  id="pricing-upgrade-btn"
                >
                  <Crown className="w-4 h-4 text-black" />
                  <span>立即升級 VIP（HK$89/月起）</span>
                </button>
              )}

              <button
                type="button"
                onClick={onGoToPricing}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 text-[#c3b9ff] border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                <span>👑 前往付費會員專區 (天體星盤) →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 付費會員 4 大尊貴特權專區 (從付費專區合併至此) */}
      <section className="mb-12" id="merged-vip-privileges-section">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP EXCLUSIVE PRIVILEGES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            付費會員獨享尊貴特權一覽
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1">
            除星星幣逐次扣星外，升級付費會員即可全面解鎖以下專屬深度心理學工具
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center text-xl mb-3">
                🪐
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white mb-1.5 flex items-center justify-between">
                <span>無限次撥動天體星盤</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">VIP</span>
              </h3>
              <p className="text-xs text-[#cbd2ef] leading-relaxed">
                享有「✦ 撥動星盤」隨機感應特權，前往付費會員專區每日隨時對齊榮格 12 原型意象頻率與心靈啟示。
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/5">
              <button
                type="button"
                onClick={onGoToPricing}
                className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>前往專屬星盤 →</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-300 flex items-center justify-center text-xl mb-3">
                🚀
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                全站免看廣告 · 免扣星
              </h3>
              <p className="text-xs text-[#cbd2ef] leading-relaxed">
                無論是初步分析還是 Dream Master 深度解夢，均享有全免睇片、免扣星星幣直通四大維度解密。
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/5 text-[11px] font-bold text-blue-400">
              ✓ 無限次深度解讀
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-[#78e1b5] flex items-center justify-center text-xl mb-3">
                🌌
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                星圖高清與 30 晚全息
              </h3>
              <p className="text-xs text-[#cbd2ef] leading-relaxed">
                CONSTELLATION™️ 夢境星圖 4K 高畫質下載，並解鎖 30 晚潛意識成長軌跡全息心理檔案。
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/5 text-[11px] font-bold text-[#78e1b5]">
              ✓ 深度成長檔案
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/30 text-[#c3b9ff] flex items-center justify-center text-xl mb-3">
                📄
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                無限存檔與 PDF 匯出
              </h3>
              <p className="text-xs text-[#cbd2ef] leading-relaxed">
                無上限儲存一生夢境記錄，支援自訂標籤與一鍵匯出排版精美之 PDF 文件隨身珍藏。
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/5 text-[11px] font-bold text-purple-400">
              ✓ 終身數位檔案
            </div>
          </div>
        </div>
      </section>

      {/* 6. 3 Core Rules Columns (睇片賺星規則、消耗明細、有效期保障) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Card 1: 睇片賺星規則 */}
        <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-lg">
            🎬
          </div>
          <h3 className="text-base font-serif font-bold text-white">1. 看廣告如何賺取？</h3>
          <ul className="text-xs text-[#cbd2ef] space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span><b>睇 1 次短片 = 獲得 1 顆星星幣 (+1 ⭐)</b></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>短片內容為頌缽、深呼吸、香氛等身心靈廣告，無雜亂干擾。</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span><b>每天不限觀看次數</b>，隨心儲備，零門檻人人可用。</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="w-full py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/35 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Play className="w-3 h-3 fill-amber-300" />
              <span>觀看廣告獲取星星幣 →</span>
            </button>
          </div>
        </div>

        {/* Card 2: 消耗明細規則 */}
        <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#aa9cff]/20 text-[#c3b9ff] flex items-center justify-center font-bold text-lg">
            🔮
          </div>
          <h3 className="text-base font-serif font-bold text-white">2. 各功能消耗多少幣？</h3>
          <ul className="text-xs text-[#cbd2ef] space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-300 font-bold shrink-0">•</span>
              <span><b>初步分析</b>：消耗 <b>3 顆星星幣</b>（精準意象初探）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-300 font-bold shrink-0">•</span>
              <span><b>Dream Master 深度解夢</b>：直接執行需 <b>6 顆星</b></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-300 font-bold shrink-0">•</span>
              <span><b>升級折抵只需加 3 顆星</b>（已做初析者自動折抵 3 星差額）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#78e1b5] font-bold shrink-0">✓</span>
              <span className="text-[#78e1b5]"><b>凡扣星解鎖之報告永久存檔</b>於帳戶</span>
            </li>
          </ul>
        </div>

        {/* Card 3: 有效期保障 */}
        <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#78e1b5]/20 text-[#78e1b5] flex items-center justify-center font-bold text-lg">
            ⏳
          </div>
          <h3 className="text-base font-serif font-bold text-white">3. 星星幣的有效期？</h3>
          <ul className="text-xs text-[#cbd2ef] space-y-2">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
              <span><b>永久有效 · 永不過期</b>！任何時候均不會清零過期。</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
              <span>即使數月不做夢，帳戶內的星星幣依然隨時待命。</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
              <span>升級為付費 VIP 後，星星幣依然安全保留於帳戶中。</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 7. Feature Rate Comparison Table */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 mb-10">
        <h3 className="text-base font-serif font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-300" />
          <span>解夢功能消耗與永久存檔一覽表</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[#8d97b5]">
                <th className="py-2.5 px-3">功能項目</th>
                <th className="py-2.5 px-3">所需星星幣</th>
                <th className="py-2.5 px-3">等同短片次數</th>
                <th className="py-2.5 px-3">報告存檔權限</th>
                <th className="py-2.5 px-3">VIP 尊享特權</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#cbd2ef]">
              <tr>
                <td className="py-3 px-3 font-semibold text-white">單次免費探索（簡易解析）</td>
                <td className="py-3 px-3 text-[#78e1b5] font-mono">0 星</td>
                <td className="py-3 px-3 text-[#8d97b5]">無需睇片</td>
                <td className="py-3 px-3 text-[#ff8b9d]">❌ 不存檔（當次瀏覽）</td>
                <td className="py-3 px-3 text-[#78e1b5]">免費支援</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">初步意象與情緒分析</td>
                <td className="py-3 px-3 text-amber-300 font-mono font-bold">3 星 ⭐</td>
                <td className="py-3 px-3">睇 3 段心靈短片</td>
                <td className="py-3 px-3 text-[#78e1b5]">✅ 永久保存該報告</td>
                <td className="py-3 px-3 text-[#78e1b5]">免扣星解鎖</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">直接執行 Dream Master 深度解夢</td>
                <td className="py-3 px-3 text-amber-300 font-mono font-bold">6 星 ⭐</td>
                <td className="py-3 px-3">睇 6 段心靈短片</td>
                <td className="py-3 px-3 text-[#78e1b5]">✅ 永久保存四大維度報告</td>
                <td className="py-3 px-3 text-[#78e1b5]">免扣星解鎖</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">初步分析後 ➔ 升級深度解夢</td>
                <td className="py-3 px-3 text-amber-300 font-mono font-bold">加 3 星 ⭐</td>
                <td className="py-3 px-3">補 3 段短片差額</td>
                <td className="py-3 px-3 text-[#78e1b5]">✅ 完整四層報告永久保存</td>
                <td className="py-3 px-3 text-[#78e1b5]">免扣星解鎖</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">CONSTELLATION™️ 夢境星圖</td>
                <td className="py-3 px-3 text-[#aa9cff]">累積 2 個以上解鎖夢境</td>
                <td className="py-3 px-3 text-[#8d97b5]">-</td>
                <td className="py-3 px-3 text-[#78e1b5]">✅ 即時繪製節點連線</td>
                <td className="py-3 px-3 text-[#78e1b5]">高清 4K 下載</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>👑 潛意識天體星盤 (付費會員專區)</span>
                </td>
                <td className="py-3 px-3 text-[#aab3d2]">-</td>
                <td className="py-3 px-3 text-[#aab3d2]">-</td>
                <td className="py-3 px-3 text-[#78e1b5]">✅ 原型深度共振</td>
                <td className="py-3 px-3 text-amber-300 font-bold">👑 付費會員獨享無限撥盤</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. 常見問題 FAQ (從付費專區合併至此) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1224] border border-white/10 mb-10" id="pricing-faq-section">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-serif font-bold text-white">
            常見問題與解答
          </h3>
          <p className="text-xs text-[#cbd2ef] mt-1">
            關於星星幣賺取、報告存檔與付費會員專區權益的所有細節
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {pricingFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-amber-300 cursor-pointer transition-colors"
                >
                  <span className="flex-1">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8d97b5] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-[#cbd2ef] leading-relaxed whitespace-pre-line border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. Bottom Navigation Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#13112a] to-[#0c0d1c] border border-[#aa9cff]/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-sm sm:text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>想要體驗付費會員專屬的「潛意識天體星盤」？</span>
          </div>
          <p className="text-xs text-[#cbd2ef]">
            付費會員專區已升級為 12 宿天體旋轉星盤聖域，尊享無限撥盤感應與榮格原型共振。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onGoToPricing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20 transition-all"
            id="star-coins-bottom-vip-btn"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>👑 前往付費會員專區 (天體星盤)</span>
          </button>

          <button
            type="button"
            onClick={onGoToWorkspace}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>前往解夢工作台</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
