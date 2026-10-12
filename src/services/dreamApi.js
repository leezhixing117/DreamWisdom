import axios from 'axios';

// 後端Render API地址，替換成你自己嘅後端網址
const API_BASE_URL = "https://dream-api-gfrb.onrender.com";

// 1. 發送夢境，呼叫DeepSeek生成解夢報告（兩個名稱同時export，兼容舊import）
export async function getDreamAnalysis(payload) {
  const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
  return res.data;
}
export const getDeepDreamAnalysis = getDreamAnalysis;

// 2. 儲存夢境紀錄到MongoDB
export async function saveDreamRecord(data) {
  const res = await axios.post(`${API_BASE_URL}/dream-record`, data);
  return res.data;
}

// 3. 讀取該用戶所有夢境歷史紀錄
export async function getDreamHistory(userId) {
  const res = await axios.get(`${API_BASE_URL}/dream-records?userId=${userId}`);
  return res.data;
}

// ========== 會員登入 / 註冊 / 驗證碼 / 忘記密碼 API ==========
// 發送註冊驗證碼
export async function sendRegisterCode(email) {
  const res = await axios.post(`${API_BASE_URL}/auth/send-register-code`, { email });
  return res.data;
}

// 提交註冊 + 驗證碼開通帳號
export async function registerWithCode({email, password, code}) {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, {email, password, code});
  return res.data;
}

// 會員登入
export async function loginAccount({email, password}) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {email, password});
  return res.data;
}

// 發送忘記密碼驗證碼
export async function sendResetPwdCode(email) {
  const res = await axios.post(`${API_BASE_URL}/auth/send-reset-code`, { email });
  return res.data;
}

// 重設密碼
export async function resetPassword({email, code, newPassword}) {
  const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {email, code, newPassword});
  return res.data;
}
