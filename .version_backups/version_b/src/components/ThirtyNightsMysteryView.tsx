import React, { useState } from 'react';
import { ThirtyNightsJourney, ThirtyNightsClue } from '../types';
import { Key, Lock, Unlock, Sparkles, Award, Compass, FileText, Share2, Check, Gift, ShieldCheck, Download, ChevronRight, Eye } from 'lucide-react';

interface ThirtyNightsMysteryViewProps {
  journey: ThirtyNightsJourney;
  onRecordNewNight?: () => void;
}

export const ThirtyNightsMysteryView: React.FC<ThirtyNightsMysteryViewProps> = ({
  journey,
  onRecordNewNight,
}) => {
  const [selectedClue, setSelectedClue] = useState<ThirtyNightsClue | null>(journey.clues[0] || null);
  const [selectedMilestone, setSelectedMilestone] = useState<number>(7);
  const [copied, setCopied] = useState(false);
  const [showHolographicModal, setShowHolographicModal] = useState(false);

  // Cumulative calculation (no reset on interruption)
  const completedCount = journey.completedNights || 7;
  const targetCount = 30;
  const percentage = Math.min(100, Math.round((completedCount / targetCount) * 100));

  // 4 Milestone Stage Reports
  const milestones = [
    {
      day: 7,
      title: '第 7 天 · 潛意識基調小結',
      subtitle: '基調定性：潛在壓抑防衛與情感波瀾',
      status: completedCount >= 7 ? 'unlocked' : 'locked',
      summary:
        '已初步辨識出你的深層心理基調：你在現實中常習慣維持「理性無懈可擊」的外在防衛，但夢境裡反覆出現的未關好門窗和溢水，正提示潛意識渴望釋放積壓的情感。',
      coreFinding: '情緒防禦機制偏向「理智化壓抑」，潛意識正透過意象主動調節。',
    },
    {
      day: 14,
      title: '第 14 天 · 重複模式解密',
      subtitle: '核心重複：水、門與被追逐三角結構',
      status: completedCount >= 14 ? 'unlocked' : 'locked',
      summary:
        '統計顯示你的夢境意象具有強烈互鎖性：當出現「黑影追逐」時，常伴隨「鎖死的門」或「水勢上升」。這代表某個未被完全消化的生活壓力事件正透過多個面具反覆敲門。',
      coreFinding: '三角結構正逐漸形成，準備進入下半階段突破。',
    },
    {
      day: 21,
      title: '第 21 天 · 心境轉變契機',
      subtitle: '心靈自癒轉機：恐懼逐漸轉化為直視與接納',
      status: completedCount >= 21 ? 'unlocked' : 'locked',
      summary:
        '轉折點出現！近期的夢境中，水從洪水轉為平靜海面，逃跑的腳步也開始放慢。你的自性（Self）調節力量正在主動修復受損的情感秩序。',
      coreFinding: '從被動逃離轉向主動探索，心靈具備自發性修復智慧。',
    },
    {
      day: 30,
      title: '第 30 天 · 全息盲盒終極解鎖',
      subtitle: '全息人格報告 · 專屬星圖海報 · 年度盲點提示',
      status: completedCount >= 30 ? 'unlocked' : 'locked',
      summary:
        '完成 30 夜長程心靈考古！解鎖你的個人專屬潛意識全息人格大圖鑑，揭開隱藏在你夜間夢境背後的完整靈魂地圖。',
      coreFinding: '三大終極盲盒禮物即將揭盅！',
    },
  ];

  const handleShareMystery = () => {
    const text = `【30 Nights Dream Mystery™️ 夢境盲盒】\n我已累計記錄 ${completedCount}/30 晚（中斷不重置）！\n已解鎖第 7 天階段小結：${milestones[0].summary.slice(0, 45)}...\n在 DreamWisdom 慢慢拼出你的心靈全息圖。`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card border-2 border-amber-200/80 bg-white p-6 sm:p-8 rounded-3xl relative overflow-hidden space-y-6 shadow-xl shadow-amber-900/5" id="thirty-nights-mystery-view">
      {/* Ambient subtle glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-700" />
              30 NIGHTS DREAM MYSTERY™️ 盲盒旅程
            </span>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              中斷不重置 · 累計有效
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
            30 日夢境盲盒探索
          </h2>
          <p className="text-xs text-amber-800 font-bold mt-1">
            👉簡單講：連續記錄 30 晚夢境，好似偵探破案咁，逐晚解鎖潛意識畀你嘅線索拼圖。
          </p>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-2xl leading-relaxed">
            一個夢，看見一個訊息；累積 30 個夢，看見你的完整模式。
            毋須連續記夢，中斷永不歸零。每滿 7 天即解鎖階段回饋，累積滿 30 夜自動揭開終極全息盲盒！
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareMystery}
            className="text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs cursor-pointer transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? '已複製進度' : '分享盲盒進度'}</span>
          </button>
          {onRecordNewNight && (
            <button
              type="button"
              onClick={onRecordNewNight}
              className="text-xs font-bold px-4 py-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md shadow-amber-700/20 cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>記下今晚夢境 (+1)</span>
            </button>
          )}
        </div>
      </div>

      {/* Cumulative Progress Bar (中斷不重置) */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-200/80 space-y-3 relative z-10 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold text-sm">
              已累計記錄 <span className="text-amber-800 font-mono text-base font-extrabold">{completedCount}</span> / 30 晚
            </span>
            <span className="text-slate-600 font-semibold">（進度：{percentage}%）</span>
          </div>
          <span className="font-mono text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs">
            ✨ 還差 {Math.max(0, 14 - completedCount)} 晚解鎖【第 14 天 重複模式解密】
          </span>
        </div>

        {/* Outer bar */}
        <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300 relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-sky-500 to-indigo-600 rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* 4 Milestones Timeline Checkpoints */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {milestones.map((m) => {
            const isReached = completedCount >= m.day;
            const isSelected = selectedMilestone === m.day;
            return (
              <button
                key={m.day}
                type="button"
                onClick={() => setSelectedMilestone(m.day)}
                className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-white shadow-md ring-2 ring-amber-300'
                    : isReached
                    ? 'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/80'
                    : 'border-slate-200 bg-white/70 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-slate-900">Day {m.day}</span>
                  {isReached ? (
                    <span className="text-emerald-700 font-bold font-mono text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> 已解鎖
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px] font-semibold flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> 鎖定中
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-800 truncate font-bold">
                  {m.title.split('·')[1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detail Banner */}
      {(() => {
        const activeM = milestones.find((m) => m.day === selectedMilestone) || milestones[0];
        const isUnlocked = completedCount >= activeM.day;
        return (
          <div className="p-5 rounded-2xl bg-white border-2 border-indigo-200 space-y-3 shadow-md relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">{activeM.title}</h3>
                <span className="text-xs text-slate-600 font-medium">· {activeM.subtitle}</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${isUnlocked ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {isUnlocked ? '✓ 階段分析已生成' : `需累積 ${activeM.day} 晚`}
              </span>
            </div>

            {isUnlocked ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  {activeM.summary}
                </p>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center gap-2">
                  <Compass className="w-4 h-4 shrink-0 text-blue-700" />
                  <span><b>核心指引：</b>{activeM.coreFinding}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-medium py-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>繼續累積記錄 {activeM.day - completedCount} 個夢境即可自動解鎖此階段潛意識深入分析。</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Clarified Final Holographic Mystery Box Content Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 border-2 border-amber-300 relative overflow-hidden z-10 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Gift className="w-4 h-4 text-amber-600" />
              <span>第 30 天終極盲盒三大專屬獎勵 (Final Mystery Unlocks)</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              完成 30 夜考古，即可獲得三項終極心靈資產：
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-lg">📜</span>
                <b className="text-xs text-slate-900 block font-bold">1. 潛意識全息人格報告</b>
                <span className="text-[11px] text-slate-700 leading-tight block">
                  榮格原型與弗洛伊德願望整合之全方位多維心理畫像 (PDF)。
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-lg">🌌</span>
                <b className="text-xs text-slate-900 block font-bold">2. 專屬夢境星圖海報</b>
                <span className="text-[11px] text-slate-700 leading-tight block">
                  30 場夢境的象徵演進高解析度可印刷星系宇宙圖。
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-lg">🧭</span>
                <b className="text-xs text-slate-900 block font-bold">3. 年度心靈盲點提示</b>
                <span className="text-[11px] text-slate-700 leading-tight block">
                  AI 跨時長對比指出的潛在生活盲點與自我修復錦囊。
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs text-amber-900 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-300">
              當前累積：{completedCount} / 30 晚
            </span>
            <button
              type="button"
              onClick={() => setShowHolographicModal(true)}
              className="text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>搶先預覽盲盒樣張</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clues Collector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 relative z-10">
        {/* Left 7 Cols: Unlocked & Locked Clues list */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs text-slate-700 uppercase tracking-wider font-bold flex items-center justify-between">
            <span>每晚解密線索匣 (Clues Collector)</span>
            <span className="text-blue-700">已收錄 {journey.clues.length} 塊拼圖</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {journey.clues.map((clue) => {
              const isSelected = selectedClue?.night === clue.night;
              return (
                <button
                  key={clue.night}
                  type="button"
                  onClick={() => setSelectedClue(clue)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                    !clue.unlocked
                      ? 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
                      : isSelected
                      ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      {clue.date}
                    </span>
                    {clue.unlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>

                  <b className={`text-xs ${clue.unlocked ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {clue.clueTitle}
                  </b>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 font-medium">
                    {clue.clueText}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Clue Detail & Phase Synthesis Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Phase Synthesis Card */}
          {journey.overallMysteryReport && (
            <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-lg relative overflow-hidden space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  30 NIGHTS STAGE VERDICT · 階段性判詞
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-slate-900">
                {journey.overallMysteryReport.coreMetaphor}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {journey.overallMysteryReport.deepSynthesis}
              </p>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-medium">
                <b className="text-emerald-900">潛意識指示：</b>
                {journey.overallMysteryReport.subconsciousDirective}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">集齊 30 夜將自動解鎖全景長篇 PDF</span>
                <span className="text-amber-800 font-bold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  已準備好 1/3
                </span>
              </div>
            </div>
          )}

          {/* Selected Clue Card */}
          {selectedClue && (
            <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">線索細節</span>
                <span className="text-xs text-amber-800 font-mono font-bold">{selectedClue.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{selectedClue.clueTitle}</h4>
              <p className="text-xs text-slate-700 leading-relaxed mb-3 font-medium">
                {selectedClue.clueText}
              </p>
              {selectedClue.unlocked ? (
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  此線索已永久收錄於你的夢境基因庫中。
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  累積記錄達標當晚即可解鎖破譯。
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Holographic Mystery Box Preview Modal */}
      {showHolographicModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="card max-w-xl w-full bg-white border-2 border-amber-300 p-6 sm:p-7 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">終極全息盲盒樣張預覽</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHolographicModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-800">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <b className="text-slate-900 text-sm font-bold">📜 潛意識全息人格報告樣章：</b>
                <p className="text-slate-700 italic">
                  「個案具備高度理智化防禦特徵，影子（Shadow）常具象化為疾馳的黑影或未作答的試卷；而阿尼瑪（Anima）則透過平靜海面上遠方的光芒顯現，代表自我整合的終極召喚。」
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <b className="text-slate-900 text-sm font-bold">🌌 專屬夢境星圖海報樣式：</b>
                <p className="text-slate-700">
                  以深邃宇宙藍為主調，標註 30 顆星辰的共振軌道與 4 次水意象角色躍遷曲線，支持超高解析度向量印製。
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <b className="text-amber-950 text-sm font-bold">🧭 年度心靈盲點提示樣式：</b>
                <p className="text-amber-900 font-medium">
                  「警惕將『責任擔當』過度代換為『壓抑脆弱』。當現實中出現逃避溝通時，多留意是否有類似水浸夢境的重現警告。」
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHolographicModal(false)}
              className="w-full text-xs font-bold py-3 mt-2 cursor-pointer rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all"
            >
              我知道了，繼續累計記錄解鎖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

