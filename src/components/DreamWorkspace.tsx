import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  DreamEntry,
  DreamReport,
  EngineSettings,
  User,
  TherapistItem,
  normalizeRole,
  getRoleDisplayName,
  DreamMasterAnalysisResult,
  ProductItem,
  DreamDNA,
  DreamDnaSymbol,
} from '../types';
import {
  initialDreamDNA,
  initialThirtyNightsJourney,
} from '../data';
import { INITIAL_PRODUCTS } from '../data/products';
import { buildConstellationFromHistory } from '../utils/constellationHelper';
import { exportHtmlToWord, copyFormattedText } from '../utils/wordExport';
import { ReportDetailModal } from './ReportDetailModal';
import { DreamDnaCard } from './DreamDnaCard';
import { DreamConstellationView } from './DreamConstellationView';
import { ThirtyNightsMysteryView } from './ThirtyNightsMysteryView';
import { DreamJournalManager } from './DreamJournalManager';
import { NightmareCareModal } from './NightmareCareModal';
import { AnonymizedShareModal } from './AnonymizedShareModal';
import { CelestialRotatingAstrolabe } from './CelestialRotatingAstrolabe';
import {
  Sparkles,
  Brain,
  Clock,
  ChevronRight,
  AlertCircle,
  Dna,
  Compass,
  Eye,
  Heart,
  ArrowRight,
  RotateCcw,
  Star,
  Crown,
  ShieldCheck,
  Send,
  MessageSquare,
  Download,
  Copy,
  Check,
  ShoppingBag,
  BarChart3,
  CheckCircle2,
  Lock,
  Tag,
  Share2,
} from 'lucide-react';



const DREAM_CATEGORIES = [
  { id: '惡夢', label: '惡夢 (Nightmare)' },
  { id: '重複夢', label: '重複夢 (Recurrent)' },
  { id: '清醒夢', label: '清醒夢 (Lucid)' },
  { id: '願望滿足', label: '願望滿足 (Wish-fulfillment)' },
  { id: '普通夢', label: '普通夢 (Normal)' },
];

// 自訂心境 (Mood) 標籤預設候選詞
const PRESET_MOOD_TAGS = ['平靜', '焦慮', '驚恐', '釋懷', '悲傷', '愉悅', '困惑', '壓抑', '自由', '期待', '孤獨', '懷念'];

// 自訂象徵 (Symbol) 標籤預設候選詞
const PRESET_SYMBOL_TAGS = ['海洋/水', '鑰匙', '門鎖', '飛翔', '迷宮', '舊屋', '故人', '追逐', '鏡子', '牙齒', '電梯', '森林'];

interface DreamWorkspaceProps {
  initialHistory: DreamEntry[];
  settings: EngineSettings;
  demo?: boolean;
  prefilledDream?: string;
  initialTab?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history';
  currentUser?: User | null;
  onDreamAdded?: (entry: DreamEntry) => void;
  onUpdateUserStars?: (newStars: number) => void;
  onOpenEarnStars?: () => void;
  onGoToPricing?: () => void;
  onGoToStore?: (productId?: string) => void;
  therapists?: TherapistItem[];
}

