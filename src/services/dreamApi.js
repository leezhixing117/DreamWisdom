// src/services/dreamApi.js 最終版（唔好再修改）
import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/";

export async function getDeepDreamAnalysis(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}`, payload);
    if (!res.data.success) {
      throw new Error(res.data.error || "後端回傳失敗");
    }
    return res.data.deep_result;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || "後端API回傳錯誤");
    } else {
      throw new Error("無法連接後端，請檢查API服務是否啟動");
    }
  }
}
