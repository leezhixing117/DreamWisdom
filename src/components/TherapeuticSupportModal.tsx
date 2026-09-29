import React, { useState, useMemo } from 'react';
import {
  Heart,
  X,
  Sparkles,
  Moon,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle,
  Star,
  CheckCircle2,
  Clock,
  Search,
  Check,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { TherapistItem } from '../types';
import { INITIAL_THERAPISTS } from '../data/therapists';

interface TherapeuticSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapists?: TherapistItem[];
  prefilledDreamText?: string;
  initialNeed?: string;
}

const NEED_PRESETS = [
  { id: 'all', label: '🌟 全部需要', keywords: [] },
  { id: 'nightmare', label: '😱 噩夢驚醒／被追逐', keywords: ['噩夢', '被追', '驚醒', '恐懼', '狂奔', '窒息感'] },
  { id: 'insomnia', label: '🌙 失眠與睡眠障礙', keywords: ['失眠', '睡眠障礙', '頻繁做夢', '胸口發悶', '焦慮'] },
  { id: 'paralysis', label: '🪨 鬼壓床／動彈不得', keywords: ['身體動彈不得', '鬼壓床', '呼吸急促', '被巨石壓住', '驚慌發作'] },
  { id: 'shadow', label: '🧠 潛意識陰影／反覆夢', keywords: ['黑影', '怪物', '迷路', '考試', '掉牙齒', '重複場景', '廢墟'] },
  { id: 'grief', label: '🕊️ 離世親人／前世回溯', keywords: ['離世親人', '前世感', '深海', '被困水底', '時空跳躍'] },
];

