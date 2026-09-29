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
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              {new Date(entry.created_at).toLocaleDateString('zh-HK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <Dna className="w-3.5 h-3.5 text-blue-700" />
              DREAM DNA™️ VERIFIED
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              title="分享打碼隱去個人內容的洞察報告（社交傳播）"
              id="report-detail-share-btn"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-700" />
              <span>分享打碼洞察</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs cursor-pointer flex items-center gap-1.5"
              title="複製完整報告"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
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
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                title="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-4 mb-2">
          {report.title}
        </h2>

        {/* Dream Origin Record */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 my-4 shadow-xs">
          <div className="text-[11px] text-slate-600 uppercase tracking-wider mb-1 font-bold flex items-center justify-between">
            <span>原始夢境記述</span>
            {entry.rawCantoneseTranscription && (
              <span className="text-emerald-800 font-mono font-bold">🎙️ 語音記述存檔</span>
            )}
          </div>
          <p className="text-sm text-slate-800 leading-relaxed italic font-medium">
            「{entry.dream_text}」
          </p>
        </div>

        {/* Detective Answers Recall Banner */}
        {report.detectiveAnswers && (
          <div className="p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-200 my-3 text-xs">
            <div className="text-blue-900 font-bold flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              偵探問題校準依據：
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-800">
              {Object.entries(report.detectiveAnswers).map(([k, val], i) => (
                <div key={i} className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-xs">
                  <span className="text-slate-500 block text-[10px] font-semibold">校準維度 {i + 1}</span>
                  <b className="text-slate-900 font-bold">{val}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Subconscious Summary */}
        <div className="p-4 rounded-2xl my-4 text-sm leading-relaxed border-l-4 border-blue-600 bg-blue-50/80 text-slate-800 shadow-xs font-medium">
          <b className="text-blue-950 block mb-1 font-bold">潛意識核心信號：</b>
          {report.summary}
        </div>

        {/* Book Brain Theory & Past Dream Comparison Grounding */}
        {(report.bookBrainTheory || report.pastDreamComparison || report.noteworthyMessage) && (
          <div className="space-y-3 my-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {report.bookBrainTheory && (
                <div className="p-4 rounded-2xl bg-sky-50/80 border-2 border-sky-200 space-y-1.5 text-left shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-sky-700" />
                      <span className="text-xs font-bold text-sky-900">Book Brain 典籍理論依據</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-800 bg-white border border-sky-200 px-2 py-0.5 rounded font-bold">
                      {report.bookBrainTheory.citation}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {report.bookBrainTheory.theoryName}
                    <span className="text-slate-600 font-medium block text-[11px] mt-0.5">
                      《{report.bookBrainTheory.bookTitle}》
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {report.bookBrainTheory.coreInsight}
                  </p>
                </div>
              )}

              {report.pastDreamComparison && (
                <div className="p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 space-y-1.5 text-left shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-700" />
                      <span className="text-xs font-bold text-indigo-900">結合過往夢境交叉比對</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                      記憶連繫
                    </span>
                  </div>
                  {report.pastDreamComparison.matchedPatterns?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-bold">吻合意象：</span>
                      {report.pastDreamComparison.matchedPatterns.map((pat, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-950 font-bold font-mono">
                          {pat}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {report.pastDreamComparison.pastOccurrencesSummary}
                  </p>
                </div>
              )}
            </div>

            {report.noteworthyMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-start gap-3 text-left shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  <b className="text-emerald-950 block mb-0.5 font-bold">可能值得留意嘅訊息：</b>
                  {report.noteworthyMessage}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOUR-LAYER CONTEMPORARY ASIAN READING */}
        {report.fourLayers ? (
          <div className="space-y-4 my-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                四層立體解夢架構 (Four-Layer Reading)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Layer 1: Asian Cultural Layer */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border-2 border-sky-300 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                  🏮 {report.fourLayers.asianCulturalLayer.title}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {report.fourLayers.asianCulturalLayer.description}
                </p>
                {report.fourLayers.asianCulturalLayer.keywords && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {report.fourLayers.asianCulturalLayer.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-sky-300 text-sky-900 font-bold">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Layer 2: Jungian Layer */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-300 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  🧠 {report.fourLayers.jungianLayer.title}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {report.fourLayers.jungianLayer.description}
                </p>
                <div className="text-[10px] text-indigo-900 font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-indigo-200 inline-block">
                  原型歸位：{report.fourLayers.jungianLayer.archetype}
                </div>
              </div>

              {/* Layer 3: Personal Life Layer */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  🧬 {report.fourLayers.personalLayer.title}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {report.fourLayers.personalLayer.description}
                </p>
              </div>

              {/* Layer 4: Integration Action */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  🌱 {report.fourLayers.integrationAction.title}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {report.fourLayers.integrationAction.advice}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Perspectives Fallback */
          report.perspectives && (
            <div className="space-y-3 my-5">
              <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900">
                理論學派視角
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.perspectives.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="text-xs font-bold text-blue-900 mb-1">{p.name}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Symbols Breakdown */}
        {report.symbols && (
          <div className="space-y-3 my-5">
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900">
              關鍵象徵符號與深層寓意
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.symbols.map((sym, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-xs">
                  <div className="text-sm font-bold text-slate-900 mb-1">{sym.symbol}</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{sym.meaning}</p>
                  {sym.culturalContext && (
                    <div className="text-[11px] text-blue-800 mt-1 italic font-semibold">
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
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              自我覺察反思提問
            </h3>
            <div className="space-y-2">
              {report.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium"
                >
                  <span className="font-bold text-emerald-800 mr-2">Q{idx + 1}:</span>
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Brain Sources */}
        {report.sources && report.sources.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 mb-2 text-slate-900 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>Book Brain 典籍引用依據：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.sources.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-800 font-semibold"
                >
                  📚 {s.book_title} (p.{s.page_start}{s.page_end ? `-${s.page_end}` : ''})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fixed Mandatory Disclaimer */}
        <div className="mt-6 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <b className="text-amber-900 font-bold">免責提示：</b>本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷。
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
