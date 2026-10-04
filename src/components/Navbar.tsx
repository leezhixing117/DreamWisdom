import React from 'react';
import { User, normalizeRole, getRoleDisplayName } from '../types';
import { Moon, ShieldCheck, UserCircle, LogIn, Sparkles, BookOpen, Star, Crown, Settings, Compass, ShoppingBag } from 'lucide-react';

import { CelestialLogo } from './CelestialLogo';

interface NavbarProps {
  currentView: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars';
  setCurrentView: (view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars') => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenEarnStars?: () => void;
  onOpenOnboarding?: () => void;
  activeSection?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns' | 'astrolabe';
  onNavigateSection?: (section: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns' | 'astrolabe') => void;
  savedDreamCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenEarnStars,
  onOpenOnboarding,
  activeSection,
  onNavigateSection,
  savedDreamCount = 0,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  return (
    <nav className="nav" id="main-navbar">
      <div className="shell navin">
        {/* 官方藍銀白眼天體 LOGO (Celestial Moon with Serene Sleeping Eye & Silver Star) */}
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="brand bg-transparent border-0 text-left p-0 cursor-pointer flex items-center hover:opacity-95 transition-opacity"
          id="nav-brand-btn"
          title="DreamWisdom 首頁"
        >
          <CelestialLogo size="sm" showText={true} />
        </button>

        <div className="navlinks" id="nav-links-group">
          {/* 1. 我的夢境 / 探索 */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateSection) {
                onNavigateSection('workspace');
              } else {
                setCurrentView('app');
              }
            }}
            className={`bg-transparent border-0 text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'app' && activeSection !== 'constellation'
                ? 'text-blue-700 font-bold'
                : 'text-slate-800 hover:text-blue-700'
            }`}
            id="nav-link-app"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>我的夢境</span>
          </button>

          {/* 2. 夢境星圖 */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateSection) {
                onNavigateSection('constellation');
              } else {
                setCurrentView('app');
              }
            }}
            className={`bg-transparent border-0 text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'app' && activeSection === 'constellation'
                ? 'text-blue-700 font-bold'
                : 'text-slate-800 hover:text-blue-700'
            }`}
            id="nav-link-constellation"
            title="🌌 星圖 CONSTELLATION™️ · 夢境連線"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>夢境星圖</span>
          </button>

          {/* 3. 選物店 */}
          <button
            type="button"
            onClick={() => setCurrentView('store')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs ${
              currentView === 'store'
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-400'
            }`}
            id="nav-link-store"
            title="進入解夢選物店：身心轉化、深眠草本、空間淨化與守護水晶"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>選物店</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-emerald-900 uppercase font-mono tracking-wide font-bold">
              SHOP
            </span>
          </button>

          {/* 4. 星星幣 */}
          <button
            type="button"
            onClick={() => setCurrentView('stars')}
            className={`bg-transparent border-0 text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'stars' ? 'text-amber-800 font-bold' : 'text-slate-800 hover:text-amber-800'
            }`}
            id="nav-link-stars"
            title="睇片儲星與消耗規則"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>星星幣</span>
          </button>

          {/* 5. 付費會員專區 */}
          <button
            type="button"
            onClick={() => setCurrentView('pricing')}
            className={`bg-transparent border-0 text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'pricing' ? 'text-amber-800 font-bold' : 'text-slate-800 hover:text-amber-800'
            }`}
            id="nav-link-pricing"
            title="付費會員專區 · 潛意識天體星盤"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>付費會員專區</span>
          </button>

          {/* 6. 私隱 */}
          <button
            type="button"
            onClick={() => setCurrentView('privacy')}
            className={`bg-transparent border-0 text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'privacy' ? 'text-emerald-700 font-bold' : 'text-slate-800 hover:text-emerald-700'
            }`}
            id="nav-link-privacy"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>私隱</span>
          </button>

          {/* 新手引導 (Onboarding Tour Modal) */}
          {onOpenOnboarding && (
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="bg-transparent border-0 text-[13px] text-blue-700 hover:text-blue-800 cursor-pointer flex items-center gap-1 font-bold"
              id="nav-link-onboarding"
              title="查看新手引導教學"
            >
              <span>✨ 引導</span>
            </button>
          )}

          {/* 7. 控制室 (嚴格限定管理員及高級管理員可見，其餘會員與非管理員完全不顯示) */}
          {isManagement && (
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`bg-transparent border-0 text-[14px] font-medium cursor-pointer flex items-center gap-1.5 transition-colors ${
                currentView === 'admin' ? 'text-[#1D4ED8] font-bold' : 'text-[#0284C7] hover:text-[#1D4ED8]'
              }`}
              id="nav-link-admin"
              title="管理員控制室"
            >
              <BookOpen className="w-4 h-4 text-[#0284C7]" />
              <span>控制室</span>
            </button>
          )}

          {/* Quota status visualization */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#BAE6FD] text-[11px] font-mono shadow-xs">
              {isPaid ? (
                <span className="text-[#059669] flex items-center gap-1 font-semibold">
                  <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>VIP 無限存檔</span>
                </span>
              ) : (
                <span className="text-[#B45309] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>已儲存 {Math.min(3, savedDreamCount)}/3 條夢境</span>
                </span>
              )}
            </div>
          )}

          {/* General Member Stars Counter & Video Earning CTA */}
          {currentUser && normRole === 'free' && onOpenEarnStars && (
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 hover:bg-amber-100 transition-all text-xs text-amber-800 flex items-center gap-1.5 cursor-pointer shadow-xs font-semibold"
              title="點擊觀看身心靈短片儲星星 ⭐"
              id="nav-earn-stars-btn"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{currentUser.stars ?? 2} 星</span>
              <span className="text-[10px] bg-amber-200/80 px-1 py-0.2 rounded text-amber-900 font-bold">
                +儲星
              </span>
            </button>
          )}

          {/* Paid Member Badge */}
          {currentUser && normRole === 'paid' && (
            <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-1 font-semibold">
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>付費會員</span>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2" id="nav-user-profile">
              <button
                type="button"
                onClick={() => setCurrentView('app')}
                className="navpill"
                title={`登入帳戶: ${currentUser.email} (${getRoleDisplayName(currentUser.role)})`}
                id="nav-current-user-btn"
              >
                <UserCircle className="w-4 h-4 text-[#2563EB]" />
                <span className="max-w-[120px] truncate text-[#1E3A8A] font-semibold">
                  {currentUser.display_name || currentUser.email.split('@')[0]}
                </span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="btn2 text-xs text-[#4B6B94] hover:text-[#1E3A8A] cursor-pointer"
                title="登出或切換帳戶"
                id="nav-logout-btn"
              >
                登出
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="btn2 text-xs text-blue-700 hover:text-blue-900 border-blue-200 bg-blue-50/60 hover:bg-blue-100 cursor-pointer"
                title="切換帳戶"
                id="nav-switch-user-btn"
              >
                切換
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-4 py-1.5 rounded-full border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              id="nav-login-btn"
            >
              <UserCircle className="w-4 h-4 text-white" />
              <span>登入</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
