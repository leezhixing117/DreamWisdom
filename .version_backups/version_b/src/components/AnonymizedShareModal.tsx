import React, { useState } from 'react';
import {
  Share2,
  X,
  Check,
  Copy,
  Lock,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Brain,
  Compass,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AnonymizedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  dreamText?: string;
  summary: string;
  symbols?: Array<{ symbol: string; meaning: string }>;
  archetype?: string;
  noteworthyMessage?: string;
  healingAdvice?: string;
  question?: string;
}

export const AnonymizedShareModal: React.FC<AnonymizedShareModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  dreamText = '',
  summary,
  symbols = [],
  archetype,
  noteworthyMessage,
  healingAdvice,
  question,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  // Mask private dream details into an aesthetic redacted block
  const redactedSnippet = dreamText
    ? dreamText.length > 20
      ? `${dreamText.slice(0, 8)} ██████████████ [私密人物／情節已打碼] ████████……`
      : '██████████████ [私密夢境內容已全面打碼保護]'
    : '██████████████ [私密夢境內容已全面打碼保護]';

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}#recorddream`
    : 'https://dreamwisdom.app#recorddream';

  const plainShareText = `🔮【DreamWisdom 潛意識原型洞察】\n` +
    `夢境原型：《${reportTitle}》\n` +
    `🔒 私隱保護：個人具體私密細節已自動遮蔽\n\n` +
    `🧠 心理學洞察：\n${summary}\n\n` +
    (symbols.length > 0 ? `✨ 核心意象解讀：\n${symbols.slice(0, 2).map(s => `• ${s.symbol}：${s.meaning}`).join('\n')}\n\n` : '') +
    (noteworthyMessage ? `💡 值得留意的訊息：\n${noteworthyMessage}\n\n` : '') +
    (question ? `💭 自我反思提問：\n${question}\n\n` : '') +
    `💡 免責提示：本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。\n` +
    `──\n` +
    `以榮格心理學看懂你的夢境宇宙 · 唔係算命，發掘潛意識訊息：\n${shareUrl}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(plainShareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `DreamWisdom 心理學解夢洞察：《${reportTitle}》`,
          text: plainShareText,
          url: shareUrl,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (e) {
        // User cancelled or share failed, fallback to copy
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in cursor-pointer"
      id="anonymized-share-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-gradient-to-b from-[#131733] via-[#0d1024] to-[#070916] border-2 border-[#aa9cff]/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative cursor-default my-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
        id="anonymized-share-card-container"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#aa9cff] to-[#71d9ff] text-[#070916] flex items-center justify-center font-bold text-lg shadow-lg">
              <Share2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#aa9cff]">ANONYMIZED INSIGHT</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78e1b5]/15 text-[#78e1b5] border border-[#78e1b5]/30 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>已打碼保護私隱</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-0.5">
                分享打碼洞察報告（社交傳播）
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Anonymity Pledge Bar */}
        <div className="p-3 rounded-2xl bg-[#78e1b5]/10 border border-[#78e1b5]/25 flex items-center gap-2.5 text-xs text-[#78e1b5]">
          <Lock className="w-4 h-4 shrink-0 text-[#78e1b5]" />
          <p className="leading-snug">
            <b>安全防護：</b>你的真實人名、私密情節及敏感內容已被自動打碼隱藏，僅公開基於榮格心理學的象徵意象與原型洞察，放心分享到社交網絡！
          </p>
        </div>

        {/* PREVIEW OF THE SHARE CARD */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#080b18] border border-white/15 space-y-3.5 shadow-inner">
          {/* Card Top: Branding */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-[11px] font-bold tracking-wider text-[#cbd2ef] flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3 h-3 text-[#aa9cff]" />
              <span>DREAMWISDOM · 潛意識心靈鏡像</span>
            </span>
            <span className="text-[10px] text-amber-300 font-mono">榮格原型洞察</span>
          </div>

          {/* Title */}
          <div>
            <span className="text-[10px] text-[#8d97b5] block mb-0.5">夢境原型主題</span>
            <h4 className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
              《{reportTitle}》
            </h4>
          </div>

          {/* Redacted Snippet Box */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-dashed border-white/20 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#8d97b5]">
              <span className="flex items-center gap-1 text-[#ffb0bd]">
                <EyeOff className="w-3 h-3" />
                <span>個人私密情節已打碼遮蔽：</span>
              </span>
              <span>100% 匿名保密</span>
            </div>
            <p className="font-mono text-xs text-[#aab3d2] tracking-wider select-none blur-[0.2px]">
              {redactedSnippet}
            </p>
          </div>

          {/* Core Psychological Insight */}
          <div className="space-y-1 text-xs">
            <span className="text-[#aa9cff] font-semibold flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              <span>心理學核心洞察：</span>
            </span>
            <p className="text-[#cbd2ef] leading-relaxed text-xs">
              {summary}
            </p>
          </div>

          {/* Symbols if available */}
          {symbols.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-white/5">
              <span className="text-[11px] text-[#71d9ff] font-semibold flex items-center gap-1">
                <Compass className="w-3 h-3" />
                <span>象徵意象解析：</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {symbols.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white"
                  >
                    <b>{s.symbol}</b>：{s.meaning}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Self-Reflection Question */}
          {question && (
            <div className="p-2.5 rounded-xl bg-[#aa9cff]/10 border border-[#aa9cff]/20 text-[11px] text-[#e2ddff]">
              <span className="font-semibold block mb-0.5">💭 潛意識提問：</span>
              <span>{question}</span>
            </div>
          )}

          {/* Card Disclaimer */}
          <div className="text-[10px] text-[#aa9cff]/80 italic pt-1 border-t border-white/5">
            💡 本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。
          </div>

          {/* Card Footer Call to Action */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8d97b5]">
            <span>香港專用廣東話 AI 記夢工具</span>
            <span className="font-mono text-[#aa9cff]">dreamwisdom.app#recorddream</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Action 1: Native Share (WhatsApp, IG, Socials) */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#aa9cff] to-[#71d9ff] hover:brightness-110 text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#aa9cff]/20 transition-all"
              id="share-modal-native-btn"
            >
              <Share2 className="w-4 h-4 text-black" />
              <span>{shareSuccess ? '已成功分享！' : '一鍵分享到 WhatsApp / IG'}</span>
            </button>

            {/* Action 2: Copy Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/10"
              id="share-modal-copy-text-btn"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-[#78e1b5]" />
                  <span className="text-[#78e1b5]">已複製打碼洞察文案！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>複製匿名洞察圖文</span>
                </>
              )}
            </button>
          </div>

          {/* Action 3: Copy direct deep-link */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
            <span className="text-[11px] text-[#aab3d2] truncate max-w-[260px] font-mono">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-xs text-[#71d9ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#78e1b5]" /> : <ExternalLink className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '已複製連結' : '複製記夢錨點連結'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
