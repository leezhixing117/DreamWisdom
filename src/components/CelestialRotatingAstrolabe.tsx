import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Compass, RotateCw, Sparkles, Orbit, Info, ArrowUpRight, ArrowRight, Crown, Lock, CheckCircle2, X } from 'lucide-react';

export interface Archetype {
  deg: number;
  label: string;
  symbol: string;
  element: string;
  insight: string;
  dailyTip: string;
}

const ARCHETYPES: Archetype[] = [
  {
    deg: 0,
    label: '月牙安眠',
    symbol: '🌙',
    element: '水象·潛意識',
    insight: '接納內心溫柔的防衛，今晚是自我療癒的最佳時刻。',
    dailyTip: '睡前半小時遠離電子螢幕，點一盞溫暖微光或飲杯熱洋甘菊茶；允許自己今天不追求完美，給疲憊的心靈一段無條件放空的安眠時光。',
  },
  {
    deg: 30,
    label: '靈光星辰',
    symbol: '⭐',
    element: '風象·直覺',
    insight: '白日未解的難題，夢中正以靈光一閃的形式顯現。',
    dailyTip: '隨身準備便條紙或錄音工具，當靈光一閃時不要用理性過度審查，立即隨手記下；今日適合跨領域探索或嘗試一條全新的通勤小徑。',
  },
  {
    deg: 60,
    label: '守護銀羽',
    symbol: '🪶',
    element: '乙太·庇護',
    insight: '卸下白日的戒備，你的心靈正受到溫柔的宇宙守護。',
    dailyTip: '面對外界壓力時，輕閉雙眼做 3 次慢速深呼吸，想像身邊有一道溫柔光盾；今天不必急著討好所有人，先照顧好自己的心理界線。',
  },
  {
    deg: 90,
    label: '深海巨浪',
    symbol: '🌊',
    element: '水象·情緒',
    insight: '洶湧的情緒並非敵人，而是潛意識渴望被看見的呼喚。',
    dailyTip: '當焦慮或委屈浮現時，不要強行壓抑；試著在紙上自由書寫 5 分鐘，溫柔對自己說：「我看見你了，謝謝你提醒我需要停下來休息」。',
  },
  {
    deg: 120,
    label: '古樹之根',
    symbol: '🌳',
    element: '土象·基石',
    insight: '向下扎根才能向上生長，在混亂中找回平靜的重心。',
    dailyTip: '到戶外踩踩草地、散散步，或是吃一頓熱騰騰的營養原型食物；在做重大決定前，先專注感受雙腳穩踏地面的扎實感。',
  },
  {
    deg: 150,
    label: '神秘鑰匙',
    symbol: '🗝️',
    element: '心智·解鎖',
    insight: '心中封鎖已久的答案，其實鑰匙一直在你自己的手中。',
    dailyTip: '換個視角看當前卡關的事情；主動收拾一個凌亂的抽屜或書桌，外在環境的理清常會帶動內在思維的豁然開朗。',
  },
  {
    deg: 180,
    label: '天穹之眼',
    symbol: '👁️',
    element: '靈性·洞察',
    insight: '超越表面的幻象，以更高的全知視角俯瞰人生的轉折。',
    dailyTip: '今天遇到摩擦或不順時，抽離 10 秒鐘把自己當作電影旁白：「這段情節正在教會主角什麼？」站得更高，痛苦就會變小。',
  },
  {
    deg: 210,
    label: '飛翔之翼',
    symbol: '🕊️',
    element: '火象·解脫',
    insight: '渴望掙脫常規束縛，潛意識邀請你勇敢展翅體驗自由。',
    dailyTip: '打破一個慣性日常（例如聽一張從未聽過的音樂專輯，或拒絕一個不情願的聚會）；給自己安排一小時完全屬於自己的「無計劃時光」。',
  },
  {
    deg: 240,
    label: '記憶迴廊',
    symbol: '🏛️',
    element: '時空·回溯',
    insight: '遇見舊人舊事，是為了與過去那個未被撫慰的自己和解。',
    dailyTip: '如果突然想起過去的某件遺憾，對記憶中那個脆弱的自己說一句：「當時你已經盡力了，現在我們很安全，謝謝你帶我走到今天。」',
  },
  {
    deg: 270,
    label: '水晶明鏡',
    symbol: '🪞',
    element: '陰影·映照',
    insight: '夢中的他人皆是自我的投影，凝視它，整合破碎的自我。',
    dailyTip: '注意今天身邊讓你特別反感或特別崇拜的人，問問自己：「他身上的哪種特質，其實也是我壓抑或渴望擁有的部分？」',
  },
  {
    deg: 300,
    label: '迷宮引路',
    symbol: '🧭',
    element: '探索·方向',
    insight: '迷茫只是尋路的過程，每一個轉角都在為你累積智慧。',
    dailyTip: '不需要今天就看清未來十年的路，只要看清眼前下一步即可；把龐大目標拆成今天只要花 15 分鐘就能完成的最小微行動。',
  },
  {
    deg: 330,
    label: '拂曉晨光',
    symbol: '☀️',
    element: '轉化·新生',
    insight: '最深沉的黑夜之後必有晨曦，一個全新的轉機正在孕育。',
    dailyTip: '清晨拉開窗簾深呼吸沐浴陽光；今天適合主動開啟一項微小的新嘗試，或對鏡子裡的自己展露一個溫柔的微笑，迎接新的生命循環。',
  },
];

