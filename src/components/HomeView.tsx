import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Key,
  ChevronDown,
  ChevronUp,
  Dna,
  Heart,
  PhoneCall,
  Tag,
  RotateCcw,
} from 'lucide-react';
import { TherapeuticSupportModal } from './TherapeuticSupportModal';
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
  onStartWithDream: (dreamText: string, includeStarChart?: boolean) => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history') => void;
  onGoToPricing?: () => void;
  onOpenLogin?: () => void;
  onGoToPrivacy?: () => void;
  therapists?: TherapistItem[];
}

// 夢境類型選項
const DREAM_CATEGORIES = [
  { id: 'ordinary', label: '普通夢境' },
  { id: 'nightmare', label: '惡夢 (Nightmare)' },
  { id: 'recurrent', label: '重複夢 (Recurrent Dream)' },
  { id: 'lucid', label: '清醒夢 (Lucid Dream)' },
  { id: 'wish', label: '願望滿足夢 (Wish Fulfillment)' },
];

// 常用快速意象晶片
const QUICK_DREAM_TAGS = [
  { label: '海洋水流', icon: '🌊' },
  { label: '赤腳無鞋', icon: '👣' },
  { label: '被人追趕', icon: '🏃' },
  { label: '舊居屋邨', icon: '🏚️' },
  { label: '家宅神枱', icon: '🕯️' },
  { label: '課室考試', icon: '🏫' },
  { label: '緊閉門鎖', icon: '🚪' },
  { label: '高處墜落', icon: '🕳️' },
  { label: '脫落牙齒', icon: '🦷' },
  { label: '神秘鑰匙', icon: '🗝️' },
  { label: '飛翔羽翼', icon: '🕊️' },
  { label: '迷宮走廊', icon: '🧭' },
];

