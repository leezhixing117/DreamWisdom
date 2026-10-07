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

          {/* Security & Legal & FAQ (Rule 13) */}
          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-xs tracking-wider uppercase flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>條款與支援</span>
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="text-slate-700 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
                >
                  私隱政策 (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('faq-accordion-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-slate-700 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
                >
                  常見問題 FAQ
                </button>
              </li>
              <li>
                <span className="text-slate-600">嚴格香港私隱條例 (PDPO) 遵循</span>
              </li>
              <li>
                <span className="text-slate-600">絕不將夢境數據用於 AI 訓練</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 心理安全提醒全域可見 (Rule 15) */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-950 text-xs mb-6 leading-relaxed">
          <p className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
            <span>⚠️ 重要提醒：</span>
          </p>
          <p className="text-slate-700">
            本平台只提供心理學角度自我反思，並非心理治療、精神科醫療服務。如果長期被夢魘、情緒困擾，請尋求香港註冊心理學家或精神科醫生協助。
          </p>
          <div className="mt-2 pt-2 border-t border-amber-200/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-amber-900 font-medium">
            <span>香港情緒支援熱線：</span>
            <span>📞 利民會即時通：3512 2626</span>
            <span>📞 香港撒瑪利亞防止自殺會：2389 2222</span>
            <span>📞 醫院管理局精神健康專線 (24小時)：2466 7350</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} DreamWisdom｜廣東話記夢，透過榮格心理學解讀你嘅潛意識。版權所有。</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              隱私沙盒防護中 · 數據本地隨時可刪
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
