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
  Mic,
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
  const [isListening, setIsListening] = useState(false);
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);
  const [isSamplePreviewOpen, setIsSamplePreviewOpen] = useState(false);
  const [sampleInitialTab, setSampleInitialTab] = useState<'dna' | 'constellation' | 'mystery'>('dna');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-expanding textarea
  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftDream(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  };

  // Web Speech API Voice Recognition (supports Cantonese & Mandarin)
  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('您的瀏覽器暫未支援語音辨識，請使用文字鍵入夢境內容。');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-HK';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setDraftDream((prev) => (prev ? `${prev}，${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
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
      q: '廣東話語音輸入能準確辨識嗎？',
      a: '完全支援！我們針對香港日常粵語語境與口語詞彙進行了專門優化，無論是「我琴晚夢見跌落樓梯」或「好似俾人追住走」，AI 都能精確理解情緒核心。',
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
      {/* 快速錨點導航條 (銀白淺灰底色，清晰可見) */}
      <div className="w-full bg-white/95 border-b border-slate-200 backdrop-blur-md sticky top-16 z-30 py-2.5 px-4 shadow-xs">
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
      {/* 🌟 1. HERO 頂部視覺（依原設計保留所有文字、邊界聲明與支援連結） 🌟 */}
      {/* ============================================================ */}
      <section className="shell relative pt-8 sm:pt-12 pb-6 text-center" id="hero-section">
        {/* 頂部徽章 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>DREAMWISDOM · 專為香港廣東話設計的夢境宇宙</span>
        </div>

        {/* 核心主標題 */}
        <h1
          id="hero-title"
          className="font-celestial-serif font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 tracking-wide leading-tight sm:leading-tight mb-4 max-w-4xl mx-auto"
        >
          每一個夢，都是潛意識留給你的信。
        </h1>

        {/* 副標題 */}
        <p className="font-sans font-bold text-lg sm:text-xl md:text-2xl text-blue-800 tracking-wide mb-3">
          別人解讀你的夢。我們記得你的夢。
        </p>

        {/* 心理學理論與產品介紹 */}
        <p className="font-sans text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-5">
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
        <div id="recorddream" className="scroll-mt-24" />
        <div
          className="max-w-3xl mx-auto relative z-10 w-full bg-white shadow-md border border-slate-200/90 rounded-[28px] p-5 sm:p-7 text-left"
          id="hero-dreambox"
        >
          {/* 1. 卡片頂部欄：記錄今晨夢境 + 建議字數 */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>記錄今晨夢境</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              輸入醒來記得的任何片段 · 建議 15 字以上
            </span>
          </div>

          {/* 2. 記夢引導（點擊帶入回憶結構） */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-3.5">
            <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>記夢引導（點擊帶入回憶結構）：</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('characters')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 hover:text-blue-700 font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【人物】提示"
              >
                <span>👥</span>
                <span>有邊啲人物？</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('scene')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 hover:text-blue-700 font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【場景】提示"
              >
                <span>📍</span>
                <span>場景係邊度？</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('emotion')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 hover:text-blue-700 font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【感覺】提示"
              >
                <span>💭</span>
                <span>感覺驚／開心／不安？</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddGuidePrompt('objects')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 hover:text-blue-700 font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="點擊帶入【物件】提示"
              >
                <span>🚪</span>
                <span>有冇特定物件？</span>
              </button>
            </div>
          </div>

          {/* 3. 私隱保證列（高清晰綠色與深灰標籤） */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3 px-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <span>💡</span>
              <span>你嘅夢境內容屬私人資料，不會用作 AI 訓練</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>本人專屬閱讀 · 絕不轉交第三方</span>
            </div>
          </div>

          {/* 4. 主要夢境文字輸入框 */}
          <div className="relative mb-3">
            <textarea
              ref={textareaRef}
              value={draftDream}
              onChange={handleDreamChange}
              placeholder="寫低你記得嘅夢境……醒來時有甚麼畫面？你當時感覺點？（可點擊上方「記夢引導」快速帶入提示，或直接自由書寫）"
              id="hero-dream-textarea"
              rows={4}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base p-4 focus:outline-none resize-none leading-relaxed min-h-[120px] max-h-[380px] overflow-y-auto transition-all shadow-inner focus:ring-2 focus:ring-blue-100"
            />
            {/* 字數計數與即時提示 */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 mt-1">
              <span>醒來零碎記憶都可以隨手寫</span>
              <span className="font-mono font-medium text-slate-600">{draftDream.length} 字</span>
            </div>
          </div>

          {/* 5. 補充意象詞快速晶片列表 */}
          <div className="flex flex-wrap items-center gap-1.5 mb-5 pt-1 text-xs">
            <span className="text-slate-600 font-semibold shrink-0">補充意象詞：</span>
            {dreamTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleApplyQuickTag(tag.label)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span className="text-blue-600 font-bold">+</span>
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>

          {/* 6. 底部操作欄（原型意象說明 + 觀看示範報告 + 記錄夢境開始分析） */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
              <span>經典心理學原型意象</span>
              <span className="text-slate-300">·</span>
              <span>專屬深度心靈洞察</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
              {/* 語音輸入 */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isListening
                    ? 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
                title="語音錄音（支援廣東話及普通話）"
              >
                <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-rose-600' : 'text-blue-600'}`} />
                <span>{isListening ? '錄音中' : '語音'}</span>
              </button>

              {/* 觀看示範報告 */}
              <button
                type="button"
                onClick={() => handleOpenSample('dna')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>觀看示範報告</span>
              </button>

              {/* 記錄夢境開始分析 → */}
              <button
                type="button"
                onClick={handleStart}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-700/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
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
          <p className="text-xs sm:text-sm font-serif text-blue-700 font-semibold tracking-widest uppercase mb-1">
            —— 如何解讀你的夢 ——
          </p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-4xl md:text-5xl text-slate-900 tracking-wide">
            ✦ 只需三個步驟，開啟夢境的智慧 ✦
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
            DreamWisdom 透過 AI 與你的潛意識對話，將夢境轉化為專屬於你的洞察。
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6 max-w-5xl mx-auto">
          {/* Step 1: 記錄夢境 */}
          <div className="card w-full md:w-1/3 p-6 rounded-3xl bg-white border border-slate-200 relative flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="relative mb-3">
              <StepNotepadIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-blue-700 text-white text-[11px] font-mono font-bold shadow-xs">
                01
              </span>
            </div>
            <h3 className="font-celestial-serif font-bold text-lg sm:text-xl text-slate-900 mb-2">
              記錄夢境
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              輸入你的夢境細節，可以文字或語音，讓詳細越好。
            </p>
          </div>

          <div className="hidden md:flex text-slate-400 text-3xl font-light select-none">
            ›
          </div>

          {/* Step 2: AI分析 */}
          <div className="card w-full md:w-1/3 p-6 rounded-3xl bg-white border border-slate-200 relative flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="relative mb-3">
              <StepAiBrainIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-blue-700 text-white text-[11px] font-mono font-bold shadow-xs">
                02
              </span>
            </div>
            <h3 className="font-celestial-serif font-bold text-lg sm:text-xl text-slate-900 mb-2">
              AI分析
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              DreamWisdom 將結合象徵意義、心理學與星象，為你解讀夢境。
            </p>
          </div>

          <div className="hidden md:flex text-slate-400 text-3xl font-light select-none">
            ›
          </div>

          {/* Step 3: 獲得洞察 */}
          <div className="card w-full md:w-1/3 p-6 rounded-3xl bg-white border border-slate-200 relative flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="relative mb-3">
              <StepInsightIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-blue-700 text-white text-[11px] font-mono font-bold shadow-xs">
                03
              </span>
            </div>
            <h3 className="font-celestial-serif font-bold text-lg sm:text-xl text-slate-900 mb-2">
              獲得洞察
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
          <div className="card p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2">
                <Dna className="w-4 h-4 text-blue-600" />
                <span>DREAM DNA</span>
              </div>
              <div className="my-2 flex justify-center">
                <DreamDnaArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-900 tracking-tight mt-2 mb-1.5">
                DREAM DNA
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                解析夢境中的象徵代號，揭示你內在深層的性格與深層需求。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onGoToApp('dna')}
                className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>探索你的夢境 DNA →</span>
              </button>
            </div>
          </div>

          {/* Card 2: 星圖解析 */}
          <div className="card p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>星圖解析</span>
              </div>
              <div className="my-2 flex justify-center">
                <ConstellationAstrolabeArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-900 tracking-tight mt-2 mb-1.5">
                星圖解析
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                結合星象能量，解讀夢境中的行星與星座意義。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onGoToApp('constellation')}
                className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>查看星圖報告 →</span>
              </button>
            </div>
          </div>

          {/* Card 3: 30 晚潛意識檔案 */}
          <div className="card p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2">
                <Key className="w-4 h-4 text-blue-600" />
                <span>30 晚潛意識檔案</span>
              </div>
              <div className="my-2 flex justify-center">
                <OracleCardsArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-900 tracking-tight mt-2 mb-1.5">
                30 晚潛意識檔案
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                連續 30 晚的夢境記錄，建立你的潛意識成長檔案。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onGoToApp('mystery')}
                className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
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
        <div className="p-8 rounded-[28px] bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                <span>解夢選物店 · 身心靈轉化</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                將夢中的訊息，轉化為守護與療癒能量
              </h3>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                精選香港手工純天然複方深眠精油、月光白水晶柱、鼠尾草淨化薰香塔，助你安睡好眠，梳理內在雜念。
              </p>
            </div>
            <button
              type="button"
              onClick={() => onGoToApp('workspace')}
              className="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all shrink-0 cursor-pointer"
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
          <p className="text-xs font-serif text-blue-700 font-semibold tracking-widest uppercase">FAQ</p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            常見疑問解答
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 hover:text-blue-700 cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
        <p className="text-xs sm:text-sm font-serif text-blue-700 font-semibold tracking-widest uppercase mb-1">
          —— 每一個夢 ——
        </p>
        <h2 className="font-celestial-serif font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-wide">
          ✦ 都是你內心的智慧 ✦
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
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
