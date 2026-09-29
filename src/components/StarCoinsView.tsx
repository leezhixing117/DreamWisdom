import React from 'react';
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
  Gift,
} from 'lucide-react';
import { User, normalizeRole } from '../types';

interface StarCoinsViewProps {
  currentUser: User | null;
  onOpenEarnStars: () => void;
  onGoToWorkspace: () => void;
  onGoToPricing: () => void;
}

export const StarCoinsView: React.FC<StarCoinsViewProps> = ({
  currentUser,
  onOpenEarnStars,
  onGoToWorkspace,
  onGoToPricing,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
  const stars = currentUser?.stars ?? 0;

  return (
    <div className="shell py-8 sm:py-14 max-w-5xl mx-auto" id="star-coins-page-root">
      {/* Page Title & Breadcrumb Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>零元體驗 · 睇片儲星雙軌制</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
          星星幣中心 · 賺取與消耗全明細
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed font-medium">
          不花一分錢，透過觀看身心靈隨機短片賺取「星星幣」，自由體驗大師級深度解夢！
        </p>
      </div>

      {/* Top Prominent Action Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-blue-50 border-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold text-xl shrink-0 shadow">
            📺
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>立即免費獲取星星幣</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold font-mono">
                +1 顆星 ⭐
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-0.5 font-medium">
              點擊即睇 15~30 秒身心靈放鬆短片廣告，播完即入帳，永久有效不作廢！
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEarnStars}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all shrink-0 hover:scale-[1.02]"
          id="star-coins-top-direct-btn"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>觀看廣告獲取星星幣</span>
        </button>
      </div>

      {/* Hero Stats Card: Current Balance & Instant Earning Action */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shrink-0 shadow-sm">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs text-amber-900 font-mono uppercase tracking-wider font-bold">
              {currentUser ? `${currentUser.display_name || currentUser.email} 的帳戶` : '目前訪客狀態'}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-600 font-mono">{stars}</span>
              <span className="text-sm text-slate-700 font-bold">顆星星幣餘額</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
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
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            id="star-coins-hero-earn-btn"
          >
            <Film className="w-4 h-4" />
            <span>觀看廣告獲取星星幣 (+1 顆 ⭐)</span>
          </button>

          <button
            type="button"
            onClick={onGoToWorkspace}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs border-2 border-slate-300 hover:border-blue-600 hover:text-blue-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>前往解夢工作台</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Core Rules Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
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
              <span><strong className="text-slate-900">初步分析</strong>：消耗 <strong className="text-amber-700">3 顆星星幣</strong>（精準意象初探）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-600 font-bold shrink-0">•</span>
              <span><strong className="text-slate-900">Dream Master 深度解夢</strong>：直接執行需 <strong className="text-amber-700">6 顆星</strong></span>
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

      {/* Feature Rate Comparison Table */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xl mb-10">
        <h3 className="text-base font-serif font-black text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>解夢功能消耗與永久存檔一覽表</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-2.5 px-3 font-bold">功能項目</th>
                <th className="py-2.5 px-3 font-bold">所需星星幣</th>
                <th className="py-2.5 px-3 font-bold">等同短片次數</th>
                <th className="py-2.5 px-3 font-bold">報告存檔權限</th>
                <th className="py-2.5 px-3 font-bold">VIP 尊享特權</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">單次免費探索（簡易解析）</td>
                <td className="py-3 px-3 text-emerald-700 font-mono font-bold">0 星</td>
                <td className="py-3 px-3 text-slate-500">無需睇片</td>
                <td className="py-3 px-3 text-rose-600 font-bold">❌ 不存檔（當次瀏覽）</td>
                <td className="py-3 px-3 text-emerald-700 font-semibold">免費支援</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">初步意象與情緒分析</td>
                <td className="py-3 px-3 text-amber-700 font-mono font-bold">3 星 ⭐</td>
                <td className="py-3 px-3 font-medium">睇 3 段心靈短片</td>
                <td className="py-3 px-3 text-emerald-700 font-bold">✅ 永久保存該報告</td>
                <td className="py-3 px-3 text-emerald-700 font-semibold">免扣星解鎖</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">直接執行 Dream Master 深度解夢</td>
                <td className="py-3 px-3 text-amber-700 font-mono font-bold">6 星 ⭐</td>
                <td className="py-3 px-3 font-medium">睇 6 段心靈短片</td>
                <td className="py-3 px-3 text-emerald-700 font-bold">✅ 永久保存四大維度報告</td>
                <td className="py-3 px-3 text-emerald-700 font-semibold">免扣星解鎖</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">初步分析後 ➔ 升級深度解夢</td>
                <td className="py-3 px-3 text-amber-700 font-mono font-bold">加 3 星 ⭐</td>
                <td className="py-3 px-3 font-medium">補 3 段短片差額</td>
                <td className="py-3 px-3 text-emerald-700 font-bold">✅ 完整四層報告永久保存</td>
                <td className="py-3 px-3 text-emerald-700 font-semibold">免扣星解鎖</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">CONSTELLATION™️ 夢境星圖</td>
                <td className="py-3 px-3 text-blue-700 font-semibold">累積 2 個以上解鎖夢境</td>
                <td className="py-3 px-3 text-slate-500">-</td>
                <td className="py-3 px-3 text-emerald-700 font-bold">✅ 即時繪製節點連線</td>
                <td className="py-3 px-3 text-emerald-700 font-semibold">高清 4K 下載</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <b className="text-slate-900 text-sm block font-black">想彻底擺脫睇片與扣星？</b>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            付費 VIP 會員享無限次免廣告、免扣星深度解夢，無上限存檔與 PDF 匯出隨身珍藏。
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToPricing}
          className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-700/20 transition-all shrink-0"
        >
          查看 VIP 付費方案 →
        </button>
      </div>
    </div>
  );
};
