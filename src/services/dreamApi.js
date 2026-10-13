import axios from 'axios';

// 後端Render API地址：唔再加 /api 前綴
const API_BASE_URL = "https://dream-api-gfrb.onrender.com";

// 統一取出 token 同組 header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 1. 發送夢境，呼叫DeepSeek生成解夢報告（兩個名稱同時export，兼容舊import）
export async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload, {
      headers: getAuthHeader()
    });
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
    throw err.response?.data || {message: "儲存夢境記錄失敗"};
  }
}

// 3. 讀取該用戶所有夢境歷史紀錄（改用Header Bearer Token，唔用URL傳userId，更安全）
export async function getDreamHistory() {
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取夢境歷史失敗"};
  }
}

// 4. 刪除單一夢境紀錄
export async function deleteDreamRecord(dreamId) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/dream-record/${dreamId}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "刪除夢境記錄失敗"};
  }
}

// 5. 更新夢境標籤 tags（對應後端PUT /dream-record/:dreamId/tags）
export async function updateDreamTags(dreamId, tagsArray) {
  try {
    const res = await axios.put(`${API_BASE_URL}/dream-record/${dreamId}/tags`,
      { tags: tagsArray },
      {
        headers: getAuthHeader()
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "更新夢境標籤失敗"};
  }
}

// 6. 深度AI解夢
export async function deepDreamAnalyze(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/deep-analyze`, payload, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "深度解夢失敗"};
  }
}

// 7. 提交3條心理問卷
export async function submitDreamQuiz(quizData) {
  try {
    const res = await axios.post(`${API_BASE_URL}/quiz-finish`, quizData, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "提交問卷失敗"};
  }
}

// 8. 觀看1個廣告 +1星（累計3個廣告先兌換3星，後端負責計 adWatchCount）
export async function watchAdGetStars() {
  try {
    const res = await axios.post(`${API_BASE_URL}/watch-ad`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "觀看廣告獎星失敗"};
  }
}

// 9. 取得用戶資料（星星、adWatchCount）
export async function getMyProfile() {
  try {
    const res = await axios.get(`${API_BASE_URL}/me`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取用戶資料失敗"};
  }
}

// ========== 會員登入 / 註冊 / 驗證碼 / 忘記密碼 API ==========
// 發送註冊驗證碼【路由：/auth/send-code】
export async function sendRegisterCode(email) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/send-code`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送註冊驗證碼失敗"};
  }
}

// 提交註冊 + 驗證碼開通帳號
export async function registerWithCode({email, password, code}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, {email, password, code});
    // 註冊成功時，將token & user資訊存入localStorage
    if(res.data.success){
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "註冊失敗"};
  }
}

// 會員登入
export async function loginAccount({email, password}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {email, password});
    // 登入成功儲存token同用戶資料
    if(res.data.success){
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "登入失敗"};
  }
}

// ✅ 修正：發送忘記密碼驗證碼【路由：/auth/forgot-code】
export async function sendResetPwdCode(email) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/forgot-code`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "發送重設密碼驗證碼失敗"};
  }
}

// 重設密碼【參數名對齊後端：password】
export async function resetPassword({email, code, newPassword}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      email,
      code,
      password: newPassword
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "重設密碼失敗"};
  }
}

// ========== 新增加輔助函數 ==========
// 登出：清除本地儲存
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// 讀取目前登入用戶資料
export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if(!userStr) return null;
  return JSON.parse(userStr);
}
