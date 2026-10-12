// src/services/dreamApi.js // 最終版（唔好再修改）
import axios from 'axios';

const API_BASE_URL = "https://dream-api-gfrb.onrender.com/";

// 取得AI解夢分析
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

// 【新增】儲存夢境記錄到MongoDB
export async function saveDreamRecord(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}save-dream`, payload);
    if (!res.data.success) {
      throw new Error(res.data.error || "儲存夢境失敗");
    }
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || "儲存夢境API錯誤");
    } else {
      throw new Error("無法連接後端，儲存失敗");
    }
  }
}

// 【新增】讀取該用戶所有夢境歷史紀錄
export async function getDreamHistory(userId) {
  try {
    const res = await axios.get(`${API_BASE_URL}dream-history`, {
      params: { userId }
    });
    if (!res.data.success) {
      throw new Error(res.data.error || "讀取夢境紀錄失敗");
    }
    return res.data.records;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || "讀取紀錄API錯誤");
    } else {
      throw new Error("無法連接後端，載入歷史失敗");
    }
  }
}
