import React from 'react';

interface CelestialLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  textClassName?: string;
}

/**
 * DreamWisdom 藍銀白眼元素官方標誌 (Celestial Moon with Serene Sleeping Eye & Silver Star)
 */
export const CelestialLogo: React.FC<CelestialLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  subtitle = '我的夢境',
  className = '',
  textClassName = '',
}) => {
  const pixelSizes = {
    sm: 36,
    md: 44,
    lg: 56,
    xl: 72,
    hero: 120,
  };

  const px = pixelSizes[size] || 44;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 藍銀白眼天體月牙徽標 SVG */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(56,189,248,0.35)] transition-transform hover:scale-105 duration-300"
        aria-label="DreamWisdom 藍銀月牙安眠之眼標誌"
      >
        <defs>
          {/* 月牙藍銀漸層 */}
          <linearGradient id="dw-moon-silver-blue" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#D9EEFD" />
            <stop offset="60%" stopColor="#7CC7FA" />
            <stop offset="90%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          {/* 四角星光漸層 */}
          <linearGradient id="dw-star-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E0F2FE" />
            <stop offset="80%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* 雲朵微光 */}
          <linearGradient id="dw-cloud-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.65" />
          </linearGradient>

          {/* 外環光暈 */}
          <radialGradient id="dw-halo" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#60A5FA" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 背景柔光氣泡環 */}
        <circle cx="50" cy="50" r="46" fill="url(#dw-halo)" />
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#93C5FD"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="2 3"
        />

        {/* 月牙外緣微光羽翼弧線 */}
        <path
          d="M 28 72 C 22 62 20 48 25 34 C 29 24 38 16 50 14"
          stroke="#93C5FD"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />

        {/* 主體：藍銀漸變月牙 (Crescent Moon) */}
        <path
          d="M 52 14 C 28 14 14 34 16 60 C 18 78 34 90 54 88 C 42 80 36 68 36 52 C 36 34 46 22 62 18 C 58 15 55 14 52 14 Z"
          fill="url(#dw-moon-silver-blue)"
          stroke="#E0F2FE"
          strokeWidth="1.2"
        />

        {/* 核心「白眼元素」：安詳閉合之眼（Curved serene sleeping eye） */}
        <path
          d="M 26 49 Q 31 54 36 49"
          stroke="#1E3A8A"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* 精緻優雅睫毛 4 根（Eyelashes pointing gently down/outward） */}
        <line x1="28" y1="52" x2="27" y2="56" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="31" y1="53" x2="31" y2="57.5" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="52.5" x2="35" y2="56.5" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="50" x2="38" y2="53" stroke="#1E3A8A" strokeWidth="1.4" strokeLinecap="round" />

        {/* 內月彎懷抱中的四角星芒 (Radiant Four-Pointed Star) */}
        <path
          d="M 64 34 Q 64 45 75 45 Q 64 45 64 56 Q 64 45 53 45 Q 64 45 64 34 Z"
          fill="url(#dw-star-sparkle)"
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
        {/* 星芒中央光核 */}
        <circle cx="64" cy="45" r="2.2" fill="#FFFFFF" />

        {/* 點綴小星辰 */}
        <path
          d="M 45 27 Q 45 31 49 31 Q 45 31 45 35 Q 45 31 41 31 Q 45 31 45 27 Z"
          fill="#BAE6FD"
          opacity="0.9"
        />
        <circle cx="78" cy="28" r="1.5" fill="#E0F2FE" />
        <circle cx="72" cy="66" r="1.8" fill="#93C5FD" opacity="0.8" />

        {/* 月下祥雲托底 (Soft Cloud Puffs) */}
        <path
          d="M 30 84 C 26 80 20 84 20 88 C 20 92 26 94 34 94 C 44 94 48 90 52 86 C 56 90 64 90 68 86 C 70 88 74 88 76 86 C 74 82 66 80 62 82 C 58 78 50 78 46 82 C 42 80 34 80 30 84 Z"
          fill="url(#dw-cloud-glow)"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.9"
        />
      </svg>

      {/* 流麗襯線字型「DreamWisdom」及「我的夢境」 */}
      {showText && (
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span
            className={`font-brand italic tracking-tight font-bold bg-gradient-to-r from-[#1E40AF] via-[#0284C7] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] ${
              size === 'sm'
                ? 'text-lg sm:text-xl'
                : size === 'md'
                ? 'text-2xl'
                : size === 'lg'
                ? 'text-3xl'
                : size === 'xl'
                ? 'text-4xl'
                : 'text-5xl'
            } ${textClassName}`}
          >
            DreamWisdom
          </span>
          {showSubtitle && subtitle && (
            <span className="text-xs sm:text-sm font-celestial-serif font-black text-slate-800 tracking-wider border-l border-slate-300 pl-1.5 sm:pl-2">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

/**
 * Hero 大尺寸夢境天體藝術插畫 (Hero Celestial Moon Centerpiece Artwork)
 */
export const CelestialHeroMoon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 藍銀大月牙向量藝術 */}
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[240px] sm:w-[300px] md:w-[340px] h-auto drop-shadow-[0_16px_40px_rgba(56,189,248,0.35)]"
      >
        <defs>
          <linearGradient id="dw-hero-moon-grad" x1="10%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#E0F2FE" />
            <stop offset="50%" stopColor="#7DD3FC" />
            <stop offset="80%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          <linearGradient id="dw-hero-feather-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          <linearGradient id="dw-hero-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#F0F9FF" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <radialGradient id="dw-hero-backglow" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stopColor="#7DD3FC" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 柔和大圓光環 */}
        <circle cx="160" cy="140" r="125" fill="url(#dw-hero-backglow)" />
        <circle cx="160" cy="140" r="128" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3 4" />

        {/* 外圈水珠與星塵點綴 */}
        <circle cx="70" cy="70" r="12" fill="#E0F2FE" fillOpacity="0.5" stroke="#BAE6FD" strokeWidth="1" />
        <circle cx="67" cy="67" r="3" fill="#FFFFFF" fillOpacity="0.9" />
        <circle cx="260" cy="90" r="8" fill="#E0F2FE" fillOpacity="0.4" stroke="#BAE6FD" strokeWidth="1" />
        <circle cx="275" cy="170" r="14" fill="#E0F2FE" fillOpacity="0.4" stroke="#BAE6FD" strokeWidth="1" />

        {/* 銀色羽翼 / 桂葉環抱月牙下緣 */}
        <g stroke="url(#dw-hero-feather-grad)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M 85 190 Q 110 215 150 220" />
          <path d="M 95 185 Q 115 195 125 188" />
          <path d="M 115 198 Q 135 208 145 200" />
          <path d="M 135 210 Q 160 218 170 208" />
          <path d="M 155 218 Q 185 220 200 206" />
        </g>

        {/* 大月牙 (Large Crescent Moon) */}
        <path
          d="M 170 42 C 96 42 50 100 55 174 C 60 222 105 252 165 248 C 128 226 112 192 112 148 C 112 98 142 66 195 54 C 187 46 179 42 170 42 Z"
          fill="url(#dw-hero-moon-grad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />

        {/* 藍銀安睡之眼 (Serene Sleeping Closed Eye) */}
        <path
          d="M 86 142 Q 100 156 114 142"
          stroke="#1E3A8A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* 優雅翹起睫毛 5 根 */}
        <line x1="91" y1="150" x2="89" y2="160" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="97" y1="152" x2="97" y2="163" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="104" y1="152" x2="105" y2="162" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="110" y1="149" x2="113" y2="157" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="114" y1="144" x2="119" y2="150" stroke="#1E3A8A" strokeWidth="2.2" strokeLinecap="round" />

        {/* 耀眼四角星芒 (Radiant Sparkle Star) */}
        <path
          d="M 198 80 Q 198 116 234 116 Q 198 116 198 152 Q 198 116 162 116 Q 198 116 198 80 Z"
          fill="url(#dw-hero-star-grad)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle cx="198" cy="116" r="5" fill="#FFFFFF" />

        {/* 飄逸祥雲 (Swirling White Clouds) */}
        <path
          d="M 70 216 C 58 206 42 216 42 226 C 42 238 56 244 76 244 C 102 244 112 234 122 224 C 132 234 154 234 164 224 C 172 230 186 228 190 220 C 184 212 166 210 156 214 C 146 204 126 204 116 214 C 106 208 86 208 70 216 Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
          stroke="#E0F2FE"
          strokeWidth="1.5"
        />

        {/* 閃爍星子 */}
        <path
          d="M 148 76 Q 148 84 156 84 Q 148 84 148 92 Q 148 84 140 84 Q 148 84 148 76 Z"
          fill="#E0F2FE"
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
        <circle cx="230" cy="62" r="3" fill="#BAE6FD" />
      </svg>
    </div>
  );
};
