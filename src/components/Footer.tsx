import React from 'react';
import { ShieldCheck, Lock, Heart, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { CelestialLogo } from './CelestialLogo';

interface FooterProps {
  onNavigate: (view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'stars') => void;
  onOpenTherapeuticSupport?: () => void;
  onOpenEarnStars?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTherapeuticSupport,
  onOpenEarnStars,
}) => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 text-xs mt-auto pt-10 pb-10" id="global-site-footer">
      <div className="shell max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <CelestialLogo size="sm" showText={true} />
            </div>
            <p className="text-[12px] leading-relaxed text-slate-600">
              專為香港廣東話設計的潛意識夢境宇宙。每一個夢，都是潛意識留給你的信。
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>絕不用作用戶數據訓練 AI</span>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-xs tracking-wider uppercase">探索功能</h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-slate-700 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                >
                  首頁探索
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('app')}
                  className="text-slate-700 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>我的夢境解碼</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('stars')}
                  className="text-slate-700 hover:text-amber-800 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>星星幣與方案</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="text-slate-700 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>👑 付費會員專區</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Shop & Resources */}
          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>選物店 & 資源</span>
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('store')}
                  className="text-emerald-800 hover:text-emerald-900 font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🛍️ 解夢選物店 (精油水晶)</span>
                </button>
              </li>
              {onOpenEarnStars && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenEarnStars}
                    className="text-amber-800 hover:text-amber-900 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>睇片儲星任務</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={onOpenTherapeuticSupport}
                  className="text-slate-700 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>廣東話專業心理支援熱線</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Legal */}
          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-xs tracking-wider uppercase flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>安全與法律</span>
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="text-slate-700 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                >
                  私隱承諾與數據保護
                </button>
              </li>
              <li>
                <span className="text-slate-600">嚴格香港私隱條例 (PDPO) 遵循</span>
              </li>
              <li>
                <span className="text-slate-600">香港本地專屬心理危機干預機制</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} DreamWisdom. 版權所有。專為繁體中文與香港廣東話原創打造。</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              隱私沙盒防護中
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
