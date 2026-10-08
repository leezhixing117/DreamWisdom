import React, { useState, useMemo } from 'react';
import { DreamDNA, DreamDnaSymbol } from '../types';
import { initialDreamDNA } from '../data';
import {
  Dna,
  Sparkles,
  TrendingUp,
  Compass,
  Share2,
  Check,
  ArrowRight,
  Eye,
  Cloud,
  Activity,
  Tag,
} from 'lucide-react';

interface DreamDnaCardProps {
  dna?: DreamDNA;
  dreamDNA?: DreamDNA;
  onSelectSymbolForConstellation?: (symbolName: string) => void;
  onOpenShare?: (dna: DreamDNA) => void;
}

export const DreamDnaCard: React.FC<DreamDnaCardProps> = ({
  dna,
  dreamDNA,
  onSelectSymbolForConstellation,
  onOpenShare,
}) => {
  // 安全取得有值的 DreamDNA 物件，避免 undefined 拋錯
  const activeDna: DreamDNA = dna || dreamDNA || initialDreamDNA;
  const symbols = activeDna?.symbols || [];
  const emotionRatios = activeDna?.emotionRatios || [];
  const recurringThemes = activeDna?.recurringThemes || [];
  const totalDreams = activeDna?.totalDreams ?? symbols.length;
  const narrativeFingerprint =
    activeDna?.narrativeFingerprint ||
    '你嘅夢境經常出現逃離同被追趕，多伴隨焦慮感；近期水勢由洪水轉為平靜，提示心理自我調節正在發揮作用。';

  const [selectedSymbol, setSelectedSymbol] = useState<DreamDnaSymbol | null>(
    symbols[0] || null
  );
  const [copied, setCopied] = useState(false);
  const [timeRange, setTimeRange] = useState<'this_week' | 'all_time'>('all_time');
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    emotion: string;
    score: number;
    dreamTitle: string;
  } | null>(null);

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

  // 動態整合用戶自訂意象標籤之關鍵詞雲
  const dynamicKeywordCloud = useMemo(() => {
    if (!symbols || symbols.length === 0) {
      return [
        { text: '水 / 海洋', count: 4, size: 'text-lg sm:text-xl', color: 'text-sky-700 bg-sky-50 border-sky-200' },
        { text: '門 / 出口', count: 3, size: 'text-base sm:text-lg', color: 'text-amber-800 bg-amber-50 border-amber-200' },
        { text: '被追逐 / 逃跑', count: 3, size: 'text-base sm:text-lg', color: 'text-rose-700 bg-rose-50 border-rose-200' },
        { text: '舊居屋邨', count: 2, size: 'text-sm sm:text-base', color: 'text-blue-700 bg-blue-50 border-blue-200' },
      ];
    }
    const colors = [
      'text-sky-700 bg-sky-50 border-sky-200',
      'text-amber-800 bg-amber-50 border-amber-200',
      'text-blue-700 bg-blue-50 border-blue-200',
      'text-emerald-700 bg-emerald-50 border-emerald-200',
      'text-rose-700 bg-rose-50 border-rose-200',
      'text-cyan-800 bg-cyan-50 border-cyan-200',
    ];
    return symbols.map((s, idx) => ({
      text: s.name,
      count: s.count,
      size: s.count >= 3 ? 'text-base sm:text-lg' : 'text-xs sm:text-sm',
      color: colors[idx % colors.length],
    }));
  }, [symbols]);

  const handleShareDna = () => {
    if (onOpenShare) {
      onOpenShare(activeDna);
      return;
    }
    const text = `【我的 Dream DNA™️ 夢境指紋】\n潛意識總結：${narrativeFingerprint}\n核心象徵：水(4次)、門(3次)、被追逐(3次)\n情緒時間走向：焦慮指數由 85% 下降至 40%，平靜度提升至 75%\n在 DreamWisdom 解鎖你的夢境密碼`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden space-y-6 text-slate-800"
      id="dream-dna-card"
    >
      {/* 裝飾性淡藍光暈 */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* 頂部標題列 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
                DREAM DNA™️
              </span>
              <span className="text-xs text-emerald-700 font-mono font-semibold">
                已累積 {totalDreams} 個夢境樣本
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              你的個人夢境指紋
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              系統統計你反覆夢見嘅畫面同情緒，歸納潛意識最常關心嘅議題與成長軌跡。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 時間範圍切換 */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange('this_week')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                timeRange === 'this_week'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              本週
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('all_time')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                timeRange === 'all_time'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部時間
            </button>
          </div>

          <button
            type="button"
            onClick={handleShareDna}
            className="text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-sky-600" />}
            <span>{copied ? '已複製' : '分享 DNA'}</span>
          </button>
        </div>
      </div>

      {/* 跨夢境潛意識一句總結 Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200 relative">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-bold text-sky-900 flex items-center gap-2">
              <span>跨夢境演算法洞察 · 潛意識一句總結</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-200/70 text-sky-900 font-medium">
                {timeRange === 'this_week' ? '本週趨勢' : '長期趨勢'}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
              「{narrativeFingerprint}」
            </p>
            <div className="text-xs text-slate-500">
              系統不只分析單一晚上的隨機意象，而是從長時記憶池中辨識你的核心生命課題與情緒修復進程。
            </div>
          </div>
        </div>
      </div>

      {/* 情緒時間波動曲線圖 */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-900 font-bold">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>情緒時間曲線 (Emotional Time-Series Wave)</span>
            <span className="text-slate-500 font-normal text-[11px]">· 觀察恐懼、焦慮與平靜的波動軌跡</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 不安/焦慮
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> 恐懼
            </span>
            <span className="flex items-center gap-1 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 平靜
            </span>
          </div>
        </div>

        {/* SVG Time Series Curve Graph */}
        <div className="relative h-44 w-full bg-white rounded-xl p-3 border border-slate-200 flex flex-col justify-end">
          <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="4" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeDasharray="4" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="4" />

            {/* Anxiety Curve (Yellow/Amber - Trending down) */}
            <path
              d={
                timeRange === 'this_week'
                  ? 'M 40,40 Q 250,55 460,65'
                  : 'M 20,15 Q 130,10 240,35 T 370,45 T 480,60'
              }
              fill="none"
              stroke="#f59e0b"
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
              stroke="#f43f5e"
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
              stroke="#10b981"
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
                    fill="#f59e0b"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({ date: pt.date, emotion: '不安/焦慮', score: pt.anxiety, dreamTitle: pt.dream })
                    }
                  />
                  <circle
                    cx={x}
                    cy={yCalm}
                    r="4"
                    fill="#10b981"
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
          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-100 px-2">
            {activeTimeData.map((pt, i) => (
              <span key={i} className="text-center">
                {pt.date}
                <span className="block text-[9px] text-slate-400 truncate max-w-[80px]">{pt.dream}</span>
              </span>
            ))}
          </div>

          {/* Hover tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-xs px-3 py-1.5 rounded-xl shadow-xl text-white flex items-center gap-2 pointer-events-none">
              <span className="text-sky-400 font-semibold">{hoveredPoint.date}</span>
              <span>{hoveredPoint.dreamTitle}</span>
              <span className="font-mono text-amber-300">
                {hoveredPoint.emotion}: {hoveredPoint.score}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 關鍵詞雲 (Subconscious Keyword Cloud) */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Cloud className="w-4 h-4 text-sky-600" />
            <span>潛意識核心關鍵詞雲 (Subconscious Keyword Cloud)</span>
          </div>
          <span className="text-[11px] text-slate-500">點擊關鍵詞可直接定位演化軌跡</span>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center py-2">
          {dynamicKeywordCloud.map((kw, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const found = symbols.find((s) => s.name.includes(kw.text.split('/')[0].trim()));
                if (found) setSelectedSymbol(found);
              }}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer hover:scale-105 font-medium ${kw.size} ${kw.color} flex items-center gap-1.5`}
            >
              <span>{kw.text}</span>
              <span className="text-xs opacity-75 font-mono">({kw.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 核心重複象徵演化與清單 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* 左側 2 欄：象徵清單 */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center justify-between">
            <span>核心重複象徵演化 (點擊深入檢視)</span>
            <span>出現頻率</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {symbols.map((sym) => {
              const isSelected = selectedSymbol?.name === sym.name;
              return (
                <button
                  key={sym.name}
                  type="button"
                  onClick={() => setSelectedSymbol(sym)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
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
                      <div className="text-sm font-bold text-slate-900">{sym.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {sym.evolution?.length || 0} 個演化節點
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      出現 {sym.count} 次
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-sky-600 transition-transform ${isSelected ? 'translate-x-1' : 'opacity-40'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* 已選象徵演化詳情 */}
          {selectedSymbol && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-600" />
                  【{selectedSymbol.name}】在過去夢境中的角色改變弧度：
                </span>
                {onSelectSymbolForConstellation && (
                  <button
                    type="button"
                    onClick={() => onSelectSymbolForConstellation(selectedSymbol.name)}
                    className="text-[11px] text-sky-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Eye className="w-3 h-3" />
                    在星圖中定位
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {selectedSymbol.evolution?.map((evo, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start justify-between text-xs"
                  >
                    <div>
                      <span className="text-slate-400 mr-2 font-mono">{evo.date}</span>
                      <b className="text-slate-800">{evo.dreamTitle}</b>
                    </div>
                    <span className="text-emerald-700 font-semibold shrink-0 ml-3">
                      {evo.state}
                    </span>
                  </div>
                ))}
              </div>

              {selectedSymbol.name.includes('水') && (
                <div className="mt-3 text-xs text-slate-700 bg-sky-100/60 p-2.5 rounded-xl border border-sky-200 leading-relaxed">
                  💡 <b>關鍵發現：</b>你 30 日內有 4 個夢出現水。從一開始的平靜無聲漫漲、到洪水衝擊、涉水渡海、最後在岸邊看浪。<b>水的角色正在改變——從威脅轉變為平靜的力量！</b>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右側 1 欄：情緒頻譜與重複主題 */}
        <div className="space-y-6">
          {/* 情緒頻譜 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3 flex items-center justify-between">
              <span>情緒頻譜分析 ({timeRange === 'this_week' ? '本週' : '全部'})</span>
              <span className="text-sky-700 font-mono font-bold">
                {timeRange === 'this_week' ? '40% 焦慮 · 45% 平靜' : '68% 焦慮'}
              </span>
            </div>

            <div className="space-y-3">
              {emotionRatios.map((emo) => (
                <div key={emo.emotion} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-800 font-medium">{emo.emotion}</span>
                    <span className="font-mono text-slate-500">{emo.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
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

          {/* 反覆出現的主題 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>反覆出現的 Theme</span>
            </div>

            <div className="space-y-2.5">
              {recurringThemes.map((theme, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <b className="text-slate-900 font-semibold">{theme.theme}</b>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium border border-sky-100">
                      出現 {theme.count} 次
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
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
