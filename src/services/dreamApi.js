// src/services/dreamApi.js
import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/";

export async function getDeepDreamAnalysis(payload) {
  try {
    // 後端POST路由係根路徑 /
    const res = await axios.post(`${API_BASE_URL}`, payload);
    if (!res.data.success) {
      throw new Error(res.data.error || "後端回傳失敗");
    }
    // 後端成功返回欄位係 deep_result
    return res.data.deep_result;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || "後端API回傳錯誤");
    } else {
      throw new Error("無法連接後端，請檢查API服務是否啟動");
    }
  }
}
