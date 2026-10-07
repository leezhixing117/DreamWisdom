import React, { useState, useMemo } from 'react';
import { DreamEntry } from '../types';
import { exportHtmlToWord } from '../utils/wordExport';
import {
  Search,
  Tag,
  Filter,
  Calendar,
  Download,
  Printer,
  Bell,
  BellRing,
  Check,
  Plus,
  X,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Smile,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface DreamJournalManagerProps {
  history: DreamEntry[];
  onSelectEntry: (entry: DreamEntry) => void;
  onUpdateEntryTags: (id: string, newTags: string[]) => void;
  onDeleteEntry?: (id: string) => void;
}

const PRESET_TAGS = ['噩夢', '重複夢', '預知感', '清醒夢', '情緒發洩', '自我整合'];
const PRESET_EMOTIONS = ['全部', '焦慮', '驚慌', '平靜', '迷茫', '喜悅', '壓抑'];

export const DreamJournalManager: React.FC<DreamJournalManagerProps> = ({
  history,
  onSelectEntry,
  onUpdateEntryTags,
  onDeleteEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('全部');
  const [dateRange, setDateRange] = useState<'all' | '7days' | 'month' | 'year'>('all');
  const [activeTagInputId, setActiveTagInputId] = useState<string | null>(null);
  const [customTagText, setCustomTagText] = useState('');

  // PDF Export Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfPeriod, setPdfPeriod] = useState<'month' | 'year' | 'all'>('month');

  // Morning Notification State
  const [notificationStatus, setNotificationStatus] = useState<'default' | 'granted' | 'denied'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission as 'default' | 'granted' | 'denied';
    }
    return 'default';
  });
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dreamwisdom_morning_reminder') === 'true';
    } catch {
      return false;
    }
  });
  const [showReminderNotice, setShowReminderNotice] = useState(false);

  // Request browser notification permission
  const handleToggleReminder = async () => {
    if (!('Notification' in window)) {
      alert('你的瀏覽器暫不支援 Web Notification 推播功能');
      return;
    }

    if (notificationStatus !== 'granted') {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        setReminderEnabled(true);
        localStorage.setItem('dreamwisdom_morning_reminder', 'true');
        setShowReminderNotice(true);
        // Fire instant demonstration notification
        try {
          new Notification('☀️ 今朝發咗咩夢？趁仲記得，講俾我聽', {
            body: '醒來 10 分鐘內記夢最完整。即刻點此開展今日潛意識解密！',
            icon: '/favicon.ico',
          });
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      const next = !reminderEnabled;
      setReminderEnabled(next);
      localStorage.setItem('dreamwisdom_morning_reminder', String(next));
      if (next) setShowReminderNotice(true);
    }
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return history.filter((item) => {
      // Keyword match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const textMatch = (item.dream_text || '').toLowerCase().includes(q);
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const summaryMatch = (item.report_json?.summary || '').toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        const symbolMatch = (item.report_json?.symbols || []).some((s) =>
          s.symbol.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q)
        );
        if (!textMatch && !titleMatch && !summaryMatch && !tagMatch && !symbolMatch) {
          return false;
        }
      }

      // Tag match
      if (selectedTag !== '全部') {
        const itemTags = item.tags || [];
        if (!itemTags.includes(selectedTag)) return false;
      }

      // Emotion match
      if (selectedEmotion !== '全部') {
        const text = `${item.dream_text} ${item.report_json?.summary || ''} ${item.report_json?.fourLayers?.personalLayer?.description || ''}`;
        if (!text.includes(selectedEmotion)) return false;
      }

      // Date range match
      if (dateRange !== 'all') {
        const date = new Date(item.created_at).getTime();
        const now = Date.now();
        const diffDays = (now - date) / (1000 * 3600 * 24);
        if (dateRange === '7days' && diffDays > 7) return false;
        if (dateRange === 'month' && diffDays > 30) return false;
        if (dateRange === 'year' && diffDays > 365) return false;
      }

      return true;
    });
  }, [history, searchQuery, selectedTag, selectedEmotion, dateRange]);

  // Handle adding custom tag
  const handleAddTag = (entryId: string, tagToAdd: string) => {
    if (!tagToAdd.trim()) return;
    const entry = history.find((e) => e.id === entryId);
    if (!entry) return;
    const currentTags = entry.tags || [];
    if (!currentTags.includes(tagToAdd.trim())) {
      const updated = [...currentTags, tagToAdd.trim()];
      onUpdateEntryTags(entryId, updated);
    }
    setCustomTagText('');
    setActiveTagInputId(null);
  };

  // Handle removing tag
  const handleRemoveTag = (entryId: string, tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const entry = history.find((e) => e.id === entryId);
    if (!entry) return;
    const updated = (entry.tags || []).filter((t) => t !== tagToRemove);
    onUpdateEntryTags(entryId, updated);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportWord = () => {
    const periodLabel = pdfPeriod === 'month' ? '本月度精裝手冊' : pdfPeriod === 'year' ? '年度潛意識全書' : '全部典藏歸檔';
    const title = `DreamWisdom 潛意識漫遊指南 · 夢境手冊 (${periodLabel})`;
    const htmlItems = filteredEntries.map((e, idx) => `
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;">
        <h3>Chapter ${idx + 1}：${e.title}</h3>
        <p class="meta">記錄日期：${new Date(e.created_at).toLocaleDateString('zh-HK')} · 標籤：${e.tags?.join(', ') || '無'}</p>
        <p><strong>【夢境如實還原】：</strong></p>
        <div class="quote-box">「${e.dream_text}」</div>
        ${e.report_json?.summary ? `<p><strong>【核心心理透視】：</strong><br>${e.report_json.summary}</p>` : ''}
        ${e.report_json?.fourLayers ? `
          <p><strong>【榮格心理與無意識層面】：</strong><br>${e.report_json.fourLayers.jungianLayer.description}</p>
          <p><strong>【現實情感與生活整合指引】：</strong><br>${e.report_json.fourLayers.spiritualLayer.description}</p>
        ` : ''}
      </div>
    `).join('');

    exportHtmlToWord(title, title, htmlItems);
  };

  return (
    <div className="space-y-6" id="dream-journal-manager">
      {/* Morning Reminder Notification Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ffd27a]/15 via-[#aa9cff]/15 to-[#12162a] border border-[#ffd27a]/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffd27a]/20 border border-[#ffd27a]/40 flex items-center justify-center shrink-0">
            {reminderEnabled ? (
              <BellRing className="w-5 h-5 text-[#ffd27a] animate-bounce" />
            ) : (
              <Bell className="w-5 h-5 text-[#ffd27a]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <b className="text-xs sm:text-sm text-white">晨間黃金記夢提醒</b>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 text-[#78e1b5]">
                {reminderEnabled ? '每日 07:30 喚醒' : '未開啟'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              「今朝發咗咩夢？趁仲記得，講俾我聽」—— 醒來 10 分鐘內記夢能保留 90% 潛意識細節。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleReminder}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              reminderEnabled
                ? 'bg-[#78e1b5]/20 text-[#78e1b5] border border-[#78e1b5]/40 hover:bg-[#78e1b5]/30'
                : 'bg-[#ffd27a] text-black hover:bg-[#ffe09e] shadow-md shadow-[#ffd27a]/20'
            }`}
          >
            {reminderEnabled ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            <span>{reminderEnabled ? '已開啟晨間提醒' : '開啟晨間定時推播'}</span>
          </button>
        </div>
      </div>

      {showReminderNotice && (
        <div className="p-3 rounded-xl bg-[#78e1b5]/10 border border-[#78e1b5]/30 text-xs text-[#78e1b5] flex items-center justify-between">
          <span>✨ 成功設定晨間推播！每天早晨醒來將第一時間提示你記錄潛意識訊息。</span>
          <button type="button" onClick={() => setShowReminderNotice(false)} className="text-[#78e1b5] hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Action Header & Search / Filter Controls */}
      <div className="card p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ffd27a]" />
              <span>夢境手冊與檢索管理</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              自訂標籤分類、多維度篩選檢索，並可一鍵導出月度/年度「潛意識漫遊指南」PDF。
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPdfModal(true)}
            className="btn text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#aa9cff]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>導出 PDF 夢境手冊</span>
          </button>
        </div>

        {/* Search Bar & Date range */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索關鍵字、象徵（如：水、黑影、門）、心靈解析、或自定義標籤..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 shadow-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-1 bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5 shrink-0" />
            {(['all', '7days', 'month', 'year'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`flex-1 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  dateRange === r ? 'bg-blue-700 text-white font-semibold' : 'text-slate-500 hover:text-white'
                }`}
              >
                {r === 'all' ? '全部' : r === '7days' ? '7天' : r === 'month' ? '本月' : '年度'}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3 text-blue-700" /> 標籤分類：
            </span>
            {['全部', ...PRESET_TAGS].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-blue-700 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-white border border-slate-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mr-1">
              <Smile className="w-3 h-3 text-[#ffd27a]" /> 心情色調：
            </span>
            {PRESET_EMOTIONS.map((emo) => (
              <button
                key={emo}
                type="button"
                onClick={() => setSelectedEmotion(emo)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                  selectedEmotion === emo
                    ? 'bg-[#ffd27a]/20 text-[#ffd27a] border border-[#ffd27a]/40 font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {emo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Dream Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            共檢索到 <span className="text-white font-mono font-bold">{filteredEntries.length}</span> 篇夢境記錄
            {selectedTag !== '全部' && `（標籤：${selectedTag}）`}
            {searchQuery && `（包含「${searchQuery}」）`}
          </span>
          {filteredEntries.length !== history.length && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('全部');
                setSelectedEmotion('全部');
                setDateRange('all');
              }}
              className="text-blue-700 hover:underline cursor-pointer"
            >
              清除所有篩選
            </button>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500/50" />
            <p className="text-xs">找不到符合篩選條件的夢境記錄</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('全部');
                setSelectedEmotion('全部');
                setDateRange('all');
              }}
              className="text-xs text-blue-700 underline cursor-pointer"
            >
              重置檢索條件
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => {
              const tags = entry.tags || [];
              const isTagInputActive = activeTagInputId === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  className="card p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-600/40 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(entry.created_at).toLocaleDateString('zh-HK', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            weekday: 'short',
                          })}
                        </span>
                        {entry.report_json?.fourLayers?.jungianLayer?.archetype && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-700/15 text-blue-700 border border-blue-600/20">
                            原型：{entry.report_json.fourLayers.jungianLayer.archetype}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white mt-1 group-hover:text-[#ffd27a] transition-colors">
                        {entry.title || '未命名夢境'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                      <span className="group-hover:text-blue-700 transition-colors">查看報告</span>
                      <ChevronRight className="w-4 h-4 group-hover:text-blue-700" />
                      {onDeleteEntry && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('確定要刪除這條夢境記錄嗎？刪除後無法復原。')) {
                              onDeleteEntry(entry.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                          title="刪除此條夢境紀錄"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#cbd2ef] leading-relaxed line-clamp-2">
                    {entry.report_json?.summary || entry.dream_text}
                  </p>

                  {/* Tags and Tag Addition Row */}
                  <div
                    className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mr-1">
                      <Tag className="w-3 h-3" />
                    </span>

                    {tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-blue-700/15 text-[#d8ddf0] border border-blue-600/30 flex items-center gap-1"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveTag(entry.id, t, e)}
                          className="hover:text-red-400 cursor-pointer ml-0.5"
                          title="移除標籤"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {/* Quick Preset Tag Adders if not already present */}
                    {PRESET_TAGS.filter((pt) => !tags.includes(pt)).slice(0, 3).map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => handleAddTag(entry.id, pt)}
                        className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 hover:text-white hover:bg-slate-200 border border-slate-100 cursor-pointer transition-colors"
                      >
                        +{pt}
                      </button>
                    ))}

                    {/* Custom Tag Input Trigger */}
                    {isTagInputActive ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={customTagText}
                          onChange={(e) => setCustomTagText(e.target.value)}
                          placeholder="自訂標籤..."
                          className="px-2 py-0.5 text-[10px] rounded bg-black/60 border border-blue-600 text-white focus:outline-none w-20"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTag(entry.id, customTagText);
                            } else if (e.key === 'Escape') {
                              setActiveTagInputId(null);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag(entry.id, customTagText)}
                          className="text-[10px] px-1.5 py-0.5 bg-blue-700 text-white rounded cursor-pointer"
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTagInputId(null)}
                          className="text-[10px] px-1 text-slate-500 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTagInputId(entry.id);
                          setCustomTagText('');
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 hover:text-white hover:bg-slate-200 border border-dashed border-slate-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>自訂標籤</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Export Printable Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card max-w-2xl w-full bg-[#0c1022] border border-[#ffd27a]/40 p-6 rounded-3xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="badge">
                  <FileText className="w-3 h-3 text-[#ffd27a]" />
                  PRINTABLE JOURNAL EXPORT
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  導出「潛意識漫遊指南」PDF 夢境手冊
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="text-slate-600 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Layout Options */}
            <div className="space-y-3">
              <label className="text-xs text-slate-500 uppercase font-semibold">排版週期範圍</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'month', label: '本月度精裝手冊', desc: '過去 30 天夢境彙總' },
                  { id: 'year', label: '年度潛意識全書', desc: '整年夢境心靈圖鑑' },
                  { id: 'all', label: '全部典藏歸檔', desc: `收錄全部 ${history.length} 篇` },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPdfPeriod(p.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      pdfPeriod === p.id
                        ? 'bg-[#ffd27a]/15 border-[#ffd27a] text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <b className="block text-xs text-white">{p.label}</b>
                    <span className="text-[10px] opacity-75">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Preview Snapshot */}
            <div className="p-5 rounded-2xl bg-[#f6f7ff] text-slate-800 space-y-3 shadow-inner border border-slate-300 font-serif">
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                  DREAMWISDOM · SUBCONSCIOUS WANDERING JOURNAL
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">潛意識漫遊指南 · 夢境手冊</h2>
                <div className="text-[11px] text-slate-600 mt-0.5 font-sans">
                  典藏者：會員專屬檔案 · 收錄夢境篇數：{filteredEntries.length} 篇 · 生成日期：
                  {new Date().toLocaleDateString('zh-HK')}
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed max-h-48 overflow-y-auto pr-2">
                {filteredEntries.slice(0, 3).map((e, idx) => (
                  <div key={e.id} className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Chapter {idx + 1} · {new Date(e.created_at).toLocaleDateString('zh-HK')}</span>
                      <span>{e.tags?.join(', ') || '經典記錄'}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{e.title}</div>
                    <p className="text-[11px] text-slate-700 italic mt-1 line-clamp-2 font-sans">
                      「{e.dream_text}」
                    </p>
                    {e.report_json?.fourLayers && (
                      <div className="text-[10px] text-indigo-700 mt-1 font-sans">
                        • 榮格心理層：{e.report_json.fourLayers.jungianLayer.description.slice(0, 45)}...
                      </div>
                    )}
                  </div>
                ))}
                {filteredEntries.length > 3 && (
                  <div className="text-center text-[10px] text-slate-500 font-sans italic py-1">
                    ... 及其餘 {filteredEntries.length - 3} 篇夢境與 4 層破譯，將完整進入印刷/PDF 排版 ...
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="btn2 text-xs px-4 py-2 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExportWord}
                className="btn2 text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer border-blue-600/40 text-[#c3b9ff] hover:bg-blue-700/15"
                id="journal-export-word-btn"
                title="匯出為 Microsoft Word 格式檔案 (.doc)"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" />
                <span>匯出 Word 文件 (.doc)</span>
              </button>
              <button
                type="button"
                onClick={handlePrintPdf}
                className="btn text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#ffd27a]/20"
                id="journal-export-pdf-btn"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>立即列印 / 另存為 PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
