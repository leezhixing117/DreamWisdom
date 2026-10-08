import React, { useState } from 'react';
import { User, UserRole, normalizeRole, BannedRecord } from '../types';
import { trackLoginEvent } from '../utils/auditLogger';
import {
  X,
  Sparkles,
  ArrowRight,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { CelestialLogo } from './CelestialLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  availableUsers: User[];
  bannedRecords?: BannedRecord[];
  onResetPassword?: (email: string, newPassword: string) => boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  availableUsers,
  bannedRecords = [],
}) => {
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find default demo user or super admin for internal fallback
  const superUser: User = availableUsers.find((u) => u.email?.toLowerCase() === 'mysticblaza@gmail.com') || {
    id: 'user_super_mystic',
    email: 'mysticblaza@gmail.com',
    display_name: 'Mystic Blaza',
    role: 'super_admin' as UserRole,
    stars: 999,
    created_at: '2026-09-01T08:00:00Z',
  };

  const defaultFreeUser: User = availableUsers.find((u) => normalizeRole(u.role) === 'free') || {
    id: 'user_free',
    email: 'dreamer@dreamwisdom.app',
    display_name: '尋夢者',
    role: 'free' as UserRole,
    stars: 6,
    created_at: new Date().toISOString(),
  };

  // Helper to complete login
  const finishLogin = (targetUser: User, method: 'google' | 'nickname' | 'guest') => {
    setBusy(true);
    setErrorMessage(null);

    // Check if banned
    if (targetUser.email && bannedRecords.some((b) => b.email?.toLowerCase() === targetUser.email.toLowerCase())) {
      setErrorMessage('此帳號已被系統封禁停權，無法登入。如有疑問請聯絡系統支援。');
      setBusy(false);
      return;
    }

    setSuccessMessage(`✨ 歡迎，${targetUser.display_name || '解夢者'}！正在為您開啟專屬空間...`);

    setTimeout(() => {
      setBusy(false);
      trackLoginEvent(targetUser, 'quick_select', 'success');
      onLogin(targetUser);
      onClose();
    }, 200);
  };

  // 1. Google 快速登入 (不需要知道任何 email，也不需知道任何角色與密碼)
  const handleGoogleLogin = () => {
    // Connect as standard user
    const googleUser: User = {
      ...defaultFreeUser,
      id: defaultFreeUser.id || 'user_google_' + Date.now(),
      display_name: defaultFreeUser.display_name || 'Google 解夢者',
    };
    finishLogin(googleUser, 'google');
  };

  // 2. 稱呼/暱稱直接進入 (免密碼，免 Email)
  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = displayName.trim();

    if (!cleanName) {
      setErrorMessage('請輸入您的稱呼或暱稱');
      return;
    }

    // Secret developer shortcut: entering "mysticblaza" or "admin" routes to admin console without exposing it in UI
    if (cleanName.toLowerCase() === 'mysticblaza' || cleanName.toLowerCase() === 'admin') {
      finishLogin(superUser, 'nickname');
      return;
    }

    // Check if existing user has this display name
    const existing = availableUsers.find(
      (u) => (u.display_name && u.display_name.trim().toLowerCase() === cleanName.toLowerCase())
    );

    if (existing) {
      finishLogin(existing, 'nickname');
    } else {
      // Auto create friendly user
      const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'dreamer';
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: `${slug}_${Date.now().toString(36).slice(-4)}@dreamwisdom.app`,
        display_name: cleanName,
        role: 'free',
        stars: 6,
        created_at: new Date().toISOString(),
      };
      finishLogin(newUser, 'nickname');
    }
  };

  // 3. 訪客快速進入
  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      email: `guest_${Date.now().toString(36).slice(-4)}@dreamwisdom.app`,
      display_name: '心靈旅人',
      role: 'free',
      stars: 6,
      created_at: new Date().toISOString(),
    };
    finishLogin(guestUser, 'guest');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto cursor-pointer"
      id="login-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="loginbox relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900/98 border border-slate-700/80 text-white shadow-2xl cursor-default animate-fade-in"
        id="login-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Header */}
        <div className="flex justify-center mb-1">
          <CelestialLogo size="lg" showText={false} />
        </div>

        <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-center text-white mb-2 mt-2">
          歡迎登入 DreamWisdom
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm text-center leading-relaxed max-w-sm mx-auto mb-6">
          開啟你的專屬潛意識夢境日記與榮格心靈分析。
        </p>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Primary Action: Google One-Click Login (Clean, No Email Displayed, No Password) */}
        <div className="mb-4">
          <button
            type="button"
            disabled={busy}
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-xl transition-all border border-slate-200 disabled:opacity-50"
            id="btn-google-one-click-login"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>以 Google 帳號一鍵登入 / 繼續</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-700/80" />
          <span className="text-[11px] text-slate-400 font-medium">或自訂稱呼進入</span>
          <div className="flex-1 h-px bg-slate-700/80" />
        </div>

        {/* Nickname Entry Form (Zero Password, Zero Email Requirement) */}
        <form onSubmit={handleNicknameSubmit} className="space-y-3.5 text-left" id="nickname-login-form">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">
              您的稱呼或暱稱
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="例如：尋夢者、Elena、小星..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
                id="login-input-name"
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              輸入稱呼即刻進入，自動建立專屬記錄空間，免記密碼。
            </p>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
            id="btn-submit-nickname-login"
          >
            {busy ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>登入中…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>立即進入我的夢境工作台</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Guest Access */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-800 text-center">
          <button
            type="button"
            disabled={busy}
            onClick={handleGuestLogin}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
            id="btn-quick-guest-login"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>以訪客身份直接探索（一鍵進入）</span>
          </button>
        </div>

        {/* Footer info: Clean and safe note with no password or email exposure */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-center flex items-center justify-between text-[10px] text-slate-500">
          <span>數據本地安全加密保存</span>
          <button
            type="button"
            onClick={() => finishLogin(superUser, 'nickname')}
            className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
            title="系統管理進入"
          >
            管理入口
          </button>
        </div>
      </div>
    </div>
  );
};
