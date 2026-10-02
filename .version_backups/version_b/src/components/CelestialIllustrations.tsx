import React from 'react';

/**
 * 步驟 1 記事本與發光筆 (Step 1: Notepad & Glowing Stylus)
 */
export const StepNotepadIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="step1-pad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
      <linearGradient id="step1-pen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <radialGradient id="step1-halo" cx="50%" cy="50%" r="50%">
        <stop offset="20%" stopColor="#7DD3FC" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="36" fill="url(#step1-halo)" />
    <circle cx="40" cy="40" r="35" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" />
    
    {/* 記事板 */}
    <rect x="22" y="16" width="34" height="46" rx="8" fill="url(#step1-pad-grad)" stroke="#60A5FA" strokeWidth="1.8" />
    <rect x="32" y="12" width="14" height="6" rx="3" fill="#2563EB" />
    
    {/* 筆記橫線 */}
    <line x1="28" y1="28" x2="48" y2="28" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="36" x2="48" y2="36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="44" x2="42" y2="44" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="52" x2="38" y2="52" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

    {/* 斜向發光書寫筆 */}
    <path d="M 52 24 L 60 32 L 44 48 L 36 50 L 38 42 Z" fill="url(#step1-pen-grad)" stroke="#FFFFFF" strokeWidth="1.2" />
    <circle cx="62" cy="22" r="3" fill="#38BDF8" />
  </svg>
);

/**
 * 步驟 2 晶瑩大腦雪花 (Step 2: AI Crystal Snowflake Brain)
 */
export const StepAiBrainIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="step2-brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <radialGradient id="step2-halo" cx="50%" cy="50%" r="50%">
        <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="36" fill="url(#step2-halo)" />
    <circle cx="40" cy="40" r="35" stroke="#60A5FA" strokeWidth="1" strokeOpacity="0.6" />

    {/* 水晶雪花瓣形狀 */}
    <g stroke="url(#step2-brain-grad)" strokeWidth="2.4" strokeLinecap="round">
      <line x1="40" y1="16" x2="40" y2="64" />
      <line x1="16" y1="40" x2="64" y2="40" />
      <line x1="23" y1="23" x2="57" y2="57" />
      <line x1="57" y1="23" x2="23" y2="57" />
    </g>

    {/* 雪花結晶分枝 */}
    <g stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round">
      <path d="M 40 22 L 35 27 M 40 22 L 45 27" />
      <path d="M 40 58 L 35 53 M 40 58 L 45 53" />
      <path d="M 22 40 L 27 35 M 22 40 L 27 45" />
      <path d="M 58 40 L 53 35 M 58 40 L 53 45" />
    </g>

    {/* 中央光核 */}
    <circle cx="40" cy="40" r="7" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
    <circle cx="40" cy="40" r="3" fill="#38BDF8" />
  </svg>
);

/**
 * 步驟 3 四角晶球星芒 (Step 3: Radiant 4-Point Star Compass)
 */
export const StepInsightIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="step3-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#E0F2FE" />
        <stop offset="70%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <radialGradient id="step3-halo" cx="50%" cy="50%" r="50%">
        <stop offset="20%" stopColor="#60A5FA" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="36" fill="url(#step3-halo)" />
    <circle cx="40" cy="40" r="35" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="4 2" />

    {/* 耀眼四角主星芒 */}
    <path
      d="M 40 14 Q 40 40 66 40 Q 40 40 40 66 Q 40 40 14 40 Q 40 40 40 14 Z"
      fill="url(#step3-star-grad)"
      stroke="#FFFFFF"
      strokeWidth="1.5"
    />
    <circle cx="40" cy="40" r="4" fill="#FFFFFF" />

    {/* 四周細小星點 */}
    <circle cx="24" cy="24" r="1.8" fill="#38BDF8" />
    <circle cx="56" cy="24" r="1.8" fill="#38BDF8" />
    <circle cx="24" cy="56" r="1.8" fill="#38BDF8" />
    <circle cx="56" cy="56" r="1.8" fill="#38BDF8" />
  </svg>
);

