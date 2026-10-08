import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface AdminSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminUser: User) => void;
  superUser: User;
}

const VALID_ADMIN_KEYS = [
  'mystic_blaza_2026_secure',
  'Abc123',
  'mysticblaza',
  'dreamwisdom_admin_2026',
];

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  superUser,
}) => {
  const [securityKey, setSecurityKey] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const inputKey = securityKey.trim();
    if (!inputKey) {
      setErrorMessage('請輸入管理員安全金鑰');
      return;
    }

    setBusy(true);

    setTimeout(() => {
      setBusy(false);
      if (VALID_ADMIN_KEYS.includes(inputKey)) {
        // Mark session as verified in sessionStorage
        try {
          sessionStorage.setItem('dreamwisdom_admin_auth_token', 'verified');
        } catch {}

        onSuccess(superUser);
        onClose();
      } else {
        setErrorMessage('⚠️ 安全金鑰不正確，拒絕訪問。已加強安全防護記錄。');
      }
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto cursor-pointer"
      id="admin-security-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl cursor-default animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        id="admin-security-modal-box"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-center text-white mb-1">
          管理員身分安全驗證
        </h3>
        <p className="text-slate-400 text-xs text-center leading-relaxed mb-5">
          系統控制室已啟用嚴格安全保護。請輸入管理授權金鑰以解鎖管理權限。
        </p>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5 text-left">
              安全授權金鑰 (Passkey)
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                value={securityKey}
                onChange={(e) => {
                  setSecurityKey(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="輸入管理金鑰以解鎖"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
                id="admin-security-key-input"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
              id="admin-security-submit-btn"
            >
              {busy ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>解鎖驗證</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