// 四類結構意象標籤：人物、場景、情緒、物件
const TAG_CATEGORIES = [
  {
    category: '人物',
    tags: ['故人親人', '陌生人', '老細上司', '伴侶前度', '童年玩伴', '追趕者'],
  },
  {
    category: '場景',
    tags: ['舊居屋邨', '深海大水', '高樓天台', '狹窄電梯', '荒廢學校', '迷宮走廊'],
  },
  {
    category: '情緒',
    tags: ['驚慌逃跑', '赤腳羞愧', '平靜釋懷', '孤立無援', '壓抑窒息', '飛翔自由'],
  },
  {
    category: '物件',
    tags: ['生鏽門鎖', '脫落牙齒', '過期時鐘', '破爛鏡子', '無字信件', '神秘鑰匙'],
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  onStartWithDream,
  onGoToApp,
  onGoToPricing,
  therapists,
}) => {
  // 本地 LocalStorage 草稿儲存與即時恢復
  const [draftDream, setDraftDream] = useState<string>(() => {
    try {
      return localStorage.getItem('dreamwisdom_draft_dream') || '';
    } catch {
      return '';
    }
  });

  // 夢境類型選取狀態
  const [selectedCategory, setSelectedCategory] = useState<string>('ordinary');

  // 星圖解析為可選附加功能，預設關閉
  const [includeStarChart, setIncludeStarChart] = useState<boolean>(false);

  // 意象標籤選取狀態（高亮與可移除）
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 是否展開詳細四類意象標籤面板
  const [showDetailedTags, setShowDetailedTags] = useState(false);

  // 驗證失敗文字框晃動動畫視覺回饋（少於 30 字點擊時觸發）
  const [isShaking, setIsShaking] = useState(false);

  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);

  // 香港心理支援熱線可折疊模塊，預設收起
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);

  // FAQ 折疊面板
  const [openFaqKeys, setOpenFaqKeys] = useState<Set<string>>(new Set(['theory', 'privacy']));

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 實時儲存至 LocalStorage
  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > 200) return;
    setDraftDream(val);
    try {
      localStorage.setItem('dreamwisdom_draft_dream', val);
    } catch {}
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(130, textareaRef.current.scrollHeight)}px`;
    }
  };

  // 記夢引導結構提示（點擊帶入回憶結構）
  const handleAddGuidePrompt = (type: 'characters' | 'scene' | 'emotion' | 'objects') => {
    const prompts = {
      characters: '【人物】：',
      scene: '【場景】：',
      emotion: '【主要情緒】：',
      objects: '【關鍵物件】：',
    };
    const prefix = prompts[type];
    const trimmed = draftDream.trim();
    if (trimmed.includes(prefix)) return;
    const combined = trimmed ? `${trimmed}\n${prefix}` : prefix;
    if (combined.length <= 200) {
      setDraftDream(combined);
      try {
        localStorage.setItem('dreamwisdom_draft_dream', combined);
      } catch {}
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = combined.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 30);
    }
  };

  // 點擊標籤文字自動插入游標位置，已選標籤視覺高亮，可點擊移除
  const handleToggleTag = (tagLabel: string) => {
    const tagText = `【${tagLabel}】`;
    const textarea = textareaRef.current;

    if (selectedTags.includes(tagLabel)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tagLabel));
      const nextText = draftDream.replace(tagText, '').replace(/\s+/g, ' ').trim();
      setDraftDream(nextText);
      try {
        localStorage.setItem('dreamwisdom_draft_dream', nextText);
      } catch {}
      return;
    }

    if (draftDream.length + tagText.length > 200) {
      return;
    }

    setSelectedTags((prev) => [...prev, tagLabel]);

    if (!textarea) {
      const nextText = draftDream ? `${draftDream} ${tagText}` : tagText;
      setDraftDream(nextText);
      try {
        localStorage.setItem('dreamwisdom_draft_dream', nextText);
      } catch {}
      return;
    }

    const startPos = textarea.selectionStart ?? draftDream.length;
    const endPos = textarea.selectionEnd ?? draftDream.length;
    const textBefore = draftDream.substring(0, startPos);
    const textAfter = draftDream.substring(endPos);
    const combined = textBefore + tagText + textAfter;

    if (combined.length <= 200) {
      setDraftDream(combined);
      try {
        localStorage.setItem('dreamwisdom_draft_dream', combined);
      } catch {}
      setTimeout(() => {
        textarea.focus();
        const cursor = startPos + tagText.length;
        textarea.setSelectionRange(cursor, cursor);
      }, 20);
    }
  };

  // 提交解夢（不足30字時觸發 shake 動畫及焦點提示）
  const handleStartAnalysis = () => {
    const trimmed = draftDream.trim();
    if (trimmed.length < 30) {
      setIsShaking(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    if (trimmed.length > 200) {
      return;
    }
    onStartWithDream(trimmed, includeStarChart);
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

  const faqItems = [
    {
      id: 'theory',
      q: 'DreamWisdom 解夢是基於甚麼理論？',
      a: 'DreamWisdom 嚴格立足於瑞士心理學泰斗卡爾·榮格（Carl Jung）的原型（Archetypes）與集體潛意識理論、心理投射與補償機轉。我哋將夢境視為「清醒自我的鏡像反思」，只做心理層面的自我反思，絕不涉及任何玄學吉凶、發達算命預測。',
    },
    {
      id: 'privacy',
      q: '我嘅夢境資料會唔會被公開或者用作 AI 訓練？',
      a: '絕絕對對唔會！你輸入嘅夢境內容享有最高等級端對端個人私隱保護，絕不用於任何公開或商業 AI 大模型訓練，亦唔會交畀任何第三方。你可以隨時喺「我的夢庫」中刪除單條或全部記錄。',
    },
    {
      id: 'length',
      q: '點解夢境輸入限制喺 30 至 200 字？',
      a: '心理學研究顯示，少於 30 字往往缺乏具體的情緒、人際或環境細節，容易產生空泛解讀；而 200 字以內的精煉文字，能幫助你喺醒來第一時間捕捉最核心嘅潛意識意象與主觀張力，令 AI 榮格分析更精確貼近你當下嘅心理狀態。',
    },
    {
      id: 'star',
      q: '星圖解析係點樣運作？需要額外收費嗎？',
      a: '星圖解析為可選附加功能，預設關閉。勾選後，AI 會結合天體宿位與榮格「共時性（Synchronicity）」視角解構夢境。付費會員更可進入專屬工作台使用旋轉星盤獲取今日生活小貼士，並自由選擇是否納入夢境作深入分析。',
    },
  ];

  const currentLength = draftDream.length;
  const isTooShort = currentLength < 30;
  const isAtLimit = currentLength >= 200;

  return (
    <main id="home-view-main" className="overflow-hidden bg-slate-50/50 pb-20 text-slate-800">
      {/* ============================================================ */}
      {/* 🌟 1. HERO 頂部視覺：天體主標題與精簡副標題 🌟 */}
      {/* ============================================================ */}
      <section className="shell relative pt-8 sm:pt-14 pb-4 text-center px-4 max-w-4xl mx-auto" id="hero-section">
        {/* 經典主標題：帶雙側銀藍四角星辰 */}
        <div className="relative inline-block max-w-3xl mx-auto mb-3">
          <span
            className="absolute -left-6 sm:-left-10 top-1/3 text-sky-400 text-lg sm:text-2xl select-none animate-pulse"
            aria-hidden="true"
          >
            ✦
          </span>

          <h1
            id="hero-title"
            className="font-celestial-serif font-serif font-black text-3xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-[1.22]"
          >
            每一個夢，都是潛意識留給<br className="hidden sm:inline" />你的信。
          </h1>

          <span
            className="absolute -right-6 sm:-right-10 top-1/4 text-sky-400 text-lg sm:text-2xl select-none animate-pulse"
            aria-hidden="true"
          >
            ✦
          </span>
        </div>

        {/* 副標題第一行：別人解讀你的夢。我們記得你的夢。 */}
        <h2 className="font-sans font-bold text-lg sm:text-2xl text-slate-900 tracking-tight mt-3 mb-2">
          別人解讀你的夢。我們記得你的夢。
        </h2>

        {/* 副標題第二行：核心理念說明 */}
        <p className="font-sans text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
          DreamWisdom 唔係憑空估，而係從榮格原型心理學找出相應理論，結合你過往夢境，整理可能值得留意嘅潛意識訊息。
        </p>

        {/* ============================================================ */}
        {/* ⚠️ 重要提醒 合併到副標題下方，簡潔不顯眼（不用頁面太明顯） ⚠️ */}
        {/* ============================================================ */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-slate-500 max-w-2xl mx-auto mb-6 text-center px-2">
          <span>⚠️ 溫馨提醒：本平台為榮格心理學自我反思工具，非醫療診斷。</span>
          <button
            type="button"
            onClick={() => setIsTherapeuticOpen(true)}
            className="text-slate-600 hover:text-sky-700 underline underline-offset-2 transition-colors cursor-pointer shrink-0 font-medium"
          >
            若受夢魘困擾，可點此查看香港專業心理支援與熱線
          </button>
        </div>

        {/* ============================================================ */}
        {/* 🌟 2. 居中夢境速記卡片（首頁無星盤，簡潔專注，直達核心） 🌟 */}
        {/* ============================================================ */}
        <div className="w-full text-left my-2 max-w-3xl mx-auto" id="recorddream">
          <div className="bg-white rounded-3xl border border-sky-100 shadow-md p-5 sm:p-7 transition-all">
            {/* 卡片標題 */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>記錄今晨夢境片段</span>
              </div>
              <div className="text-xs text-sky-700 font-medium">
                以廣東話口語輸入即可 · 建議 30-200 字
              </div>
            </div>

            {/* 記夢引導（點擊帶入回憶結構） */}
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 mb-3.5">
              <div className="flex items-center justify-between gap-1 text-xs text-sky-800 font-bold mb-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>記夢引導（點擊帶入提示詞）：</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">快速建立夢境骨架</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddGuidePrompt('characters')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs text-slate-800 hover:text-sky-700 font-medium transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  title="點擊帶入【人物】提示"
                >
                  <span>👥</span>
                  <span>有邊啲人物？</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddGuidePrompt('scene')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs text-slate-800 hover:text-sky-700 font-medium transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  title="點擊帶入【場景】提示"
                >
                  <span>📍</span>
                  <span>場景係邊度？</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddGuidePrompt('emotion')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs text-slate-800 hover:text-sky-700 font-medium transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  title="點擊帶入【感覺】提示"
                >
                  <span>💭</span>
                  <span>感覺如何？</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddGuidePrompt('objects')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs text-slate-800 hover:text-sky-700 font-medium transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  title="點擊帶入【物件】提示"
                >
                  <span>🚪</span>
                  <span>有特定物件？</span>
                </button>
              </div>
            </div>

            {/* 夢境類型選單 */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <label htmlFor="home-dream-category" className="font-semibold text-slate-700">
                  夢境類型：
                </label>
                <select
                  id="home-dream-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-2xs"
                >
                  {DREAM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {draftDream.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('確定要清空當前輸入內容重寫嗎？')) {
                      setDraftDream('');
                      setSelectedTags([]);
                      try {
                        localStorage.removeItem('dreamwisdom_draft_dream');
                      } catch {}
                    }
                  }}
                  className="text-[11px] text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>清空重寫</span>
                </button>
              )}
            </div>

            {/* 夢境主要輸入框（30-200字約束 + shake 晃動視覺回饋） */}
            <div className="relative mb-2">
              <textarea
                ref={textareaRef}
                value={draftDream}
                onChange={handleDreamChange}
                maxLength={200}
                placeholder="寫低你醒來記得嘅夢境片段……夢見邊個、喺邊度、當時心情如何？（字數限制：最少 30 字，最多 200 字；亦可點擊上方引導或下方意象詞直接插入）"
                id="hero-dream-textarea"
                rows={4}
                className={`w-full bg-slate-50/70 focus:bg-white border rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base p-4 focus:outline-none resize-none leading-relaxed transition-all shadow-inner ${
                  isShaking
                    ? 'animate-shake border-rose-500 ring-2 ring-rose-300 bg-rose-50/30'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                }`}
              />

              {/* 實時字數顯示 */}
              <div className="flex flex-wrap items-center justify-between text-xs mt-1 px-1 gap-2">
                <span className="text-slate-500 text-[11px]">
                  {isTooShort ? (
                    <span className={`font-medium transition-colors ${isShaking ? 'text-rose-600 font-bold' : 'text-amber-800'}`}>
                      ⚠️ 夢境需要30‑200字，寫多啲細節，AI分析更貼近你嘅狀況。
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium">
                      ✓ 字數符合標準，可隨時點擊下方按鈕提交拆解
                    </span>
                  )}
                </span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${
                    isShaking
                      ? 'bg-rose-200 text-rose-900 animate-pulse'
                      : isTooShort
                      ? 'bg-amber-100 text-amber-900'
                      : isAtLimit
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-sky-100 text-sky-900'
                  }`}
                >
                  已輸入：{currentLength} / 30‑200字
                </span>
              </div>
            </div>

            {/* 補充意象詞快速晶片（可點擊插入/移除） */}
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1.5">
                <span className="flex items-center gap-1">
                  <span>✦ 補充意象詞（點擊帶入，高亮可移除）：</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDetailedTags(!showDetailedTags)}
                  className="text-[11px] text-sky-700 hover:text-sky-900 cursor-pointer font-medium"
                >
                  {showDetailedTags ? '收起四類標籤 ▲' : '展開四類分類標籤 ▼'}
                </button>
              </div>

              {/* 常用快速意象詞 */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
                {QUICK_DREAM_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.label) || draftDream.includes(`【${tag.label}】`);
                  return (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => handleToggleTag(tag.label)}
                      className={`px-2 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs ring-1 ring-sky-200'
                          : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200 hover:border-sky-300'
                      }`}
                      title={isSelected ? `點擊移除【${tag.label}】` : `點擊插入【${tag.label}】`}
                    >
                      <span className="text-xs">{tag.icon}</span>
                      <span>{tag.label}</span>
                      <span>{isSelected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>

              {/* 展開之四類分類結構 */}
              {showDetailedTags && (
                <div className="space-y-2 pt-2 border-t border-dashed border-slate-200 animate-fadeIn">
                  {TAG_CATEGORIES.map((cat) => (
                    <div key={cat.category} className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 text-[11px]">
                        {cat.category}
                      </span>
                      {cat.tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag) || draftDream.includes(`【${tag}】`);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleTag(tag)}
                            className={`px-2 py-0.5 rounded-md border text-[11px] font-medium cursor-pointer transition-all flex items-center gap-0.5 ${
                              isSelected
                                ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                              : 'bg-white hover:bg-sky-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 星圖解析手動勾選（預設關閉） */}
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <label className="flex items-start gap-2 p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 cursor-pointer hover:bg-sky-50 transition-colors">
                <input
                  type="checkbox"
                  checked={includeStarChart}
                  onChange={(e) => setIncludeStarChart(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <div className="text-xs">
                  <div className="font-bold text-sky-950 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-sky-700" />
                    <span>附加星圖解析（可選 · 預設關閉）</span>
                  </div>
                  <div className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
                    結合天體宿位與榮格共時性視角。手動勾選後納入 AI 報告章節；付費會員更可進入工作台使用旋轉星盤深入體驗。
                  </div>
                </div>
              </label>
            </div>

            {/* 底部操作欄 */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>絕不用於 AI 訓練 · 保證私隱安全</span>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className={`min-h-[46px] w-full sm:w-auto px-7 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isTooShort
                      ? 'bg-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-700 border border-slate-200 hover:border-rose-300'
                      : 'bg-sky-600 hover:bg-sky-700 active:scale-98 text-white ring-2 ring-sky-200'
                  }`}
                  id="hero-cta-record-btn"
                  title={isTooShort ? '未滿30字，點擊查看提示' : '開始AI榮格分析'}
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
      {/* 🌟 2. 三大潛意識自我反思模組 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-10 px-4 max-w-5xl mx-auto" id="three-pillars-section">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-widest mb-1">
            —— 心理學沉澱體系 ——
          </p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-wide">
            三大潛意識自我反思模組
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            持續記錄你的夢境軌跡，透過榮格心理學整理潛在的情緒投射與心靈成長。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: DREAM DNA */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 mb-2">
                <Dna className="w-4 h-4 text-sky-600" />
                <span>DREAM DNA</span>
              </div>
              <div className="my-2 flex justify-center">
                <DreamDnaArtwork className="w-full h-32" />
              </div>
              <h3 className="font-celestial-serif font-black text-xl text-slate-900 mb-1.5">
                DREAM DNA 心靈密碼
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                累積多個夢境之後，歸納你重複出現嘅意象、內在性格與心理需求（非單次夢境報告）。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onGoToApp('dna')}
                className="min-h-[44px] w-full text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center justify-between cursor-pointer"
              >
                <span>探索你的 DREAM DNA</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2: 星圖解析 */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 mb-2">
                <Compass className="w-4 h-4 text-sky-600" />
                <span>星圖解析</span>
              </div>
              <div className="my-2 flex justify-center">
                <ConstellationAstrolabeArtwork className="w-full h-32" />
              </div>
              <h3 className="font-celestial-serif font-black text-xl text-slate-900 mb-1.5">
                星圖與共時性解析
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                將多個夢境意象連成心靈星系，結合二十八宿天體輪盤，提供生活調適建議與靈感提示。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onGoToApp('constellation')}
                className="min-h-[44px] w-full text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center justify-between cursor-pointer"
              >
                <span>瀏覽夢境星圖</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 3: 30晚潛意識檔案 */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>30晚潛意識檔案</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  連續觀察
                </span>
              </div>
              <div className="my-2 flex justify-center">
                <OracleCardsArtwork className="w-full h-32" />
              </div>
              <h3 className="font-celestial-serif font-black text-xl text-slate-900 mb-1.5">
                30 晚潛意識檔案
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                連續記錄夢境，觀察自己潛意識隨時間嘅變化趨勢，見證內在心理能量的流動。
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onGoToApp('mystery')}
                className="min-h-[44px] w-full text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center justify-between cursor-pointer"
              >
                <span>解鎖 30 晚檔案</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 3. 三步心靈轉化流程 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-8 px-4 max-w-5xl mx-auto text-center" id="how">
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-widest mb-1">
            —— 簡單三步 ——
          </p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900">
            如何解讀你的夢境：三步驟展開自我反思
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-sky-100 p-6 flex flex-col items-center text-center shadow-xs">
            <StepNotepadIcon className="w-16 h-16 mb-2" />
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 mb-2">
              STEP 01
            </span>
            <h3 className="font-bold text-base text-slate-900 mb-1">醒時速記夢境</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              以廣東話寫低醒來第一瞬間嘅場景、人物或情緒片段（30-200字）。
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sky-100 p-6 flex flex-col items-center text-center shadow-xs">
            <StepAiBrainIcon className="w-16 h-16 mb-2" />
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 mb-2">
              STEP 02
            </span>
            <h3 className="font-bold text-base text-slate-900 mb-1">榮格心理學拆解</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI 根據榮格原型心理學理論，客觀剖析夢境背後的心理補償與壓抑情緒。
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sky-100 p-6 flex flex-col items-center text-center shadow-xs">
            <StepInsightIcon className="w-16 h-16 mb-2" />
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 mb-2">
              STEP 03
            </span>
            <h3 className="font-bold text-base text-slate-900 mb-1">獲得心理反思建議</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              獲得【潛意識訊息】與【情緒反思建議】，作為當下生活覺察的溫柔鏡子。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 4. 香港本地心理健康熱線（可折疊模塊） 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-6 px-4 max-w-4xl mx-auto" id="hotlines-section">
        <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-5 sm:p-7 text-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
                <PhoneCall className="w-5 h-5 text-amber-700 shrink-0" />
                <h2>香港本地心理健康及情緒支援熱線清單</h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                若重複夢魘、焦慮或失眠持續帶來生活困擾，請即向香港專業機構尋求協助。
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsHotlinesOpen(!isHotlinesOpen)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>{isHotlinesOpen ? '收起支援熱線' : '展開熱線電話'}</span>
              {isHotlinesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isHotlinesOpen && (
            <div className="mt-5 pt-4 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm animate-fadeIn">
              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">香港撒瑪利亞防止自殺會</div>
                <div className="text-sky-800 font-bold text-lg mt-0.5">2389 2222</div>
                <div className="text-[11px] text-slate-500">24小時情緒疏導熱線 · 隨時傾訴</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">生命熱線 (Life Line)</div>
                <div className="text-sky-800 font-bold text-lg mt-0.5">2382 0000</div>
                <div className="text-[11px] text-slate-500">24小時預防自殺求助支援服務</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">醫院管理局 精神健康專線</div>
                <div className="text-sky-800 font-bold text-lg mt-0.5">2466 7350</div>
                <div className="text-[11px] text-slate-500">24小時專業精神科護士電話諮詢</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-2xs">
                <div className="font-bold text-slate-900">利民會「即時通」情緒支援</div>
                <div className="text-sky-800 font-bold text-lg mt-0.5">3517 8966</div>
                <div className="text-[11px] text-slate-500">24小時社區情緒疏導與關懷網絡</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-2xs sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="font-bold text-slate-900">明愛向晴軒 危機支援專線</div>
                  <div className="text-sky-800 font-bold text-base">18288</div>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">24小時家庭及個人危機即時介入支援</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🌟 5. 常見疑問 FAQ 🌟 */}
      {/* ============================================================ */}
      <section className="shell py-10 px-4 max-w-3xl mx-auto" id="faq">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-widest">FAQ</p>
          <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            常見問題解答
          </h2>
          <p className="text-xs text-slate-500 mt-1">理論基礎與私隱承諾均公開透明</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => {
            const isOpen = openFaqKeys.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  className="w-full min-h-[48px] px-5 py-3.5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 hover:text-sky-800 cursor-pointer transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-sky-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 心理支援引導 Modal */}
      <TherapeuticSupportModal
        isOpen={isTherapeuticOpen}
        onClose={() => setIsTherapeuticOpen(false)}
        therapists={therapists}
      />
    </main>
  );
};
