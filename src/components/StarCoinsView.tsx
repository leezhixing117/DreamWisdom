import React, { useState } from 'react';
import {
  Star,
  Play,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  ArrowRight,
  HelpCircle,
  Film,
  Zap,
  Check,
  X,
  Crown,
  ChevronDown,
  MessageSquareText,
} from 'lucide-react';
import { User, normalizeRole } from '../types';
import { CustomerInquiryModal } from './CustomerInquiryModal';

interface StarCoinsViewProps {
  currentUser: User | null;
  onOpenEarnStars: () => void;
  onGoToWorkspace: () => void;
  onGoToPricing: () => void;
  onUpgradeToPaid?: () => void;
  onOpenLogin?: () => void;
  onGoToApp?: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
}

export const StarCoinsView: React.FC<StarCoinsViewProps> = ({
  currentUser,
  onOpenEarnStars,
  onGoToWorkspace,
  onGoToPricing,
  onUpgradeToPaid,
  onGoToApp,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<string>('payment_status');

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
    <div className="shell py-8 sm:py-14 max-w-6xl mx-auto space-y-12" id="star-coins-page-root">
      {/* Page Title & Breadcrumb Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>雙軌透明架構 · 星星幣中心與方案權益</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
          星星幣中心 · 儲星消耗與方案全覽
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed font-medium">
          核心原則：<strong className="text-slate-900 font-bold">星星幣 = 免費用戶的探索代幣</strong>，看廣告免費儲幣即可體驗大師級深度解夢；升級付費則直接全解鎖、免看片免扣星。
        </p>

        {/* Current user status indicator */}
        {currentUser && (
          <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-xs text-slate-800 shadow-md">
            <span>目前身份：<strong className="text-blue-700 font-bold">{currentUser.display_name || currentUser.email}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-amber-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>餘額：{stars} 顆星星幣</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-bold">儲存配額：{currentQuota}</span>
          </div>
        )}
      </div>

      {/* Merged Hero Stats & Action Card */}
      <div
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-amber-300 shadow-xl space-y-4"
        id="star-coins-merged-hero-card"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* User Account & Star Balance */}
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="text-xs text-amber-900 font-mono uppercase tracking-wider font-bold">
                {currentUser ? `${currentUser.display_name || currentUser.email} 的帳戶` : '目前訪客狀態'}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-amber-600 font-mono">{stars}</span>
                <span className="text-sm text-slate-800 font-bold">顆星星幣餘額</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {isPaid
                  ? '💎 尊貴 VIP 會員：享有「免扣星」無限次深度解夢，星星幣永保留存！'
                  : '⭐ 一般會員：可自由扣星解鎖深度心理學剖析，解鎖紀錄永久保存。'}
              </p>
            </div>
          </div>

          {/* Action Buttons Row (Includes Free Earn, Inquiry Button, and Workspace Link) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
            {/* 1. 睇廣告獲取星星幣 */}
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-98"
              id="star-coins-hero-earn-btn"
            >
              <Film className="w-4 h-4" />
              <span>觀看廣告獲取星星幣 (+1 顆 ⭐)</span>
            </button>

            {/* 2. 客服與訂單查詢按鈕 (可選 是否到賬, 送貨安排, 退款安排 等) */}
            <button
              type="button"
              onClick={() => {
                setInquiryCategory('payment_status');
                setIsInquiryOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 hover:text-blue-950 text-xs sm:text-sm border-2 border-blue-200 hover:border-blue-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-[1.02] active:scale-98"
              id="star-coins-inquiry-btn"
              title="點擊查詢是否到賬、送貨安排、退款安排等客戶服務"
            >
              <MessageSquareText className="w-4 h-4 text-blue-700" />
              <span>客服與訂單查詢</span>
            </button>

            {/* 3. 前往解夢工作台 */}
            <button
              type="button"
              onClick={onGoToWorkspace}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm border-2 border-slate-300 hover:border-slate-400 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>解夢工作台</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Free Earning & Instant Tip Stripe */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/50 to-blue-50/50 border border-amber-200 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-lg bg-amber-200/80 text-amber-900 text-xs font-black shrink-0">
              📺
            </span>
            <div className="font-medium text-slate-800">
              <span className="font-bold text-amber-950 mr-1.5">立即免費獲取星星幣：</span>
              點擊「觀看廣告」即睇 15~30 秒身心靈放鬆短片廣告，播完即入帳 (+1 顆星 ⭐)，永久有效不作廢！
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setInquiryCategory('payment_status');
                setIsInquiryOpen(true);
              }}
              className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer text-xs"
            >
              有付款/到賬/送貨疑問？點此查詢
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Rules Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 睇片賺星規則 */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold text-lg">
            🎬
          </div>
          <h3 className="text-base font-serif font-black text-slate-900">1. 看廣告如何賺取？</h3>
          <ul className="text-xs text-slate-700 space-y-2 font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-900">睇 1 次短片 = 獲得 1 顆星星幣 (+1 ⭐)</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>短片內容為頌缽、深呼吸、香氛等身心靈廣告，無雜亂干擾。</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-900">每天不限觀看次數</strong>，隨心儲備，零門檻人人可用。</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Play className="w-3 h-3 fill-amber-700" />
              <span>觀看廣告獲取星星幣 →</span>
            </button>
          </div>
        </div>

        {/* Card 2: 消耗明細規則 */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 border border-blue-300 flex items-center justify-center font-bold text-lg">
            🔮
          </div>
          <h3 className="text-base font-serif font-black text-slate-900">2. 各功能消耗多少幣？</h3>
          <ul className="text-xs text-slate-700 space-y-2 font-medium">
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-600 font-bold shrink-0">•</span>
              <span><strong className="text-slate-900">初步分析</strong>：消耗 <strong className="text-amber-700 font-bold">3 顆星星幣</strong>（精準意象初探）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-600 font-bold shrink-0">•</span>
              <span><strong className="text-slate-900">Dream Master 深度解夢</strong>：直接執行需 <strong className="text-amber-700 font-bold">6 顆星</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-600 font-bold shrink-0">•</span>
              <span><strong className="text-slate-900">升級折抵只需加 3 顆星</strong>（已做初析者自動折抵 3 星差額）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-600 font-bold shrink-0">✓</span>
              <span className="text-emerald-800 font-bold">凡扣星解鎖之報告永久存檔於帳戶</span>
            </li>
          </ul>
        </div>

        {/* Card 3: 有效期保障 */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center font-bold text-lg">
            ⏳
          </div>
          <h3 className="text-base font-serif font-black text-slate-900">3. 星星幣的有效期？</h3>
          <ul className="text-xs text-slate-700 space-y-2 font-medium">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-900">永久有效 · 永不過期</strong>！任何時候均不會清零過期。</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>即使數月不做夢，帳戶內的星星幣依然隨時待命。</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>升級為付費 VIP 後，星星幣依然安全保留於帳戶中。</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 💎 方案全覽：三階探索方案（合併自付費專區） */}
      <section className="pt-4" id="merged-pricing-plans-section">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>會員方案全覽 · PRICING & TIERS</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            選擇適合你的探索方式
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium">
            免費用戶可透過短片儲幣逐次解鎖，亦可隨時啟用付費 VIP 尊享全免扣星與無限特權。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {/* CARD 1: 🆓 免費探索 */}
          <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-slate-200 bg-white hover:border-slate-300 shadow-lg transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Free Tier</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  毋須付款
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 flex items-center gap-2">
                <span>🆓 免費探索</span>
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[36px] font-medium">
                輸入夢境獲取即時單次簡易解析；<strong className="text-slate-900">免費探索不提供夢境儲存</strong>，解析結果僅供當次即時瀏覽體驗。
              </p>

              <div className="my-5 pb-5 border-b border-slate-200">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">HK$0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ 永久免費</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1 font-mono font-bold">
                  無需星星幣 · 即開即試
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">包含功能：</div>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>即時單次簡易分析（意象提取 + 日常啟示）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>廣東話語音輸入即時轉文字</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>匿名私隱模式，支援隨時抹除本機緩存</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong className="text-rose-600">不支援夢境日記儲存</strong>（僅供當次即時瀏覽）</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>無 AI 深入解密（四層心理深度剖析，需星星幣或付費）</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>無 CONSTELLATION™️ 互動星圖連線</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onGoToWorkspace}
                className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold hover:border-slate-400"
              >
                <span>立即開始免費探索</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 2: ⭐ 星星幣按需儲存 */}
          <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-amber-300 bg-gradient-to-b from-amber-50/60 to-white shadow-xl relative">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" />
              <span>免費用戶最愛</span>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-bold">Watch & Earn</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300 font-bold">
                  睇短片免費賺
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 flex items-center gap-2">
                <span>⭐ 星星幣按需解鎖</span>
              </h2>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed min-h-[36px] font-medium">
                消耗星星幣，逐次開啟深度解夢；<strong className="text-amber-900 font-bold">凡扣星解鎖之夢境報告永久保存於帳戶</strong>，隨時查閱。
              </p>

              <div className="my-5 pb-5 border-b border-slate-200">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-700 font-mono">0 元</span>
                  <span className="text-xs text-slate-600 font-bold">/ 睇短片換星</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-amber-800 font-bold">目前擁有：{stars} 顆星</span>
                  <button
                    type="button"
                    onClick={onOpenEarnStars}
                    className="text-[11px] text-blue-700 underline font-bold cursor-pointer"
                  >
                    + 睇片儲星
                  </button>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">星星幣權益：</div>
                <ul className="space-y-2 text-slate-800">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 font-bold">初步意象與情緒分析</strong>：消耗 3 顆星</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 font-bold">Dream Master 深度解密</strong>：消耗 6 顆星</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-blue-900 font-bold">升級折抵機制</strong>：初析後升級只需補加 3 顆星</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-800 font-bold">永久報告保存</strong>：凡扣星解鎖報告永久保存在日記中</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">星星幣永久有效</strong>，永不過期</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>高清 4K 星圖下載與 PDF 匯出備份需付費 VIP 權限</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={onOpenEarnStars}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>免費睇短片儲星 (+1 顆 ⭐)</span>
              </button>
            </div>
          </div>

          {/* CARD 3: 💎 付費進階方案 */}
          <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-blue-600 bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white shadow-xl shadow-blue-600/10 relative">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold">Unlimited Premium</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-bold">
                  全功能解鎖
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 flex items-center gap-2">
                <span>💎 付費進階方案</span>
              </h2>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed min-h-[36px] font-medium">
                一次開晒全部功能：完整互動星圖、30 日全息報告、無限儲存、PDF 匯出備份，完全唔使睇廣告！
              </p>

              {/* Billing switcher: 月費 / 年費 / 終身 */}
              <div className="my-4 p-1 rounded-xl bg-slate-200/80 border border-slate-300 flex items-center text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                    billingCycle === 'monthly' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:text-blue-900'
                  }`}
                >
                  月費方案
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center relative ${
                    billingCycle === 'yearly' ? 'bg-blue-700 text-white shadow-sm' : 'text-amber-800 hover:text-amber-900'
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
                  className={`py-1.5 px-2.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                    billingCycle === 'lifetime' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:text-blue-900'
                  }`}
                >
                  終身
                </button>
              </div>

              {/* Price & Billing Cycle Display */}
              <div className="pb-4 mb-4 border-b border-slate-200">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-blue-700 font-mono">
                    {billingCycle === 'yearly'
                      ? 'HK$298'
                      : billingCycle === 'monthly'
                      ? 'HK$38'
                      : 'HK$588'}
                  </span>
                  <span className="text-xs text-slate-600 font-bold">
                    {billingCycle === 'yearly'
                      ? '/ 年費 (HKD)'
                      : billingCycle === 'monthly'
                      ? '/ 月費 (HKD)'
                      : '/ 終身買斷 (HKD)'}
                  </span>
                </div>

                {billingCycle === 'yearly' && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                    <span>🔥 年費限時特惠：折合約 HK$24.8 / 月 · 享 35% 優惠（即慳 HK$158）！</span>
                  </div>
                )}

                <p className="text-[11px] text-emerald-800 mt-1.5 font-mono font-bold">
                  {billingCycle === 'yearly'
                    ? '週期：按年扣款 · 全年無限解夢 · 送完整星圖與 30 晚檔案'
                    : billingCycle === 'monthly'
                    ? '週期：按月扣款 · 彈性自由 · 隨時可取消訂閱無合約束縛'
                    : '週期：一次付款 · 終生永久無限探索潛意識'}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">全部特權直通解鎖：</div>
                <ul className="space-y-2 text-slate-800">
                  <li className="flex items-start gap-2 font-semibold text-slate-900">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-blue-900">全免扣星尊享特權</strong>：無限次直接執行初步分析與 Dream Master 深度解夢，免看片免扣星</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">完整 CONSTELLATION™️ 可交互夢境星圖</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">30 NIGHTS MYSTERY™️ 最終全息完整報告</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">無限夢境存檔</strong>（無數量上限，記得你一生的夢）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">所有夢境記錄可匯出 PDF 檔案</strong> 隨身珍藏</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>天體星盤 12 宿心理原型撥動感應特權</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              {isPaid ? (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs text-center font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>你現已尊享付費會員全部特權！</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onUpgradeToPaid}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-extrabold text-xs justify-center cursor-pointer shadow-lg shadow-blue-700/20 flex items-center gap-2 transition-all active:scale-[0.98]"
                  id="star-coins-upgrade-btn"
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
      </section>

      {/* FULL FEATURE COMPARISON TABLE (功能詳細對比表格) */}
      <section className="pt-4" id="feature-comparison-table-section">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>三種方案權益透明對比 · FEATURE MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            方案功能一覽表
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1.5 font-medium">
            無論你想即時零門檻試玩、睇片儲星解鎖，定係一次擁有全功能，權益完全透明。
          </p>
        </div>

        <div className="rounded-3xl border-2 border-slate-200 bg-white overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-[36%]">
                    功能項目
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-900 text-center w-[21%]">
                    <span className="block font-serif text-sm font-bold">🆓 免費探索</span>
                    <span className="text-[10px] text-slate-500 font-semibold font-mono">HK$0 永久免費</span>
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-amber-900 text-center w-[21%] bg-amber-50/70 border-x border-amber-200/60">
                    <span className="block font-serif text-sm flex items-center justify-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>⭐ 星星幣體驗</span>
                    </span>
                    <span className="text-[10px] text-amber-800 font-bold font-mono">睇短片賺幣 (每次+1星)</span>
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-blue-900 text-center w-[22%] bg-blue-50/70 border-x border-blue-200/60">
                    <span className="block font-serif text-sm flex items-center justify-center gap-1 text-blue-950 font-bold">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      <span>💎 付費 VIP 進階</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold font-mono">HK$38/月 或 HK$298/年</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {/* CATEGORY 1: 基礎夢境記錄 */}
                <tr className="bg-slate-100/90 border-y border-slate-200">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    壹 · 夢境記錄與儲存權益
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">即時簡易分析</div>
                    <div className="text-[11px] text-slate-600">主意象提取、當前情緒梳理、日常心靈提示</div>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-700">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-slate-600 font-medium block">當次瀏覽</span>
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-amber-900 font-bold block">扣 3 星永久保存</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-emerald-700 font-bold block">無限次使用</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">夢境日記歷史儲存</div>
                    <div className="text-[11px] text-slate-600">跨裝置同步、歷史回顧與個人夢境檔案管理</div>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-600">
                    <X className="w-4 h-4 mx-auto text-rose-500" />
                    <span className="text-[10px] text-rose-600 font-bold block">不提供存檔</span>
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <span className="font-mono text-xs font-bold text-amber-900">永久保存</span>
                    <span className="text-[10px] text-slate-600 block">凡扣星解鎖報告永久存檔</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <span className="font-mono text-xs font-bold text-emerald-700">無限永久存檔</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">無條數上限</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">香港本土與華人家宅象徵對照</div>
                    <div className="text-[11px] text-slate-600">神枱香火、舊居祖屋、公屋長廊、叮叮電車、茶餐廳等原型解碼</div>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">
                    <span className="text-[11px] font-semibold">基礎識別</span>
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-amber-900 font-bold block">深度家庭情結剖析</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-blue-900 font-bold block">完整深層文化層解析</span>
                  </td>
                </tr>

                {/* CATEGORY 2: 深度心理學剖析 */}
                <tr className="bg-slate-100/90 border-y border-slate-200">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    貳 · 深度心理學剖析 (Dream Master)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">Dream Master 深度分析</div>
                    <div className="text-[11px] text-slate-600">榮格分析心理學、潛意識陰影、心靈天平平衡補償</div>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500">
                    <X className="w-4 h-4 mx-auto text-rose-400" />
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <span className="font-mono text-xs font-bold text-amber-900">6 顆星 ⭐</span>
                    <span className="text-[10px] text-slate-600 block">初析後升級只需 +3 星</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <span className="font-mono text-xs font-bold text-emerald-700">全免扣星無限次</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">免看片免扣星</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">Book Brain 典籍出處與頁碼引用</div>
                    <div className="text-[11px] text-slate-600">比對榮格、弗洛伊德與華人典籍，拒絕憑空胡猜</div>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500">
                    <X className="w-4 h-4 mx-auto text-rose-400" />
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-700 bg-amber-50/20 border-x border-amber-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                  </td>
                  <td className="py-3 px-5 text-center text-emerald-700 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                  </td>
                </tr>

                {/* CATEGORY 3: 長期心靈檔案 */}
                <tr className="bg-slate-100/90 border-y border-slate-200">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    叄 · 長期心靈指紋與星圖網絡
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">DREAM DNA™️ 夢境指紋雷達</div>
                    <div className="text-[11px] text-slate-600">統計高頻出現意象、時間軸情緒光譜與潛意識演進</div>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500">
                    <X className="w-4 h-4 mx-auto text-rose-400" />
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <span className="text-[11px] font-bold text-amber-900">星星幣解鎖</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-emerald-700 font-bold block">動態實時演進</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">CONSTELLATION™️ 互動式夢境星圖</div>
                    <div className="text-[11px] text-slate-600">跨時空夢境連線、星系節點可視化網絡、高清星圖下載</div>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500">
                    <X className="w-4 h-4 mx-auto text-rose-400" />
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <span className="text-[11px] font-bold text-amber-900">星星幣解鎖</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-emerald-700 font-bold block">完整交互 + 高清下載</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">30 NIGHTS MYSTERY™️ 偵探解密旅程</div>
                    <div className="text-[11px] text-slate-600">連續 30 晚潛意識拼圖、終身全息報告書與年度行動指南</div>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500">
                    <X className="w-4 h-4 mx-auto text-rose-400" />
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <span className="text-[11px] font-bold text-amber-900">逐步解鎖線索</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-emerald-700 font-bold block">解鎖全息報告與指南</span>
                  </td>
                </tr>

                {/* CATEGORY 4: 服務與尊享特權 */}
                <tr className="bg-slate-100/90 border-y border-slate-200">
                  <td colSpan={4} className="py-2.5 px-5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    肆 · 格式匯出與尊享特權
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">匯出 PDF 檔案</div>
                    <div className="text-[11px] text-slate-600">精美版面排版，可匯出為 PDF 檔案隨身備份珍藏</div>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500">
                    <X className="w-4 h-4 mx-auto text-rose-400" />
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500 bg-amber-50/20 border-x border-amber-200/40">
                    <X className="w-4 h-4 mx-auto text-rose-400" />
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-emerald-700 font-bold block">一鍵匯出 PDF</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-800">
                    <div className="font-bold text-slate-900">免看短片廣告 / 零等待尊享通道</div>
                    <div className="text-[11px] text-slate-600">享受純淨專注的心靈日記體驗，AI 運算優先通道</div>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    <span className="text-[11px] font-semibold">標準運算</span>
                  </td>
                  <td className="py-3 px-4 text-center text-amber-900 bg-amber-50/20 border-x border-amber-200/40">
                    <span className="text-[11px] font-bold text-amber-900">需睇片儲星</span>
                  </td>
                  <td className="py-3 px-5 text-center text-blue-900 bg-blue-50/20 border-x border-blue-200/40">
                    <Check className="w-4 h-4 mx-auto text-emerald-600" />
                    <span className="text-[10px] text-emerald-700 font-bold block">完全免廣告 · 優先通道</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer Callout */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">所有方案均享有「絕不用戶夢境數據訓練外部通用 AI 模型」最高私隱保護承諾</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenEarnStars}
                className="px-3.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 font-bold border border-amber-300 hover:bg-amber-200 cursor-pointer transition-colors"
              >
                免費睇片儲星 (+1 ⭐)
              </button>
              {onUpgradeToPaid && (
                <button
                  type="button"
                  onClick={onUpgradeToPaid}
                  className="px-4 py-1.5 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 cursor-pointer shadow-md transition-colors"
                >
                  立即啟用 VIP
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & STAR COIN FAQ ACCORDION (合併自付費專區) */}
      <section className="max-w-3xl mx-auto pt-6 border-t-2 border-slate-200" id="pricing-faq-section">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
            關於星星幣與方案的常見問題
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">清晰明確，杜絕任何隱形收費與規則陷阱</p>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="card rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-300 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p className="whitespace-pre-line">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct link to 天體星盤 (付費專區) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-blue-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/30 text-amber-900 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <b className="text-slate-900 text-sm block font-black">探索「付費會員專區 · 潛意識天體星盤」</b>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              12 宿心理原型共振儀，按住圓盤隨意探索天體軌道，付費會員享專屬撥動感應特權。
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onGoToPricing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-amber-500/20 transition-all shrink-0"
        >
          前往付費會員專區天體星盤 →
        </button>
      </div>

      {/* 客戶服務與訂單查詢彈窗 (可選 是否到賬, 送貨安排, 退款安排 等) */}
      <CustomerInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        currentUser={currentUser}
        defaultCategory={inquiryCategory}
      />
    </div>
  );
};
