import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Dna,
  Compass,
  BookOpen,
  Lock,
  Star,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface SampleReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToPricing?: () => void;
  onOpenEarnStars?: () => void;
  initialTab?: 'dna' | 'constellation' | 'mystery';
}

export const SampleReportPreviewModal: React.FC<SampleReportPreviewModalProps> = ({
  isOpen,
  onClose,
  onGoToPricing,
  onOpenEarnStars,
  initialTab = 'dna',
}) => {
  const [activeTab, setActiveTab] = useState<'dna' | 'constellation' | 'mystery'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* 典雅明亮容器（徹底告別生硬壓抑黑色，配搭星空藝術幾何紋理與高對比大字型） */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#F5F8FF] via-white to-[#EEF5FF] border-2 border-blue-300 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900">
        
        {/* 背景雅致幾何星圖裝飾水印（避免淨白單調，富藝術感） */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-20 pointer-events-none overflow-hidden select-none">
          <svg viewBox="0 0 200 200" className="w-full h-full text-blue-600">
            <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100 15 L100 185 M15 100 L185 100" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="60" cy="60" r="4" fill="currentColor" />
            <circle cx="140" cy="70" r="5" fill="currentColor" />
            <circle cx="130" cy="140" r="3.5" fill="currentColor" />
            <circle cx="70" cy="130" r="4" fill="currentColor" />
            <line x1="60" y1="60" x2="140" y2="70" stroke="currentColor" strokeWidth="1.5" />
            <line x1="140" y1="70" x2="130" y2="140" stroke="currentColor" strokeWidth="1.5" />
            <line x1="130" y1="140" x2="70" y2="130" stroke="currentColor" strokeWidth="1.5" />
            <line x1="70" y1="130" x2="60" y2="60" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Modal Header */}
        <div className="relative z-10 p-5 sm:p-6 border-b-2 border-blue-200 flex items-center justify-between gap-4 bg-gradient-to-r from-blue-100/90 via-sky-50 to-indigo-100/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md shadow-blue-600/30">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-blue-900 font-extrabold">
                  VISUAL REPORT DEMO
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400 font-black">
                  示範報告
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-950 flex items-center gap-2 mt-0.5">
                大師級報告與星圖示範
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-950 hover:bg-white/90 border border-slate-300 transition-colors cursor-pointer shadow-xs"
            aria-label="關閉預覽"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="relative z-10 px-5 sm:px-6 py-3 bg-amber-100/80 border-b-2 border-amber-300 flex items-center gap-2.5 text-sm text-amber-950 font-bold">
          <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
          <span>
            💡 <b>以下為模擬示範展示</b>，你輸入的真實夢境將生成專屬於你的專題報告。
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 px-5 sm:px-6 pt-3.5 pb-3 flex gap-2.5 border-b-2 border-blue-200 bg-blue-50/60 overflow-x-auto text-sm scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('dna')}
            className={`py-2.5 px-4 rounded-xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'dna'
                ? 'bg-blue-700 text-white shadow-md ring-2 ring-blue-400'
                : 'bg-white text-slate-800 hover:text-blue-900 hover:bg-blue-100 border-2 border-slate-200'
            }`}
          >
            <Dna className="w-4 h-4 text-amber-300" />
            <span>1. DREAM DNA 統計報告示範</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('constellation')}
            className={`py-2.5 px-4 rounded-xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'constellation'
                ? 'bg-blue-700 text-white shadow-md ring-2 ring-blue-400'
                : 'bg-white text-slate-800 hover:text-blue-900 hover:bg-blue-100 border-2 border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-300" />
            <span>2. CONSTELLATION 夢境星圖示範</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mystery')}
            className={`py-2.5 px-4 rounded-xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'mystery'
                ? 'bg-blue-700 text-white shadow-md ring-2 ring-blue-400'
                : 'bg-white text-slate-800 hover:text-blue-900 hover:bg-blue-100 border-2 border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>3. 30 晚全息報告片段示範</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DREAM DNA 統計報告示範 */}
          {activeTab === 'dna' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-blue-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-black text-slate-950 flex items-center gap-2.5">
                    <Dna className="w-6 h-6 text-blue-700" />
                    <span>DREAM DNA™️ 個人潛意識指紋剖析（模擬樣本）</span>
                  </h3>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    模擬累計 14 個夢境所萃取之核心象徵頻率、原型結構與情緒圖譜。
                  </p>
                </div>
                <span className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-950 border-2 border-blue-300 font-black w-fit shadow-xs">
                  個體化轉化期 · 指紋代碼 #DN-8842
                </span>
              </div>

              {/* Mock Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 text-center shadow-sm">
                  <span className="text-xs sm:text-sm text-slate-700 font-bold block">累計分析夢境</span>
                  <b className="text-2xl sm:text-3xl font-mono text-slate-950 font-black mt-1 block">14 次</b>
                  <span className="text-xs text-emerald-800 font-black flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> 潛意識連結率 92%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 text-center shadow-sm">
                  <span className="text-xs sm:text-sm text-slate-700 font-bold block">主導榮格原型</span>
                  <b className="text-xl sm:text-2xl font-serif text-indigo-950 font-black mt-1 block">探索者 / 智者</b>
                  <span className="text-xs text-indigo-800 font-extrabold block mt-1">陰影融合進程 65%</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-sky-200 text-center shadow-sm">
                  <span className="text-xs sm:text-sm text-slate-700 font-bold block">核心高頻象徵</span>
                  <b className="text-xl sm:text-2xl font-serif text-sky-950 font-black mt-1 block">🌊 深海波浪</b>
                  <span className="text-xs text-sky-800 font-extrabold block mt-1">出現 7 次 · 情緒釋放</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-amber-200 text-center shadow-sm">
                  <span className="text-xs sm:text-sm text-slate-700 font-bold block">清明夢自知度</span>
                  <b className="text-2xl sm:text-3xl font-mono text-amber-950 font-black mt-1 block">Level 3.5</b>
                  <span className="text-xs text-amber-800 font-extrabold block mt-1">夢中意識逐漸覺醒</span>
                </div>
              </div>

              {/* Mock Radar & Symbol Frequency Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-white border-2 border-blue-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between text-sm sm:text-base font-black text-slate-950 border-b-2 border-slate-100 pb-2.5">
                    <span>情緒維度分佈（模擬雷達數據）</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900">4 大維度交叉</span>
                  </div>
                  <div className="space-y-4 pt-1">
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm text-slate-800 mb-1.5 font-bold">
                        <span>潛抑渴望與自我實現 (Desire)</span>
                        <span className="font-mono text-blue-900 font-black text-sm">78%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm text-slate-800 mb-1.5 font-bold">
                        <span>日間未消化焦慮釋放 (Anxiety Flush)</span>
                        <span className="font-mono text-amber-900 font-black text-sm">62%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm text-slate-800 mb-1.5 font-bold">
                        <span>原型象徵與靈性啟發 (Archetypal)</span>
                        <span className="font-mono text-emerald-900 font-black text-sm">85%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm text-slate-800 mb-1.5 font-bold">
                        <span>認知記憶鞏固與重組 (Cognitive Rewiring)</span>
                        <span className="font-mono text-indigo-900 font-black text-sm">54%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '54%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border-2 border-blue-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between text-sm sm:text-base font-black text-slate-950 border-b-2 border-slate-100 pb-2.5">
                    <span>高頻象徵演變圖示（模擬樣本）</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-900">動態追蹤</span>
                  </div>
                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border-2 border-blue-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌊</span>
                        <div>
                          <b className="text-slate-950 text-sm block font-black">海洋大水 (出現 7 次)</b>
                          <p className="text-xs text-slate-700 font-semibold">從「被巨浪吞沒」進化為「學會潛水呼吸」</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-black">
                        突破情結
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-sky-50/70 border-2 border-sky-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚪</span>
                        <div>
                          <b className="text-slate-950 text-sm block font-black">未鎖的舊木門 (出現 5 次)</b>
                          <p className="text-xs text-slate-700 font-semibold">象徵對過去童年居所未解羈絆的接納</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-300 font-black">
                        原型顯現
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/70 border-2 border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🦅</span>
                        <div>
                          <b className="text-slate-950 text-sm block font-black">金色飛鷹 (出現 3 次)</b>
                          <p className="text-xs text-slate-700 font-semibold">象徵高維度超脫與新生涯方向指引</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-black">
                        靈性飛躍
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blur Mock Overlay Sample Stamp */}
              <div className="relative p-5 rounded-2xl border-2 border-blue-300 bg-white shadow-sm overflow-hidden">
                <div className="space-y-2 text-sm">
                  <span className="text-sm sm:text-base font-black text-blue-950 block">潛意識敘事指紋 (Narrative Fingerprint 模擬片段)：</span>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed line-clamp-2 font-medium">
                    「當事人的夢境呈現出鮮明的『深海探索者』敘事弧線。初期以追逐與窒息感為保護屏障，在中期透過夢見老家祖屋神枱與鑰匙，開始主動直視內在陰影阿尼姆斯（Animus），展現了強大的心理自我修復能力……」
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-100 via-blue-50/80 to-transparent flex items-end justify-center pb-3">
                  <span className="text-xs sm:text-sm font-mono text-blue-950 font-black flex items-center gap-1.5 bg-white/95 px-4 py-1.5 rounded-xl border border-blue-300 shadow-sm">
                    <Lock className="w-4 h-4 text-blue-700" />
                    <span>真實報告將依據你的專屬夢境紀錄生成專屬 DNA 檔案</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSTELLATION 夢境星圖示範 (已全面移除黑色，改用典雅晴空星圖天幕，字型加大、清晰銳利) */}
          {activeTab === 'constellation' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-blue-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-black text-slate-950 flex items-center gap-2.5">
                    <Compass className="w-6 h-6 text-sky-700" />
                    <span>CONSTELLATION™️ 夢境星圖宇宙連線（模擬樣本）</span>
                  </h3>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    夢境不是孤立碎片，而是相互輝映的心靈星宿網絡。
                  </p>
                </div>
                <span className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-950 border-2 border-sky-300 font-black w-fit shadow-xs">
                  7 顆夢境星節點 · 4 條共鳴連線
                </span>
              </div>

              {/* Constellation Canvas Preview - 典雅晴空湛藍星圖（非黑色，清新明亮高對比） */}
              <div className="relative h-72 sm:h-80 w-full rounded-3xl bg-gradient-to-b from-[#EBF3FF] via-[#E1EFFF] to-[#D5E6FE] border-2 border-sky-300 overflow-hidden flex items-center justify-center p-4 shadow-md">
                {/* 典雅星象背景網格裝飾 */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-blue-200/40" />
                
                {/* SVG Constellation Links */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="22%" y1="36%" x2="50%" y2="22%" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.9" />
                  <line x1="50%" y1="22%" x2="78%" y2="42%" stroke="#3B82F6" strokeWidth="2.5" opacity="0.9" />
                  <line x1="50%" y1="22%" x2="45%" y2="72%" stroke="#059669" strokeWidth="2.5" opacity="0.9" />
                  <line x1="22%" y1="36%" x2="45%" y2="72%" stroke="#4F46E5" strokeWidth="2" opacity="0.8" />
                  <line x1="45%" y1="72%" x2="82%" y2="76%" stroke="#D97706" strokeWidth="2.5" opacity="0.9" />
                </svg>

                {/* Node 1: 深海波濤 */}
                <div className="absolute top-[26%] left-[18%] p-3 rounded-2xl bg-white border-2 border-blue-400 text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-xl">🌊</span>
                  <span className="text-xs sm:text-sm block font-black text-slate-950 whitespace-nowrap">深海波濤 (9/12)</span>
                  <span className="text-xs text-blue-900 font-black block mt-0.5">情緒釋放 · 4 星</span>
                </div>

                {/* Node 2: 舊居神枱 (Center Peak) */}
                <div className="absolute top-[12%] left-[50%] p-3.5 rounded-2xl bg-white border-3 border-amber-500 text-center shadow-xl transform -translate-x-1/2">
                  <span className="text-2xl">🕯️</span>
                  <span className="text-xs sm:text-sm block font-black text-slate-950 whitespace-nowrap">老家祖屋神枱 (9/16)</span>
                  <span className="text-xs text-amber-900 font-black block font-mono mt-0.5">母系原型 · 核心節點</span>
                </div>

                {/* Node 3: 課室考試 */}
                <div className="absolute top-[36%] left-[78%] p-3 rounded-2xl bg-white border-2 border-slate-400 text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-xl">🏫</span>
                  <span className="text-xs sm:text-sm block font-black text-slate-950 whitespace-nowrap">課室交白卷 (9/19)</span>
                  <span className="text-xs text-slate-800 font-extrabold block mt-0.5">冒名頂替綜合症</span>
                </div>

                {/* Node 4: 展翅飛翔 */}
                <div className="absolute bottom-[16%] left-[45%] p-3 rounded-2xl bg-white border-2 border-emerald-500 text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-2xl">🦅</span>
                  <span className="text-xs sm:text-sm block font-black text-slate-950 whitespace-nowrap">夜空金色飛翔 (9/22)</span>
                  <span className="text-xs text-emerald-900 font-black block mt-0.5">個體化突破 · 超脫</span>
                </div>

                {/* Node 5: 森林出口 */}
                <div className="absolute bottom-[14%] left-[82%] p-3 rounded-2xl bg-white border-2 border-amber-400 text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-xl">🌲</span>
                  <span className="text-xs sm:text-sm block font-black text-slate-950 whitespace-nowrap">森林出口 (9/24)</span>
                  <span className="text-xs text-amber-900 font-black block mt-0.5">新旅途啟動</span>
                </div>

                {/* Floating Mock Badge */}
                <div className="absolute bottom-3 left-3 text-xs px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold shadow-md border-2 border-blue-200">
                  ✨ 節點點擊可直接調閱對應夢境歷史
                </div>
              </div>

              {/* Feature Highlights of Constellation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 shadow-sm">
                  <b className="text-slate-950 block mb-1 text-sm sm:text-base font-black">🌟 意象共振連線</b>
                  <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-semibold">
                    AI 自動串聯相同原型之夢，繪製專屬於你的心靈星宿網絡圖譜。
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 shadow-sm">
                  <b className="text-slate-950 block mb-1 text-sm sm:text-base font-black">🔍 點擊星體漫遊</b>
                  <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-semibold">
                    每一顆星代表一場真實夢境，點擊立刻調閱當時的心靈拆解報告。
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 shadow-sm">
                  <b className="text-slate-950 block mb-1 text-sm sm:text-base font-black">🖼️ 高畫質星圖匯出</b>
                  <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-semibold">
                    付費會員可將個人專屬星圖下載為 4K 藝術壁紙與印刷級文稿。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 30 晚全息報告片段示範 */}
          {activeTab === 'mystery' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-blue-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-black text-slate-950 flex items-center gap-2.5">
                    <BookOpen className="w-6 h-6 text-amber-700" />
                    <span>30 NIGHTS MYSTERY™️ 全息總結報告（模擬樣本片段）</span>
                  </h3>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    完成 30 夜夢境探索後，AI 為你生成的專屬個人潛意識宏觀全書。
                  </p>
                </div>
                <span className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 border-2 border-amber-300 font-black w-fit shadow-xs">
                  30 夜深層旅程 · 第 30 晚結業報告
                </span>
              </div>

              {/* Sample Chapters Preview */}
              <div className="space-y-4">
                {/* Chapter 1 */}
                <div className="p-5 rounded-2xl bg-white border-2 border-blue-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-mono text-blue-900 uppercase font-black">Chapter 01 · 潛意識週期演進</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 font-black">
                      已完成比對
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-950">從「無助受縛」走向「意志自主」的情緒轉折線</h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                    在第 1 至 10 晚，夢境中充斥「牙齒脫落」、「考場失語」、「電梯下墜」等典型高壓場景，反映了意識層面對外在控制感的焦慮；而在第 18 晚之後，夢境轉化為「整理房間」、「清澈山泉」、「高空俯瞰」，顯示內心已重組內在安全基地。
                  </p>
                </div>

                {/* Chapter 2 */}
                <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-mono text-amber-900 uppercase font-black">Chapter 02 · 核心情結突破</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 font-black">
                      深度洞察
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-950">直面「陰影（The Shadow）」：不再逃跑的黑衣人</h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                    第 24 晚的關鍵夢境中，你不再繼續狂奔，而是轉身質問黑影。榮格心理學指出，這代表你已成功將過去壓抑在潛意識邊緣的創造力與自我主張重新整合回顯意識人格中。
                  </p>
                </div>

                {/* Chapter 3 with subtle blur */}
                <div className="relative p-5 rounded-2xl bg-white border-2 border-blue-200 shadow-sm space-y-2.5 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-mono text-blue-900 uppercase font-black">Chapter 03 · 未來年度心靈指引</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 border border-slate-300 font-black">大師建議</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-950">為下一個人生週期點亮燈塔的 3 大靈魂行動</h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold line-clamp-2 filter blur-[1.5px]">
                    1. 允許自己放下對完美評價的索求，建立每週一天的離線放空儀式…… 2. 當夢中再次出現大水時，請記住你在第 28 晚學會的浮水技巧…… 3. 勇於開啟延宕已久的個人創作計劃……
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-100 via-blue-50/70 to-transparent flex items-end justify-center pb-3">
                    <span className="text-xs sm:text-sm text-slate-950 font-mono font-black flex items-center gap-1.5 bg-white/95 px-4 py-1.5 rounded-xl border border-blue-300 shadow-sm">
                      <Lock className="w-4 h-4 text-slate-700" />
                      <span>記錄滿 30 晚或 VIP 會員即可生成完整全息書</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fixed Mandatory Disclaimer */}
          <div className="mt-6 p-4 rounded-2xl bg-blue-100/80 border-2 border-blue-300 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-bold">
              <b className="text-slate-950">免責提示：</b>本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="relative z-10 p-5 sm:p-6 border-t-2 border-blue-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-800 flex items-center gap-2 text-center sm:text-left font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>所有報告均由心理學文獻引擎 Book Brain 精密對照生成</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onOpenEarnStars && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEarnStars();
                }}
                className="flex-1 sm:flex-initial py-3 px-4 rounded-xl bg-amber-200 text-amber-950 border-2 border-amber-400 hover:bg-amber-300 text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <Star className="w-4 h-4 fill-amber-500 text-amber-700" />
                <span>睇片儲星解夢 (+1 ⭐)</span>
              </button>
            )}

            {onGoToPricing && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToPricing();
                }}
                className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-700/25 active:scale-95 transition-all"
              >
                <span>解鎖專屬 VIP 方案</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
