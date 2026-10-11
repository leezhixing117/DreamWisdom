// 根據報告文字，篩選匹配項目
export function matchItemsByKeywords(reportText, itemList) {
  if (!reportText) return [];
  const lowerText = reportText.toLowerCase();
  return itemList.filter(item => {
    return item.keywords.some(kw => lowerText.includes(kw));
  });
}
