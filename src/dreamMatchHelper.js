// 同義詞詞庫：同一組入面任何一個詞出現，就觸發
const synonymGroups = [
  { group: "fear", words: ["恐懼", "害怕", "驚慌", "恐", "噩夢", "驚嚇"] },
  { group: "stress", words: ["壓力", "焦慮", "煩惱", "混亂", "雜念", "緊張"] },
  { group: "trauma", words: ["創傷", "痛苦", "傷痛", "壓抑", "悲傷"] },
  { group: "repeatDream", words: ["重複夢", "不斷重複", "反覆出現"] },
  { group: "shadow", words: ["陰影", "原型", "內在衝突", "衝突", "自我", "轉化"] },
  { group: "intuition", words: ["直覺", "靈感", "訊號", "夢境訊息", "預感"] },
  { group: "boundary", words: ["追趕", "被追", "侵擾", "耗盡", "耗弱"] }
];

// 輸入一段文字，返回命中嘅 group key
function getMatchedGroups(text) {
  if (!text) return new Set();
  const lowerText = text.toLowerCase();
  const matched = new Set();
  for (const g of synonymGroups) {
    for (const w of g.words) {
      if (lowerText.includes(w)) {
        matched.add(g.group);
        break;
      }
    }
  }
  return matched;
}

/**
 * 根據報告文字 + 項目綁定嘅 group，篩選項目，最多返回 maxCount
 * item 入面而家唔係寫keywords，而係寫 group: "fear"
 */
export function matchItemsByKeywords(reportText, itemList, maxCount = 2) {
  const matchedGroups = getMatchedGroups(reportText);
  if (matchedGroups.size === 0) return [];

  const matchedItems = itemList.filter(item => {
    return matchedGroups.has(item.group);
  });
  return matchedItems.slice(0, maxCount);
}
