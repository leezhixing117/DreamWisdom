import React, { useState, useEffect } from 'react';
import { Star, X, Check, Plus, Minus, RotateCcw } from 'lucide-react';
import { User, getRoleDisplayName, normalizeRole } from '../types';

interface StarAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (user: User, newStars: number) => void;
}

export const StarAdjustModal: React.FC<StarAdjustModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [stars, setStars] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setStars(user.stars ?? 0);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const roleNorm = normalizeRole(user.role);

  const handleApplyDelta = (delta: number) => {
    setStars((prev) => Math.max(0, prev + delta));
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user, Math.max(0, stars));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
      id="star-adjust-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative cursor-default animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400" />
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

        <div>
          <span className="badge bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
            SUPER ADMIN · 星星點數管理
          </span>
          <h3 className="text-lg font-black text-white mt-1">增減會員星星點數</h3>
          <p className="text-xs text-[#aab3d2] mt-0.5">
            高級管理員專屬權限：為會員手動儲值、扣減或自訂星星餘額。
          </p>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 mt-3 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">{user.display_name || user.email.split('@')[0]}</span>
              <span className="text-[11px] text-[#8d97b5] font-mono">{user.email}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#cbd2ef] border border-white/15">
              {getRoleDisplayName(roleNorm)}
            </span>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="text-xs text-[#cbd2ef] font-medium block mb-1.5">
              設定目標星星數量（顆）：
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={99999}
                value={stars}
                onChange={(e) => setStars(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 px-4 py-3 rounded-2xl bg-black/50 border border-amber-500/40 text-white text-xl font-bold font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-amber-300 font-bold text-lg pr-2">⭐ 星</span>
            </div>
          </div>

          {/* Quick Delta Adjustment Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] text-[#8d97b5] block">快捷增減按鈕：</span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyDelta(-50)}
                className="py-1.5 px-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                -50
              </button>
              <button
                type="button"
                onClick={() => handleApplyDelta(-10)}
                className="py-1.5 px-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => handleApplyDelta(-5)}
                className="py-1.5 px-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleApplyDelta(-1)}
                className="py-1.5 px-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                -1
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyDelta(1)}
                className="py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => handleApplyDelta(5)}
                className="py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => handleApplyDelta(10)}
                className="py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => handleApplyDelta(50)}
                className="py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                +50
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStars(0)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#8d97b5] hover:text-white cursor-pointer"
              >
                歸零 (0星)
              </button>
              <button
                type="button"
                onClick={() => setStars(6)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 cursor-pointer"
              >
                一般預設 (6星)
              </button>
              <button
                type="button"
                onClick={() => setStars(999)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#aa9cff] cursor-pointer"
              >
                VIP/無上限 (999星)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>確認更新星星</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
