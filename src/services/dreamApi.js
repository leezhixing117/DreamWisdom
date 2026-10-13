import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 統一攞token
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 1. 普通解夢（免登入、唔扣星）
export async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "解夢API請求失敗" };
  }
}
export const getDeepDreamAnalysis = getDreamAnalysis;

// 2. 深度解夢（登入、扣1粒星星）
export async function deepDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/deep-analyze`, payload, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "深度解夢失敗" };
  }
}

// 3. 儲存夢境紀錄
export async function saveDreamRecord(data) {
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-record`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "儲存紀錄失敗" };
  }
}

// 4. 讀取夢境歷史
export async function getDreamHistory() {
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "讀取歷史失敗" };
  }
}

// 5. 觀看廣告，攞星星（3次換3粒）
export async function watchAd() {
  try {
    const res = await axios.post(`${API_BASE_URL}/watch-ad`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "廣告獎勵失敗" };
  }
}

// 6. 註冊（新：email + password，無驗證碼）
export async function register(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "註冊失敗" };
  }
}

// 7. 登入
export async function login(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "登入失敗" };
  }
}

// 8. 拿取用戶資料、星星數
export async function getMe() {
  try {
    const res = await axios.get(`${API_BASE_URL}/me`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "取得用戶資料失敗" };
  }
}
