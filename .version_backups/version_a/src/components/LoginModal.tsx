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
  ShieldBan,
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
  // Tabs: 'password_login' | 'quick' | 'forgot_password'
  const [activeTab, setActiveTab] = useState<'password_login' | 'quick' | 'forgot_password'>('password_login');

  // Helper to check if an email is in the blacklist
  const isEmailBanned = (email: string) => {
    const norm = email.trim().toLowerCase();
    return bannedRecords.some((b) => b.email.trim().toLowerCase() === norm);
  };

  const getBanInfo = (email: string) => {
    const norm = email.trim().toLowerCase();
    return bannedRecords.find((b) => b.email.trim().toLowerCase() === norm);
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('Abc123'); // Default password for all users
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

  // Handle password login
  const handlePasswordLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailTrimmed = loginEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setErrorMessage('請輸入電子郵件 (Email)');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('請輸入登入密碼（所有人預設密碼為 Abc123）');
      return;
    }

    // 1. Check if email is in the blacklist (Forbid re-registering and forbid login)
    if (isEmailBanned(emailTrimmed)) {
      const banInfo = getBanInfo(emailTrimmed);
      setErrorMessage(
        `🚫 此帳號或 Email 已被高級管理員列入永久黑名單，禁止登記與登入！（原因：${
          banInfo?.reason || '違反社群守則'
        }）如有疑問請聯絡管理團隊。`
      );
      return;
    }

    setBusy(true);
    setTimeout(() => {
      setBusy(false);

      const existing = availableUsers.find(
        (u) => u.email.toLowerCase() === emailTrimmed
      );

      if (existing) {
        // Check if existing user is banned
        if (existing.is_banned) {
          setErrorMessage(
            `🚫 此帳號已被高級管理員封禁停權（原因：${
              existing.banned_reason || '帳號異常限制'
            }），禁止登入！`
          );
          return;
        }

        const targetPass = existing.password || 'Abc123';
        if (loginPassword !== targetPass) {
          setErrorMessage('登入密碼不正確！現階段所有人預設密碼為 Abc123。如忘記密碼，可點擊下方「忘記密碼？可用 E-mail 重設」。');
          return;
        }

        trackLoginEvent(existing, 'password', 'success');
        onLogin(existing);
        onClose();
      } else {
        // Double-check blacklist before auto-registering
        if (isEmailBanned(emailTrimmed)) {
          setErrorMessage('🚫 此 Email 電子郵件已被高級管理員列入黑名單，禁止再次登記！');
          return;
        }

        // Auto register as general member with default Abc123
        const newUser: User = {
          id: 'user_' + Date.now(),
          email: loginEmail.trim(),
          display_name: loginEmail.split('@')[0],
          role: 'free',
          password: loginPassword,
          stars: 6,
          created_at: new Date().toISOString(),
        };
        trackLoginEvent(newUser, 'auto_registered', 'success');
        onLogin(newUser);
        onClose();
      }
    }, 200);
  };

  // Handle quick login (auto prefill email & password Abc123)
  const handleQuickSelect = (user: User) => {
    setBusy(true);
    setErrorMessage(null);

    const emailTrimmed = user.email.trim().toLowerCase();
    if (user.is_banned || isEmailBanned(emailTrimmed)) {
      setBusy(false);
      setErrorMessage(`🚫 登入被拒絕：會員「${user.email}」已被高級管理員封禁停權，禁止登入！`);
      return;
    }

    setTimeout(() => {
      setBusy(false);
      trackLoginEvent(user, 'quick_select', 'success');
      onLogin(user);
      onClose();
    }, 200);
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
    if (!newPassword || newPassword.length < 4) {
      setErrorMessage('請設定至少 4 位元之新密碼');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('兩次輸入的新密碼不相符，請再次確認');
      return;
    }

    if (onResetPassword) {
      const ok = onResetPassword(emailTrimmed, newPassword);
      if (!ok) {
        // User not in list yet, create or report
        setErrorMessage(`找不到與「${emailTrimmed}」關聯之帳戶。請檢查電子郵件拼寫，或直接返回登入註冊。`);
        return;
      }
    }

    setForgotSuccess(true);
    setSuccessMessage(`✅ 密碼重設成功！已透過 E-mail 安全驗證並更新密碼。請使用新密碼登入。`);
    setLoginEmail(emailTrimmed);
    setLoginPassword(newPassword);
  };

  return (
    <div className="modalback" id="login-modal-backdrop" onClick={onClose}>
      <div
        className="loginbox relative max-w-lg w-full p-6 sm:p-8"
        id="login-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#aab3d2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-2">
          <CelestialLogo size="lg" showText={false} />
        </div>

        <h1 className="font-celestial-serif font-black text-2xl sm:text-3xl text-celestial-grad mb-1.5 mt-2">
          登入 DreamWisdom
        </h1>
        <p className="text-[#4B6B94] text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-4">
          所有人需要密碼登入，目前預設密碼為 <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold">Abc123</code>。如忘記密碼，可隨時透過 E-mail 驗證重設。
        </p>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-4 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('password_login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'password_login'
                ? 'bg-[#aa9cff]/20 text-white font-semibold shadow-sm'
                : 'text-[#aab3d2] hover:text-white'
            }`}
          >
            🔐 帳號密碼登入
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('quick');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-[#aa9cff]/20 text-white font-semibold shadow-sm'
                : 'text-[#aab3d2] hover:text-white'
            }`}
          >
            ⚡ 快速體驗 4 種等級
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
                ? 'bg-amber-400/20 text-amber-300 font-semibold shadow-sm'
                : 'text-[#aab3d2] hover:text-white'
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

        {/* TAB 1: Password Login Form */}
        {activeTab === 'password_login' && (
          <form onSubmit={handlePasswordLoginSubmit} className="space-y-3.5 text-left" id="password-login-form">
            <div>
              <label className="text-xs text-[#cbd2ef] block mb-1 font-medium">
                電子郵件 (EMAIL) <span className="text-[#ff8b9d]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="例如：free.user@gmail.com 或 mysticblaza@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                  id="login-input-email"
                />
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#cbd2ef] font-medium">
                  密碼 (Password) <span className="text-[#ff8b9d]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot_password');
                    setForgotEmail(loginEmail);
                  }}
                  className="text-[11px] text-amber-300 hover:underline cursor-pointer"
                >
                  忘記密碼？可用 e-mail 重設
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="預設密碼為 Abc123"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                  id="login-input-password"
                />
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-white/40 hover:text-white cursor-pointer"
                  title={showPassword ? '隱藏密碼' : '顯示密碼'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#8d97b5] mt-1">
                所有人密碼現已設定為：<code className="text-amber-300 font-mono font-bold">Abc123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
              id="btn-submit-password-login"
            >
              {busy ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>登入驗證中…</span>
                </>
              ) : (
                <>
                  <span>安全登入 DreamWisdom</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: Quick Demo Accounts List */}
        {activeTab === 'quick' && (
          <div className="space-y-2.5 text-left" id="login-quick-demo-list">
            <div className="text-[11px] text-[#8d97b5] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>點選帳戶（皆已設定預設密碼 Abc123）：</span>
              <span className="text-[#78e1b5]">一鍵載入登入</span>
            </div>

            {/* 1. 一般會員 */}
            {(() => {
              const freeUser = availableUsers.find((u) => normalizeRole(u.role) === 'free') || {
                id: 'demo_free',
                email: 'free.user@gmail.com',
                display_name: 'Chris (一般會員)',
                role: 'free' as UserRole,
                password: 'Abc123',
                stars: 6,
              };
              const isBanned = freeUser.is_banned || isEmailBanned(freeUser.email);
              return (
                <button
                  type="button"
                  onClick={() => handleQuickSelect(freeUser)}
                  className={`w-full p-3 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 group cursor-pointer ${
                    isBanned
                      ? 'border-red-500/30 bg-red-950/20 opacity-60'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#ffd27a]/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Star className="w-4 h-4 fill-amber-400/50" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        <span>一般會員 · free.user@gmail.com</span>
                        {isBanned && <span className="text-[10px] text-red-400 font-normal">🚫 已停權</span>}
                      </div>
                      <div className="text-[11px] text-[#cbd2ef] mt-0.5 leading-relaxed">
                        ✨ 特色：<b className="text-amber-300">初步分析需 3 星 · 直接深度需 6 星</b>。可睇片儲星（每次 +1 星）。
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                    isBanned ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                  }`}>
                    {isBanned ? '已停權' : '一般會員'}
                  </span>
                </button>
              );
            })()}

            {/* 2. 付費會員 */}
            {(() => {
              const paidUser = availableUsers.find((u) => normalizeRole(u.role) === 'paid') || {
                id: 'demo_paid',
                email: 'pro.dreamer@gmail.com',
                display_name: 'Elena (付費會員)',
                role: 'paid' as UserRole,
                password: 'Abc123',
                stars: 999,
              };
              const isBanned = paidUser.is_banned || isEmailBanned(paidUser.email);
              return (
                <button
                  type="button"
                  onClick={() => handleQuickSelect(paidUser)}
                  className={`w-full p-3 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 group cursor-pointer ${
                    isBanned
                      ? 'border-red-500/30 bg-red-950/20 opacity-60'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#78e1b5]/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#78e1b5]/10 border border-[#78e1b5]/25 flex items-center justify-center text-[#78e1b5] shrink-0 mt-0.5">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#78e1b5] transition-colors flex items-center gap-1.5">
                        <span>付費會員 (VIP) · pro.dreamer@gmail.com</span>
                        {isBanned && <span className="text-[10px] text-red-400 font-normal">🚫 已停權</span>}
                      </div>
                      <div className="text-[11px] text-[#cbd2ef] mt-0.5 leading-relaxed">
                        ✨ 特色：<b className="text-[#78e1b5]">全免扣星尊享特權</b>，無限次直接執行初步分析與 Dream Master 深度解夢。
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                    isBanned ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-[#78e1b5]/10 text-[#78e1b5] border-[#78e1b5]/30'
                  }`}>
                    {isBanned ? '已停權' : '付費會員'}
                  </span>
                </button>
              );
            })()}

            {/* 3. 內容管理員 */}
            {(() => {
              const adminUser = availableUsers.find((u) => normalizeRole(u.role) === 'admin') || {
                id: 'demo_admin',
                email: 'admin@dreamwisdom.com',
                display_name: 'Alex (內容管理員)',
                role: 'admin' as UserRole,
                password: 'Abc123',
                stars: 999,
              };
              const isBanned = adminUser.is_banned || isEmailBanned(adminUser.email);
              return (
                <button
                  type="button"
                  onClick={() => handleQuickSelect(adminUser)}
                  className={`w-full p-3 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 group cursor-pointer ${
                    isBanned
                      ? 'border-red-500/30 bg-red-950/20 opacity-60'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#71d9ff]/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#71d9ff]/10 border border-[#71d9ff]/25 flex items-center justify-center text-[#71d9ff] shrink-0 mt-0.5">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#71d9ff] transition-colors flex items-center gap-1.5">
                        <span>管理員 · admin@dreamwisdom.com</span>
                        {isBanned && <span className="text-[10px] text-red-400 font-normal">🚫 已停權</span>}
                      </div>
                      <div className="text-[11px] text-[#cbd2ef] mt-0.5 leading-relaxed">
                        ✨ 特色：<b className="text-[#71d9ff]">免星解鎖 + 可管理修改選物商品與內容</b>。
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                    isBanned ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-[#71d9ff]/10 text-[#71d9ff] border-[#71d9ff]/30'
                  }`}>
                    {isBanned ? '已停權' : '管理員'}
                  </span>
                </button>
              );
            })()}

            {/* 4. 高級管理員 */}
            {(() => {
              const superUser = availableUsers.find((u) => normalizeRole(u.role) === 'super_admin') || {
                id: 'demo_super',
                email: 'mysticblaza@gmail.com',
                display_name: 'Mystic Blaza',
                role: 'super_admin' as UserRole,
                password: 'Abc123',
                stars: 999,
              };
              const isBanned = superUser.is_banned || isEmailBanned(superUser.email);
              return (
                <button
                  type="button"
                  onClick={() => handleQuickSelect(superUser)}
                  className={`w-full p-3 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 group cursor-pointer ${
                    isBanned
                      ? 'border-red-500/30 bg-red-950/20 opacity-60'
                      : 'border-[#aa9cff]/30 bg-[#aa9cff]/[0.06] hover:bg-[#aa9cff]/[0.12]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#aa9cff]/20 border border-[#aa9cff]/40 flex items-center justify-center text-[#c3b9ff] shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#c3b9ff] transition-colors flex items-center gap-1.5">
                        <span>高級管理員 · mysticblaza@gmail.com</span>
                        {isBanned && <span className="text-[10px] text-red-400 font-normal">🚫 已停權</span>}
                      </div>
                      <div className="text-[11px] text-[#cbd2ef] mt-0.5 leading-relaxed">
                        ✨ 特色：<b className="text-[#c3b9ff]">最高管理權限</b>，可增減星星、DELETE會員、禁止登記&登入、審批商品。
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 font-semibold ${
                    isBanned ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-[#aa9cff]/20 text-[#c3b9ff] border-[#aa9cff]/40'
                  }`}>
                    {isBanned ? '已停權' : '高級管理員'}
                  </span>
                </button>
              );
            })()}
          </div>
        )}

        {/* TAB 3: Forgot Password by Email */}
        {activeTab === 'forgot_password' && (
          <div className="text-left space-y-3.5" id="forgot-password-panel">
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-200 text-xs">
              <span className="font-bold block mb-1">📧 E-mail 密碼重設指南</span>
              輸入你註冊的 Email 地址與期望設定的新密碼，系統將透過 Email 驗證確認並立即更新你的登入密碼。
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1 font-medium">
                    註冊電子郵件 (EMAIL) <span className="text-[#ff8b9d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="請輸入你的註冊 Email"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                    />
                    <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1 font-medium">
                    設定新密碼 <span className="text-[#ff8b9d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="輸入新密碼 (例如：Abc123 或自訂密碼)"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                    />
                    <KeyRound className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-white/40 hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1 font-medium">
                    再次確認新密碼 <span className="text-[#ff8b9d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="再次輸入新密碼"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                    />
                    <KeyRound className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('password_login')}
                    className="btn2 text-xs py-2 px-3 flex-1 justify-center cursor-pointer"
                  >
                    返回登入
                  </button>
                  <button
                    type="submit"
                    className="btn text-xs py-2 px-4 flex-1 justify-center cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold"
                  >
                    確認以 Email 重設
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">密碼已成功更新！</h3>
                <p className="text-xs text-[#cbd2ef]">
                  你現在可以使用更新後的新密碼登入你的帳戶。
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('password_login')}
                  className="btn text-xs py-2.5 px-6 mx-auto inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>立即以新密碼登入</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-white/10 text-center">
          <p className="tiny muted text-[11px]">
            DreamWisdom 採用安全無痕本地驗證，密碼可隨時自訂或以預設 <code className="text-amber-300">Abc123</code> 快速測試。
          </p>
        </div>
      </div>
    </div>
  );
};
