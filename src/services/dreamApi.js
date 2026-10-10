// src/services/dreamApi.js
import axios from 'axios';

// 呢度替換成你Render上面 Python backend (dream-api)嘅URL，尾唔好漏 /
const API_BASE_URL = "https://dream-api.onrender.com/";

export async function getDeepDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}api/deep-dream`, payload);
    return res.data.result;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "後端API回傳錯誤");
    } else {
      throw new Error("無法連接後端，請檢查API服務是否啟動");
    }
  }
}
