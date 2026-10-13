import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 自動帶Token嘅axios實例
const api = axios.create({
  baseURL: API_BASE_URL
});
// 攞token塞入header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

// 1. 解夢 DeepSeek
export async function getDreamAnalysis(payload) {
  try {
    const res = await api.post("/analyze", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "解夢API請求失敗"};
  }
}
export const getDeepDreamAnalysis = getDreamAnalysis;

// 2. 儲存夢境紀錄
export async function saveDreamRecord(data) {
  try {
    const res = await api.post("/dream-record", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "儲存夢境失敗"};
  }
}

// 3. 讀取所有夢境紀錄
export async function getDreamHistory() {
  try {
    const res = await api.get("/dream-records");
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取夢境紀錄失敗"};
  }
}

// 4. 更新夢境（包含tags）
export async function updateDreamRecord(recordId, data) {
  try {
    const res = await api.put(`/dream-record/${recordId}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "更新夢境失敗"};
  }
}

// 5. 刪除夢境
export async function deleteDreamRecord(recordId) {
  try {
    const res = await api.delete(`/dream-record/${recordId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "刪除夢境失敗"};
  }
}

// ========== Auth 認證接口 ==========
// 發送註冊驗證碼
export async function sendRegisterCode(payload) {
  try {
    const res = await api.post("/send-register-code", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送註冊驗證碼失敗"};
  }
}

// 驗證碼 + 完成註冊
export async function verifyRegister(payload) {
  try {
    const res = await api.post("/verify-register", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "註冊失敗"};
  }
}

// 登入
export async function login(payload) {
  try {
    const res = await api.post("/login", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "登入失敗"};
  }
}

// 取得當前用戶資料
export async function getMe() {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "獲取用戶資訊失敗"};
  }
}

// 發送重設密碼驗證碼
export async function sendResetCode(payload) {
  try {
    const res = await api.post("/send-reset-code", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送重設密碼驗證碼失敗"};
  }
}

// 重設密碼
export async function resetPassword(payload) {
  try {
    const res = await api.post("/reset-password", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "重設密碼失敗"};
  }
}
