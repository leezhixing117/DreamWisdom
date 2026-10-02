import React from 'react';
import { User, normalizeRole, getRoleDisplayName } from '../types';
import { Sparkles, Dna, Compass, Key, Clock, Settings, ArrowLeft, LogOut, Star, Crown, ShieldCheck, ShoppingBag } from 'lucide-react';

interface SidebarProps {
  currentUser?: User | null;
  activeSection?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns' | 'astrolabe';
  onNavigate: (view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars', section?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns' | 'astrolabe') => void;
  onLogout: () => void;
  onOpenEarnStars?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeSection = 'workspace',
  onNavigate,
  onLogout,
  onOpenEarnStars,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  return (
    <aside className="sidebar" id="app-sidebar">
      {/* 典雅星際側邊欄容器（告別枯燥淨白，注入豐富星空圖案與柔和彩色卡片） */}
      <div className="relative rounded-3xl p-4 bg-gradient-to-b from-[#F0F6FF] via-[#F8FAFC] to-[#EEF5FF] border-2 border-blue-200/90 shadow-[0_8px_32px_rgba(30,58,138,0.08)] space-y-1.5 overflow-hidden">
        
        {/* 背景星宿星座幾何圖案水印 (Celestial Constellation Pattern) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 星座連線 1 */}
          <line x1="20%" y1="12%" x2="55%" y2="8%" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="20%" cy="12%" r="3.5" fill="#2563EB" />
          <circle cx="55%" cy="8%" r="3" fill="#38BDF8" />
          
          {/* 星座連線 2 */}
          <line x1="55%" y1="8%" x2="88%" y2="16%" stroke="#60A5FA" strokeWidth="1.2" />
          <circle cx="88%" cy="16%" r="3.5" fill="#F59E0B" />
          
          {/* 月相與星盤輪廓 */}
          <path d="M 220 50 A 28 28 0 0 1 195 20 A 28 28 0 1 0 220 50 Z" fill="#93C5FD" opacity="0.3" />
          
          {/* 底部星群連線 */}
          <line x1="15%" y1="86%" x2="50%" y2="92%" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="50%" y1="92%" x2="85%" y2="84%" stroke="#818CF8" strokeWidth="1.2" />
          <circle cx="15%" cy="86%" r="3" fill="#6366F1" />
          <circle cx="50%" cy="92%" r="3.5" fill="#EC4899" />
          <circle cx="85%" cy="84%" r="2.5" fill="#FBBF24" />
        </svg>

        {/* 頂部彩色星空導航飾條 */}
        <div className="relative p-3.5 mb-2.5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white shadow-md shadow-blue-700/25 overflow-hidden">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/10 blur-xs pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌙</span>
              <div>
                <h4 className="font-black text-xs tracking-wider uppercase text-blue-100 font-mono">DREAM SPACE</h4>
                <span className="text-sm font-black text-white">潛意識心靈導航</span>
              </div>
            </div>
            <span className="text-amber-300 text-base">✦</span>
          </div>
        </div>

        {/* 用戶身分與星星幣狀態彩色卡片 */}
        {currentUser && (
          <div className="p-3.5 mb-2.5 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-blue-200 shadow-2xs space-y-2 relative z-10">
            <div className="flex items-center justify-between gap-1.5">
              <span className="font-black text-slate-950 truncate max-w-[120px] text-sm">
                {currentUser.display_name || currentUser.email.split('@')[0]}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border-2 font-black ${
                  normRole === 'super_admin'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : normRole === 'admin'
                    ? 'bg-sky-600 text-white border-sky-700'
                    : normRole === 'paid'
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-amber-100 text-amber-950 border-amber-400 font-mono'
                }`}
              >
                {getRoleDisplayName(normRole || 'free')}
              </span>
            </div>

            {normRole === 'free' ? (
              <div className="pt-2 border-t border-blue-200/90 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-xs sm:text-sm text-amber-950 font-mono flex items-center gap-1.5 font-black">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                  {currentUser.stars ?? 2} 顆星 ⭐
                </span>
                {onOpenEarnStars && (
                  <button
                    type="button"
                    onClick={onOpenEarnStars}
                    className="text-xs px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer shadow-xs transition-all border border-amber-500"
                  >
                    儲星 +1⭐
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-800 pt-0.5 font-bold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                {normRole === 'paid' && 'VIP 全解鎖 · 免扣星探索'}
                {normRole === 'admin' && '管理員 · 享有全功能限度'}
                {normRole === 'super_admin' && '最高管理員 · 全站特權'}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 核心解夢專區 (有色高質感卡片、大字型) */}
        {/* ============================================================ */}

        {/* 1. 夢境解碼 */}
        <button
          type="button"
          onClick={() => onNavigate('app', 'workspace')}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left relative z-10 ${
            activeSection === 'workspace'
              ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25 border-2 border-blue-700'
              : 'bg-blue-50/80 hover:bg-blue-100 text-blue-950 border-2 border-blue-200 shadow-2xs'
          }`}
          id="sidebar-item-workspace"
        >
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
              activeSection === 'workspace' ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
            }`}
          >
            🌙
          </span>
          <span className="flex-1">夢境解碼</span>
          {activeSection === 'workspace' && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-white/20 text-white font-mono font-black">
              當前
            </span>
          )}
        </button>

        {/* 2. DREAM DNA */}
        <button
          type="button"
          onClick={() => onNavigate('app', 'dna')}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left relative z-10 ${
            activeSection === 'dna'
              ? 'bg-indigo-700 text-white shadow-md shadow-indigo-700/25 border-2 border-indigo-700'
              : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 border-2 border-indigo-200 shadow-2xs'
          }`}
          id="sidebar-item-dna"
          title="DREAM DNA™️｜你的夢境指紋：統計你重複遇過嘅場景、物件同情緒"
        >
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
              activeSection === 'dna' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            🧬
          </span>
          <div className="flex-1 leading-tight">
            <div>DREAM DNA™️</div>
            <div className={`text-xs font-bold ${activeSection === 'dna' ? 'text-indigo-200' : 'text-slate-700'}`}>
              個人夢境指紋
            </div>
          </div>
        </button>

