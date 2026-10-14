import axios from 'axios';

// ===== 基底地址【現階段單一後端，兩個共用同一個；將來分拆先改】=====
// const API_AUTH_BASE_URL = "https://dreamofwisdom-auth.onrender.com/api";
// const API_DREAM_BASE_URL = "https://dream-api-gfrb.onrender.com/api";
const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

// 輔助：取出token包埋Auth header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
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
    throw err.response?.data || {message: "讀取夢境記錄失敗"};
  }
}

// 4. 刪除單條夢境紀錄
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

// 5. 更新夢境記錄（用於更新tags等內容）
export async function updateDreamRecord(recordId, updateData) {
  try {
    const res = await axios.put(`${API_BASE_URL}/dream-record/${recordId}`, updateData, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "更新夢境失敗"};
  }
}

// ========== Auth 登入註冊相關接口（對應驗證碼流程，日後撥去Auth後端） ==========
// 第一步：發送註冊驗證碼
export async function sendRegisterCode(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/send-register-code`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送註冊驗證碼失敗"};
  }
}

// 第二步：提交驗證碼，完成註冊
export async function verifyRegister(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/verify-register`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "驗證註冊失敗"};
  }
}

export async function loginUser(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "登入失敗"};
  }
}

// 讀取用戶資料 /api/me（取代舊 /profile）
export async function getMe() {
  try {
    const res = await axios.get(`${API_BASE_URL}/me`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取個人資料失敗"};
  }
}

// 發送重設密碼驗證碼
export async function sendResetCode(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/send-reset-code`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送重設密碼驗證碼失敗"};
  }
}

// 提交驗證碼 + 新密碼，重設密碼
export async function resetPassword(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/reset-password`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "重設密碼失敗"};
  }
}

// ========== 補返舊有缺失函數，解決 Vite Build 報錯（保留唔郁） ==========
export async function submitDreamQuiz(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-quiz`, payload, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "提交問卷失敗" };
  }
}

export async function deepDreamAnalyze(payload) {
  return getDreamAnalysis(payload);
}

export async function watchAdGetStars() {
  try {
    const res = await axios.post(`${API_BASE_URL}/watch-ad-get-stars`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "領取星星失敗" };
  }
}
