import React, { useState } from 'react';
import { User, UserRole, normalizeRole, getRoleDisplayName, BannedRecord } from '../types';
import { trackLoginEvent } from '../utils/auditLogger';
import {
  Moon,
  X,
  Shield,
  Sparkles,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Star,
  Crown,
  Settings,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Zap,
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
  onResetPassword,
}) => {
  // Tabs: 'google_quick' | 'password_login' | 'forgot_password'
  const [activeTab, setActiveTab] = useState<'quick' | 'password_login' | 'forgot_password'>('quick');

  // Helper to check if an email is in the blacklist
  const isEmailBanned = (email: string) => {
    const norm = email.trim().toLowerCase();
    // Never ban the super admin
    if (norm === 'mysticblaza@gmail.com') return false;
    return bannedRecords.some((b) => b.email.trim().toLowerCase() === norm);
  };

  // Find super user or fallback
  const superUser: User = availableUsers.find((u) => u.email.toLowerCase() === 'mysticblaza@gmail.com') || {
    id: 'user_super_mystic',
    email: 'mysticblaza@gmail.com',
    display_name: 'Mystic Blaza',
    role: 'super_admin' as UserRole,
    password: 'Abc123',
    stars: 999,
    created_at: '2026-09-01T08:00:00Z',
  };

  // Find general free user (regular user) or fallback
  const freeUser: User = availableUsers.find((u) => normalizeRole(u.role) === 'free') || {
    id: 'user_free',
    email: 'free.user@gmail.com',
    display_name: 'Chris (一般會員)',
    role: 'free' as UserRole,
    password: 'Abc123',
    stars: 6,
    created_at: '2026-09-10T14:15:00Z',
  };

  // Login form state (default pre-filled with general user email for easy login)
  const [loginEmail, setLoginEmail] = useState('free.user@gmail.com');
  const [loginPassword, setLoginPassword] = useState('Abc123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle direct login for a user object (Google / Quick Select)
  const handleDirectLogin = (user: User) => {
    setBusy(true);
    setErrorMessage(null);

    if (isEmailBanned(user.email)) {
      setErrorMessage(`⚠️ 此帳號 (${user.email}) 已被停權封禁，無法登入。`);
      setBusy(false);
      return;
    }

    // Ensure user has valid structure
    const targetUser: User = {
      ...user,
      is_banned: false, // Ensure unbanned on explicit login
    };

    setTimeout(() => {
      setBusy(false);
      trackLoginEvent(targetUser, 'quick_select', 'success');
      onLogin(targetUser);
      onClose();
    }, 120);
  };

  // Handle password login submit
  const handlePasswordLoginSubmit = (e?: React.FormEvent, skipPasswordCheck = false) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailTrimmed = (loginEmail || '').trim().toLowerCase();
    if (!emailTrimmed) {
      setErrorMessage('請輸入電子郵件 (Email)');
      return;
    }

    if (isEmailBanned(emailTrimmed)) {
      setErrorMessage('⚠️ 此電子郵件已被系統封禁停權，無法登入。如有疑問請聯絡系統支援。');
      return;
    }

    setBusy(true);
    setTimeout(() => {
      setBusy(false);

      const existing = availableUsers.find(
        (u) => u.email.toLowerCase() === emailTrimmed
      );

      if (existing) {
        // Log in existing user
        const loggedUser: User = {
          ...existing,
          is_banned: false,
          password: loginPassword || existing.password || 'Abc123',
        };
        trackLoginEvent(loggedUser, 'password', 'success');
        onLogin(loggedUser);
        onClose();
      } else {
        // Auto register new user with whatever email and password entered
        const newUser: User = {
          id: 'user_' + Date.now(),
          email: loginEmail.trim(),
          display_name: loginEmail.trim().split('@')[0],
          role: 'free',
          password: loginPassword || 'Abc123',
          stars: 6,
          created_at: new Date().toISOString(),
        };
        trackLoginEvent(newUser, 'auto_registered', 'success');
        onLogin(newUser);
        onClose();
      }
    }, 120);
  };

  // Handle forgot password reset
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = forgotEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setErrorMessage('請輸入你的註冊 E-mail');
      return;
    }
    if (!newPassword || newPassword.length < 3) {
      setErrorMessage('請設定新密碼');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('兩次輸入的新密碼不相符，請再次確認');
      return;
    }

    if (onResetPassword) {
      onResetPassword(emailTrimmed, newPassword);
    }

    setForgotSuccess(true);
    setSuccessMessage(`✅ 密碼更新成功！請使用新密碼登入。`);
    setLoginEmail(emailTrimmed);
    setLoginPassword(newPassword);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto cursor-pointer"
      id="login-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="loginbox relative max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900/98 border border-slate-700 text-white shadow-2xl cursor-default"
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

        <div className="flex justify-center mb-1">
          <CelestialLogo size="lg" showText={false} />
        </div>

        <h2 className="font-celestial-serif font-black text-2xl sm:text-3xl text-center text-white mb-1.5 mt-2">
          登入 DreamWisdom
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm text-center leading-relaxed max-w-md mx-auto mb-5">
          歡迎探索心靈解夢宇宙。支援 Google 一鍵登入、角色快速切換，或輸入自訂帳號登入/註冊。
        </p>

        {/* 1. 頂部最高優先：Google 一鍵快速登入（一般使用者 & 管理員雙選項） */}
        <div className="mb-5 space-y-2">
          {/* 一般使用者 Google 一鍵登入 */}
          <button
            type="button"
            onClick={() => handleDirectLogin(freeUser)}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-between gap-2.5 cursor-pointer shadow-lg shadow-black/20 hover:shadow-xl transition-all active:scale-[0.99] border border-slate-200"
            id="btn-google-one-click-free"
            title="以一般使用者 Google 帳號一鍵登入"
          >
            <div className="flex items-center gap-2.5 truncate">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="truncate">Google 一鍵登入 (使用者: free.user@gmail.com)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold shrink-0">
              一般會員
            </span>
          </button>

          {/* 管理員 Google 一鍵登入（折疊或次要按鈕） */}
          <button
            type="button"
            onClick={() => handleDirectLogin(superUser)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center justify-between gap-2 cursor-pointer border border-slate-700 transition-colors"
            id="btn-google-one-click-admin"
            title="以高級管理員帳號登入系統控制室"
          >
            <div className="flex items-center gap-2 truncate">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="truncate text-[11px]">以高級管理員登入 (mysticblaza@gmail.com)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-600/40 shrink-0">
              管理後台
            </span>
          </button>
        </div>

        {/* 分隔線 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">或選擇其他登入 / 註冊方式</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-4 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quick');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ 快速選取 4 種角色
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('password_login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'password_login'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔐 帳號登入 / 快速註冊
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot_password');
              setErrorMessage(null);
              setForgotSuccess(false);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'forgot_password'
                ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📧 忘記密碼
          </button>
        </div>

        {/* Error / Success Notifications */}
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

        {/* TAB 1: Quick Role Switcher (4 Level Accounts - 一般會員優先) */}
        {activeTab === 'quick' && (
          <div className="space-y-2.5 text-left" id="login-quick-demo-list">
            {/* 1. 一般會員 (使用者) */}
            <button
              type="button"
              onClick={() => handleDirectLogin(freeUser)}
              className="w-full p-3 rounded-2xl border border-amber-500/40 bg-amber-950/25 hover:bg-amber-900/35 transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
              id="login-role-free-user"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-300/40" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <span>⭐ 一般會員 (使用者) · {freeUser.email}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    常規使用者：體驗解夢、記錄夢庫、DREAM DNA、睇廣告儲星星幣
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold shrink-0">
                一鍵登入
              </span>
            </button>

            {/* 2. 付費會員 (VIP) */}
            {(() => {
              const paidUser = availableUsers.find((u) => normalizeRole(u.role) === 'paid') || {
                id: 'demo_paid',
                email: 'pro.dreamer@gmail.com',
                display_name: 'Elena (付費會員)',
                role: 'paid' as UserRole,
                password: 'Abc123',
                stars: 999,
              };
              return (
                <button
                  type="button"
                  onClick={() => handleDirectLogin(paidUser)}
                  className="w-full p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
                  id="login-role-paid-user"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                        <span>💎 付費會員 (VIP) · {paidUser.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        VIP 特權：天體星盤無限次撥盤、全站免廣告、免扣星深度解夢與無限存檔
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold shrink-0">
                    一鍵登入
                  </span>
                </button>
              );
            })()}

            {/* 3. 高級管理員 */}
            <button
              type="button"
              onClick={() => handleDirectLogin(superUser)}
              className="w-full p-3 rounded-2xl border border-blue-500/40 bg-blue-950/30 hover:bg-blue-900/40 transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
              id="login-role-super-admin"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                    <span>👑 高級管理員 · {superUser.email}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    最高權限：後台控制室、全免扣星、天體星盤、會員審批與管理
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 font-bold shrink-0">
                一鍵登入
              </span>
            </button>

            {/* 4. 內容管理員 */}
            {(() => {
              const adminUser = availableUsers.find((u) => normalizeRole(u.role) === 'admin') || {
                id: 'demo_admin',
                email: 'admin@dreamwisdom.com',
                display_name: 'Alex (內容管理員)',
                role: 'admin' as UserRole,
                password: 'Abc123',
                stars: 999,
              };
              return (
                <button
                  type="button"
                  onClick={() => handleDirectLogin(adminUser)}
                  className="w-full p-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30 transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
                  id="login-role-content-admin"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                        <span>🛠️ 內容管理員 · {adminUser.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        免星解鎖全功能，支援商品與百科內容維護管理
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-bold shrink-0">
                    一鍵登入
                  </span>
                </button>
              );
            })()}
          </div>
        )}

        {/* TAB 2: Password Login Form */}
        {activeTab === 'password_login' && (
          <form onSubmit={(e) => handlePasswordLoginSubmit(e)} className="space-y-3.5 text-left" id="password-login-form">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-medium">
                  電子郵件 (EMAIL)
                </label>
                <div className="flex items-center gap-1.5 text-[11px] text-sky-400">
                  <span>快速填入：</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('free.user@gmail.com');
                      setLoginPassword('Abc123');
                    }}
                    className="hover:underline cursor-pointer font-medium text-amber-300"
                    title="填入一般使用者帳號"
                  >
                    ⭐ 使用者
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('pro.dreamer@gmail.com');
                      setLoginPassword('Abc123');
                    }}
                    className="hover:underline cursor-pointer font-medium text-emerald-300"
                    title="填入 VIP 會員帳號"
                  >
                    💎 VIP
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('mysticblaza@gmail.com');
                      setLoginPassword('Abc123');
                    }}
                    className="hover:underline cursor-pointer font-medium text-blue-300"
                    title="填入高級管理員帳號"
                  >
                    👑 管理員
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="請輸入 Email (例如: free.user@gmail.com 或任意新信箱)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                  id="login-input-email"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-medium">
                  密碼 (Password)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot_password');
                    setForgotEmail(loginEmail);
                  }}
                  className="text-[11px] text-amber-300 hover:underline cursor-pointer"
                >
                  忘記密碼？
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="輸入密碼 (預設密碼 Abc123 或任意自訂密碼)"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                  id="login-input-password"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  title={showPassword ? '隱藏密碼' : '顯示密碼'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                提示：若輸入未註冊 Email，系統將為您<span className="text-amber-300 font-semibold">自動建立一般使用者帳號</span>並直接登入。
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={busy}
                className="btn flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold"
                id="btn-submit-password-login"
              >
                {busy ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>登入中…</span>
                  </>
                ) : (
                  <>
                    <span>帳號密碼登入</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => handlePasswordLoginSubmit(e, true)}
                className="btn2 text-xs py-2.5 px-3 flex items-center justify-center gap-1 text-amber-300 border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 cursor-pointer font-bold"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                <span>免密直接登入</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Forgot Password by Email */}
        {activeTab === 'forgot_password' && (
          <div className="text-left space-y-3.5" id="forgot-password-panel">
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-200 text-xs">
              <span className="font-bold block mb-1">📧 E-mail 密碼重設</span>
              輸入你的 Email 地址與新密碼，系統將立即為你更新登入密碼。
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">
                    註冊電子郵件 (EMAIL)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="請輸入你的註冊 Email"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">
                    設定新密碼
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="輸入新密碼 (例如：Abc123 或自訂密碼)"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">
                    再次確認新密碼
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="再次輸入新密碼"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quick')}
                    className="btn2 text-xs py-2 px-3 flex-1 justify-center cursor-pointer text-slate-300"
                  >
                    返回快速登入
                  </button>
                  <button
                    type="submit"
                    className="btn text-xs py-2 px-4 flex-1 justify-center cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold"
                  >
                    確認更新密碼
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">密碼已成功更新！</h3>
                <p className="text-xs text-slate-300">
                  你現在可以使用更新後的新密碼登入你的帳戶。
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('password_login')}
                  className="btn text-xs py-2.5 px-6 mx-auto inline-flex items-center gap-1.5 cursor-pointer bg-blue-600 text-white font-bold"
                >
                  <span>立即以新密碼登入</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-slate-700/60 text-center">
          <p className="text-[11px] text-slate-400">
            DreamWisdom 採用無痕本地安全驗證，支援 Google 快速登入及預設密碼 <code className="text-amber-300">Abc123</code>。
          </p>
        </div>
      </div>
    </div>
  );
};
