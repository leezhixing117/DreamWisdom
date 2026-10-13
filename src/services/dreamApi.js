import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/api";

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 1. 普通解夢
async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "解夢API請求失敗" };
  }
}

// 2. 深度解夢
async function deepDreamAnalysis(payload) {
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
async function saveDreamRecord(data) {
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
async function getDreamHistory() {
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "讀取歷史失敗" };
  }
}

// 5. 刪除夢境紀錄
async function deleteDreamRecord(recordId) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/dream-record/${recordId}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "刪除紀錄失敗" };
  }
}

// 6. 更新標籤
async function updateDreamTags(recordId, tags) {
  try {
    const res = await axios.put(`${API_BASE_URL}/dream-record/${recordId}/tags`, { tags }, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "更新標籤失敗" };
  }
}

// 7. 看廣告攞星星
async function watchAd() {
  try {
    const res = await axios.post(`${API_BASE_URL}/watch-ad`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "廣告獎勵失敗" };
  }
}

// 8. 提交夢境測驗 submitDreamQuiz
async function submitDreamQuiz(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-quiz`, payload, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "提交測驗失敗" };
  }
}

// 9. 註冊
async function register(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "註冊失敗" };
  }
}

// 10. 登入
async function login(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "登入失敗" };
  }
}

// 11. 個人資料
async function getMe() {
  try {
    const res = await axios.get(`${API_BASE_URL}/me`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "取得用戶資料失敗" };
  }
}

// ========== 一次過全部 export + 舊別名 alias ==========
export {
  getDreamAnalysis,
  getDreamAnalysis as getDeepDreamAnalysis,

  deepDreamAnalysis,
  deepDreamAnalysis as deepDreamAnalyze,

  saveDreamRecord,
  getDreamHistory,
  deleteDreamRecord,
  updateDreamTags,

  watchAd,
  watchAd as watchAdGetStars,

  submitDreamQuiz,

  register,
  login,

  getMe,
  getMe as getMyProfile
};
