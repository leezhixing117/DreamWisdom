import React, { useState } from 'react';
import { DreamDNA, DreamDnaSymbol } from '../types';
import { Dna, Sparkles, TrendingUp, Compass, Share2, Check, ArrowRight, Eye, Calendar, Cloud, Activity } from 'lucide-react';

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

  // Keyword tag cloud items with weights
  const keywordCloud = [
    { text: '水 / 海洋', count: 4, size: 'text-lg sm:text-xl', color: 'text-[#71d9ff] bg-[#71d9ff]/10 border-[#71d9ff]/30' },
    { text: '門 / 出口', count: 3, size: 'text-base sm:text-lg', color: 'text-[#ffd27a] bg-[#ffd27a]/10 border-[#ffd27a]/30' },
    { text: '被追逐 / 逃跑', count: 3, size: 'text-base sm:text-lg', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { text: '舊居屋邨', count: 2, size: 'text-sm sm:text-base', color: 'text-[#aa9cff] bg-[#aa9cff]/10 border-[#aa9cff]/30' },
    { text: '走廊', count: 3, size: 'text-sm sm:text-base', color: 'text-[#78e1b5] bg-[#78e1b5]/10 border-[#78e1b5]/30' },
    { text: '考場公開試', count: 2, size: 'text-sm', color: 'text-amber-300 bg-amber-400/10 border-amber-400/30' },
    { text: '赤腳奔走', count: 2, size: 'text-sm', color: 'text-[#aab3d2] bg-white/5 border-white/10' },
    { text: '母親 / 神枱', count: 2, size: 'text-sm sm:text-base', color: 'text-purple-300 bg-purple-400/10 border-purple-400/30' },
    { text: '黑影 (Shadow)', count: 2, size: 'text-sm', color: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30' },
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
    <div className="card border-[#aa9cff]/30 bg-gradient-to-b from-[#111428] to-[#0a0d1d] relative overflow-hidden p-6 sm:p-8 rounded-3xl space-y-6" id="dream-dna-card">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#aa9cff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#aa9cff]/15 border border-[#aa9cff]/30 flex items-center justify-center text-[#c3b9ff]">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge">DREAM DNA™️</span>
              <span className="text-xs text-[#78e1b5] font-mono">已累積 {dna.totalDreams} 個夢境樣本</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              你的個人夢境指紋
            </h2>
            <p className="text-xs text-amber-300 font-medium mt-1">
              👉簡單講：系統統計你反覆夢見嘅畫面同情緒，睇潛意識最常關心嘅議題。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange('this_week')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === 'this_week'
                  ? 'bg-[#aa9cff] text-white font-semibold shadow-sm'
                  : 'text-[#aab3d2] hover:text-white'
              }`}
            >
              本週
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('all_time')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === 'all_time'
                  ? 'bg-[#aa9cff] text-white font-semibold shadow-sm'
                  : 'text-[#aab3d2] hover:text-white'
              }`}
            >
              全部時間
            </button>
          </div>

          <button
            type="button"
            onClick={handleShareDna}
            className="btn2 text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#78e1b5]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '已複製' : '分享 DNA'}</span>
          </button>
        </div>
      </div>

      {/* Breakthrough Algorithmic Summary Sentence Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#aa9cff]/15 via-[#71d9ff]/10 to-transparent border border-[#aa9cff]/30 relative">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#aa9cff] shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aa9cff] flex items-center gap-2">
              <span>跨夢境演算法洞察 · 潛意識一句總結</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#aa9cff]/20 text-white font-normal">
                {timeRange === 'this_week' ? '本週趨勢' : '長時趨勢'}
              </span>
            </div>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed italic">
              「你嘅夢境經常出現逃離同被追趕，多伴隨焦慮感；近期水勢由洪水轉為平靜，提示心理自我調節正在發揮作用。」
            </p>
            <div className="text-xs text-[#aab3d2]">
              系統不只分析單一晚上的隨機意象，而是從長時記憶池中辨識你的核心生命課題與情緒修復進程。
            </div>
          </div>
        </div>
      </div>

      {/* Section: Emotional Time-Series Trend Curves */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white font-semibold">
            <Activity className="w-4 h-4 text-[#71d9ff]" />
            <span>情緒時間曲線 (Emotional Time-Series Wave)</span>
            <span className="text-[#8d97b5] font-normal text-[11px]">· 觀察恐懼、焦慮與平靜的波動軌跡</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> 不安/焦慮
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> 恐懼
            </span>
            <span className="flex items-center gap-1 text-[#78e1b5]">
              <span className="w-2 h-2 rounded-full bg-[#78e1b5]" /> 平靜
            </span>
          </div>
        </div>

        {/* SVG Time Series Curve Graph */}
        <div className="relative h-44 w-full bg-black/30 rounded-xl p-3 border border-white/5 flex flex-col justify-end">
          <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

            {/* Anxiety Curve (Yellow/Amber - Trending down) */}
            <path
              d={
                timeRange === 'this_week'
                  ? 'M 40,40 Q 250,55 460,65'
                  : 'M 20,15 Q 130,10 240,35 T 370,45 T 480,60'
              }
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
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
              stroke="#fb7185"
              strokeWidth="2.5"
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
              stroke="#34d399"
              strokeWidth="2.5"
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
                    r="4"
                    fill="#fbbf24"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({ date: pt.date, emotion: '不安/焦慮', score: pt.anxiety, dreamTitle: pt.dream })
                    }
                  />
                  <circle
                    cx={x}
                    cy={yCalm}
                    r="4"
                    fill="#34d399"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({ date: pt.date, emotion: '平靜指數', score: pt.calm, dreamTitle: pt.dream })
                    }
                  />
                </g>
              );
            })}
          </svg>

          {/* X-axis date labels */}
          <div className="flex justify-between text-[10px] text-[#8d97b5] font-mono pt-2 border-t border-white/5 px-2">
            {activeTimeData.map((pt, i) => (
              <span key={i} className="text-center">
                {pt.date}
                <span className="block text-[9px] text-[#5e6987] truncate max-w-[80px]">{pt.dream}</span>
              </span>
            ))}
          </div>

          {/* Hover tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#12162e] border border-[#aa9cff]/40 text-xs px-3 py-1.5 rounded-xl shadow-xl text-white flex items-center gap-2 pointer-events-none">
              <span className="text-[#aa9cff] font-semibold">{hoveredPoint.date}</span>
              <span>{hoveredPoint.dreamTitle}</span>
              <span className="font-mono text-[#ffd27a]">
                {hoveredPoint.emotion}: {hoveredPoint.score}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section: Visual Keyword Cloud (關鍵詞雲) */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Cloud className="w-4 h-4 text-[#ffd27a]" />
            <span>潛意識核心關鍵詞雲 (Subconscious Keyword Cloud)</span>
          </div>
          <span className="text-[11px] text-[#8d97b5]">點擊關鍵詞可直接定位演化軌跡</span>
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
              className={`px-3.5 py-2 rounded-2xl border transition-all cursor-pointer hover:scale-105 ${kw.size} ${kw.color} flex items-center gap-1.5`}
            >
              <span>{kw.text}</span>
              <span className="text-xs opacity-75 font-mono">({kw.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Symbols Breakdown & Selected Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left 2 Cols: Dream DNA Symbols List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs text-[#8d97b5] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>核心重複象徵演化 (點擊深入檢視)</span>
            <span>出現頻率</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {dna.symbols.map((sym) => {
              const isSelected = selectedSymbol?.name === sym.name;
              return (
                <button
                  key={sym.name}
                  type="button"
                  onClick={() => setSelectedSymbol(sym)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#aa9cff]/20 border-[#aa9cff] shadow-lg shadow-[#aa9cff]/10'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
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
                      <div className="text-sm font-semibold text-white">{sym.name}</div>
                      <div className="text-[11px] text-[#8d97b5]">
                        {sym.evolution.length} 個演化節點
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-[#71d9ff]">
                      出現 {sym.count} 次
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-[#aa9cff] transition-transform ${isSelected ? 'translate-x-1' : 'opacity-40'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Symbol Evolution Viewer */}
          {selectedSymbol && (
            <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#71d9ff] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  【{selectedSymbol.name}】在過去夢境中的角色改變弧度：
                </span>
                {onSelectSymbolForConstellation && (
                  <button
                    type="button"
                    onClick={() => onSelectSymbolForConstellation(selectedSymbol.name)}
                    className="text-[11px] text-[#aa9cff] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    在星圖中定位
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {selectedSymbol.evolution.map((evo, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between text-xs"
                  >
                    <div>
                      <span className="text-[#8d97b5] mr-2 font-mono">{evo.date}</span>
                      <b className="text-white">{evo.dreamTitle}</b>
                    </div>
                    <span className="text-[#78e1b5] font-medium shrink-0 ml-3">
                      {evo.state}
                    </span>
                  </div>
                ))}
              </div>

              {selectedSymbol.name.includes('水') && (
                <div className="mt-3 text-xs text-[#aab3d2] bg-[#71d9ff]/10 p-2.5 rounded-xl border border-[#71d9ff]/20">
                  💡 <b>關鍵發現：</b>你 30 日內有 4 個夢出現水。從一開始的平靜無聲漫漲、到洪水衝擊、涉水渡海、最後在岸邊看浪。<b>水的角色正在改變——從威脅轉變為平靜的力量！</b>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Emotions & Recurring Themes */}
        <div className="space-y-6">
          {/* Emotion Spectrum */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-[#8d97b5] uppercase tracking-wider font-semibold mb-3 flex items-center justify-between">
              <span>情緒頻譜分析 ({timeRange === 'this_week' ? '本週' : '全部'})</span>
              <span className="text-[#aa9cff] font-mono">
                {timeRange === 'this_week' ? '40% 焦慮 · 45% 平靜' : '68% 焦慮'}
              </span>
            </div>

            <div className="space-y-3">
              {dna.emotionRatios.map((emo) => (
                <div key={emo.emotion} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white">{emo.emotion}</span>
                    <span className="font-mono text-[#8d97b5]">{emo.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
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

          {/* Recurring Themes */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-[#8d97b5] uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#78e1b5]" />
              <span>反覆出現的 Theme</span>
            </div>

            <div className="space-y-2.5">
              {dna.recurringThemes.map((theme, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <b className="text-white font-medium">{theme.theme}</b>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-[#ffd27a]">
                      出現 {theme.count} 次
                    </span>
                  </div>
                  <p className="text-[11px] text-[#aab3d2] leading-relaxed">
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

