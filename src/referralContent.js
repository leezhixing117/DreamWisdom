// 轉介服務，改用group綁定，配對上面嘅同義詞組
export const referralList = [
  {
    id: 1,
    title: "一對一夢境深度諮詢",
    description: "適合重複夢、噩夢、強烈情緒夢，深入拆解潛意識主題。",
    group: "fear",
    buttonText: "預約諮詢",
    link: "/referral/dream-consult"
  },
  {
    id: 2,
    title: "榮格取向心理輔導",
    description: "探索原型、陰影、共時性，適合自我探索、內在衝突。",
    group: "shadow",
    buttonText: "查看詳情",
    link: "/referral/jung-therapy"
  }
];

// 通用推介（冇任何group匹配時使用）
export const referralDefault = {
  title: "專業心理轉介服務",
  description: "想更深入探索夢境帶來嘅訊息，可以預約專業諮詢。",
  buttonText: "全部轉介服務",
  link: "/referral"
};
