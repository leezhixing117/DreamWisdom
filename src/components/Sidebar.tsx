import React from 'react';
import { User, normalizeRole, getRoleDisplayName } from '../types';
import { Sparkles, Dna, Compass, Key, Clock, Brain, Settings, ArrowLeft, LogOut, Star, Crown, ShieldCheck } from 'lucide-react';

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
      <div className="sidecard space-y-1 bg-white/85 border border-[#BAE6FD] shadow-[0_8px_24px_rgba(147,197,253,0.15)]">
        {/* User Tier Status Badge on top of sidebar */}
        {currentUser && (
          <div className="p-2.5 mb-2 rounded-xl bg-[#F0F7FF] border border-[#BAE6FD] text-xs">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-[#102A4E] truncate max-w-[110px]">
                {currentUser.display_name || currentUser.email.split('@')[0]}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                  normRole === 'super_admin'
                    ? 'bg-blue-100 text-blue-800 border-blue-300 font-semibold'
                    : normRole === 'admin'
                    ? 'bg-sky-100 text-sky-800 border-sky-300'
                    : normRole === 'paid'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {getRoleDisplayName(normRole || 'free')}
              </span>
            </div>

            {normRole === 'free' ? (
              <div className="pt-1.5 border-t border-[#BAE6FD]/60 flex items-center justify-between">
                <span className="text-[11px] text-amber-800 font-mono flex items-center gap-1 font-semibold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {currentUser.stars ?? 2} 顆星
                </span>
                {onOpenEarnStars && (
                  <button
                    type="button"
                    onClick={onOpenEarnStars}
                    className="text-[10px] text-amber-700 hover:text-amber-900 hover:underline font-bold cursor-pointer"
                  >
                    睇片儲星 +
                  </button>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-[#5C7A9E] pt-0.5">
                {normRole === 'paid' && '✨ 全功能直接解鎖免儲星'}
                {normRole === 'admin' && '⚙️ 全功能 + 內容管理'}
                {normRole === 'super_admin' && '🛡️ 全功能 + 更改會員等級'}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onNavigate('app', 'workspace')}
          className={`sideitem ${activeSection === 'workspace' ? 'active' : ''}`}
          id="sidebar-item-workspace"
        >
          <Sparkles className="w-4 h-4 text-[#0284C7]" />
          <span>🌙 夢境解碼</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'dna')}
          className={`sideitem ${activeSection === 'dna' ? 'active' : ''}`}
          id="sidebar-item-dna"
          title="DREAM DNA™️｜你的夢境指紋：統計你重複遇過嘅場景、物件同情緒"
        >
          <Dna className="w-4 h-4 text-[#0284C7]" />
          <div className="text-left leading-tight">
            <div className="font-semibold">🧬 DREAM DNA™️</div>
            <div className="text-[10px] text-[#5C7A9E] font-normal">夢境指紋</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'constellation')}
          className={`sideitem ${activeSection === 'constellation' ? 'active' : ''}`}
          id="sidebar-item-constellation"
          title="星圖 CONSTELLATION™️｜夢境連線：將唔同夢境嘅人、地、情緒連成星圖"
        >
          <Compass className="w-4 h-4 text-[#0284C7]" />
          <div className="text-left leading-tight">
            <div className="font-semibold">🌌 星圖 CONSTELLATION™️</div>
            <div className="text-[10px] text-[#5C7A9E] font-normal">夢境連線</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'mystery')}
          className={`sideitem ${activeSection === 'mystery' ? 'active' : ''}`}
          id="sidebar-item-mystery"
          title="30 NIGHTS MYSTERY™️｜30晚潛意識檔案：每晚解鎖線索碎片"
        >
          <Key className="w-4 h-4 text-amber-500" />
          <div className="text-left leading-tight">
            <div className="font-semibold">🗝️ 30 NIGHTS™️</div>
            <div className="text-[10px] text-[#5C7A9E] font-normal">30晚潛意識檔案</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'history')}
          className={`sideitem ${activeSection === 'history' ? 'active' : ''}`}
          id="sidebar-item-history"
        >
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>🕰️ 日記典藏</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'astrolabe')}
          className={`sideitem ${activeSection === 'astrolabe' ? 'active' : ''}`}
          id="sidebar-item-astrolabe"
          title="👑 付費會員專區 · 潛意識天體星盤"
        >
          <Crown className="w-4 h-4 text-amber-500" />
          <div className="text-left leading-tight">
            <div className="font-semibold flex items-center gap-1">
              <span>🪐 潛意識星盤</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">VIP</span>
            </div>
            <div className="text-[10px] text-[#5C7A9E] font-normal">付費會員專區</div>
          </div>
        </button>

        <div className="my-2 border-t border-[#BAE6FD]" />

        {/* Pricing & Star Coins Nav Link */}
        <button
          type="button"
          onClick={() => onNavigate('stars')}
          className="sideitem text-amber-800 hover:text-amber-950 hover:bg-amber-50"
          id="sidebar-item-stars"
          title="獨立星星幣頁面：查看儲幣、消耗明細與有效期限"
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>⭐ 星星幣詳情</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('pricing')}
          className="sideitem text-[#1D4ED8] hover:text-[#1E40AF] hover:bg-blue-50"
          id="sidebar-item-pricing"
        >
          <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>💎 VIP 方案升級</span>
        </button>

        {/* Product Store / Healing goods */}
        <button
          type="button"
          onClick={() => onNavigate('store')}
          className="sideitem text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-medium"
          id="sidebar-item-store"
          title="選物店：身心轉化、深眠草本、空間淨化與守護水晶"
        >
          <span className="text-emerald-600 text-base">🛍️</span>
          <span className="flex-1 text-left font-bold">選物店</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-mono font-bold">
            SHOP
          </span>
        </button>

        {/* Privacy Policy Link */}
        <button
          type="button"
          onClick={() => onNavigate('privacy')}
          className="sideitem text-[#4B6B94] hover:text-[#059669]"
          id="sidebar-item-privacy"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>🛡️ 私隱承諾與條款</span>
        </button>

        {isManagement && (
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="sideitem text-[#1E40AF] hover:text-[#1D4ED8]"
            id="sidebar-item-admin"
          >
            <Settings className="w-4 h-4 text-[#0284C7]" />
            <span>⚙️ 控制室 ({normRole === 'super_admin' ? '高級' : '管理員'})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="sideitem text-[#4B6B94] hover:text-[#102A4E]"
          id="sidebar-item-home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← 返回首頁</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="sideitem text-rose-600 hover:bg-rose-50"
          id="sidebar-item-logout"
        >
          <LogOut className="w-4 h-4" />
          <span>登出</span>
        </button>
      </div>
    </aside>
  );
};
