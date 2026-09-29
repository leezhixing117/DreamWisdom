import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ProductItem } from '../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onConfirm: (productId: string) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md cursor-pointer"
      id="confirm-delete-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-white border-2 border-rose-300 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        id="confirm-delete-modal-dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900">確定要刪除此選物商品嗎？</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            管理員權限確認：您即將從解夢選物店產品庫中永久移除以下商品。此操作將立即生效並同步至資料庫。
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 mt-2">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
              <p className="text-[11px] text-slate-600 truncate">
                {product.categoryLabel} · HK${product.priceHKD}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer"
          >
            取消保留
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm(product.id);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-700/25 cursor-pointer transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>確定刪除商品</span>
          </button>
        </div>
      </div>
    </div>
  );
};
