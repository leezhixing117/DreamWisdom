import React, { useState } from 'react';
import { Sparkles, Key, Compass, X, Info, Heart, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface DreamPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbolPrompt?: (text: string) => void;
}

export const DreamPortalModal: React.FC<DreamPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbolPrompt,
}) => {
  const [activeLoreIndex, setActiveLoreIndex] = useState(0);

  if (!isOpen) return null;

  const lores = [
    {
      id: 'keys',
      title: '心靈之鑰 · 92項意象密碼',
      icon: Key,
      badge: '弗洛伊德 & 榮格原型',
      tagline: '「每一個夢境意象，都是打開深層意識的鑰匙。」',
      desc: '漂浮於雲海之上的黃金古鑰，象徵探索無意識幽暗角落的覺察之光。在我們的 92 筆核心數據庫中，鑰匙（symbol_id: 41）代表打開心靈邊界、解開壓抑困惑的核心符號。',
      promptHint: '昨晚夢見在一片金色雲海中，找到了懸浮的發光鑰匙……',
    },
    {
      id: 'islands',
      title: '櫻花浮島 · 自性化庇護所',
      icon: Compass,
      badge: '大母神與自性 (Self)',
      tagline: '「在潛意識的浩瀚汪洋中，築起穩定的人格島嶼。」',
      desc: '懸空的綠洲與盛開的粉紅櫻花，對應榮格心理學中的「自性化（Individuation）」過程。浮島是個人意識（Ego）在面對無邊情緒時的穩定立足點，櫻花則象徵生命力與心靈重生。',
      promptHint: '昨晚夢見漂浮在空中的綠色島嶼，島上開滿了盛開的櫻花樹……',
    },
    {
      id: 'stream',
      title: '星光彩虹之流 · 情緒能量轉化',
      icon: Sparkles,
      badge: '水原型 · 生命之流',
      tagline: '「將氾濫恐慌的情緒洪水，梳理為平靜流淌的星河。」',
      desc: '蜿蜒貫穿雲海的彩虹光流，對應河流意象（symbol_id: 37）與海洋意象（symbol_id: 36）。它代表情緒與心理能量（Libido）的自然釋放與引導，讓內心被壓抑的衝動得以安全表達。',
      promptHint: '昨晚夢見一條像彩虹一樣發光的河流穿過雲層，流向遠方的地平線……',
    },
    {
      id: 'aurora',
      title: '極光星天 · 意識與潛意識邊界',
      icon: Layers,
      badge: '集體無意識 · 靈性超越',
      tagline: '「仰望星軌與極光，感受超越個體小我的集體智慧。」',
      desc: '深邃夜空中舞動的翠綠極光與迴旋星軌，象徵意識（白天理性）與潛意識（黑夜夢境）的融會交界。這正是 DreamWisdom 所連結的 22 部大師著作與人類集體心靈智慧。',
      promptHint: '昨晚夢見夜空中有美麗的綠色極光和旋轉的星空……',
    },
  ];

  const currentLore = lores[activeLoreIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      id="dream-portal-modal-overlay"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0d1226] border border-[#aa9cff]/30 rounded-3xl shadow-2xl shadow-[#aa9cff]/20 overflow-hidden my-auto text-left"
        id="dream-portal-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#aa9cff]/20 border border-[#aa9cff]/30 flex items-center justify-center text-[#c3b9ff]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-serif tracking-tight">
                夢境宇宙門戶 · 潛意識星圖視覺典藏
              </h2>
              <p className="text-[11px] text-[#8e98b7]">
                DreamWisdom 原創心靈意象 · 92 個心理學原型視覺映照
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            id="dream-portal-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split view on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[78vh] overflow-y-auto">
          {/* Left / Visual Artwork Column */}
          <div className="md:col-span-6 bg-black/40 p-4 sm:p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
              <img
                src="/dream_cover_vertical.jpg"
                alt="夢境宇宙門戶 - 潛意識之鑰與櫻花浮島"
                loading="lazy"
                decoding="async"
                width="720"
                height="1280"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white flex items-center gap-1.5 shadow-lg">
                <Key className="w-3 h-3 text-[#ffd27a]" />
                <span>92項核心意象 · 視覺門戶</span>
              </div>

              {/* Bottom Subtle Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[11px] text-white/80">
                <p className="font-serif italic text-white/95">
                  「天際極光映照心靈之鑰，彩虹光流引渡無意識汪洋。」
                </p>
              </div>
            </div>
          </div>

          {/* Right / Interactive Psychological Lore Column */}
          <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#0e142c] to-[#0a0d1e]">
            {/* Tabs for Exploring Elements */}
            <div>
              <div className="text-xs font-semibold text-[#8e98b7] uppercase tracking-wider mb-2">
                點擊探索意象所蘊含的心理學深意：
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {lores.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = idx === activeLoreIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveLoreIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#aa9cff]/15 border-[#aa9cff]/50 text-white shadow-md shadow-[#aa9cff]/10'
                          : 'bg-white/[0.03] border-white/5 text-[#aab3d2] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#aa9cff]' : 'text-[#8e98b7]'}`} />
                      <span className="text-xs font-medium truncate">{item.title.split('·')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Element Detail Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <currentLore.icon className="w-4 h-4 text-[#aa9cff]" />
                    <span>{currentLore.title}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#aa9cff]/10 text-[#c3b9ff] border border-[#aa9cff]/20">
                    {currentLore.badge}
                  </span>
                </div>

                <p className="text-xs text-[#ffd27a] font-serif italic">
                  {currentLore.tagline}
                </p>

                <p className="text-xs text-[#aab3d2] leading-relaxed">
                  {currentLore.desc}
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <span className="text-[11px] text-[#8e98b7]">
                想以這個場景為靈感？
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onSelectSymbolPrompt && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSymbolPrompt(currentLore.promptHint);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none btn text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>套用至夢境輸入</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