        {/* 3. 星圖 CONSTELLATION */}
        <button
          type="button"
          onClick={() => onNavigate('app', 'constellation')}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left relative z-10 ${
            activeSection === 'constellation'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 border-2 border-sky-600'
              : 'bg-sky-50/80 hover:bg-sky-100 text-sky-950 border-2 border-sky-200 shadow-2xs'
          }`}
          id="sidebar-item-constellation"
          title="星圖 CONSTELLATION™️｜夢境連線：將唔同夢境嘅人、地、情緒連成星圖"
        >
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
              activeSection === 'constellation' ? 'bg-white/20' : 'bg-sky-100 text-sky-700'
            }`}
          >
            🌌
          </span>
          <div className="flex-1 leading-tight">
            <div>星圖 CONSTELLATION™️</div>
            <div className={`text-xs font-bold ${activeSection === 'constellation' ? 'text-sky-200' : 'text-slate-700'}`}>
              夢境連線圖譜
            </div>
          </div>
        </button>

        {/* 4. 30 NIGHTS */}
        <button
          type="button"
          onClick={() => onNavigate('app', 'mystery')}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left relative z-10 ${
            activeSection === 'mystery'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 border-2 border-amber-600'
              : 'bg-amber-50/80 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 shadow-2xs'
          }`}
          id="sidebar-item-mystery"
          title="30 NIGHTS MYSTERY™️｜30晚潛意識檔案：每晚解鎖線索碎片"
        >
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
              activeSection === 'mystery' ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
            }`}
          >
            🗝️
          </span>
          <div className="flex-1 leading-tight">
            <div>30 NIGHTS™️</div>
            <div className={`text-xs font-bold ${activeSection === 'mystery' ? 'text-amber-200' : 'text-amber-900'}`}>
              30晚潛意識檔案
            </div>
          </div>
        </button>

        {/* 5. 日記典藏 */}
        <button
          type="button"
          onClick={() => onNavigate('app', 'history')}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left relative z-10 ${
            activeSection === 'history'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 border-2 border-teal-700'
              : 'bg-teal-50/80 hover:bg-teal-100 text-teal-950 border-2 border-teal-200 shadow-2xs'
          }`}
          id="sidebar-item-history"
        >
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
              activeSection === 'history' ? 'bg-white/20' : 'bg-teal-100 text-teal-700'
            }`}
          >
            🕰️
          </span>
          <span className="flex-1">日記典藏</span>
        </button>

        {/* 6. 潛意識星盤 */}
        <button
          type="button"
          onClick={() => onNavigate('app', 'astrolabe')}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left relative z-10 ${
            activeSection === 'astrolabe'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 border-2 border-amber-500 font-black'
              : 'bg-gradient-to-r from-amber-50 via-amber-100/60 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 border-2 border-amber-400 shadow-2xs'
          }`}
          id="sidebar-item-astrolabe"
          title="👑 付費會員專區 · 潛意識天體星盤"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-base shrink-0">
            🪐
          </span>
          <div className="flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <span>潛意識星盤</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black shadow-2xs">
                VIP
              </span>
            </div>
            <div className="text-xs text-amber-900 font-bold">付費會員專區</div>
          </div>
        </button>

        {/* 夢境生活風格分隔線 */}
        <div className="my-3 flex items-center gap-2 relative z-10">
          <div className="flex-1 border-t-2 border-blue-200" />
          <span className="text-xs font-mono text-blue-800 font-black tracking-wider">✦ EXPLORE ✦</span>
          <div className="flex-1 border-t-2 border-blue-200" />
        </div>

        {/* ============================================================ */}
        {/* 選物店、會員與專屬方案 (色彩繽紛專屬卡片、大字型) */}
        {/* ============================================================ */}

        {/* 7. 選物店 */}
        <button
          type="button"
          onClick={() => onNavigate('store')}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-2 border-emerald-300 shadow-2xs relative z-10"
          id="sidebar-item-store"
          title="選物店：身心轉化、深眠草本、空間淨化與守護水晶"
        >
          <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-base shrink-0">
            🛍️
          </span>
          <span className="flex-1">選物店</span>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-200 text-emerald-950 font-mono font-black">
            SHOP
          </span>
        </button>

        {/* 8. 付費會員專區 */}
        <button
          type="button"
          onClick={() => onNavigate('pricing')}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left bg-blue-50/90 hover:bg-blue-100 text-blue-950 border-2 border-blue-300 shadow-2xs relative z-10"
          id="sidebar-item-pricing"
          title="付費會員專區：潛意識天體星盤（VIP 尊享原型共振儀）"
        >
          <span className="w-8 h-8 rounded-xl bg-blue-100 text-amber-600 flex items-center justify-center text-base shrink-0">
            👑
          </span>
          <span className="flex-1">付費會員專區</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-blue-200 text-blue-950 font-black">
            天體星盤
          </span>
        </button>

        {/* 9. 星星幣 */}
        <button
          type="button"
          onClick={() => onNavigate('stars')}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-2xs relative z-10"
          id="sidebar-item-stars"
          title="星星幣中心：儲幣機制、免費與付費會員方案完整對比"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-base shrink-0">
            ⭐
          </span>
          <span className="flex-1">星星幣中心</span>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-950 font-mono font-black">
            COINS
          </span>
        </button>

        {/* 10. 私隱承諾與條款 */}
        <button
          type="button"
          onClick={() => onNavigate('privacy')}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left bg-white hover:bg-slate-50 text-slate-950 border-2 border-slate-300 shadow-2xs relative z-10"
          id="sidebar-item-privacy"
        >
          <span className="w-8 h-8 rounded-xl bg-slate-100 text-emerald-700 flex items-center justify-center text-base shrink-0">
            🛡️
          </span>
          <span className="flex-1">私隱承諾與條款</span>
        </button>

        {/* 11. 控制室 (若為管理員) */}
        {isManagement && (
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-black transition-all cursor-pointer text-left bg-purple-50 hover:bg-purple-100 text-purple-950 border-2 border-purple-300 shadow-2xs relative z-10"
            id="sidebar-item-admin"
          >
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base shrink-0">
              ⚙️
            </span>
            <span className="flex-1">控制室 ({normRole === 'super_admin' ? '高級' : '管理員'})</span>
          </button>
        )}

        {/* 12. 返回首頁 */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left bg-white hover:bg-blue-50 text-slate-900 hover:text-blue-950 border-2 border-slate-300 relative z-10"
          id="sidebar-item-home"
        >
          <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base shrink-0">
            ←
          </span>
          <span className="flex-1">返回首頁</span>
        </button>

        {/* 13. 登出 */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-200 relative z-10"
          id="sidebar-item-logout"
        >
          <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-base shrink-0">
            🚪
          </span>
          <span className="flex-1">登出</span>
        </button>

        {/* 底部潛意識寄語與星光圖案卡片 (提升視覺溫度與藝術美感) */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border-2 border-blue-300 text-center relative overflow-hidden z-10 shadow-2xs">
          <div className="text-base mb-1">✨ ✦ 🌌</div>
          <p className="text-xs sm:text-sm font-celestial-serif font-black text-blue-950 leading-snug">
            「每一個夢，都是潛意識寫給你的信箋。」
          </p>
          <span className="text-xs font-mono text-blue-800 font-bold block mt-1 tracking-wider">
            DREAMWISDOM · 心靈宇宙
          </span>
        </div>
      </div>
    </aside>
  );
};
