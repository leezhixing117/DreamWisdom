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
    elementColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
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
    elementColor: 'bg-sky-50 text-sky-700 border-sky-200',
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
    elementColor: 'bg-teal-50 text-teal-700 border-teal-200',
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
    elementColor: 'bg-blue-50 text-blue-700 border-blue-200',
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
    elementColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
    elementColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
    elementColor: 'bg-purple-50 text-purple-700 border-purple-200',
    themeColor: 'purple',
    insight: '超越表面的短暫幻象，以更高的全知視角俯瞰人生的重大轉折。',
    oracleName: '第七宿 · 天穹之眼籤',
    energyVibe: '宏觀俯瞰 · 超然覺知',
    auspicious: '抽離情緒以第三人稱觀察衝突、靜心冥想 15 分鐘、登高望遠',
    taboo: '鑽牛角尖於細枝末節、執著於口舌是非之爭',
    nightGuidance: '夢見高空俯瞰全景或以旁觀者視角看自己，是超個人智慧覺醒的極佳徵兆。',
    recommendedItemName: '天然烏拉圭紫水晶原礦小晶簇',
    recommendedItemId: 'prod_amethyst_cluster',
    keywords: ['眼', '看', '見', '望', '視', '鏡', '高', '鳥瞰', '天', '遠', '亮', '神'],
  },
  {
    deg: 210,
    label: '飛翔之翼',
    symbol: '🕊️',
    element: '火象·解脫',
    elementColor: 'bg-rose-50 text-rose-700 border-rose-200',
    themeColor: 'rose',
    insight: '渴望掙脫常規與教條束縛，潛意識正邀請你勇敢展翅體驗真實自由。',
    oracleName: '第八宿 · 飛翔之翼籤',
    energyVibe: '掙脫束縛 · 勇氣破局',
    auspicious: '嘗試一個微型冒險決策、打破慣性常規、向目標邁出第一步',
    taboo: '因循苟且自設限制、為迎合他人期待而犧牲自我',
    nightGuidance: '飛行之夢是最純粹的生命力釋放，預示日間即將迎來重大創造力破局。',
    recommendedItemName: '廣東精選碌柚葉好運香水噴霧',
    recommendedItemId: 'prod_pomelo_spray',
    keywords: ['飛', '翔', '翼', '鳥', '跳', '升', '浮', '追', '風', '跑', '快', '天'],
  },
  {
    deg: 240,
    label: '記憶迴廊',
    symbol: '🏛️',
    element: '時空·回溯',
    elementColor: 'bg-slate-100 text-slate-800 border-slate-300',
    themeColor: 'slate',
    insight: '遇見舊人舊事，是為了與過去那個未被及時撫慰的自己達成和解。',
    oracleName: '第九宿 · 記憶迴廊籤',
    energyVibe: '童年撫慰 · 過去和解',
    auspicious: '翻看童年舊照片、聯絡久違故人、對曾經跌倒的自己說聲謝謝',
    taboo: '陷入沉溺悔恨、用過往遺憾懲罰當下的自己',
    nightGuidance: '夢回昔日母校或老屋邨，非運氣倒退，而是深層心靈在修復昔日創傷碎片。',
    recommendedItemName: '深眠白噪音薰衣草舒緩枕頭噴霧',
    recommendedItemId: 'prod_lavender_pillow_mist',
    keywords: ['校', '舊', '老', '童', '小時候', '屋', '家', '過', '同學', '友', '樓', '室'],
  },
  {
    deg: 270,
    label: '水晶明鏡',
    symbol: '🪞',
    element: '陰影·映照',
    elementColor: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    themeColor: 'fuchsia',
    insight: '夢中的他人皆是自我的投影；勇敢凝視它，方能整合破碎的自我。',
    oracleName: '第十宿 · 水晶明鏡籤',
    energyVibe: '陰影整合 · 映照真我',
    auspicious: '接納自己的不完美與嫉妒心、誠實寫下真實慾望、對鏡微笑肯定自己',
    taboo: '戴著完美面具壓抑真實性格、過度苛責身邊親近之人的過失',
    nightGuidance: '夢中可怕之面孔或怪異分身，實為未被承認的內在力量，凝視它將化為護盾。',
    recommendedItemName: '加州白鼠尾草空間煙燻淨化杖',
    recommendedItemId: 'prod_sage_cleansing_bundle',
    keywords: ['鏡', '像', '影', '面', '容', '貌', '鬼', '黑', '怪', '人', '他人', '照'],
  },
  {
    deg: 300,
    label: '迷宮引路',
    symbol: '🧭',
    element: '探索·方向',
    elementColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    themeColor: 'cyan',
    insight: '一時的迷茫只是尋路的必經過程，每一個轉彎都在為你沉澱大智慧。',
    oracleName: '第十一宿 · 迷宮引路籤',
    energyVibe: '曲徑通幽 · 耐心尋路',
    auspicious: '規劃清晰的下一步關鍵行動、出外散步放鬆視界、耐心分段執行目標',
    taboo: '因焦慮而慌亂折返、因急於看見成果而輕言放棄',
    nightGuidance: '迷宮的盡頭往往是豁然開朗的平原，夢境指引你信任當下正在發生的安排。',
    recommendedItemName: '有機晚安洋甘菊纈草草本舒緩茶',
    recommendedItemId: 'prod_herbal_sleep_tea',
    keywords: ['迷', '路', '道', '轉', '折', '巷', '圖', '標', '走', '牆', '繞', '困'],
  },
  {
    deg: 330,
    label: '拂曉晨光',
    symbol: '☀️',
    element: '轉化·新生',
    elementColor: 'bg-amber-50 text-amber-700 border-amber-200',
    themeColor: 'amber',
    insight: '最深沉的漫長黑夜之後必有晨曦，一個充滿希望的全新轉機正在孕育。',
    oracleName: '第十二宿 · 拂曉晨光籤',
    energyVibe: '黑夜破曉 · 萬象新生',
    auspicious: '沐浴清晨第一道陽光、啟動全新目標項目、向生活傳遞感恩心念',
    taboo: '抱殘守缺抗拒改變、拖延怠惰消磨晨間大好時光',
    nightGuidance: '晨光朝陽之夢預示心靈陰霾徹底消散，事業與生活好運勢如破竹。',
    recommendedItemName: '廣東精選碌柚葉好運香水噴霧',
    recommendedItemId: 'prod_pomelo_spray',
    keywords: ['日', '陽', '晨', '光', '火', '金', '生', '新', '出', '醒', '升', '紅'],
  },
];

