import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  ExternalLink,
  MessageCircle,
  Star,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Phone,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Filter,
  Check,
  X,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { TherapistItem, UserRole } from '../types';

interface TherapistAdminManagerProps {
  therapists: TherapistItem[];
  onSaveTherapists: (therapists: TherapistItem[]) => void;
  currentUserRole?: UserRole;
  currentUserId?: string;
}

const PRESET_SPECIALTIES = [
  '頌缽音療',
  '西藏銅缽深層放鬆',
  '睡眠障礙修復',
  '榮格心理學',
  '陰影整合',
  '反覆夢境探索',
  '催眠回溯 (QHHT)',
  '前世與阿卡西記憶',
  '體感創傷釋放 (TRE)',
  '植物精油與花精',
  '童年創傷療癒',
  '內在小孩對話',
];

const PRESET_REGIONS = [
  '香港 · 旺角',
  '香港 · 銅鑼灣',
  '香港 · 中環',
  '香港 · 尖沙咀',
  '香港 · 觀塘',
  '台灣 · 台北',
  '線上視像 (Zoom / Google Meet)',
];

const PRESET_KEYWORDS = [
  '噩夢',
  '被追',
  '驚醒',
  '失眠',
  '頻繁做夢',
  '身體動彈不得',
  '鬼壓床',
  '黑影',
  '怪物',
  '胸口發悶',
  '迷路',
  '廢墟',
  '深海',
  '溺水',
  '離世親人',
  '掉牙齒',
];

