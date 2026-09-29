import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  HardDrive,
  Cloud,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  AlertTriangle,
  Heart,
  UserX,
  Sparkles,
  ArrowRight,
  Info,
  Check,
  ExternalLink,
} from 'lucide-react';
import { User, TherapistItem } from '../types';
import { TherapeuticSupportModal } from './TherapeuticSupportModal';

interface PrivacyViewProps {
  currentUser?: User | null;
  currentStoredDreamsCount?: number;
  onClearAllData: () => void;
  onDeleteAccountAndData?: () => void;
  onToggleLocalOnly: (enabled: boolean) => void;
  isLocalOnly?: boolean;
  onGoToApp: (tab?: string) => void;
  onGoBack: () => void;
  therapists?: TherapistItem[];
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
  currentUser,
  currentStoredDreamsCount = 0,
  onClearAllData,
  onDeleteAccountAndData,
  onToggleLocalOnly,
  isLocalOnly = false,
  onGoToApp,
  onGoBack,
  therapists,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [hasClearedNotice, setHasClearedNotice] = useState(false);
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleClearData = () => {
    if (window.confirm('確定要徹底清除所有已儲存的夢境記錄嗎？此操作不可逆。')) {
      onClearAllData();
      setHasClearedNotice(true);
      setTimeout(() => setHasClearedNotice(false), 4000);
    }
  };

  const handleConfirmDeleteAccount = () => {
    if (onDeleteAccountAndData) {
      onDeleteAccountAndData();
      setShowDeleteAccountModal(false);
    }
  };

  const privacyFaqs = [
    {
      q: 'AI 解夢係咪算命？會唔會預測我未來吉凶？',
      a: '絕對唔會！我哋不做任何吉凶預測或命運卜卦。AI 解夢並非算命籤文，冇任何「預知未來」嘅超自然成份。DreamWisdom 係一套基於瑞士心理學家卡爾·榮格（Carl G. Jung）原型心理學嘅「自我反思工具」，將夢境視為潛意識同自己對話嘅隱喻鏡子，幫你梳理白天壓抑嘅焦慮、未消化嘅壓力或內心渴望。',
      tag: '產品邊界',
    },
    {
      q: '呢個平台可唔可以代替心理醫生或者精神科診所？',
      a: '絕對不可以！我們反覆強調：本平台不是心理治療、不是精神科醫療服務，請勿誤以為是醫療或急診途徑。若你持續遭遇嚴重噩夢、睡眠障礙、創傷後應激（PTSD）或嚴重情緒困擾，請立即求助註冊臨床心理學家、精神科專科醫生，或聯絡香港專業心理支援熱線。',
      tag: '醫療界線',
    },
    {
      q: '我記錄低嘅夢，會唔會被拿去訓練外部通用 AI 模型？',
      a: '鄭重承諾：絕不會！你輸入或語音錄製嘅每一個字，絕對唔會用來訓練或微調外部任何公開通用 AI 模型（如 OpenAI、Google 嘅底層通用模型等）。每次解析均使用企業級隔離傳輸協議，屬於即時無狀態（Stateless）運算，分析完成後緩存即時銷毀，絕無留底入訓練集。',
      tag: 'AI訓練承諾',
    },
    {
      q: '除咗我自己之外，仲有冇其他人可以睇到我嘅夢境？',
      a: '除你本人以外，沒有任何人可以閱讀你的夢境紀錄！平台實施嚴格嘅用戶數據隔離（User Isolation）。其他用戶、訪客、甚至我哋後台嘅工程師同系統管理員，日常都無法亦無權限調閱你嘅私人夢境文字或解夢報告。你的夢境只屬於你自己。',
      tag: '隱私閱讀權',
    },
    {
      q: '我嘅資料存儲喺邊度？會唔會分享畀第三方？',
      a: '存儲位置由你自主掌控：如果你開啟「雲端同步」，資料會經過 TLS 1.3 / HTTPS 現代高強度加密，儲存於獨立安全雲端數據庫；如果你開啟本頁嘅「純本地模式」，資料就只會留在你現時部手機／電腦瀏覽器（LocalStorage），連雲端都唔會上傳！至於第三方分享：我們承諾「零分享、零出售、零第三方追蹤」，絕不會出租或轉讓任何資料畀廣告商或第三方機構。',
      tag: '存儲與第三方',
    },
    {
      q: '我想刪除資料，可以點樣做？',
      a: '你擁有 100% 數據自主權：① 單條刪除：在「我的夢境日記」裡，每一條夢境紀錄右上角都有垃圾桶按鈕，點擊即單條永久刪除；② 一鍵清空：在本頁點擊「清空全部夢境記錄」即可抹除全部夢境；③ 一鍵註銷帳戶：登入用戶可一鍵刪除全部帳號連同所有夢境與星幣資料，徹底抹除不留痕跡。',
      tag: '被遺忘權',
    },
  ];

