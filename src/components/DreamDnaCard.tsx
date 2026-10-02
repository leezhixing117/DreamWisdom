import React, { useState } from 'react';
import { DreamDNA, DreamDnaSymbol } from '../types';
import { Dna, Sparkles, TrendingUp, Compass, Share2, Check, ArrowRight, Eye, Cloud, Activity } from 'lucide-react';

interface DreamDnaCardProps {
  dna: DreamDNA;
  onSelectSymbolForConstellation?: (symbolName: string) => void;
}

export const DreamDnaCard: React.FC<DreamDnaCardProps> = ({ dna, onSelectSymbolForConstellation }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<DreamDnaSymbol | null>(dna.symbols[0] || null);
  const [copied, setCopied] = useState(false);
  const [timeRange, setTimeRange] = useState<'this_week' | 'all_time'>('all_time');
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; emotion: string; score: number; dreamTitle: string } | null>(null);

  // Time-series emotion wave points (All Time vs This Week)
  const emotionTimeDataAll = [
    { date: '05/12', anxiety: 85, fear: 70, sadness: 40, calm: 20, joy: 10, dream: '舊校會考與赤腳' },
    { date: '05/18', anxiety: 90, fear: 80, sadness: 35, calm: 15, joy: 5, dream: '神秘黑影追逐奔跑' },
    { date: '05/25', anxiety: 65, fear: 50, sadness: 60, calm: 35, joy: 20, dream: '已故阿媽神枱紅包' },
    { date: '06/02', anxiety: 55, fear: 45, sadness: 30, calm: 60, joy: 30, dream: '洪水漫過舊屋' },
    { date: '06/08', anxiety: 40, fear: 25, sadness: 20, calm: 75, joy: 45, dream: '平靜海邊吹風' },
  ];

  const emotionTimeDataWeek = [
    { date: '06/05', anxiety: 60, fear: 40, sadness: 30, calm: 50, joy: 25, dream: '涉水涉過長廊' },
    { date: '06/07', anxiety: 45, fear: 30, sadness: 25, calm: 65, joy: 35, dream: '半掩的舊門' },
    { date: '06/08', anxiety: 35, fear: 20, sadness: 15, calm: 80, joy: 50, dream: '平靜海邊看浪' },
  ];

  const activeTimeData = timeRange === 'this_week' ? emotionTimeDataWeek : emotionTimeDataAll;

  // Keyword tag cloud items with high-contrast distinct pastel/bold colors
  const keywordCloud = [
    { text: '水 / 海洋', count: 4, size: 'text-base sm:text-lg', color: 'text-sky-950 bg-sky-100 hover:bg-sky-200 border-2 border-sky-300' },
    { text: '門 / 出口', count: 3, size: 'text-base sm:text-lg', color: 'text-amber-950 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300' },
    { text: '被追逐 / 逃跑', count: 3, size: 'text-base sm:text-lg', color: 'text-rose-950 bg-rose-100 hover:bg-rose-200 border-2 border-rose-300' },
    { text: '舊居屋邨', count: 2, size: 'text-sm sm:text-base', color: 'text-indigo-950 bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-300' },
    { text: '走廊', count: 3, size: 'text-sm sm:text-base', color: 'text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300' },
    { text: '考場公開試', count: 2, size: 'text-sm sm:text-base', color: 'text-amber-900 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300' },
    { text: '赤腳奔走', count: 2, size: 'text-sm sm:text-base', color: 'text-slate-900 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300' },
    { text: '母親 / 神枱', count: 2, size: 'text-sm sm:text-base', color: 'text-purple-950 bg-purple-100 hover:bg-purple-200 border-2 border-purple-300' },
    { text: '黑影 (Shadow)', count: 2, size: 'text-sm sm:text-base', color: 'text-slate-950 bg-slate-200 hover:bg-slate-300 border-2 border-slate-400' },
  ];

  const handleShareDna = () => {
    const text = `【我的 Dream DNA™️ 夢境指紋】\n潛意識總結：${dna.narrativeFingerprint}\n核心象徵：水(4次)、門(3次)、被追逐(3次)\n情緒時間走向：焦慮指數由 85% 下降至 40%，平靜度提升至 75%\n在 DreamWisdom 解鎖你的夢境密碼`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="relative overflow-hidden p-6 sm:p-8 rounded-3xl space-y-6 bg-gradient-to-b from-[#F0F6FF] via-white to-[#EEF5FF] border-2 border-blue-300 shadow-xl"
      id="dream-dna-card"
    >
      {/* 背景星宿幾何星座紋理水印 */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="25%" y1="10%" x2="60%" y2="8%" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="25%" cy="10%" r="4" fill="#2563EB" />
        <circle cx="60%" cy="8%" r="3.5" fill="#38BDF8" />
        <circle cx="85%" cy="18%" r="4" fill="#F59E0B" />
        <line x1="60%" y1="8%" x2="85%" y2="18%" stroke="#60A5FA" strokeWidth="1.2" />
        <path d="M 580 60 A 35 35 0 0 1 545 25 A 35 35 0 1 0 580 60 Z" fill="#93C5FD" opacity="0.3" />
      </svg>

      {/* Header bar (高清晰白底大字) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b-2 border-blue-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-blue-700 shadow-sm shrink-0">
            <Dna className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-xs">
                DREAM DNA™️
              </span>
              <span className="text-xs sm:text-sm text-emerald-950 font-mono font-black flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                已累積 {dna.totalDreams} 個夢境樣本
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-950 mt-1.5 tracking-wide">
              你的個人夢境指紋
            </h2>
            <p className="text-xs sm:text-sm text-amber-950 font-black mt-1">
              👉 簡單講：系統統計你反覆夢見嘅畫面同情緒，睇潛意識最常關心嘅議題。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range switcher */}
          <div className="flex items-center bg-white border-2 border-slate-300 rounded-xl p-1 text-xs sm:text-sm shadow-2xs">
            <button
              type="button"
              onClick={() => setTimeRange('this_week')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer font-black ${
                timeRange === 'this_week'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-800 hover:text-slate-950'
              }`}
            >
              本週
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('all_time')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer font-black ${
                timeRange === 'all_time'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-800 hover:text-slate-950'
              }`}
            >
              全部時間
            </button>
          </div>

          <button
            type="button"
            onClick={handleShareDna}
            className="text-xs sm:text-sm font-black flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-950 border-2 border-slate-300 hover:border-slate-400 cursor-pointer transition-all shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-blue-600" />}
            <span>{copied ? '已複製' : '分享 DNA'}</span>
          </button>
        </div>
      </div>

      {/* Breakthrough Algorithmic Summary Sentence Banner */}
      <div className="relative z-10 p-6 sm:p-7 rounded-3xl bg-blue-100/90 border-2 border-blue-300 shadow-sm">
        <div className="flex items-start gap-4">
          <Sparkles className="w-7 h-7 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-2.5">
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-blue-950 flex items-center gap-2">
              <span>跨夢境演算法洞察 · 潛意識一句總結</span>
              <span className="text-xs px-3 py-0.5 rounded-full bg-blue-200 text-blue-950 border border-blue-400 font-black">
                {timeRange === 'this_week' ? '本週趨勢' : '長時趨勢'}
              </span>
            </div>
            <p className="text-lg sm:text-xl text-slate-950 font-black leading-relaxed italic">
              「你嘅夢境經常出現逃離同被追趕，多伴隨焦慮感；近期水勢由洪水轉為平靜，提示心理自我調節正在發揮作用。」
            </p>
            <div className="text-xs sm:text-sm text-slate-900 font-bold leading-relaxed">
              系統不只分析單一晚上的隨機意象，而是從長時記憶池中辨識你的核心生命課題與情緒修復進程。
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section: Emotional Time-Series Trend Curves */}
      {/* ============================================================ */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shadow-xs">
              <Activity className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-base sm:text-lg text-slate-900 font-black flex items-center gap-2">
                <span>情緒時間曲線 (Emotional Time-Series Wave)</span>
              </div>
              <span className="text-xs sm:text-sm text-slate-600 font-bold block mt-0.5">
                · 觀察恐懼、焦慮與平靜的波動軌跡
              </span>
            </div>
          </div>

          {/* High-contrast legend tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-950 border-2 border-amber-400 font-black shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" /> 不安/焦慮
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-100 text-rose-950 border-2 border-rose-400 font-black shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" /> 恐懼
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-950 border-2 border-emerald-400 font-black shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" /> 平靜
            </span>
          </div>
        </div>

        {/* SVG Time Series Curve Graph (深邃夜空畫布，超高對比金白色大字) */}
        <div className="relative min-h-[260px] sm:min-h-[280px] w-full bg-[#0F172A] rounded-2xl p-4 sm:p-5 border-2 border-slate-300 flex flex-col justify-between shadow-md">
          <svg className="w-full h-36 sm:h-40 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.15)" strokeDasharray="4" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.15)" strokeDasharray="4" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.15)" strokeDasharray="4" />

            {/* Anxiety Curve (Yellow/Amber - Trending down) */}
            <path
              d={
                timeRange === 'this_week'
                  ? 'M 40,40 Q 250,55 460,65'
                  : 'M 20,15 Q 130,10 240,35 T 370,45 T 480,60'
              }
              fill="none"
              stroke="#FBBF24"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Fear Curve (Rose - High to Low) */}
            <path
              d={
                timeRange === 'this_week'
                  ? 'M 40,60 Q 250,70 460,80'
                  : 'M 20,30 Q 130,20 240,50 T 370,55 T 480,75'
              }
              fill="none"
              stroke="#FB7185"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Calm Curve (Emerald - Rising) */}
            <path
              d={
                timeRange === 'this_week'
                  ? 'M 40,50 Q 250,35 460,20'
                  : 'M 20,80 Q 130,85 240,65 T 370,40 T 480,25'
              }
              fill="none"
              stroke="#34D399"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Interactive Points */}
            {activeTimeData.map((pt, idx) => {
              const x = (idx / (activeTimeData.length - 1)) * 440 + 30;
              const yAnxiety = 100 - pt.anxiety;
              const yCalm = 100 - pt.calm;
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={yAnxiety}
                    r="6"
                    fill="#FBBF24"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({ date: pt.date, emotion: '不安/焦慮', score: pt.anxiety, dreamTitle: pt.dream })
                    }
                  />
                  <circle
                    cx={x}
                    cy={yCalm}
                    r="6"
                    fill="#34D399"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({ date: pt.date, emotion: '平靜指數', score: pt.calm, dreamTitle: pt.dream })
                    }
                  />
                </g>
              );
            })}
          </svg>

          {/* X-axis date & dream title labels (放大字型、超高清晰白卡片化佈局) */}
          <div className="flex justify-between gap-2 pt-3.5 border-t border-white/20">
            {activeTimeData.map((pt, i) => (
              <div
                key={i}
                className="flex-1 p-2 sm:p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border-2 border-white/25 text-center shadow-sm transition-colors"
              >
                <span className="block text-xs sm:text-sm font-mono font-black text-amber-300 tracking-wider">
                  {pt.date}
                </span>
                <span
                  className="block text-xs sm:text-sm font-black text-white truncate mt-1"
                  title={pt.dream}
                >
                  {pt.dream}
                </span>
              </div>
            ))}
          </div>

          {/* Hover tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#1E293B] border-2 border-blue-400 text-xs sm:text-sm px-4 py-2 rounded-xl shadow-2xl text-white flex items-center gap-2.5 pointer-events-none z-20">
              <span className="text-amber-300 font-mono font-black">{hoveredPoint.date}</span>
              <span className="font-black">{hoveredPoint.dreamTitle}</span>
              <span className="font-mono font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">
                {hoveredPoint.emotion}: {hoveredPoint.score}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section: Visual Keyword Cloud (關鍵詞雲) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-base font-black text-slate-900">
            <Cloud className="w-5 h-5 text-amber-600" />
            <span>潛意識核心關鍵詞雲 (Subconscious Keyword Cloud)</span>
          </div>
          <span className="text-xs sm:text-sm text-slate-600 font-bold">點擊關鍵詞可直接定位演化軌跡</span>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center py-2">
          {keywordCloud.map((kw, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const found = dna.symbols.find((s) => s.name.includes(kw.text.split('/')[0].trim()));
                if (found) setSelectedSymbol(found);
              }}
              className={`px-4 py-2 rounded-2xl transition-all cursor-pointer hover:scale-105 font-black ${kw.size} ${kw.color} flex items-center gap-2 shadow-2xs`}
            >
              <span>{kw.text}</span>
              <span className="text-xs font-mono font-black opacity-80">({kw.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Symbols Breakdown & Selected Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left 2 Cols: Dream DNA Symbols List (對比 Screenshot 1：徹底解決白底白字隱形問題) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-200">
            <span>核心重複象徵演化 (點擊深入檢視)</span>
            <span>出現頻率</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dna.symbols.map((sym) => {
              const isSelected = selectedSymbol?.name === sym.name;
              return (
                <button
                  key={sym.name}
                  type="button"
                  onClick={() => setSelectedSymbol(sym)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-800 shadow-md'
                      : 'bg-slate-50 hover:bg-blue-50/80 border-slate-200 hover:border-blue-400 text-slate-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {sym.name.includes('水')
                        ? '🌊'
                        : sym.name.includes('門')
                        ? '🚪'
                        : sym.name.includes('居')
                        ? '🏚️'
                        : sym.name.includes('追')
                        ? '🏃'
                        : sym.name.includes('母')
                        ? '👵'
                        : '🔮'}
                    </span>
                    <div>
                      <div className={`text-base sm:text-lg font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {sym.name}
                      </div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                        {sym.evolution.length} 個演化節點
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-mono font-black px-2.5 py-1 rounded-full border ${
                        isSelected
                          ? 'bg-white text-blue-950 border-white shadow-2xs'
                          : 'bg-blue-100 text-blue-900 border-blue-300'
                      }`}
                    >
                      出現 {sym.count} 次
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-white translate-x-1' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Symbol Evolution Viewer */}
          {selectedSymbol && (
            <div className="mt-4 p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-blue-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-700" />
                  【{selectedSymbol.name}】在過去夢境中的角色改變弧度：
                </span>
                {onSelectSymbolForConstellation && (
                  <button
                    type="button"
                    onClick={() => onSelectSymbolForConstellation(selectedSymbol.name)}
                    className="text-xs sm:text-sm font-black text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    在星圖中定位
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {selectedSymbol.evolution.map((evo, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-between text-xs sm:text-sm shadow-2xs"
                  >
                    <div>
                      <span className="text-amber-800 mr-2.5 font-mono font-black">{evo.date}</span>
                      <b className="text-slate-900 font-black">{evo.dreamTitle}</b>
                    </div>
                    <span className="text-emerald-800 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 ml-3">
                      {evo.state}
                    </span>
                  </div>
                ))}
              </div>

              {selectedSymbol.name.includes('水') && (
                <div className="mt-3 text-xs sm:text-sm text-slate-800 font-semibold bg-blue-50/90 p-4 rounded-2xl border-2 border-blue-200 leading-relaxed shadow-2xs">
                  💡 <b className="text-blue-900 font-black">關鍵發現：</b>你 30 日內有 4 個夢出現水。從一開始的平靜無聲漫漲、到洪水衝擊、涉水渡海、最後在岸邊看浪。<b className="text-blue-900">水的角色正在改變——從威脅轉變為平靜的力量！</b>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Emotions & Recurring Themes (對比 Screenshot 2：徹底解決深色底暗字問題) */}
        <div className="space-y-6">
          {/* Emotion Spectrum */}
          <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-sm space-y-3">
            <div className="text-xs sm:text-sm text-slate-900 uppercase tracking-wider font-black mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
              <span>情緒頻譜分析 ({timeRange === 'this_week' ? '本週' : '全部'})</span>
              <span className="text-blue-800 font-mono font-black">
                {timeRange === 'this_week' ? '40% 焦慮 · 45% 平靜' : '68% 焦慮'}
              </span>
            </div>

            <div className="space-y-3.5">
              {dna.emotionRatios.map((emo) => (
                <div key={emo.emotion} className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-900 font-black">{emo.emotion}</span>
                    <span className="font-mono font-black text-slate-700">{emo.percentage}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${emo.percentage}%`,
                        backgroundColor: emo.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recurring Themes (對應 Screenshot 2：大字黑字、極高對比) */}
          <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-sm space-y-3.5">
            <div className="text-xs sm:text-sm text-slate-900 uppercase tracking-wider font-black mb-1 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>反覆出現的 THEME</span>
            </div>

            <div className="space-y-3">
              {dna.recurringThemes.map((theme, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <b className="text-slate-900 font-black text-sm sm:text-base">{theme.theme}</b>
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 shrink-0">
                      出現 {theme.count} 次
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-bold">
                    {theme.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
