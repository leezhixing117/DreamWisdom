import React, { useState, useEffect, useRef } from 'react';
import { DreamEntry, DreamReport, DreamSynthesis, EngineSettings, QuickAnalysis, DetectiveQuestion, User, TherapistItem, normalizeRole, getRoleDisplayName, UserDreamContext, DreamMasterAnalysisResult } from '../types';
import { initialDreamDNA, initialConstellationNodes, initialConstellationLinks, initialThirtyNightsJourney, initialDetectiveQuestions } from '../data';
import { buildConstellationFromHistory } from '../utils/constellationHelper';
import { exportHtmlToWord, copyFormattedText } from '../utils/wordExport';
import { ReportDetailModal } from './ReportDetailModal';
import { DetectiveInquiryModal } from './DetectiveInquiryModal';
import { DreamDnaCard } from './DreamDnaCard';
import { DreamConstellationView } from './DreamConstellationView';
import { ThirtyNightsMysteryView } from './ThirtyNightsMysteryView';
import { DreamJournalManager } from './DreamJournalManager';
import { TherapeuticSupportModal } from './TherapeuticSupportModal';
import { SampleReportPreviewModal } from './SampleReportPreviewModal';
import { NightmareCareModal } from './NightmareCareModal';
import { AnonymizedShareModal } from './AnonymizedShareModal';
import { CelestialRotatingAstrolabe } from './CelestialRotatingAstrolabe';
import {
  Sparkles,
  Brain,
  Clock,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Dna,
  Compass,
  Key,
  Eye,
  Heart,
  Layers,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Star,
  Crown,
  ShieldCheck,
  Video,
  Database,
  FileText,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Download,
  Copy,
  Check,
  Plus,
  ShoppingBag,
  X,
  Edit3,
  ListFilter,
  Activity,
  Smile,
  Tv,
  Share2,
} from 'lucide-react';

