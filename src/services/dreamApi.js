import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com";

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 1. 解夢
async function getDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "解夢API請求失敗"};
  }
}

// 2. 儲存夢境
async function saveDreamRecord(data) {
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-record`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "儲存失敗"};
  }
}

// 3. 讀取夢境歷史
async function getDreamHistory() {
  try {
    const res = await axios.get(`${API_BASE_URL}/dream-records`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取記錄失敗"};
  }
}

// 4. 刪除夢境
async function deleteDreamRecord(recordId) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/dream-record/${recordId}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "刪除失敗"};
  }
}

// 5. 更新標籤 PUT
async function updateDreamTags(recordId, tags) {
  try {
    const res = await axios.put(`${API_BASE_URL}/dream-record/${recordId}`, { tags }, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "更新標籤失敗"};
  }
}

// 6. 提交測驗
async function submitDreamQuiz(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/dream-quiz`, payload, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "提交測驗失敗"};
  }
}

// 7. 登入
async function login(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "登入失敗"};
  }
}

// 8. 註冊
async function register(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "註冊失敗"};
  }
}

// 9. 看廣告攞星星
async function watchAdGetStars() {
  try {
    const res = await axios.post(`${API_BASE_URL}/watch-ad`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "獎勵領取失敗"};
  }
}

// 10. 取得用戶資料
async function getMyProfile() {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || {message: "讀取個人資料失敗"};
  }
}

// export：同時兼容三個名稱！
// getDreamAnalysis（新）、getDeepDreamAnalysis（舊）、deepDreamAnalyze（組件而家用緊嘅名）
export {
  getDreamAnalysis,
  getDreamAnalysis as getDeepDreamAnalysis,
  getDreamAnalysis as deepDreamAnalyze,

  saveDreamRecord,
  getDreamHistory,
  deleteDreamRecord,
  updateDreamTags,

  submitDreamQuiz,

  login,
  register,
  watchAdGetStars,
  getMyProfile
};
