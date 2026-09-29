import { LoginRecord, AdWatchRecord, ShopVisitRecord, User } from '../types';
import { INITIAL_LOGIN_RECORDS, INITIAL_AD_WATCH_RECORDS, INITIAL_SHOP_VISIT_RECORDS } from '../data/audit';

const STORAGE_KEY_LOGINS = 'dreamwisdom_audit_logins';
const STORAGE_KEY_ADS = 'dreamwisdom_audit_ads';
const STORAGE_KEY_SHOP = 'dreamwisdom_audit_shop';

// Detect client device & browser info
export function getClientDeviceInfo(): {
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  userAgent: string;
} {
  if (typeof window === 'undefined') {
    return { deviceType: 'Desktop', browser: 'Web Browser', userAgent: '' };
  }

  const ua = navigator.userAgent;
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Web Browser';
  if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome/i.test(ua)) browser = 'Google Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';

  return { deviceType, browser, userAgent: ua };
}

// 1. Get stored Login Records (combines API + localStorage + seed)
export function getLocalLoginRecords(): LoginRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGINS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_LOGIN_RECORDS;
}

// 2. Get stored Ad Watch Records
export function getLocalAdWatchRecords(): AdWatchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_AD_WATCH_RECORDS;
}

// 3. Get stored Shop Visit Records
export function getLocalShopVisitRecords(): ShopVisitRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHOP);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_SHOP_VISIT_RECORDS;
}

// Record a Login Event
export async function trackLoginEvent(
  user: User,
  authMethod: 'password' | 'quick_select' | 'auto_registered' | 'restored_session' = 'password',
  status: 'success' | 'blocked_banned' | 'failed_password' = 'success'
): Promise<LoginRecord> {
  const dev = getClientDeviceInfo();
  const record: LoginRecord = {
    id: `login_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: user.id,
    email: user.email,
    displayName: user.display_name || user.email.split('@')[0],
    role: user.role,
    loginAt: new Date().toISOString(),
    ip: '210.3.92.184 (香港 · 數碼港)',
    userAgent: dev.userAgent,
    deviceType: dev.deviceType,
    browser: dev.browser,
    authMethod,
    status,
  };

  // 1. Save to LocalStorage
  try {
    const existing = getLocalLoginRecords();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 500);
    localStorage.setItem(STORAGE_KEY_LOGINS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not cache login record in localStorage', e);
  }

  // 2. Sync to Backend API
  try {
    fetch('/api/audit/logins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => {});
  } catch {}

  return record;
}

// Record an Ad Watch Event
export async function trackAdWatchEvent(
  user: User | null,
  adItem: { id: string; title: string; advertiser?: string; rewardStars?: number; durationSeconds?: number },
  completed: boolean = true
): Promise<AdWatchRecord> {
  const record: AdWatchRecord = {
    id: `ad_watch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: user?.id || 'guest_user',
    userEmail: user?.email || 'guest@dreamwisdom.com',
    userDisplayName: user?.display_name || (user?.email ? user.email.split('@')[0] : '訪客會員'),
    userRole: user?.role || 'free',
    adId: adItem.id,
    adTitle: adItem.title,
    advertiser: adItem.advertiser || '贊助商夥伴',
    rewardStars: adItem.rewardStars ?? 1,
    durationSeconds: adItem.durationSeconds ?? 10,
    watchedAt: new Date().toISOString(),
    completed,
  };

  // 1. Save to LocalStorage
  try {
    const existing = getLocalAdWatchRecords();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 500);
    localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not cache ad watch record in localStorage', e);
  }

  // 2. Sync to Backend API
  try {
    fetch('/api/audit/ad-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => {});
  } catch {}

  return record;
}

// Record a Shop Visit Event
export async function trackShopVisitEvent(
  user: User | null,
  entrySource: 'nav_bar' | 'workspace_recommend' | 'dream_report_link' | 'direct_url' | 'admin_switch' | 'stars_exchange' = 'nav_bar',
  opts?: {
    sourceLabel?: string;
    targetProductId?: string;
    targetProductName?: string;
    dreamContextSnippet?: string;
  }
): Promise<ShopVisitRecord> {
  const defaultLabels: Record<string, string> = {
    nav_bar: '頂部導航欄「🌿 解夢選物店」',
    workspace_recommend: '夢境解析報告推薦導流',
    dream_report_link: '夢境詳細報告關聯商品進入',
    direct_url: '直接訪問或社交分享連結 (#store)',
    admin_switch: '管理員或控制台快速導航',
    stars_exchange: '星星幣商城折抵換購',
  };

  const record: ShopVisitRecord = {
    id: `shop_visit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: user?.id || 'guest_visitor',
    userEmail: user?.email || '訪客',
    userDisplayName: user?.display_name || (user?.email ? user.email.split('@')[0] : '訪客會員'),
    userRole: user?.role || 'free',
    enteredAt: new Date().toISOString(),
    entrySource,
    sourceLabel: opts?.sourceLabel || defaultLabels[entrySource] || '選物店入口',
    targetProductId: opts?.targetProductId,
    targetProductName: opts?.targetProductName,
    dreamContextSnippet: opts?.dreamContextSnippet,
  };

  // 1. Save to LocalStorage
  try {
    const existing = getLocalShopVisitRecords();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 500);
    localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not cache shop visit record in localStorage', e);
  }

  // 2. Sync to Backend API
  try {
    fetch('/api/audit/shop-visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => {});
  } catch {}

  return record;
}
