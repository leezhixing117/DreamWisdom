import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 攞token統一處理
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 1. 解夢（保留舊名兼容）
export async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "解夢API請求失敗" };
  }
}
export const getDeepDreamAnalysis = getDreamAnalysis;

// 2. 儲存夢境紀錄
export async function saveDreamRecord(data) {
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-record`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "儲存夢境失敗" };
  }
}

// 3. 讀取所有夢境歷史
export async function getDreamHistory() {
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "讀取夢境紀錄失敗" };
  }
}

// 4. 更新夢境（tags / 內容）
export async function updateDreamRecord(id, data) {
  try {
    const res = await axios.put(`${API_BASE_URL}/dream-record/${id}`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "更新夢境失敗" };
  }
}

// 5. 刪除夢境
export async function deleteDreamRecord(id) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/dream-record/${id}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "刪除夢境失敗" };
  }
}

// ========== Auth 認證接口 ==========
// 發送註冊驗證碼
export async function sendRegisterCode(email) {
  try {
    const res = await axios.post(`${API_BASE_URL}/send-register-code`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "發送註冊驗證碼失敗" };
  }
}

// 驗證碼 + 註冊
export async function verifyRegister(email, code, password) {
  try {
    const res = await axios.post(`${API_BASE_URL}/verify-register`, { email, code, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "註冊失敗" };
  }
}

// 登入
export async function login(email, password) {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "登入失敗" };
  }
}

// 拿使用者資料
export async function getMe() {
  try {
    const res = await axios.get(`${API_BASE_URL}/me`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "取得使用者資料失敗" };
  }
}

// 發送重設密碼驗證碼
export async function sendResetCode(email) {
  try {
    const res = await axios.post(`${API_BASE_URL}/send-reset-code`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "發送重設密碼驗證碼失敗" };
  }
}

// 重設密碼
export async function resetPassword(email, code, password) {
  try {
    const res = await axios.post(`${API_BASE_URL}/reset-password`, { email, code, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "重設密碼失敗" };
  }
}