interface CelestialRotatingAstrolabeProps {
  onSelectArchetype?: (archetype: Archetype) => void;
  className?: string;
  isPaidMember?: boolean;
  onRequirePaid?: () => void;
  hideTopBanner?: boolean; // 徹底消除上層頁面與星盤內部重覆標題
  dreams?: DreamEntry[]; // 客人已記錄的夢境
  onStartWithDream?: (dreamText: string) => void; // 將星盤原型帶入解夢
  onOpenReportDetail?: (entry: DreamEntry) => void; // 打開夢境詳細報告
  onNavigateToShop?: (productId?: string) => void; // 查看對應守護物
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
        setDivinedToday(true);
        try {
          localStorage.setItem(
            `dreamwisdom_daily_oracle_${todayDateStr}`,
            JSON.stringify({
              archetype: targetArchetype,
              timestamp: new Date().toISOString(),
            })
          );
        } catch {}
        if (onSelectArchetype) onSelectArchetype(targetArchetype);
      }
    };

    requestAnimationFrame(step);
  };

  // Copy divination oracle text to clipboard
  const handleCopyOracle = () => {
    const text = `【DreamWisdom 每日潛意識占卜靈籤】\n宿位：${activeArchetype.oracleName}\n象徵：${activeArchetype.symbol} ${activeArchetype.label} (${activeArchetype.element})\n今日心靈頻率：${activeArchetype.energyVibe}\n籤詩啟示：${activeArchetype.insight}\n🟢 今日宜：${activeArchetype.auspicious}\n🔴 今日忌：${activeArchetype.taboo}\n🌙 今夜入夢指引：${activeArchetype.nightGuidance}\n🌿 今日守護選品：${activeArchetype.recommendedItemName}`;
    try {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      alert('已複製卦象籤文至剪貼簿！');
    }
  };

  // Directly carry archetype into new dream recording
  const handleBringToDream = (arch: Archetype) => {
    const promptText = `【星盤感應原型：${arch.symbol} ${arch.label}】（${arch.insight}）\n請針對我今日感應之天體宿象，進行深層潛意識解析：`;
    if (onStartWithDream) {
      onStartWithDream(promptText);
    } else if (onSelectArchetype) {
      onSelectArchetype(arch);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col items-center ${className}`} id="celestial-astrolabe-widget">
      {/* 徹底消除重覆：若 hideTopBanner 為 false，才顯示自帶標頭 */}
      {!hideTopBanner && (
        <div className="text-center mb-6 max-w-2xl px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200/80 text-amber-900 text-xs font-bold mb-2.5 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>👑 付費會員尊享專區 · ORACLE ASTROLABE</span>
          </div>
          <h3 className="font-celestial-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-wide flex items-center justify-center gap-2">
            <span>✦ 潛意識天體星盤 · 12 宿心靈原型 ✦</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            按住圓盤隨意探索天體軌道；<strong className="text-blue-700">「撥動星盤」為付費會員專屬特權</strong>，與心靈原型深度共振。
          </p>

          <div className="mt-2.5 flex items-center justify-center">
            {isPaidMember ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>已解鎖付費特權：您享有無限次撥動星盤感應權限</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onRequirePaid) onRequirePaid();
                  else setShowVipModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
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
      <div className="w-full flex items-center justify-center mb-6 px-4">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border-2 border-slate-200/90 shadow-inner gap-2 max-w-md w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveAstrolabeTab('oracle')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeAstrolabeTab === 'oracle'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-700/25 ring-2 ring-blue-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🔮 每日潛意識占卜</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAstrolabeTab('dreams')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeAstrolabeTab === 'dreams'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-700/25 ring-2 ring-purple-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>💭 客人夢境天體共振 ({allDreamsPool.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 核心天體轉動圖案區域 (Multi-Ring Interactive Astrolabe) */}
      {/* ============================================================ */}
      <div className="relative w-full flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
        {/* 左側 / 中央：多層立體同心轉盤 */}
        <div className="flex flex-col items-center">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] rounded-full select-none cursor-grab active:cursor-grabbing flex items-center justify-center touch-none transition-shadow"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F8FAFC 60%, #F1F5F9 100%)',
              boxShadow: isDragging
                ? '0 20px 50px -10px rgba(29, 78, 216, 0.25), 0 0 0 3px rgba(37, 99, 235, 0.3)'
                : '0 16px 40px -12px rgba(15, 23, 42, 0.12), inset 0 2px 6px rgba(255, 255, 255, 0.9)',
            }}
            title="可使用滑鼠拖曳或手指滑動旋轉星盤"
          >
            {/* 最外層環：微星點幾何刻度底網 (Oracle Background Grid) */}
            <div
              className="absolute inset-2 rounded-full border border-slate-200 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #CBD5E1 0.8px, transparent 1.2px)',
                backgroundSize: '24px 24px',
                opacity: 0.6,
              }}
            />

            {/* 外軌道 A: 順時針緩轉 + 12 原型符號與字樣 (跟隨用戶旋轉) */}
            <div
              className="absolute inset-4 rounded-full border border-slate-300 pointer-events-none transition-transform"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.1s linear',
              }}
            >
              {/* 12 個天體原型節點 */}
              {ARCHETYPES.map((arch, idx) => {
                const rad = (arch.deg * Math.PI) / 180;
                const r = 42; // percent radius from center
                const left = 50 + r * Math.cos(rad);
                const top = 50 + r * Math.sin(rad);
                const isSelected = activeArchetype.deg === arch.deg;
                const resonantDreamsCount = (archetypeDreamMap.get(arch.deg) || []).length;

                return (
                  <div
                    key={idx}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'w-11 h-11 sm:w-12 sm:h-12 bg-blue-700 text-white shadow-lg shadow-blue-700/40 ring-4 ring-blue-300 scale-110 z-20'
                        : 'w-8 h-8 sm:w-9 sm:h-9 bg-white border-2 border-slate-200 text-slate-700 shadow-2xs hover:border-blue-400 z-10'
                    }`}
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <span className="text-base select-none">{arch.symbol}</span>

                    {/* 在「夢境模式」下：顯示該宿共振的客人夢境數量 */}
                    {activeAstrolabeTab === 'dreams' && resonantDreamsCount > 0 && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[9px] font-black font-mono shadow-xs border border-white">
                        {resonantDreamsCount}
                      </span>
                    )}

                    {/* 在「占卜模式」下：若為今日已抽籤卦象，顯示金色光環 */}
                    {activeAstrolabeTab === 'oracle' && isSelected && divinedToday && (
                      <span className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-ping opacity-60 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 中軌道 B: 虛線反向轉動軌道 */}
            <div
              className="absolute w-[68%] h-[68%] rounded-full border border-dashed border-blue-400/60 pointer-events-none"
              style={{
                transform: `rotate(${-rotation * 0.75}deg)`,
                transition: isDragging ? 'none' : 'transform 0.1s linear',
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-500 border border-white shadow-sm" />
            </div>

            {/* 內軌道 C: 細緻度數同心環 */}
            <div
              className="absolute w-[48%] h-[48%] rounded-full border border-slate-300/80 pointer-events-none"
              style={{
                transform: `rotate(${rotation * 1.5}deg)`,
                transition: isDragging ? 'none' : 'transform 0.1s linear',
              }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute top-0 left-1/2 w-0.5 h-2 bg-slate-400 -translate-x-1/2 origin-[50%_96px] sm:origin-[50%_115px]"
                  style={{ transform: `rotate(${deg}deg)` }}
                />
              ))}
            </div>

            {/* 中央核心天體靈球 */}
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #E0F2FE 30%, #1D4ED8 80%, #0F172A 100%)',
                boxShadow: '0 0 35px rgba(29, 78, 216, 0.4), inset -6px -8px 16px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
                <svg width="40" height="26" viewBox="0 0 40 26" fill="none" className="shrink-0">
                  <path d="M 6 12 Q 20 22 34 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="12" y1="15" x2="10" y2="21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17" y1="17" x2="16.5" y2="23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <line x1="23" y1="17" x2="23.5" y2="23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <line x1="28" y1="15" x2="30" y2="21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-cyan-200 font-bold tracking-widest mt-1">
                {Math.round(((rotation % 360) + 360) % 360)}°
              </span>
            </div>

            {/* 頂部固定對齊指針 */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-blue-700 drop-shadow-sm" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-700 -mt-1" />
            </div>
          </div>

          {/* 圓盤旋轉控制器與座標 */}
          <div className="flex items-center justify-between gap-4 text-xs text-slate-500 w-full max-w-[340px] mt-4 px-2">
            <button
              type="button"
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <span>{isAutoSpinning ? '⏸ 暫停自動漫遊' : '▶ 恢復自動漫遊'}</span>
            </button>
            <span className="font-mono text-slate-700 font-bold">
              感應軌道：{Math.round(((rotation % 360) + 360) % 360)}°
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 右側：功能展示面板 (每日占卜 VS 客人夢境) */}
        {/* ============================================================ */}
        <div className="w-full lg:w-[460px] flex flex-col space-y-4 text-left">
          {/* TAB 1: 🔮 每日潛意識占卜專屬牌卡 */}
          {activeAstrolabeTab === 'oracle' && (
            <div className="card p-5 sm:p-6 rounded-3xl bg-white border-2 border-blue-200/90 shadow-md relative overflow-hidden space-y-4">
              {/* 頂部卦象標籤 */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-2 rounded-2xl bg-blue-50 border border-blue-200 shadow-2xs">
                    {activeArchetype.symbol}
                  </span>
                  <div>
                    <span className="text-[11px] font-black tracking-wider text-blue-700 uppercase block">
                      {activeArchetype.oracleName}
                    </span>
                    <h4 className="font-celestial-serif font-black text-xl text-slate-900 leading-tight">
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
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-200 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  今日心靈頻率：
                </span>
                <span className="text-xs sm:text-sm font-black text-blue-900 bg-white/90 px-3 py-1 rounded-xl border border-blue-300 shadow-2xs">
                  ✦ {activeArchetype.energyVibe} ✦
                </span>
              </div>

              {/* 籤詩啟示 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  今日心靈籤詩
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
                  「{activeArchetype.insight}」
                </p>
              </div>

              {/* 今日行事宜忌 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-black text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>今日宜（順應天時）：</span>
                  </div>
                  <p className="text-emerald-950 font-medium text-[11px] leading-relaxed">
                    {activeArchetype.auspicious}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="font-black text-rose-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>今日忌（防範消耗）：</span>
                  </div>
                  <p className="text-rose-950 font-medium text-[11px] leading-relaxed">
                    {activeArchetype.taboo}
                  </p>
                </div>
              </div>

              {/* 今夜入夢預警與轉化 */}
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-900">
                  <span>🌙 今夜入夢預警與解法：</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
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
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    <span>選物店</span>
                  </button>
                )}
              </div>

              {/* 互動操作按鈕群 */}
              <div className="pt-2 space-y-2">
                {isPaidMember ? (
                  <button
                    type="button"
                    onClick={handleRandomSpin}
                    disabled={isAligning}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-800 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-700/25 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RotateCw className={`w-4 h-4 ${isAligning ? 'animate-spin' : ''}`} />
                    <span>{isAligning ? '星象旋轉感應占卜中...' : '✦ 撥動星盤 · 抽取今日靈性卦象籤文'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRandomSpin}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer group"
                  >
                    <Crown className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
                    <span>👑 付費會員專屬 · 按此撥動星盤每日占卜</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyOracle}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                  >
                    {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToast ? '已複製占卜籤文！' : '複製今日籤文'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBringToDream(activeArchetype)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                  >
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span>帶入夢境解析 →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 💭 客人夢境天體共鳴專屬面版 */}
          {activeAstrolabeTab === 'dreams' && (
            <div className="card p-5 sm:p-6 rounded-3xl bg-white border-2 border-purple-200/90 shadow-md relative overflow-hidden space-y-4">
              {/* 原型宿位標題 */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-2 rounded-2xl bg-purple-50 border border-purple-200 shadow-2xs">
                    {activeArchetype.symbol}
                  </span>
                  <div>
                    <span className="text-[11px] font-black tracking-wider text-purple-700 uppercase block">
                      天體宿位共振
                    </span>
                    <h4 className="font-celestial-serif font-black text-xl text-slate-900 leading-tight">
                      {activeArchetype.label}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-black text-xs border border-purple-300 shadow-2xs">
                    共鳴夢境：{currentArchetypeDreams.length} 場
                  </span>
                </div>
              </div>

              {/* 宿象象徵與涵意 */}
              <p className="text-xs sm:text-sm text-slate-700 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 leading-relaxed font-medium">
                {activeArchetype.insight}
              </p>

              {/* 客人關聯夢境列表 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <span>💭 與【{activeArchetype.label}】共鳴的夢境列表：</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {currentArchetypeDreams.length > 0 ? '點擊夢境查看深度報告' : '暫無歷史共振'}
                  </span>
                </div>

                {currentArchetypeDreams.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      你目前記錄的夢境庫中，尚未有與【{activeArchetype.label}】強烈共振之紀錄。
                    </p>
                    <p className="text-[11px] text-purple-700 font-bold">
                      💡 今早醒來若有相關夢境，可點擊下方直接帶著此宿原型去記錄！
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {currentArchetypeDreams.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => onOpenReportDetail && onOpenReportDetail(entry)}
                        className="p-3 rounded-2xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-3 group"
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
                              <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 font-bold">
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
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-700/25 cursor-pointer transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✦ 將【{activeArchetype.label}】象徵帶入新夢境探索</span>
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
                <span>前往升級付費會員 (HK$ 38 / 月起)</span>
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
