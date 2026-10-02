import React, { useState, useRef } from 'react';
import {
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  Compass,
  Key,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Dna,
  Heart,
  ShoppingBag,
  Lock,
  Eye,
  Crown,
} from 'lucide-react';
import { TherapeuticSupportModal } from './TherapeuticSupportModal';
import { SampleReportPreviewModal } from './SampleReportPreviewModal';
import { TherapistItem, User, normalizeRole } from '../types';
import {
  StepNotepadIcon,
  StepAiBrainIcon,
  StepInsightIcon,
  DreamDnaArtwork,
  ConstellationAstrolabeArtwork,
  OracleCardsArtwork,
} from './CelestialIllustrations';

interface HomeViewProps {
  currentUser?: User | null;
  onStartWithDream: (dreamText: string) => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onGoToPricing?: () => void;
  onOpenLogin?: () => void;
  onGoToPrivacy?: () => void;
  therapists?: TherapistItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  onStartWithDream,
  onGoToApp,
  onGoToPricing,
  onOpenLogin,
  therapists,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isPaidMember = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';

  const [draftDream, setDraftDream] = useState('');
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);
  const [isSamplePreviewOpen, setIsSamplePreviewOpen] = useState(false);
  const [sampleInitialTab, setSampleInitialTab] = useState<'dna' | 'constellation' | 'mystery'>('dna');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expanding textarea
  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftDream(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  };

  const handleStart = () => {
    onStartWithDream(draftDream.trim());
  };

  const handleApplyQuickTag = (tagText: string) => {
    setDraftDream((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return tagText;
      return `${trimmed}、${tagText}`;
    });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleAddGuidePrompt = (type: 'characters' | 'scene' | 'emotion' | 'objects') => {
    const prompts = {
      characters: '【人物】：',
      scene: '【場景】：',
      emotion: '【主要情緒】：',
      objects: '【關鍵物件】：',
    };
    const prefix = prompts[type];
    setDraftDream((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return prefix;
      if (trimmed.includes(prefix)) return trimmed;
      return `${trimmed}\n${prefix}`;
    });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleOpenSample = (tab: 'dna' | 'constellation' | 'mystery') => {
    setSampleInitialTab(tab);
    setIsSamplePreviewOpen(true);
  };

  const dreamTags = [
    { label: '海洋水流', icon: '🌊' },
    { label: '赤腳無鞋', icon: '👣' },
    { label: '被人追趕', icon: '🏃' },
    { label: '舊居祖屋', icon: '🏚️' },
    { label: '家宅神枱', icon: '🕯️' },
    { label: '課室考試', icon: '🏫' },
    { label: '緊閉門鎖', icon: '🚪' },
    { label: '高處墜落', icon: '🕳️' },
  ];

  const faqItems = [
    {
      q: 'DreamWisdom 解夢是基於甚麼理論？',
      a: 'DreamWisdom 結合了榮格（Carl Jung）深度心理學的原型與集體潛意識象徵、佛洛伊德的夢境防衛機轉，並融入當代認知情緒心理學，為你的夢境提供多維度的理性剖析與靈魂對話。',
    },
    {
      q: '香港廣東話輸入能準確理解嗎？',
      a: '完全支援！我們針對香港日常粵語語境、口語字詞與本土文化隱喻進行了專門優化，無論是「琴晚夢見跌落樓梯」或「好似俾人追住走」，AI 都能精確理解情緒核心與潛意識象徵。',
    },
    {
      q: '我的夢境記錄會被其他人或 AI 訓練公開嗎？',
      a: '絕對不會。我們採用個人私隱沙盒隔離，所有夢境內容絕不用作通用大模型訓練，亦不會對第三方公開，保證潛意識記錄百分百安全。',
    },
    {
      q: '解夢報告中的星圖與象徵解析有何特別之處？',
      a: '每份報告均生成專屬的 DREAM DNA™ 象徵密碼，並結合夢境星圖 CONSTELLATION™，將你多個夢境中的象徵與情緒連線，揭示潛意識的長期成長軌跡。',
    },
  ];

  return (
    <main id="home-view-main" className="overflow-hidden bg-transparent pb-16">
      {/* 快速錨點導航條 (優雅自然流動，絕不與頂部或 Hero 徽章重疊) */}
      <div className="w-full bg-white/80 border-b border-slate-200/80 backdrop-blur-sm py-2 px-4 shadow-2xs">
        <div className="shell flex items-center justify-between text-xs text-slate-700 overflow-x-auto gap-3 scrollbar-none">
          <div className="flex items-center gap-1 shrink-0 font-bold text-blue-700">
            <span>快速導航：</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-medium">
            <a href="#recorddream" className="hover:text-blue-700 transition-colors">✍️ 記夢</a>
            <a href="#how" className="hover:text-blue-700 transition-colors">☁️ 三步解讀</a>
            <a href="#three-pillars-section" className="hover:text-blue-700 transition-colors">🧬 DNA</a>
            <a href="#three-pillars-section" className="hover:text-blue-700 transition-colors">🌌 星圖</a>
            <a href="#three-pillars-section" className="hover:text-blue-700 transition-colors">🌙 30晚檔案</a>
            <a href="#shop-highlight" className="hover:text-emerald-700 font-semibold transition-colors">🛍️ 解夢選物店</a>
            <a href="#faq" className="hover:text-blue-700 transition-colors">💬 常見疑問</a>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🌟 1. HERO 頂部視覺（充裕頂部間隔，毛筆字型水墨石青漸變） 🌟 */}
      {/* ============================================================ */}
      <section className="shell relative pt-10 sm:pt-16 pb-6 text-center" id="hero-section">
        {/* 頂部徽章 (具備完整呼吸空間，告別重疊) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>DREAMWISDOM · 專為香港廣東話設計的夢境宇宙</span>
        </div>

        {/* 核心主標題 (靈動毛筆書法字型 + 典雅天體靛藍與皇家寶藍配色，徹底移除不自然漸變) */}
        <h1
          id="hero-title"
          className="font-brush text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] tracking-wide leading-[1.3] sm:leading-[1.25] mb-5 max-w-4xl mx-auto select-none"
        >
          <span className="text-[#1E3A8A] inline-block">
            每一個夢，都是潛意識留給
          </span>
          <span className="text-[#1D4ED8] inline-block sm:ml-2">
            你的信。
          </span>
        </h1>

        {/* 副標題 */}
        <p className="font-sans font-bold text-base sm:text-xl md:text-2xl text-blue-900 tracking-wide mb-3">
          別人解讀你的夢。我們記得你的夢。
        </p>

        {/* 心理學理論與產品介紹 */}
        <p className="font-sans text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed mb-5 font-medium">
          DreamWisdom 唔係憑空估，而係從榮格原型心理學找出相應理論，結合你過往夢境，整理可能值得留意嘅潛意識訊息。
        </p>

        {/* 產品邊界聲明 */}
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium mb-3 max-w-3xl mx-auto text-left sm:text-center shadow-2xs">
          <span>⚠️ 產品邊界：本平台不是心理治療、不是精神科服務；只做基於心理學的自我反思工具，不做吉凶預測。</span>
        </div>

        {/* 專業心理支援與熱線指引連結 */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setIsTherapeuticOpen(true)}
            className="text-xs sm:text-sm text-slate-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer underline decoration-slate-300 hover:decoration-blue-500 underline-offset-4"
          >
            <span>若重複夢魘持續帶來困擾，</span>
            <span className="text-rose-500 font-medium flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" /> 我們提供香港專業心理支援與熱線指引
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 🌟 2. 完整夢境解讀卡片（還原原先全部引導、意象詞與分析按鈕） 🌟 */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* 🌟 2. 完整夢境解讀卡片（典雅星空藝術紋理、大字型、高對比清晰呈現） 🌟 */}
        {/* ============================================================ */}
        <div id="recorddream" className="scroll-mt-24" />
        <div
          className="max-w-3xl mx-auto relative z-10 w-full bg-gradient-to-b from-[#F0F6FF] via-white to-[#EEF5FF] shadow-2xl border-2 border-blue-300 rounded-[32px] p-6 sm:p-8 text-left overflow-hidden"
          id="hero-dreambox"
        >
          {/* 背景典雅星空幾何星座圖紋水印 */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-20 pointer-events-none select-none overflow-hidden">
            <svg viewBox="0 0 200 200" className="w-full h-full text-blue-600">
              <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
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

          {/* 1. 卡片頂部欄：記錄今晨夢境 + 建議字數 */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 text-slate-950 font-black text-lg sm:text-xl">
              <Sparkles className="w-5 h-5 text-blue-700" />
              <span>記錄今晨夢境</span>
            </div>
            <span className="text-xs sm:text-sm text-slate-700 font-bold bg-blue-100/80 px-3 py-1 rounded-full border border-blue-300">
              輸入醒來記得的任何片段 · 建議 15 字以上
            </span>
          </div>

          {/* 2. 記夢引導（點擊帶入回憶結構） */}
          <div className="relative z-10 p-4 rounded-2xl bg-white border-2 border-blue-200 mb-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-950 font-black mb-3">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>記夢引導（點擊帶入回憶結構）：</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('characters')}
                className="px-3.5 py-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 text-xs sm:text-sm text-slate-900 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【人物】提示"
              >
                <span>👥</span>
                <span>有邊啲人物？</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('scene')}
                className="px-3.5 py-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 text-xs sm:text-sm text-slate-900 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【場景】提示"
              >
                <span>📍</span>
                <span>場景係邊度？</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('emotion')}
                className="px-3.5 py-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 text-xs sm:text-sm text-slate-900 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【感覺】提示"
              >
                <span>💭</span>
                <span>感覺驚／開朗？</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('objects')}
                className="px-3.5 py-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 text-xs sm:text-sm text-slate-900 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【物件】提示"
              >
                <span>🚪</span>
                <span>有冇特定物件？</span>
              </button>
            </div>
          </div>

          {/* 3. 私隱保證列（高清晰綠色與深色標籤） */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm mb-3.5 px-1 font-bold">
            <div className="flex items-center gap-2 text-emerald-950 bg-emerald-100/90 px-3 py-1 rounded-xl border border-emerald-300">
              <span>💡</span>
              <span>你嘅夢境內容屬私人資料，不會用作 AI 訓練</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-800 bg-white px-3 py-1 rounded-xl border border-slate-300">
              <Lock className="w-4 h-4 text-blue-700" />
              <span>本人專屬閱讀 · 絕不轉交第三方</span>
            </div>
          </div>

          {/* 4. 主要夢境文字輸入框 */}
          <div className="relative z-10 mb-3.5">
            <textarea
              ref={textareaRef}
              value={draftDream}
              onChange={handleDreamChange}
              placeholder="寫低你記得嘅夢境……醒來時有甚麼畫面？你當時感覺點？（可點擊上方「記夢引導」快速帶入提示，或直接自由書寫）"
              id="hero-dream-textarea"
              rows={4}
              className="w-full bg-white border-2 border-blue-300 focus:border-blue-700 rounded-2xl text-slate-950 placeholder:text-slate-500 text-base sm:text-lg p-4 sm:p-5 focus:outline-none resize-none leading-relaxed min-h-[130px] max-h-[380px] overflow-y-auto transition-all shadow-sm font-medium"
            />
            {/* 字數計數與即時提示 */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 font-bold px-2 mt-1.5">
              <span>醒來零碎記憶都可以隨手寫</span>
              <span className="font-mono font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-lg border border-blue-200">
                {draftDream.length} 字
              </span>
            </div>
          </div>

          {/* 5. 補充意象詞快速晶片列表 */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-5 pt-1 text-xs sm:text-sm">
            <span className="text-slate-900 font-black shrink-0">補充意象詞：</span>
            {dreamTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleApplyQuickTag(tag.label)}
                className="px-3 py-1.5 rounded-xl bg-blue-100/90 hover:bg-blue-200 border-2 border-blue-300 hover:border-blue-400 text-blue-950 font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span className="text-blue-700 font-black">+</span>
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>

          {/* 6. 底部操作欄（原型意象說明 + 觀看示範報告 + 記錄夢境開始分析） */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-4 border-t-2 border-blue-200">
            <div className="text-xs sm:text-sm text-slate-800 font-bold flex items-center gap-2">
              <span>經典心理學原型意象</span>
              <span className="text-slate-400">·</span>
              <span>專屬深度心靈洞察</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
              {/* 觀看示範報告 */}
              <button
                type="button"
                onClick={() => handleOpenSample('dna')}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 border-2 border-blue-300 hover:border-blue-500 text-blue-950 text-sm font-black flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Eye className="w-4 h-4 text-blue-700" />
                <span>觀看示範報告</span>
              </button>

              {/* 記錄夢境開始分析 → */}
              <button
                type="button"
                onClick={handleStart}
                className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white text-sm sm:text-base font-black shadow-lg shadow-blue-700/25 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95"
                id="hero-cta-record-btn"
              >
                <span>記錄夢境開始分析</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 3. 如何解讀你的夢（三步驟開啟夢境智慧） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-10 sm:py-16 text-center" id="how">
        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-xs sm:text-sm font-serif text-blue-800 font-black tracking-widest uppercase mb-1">
            —— 如何解讀你的夢 ——
          </p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-4xl md:text-5xl text-slate-950 tracking-wide">
            ✦ 只需三個步驟，開啟夢境的智慧 ✦
          </h2>
          <p className="text-sm sm:text-base text-slate-800 font-bold mt-3 max-w-xl mx-auto leading-relaxed">
            DreamWisdom 透過 AI 與你的潛意識對話，將夢境轉化為專屬於你的洞察。
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-5 lg:gap-7 max-w-5xl mx-auto">
          {/* Step 1: 記錄夢境 */}
          <div className="w-full md:w-1/3 p-7 rounded-3xl bg-gradient-to-b from-[#F5F8FF] to-white border-2 border-blue-200 relative flex flex-col items-center text-center shadow-md hover:border-blue-400 transition-all">
            <div className="relative mb-3.5">
              <StepNotepadIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-mono font-black shadow-xs">
                01
              </span>
            </div>
            <h3 className="font-celestial-serif font-black text-xl text-slate-950 mb-2">
              記錄夢境
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
              輸入你的夢境細節，記錄得越詳細，AI 能剖析的潛意識象徵就越深刻。
            </p>
          </div>

          <div className="hidden md:flex text-blue-400 text-3xl font-black select-none">
            ›
          </div>

          {/* Step 2: AI分析 */}
          <div className="w-full md:w-1/3 p-7 rounded-3xl bg-gradient-to-b from-[#F5F8FF] to-white border-2 border-blue-200 relative flex flex-col items-center text-center shadow-md hover:border-blue-400 transition-all">
            <div className="relative mb-3.5">
              <StepAiBrainIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-mono font-black shadow-xs">
                02
              </span>
            </div>
            <h3 className="font-celestial-serif font-black text-xl text-slate-950 mb-2">
              AI分析
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
              DreamWisdom 將結合象徵意義、心理學與星象，為你解讀夢境。
            </p>
          </div>

          <div className="hidden md:flex text-blue-400 text-3xl font-black select-none">
            ›
          </div>

          {/* Step 3: 獲得洞察 */}
          <div className="w-full md:w-1/3 p-7 rounded-3xl bg-gradient-to-b from-[#F5F8FF] to-white border-2 border-blue-200 relative flex flex-col items-center text-center shadow-md hover:border-blue-400 transition-all">
            <div className="relative mb-3.5">
              <StepInsightIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-mono font-black shadow-xs">
                03
              </span>
            </div>
            <h3 className="font-celestial-serif font-black text-xl text-slate-950 mb-2">
              獲得洞察
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
              獲得專屬於你的夢境報告，包含潛意識訊息、情緒建議與未來指引。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 4. 三大功能卡片（DREAM DNA · 星圖解析 · 30 晚檔案） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-6 sm:py-12" id="three-pillars-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: DREAM DNA */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#F8FAFF] to-white border-2 border-blue-200 flex flex-col justify-between shadow-md hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-blue-900 mb-2.5">
                <Dna className="w-4 h-4 text-blue-700" />
                <span>DREAM DNA</span>
              </div>
              <div className="my-2 flex justify-center">
                <DreamDnaArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-950 tracking-tight mt-2 mb-1.5">
                DREAM DNA
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                解析夢境中的象徵代號，揭示你內在深層的性格與深層需求。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t-2 border-blue-100">
              <button
                type="button"
                onClick={() => onGoToApp('dna')}
                className="text-xs sm:text-sm font-black text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>探索你的夢境 DNA →</span>
              </button>
            </div>
          </div>

          {/* Card 2: 星圖解析 */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#F8FAFF] to-white border-2 border-blue-200 flex flex-col justify-between shadow-md hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-blue-900 mb-2.5">
                <Compass className="w-4 h-4 text-blue-700" />
                <span>星圖解析</span>
              </div>
              <div className="my-2 flex justify-center">
                <ConstellationAstrolabeArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-950 tracking-tight mt-2 mb-1.5">
                星圖解析
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                結合星象能量，解讀夢境中的行星與星座意義。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t-2 border-blue-100">
              <button
                type="button"
                onClick={() => onGoToApp('constellation')}
                className="text-xs sm:text-sm font-black text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>查看星圖報告 →</span>
              </button>
            </div>
          </div>

          {/* Card 3: 30 晚潛意識檔案 */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#F8FAFF] to-white border-2 border-blue-200 flex flex-col justify-between shadow-md hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-blue-900 mb-2.5">
                <Key className="w-4 h-4 text-blue-700" />
                <span>30 晚潛意識檔案</span>
              </div>
              <div className="my-2 flex justify-center">
                <OracleCardsArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-950 tracking-tight mt-2 mb-1.5">
                30 晚潛意識檔案
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                連續 30 晚的夢境記錄，建立你的潛意識成長檔案。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t-2 border-blue-100">
              <button
                type="button"
                onClick={() => onGoToApp('mystery')}
                className="text-xs sm:text-sm font-black text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>探索你的 30 晚檔案 →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 5. 解夢選物店推薦橫幅 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-10" id="shop-highlight">
        <div className="p-8 sm:p-9 rounded-[32px] bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-200 text-emerald-950 text-xs font-black border border-emerald-400">
                <ShoppingBag className="w-4 h-4 text-emerald-800" />
                <span>解夢選物店 · 身心靈轉化</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                將夢中的訊息，轉化為守護與療癒能量
              </h3>
              <p className="text-sm sm:text-base text-slate-800 max-w-xl leading-relaxed font-bold">
                精選香港手工純天然複方深眠精油、月光白水晶柱、鼠尾草淨化薰香塔，助你安睡好眠，梳理內在雜念。
              </p>
            </div>
            <button
              type="button"
              onClick={() => onGoToApp('workspace')}
              className="px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm sm:text-base shadow-md transition-all shrink-0 cursor-pointer"
            >
              前往解夢選物店 →
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 6. 常見疑問 FAQ 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-12 max-w-3xl mx-auto" id="faq">
        <div className="text-center mb-8">
          <p className="text-xs sm:text-sm font-serif text-blue-800 font-black tracking-widest uppercase">FAQ</p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-950 mt-1">
            常見疑問解答
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-blue-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-base sm:text-lg font-black text-slate-950 hover:text-blue-700 cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm sm:text-base text-slate-800 leading-relaxed border-t-2 border-blue-100 pt-3.5 font-bold">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 7. 底部感性寄語（每一個夢 ✦ 都是你內心的智慧 ✦） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-12 sm:py-16 text-center">
        <p className="text-xs sm:text-sm font-serif text-blue-800 font-black tracking-widest uppercase mb-1">
          —— 每一個夢 ——
        </p>
        <h2 className="font-brush text-3xl sm:text-5xl md:text-6xl tracking-wide select-none text-[#1E3A8A]">
          ✦ 都是你內心的智慧 ✦
        </h2>
        <p className="text-sm sm:text-base text-slate-800 font-bold mt-2 max-w-md mx-auto">
          DreamWisdom 與你一起，探索夢境、遇見真實的自己。
        </p>
      </section>

      {/* 隱藏彈窗元件 */}
      <TherapeuticSupportModal
        isOpen={isTherapeuticOpen}
        onClose={() => setIsTherapeuticOpen(false)}
        therapists={therapists}
      />

      <SampleReportPreviewModal
        isOpen={isSamplePreviewOpen}
        onClose={() => setIsSamplePreviewOpen(false)}
        onGoToPricing={onGoToPricing}
        initialTab={sampleInitialTab}
        onOpenEarnStars={() => {
          setIsSamplePreviewOpen(false);
          onGoToApp('workspace');
        }}
      />
    </main>
  );
};
