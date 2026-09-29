import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Heart,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  BookOpen,
  Phone,
  CheckCircle2,
  Wind,
  Smile,
  RefreshCw,
} from 'lucide-react';

interface NightmareCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTherapists: () => void;
  prefilledDream?: string;
  onApplyRewriteToDream?: (rewrittenStory: string) => void;
}

export const NightmareCareModal: React.FC<NightmareCareModalProps> = ({
  isOpen,
  onClose,
  onOpenTherapists,
  prefilledDream = '',
  onApplyRewriteToDream,
}) => {
  // IRT (Imagery Rehearsal Therapy) state
  const [triggerItem, setTriggerItem] = useState('');
  const [physicalReaction, setPhysicalReaction] = useState('');
  const [rewrittenEnding, setRewrittenEnding] = useState('');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  if (!isOpen) return null;

  const handleApplyRewrite = () => {
    if (onApplyRewriteToDream && rewrittenEnding.trim()) {
      onApplyRewriteToDream(
        `【噩夢改寫意象 IRT】：原本在夢中遇到「${triggerItem || '威脅與恐懼'}」，但我清醒改寫了結局：「${rewrittenEnding.trim()}」。`
      );
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c1218] via-[#120f1a] to-[#0a0a14] border border-[#ff8b9d]/35 rounded-3xl shadow-2xl shadow-[#ff8b9d]/15 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff8b9d]/20 border border-[#ff8b9d]/40 flex items-center justify-center text-xl shrink-0 text-[#ff8b9d]">
              🫂
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#ff8b9d]">Nightmare Care & IRT Kit</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff8b9d]/20 text-[#ffb0bd] border border-[#ff8b9d]/30 font-semibold">
                  溫柔關懷
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2 mt-0.5">
                重複噩夢自助梳理小工具
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#8d97b5] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="關閉噩夢關懷"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IMPORTANT PLATFORM BOUNDARY NOTICE (CRITICAL USER REQUIREMENT) */}
        <div className="p-4 sm:p-5 bg-[#ff8b9d]/10 border-b border-[#ff8b9d]/25 space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#ff8b9d] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <b className="text-white block font-bold">平台邊界重要聲明與轉介提示：</b>
              <p className="text-[#fed2d9] leading-relaxed">
                本產品為<b>潛意識象徵與自我探索工具，並非心理治療或醫療診斷服務</b>。如果噩夢造成持續困擾、頻繁驚醒、白天嚴重焦慮或創傷後壓力反應，強烈建議尋找<b>註冊臨床心理學家、精神科醫生或具備牌照之心理諮商專業人員</b>獲取專業診斷與協助。
              </p>
              <div className="pt-1.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTherapists();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#ff8b9d] hover:bg-[#ff758c] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Heart className="w-3.5 h-3.5 fill-black" />
                  <span>瀏覽註冊臨床心理學家與諮商名錄 →</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Self-Help Toolkit Steps */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>意象演練療法 (IRT) 四步梳理法</span>
            </span>
            <span className="text-[#8d97b5] font-mono">Step {step} of 4</span>
          </div>

          {/* STEP 1: 身體覺察 */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>1. 驚醒當下的身體感受覺察</span>
                </h3>
                <p className="text-xs text-[#cbd2ef] leading-relaxed">
                  夢境已經過去，你的身體正在逐漸回歸安全。請留意剛醒來時身體最緊繃的位置：
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  '胸口悶痛 / 呼吸急促',
                  '心跳劇烈狂跳',
                  '四肢無力 / 動彈不得',
                  '出冷汗 / 手腳冰涼',
                  '喉嚨緊縮喊不出聲',
                  '後背肌肉緊繃',
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhysicalReaction(item)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      physicalReaction === item
                        ? 'bg-[#ff8b9d]/20 border-[#ff8b9d] text-white font-bold'
                        : 'bg-white/[0.03] border-white/10 text-[#aab3d2] hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* 5-4-3-2-1 Grounding Mini-Exercise */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#78e1b5] flex items-center gap-1.5">
                  <Wind className="w-4 h-4" />
                  <span>5-4-3-2-1 即刻著陸安撫法</span>
                </span>
                <p className="text-xs text-[#aab3d2] leading-relaxed">
                  環顧四周：看 <b>5</b> 樣具體物品 ➔ 摸 <b>4</b> 種真實觸感（棉被、床單） ➔ 聽 <b>3</b> 種環境聲 ➔ 聞 <b>2</b> 種氣味 ➔ 做 <b>1</b> 次深長吸氣吐氣。你的意識已經在現實安全的房間裡。
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-105"
                >
                  <span>下一步：辨識威脅觸發物 →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: 辨識觸發物 */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>2. 重複噩夢中的核心威脅物</span>
                </h3>
                <p className="text-xs text-[#cbd2ef] leading-relaxed">
                  在重複發生的噩夢中，讓你感到最恐懼、最無助的意象是什麼？
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  '🏃 被未知黑影狂追',
                  '🕳️ 失足往深淵墜落',
                  '🌊 洪水滔天被水淹沒',
                  '🚪 門反鎖鑰匙失效',
                  '🦷 牙齒全碎脫落',
                  '🏫 考場白卷時間到',
                  '🛗 電梯失控極速急降',
                  '🐍 毒蛇猛獸突襲',
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTriggerItem(item)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      triggerItem === item
                        ? 'bg-amber-400/20 border-amber-400 text-white font-bold'
                        : 'bg-white/[0.03] border-white/10 text-[#aab3d2] hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#8d97b5] hover:text-white cursor-pointer"
                >
                  ← 上一步
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-105"
                >
                  <span>下一步：意象改寫練習 →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IRT 意象改寫練習 */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>3. 意象演練療法 (IRT)：清醒改寫噩夢結局</span>
                </h3>
                <p className="text-xs text-[#cbd2ef] leading-relaxed">
                  心理學研究證實：在清醒狀態下主動為噩夢寫下一個「轉折或安全」的新結局，能重塑大腦的恐懼神經迴路。
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[#aa9cff] font-medium block">
                  為「{triggerItem || '噩夢中的危機'}」設計一個新結局：
                </label>
                <textarea
                  value={rewrittenEnding}
                  onChange={(e) => setRewrittenEnding(e.target.value)}
                  placeholder="例如：我不再逃跑，轉身直視黑影，發現它是一隻迷路的小狗；或者在下墜時我長出了金色羽翼，穩穩地降落在一片開滿鮮花的原野上……"
                  rows={4}
                  className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder-[#6e779b] text-xs sm:text-sm focus:outline-none focus:border-[#aa9cff] leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="text-[#8d97b5]">靈感快捷句：</span>
                {[
                  '我轉身面對，對方化成一陣微風消散',
                  '我長出了翅膀，自由飛翔升向朝陽',
                  '突然從口袋找到發光的鑰匙，順利開門',
                  '海水變成了溫暖的溫泉，我學會了自由潛水',
                ].map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRewrittenEnding(phrase)}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#aab3d2] hover:text-white cursor-pointer"
                  >
                    +{phrase}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#8d97b5] hover:text-white cursor-pointer"
                >
                  ← 上一步
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#aa9cff] to-[#71d9ff] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-105"
                >
                  <span>下一步：完成梳理並套用 →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 整合與套用 */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#0e1624] border border-[#78e1b5]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#78e1b5]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>恭喜！你已完成本次噩夢的主動意識奪回梳理</span>
                </div>
                <div className="text-xs text-[#cbd2ef] space-y-1">
                  <div>• <b>身體覺察</b>：{physicalReaction || '心神已安定'}</div>
                  <div>• <b>面對意象</b>：{triggerItem || '夢境威脅物'}</div>
                  <div>• <b>改寫新結局</b>：{rewrittenEnding || '已在心靈中建立安全邊界'}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-[#8d97b5] space-y-1">
                <p>
                  你已向潛意識傳遞了主動掌控的訊號。今夜入睡前，可花 1 分鐘在腦海中重溫剛才寫下的安全新結局。
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-[#8d97b5] hover:text-white cursor-pointer"
                >
                  ← 修改結局
                </button>

                <div className="flex items-center gap-2">
                  {onApplyRewriteToDream && rewrittenEnding && (
                    <button
                      type="button"
                      onClick={handleApplyRewrite}
                      className="py-2 px-3.5 rounded-xl bg-[#aa9cff] text-black font-bold text-xs cursor-pointer shadow-md hover:brightness-105"
                    >
                      套用改寫至夢境筆記
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
                  >
                    完成關閉
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
