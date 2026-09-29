import React, { useState } from 'react';
import {
  Sparkles,
  Brain,
  Dna,
  Compass,
  ArrowRight,
  Eye,
  X,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWriting: () => void;
  onOpenSamplePreview: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartWriting,
  onOpenSamplePreview,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNum: '①',
      badge: '第一步 · 零壓力速記',
      title: '寫低你嘅夢，幾隻字都得',
      tagline: '👉簡單講：醒返記得乜就寫乜，零碎片段都解到',
      desc: '醒返迷迷糊糊淨係記得少少人物、一個場景，甚至得一句話？完全冇問題！可以用大文本自由寫，亦有點擊「記夢引導」分步表單（人物、場景、心情），每欄都可以留空，隨手記低心靈印記。',
      icon: Sparkles,
      color: 'from-[#aa9cff]/20 to-[#71d9ff]/10',
      iconColor: 'text-[#aa9cff]',
      borderColor: 'border-[#aa9cff]/40',
      highlightPoints: [
        '自由大文本書寫 / 5欄簡易引導表單任你揀',
        '點擊意象標籤（🌊海洋、👣赤腳、🏃被追）直接插入',
        '自動記錄時間與睡眠時段，打造私人夢境日記',
      ],
    },
    {
      stepNum: '②',
      badge: '第二步 · 榮格心理學 + 古籍',
      title: 'AI 心理學深度拆解，拒絕算命套話',
      tagline: '👉簡單講：唔係估你行唔行運，而係睇清白天壓抑咗嘅情緒同渴望',
      desc: 'DreamWisdom 拒絕千篇一律嘅算命罐頭籤文。我們先從卡爾·榮格《人及其象徵》、佛洛伊德潛意識理論及周公古籍中搵出對應理論，再比對你生活近況，幫你拆解夢境背後想同你講嘅心靈暗號。',
      icon: Brain,
      color: 'from-[#71d9ff]/20 to-[#78e1b5]/10',
      iconColor: 'text-[#71d9ff]',
      borderColor: 'border-[#71d9ff]/40',
      highlightPoints: [
        '分析夢中原型意象（陰影、水、鏡子、門鎖）',
        '覺察白天被忽略或壓抑的真實情緒補償',
        '偵探式追問引導，助你溫和向內探索整合',
      ],
    },
    {
      stepNum: '③',
      badge: '第三步 · 長期心靈檔案',
      title: '累積建立專屬 DREAM DNA™️ 與星圖',
      tagline: '👉簡單講：夢境唔係孤立嘅，越記越睇得出你嘅人生心境轉變',
      desc: '別人只解你一次夢，我哋記得你過往所有夢。系統會自動統計你反覆出現嘅意象頻率（DREAM DNA™️），將唔同日子嘅夢連成互動星圖，甚至展開 30 晚潛意識偵探檔案，睇見內在能量點樣由混亂走向平靜。',
      icon: Dna,
      color: 'from-amber-400/20 to-[#aa9cff]/10',
      iconColor: 'text-amber-300',
      borderColor: 'border-amber-400/40',
      highlightPoints: [
        'DREAM DNA™️：專屬夢境指紋，看清潛意識核心關注',
        'CONSTELLATION 星圖：跨越時空將夢境意象星際連線',
        '30 NIGHTS MYSTERY™️：每晚解鎖拼圖，解開人生大謎團',
      ],
    },
  ];

  const active = steps[currentStep];
  const StepIcon = active.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onStartWriting();
      onClose();
    }
  };

  const handleFinish = () => {
    onStartWriting();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      id="onboarding-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0b0e1e] border border-white/15 p-6 sm:p-7 shadow-2xl shadow-[#aa9cff]/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Soft Ambient Radial Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#aa9cff]/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#71d9ff]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#aa9cff]/20 text-[#c3b9ff] font-bold border border-[#aa9cff]/30">
              新手 3 步導覽 · 快速睇懂
            </span>
            <span className="text-xs font-mono text-[#8d97b5]">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="關閉導覽"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-3 gap-2 my-4 shrink-0">
          {steps.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                currentStep === idx
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/[0.02] border-white/5 text-[#8d97b5] hover:bg-white/5'
              }`}
            >
              <div className="text-[10px] font-mono text-[#aa9cff] font-bold">
                步驟 0{idx + 1}
              </div>
              <div className="text-xs font-semibold truncate mt-0.5">
                {idx === 0 ? '① 寫低夢境' : idx === 1 ? '② 心理學解讀' : '③ 建立星圖'}
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2">
          {/* Card Presentation */}
          <div
            className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${active.color} border ${active.borderColor} space-y-3 transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-black/40 text-white border border-white/10">
                {active.badge}
              </span>
              <div
                className={`w-10 h-10 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center ${active.iconColor}`}
              >
                <StepIcon className="w-5 h-5" />
              </div>
            </div>

            <h3
              id="onboarding-modal-title"
              className="text-lg sm:text-xl font-bold text-white leading-tight"
            >
              {active.title}
            </h3>

            {/* Colloquial Cantonese Plain Subtitle Tagline */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-medium text-amber-300 leading-relaxed">
              {active.tagline}
            </div>

            <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
              {active.desc}
            </p>

            {/* Highlight Bullets */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              {active.highlightPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#78e1b5] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions - Strictly Tiered: Primary vs Secondary */}
        <div className="pt-4 border-t border-white/10 shrink-0 space-y-2.5">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
            {/* Secondary Action: View Sample Report Preview */}
            <button
              type="button"
              onClick={() => {
                onOpenSamplePreview();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-[#c3b9ff] hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#71d9ff]" />
              <span>觀看示範報告樣本</span>
            </button>

            {/* Primary Action: Next or Start Writing */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#aa9cff] to-[#71d9ff] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#aa9cff]/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <span>下一步 (0{currentStep + 2})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>立即試試記錄第一個夢 →</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-[#8d97b5] hover:text-white underline cursor-pointer"
            >
              跳過導覽，直接進入網站
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
