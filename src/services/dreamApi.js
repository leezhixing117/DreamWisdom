import axios from 'axios';

// Auth 後端Render API地址
const AUTH_BASE_URL = "https://dream-api-gfrb.onrender.com/api";
// 夢境後端接口（同樣前綴 /api）
const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 全域設定 axios 預設帶 Cookie
axios.defaults.withCredentials = true;

// ========== Auth 相關接口 ==========
// 發送註冊驗證碼
export async function sendRegisterCode(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/send-register-code`, payload);
  return res.data;
}

// 驗證碼確認註冊
export async function verifyRegister(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/verify-register`, payload);
  return res.data;
}

/**
 * ⚠️ 短期兼容函數（LoginModal用）
 */
export async function register(payload) {
  await sendRegisterCode(payload);
  throw new Error("註冊功能暫時維護中，請使用Google登入");
}

// 電郵密碼登入
export async function login(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/login`, payload);
  return res.data;
}

// 發送重設密碼驗證碼
export async function sendResetPasswordCode(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/send-reset-code`, payload);
  return res.data;
}

// 重設密碼
export async function resetPassword(payload) {
  const res = await axios.post(`${AUTH_BASE_URL}/reset-password`, payload);
  return res.data;
}

// 取得當前登入用戶資料
export async function getMe() {
  const res = await axios.get(`${AUTH_BASE_URL}/me`);
  return res.data;
}

// 登出
export async function logout() {
  const res = await axios.post(`${AUTH_BASE_URL}/logout`);
  return res.data;
}

// Google 登入跳轉連結
export const googleLoginUrl = `${AUTH_BASE_URL}/auth/google`;

// ========== 夢境、解夢、問卷、星星接口 ==========
// 發送夢境，呼叫DeepSeek生成解夢報告（兼容舊import）
export async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "解夢API請求失敗"};
  }
}
export const getDeepDreamAnalysis = getDreamAnalysis;

// 儲存夢境紀錄到MongoDB
export async function saveDreamRecord(data) {
  const res = await axios.post(`${API_BASE_URL}/dream-record`, data);
  return res.data;
}

// 讀取該用戶所有夢境歷史紀錄
export async function getDreamHistory() {
  const res = await axios.get(`${API_BASE_URL}/dream-records`);
  return res.data;
}

// 刪除單一夢境紀錄
export async function deleteDreamRecord(recordId) {
  const res = await axios.delete(`${API_BASE_URL}/dream-record/${recordId}`);
  return res.data;
}

// 更新夢境紀錄（含 tags）
export async function updateDreamRecord(recordId, data) {
  const res = await axios.put(`${API_BASE_URL}/dream-record/${recordId}`, data);
  return res.data;
}

// 提交夢境問卷（而家缺嗰個！）
export async function submitDreamQuiz(payload) {
  const res = await axios.post(`${API_BASE_URL}/dream-quiz`, payload);
  return res.data;
}

// 深度解夢
export async function deepDreamAnalyze(payload) {
  const res = await axios.post(`${API_BASE_URL}/deep-analyze`, payload);
  return res.data;
}

// 觀看廣告領星星
export async function watchAdGetStars() {
  const res = await axios.post(`${API_BASE_URL}/watch-ad`);
  return res.data;
}
