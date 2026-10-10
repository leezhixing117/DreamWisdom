// src/services/dreamApi.js
import axios from 'axios';

// Render Python backend 真實網址
const API_BASE_URL = "https://dream-api-gfrb.onrender.com/";

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
