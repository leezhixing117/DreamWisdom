import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, ShieldBan, Check } from 'lucide-react';
import { User, getRoleDisplayName, normalizeRole } from '../types';

interface ConfirmDeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (user: User, alsoBan: boolean, reason: string) => void;
}

export const ConfirmDeleteUserModal: React.FC<ConfirmDeleteUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const [alsoBan, setAlsoBan] = useState(true);
  const [reason, setReason] = useState('違反平台規範 / 高級管理員執行帳號清理');

  useEffect(() => {
    if (isOpen) {
      setAlsoBan(true);
      setReason('違反平台規範 / 高級管理員執行帳號清理');
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const roleNorm = normalizeRole(user.role);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
      id="confirm-delete-user-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-[#0f1422] border-2 border-red-500/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative cursor-default animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="badge bg-red-500/20 text-red-300 border-red-500/30 text-[10px]">
              SUPER ADMIN ACTION
            </span>
            <span className="text-xs text-[#8d97b5]">高級管理員最高權限</span>
          </div>

          <h3 className="text-lg font-black text-white">確定要 DELETE 刪除此會員嗎？</h3>
          <p className="text-xs text-[#aab3d2] leading-relaxed">
            您即將從系統數據庫中徹底移除以下會員。此操作不可逆，該會員的帳號記錄將被永久刪除。
          </p>

          {/* Member Card Summary */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">
                {user.display_name || user.email.split('@')[0]}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white">
                {getRoleDisplayName(roleNorm)}
              </span>
            </div>
            <div className="text-xs font-mono text-emerald-400">
              {user.email}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#8d97b5] pt-1 border-t border-white/5">
              <span>持有星星：{user.stars ?? 0} 顆 ⭐</span>
              <span>註冊時間：{user.created_at ? new Date(user.created_at).toLocaleDateString() : '早期用戶'}</span>
            </div>
          </div>
        </div>

        {/* Ban / Blacklist Option */}
        <div className="p-4 rounded-2xl bg-red-950/25 border border-red-500/35 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alsoBan}
              onChange={(e) => setAlsoBan(e.target.checked)}
              className="mt-1 rounded text-red-500 focus:ring-red-500 bg-black/40 border-white/20 w-4 h-4"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <ShieldBan className="w-3.5 h-3.5" />
                同時禁止此會員再次登記與登入（列入永久黑名單）
              </span>
              <span className="text-[11px] text-[#cbd2ef] block leading-relaxed">
                勾選後，系統將永久封鎖「<span className="font-mono text-white">{user.email}</span>」，日後使用此 Email 登入或重新註冊時將被系統直接駁回。
              </span>
            </div>
          </label>

          {alsoBan && (
            <div className="pt-2 border-t border-red-500/20">
              <label className="text-[11px] text-[#cbd2ef] block mb-1">
                封鎖 / 刪除原因備註（留存於後台黑名單）：
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="例如：違反社群守則 / 惡意灌水 / 停權移除"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-red-400"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onConfirm(user, alsoBan, reason)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>確認永久刪除{alsoBan ? '並封鎖' : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