export const TherapeuticSupportModal: React.FC<TherapeuticSupportModalProps> = ({
  isOpen,
  onClose,
  therapists = INITIAL_THERAPISTS,
  prefilledDreamText = '',
  initialNeed = 'all',
}) => {
  const [selectedNeed, setSelectedNeed] = useState<string>(initialNeed);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Extract all unique specialties & regions for filter menus
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => t.specialties.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [therapists]);

  const allRegions = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => t.regions.forEach((r) => set.add(r)));
    return Array.from(set);
  }, [therapists]);

  // Compute recommendation scores and filter
  const recommendedTherapists = useMemo(() => {
    const needObj = NEED_PRESETS.find((n) => n.id === selectedNeed);
    const needKeywords = needObj ? needObj.keywords : [];

    const dreamLower = (prefilledDreamText || '').toLowerCase();
    const searchLower = searchKeyword.trim().toLowerCase();

    return therapists
      .map((t) => {
        let score = 0;

        // Status weight: available therapists get higher priority
        if (t.status === 'available') score += 10;
        else if (t.status === 'busy') score += 2;
        else if (t.status === 'rest') score -= 5;

        // Featured weight
        if (t.featured) score += 5;

        // Match need keywords
        if (needKeywords.length > 0) {
          const matchCount = t.matchDreamKeywords.filter((kw) =>
            needKeywords.some((nk) => nk.includes(kw) || kw.includes(nk))
          ).length;
          score += matchCount * 8;
        }

        // Match prefilled dream text if present
        if (dreamLower) {
          const dreamMatchCount = t.matchDreamKeywords.filter((kw) =>
            dreamLower.includes(kw.toLowerCase())
          ).length;
          score += dreamMatchCount * 6;
        }

        // Search text matching
        if (searchLower) {
          const matchesSearch =
            t.name.toLowerCase().includes(searchLower) ||
            t.title.toLowerCase().includes(searchLower) ||
            t.bio.toLowerCase().includes(searchLower) ||
            t.specialties.some((s) => s.toLowerCase().includes(searchLower)) ||
            t.regions.some((r) => r.toLowerCase().includes(searchLower));

          if (!matchesSearch) score = -999; // filter out
        }

        // Filter by specialty
        if (selectedSpecialty !== 'all' && !t.specialties.includes(selectedSpecialty)) {
          score = -999;
        }

        // Filter by region
        if (selectedRegion !== 'all' && !t.regions.some((r) => r.includes(selectedRegion))) {
          score = -999;
        }

        // Filter by status
        if (selectedStatus !== 'all' && t.status !== selectedStatus) {
          score = -999;
        }

        return { ...t, matchScore: score };
      })
      .filter((t) => t.matchScore > -500)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [
    therapists,
    selectedNeed,
    selectedSpecialty,
    selectedRegion,
    selectedStatus,
    searchKeyword,
    prefilledDreamText,
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      id="therapeutic-support-modal-overlay"
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-white border-2 border-emerald-300 rounded-3xl relative shadow-2xl overflow-hidden text-left"
        id="therapeutic-support-modal-container"
      >
        {/* Glow Ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 flex items-start justify-between gap-4 relative shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 shadow-sm">
              <Heart className="w-6 h-6 fill-emerald-600 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  CARE & THERAPISTS MATCHING
                </span>
                <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                  根據客人需要、專長、地區與狀態智能推薦
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                心靈、睡眠與夢境治療師推薦庫
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
          {/* Compassionate Statement */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              若反覆噩夢、被追逐驚醒或胸口沉重帶來困擾，<b>夢境不是預言，而是心靈的呼救與自我調節</b>。
              以下嚴選通過審核認證的專業音療師、榮格心理學家與身心整合專家，支援隨選即時諮詢。
            </p>
          </div>

          {/* FILTER SECTION 1: 客人需要 (Customer Needs Preset Chips) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>① 請選擇您的夢境／身心需要 (按需要推薦)：</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">即時比對專長關鍵詞</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {NEED_PRESETS.map((item) => {
                const isSelected = selectedNeed === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedNeed(item.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm scale-[1.02]'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILTER SECTION 2: 專長、地區、狀態、搜尋欄 */}
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Filter: Specialty */}
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-bold">
                  🎯 治療師專長
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="all">全部專長</option>
                  {allSpecialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Filter: Region */}
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-bold">
                  📍 服務地區
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="all">全部地區</option>
                  <option value="香港">香港全區</option>
                  <option value="旺角">香港 · 旺角</option>
                  <option value="銅鑼灣">香港 · 銅鑼灣</option>
                  <option value="中環">香港 · 中環</option>
                  <option value="尖沙咀">香港 · 尖沙咀</option>
                  <option value="台灣">台灣 · 台北</option>
                  <option value="線上視像">線上視像 (Zoom / Meet)</option>
                </select>
              </div>

              {/* Filter: Status */}
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-bold">
                  🟢 即時預約狀態
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="all">全部狀態</option>
                  <option value="available">🟢 可即時預約</option>
                  <option value="busy">🟡 預約爆滿</option>
                  <option value="rest">⚪ 休假中</option>
                </select>
              </div>

              {/* Search keywords */}
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-bold">
                  🔍 搜尋姓名／關鍵字
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="如：頌缽、Amy、榮格..."
                    className="w-full text-xs px-3 py-2 pr-8 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 placeholder-slate-400 font-medium"
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Filter Reset */}
            {(selectedNeed !== 'all' ||
              selectedSpecialty !== 'all' ||
              selectedRegion !== 'all' ||
              selectedStatus !== 'all' ||
              searchKeyword) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-600">
                <span>
                  篩選中：符合條件的治療師共 <b className="text-slate-900">{recommendedTherapists.length}</b> 位
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNeed('all');
                    setSelectedSpecialty('all');
                    setSelectedRegion('all');
                    setSelectedStatus('all');
                    setSearchKeyword('');
                  }}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  重設所有篩選
                </button>
              </div>
            )}
          </div>

          {/* THERAPIST CARDS LIST */}
          <div className="space-y-4" id="therapists-matching-list">
            {recommendedTherapists.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white border-2 border-slate-200 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">暫無完全符合該篩選組合的治療師</h4>
                <p className="text-xs text-slate-600 font-medium">
                  請嘗試放寬「專長」或「地區」篩選，或選擇「線上視像 (Zoom)」以瀏覽更多專家。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNeed('all');
                    setSelectedSpecialty('all');
                    setSelectedRegion('all');
                    setSelectedStatus('all');
                    setSearchKeyword('');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs"
                >
                  顯示全體治療師
                </button>
              </div>
            ) : (
              recommendedTherapists.map((therapist, index) => {
                const isTopMatch = index === 0 && selectedNeed !== 'all';

                return (
                  <div
                    key={therapist.id}
                    className={`card p-5 sm:p-6 rounded-3xl transition-all border-2 ${
                      isTopMatch
                        ? 'bg-white border-emerald-400 shadow-lg ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                    id={`therapist-card-${therapist.id}`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-start sm:items-center gap-3.5">
                        {/* Avatar photo */}
                        <div className="relative shrink-0">
                          <img
                            src={therapist.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                            alt={therapist.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                          {therapist.status === 'available' && (
                            <span
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                              title="可即時預約"
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                              <span>{therapist.name}</span>
                              {therapist.rating && (
                                <span className="inline-flex items-center gap-0.5 text-xs text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  {therapist.rating}
                                </span>
                              )}
                            </h4>

                            {/* Status Badge */}
                            {therapist.status === 'available' && (
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                🟢 可即時預約
                              </span>
                            )}
                            {therapist.status === 'busy' && (
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold">
                                🟡 預約爆滿 (排期中)
                              </span>
                            )}
                            {therapist.status === 'rest' && (
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-bold">
                                ⚪ 休假中
                              </span>
                            )}

                            {isTopMatch && (
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold">
                                ✨ 依您的夢境最佳推薦
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-indigo-900 font-bold mt-0.5">
                            {therapist.title}
                          </p>

                          {therapist.experienceYears && (
                            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                              資歷：{therapist.experienceYears} 年身心靈與臨床引導經驗
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Booking CTA Button directly linked */}
                      <div className="flex flex-row sm:flex-col items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        {therapist.consultationFee && (
                          <div className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            {therapist.consultationFee}
                          </div>
                        )}
                        <a
                          href={therapist.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full sm:w-auto text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                            therapist.status === 'available'
                              ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-emerald-700/20'
                              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>
                            {therapist.status === 'available'
                              ? '即時預約 / 諮詢連結'
                              : therapist.status === 'busy'
                              ? '預約候補諮詢'
                              : '瀏覽治療師資訊'}
                          </span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-75" />
                        </a>
                      </div>
                    </div>

                    {/* Bio Narrative */}
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed my-3.5 font-medium">
                      {therapist.bio}
                    </p>

                    {/* Specialties & Regions Tags */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      {/* Specialties */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-1 font-bold">專長：</span>
                        {therapist.specialties.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-semibold"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Regions */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-1 font-bold">地區：</span>
                        {therapist.regions.map((reg, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1 font-medium"
                          >
                            <MapPin className="w-3 h-3 text-blue-700" />
                            {reg}
                          </span>
                        ))}

                        {therapist.contactPhone && (
                          <span className="text-[11px] text-slate-600 ml-2 font-mono font-semibold">
                            ☎️ {therapist.contactPhone}
                          </span>
                        )}
                      </div>

                      {/* Matched Keywords Indicator */}
                      {therapist.matchDreamKeywords && therapist.matchDreamKeywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1 text-[11px] text-emerald-800 font-bold">
                          <span className="text-slate-500 font-medium">適合夢境情境：</span>
                          {therapist.matchDreamKeywords.map((kw, i) => (
                            <span key={i} className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">#{kw}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Self-Care Techniques & Emergency Help Accordion */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>日常自主撫平練習 (Self-Care Guide)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <b className="text-slate-900 block mb-1 font-bold">意象重寫療法 (IRT)</b>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                  在白天清醒時把噩夢結尾改寫成平安結局（如遇黑影追逐時轉身平靜對話或走進溫暖寺廟），每晚睡前於腦海預演。
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <b className="text-slate-900 block mb-1 font-bold">睡前 4-7-8 腹式呼吸</b>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                  吸氣 4 秒、屏氣 7 秒、吐氣 8 秒。讓副交感神經重新主導，向大腦釋放「此刻的我身在安全居所」的信號。
                </p>
              </div>
            </div>

            {/* 24-Hour Hotlines */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-xs">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5 mb-2">
                <Phone className="w-3.5 h-3.5 text-indigo-700" />
                如感到極度痛苦或難以承受，請即撥打 24 小時免費求助熱線：
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-bold block">香港地區</span>
                  <div className="text-slate-900 font-mono font-bold">情緒通熱線：18111 (24小時免費)</div>
                  <div className="text-slate-600 text-[11px] font-medium">撒瑪利亞防止自殺會：2389 2222</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-bold block">台灣地區</span>
                  <div className="text-slate-900 font-mono font-bold">衛生福利部安心專線：1925 (24小時)</div>
                  <div className="text-slate-600 text-[11px] font-medium">生命線協談專線：1995</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline font-medium">
            所有資料由管理員審核把關 · 預約與收費由治療師直接對接
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs ml-auto cursor-pointer shadow-md shadow-blue-700/20 transition-all"
          >
            完成瀏覽，返回夢境
          </button>
        </div>
      </div>
    </div>
  );
};
