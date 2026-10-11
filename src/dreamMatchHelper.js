// 根據報告文字，篩選匹配項目，可限制返回數量
export function matchItemsByKeywords(reportText, itemList, maxCount = 2) {
  if (!reportText) return [];
  const lowerText = reportText.toLowerCase();
  const matched = itemList.filter(item => {
    return item.keywords.some(kw => lowerText.includes(kw));
  });
  // 最多傳回 maxCount 個
  return matched.slice(0, maxCount);
}
