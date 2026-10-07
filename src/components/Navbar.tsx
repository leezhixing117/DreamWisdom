import React, { useState } from 'react';
import { User, normalizeRole, getRoleDisplayName } from '../types';
import {
  Sparkles,
  BookOpen,
  Dna,
  Key,
  ShoppingBag,
  HelpCircle,
  Menu,
  X,
  UserCircle,
  Crown,
  LogOut,
  LogIn,
} from 'lucide-react';
import { CelestialLogo } from './CelestialLogo';

interface NavbarProps {
  currentView: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars';
  setCurrentView: (view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars') => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
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
  activeSection,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  const handleNav = (target: 'workspace' | 'history' | 'dna' | 'mystery' | 'store' | 'faq') => {
    setMobileMenuOpen(false);

    if (target === 'store') {
      setCurrentView('store');
      return;
    }

    if (target === 'faq') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Dream workspace sections
    if (target === 'workspace') {
      if (currentView === 'home') {
        const heroInput = document.getElementById('recorddream');
        if (heroInput) {
          heroInput.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      if (onNavigateSection) {
        onNavigateSection('workspace');
      } else {
        setCurrentView('app');
      }
      return;
    }

    if (target === 'history') {
      if (onNavigateSection) {
        onNavigateSection('history');
      } else {
        setCurrentView('app');
      }
      return;
    }

    if (target === 'dna') {
      if (onNavigateSection) {
        onNavigateSection('dna');
      } else {
        setCurrentView('app');
      }
      return;
    }

    if (target === 'mystery') {
      if (onNavigateSection) {
        onNavigateSection('mystery');
      } else {
        setCurrentView('app');
      }
      return;
    }
  };

  return (
    <nav className="nav sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs" id="main-navbar">
      <div className="shell flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        {/* LOGO */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            setCurrentView('home');
          }}
          className="brand bg-transparent border-0 text-left p-0 cursor-pointer flex items-center hover:opacity-90 transition-opacity"
          id="nav-brand-btn"
          title="DreamWisdom 首頁"
        >
          <CelestialLogo size="sm" showText={true} />
        </button>

        {/* 9. 電腦版導航欄：記錄夢境｜我的夢庫｜DREAM DNA｜30晚潛意識檔案｜解夢選物店｜FAQ */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2" id="nav-links-group">
          {/* 1. 記錄夢境 */}
          <button
            type="button"
            onClick={() => handleNav('workspace')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              (currentView === 'app' && activeSection === 'workspace') || currentView === 'home'
                ? 'text-sky-700 bg-sky-50/80 font-bold'
                : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50/50'
            }`}
            id="nav-link-record"
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>記錄夢境</span>
          </button>

          {/* 2. 我的夢庫 */}
          <button
            type="button"
            onClick={() => handleNav('history')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'app' && activeSection === 'history'
                ? 'text-sky-700 bg-sky-50/80 font-bold'
                : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50/50'
            }`}
            id="nav-link-history"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>我的夢庫</span>
          </button>

          {/* 3. DREAM DNA */}
          <button
            type="button"
            onClick={() => handleNav('dna')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'app' && activeSection === 'dna'
                ? 'text-sky-700 bg-sky-50/80 font-bold'
                : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50/50'
            }`}
            id="nav-link-dna"
          >
            <Dna className="w-4 h-4 text-sky-600" />
            <span>DREAM DNA</span>
          </button>

          {/* 4. 30晚潛意識檔案 */}
          <button
            type="button"
            onClick={() => handleNav('mystery')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-[14px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              currentView === 'app' && activeSection === 'mystery'
                ? 'text-sky-700 bg-sky-50/80 font-bold'
                : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50/50'
            }`}
            id="nav-link-30nights"
          >
            <Key className="w-4 h-4 text-sky-600" />
            <span>30晚潛意識檔案</span>
          </button>

          {/* 5. 解夢選物店 */}
          <button
            type="button"
            onClick={() => handleNav('store')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-[13px] font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs ${
              currentView === 'store'
                ? 'bg-sky-700 text-white shadow-sm ring-2 ring-sky-300'
                : 'bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 hover:border-sky-300'
            }`}
            id="nav-link-store"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>解夢選物店</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200 text-sky-900 font-bold uppercase font-mono">
              SHOP
            </span>
          </button>

          {/* 6. FAQ */}
          <button
            type="button"
            onClick={() => handleNav('faq')}
            className="min-h-[44px] px-3 py-2 rounded-xl text-[14px] font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50/50 cursor-pointer flex items-center gap-1.5 transition-colors"
            id="nav-link-faq"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>FAQ</span>
          </button>

          {/* Admin link if manager */}
          {isManagement && (
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className="min-h-[44px] px-2.5 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 cursor-pointer ml-1"
            >
              控制室
            </button>
          )}
        </div>

        {/* User Auth & Actions */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2" id="nav-user-profile">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs text-sky-900 font-medium">
                {isPaid ? (
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                ) : (
                  <UserCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                )}
                <span className="max-w-[100px] truncate font-semibold">
                  {currentUser.display_name || currentUser.email.split('@')[0]}
                </span>
                {isPaid && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold">VIP</span>}
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="min-h-[44px] px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:text-sky-800 hover:bg-slate-100 font-medium transition-colors cursor-pointer flex items-center gap-1"
                title="登出帳戶"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">登出</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              id="nav-login-btn"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>登入</span>
            </button>
          )}

          {/* 9. 手機漢堡選單按鈕（觸控區 ≥ 44px） */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-sky-200 text-slate-700 hover:bg-sky-50 hover:text-sky-800 flex items-center justify-center cursor-pointer transition-colors"
            id="nav-mobile-toggle-btn"
            aria-label="打開選單"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-sky-800" /> : <Menu className="w-6 h-6 text-sky-800" />}
          </button>
        </div>
      </div>

      {/* 9. 手機漢堡選單展開抽屜（嚴格符合：記錄夢境｜我的夢庫｜DREAM DNA｜30晚潛意識檔案｜解夢選物店｜FAQ） */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-drawer"
          className="lg:hidden border-t border-sky-100 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-fadeIn"
        >
          <div className="text-[11px] font-bold text-sky-800 px-3 py-1 uppercase tracking-wider font-mono">
            選單導航
          </div>

          {/* 1. 記錄夢境 */}
          <button
            type="button"
            onClick={() => handleNav('workspace')}
            className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors ${
              (currentView === 'app' && activeSection === 'workspace') || currentView === 'home'
                ? 'bg-sky-100 text-sky-900 font-extrabold'
                : 'text-slate-800 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>記錄夢境</span>
          </button>

          {/* 2. 我的夢庫 */}
          <button
            type="button"
            onClick={() => handleNav('history')}
            className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors ${
              currentView === 'app' && activeSection === 'history'
                ? 'bg-sky-100 text-sky-900 font-extrabold'
                : 'text-slate-800 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>我的夢庫</span>
          </button>

          {/* 3. DREAM DNA */}
          <button
            type="button"
            onClick={() => handleNav('dna')}
            className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors ${
              currentView === 'app' && activeSection === 'dna'
                ? 'bg-sky-100 text-sky-900 font-extrabold'
                : 'text-slate-800 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Dna className="w-4 h-4" />
            </div>
            <span>DREAM DNA</span>
          </button>

          {/* 4. 30晚潛意識檔案 */}
          <button
            type="button"
            onClick={() => handleNav('mystery')}
            className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors ${
              currentView === 'app' && activeSection === 'mystery'
                ? 'bg-sky-100 text-sky-900 font-extrabold'
                : 'text-slate-800 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <span>30晚潛意識檔案</span>
          </button>

          {/* 5. 解夢選物店 */}
          <button
            type="button"
            onClick={() => handleNav('store')}
            className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-colors ${
              currentView === 'store'
                ? 'bg-sky-700 text-white font-extrabold'
                : 'bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-sky-700 shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>解夢選物店</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 font-bold uppercase font-mono">
              SHOP
            </span>
          </button>

          {/* 6. FAQ */}
          <button
            type="button"
            onClick={() => handleNav('faq')}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-sm font-bold text-slate-800 hover:bg-sky-50 hover:text-sky-900 flex items-center gap-3 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span>FAQ 常見問題</span>
          </button>

          {currentUser && (
            <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs px-2 text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <UserCircle className="w-4 h-4 text-sky-600" />
                <span>已登入：{currentUser.display_name || currentUser.email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="min-h-[44px] px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold"
              >
                登出
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
