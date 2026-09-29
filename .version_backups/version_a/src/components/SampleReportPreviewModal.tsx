import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Dna,
  Compass,
  BookOpen,
  Eye,
  Lock,
  Star,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
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

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#13112a] via-[#0d1024] to-[#080a18] border border-[#aa9cff]/35 rounded-3xl shadow-2xl shadow-[#aa9cff]/15 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#aa9cff]/20 border border-[#aa9cff]/40 flex items-center justify-center text-xl shrink-0 text-[#c3b9ff]">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#aa9cff]">Visual Sample Preview</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                  樣品預覽
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2 mt-0.5">
                大師級報告與星圖示範
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#8d97b5] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="關閉預覽"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner: Crucial Mandatory Requirement */}
        <div className="px-5 sm:px-6 py-2.5 bg-amber-400/10 border-b border-amber-400/25 flex items-center gap-2 text-xs text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="font-medium">
            💡 <b>以下為模擬示範</b>，你的報告會根據真實夢境生成。
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 sm:px-6 pt-4 pb-2 flex gap-2 border-b border-white/5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('dna')}
            className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dna'
                ? 'bg-[#aa9cff] text-black shadow-md shadow-[#aa9cff]/20'
                : 'text-[#cbd2ef] hover:bg-white/5'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>1. DREAM DNA 統計報告示範</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('constellation')}
            className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'constellation'
                ? 'bg-[#71d9ff] text-black shadow-md shadow-[#71d9ff]/20'
                : 'text-[#cbd2ef] hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>2. CONSTELLATION 夢境星圖示範</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mystery')}
            className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mystery'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'text-[#cbd2ef] hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. 30 晚全息報告片段示範</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DREAM DNA 統計報告示範 */}
          {activeTab === 'dna' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Dna className="w-5 h-5 text-[#aa9cff]" />
                    <span>DREAM DNA™️ 個人潛意識指紋剖析（模擬樣本）</span>
                  </h3>
                  <p className="text-xs text-[#aab3d2] mt-0.5">
                    模擬累計 14 個夢境所萃取之核心象徵頻率、原型結構與情緒圖譜。
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#aa9cff]/15 text-[#c3b9ff] border border-[#aa9cff]/30 w-fit">
                  個體化轉化期 · 指紋代碼 #DN-8842
                </span>
              </div>

              {/* Mock Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[11px] text-[#8d97b5] block">累計分析夢境</span>
                  <b className="text-xl font-mono text-white mt-1 block">14 次</b>
                  <span className="text-[10px] text-[#78e1b5]">潛意識連結率 92%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[11px] text-[#8d97b5] block">主導榮格原型</span>
                  <b className="text-xl font-mono text-[#aa9cff] mt-1 block">探索者 / 智者</b>
                  <span className="text-[10px] text-[#aab3d2]">陰影融合進程 65%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[11px] text-[#8d97b5] block">核心高頻象徵</span>
                  <b className="text-xl font-mono text-[#71d9ff] mt-1 block">🌊 深海波浪</b>
                  <span className="text-[10px] text-[#71d9ff]">出現 7 次 · 情緒釋放</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[11px] text-[#8d97b5] block">清明夢自知度</span>
                  <b className="text-xl font-mono text-amber-300 mt-1 block">Level 3.5</b>
                  <span className="text-[10px] text-amber-200/80">夢中意識逐漸覺醒</span>
                </div>
              </div>

              {/* Mock Radar & Symbol Frequency Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>情緒維度分佈（模擬雷達數據）</span>
                    <span className="text-[11px] text-[#8d97b5]">4 大維度交叉</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-[#cbd2ef] mb-1">
                        <span>潛抑渴望與自我實現 (Desire)</span>
                        <span className="font-mono text-[#aa9cff]">78%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#aa9cff] to-[#71d9ff] rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#cbd2ef] mb-1">
                        <span>日間未消化焦慮釋放 (Anxiety Flush)</span>
                        <span className="font-mono text-amber-300">62%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: '62%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#cbd2ef] mb-1">
                        <span>原型象徵與靈性啟發 (Archetypal)</span>
                        <span className="font-mono text-[#78e1b5]">85%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#78e1b5] to-[#71d9ff] rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#cbd2ef] mb-1">
                        <span>認知記憶鞏固與重組 (Cognitive Rewiring)</span>
                        <span className="font-mono text-[#71d9ff]">54%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#71d9ff] to-[#aa9cff] rounded-full" style={{ width: '54%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>高頻象徵演變圖示（模擬樣本）</span>
                    <span className="text-[11px] text-[#8d97b5]">動態追蹤</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🌊</span>
                        <div>
                          <b className="text-white">海洋大水 (出現 7 次)</b>
                          <p className="text-[10px] text-[#8d97b5]">從「被巨浪吞沒」進化為「學會潛水呼吸」</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#78e1b5]/15 text-[#78e1b5]">突破情結</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🚪</span>
                        <div>
                          <b className="text-white">未鎖的舊木門 (出現 5 次)</b>
                          <p className="text-[10px] text-[#8d97b5]">象徵對過去童年居所未解羈絆的接納</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#aa9cff]/15 text-[#c3b9ff]">原型顯現</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🦅</span>
                        <div>
                          <b className="text-white">金色飛鷹 (出現 3 次)</b>
                          <p className="text-[10px] text-[#8d97b5]">象徵高維度超脫與新生涯方向指引</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300">靈性飛躍</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blur Mock Overlay Sample Stamp */}
              <div className="relative p-4 rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-[#c3b9ff] block">潛意識敘事指紋 (Narrative Fingerprint 模擬片段)：</span>
                  <p className="text-[#aab3d2] leading-relaxed line-clamp-2">
                    「當事人的夢境呈現出鮮明的『深海探索者』敘事弧線。初期以追逐與窒息感為保護屏障，在中期透過夢見老家祖屋神枱與鑰匙，開始主動直視內在陰影阿尼姆斯（Animus），展現了強大的心理自我修復能力……」
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a18] via-transparent to-transparent flex items-end justify-center pb-2">
                  <span className="text-[11px] font-mono text-[#8d97b5] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>真實報告將依據你的夢境生成專屬 DNA 檔案</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSTELLATION 夢境星圖示範 */}
          {activeTab === 'constellation' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#71d9ff]" />
                    <span>CONSTELLATION™️ 夢境星圖宇宙連線（模擬樣本）</span>
                  </h3>
                  <p className="text-xs text-[#aab3d2] mt-0.5">
                    夢境不是孤立碎片，而是相互輝映的星宿網絡。
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#71d9ff]/15 text-[#71d9ff] border border-[#71d9ff]/30 w-fit">
                  7 顆夢境星節點 · 4 條共鳴連線
                </span>
              </div>

              {/* Mock Constellation Interactive Canvas Mockup */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-[#060814] via-[#0b1227] to-[#120a22] border border-[#71d9ff]/30 overflow-hidden flex items-center justify-center p-4">
                {/* Background Star field effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#aa9cff]/15 via-transparent to-transparent" />
                <div className="absolute w-2 h-2 rounded-full bg-white top-8 left-12 animate-pulse" />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-[#71d9ff] top-20 right-24 animate-ping" />
                <div className="absolute w-2 h-2 rounded-full bg-amber-300 bottom-12 left-32" />
                <div className="absolute w-1 h-1 rounded-full bg-white bottom-20 right-16" />

                {/* Mock SVG Constellation Links */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25%" y1="35%" x2="50%" y2="25%" stroke="#71d9ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="50%" y1="25%" x2="75%" y2="45%" stroke="#aa9cff" strokeWidth="2" opacity="0.7" />
                  <line x1="50%" y1="25%" x2="45%" y2="70%" stroke="#78e1b5" strokeWidth="1.5" opacity="0.5" />
                  <line x1="25%" y1="35%" x2="45%" y2="70%" stroke="#e1a8ff" strokeWidth="1.2" opacity="0.5" />
                  <line x1="45%" y1="70%" x2="80%" y2="75%" stroke="#ffd166" strokeWidth="1.5" opacity="0.6" />
                </svg>

                {/* Node 1: 深海波濤 */}
                <div className="absolute top-[28%] left-[20%] p-2 rounded-xl bg-black/60 border border-[#71d9ff]/50 backdrop-blur-sm text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-xs">🌊</span>
                  <span className="text-[10px] block font-bold text-[#71d9ff] whitespace-nowrap">深海波濤 (9/12)</span>
                  <span className="text-[9px] text-[#aab3d2] block">情緒釋放 · 4 星</span>
                </div>

                {/* Node 2: 舊居神枱 (Center Peak) */}
                <div className="absolute top-[18%] left-[50%] p-2.5 rounded-xl bg-black/80 border-2 border-[#aa9cff] backdrop-blur-sm text-center shadow-xl shadow-[#aa9cff]/20 transform -translate-x-1/2">
                  <span className="text-sm">🕯️</span>
                  <span className="text-[11px] block font-bold text-white whitespace-nowrap">老家祖屋神枱 (9/16)</span>
                  <span className="text-[9px] text-amber-300 block font-mono">母系原型 · 核心節點</span>
                </div>

                {/* Node 3: 課室考試 */}
                <div className="absolute top-[38%] left-[75%] p-2 rounded-xl bg-black/60 border border-white/20 backdrop-blur-sm text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-xs">🏫</span>
                  <span className="text-[10px] block font-bold text-white whitespace-nowrap">課室交白卷 (9/19)</span>
                  <span className="text-[9px] text-[#8d97b5] block">冒名頂替綜合症</span>
                </div>

                {/* Node 4: 展翅飛翔 */}
                <div className="absolute bottom-[20%] left-[45%] p-2.5 rounded-xl bg-black/75 border border-[#78e1b5]/60 backdrop-blur-sm text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-sm">🦅</span>
                  <span className="text-[10px] block font-bold text-[#78e1b5] whitespace-nowrap">夜空金色飛翔 (9/22)</span>
                  <span className="text-[9px] text-[#78e1b5] block">個體化突破 · 超脫</span>
                </div>

                {/* Node 5: 森林迷宮 */}
                <div className="absolute bottom-[16%] left-[80%] p-2 rounded-xl bg-black/60 border border-amber-400/40 backdrop-blur-sm text-center shadow-lg transform -translate-x-1/2">
                  <span className="text-xs">🌲</span>
                  <span className="text-[10px] block font-bold text-amber-200 whitespace-nowrap">森林出口 (9/24)</span>
                  <span className="text-[9px] text-amber-300 block">新旅途啟動</span>
                </div>

                {/* Floating Mock Badge */}
                <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/80 font-mono">
                  ✨ 節點點擊可調閱對應夢境歷史
                </div>
              </div>

              {/* Feature Highlights of Constellation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <b className="text-white block mb-0.5">🌟 意象共振連線</b>
                  <p className="text-[#aab3d2] text-[11px] leading-relaxed">
                    AI 自動串聯相同原型之夢，繪製你的心靈星宿圖。
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <b className="text-white block mb-0.5">🔍 點擊星體漫遊</b>
                  <p className="text-[#aab3d2] text-[11px] leading-relaxed">
                    每一顆星都是一個夢，點擊立刻調閱當時的心靈報告。
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <b className="text-white block mb-0.5">🖼️ 高畫質星圖匯出</b>
                  <p className="text-[#aab3d2] text-[11px] leading-relaxed">
                    付費會員可將個人專屬星圖下載為 4K 藝術壁紙。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 30 晚全息報告片段示範 */}
          {activeTab === 'mystery' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-300" />
                    <span>30 NIGHTS MYSTERY™️ 全息總結報告（模擬樣本片段）</span>
                  </h3>
                  <p className="text-xs text-[#aab3d2] mt-0.5">
                    完成 30 夜夢境探索後，AI 為你生成的專屬個人潛意識宏觀全書。
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 w-fit">
                  30 夜深層旅程 · 第 30 晚結業報告
                </span>
              </div>

              {/* Sample Chapters Preview */}
              <div className="space-y-3">
                {/* Chapter 1 */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#aa9cff] uppercase">Chapter 01 · 潛意識週期演進</span>
                    <span className="text-[10px] text-[#78e1b5] font-semibold">已完成比對</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">從「無助受縛」走向「意志自主」的情緒轉折線</h4>
                  <p className="text-xs text-[#cbd2ef] leading-relaxed">
                    在第 1 至 10 晚，夢境中充斥「牙齒脫落」、「考場失語」、「電梯下墜」等典型高壓場景，反映了意識層面對外在控制感的焦慮；而在第 18 晚之後，夢境轉化為「整理房間」、「清澈山泉」、「高空俯瞰」，顯示內心已重組內在安全基地。
                  </p>
                </div>

                {/* Chapter 2 */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-300 uppercase">Chapter 02 · 核心情結突破</span>
                    <span className="text-[10px] text-amber-300 font-semibold">深度洞察</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">直面「陰影（The Shadow）」：不再逃跑的黑衣人</h4>
                  <p className="text-xs text-[#cbd2ef] leading-relaxed">
                    第 24 晚的關鍵夢境中，你不再繼續狂奔，而是轉身質問黑影。榮格心理學指出，這代表你已成功將過去壓抑在潛意識邊緣的創造力與自我主張重新整合回顯意識人格中。
                  </p>
                </div>

                {/* Chapter 3 with subtle blur */}
                <div className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#71d9ff] uppercase">Chapter 03 · 未來年度心靈指引</span>
                    <span className="text-[10px] text-white/50">大師建議</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">為下一個人生週期點亮燈塔的 3 大靈魂行動</h4>
                  <p className="text-xs text-[#cbd2ef] leading-relaxed line-clamp-2 filter blur-[1.5px]">
                    1. 允許自己放下對完美評價的索求，建立每週一天的離線放空儀式…… 2. 當夢中再次出現大水時，請記住你在第 28 晚學會的浮水技巧…… 3. 勇於開啟延宕已久的個人創作計劃……
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1024] via-transparent to-transparent flex items-end justify-center pb-2">
                    <span className="text-[11px] text-amber-200/90 font-mono flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>記錄滿 30 晚或 VIP 會員即可生成完整全息書</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fixed Mandatory Disclaimer */}
          <div className="mt-5 p-3 rounded-xl bg-[#aa9cff]/10 border border-[#aa9cff]/20 text-xs text-[#d8ddf8] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#aa9cff] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <b className="text-white">免責提示：</b>本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#8d97b5] flex items-center gap-1.5 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-[#78e1b5]" />
            <span>所有報告均由心理學文獻引擎 Book Brain 精密對照生成</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onOpenEarnStars && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEarnStars();
                }}
                className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/35 hover:bg-amber-400/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Star className="w-3.5 h-3.5 fill-amber-300" />
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
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#aa9cff] to-[#71d9ff] text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#aa9cff]/20 hover:brightness-105 transition-all"
              >
                <span>解鎖專屬 VIP 方案</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
