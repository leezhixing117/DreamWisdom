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
    description: "探索原型、陰影、共時性，適合自我與內在衝突議題。",
    group: "shadow",
    buttonText: "查看詳情",
    link: "/referral/jung-therapy"
  },
  {
    id:3,
    title:"內在孤獨議題輔導",
    description:"當夢境反覆出現孤獨、空虛感，探索內在分離感與自我接納。",
    group: "lonely",
    buttonText: "預約諮詢",
    link: "/referral/lonely-consult"
  },
  {
    id:4,
    title:"失落與離別議題諮詢",
    description:"夢中出現失去、遺失、離別意象，協助處理喪失帶來嘅悲傷同內在糾結。",
    group: "loss",
    buttonText: "預約諮詢",
    link: "/referral/loss-consult"
  },
  {
    id:5,
    title:"人際與感情關係輔導",
    description:"夢入面有伴侶爭執、人際矛盾，拆解關係入面嘅潛意識情緒。",
    group: "relationship",
    buttonText: "預約諮詢",
    link: "/referral/relationship-consult"
  },
  {
    id:6,
    title:"人生轉化與蛻變諮詢",
    description:"夢象徵階段轉變、重生，協助理解內在轉化，順利渡過轉折期。",
    group: "rebirth",
    buttonText: "預約諮詢",
    link: "/referral/rebirth-consult"
  },
  {
    id:7,
    title:"方向與人生迷茫諮詢",
    description:"夢境呈現迷失、無助，一起探索內在困惑，找回屬於自己嘅方向。",
    group: "confusion",
    buttonText: "預約諮詢",
    link: "/referral/confusion-consult"
  }
];

// 通用推介（冇任何group匹配時使用）
export const referralDefault = {
  title: "專業心理轉介服務",
  description: "想更深入探索夢境帶來嘅訊息，可以預約專業諮詢。",
  buttonText: "全部轉介服務",
  link: "/referral"
};
