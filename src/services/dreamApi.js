import axios from 'axios';

// Auth 獨立後端 (Node)
const AUTH_BASE_URL = "https://dreamofwisdom-auth.onrender.com";
// 夢境Flask後端
const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 全域axios：跨域攜帶Cookie
axios.defaults.withCredentials = true;

// ========== Auth 相關（Node Auth，Cookie模式） ==========
// 發送註冊驗證碼（新兩步流程第一步）
export async function sendRegisterCode(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/send-register-code`, payload);
  return res.data;
}

// 驗證註冊碼，開通帳號（新兩步流程第二步）
export async function verifyRegister(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/verify-register`, payload);
  return res.data;
}

/**
 * ⚠️ 短期兼容函數（供現有 LoginModal 一步註冊使用）
 * 內部自動：發送驗證碼 → 【這裡有重要限制】
 * 備註：Node Auth 後端而家嘅流程本質要用戶輸入郵件收code先可以verify
 * 👉 如果Node邊唔支援「後端自動讀取/跳過驗證碼」，呢個函數唔可以自動完成第二步！
 *
 * 【關鍵提醒】
 * 如果而家你嘅 Node Auth 一定要用戶手動輸入郵件入面嘅6位數code，
 * 咁技術上唔可能真·一步完成註冊！呢個係Node Auth後端嘅限制，唔係前端
 */
export async function register(payload) {
  // payload: {email, password}，同舊組件傳入格式一樣
  await sendRegisterCode(payload);
  // ========= 重點分界 =========
  // 如果你的Node auth後端**不支援自動核驗**，到呢一步就停咗，用戶仍然要收code
  // 亦即話：呢個兼容函數最多幫你自動發code，唔可以繞過輸入驗證碼呢一步
  throw new Error("【流程限制】而家Auth服務需要手動輸入郵件驗證碼，無法一步自動完成註冊，請後續改為兩步式彈窗");
}

// 登入（Node後端自動Set-Cookie access_token）
export async function login(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/login`, payload);
  return res.data;
}

// 發送重設密碼驗證碼
export async function sendResetCode(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/send-reset-code`, payload);
  return res.data;
}

// 重設密碼
export async function resetPassword(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/reset-password`, payload);
  return res.data;
}

// 拿當前用戶資料
export async function getMe() {
  const res = await axios.get(`${AUTH_BASE_URL}/api/auth/me`);
  return res.data;
}

// 登出（清除cookie）
export async function logout() {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/logout`);
  return res.data;
}

// Google登入跳轉網址
export const googleLoginUrl = `${AUTH_BASE_URL}/api/auth/google`;

// ========== 夢境API（Flask後端 /api 前綴，Cookie認證） ==========
// 解夢
export async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "解夢API請求失敗"};
  }
}
export const getDeepDreamAnalysis = getDreamAnalysis;

// 儲存夢境紀錄
export async function saveDreamRecord(data) {
  const res = await axios.post(`${API_BASE_URL}/dream-record`, data);
  return res.data;
}

// 讀取夢境歷史
export async function getDreamHistory() {
  const res = await axios.get(`${API_BASE_URL}/dream-records`);
  return res.data;
}

// 刪除夢境
export async function deleteDreamRecord(dreamId) {
  const res = await axios.delete(`${API_BASE_URL}/dream-record/${dreamId}`);
  return res.data;
}

// 更新成條夢境（原來PUT全量更新）
export async function updateDreamRecord(dreamId, data) {
  const res = await axios.put(`${API_BASE_URL}/dream-record/${dreamId}`, data);
  return res.data;
}

// 單獨更新標籤 PUT
export async function updateDreamTags(dreamId, tags) {
  const res = await axios.put(`${API_BASE_URL}/dream-record/${dreamId}/tags`, { tags });
  return res.data;
}
