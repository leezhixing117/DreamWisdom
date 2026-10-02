import React, { useState, useMemo } from 'react';
import { LoginRecord, AdWatchRecord, ShopVisitRecord, User, UserRole, normalizeRole, getRoleDisplayName } from '../types';
import {
  Activity,
  Users,
  Tv,
  ShoppingBag,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Star,
  ExternalLink,
  Sparkles,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Eye,
  Trash2,
} from 'lucide-react';

interface AdminAuditDashboardProps {
  loginRecords: LoginRecord[];
  adWatchRecords: AdWatchRecord[];
  shopVisitRecords: ShopVisitRecord[];
  users: User[];
  isSuperAdmin: boolean;
  currentUserId: string;
  onRefresh?: () => void;
  onClearLogs?: (type: 'all' | 'logins' | 'ads' | 'shop') => void;
  onFilterByUser?: (email: string) => void;
}

export const AdminAuditDashboard: React.FC<AdminAuditDashboardProps> = ({
  loginRecords,
  adWatchRecords,
  shopVisitRecords,
  users,
  isSuperAdmin,
  currentUserId,
  onRefresh,
  onClearLogs,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'logins' | 'ads' | 'shop'>('logins');

  // Search & Filter States for Logins
  const [loginSearch, setLoginSearch] = useState('');
  const [loginRoleFilter, setLoginRoleFilter] = useState<string>('all');
  const [loginDateFilter, setLoginDateFilter] = useState<'all' | 'today' | '7days'>('all');

  // Search & Filter States for Ads
  const [adSearch, setAdSearch] = useState('');
  const [adVideoFilter, setAdVideoFilter] = useState<string>('all');

  // Search & Filter States for Shop
  const [shopSearch, setShopSearch] = useState('');
  const [shopSourceFilter, setShopSourceFilter] = useState<string>('all');

  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Helper: Format DateTime to Traditional Chinese
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '--';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('zh-HK', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return isoString;
    }
  };

  // Helper: Export to CSV with UTF-8 BOM
  const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) {
      alert('目前無可匯出的記錄資料！');
      return;
    }
    const keys = Object.keys(rows[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [
        keys.join(','),
        ...rows.map((row) =>
          keys
            .map((k) => `"${String((row as any)[k] ?? '').replace(/"/g, '""')}"`)
            .join(',')
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedbackNotice(`✓ 已成功匯出檔案：${filename}.csv`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // 1. Logins Export
  const handleExportLogins = () => {
    const data = filteredLogins.map((r, i) => ({
      編號: i + 1,
      記錄ID: r.id,
      會員姓名: r.displayName || '',
      會員Email: r.email,
      會員等級: getRoleDisplayName(r.role),
      登入時間: formatDateTime(r.loginAt),
      驗證方式: r.authMethod === 'password' ? '密碼登入' : r.authMethod === 'quick_select' ? '快速選取' : r.authMethod === 'auto_registered' ? '新註冊' : '會話重連',
      IP位址: r.ip || '--',
      設備種類: r.deviceType || 'Desktop',
      瀏覽器: r.browser || '--',
      狀態: r.status === 'success' ? '成功' : '封禁攔截',
    }));
    exportToCsv('DreamWisdom_會員登入人員記錄', data);
  };

  // 2. Ads Export
  const handleExportAds = () => {
    const data = filteredAds.map((r, i) => ({
      編號: i + 1,
      記錄ID: r.id,
      收看會員: r.userDisplayName || '',
      會員Email: r.userEmail,
      會員等級: getRoleDisplayName(r.userRole),
      廣告影片標題: r.adTitle,
      廣告商夥伴: r.advertiser || '',
      規定秒數: `${r.durationSeconds} 秒`,
      獎勵星星: `${r.rewardStars} 顆`,
      收看時間: formatDateTime(r.watchedAt),
      完播狀態: r.completed ? '已完播領星' : '未完播',
    }));
    exportToCsv('DreamWisdom_收看廣告次數記錄', data);
  };

  // 3. Shop Visits Export
  const handleExportShop = () => {
    const data = filteredShopVisits.map((r, i) => ({
      編號: i + 1,
      記錄ID: r.id,
      訪客姓名: r.userDisplayName || '',
      訪客Email: r.userEmail || '',
      訪客等級: getRoleDisplayName(r.userRole),
      進入時間: formatDateTime(r.enteredAt),
      導流渠道: r.sourceLabel || r.entrySource,
      目標推薦商品: r.targetProductName || r.targetProductId || '--',
      關聯夢境摘要情境: r.dreamContextSnippet || '--',
    }));
    exportToCsv('DreamWisdom_入選物店訪問記錄', data);
  };

  // KPI Calculations
  const totalLoginsCount = loginRecords.length;
  const uniqueLoginUsersCount = new Set(loginRecords.map((r) => r.email.toLowerCase())).size;

  const totalAdViewsCount = adWatchRecords.length;
  const totalStarsRewarded = adWatchRecords.reduce((acc, cur) => acc + (cur.rewardStars || 1), 0);

  const totalShopVisitsCount = shopVisitRecords.length;
  const uniqueShopVisitorsCount = new Set(
    shopVisitRecords.map((r) => (r.userEmail || r.userId || 'guest').toLowerCase())
  ).size;

  // Filter Logins
  const filteredLogins = useMemo(() => {
    return loginRecords.filter((r) => {
      // Search
      if (loginSearch) {
        const term = loginSearch.toLowerCase();
        const match =
          r.email.toLowerCase().includes(term) ||
          (r.displayName && r.displayName.toLowerCase().includes(term)) ||
          (r.ip && r.ip.toLowerCase().includes(term));
        if (!match) return false;
      }
      // Role
      if (loginRoleFilter !== 'all') {
        if (normalizeRole(r.role) !== loginRoleFilter) return false;
      }
      // Date
      if (loginDateFilter === 'today') {
        const todayStr = new Date().toISOString().slice(0, 10);
        if (!r.loginAt.startsWith(todayStr)) return false;
      } else if (loginDateFilter === '7days') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
        if (new Date(r.loginAt).getTime() < sevenDaysAgo) return false;
      }
      return true;
    });
  }, [loginRecords, loginSearch, loginRoleFilter, loginDateFilter]);

  // Filter Ads
  const filteredAds = useMemo(() => {
    return adWatchRecords.filter((r) => {
      if (adSearch) {
        const term = adSearch.toLowerCase();
        const match =
          r.userEmail.toLowerCase().includes(term) ||
          (r.userDisplayName && r.userDisplayName.toLowerCase().includes(term)) ||
          r.adTitle.toLowerCase().includes(term) ||
          (r.advertiser && r.advertiser.toLowerCase().includes(term));
        if (!match) return false;
      }
      if (adVideoFilter !== 'all') {
        if (r.adId !== adVideoFilter && r.adTitle !== adVideoFilter) return false;
      }
      return true;
    });
  }, [adWatchRecords, adSearch, adVideoFilter]);

  // Filter Shop Visits
  const filteredShopVisits = useMemo(() => {
    return shopVisitRecords.filter((r) => {
      if (shopSearch) {
        const term = shopSearch.toLowerCase();
        const match =
          (r.userEmail && r.userEmail.toLowerCase().includes(term)) ||
          (r.userDisplayName && r.userDisplayName.toLowerCase().includes(term)) ||
          (r.targetProductName && r.targetProductName.toLowerCase().includes(term)) ||
          (r.dreamContextSnippet && r.dreamContextSnippet.toLowerCase().includes(term));
        if (!match) return false;
      }
      if (shopSourceFilter !== 'all') {
        if (r.entrySource !== shopSourceFilter) return false;
      }
      return true;
    });
  }, [shopVisitRecords, shopSearch, shopSourceFilter]);

  // Per-User Stats mapping (how many logins, ads, shop entries each user has)
  const userStatsMap = useMemo(() => {
    const stats: Record<
      string,
      {
        loginCount: number;
        lastLogin?: string;
        adCount: number;
        starsEarned: number;
        shopCount: number;
      }
    > = {};

    loginRecords.forEach((l) => {
      const email = l.email.toLowerCase();
      if (!stats[email]) stats[email] = { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
      stats[email].loginCount += 1;
      if (!stats[email].lastLogin || new Date(l.loginAt) > new Date(stats[email].lastLogin!)) {
        stats[email].lastLogin = l.loginAt;
      }
    });

    adWatchRecords.forEach((a) => {
      const email = a.userEmail.toLowerCase();
      if (!stats[email]) stats[email] = { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
      stats[email].adCount += 1;
      stats[email].starsEarned += a.rewardStars || 1;
    });

    shopVisitRecords.forEach((s) => {
      const email = (s.userEmail || '').toLowerCase();
      if (email) {
        if (!stats[email]) stats[email] = { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
        stats[email].shopCount += 1;
      }
    });

    return stats;
  }, [loginRecords, adWatchRecords, shopVisitRecords]);

  // Ad Leaderboard summary (views per ad)
  const adPerformanceSummary = useMemo(() => {
    const map: Record<string, { title: string; advertiser: string; count: number; starsGiven: number }> = {};
    adWatchRecords.forEach((a) => {
      const key = a.adTitle;
      if (!map[key]) {
        map[key] = {
          title: a.adTitle,
          advertiser: a.advertiser || '贊助商夥伴',
          count: 0,
          starsGiven: 0,
        };
      }
      map[key].count += 1;
      map[key].starsGiven += a.rewardStars || 1;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [adWatchRecords]);

  // Shop Channel Breakdown
  const shopChannelBreakdown = useMemo(() => {
    const map: Record<string, { label: string; count: number }> = {
      workspace_recommend: { label: '夢境解析報告推薦導流', count: 0 },
      nav_bar: { label: '頂部導航欄「🌿 解夢選物店」', count: 0 },
      stars_exchange: { label: '星星幣商城折抵換購', count: 0 },
      direct_url: { label: '直接訪問或社交分享連結', count: 0 },
      admin_switch: { label: '管理員或控制台快速導航', count: 0 },
    };
    shopVisitRecords.forEach((s) => {
      const key = s.entrySource || 'nav_bar';
      if (!map[key]) map[key] = { label: s.sourceLabel || key, count: 0 };
      map[key].count += 1;
    });
    return Object.entries(map).map(([k, v]) => ({ key: k, ...v }));
  }, [shopVisitRecords]);

  return (
    <section className="space-y-6" id="admin-audit-dashboard-section">
      {/* Feedback notice toast */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-xs text-white/60 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header & Permissions Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border-2 border-indigo-400/40 text-white space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/30 border-2 border-purple-400/50 flex items-center justify-center text-purple-200 shadow-md">
              <Activity className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/40 text-purple-100 border border-purple-300/40 text-[11px] font-bold">
                  SUPER ADMIN AUDIT CENTER
                </span>
                <span className="text-xs text-emerald-300 font-mono font-bold flex items-center gap-1.5 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  實時審計日誌在線
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                高級管理員全景數據監控中心
              </h2>
              <p className="text-xs text-indigo-100 mt-1 font-medium leading-relaxed">
                完整掌握【所有登入人員記錄】、【收看廣告次數】與【入選物店記錄】，保障系統安全與營運轉換洞察。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="重新整理數據"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                <span>刷新日誌</span>
              </button>
            )}

            {isSuperAdmin && onClearLogs && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('確定要清空審計日誌嗎？此操作不可逆。')) {
                    onClearLogs(activeSubTab === 'logins' ? 'logins' : activeSubTab === 'ads' ? 'ads' : 'shop');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border-2 border-rose-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="清除當前日誌"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清空{activeSubTab === 'logins' ? '登入' : activeSubTab === 'ads' ? '廣告' : '選物'}表記錄</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Executive High-level KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {/* KPI 1: 登入人員記錄 */}
          <div
            onClick={() => setActiveSubTab('logins')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              activeSubTab === 'logins'
                ? 'bg-white border-purple-500 shadow-lg shadow-purple-500/10 ring-2 ring-purple-400'
                : 'bg-white/95 border-slate-300 hover:border-purple-400 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-800 flex items-center gap-1.5 font-bold">
                <Users className="w-4 h-4 text-purple-600" />
                所有登入人員記錄
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 font-bold font-mono">
                {uniqueLoginUsersCount} 個獨立帳號
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-purple-950 font-mono">{totalLoginsCount}</span>
              <span className="text-xs text-slate-600 font-bold">次累計登入</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-purple-700 font-bold">
              <span>點擊查看詳細名單與IP</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </div>

          {/* KPI 2: 收看廣告次數 */}
          <div
            onClick={() => setActiveSubTab('ads')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              activeSubTab === 'ads'
                ? 'bg-white border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400'
                : 'bg-white/95 border-slate-300 hover:border-amber-400 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-800 flex items-center gap-1.5 font-bold">
                <Tv className="w-4 h-4 text-amber-600" />
                收看廣告次數
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold font-mono">
                共發放 {totalStarsRewarded} ⭐
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-950 font-mono">{totalAdViewsCount}</span>
              <span className="text-xs text-slate-600 font-bold">次播放完畢</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-amber-800 font-bold">
              <span>點擊查看影片熱度與會員收看榜</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>

          {/* KPI 3: 入選物店記錄 */}
          <div
            onClick={() => setActiveSubTab('shop')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              activeSubTab === 'shop'
                ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400'
                : 'bg-white/95 border-slate-300 hover:border-emerald-400 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-800 flex items-center gap-1.5 font-bold">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                入選物店記錄
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold font-mono">
                {uniqueShopVisitorsCount} 位進店訪客
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-950 font-mono">{totalShopVisitsCount}</span>
              <span className="text-xs text-slate-600 font-bold">人次進入選物店</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
              <span>點擊查看來源渠道與商品導流</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('logins')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'logins'
                ? 'bg-purple-700 text-white border-2 border-purple-800 shadow-md shadow-purple-700/20'
                : 'text-slate-700 hover:text-purple-900 bg-white hover:bg-purple-50 border-2 border-slate-300 hover:border-purple-300 shadow-2xs'
            }`}
          >
            <Users className="w-4 h-4 text-purple-300" />
            <span>🚪 所有登入人員記錄 ({filteredLogins.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ads')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'ads'
                ? 'bg-amber-600 text-white border-2 border-amber-700 shadow-md shadow-amber-600/20'
                : 'text-slate-700 hover:text-amber-900 bg-white hover:bg-amber-50 border-2 border-slate-300 hover:border-amber-300 shadow-2xs'
            }`}
          >
            <Tv className="w-4 h-4 text-amber-300" />
            <span>📺 收看廣告次數與統計 ({filteredAds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('shop')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'shop'
                ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-md shadow-emerald-700/20'
                : 'text-slate-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 border-2 border-slate-300 hover:border-emerald-300 shadow-2xs'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>🛍️ 入選物店記錄 ({filteredShopVisits.length})</span>
          </button>
        </div>

        {/* Global Export for current sub tab */}
        <div>
          {activeSubTab === 'logins' && (
            <button
              type="button"
              onClick={handleExportLogins}
              className="btn dark text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer hover:border-purple-400/40"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>匯出登入日誌 CSV</span>
            </button>
          )}
          {activeSubTab === 'ads' && (
            <button
              type="button"
              onClick={handleExportAds}
              className="btn dark text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer hover:border-amber-400/40"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>匯出廣告收看清單 CSV</span>
            </button>
          )}
          {activeSubTab === 'shop' && (
            <button
              type="button"
              onClick={handleExportShop}
              className="btn dark text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer hover:border-emerald-400/40"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>匯出入店記錄 CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: 所有登入人員記錄 (ALL LOGGED-IN USERS & LOGIN HISTORY)         */}
      {/* ========================================================================= */}
      {activeSubTab === 'logins' && (
        <div className="space-y-4 animate-fade-in" id="audit-logins-view">
          {/* Search & Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                value={loginSearch}
                onChange={(e) => setLoginSearch(e.target.value)}
                placeholder="搜尋登入人員 Email、姓名、IP 位址..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-purple-400"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#aab3d2]">
                <Filter className="w-3.5 h-3.5" />
                <span>等級：</span>
                <select
                  value={loginRoleFilter}
                  onChange={(e) => setLoginRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#0e1224] border border-white/20 text-white text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="all">全部等級</option>
                  <option value="super_admin">高級管理員 (Super Admin)</option>
                  <option value="admin">內容管理員 (Admin)</option>
                  <option value="paid">付費會員 (Paid)</option>
                  <option value="free">一般會員 (Free)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#aab3d2]">
                <Calendar className="w-3.5 h-3.5" />
                <span>時間：</span>
                <select
                  value={loginDateFilter}
                  onChange={(e) => setLoginDateFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#0e1224] border border-white/20 text-white text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="all">歷史所有記錄</option>
                  <option value="today">今日登入</option>
                  <option value="7days">近 7 天內</option>
                </select>
              </div>

              {(loginSearch || loginRoleFilter !== 'all' || loginDateFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setLoginSearch('');
                    setLoginRoleFilter('all');
                    setLoginDateFilter('all');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer ml-1"
                >
                  重設篩選
                </button>
              )}
            </div>
          </div>

          {/* Members Overview Summary Cards */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>註冊會員累積登入活躍度統計</span>
              </h3>
              <span className="text-[11px] text-[#cbd2ef]">共 {users.length} 位會員登記在冊</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {users.map((u) => {
                const normRole = normalizeRole(u.role);
                const userStat = userStatsMap[u.email.toLowerCase()] || { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
                return (
                  <div
                    key={u.id}
                    onClick={() => setLoginSearch(u.email)}
                    className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-purple-400/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {u.display_name || u.email.split('@')[0]}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                        normRole === 'super_admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                          : normRole === 'admin'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                          : normRole === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          : 'bg-white/10 text-white/70 border-white/20'
                      }`}>
                        {getRoleDisplayName(normRole)}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#cbd2ef] truncate mt-0.5">{u.email}</div>

                    <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-white/10 text-center text-[10px]">
                      <div className="bg-purple-500/10 rounded-lg py-1 border border-purple-500/20">
                        <div className="text-purple-300 font-bold font-mono">{userStat.loginCount} 次</div>
                        <div className="text-[#aab3d2] text-[9px]">登入次數</div>
                      </div>
                      <div className="bg-amber-500/10 rounded-lg py-1 border border-amber-500/20">
                        <div className="text-amber-300 font-bold font-mono">{userStat.adCount} 次</div>
                        <div className="text-[#aab3d2] text-[9px]">廣告收看</div>
                      </div>
                      <div className="bg-emerald-500/10 rounded-lg py-1 border border-emerald-500/20">
                        <div className="text-emerald-300 font-bold font-mono">{userStat.shopCount} 次</div>
                        <div className="text-[#aab3d2] text-[9px]">選物店進入</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Logins Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
            <table className="w-full text-left text-xs text-[#cbd2ef]">
              <thead className="bg-white/5 border-b border-white/10 text-[#aab3d2] text-[11px] uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-3.5">登入時間</th>
                  <th className="py-3 px-3.5">會員身份 / Email</th>
                  <th className="py-3 px-3.5">等級權限</th>
                  <th className="py-3 px-3.5">驗證方式</th>
                  <th className="py-3 px-3.5">設備環境 / 瀏覽器</th>
                  <th className="py-3 px-3.5">來源 IP / 地點</th>
                  <th className="py-3 px-3.5">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredLogins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted">
                      沒有符合條件的登入記錄。
                    </td>
                  </tr>
                ) : (
                  filteredLogins.map((record) => {
                    const normRole = normalizeRole(record.role);
                    return (
                      <tr key={record.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3.5 font-mono text-white text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-purple-400" />
                            <span>{formatDateTime(record.loginAt)}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-white">
                            {record.displayName || record.email.split('@')[0]}
                          </div>
                          <div className="text-[11px] text-[#aab3d2] font-mono">{record.email}</div>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                            normRole === 'super_admin'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                              : normRole === 'admin'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                              : normRole === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                              : 'bg-white/10 text-white/70 border-white/20'
                          }`}>
                            {getRoleDisplayName(normRole)}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="text-[11px] text-white/90">
                            {record.authMethod === 'password'
                              ? '🔑 帳號密碼登入'
                              : record.authMethod === 'quick_select'
                              ? '⚡ 快速身份切換'
                              : record.authMethod === 'auto_registered'
                              ? '✨ 自動登記註冊'
                              : '🔄 瀏覽器會話恢復'}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-1.5 text-white/90">
                            {record.deviceType === 'Mobile' ? (
                              <Smartphone className="w-3.5 h-3.5 text-[#71d9ff]" />
                            ) : record.deviceType === 'Tablet' ? (
                              <Tablet className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Laptop className="w-3.5 h-3.5 text-purple-400" />
                            )}
                            <span className="text-xs">{record.browser || 'Web Browser'}</span>
                          </div>
                          <div className="text-[10px] text-white/40 truncate max-w-[200px]" title={record.userAgent}>
                            {record.deviceType || 'Desktop'}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 font-mono text-[11px] text-white/80 whitespace-nowrap">
                          {record.ip || '127.0.0.1 (本地)'}
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {record.status === 'blocked_banned' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                              🚫 黑名單攔截
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ✓ 登入成功
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: 收看廣告次數與統計 (AD WATCH COUNTS & LEADERBOARD)             */}
      {/* ========================================================================= */}
      {activeSubTab === 'ads' && (
        <div className="space-y-4 animate-fade-in" id="audit-ads-view">
          {/* Ad Leaderboard & View Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Views per Advertisement */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>各廣告短片播放次數排行</span>
                </h3>
                <span className="text-[11px] text-amber-300 font-mono">
                  累計 {totalAdViewsCount} 次播放
                </span>
              </div>

              <div className="space-y-2.5">
                {adPerformanceSummary.length === 0 ? (
                  <div className="text-xs text-muted text-center py-4">尚無廣告播放記錄</div>
                ) : (
                  adPerformanceSummary.map((ad, idx) => {
                    const percent = Math.min(100, Math.round((ad.count / Math.max(1, totalAdViewsCount)) * 100));
                    return (
                      <div key={ad.title} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            {ad.title}
                          </span>
                          <span className="font-mono text-amber-300 font-bold">{ad.count} 次播放 ({percent}%)</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#cbd2ef] pt-0.5">
                          <span>贊助商：{ad.advertiser}</span>
                          <span>獎勵送出：{ad.starsGiven} 顆星星 ⭐</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Per-User Ad Watch Contributors */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>會員收看廣告與賺星排行榜</span>
                </h3>
                <span className="text-[11px] text-[#cbd2ef]">會員行為洞察</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {users.map((u) => {
                  const stat = userStatsMap[u.email.toLowerCase()] || { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
                  const normRole = normalizeRole(u.role);
                  return (
                    <div
                      key={u.id}
                      onClick={() => setAdSearch(u.email)}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/40 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate flex items-center gap-1.5">
                          <span>{u.display_name || u.email.split('@')[0]}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                            {getRoleDisplayName(normRole)}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#cbd2ef] font-mono truncate">{u.email}</div>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-amber-300">
                          {stat.adCount} 次收看
                        </div>
                        <div className="text-[10px] text-[#aab3d2] flex items-center gap-0.5 justify-end">
                          <span>賺取</span>
                          <span className="text-amber-300 font-mono">+{stat.starsEarned}</span>
                          <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                value={adSearch}
                onChange={(e) => setAdSearch(e.target.value)}
                placeholder="搜尋收看者 Email、姓名、廣告影片名稱..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#aab3d2]">
              <Filter className="w-3.5 h-3.5" />
              <span>廣告短片：</span>
              <select
                value={adVideoFilter}
                onChange={(e) => setAdVideoFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#0e1224] border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">全部廣告短片</option>
                {adPerformanceSummary.map((ad) => (
                  <option key={ad.title} value={ad.title}>
                    {ad.title} ({ad.count} 次)
                  </option>
                ))}
              </select>

              {(adSearch || adVideoFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setAdSearch('');
                    setAdVideoFilter('all');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer ml-1"
                >
                  重設篩選
                </button>
              )}
            </div>
          </div>

          {/* Detailed Ad Watch Records Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
            <table className="w-full text-left text-xs text-[#cbd2ef]">
              <thead className="bg-white/5 border-b border-white/10 text-[#aab3d2] text-[11px] uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-3.5">收看時間</th>
                  <th className="py-3 px-3.5">會員 Email / 姓名</th>
                  <th className="py-3 px-3.5">廣告影片主題</th>
                  <th className="py-3 px-3.5">贊助品牌</th>
                  <th className="py-3 px-3.5">規定播放</th>
                  <th className="py-3 px-3.5">發放獎勵</th>
                  <th className="py-3 px-3.5">完成度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredAds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted">
                      沒有符合條件的廣告收看記錄。
                    </td>
                  </tr>
                ) : (
                  filteredAds.map((record) => {
                    const normRole = normalizeRole(record.userRole);
                    return (
                      <tr key={record.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3.5 font-mono text-white text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>{formatDateTime(record.watchedAt)}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{record.userDisplayName || record.userEmail.split('@')[0]}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                              {getRoleDisplayName(normRole)}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#aab3d2] font-mono">{record.userEmail}</div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-white max-w-[240px] truncate" title={record.adTitle}>
                            {record.adTitle}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-[#cbd2ef] whitespace-nowrap">
                          {record.advertiser || '贊助商夥伴'}
                        </td>

                        <td className="py-3 px-3.5 font-mono text-white/80 whitespace-nowrap">
                          {record.durationSeconds} 秒
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-400/30">
                            +{record.rewardStars}
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          </span>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                            ✓ 完播領取
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: 入選物店記錄 (CURATED SHOP VISIT RECORDS)                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'shop' && (
        <div className="space-y-4 animate-fade-in" id="audit-shop-view">
          {/* Shop Entry Channels & Top Recommended Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Entry Channel Breakdown */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>入選物店導流渠道分佈</span>
                </h3>
                <span className="text-[11px] text-emerald-300 font-mono">
                  共 {totalShopVisitsCount} 次進店人次
                </span>
              </div>

              <div className="space-y-2.5">
                {shopChannelBreakdown.map((item) => {
                  const percent = Math.min(100, Math.round((item.count / Math.max(1, totalShopVisitsCount)) * 100));
                  return (
                    <div key={item.key} className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium">{item.label}</span>
                        <span className="font-mono text-emerald-300 font-bold">{item.count} 人次 ({percent}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Visitor Frequency Overview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>會員進店選物頻次統計</span>
                </h3>
                <span className="text-[11px] text-[#cbd2ef]">高意向顧客洞察</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {users.map((u) => {
                  const stat = userStatsMap[u.email.toLowerCase()] || { loginCount: 0, adCount: 0, starsEarned: 0, shopCount: 0 };
                  const normRole = normalizeRole(u.role);
                  return (
                    <div
                      key={u.id}
                      onClick={() => setShopSearch(u.email)}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-400/40 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate flex items-center gap-1.5">
                          <span>{u.display_name || u.email.split('@')[0]}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                            {getRoleDisplayName(normRole)}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#cbd2ef] font-mono truncate">{u.email}</div>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-emerald-300">
                          {stat.shopCount} 次進店
                        </div>
                        <div className="text-[10px] text-[#aab3d2]">
                          {stat.shopCount > 0 ? '曾瀏覽選品' : '尚未入店'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                placeholder="搜尋訪客 Email、姓名、目標商品名稱、夢境情境..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#aab3d2]">
              <Filter className="w-3.5 h-3.5" />
              <span>導流渠道：</span>
              <select
                value={shopSourceFilter}
                onChange={(e) => setShopSourceFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#0e1224] border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="all">全部導流渠道</option>
                <option value="workspace_recommend">夢境解析報告推薦導流</option>
                <option value="nav_bar">頂部導航欄「🌿 解夢選物店」</option>
                <option value="stars_exchange">星星幣商城折抵換購</option>
                <option value="direct_url">直接訪問或社交連結</option>
                <option value="admin_switch">管理員控制台導航</option>
              </select>

              {(shopSearch || shopSourceFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setShopSearch('');
                    setShopSourceFilter('all');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline cursor-pointer ml-1"
                >
                  重設篩選
                </button>
              )}
            </div>
          </div>

          {/* Detailed Shop Visits Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
            <table className="w-full text-left text-xs text-[#cbd2ef]">
              <thead className="bg-white/5 border-b border-white/10 text-[#aab3d2] text-[11px] uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-3.5">進入時間</th>
                  <th className="py-3 px-3.5">訪客 Email / 姓名</th>
                  <th className="py-3 px-3.5">會員身份</th>
                  <th className="py-3 px-3.5">來源導流渠道</th>
                  <th className="py-3 px-3.5">目標推薦選品</th>
                  <th className="py-3 px-3.5">觸發之夢境摘要情境</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredShopVisits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted">
                      沒有符合條件的入選物店記錄。
                    </td>
                  </tr>
                ) : (
                  filteredShopVisits.map((record) => {
                    const normRole = normalizeRole(record.userRole);
                    return (
                      <tr key={record.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3.5 font-mono text-white text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{formatDateTime(record.enteredAt)}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-white">
                            {record.userDisplayName || record.userEmail?.split('@')[0] || '訪客'}
                          </div>
                          <div className="text-[11px] text-[#aab3d2] font-mono">
                            {record.userEmail || '訪客未登入'}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                            normRole === 'super_admin'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                              : normRole === 'admin'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                              : normRole === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                              : 'bg-white/10 text-white/70 border-white/20'
                          }`}>
                            {getRoleDisplayName(normRole)}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                            record.entrySource === 'workspace_recommend'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-400/30'
                              : record.entrySource === 'stars_exchange'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                          }`}>
                            {record.entrySource === 'workspace_recommend' && <Sparkles className="w-3 h-3" />}
                            {record.sourceLabel || record.entrySource}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          {record.targetProductName ? (
                            <div className="font-semibold text-white max-w-[220px] truncate" title={record.targetProductName}>
                              🌿 {record.targetProductName}
                            </div>
                          ) : (
                            <span className="text-white/40 text-[11px]">進入店鋪首頁瀏覽</span>
                          )}
                        </td>

                        <td className="py-3 px-3.5">
                          {record.dreamContextSnippet ? (
                            <div className="text-[11px] text-[#cbd2ef] italic max-w-[260px] truncate" title={record.dreamContextSnippet}>
                              「{record.dreamContextSnippet}」
                            </div>
                          ) : (
                            <span className="text-white/40 text-[11px]">--</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
