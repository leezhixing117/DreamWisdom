// 【管理員設定：推介優先次序】由上到下，優先級由高到低
const groupPriority = [
  "trauma",
  "fear",
  "repeatDream",
  "loss",
  "relationship",
  "boundary",
  "lonely",
  "stress",
  "confusion",
  "rebirth",
  "intuition",
  "abundance"
];

// 同義詞詞庫：同一組入面任何一個詞出現，就觸發
const synonymGroups = [
  { group: "fear", words: ["恐懼", "害怕", "驚慌", "恐", "噩夢", "驚嚇"] },
  { group: "stress", words: ["壓力", "焦慮", "煩惱", "混亂", "雜念", "緊張"] },
  { group: "trauma", words: ["創傷", "痛苦", "傷痛", "壓抑", "悲傷"] },
  { group: "repeatDream", words: ["重複夢", "不斷重複", "反覆出現"] },
  { group: "shadow", words: ["陰影", "原型", "內在衝突", "衝突", "自我", "轉化"] },
  { group: "intuition", words: ["直覺", "靈感", "訊號", "夢境訊息", "預感"] },
  { group: "boundary", words: ["追趕", "被追", "侵擾", "耗盡", "耗弱"] },
  { group: "lonely", words: ["孤獨", "空虛", "寂寞", "孤單", "孤獨感", "空虛感"] },
  { group: "loss", words: ["失落", "失去", "損失", "遺失", "丟失", "離別", "失落感"] },
  { group: "relationship", words: ["關係", "爭執", "吵架", "不和", "矛盾", "伴侶", "感情"] },
  { group: "rebirth", words: ["重生", "轉變", "新生", "蛻變", "甦醒", "新開始"] },
  { group: "confusion", words: ["迷茫", "困惑", "唔知方向", "迷失", "無助", "不知所措"] },
  { group: "abundance", words: ["豐盛", "富足", "財富", "機會", "收穫", "資源"] }
];

// 輸入一段文字，返回命中嘅 group key Set
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
 * 根據報告文字 + 項目綁定嘅 group，按管理員優先級排序，最多返回 maxCount
 * @param {string} reportText - Gemini解夢報告
 * @param {Array} itemList - shopProductList / referralList
 * @param {number} maxCount - 最多顯示幾個推介
 * @returns {Array} 排序後嘅推介清單
 */
export function matchItemsByKeywords(reportText, itemList, maxCount = 2) {
  const matchedGroups = getMatchedGroups(reportText);
  if (matchedGroups.size === 0) return [];

  // 1. 先篩選所有命中嘅項目
  const matchedItems = itemList.filter(item => matchedGroups.has(item.group));

  // 2. 按管理員設定嘅優先次序排序
  matchedItems.sort((a, b) => {
    const indexA = groupPriority.indexOf(a.group);
    const indexB = groupPriority.indexOf(b.group);
    // index 越細 = 優先級越高
    return indexA - indexB;
  });

  // 3. 截取最多 maxCount 個
  return matchedItems.slice(0, maxCount);
}