/**
 * 支柱 1: 藍銀水晶 DNA 雙螺旋 (DREAM DNA Crystalline Helix Artwork)
 */
export const DreamDnaArtwork: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="dna-strand-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="dna-strand-2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="60%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <radialGradient id="dna-halo" cx="50%" cy="50%" r="50%">
        <stop offset="10%" stopColor="#38BDF8" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* 水波漣漪底盤 */}
    <ellipse cx="100" cy="135" rx="70" ry="14" fill="url(#dna-halo)" />
    <ellipse cx="100" cy="135" rx="60" ry="10" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="3 3" />

    {/* 雙螺旋橫樑鍵連線 */}
    <g stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" opacity="0.85">
      <line x1="84" y1="36" x2="116" y2="36" />
      <line x1="76" y1="56" x2="124" y2="56" />
      <line x1="72" y1="78" x2="128" y2="78" />
      <line x1="78" y1="100" x2="122" y2="100" />
      <line x1="88" y1="120" x2="112" y2="120" />
    </g>

    {/* 螺旋鏈 1 */}
    <path
      d="M 80 20 C 130 40 130 70 80 80 C 70 95 125 110 100 135"
      stroke="url(#dna-strand-1)"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />

    {/* 螺旋鏈 2 */}
    <path
      d="M 120 20 C 70 40 70 70 120 80 C 130 95 75 110 100 135"
      stroke="url(#dna-strand-2)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* 節點光球 */}
    <circle cx="80" cy="20" r="4.5" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
    <circle cx="120" cy="20" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
    <circle cx="76" cy="56" r="3.5" fill="#FFFFFF" />
    <circle cx="124" cy="56" r="3.5" fill="#FFFFFF" />
    <circle cx="100" cy="80" r="5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
    <circle cx="78" cy="100" r="3.5" fill="#FFFFFF" />
    <circle cx="122" cy="100" r="3.5" fill="#FFFFFF" />

    {/* 漂浮晶透水泡 */}
    <circle cx="50" cy="40" r="6" fill="#E0F2FE" fillOpacity="0.6" stroke="#BAE6FD" strokeWidth="1" />
    <circle cx="150" cy="65" r="8" fill="#E0F2FE" fillOpacity="0.6" stroke="#BAE6FD" strokeWidth="1" />
    <circle cx="140" cy="115" r="5" fill="#E0F2FE" fillOpacity="0.6" stroke="#BAE6FD" strokeWidth="1" />
  </svg>
);

/**
 * 支柱 2: 藍銀天體星盤 (CONSTELLATION Astrolabe Star Orb Artwork)
 */
export const ConstellationAstrolabeArtwork: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="astro-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <radialGradient id="astro-halo" cx="50%" cy="50%" r="50%">
        <stop offset="20%" stopColor="#38BDF8" stopOpacity="0.45" />
        <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* 核心光輪 */}
    <circle cx="100" cy="80" r="60" fill="url(#astro-halo)" />
    <circle cx="100" cy="80" r="58" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="3 3" />
    <circle cx="100" cy="80" r="48" stroke="#60A5FA" strokeWidth="1.5" />
    <circle cx="100" cy="80" r="36" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="5 3" />

    {/* 星盤十二宮指引輻射線 */}
    <g stroke="#93C5FD" strokeWidth="1" opacity="0.7">
      <line x1="100" y1="22" x2="100" y2="138" />
      <line x1="42" y1="80" x2="158" y2="80" />
      <line x1="59" y1="39" x2="141" y2="121" />
      <line x1="141" y1="39" x2="59" y2="121" />
    </g>

    {/* 星座連線網絡 (Constellation Network Lines) */}
    <g stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
      <line x1="75" y1="62" x2="100" y2="52" />
      <line x1="100" y1="52" x2="122" y2="68" />
      <line x1="122" y1="68" x2="108" y2="98" />
      <line x1="108" y1="98" x2="82" y2="92" />
      <line x1="82" y1="92" x2="75" y2="62" />
      <line x1="100" y1="80" x2="100" y2="52" />
      <line x1="100" y1="80" x2="108" y2="98" />
    </g>

    {/* 星球璀璨節點 */}
    <circle cx="100" cy="80" r="5.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
    <circle cx="75" cy="62" r="3.5" fill="#FFFFFF" />
    <circle cx="100" cy="52" r="4" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="122" cy="68" r="3.5" fill="#FFFFFF" />
    <circle cx="108" cy="98" r="4" fill="#FFFFFF" />
    <circle cx="82" cy="92" r="3.5" fill="#FFFFFF" />

    {/* 星盤外圍星座符號圓點 */}
    <circle cx="100" cy="26" r="2.5" fill="#38BDF8" />
    <circle cx="154" cy="80" r="2.5" fill="#38BDF8" />
    <circle cx="100" cy="134" r="2.5" fill="#38BDF8" />
    <circle cx="46" cy="80" r="2.5" fill="#38BDF8" />
  </svg>
);

