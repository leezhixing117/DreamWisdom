import React, { useState } from 'react';
import { DreamEntry } from '../types';
import { X, Calendar, BookOpen, HelpCircle, Check, Copy, Trash2, Sparkles, Compass, Dna, Layers, ShieldCheck, Heart, Clock, Share2 } from 'lucide-react';
import { AnonymizedShareModal } from './AnonymizedShareModal';

interface ReportDetailModalProps {
  entry: DreamEntry | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  entry,
  onClose,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!entry) return null;
  const report = entry.report_json;

  const handleCopy = () => {
    const text = `【DreamWisdom 夢境深度報告】\n標題：${report.title}\n時間：${new Date(entry.created_at).toLocaleDateString('zh-HK')}\n\n【夢境記錄】\n${entry.dream_text}\n\n【核心解讀】\n${report.summary}\n\n【當代東方文化層】\n${report.fourLayers?.asianCulturalLayer.title || ''}\n${report.fourLayers?.asianCulturalLayer.description || ''}\n\n【榮格原型心理層】\n${report.fourLayers?.jungianLayer.title || ''}\n${report.fourLayers?.jungianLayer.description || ''}\n\n【象徵意象】\n${report.symbols?.map(s => `• ${s.symbol}: ${s.meaning}`).join('\n')}\n\n【自我反思提問】\n${report.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n【療癒行動】\n${report.fourLayers?.integrationAction.advice || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modalback" id="report-detail-modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-3xl"
        id="report-detail-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="badge">
              <Calendar className="w-3 h-3" />
              {new Date(entry.created_at).toLocaleDateString('zh-HK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="badge border-[#aa9cff]/30 text-[#aa9cff] bg-[#aa9cff]/10">
              <Dna className="w-3 h-3" />
              DREAM DNA™️ VERIFIED
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#aa9cff]/20 to-[#71d9ff]/20 border border-[#aa9cff]/40 text-white hover:brightness-110 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title="分享打碼隱去個人內容的洞察報告（社交傳播）"
              id="report-detail-share-btn"
            >
              <Share2 className="w-3.5 h-3.5 text-[#71d9ff]" />
              <span>分享打碼洞察</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="btn2 text-xs"
              title="複製完整報告"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#78e1b5]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製' : '複製報告'}</span>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('確定刪除這份夢境報告？')) {
                    onDelete(entry.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-[#8d97b5] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#8d97b5] hover:text-white hover:bg-white/10 transition-colors"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-4 mb-2">
          {report.title}
        </h2>

        {/* Dream Origin Record */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 my-4">
          <div className="text-[11px] text-[#8d97b5] uppercase tracking-wider mb-1 font-semibold flex items-center justify-between">
            <span>原始夢境記述</span>
            {entry.rawCantoneseTranscription && (
              <span className="text-[#78e1b5] font-mono">🎙️ 語音記述存檔</span>
            )}
          </div>
          <p className="text-sm text-[#cbd2ef] leading-relaxed italic">
            「{entry.dream_text}」
          </p>
        </div>

        {/* Detective Answers Recall Banner */}
        {report.detectiveAnswers && (
          <div className="p-3.5 rounded-2xl bg-[#aa9cff]/10 border border-[#aa9cff]/25 my-3 text-xs">
            <div className="text-[#aa9cff] font-semibold flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              偵探問題校準依據：
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#cbd2ef]">
              {Object.entries(report.detectiveAnswers).map(([k, val], i) => (
                <div key={i} className="bg-black/30 p-2 rounded-lg">
                  <span className="text-[#8d97b5] block text-[10px]">校準維度 {i + 1}</span>
                  <b className="text-white">{val}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Subconscious Summary */}
        <div className="callout my-4 text-sm leading-relaxed border-[#aa9cff]/30 bg-[#aa9cff]/10">
          <b className="text-white block mb-1">潛意識核心信號：</b>
          {report.summary}
        </div>

        {/* Book Brain Theory & Past Dream Comparison Grounding */}
        {(report.bookBrainTheory || report.pastDreamComparison || report.noteworthyMessage) && (
          <div className="space-y-3 my-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {report.bookBrainTheory && (
                <div className="p-4 rounded-2xl bg-[#71d9ff]/5 border border-[#71d9ff]/25 space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#71d9ff]" />
                      <span className="text-xs font-bold text-[#71d9ff]">Book Brain 典籍理論依據</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#aab3d2] bg-white/5 px-2 py-0.5 rounded">
                      {report.bookBrainTheory.citation}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {report.bookBrainTheory.theoryName}
                    <span className="text-[#aab3d2] font-normal block text-[11px] mt-0.5">
                      《{report.bookBrainTheory.bookTitle}》
                    </span>
                  </div>
                  <p className="text-xs text-[#cbd2ef] leading-relaxed">
                    {report.bookBrainTheory.coreInsight}
                  </p>
                </div>
              )}

              {report.pastDreamComparison && (
                <div className="p-4 rounded-2xl bg-[#aa9cff]/10 border border-[#aa9cff]/25 space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#aa9cff]" />
                      <span className="text-xs font-bold text-[#c3b9ff]">結合過往夢境交叉比對</span>
                    </div>
                    <span className="text-[10px] text-[#78e1b5] font-mono bg-[#78e1b5]/10 px-2 py-0.5 rounded">
                      記憶連繫
                    </span>
                  </div>
                  {report.pastDreamComparison.matchedPatterns?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-[#8d97b5]">吻合意象：</span>
                      {report.pastDreamComparison.matchedPatterns.map((pat, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">
                          {pat}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-[#cbd2ef] leading-relaxed">
                    {report.pastDreamComparison.pastOccurrencesSummary}
                  </p>
                </div>
              )}
            </div>

            {report.noteworthyMessage && (
              <div className="p-4 rounded-2xl bg-[#78e1b5]/10 border border-[#78e1b5]/30 flex items-start gap-3 text-left">
                <div className="w-7 h-7 rounded-lg bg-[#78e1b5]/20 border border-[#78e1b5]/40 flex items-center justify-center text-[#78e1b5] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-[#e1e5f8] leading-relaxed">
                  <b className="text-[#78e1b5] block mb-0.5">可能值得留意嘅訊息：</b>
                  {report.noteworthyMessage}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOUR-LAYER CONTEMPORARY ASIAN READING */}
        {report.fourLayers ? (
          <div className="space-y-4 my-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Layers className="w-4 h-4 text-[#aa9cff]" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                四層立體解夢架構 (Four-Layer Reading)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Layer 1: Asian Cultural Layer */}
              <div className="p-4 rounded-2xl bg-[#0e1227] border border-[#71d9ff]/30 space-y-2">
                <span className="text-xs font-bold text-[#71d9ff] flex items-center gap-1.5">
                  🏮 {report.fourLayers.asianCulturalLayer.title}
                </span>
                <p className="text-xs text-[#aab3d2] leading-relaxed">
                  {report.fourLayers.asianCulturalLayer.description}
                </p>
                {report.fourLayers.asianCulturalLayer.keywords && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {report.fourLayers.asianCulturalLayer.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#71d9ff]/10 text-[#71d9ff]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Layer 2: Jungian Layer */}
              <div className="p-4 rounded-2xl bg-[#0e1227] border border-[#aa9cff]/30 space-y-2">
                <span className="text-xs font-bold text-[#c3b9ff] flex items-center gap-1.5">
                  🧠 {report.fourLayers.jungianLayer.title}
                </span>
                <p className="text-xs text-[#aab3d2] leading-relaxed">
                  {report.fourLayers.jungianLayer.description}
                </p>
                <div className="text-[10px] text-[#aa9cff] font-mono">
                  原型歸位：{report.fourLayers.jungianLayer.archetype}
                </div>
              </div>

              {/* Layer 3: Personal Life Layer */}
              <div className="p-4 rounded-2xl bg-[#0e1227] border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#ffd27a] flex items-center gap-1.5">
                  🧬 {report.fourLayers.personalLayer.title}
                </span>
                <p className="text-xs text-[#aab3d2] leading-relaxed">
                  {report.fourLayers.personalLayer.description}
                </p>
              </div>

              {/* Layer 4: Integration Action */}
              <div className="p-4 rounded-2xl bg-[#0e1227] border border-[#78e1b5]/30 space-y-2">
                <span className="text-xs font-bold text-[#78e1b5] flex items-center gap-1.5">
                  🌱 {report.fourLayers.integrationAction.title}
                </span>
                <p className="text-xs text-[#d8ddf0] leading-relaxed">
                  {report.fourLayers.integrationAction.advice}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Perspectives Fallback */
          report.perspectives && (
            <div className="space-y-3 my-5">
              <h3 className="text-sm uppercase tracking-wider font-semibold text-[#8d97b5]">
                理論學派視角
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.perspectives.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <h4 className="text-xs font-bold text-[#aa9cff] mb-1">{p.name}</h4>
                    <p className="text-xs text-[#aab3d2] leading-relaxed">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Symbols Breakdown */}
        {report.symbols && (
          <div className="space-y-3 my-5">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-[#8d97b5]">
              關鍵象徵符號與深層寓意
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.symbols.map((sym, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-sm font-semibold text-white mb-1">{sym.symbol}</div>
                  <p className="text-xs text-[#aab3d2] leading-relaxed">{sym.meaning}</p>
                  {sym.culturalContext && (
                    <div className="text-[11px] text-[#71d9ff] mt-1 italic">
                      💡 文化意蘊：{sym.culturalContext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Self-Reflection Questions */}
        {report.questions && (
          <div className="space-y-3 my-5">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-[#8d97b5] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#78e1b5]" />
              自我覺察反思提問
            </h3>
            <div className="space-y-2">
              {report.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#e1e6f9] leading-relaxed"
                >
                  <span className="font-semibold text-[#78e1b5] mr-2">Q{idx + 1}:</span>
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Brain Sources */}
        {report.sources && report.sources.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#8d97b5]">
            <div className="flex items-center gap-1.5 mb-2 text-white font-medium">
              <BookOpen className="w-3.5 h-3.5 text-[#aa9cff]" />
              <span>Book Brain 典籍引用依據：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.sources.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[11px] text-[#cbd2ef]"
                >
                  📚 {s.book_title} (p.{s.page_start}{s.page_end ? `-${s.page_end}` : ''})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fixed Mandatory Disclaimer */}
        <div className="mt-6 p-3.5 rounded-2xl bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-xs text-[#d8ddf8] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#aa9cff] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <b className="text-white">免責提示：</b>本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。
          </p>
        </div>
      </div>

      {/* Anonymized Share Modal */}
      <AnonymizedShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reportTitle={report.title}
        dreamText={entry.dream_text}
        summary={report.summary}
        symbols={report.symbols}
        archetype={report.fourLayers?.jungianLayer.title}
        healingAdvice={report.fourLayers?.integrationAction.advice}
        question={report.questions?.[0]}
      />
    </div>
  );
};
