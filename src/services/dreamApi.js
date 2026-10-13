import axios from 'axios';

// Auth 獨立後端
const AUTH_BASE_URL = "https://dreamofwisdom-auth.onrender.com";
// 夢境Flask後端
const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 全域axios預設：允許攜帶cookie（跨域必須呢個）
axios.defaults.withCredentials = true;

// ========== Auth 相關（Node Auth，Cookie模式） ==========
// 發送註冊驗證碼
export async function sendRegisterCode(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/send-register-code`, payload);
  return res.data;
}

// 驗證註冊碼，開通帳號
export async function verifyRegister(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/verify-register`, payload);
  return res.data;
}

// 登入（會自動set cookie access_token，唔使自己存localStorage）
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

// ========== 夢境API（Flask後端） ==========
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
  // ⚠️ 重點：而家Flask要改為讀Cookie入面嘅access_token，唔再傳Bearer header
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

// 更新標籤 PUT
export async function updateDreamTags(dreamId, tags) {
  const res = await axios.put(`${API_BASE_URL}/dream-record/${dreamId}/tags`, { tags });
  return res.data;
}
