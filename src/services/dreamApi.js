// src/services/dreamApi.js
export const getDeepDreamAnalysis = async (dreamData) => {
  try {
    const res = await fetch("https://dream-api-gfrb.onrender.com/dream_analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dreamData),
    });
    const data = await res.json();
    return data.deep_analysis;
  } catch (err) {
    console.error("API錯誤：", err);
    return "暫時無法取得深度解夢，請稍後再試";
  }
};
