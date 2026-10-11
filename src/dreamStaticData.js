// 解夢靜態資料，基本唔會修改
export const tagList = [
  { label: "海洋水流 +", value: "海洋水流" },
  { label: "赤腳無鞋 +", value: "赤腳無鞋" },
  { label: "被人追趕 +", value: "被人追趕" },
  { label: "舊居屋邨 +", value: "舊居屋邨" },
  { label: "家宅神檯 +", value: "家宅神檯" },
  { label: "課室考試 +", value: "課室考試" },
  { label: "緊閉門鎖 +", value: "緊閉門鎖" },
  { label: "高處墜落 +", value: "高處墜落" },
  { label: "脫落牙齒 +", value: "脫落牙齒" },
  { label: "神秘鑰匙 +", value: "神秘鑰匙" },
  { label: "飛翔羽翼 +", value: "飛翔羽翼" },
  { label: "迷宮走廊 +", value: "迷宮走廊" },
];

// 記夢引導提示詞
export const promptHints = [
  "有邊啲人物？",
  "場景係邊度？",
  "感覺如何？",
  "有特定物件？"
];

// 前端本地簡單解夢（唔呼叫API）
export function generateSimpleDreamAnalysis(dream, tags) {
  if (!dream.trim()) return '';
  const tagStr = tags.length > 0 ? `，附加意象：${tags.join('、')}` : '';
  return `你記錄嘅夢境：${dream.slice(0,80)}。呢個夢反映潛意識嘅內在情緒，代表你正經歷內心轉變，釋放累積壓力。夢中嘅感受比畫面更重要，係心靈整理感受嘅訊號${tagStr}。`;
}
