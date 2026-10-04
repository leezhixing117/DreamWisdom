import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Compass,
  RotateCw,
  Sparkles,
  ArrowUpRight,
  Crown,
  Lock,
  CheckCircle2,
  X,
  Copy,
  Check,
  BookOpen,
  Calendar,
  Flame,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Eye,
  Moon,
  Sun,
  ShieldCheck,
  Feather,
  Heart,
} from 'lucide-react';
import { DreamEntry } from '../types';
import { INITIAL_DREAMS } from '../data';

export interface Archetype {
  deg: number;
  label: string;
  symbol: string;
  element: string;
  elementColor: string;
  themeColor: string;
  insight: string;
  // 每日占卜專屬
  oracleName: string;
  energyVibe: string;
  auspicious: string;
  taboo: string;
  nightGuidance: string;
  recommendedItemName: string;
  recommendedItemId?: string;
  // 夢境關聯匹配關鍵詞
  keywords: string[];
}

export const ARCHETYPES: Archetype[] = [
  {
    deg: 0,
    label: '月牙安眠',
    symbol: '🌙',
    element: '水象·潛意識',
    elementColor: 'bg-indigo-50/80 text-indigo-800 border-indigo-200/80',
    themeColor: 'indigo',
    insight: '接納內心溫柔的防衛，今晚是自我療癒與神經重塑的最佳時刻。',
    oracleName: '第一宿 · 月牙安眠籤',
    energyVibe: '溫柔包裹 · 靜謐療癒',
    auspicious: '提早半小時就寢、聽柔和頌缽音療、睡前溫水泡腳',
    taboo: '深夜翻閱刺激社群、勉強參與消耗性社交',
    nightGuidance: '今夜為神經修復黃金期，夢境中若出現溫暖被窩或靜水，象徵內在安全感正在重建。',
    recommendedItemName: '深眠白噪音薰衣草舒緩枕頭噴霧',
    recommendedItemId: 'prod_lavender_pillow_mist',
    keywords: ['月', '睡', '床', '安', '夜', '黑', '靜', '歇', '抱', '暖', '枕', '被'],
  },
  {
    deg: 30,
    label: '靈光星辰',
    symbol: '⭐',
    element: '風象·直覺',
    elementColor: 'bg-sky-50/80 text-sky-800 border-sky-200/80',
    themeColor: 'sky',
    insight: '白日未解的深層難題，夜間正以靈光一閃的形式在潛意識顯現。',
    oracleName: '第二宿 · 靈光星辰籤',
    energyVibe: '心智澄明 · 直覺爆發',
    auspicious: '隨手速記靈感、嘗試跳脫框架的新解法、信任第一直覺',
    taboo: '陷入自我否定懷疑、被繁瑣雜務打斷沉浸思路',
    nightGuidance: '困擾已久的人生或工作盲點，今夜極可能以清醒夢或象徵謎底直接浮現。',
    recommendedItemName: '天然烏拉圭紫水晶原礦小晶簇',
    recommendedItemId: 'prod_amethyst_cluster',
    keywords: ['星', '光', '亮', '閃', '天', '電', '橋', '空', '飛', '火花', '醒', '考'],
  },
  {
    deg: 60,
    label: '守護銀羽',
    symbol: '🪶',
    element: '乙太·庇護',
    elementColor: 'bg-teal-50/80 text-teal-800 border-teal-200/80',
    themeColor: 'teal',
    insight: '卸下白日的沉重戒備，你的心靈正受到溫厚宇宙與祖蔭的溫柔守護。',
    oracleName: '第三宿 · 守護銀羽籤',
    energyVibe: '祖蔭庇佑 · 卸除防備',
    auspicious: '問候年長親友、向心靈至高者默禱祈願、接納自身脆弱',
    taboo: '逞強獨自承擔過重心理重擔、過度猜忌他人善意',
    nightGuidance: '夢中若逢先人託夢或慈祥長者，代表內在成熟自性（Self）正為你指引前路。',
    recommendedItemName: '廣東精選碌柚葉好運香水噴霧',
    recommendedItemId: 'prod_pomelo_spray',
    keywords: ['羽', '鳥', '抱', '神', '祖', '長者', '老', '被', '暖', '家', '祠', '爺', '嫲'],
  },
  {
    deg: 90,
    label: '深海巨浪',
    symbol: '🌊',
    element: '水象·情緒',
    elementColor: 'bg-blue-50/80 text-blue-800 border-blue-200/80',
    themeColor: 'blue',
    insight: '洶湧的情緒並非敵人，而是潛意識渴望被你看見與釋放的深切呼喚。',
    oracleName: '第四宿 · 深海巨浪籤',
    energyVibe: '情感共鳴 · 湧動宣洩',
    auspicious: '允許自己盡情宣洩眼淚、親近大自然水體、多補充純淨溫水',
    taboo: '強行壓抑委屈、將憤懣轉嫁於身邊親密伴侶',
    nightGuidance: '夢見大水漫延或游於深海，是深層交感神經代謝壓力的正常排毒歷程。',
    recommendedItemName: '加州白鼠尾草空間煙燻淨化杖',
    recommendedItemId: 'prod_sage_cleansing_bundle',
    keywords: ['海', '水', '浪', '沉', '游', '溺', '雨', '淚', '湖', '河', '淹', '濕'],
  },
  {
    deg: 120,
    label: '古樹之根',
    symbol: '🌳',
    element: '土象·基石',
    elementColor: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/80',
    themeColor: 'emerald',
    insight: '向下扎根才能向上生長，在混亂外界中找回平靜穩固的核心基石。',
    oracleName: '第五宿 · 古樹之根籤',
    energyVibe: '厚德載物 · 穩固接地',
    auspicious: '赤腳接觸泥土草地、收拾居室書桌、落實手頭未完瑣事',
    taboo: '心浮氣躁急於求成、隨外界雜音搖擺不定',
    nightGuidance: '夢見山林沃土或繁茂大樹，象徵精神生命力頑強，內在根基深厚無虞。',
    recommendedItemName: '秘魯特選野生老料聖木淨化條',
    recommendedItemId: 'prod_palo_santo_sticks',
    keywords: ['樹', '木', '根', '林', '草', '山', '地', '泥', '花', '土', '園', '葉'],
  },
  {
    deg: 150,
    label: '神秘鑰匙',
    symbol: '🗝️',
    element: '心智·解鎖',
    elementColor: 'bg-amber-50/80 text-amber-800 border-amber-200/80',
    themeColor: 'amber',
    insight: '心中封鎖已久的答案，其實開啟心鎖的鑰匙早已緊握在你手中。',
    oracleName: '第六宿 · 神秘鑰匙籤',
    energyVibe: '心結釋懷 · 真相大白',
    auspicious: '重啟擱置已久的學習、坦誠表達內心真實想法、勇敢解鎖新領域',
    taboo: '逃避關鍵溝通、自欺欺人假裝無事發生',
    nightGuidance: '夢見解鎖開箱或跨入新房間，代表心靈已做好準備邁向人生下一維度。',
    recommendedItemName: '有機晚安洋甘菊纈草草本舒緩茶',
    recommendedItemId: 'prod_herbal_sleep_tea',
    keywords: ['鑰', '匙', '鎖', '門', '盒', '箱', '密', '開', '尋', '解', '室', '找'],
  },
  {
    deg: 180,
    label: '天穹之眼',
    symbol: '👁️',
    element: '靈性·洞察',
    elementColor: 'bg-purple-50/80 text-purple-800 border-purple-200/80',
    themeColor: 'purple',
    insight: '超越表面的短暫幻象，以更高的全知視角俯瞰人生的重大轉折。',
    oracleName: '第七宿 · 天穹之眼籤',
    energyVibe: '宏觀俯瞰 · 超然覺知',
    auspicious: '抽離情緒以第三人稱觀察衝突、靜心冥想 15 分鐘、登高望遠',
    taboo: '鑽牛角尖於細枝末節、執著於口舌是非之爭',
    nightGuidance: '夢見高空俯瞰全景或以旁觀者視角看自己，是超個人智慧覺醒的極佳徵兆。',
    recommendedItemName: '天然烏拉圭紫水晶原礦小晶簇',
    recommendedItemId: 'prod_amethyst_cluster',
    keywords: ['眼', '看', '見', '望', '天', '觀', '空', '飛', '鏡', '照', '視'],
  },
  {
    deg: 210,
    label: '初生朝陽',
    symbol: '🌅',
    element: '火象·新生',
    elementColor: 'bg-rose-50/80 text-rose-800 border-rose-200/80',
    themeColor: 'rose',
    insight: '漫長的黑夜終將褪去，全新的契機與生命力正破曉噴薄而出。',
    oracleName: '第八宿 · 初生朝陽籤',
    energyVibe: '破曉初升 · 欣欣向榮',
    auspicious: '清晨早起沐浴日光、給自己立下嶄新小目標、展開新計劃',
    taboo: '沉溺於過往遺憾悔恨、過度拖延錯失轉型良機',
    nightGuidance: '夢見晨曦初露、金色陽光或破曉之景，象徵內在自癒力全面重燃，走出低谷。',
    recommendedItemName: '廣東精選碌柚葉好運香水噴霧',
    recommendedItemId: 'prod_pomelo_spray',
    keywords: ['日', '陽', '早', '光', '晨', '東', '紅', '火', '暖', '醒', '升', '新'],
  },
  {
    deg: 240,
    label: '白鶴翩躚',
    symbol: '🕊️',
    element: '風象·超脫',
    elementColor: 'bg-cyan-50/80 text-cyan-800 border-cyan-200/80',
    themeColor: 'cyan',
    insight: '放下多餘的心靈負累，如白鶴凌空般輕盈超脫，自由翱翔於天際。',
    oracleName: '第九宿 · 白鶴翩躚籤',
    energyVibe: '身心輕盈 · 靈性超脫',
    auspicious: '做深呼吸吐納放鬆、清理房間冗餘舊物、放下不屬於自己的責任',
    taboo: '與固執之人爭辯是非、將生活排滿無謂的焦慮',
    nightGuidance: '夢見如鳥兒般自在飛翔、掠過山林，是心理防衛完全鬆弛、靈魂自在的表徵。',
    recommendedItemName: '加州白鼠尾草空間煙燻淨化杖',
    recommendedItemId: 'prod_sage_cleansing_bundle',
    keywords: ['鶴', '鳥', '飛', '羽', '空', '雲', '飄', '輕', '浮', '風', '翼', '升'],
  },
  {
    deg: 270,
    label: '熾烈天火',
    symbol: '🔥',
    element: '火象·轉化',
    elementColor: 'bg-orange-50/80 text-orange-800 border-orange-200/80',
    themeColor: 'orange',
    insight: '舊有的腐朽模式正在燃燒殆盡，在烈火淬煉中迎來靈魂浴火重生。',
    oracleName: '第十宿 · 熾烈天火籤',
    energyVibe: '熱情淬煉 · 斷捨離重生',
    auspicious: '果斷割捨有害關係與壞習慣、勇敢接受挑戰、揮灑運動汗水',
    taboo: '衝動易怒爆發脾氣、對未知變化產生恐懼抗拒',
    nightGuidance: '夢見烈火焚燒但身無大礙，是榮格心理學中經典的轉化儀式（Transformation），代表心靈正在蛻變。',
    recommendedItemName: '秘魯特選野生老料聖木淨化條',
    recommendedItemId: 'prod_palo_santo_sticks',
    keywords: ['火', '熱', '燒', '炎', '光', '紅', '暖', '煙', '焦', '燈', '燃'],
  },
  {
    deg: 300,
    label: '深幽靈泉',
    symbol: '⛲',
    element: '水象·滋養',
    elementColor: 'bg-blue-50/80 text-blue-800 border-blue-200/80',
    themeColor: 'blue',
    insight: '源源不絕的內在靈感正靜靜流淌，滋養每一顆疲憊乾涸的心靈種子。',
    oracleName: '第十一宿 · 深幽靈泉籤',
    energyVibe: '源遠流長 · 潤物無聲',
    auspicious: '閱讀經典哲理書籍、給予他人善意鼓勵、多喝溫暖花草茶',
    taboo: '過度透支精神精力、忽視身體微小的疲憊信號',
    nightGuidance: '夢見清澈甘泉湧出或潺潺流水，是潛意識蓄水池重新充盈、身心回春之吉兆。',
    recommendedItemName: '有機晚安洋甘菊纈草草本舒緩茶',
    recommendedItemId: 'prod_herbal_sleep_tea',
    keywords: ['泉', '水', '井', '湧', '清', '潤', '流', '河', '池', '浸', '甘'],
  },
  {
    deg: 330,
    label: '永恆輪迴',
    symbol: '♾️',
    element: '乙太·整合',
    elementColor: 'bg-violet-50/80 text-violet-800 border-violet-200/80',
    themeColor: 'violet',
    insight: '生命的所有經歷皆為神聖閉環，接納陰影，迎來心靈的終極完整。',
    oracleName: '第十二宿 · 永恆輪迴籤',
    energyVibe: '圓滿自性 · 終極整合',
    auspicious: '感恩過去所有的順境與逆境、記錄夢境日記、擁抱真實自我',
    taboo: '執著於一時的得失成敗、自我割裂與批判',
    nightGuidance: '夢見圓環、曼陀羅或迷宮終點，象徵榮格「個體化歷程」（Individuation）邁向圓滿大成。',
    recommendedItemName: '天然烏拉圭紫水晶原礦小晶簇',
    recommendedItemId: 'prod_amethyst_cluster',
    keywords: ['環', '圓', '終', '始', '全', '結', '輪', '圈', '完', '回', '合'],
  },
];

