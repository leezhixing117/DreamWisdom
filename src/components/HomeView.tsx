import React, { useState, useRef } from 'react';
import {
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  Compass,
  Key,
  ChevronDown,
  ChevronUp,
  Dna,
  Heart,
  Mic,
  Lock,
  Eye,
  AlertCircle,
  ExternalLink,
  PhoneCall,
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
  therapists,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isPaidMember = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';

  const [draftDream, setDraftDream] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);
  const [isSamplePreviewOpen, setIsSamplePreviewOpen] = useState(false);
  const [sampleInitialTab, setSampleInitialTab] = useState<'dna' | 'constellation' | 'mystery'>('dna');
  
  // 3. 記夢引導改為可折疊模塊，預設收起 (false)
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 5. 空內容提交友善校驗提示
  const [validationError, setValidationError] = useState<string | null>(null);

  // 7. 香港心理支援熱線可折疊模塊，預設收起，點擊直接展開熱線號碼
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);

  // 8. FAQ手風琴：L3 次要卡片預設折疊，降低視覺重量
  const [openFaqKeys, setOpenFaqKeys] = useState<Set<string>>(new Set());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // 輸入框即時處理與自動高度調整
  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftDream(e.target.value);
    if (validationError && e.target.value.trim().length > 0) {
      setValidationError(null);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  };

  // 語音輸入辨識（支援廣東話及普通話）
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
      alert('您的瀏覽器暫未支援語音辨識，請使用文字輸入夢境內容。');
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
          if (validationError) setValidationError(null);
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

  // 2 & 5. 點擊記錄夢境開始分析（高權重主CTA，空內容友善校驗提示）
  const handleStartAnalysis = () => {
    const trimmed = draftDream.trim();
    if (!trimmed) {
      setValidationError('請先寫低幾句醒來記得嘅夢境片段或意象，哪怕只有零碎幾個字都可以～');
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setValidationError(null);
    onStartWithDream(trimmed);
  };

  // 2. 觀看示範報告：使用線框樣式，開新分頁打開，絕不覆蓋首頁
  const handleOpenSampleNewTab = (e: React.MouseEvent) => {
    e.preventDefault();
    // 優先在新分頁打開獨立示範報告頁面，不覆蓋當前首頁狀態
    window.open('/report?demo=1', '_blank', 'noopener,noreferrer');
  };

  // 4. 補充意象詞全部實作為可點擊標籤，點擊文字自動插入輸入框
  const handleApplyQuickTag = (tagLabel: string) => {
    setDraftDream((prev) => {
      const trimmed = prev.trim();
      const insertText = `【${tagLabel}】`;
      if (!trimmed) return insertText;
      if (trimmed.includes(insertText)) return trimmed;
      return `${trimmed}、${insertText}`;
    });
    if (validationError) setValidationError(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // 記夢引導結構快速插入
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
    if (validationError) setValidationError(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // FAQ 展開/收起切換
  const toggleFaq = (key: string) => {
    setOpenFaqKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // 4. 意象詞清單
  const dreamTags = [
    { label: '海洋水流', icon: '🌊' },
    { label: '赤腳無鞋', icon: '👣' },
    { label: '被人追趕', icon: '🏃' },
    { label: '舊居祖屋', icon: '🏚️' },
    { label: '家宅神枱', icon: '🕯️' },
    { label: '課室考試', icon: '🏫' },
    { label: '緊閉門鎖', icon: '🚪' },
    { label: '高處墜落', icon: '🕳️' },
    { label: '牙齒脫落', icon: '🦷' },
    { label: '自由飛翔', icon: '🕊️' },
    { label: '趕車遲到', icon: '⏰' },
    { label: '電梯失控', icon: '🛗' },
  ];

  // 8. FAQ 清單（theory 與 privacy 預設展開）
  const faqItems = [
    {
      id: 'theory',
      q: 'DreamWisdom 解夢是基於甚麼理論？',
      a: 'DreamWisdom 嚴格立足於瑞士深度心理學家榮格（Carl Jung）的原型（Archetypes）與集體潛意識理論、佛洛伊德的夢境防衛機轉，並融入當代認知情緒心理學。我們將夢境視為「清醒自我的心理代償」，絕非算命占卜，為你的夢境提供多維度的理性自我反思與情緒覺察。',
    },
    {
      id: 'privacy',
      q: '我的夢境記錄會被其他人或 AI 訓練公開嗎？',
      a: '絕對不會。我們採用個人私隱沙盒端對端隔離機制，所有夢境內容絕不用作公開大模型訓練，亦絕不會轉交或出售予第三方，保證你內心最私密的潛意識記錄百分之百安全。',
    },
    {
      id: 'cantonese',
      q: '廣東話語音輸入能準確辨識嗎？',
      a: '完全支援！我們針對香港本地粵語語境與口語詞彙（如「跌落樓梯」、「被追住走」、「好心慌」、「被老細照肺」）進行了深度情境優化，AI 能夠精確理解廣東話背後的情緒張力。',
    },
    {
      id: 'report',
      q: '解夢報告中的星圖與象徵解析有何特別之處？',
      a: '每份報告均生成專屬的 DREAM DNA™ 象徵密碼，並結合夢境星圖 CONSTELLATION™，將你多個夢境中的象徵與情緒連線，揭示潛意識在時間軸上的長期成長軌跡。',
    },
  ];

  return (
    <main id="home-view-main" className="overflow-hidden bg-transparent pb-16">
      {/* 快速錨點導航條 (僅保留導航列，無首頁商品陳列) */}
      <div className="w-full bg-white/90 border-b border-slate-200/80 backdrop-blur-md sticky top-16 z-30 py-2.5 px-4 shadow-xs">
        <div className="shell flex items-center justify-between text-xs text-[var(--text-sub)] overflow-x-auto gap-3 scrollbar-none">
          <div className="flex items-center gap-1 shrink-0 font-bold text-[var(--primary-700)]">
            <span>快速導航：</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-medium">
            <a href="#recorddream" className="hover:text-[var(--primary-800)] transition-colors">✍️ 記夢輸入</a>
            <a href="#hero-astrolabe-deck" className="hover:text-[var(--primary-800)] transition-colors">🪐 天體星盤</a>
            <a href="#three-pillars-section" className="hover:text-[var(--primary-800)] transition-colors">🧬 潛意識模組</a>
            <a href="#how" className="hover:text-[var(--primary-800)] transition-colors">☁️ 三步解讀</a>
            <a href="#hotlines-section" className="hover:text-[var(--primary-800)] transition-colors">🩺 支援熱線</a>
            <a href="#faq" className="hover:text-[var(--primary-800)] transition-colors">💬 常見疑問</a>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🌟 1. HERO 頂部視覺（H1 嚴格首頁大標，無障礙與 SEO） 🌟 */}
      {/* ============================================================ */}
      <section className="shell relative pt-8 sm:pt-12 pb-6 text-center" id="hero-section">
        
        {/* 頂部徽章 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[var(--primary-800)] text-xs sm:text-sm font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary-600)]" />
          <span>✦ DREAMWISDOM · 專為香港廣東話設計的夢境宇宙 ✦</span>
        </div>

        {/* 9. 核心主標題 (H1 標籤，行高 1.2-1.3) */}
        <h1
          id="hero-title"
          className="font-celestial-serif font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--text-heading)] tracking-wide leading-[1.2] mb-4 max-w-4xl mx-auto"
        >
          每一個夢，都是潛意識留給你的信。
        </h1>

        {/* 副標題 */}
        <p className="font-sans font-bold text-lg sm:text-xl md:text-2xl text-[var(--primary-700)] tracking-wide mb-3">
          別人解讀你的夢。我們記得你的夢。
        </p>

        {/* 心理學理論與產品介紹 */}
        <p className="font-sans text-sm sm:text-base text-[var(--text-body)] max-w-2xl mx-auto leading-[1.65] mb-4">
          DreamWisdom 唔係憑空估，而係從榮格原型心理學找出相應理論，結合你過往夢境，整理可能值得留意嘅潛意識訊息。
        </p>

        {/* 產品邊界聲明 (L3 免責聲明：--accent-warm-light底色，移除陰影，降低視覺重量) */}
        <div className="card-l3-secondary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[var(--text-heading)] text-xs sm:text-sm font-medium mb-3 max-w-3xl mx-auto text-left sm:text-center">
          <span>⚠️ 產品邊界：本平台不是心理治療、不是精神科服務；只做基於心理學的自我反思工具，不做吉凶預測。</span>
        </div>

        {/* 專業心理支援與熱線快速指引 */}
        <div className="mb-6">
          <a
            href="#hotlines-section"
            className="text-xs sm:text-sm text-[var(--text-sub)] hover:text-[var(--text-heading)] transition-colors inline-flex items-center gap-1.5 cursor-pointer underline decoration-slate-300 hover:decoration-[var(--primary-600)] underline-offset-4"
          >
            <span>若重複夢魘持續帶來困擾，</span>
            <span className="text-rose-700 font-medium flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" /> 我們提供香港專業心理支援與熱線指引
            </span>
          </a>
        </div>

        {/* ============================================================ */}
        {/* 🌟 2. 記夢輸入核心卡片 (L1 最高優先，全頁唯一 L1 卡片) 🌟 */}
        {/* ============================================================ */}
        <div id="recorddream" className="scroll-mt-28" />
        <div className="max-w-4xl mx-auto my-8 sm:my-12 text-left" id="hero-interactive-deck">
          
          {/* L1【記夢輸入卡片｜最高優先】全頁唯一L1卡片 */}
          <div
            className="card-l1-dream relative z-10 w-full p-6 sm:p-8 md:p-10 flex flex-col justify-between"
            id="hero-dreambox"
          >
            <div>
              {/* 卡片頂部欄：記錄今晨夢境 + 建議字數 */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2 text-[var(--text-heading)] font-bold text-base sm:text-lg">
                  <Sparkles className="w-4 h-4 text-[var(--primary-600)]" />
                  <span>記錄今晨夢境</span>
                </div>
                <span className="text-xs text-[var(--text-sub)] font-medium">
                  廣東話口語輸入即可 · 建議 15 字以上
                </span>
              </div>

              {/* 3. 記夢引導改為可折疊模塊，預設收起 (預設 isGuideOpen = false) */}
              <div className="rounded-2xl bg-white/80 border border-slate-200/90 mb-3.5 overflow-hidden transition-all shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-bold text-[var(--primary-700)] hover:bg-blue-50/50 transition-colors select-none"
                >
                  <span className="flex items-center gap-2">
                    <span>💡 記夢引導（點擊帶入回憶結構小貼士）</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--text-sub)]">
                    <span>{isGuideOpen ? '收起引導' : '展開引導'}</span>
                    {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isGuideOpen && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddGuidePrompt('characters')}
                        className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-[var(--primary-600)] text-xs text-[var(--text-body)] hover:text-[var(--primary-700)] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title="點擊帶入【人物】提示"
                      >
                        <span>👥</span>
                        <span>有邊啲人物？</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddGuidePrompt('scene')}
                        className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-[var(--primary-600)] text-xs text-[var(--text-body)] hover:text-[var(--primary-700)] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title="點擊帶入【場景】提示"
                      >
                        <span>📍</span>
                        <span>場景係邊度？</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddGuidePrompt('emotion')}
                        className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-[var(--primary-600)] text-xs text-[var(--text-body)] hover:text-[var(--primary-700)] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title="點擊帶入【感覺】提示"
                      >
                        <span>💭</span>
                        <span>感覺驚／不安？</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddGuidePrompt('objects')}
                        className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-[var(--primary-600)] text-xs text-[var(--text-body)] hover:text-[var(--primary-700)] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title="點擊帶入【物件】提示"
                      >
                        <span>🚪</span>
                        <span>有冇特定物件？</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--text-sub)] leading-relaxed">
                      提示：醒來第一時間哪怕只記低一個感覺或單字，點擊標籤即可快速建立結構，由潛意識自主延伸。
                    </p>
                  </div>
                )}
              </div>

              {/* 6. 隱私承諾使用淺底色小卡片強化識別 (WCAG AA 高對比深文字) */}
              <div className="card-secondary-warm p-3 mb-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-heading)] font-medium">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>香港本地私隱承諾：夢境內容屬私密個人投射，絕不用於 AI 訓練</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-sub)]">
                  <Lock className="w-3.5 h-3.5 text-[var(--primary-600)] shrink-0" />
                  <span>沙盒專屬隔離 · 絕不轉交第三方</span>
                </div>
              </div>

              {/* 5 & 12. 主要夢境文字輸入框（實時字數顯示、防虛擬鍵盤遮擋） */}
              <div className="relative mb-3">
                <textarea
                  ref={textareaRef}
                  value={draftDream}
                  onChange={handleDreamChange}
                  placeholder="寫低你記得嘅夢境……醒來時有甚麼畫面？你當時感覺點？（可點擊右側星盤感應原型，或點擊下方意象標籤快速填寫）"
                  id="hero-dream-textarea"
                  rows={5}
                  className={`w-full bg-white/95 focus:bg-white border ${
                    validationError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[var(--primary-600)]'
                  } rounded-2xl text-[var(--text-heading)] placeholder:text-[var(--text-muted)] text-sm sm:text-base p-4 focus:outline-none resize-none leading-[1.65] min-h-[130px] max-h-[380px] overflow-y-auto transition-all shadow-inner focus:ring-2 ${
                    validationError ? 'focus:ring-rose-100' : 'focus:ring-blue-100'
                  }`}
                />
                
                {/* 5. 輸入框實時顯示字數提示 */}
                <div className="flex items-center justify-between text-xs text-[var(--text-sub)] mt-1.5 px-1">
                  <span>醒來零碎記憶都可以隨手寫，字數不限</span>
                  <span className="font-mono font-medium text-[var(--text-heading)] bg-slate-100 px-2 py-0.5 rounded-md">
                    目前字數：{draftDream.length} 字 {draftDream.length >= 15 ? '✓ (良好長度)' : ''}
                  </span>
                </div>

                {/* 5. 友好校驗提示 */}
                {validationError && (
                  <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* 4. 意象標籤：點擊自動填入輸入框 */}
              <div className="mb-5 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-sub)] font-semibold mb-2">
                  <span>✦ 點擊意象標籤，自動插入夢境內容：</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {dreamTags.map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => handleApplyQuickTag(tag.label)}
                      className="tag-chip-l4"
                    >
                      <span className="text-[var(--primary-600)] font-bold text-sm">+</span>
                      <span>{tag.icon}</span>
                      <span>{tag.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2 & 12. 底部操作欄（兩按鈕分開：主CTA天藍漸變、次要線框新分頁開，按鈕高度≥48px） */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
              <div className="text-xs text-[var(--text-sub)] font-medium flex items-center gap-1.5">
                <span>榮格深度心理學原型意象</span>
                <span className="text-slate-300">·</span>
                <span>專屬自我反思鏡像</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* 語音按鈕 */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isListening
                      ? 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-[var(--text-body)]'
                  }`}
                  title="語音錄音（支援廣東話及普通話）"
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'text-rose-600' : 'text-[var(--primary-600)]'}`} />
                  <span>{isListening ? '聆聽中…' : '語音記夢'}</span>
                </button>

                {/* B2次要按鈕【觀看示範報告】：線框樣式，尺寸小於主按鈕；hover只加極淺底色，禁止變實心 */}
                <a
                  href="/report?demo=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenSampleNewTab}
                  className="btn-b2-secondary px-5 py-2.5"
                  title="在新分頁開啟示範報告預覽，不影響當前首頁"
                >
                  <Eye className="w-4 h-4 text-[var(--primary-600)]" />
                  <span>觀看示範報告</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--text-sub)]" />
                </a>

                {/* B1主CTA【記錄夢境開始分析】：灰藍漸變、白色粗字；尺寸最大；緊貼輸入框下方；hover柔和加深；active scale(0.98)；空白輸入時設置禁用狀態 */}
                <button
                  type="button"
                  disabled={!draftDream.trim()}
                  onClick={handleStartAnalysis}
                  className="btn-b1-primary px-7 py-3.5 flex-1 sm:flex-initial"
                  id="hero-cta-record-btn"
                >
                  <span>記錄夢境開始分析</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 3. 三大潛意識心靈解析模組 (Version B 深度體系) 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-12 sm:py-16" id="three-pillars-section">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs sm:text-sm font-serif text-[var(--primary-600)] font-semibold tracking-widest uppercase mb-1">
            —— 深度沉澱體系 ——
          </p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-4xl text-slate-900 tracking-wide">
            三大潛意識心靈解析模組
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            持續記錄你的夢境軌跡，構建專屬你的潛意識心靈資料庫。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: DREAM DNA (L2 中等層次) */}
          <div className="card-l2-standard flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A47A3] mb-2">
                <Dna className="w-4 h-4 text-[#4A47A3]" />
                <span>DREAM DNA</span>
              </div>
              <div className="my-2 flex justify-center">
                <DreamDnaArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-900 tracking-tight mt-2 mb-1.5">
                DREAM DNA 基因圖譜
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                解析夢境中的象徵代號，繪製情緒頻譜與原型雷達圖，揭示真實性格與深層需求。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => onGoToApp('dna')}
                className="btn-b3-link w-full justify-between"
              >
                <span>探索你的夢境 DNA</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>

          {/* Card 2: 星圖解析 (L2 中等層次) */}
          <div className="card-l2-standard flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A47A3] mb-2">
                <Compass className="w-4 h-4 text-[#4A47A3]" />
                <span>星圖解析</span>
              </div>
              <div className="my-2 flex justify-center">
                <ConstellationAstrolabeArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-900 tracking-tight mt-2 mb-1.5">
                天體宿位與星圖解析
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                結合天體二十八宿運行輪盤與榮格共時性理論，解讀夢中象徵的宇宙共振。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => onGoToApp('constellation')}
                className="btn-b3-link w-full justify-between"
              >
                <span>查看尊享星圖報告</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>

          {/* Card 3: 30 晚潛意識檔案 (L2 中等層次) */}
          <div className="card-l2-standard flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706]">
                  <Key className="w-4 h-4 text-[#D97706]" />
                  <span>30 晚潛意識檔案</span>
                </div>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  持續記錄解鎖
                </span>
              </div>
              <div className="my-2 flex justify-center">
                <OracleCardsArtwork className="w-full h-36" />
              </div>
              <h3 className="font-celestial-serif font-black text-2xl text-slate-900 tracking-tight mt-2 mb-1.5">
                30 晚潛意識檔案
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                連續 30 晚的夢境記錄沉澱，建立專屬你的心靈成長檔案，見證內在轉化。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => onGoToApp('mystery')}
                className="btn-b3-link w-full justify-between"
              >
                <span>探索你的 30 晚檔案</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 4. 如何解讀你的夢（三步驟開啟心靈智慧） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-10 sm:py-16 text-center" id="how">
        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-xs sm:text-sm font-serif text-[var(--primary-600)] font-semibold tracking-widest uppercase mb-1">
            —— 理論轉化流程 ——
          </p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-4xl text-[var(--text-heading)] tracking-wide leading-[1.25]">
            如何解讀你的夢：三步驟開啟心靈智慧
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-sub)] mt-3 max-w-xl mx-auto leading-[1.65]">
            DreamWisdom 透過榮格原型心理模型與你的潛意識對話，將夢境轉化為專屬於你的生活洞察。
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6 max-w-5xl mx-auto">
          {/* Step 1: L2 中等內容卡片 */}
          <div className="card-l2-standard w-full md:w-1/3 p-6 sm:p-7 relative flex flex-col items-center text-center">
            <div className="relative mb-3">
              <StepNotepadIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-[var(--primary-600)] text-white text-[11px] font-mono font-bold shadow-xs">
                01
              </span>
            </div>
            <h3 className="font-celestial-serif font-bold text-lg sm:text-xl text-[var(--text-heading)] mb-2">
              醒時速記夢境
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-body)] leading-[1.65]">
              用最自然嘅香港廣東話口語低聲記錄。無須在乎文法，捕捉第一瞬間嘅感官與情緒。
            </p>
          </div>

          <div className="hidden md:flex text-slate-400 text-3xl font-light select-none">
            ›
          </div>

          {/* Step 2: L2 中等內容卡片 */}
          <div className="card-l2-standard w-full md:w-1/3 p-6 sm:p-7 relative flex flex-col items-center text-center">
            <div className="relative mb-3">
              <StepAiBrainIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-[var(--primary-600)] text-white text-[11px] font-mono font-bold shadow-xs">
                02
              </span>
            </div>
            <h3 className="font-celestial-serif font-bold text-lg sm:text-xl text-[var(--text-heading)] mb-2">
              榮格原型 AI 分析
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-body)] leading-[1.65]">
              DreamWisdom 結合心理象徵、陰影整合與共時性理論，客觀拆解深層訊號。
            </p>
          </div>

          <div className="hidden md:flex text-slate-400 text-3xl font-light select-none">
            ›
          </div>

          {/* Step 3: L2 中等內容卡片 */}
          <div className="card-l2-standard w-full md:w-1/3 p-6 sm:p-7 relative flex flex-col items-center text-center">
            <div className="relative mb-3">
              <StepInsightIcon className="w-20 h-20" />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-[var(--primary-600)] text-white text-[11px] font-mono font-bold shadow-xs">
                03
              </span>
            </div>
            <h3 className="font-celestial-serif font-bold text-lg sm:text-xl text-[var(--text-heading)] mb-2">
              獲得心靈洞察
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-body)] leading-[1.65]">
              獲得專屬於你的解析報告，包含潛意識投射、自我反思提問與情緒建議。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 5. 香港本地心理支援熱線（7. 可折疊模塊，點擊直接顯示熱線） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-6 max-w-4xl mx-auto" id="hotlines-section">
        {/* L3【心理熱線｜次要】：--accent-warm-light底色，移除陰影，預設折疊，降低視覺重量 */}
        <div className="card-l3-secondary p-5 sm:p-7 text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
                <PhoneCall className="w-5 h-5 text-[var(--primary-600)] shrink-0" />
                <h2>香港本地心理健康及情緒支援熱線清單</h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                若重複夢魘、焦慮或失眠持續帶來生活困擾，請即向香港專業機構尋求協助。
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsHotlinesOpen(!isHotlinesOpen)}
              className="btn-b2-secondary min-h-[44px] px-4 py-2 text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>{isHotlinesOpen ? '收起支援熱線' : '展開熱線電話'}</span>
              {isHotlinesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* 展開之熱線電話清單 */}
          {isHotlinesOpen && (
            <div className="mt-5 pt-4 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm animate-fadeIn">
              <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">香港撒瑪利亞防止自殺會</div>
                <div className="text-[#4A47A3] font-bold text-lg mt-0.5">2389 2222</div>
                <div className="text-[11px] text-slate-500">24小時情緒疏導熱線 · 隨時傾訴</div>
              </div>

              <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">生命熱線 (Life Line)</div>
                <div className="text-[#4A47A3] font-bold text-lg mt-0.5">2382 0000</div>
                <div className="text-[11px] text-slate-500">24小時預防自殺求助支援服務</div>
              </div>

              <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">醫院管理局 精神健康專線</div>
                <div className="text-[#4A47A3] font-bold text-lg mt-0.5">2466 7350</div>
                <div className="text-[11px] text-slate-500">24小時專業精神科護士電話諮詢</div>
              </div>

              <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">利民會「即時通」情緒支援</div>
                <div className="text-[#4A47A3] font-bold text-lg mt-0.5">3517 8966</div>
                <div className="text-[11px] text-slate-500">24小時社區情緒疏導與關懷網絡</div>
              </div>

              <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-100 shadow-2xs sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="font-bold text-slate-900">明愛向晴軒 危機支援專線</div>
                  <div className="text-[#4A47A3] font-bold text-base">18288</div>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">24小時家庭及個人危機即時介入支援</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 6. 常見疑問 FAQ（8. 隱私同理論基礎兩條預設展開） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-12 max-w-3xl mx-auto" id="faq">
        <div className="text-center mb-8">
          <p className="text-xs font-serif text-[#4A47A3] font-semibold tracking-widest uppercase">FAQ</p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            常見疑問解答
          </h2>
          <p className="text-xs text-slate-500 mt-1">理論基礎與私隱承諾均公開透明</p>
        </div>

        <div className="space-y-3.5">
          {faqItems.map((item) => {
            const isOpen = openFaqKeys.has(item.id);
            return (
              <div
                key={item.id}
                className="card-l3-secondary overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  className="w-full min-h-[48px] px-5 py-3.5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 hover:text-[var(--accent-warm-hover)] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {item.id === 'theory' && <span className="text-xs bg-slate-200/70 text-slate-800 px-2 py-0.5 rounded font-semibold">理論基礎</span>}
                    {item.id === 'privacy' && <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">隱私保證</span>}
                    <span>{item.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[var(--primary-600)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-200/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 7. 底部感性寄語（9. H2 語義標籤） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-12 sm:py-16 text-center">
        <p className="text-xs sm:text-sm font-serif text-[#4A47A3] font-semibold tracking-widest uppercase mb-1">
          —— 溫柔傾聽潛意識 ——
        </p>
        <h2 className="font-celestial-serif font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-wide">
          ✦ 每一個夢，都是你內心的智慧 ✦
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