interface DreamWorkspaceProps {
  initialHistory: DreamEntry[];
  settings: EngineSettings;
  demo?: boolean;
  prefilledDream?: string;
  initialTab?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'astrolabe';
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
  const [activeTab, setActiveTab] = useState<'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'astrolabe'>(initialTab);
  const [dream, setDream] = useState(prefilledDream);
  const [isDetectiveOpen, setIsDetectiveOpen] = useState(false);
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);

  // Auto-expanding textarea ref for mobile & desktop
  const dreamTextareaRef = useRef<HTMLTextAreaElement>(null);
  const handleDreamTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDream(e.target.value);
    if (dreamTextareaRef.current) {
      dreamTextareaRef.current.style.height = 'auto';
      dreamTextareaRef.current.style.height = `${Math.max(140, dreamTextareaRef.current.scrollHeight)}px`;
    }
  };

  // Loading states
  const [isQuickAnalyzing, setIsQuickAnalyzing] = useState(false);
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);

  // Analysis result states
  const [quickReport, setQuickReport] = useState<QuickAnalysis | null>(null);
  const [activeReport, setActiveReport] = useState<DreamReport | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<DetectiveQuestion[]>(initialDetectiveQuestions);

  const [history, setHistory] = useState<DreamEntry[]>(initialHistory);
  const [synthesis, setSynthesis] = useState<DreamSynthesis | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DreamEntry | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Dynamic products state
  const [dreamDNA, setDreamDNA] = useState(initialDreamDNA);
  const [constellationData, setConstellationData] = useState(() =>
    buildConstellationFromHistory(initialHistory)
  );
  const [mysteryJourney, setMysteryJourney] = useState(initialThirtyNightsJourney);

  // Sync constellation when history updates with newly recorded dreams
  useEffect(() => {
    setConstellationData(buildConstellationFromHistory(history));
  }, [history]);

  const currentRole = currentUser ? normalizeRole(currentUser.role) : 'free';
  const isPaidUser = currentRole === 'paid' || currentRole === 'admin' || currentRole === 'super_admin';

  // Auto-fill if passed from HomeView
  useEffect(() => {
    if (prefilledDream) {
      setDream(prefilledDream);
      setMasterAnalysis(null);
      setQuickReport(null);
      setActiveReport(null);
      setFollowUpHistory([]);
      setFollowUpQuestion('');
    }
  }, [prefilledDream]);

  // Dream Master SQL SOP States
  const [userContext, setUserContext] = useState<UserDreamContext>({
    gender: '未指定',
    recent_status: '',
    is_recurring: false,
  });
  const [showContextOptions, setShowContextOptions] = useState(false);
  const [isMasterAnalyzing, setIsMasterAnalyzing] = useState(false);
  const [masterAnalysis, setMasterAnalysis] = useState<DreamMasterAnalysisResult | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpHistory, setFollowUpHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [copiedWordNotice, setCopiedWordNotice] = useState(false);
  const [paidPreliminary, setPaidPreliminary] = useState(false);

  // Anonymized insight sharing states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<{
    title: string;
    dreamText?: string;
    summary: string;
    symbols?: Array<{ symbol: string; meaning: string }>;
    archetype?: string;
    noteworthyMessage?: string;
    healingAdvice?: string;
    question?: string;
  } | null>(null);

  const handleOpenShare = (data: {
    title: string;
    dreamText?: string;
    summary: string;
    symbols?: Array<{ symbol: string; meaning: string }>;
    archetype?: string;
    noteworthyMessage?: string;
    healingAdvice?: string;
    question?: string;
  }) => {
    setShareModalData(data);
    setIsShareModalOpen(true);
  };

  // Dual-mode input states: Mode A (free text) vs Mode B (guided form)
  const [inputMode, setInputMode] = useState<'free' | 'guided'>('free');
  const [guidedCharacters, setGuidedCharacters] = useState('');
  const [guidedScene, setGuidedScene] = useState('');
  const [guidedEmotion, setGuidedEmotion] = useState('');
  const [guidedObjects, setGuidedObjects] = useState('');
  const [guidedPlot, setGuidedPlot] = useState('');

  // Metadata expansion states
  const [recordTime] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [sleepPeriod, setSleepPeriod] = useState<'early_night' | 'midnight' | 'dawn_waking'>('dawn_waking');
  const [dreamType, setDreamType] = useState<'normal' | 'nightmare' | 'lucid' | 'recurring' | 'prophetic'>('normal');
  const [emotionRating, setEmotionRating] = useState<number>(3);

  // Sample Preview & Nightmare Care Modals
  const [isSamplePreviewOpen, setIsSamplePreviewOpen] = useState(false);
  const [isNightmareCareOpen, setIsNightmareCareOpen] = useState(false);

  // Synthesize guided fragmented form into cohesive dream text
  const handleGenerateFromGuided = () => {
    const parts: string[] = [];
    if (guidedCharacters.trim()) parts.push(`【人物】：${guidedCharacters.trim()}`);
    if (guidedScene.trim()) parts.push(`【場景】：${guidedScene.trim()}`);
    if (guidedEmotion.trim()) parts.push(`【主要情緒】：${guidedEmotion.trim()}`);
    if (guidedObjects.trim()) parts.push(`【關鍵物件】：${guidedObjects.trim()}`);
    if (guidedPlot.trim()) parts.push(`【簡短劇情】：${guidedPlot.trim()}`);

    if (parts.length === 0) {
      setErrorNotice('請在引導表單中填寫至少一欄（每欄可留空，隨意填寫零碎印象即可）');
      return;
    }

    let narrative = '';
    if (guidedScene.trim() || guidedCharacters.trim()) {
      narrative += `昨晚夢到${guidedScene.trim() ? `在${guidedScene.trim()}` : ''}${guidedCharacters.trim() ? `遇見${guidedCharacters.trim()}` : ''}。`;
    }
    if (guidedObjects.trim()) {
      narrative += `夢中出現了${guidedObjects.trim()}。`;
    }
    if (guidedPlot.trim()) {
      narrative += `${guidedPlot.trim()}。`;
    }
    if (guidedEmotion.trim()) {
      narrative += `醒來時整個人感覺${guidedEmotion.trim()}。`;
    }

    const combined = narrative ? `${narrative}\n\n${parts.join('\n')}` : parts.join('\n');
    setDream(combined);
    setInputMode('free');
  };

  // Export Dream Master report as Microsoft Word (.doc)
  const handleExportMasterToWord = () => {
    if (!masterAnalysis) return;
    const dreamTitle = (masterAnalysis.cleaned_dream || dream).slice(0, 18);
    const title = `Dream Master 深度心理學解讀 · ${dreamTitle}...`;
    const paragraphs = masterAnalysis.analysis_text
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        if (p.startsWith('【') || p.startsWith('###') || p.startsWith('##')) {
          return `<h2>${p.replace(/^[#\s]+/, '')}</h2>`;
        }
        return `<p>${p}</p>`;
      })
      .join('');

    const followUpsHtml = followUpHistory.length > 0 ? `
      <h2>深度追問對話歷程</h2>
      ${followUpHistory.map((fu, idx) => `
        <div style="margin-bottom: 16px;">
          <p><strong>問 ${idx + 1}：${fu.q}</strong></p>
          <div class="quote-box">${fu.a.replace(/\n/g, '<br>')}</div>
        </div>
      `).join('')}
    ` : '';

    const bodyHtml = `
      <div class="quote-box">
        <strong>【造夢者原始夢境紀錄】：</strong><br>
        「${masterAnalysis.cleaned_dream || dream}」
      </div>
      ${userContext.recent_status ? `<p class="meta">造夢者近況背景：${userContext.recent_status}</p>` : ''}
      <div>${paragraphs}</div>
      ${followUpsHtml}
    `;

    exportHtmlToWord(`DreamWisdom_深度解夢報告_${new Date().toISOString().slice(0, 10)}`, title, bodyHtml);
  };

  // Copy report formatted for Microsoft Word / Notes paste
  const handleCopyMasterText = async () => {
    if (!masterAnalysis) return;
    let fullText = `【DreamWisdom · Dream Master 深度心理學解讀】\n\n`;
    fullText += `【造夢者原始夢境】：\n${masterAnalysis.cleaned_dream || dream}\n\n`;
    if (userContext.recent_status) {
      fullText += `【生活背景】：${userContext.recent_status}\n\n`;
    }
    fullText += `【深度心理學透視與榮格原型分析】：\n${masterAnalysis.analysis_text}\n\n`;
    if (followUpHistory.length > 0) {
      fullText += `【深度追問對話歷程】：\n`;
      followUpHistory.forEach((fu, i) => {
        fullText += `Q${i + 1}：${fu.q}\nA：${fu.a}\n\n`;
      });
    }
    fullText += `備註：${masterAnalysis.disclaimer}\n\n`;
    fullText += `————————————\n© DreamAstra™ 獨家心靈意象解讀系統（融合22部經典心理學著作與原創象徵庫）\n本內容僅供個人心靈日記反思，受著作權法保護，嚴禁任何形式之未授權抓取、逆向工程或商業轉載。`;
    const ok = await copyFormattedText(fullText);
    if (ok) {
      setCopiedWordNotice(true);
      setTimeout(() => setCopiedWordNotice(false), 3000);
    }
  };

  // Dream Master SOP Analysis Runner (需 6 星，若已做初步分析只需加 3 星)
  const handleRunMasterAnalysis = async () => {
    if (!dream.trim()) return;
    setErrorNotice(null);

    // SOP Preprocessing character length requirement (< 15 characters)
    if (dream.trim().length < 15) {
      setErrorNotice('夢境文字少於 15 字，暫不執行解讀。請試著補充夢中的核心情緒（例如害怕、平靜、困惑）、周遭具體場景、身邊出現的人物或關鍵細節，以便透過心理意象資料庫為你精準解析。');
      return;
    }

    const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
    const isDirectUnlock = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
    const stars = currentUser?.stars ?? 0;
    const isUpgradingFromPreliminary = Boolean(paidPreliminary || quickReport);
    const requiredStars = isUpgradingFromPreliminary ? 3 : 6;

    if (!isDirectUnlock) {
      if (stars < requiredStars) {
        if (isUpgradingFromPreliminary) {
          setErrorNotice(`升級 Dream Master 深度解夢需再加 3 顆星星幣（已折抵初步分析之 3 星，你目前持有 ${stars} 顆）。你可以點擊隨機短片儲星（每次 +1 星）或升級會員！`);
        } else {
          setErrorNotice(`直接執行 Dream Master 深度解夢需要 6 顆星星幣（你目前持有 ${stars} 顆）。可先以 3 星體驗初步分析，或睇片儲滿 6 顆星！`);
        }
        return;
      }
    }

    setIsMasterAnalyzing(true);
    try {
      const response = await fetch('/api/dream/master-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_dream: dream.trim(),
          user_context: {
            gender: userContext.gender === '未指定' ? undefined : userContext.gender,
            recent_status: userContext.recent_status?.trim() || undefined,
            is_recurring: userContext.is_recurring,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || '解析失敗');
      }

      setMasterAnalysis(data);
      setFollowUpHistory([]);

      // Deduct stars for free tier after successful Dream Master analysis
      if (!isDirectUnlock && onUpdateUserStars) {
        onUpdateUserStars(Math.max(0, stars - requiredStars));
      }

      // Check storage policy quota
      const normRoleUser = currentUser ? normalizeRole(currentUser.role) : 'free';
      const isPaidUser = normRoleUser === 'paid' || normRoleUser === 'admin' || normRoleUser === 'super_admin';
      const maxQuota = isPaidUser ? 99999 : (currentUser?.storage_quota || 3);

      if (!isPaidUser && history.length >= maxQuota) {
        setErrorNotice(
          `⚠️ 儲存提醒：你目前為免費用戶，已達到夢境儲存上限（${history.length} / ${maxQuota} 條）。已為你完成解讀，但未能存入日記。請前往日記刪除舊記錄，或升級付費版解鎖無限儲存！`
        );
      } else {
        const newEntry: DreamEntry = {
          id: 'dream_' + Date.now(),
          title: data.cleaned_dream ? (data.cleaned_dream.slice(0, 16) + '…') : (dream.trim().slice(0, 16) + '…'),
          dream_text: dream.trim(),
          created_at: new Date().toISOString(),
          sleepPeriod,
          dreamType,
          emotionRating,
          guidedData: (guidedCharacters || guidedScene || guidedEmotion || guidedObjects || guidedPlot) ? {
            characters: guidedCharacters,
            scene: guidedScene,
            emotion: guidedEmotion,
            keyObjects: guidedObjects,
            plot: guidedPlot,
          } : undefined,
          report_json: {
            title: data.cleaned_dream ? (data.cleaned_dream.slice(0, 16) + '…') : '深度解夢報告',
            summary: data.analysis_text ? (data.analysis_text.slice(0, 120) + '…') : '',
            symbols: data.symbols_found?.map((s: string) => ({ symbol: s, meaning: '核心心理象徵' })) || [],
            perspectives: [
              { name: '榮格原型分析', text: data.analysis_text ? data.analysis_text.slice(0, 200) + '…' : '' },
            ],
            questions: ['這場夢境帶給你的核心直覺是什麼？'],
            sources: [],
          },
        };

        setHistory((prev) => [newEntry, ...prev]);
        if (onDreamAdded) onDreamAdded(newEntry);
      }

      // Auto scroll to SOP card
      setTimeout(() => {
        document.getElementById('dream-master-sop-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || 'Dream Master 深度解析失敗，請重試');
    } finally {
      setIsMasterAnalyzing(false);
    }
  };

  // Follow-up on same dream (Only carries previous compressed summary <= 200 tokens)
  const handleSendFollowUp = async () => {
    if (!followUpQuestion.trim() || !masterAnalysis) return;
    setIsFollowUpLoading(true);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/dream/master-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_dream: dream.trim(),
          follow_up: {
            is_follow_up: true,
            follow_up_question: followUpQuestion.trim(),
            previous_summary: masterAnalysis.compressed_summary_for_followup || '',
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || '追問回答失敗');
      }

      setFollowUpHistory((prev) => [
        ...prev,
        { q: followUpQuestion.trim(), a: data.analysis_text },
      ]);
      setFollowUpQuestion('');
      if (data.compressed_summary_for_followup) {
        setMasterAnalysis((prev) => prev ? { ...prev, compressed_summary_for_followup: data.compressed_summary_for_followup } : null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '追問失敗，請稍後重試');
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // STEP 1: Perform Simple Basic Analysis (簡單初步分析，需 3 星)
  const handlePerformQuickAnalysis = async () => {
    if (!dream.trim()) return;
    setErrorNotice(null);

    const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
    const isDirectUnlock = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
    const stars = currentUser?.stars ?? 0;
    const requiredStars = 3;

    if (!isDirectUnlock) {
      if (stars < requiredStars) {
        setErrorNotice(`執行初步分析需要 3 顆星星幣（你目前持有 ${stars} 顆）。你可以點擊隨機短片儲星（每次 +1 星）或升級會員！`);
        return;
      }
    }

    setIsQuickAnalyzing(true);
    setActiveReport(null);

    const pastDreams = history.slice(0, 3).map((h) => ({
      title: h.title,
      text: h.dream_text,
      date: h.created_at,
    }));

    try {
      const response = await fetch('/api/dream/quick-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream: dream.trim(),
          pastDreams,
        }),
      });

      if (!response.ok) {
        throw new Error('初步解讀服務暫時繁忙');
      }

      const data = await response.json();
      setQuickReport(data.report);
      setPaidPreliminary(true);

      // Deduct 3 stars for free tier after successful preliminary analysis
      if (!isDirectUnlock && onUpdateUserStars) {
        onUpdateUserStars(Math.max(0, stars - requiredStars));
      }

      // Populate 3 questions tailored to this dream for Step 2
      if (data.report.suggestedQuestions && data.report.suggestedQuestions.length > 0) {
        setActiveQuestions(data.report.suggestedQuestions);
      }

      setTimeout(() => {
        document.getElementById('quick-analysis-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '解讀失敗，請重試');
    } finally {
      setIsQuickAnalyzing(false);
    }
  };

  // STEP 2: Trigger Further AI Analysis (進一步 AI 深度解夢，初析後加 3 星)
  const handleOpenFurtherInquiry = () => {
    const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
    const isDirectUnlock = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';

    if (isDirectUnlock) {
      setIsDetectiveOpen(true);
      return;
    }

    // General member star checking: +3 stars if preliminary already completed, else 6 stars
    const stars = currentUser?.stars ?? 0;
    const isUpgradingFromPreliminary = Boolean(paidPreliminary || quickReport);
    const requiredStars = isUpgradingFromPreliminary ? 3 : 6;
    if (stars >= requiredStars) {
      if (onUpdateUserStars) {
        onUpdateUserStars(stars - requiredStars);
      }
      setIsDetectiveOpen(true);
    } else {
      if (isUpgradingFromPreliminary) {
        setErrorNotice(`升級 Dream Master 深度解夢需再加 3 顆星星幣（已折抵初步分析之 3 星，你目前持有 ${stars} 顆）。你可以點擊隨機短片儲星（每次 +1 星）或升級會員！`);
      } else {
        setErrorNotice(`直接執行 Dream Master 深度解夢需要 6 顆星星幣（你目前持有 ${stars} 顆）。可先以 3 星體驗初步分析，或睇片儲滿 6 顆星！`);
      }
      if (onOpenEarnStars) {
        onOpenEarnStars();
      }
    }
  };

  // STEP 3: Complete the 3 questions and run Deep Analysis
  const handleCompleteDetectiveInquiry = async (detectiveAnswers: Record<string, string>) => {
    setIsDetectiveOpen(false);
    setIsDeepAnalyzing(true);
    setErrorNotice(null);

    const pastDreams = history.slice(0, 4).map((h) => ({
      title: h.title,
      text: h.dream_text,
      date: h.created_at,
    }));

    try {
      const response = await fetch('/api/dream/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream: dream.trim(),
          settings,
          detectiveAnswers,
          pastDreams,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '深度解夢服務發生錯誤');
      }

      const data = await response.json();
      setActiveReport(data.report);

      const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
      const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
      const maxQuota = isPaid ? 99999 : (currentUser?.storage_quota || 3);

      if (!isPaid && history.length >= maxQuota) {
        setErrorNotice(
          `⚠️ 儲存提醒：你目前為一般會員，已達到夢境儲存上限（${history.length} / ${maxQuota} 條）。已為你完成解讀，但未能存入日記。請前往日記刪除舊記錄，或升級付費版解鎖無限儲存！`
        );
      } else {
        const newEntry: DreamEntry = {
          id: data.entry?.id || 'dream_' + Date.now(),
          title: data.report.title,
          dream_text: dream.trim(),
          created_at: new Date().toISOString(),
          sleepPeriod,
          dreamType,
          emotionRating,
          guidedData: (guidedCharacters || guidedScene || guidedEmotion || guidedObjects || guidedPlot) ? {
            characters: guidedCharacters,
            scene: guidedScene,
            emotion: guidedEmotion,
            keyObjects: guidedObjects,
            plot: guidedPlot,
          } : undefined,
          report_json: data.report,
        };

        setHistory((prev) => [newEntry, ...prev]);
        if (onDreamAdded) onDreamAdded(newEntry);
      }

      // Update DNA & Mystery Journey
      setDreamDNA((prev) => ({
        ...prev,
        totalDreams: prev.totalDreams + 1,
      }));

      setMysteryJourney((prev) => ({
        ...prev,
        completedNights: Math.min(30, prev.completedNights + 1),
        currentStreak: prev.currentStreak + 1,
      }));

      setTimeout(() => {
        document.getElementById('deep-report-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '深度解讀失敗，請稍後重試');
    } finally {
      setIsDeepAnalyzing(false);
    }
  };

  // Reset to record a new dream
  const handleResetDream = () => {
    setDream('');
    setPaidPreliminary(false);
    setQuickReport(null);
    setActiveReport(null);
    setMasterAnalysis(null);
    setFollowUpHistory([]);
    setFollowUpQuestion('');
    setErrorNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Multi-dream synthesis
  async function synthesize() {
    if (history.length < 2) return;
    setIsDeepAnalyzing(true);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/dream/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreams: history.map((h) => ({
            id: h.id,
            title: h.title,
            dream_text: h.dream_text,
            created_at: h.created_at,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '串連分析服務發生錯誤');
      }

      const data = await response.json();
      setSynthesis(data.report);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '串連分析失敗，請重試');
    } finally {
      setIsDeepAnalyzing(false);
    }
  }

  const handleDeleteHistory = async (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/dreams/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete dream from backend db', e);
    }
  };

  const handleUpdateEntryTags = async (id: string, newTags: string[]) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, tags: newTags } : item))
    );
    const target = history.find((h) => h.id === id);
    if (target) {
      try {
        await fetch('/api/dreams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: target.id,
            title: target.title,
            dream_text: target.dream_text,
            report_json: target.report_json,
            tags: newTags,
            rawCantoneseTranscription: target.rawCantoneseTranscription,
          }),
        });
      } catch (e) {
        console.warn('Failed to update tags in backend db', e);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="dream-workspace-container">
      {/* Workspace Top Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 shadow-2xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>解讀夢境</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dna')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'dna'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 shadow-2xs'
            }`}
            title="DREAM DNA™️｜你的夢境指紋 👉簡單講：系統統計你反覆夢見嘅畫面同情緒，睇潛意識最常關心嘅議題。"
          >
            <Dna className="w-3.5 h-3.5" />
            <span>DREAM DNA™️ (夢境指紋)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('constellation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'constellation'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 shadow-2xs'
            }`}
            title="星圖 CONSTELLATION™️｜夢境連線 👉簡單講：將唔同夢境嘅人、地方、情緒連成星座網絡，睇清夢境之間嘅神秘關聯。"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>星圖連線</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mystery')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'mystery'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 shadow-2xs'
            }`}
            title="30 NIGHTS MYSTERY™️｜30晚潛意識檔案 👉簡單講：連續記錄 30 晚夢境，好似偵探破案咁，逐晚解鎖潛意識畀你嘅線索拼圖。"
          >
            <Key className="w-3.5 h-3.5" />
            <span>30 NIGHTS™️ (30晚檔案)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 shadow-2xs'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>日記 ({history.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('astrolabe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'astrolabe'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'bg-amber-50 border border-amber-300 text-amber-950 font-bold hover:bg-amber-100 shadow-2xs'
            }`}
            title="👑 付費會員尊享 · 潛意識天體星盤"
            id="tab-astrolabe-vip"
          >
            <Crown className="w-3.5 h-3.5 text-amber-700" />
            <span>👑 尊享星盤</span>
          </button>
        </div>

        {/* Small Therapeutic button */}
        <button
          type="button"
          onClick={() => setIsTherapeuticOpen(true)}
          className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 cursor-pointer py-1 bg-emerald-50 px-3 rounded-full border border-emerald-300 shadow-2xs hover:bg-emerald-100 transition-colors"
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>專業心理支援熱線</span>
        </button>
      </div>

      {errorNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="leading-relaxed text-amber-950">{errorNotice}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onOpenEarnStars && (
              <button
                type="button"
                onClick={onOpenEarnStars}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition-colors cursor-pointer shadow-xs border border-amber-500/30"
              >
                <Star className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
                <span>睇片儲星 (+1 ⭐)</span>
              </button>
            )}
            {onGoToPricing && (
              <button
                type="button"
                onClick={onGoToPricing}
                className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                升級 VIP
              </button>
            )}
            <button
              type="button"
              onClick={() => setErrorNotice(null)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="關閉提示"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: WORKSPACE - INPUT, QUICK ANALYSIS & DEEP ANALYSIS FLOW */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* Member Tier & Star Status Banner */}
          {currentUser && (
            <div
              className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                normalizeRole(currentUser.role) === 'free'
                  ? 'bg-amber-50/90 border-amber-300'
                  : 'bg-emerald-50/90 border-emerald-300'
              }`}
              id="workspace-member-status-banner"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    normalizeRole(currentUser.role) === 'free'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {normalizeRole(currentUser.role) === 'free' ? (
                    <Star className="w-5 h-5 fill-amber-500 text-amber-700" />
                  ) : normalizeRole(currentUser.role) === 'paid' ? (
                    <Crown className="w-5 h-5 text-amber-700" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {getRoleDisplayName(currentUser.role)} · {currentUser.display_name || currentUser.email}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${
                        normalizeRole(currentUser.role) === 'free'
                          ? 'bg-amber-100 text-amber-950 border-amber-300 font-mono'
                          : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      }`}
                    >
                      {normalizeRole(currentUser.role) === 'free' ? `⭐ 結餘：${currentUser.stars ?? 0} 顆星` : 'VIP 已全解鎖'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-700 font-medium mt-0.5 leading-snug">
                    {normalizeRole(currentUser.role) === 'free'
                      ? '一般會員星星機制：初步分析扣 3 顆星 · Dream Master 深度解夢直接執行需 6 顆星（若已做初步分析，折抵後只需加 3 顆星升級）。睇隨機短片每次儲 +1 星！'
                      : '付費 VIP 會員維持全免扣星尊享特權：無限次初步分析與 Dream Master 深度解夢，直接解鎖，免看片免扣星。'}
                  </p>
                </div>
              </div>

              {normalizeRole(currentUser.role) === 'free' && onOpenEarnStars && (
                <button
                  type="button"
                  onClick={onOpenEarnStars}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 border border-amber-500/40 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                  id="btn-workspace-earn-stars"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>隨機彈出片儲星星 (+1 ⭐)</span>
                </button>
              )}
            </div>
          )}

          {/* Main Dream Input Card (Clean, Simple Layout with Dual Mode) */}
          <section className="card p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm" id="dream-input-section">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  <span>記錄夢境</span>
                </div>

                {/* Quota status visualization beside title */}
                {currentUser && (
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs">
                    {normalizeRole(currentUser.role) === 'paid' || normalizeRole(currentUser.role) === 'admin' || normalizeRole(currentUser.role) === 'super_admin' ? (
                      <span className="text-emerald-800 flex items-center gap-1 font-bold text-[11px]">
                        <Crown className="w-3 h-3 text-amber-600" />
                        <span>VIP 無限存檔</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-amber-950 font-mono font-bold">
                          已儲存 {Math.min(currentUser.storage_quota || 3, history.length)} / {currentUser.storage_quota || 3} 條夢境
                        </span>
                        <span className="text-slate-600 font-medium hidden sm:inline">
                          (剩餘 {Math.max(0, (currentUser.storage_quota || 3) - history.length)} 條)
                        </span>
                        <div className="w-14 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (history.length / (currentUser.storage_quota || 3)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sample Preview button */}
                <button
                  type="button"
                  onClick={() => setIsSamplePreviewOpen(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1 transition-all cursor-pointer font-bold shadow-2xs"
                  title="查看示範報告樣品（DREAM DNA、星圖、30晚全息報告）"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-700" />
                  <span>示範樣品預覽</span>
                </button>

                {/* Nightmare Care Button */}
                <button
                  type="button"
                  onClick={() => setIsNightmareCareOpen(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 transition-all cursor-pointer font-bold shadow-2xs"
                  title="開啟噩夢自助梳理小工具與 IRT 改寫練習"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600/30" />
                  <span>噩夢關懷</span>
                </button>

                {(quickReport || activeReport || masterAnalysis || dream.trim().length > 0) && (
                  <button
                    type="button"
                    onClick={handleResetDream}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1 transition-all cursor-pointer border border-slate-300 font-bold shadow-2xs"
                    title="清空並記錄新夢"
                    id="workspace-reset-dream-btn"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
                    <span>清空重寫</span>
                  </button>
                )}
              </div>
            </div>

            {/* DUAL MODE SWITCH TABS: 模式 A (自由書寫) vs 模式 B (分步引導表單) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-3 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setInputMode('free')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    inputMode === 'free'
                      ? 'bg-blue-700 text-white shadow-sm shadow-blue-700/20'
                      : 'text-slate-800 hover:text-blue-700 hover:bg-white'
                  }`}
                  id="tab-mode-free"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>模式 A：自由書寫</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('guided')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    inputMode === 'guided'
                      ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                      : 'text-slate-800 hover:text-amber-800 hover:bg-white'
                  }`}
                  id="tab-mode-guided"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>模式 B：記夢引導（分步表單 · 零散片段專用）</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-600 font-medium hidden md:inline">
                {inputMode === 'free' ? '適合醒來思緒清晰、一氣呵成記錄' : '每欄可留空，睡醒迷迷糊糊隨手記片段'}
              </span>
            </div>

            {/* 明確產品邊界聲明 */}
            <div className="mb-3 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-amber-950 flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                <span>產品邊界提醒：本平台只做基於心理學的自我反思工具，不做吉凶預測；本平台不是心理治療、不是精神科服務。</span>
              </span>
              <span className="text-[11px] text-slate-600 font-semibold">自我覺察日記 · 非醫療診斷</span>
            </div>

            {/* MODE A: 自由書寫大文本 */}
            {inputMode === 'free' && (
              <div className="space-y-3 animate-fade-in">
                {/* 記夢喚醒提示引導 */}
                <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs" id="workspace-dream-guide">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    <span>快速帶入結構標籤：</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { label: '👥 夢中人物', prompt: '【夢中人物】：' },
                      { label: '📍 場景地點', prompt: '【場景地點】：' },
                      { label: '💭 當時心情', prompt: '【當時心情感覺】：' },
                      { label: '🚪 關鍵物件', prompt: '【重要物件】：' },
                    ].map((guide, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDream((prev) => {
                            const trimmed = prev.trim();
                            return trimmed ? `${trimmed}\n${guide.prompt}` : guide.prompt;
                          });
                        }}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-slate-800 hover:text-blue-900 border border-slate-300 hover:border-blue-400 transition-all cursor-pointer font-semibold shadow-2xs active:scale-95"
                        title={`點擊加入「${guide.prompt}」引導`}
                      >
                        {guide.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 信任提示：加強安全感 */}
                <div className="flex items-center justify-between text-xs px-1 text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>💡你嘅夢境內容屬私人資料，不會用作 AI 訓練</span>
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium hidden sm:inline">
                    🔒 嚴格用戶隔離 · 絕不分享第三方
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    ref={dreamTextareaRef}
                    value={dream}
                    onChange={handleDreamTextareaChange}
                    placeholder="寫低你記得嘅夢境……醒來時看見甚麼？心情如何？（可點擊上方標籤快速帶入提示，或直接自由書寫）"
                    rows={4}
                    className="w-full text-base sm:text-sm leading-relaxed min-h-[140px] p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner resize-y font-medium"
                    id="workspace-dream-textarea"
                  />

                  {/* Realtime Character Count & Minimum Guidance */}
                  <div className="flex items-center justify-between text-[11px] mt-1.5 px-1 font-medium">
                    <div>
                      {dream.trim().length > 0 && dream.trim().length < 15 ? (
                        <span className="text-amber-800 flex items-center gap-1 font-bold">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          目前 {dream.trim().length} 字（少於 15 字）：建議補充情緒、場景或關鍵細節以利深入解讀
                        </span>
                      ) : dream.trim().length >= 15 ? (
                        <span className="text-emerald-800 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          已達 {dream.trim().length} 字，內容完整度良好
                        </span>
                      ) : (
                        <span className="text-slate-600">建議完整描述夢中場景與情緒感受（可隨時切換至「模式 B：記夢引導」輕鬆填寫）</span>
                      )}
                    </div>
                    <div className="text-slate-700 font-mono font-bold">
                      {dream.trim().length} 字
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODE B: 記夢引導分步簡易表單 (每欄可留空，降 15 字門檻) */}
            {inputMode === 'guided' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 space-y-4 animate-fade-in shadow-xs">
                {/* 信任提示：加強安全感 */}
                <div className="flex items-center justify-between text-xs px-1 text-emerald-800 pb-2 border-b border-amber-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>💡你嘅夢境內容屬私人資料，不會用作 AI 訓練</span>
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium hidden sm:inline">
                    🔒 嚴格用戶隔離 · 絕不分享第三方
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-950 font-black">
                    <ListFilter className="w-4 h-4 text-amber-700" />
                    <span>分步簡易表單：零碎片段速記</span>
                  </div>
                  <span className="text-slate-600 text-[11px] font-medium">
                    ✨ 每欄均可留空，醒來迷迷糊糊填幾個詞也能智能組合！
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Field 1: 人物 */}
                  <div className="space-y-1">
                    <label className="text-slate-900 font-bold flex items-center gap-1">
                      <span>👥 人物</span>
                      <span className="text-[10px] text-slate-500 font-normal">(可留空)</span>
                    </label>
                    <input
                      type="text"
                      value={guidedCharacters}
                      onChange={(e) => setGuidedCharacters(e.target.value)}
                      placeholder="例：媽媽、舊同事、陌生黑衣人、寵物"
                      className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 outline-none font-medium shadow-inner"
                    />
                  </div>

                  {/* Field 2: 場景 */}
                  <div className="space-y-1">
                    <label className="text-slate-900 font-bold flex items-center gap-1">
                      <span>📍 場景</span>
                      <span className="text-[10px] text-slate-500 font-normal">(可留空)</span>
                    </label>
                    <input
                      type="text"
                      value={guidedScene}
                      onChange={(e) => setGuidedScene(e.target.value)}
                      placeholder="例：老家客廳、高空吊橋、深海沙灘、舊學校"
                      className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 outline-none font-medium shadow-inner"
                    />
                  </div>

                  {/* Field 3: 主要情緒 */}
                  <div className="space-y-1">
                    <label className="text-slate-900 font-bold flex items-center gap-1">
                      <span>💭 主要情緒</span>
                      <span className="text-[10px] text-slate-500 font-normal">(可留空)</span>
                    </label>
                    <input
                      type="text"
                      value={guidedEmotion}
                      onChange={(e) => setGuidedEmotion(e.target.value)}
                      placeholder="例：焦慮不知所措、平靜超脫、窒息恐懼、興奮"
                      className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 outline-none font-medium shadow-inner"
                    />
                  </div>

                  {/* Field 4: 關鍵物件 */}
                  <div className="space-y-1">
                    <label className="text-slate-900 font-bold flex items-center gap-1">
                      <span>🚪 關鍵物件</span>
                      <span className="text-[10px] text-slate-500 font-normal">(可留空)</span>
                    </label>
                    <input
                      type="text"
                      value={guidedObjects}
                      onChange={(e) => setGuidedObjects(e.target.value)}
                      placeholder="例：斷掉的鑰匙、鏡子、時鐘、發光的羽毛"
                      className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 outline-none font-medium shadow-inner"
                    />
                  </div>
                </div>

                {/* Field 5: 簡短劇情 */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-900 font-bold flex items-center gap-1">
                    <span>📖 簡短劇情</span>
                    <span className="text-[10px] text-slate-500 font-normal">(可留空，一句話也可)</span>
                  </label>
                  <textarea
                    value={guidedPlot}
                    onChange={(e) => setGuidedPlot(e.target.value)}
                    placeholder="例：我一直在走廊找出口，後來天空突然下大雨，我轉身跳進了水池裡……"
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 outline-none leading-relaxed font-medium shadow-inner"
                  />
                </div>

                {/* Synthesis Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200">
                  <span className="text-[11px] text-slate-600 font-medium">
                    點擊按鈕，系統將自動將上述零碎欄位串成連貫的夢境筆記！
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateFromGuided}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-amber-500/40 transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>智能串成夢境筆記並檢視 →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Word Adder Chips (意象標籤交互明確化：點擊插入 + hover 出現小提示) */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-200">
              <div className="flex items-center gap-1 text-[11px] text-blue-900 font-bold mr-1" title="點擊將意象加入你的夢境筆記">
                <Plus className="w-3 h-3 text-blue-700" />
                <span>意象庫（點擊插入）：</span>
              </div>
              {[
                { label: '🌊 海洋水流', text: '海洋、大水淹沒' },
                { label: '👣 赤腳無鞋', text: '赤腳、沒穿鞋子' },
                { label: '🏃 被追狂奔', text: '在黑暗中被人追趕、拼命狂奔' },
                { label: '🏚️ 祖屋舊居', text: '小時候住過的舊屋居所' },
                { label: '🕯️ 家宅神枱', text: '神枱香火、祖先排位' },
                { label: '🏫 課室考試', text: '學校課室、試卷未答完' },
                { label: '🚪 緊閉門鎖', text: '打不開的門、找不到鑰匙' },
                { label: '🕳️ 高處墜落', text: '從高樓邊緣失足下墜' },
                { label: '🪞 鏡中倒影', text: '看著鏡中的自己' },
                { label: '🐍 野獸毒蛇', text: '突然出現的毒蛇怪獸' },
                { label: '⏳ 趕車遲到', text: '快要遲到、錯過班次列車' },
                { label: '🛗 下墜電梯', text: '失控快速下墜的電梯' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (inputMode === 'guided') {
                      setGuidedObjects((prev) => (prev ? `${prev}、${item.text}` : item.text));
                    } else {
                      setDream((prev) => {
                        const trimmed = prev.trim();
                        return trimmed ? `${trimmed}，夢中有${item.text}` : `昨晚夢見${item.text}`;
                      });
                    }
                  }}
                  className="group relative text-[11px] px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-950 font-bold hover:bg-blue-100 hover:text-blue-900 hover:border-blue-400 transition-colors cursor-pointer shadow-2xs"
                  title="點擊將意象加入你的夢境筆記"
                >
                  <span>+{item.label}</span>
                </button>
              ))}
            </div>

            {/* DREAM METADATA EXTENSION (夢境元數據擴充：時間、時段、分類標籤、情緒評分) */}
            <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-3 text-xs bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  <span>夢境元數據紀錄 (可選填)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-600 font-semibold">
                  🕒 自動記錄時間：{recordTime}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. 睡眠時段 */}
                <div>
                  <label className="text-[11px] text-slate-700 font-bold block mb-1">睡眠時段</label>
                  <div className="flex gap-1.5">
                    {[
                      { id: 'early_night', label: '🌙 入睡前期' },
                      { id: 'midnight', label: '🌌 深夜深眠' },
                      { id: 'dawn_waking', label: '🌅 清晨醒前' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSleepPeriod(p.id as any)}
                        className={`flex-1 py-1.5 px-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                          sleepPeriod === p.id
                            ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-800'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 夢境分類標籤 */}
                <div>
                  <label className="text-[11px] text-slate-700 font-bold block mb-1">夢境分類標籤</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'normal', label: '☁️ 普通夢' },
                      { id: 'nightmare', label: '😱 噩夢' },
                      { id: 'lucid', label: '🔮 清醒夢' },
                      { id: 'recurring', label: '🔄 重複夢' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setDreamType(t.id as any);
                          if (t.id === 'nightmare') {
                            setIsNightmareCareOpen(true);
                          }
                        }}
                        className={`flex-1 py-1.5 px-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                          dreamType === t.id
                            ? t.id === 'nightmare'
                              ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                              : 'bg-blue-700 border-blue-700 text-white shadow-xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. 1-5 分情緒評分 */}
                <div>
                  <label className="text-[11px] text-slate-700 font-bold block mb-1">
                    醒來情緒波動（1 平和 ~ 5 強烈）
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setEmotionRating(score)}
                        className={`flex-1 py-1.5 rounded-lg border text-center text-xs font-mono font-black transition-all cursor-pointer shadow-2xs ${
                          emotionRating === score
                            ? score >= 4
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-amber-400 text-slate-950 border-amber-500'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nightmare Quick Notice Banner if marked as nightmare */}
              {dreamType === 'nightmare' && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-between gap-2 text-xs text-rose-950 font-medium">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-600/30 shrink-0" />
                    <span>覺察到這是一場噩夢。建議使用【噩夢關懷與自救】進行 5-4-3-2-1 著陸與結局改寫。</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNightmareCareOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
                  >
                    開啟梳理 →
                  </button>
                </div>
              )}
            </div>

            {/* Optional User Context Drawer (可選補充資訊：性別、近況、是否為重複夢) */}
            <div className="mt-3 pt-2.5 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowContextOptions((prev) => !prev)}
                className="text-xs text-slate-700 hover:text-blue-700 flex items-center justify-between w-full py-1 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-blue-700" />
                  <span className="font-bold text-slate-900">可選補充資訊（提供背景利於模型結合個人現況解讀）</span>
                  {(userContext.recent_status || userContext.gender !== '未指定' || userContext.is_recurring) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-300">
                      已自訂背景
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold">
                  <span>{showContextOptions ? '收起' : '展開填寫'}</span>
                  {showContextOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {showContextOptions && (
                <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Gender Option */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">造夢者性別</label>
                    <select
                      value={userContext.gender || '未指定'}
                      onChange={(e) => setUserContext((prev) => ({ ...prev, gender: e.target.value }))}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                    >
                      <option value="未指定">未指定 / 不透露</option>
                      <option value="女性">女性</option>
                      <option value="男性">男性</option>
                      <option value="多元性別">多元性別</option>
                    </select>
                  </div>

                  {/* Recurring Dream Option */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">是否為重複出現的夢</label>
                    <select
                      value={userContext.is_recurring ? 'true' : 'false'}
                      onChange={(e) => setUserContext((prev) => ({ ...prev, is_recurring: e.target.value === 'true' }))}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                    >
                      <option value="false">否（首次出現此夢境）</option>
                      <option value="true">是（重複出現 / 類似情節）</option>
                    </select>
                  </div>

                  {/* Recent Life Status Option */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">近期生活近況</label>
                    <input
                      type="text"
                      value={userContext.recent_status || ''}
                      onChange={(e) => setUserContext((prev) => ({ ...prev, recent_status: e.target.value }))}
                      placeholder="例：剛轉新工作、感情困擾、準備考試"
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 text-xs placeholder:text-slate-400 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Dream Master Deep Analysis vs. Quick Analysis */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200">
              <div className="text-xs">
                {masterAnalysis ? (
                  <span className="text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                    <Check className="w-4 h-4 text-emerald-700" />
                    已完成 Dream Master 深度心理學專業分析
                  </span>
                ) : normalizeRole(currentUser?.role || 'free') === 'free' ? (
                  <div className="flex flex-wrap items-center gap-1.5 text-slate-800 font-medium">
                    <span className="text-amber-900 font-black flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                      星星幣說明：
                    </span>
                    <span className="text-slate-700">
                      初步分析扣 <b className="text-amber-900 font-bold">3 星 ⭐</b> · 深度解夢直接執行需 <b className="text-amber-900 font-bold">6 星 ⭐</b>（初步分析後升級只需加 <b className="text-amber-900 font-bold">3 星 ⭐</b>）
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-mono font-black">
                      目前結餘：{currentUser?.stars ?? 0} ⭐
                    </span>
                  </div>
                ) : (
                  <span className="text-emerald-850 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    付費 VIP 會員維持全免扣星尊享特權：無限次初步分析與 Dream Master 深度解夢，免看片免扣星
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Secondary lightweight CTA: 先看樣本再決定寫夢，降低行動門檻 */}
                <button
                  type="button"
                  onClick={() => setIsSamplePreviewOpen(true)}
                  className="btn2 text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer text-slate-800 font-bold bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-400 transition-all shadow-2xs"
                  title="先看樣本再決定寫夢，降低心理門檻"
                  id="workspace-sample-preview-btn"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-700" />
                  <span>【觀看示範報告】</span>
                </button>

                <button
                  type="button"
                  className="btn2 text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer text-blue-900 font-bold bg-white border-2 border-slate-300 hover:bg-blue-50 hover:border-blue-400 shadow-2xs"
                  disabled={isQuickAnalyzing || isMasterAnalyzing || !dream.trim()}
                  onClick={handlePerformQuickAnalysis}
                  id="workspace-quick-analyze-btn"
                  title="初步分析扣除 3 顆星星幣（付費 VIP 會員全免扣星）"
                >
                  {isQuickAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                      <span>初步分析中…</span>
                    </>
                  ) : (
                    <>
                      <span>✨ 初步分析</span>
                      {normalizeRole(currentUser?.role || 'free') === 'free' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 font-black font-mono border border-amber-300">
                          3 星 ⭐
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 font-bold border border-emerald-300">
                          免星
                        </span>
                      )}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn text-xs px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black shadow-md shadow-blue-700/25 active:scale-95 transition-all"
                  disabled={isMasterAnalyzing || !dream.trim() || dream.trim().length < 15}
                  onClick={handleRunMasterAnalysis}
                  id="workspace-master-analyze-btn"
                  title={
                    dream.trim().length < 15
                      ? '夢境文字少於 15 字，暫不可執行'
                      : (paidPreliminary || quickReport)
                      ? '已完成初步分析，折抵後只需加 3 顆星升級 Dream Master 深度解夢'
                      : '直接執行 Dream Master 深度解夢（需 6 顆星）'
                  }
                >
                  {isMasterAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>深度心理學解析中…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {(paidPreliminary || quickReport)
                          ? '升級 Dream Master 深度解夢（+3 星 ⭐）'
                          : '記錄夢境開始分析 (Dream Master)'}
                      </span>
                      {normalizeRole(currentUser?.role || 'free') === 'free' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black font-mono">
                          {(paidPreliminary || quickReport) ? '+3 星 ⭐' : '6 星 ⭐'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-extrabold">
                          VIP
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* DREAM MASTER RESULT CARD */}
          {masterAnalysis && (
            <section
              className="card p-6 sm:p-7 rounded-3xl border-2 border-blue-200 bg-white space-y-5 shadow-lg shadow-blue-900/5"
              id="dream-master-sop-card"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-300 text-blue-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-serif font-black text-slate-900">
                        Dream Master 深度心理學解讀
                      </h2>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold">
                        榮格原型與文獻對映
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      融合榮格分析心理學、現代睡眠科學與經典文獻透視
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {copiedWordNotice && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold flex items-center gap-1 animate-pulse">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      已複製！可貼入 Word
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenShare({
                      title: 'Dream Master 典籍深度心理剖析',
                      dreamText: dream,
                      summary: masterAnalysis.analysis_text.slice(0, 240) + '……',
                      archetype: '榮格原型與集體潛意識',
                      noteworthyMessage: '從榮格心理學與周公典籍視角，梳理你的潛意識模式與核心情緒。',
                    })}
                    className="btn2 text-xs px-2.5 py-1.5 flex items-center gap-1 cursor-pointer border-slate-300 text-slate-800 hover:text-blue-700 hover:border-blue-400 font-bold shadow-2xs"
                    title="分享打碼隱去個人內容的洞察報告（社交傳播）"
                    id="master-share-btn"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>分享打碼洞察</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyMasterText}
                    className="btn2 text-xs px-2.5 py-1.5 flex items-center gap-1 cursor-pointer border-slate-300 hover:border-blue-400 text-slate-800 hover:text-blue-700 font-bold shadow-2xs"
                    title="複製整份報告文字，格式相容 Microsoft Word 及各筆記軟體"
                    id="master-copy-word-btn"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-700" />
                    <span>複製全文</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportMasterToWord}
                    className="btn2 text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer border-blue-300 text-blue-800 hover:bg-blue-50 font-bold shadow-2xs"
                    title="下載 Microsoft Word 格式 (.doc) 檔案"
                    id="master-export-word-btn"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-700" />
                    <span>匯出 Word 檔 (.doc)</span>
                  </button>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-mono font-bold">
                    字數：{masterAnalysis.word_count} 字
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-mono font-bold">
                    {masterAnalysis.source === 'gemini' ? 'Gemini 3.8 Flash' : '專業心理模型'}
                  </span>
                </div>
              </div>

              {/* Psychological Dimensions & Literature Overview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Brain className="w-3.5 h-3.5 text-blue-700" />
                  <span>深度解析心理原型維度：</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-[11px] text-slate-600 font-semibold">核心意象對映</div>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      {masterAnalysis.retrieved_counts.symbols} 項
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-[11px] text-slate-600 font-semibold">潛意識主題維度</div>
                    <div className="text-base font-black text-blue-700 mt-0.5">
                      {masterAnalysis.retrieved_counts.themes} 項
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-[11px] text-slate-600 font-semibold">心理學大師典籍</div>
                    <div className="text-base font-black text-indigo-700 mt-0.5">
                      {masterAnalysis.retrieved_counts.books_and_rules} 則
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Psychological Analysis Content (400-800 words) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap space-y-4 font-sans tracking-wide relative overflow-hidden shadow-2xs">
                {masterAnalysis.analysis_text}
                
                {/* 知識產權與原創版權標籤 */}
                <div className="pt-3 mt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>核心專利保護：22部典籍與原創意象網絡由伺服器黑盒隔離，嚴禁未授權爬取或商業複製</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    DreamAstra™ IP Protected · {new Date().toISOString().slice(0, 10)}
                  </span>
                </div>
              </div>

              {/* Mandatory Disclaimer Box */}
              <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-3 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-bold">{masterAnalysis.disclaimer}</span>
                </div>
                <span className="text-[11px] text-amber-900 font-semibold">心理學參考 · 非命運預測</span>
              </div>

              {/* Multi-turn Context Management & Follow-up Conversation (對話輪次管理) */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-700" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      深入追問此夢（對話輪次管理）
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-bold">
                    僅攜帶上一輪壓縮摘要 (≤200 Token) · 不重傳檢索庫
                  </span>
                </div>

                {/* Follow-up history list */}
                {followUpHistory.length > 0 && (
                  <div className="space-y-3">
                    {followUpHistory.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-blue-800">
                          <span>Q{idx + 1} 追問：</span>
                          <span>{item.q}</span>
                        </div>
                        <div className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed border-t border-slate-200 pt-2">
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up input form */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendFollowUp();
                      }
                    }}
                    placeholder="針對此夢進一步追問……（例如：夢中推不開的門在心理學上代表甚麼？）"
                    className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-blue-600 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handleSendFollowUp}
                    disabled={isFollowUpLoading || !followUpQuestion.trim()}
                    className="btn text-xs px-4 py-2.5 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 bg-blue-700 hover:bg-blue-800 text-white font-bold"
                  >
                    {isFollowUpLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>提交追問</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SOFT RECOMMENDATION (USER MANDATED): 解鎖 DREAM DNA */}
              {(!currentUser || normalizeRole(currentUser.role) === 'free') && (
                <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-sky-50 border-2 border-blue-300 shadow-sm space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shrink-0 shadow-xs">
                      🧬
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold mb-1 border border-blue-300">
                        <Sparkles className="w-3 h-3 text-blue-700" />
                        <span>進階心靈模式解鎖</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug">
                        呢個只係基礎解讀，解鎖 DREAM DNA 可以睇你長期重複嘅夢境模式
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                        單個夢境只能看見即時心緒。DREAM DNA™️ 會自動統計你跨越多晚反覆夢見嘅人物、場景、關鍵物件同情緒，揭開潛意識深層嘅心靈指紋與人生轉折！
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-blue-200">
                    <button
                      type="button"
                      onClick={onOpenEarnStars}
                      className="btn2 text-xs px-4 py-2.5 flex items-center gap-2 cursor-pointer border-amber-500/50 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-all shadow-xs"
                      id="master-rec-earn-stars-btn"
                    >
                      <Tv className="w-4 h-4 text-slate-950" />
                      <span>睇廣告賺星星幣解鎖</span>
                    </button>

                    <button
                      type="button"
                      onClick={onGoToPricing}
                      className="btn text-xs px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold shadow-md shadow-blue-700/20 transition-all"
                      id="master-rec-upgrade-pricing-btn"
                    >
                      <Crown className="w-4 h-4 text-amber-300" />
                      <span>直接升級付費</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* STEP 1 RESULT: 簡單基本分析 (Quick Analysis Card) */}
          {quickReport && !activeReport && (
            <section
              className="card p-6 sm:p-7 rounded-3xl bg-white border-2 border-sky-300 shadow-lg shadow-sky-900/5 space-y-4"
              id="quick-analysis-card"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-950 font-mono font-bold border border-sky-300">
                    初步基本分析
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-black text-slate-900">
                    {quickReport.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenShare({
                      title: quickReport.title,
                      dreamText: dream,
                      summary: quickReport.simpleSummary,
                      symbols: [{ symbol: quickReport.primarySymbol.symbol, meaning: quickReport.primarySymbol.meaning }],
                      noteworthyMessage: quickReport.noteworthyMessage,
                      healingAdvice: quickReport.quickTakeaway,
                    })}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    id="quick-report-share-btn"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>分享打碼洞察</span>
                  </button>
                  <span className="text-[11px] text-slate-600 font-semibold hidden sm:inline">即時單次解析</span>
                </div>
              </div>

              {/* Core Symbol & Simple Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[11px] text-slate-600 font-bold block mb-1">核心意象</span>
                  <b className="text-base font-black text-blue-700">{quickReport.primarySymbol.symbol}</b>
                  <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                    {quickReport.primarySymbol.meaning}
                  </p>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[11px] text-blue-900 font-bold block">心理意涵初探</span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {quickReport.simpleSummary}
                  </p>
                  <div className="text-xs text-emerald-800 font-bold pt-2 border-t border-slate-200 flex items-center gap-1.5">
                    <span>💡 心靈指引：</span>
                    <span>{quickReport.quickTakeaway}</span>
                  </div>
                </div>
              </div>

              {/* Book Brain Snippet & Noteworthy Message for Quick Analysis */}
              {(quickReport.bookBrainSnippet || quickReport.noteworthyMessage) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {quickReport.bookBrainSnippet && (
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs flex items-start gap-2.5">
                      <BookOpen className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sky-950 font-bold block mb-0.5">
                          Book Brain 典籍溯源 · {quickReport.bookBrainSnippet.bookTitle}
                        </span>
                        <p className="text-slate-700 leading-relaxed text-[11px] font-medium">
                          {quickReport.bookBrainSnippet.theory}
                        </p>
                      </div>
                    </div>
                  )}

                  {quickReport.noteworthyMessage && (
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-blue-950 font-bold block mb-0.5">
                          可能值得留意嘅訊息
                        </span>
                        <p className="text-slate-700 leading-relaxed text-[11px] font-medium">
                          {quickReport.noteworthyMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* POST-DREAM HEALING PRODUCT RECOMMENDATION (Post-Analysis Selection) */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-emerald-300 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    🛍️
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="badge bg-emerald-100 text-emerald-950 border-emerald-300 text-[10px] font-bold">
                        解夢選物店推薦
                      </span>
                      <span className="text-[11px] text-amber-950 font-bold">
                        身心調校 · 助眠草本 · 空間淨化 · 能量水晶
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed line-clamp-1">
                      根據夢境診斷挑選專屬療癒好物，提供深眠枕頭噴霧、白鼠尾草煙燻草杖、天然水晶原礦等多樣選品。
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => onGoToStore && onGoToStore()}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>逛解夢選物店</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fixed Mandatory Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <b className="text-amber-950 font-bold">免責提示：</b>本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。
                </p>
              </div>

              {/* SOFT RECOMMENDATION (USER MANDATED): 呢個只係基礎解讀，解鎖 DREAM DNA 可以睇你長期重複嘅夢境模式 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-sky-50 border-2 border-blue-300 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shrink-0 shadow-xs">
                    🧬
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold mb-1 border border-blue-300">
                      <Sparkles className="w-3 h-3 text-blue-700" />
                      <span>進階心靈模式解鎖</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug">
                      呢個只係基礎解讀，解鎖 DREAM DNA 可以睇你長期重複嘅夢境模式
                    </h4>
                    <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                      單個夢境只能看見即時心緒。DREAM DNA™️ 會自動統計你跨越多晚反覆夢見嘅人物、場景、關鍵物件同情緒，揭開潛意識深層嘅心靈指紋與人生轉折！
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-blue-200">
                  {/* Option 1: 睇廣告賺星星幣解鎖 */}
                  <button
                    type="button"
                    onClick={onOpenEarnStars}
                    className="btn2 text-xs px-4 py-2.5 flex items-center gap-2 cursor-pointer border-amber-500/50 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-all shadow-xs"
                    id="quick-rec-earn-stars-btn"
                  >
                    <Tv className="w-4 h-4 text-slate-950" />
                    <span>睇廣告賺星星幣解鎖</span>
                  </button>

                  {/* Option 2: 直接升級付費 */}
                  <button
                    type="button"
                    onClick={onGoToPricing}
                    className="btn text-xs px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold shadow-md shadow-blue-700/20 transition-all"
                    id="quick-rec-upgrade-pricing-btn"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>直接升級付費</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* STEP 2 INVITATION: 升級 Dream Master 深度解夢 (折抵後只需加 3 顆星) */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-50/70 p-4 rounded-2xl border-2 border-blue-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    <span>升級 Dream Master 深度解夢？</span>
                    {currentUser && normalizeRole(currentUser.role) !== 'free' ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold">
                        {getRoleDisplayName(currentUser.role)} · 免扣星尊享
                      </span>
                    ) : (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-mono font-black">
                        折抵後只需加 3 顆星 ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {currentUser && normalizeRole(currentUser.role) === 'free'
                      ? `完成初步分析後，主操作按鈕與下方自動切換為折抵升級。點擊後僅扣除差額 3 顆星（累計共 6 星，目前結餘：${currentUser.stars ?? 0} 顆），即刻啟動深度心理學解析並將夢境永久存檔至日記！`
                      : '付費 VIP 會員維持全免扣星尊享特權：即刻啟動深度心理學解析並享無限存檔！'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {currentUser && normalizeRole(currentUser.role) === 'free' && onOpenEarnStars && (
                    <button
                      type="button"
                      onClick={onOpenEarnStars}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500/40 text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
                      title="睇隨機短片儲星星幣 (+1 星)"
                    >
                      <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                      <span>睇片儲星 (+1 ⭐)</span>
                    </button>
                  )}

                  {onGoToPricing && (
                    <button
                      type="button"
                      onClick={onGoToPricing}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 cursor-pointer shadow-2xs"
                      title="查看方案與星星幣兌換詳情"
                    >
                      方案詳情
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRunMasterAnalysis}
                    disabled={isMasterAnalyzing}
                    className="btn text-xs px-5 py-2.5 font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-blue-700/20 cursor-pointer bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white"
                    id="trigger-master-upgrade-from-quick-btn"
                  >
                    {isMasterAnalyzing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>深度解析中…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {currentUser && normalizeRole(currentUser.role) !== 'free'
                            ? '👑 直接升級 Dream Master 深度解夢 (VIP 免星)'
                            : '升級 Dream Master 深度解夢（+3 星 ⭐）'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 RESULT: 完整 AI 深度四層解碼報告 (Deep Report) */}
          {activeReport && (
            <section
              className="card p-6 sm:p-7 rounded-3xl border-2 border-blue-200 bg-white space-y-5 shadow-lg shadow-blue-900/5"
              id="deep-report-card"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="badge bg-blue-100 text-blue-900 border-blue-300 font-bold">AI 深度解讀報告</span>
                  <span className="text-xs text-emerald-800 font-mono font-bold">已載入 DREAM DNA™️</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenShare({
                      title: activeReport.title,
                      dreamText: dream,
                      summary: activeReport.summary,
                      symbols: activeReport.symbols,
                      archetype: activeReport.fourLayers?.jungianLayer.title,
                      healingAdvice: activeReport.fourLayers?.integrationAction.advice,
                      question: activeReport.questions?.[0],
                    })}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    id="deep-report-share-btn"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>分享打碼洞察</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (history[0]) setSelectedEntry(history[0]);
                    }}
                    className="btn2 text-xs flex items-center gap-1.5 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-700" />
                    <span>全屏檢視</span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                  {activeReport.title}
                </h2>
                <div className="callout mt-2 text-xs sm:text-sm leading-relaxed border-blue-300 bg-blue-50/80 text-blue-950 font-medium">
                  <b className="text-blue-950 font-bold block mb-0.5">核心信號：</b>
                  {activeReport.summary}
                </div>
              </div>

              {/* Book Brain Theory & Past Dream Comparison Grounding Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {activeReport.bookBrainTheory && (
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-bold text-sky-950">Book Brain 典籍理論依據</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                        {activeReport.bookBrainTheory.citation}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {activeReport.bookBrainTheory.theoryName}
                      <span className="text-slate-600 font-medium block text-[11px] mt-0.5">
                        《{activeReport.bookBrainTheory.bookTitle}》
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {activeReport.bookBrainTheory.coreInsight}
                    </p>
                  </div>
                )}

                {activeReport.pastDreamComparison && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-700" />
                        <span className="text-xs font-bold text-blue-950">結合過往夢境交叉比對</span>
                      </div>
                      <span className="text-[10px] text-emerald-850 font-bold font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        記憶連繫
                      </span>
                    </div>
                    {activeReport.pastDreamComparison.matchedPatterns?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-600 font-bold">比對吻合意象：</span>
                        {activeReport.pastDreamComparison.matchedPatterns.map((pat, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white text-blue-900 font-mono font-bold border border-blue-200">
                            {pat}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {activeReport.pastDreamComparison.pastOccurrencesSummary}
                    </p>
                  </div>
                )}
              </div>

              {/* Noteworthy Message Banner */}
              {activeReport.noteworthyMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-900 leading-relaxed">
                    <b className="text-emerald-950 font-bold block mb-0.5">可能值得留意嘅訊息：</b>
                    {activeReport.noteworthyMessage}
                  </div>
                </div>
              )}

              {/* Four Layers Highlight */}
              {activeReport.fourLayers && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-700" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      四層立體解析架構
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Asian Cultural Layer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs font-black text-blue-900">
                        🏮 {activeReport.fourLayers.asianCulturalLayer.title}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {activeReport.fourLayers.asianCulturalLayer.description}
                      </p>
                    </div>

                    {/* Jungian Archetype Layer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs font-black text-indigo-900">
                        🧠 {activeReport.fourLayers.jungianLayer.title}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {activeReport.fourLayers.jungianLayer.description}
                      </p>
                    </div>

                    {/* Personal Layer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs font-black text-amber-950">
                        🧬 {activeReport.fourLayers.personalLayer.title}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {activeReport.fourLayers.personalLayer.description}
                      </p>
                    </div>

                    {/* Action Layer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs font-black text-emerald-950">
                        🌱 {activeReport.fourLayers.integrationAction.title}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {activeReport.fourLayers.integrationAction.advice}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Symbols */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeReport.symbols?.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <b className="text-slate-900 font-bold text-xs">{s.symbol}</b>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">{s.meaning}</p>
                  </div>
                ))}
              </div>

              {/* Book Brain Sources */}
              {activeReport.sources && (
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-semibold pt-1">
                  <span className="flex items-center gap-1 text-slate-900 font-bold">
                    <BookOpen className="w-3 h-3 text-blue-700" />
                    典籍依據：
                  </span>
                  {activeReport.sources.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800">
                      📚 {s.book_title}
                    </span>
                  ))}
                </div>
              )}

              {/* POST-DREAM PRODUCT RECOMMENDATION BANNER */}
              <div className="p-5 rounded-3xl bg-emerald-50/80 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-300 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    🛍️
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge bg-emerald-100 text-emerald-950 border-emerald-300 text-[10px] font-bold">
                        解夢選物店 · 身心轉化選品
                      </span>
                      <span className="text-xs text-slate-900 font-black">
                        精選深眠草本、空間煙燻淨化與守護水晶原礦
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      針對本場夢境意象與潛意識能量，前往選物店瀏覽各類調校心神好物，支援星星幣折抵換購。
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                  <div className="text-right">
                    <div className="text-xs font-black text-amber-950 font-mono">支援星星幣折抵</div>
                    <div className="text-[10px] text-slate-600 font-semibold">多款靈性與安眠好物</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onGoToStore && onGoToStore()}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>逛解夢選物店</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fixed Mandatory Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <b className="text-amber-950 font-bold">免責提示：</b>本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetDream}
                  className="btn2 text-xs flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>記錄下一場夢</span>
                </button>
              </div>
            </section>
          )}

          {/* Quick Peek of Dream DNA */}
          <div className="pt-2">
            <DreamDnaCard
              dna={dreamDNA}
              onSelectSymbolForConstellation={() => setActiveTab('constellation')}
            />
          </div>
        </div>
      )}

      {/* TAB 2: DREAM DNA */}
      {activeTab === 'dna' && (
        <DreamDnaCard
          dna={dreamDNA}
          onSelectSymbolForConstellation={() => setActiveTab('constellation')}
        />
      )}

      {/* TAB 3: DREAM CONSTELLATION */}
      {activeTab === 'constellation' && (
        <DreamConstellationView
          nodes={constellationData.nodes}
          links={constellationData.links}
          dreams={history}
          onOpenReportDetail={(entry) => setSelectedEntry(entry)}
          onRecordNewDream={() => setActiveTab('workspace')}
          onAddCustomLink={(newLink) => {
            setConstellationData((prev) => ({
              ...prev,
              links: [...prev.links, newLink],
            }));
          }}
        />
      )}

      {/* TAB 4: 30 NIGHTS MYSTERY */}
      {activeTab === 'mystery' && (
        <ThirtyNightsMysteryView
          journey={mysteryJourney}
          onRecordNewNight={() => setActiveTab('workspace')}
        />
      )}

      {/* TAB 5: HISTORY ARCHIVES */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {/* Synthesis CTA */}
          <section className="card p-5 rounded-2xl bg-white border border-slate-300 shadow-sm" id="patterns">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-blue-700 font-mono font-bold flex items-center gap-1 mb-1">
                  <Brain className="w-3.5 h-3.5" />
                  <span>LONG-TERM SYNTHESIS</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  串連你過往 {history.length} 個夢境
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  尋找長期重複出現的意象、情緒與轉化軌跡。
                </p>
              </div>

              <button
                type="button"
                className="btn dark text-xs px-4 py-2 font-bold"
                disabled={isDeepAnalyzing || history.length < 2}
                onClick={synthesize}
              >
                {isDeepAnalyzing ? '計算中…' : '🧠 串連分析'}
              </button>
            </div>

            {synthesis && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs space-y-2">
                <h4 className="text-sm font-bold text-slate-900">{synthesis.headline}</h4>
                <p className="text-slate-800 leading-relaxed font-medium">{synthesis.summary}</p>
              </div>
            )}
          </section>

          {/* Dream Journal Manager (Tags, Multi-field Search, PDF Export, Morning Reminder) */}
          <DreamJournalManager
            history={history}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            onUpdateEntryTags={handleUpdateEntryTags}
          />
        </div>
      )}

      {/* TAB: ASTROLABE - PAID MEMBERS EXCLUSIVE ZONE */}
      {activeTab === 'astrolabe' && (
        <div className="card p-6 sm:p-10 rounded-3xl bg-white border-2 border-amber-300 shadow-xl relative overflow-hidden" id="workspace-astrolabe-vip-panel">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2 shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>👑 付費會員專區 · VIP EXCLUSIVE</span>
              </div>
              <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900">
                ✦ 潛意識天體星盤 · 12 宿原型共振 ✦
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                按住圓盤隨意探索天體軌道；<strong className="text-blue-700">「撥動星盤」為付費會員專屬特權</strong>，與心靈原型深度共振。
              </p>
            </div>

            <div>
              {isPaidUser ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>已尊享付費會員特權</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onGoToPricing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>立即開通付費會員</span>
                </button>
              )}
            </div>
          </div>

          <CelestialRotatingAstrolabe
            isPaidMember={isPaidUser}
            onRequirePaid={onGoToPricing}
            onSelectArchetype={(arch) => {
              setDream((prev) => {
                const tag = `【今日潛意識共振】：${arch.symbol} ${arch.label}（${arch.insight}）`;
                if (prev.includes(arch.label)) return prev;
                const trimmed = prev.trim();
                return trimmed ? `${trimmed}\n${tag}` : tag;
              });
              setActiveTab('workspace');
            }}
          />
        </div>
      )}

      {/* Detective Inquiry Modal (Triggered ONLY when user chooses further AI analysis) */}
      <DetectiveInquiryModal
        isOpen={isDetectiveOpen}
        dreamText={dream}
        questions={activeQuestions}
        onComplete={handleCompleteDetectiveInquiry}
        onClose={() => setIsDetectiveOpen(false)}
      />

      {/* Report Detail Modal */}
      {selectedEntry && (
        <ReportDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={handleDeleteHistory}
        />
      )}

      {/* Therapeutic Support Modal */}
      <TherapeuticSupportModal
        isOpen={isTherapeuticOpen}
        onClose={() => setIsTherapeuticOpen(false)}
        therapists={therapists}
        prefilledDreamText={dream}
      />

      {/* Sample Report Preview Modal (DREAM DNA, Constellation, 30 Nights) */}
      <SampleReportPreviewModal
        isOpen={isSamplePreviewOpen}
        onClose={() => setIsSamplePreviewOpen(false)}
        onGoToPricing={onGoToPricing}
        onOpenEarnStars={onOpenEarnStars}
      />

      {/* Nightmare Care Kit & IRT Self-Help Modal */}
      <NightmareCareModal
        isOpen={isNightmareCareOpen}
        onClose={() => setIsNightmareCareOpen(false)}
        onOpenTherapists={() => {
          setIsNightmareCareOpen(false);
          setIsTherapeuticOpen(true);
        }}
        prefilledDream={dream}
        onApplyRewriteToDream={(rewrittenStory) => {
          setDream((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed}\n\n${rewrittenStory}` : rewrittenStory;
          });
        }}
      />

      {/* Anonymized Share Modal for Social Sharing */}
      {shareModalData && (
        <AnonymizedShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          reportTitle={shareModalData.title}
          dreamText={shareModalData.dreamText}
          summary={shareModalData.summary}
          symbols={shareModalData.symbols}
          archetype={shareModalData.archetype}
          noteworthyMessage={shareModalData.noteworthyMessage}
          healingAdvice={shareModalData.healingAdvice}
          question={shareModalData.question}
        />
      )}
    </div>
  );
};