interface CelestialRotatingAstrolabeProps {
  onSelectArchetype?: (archetype: Archetype) => void;
  className?: string;
  isPaidMember?: boolean;
  onRequirePaid?: () => void;
  hideTopBanner?: boolean; // If true, hides duplicate VIP exclusive banners
  dreams?: DreamEntry[]; // Pass user/guest dreams to map onto the 12 celestial archetypes
  onStartWithDream?: (dreamText: string) => void; // Send resonant archetype into dream workspace
  onOpenReportDetail?: (entry: DreamEntry) => void; // Open existing dream detail
  onNavigateToShop?: (productId?: string) => void; // Browse recommended remedy product in store
}

export const CelestialRotatingAstrolabe: React.FC<CelestialRotatingAstrolabeProps> = ({
  onSelectArchetype,
  className = '',
  isPaidMember = false,
  onRequirePaid,
  hideTopBanner = false,
  dreams = [],
  onStartWithDream,
  onOpenReportDetail,
  onNavigateToShop,
}) => {
  // Mode selection: 'oracle' (每日占卜求籤) | 'dreams' (客人夢境星盤共振)
  const [activeAstrolabeTab, setActiveAstrolabeTab] = useState<'oracle' | 'dreams'>('oracle');

  const [rotation, setRotation] = useState<number>(15);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [activeArchetype, setActiveArchetype] = useState<Archetype>(ARCHETYPES[0]);
  const [isAligning, setIsAligning] = useState<boolean>(false);
  const [showVipModal, setShowVipModal] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [divinedToday, setDivinedToday] = useState<boolean>(false);
  const [spinNotice, setSpinNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number>(0);
  const autoSpinAnimRef = useRef<number | null>(null);

  // Pool of dreams to match: use passed dreams, or fallback to INITIAL_DREAMS for rich display
  const allDreamsPool = useMemo(() => {
    if (dreams && dreams.length > 0) return dreams;
    return INITIAL_DREAMS;
  }, [dreams]);

  // Check today's divination state from localStorage
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dreamwisdom_daily_oracle_${todayDateStr}`);
      if (stored) {
        setDivinedToday(true);
      }
    } catch {}
  }, [todayDateStr]);

  // Map dreams to archetypes
  const archetypeDreamMap = useMemo(() => {
    const map = new Map<number, DreamEntry[]>();
    ARCHETYPES.forEach((arch) => {
      const matched = allDreamsPool.filter((d) => {
        const textToSearch = [
          d.title || '',
          d.dream_text || '',
          ...(d.tags || []),
          d.report_json?.title || '',
          d.report_json?.summary || '',
          ...(d.report_json?.symbols?.map((s) => s.symbol + ' ' + s.meaning) || []),
        ]
          .join(' ')
          .toLowerCase();

        const hasKeyword = arch.keywords.some((kw) => textToSearch.includes(kw.toLowerCase()));
        const hasLabel = textToSearch.includes(arch.label) || textToSearch.includes(arch.symbol);
        return hasKeyword || hasLabel;
      });
      map.set(arch.deg, matched);
    });
    return map;
  }, [allDreamsPool]);

  // Resonant dreams for active archetype
  const currentArchetypeDreams = useMemo(() => {
    return archetypeDreamMap.get(activeArchetype.deg) || [];
  }, [archetypeDreamMap, activeArchetype.deg]);

  // Calculate current active archetype based on rotation angle (normalized 0-360)
  const updateActiveArchetype = useCallback((deg: number) => {
    const normalized = ((deg % 360) + 360) % 360;
    // Find closest archetype (each step is 30 deg)
    const index = Math.round(normalized / 30) % 12;
    setActiveArchetype(ARCHETYPES[index]);
  }, []);

  // Continuous gentle ambient spin when auto-spinning is on and not dragging
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (isAutoSpinning && !isDragging && !isAligning) {
        setRotation((prev) => {
          const next = (prev + delta * 0.015) % 360;
          updateActiveArchetype(next);
          return next;
        });
      }
      autoSpinAnimRef.current = requestAnimationFrame(animate);
    };

    autoSpinAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (autoSpinAnimRef.current) cancelAnimationFrame(autoSpinAnimRef.current);
    };
  }, [isAutoSpinning, isDragging, isAligning, updateActiveArchetype]);

  // Pointer / Drag Calculation
  const getAngleFromEvent = (e: MouseEvent | TouchEvent): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const rad = Math.atan2(dy, dx);
    return (rad * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    lastAngleRef.current = getAngleFromEvent(e.nativeEvent);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentAngle = getAngleFromEvent(e.nativeEvent);
    const diff = currentAngle - lastAngleRef.current;
    lastAngleRef.current = currentAngle;

    setRotation((prev) => {
      const next = (prev + diff + 360) % 360;
      updateActiveArchetype(next);
      return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // 1-Click Mystical Random Spin ("撥動星盤 · 占卜/感應")
  const handleRandomSpin = () => {
    if (!isPaidMember) {
      if (onRequirePaid) {
        onRequirePaid();
      } else {
        setShowVipModal(true);
      }
      return;
    }

    if (isAligning) return;
    setIsAligning(true);
    setIsAutoSpinning(false);

    // Choose target archetype randomly
    const randomIndex = Math.floor(Math.random() * ARCHETYPES.length);
    const targetArchetype = ARCHETYPES[randomIndex];
    const targetDeg = targetArchetype.deg;

    // Spin at least 3 full revolutions + target offset
    const currentNorm = ((rotation % 360) + 360) % 360;
    const extraSpins = 360 * 3;
    const finalRot = rotation + extraSpins + (targetDeg - currentNorm);

    const startTime = performance.now();
    const duration = 2400; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Quintic ease out for majestic celestial deceleration
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = rotation + (finalRot - rotation) * ease;
      setRotation(current);
      updateActiveArchetype(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsAligning(false);
        setActiveArchetype(targetArchetype);
        setSpinNotice(`✦ 今日靈性卦象：【${targetArchetype.label}】已揭曉，請查閱下方籤文指引 ✦`);
        setTimeout(() => setSpinNotice(null), 4500);
        // Save divination for today
        try {
          localStorage.setItem(
            `dreamwisdom_daily_oracle_${todayDateStr}`,
            JSON.stringify({
              deg: targetArchetype.deg,
              label: targetArchetype.label,
              symbol: targetArchetype.symbol,
              oracleName: targetArchetype.oracleName,
              timestamp: Date.now(),
            })
          );
          setDivinedToday(true);
        } catch {}
      }
    };

    requestAnimationFrame(step);
  };

  // Copy Oracle Card text
  const handleCopyOracle = () => {
    const text = `【DreamWisdom · 每日潛意識天體籤文】\n` +
      `📅 日期：${new Date().toLocaleDateString('zh-HK')}\n` +
      `✦ 卦象宿位：${activeArchetype.symbol} ${activeArchetype.oracleName}（${activeArchetype.label}）\n` +
      `✦ 元素屬性：${activeArchetype.element}\n` +
      `✦ 今日心靈頻率：${activeArchetype.energyVibe}\n` +
      `✦ 心靈籤詩：\n「${activeArchetype.insight}」\n` +
      `✦ 今日宜：${activeArchetype.auspicious}\n` +
      `✦ 今日忌：${activeArchetype.taboo}\n` +
      `✦ 今夜入夢指引：${activeArchetype.nightGuidance}\n` +
      `✦ 對應守護草本：${activeArchetype.recommendedItemName}\n` +
      `— 來自 DreamWisdom 潛意識天體星盤`;

    try {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
    } catch {
      // fallback
    }
  };

  // Trigger dream creation with this archetype
  const handleBringToDream = (arch: Archetype) => {
    if (onStartWithDream) {
      const prompt = `【星盤原型共鳴：${arch.symbol} ${arch.label} · ${arch.element}】\n` +
        `心靈籤詩：「${arch.insight}」\n` +
        `今晚我入睡時的心靈探索主題為：`;
      onStartWithDream(prompt);
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden text-center select-none ${className}`}
      id="celestial-astrolabe-root"
    >
      {/* ============================================================ */}
      {/* 🌸 柔和自然流動背景線條與天體金絲軌道 (Ethereal Background Curves) 🌸 */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 600"
        >
          <defs>
            <linearGradient id="goldCurveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="softWaveGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="softCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#F8FAFC" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 柔和擴散同心微光圓 */}
          <circle cx="500" cy="300" r="280" fill="url(#softCenterGlow)" />

          {/* 典雅柔美流線 1: 天體黃道波浪 */}
          <path
            d="M -100 180 C 250 80, 450 320, 800 150 C 950 80, 1050 220, 1150 180"
            fill="none"
            stroke="url(#goldCurveGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* 典雅柔美流線 2: 潛意識柔光雙曲線 */}
          <path
            d="M -50 420 C 200 480, 500 240, 850 440 C 980 500, 1100 380, 1150 420"
            fill="none"
            stroke="url(#softWaveGrad)"
            strokeWidth="1.5"
          />

          {/* 典雅柔美流線 3: 細緻星雲環形光軌 */}
          <ellipse
            cx="500"
            cy="300"
            rx="460"
            ry="250"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="0.8"
            strokeOpacity="0.35"
            strokeDasharray="3 6"
          />
        </svg>

        {/* 柔和散落微星光芒裝飾 */}
        <div className="absolute top-6 left-8 text-amber-300/60 text-xs animate-pulse">✦</div>
        <div className="absolute top-16 right-12 text-indigo-300/60 text-sm animate-pulse" style={{ animationDelay: '1s' }}>✧</div>
        <div className="absolute bottom-8 left-16 text-purple-300/60 text-sm animate-pulse" style={{ animationDelay: '1.8s' }}>⋆</div>
        <div className="absolute bottom-12 right-10 text-sky-300/60 text-xs animate-pulse" style={{ animationDelay: '0.6s' }}>✦</div>
      </div>

      {/* 獨立 VIP 橫幅 (可透過 hideTopBanner 隱藏，避免重複標題) */}
      {!hideTopBanner && (
        <div className="relative z-10 mb-6 text-center max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-50/90 via-rose-50/70 to-indigo-50/90 border border-amber-200/90 text-amber-900 text-xs font-bold mb-2.5 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>👑 付費會員尊享 · 潛意識天體星盤</span>
          </div>

          <h3 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-wide flex items-center justify-center gap-2">
            <span>✦ 潛意識天體星盤 · 12 宿心靈原型 ✦</span>
          </h3>

          {/* 柔和古典線條裝飾 (Soft Filigree Divider) */}
          <div className="flex items-center justify-center gap-3 my-2 opacity-70">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-300 to-indigo-300" />
            <span className="text-[11px] text-amber-700 font-serif">✧ ☽ ✦ ☾ ✧</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-amber-300 to-indigo-300" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            按住圓盤隨意探索天體軌道；<strong className="text-indigo-700">「撥動星盤」為付費會員專屬特權</strong>，與心靈原型深度共振並汲取每日啟示。
          </p>

          <div className="mt-2.5 flex items-center justify-center">
            {isPaidMember ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>已解鎖付費特權：享有無限次撥動星盤占卜權限</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onRequirePaid) onRequirePaid();
                  else setShowVipModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50/90 hover:bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>撥動星盤為付費會員專屬特權 · 點擊解鎖升級 →</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 核心模式切換器：🔮 每日占卜求籤 VS 💭 客人夢境星盤共振 🌟 */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center mb-5 px-3">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100/90 backdrop-blur-xs border border-slate-200/90 shadow-inner gap-1.5 max-w-md w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveAstrolabeTab('oracle')}
            className={`flex-1 sm:flex-initial px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeAstrolabeTab === 'oracle'
                ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-md shadow-blue-700/25 ring-2 ring-blue-300/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span>🔮 每日潛意識占卜</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAstrolabeTab('dreams')}
            className={`flex-1 sm:flex-initial px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeAstrolabeTab === 'dreams'
                ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white shadow-md shadow-purple-700/25 ring-2 ring-purple-300/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
            <span>💭 客人夢境共振 ({allDreamsPool.length})</span>
          </button>
        </div>

        {/* 溫柔的模式說明導引線條 */}
        <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
          <span className="w-8 h-px bg-slate-300" />
          <span>{activeAstrolabeTab === 'oracle' ? '撥動抽取今日指引籤詩 · 宜忌心靈能量' : '旋轉探測客人夢境在 12 宿之能量分佈'}</span>
          <span className="w-8 h-px bg-slate-300" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 📱 重新排位架構：手機直立極致順暢 (Mobile First Adaptive Layout) */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-10 py-1">
        {/* 左側欄 (手機上方)：多層同心柔美天體儀 + 手機即時透鏡 + 快捷撥動星盤按鈕 */}
        <div className="flex flex-col items-center w-full max-w-[420px] shrink-0">
          {/* 星盤本體外層精巧邊框 (加柔和外圈飾環) */}
          <div className="relative p-2 rounded-full bg-gradient-to-br from-amber-100/40 via-white to-indigo-100/40 shadow-xl shadow-slate-200/50 border border-slate-200/80">
            {/* 圓盤觸摸與旋轉主體 (自適應縮放尺寸，手機完美容納不擠壓) */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-[270px] h-[270px] xs:w-[295px] xs:h-[295px] sm:w-[350px] sm:h-[350px] md:w-[390px] md:h-[390px] rounded-full select-none cursor-grab active:cursor-grabbing flex items-center justify-center touch-none transition-shadow"
              style={{
                background: 'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FAF5FF 45%, #F0F4FF 80%, #E2E8F0 100%)',
                boxShadow: isDragging
                  ? '0 16px 45px -8px rgba(99, 102, 241, 0.35), 0 0 0 3px rgba(129, 140, 248, 0.4)'
                  : '0 12px 32px -10px rgba(30, 41, 59, 0.15), inset 0 2px 8px rgba(255, 255, 255, 0.95)',
              }}
              title="可使用滑鼠拖曳或手指滑動旋轉星盤"
            >
              {/* ======================================================== */}
              {/* 🎨 內嵌高精緻柔和天體刻度與曼陀羅金線 (SVG Astrolabe Filigree) */}
              {/* ======================================================== */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
                viewBox="0 0 400 400"
              >
                <defs>
                  <linearGradient id="astrolabeGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#6366F1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0.35" />
                  </linearGradient>
                  <radialGradient id="innerIrisGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.15" />
                    <stop offset="70%" stopColor="#C084FC" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 曼陀羅柔光底色層 */}
                <circle cx="200" cy="200" r="185" fill="url(#innerIrisGlow)" />

                {/* 1. 最外層雙重柔美同心圓環 */}
                <circle cx="200" cy="200" r="192" fill="none" stroke="url(#astrolabeGoldRing)" strokeWidth="1" />
                <circle cx="200" cy="200" r="186" fill="none" stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="2 3" />

                {/* 2. 12 宮位放射柔光微弧線 (12 Sacred Division Rays) */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={`ray-${deg}`}
                    x1="200"
                    y1="200"
                    x2={200 + 175 * Math.cos((deg * Math.PI) / 180)}
                    y2={200 + 175 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#94A3B8"
                    strokeWidth="0.6"
                    strokeDasharray="3 4"
                    strokeOpacity="0.3"
                  />
                ))}

                {/* 3. 中環 8 瓣神聖幾何蓮花弧線 (8-Petal Sacred Serenity Rosette) */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <g key={`petal-${deg}`} transform={`rotate(${deg} 200 200)`}>
                    <path
                      d="M 200 135 C 220 155, 220 185, 200 200 C 180 185, 180 155, 200 135 Z"
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="0.75"
                      strokeOpacity="0.25"
                    />
                  </g>
                ))}

                {/* 4. 內層金絲月相微圖騰標記 (4 Moon Phase Micro Ornaments) */}
                {/* 0° (右側滿月) */}
                <circle cx="340" cy="200" r="3.5" fill="#F59E0B" fillOpacity="0.5" stroke="#D97706" strokeWidth="0.5" />
                {/* 90° (下側下弦月) */}
                <path d="M 200 336 A 4 4 0 0 1 200 344 Z" fill="#6366F1" fillOpacity="0.5" />
                {/* 180° (左側新月) */}
                <circle cx="60" cy="200" r="3.5" fill="none" stroke="#64748B" strokeWidth="1" strokeOpacity="0.6" />
                {/* 270° (上側上弦月) */}
                <path d="M 200 56 A 4 4 0 0 0 200 64 Z" fill="#A855F7" fillOpacity="0.5" />

                {/* 5. 核心同心引力微圓線 */}
                <circle cx="200" cy="200" r="85" fill="none" stroke="#A78BFA" strokeWidth="0.75" strokeDasharray="4 4" strokeOpacity="0.4" />
                <circle cx="200" cy="200" r="60" fill="none" stroke="#CBD5E1" strokeWidth="0.6" strokeOpacity="0.5" />
              </svg>

              {/* 外軌道 A: 跟隨旋轉的 12 原型節點環 */}
              <div
                className="absolute inset-2 sm:inset-3 rounded-full pointer-events-none transition-transform"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.1s linear',
                }}
              >
                {ARCHETYPES.map((arch, idx) => {
                  const rad = (arch.deg * Math.PI) / 180;
                  const r = 41; // percent radius from center
                  const left = 50 + r * Math.cos(rad);
                  const top = 50 + r * Math.sin(rad);
                  const isSelected = activeArchetype.deg === arch.deg;
                  const resonantDreamsCount = (archetypeDreamMap.get(arch.deg) || []).length;

                  return (
                    <div
                      key={idx}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-gradient-to-tr from-indigo-700 to-blue-600 text-white shadow-lg shadow-indigo-700/40 ring-4 ring-indigo-300/80 scale-110 z-20'
                          : 'w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-white/95 border border-slate-200/90 text-slate-700 shadow-2xs hover:border-indigo-400 z-10'
                      }`}
                      style={{ left: `${left}%`, top: `${top}%` }}
                    >
                      <span className="text-sm xs:text-base select-none leading-none">{arch.symbol}</span>

                      {/* 夢境模式下顯示共振數 */}
                      {activeAstrolabeTab === 'dreams' && resonantDreamsCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-purple-600 text-white text-[8px] xs:text-[9px] font-black font-mono shadow-xs border border-white leading-tight">
                          {resonantDreamsCount}
                        </span>
                      )}

                      {/* 占卜模式下已抽籤的光暈 */}
                      {activeAstrolabeTab === 'oracle' && isSelected && divinedToday && (
                        <span className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-ping opacity-60 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 中軌道 B: 雙向反轉柔光軌道 */}
              <div
                className="absolute w-[62%] h-[62%] rounded-full border border-dashed border-indigo-400/50 pointer-events-none"
                style={{
                  transform: `rotate(${-rotation * 0.75}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.1s linear',
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500 border border-white shadow-xs" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 border border-white shadow-xs" />
              </div>

              {/* 中央天體水晶靈球 (Central Crystal Core) */}
              <div
                className="relative w-20 h-20 xs:w-22 xs:h-22 sm:w-26 sm:h-26 rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #E0E7FF 25%, #4338CA 75%, #1E1B4B 100%)',
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.35), inset -4px -6px 12px rgba(0, 0, 0, 0.45)',
                }}
              >
                {/* 靈球中央柔光圖騰 */}
                <div className="text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.9)]">
                  <svg width="34" height="22" viewBox="0 0 40 26" fill="none" className="shrink-0">
                    <path d="M 6 12 Q 20 22 34 12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="12" y1="15" x2="10" y2="20" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="17" y1="17" x2="16.5" y2="22" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="23" y1="17" x2="23.5" y2="22" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="28" y1="15" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[9px] xs:text-[10px] font-mono text-cyan-200 font-bold tracking-widest mt-0.5">
                  {Math.round(((rotation % 360) + 360) % 360)}°
                </span>
              </div>

              {/* 頂部固定對齊指針 (精美水滴箭頭) */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-indigo-700 drop-shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-indigo-700 -mt-1 shadow-xs" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 📱 電話優化核心：即時對齊透鏡 (Mobile Instant Resonance Lens) */}
          {/* ======================================================== */}
          <div className="w-full mt-3 px-1">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-white border border-indigo-200/80 shadow-xs flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-white border border-indigo-200 shadow-2xs flex items-center justify-center text-xl shrink-0">
                  {activeArchetype.symbol}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-900 truncate">
                      【{activeArchetype.label}】
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold border ${activeArchetype.elementColor}`}>
                      {activeArchetype.element}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-700 font-semibold block truncate">
                    ✦ {activeArchetype.energyVibe} ✦
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-500 block">
                  天軌 {Math.round(((rotation % 360) + 360) % 360)}°
                </span>
                {activeAstrolabeTab === 'dreams' && (
                  <span className="text-[10px] font-bold text-purple-700 block">
                    共鳴 {currentArchetypeDreams.length} 場夢
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 📱 電話優化核心：立即操作主按鈕 (Instant Spin CTA right here) */}
          {/* ======================================================== */}
          <div className="w-full mt-2.5 px-1 space-y-2">
            {isPaidMember ? (
              <button
                type="button"
                onClick={handleRandomSpin}
                disabled={isAligning}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 hover:from-indigo-800 hover:to-blue-800 active:scale-98 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-700/25 transition-all cursor-pointer disabled:opacity-60"
              >
                <RotateCw className={`w-4 h-4 ${isAligning ? 'animate-spin' : ''}`} />
                <span>{isAligning ? '天體漫遊感應占卜中...' : '✦ 撥動星盤 · 抽取今日靈性卦象籤文'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRandomSpin}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer group"
              >
                <Crown className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
                <span>👑 付費會員專屬 · 按此撥動星盤每日占卜</span>
              </button>
            )}

            {/* 卦象出籤即時回饋提示（留在當前頁面，絕不自動跳轉） */}
            {spinNotice && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-indigo-50/90 to-purple-50/90 border border-amber-300/80 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 animate-fade-in shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{spinNotice}</span>
              </div>
            )}

            {/* 圓盤旋轉速度控制與狀態說明 */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 pt-0.5">
              <button
                type="button"
                onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                className="hover:text-indigo-700 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>{isAutoSpinning ? '⏸ 暫停自動漫遊' : '▶ 恢復自動漫遊'}</span>
              </button>
              <span className="text-[10px] text-slate-400">
                可隨時按住圓盤拖曳旋轉
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 右側欄 (手機緊隨其後)：詳細啟示牌卡 (每日占卜 VS 客人夢境) */}
        {/* ============================================================ */}
        <div className="w-full lg:w-[480px] flex flex-col space-y-4 text-left">
          {/* TAB 1: 🔮 每日潛意識占卜專屬牌卡 */}
          {activeAstrolabeTab === 'oracle' && (
            <div className="p-4 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xs border-2 border-indigo-200/90 shadow-lg shadow-indigo-100/40 relative overflow-hidden space-y-4">
              {/* 卡片頂部水墨光紋 (Card Header Ambient Bar) */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-2xl bg-indigo-50 border border-indigo-200/80 shadow-2xs shrink-0">
                    {activeArchetype.symbol}
                  </span>
                  <div>
                    <span className="text-[10px] font-black tracking-wider text-indigo-700 uppercase block">
                      {activeArchetype.oracleName}
                    </span>
                    <h4 className="font-celestial-serif font-black text-lg sm:text-xl text-slate-900 leading-tight">
                      {activeArchetype.label}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold border ${activeArchetype.elementColor}`}>
                    {activeArchetype.element}
                  </span>
                </div>
              </div>

              {/* 今日能量與頻率 */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-white border border-indigo-200/70 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  今日心靈頻率：
                </span>
                <span className="text-xs font-black text-indigo-950 bg-white/95 px-3 py-1 rounded-xl border border-indigo-200 shadow-2xs">
                  ✦ {activeArchetype.energyVibe} ✦
                </span>
              </div>

              {/* 籤詩啟示 (以柔美襯線字型與溫潤排版呈現) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    今日心靈籤詩
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium">榮格原型潛意識鏡像</span>
                </div>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 border border-slate-200/80">
                  <span className="absolute top-2 left-3 text-3xl font-serif text-indigo-300/40 pointer-events-none select-none">“</span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed pl-3 relative z-10 font-celestial-serif">
                    {activeArchetype.insight}
                  </p>
                  <span className="absolute bottom-1 right-3 text-3xl font-serif text-indigo-300/40 pointer-events-none select-none leading-none">”</span>
                </div>
              </div>

              {/* 今日行事宜忌 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-1">
                  <div className="font-black text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                    <span>今日宜（順應天時）：</span>
                  </div>
                  <p className="text-emerald-950 font-medium text-[11px] leading-relaxed">
                    {activeArchetype.auspicious}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/90 space-y-1">
                  <div className="font-black text-rose-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-xs" />
                    <span>今日忌（防範消耗）：</span>
                  </div>
                  <p className="text-rose-950 font-medium text-[11px] leading-relaxed">
                    {activeArchetype.taboo}
                  </p>
                </div>
              </div>

              {/* 今夜入夢預警與轉化 */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Moon className="w-3.5 h-3.5 text-amber-700" />
                  <span>今夜入夢預警與解法：</span>
                </div>
                <p className="text-[11px] text-amber-950/90 leading-relaxed font-medium">
                  {activeArchetype.nightGuidance}
                </p>
              </div>

              {/* 今日守護草本與水晶推薦 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 font-bold block">🌿 今日對應守護療癒選品</span>
                  <strong className="text-slate-900 font-bold truncate block">{activeArchetype.recommendedItemName}</strong>
                </div>
                {onNavigateToShop && (
                  <button
                    type="button"
                    onClick={() => onNavigateToShop(activeArchetype.recommendedItemId)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs hover:scale-102 transition-transform"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>解夢選物店</span>
                  </button>
                )}
              </div>

              {/* 互動操作按鈕群 */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyOracle}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                >
                  {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToast ? '已複製籤文！' : '複製籤文'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBringToDream(activeArchetype)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-indigo-200 shadow-2xs"
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>帶入夢境解析 →</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 💭 客人夢境天體共振專屬面板 */}
          {activeAstrolabeTab === 'dreams' && (
            <div className="p-4 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xs border-2 border-purple-200/90 shadow-lg shadow-purple-100/40 relative overflow-hidden space-y-4">
              {/* 原型宿位標題 */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-2xl bg-purple-50 border border-purple-200 shadow-2xs shrink-0">
                    {activeArchetype.symbol}
                  </span>
                  <div>
                    <span className="text-[10px] font-black tracking-wider text-purple-700 uppercase block">
                      天體宿位夢境共振
                    </span>
                    <h4 className="font-celestial-serif font-black text-lg sm:text-xl text-slate-900 leading-tight">
                      {activeArchetype.label}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-black text-xs border border-purple-300/80 shadow-2xs">
                    共鳴夢境：{currentArchetypeDreams.length} 場
                  </span>
                </div>
              </div>

              {/* 宿象象徵與涵意 */}
              <div className="relative p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/90 leading-relaxed font-medium">
                <span className="text-[10px] font-bold text-purple-800 block mb-1">✦ 潛意識宿位象徵：</span>
                <p className="text-xs sm:text-sm text-slate-800 font-celestial-serif">
                  {activeArchetype.insight}
                </p>
              </div>

              {/* 客人關聯夢境列表 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <span>💭 與【{activeArchetype.label}】共鳴的夢境列表：</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {currentArchetypeDreams.length > 0 ? '點擊查看深度報告' : '暫無歷史共振'}
                  </span>
                </div>

                {currentArchetypeDreams.length === 0 ? (
                  <div className="p-5 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      你目前記錄的夢境庫中，尚未有與【{activeArchetype.label}】強烈共鳴之紀錄。
                    </p>
                    <p className="text-[11px] text-purple-700 font-bold">
                      💡 今早醒來若有相關夢境，可點擊下方直接帶著此宿原型去記錄！
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {currentArchetypeDreams.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => onOpenReportDetail && onOpenReportDetail(entry)}
                        className="p-3 rounded-2xl bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-purple-700">
                            {entry.title || '無題夢境'}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {new Date(entry.created_at).toLocaleDateString('zh-HK')}
                            </span>
                            {entry.report_json?.dnaContribution?.dominantEmotion && (
                              <span className="px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-800 font-bold border border-purple-200/60">
                                {entry.report_json.dnaContribution.dominantEmotion}
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 聯動解夢功能：將此宿原型帶入新夢境 */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => handleBringToDream(activeArchetype)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-700/25 cursor-pointer transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>✦ 將【{activeArchetype.label}】帶入新夢境探索</span>
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  一鍵自動將此宿天體原型帶入解夢對話框，獲得專屬榮格心靈層面解析。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 付費會員專屬特權引導 Modal */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-200 text-left">
            <button
              type="button"
              onClick={() => setShowVipModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>付費會員尊享特權</span>
            </div>

            <h3 className="font-celestial-serif font-black text-xl text-slate-900 mb-2">
              ✦ 撥動潛意識星盤特權 ✦
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              天體星盤每日靈性占卜與夢境天體共振功能為 <strong>DreamWisdom 付費會員</strong> 專屬尊享特權。升級後即可立即解鎖：
            </p>

            <div className="space-y-2.5 mb-6 text-xs text-slate-700">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>無限次撥動天體星盤</strong>：抽取今日心靈籤詩、行事宜忌與守護物。</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <Compass className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>星象原型自動入夢</strong>：一鍵帶入解夢對話，獲取專屬榮格深度解析。</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span><strong>全套夢境星盤連動</strong>：客人的歷史夢境自動入軌歸納，辨識核心潛意識軌道。</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowVipModal(false);
                  if (onRequirePaid) {
                    onRequirePaid();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>前往升級付費會員（新張特惠 HK$89/月 起）</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowVipModal(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer text-center"
              >
                稍後再說
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