export interface CelestialRotatingAstrolabeProps {
  onSelectArchetype?: (archetype: Archetype) => void;
  onAddToDream?: (archetype: Archetype) => void;
  onRemoveFromDream?: (archetype: Archetype) => void;
  onNavigateToWorkspace?: () => void;
  isAddedToDream?: boolean;
  className?: string;
  isPaidMember?: boolean;
  onRequirePaid?: () => void;
  hideHeader?: boolean;
  compact?: boolean;
}

/**
 * 參考 OracleVox (oraclevox.com) 東方天體星盤美學：
 * 1. 付費會員專區專屬特權 (VIP Exclusive Area)
 * 2. 只有付費會員可以按「撥動星盤」隨機感應今日潛意識
 * 3. 多層同心天體軌道 (Multi-Ring Cosmic Orbit)
 * 4. 順逆雙向旋轉動態 (Clockwise & Reverse Counter-Spin)
 * 5. 藍色、銀白與淺灰白高對比現代色調，100% 清晰好閱讀
 */
export const CelestialRotatingAstrolabe: React.FC<CelestialRotatingAstrolabeProps> = ({
  onSelectArchetype,
  onAddToDream,
  onRemoveFromDream,
  onNavigateToWorkspace,
  isAddedToDream,
  className = '',
  isPaidMember = false,
  onRequirePaid,
  hideHeader = false,
  compact = false,
}) => {
  const [rotation, setRotation] = useState<number>(15);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [isAligning, setIsAligning] = useState<boolean>(false);
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  const [localAddedSet, setLocalAddedSet] = useState<Set<string>>(new Set());
  const [contemplationNote, setContemplationNote] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number>(0);
  const autoSpinAnimRef = useRef<number | null>(null);

  // Pure derived active archetype based on rotation angle (normalized 0-360)
  const activeArchetype = useMemo(() => {
    const normalized = ((rotation % 360) + 360) % 360;
    const index = Math.round(normalized / 30) % 12;
    return ARCHETYPES[index];
  }, [rotation]);

  const isCurrentAdded = isAddedToDream !== undefined ? isAddedToDream : localAddedSet.has(activeArchetype.label);

  const handleToggleAdd = (archetype: Archetype, shouldAdd: boolean) => {
    if (shouldAdd) {
      setLocalAddedSet((prev) => new Set([...prev, archetype.label]));
      setContemplationNote(null);
      if (onAddToDream) onAddToDream(archetype);
      if (onSelectArchetype) onSelectArchetype(archetype);
    } else {
      setLocalAddedSet((prev) => {
        const next = new Set(prev);
        next.delete(archetype.label);
        return next;
      });
      if (onRemoveFromDream) onRemoveFromDream(archetype);
    }
  };

  const handleContemplateOnly = (archetype: Archetype) => {
    setContemplationNote(archetype.label);
    setLocalAddedSet((prev) => {
      const next = new Set(prev);
      next.delete(archetype.label);
      return next;
    });
    if (onRemoveFromDream) onRemoveFromDream(archetype);
  };

  // Continuous gentle ambient spin when auto-spinning is on and not dragging
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (isAutoSpinning && !isDragging && !isAligning) {
        setRotation((prev) => (prev + delta * 0.015) % 360);
      }
      autoSpinAnimRef.current = requestAnimationFrame(animate);
    };

    autoSpinAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (autoSpinAnimRef.current) cancelAnimationFrame(autoSpinAnimRef.current);
    };
  }, [isAutoSpinning, isDragging, isAligning]);

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

    setRotation((prev) => (prev + diff + 360) % 360);
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

  // 1-Click Mystical Random Spin ("撥動夢境星盤")
  // 只有付費會員可以按撥動星盤
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

    // Choose target archetype
    const randomIndex = Math.floor(Math.random() * ARCHETYPES.length);
    const targetArchetype = ARCHETYPES[randomIndex];
    const targetDeg = targetArchetype.deg;

    // Spin at least 3-4 full revolutions + target offset
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

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsAligning(false);
        if (onSelectArchetype) onSelectArchetype(targetArchetype);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col items-center ${className}`} id="celestial-astrolabe-widget">
      {/* 標題與簡介 (付費會員尊享專區 + OracleVox 莊嚴東方哲學風格) */}
      {!hideHeader && (
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

          {/* 尊享資格狀態條 */}
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
      {/* 核心天體轉動圖案區域 (Multi-Ring Interactive Astrolabe) */}
      {/* ============================================================ */}
      <div className={`relative w-full flex ${compact ? 'flex-col items-center gap-6' : 'flex-col md:flex-row items-center justify-center gap-8'} py-4`}>
        {/* 左側 / 中央：多層立體同心轉盤 */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative ${
            compact
              ? 'w-[260px] h-[260px] sm:w-[290px] sm:h-[290px]'
              : 'w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px]'
          } rounded-full select-none cursor-grab active:cursor-grabbing flex items-center justify-center touch-none transition-shadow shrink-0`}
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

          {/* 外軌道 A (Ring A): 順時針緩轉 + 12 原型符號與字樣 (跟隨用戶旋轉) */}
          <div
            className="absolute inset-4 rounded-full border border-slate-300 pointer-events-none transition-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s linear',
            }}
          >
            {/* 12 個天體原型節點 (12 Subconscious Archetypes) */}
            {ARCHETYPES.map((arch, idx) => {
              const rad = (arch.deg * Math.PI) / 180;
              // Radius percentage from center
              const r = 42; // percent
              const left = 50 + r * Math.cos(rad);
              const top = 50 + r * Math.sin(rad);
              const isSelected = activeArchetype.deg === arch.deg;

              return (
                <div
                  key={idx}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'w-10 h-10 sm:w-11 sm:h-11 bg-blue-700 text-white shadow-md shadow-blue-700/30 ring-2 ring-blue-300 scale-110 z-20'
                      : 'w-8 h-8 sm:w-9 sm:h-9 bg-white border border-slate-200 text-slate-700 shadow-2xs hover:border-blue-400 z-10'
                  }`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <span className="text-base select-none">{arch.symbol}</span>
                </div>
              );
            })}
          </div>

          {/* 中軌道 B (Ring B): 虛線反向轉動軌道 (Counter-Rotating Dashed Orbit) */}
          <div
            className="absolute w-[68%] h-[68%] rounded-full border border-dashed border-blue-400/60 pointer-events-none"
            style={{
              transform: `rotate(${-rotation * 0.75}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s linear',
            }}
          >
            {/* 軌道上的兩顆微型公轉衛星 (Orbiting Crystal Nodes) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-500 border border-white shadow-sm" />
          </div>

          {/* 內軌道 C (Ring C): 細緻度數同心環 (Astrolabe Degree Circle) */}
          <div
            className="absolute w-[48%] h-[48%] rounded-full border border-slate-300/80 pointer-events-none"
            style={{
              transform: `rotate(${rotation * 1.5}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s linear',
            }}
          >
            {/* 刻度標記 */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute top-0 left-1/2 w-0.5 h-2 bg-slate-400 -translate-x-1/2 origin-[50%_96px] sm:origin-[50%_115px]"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
          </div>

          {/* 中央核心天體靈球 (The Cosmic Orb / Sleeping Celestial Moon Core) */}
          <div
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #E0F2FE 30%, #1D4ED8 80%, #0F172A 100%)',
              boxShadow: '0 0 35px rgba(29, 78, 216, 0.4), inset -6px -8px 16px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* 核心安眠白眼 */}
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

          {/* 頂部固定對齊指針 (Celestial Needle Pointer) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-blue-700 drop-shadow-sm" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-700 -mt-1" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 右側：當前旋轉對齊的潛意識感應報告 (Real-time Aligned Insight) */}
        {/* ============================================================ */}
        <div className={`w-full ${compact ? 'max-w-md' : 'md:w-80'} flex flex-col justify-between space-y-4 text-left`}>
          {/* 當前對齊卡片 */}
          <div className="card p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-blue-50 text-blue-700 border-b border-l border-blue-200 rounded-bl-xl text-[11px] font-mono font-bold">
              {activeArchetype.element}
            </div>

            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                {activeArchetype.symbol}
              </span>
              <div>
                <span className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">
                  已對準潛意識象徵
                </span>
                <h4 className="font-celestial-serif font-black text-xl text-slate-900 leading-tight">
                  {activeArchetype.label}
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2 pt-2 border-t border-slate-100">
              {activeArchetype.insight}
            </p>

            {/* 今日生活小貼士 (Daily Life Practical Tip) */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2 shadow-2xs">
              <span className="shrink-0 text-sm mt-0.5">💡</span>
              <div className="space-y-0.5">
                <span className="font-bold text-[11px] text-amber-900 tracking-wider">今日生活小貼士</span>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {activeArchetype.dailyTip}
                </p>
              </div>
            </div>
          </div>

          {/* 星象入夢選擇（自由決定）：付費會員或提供 onAddToDream 時開放 */}
          {(isPaidMember || !!onAddToDream) && (
            <div className="card p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/70 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>星象入夢選擇（自由決定）</span>
                </span>
                {isCurrentAdded ? (
                  <span className="text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>已加入夢境</span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-normal text-[10px]">
                    未加入夢境
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-600 leading-normal">
                您可以自由選擇是否將當前「<strong>{activeArchetype.label}</strong>」意象帶入夢境，與榮格深度心理模型進行共振分析：
              </p>

              <div className="flex flex-col gap-1.5 pt-0.5">
                {isCurrentAdded ? (
                  <div className="flex items-center gap-2">
                    {onNavigateToWorkspace && (
                      <button
                        type="button"
                        onClick={onNavigateToWorkspace}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <span>前往工作台深入分析</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleAdd(activeArchetype, false)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="從夢境中移除此原型"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>從夢境移除</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAdd(activeArchetype, true)}
                      className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>加入夢境深入分析</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleContemplateOnly(activeArchetype)}
                      className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>✨ 純粹感應不加入</span>
                    </button>
                  </div>
                )}

                {contemplationNote === activeArchetype.label && !isCurrentAdded && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg p-2 leading-relaxed flex items-start gap-1.5 mt-1">
                    <span className="shrink-0">🕊️</span>
                    <span>已保留為今日心靈冥想感應，不會修改或注入你的夢境日記。</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 互動按鈕群 (Interactive Actions) */}
          <div className="space-y-2.5">
            {isPaidMember ? (
              <button
                type="button"
                onClick={handleRandomSpin}
                disabled={isAligning}
                className="w-full py-3 px-5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                id="btn-spin-astrolabe"
              >
                <RotateCw className={`w-4 h-4 ${isAligning ? 'animate-spin' : ''}`} />
                <span>{isAligning ? '星象運轉感應中...' : '✦ 撥動星盤 · 隨機感應今日潛意識'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRandomSpin}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer group"
                id="btn-spin-astrolabe-vip"
              >
                <Crown className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                <span>👑 付費會員專屬 · 按此撥動星盤</span>
              </button>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <button
                type="button"
                onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                className="hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>{isAutoSpinning ? '⏸ 暫停自動漫遊' : '▶ 恢復自動漫遊'}</span>
              </button>

              <span className="font-mono text-slate-600">
                座標：{Math.round(((rotation % 360) + 360) % 360)}°
              </span>
            </div>
          </div>
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
              天體星盤撥動與潛意識共振功能僅供 <strong>DreamWisdom 付費會員</strong> 尊享。升級後即可立即解鎖：
            </p>

            <div className="space-y-2.5 mb-6 text-xs text-slate-700">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>無限次撥動天體星盤</strong>：隨機對齊 12 宿潛意識原型與今日心靈指引。</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <Compass className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>星象原型自動入夢</strong>：一鍵帶入解夢對話，獲取專屬榮格深度解析。</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>無限儲存空間與全套工具</strong>：DREAM DNA™ 指紋、星圖連線全開通。</span>
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
                <span>前往升級付費會員 (HK$ 89 / 月起)</span>
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
