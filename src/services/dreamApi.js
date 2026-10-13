import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 1. 初步解夢（免登入）
export async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "解夢API請求失敗"};
  }
}

// 2. 深度解夢（扣星星｜成功後前端觸發產品推介）
export async function getDeepDream(payload) {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.post(`${API_BASE_URL}/deep-analyze`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "深度解夢失敗"};
  }
}

// 3. 註冊
export async function register(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "註冊失敗"};
  }
}

// 4. 登入
export async function login(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "登入失敗"};
  }
}

// 5. 儲存夢境紀錄
export async function saveDreamRecord(data) {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-record`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "儲存紀錄失敗"};
  }
}

// 6. 讀取夢境歷史
export async function getDreamHistory() {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取紀錄失敗"};
  }
}

// 7. 觀看廣告拿星星（唯一星星來源）
export async function watchAd() {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.post(`${API_BASE_URL}/watch-ad`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "廣告獎勵失敗"};
  }
}

// 8. 讀取用戶星星、廣告觀看次數
export async function getUserInfo() {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取個人資料失敗"};
  }
}