export const TherapistAdminManager: React.FC<TherapistAdminManagerProps> = ({
  therapists,
  onSaveTherapists,
  currentUserRole = 'super_admin',
}) => {
  const isSuperAdmin = currentUserRole === 'super_admin';
  const isAdmin = currentUserRole === 'admin' || isSuperAdmin;

  // Filter states
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<TherapistItem | null>(null);

  // Notice alert
  const [notice, setNotice] = useState('');

  // Client recommendation simulation state
  const [simNeed, setSimNeed] = useState('噩夢驚醒');
  const [simRegion, setSimRegion] = useState('all');

  // Form fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [regionsText, setRegionsText] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [status, setStatus] = useState<'available' | 'busy' | 'rest'>('available');
  const [matchKeywordsText, setMatchKeywordsText] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [rating, setRating] = useState(4.9);
  const [consultationFee, setConsultationFee] = useState('HK$ 780 / 60分鐘');
  const [featured, setFeatured] = useState(false);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const openAddModal = () => {
    if (!isAdmin) {
      alert('只有管理員及高級管理員具備新增權限');
      return;
    }
    setEditingTherapist(null);
    setName('');
    setTitle('認證身心靈音療師 · 睡眠修復引導師');
    setAvatarUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80');
    setSpecialtiesText('頌缽音療, 睡眠障礙修復, 夜間驚醒平復');
    setRegionsText('香港 · 旺角, 線上視像 (Zoom / Google Meet)');
    setBookingUrl('https://wa.me/85291234567?text=你好，我在DreamWisdom看到推薦，想了解諮詢預約');
    setContactPhone('+852 9123 4567');
    setStatus('available');
    setMatchKeywordsText('噩夢, 被追, 驚醒, 失眠, 胸口發悶');
    setBio('專注於西藏銅缽頌缽聲波共振與神經系統深層平復，協助長年受噩夢驚醒、睡眠品質不佳與壓力緊繃的個案重獲深層修復。');
    setExperienceYears(6);
    setRating(4.9);
    setConsultationFee('HK$ 780 / 60分鐘');
    setFeatured(false);
    setIsFormOpen(true);
  };

  const openEditModal = (t: TherapistItem) => {
    if (!isAdmin) {
      alert('只有管理員及高級管理員具備更改權限');
      return;
    }
    setEditingTherapist(t);
    setName(t.name);
    setTitle(t.title);
    setAvatarUrl(t.avatarUrl || '');
    setSpecialtiesText(t.specialties.join(', '));
    setRegionsText(t.regions.join(', '));
    setBookingUrl(t.bookingUrl);
    setContactPhone(t.contactPhone || '');
    setStatus(t.status);
    setMatchKeywordsText(t.matchDreamKeywords.join(', '));
    setBio(t.bio);
    setExperienceYears(t.experienceYears || 5);
    setRating(t.rating || 4.9);
    setConsultationFee(t.consultationFee || 'HK$ 780 / 60分鐘');
    setFeatured(Boolean(t.featured));
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, tName: string) => {
    if (!isAdmin) {
      alert('只有管理員及高級管理員具備刪除權限');
      return;
    }
    if (!window.confirm(`確定要從資料庫刪除治療師「${tName}」嗎？刪除後客人將不再收到該治療師推薦。`)) {
      return;
    }
    const updated = therapists.filter((t) => t.id !== id);
    onSaveTherapists(updated);
    showNotification(`已成功刪除治療師「${tName}」`);
  };

  const handleToggleStatus = (id: string) => {
    if (!isAdmin) return;
    const updated = therapists.map((t) => {
      if (t.id === id) {
        const nextStatus: 'available' | 'busy' | 'rest' =
          t.status === 'available' ? 'busy' : t.status === 'busy' ? 'rest' : 'available';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    onSaveTherapists(updated);
    showNotification(`已更新即時狀態`);
  };

  const handleToggleFeatured = (id: string) => {
    if (!isAdmin) return;
    const updated = therapists.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t));
    onSaveTherapists(updated);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('權限不足');
      return;
    }
    if (!name.trim()) {
      alert('請填寫治療師姓名');
      return;
    }

    const parseList = (text: string) =>
      text
        .split(/[,，、\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

    const parsedSpecialties = parseList(specialtiesText);
    const parsedRegions = parseList(regionsText);
    const parsedKeywords = parseList(matchKeywordsText);

    if (editingTherapist) {
      const updated = therapists.map((t) =>
        t.id === editingTherapist.id
          ? {
              ...t,
              name: name.trim(),
              title: title.trim(),
              avatarUrl: avatarUrl.trim(),
              specialties: parsedSpecialties.length > 0 ? parsedSpecialties : ['頌缽音療'],
              regions: parsedRegions.length > 0 ? parsedRegions : ['線上視像 (Zoom)'],
              bookingUrl: bookingUrl.trim() || 'https://wa.me/85291234567',
              contactPhone: contactPhone.trim(),
              status,
              matchDreamKeywords: parsedKeywords.length > 0 ? parsedKeywords : ['噩夢', '驚醒'],
              bio: bio.trim(),
              experienceYears: Number(experienceYears) || 3,
              rating: Number(rating) || 4.9,
              consultationFee: consultationFee.trim(),
              featured,
            }
          : t
      );
      onSaveTherapists(updated);
      showNotification(`已成功更新治療師「${name}」資料`);
    } else {
      const newTherapist: TherapistItem = {
        id: `therapist_${Date.now()}`,
        name: name.trim(),
        title: title.trim() || '專業心靈諮詢與音療導師',
        avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        specialties: parsedSpecialties.length > 0 ? parsedSpecialties : ['頌缽音療'],
        regions: parsedRegions.length > 0 ? parsedRegions : ['香港 · 旺角', '線上視像 (Zoom)'],
        bookingUrl: bookingUrl.trim() || 'https://wa.me/85291234567',
        contactPhone: contactPhone.trim(),
        status,
        matchDreamKeywords: parsedKeywords.length > 0 ? parsedKeywords : ['噩夢', '驚醒'],
        bio: bio.trim(),
        experienceYears: Number(experienceYears) || 3,
        rating: Number(rating) || 4.9,
        consultationFee: consultationFee.trim() || 'HK$ 780 / 60分鐘',
        featured,
        createdAt: new Date().toISOString(),
      };
      onSaveTherapists([newTherapist, ...therapists]);
      showNotification(`已成功將「${newTherapist.name}」加入推薦資料庫`);
    }

    setIsFormOpen(false);
    setEditingTherapist(null);
  };

  // Filter therapists for table
  const filteredTherapists = therapists.filter((t) => {
    if (filterRegion !== 'all' && !t.regions.some((r) => r.includes(filterRegion))) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.specialties.some((s) => s.toLowerCase().includes(q)) ||
        t.regions.some((r) => r.toLowerCase().includes(q)) ||
        t.matchDreamKeywords.some((k) => k.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <section className="card p-6 sm:p-7 space-y-6" id="admin-therapist-db-section">
      {/* Top Banner & Permissions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#78e1b5]/15 text-[#78e1b5] border border-[#78e1b5]/30 font-semibold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>THERAPIST DIRECTORY & MATCHING DB</span>
            </span>
            <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>僅管理員及高級管理員可增減與更改</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            心靈與睡眠治療師資料庫管理
          </h2>
          <p className="text-xs text-[#aab3d2] mt-1">
            資料庫即時與用戶端連線。系統會根據客人夢境需要、專長標籤、地區偏好、即時預約狀態與直達預約連結自動進行智能排序推薦。
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={openAddModal}
            disabled={!isAdmin}
            className="btn text-xs px-4 py-2.5 bg-[#78e1b5] text-black font-bold hover:bg-[#8ff2cb] flex items-center gap-2 cursor-pointer shadow-lg shadow-[#78e1b5]/20 disabled:opacity-50"
            id="admin-add-therapist-btn"
          >
            <Plus className="w-4 h-4" />
            <span>新增治療師</span>
          </button>
        </div>
      </div>

      {/* Notification toast */}
      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋姓名、專長、地區或夢境關鍵字..."
              className="w-full text-xs px-3 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#707c9d] focus:outline-none focus:border-[#78e1b5]"
            />
            <Search className="w-3.5 h-3.5 text-[#707c9d] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Region filter */}
          <div>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
            >
              <option value="all" className="bg-[#0e1122]">全部地區</option>
              <option value="旺角" className="bg-[#0e1122]">旺角</option>
              <option value="銅鑼灣" className="bg-[#0e1122]">銅鑼灣</option>
              <option value="中環" className="bg-[#0e1122]">中環</option>
              <option value="尖沙咀" className="bg-[#0e1122]">尖沙咀</option>
              <option value="台北" className="bg-[#0e1122]">台北</option>
              <option value="線上視像" className="bg-[#0e1122]">線上視像</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
            >
              <option value="all" className="bg-[#0e1122]">全部狀態</option>
              <option value="available" className="bg-[#0e1122]">🟢 可即時預約 (Available)</option>
              <option value="busy" className="bg-[#0e1122]">🟡 預約爆滿 (Busy)</option>
              <option value="rest" className="bg-[#0e1122]">⚪ 休假中 (Rest)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8d97b5] pt-1">
          <span>共登記 <b>{therapists.length}</b> 位治療師 · 當前篩選顯示 <b>{filteredTherapists.length}</b> 位</span>
          <span className="text-[#78e1b5]">提示：點擊狀態標籤可快速切換「可預約／爆滿／休假」</span>
        </div>
      </div>

      {/* THERAPISTS LIST CARDS */}
      <div className="space-y-3.5" id="admin-therapists-list">
        {filteredTherapists.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <AlertCircle className="w-7 h-7 text-amber-400 mx-auto" />
            <p className="text-sm text-white font-semibold">找不到符合條件的治療師</p>
            <p className="text-xs text-[#8d97b5]">請調整搜尋關鍵字或篩選地區。</p>
          </div>
        ) : (
          filteredTherapists.map((t) => (
            <div
              key={t.id}
              className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-3"
              id={`admin-therapist-row-${t.id}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3.5">
                  <img
                    src={t.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80'}
                    alt={t.name}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border border-white/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{t.name}</span>
                        {t.rating && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-300" />
                            {t.rating}
                          </span>
                        )}
                      </h3>

                      {/* Status Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(t.id)}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-all cursor-pointer border ${
                          t.status === 'available'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                            : t.status === 'busy'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                            : 'bg-white/10 text-[#8d97b5] border-white/10 hover:bg-white/15'
                        }`}
                        title="點擊輪換狀態"
                      >
                        {t.status === 'available' && '🟢 可即時預約'}
                        {t.status === 'busy' && '🟡 預約爆滿 (候補)'}
                        {t.status === 'rest' && '⚪ 休假中'}
                      </button>

                      {t.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#aa9cff]/20 text-[#aa9cff] font-semibold border border-[#aa9cff]/40">
                          ⭐ 精選推薦
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#c3b9ff] mt-0.5 font-medium">{t.title}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8d97b5] mt-1">
                      <span>資歷：{t.experienceYears} 年</span>
                      <span>•</span>
                      <span className="text-[#78e1b5] font-mono">{t.consultationFee}</span>
                      {t.contactPhone && (
                        <>
                          <span>•</span>
                          <span>☎️ {t.contactPhone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: Edit, Delete, Link test */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    href={t.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#aab3d2] hover:text-white border border-white/5 text-xs flex items-center gap-1"
                    title="測試預約連結"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">測試連結</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#cbd2ef] hover:text-white border border-white/5 text-xs flex items-center gap-1 cursor-pointer"
                    title="更改資料"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#aa9cff]" />
                    <span>更改</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs flex items-center gap-1 cursor-pointer"
                    title="刪除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>刪除</span>
                  </button>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-[#cbd2ef] leading-relaxed line-clamp-2">
                {t.bio}
              </p>

              {/* Tags summary */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-[#8d97b5]">專長：</span>
                  {t.specialties.map((s, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-[#8d97b5]">地區：</span>
                  {t.regions.map((r, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#aa9cff]/10 text-[#c3b9ff] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#aa9cff]" />
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match Keywords */}
              <div className="text-[11px] text-[#78e1b5] flex flex-wrap items-center gap-1">
                <span className="text-[#8d97b5]">觸發推薦的客人夢境關鍵字：</span>
                {t.matchDreamKeywords.map((k, i) => (
                  <span key={i} className="opacity-80">#{k}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RECOMMENDATION SIMULATOR: See how guests will be matched */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1226] to-[#0a0d1c] border border-[#aa9cff]/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#c3b9ff]">
          <Sparkles className="w-4 h-4 text-[#aa9cff]" />
          <span>客端推薦演算沙盒預覽 (Recommendation Sandbox Simulator)</span>
        </div>
        <p className="text-xs text-[#8d97b5]">
          測試管理員所設定之「專長」、「地區」、「狀態」與「關鍵詞」在面對客人真實夢境需求時的推薦優先排序：
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white">模擬客人需求：</span>
            <select
              value={simNeed}
              onChange={(e) => setSimNeed(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white"
            >
              <option value="噩夢驚醒">😱 噩夢驚醒 (被追／窒息)</option>
              <option value="失眠與睡眠障礙">🌙 長期失眠 (頻繁做夢)</option>
              <option value="鬼壓床">🪨 鬼壓床 (身體動彈不得)</option>
              <option value="潛意識陰影">🧠 潛意識陰影 (黑影／反覆夢)</option>
              <option value="離世親人">🕊️ 離世親人撫慰</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white">地區限定：</span>
            <select
              value={simRegion}
              onChange={(e) => setSimRegion(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white"
            >
              <option value="all">不限地區</option>
              <option value="旺角">香港 · 旺角</option>
              <option value="銅鑼灣">香港 · 銅鑼灣</option>
              <option value="中環">香港 · 中環</option>
              <option value="線上視像">線上視像</option>
            </select>
          </div>
        </div>

        {/* Live Simulation Top Match */}
        {(() => {
          const matched = therapists
            .filter((t) => simRegion === 'all' || t.regions.some((r) => r.includes(simRegion)))
            .map((t) => {
              let score = 0;
              if (t.status === 'available') score += 10;
              else if (t.status === 'busy') score += 2;
              const hasKeyword = t.matchDreamKeywords.some((k) => simNeed.includes(k) || k.includes(simNeed));
              if (hasKeyword) score += 15;
              return { ...t, score };
            })
            .sort((a, b) => b.score - a.score);

          const top = matched[0];
          if (!top) return null;

          return (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <span className="text-amber-300 font-bold">🥇 演算首選推薦：</span>
                <span className="font-bold">{top.name}</span>
                <span className="text-[#aab3d2]">({top.title})</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {top.status === 'available' ? '可即時預約' : '排期候補'}
                </span>
              </div>
              <span className="text-[11px] text-[#78e1b5] font-mono">推薦權重分：{top.score}</span>
            </div>
          );
        })()}
      </div>

      {/* ADD / EDIT THERAPIST MODAL DIALOG */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in"
          id="admin-therapist-form-modal"
        >
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0d1022] border border-[#78e1b5]/30 rounded-3xl shadow-2xl overflow-hidden text-left">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#78e1b5]" />
                <h3 className="text-lg font-bold text-white">
                  {editingTherapist ? `更改治療師「${editingTherapist.name}」` : '新增推薦治療師'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-[#8d97b5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#cbd2ef] block mb-1 font-bold">治療師姓名 *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如：Amy (頌缽音療師)"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1 font-bold">認證職銜／頭銜 *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="如：西藏頌缽資深導師 · 睡眠障礙修復引導師"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
              </div>

              {/* Avatar URL and Presets */}
              <div>
                <label className="text-[#cbd2ef] block mb-1 font-bold">相片／頭像連結 (Avatar URL)</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://... 或 /Amy34.jpeg"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-[#8d97b5]">快速選用：</span>
                  {[
                    { label: '🧘 頌缽導師 Amy', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80' },
                    { label: '🧠 心理學者 Marcus', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
                    { label: '✨ 催眠師 Elena', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#cbd2ef] border border-white/5"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status and Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#cbd2ef] block mb-1 font-bold">即時預約狀態 *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'available' | 'busy' | 'rest')}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                  >
                    <option value="available" className="bg-[#0e1122]">🟢 可即時預約 (Available)</option>
                    <option value="busy" className="bg-[#0e1122]">🟡 預約爆滿 (Busy)</option>
                    <option value="rest" className="bg-[#0e1122]">⚪ 休假中 (Rest)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1 font-bold">諮詢費用說明</label>
                  <input
                    type="text"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    placeholder="如：HK$ 780 / 60分鐘"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1 font-bold">經驗年資 (年)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="text-[#cbd2ef] block mb-1 font-bold">專長領域 (以逗號分隔) *</label>
                <input
                  type="text"
                  required
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  placeholder="如：頌缽音療, 睡眠障礙修復, 夜間驚醒平復"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                />
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {PRESET_SPECIALTIES.slice(0, 6).map((spec, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!specialtiesText.includes(spec)) {
                          setSpecialtiesText(specialtiesText ? `${specialtiesText}, ${spec}` : spec);
                        }
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#aab3d2]"
                    >
                      +{spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div>
                <label className="text-[#cbd2ef] block mb-1 font-bold">服務地區 (以逗號分隔) *</label>
                <input
                  type="text"
                  required
                  value={regionsText}
                  onChange={(e) => setRegionsText(e.target.value)}
                  placeholder="如：香港 · 旺角, 香港 · 銅鑼灣, 線上視像 (Zoom)"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                />
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {PRESET_REGIONS.map((reg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!regionsText.includes(reg)) {
                          setRegionsText(regionsText ? `${regionsText}, ${reg}` : reg);
                        }
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#aab3d2]"
                    >
                      +{reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Link & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#cbd2ef] block mb-1 font-bold">直達預約連結 (WhatsApp / IG / 官網) *</label>
                  <input
                    type="url"
                    required
                    value={bookingUrl}
                    onChange={(e) => setBookingUrl(e.target.value)}
                    placeholder="https://wa.me/85291234567"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1 font-bold">諮詢聯絡電話／WhatsApp</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+852 9123 4567"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
              </div>

              {/* Match Keywords */}
              <div>
                <label className="text-[#cbd2ef] block mb-1 font-bold">
                  觸發客人推薦之夢境關鍵字 (以逗號分隔)
                </label>
                <input
                  type="text"
                  value={matchKeywordsText}
                  onChange={(e) => setMatchKeywordsText(e.target.value)}
                  placeholder="如：噩夢, 驚醒, 被追, 失眠, 胸口發悶, 窒息"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5]"
                />
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {PRESET_KEYWORDS.slice(0, 8).map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!matchKeywordsText.includes(kw)) {
                          setMatchKeywordsText(matchKeywordsText ? `${matchKeywordsText}, ${kw}` : kw);
                        }
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#78e1b5]"
                    >
                      #{kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-[#cbd2ef] block mb-1 font-bold">治療師簡介與理念</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="詳細描述治療師之手法理念、受訓背景、專長解決之身心問題..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#78e1b5] resize-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#78e1b5] focus:ring-[#78e1b5]"
                />
                <label htmlFor="featured-checkbox" className="text-white cursor-pointer select-none">
                  設為首頁／彈窗精選置頂推薦 (Featured)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn dark text-xs px-4 py-2"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn text-xs px-6 py-2 bg-[#78e1b5] text-black font-bold hover:bg-[#8ff2cb]"
                >
                  {editingTherapist ? '儲存更改' : '確認加入資料庫'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
