]// 轉介服務內容，每個項目綁定觸發關鍵詞
export const referralList = [
  {
    id: 1,
    title: "一對一夢境深度諮詢",
    description: "適合重複夢、噩夢、強烈情緒夢，深入拆解潛意識主題。",
    keywords: ["噩夢", "重複夢", "恐懼", "創傷", "壓抑", "痛苦"],
    buttonText: "預約諮詢",
    link: "/referral/dream-consult"
  },
  {
    id: 2,
    title: "榮格取向心理輔導",
    description: "探索原型、陰影、共時性，適合自我探索、內在衝突。",
    keywords: ["原型", "陰影", "衝突", "自我", "內在", "轉化"],
    buttonText: "查看詳情",
    link: "/referral/jung-therapy"
  }
];

// 通用推介（任何情況都可以顯示，當冇關鍵詞匹配時用）
export const referralDefault = {
  title: "專業心理轉介服務",
  description: "想更深入探索夢境帶來嘅訊息，可以預約專業諮詢。",
  buttonText: "全部轉介服務",
  link: "/referral"
};
