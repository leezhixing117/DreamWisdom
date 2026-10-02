import React, { useState } from 'react';
import { DetectiveQuestion } from '../types';
import { HelpCircle, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface DetectiveInquiryModalProps {
  isOpen: boolean;
  dreamText: string;
  questions: DetectiveQuestion[];
  onComplete: (answers: Record<string, string>) => void;
  onClose?: () => void;
}

export const DetectiveInquiryModal: React.FC<DetectiveInquiryModalProps> = ({
  isOpen,
  dreamText,
  questions,
  onComplete,
  onClose,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentStep];
  const totalSteps = questions.length;
  const isLast = currentStep === totalSteps - 1;
  const isAnswered = Boolean(answers[currentQ?.id]);

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleNextOrFinish = () => {
    if (!isLast) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete(answers);
      }, 700);
    }
  };

  const allAnswered = questions.every((q) => Boolean(answers[q.id]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300"
      id="detective-inquiry-screen"
    >
      <div
        className="w-full max-w-2xl bg-white border-2 border-indigo-200 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden text-left"
        id="detective-inquiry-card"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-bold tracking-wider text-blue-800 uppercase">
              FURTHER AI ANALYSIS · 進一步 AI 深度解夢
            </span>
          </div>
          <div className="text-xs text-slate-600 font-mono font-bold">
            第 {currentStep + 1} / {totalSteps} 題
          </div>
        </div>

        {/* Cinematic intro text */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide mb-2">
          進一步解夢：請回答 3 條有關問題
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
          同一個意象在不同情境下的心靈寓意大不相同。回答以下 3 條進一步問題，AI 將結合你的直覺感受，產出深度四層解構報告並存入你的 DREAM DNA™️。
        </p>

        {/* Progress pills */}
        <div className="flex gap-2 mb-6">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-blue-600'
                  : answers[q.id]
                  ? 'bg-emerald-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Current Question Block */}
        <div className="space-y-4 min-h-[220px]">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-snug">
              {currentQ?.question}
            </h3>

            {/* Options list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ?.options.map((opt, i) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm text-left transition-all duration-200 border-2 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 ml-2" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Psychological impact banner when all questions are answered */}
        {allAnswered && (
          <div className="mt-5 p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-xs text-emerald-950 font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              <b className="text-emerald-900">偵探校準完成：</b>
              現在，這個夢的意思已經和普通模板不同了——這是為你專屬量身校準的私人潛意識指引。
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
          >
            上一題
          </button>

          <div className="flex items-center gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                直接生成（略過確認）
              </button>
            )}

            <button
              type="button"
              onClick={handleNextOrFinish}
              disabled={!isAnswered || isSubmitting}
              className={`text-xs font-bold px-6 py-2.5 flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20 cursor-pointer transition-all ${
                !isAnswered ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  正在深度破譯專屬報告…
                </>
              ) : isLast ? (
                <>
                  <span>生成我的專屬 4 層解夢報告</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>下一題</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