  return (
    <div className="shell py-8 sm:py-14 max-w-4xl mx-auto" id="privacy-policy-root">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mb-3 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>香港用戶私隱與數據承諾 · DATA PRIVACY & TRUST</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
          香港用戶私隱承諾與產品邊界政策
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 mt-3 max-w-2xl mx-auto leading-relaxed font-medium">
          夢境係人最私密嘅潛意識世界。我們深明香港用戶對個人資料私隱極為重視，以最淺白嘅地道廣東話，鄭重向每位造夢者立下四項最高準則。
        </p>
      </div>

      {/* ⚠️ CRITICAL PRODUCT BOUNDARY BANNER (反覆強調產品邊界，避免用戶誤以為是醫療服務) */}
      <section className="card p-5 sm:p-7 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-xl shadow-amber-900/5 mb-10 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-bold text-xl border border-amber-500/30">
            ⚠️
          </div>
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>明確產品邊界聲明 · 非醫療承諾</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              重要聲明：本平台不是心理治療、不是精神科服務；只做基於心理學的自我反思工具，不做吉凶預測
            </h2>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              為保障每位用戶的身心福祉，請造夢者務必清楚理解以下<b>三項不可逾越的產品邊界</b>，切勿誤以為本產品提供醫療服務：
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Boundary Item 1: 不是醫療 */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-rose-200 space-y-1.5 shadow-xs">
            <div className="text-rose-700 font-bold text-xs flex items-center gap-1.5">
              <span>❌ 不是心理治療／精神科服務</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
              本平台<b>絕非臨床醫學診斷、非心理治療工具、亦非危機急救途徑</b>。不可替代註冊精神科醫生、臨床心理學家或專業醫療人員之診療。
            </p>
          </div>

          {/* Boundary Item 2: 不做吉凶預測 */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 space-y-1.5 shadow-xs">
            <div className="text-amber-800 font-bold text-xs flex items-center gap-1.5">
              <span>❌ 不做吉凶預測與玄學卜卦</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
              本平台<b>絕不做鐵口直斷嘅吉凶或命運預測</b>（如「發水一定發財」或「掉牙親人有災」）。夢境係大腦在睡眠中嘅隱喻符號，非超自然算命。
            </p>
          </div>

          {/* Boundary Item 3: 自我反思定位 */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-200 space-y-1.5 shadow-xs">
            <div className="text-emerald-800 font-bold text-xs flex items-center gap-1.5">
              <span>✅ 基於心理學的自我反思工具</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
              以卡爾·榮格（Carl Jung）的原型心理學與認知情緒整理為本，旨在引導造夢者<b>自我覺察（Self-Reflection）、梳理生活壓力與壓抑情緒</b>。
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-amber-200">
          <p className="text-[11px] text-amber-900 font-medium">
            若你正面臨持續性重度噩夢、創傷後應激（PTSD）或情緒危機，請立即尋求註冊專業人員協助。
          </p>
          <button
            type="button"
            onClick={() => setIsTherapeuticOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/20 shrink-0 transition-all"
            id="privacy-open-therapeutic-btn"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>查看香港心理支援熱線與求助指引 →</span>
          </button>
        </div>
      </section>

      {/* 4 CORE COMMITMENT CARDS (完整寫清楚用戶指令要求嘅重點 · 廣東話) */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">私隱承諾四大核心重點（廣東話正文）</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Point 1: 夢境數據絕不會用來訓練外部 AI 模型 */}
          <div className="card p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-200 space-y-3 relative overflow-hidden shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-lg border border-emerald-300">
                ✅
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                1. 夢境數據絕不會用來訓練外部 AI 模型
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              我們莊嚴承諾：你輸入或語音錄製嘅每一個夢境片段、逐字稿與情緒記錄，<b>絕對唔會傳送給外部 AI 機構（如 OpenAI、Google 基礎公開通用模型訓練庫等）用作任何模型訓練或參數微調</b>。
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>無狀態運算 (Stateless API)</span>
              </div>
              <p>每一次分析調用均在企業級安全隔離通道內完成，即時產出解讀報告後立即銷毀運算快取，絕無留底入訓練集之風險。</p>
            </div>
          </div>

          {/* Point 2: 除你本人以外，沒有人可以閱讀你的夢境紀錄 */}
          <div className="card p-5 sm:p-6 rounded-2xl bg-white border-2 border-blue-200 space-y-3 relative overflow-hidden shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-lg border border-blue-300">
                ✅
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                2. 除你本人以外，沒有人可以閱讀你的夢境紀錄
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              夢境係個人最深層隱秘嘅潛意識檔案。系統實施嚴密嘅<b>用戶行級數據隔離（User Data Isolation）</b>。除咗你本人用自己帳號或設備登入解鎖之外，<b>世界上冇任何其他人有權閱讀你嘅夢境記錄</b>。
            </p>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>工程師及管理人員零窺探權限</span>
              </div>
              <p>包括其他會員、任何公眾訪客、甚至本平台日常運維工程師均無權偷睇；平台亦無任何公開夢境搜尋功能，確保 100% 絕對隱密。</p>
            </div>
          </div>

          {/* Point 3: 隨時單條刪除，或一鍵刪除全部帳號連同所有夢境 */}
          <div className="card p-5 sm:p-6 rounded-2xl bg-white border-2 border-amber-200 space-y-3 relative overflow-hidden shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-lg border border-amber-300">
                ✅
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                3. 隨時單條刪除夢境，或一鍵刪除帳號連全部資料
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              你擁有 100% 數據完全自主權與「被遺忘權」（Right to be Forgotten）。數據隨時可刪，即時生效不留任何隱蔽緩存：
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-slate-700 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <span className="text-amber-800 font-bold shrink-0">🗑️ 單條刪除：</span>
                <span>在「我的夢境日記」裡，每一條夢境紀錄卡片右上角均有獨立刪除按鈕，隨時單條永久抹除。</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-rose-700 font-bold shrink-0">💥 一鍵刪除帳號：</span>
                <span>在本頁下方點擊「一鍵註銷帳戶並清空所有資料」，帳號、所有夢境日記、星幣餘額立即永久擦除。</span>
              </div>
            </div>
          </div>

          {/* Point 4: 資料存儲位置，是否會分享第三方 */}
          <div className="card p-5 sm:p-6 rounded-2xl bg-white border-2 border-indigo-200 space-y-3 relative overflow-hidden shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 font-bold text-lg border border-indigo-300">
                ✅
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                4. 資料存儲位置明確，絕對零分享第三方
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              <b>存儲位置雙軌自主：</b>可選擇【雲端安全加密數據庫】（TLS 1.3/HTTPS 與靜態 AES-256 加密存儲）以便多設備同步；或隨時開啟下方【純本地模式】，夢境只存於你個人裝置，不上傳雲端。
            </p>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-800 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>絕對零分享第三方 (No 3rd-Party Sharing)</span>
              </div>
              <p>我們絕不將夢境、個人檔案或使用紀錄出售、出租或分享給任何第三方廣告商、數據仲介或商業機構。全站絕無廣告追蹤器。</p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DATA CONTROLS & PRIVACY SETTINGS */}
      <section className="card p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-300 mb-10 space-y-6 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">造夢者數據自主控制台</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">
            當前已保存夢境：{currentStoredDreamsCount} 條
          </span>
        </div>

        {/* Feature 1: Pure Local Mode Switch */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">存儲位置模式切換：純本地儲存 (Local-Only)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                自主掌控
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-medium">
              開啟「純本地模式」後，你的夢境記錄將<b>僅儲存在當前手機／電腦瀏覽器 (LocalStorage)</b>，完全不傳送或存入雲端伺服器；關閉時則同步至加密數據庫，方便跨裝置登入。
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-700 font-mono font-bold">
              {isLocalOnly ? '🟢 本地模式 (Local-Only)' : '☁️ 雲端同步模式'}
            </span>
            <button
              type="button"
              onClick={() => onToggleLocalOnly(!isLocalOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isLocalOnly ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              title="切換純本地儲存或雲端同步"
              id="privacy-toggle-local-btn"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                  isLocalOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Feature 2: Single dream deletion guidance */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>🗑️ 隨時單條刪除夢境</span>
            </h3>
            <p className="text-[11px] text-slate-600 font-medium">
              前往「我的夢境日記」，每一篇夢境卡片右上角均有紅色垃圾桶，點擊即可單條永久刪除。
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoToApp('history')}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors border border-blue-200"
          >
            <span>前往夢境日記單條管理</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature 3: Clear all local dream data */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200">
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-amber-600" />
              <span>行使被遺忘權 · 一鍵清空全部夢境紀錄</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              清空儲存的所有歷史夢境紀錄（保留當前用戶登入帳戶身份）。
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasClearedNotice && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>已成功清空！</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearData}
              className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
              id="privacy-clear-all-dreams-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空所有夢境記錄</span>
            </button>
          </div>
        </div>

        {/* Feature 4: Delete Account and All Data Completely */}
        {currentUser && (
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-rose-200 bg-rose-50/70 p-4 rounded-2xl border-2">
            <div>
              <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <UserX className="w-3.5 h-3.5 text-rose-600" />
                <span>一鍵徹底註銷帳戶並永久刪除所有資料</span>
              </h3>
              <p className="text-[11px] text-rose-800 mt-0.5 font-medium">
                徹底註銷當前帳戶 ({currentUser.email})，同時永久刪除所有雲端、本機夢境數據與星幣，操作無法復原。
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all shrink-0"
              id="privacy-delete-account-btn"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>一鍵徹底刪除帳號及全部資料</span>
            </button>
          </div>
        )}
      </section>

      {/* CORE FAQ ACCORDION (地道廣東話) */}
      <section className="space-y-4 mb-10" id="privacy-core-faqs">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-mono font-bold mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>常見疑問 · 廣東話淺白解答</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            常見問題 (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {privacyFaqs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="card rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-bold shrink-0 border border-blue-200">
                      {item.tag}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      Q：{item.q}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                    <p className="leading-relaxed sm:leading-[1.75] font-medium">A：{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Back Actions */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={onGoBack}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer transition-colors border border-slate-300 shadow-xs"
        >
          返回首頁
        </button>
        <button
          type="button"
          onClick={() => onGoToApp('workspace')}
          className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-700/20 transition-all flex items-center gap-1.5"
        >
          <span>開始記錄夢境 →</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteAccountModal(false);
          }}
        >
          <div
            className="w-full max-w-md bg-white border-2 border-rose-300 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center font-bold text-xl">
              ⚠️
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">確定要徹底刪除帳號及全部資料嗎？</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                你即將行使「被遺忘權」徹底註銷帳號 <span className="font-mono text-rose-700 font-bold">{currentUser?.email}</span>。
              </p>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1 font-medium">
                <p>• 所有夢境日記與分析報告將被<b>永久抹除</b>，無法恢復。</p>
                <p>• 累積嘅星幣餘額與帳戶設定將被<b>徹底銷毀</b>。</p>
                <p>• 操作即時生效，不留任何隱蔽備份。</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer border border-slate-300"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-rose-600/20"
                id="confirm-delete-account-permanently-btn"
              >
                確認徹底刪除帳號及全部資料
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Therapeutic Support Modal */}
      <TherapeuticSupportModal
        isOpen={isTherapeuticOpen}
        onClose={() => setIsTherapeuticOpen(false)}
        therapists={therapists}
      />
    </div>
  );
};
