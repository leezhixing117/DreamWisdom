import React, { useState } from 'react';
import { User, UserRole, normalizeRole, BannedRecord } from '../types';
import { trackLoginEvent } from '../utils/auditLogger';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Clock,
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
  // Tabs: 'password_login' | 'forgot_password' (已全面移除預設帳號與 4 種等級展示)
  const [activeTab, setActiveTab] = useState<'password_login' | 'forgot_password'>('password_login');

  // Helper to check if an email is in the blacklist
  const isEmailBanned = (email: string) => {
    const norm = email.trim().toLowerCase();
    return bannedRecords.some((b) => b.email.trim().toLowerCase() === norm);
  };

  const getBanInfo = (email: string) => {
    const norm = email.trim().toLowerCase();
    return bannedRecords.find((b) => b.email.trim().toLowerCase() === norm);
  };

  // Login form state (純淨輸入，絕無任何預設 Email 與密碼)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
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

  // Handle password login / registration
  const handlePasswordLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailTrimmed = loginEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setErrorMessage('請輸入電子郵件 (Email)');
      return;
    }
    if (!loginPassword || loginPassword.length < 4) {
      setErrorMessage('密碼長度至少需為 4 個字元');
      return;
    }

    // 1. 檢查黑名單封禁
    if (isEmailBanned(emailTrimmed)) {
      const banInfo = getBanInfo(emailTrimmed);
      setErrorMessage(
        `🚫 此帳號或 Email 已被管理團隊列入永久黑名單，禁止登記與登入！（原因：${
          banInfo?.reason || '違反服務守則'
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
        // 檢查已存在帳號是否被停權
        if (existing.is_banned) {
          setErrorMessage(
            `🚫 此帳號已被管理團隊封禁停權（原因：${
              existing.banned_reason || '帳號異常限制'
            }），禁止登入！`
          );
          return;
        }

        // 密碼比對：嚴格比對用戶自行設定的密碼
        if (existing.password && loginPassword !== existing.password) {
          setErrorMessage('登入密碼不正確！請重新輸入。如忘記密碼，可點擊上方「忘記密碼」以 E-mail 重設。');
          return;
        }

        trackLoginEvent(existing, 'password', 'success');
        onLogin(existing);
        onClose();
      } else {
        // 全新註冊：密碼完全由客人自行決定
        const newUser: User = {
          id: 'user_' + Date.now(),
          email: loginEmail.trim(),
          display_name: loginEmail.split('@')[0],
          role: 'free',
          password: loginPassword, // 客人自訂密碼
          stars: 6, // 註冊即送初始星星幣
          created_at: new Date().toISOString(),
        };
        trackLoginEvent(newUser, 'auto_registered', 'success');
        onLogin(newUser);
        onClose();
      }
    }, 200);
  };

  // 重設密碼邏輯（包含 1 小時安全防護間隔：幾多小時後可再 reset）
  const RESET_COOLDOWN_HOURS = 1;

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

    // 檢查冷卻時間（1 小時安全間隔）
    try {
      const lastResetKey = `dw_last_reset_${emailTrimmed}`;
      const lastResetStr = localStorage.getItem(lastResetKey);
      if (lastResetStr) {
        const lastResetTime = parseInt(lastResetStr, 10);
        const elapsedMs = Date.now() - lastResetTime;
        const cooldownMs = RESET_COOLDOWN_HOURS * 60 * 60 * 1000;

        if (elapsedMs < cooldownMs) {
          const remainingMinutes = Math.ceil((cooldownMs - elapsedMs) / (60 * 1000));
          setErrorMessage(
            `⏳ 為防範惡意撞庫與保障帳戶安全，系統限制 ${RESET_COOLDOWN_HOURS} 小時內僅可重設密碼一次。你於稍早前已重設過密碼，請於 ${remainingMinutes} 分鐘後再試；或直接使用剛設定之新密碼登入。`
          );
          return;
        }
      }
    } catch {}

    if (onResetPassword) {
      const ok = onResetPassword(emailTrimmed, newPassword);
      if (!ok) {
        setErrorMessage(`找不到與「${emailTrimmed}」關聯之帳戶。請檢查電子郵件拼寫，或直接返回輸入自訂密碼完成註冊。`);
        return;
      }
    }

    // 記錄本次重設時間
    try {
      localStorage.setItem(`dw_last_reset_${emailTrimmed}`, Date.now().toString());
    } catch {}

    setForgotSuccess(true);
    setSuccessMessage(`✅ 密碼重設成功！新密碼已即時生效。基於安全防護機制，本帳號設有 1 小時安全間隔。請使用新密碼登入。`);
    setLoginEmail(emailTrimmed);
    setLoginPassword(newPassword);
  };

  return (
    <div className="modalback" id="login-modal-backdrop" onClick={onClose}>
      <div
        className="loginbox relative max-w-md w-full p-6 sm:p-8"
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
          登入 / 註冊 DreamWisdom
        </h1>
        <p className="text-[#4B6B94] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto mb-4">
          輸入電子郵件與密碼即可登入。新用戶直接輸入 Email 與自訂密碼，系統將自動為你建立專屬帳戶。
        </p>

        {/* Tab 切換：只保留帳號登入/登記與忘記密碼，完全隱藏 4 種等級 */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-4 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('password_login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'password_login'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50'
                : 'text-[#aab3d2] hover:text-white'
            }`}
          >
            🔐 帳號登入 / 登記
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot_password');
              setErrorMessage(null);
              setForgotSuccess(false);
            }}
            className={`flex-1 py-2 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'forgot_password'
                ? 'bg-amber-500/25 text-amber-300 shadow-sm ring-1 ring-amber-400/50'
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
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* TAB 1: 純淨登入 / 登記表單（絕無預設密碼） */}
        {activeTab === 'password_login' && (
          <form onSubmit={handlePasswordLoginSubmit} className="space-y-3.5 text-left" id="password-login-form">
            <div>
              <label className="text-xs text-[#cbd2ef] block mb-1 font-medium">
                電子郵件 (Email) <span className="text-[#ff8b9d]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="請輸入你的電子郵件"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                  id="login-input-email"
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#cbd2ef] font-medium">
                  自訂密碼 (Password) <span className="text-[#ff8b9d]">*</span>
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
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="請輸入你的自訂密碼（至少 4 位元）"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                  id="login-input-password"
                  autoComplete="current-password"
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
              <p className="text-[11px] text-[#8d97b5] mt-1.5 leading-relaxed">
                新用戶輸入 Email 與自訂密碼即可完成登記；既有會員輸入原密碼登入。
              </p>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold shadow-md shadow-blue-700/25"
              id="btn-submit-password-login"
            >
              {busy ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>驗證中…</span>
                </>
              ) : (
                <>
                  <span>登入 / 自動登記</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: 忘記密碼（Email 驗證重設，含 1 小時冷卻防護） */}
        {activeTab === 'forgot_password' && (
          <div className="text-left space-y-3.5" id="forgot-password-panel">
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-200 text-xs leading-relaxed">
              <span className="font-bold flex items-center gap-1 mb-1 text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>E-mail 密碼重設與安全間隔</span>
              </span>
              輸入你的註冊 Email 與新密碼即可完成重設。系統設有 <strong>1 小時安全防護間隔</strong>，完成重設後 1 小時內不可密集重複操作。
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1 font-medium">
                    註冊電子郵件 (Email) <span className="text-[#ff8b9d]">*</span>
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
                      placeholder="輸入自訂新密碼（至少 4 位元）"
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
                      placeholder="再次輸入新密碼確認"
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
                  className="btn text-xs py-2.5 px-6 mx-auto inline-flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold"
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
            DreamWisdom 採用端對端安全驗證機制，保障你的個人資料與夢境日記隱私。
          </p>
        </div>
      </div>
    </div>
  );
};