/**
 * 支柱 3: 30 晚潛意識塔羅檔案卡 (30 Nights Dream Oracle Cards Artwork)
 */
export const OracleCardsArtwork: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <radialGradient id="card-halo" cx="50%" cy="50%" r="50%">
        <stop offset="20%" stopColor="#38BDF8" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* 柔和發光背景 */}
    <circle cx="100" cy="80" r="65" fill="url(#card-halo)" />

    {/* 左側微傾卡片 */}
    <g transform="rotate(-12 75 80)">
      <rect x="52" y="36" width="46" height="74" rx="8" fill="url(#card-grad)" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="56" y="40" width="38" height="66" rx="6" stroke="#93C5FD" strokeWidth="0.8" fill="none" />
      <circle cx="75" cy="70" r="8" fill="#FFFFFF" fillOpacity="0.3" />
      <path d="M 72 65 C 72 73 78 75 80 73 C 76 75 73 70 75 66 Z" fill="#FFFFFF" />
    </g>

    {/* 右側微傾卡片 */}
    <g transform="rotate(12 125 80)">
      <rect x="102" y="36" width="46" height="74" rx="8" fill="url(#card-grad)" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="106" y="40" width="38" height="66" rx="6" stroke="#93C5FD" strokeWidth="0.8" fill="none" />
      <circle cx="125" cy="70" r="8" fill="#FFFFFF" fillOpacity="0.3" />
      <path d="M 125 62 Q 125 70 133 70 Q 125 70 125 78 Q 125 70 117 70 Q 125 70 125 62 Z" fill="#FFFFFF" />
    </g>

    {/* 中央主卡片（凸顯立體感） */}
    <g>
      <rect x="76" y="28" width="48" height="78" rx="9" fill="url(#card-grad)" stroke="#FFFFFF" strokeWidth="2" filter="drop-shadow(0 8px 16px rgba(37,99,235,0.35))" />
      <rect x="80" y="32" width="40" height="70" rx="7" stroke="#BAE6FD" strokeWidth="1" fill="none" />
      
      {/* 月牙與星辰印記 */}
      <circle cx="100" cy="62" r="12" fill="#FFFFFF" fillOpacity="0.35" />
      <path
        d="M 103 54 C 97 54 93 59 94 65 C 95 70 100 73 105 72 C 101 70 99 66 100 62 C 101 58 104 55 106 55 Z"
        fill="#FFFFFF"
      />
      <circle cx="107" cy="58" r="1.5" fill="#FFFFFF" />

      {/* 30 NIGHTS 銘牌 */}
      <rect x="85" y="82" width="30" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.85" />
      <line x1="89" y1="86" x2="111" y2="86" stroke="#1E40AF" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* 卡片四周星光 */}
    <circle cx="45" cy="45" r="2" fill="#38BDF8" />
    <circle cx="155" cy="50" r="2.5" fill="#38BDF8" />
    <circle cx="100" cy="120" r="2" fill="#60A5FA" />
  </svg>
);
