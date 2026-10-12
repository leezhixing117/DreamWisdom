import axios from 'axios';

// 後端Render API地址，全部接口都前置 /api
const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 1. 發送夢境，呼叫DeepSeek生成解夢報告（兩個名稱同時export，兼容舊import）
export async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "解夢API請求失敗"};
  }
}
export const getDeepDreamAnalysis = getDreamAnalysis;

// 2. 儲存夢境紀錄到MongoDB（加上Bearer Token驗證）
export async function saveDreamRecord(data) {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-record`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "儲存夢境記錄失敗"};
  }
}

// 3. 讀取該用戶所有夢境歷史紀錄（改用Header Bearer Token，唔用URL傳userId，更安全）
export async function getDreamHistory() {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取夢境歷史失敗"};
  }
}

// ========== 會員登入 / 註冊 / 驗證碼 / 忘記密碼 API ==========
// 發送註冊驗證碼
export async function sendRegisterCode(email) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/send-register-code`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送註冊驗證碼失敗"};
  }
}

// 提交註冊 + 驗證碼開通帳號
export async function registerWithCode({email, password, code}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, {email, password, code});
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "註冊失敗"};
  }
}

// 會員登入
export async function loginAccount({email, password}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {email, password});
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "登入失敗"};
  }
}

// 發送忘記密碼驗證碼
export async function sendResetPwdCode(email) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/send-reset-code`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送重設密碼驗證碼失敗"};
  }
}

// 重設密碼
export async function resetPassword({email, code, newPassword}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {email, code, newPassword});
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "重設密碼失敗"};
  }
}
