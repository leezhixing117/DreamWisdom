import axios from 'axios';

// ===== 基底地址【現階段單一後端，兩個共用同一個；將來分拆先改】=====
// const API_AUTH_BASE_URL = "https://dreamofwisdom-auth.onrender.com/api";
// const API_DREAM_BASE_URL = "https://dream-api-gfrb.onrender.com/api";
const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 輔助：取出token包埋Bearer header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-record`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "儲存夢境失敗"};
  }
}

// 3. 讀取該用戶所有夢境歷史紀錄
export async function getDreamHistory() {
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取夢境紀錄失敗"};
  }
}

// 4. 刪除指定夢境紀錄
export async function deleteDreamRecord(recordId) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/dream-record/${recordId}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "刪除夢境失敗"};
  }
}

// 5. 更新夢境紀錄（包含tags）
export async function updateDreamRecord(recordId, data) {
  try {
    const res = await axios.put(`${API_BASE_URL}/dream-record/${recordId}`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "更新夢境失敗"};
  }
}

// ========== Auth 認證接口（對應後端 app.py） ==========
// 註冊第一步：發送驗證碼
export async function sendRegisterCode(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/send-register-code`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送註冊驗證碼失敗"};
  }
}

// 註冊第二步：提交驗證碼，完成註冊
export async function verifyRegister(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/verify-register`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "驗證註冊失敗"};
  }
}

// 帳號密碼登入
export async function loginUser(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "登入失敗"};
  }
}

// 取得當前登入用戶資料
export async function getMe() {
  try {
    const res = await axios.get(`${API_BASE_URL}/me`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "獲取用戶資訊失敗"};
  }
}

// 忘記密碼 - 發送重設密碼驗證碼
export async function sendResetCode(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/send-reset-code`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送重設密碼驗證碼失敗"};
  }
}

// 忘記密碼 - 提交驗證碼 + 新密碼
export async function verifyResetPassword(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/verify-reset-password`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "重設密碼失敗"};
  }
}

// ========== 舊有函數，保留防止 Vite build 報錯 ==========
export async function submitDreamAnalysis(payload) {
  return getDreamAnalysis(payload);
}
export async function submitDreamSave(data) {
  return saveDreamRecord(data);
}
export async function submitDreamList() {
  return getDreamHistory();
}
export async function submitDreamDel(id) {
  return deleteDreamRecord(id);
}
export async function submitDreamEdit(id, data) {
  return updateDreamRecord(id, data);
}
export async function submitUserInfo() {
  return getMe();
}
export async function submitLogout() {
  localStorage.removeItem('token');
  return true;
}