export const DreamWorkspace: React.FC<DreamWorkspaceProps> = ({
  initialHistory,
  settings,
  demo = false,
  prefilledDream = '',
  initialTab = 'workspace',
  currentUser,
  onDreamAdded,
  onUpdateUserStars,
  onOpenEarnStars,
  onGoToPricing,
  onGoToStore,
  therapists,
}) => {
  /* =========================================================================
     模塊 2：分頁與導航狀態管理
     ========================================================================= */
  const [activeTab, setActiveTab] = useState<'workspace' | 'dna' | 'constellation' | 'mystery' | 'history'>(
    initialTab === ('astrolabe' as any) ? 'workspace' : initialTab
  );

  useEffect(() => {
    if (initialTab && (initialTab as string) !== 'astrolabe') {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  /* =========================================================================
     模塊 3：夢境文字輸入與 LocalStorage 草稿即時儲存 (30-200字約束)
     ========================================================================= */
  const [dream, setDream] = useState<string>(() => {
    if (prefilledDream) return prefilledDream.slice(0, 200);
    try {
      const savedDraft = localStorage.getItem('dreamwisdom_dream_draft');
      if (savedDraft) return savedDraft.slice(0, 200);
    } catch {}
    return '';
  });

  // 夢境類別選擇器 (惡夢 / 重複夢 / 清醒夢 / 願望滿足 / 普通夢)
  const [selectedCategory, setSelectedCategory] = useState<string>('普通夢');

  // 手動自訂心境 (Mood) 與象徵 (Symbol) 標籤（強化 DREAM DNA 長期分析）
  const [customMoodTags, setCustomMoodTags] = useState<string[]>([]);
  const [customSymbolTags, setCustomSymbolTags] = useState<string[]>([]);
  const [newMoodInput, setNewMoodInput] = useState<string>('');
  const [newSymbolInput, setNewSymbolInput] = useState<string>('');

  const handleToggleMoodTag = (tag: string) => {
    setCustomMoodTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomMoodTag = () => {
    const trimmed = newMoodInput.trim();
    if (!trimmed) return;
    if (!customMoodTags.includes(trimmed)) {
      setCustomMoodTags((prev) => [...prev, trimmed]);
    }
    setNewMoodInput('');
  };

  const handleToggleSymbolTag = (tag: string) => {
    setCustomSymbolTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomSymbolTag = () => {
    const trimmed = newSymbolInput.trim();
    if (!trimmed) return;
    if (!customSymbolTags.includes(trimmed)) {
      setCustomSymbolTags((prev) => [...prev, trimmed]);
    }
    setNewSymbolInput('');
  };

  // 可選附加天體星圖分析 (預設關閉)
  const [includeAstrolabe, setIncludeAstrolabe] = useState<boolean>(false);


  // 驗證失敗文字框晃動動畫視覺反饋 (<30字時觸發)
  const [isShaking, setIsShaking] = useState(false);

  // 歷史夢境與選取檢視狀態
  const [history, setHistory] = useState<DreamEntry[]>(initialHistory);
  const [selectedEntry, setSelectedEntry] = useState<DreamEntry | null>(null);

  // 提交中 Loading 與廣東話錯誤狀態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cantoneseError, setCantoneseError] = useState<string | null>(null);

  // AI 解夢報告生成結果
  const [masterAnalysis, setMasterAnalysis] = useState<DreamMasterAnalysisResult | null>(null);
  const [structuredSections, setStructuredSections] = useState<{
    subconsciousMessage: string;
    emotionalAdvice: string;
    astrolabeSection?: string;
  } | null>(null);

  // 對話追問狀態
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpHistory, setFollowUpHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // 模態框彈窗
  const [isNightmareCareOpen, setIsNightmareCareOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<any>(null);

  // 引用 Textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 草稿即時寫入 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dreamwisdom_dream_draft', dream);
    } catch {}
  }, [dream]);

  // 當外部 prefilledDream 變動時同步
  useEffect(() => {
    if (prefilledDream) {
      setDream(prefilledDream.slice(0, 200));
    }
  }, [prefilledDream]);

  // 同步 initialHistory 外部變更
  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  /* =========================================================================
     模塊 4：字數驗證與輸入約束
     ========================================================================= */
  const charCount = dream.length;
  const isInputValid = charCount >= 30 && charCount <= 200;

  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 強制約束：超過 200 字禁止繼續輸入
    const val = e.target.value.slice(0, 200);
    setDream(val);
  };



  /* =========================================================================
     模塊 6：AI 解夢提交流程 (嚴格符合廣東話錯誤與結構化報告)
     ========================================================================= */
  const handleSubmitDream = async () => {
    // 不足 30 字點擊：觸發微妙晃動動畫與視覺提醒
    if (charCount < 30) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setCantoneseError('夢境需要30‑200字，寫多啲細節，AI嘅心理分析會更貼近你嘅狀況。');
      return;
    }

    setCantoneseError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dream/master-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_dream: dream.trim(),
          include_astrolabe: includeAstrolabe,
          category: selectedCategory,
          user_context: {
            tags: [...customSymbolTags, ...customMoodTags],
            moodTags: customMoodTags,
            symbolTags: customSymbolTags,
            category: selectedCategory,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('504');
      }

      const data: DreamMasterAnalysisResult = await response.json();
      setMasterAnalysis(data);

      // 固定結構解析：【潛意識訊息】、【情緒反思建議】、（可選星圖）
      const rawText = data.analysis_text || '';
      let subconscious = '這場夢境反映出你內心深處正經歷一段情感重整期。夢中的象徵符號是潛意識向意識發出的溫和信號，提示你關注平日被理性壓抑的真實渴望。';
      let emotionalAdvice = '建議在日常生活中給自己保留每天15分鐘無目的放空時間；覺察當焦慮湧現時身體的緊繃部位，溫和接納它，不急於批判自己。';
      let astrolabeText: string | undefined = undefined;

      if (rawText.includes('【潛意識訊息】') || rawText.includes('【情緒反思建議】')) {
        const subMatch = rawText.match(/【潛意識訊息】([\s\S]*?)(?=【情緒反思建議】|$)/);
        const emoMatch = rawText.match(/【情緒反思建議】([\s\S]*?)(?=【星圖|【天體|$)/);
        if (subMatch && subMatch[1]?.trim()) subconscious = subMatch[1].trim();
        if (emoMatch && emoMatch[1]?.trim()) emotionalAdvice = emoMatch[1].trim();
      } else {
        const parts = rawText.split('\n\n');
        if (parts.length >= 2) {
          subconscious = parts[0].trim();
          emotionalAdvice = parts.slice(1).join('\n\n').trim();
        } else if (rawText) {
          subconscious = rawText;
        }
      }

      if (includeAstrolabe) {
        astrolabeText = '今日天體星盤運轉感應：水象·潛意識軌道。與榮格「阿尼瑪 / 阿尼姆斯」原型共振，提示你在人際與決策中多傾聽內在直覺，融合柔和與理性力量。';
      }

      setStructuredSections({
        subconsciousMessage: subconscious,
        emotionalAdvice: emotionalAdvice,
        astrolabeSection: astrolabeText,
      });

      // 建立夢境歷史條目（包含自訂心境與象徵標籤）
      const combinedTags = [
        ...customSymbolTags,
        ...customMoodTags.map((m) => `心境:${m}`),
      ];

      const newEntry: DreamEntry = {
        id: 'dream_' + Date.now(),
        title: data.cleaned_dream ? data.cleaned_dream.slice(0, 16) + '…' : dream.slice(0, 16) + '…',
        dream_text: dream.trim(),
        created_at: new Date().toISOString(),
        category: selectedCategory,
        tags: combinedTags,
        moodTags: customMoodTags,
        symbolTags: customSymbolTags,
        report_json: {
          title: data.cleaned_dream ? data.cleaned_dream.slice(0, 16) + '…' : '榮格心理學解夢報告',
          summary: subconscious.slice(0, 120) + '…',
          symbols: (customSymbolTags.length > 0 ? customSymbolTags : ['核心意象']).map((s) => ({
            symbol: s,
            meaning: '自訂核心心理象徵',
          })),
          perspectives: [
            { name: '榮格原型分析', text: subconscious },
            { name: '自我整合反思', text: emotionalAdvice },
          ],
          questions: ['這場夢境帶給你最深刻的身體感應是甚麼？'],
          sources: [],
        },
      };

      setHistory((prev) => [newEntry, ...prev]);
      if (onDreamAdded) {
        onDreamAdded(newEntry);
      }

      // 提交完成後重設自訂標籤與草稿
      setCustomMoodTags([]);
      setCustomSymbolTags([]);

      // 提交完成後清空本地草稿
      try {
        localStorage.removeItem('dreamwisdom_dream_draft');
      } catch {}

      // 自動平滑滾動至報告區塊
      setTimeout(() => {
        document.getElementById('ai-report-result-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setCantoneseError('拆解夢境時遇到網絡或逾時問題，唔使擔心，你嘅夢境內容仲喺度。請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================================
     模塊 7：單條夢境紀錄刪除功能 (符合我的夢庫業務規則)
     ========================================================================= */
  const handleDeleteSingleDream = async (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('dreamwisdom_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }

    try {
      await fetch(`/api/dreams/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete sync fallback', e);
    }
  };

  /* =========================================================================
     模塊 8：過去 30 天夢境類型統計 (Recharts 柱狀圖計算)
     ========================================================================= */
  const categoryFrequencyData = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentDreams = history.filter((entry) => {
      const time = new Date(entry.created_at).getTime();
      return !isNaN(time) && time >= thirtyDaysAgo;
    });

    const counts: Record<string, number> = {
      '惡夢': 0,
      '重複夢': 0,
      '清醒夢': 0,
      '願望滿足': 0,
      '普通夢': 0,
    };

    recentDreams.forEach((entry) => {
      let cat = entry.category || '普通夢';
      if (cat === 'nightmare') cat = '惡夢';
      else if (cat === 'recurrent' || cat === 'recurring') cat = '重複夢';
      else if (cat === 'lucid') cat = '清醒夢';
      else if (cat === 'wish-fulfillment') cat = '願望滿足';
      else if (cat === 'normal') cat = '普通夢';

      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      } else {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });

    const categoryColors: Record<string, string> = {
      '惡夢': '#f43f5e',
      '重複夢': '#0284c7',
      '清醒夢': '#38bdf8',
      '願望滿足': '#10b981',
      '普通夢': '#64748b',
    };

    return [
      { name: '惡夢', count: counts['惡夢'], fill: categoryColors['惡夢'] },
      { name: '重複夢', count: counts['重複夢'], fill: categoryColors['重複夢'] },
      { name: '清醒夢', count: counts['清醒夢'], fill: categoryColors['清醒夢'] },
      { name: '願望滿足', count: counts['願望滿足'], fill: categoryColors['願望滿足'] },
      { name: '普通夢', count: counts['普通夢'], fill: categoryColors['普通夢'] },
    ];
  }, [history]);

  /* =========================================================================
     模塊 8B：動態整合自訂心境與象徵標籤至 DREAM DNA 長期分析
     ========================================================================= */
  const dynamicDreamDNA: DreamDNA = useMemo(() => {
    if (!history || history.length === 0) {
      return initialDreamDNA;
    }

    // 1. 統計所有自訂意象與報告象徵
    const symbolCounts: Record<string, { count: number; evolution: Array<{ dreamId: string; dreamTitle: string; date: string; state: string }> }> = {};

    history.forEach((d, idx) => {
      const dateStr = d.created_at ? new Date(d.created_at).toLocaleDateString('zh-HK', { month: '2-digit', day: '2-digit' }) : `D${idx + 1}`;
      const title = d.title || '夢境記錄';

      const symbolsInThisDream = new Set<string>();
      (d.symbolTags || []).forEach((st) => symbolsInThisDream.add(st));
      (d.tags || []).filter((t) => !t.startsWith('心境:')).forEach((t) => symbolsInThisDream.add(t));
      (d.report_json?.symbols || []).forEach((s) => symbolsInThisDream.add(s.symbol));

      symbolsInThisDream.forEach((sym) => {
        if (!symbolCounts[sym]) {
          symbolCounts[sym] = { count: 0, evolution: [] };
        }
        symbolCounts[sym].count += 1;
        symbolCounts[sym].evolution.push({
          dreamId: d.id,
          dreamTitle: title,
          date: dateStr,
          state: `第 ${symbolCounts[sym].count} 次：${d.category || '出現'}`,
        });
      });
    });

    const sortedSymbols: DreamDnaSymbol[] = Object.entries(symbolCounts)
      .map(([name, data]) => {
        let cat: 'element' | 'place' | 'character' | 'action' = 'element';
        if (['屋', '學校', '走廊', '電梯', '海', '天台', '森林'].some((k) => name.includes(k))) cat = 'place';
        else if (['人', '阿媽', '老細', '伴侶', '上司', '黑影'].some((k) => name.includes(k))) cat = 'character';
        else if (['跑', '追', '飛', '掉', '逃', '墜落'].some((k) => name.includes(k))) cat = 'action';
        return {
          name,
          count: data.count,
          category: cat,
          evolution: data.evolution.slice(-4),
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 2. 統計自訂心境情緒標籤
    const moodCounts: Record<string, number> = {
      '焦慮': 0,
      '平靜': 0,
      '驚恐': 0,
      '釋懷': 0,
      '困惑': 0,
      '壓抑': 0,
    };

    let totalMoodTally = 0;
    history.forEach((d) => {
      const moodsInDream = new Set<string>();
      (d.moodTags || []).forEach((m) => moodsInDream.add(m));
      (d.tags || []).filter((t) => t.startsWith('心境:')).forEach((t) => moodsInDream.add(t.replace('心境:', '')));

      if (d.category === '惡夢') moodsInDream.add('驚恐');
      if (d.category === '願望滿足') moodsInDream.add('釋懷');

      moodsInDream.forEach((m) => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
        totalMoodTally += 1;
      });
    });

    const moodColorMap: Record<string, string> = {
      '焦慮': '#F59E0B',
      '平靜': '#0284C7',
      '驚恐': '#E11D48',
      '釋懷': '#10B981',
      '困惑': '#8B5CF6',
      '壓抑': '#64748B',
      '悲傷': '#475569',
      '愉悅': '#38BDF8',
      '自由': '#06B6D4',
      '期待': '#EC4899',
    };

    const emotionRatios = Object.entries(moodCounts)
      .filter(([_, count]) => count > 0)
      .map(([emotion, count]) => ({
        emotion,
        percentage: totalMoodTally > 0 ? Math.round((count / totalMoodTally) * 100) : 20,
        color: moodColorMap[emotion] || '#3B82F6',
      }))
      .sort((a, b) => b.percentage - a.percentage);

    if (emotionRatios.length === 0) {
      emotionRatios.push(
        { emotion: '平靜', percentage: 55, color: '#0284C7' },
        { emotion: '焦慮', percentage: 35, color: '#F59E0B' },
        { emotion: '釋懷', percentage: 10, color: '#10B981' }
      );
    }

    // 3. 重複主題與長程指紋
    const topSymbol = sortedSymbols[0]?.name || '水 / 門鎖';
    const topMood = emotionRatios[0]?.emotion || '平靜自我調節';

    const recurringThemes = [
      {
        theme: `自訂【${topSymbol}】與【${topMood}】心靈共振`,
        count: sortedSymbols[0]?.count || history.length,
        description: `根據你手動標記的意象「${topSymbol}」與「${topMood}」心境，榮格模型分析顯示你正主動整合內在深層情結，為清醒人格建立堅韌防護。`,
      },
    ];

    if (sortedSymbols.length > 1) {
      recurringThemes.push({
        theme: `次要意象【${sortedSymbols[1].name}】的週期顯現`,
        count: sortedSymbols[1].count,
        description: `自訂意象「${sortedSymbols[1].name}」多次伴隨夢境情境浮現，反映潛意識對當前生活節奏的調適提醒。`,
      });
    }

    const narrativeFingerprint = `你共記錄了 ${history.length} 個夢境片段，自訂累積 ${Object.keys(symbolCounts).length} 個意象與 ${Object.keys(moodCounts).filter((k) => moodCounts[k] > 0).length} 類心境標籤。最主要心境傾向為「${topMood}」，核心原型由「${topSymbol}」主導；自訂標籤深度強化了長程潛意識指紋的榮格自我整合分析。`;

    return {
      totalDreams: history.length,
      symbols: sortedSymbols.length > 0 ? sortedSymbols : initialDreamDNA.symbols,
      emotionRatios,
      recurringThemes,
      narrativeFingerprint,
      updatedAt: new Date().toISOString(),
    };
  }, [history]);

  /* =========================================================================
     模塊 9：報告匯出與分享
     ========================================================================= */
  const handleCopyReport = async () => {
    if (!structuredSections) return;
    const text = `DreamWisdom 廣東話記夢 · 榮格心理學報告\n\n【潛意識訊息】：\n${structuredSections.subconsciousMessage}\n\n【情緒反思建議】：\n${structuredSections.emotionalAdvice}\n${structuredSections.astrolabeSection ? `\n【天體星圖原型深度對齊】：\n${structuredSections.astrolabeSection}\n` : ''}\n以下只係心理學角度嘅自我反思參考，唔係命運預測。`;
    const ok = await copyFormattedText(text);
    if (ok) {
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2500);
    }
  };

  const handleExportWord = () => {
    if (!structuredSections) return;
    const bodyHtml = `
      <div style="background:#f8fafc;padding:16px;border-radius:12px;margin-bottom:16px;">
        <strong>造夢者夢境片段：</strong><br>「${dream}」
      </div>
      <h2>【潛意識訊息】</h2>
      <p>${structuredSections.subconsciousMessage.replace(/\n/g, '<br>')}</p>
      <h2>【情緒反思建議】</h2>
      <p>${structuredSections.emotionalAdvice.replace(/\n/g, '<br>')}</p>
      ${structuredSections.astrolabeSection ? `<h2>【天體星圖原型深度對齊】</h2><p>${structuredSections.astrolabeSection}</p>` : ''}
      <hr>
      <p style="color:#64748b;font-size:12px;">以下只係心理學角度嘅自我反思參考，唔係命運預測。</p>
    `;
    exportHtmlToWord('DreamWisdom_榮格心理學報告', 'DreamWisdom 心理自我反思報告', bodyHtml);
  };

  /* =========================================================================
     渲染區：標籤導航欄 (記錄夢境｜我的夢庫｜DREAM DNA｜30晚潛意識檔案)
     ========================================================================= */
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-slate-800">
      {/* 頂部次導航選單切換 */}
      <nav aria-label="工作台分頁導航" className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('workspace')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'workspace'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="workspace-tab-write"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>記錄夢境</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="workspace-tab-history"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>我的夢庫 ({history.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dna')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'dna'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="workspace-tab-dna"
        >
          <Dna className="w-3.5 h-3.5" />
          <span>DREAM DNA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mystery')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'mystery'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="workspace-tab-mystery"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>30晚潛意識檔案</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('constellation')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'constellation'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="workspace-tab-constellation"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>星圖連線</span>
        </button>

      </nav>

      {/* =========================================================================
         TAB 1：記錄夢境 (核心工作區)
         ========================================================================= */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* 主輸入卡片 */}
          <section
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
            id="dream-input-section"
          >
            {/* 卡片標題與操作按鈕 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  ✍️
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">記錄夢境片段</h2>
                  <p className="text-xs text-slate-500">
                    寫低你記得嘅夢境，透過榮格心理學拆解潛意識
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNightmareCareOpen(true)}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>噩夢關懷</span>
                </button>

                {dream.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('確定要清空當前輸入內容嗎？')) {
                        setDream('');
                        setCustomMoodTags([]);
                        setCustomSymbolTags([]);
                        try {
                          localStorage.removeItem('dreamwisdom_dream_draft');
                        } catch {}
                      }
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="清空文字框"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>清空重寫</span>
                  </button>
                )}
              </div>
            </div>

            {/* 夢境類型下拉選單 (惡夢 / 重複夢 / 清醒夢 / 願望滿足 / 普通夢) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-600 shrink-0" />
                <label htmlFor="dream-category-select" className="font-semibold text-slate-700">
                  選擇夢境類型：
                </label>
                <select
                  id="dream-category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 cursor-pointer shadow-2xs"
                >
                  {DREAM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 可選手動勾選星圖解析 (預設關閉) */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeAstrolabe}
                  onChange={(e) => setIncludeAstrolabe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-slate-700 font-medium">
                  附加天體星圖分析（可選：將今日星盤原型納入解夢報告）
                </span>
              </label>
            </div>

            {/* =========================================================================
               手動標記心境 (Mood) 與象徵 (Symbol) 標籤（沉澱 DREAM DNA 長期分析）
               ========================================================================= */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/40 border border-slate-200/90 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Tag className="w-4 h-4 text-sky-600" />
                  <span>自訂夢境標籤（心境 Mood 與象徵 Symbol · 沉澱 DREAM DNA 長期分析）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    已選：{customMoodTags.length} 心境 · {customSymbolTags.length} 象徵
                  </span>
                  {(customMoodTags.length > 0 || customSymbolTags.length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        const tagsToInsert = [...customSymbolTags, ...customMoodTags];
                        const text = tagsToInsert.map((t) => `【${t}】`).join(' ');
                        setDream((prev) => {
                          const combined = prev ? `${prev} ${text}` : text;
                          return combined.slice(0, 200);
                        });
                      }}
                      className="text-[11px] text-sky-700 hover:text-sky-900 font-medium cursor-pointer underline"
                      title="將已選標籤文字填入輸入框"
                    >
                      帶入文字框
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. 心境 / 情緒標籤 (Mood Tags) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <span>💭</span>
                      <span>心境標籤 (Mood Tags)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">點擊選取或輸入新增</span>
                  </div>

                  {/* 常用預設情緒 */}
                  <div className="flex flex-wrap gap-1">
                    {PRESET_MOOD_TAGS.map((tag) => {
                      const isSelected = customMoodTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleMoodTag(tag)}
                          className={`px-2 py-0.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-white shadow-2xs ring-1 ring-amber-300'
                              : 'bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 border border-amber-200/70'
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>

                  {/* 自訂情緒輸入框 */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newMoodInput}
                      onChange={(e) => setNewMoodInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomMoodTag();
                        }
                      }}
                      placeholder="新增自訂心境（如：壓抑、釋放）..."
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomMoodTag}
                      className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      新增
                    </button>
                  </div>

                  {/* 已選心境展示 */}
                  {customMoodTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                      {customMoodTags.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300"
                        >
                          <span>💭 {m}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleMoodTag(m)}
                            className="hover:text-rose-600 cursor-pointer ml-0.5 font-bold"
                            title="移除心境標籤"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. 象徵 / 意象標籤 (Symbol Tags) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-900 flex items-center gap-1">
                      <span>🗝️</span>
                      <span>象徵標籤 (Symbol Tags)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">點擊選取或輸入新增</span>
                  </div>

                  {/* 常用預設意象 */}
                  <div className="flex flex-wrap gap-1">
                    {PRESET_SYMBOL_TAGS.map((tag) => {
                      const isSelected = customSymbolTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleSymbolTag(tag)}
                          className={`px-2 py-0.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-2xs ring-1 ring-sky-300'
                              : 'bg-sky-50/70 hover:bg-sky-100/70 text-sky-900 border border-sky-200/70'
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>

                  {/* 自訂象徵輸入框 */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newSymbolInput}
                      onChange={(e) => setNewSymbolInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSymbolTag();
                        }
                      }}
                      placeholder="新增自訂象徵（如：白貓、時鐘）..."
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSymbolTag}
                      className="px-2.5 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      新增
                    </button>
                  </div>

                  {/* 已選象徵展示 */}
                  {customSymbolTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                      {customSymbolTags.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-900 border border-sky-300"
                        >
                          <span>🗝️ {s}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleSymbolTag(s)}
                            className="hover:text-rose-600 cursor-pointer ml-0.5 font-bold"
                            title="移除象徵標籤"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-sky-50/80 p-2 rounded-xl border border-sky-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>你自訂的心境與象徵標籤將在存檔後即時連動並精準塑造 DREAM DNA™️ 心靈密碼與情緒走向分析。</span>
              </div>
            </div>

            {/* 夢境主要輸入文字框 (30-200 字約束 + 晃動動畫) */}
            <div className="space-y-1.5">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={dream}
                  onChange={handleDreamChange}
                  maxLength={200}
                  placeholder="寫低你記得嘅夢境……醒來時看見甚麼？心情如何？身邊有甚麼人或物件？（最少 30 字，上限 200 字）"
                  rows={5}
                  className={`w-full p-4 rounded-2xl bg-white border text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner resize-y ${
                    isShaking
                      ? 'animate-shake border-rose-500 ring-2 ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                  id="workspace-dream-textarea"
                />

                {/* 實時字數顯示：已輸入：XX / 30‑200字 */}
                <div className="absolute bottom-3 right-3 text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                  <span className={charCount < 30 ? 'text-amber-600 font-bold' : charCount === 200 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                    已輸入：{charCount} / 30‑200字
                  </span>
                </div>
              </div>

              {/* 字數提醒與草稿儲存提示小字 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 px-1">
                <div>
                  {charCount < 30 ? (
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>夢境需要30‑200字，寫多啲細節，AI嘅心理分析會更貼近你嘅狀況。</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>字數符合規範（{charCount} 字），可直接按提交進行榮格心理學拆解。</span>
                    </span>
                  )}
                </div>

                <div className="text-slate-400">
                  內容會暫存瀏覽器，唔會上傳，直到你按提交。頁面刷新、意外關閉重新打開可恢復草稿。
                </div>
              </div>
            </div>

            {/* 廣東話錯誤與重新提交提示 */}
            {cantoneseError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between gap-2 animate-fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{cantoneseError}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitDream}
                  disabled={isSubmitting || charCount < 30}
                  className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50"
                >
                  重新提交
                </button>
              </div>
            )}

            {/* 提交按鈕列 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                本工具基於榮格分析心理學，只做自我反思，不做吉凶算命。
              </span>

              <button
                type="button"
                onClick={handleSubmitDream}
                disabled={isSubmitting || charCount < 30}
                className={`py-3 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isSubmitting || charCount < 30
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-98'
                }`}
                id="workspace-analyze-btn"
                title={charCount < 30 ? '最少需輸入 30 字方可提交' : '提交給 AI 進行拆解'}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI正在拆解你嘅夢境，請稍候</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>提交拆解夢境 (DreamWisdom AI)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* =========================================================================
             AI 解夢報告區塊 (固定結構：【潛意識訊息】、【情緒反思建議】、可選星圖、強制免責)
             ========================================================================= */}
          {structuredSections && (
            <section
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 animate-fade-in"
              id="ai-report-result-card"
            >
              {/* 報告頂部 */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    🔮
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      DreamWisdom 榮格心理自我反思報告
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>類型標籤：<strong className="text-blue-700">{selectedCategory}</strong></span>
                      <span>·</span>
                      <span>時間：{new Date().toLocaleDateString('zh-HK')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {copiedNotice && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 已複製全文
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="複製報告全文"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportWord}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="匯出 Word 格式"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>匯出 Word</span>
                  </button>
                </div>
              </div>

              {/* 造夢者原始片段 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  【記錄之夢境片段】：
                </span>
                <p className="leading-relaxed font-sans italic">「{dream}」</p>
              </div>

              {/* 固定結構章節 1：【潛意識訊息】 */}
              <div className="space-y-2 p-4 rounded-2xl bg-sky-50/40 border border-sky-100">
                <h4 className="font-bold text-sky-900 text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-sky-600" />
                  <span>【潛意識訊息】</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {structuredSections.subconsciousMessage}
                </p>
              </div>

              {/* 固定結構章節 2：【情緒反思建議】 */}
              <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span>【情緒反思建議】</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {structuredSections.emotionalAdvice}
                </p>
              </div>

              {/* 可選章節：只有勾選星圖才顯示星圖章節 */}
              {structuredSections.astrolabeSection && (
                <div className="space-y-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>【天體星圖原型深度對齊】</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {structuredSections.astrolabeSection}
                  </p>
                </div>
              )}

              {/* 每份報告底部強制免責聲明 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>以下只係心理學角度嘅自我反思參考，唔係命運預測。</span>
              </div>

              {/* =========================================================================
                 模塊：解夢內部推薦 (Rule 4: 只有AI解夢報告生成完成後，頁面底部才出現)
                 ========================================================================= */}
              <div className="pt-4 border-t border-slate-200 space-y-3" id="internal-store-recommendation">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-700" />
                    <h4 className="font-bold text-slate-800 text-sm">
                      解夢內部推薦 · 生活儀式輔助
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    根據夢中意象推薦
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INITIAL_PRODUCTS.slice(0, 2).map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-900">{prod.name}</span>
                          <span className="font-bold text-blue-700 font-mono">HK$ {prod.priceHKD}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {prod.recommendationReason || prod.subTitle}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        {/* 商店每項商品強制免責聲明 */}
                        <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                          ⚠️ 產品只係生活儀式輔助，唔等同心理治療，不能醫治失眠或情緒病。
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            if (onGoToStore) onGoToStore(prod.id);
                          }}
                          className="w-full py-1.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>查看詳情 / 前往選物店</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* =========================================================================
             過去 30 天夢境類型統計 (Recharts 柱狀圖)
             ========================================================================= */}
          <section
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
            id="dream-category-stats-section"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  過去 30 天夢境類型統計 (Dream Category Frequency)
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                近 30 天共記錄 {categoryFrequencyData.reduce((acc, c) => acc + c.count, 0)} 篇夢境
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              透過記錄惡夢、重複夢、清醒夢、願望滿足與普通夢境的出現頻次，視覺化梳理你潛意識情緒的週期波動與心理能量狀態。
            </p>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryFrequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} 次`, '記錄次數']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {categoryFrequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
         TAB 2：我的夢庫 (按日期排序，檢視報告、搜尋意象、刪除單條紀錄)
         ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <DreamJournalManager
            history={history}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            onUpdateEntryTags={(id, newTags) => {
              setHistory((prev) =>
                prev.map((d) => (d.id === id ? { ...d, tags: newTags } : d))
              );
            }}
            onDeleteEntry={handleDeleteSingleDream}
          />
        </div>
      )}

      {/* =========================================================================
         TAB 3：DREAM DNA (歸納重複意象、內在性格與心理需求)
         ========================================================================= */}
      {activeTab === 'dna' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-900 leading-relaxed">
            <strong>DREAM DNA 說明：</strong>累積多個夢境之後，歸納你重複出現嘅意象、內在性格與心理需求（非單次夢境報告）。你手動標記的心境 (Mood) 與象徵 (Symbol) 標籤已實時融入下方的長期心理分析。
          </div>
          <DreamDnaCard
            dna={dynamicDreamDNA}
            dreamDNA={dynamicDreamDNA}
            onOpenShare={(dna) => {
              setShareData(dna);
              setIsShareModalOpen(true);
            }}
          />
        </div>
      )}

      {/* =========================================================================
         TAB 4：30晚潛意識檔案 (連續記錄，觀察潛意識時間變化趨勢)
         ========================================================================= */}
      {activeTab === 'mystery' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-900 leading-relaxed">
            <strong>30晚潛意識檔案說明：</strong>連續記錄夢境，觀察自己潛意識隨時間嘅變化趨勢。
          </div>
          <ThirtyNightsMysteryView
            journey={initialThirtyNightsJourney}
            onUnlockNightClue={() => {}}
            onStartDreamTonight={() => setActiveTab('workspace')}
          />
        </div>
      )}

      {/* =========================================================================
         TAB 5：星圖連線 (意象星圖宇宙)
         ========================================================================= */}
      {activeTab === 'constellation' && (
        <div className="space-y-4">
          <DreamConstellationView
            nodes={buildConstellationFromHistory(history).nodes}
            links={buildConstellationFromHistory(history).links}
            dreams={history}
            onOpenReportDetail={(entry) => setSelectedEntry(entry)}
            onSelectDream={(id) => {
              const matched = history.find((d) => d.id === id);
              if (matched) setSelectedEntry(matched);
            }}
            onExportConstellation={() => {}}
          />
        </div>
      )}


      {/* =========================================================================
         彈窗組：報告詳情、噩夢自救與分享
         ========================================================================= */}
      {selectedEntry && (
        <ReportDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onOpenTherapeuticSupport={() => {}}
        />
      )}

      <NightmareCareModal
        isOpen={isNightmareCareOpen}
        onClose={() => setIsNightmareCareOpen(false)}
        onSaveIrtDream={(rewritten) => {
          setDream((prev) => (prev ? `${prev}\n\n【IRT 噩夢改寫安全結局】：\n${rewritten}` : rewritten).slice(0, 200));
          setIsNightmareCareOpen(false);
        }}
      />

      {isShareModalOpen && shareData && (
        <AnonymizedShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          data={shareData}
        />
      )}
    </div>
  );
};
