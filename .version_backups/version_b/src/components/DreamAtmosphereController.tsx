import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Sliders } from 'lucide-react';

interface DreamAtmosphereControllerProps {
  opacity: number;
  setOpacity: (val: number) => void;
  blur: number;
  setBlur: (val: number) => void;
  tint: 'aurora' | 'twilight' | 'cyber' | 'deep';
  setTint: (val: 'aurora' | 'twilight' | 'cyber' | 'deep') => void;
}

export const DreamAtmosphereController: React.FC<DreamAtmosphereControllerProps> = ({
  opacity,
  setOpacity,
  blur,
  setBlur,
  tint,
  setTint,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40" id="atmosphere-control-widget">
      {/* Expanded Control Box */}
      {isOpen && (
        <div className="mb-3 p-4 rounded-2xl bg-[#0b0e1e]/90 backdrop-blur-2xl border border-[#aa9cff]/30 shadow-2xl shadow-[#aa9cff]/20 w-72 text-left animate-fadeIn text-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5 font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
              <span>全屏沉浸夢境氛圍 (Cover Mode)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#8e98b7] hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Opacity Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-[#aab3d2] mb-1">
              <span>畫作背景濃度</span>
              <span className="font-mono text-[#aa9cff]">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.85"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-[#aa9cff] cursor-pointer"
            />
          </div>

          {/* Blur Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-[#aab3d2] mb-1">
              <span>柔焦毛玻璃 (Blur)</span>
              <span className="font-mono text-[#aa9cff]">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="2"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value, 10))}
              className="w-full accent-[#aa9cff] cursor-pointer"
            />
          </div>

          {/* Color Atmosphere Preset */}
          <div>
            <div className="text-[11px] text-[#aab3d2] mb-1.5">星空色調風格：</div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'aurora', label: '翠綠極光' },
                { id: 'twilight', label: '櫻花暮光' },
                { id: 'cyber', label: '星河紫幻' },
                { id: 'deep', label: '深海沉靜' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTint(t.id as any)}
                  className={`py-1 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                    tint === t.id
                      ? 'bg-[#aa9cff]/20 border-[#aa9cff] text-white font-bold shadow'
                      : 'bg-white/5 border-white/10 text-[#8e98b7] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 rounded-full bg-[#0d1226]/85 hover:bg-[#141b3a] backdrop-blur-xl border border-[#aa9cff]/40 text-white shadow-xl shadow-[#aa9cff]/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95 group text-xs font-medium"
        title="自訂全屏畫布與氛圍"
      >
        <Sliders className="w-3.5 h-3.5 text-[#aa9cff] group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">全屏畫作氛圍</span>
        <span className="w-2 h-2 rounded-full bg-[#78e1b5] animate-pulse" />
      </button>
    </div>
  );
};
