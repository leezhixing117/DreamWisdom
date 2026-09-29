import fs from 'fs';
import path from 'path';
import OpenCC from 'opencc-js';

const s2t = OpenCC.Converter({ from: 'cn', to: 'hk' });
const t2s = OpenCC.Converter({ from: 'hk', to: 'cn' });

export interface RawSymbolDef {
  symbol: string;
  aliases: string[];
  tags: string[];
  tag_ids: number[];
  book_interpret: Record<string, { text: string; weight: number }>;
  source_ref: string;
  notes: string;
}

export interface SymbolOutput {
  symbol_id: number;
  symbol: string;
  alias_list: string[];
  tags: string[];
  tag_ids: number[];
  book_interpret: Record<string, { text: string; weight: number }>;
  source_ref: string;
  notes: string;
}

const rawSymbols: RawSymbolDef[] = [
  // 1. 人物原型
  {
    symbol: "祖母",
    aliases: ["嫲嫲", "奶奶", "外婆", "姥姥", "阿婆", "婆婆"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "象徵庇護、舊時情感、內心母性原型", weight: 0.70 },
      "3": { text: "大母神原型", weight: 0.80 },
      "10": { text: "正向大母神：滋養、包容", weight: 0.75 }
    },
    source_ref: "1,3,10",
    notes: "人物原型"
  },
  {
    symbol: "祖父",
    aliases: ["爺爺", "阿公", "外公", "老爺", "阿爺"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "代表權威、經驗、精神指引", weight: 0.70 },
      "3": { text: "智慧老人原型", weight: 0.80 },
      "10": { text: "智慧老人原型", weight: 0.78 }
    },
    source_ref: "1,3,10",
    notes: "人物原型"
  },
  {
    symbol: "小偷",
    aliases: ["賊", "盜賊", "扒手", "竊賊"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "恐懼失去、被壓抑慾望", weight: 0.60 },
      "4": { text: "本我衝動外化", weight: 0.70 },
      "6": { text: "陰影原型", weight: 0.76 }
    },
    source_ref: "1,4,6",
    notes: "人物原型"
  },
  {
    symbol: "流浪漢",
    aliases: ["流浪人", "乞丐", "露宿者", "無家者"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "被遺棄的自我部分", weight: 0.70 },
      "6": { text: "陰影原型", weight: 0.80 },
      "8": { text: "未整合人格碎片", weight: 0.71 }
    },
    source_ref: "1,6,8",
    notes: "人物原型"
  },
  {
    symbol: "女巫",
    aliases: ["巫婆", "巫女", "妖婆"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "陰性陰影、直覺、操縱感", weight: 0.70 },
      "3": { text: "負面大母神原型", weight: 0.80 },
      "10": { text: "負面大母神", weight: 0.77 }
    },
    source_ref: "1,3,10",
    notes: "人物原型"
  },
  {
    symbol: "醫生",
    aliases: ["醫師", "大夫", "心理醫生"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "內在療癒者、修復渴望", weight: 0.70 },
      "3": { text: "療癒者原型", weight: 0.80 },
      "8": { text: "心靈自我修復象徵", weight: 0.72 }
    },
    source_ref: "1,3,8",
    notes: "人物原型"
  },
  {
    symbol: "小孩",
    aliases: ["孩童", "細路", "小朋友", "兒童", "嬰孩"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "內在孩童、初心與脆弱", weight: 0.70 },
      "3": { text: "內在孩童原型", weight: 0.80 },
      "10": { text: "新生潛能與脆弱整合", weight: 0.79 }
    },
    source_ref: "1,3,10",
    notes: "人物原型"
  },
  {
    symbol: "敵人",
    aliases: ["仇敵", "對手", "仇人"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "內心陰影投射、對抗焦慮", weight: 0.70 },
      "6": { text: "陰影投射", weight: 0.80 },
      "8": { text: "未整合的人格面向", weight: 0.73 }
    },
    source_ref: "1,6,8",
    notes: "人物原型"
  },
  {
    symbol: "司機",
    aliases: ["駕駛員", "開車的人", "司機師傅"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "人生方向掌控者、主導意志", weight: 0.70 },
      "2": { text: "意識或無意識的掌控狀態", weight: 0.76 },
      "7": { text: "控制權爭奪與信賴主題", weight: 0.69 }
    },
    source_ref: "1,2,7",
    notes: "人物原型"
  },
  {
    symbol: "聖者／隱士",
    aliases: ["聖人", "隱士", "智者", "高僧", "道士"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "內在智慧指引、超然獨處", weight: 0.70 },
      "3": { text: "智慧老人原型", weight: 0.80 },
      "10": { text: "智慧老人與超越功能", weight: 0.78 }
    },
    source_ref: "1,3,10",
    notes: "人物原型"
  },
  {
    symbol: "父親",
    aliases: ["爸爸", "老豆", "爹哋", "父親", "老爹"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "秩序與社會法則、認同與審查", weight: 0.70 },
      "3": { text: "父性原型與精神權威", weight: 0.82 },
      "4": { text: "超我監督者與道德規範", weight: 0.75 }
    },
    source_ref: "1,3,4",
    notes: "人物原型"
  },
  {
    symbol: "母親",
    aliases: ["媽媽", "阿媽", "媽咪", "母親", "娘親"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "1": { text: "滋養庇護與原生安全感、情感牽絆", weight: 0.72 },
      "3": { text: "大母神原型、包容與吞噬兩面性", weight: 0.84 },
      "10": { text: "母性無意識、生命滋育之源", weight: 0.78 }
    },
    source_ref: "1,3,10",
    notes: "人物原型"
  },
  {
    symbol: "陌生人",
    aliases: ["路人", "陌生男子", "陌生女子", "未知的人"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "2": { text: "未被意識化的未知人格片段", weight: 0.75 },
      "3": { text: "阿尼瑪或阿尼姆斯的初級投射", weight: 0.78 },
      "6": { text: "潛在陰影或未開發心靈特質", weight: 0.72 }
    },
    source_ref: "2,3,6",
    notes: "人物原型"
  },
  {
    symbol: "前任",
    aliases: ["前男友", "前女友", "前夫", "前妻", "舊情人"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "4": { text: "未竟的情感遺憾與壓抑慾望", weight: 0.70 },
      "8": { text: "心靈情結未整合之投射載體", weight: 0.73 },
      "15": { text: "對過去親密連結模式的反思", weight: 0.68 }
    },
    source_ref: "4,8,15",
    notes: "人物原型"
  },
  {
    symbol: "嬰兒",
    aliases: ["初生嬰兒", "BB", "赤子", "小寶寶", "小嬰兒"],
    tags: ["人物原型"],
    tag_ids: [1],
    book_interpret: {
      "2": { text: "新生自我與自性化初始萌芽", weight: 0.76 },
      "3": { text: "神聖孩童原型、無窮可能性", weight: 0.81 },
      "10": { text: "需要悉心呵護的全新心靈狀態", weight: 0.77 }
    },
    source_ref: "2,3,10",
    notes: "人物原型"
  },

  // 2. 自然物象
  {
    symbol: "太陽",
    aliases: ["日光", "日頭", "朝陽", "烈日", "夕陽", "陽光"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "2": { text: "意識的主導之光、理智與明晰", weight: 0.78 },
      "3": { text: "自性（Self）的崇高象徵", weight: 0.83 },
      "10": { text: "陽性創造原則、驅散無意識迷霧", weight: 0.76 }
    },
    source_ref: "2,3,10",
    notes: "自然物象"
  },
  {
    symbol: "月亮",
    aliases: ["月", "月球", "月光", "滿月", "殘月", "新月", "血月"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "2": { text: "潛意識情緒潮汐、直覺與靈感", weight: 0.79 },
      "3": { text: "陰性本質與阿尼瑪心靈映照", weight: 0.82 },
      "6": { text: "無意識幽微面貌、夜間心靈漫遊", weight: 0.75 }
    },
    source_ref: "2,3,6",
    notes: "自然物象"
  },
  {
    symbol: "星星",
    aliases: ["星", "星空", "流星", "恆星", "銀河", "星座"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "3": { text: "超個人命運指引、茫茫夜色中的希望", weight: 0.80 },
      "10": { text: "無意識星群、多重原型靈光乍現", weight: 0.77 },
      "16": { text: "跨文化中神聖守護與心靈座標", weight: 0.72 }
    },
    source_ref: "3,10,16",
    notes: "自然物象"
  },
  {
    symbol: "彩虹",
    aliases: ["虹", "彩雲", "虹霓", "雨後彩虹", "天邊彩虹"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "1": { text: "暴風雨後的平靜、創傷修復的契機", weight: 0.72 },
      "3": { text: "意識與無意識天地相通的和解橋樑", weight: 0.81 },
      "16": { text: "希望與整合的跨文化神聖契約", weight: 0.75 }
    },
    source_ref: "1,3,16",
    notes: "自然物象"
  },
  {
    symbol: "雷電／閃電",
    aliases: ["雷電", "閃電", "打雷", "雷聲", "霹靂", "雷暴"],
    tags: ["自然物象", "噩夢危機"],
    tag_ids: [8, 6],
    book_interpret: {
      "2": { text: "意識突如其來的頓悟、直覺靈光", weight: 0.76 },
      "9": { text: "潛在創傷壓力與受驚嚇的神經反應", weight: 0.71 },
      "10": { text: "天神憤怒原型、壓抑情緒的破土爆發", weight: 0.78 }
    },
    source_ref: "2,9,10",
    notes: "自然物象"
  },
  {
    symbol: "暴風雨／颱風",
    aliases: ["暴風雨", "颱風", "打風", "颶風", "狂風暴雨", "十號風球"],
    tags: ["自然物象", "噩夢危機"],
    tag_ids: [8, 6],
    book_interpret: {
      "1": { text: "生活環境壓倒性壓力、無力掌控感", weight: 0.73 },
      "9": { text: "強烈情緒激盪與防禦機制瓦解危機", weight: 0.75 },
      "20": { text: "焦慮噩夢中極為高頻的邊界失守象徵", weight: 0.72 }
    },
    source_ref: "1,9,20",
    notes: "自然物象"
  },
  {
    symbol: "雪／冰雪",
    aliases: ["雪", "冰雪", "下雪", "積雪", "暴風雪", "結冰", "冰山"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "1": { text: "感情冰凍、心理距離與孤獨疏離感", weight: 0.70 },
      "7": { text: "未被表達的冰封感受、壓抑的熱情", weight: 0.74 },
      "16": { text: "冬眠沈澱、靜待春暖復甦的轉化期", weight: 0.71 }
    },
    source_ref: "1,7,16",
    notes: "自然物象"
  },
  {
    symbol: "火／烈火",
    aliases: ["火", "烈火", "火光", "大火", "燃燒", "火焰", "篝火"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "1": { text: "激情、狂熱與難以壓制的憤怒衝動", weight: 0.72 },
      "3": { text: "心理煉金術中的轉化之火、淨化過程", weight: 0.81 },
      "16": { text: "毀滅舊事物以騰出新生空間的偉力", weight: 0.75 }
    },
    source_ref: "1,3,16",
    notes: "自然物象"
  },
  {
    symbol: "雲／烏雲",
    aliases: ["雲", "烏雲", "黑雲", "密雲", "白雲", "雲層"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "1": { text: "心頭籠罩的疑慮、憂鬱與焦慮陰影", weight: 0.70 },
      "5": { text: "思想飄忽不定的流動狀態", weight: 0.68 },
      "16": { text: "遮蔽真相的幻象、等待日光穿透", weight: 0.69 }
    },
    source_ref: "1,5,16",
    notes: "自然物象"
  },
  {
    symbol: "霧",
    aliases: ["霧", "大霧", "濃霧", "薄霧", "迷霧"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "2": { text: "意識與無意識交界處的迷茫困局", weight: 0.74 },
      "7": { text: "缺乏邊界感、自我認知模糊未定型", weight: 0.72 },
      "15": { text: "人生方向暫時失去清晰視角的過渡期", weight: 0.70 }
    },
    source_ref: "2,7,15",
    notes: "自然物象"
  },
  {
    symbol: "瀑布",
    aliases: ["瀑布", "水瀑", "飛瀑", "水簾"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "1": { text: "情緒劇烈傾瀉、不可逆的心靈衝擊", weight: 0.71 },
      "3": { text: "潛意識能量由高處向深處極速轉化", weight: 0.78 },
      "8": { text: "壓抑已久的話語或情感勢不可擋", weight: 0.73 }
    },
    source_ref: "1,3,8",
    notes: "自然物象"
  },
  {
    symbol: "大地／泥土",
    aliases: ["大地", "泥土", "土地", "土壤", "地面", "泥濘"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "1": { text: "現實安全感的根基、踏實落地的承托", weight: 0.72 },
      "3": { text: "母性大地原型、孕育萬物之基質", weight: 0.80 },
      "10": { text: "身心回歸本質的扎根力量", weight: 0.76 }
    },
    source_ref: "1,3,10",
    notes: "自然物象"
  },
  {
    symbol: "泉水／水井",
    aliases: ["泉水", "水井", "泉眼", "湧泉", "古井", "深井"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "2": { text: "潛意識深處源源不絕的滋養與靈感", weight: 0.77 },
      "3": { text: "智慧與真知之泉、自性源泉", weight: 0.81 },
      "10": { text: "向內探求所觸及的最清澈心理本能", weight: 0.75 }
    },
    source_ref: "2,3,10",
    notes: "自然物象"
  },
  {
    symbol: "樹木／大樹",
    aliases: ["樹木", "大樹", "森林之樹", "古樹", "枯樹", "神木"],
    tags: ["自然物象"],
    tag_ids: [8],
    book_interpret: {
      "2": { text: "自性化歷程的活生生象徵、個體生命之樹", weight: 0.80 },
      "3": { text: "向下扎根深層無意識、向上枝展意識天空", weight: 0.84 },
      "10": { text: "人格成長、堅韌不拔與時間的累積", weight: 0.79 }
    },
    source_ref: "2,3,10",
    notes: "自然物象"
  },

  // 3. 動物原型
  {
    symbol: "鹿",
    aliases: ["雄鹿", "小鹿", "梅花鹿"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "靈敏、純真、溫和本能追求", weight: 0.70 },
      "3": { text: "柔和本能與心靈引導者", weight: 0.60 },
      "10": { text: "溫和本能原型", weight: 0.72 }
    },
    source_ref: "1,3,10",
    notes: "動物原型"
  },
  {
    symbol: "貓",
    aliases: ["野貓", "家貓", "貓咪", "花貓", "黑貓", "白貓"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "直覺、敏銳、獨立邊界", weight: 0.70 },
      "3": { text: "陰性本能與神祕心靈連結", weight: 0.60 },
      "10": { text: "獨立本能原型、保護私密自主空間", weight: 0.71 }
    },
    source_ref: "1,3,10",
    notes: "動物原型"
  },
  {
    symbol: "孔雀",
    aliases: ["雄孔雀", "孔雀開屏"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "虛榮展現或自性光彩散發", weight: 0.60 },
      "15": { text: "自我呈現與渴求他人注視", weight: 0.66 },
      "16": { text: "跨文化象徵：自性完美與斑斕生命力", weight: 0.58 }
    },
    source_ref: "1,15,16",
    notes: "動物原型"
  },
  {
    symbol: "綿羊",
    aliases: ["羊", "綿羊", "羊群", "羔羊"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "順從群體、溫馴犧牲、缺乏主見", weight: 0.60 },
      "15": { text: "渴望群體歸屬與被接納的安全感", weight: 0.65 },
      "16": { text: "溫順與無防備心理防線", weight: 0.57 }
    },
    source_ref: "1,15,16",
    notes: "動物原型"
  },
  {
    symbol: "蝙蝠",
    aliases: ["蝙蝠", "蝠"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "黑暗感知、恐懼未知、回聲定位直覺", weight: 0.60 },
      "7": { text: "在盲目環境中仰賴個人深層直覺生存", weight: 0.65 },
      "16": { text: "文化雙重性：西方恐懼陰影 vs 東方福氣", weight: 0.59 }
    },
    source_ref: "1,7,16",
    notes: "動物原型"
  },
  {
    symbol: "狼",
    aliases: ["野狼", "狼群", "孤狼"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "野性生存力量、原始本能活力", weight: 0.70 },
      "3": { text: "未馴服的原始心靈衝動", weight: 0.70 },
      "10": { text: "野生本能原型、忠於群體或獨立孤傲", weight: 0.74 }
    },
    source_ref: "1,3,10",
    notes: "動物原型"
  },
  {
    symbol: "馬",
    aliases: ["野馬", "駿馬", "白馬", "黑馬"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "強盛生命力、向目標奔騰的動能", weight: 0.70 },
      "3": { text: "身體本能與能量載具", weight: 0.70 },
      "10": { text: "本能奔馳原型、意識與軀體協同", weight: 0.73 }
    },
    source_ref: "1,3,10",
    notes: "動物原型"
  },
  {
    symbol: "蛇",
    aliases: ["大蛇", "毒蛇", "青蛇", "白蛇", "蟒蛇"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "轉化蛻變、深層慾望與自我修復", weight: 0.70 },
      "3": { text: "死亡-重生原型與自性化守護神", weight: 0.80 },
      "4": { text: "原始本能衝動與性心理驅力", weight: 0.60 }
    },
    source_ref: "1,3,4",
    notes: "動物原型"
  },
  {
    symbol: "鷹",
    aliases: ["雄鷹", "老鷹", "獵鷹"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "高層遠見、洞察全局的超拔視角", weight: 0.70 },
      "3": { text: "精神超越原型、凌空俯瞰人生", weight: 0.80 },
      "10": { text: "理智凌越情感的清澈認知", weight: 0.76 }
    },
    source_ref: "1,3,10",
    notes: "動物原型"
  },
  {
    symbol: "老鼠",
    aliases: ["鼠", "耗子", "小老鼠"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "微小侵蝕焦慮、瑣碎生存煩惱", weight: 0.60 },
      "16": { text: "隱匿未被察覺的底層壓力威脅", weight: 0.57 },
      "19": { text: "華人夢境常見的日常小擔憂投射", weight: 0.56 }
    },
    source_ref: "1,16,19",
    notes: "動物原型"
  },
  {
    symbol: "龍",
    aliases: ["神龍", "巨龍", "青龍", "金龍", "黑龍", "龍王"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "3": { text: "潛意識巨大能量結晶、自性整合的終極考驗", weight: 0.83 },
      "10": { text: "古老原始大能、神聖守護或毀滅性力量", weight: 0.80 },
      "19": { text: "中華文化中吉祥、尊貴與天道意志的體現", weight: 0.78 }
    },
    source_ref: "3,10,19",
    notes: "動物原型"
  },
  {
    symbol: "老虎",
    aliases: ["虎", "猛虎", "白虎", "大白虎"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "不可忽視的強烈攻擊性與威嚴震懾力", weight: 0.73 },
      "3": { text: "陽性威嚴本能、爭奪支配權的心理原力", weight: 0.78 },
      "19": { text: "威猛避邪與內在恐懼並存的雙重投射", weight: 0.74 }
    },
    source_ref: "1,3,19",
    notes: "動物原型"
  },
  {
    symbol: "獅子",
    aliases: ["雄獅", "母獅", "幼獅", "獅群"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "2": { text: "意識王者尊嚴、追求掌控與榮耀的主導動能", weight: 0.76 },
      "3": { text: "太陽本能、狂野激情的自主整合", weight: 0.79 },
      "16": { text: "高貴勇氣、王權與不可侵犯的領地意識", weight: 0.72 }
    },
    source_ref: "2,3,16",
    notes: "動物原型"
  },
  {
    symbol: "狗／流浪狗",
    aliases: ["狗", "犬", "小狗", "惡狗", "流浪狗", "家犬", "黑狗"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "忠實陪伴、守護本能與對信任的渴求", weight: 0.71 },
      "7": { text: "被忽略或遺棄的內在忠誠特質", weight: 0.72 },
      "10": { text: "忠誠夥伴原型、保護者與攻擊防線", weight: 0.75 }
    },
    source_ref: "1,7,10",
    notes: "動物原型"
  },
  {
    symbol: "鳥／飛鳥",
    aliases: ["鳥", "飛鳥", "小鳥", "青鳥", "喜鵲", "飛禽"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "心靈自由渴望、遠走高飛的超脫遐想", weight: 0.70 },
      "3": { text: "靈性追求與思想超拔、阿尼瑪信使", weight: 0.81 },
      "6": { text: "跨越意識與潛意識邊界的羽翼象徵", weight: 0.75 }
    },
    source_ref: "1,3,6",
    notes: "動物原型"
  },
  {
    symbol: "烏鴉",
    aliases: ["烏鴉", "黑鳥", "寒鴉"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "3": { text: "陰影信使、幽微直覺與心理警示", weight: 0.77 },
      "10": { text: "死亡與轉化的先兆、看清不可見之物", weight: 0.76 },
      "16": { text: "跨文化中智者化身與陰影界引路人", weight: 0.71 }
    },
    source_ref: "3,10,16",
    notes: "動物原型"
  },
  {
    symbol: "蝴蝶",
    aliases: ["蝴蝶", "破繭成蝶", "彩蝶", "蝶"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "2": { text: "心理結構蛻變、靈魂美麗昇華", weight: 0.78 },
      "3": { text: "走出束縛 cocoon 邁向新生命階段", weight: 0.81 },
      "10": { text: "自性綻放原型、由沉重化為輕盈", weight: 0.76 }
    },
    source_ref: "2,3,10",
    notes: "動物原型"
  },
  {
    symbol: "魚／游魚",
    aliases: ["魚", "游魚", "金魚", "錦鯉", "大魚"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "2": { text: "潛意識深海靈感初現、豐沛心靈養分", weight: 0.77 },
      "3": { text: "基督魚原型、深海自性之源", weight: 0.81 },
      "10": { text: "無意識深處靈活生存的本能力量", weight: 0.75 }
    },
    source_ref: "2,3,10",
    notes: "動物原型"
  },
  {
    symbol: "烏龜／龜",
    aliases: ["烏龜", "龜", "海龜", "金錢龜", "老龜"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "漫長時間沉澱、固若金湯的心理防禦護盾", weight: 0.70 },
      "3": { text: "古老沉穩智慧、與大地同壽的耐心", weight: 0.78 },
      "19": { text: "玄武神獸文化、延年益壽與風水安穩", weight: 0.74 }
    },
    source_ref: "1,3,19",
    notes: "動物原型"
  },
  {
    symbol: "鯨魚／海豚",
    aliases: ["鯨魚", "海豚", "白鯨", "藍鯨", "虎鯨"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "3": { text: "大母神深海懷抱、集體無意識巨大引路者", weight: 0.82 },
      "10": { text: "超個人心靈溝通與深邃包容的智慧", weight: 0.79 },
      "16": { text: "深海中浮出水面呼吸的意識復甦過程", weight: 0.73 }
    },
    source_ref: "3,10,16",
    notes: "動物原型"
  },
  {
    symbol: "蜘蛛",
    aliases: ["蜘蛛", "蜘蛛網", "毒蜘蛛", "大蜘蛛"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "人際關係糾纏控制、難以擺脫的心理網羅", weight: 0.71 },
      "3": { text: "命運編織者、負面母神束縛原型", weight: 0.79 },
      "10": { text: "密閉空間中的隱密窺視與捕食恐慌", weight: 0.75 }
    },
    source_ref: "1,3,10",
    notes: "動物原型"
  },
  {
    symbol: "狐狸",
    aliases: ["狐狸", "白狐", "狐仙", "野狐"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "狡黠靈巧、逢凶化吉的自保策略", weight: 0.69 },
      "16": { text: "直覺變通與邊界試探的本能靈性", weight: 0.72 },
      "19": { text: "東方神怪文化中的魅惑與因緣業力投射", weight: 0.71 }
    },
    source_ref: "1,16,19",
    notes: "動物原型"
  },
  {
    symbol: "牛",
    aliases: ["牛", "黃牛", "水牛", "公牛", "耕牛"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "1": { text: "默默耕耘、勤奮奉獻、承載厚重負擔", weight: 0.71 },
      "16": { text: "被壓抑的頑固脾氣與強大耐力", weight: 0.70 },
      "19": { text: "農耕文明中深層接地氣的安心依靠", weight: 0.73 }
    },
    source_ref: "1,16,19",
    notes: "動物原型"
  },
  {
    symbol: "鳳凰",
    aliases: ["鳳凰", "不死鳥", "朱雀"],
    tags: ["動物原型"],
    tag_ids: [2],
    book_interpret: {
      "3": { text: "極致自性化象徵、浴火重生的心靈涅槃", weight: 0.84 },
      "10": { text: "自性自體圓滿、超越創傷痛苦的精神頂點", weight: 0.82 },
      "19": { text: "中華文化中高貴、和諧與圓滿吉祥印記", weight: 0.79 }
    },
    source_ref: "3,10,19",
    notes: "動物原型"
  },

  // 4. 香港本土場景與文化物象
  {
    symbol: "神枱／神案",
    aliases: ["神台", "神案", "神枱", "神龕", "神位", "拜神", "香案", "祖先位", "拜拜"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "家族傳承期許、孝道道德監管、神聖庇護", weight: 0.75 },
      "10": { text: "超我對個人意志的注視、代際罪疚與歸屬", weight: 0.78 },
      "19": { text: "嶺南與港式民間信仰中心、內在尋求精神安定", weight: 0.76 }
    },
    source_ref: "1,10,19",
    notes: "香港本土場景"
  },
  {
    symbol: "舊居／祖屋／唐樓",
    aliases: ["舊居", "祖屋", "老屋", "老家", "唐樓", "故居", "老房子", "童年舊居"],
    tags: ["香港本土場景", "建築場景"],
    tag_ids: [9, 3],
    book_interpret: {
      "1": { text: "童年原生家庭回憶、難以磨滅的根基情感", weight: 0.75 },
      "2": { text: "舊有人格框架架構、未解的情感結案", weight: 0.78 },
      "20": { text: "高頻成人回溯場景、面對過往創傷的起點", weight: 0.74 }
    },
    source_ref: "1,2,20",
    notes: "香港本土場景"
  },
  {
    symbol: "公屋長廊／公共屋邨",
    aliases: ["公屋長廊", "公共屋邨", "屋邨", "屋村", "公屋", "長廊", "走廊", "長走廊", "邨屋"],
    tags: ["香港本土場景", "建築場景"],
    tag_ids: [9, 3],
    book_interpret: {
      "1": { text: "高密度都市人際擠壓、邊界失防壓迫感", weight: 0.74 },
      "8": { text: "集體生活安全感與私人隱私被窺視的矛盾", weight: 0.72 },
      "20": { text: "狹長通道奔逃噩夢高發地、急欲擺脫注視", weight: 0.75 }
    },
    source_ref: "1,8,20",
    notes: "香港本土場景"
  },
  {
    symbol: "叮叮車／電車",
    aliases: ["叮叮車", "香港電車", "電車", "叮叮", "港島電車"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "慢節奏生活反思、快節奏生活中的懷舊沉澱", weight: 0.72 },
      "7": { text: "沿既定軌道行駛的心靈確定性與安全感", weight: 0.70 },
      "15": { text: "穿梭時空市井記憶、沉澱繁雜心緒的避難所", weight: 0.71 }
    },
    source_ref: "1,7,15",
    notes: "香港本土場景"
  },
  {
    symbol: "天星小輪／渡輪",
    aliases: ["天星小輪", "渡輪", "小輪", "輪渡", "維港小輪"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "人生兩岸過渡擺渡、短暫航行的喘息時光", weight: 0.73 },
      "7": { text: "心靈過渡期、暫時跳脫喧囂岸上的抽離視角", weight: 0.72 },
      "15": { text: "浪漫記憶與告別舊旅途的情感儀式感", weight: 0.70 }
    },
    source_ref: "1,7,15",
    notes: "香港本土場景"
  },
  {
    symbol: "茶餐廳／冰室",
    aliases: ["茶餐廳", "冰室", "港式茶餐廳", "大排檔", "茶記"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "市井煙火氣充電站、接地氣的溫暖日常", weight: 0.71 },
      "8": { text: "世俗生活的歸屬感、在忙碌喧鬧中尋求慰藉", weight: 0.72 },
      "15": { text: "人情味連結、平凡生活的安穩錨點", weight: 0.69 }
    },
    source_ref: "1,8,15",
    notes: "香港本土場景"
  },
  {
    symbol: "維多利亞港／維港",
    aliases: ["維多利亞港", "維港", "香港海港", "海傍", "港灣"],
    tags: ["香港本土場景", "建築場景"],
    tag_ids: [9, 3],
    book_interpret: {
      "1": { text: "繁華景致與內心漂泊孤獨的鮮明對照", weight: 0.72 },
      "3": { text: "開闊視野心靈容器、眺望遠方彼岸的渴望", weight: 0.78 },
      "8": { text: "城市集體身分認同與時代變遷的心潮起伏", weight: 0.73 }
    },
    source_ref: "1,3,8",
    notes: "香港本土場景"
  },
  {
    symbol: "霓虹燈招牌",
    aliases: ["霓虹燈招牌", "霓虹燈", "招牌", "招牌燈"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "流光溢彩的集體鄉愁、往日繁盛的幻影", weight: 0.71 },
      "8": { text: "都市慾望流動與光影下的真實自我隱藏", weight: 0.73 },
      "16": { text: "時代更迭落幕的感傷、對消失時光的留戀", weight: 0.70 }
    },
    source_ref: "1,8,16",
    notes: "香港本土場景"
  },
  {
    symbol: "旺角金魚街",
    aliases: ["旺角金魚街", "金魚街", "金魚袋", "旺角"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "裝在透明塑膠袋裡的脆弱生命力、狹縫生存", weight: 0.73 },
      "7": { text: "被觀看與商品化的人格特質、渴望解脫", weight: 0.72 },
      "8": { text: "在擁擠城市中對靈動生機的深切期盼", weight: 0.71 }
    },
    source_ref: "1,7,8",
    notes: "香港本土場景"
  },
  {
    symbol: "黃大仙／廟宇求籤",
    aliases: ["黃大仙", "黃大仙廟", "廟宇", "求籤", "解籤", "拜神", "籤文"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "面對命運不確定性的焦慮交託、尋求啟示", weight: 0.74 },
      "10": { text: "向神聖原型尋求指引、排解前途未知恐慌", weight: 0.78 },
      "19": { text: "傳統民間慰藉、將無助轉化為行動希望", weight: 0.75 }
    },
    source_ref: "1,10,19",
    notes: "香港本土場景"
  },
  {
    symbol: "燒衣／冥鏹祭拜",
    aliases: ["燒衣", "冥鏹", "紙錢", "冥幣", "燒紙", "化寶", "盂蘭", "鬼節祭拜"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "對逝去親友的深層哀傷與內疚彌補", weight: 0.75 },
      "10": { text: "陰影和解儀式、心理斷捨離與祝福放手", weight: 0.78 },
      "19": { text: "生死界限跨越、撫慰未竟之願的安魂儀軌", weight: 0.76 }
    },
    source_ref: "1,10,19",
    notes: "香港本土場景"
  },
  {
    symbol: "紙紮",
    aliases: ["紙紮", "紙紮祭品", "紙紮人", "冥界紙紮"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "虛實邊界的幻覺體驗、死亡焦慮的具象化", weight: 0.73 },
      "4": { text: "替身補償心理、將無力承受之物外化成型", weight: 0.70 },
      "19": { text: "幽明兩隔的代償心態、敬畏與忌憚交織", weight: 0.74 }
    },
    source_ref: "1,4,19",
    notes: "香港本土場景"
  },
  {
    symbol: "麻雀／打麻雀",
    aliases: ["麻雀", "打麻雀", "麻將", "打麻將", "雀局", "十三幺", "食糊"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "生活失控下的掌控慾重奪、機率與命運搏擊", weight: 0.72 },
      "8": { text: "人情世故算計、博弈壓力與社交娛樂假面", weight: 0.73 },
      "19": { text: "風水輪流轉的無常觀、期待轉運心態", weight: 0.71 }
    },
    source_ref: "1,8,19",
    notes: "香港本土場景"
  },
  {
    symbol: "竹棚／搭棚",
    aliases: ["搭棚", "竹棚", "高空搭棚", "建築棚架", "杉木架"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "高空懸危中的堅韌生命力、靈活生存智慧", weight: 0.74 },
      "7": { text: "暫時性心理支撐、在動盪不穩中負重前行", weight: 0.72 },
      "20": { text: "高空墜落恐懼與對脆弱支撐的信賴焦慮", weight: 0.75 }
    },
    source_ref: "1,7,20",
    notes: "香港本土場景"
  },
  {
    symbol: "劏房／棺材房",
    aliases: ["劏房", "棺材房", "籠屋", "隔斷房", "蝸居", "窄房"],
    tags: ["香港本土場景", "建築場景"],
    tag_ids: [9, 3],
    book_interpret: {
      "1": { text: "心靈空間極限壓迫、生存焦慮與尊嚴考驗", weight: 0.75 },
      "8": { text: "喘不過氣的窒息感、渴望突破困局的強烈呼號", weight: 0.74 },
      "20": { text: "密閉空間恐懼與生活無奈感的核心象徵", weight: 0.76 }
    },
    source_ref: "1,8,20",
    notes: "香港本土場景"
  },
  {
    symbol: "回南天／潮濕牆壁",
    aliases: ["回南天", "潮濕", "牆壁發霉", "濕氣", "滲水", "發霉"],
    tags: ["香港本土場景"],
    tag_ids: [9],
    book_interpret: {
      "1": { text: "揮之不去的黏稠鬱悶、未被清理的情緒濕毒", weight: 0.72 },
      "7": { text: "生活邊界被外界水汽滲透侵蝕的無力感", weight: 0.71 },
      "22": { text: "身心疲憊與環境重擔壓迫的身心生理反應", weight: 0.73 }
    },
    source_ref: "1,7,22",
    notes: "香港本土場景"
  },

  // 5. 建築與場景
  {
    symbol: "圖書館",
    aliases: ["圖書室", "藏書閣"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "內心知識、記憶集合與智慧尋求", weight: 0.70 },
      "2": { text: "集體記憶庫", weight: 0.70 },
      "3": { text: "集體潛意識知識之海", weight: 0.77 }
    },
    source_ref: "1,2,3",
    notes: "建築場景"
  },
  {
    symbol: "港口",
    aliases: ["碼頭", "港灣"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "人生重大轉折與啟航過渡", weight: 0.70 },
      "7": { text: "過渡場域與心靈驛站", weight: 0.68 },
      "15": { text: "生命階段交界、揚帆或泊岸", weight: 0.67 }
    },
    source_ref: "1,7,15",
    notes: "建築場景"
  },
  {
    symbol: "旅館／酒店",
    aliases: ["酒店", "賓館", "飯店", "客棧"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "過渡階段、無常居所", weight: 0.70 },
      "2": { text: "暫時人格狀態、未安定生活", weight: 0.73 },
      "6": { text: "非永久空間與身份遊移", weight: 0.71 }
    },
    source_ref: "1,2,6",
    notes: "建築場景"
  },
  {
    symbol: "墳墓",
    aliases: ["墳", "墓穴", "墳頭", "墓地", "墓碑"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "舊自我徹底結束、心靈埋葬", weight: 0.70 },
      "3": { text: "死亡-重生原型循環", weight: 0.80 },
      "10": { text: "舊人格死寂以迎接嶄新個體化", weight: 0.78 }
    },
    source_ref: "1,3,10",
    notes: "建築場景"
  },
  {
    symbol: "森林",
    aliases: ["樹林", "山林", "密林"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "潛意識幽深探索、未知冒險", weight: 0.70 },
      "3": { text: "集體潛意識廣袤領域", weight: 0.80 },
      "10": { text: "本能野性與迷宮試煉場域", weight: 0.79 }
    },
    source_ref: "1,3,10",
    notes: "建築場景"
  },
  {
    symbol: "學校",
    aliases: ["學堂", "校園", "教室", "課室"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "人生重要課題、被審視與評價焦慮", weight: 0.70 },
      "5": { text: "成年人高頻壓力回溯夢場景", weight: 0.40 },
      "20": { text: "考核與自我價值認同試煉", weight: 0.65 }
    },
    source_ref: "1,5,20",
    notes: "建築場景"
  },
  {
    symbol: "橋",
    aliases: ["橋樑", "天橋", "跨海大橋"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "重大生活狀態過渡、連通兩端", weight: 0.70 },
      "2": { text: "心理邊界與內外整合連接", weight: 0.74 },
      "3": { text: "跨越內在鴻溝與抉擇關頭", weight: 0.75 }
    },
    source_ref: "1,2,3",
    notes: "建築場景"
  },
  {
    symbol: "家／房屋",
    aliases: ["房子", "大屋", "居所", "屋企", "房間", "臥室"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "內在自我結構、心靈避風港", weight: 0.80 },
      "2": { text: "心靈空間結構、各房間代表不同心理層次", weight: 0.80 },
      "3": { text: "房屋即心靈自我（Self）的整體映射", weight: 0.82 }
    },
    source_ref: "1,2,3",
    notes: "建築場景"
  },
  {
    symbol: "洞穴",
    aliases: ["山洞", "穴位", "地洞", "石洞"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "退入深層潛意識尋求避難", weight: 0.70 },
      "3": { text: "母性潛意識回歸與孵化之地", weight: 0.70 },
      "10": { text: "大母神子宮原型空間、涅槃轉折點", weight: 0.75 }
    },
    source_ref: "1,3,10",
    notes: "建築場景"
  },
  {
    symbol: "山",
    aliases: ["高山", "崇山", "峰頂", "山脈"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "宏遠目標、精神攀登的高度挑戰", weight: 0.70 },
      "3": { text: "超越精神境界與艱辛考驗", weight: 0.77 },
      "10": { text: "攀登英雄之旅原型、站在巔峰視界", weight: 0.76 }
    },
    source_ref: "1,3,10",
    notes: "建築場景"
  },
  {
    symbol: "地下室",
    aliases: ["地庫", "藏寶室", "地下藏室"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "被壓抑記憶、未曾正視的往事", weight: 0.70 },
      "2": { text: "最深層無意識陰影藏匿處", weight: 0.70 },
      "4": { text: "本我衝動與不可告人之願", weight: 0.58 }
    },
    source_ref: "1,2,4",
    notes: "建築場景"
  },
  {
    symbol: "天台",
    aliases: ["屋頂", "樓頂", "頂樓"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "開闊理智視野、脫離日常局限", weight: 0.70 },
      "2": { text: "意識頂層與仰望星空邊界", weight: 0.73 },
      "3": { text: "俯瞰人生格局的大局觀", weight: 0.74 }
    },
    source_ref: "1,2,3",
    notes: "建築場景"
  },
  {
    symbol: "監獄",
    aliases: ["牢獄", "牢房", "看守所", "鐵籠"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "自我設限、道德或情感的無形囚禁", weight: 0.70 },
      "6": { text: "內在束縛感與行動自由被剝奪", weight: 0.72 },
      "15": { text: "分辨外界壓迫或自加枷鎖的契機", weight: 0.68 }
    },
    source_ref: "1,6,15",
    notes: "建築場景"
  },
  {
    symbol: "醫院",
    aliases: ["病院", "診所", "急症室", "病房"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "身心修復需求、療癒與被照料渴望", weight: 0.70 },
      "7": { text: "心理創傷的急救與脆弱修補", weight: 0.68 },
      "22": { text: "心身疲憊創傷中的安全避護所", weight: 0.44 }
    },
    source_ref: "1,7,22",
    notes: "建築場景"
  },
  {
    symbol: "沙漠",
    aliases: ["荒漠", "戈壁", "沙丘"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "孤獨枯竭、缺乏情感滋潤的荒涼感", weight: 0.70 },
      "3": { text: "心靈荒漠之試煉、尋求甘霖之行", weight: 0.74 },
      "10": { text: "乾涸考驗原型、激發最頑強求生意志", weight: 0.73 }
    },
    source_ref: "1,3,10",
    notes: "建築場景"
  },
  {
    symbol: "海洋",
    aliases: ["大海", "海", "汪洋", "大洋", "深海"],
    tags: ["建築場景", "自然物象"],
    tag_ids: [3, 8],
    book_interpret: {
      "1": { text: "浩瀚集體潛意識、無邊情感洪流", weight: 0.70 },
      "3": { text: "水原型、孕育萬物的大母體", weight: 0.80 },
      "10": { text: "深不可測的深層心理能量儲備庫", weight: 0.79 }
    },
    source_ref: "1,3,10",
    notes: "建築場景"
  },
  {
    symbol: "河流",
    aliases: ["溪水", "河", "溪流", "江河", "河道"],
    tags: ["建築場景", "自然物象"],
    tag_ids: [3, 8],
    book_interpret: {
      "1": { text: "生命自然流動、心境順勢而為", weight: 0.70 },
      "2": { text: "流動的心靈能量（Libido）引導", weight: 0.74 },
      "3": { text: "情感流動順暢與否的晴雨表", weight: 0.75 }
    },
    source_ref: "1,2,3",
    notes: "建築場景"
  },
  {
    symbol: "超市",
    aliases: ["商場", "超級市場", "百貨公司"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "生活豐富選擇、慾望與滿足對比", weight: 0.70 },
      "5": { text: "尋找生活補給品、自我價值評價", weight: 0.65 },
      "15": { text: "社會消費主義下的內心匱乏與填補", weight: 0.67 }
    },
    source_ref: "1,5,15",
    notes: "建築場景"
  },
  {
    symbol: "車站",
    aliases: ["火車站", "地鐵站", "巴士站", "月台"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "人生旅程過渡、等待與出發抉擇", weight: 0.70 },
      "7": { text: "錯過班次焦慮、時間節奏掌控挑戰", weight: 0.68 },
      "15": { text: "邁向下一站的人生起點", weight: 0.67 }
    },
    source_ref: "1,7,15",
    notes: "建築場景"
  },
  {
    symbol: "教堂",
    aliases: ["寺廟", "聖堂", "禮拜堂"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "崇高敬畏、心靈救贖與沉思庇護", weight: 0.70 },
      "3": { text: "神聖原型、尋求超越現世的安寧", weight: 0.78 },
      "16": { text: "道德審查與內在良知對話場域", weight: 0.72 }
    },
    source_ref: "1,3,16",
    notes: "建築場景"
  },
  {
    symbol: "電梯／升降機",
    aliases: ["電梯", "升降機", "搭電梯", "電梯失控", "電梯墜落"],
    tags: ["建築場景", "噩夢危機"],
    tag_ids: [3, 6],
    book_interpret: {
      "1": { text: "社會階層升沉焦慮、失重恐慌", weight: 0.74 },
      "20": { text: "極高頻都市焦慮夢、控制權被機械剝奪", weight: 0.76 },
      "22": { text: "身體前庭失重感與自律神經緊張反應", weight: 0.71 }
    },
    source_ref: "1,20,22",
    notes: "建築場景"
  },
  {
    symbol: "迷宮",
    aliases: ["迷宮", "迷道", "死胡同", "走不出的房間"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "2": { text: "內在追尋自性中心的複雜心靈旅途", weight: 0.77 },
      "3": { text: "考驗意志與辨識力的英雄困局", weight: 0.80 },
      "21": { text: "面對心靈米諾陶洛斯（陰影）的試煉", weight: 0.75 }
    },
    source_ref: "2,3,21",
    notes: "建築場景"
  },
  {
    symbol: "浴室／洗手間",
    aliases: ["洗手間", "衛生間", "廁所", "沖涼房", "浴室", "浴缸"],
    tags: ["建築場景"],
    tag_ids: [3],
    book_interpret: {
      "1": { text: "心理排毒、清理內疚羞恥與負面雜念", weight: 0.74 },
      "4": { text: "本能排泄與私密界限被窺視的不安", weight: 0.72 },
      "7": { text: "卸下面具、回歸純淨肉身真我", weight: 0.73 }
    },
    source_ref: "1,4,7",
    notes: "建築場景"
  },

  // 6. 物件與道具
  {
    symbol: "鑰匙",
    aliases: ["金鑰匙", "門匙", "鑰匙扣"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "解決困境之關鍵、解密意識之門", weight: 0.70 },
      "3": { text: "啟蒙之鑰、打開心靈全新邊界", weight: 0.80 },
      "4": { text: "權力掌控與打開禁錮慾望之工具", weight: 0.60 }
    },
    source_ref: "1,3,4",
    notes: "物件道具"
  },
  {
    symbol: "鏡子",
    aliases: ["梳妝鏡", "照鏡", "碎鏡", "鏡面"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "自我審視、照見真實內心", weight: 0.70 },
      "2": { text: "自我認知（Ego）與面具（Persona）的對話", weight: 0.74 },
      "6": { text: "鏡中映照出未被察覺的陰影面向", weight: 0.73 }
    },
    source_ref: "1,2,6",
    notes: "物件道具"
  },
  {
    symbol: "船",
    aliases: ["小船", "巨輪", "帆船", "木船"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "心靈航行容器、渡過情緒風浪", weight: 0.70 },
      "3": { text: "穿越無意識汪洋的堅固載體", weight: 0.77 },
      "16": { text: "生命的漂浮旅程與命運方向盤", weight: 0.72 }
    },
    source_ref: "1,3,16",
    notes: "物件道具"
  },
  {
    symbol: "燈籠／燈",
    aliases: ["燈籠", "燈", "檯燈", "手電筒", "蠟燭"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "黑暗中的意識光芒、照亮迷途", weight: 0.70 },
      "3": { text: "精神真理與希望火種", weight: 0.76 },
      "10": { text: "智慧老人手中提引的覺察之燈", weight: 0.75 }
    },
    source_ref: "1,3,10",
    notes: "物件道具"
  },
  {
    symbol: "衣服",
    aliases: ["衣物", "衫", "服裝", "外套", "裙子", "換衣服"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "社會角色打扮、對外形象", weight: 0.70 },
      "3": { text: "人格面具（Persona）的具體化體現", weight: 0.79 },
      "4": { text: "掩飾真實本能慾望的偽裝外衣", weight: 0.65 }
    },
    source_ref: "1,3,4",
    notes: "物件道具"
  },
  {
    symbol: "寶石",
    aliases: ["鑽石", "玉石", "水晶", "翡翠", "寶物"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "2": { text: "歷經高壓磨礪而成的自性（Self）結晶", weight: 0.78 },
      "3": { text: "不可動搖的最高心靈價值與珍貴特質", weight: 0.82 },
      "10": { text: "純淨發光的自性原型", weight: 0.77 }
    },
    source_ref: "2,3,10",
    notes: "物件道具"
  },
  {
    symbol: "錢／金錢",
    aliases: ["錢", "金錢", "鈔票", "硬幣", "財富", "銀紙"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "自我價值認同、現實生存安全資本", weight: 0.70 },
      "4": { text: "心理能量交換載體、自尊匱乏補償", weight: 0.68 },
      "8": { text: "生活掌控感與得失焦慮的具體投射", weight: 0.71 }
    },
    source_ref: "1,4,8",
    notes: "物件道具"
  },
  {
    symbol: "門",
    aliases: ["大門", "房門", "木門", "鐵門", "門鎖"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "心理界限防線、轉換機遇通道", weight: 0.70 },
      "2": { text: "意識與無意識世界的過渡關口", weight: 0.75 },
      "3": { text: "打開心靈新維度的契機或緊閉設防", weight: 0.77 }
    },
    source_ref: "1,2,3",
    notes: "物件道具"
  },
  {
    symbol: "鐘錶／時鐘",
    aliases: ["時鐘", "鬧鐘", "手錶", "鐘", "時鐘倒數"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "時間壓迫感、生命歲月流逝焦慮", weight: 0.70 },
      "5": { text: "錯失良機的緊迫逼迫感", weight: 0.67 },
      "20": { text: "生活步調失調引發的焦慮鬧鈴", weight: 0.71 }
    },
    source_ref: "1,5,20",
    notes: "物件道具"
  },
  {
    symbol: "武器",
    aliases: ["兵刃", "軍火", "刀劍", "防身物", "槍支"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "反擊自衛機制、被壓抑的攻擊原動力", weight: 0.70 },
      "4": { text: "本能破壞衝動與自我保護武裝", weight: 0.68 },
      "6": { text: "直面內心陰影威脅時的抗衡力量", weight: 0.73 }
    },
    source_ref: "1,4,6",
    notes: "物件道具"
  },
  {
    symbol: "書本",
    aliases: ["書", "典籍", "日記", "筆記"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "人生閱歷與知識尋求、解答未知疑惑", weight: 0.70 },
      "2": { text: "生命歷史的銘刻記錄、自我回顧", weight: 0.72 },
      "8": { text: "精神權威指引與追尋真理象徵", weight: 0.71 }
    },
    source_ref: "1,2,8",
    notes: "物件道具"
  },
  {
    symbol: "車輛",
    aliases: ["汽車", "私家車", "巴士", "的士", "車"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "人生前進載體、生活軌跡控制感", weight: 0.70 },
      "2": { text: "自我主控力與前進動能平衡", weight: 0.74 },
      "7": { text: "煞車失靈或失控反映的生活超載狀態", weight: 0.72 }
    },
    source_ref: "1,2,7",
    notes: "物件道具"
  },
  {
    symbol: "梯子",
    aliases: ["樓梯", "階梯", "梯級", "木梯", "旋轉樓梯"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "人生進階與意識層次攀升", weight: 0.70 },
      "2": { text: "無意識向意識轉化（或反向）的通道", weight: 0.75 },
      "3": { text: "步步為營的心靈成長考驗", weight: 0.76 }
    },
    source_ref: "1,2,3",
    notes: "物件道具"
  },
  {
    symbol: "窗",
    aliases: ["窗戶", "窗框", "落地窗", "窗子", "窗台"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "向外界窺探的視窗、渴望連結的通道", weight: 0.70 },
      "2": { text: "心靈透光的縫隙、獲取全新視野", weight: 0.72 },
      "3": { text: "內在世界與客觀現實的互動屏障", weight: 0.74 }
    },
    source_ref: "1,2,3",
    notes: "物件道具"
  },
  {
    symbol: "鎖",
    aliases: ["門鎖", "銅鎖", "密碼鎖", "鎖頭", "鎖鏈"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "情感封閉、拒絕敞開心扉的自我保護", weight: 0.70 },
      "4": { text: "嚴密壓抑本我慾望的防禦機制", weight: 0.68 },
      "6": { text: "被鎖在暗處的心靈創傷與祕密", weight: 0.72 }
    },
    source_ref: "1,4,6",
    notes: "物件道具"
  },
  {
    symbol: "劍",
    aliases: ["寶劍", "利劍", "長劍"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "2": { text: "鋒利理智與果斷辨析力、斬斷猶豫情絲", weight: 0.76 },
      "3": { text: "英雄屠龍的意志武器、正義力量", weight: 0.81 },
      "10": { text: "決斷力原型、劃清心理邊界的利器", weight: 0.77 }
    },
    source_ref: "2,3,10",
    notes: "物件道具"
  },
  {
    symbol: "花朵",
    aliases: ["花", "鮮花", "玫瑰", "蓮花", "荷花", "花開"],
    tags: ["物件道具", "自然物象"],
    tag_ids: [7, 8],
    book_interpret: {
      "1": { text: "生命綻放的美好、純真愛意萌芽", weight: 0.70 },
      "3": { text: "曼陀羅中心盛開、心靈圓滿象徵", weight: 0.81 },
      "10": { text: "自性美麗綻放與脆弱生命力的循環", weight: 0.77 }
    },
    source_ref: "1,3,10",
    notes: "物件道具"
  },
  {
    symbol: "種子",
    aliases: ["種子", "樹種", "種芽", "胚芽"],
    tags: ["物件道具", "自然物象"],
    tag_ids: [7, 8],
    book_interpret: {
      "2": { text: "心靈潛能萌芽、蘊含整座森林的自性", weight: 0.77 },
      "3": { text: "等待適合土壤孕育的全新希望", weight: 0.81 },
      "10": { text: "生命起源原型、深埋泥土中的生命力", weight: 0.76 }
    },
    source_ref: "2,3,10",
    notes: "物件道具"
  },
  {
    symbol: "面具",
    aliases: ["面具", "面罩", "假面", "人皮面具", "假臉"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "2": { text: "適應社會要求的人格面具（Persona）", weight: 0.79 },
      "3": { text: "遮蔽脆弱真實自我的防禦外殼", weight: 0.81 },
      "10": { text: "害怕真實自我被看穿的深刻焦慮", weight: 0.76 }
    },
    source_ref: "2,3,10",
    notes: "物件道具"
  },
  {
    symbol: "棺材",
    aliases: ["棺木", "靈柩", "棺槨"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "對過去生活模式的徹底封存與告別", weight: 0.70 },
      "3": { text: "死亡-重生儀式、舊我埋葬迎接新生", weight: 0.80 },
      "10": { text: "心理終結原型、不可逆的轉折點", weight: 0.78 }
    },
    source_ref: "1,3,10",
    notes: "物件道具"
  },
  {
    symbol: "電話／手機",
    aliases: ["手機", "電話", "智能手機", "打電話", "屏幕", "短訊"],
    tags: ["物件道具"],
    tag_ids: [7],
    book_interpret: {
      "1": { text: "溝通渴望與失聯焦慮、外界認可需求", weight: 0.72 },
      "5": { text: "資訊超載帶來的精神緊繃與打擾不安", weight: 0.69 },
      "15": { text: "現代人際邊界脆弱與渴望即時回應的心理投射", weight: 0.71 }
    },
    source_ref: "1,5,15",
    notes: "物件道具"
  },
  {
    symbol: "丟失錢包／丟失手機",
    aliases: ["丟手機", "丟錢包", "丟失證件", "遺失", "不見了手機", "不見了錢包"],
    tags: ["物件道具", "噩夢危機"],
    tag_ids: [7, 6],
    book_interpret: {
      "1": { text: "生活掌控感剝離、自我身份認同危機", weight: 0.74 },
      "4": { text: "焦慮遺失珍貴自尊、無法自立的深層恐慌", weight: 0.71 },
      "20": { text: "現代人常見的核心安全感喪失噩夢主題", weight: 0.75 }
    },
    source_ref: "1,4,20",
    notes: "物件道具"
  },

  // 7. 身體部位與生理感覺
  {
    symbol: "眼睛",
    aliases: ["雙眼", "目光", "眼球", "盲眼", "睜開眼"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "自我洞察之窗、覺察真相的清醒意志", weight: 0.70 },
      "3": { text: "心靈之靈光、被注視審判的焦慮", weight: 0.79 },
      "4": { text: "窺探慾望與看穿偽裝的直覺能力", weight: 0.68 }
    },
    source_ref: "1,3,4",
    notes: "身體原型"
  },
  {
    symbol: "心臟",
    aliases: ["心臟", "胸膛", "心跳", "劇烈心跳", "心痛"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "最真實情感核心、生命跳動的原動力", weight: 0.70 },
      "3": { text: "真誠之源、愛與熱忱的最高本質", weight: 0.80 },
      "22": { text: "自律神經與心身健康警示反應", weight: 0.72 }
    },
    source_ref: "1,3,22",
    notes: "身體原型"
  },
  {
    symbol: "牙齒",
    aliases: ["牙齒", "牙齒脫落", "掉牙", "落牙", "牙痛", "蛀牙", "門牙", "碎牙"],
    tags: ["身體原型", "噩夢危機"],
    tag_ids: [4, 6],
    book_interpret: {
      "1": { text: "成長與衰老焦慮、控制感剝奪、言語悔恨", weight: 0.72 },
      "4": { text: "去勢焦慮與攻擊力量被削弱的恐慌", weight: 0.68 },
      "20": { text: "全球高頻噩夢、深層尊嚴與形象受損焦慮", weight: 0.77 }
    },
    source_ref: "1,4,20",
    notes: "身體原型"
  },
  {
    symbol: "皮膚",
    aliases: ["皮膚", "表皮", "傷痕", "疹子", "敏感"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "自我與外界的第一道防禦邊界", weight: 0.70 },
      "7": { text: "人際接觸的敏感度與被侵犯的不適感", weight: 0.73 },
      "22": { text: "心身壓力引發的生理邊界敏感警號", weight: 0.71 }
    },
    source_ref: "1,7,22",
    notes: "身體原型"
  },
  {
    symbol: "頭",
    aliases: ["腦袋", "頭部", "頭顱", "思想"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "理智控制中樞、過度思慮的疲憊負擔", weight: 0.70 },
      "4": { text: "意識自我（Ego）至高意志的體現", weight: 0.69 },
      "5": { text: "理性與感性拉鋸引發的頭部緊繃", weight: 0.67 }
    },
    source_ref: "1,4,5",
    notes: "身體原型"
  },
  {
    symbol: "手",
    aliases: ["手掌", "手指", "雙手", "握手", "拳頭", "抓取"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "行動實踐力、人際連結與給予照料", weight: 0.70 },
      "7": { text: "掌控環境的能力、握緊或放手的抉擇", weight: 0.72 },
      "10": { text: "創造與構建命運的原型工具", weight: 0.74 }
    },
    source_ref: "1,7,10",
    notes: "身體原型"
  },
  {
    symbol: "腳",
    aliases: ["雙腳", "赤腳", "腳掌", "無法邁步", "腳步"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "立足大地之根基、前進道路的踏實度", weight: 0.70 },
      "7": { text: "赤腳無鞋反映的心靈無防備與現實缺乏保障", weight: 0.73 },
      "10": { text: "扎根現實與邁向未來的生命步態", weight: 0.74 }
    },
    source_ref: "1,7,10",
    notes: "身體原型"
  },
  {
    symbol: "血",
    aliases: ["鮮血", "流血", "血液", "血跡", "吐血"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "最寶貴生命能量的損耗或熱情爆發", weight: 0.70 },
      "4": { text: "心靈受創傷、無法遮掩的痛楚付出", weight: 0.69 },
      "9": { text: "創傷體驗再現與生命能量的呼救信號", weight: 0.73 }
    },
    source_ref: "1,4,9",
    notes: "身體原型"
  },
  {
    symbol: "骨頭",
    aliases: ["白骨", "骸骨", "骨骼", "肋骨", "斷骨"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "人格核心支撐架構、不可瓦解的原則底線", weight: 0.70 },
      "3": { text: "剝除一切虛偽偽裝後的生命本質真理", weight: 0.78 },
      "10": { text: "即使肉身消逝依然長存的心靈印記", weight: 0.76 }
    },
    source_ref: "1,3,10",
    notes: "身體原型"
  },
  {
    symbol: "頭髮",
    aliases: ["長髮", "短髮", "剪頭髮", "掉頭髮", "脫髮", "梳頭"],
    tags: ["身體原型"],
    tag_ids: [4],
    book_interpret: {
      "1": { text: "個人魅力、思緒牽絆與三千煩惱絲", weight: 0.70 },
      "4": { text: "生命力量象徵與剪髮帶來的脫胎換骨感", weight: 0.68 },
      "19": { text: "華人文化中精氣神外顯與告別往事的決心", weight: 0.71 }
    },
    source_ref: "1,4,19",
    notes: "身體原型"
  },

  // 8. 動作與情境
  {
    symbol: "追逐",
    aliases: ["被追", "逃跑", "狂奔逃命", "追趕", "逃脫"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "逃避現實沉重焦慮、未正視的陰影步步進逼", weight: 0.72 },
      "4": { text: "本能願望受超我審查追逼的具象化恐懼", weight: 0.70 },
      "6": { text: "被追趕者實為自己未整合的陰影投射", weight: 0.78 }
    },
    source_ref: "1,4,6",
    notes: "動作情境"
  },
  {
    symbol: "尋找東西",
    aliases: ["找東西", "找尋", "丟失尋找", "找路", "翻找"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "追尋失落的自我拼圖、精神價值重拾", weight: 0.70 },
      "5": { text: "對生活中某項未達成目標的焦慮執念", weight: 0.68 },
      "8": { text: "探索潛意識深處迷失的初心與靈感", weight: 0.72 }
    },
    source_ref: "1,5,8",
    notes: "動作情境"
  },
  {
    symbol: "溺水",
    aliases: ["溺水", "浸水", "沉入水中", "快要淹死", "沉沒", "淹水"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "情緒洪流排山倒海、失去主控權的窒息感", weight: 0.73 },
      "3": { text: "被潛意識母體汪洋吞噬的恐慌危機", weight: 0.80 },
      "20": { text: "極高頻情緒過載噩夢、急需浮出水面呼吸", weight: 0.77 }
    },
    source_ref: "1,3,20",
    notes: "動作情境"
  },
  {
    symbol: "墜落",
    aliases: ["墜落", "高處跌落", "跌落", "懸崖掉下", "失足", "掉下去"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "失去安全支撐、期待落空、失控恐懼", weight: 0.72 },
      "17": { text: "入睡期前庭神經肌肉抽搐引發的生理夢境", weight: 0.68 },
      "20": { text: "失去地面著力點的心靈墜地危機", weight: 0.76 }
    },
    source_ref: "1,17,20",
    notes: "動作情境"
  },
  {
    symbol: "考試／答不出題",
    aliases: ["考試", "答不出", "遲到考試", "做試卷", "考場", "答卷"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "社會評價焦慮、完美主義苛責自我的縮影", weight: 0.72 },
      "5": { text: "人生重要關卡前夜的自我能力懷疑與演練", weight: 0.69 },
      "20": { text: "成年人長久難以釋懷的求學時期審判情結", weight: 0.77 }
    },
    source_ref: "1,5,20",
    notes: "動作情境"
  },
  {
    symbol: "遲到",
    aliases: ["遲到", "趕不及", "錯過班車", "錯過飛機", "趕不上", "誤機"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "錯失良機恐懼、生活節奏失控的自責感", weight: 0.70 },
      "5": { text: "潛意識對某項承諾的真實抗拒與逃避", weight: 0.68 },
      "20": { text: "緊迫時間壓力下的心理警鐘鳴響", weight: 0.73 }
    },
    source_ref: "1,5,20",
    notes: "動作情境"
  },
  {
    symbol: "飛翔",
    aliases: ["飛翔", "飛", "升空", "凌空飛行", "飛起", "翱翔"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "擺脫現世沉重枷鎖、追求絕對心靈自由", weight: 0.72 },
      "2": { text: "精神自我超越與自性向上伸展之翼", weight: 0.78 },
      "3": { text: "飛翔伴隨的過度膨脹警示（伊卡洛斯警鐘）", weight: 0.77 }
    },
    source_ref: "1,2,3",
    notes: "動作情境"
  },
  {
    symbol: "躲藏",
    aliases: ["躲藏", "藏起來", "匿藏", "躲避", "匿埋", "藏身"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "害怕受傷被批判、尋求安全的避風防線", weight: 0.70 },
      "4": { text: "壓抑不可告人之秘密或脆弱感受", weight: 0.68 },
      "7": { text: "暫時退避以積蓄力量的面對策略", weight: 0.71 }
    },
    source_ref: "1,4,7",
    notes: "動作情境"
  },
  {
    symbol: "殺人",
    aliases: ["殺人", "殺害", "奪命", "動手殺人", "終結對手"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "渴望徹底終結某種心理特質或窒息關係", weight: 0.71 },
      "4": { text: "強烈壓抑攻擊衝動的極端戲劇化宣洩", weight: 0.70 },
      "6": { text: "殺死象徵與過去負面人格徹底割席決心", weight: 0.77 }
    },
    source_ref: "1,4,6",
    notes: "動作情境"
  },
  {
    symbol: "死亡",
    aliases: ["死亡", "死掉", "逝世", "斷氣", "離世", "葬禮", "臨終"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "舊生命週期的終結、重大心理蛻變轉折點", weight: 0.75 },
      "3": { text: "死亡-重生原型核心、鳳凰涅槃必經之路", weight: 0.84 },
      "10": { text: "舊我消亡方有新我誕生的必然規律", weight: 0.80 }
    },
    source_ref: "1,3,10",
    notes: "動作情境"
  },
  {
    symbol: "奔跑",
    aliases: ["奔跑", "跑步", "拼命跑", "向前衝", "飛奔", "狂奔"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "奮力爭取目標的昂揚動能或奔逃自保", weight: 0.70 },
      "5": { text: "面對急迫挑戰時全力以赴的精神調動", weight: 0.69 },
      "17": { text: "運動神經元活躍釋放的充沛心理能量", weight: 0.71 }
    },
    source_ref: "1,5,17",
    notes: "動作情境"
  },
  {
    symbol: "迷路",
    aliases: ["迷路", "找不到路", "走失", "迷失方向", "兜圈子"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "人生路口徘徊迷茫、價值觀混淆未定", weight: 0.71 },
      "2": { text: "原有地圖失效、等待內在指南針重新校準", weight: 0.75 },
      "8": { text: "脫離常規軌道後的探險契機", weight: 0.72 }
    },
    source_ref: "1,2,8",
    notes: "動作情境"
  },
  {
    symbol: "受傷",
    aliases: ["受傷", "流血受傷", "骨折", "創口", "傷痛", "疼痛"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "情感遭受打擊、心靈防線破損需要療傷", weight: 0.72 },
      "7": { text: "提醒自己尊重脆弱、給予溫柔關懷", weight: 0.73 },
      "9": { text: "過去創傷情結被現實刺激重新觸動喚醒", weight: 0.76 }
    },
    source_ref: "1,7,9",
    notes: "動作情境"
  },
  {
    symbol: "結婚",
    aliases: ["結婚", "婚禮", "完婚", "披嫁衣", "新娘", "新郎"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "2": { text: "意識與無意識神秘結合（Coniunctio）", weight: 0.80 },
      "3": { text: "內在陽性與陰性力量的圓滿整合與協調", weight: 0.83 },
      "10": { text: "進入全新人生階段的成熟心理契約", weight: 0.78 }
    },
    source_ref: "2,3,10",
    notes: "動作情境"
  },
  {
    symbol: "分手",
    aliases: ["分手", "離異", "決裂", "斷絕關係", "感情破裂", "說再見"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "4": { text: "痛苦斬斷舊有依附關係、面對分離焦慮", weight: 0.71 },
      "8": { text: "心理獨立與重新找回自主邊界的必修課", weight: 0.74 },
      "15": { text: "哀傷歷程重整、為下一段心靈連結騰出空間", weight: 0.72 }
    },
    source_ref: "4,8,15",
    notes: "動作情境"
  },
  {
    symbol: "開槍",
    aliases: ["開槍", "射擊", "扣扳機", "中槍", "槍戰"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "劇烈爆發的果斷意志、了結糾纏僵局", weight: 0.70 },
      "4": { text: "攻擊性本能爆發與直截了當的邊界劃定", weight: 0.69 },
      "6": { text: "自我防衛極端手段、消除重大威脅之企圖", weight: 0.74 }
    },
    source_ref: "1,4,6",
    notes: "動作情境"
  },
  {
    symbol: "被綁",
    aliases: ["被綁", "被捆綁", "失去行動自由", "動彈不得", "繩索束縛"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "無力抵抗外界現實壓迫、內在被動癱瘓感", weight: 0.73 },
      "6": { text: "被某種執念或道德愧疚牢牢鎖死", weight: 0.75 },
      "9": { text: "創傷壓制無助狀態重現、急需找回話語權", weight: 0.76 }
    },
    source_ref: "1,6,9",
    notes: "動作情境"
  },
  {
    symbol: "斷電",
    aliases: ["斷電", "跳閘", "漆黑一片", "停電", "忽然全黑"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "意識理智控制中斷、面對深不見底的無意識", weight: 0.71 },
      "5": { text: "心理能量耗竭、心力交瘁時的保護性跳閘", weight: 0.70 },
      "20": { text: "失去外界資訊依靠時的突發慌亂感", weight: 0.72 }
    },
    source_ref: "1,5,20",
    notes: "動作情境"
  },
  {
    symbol: "裸體",
    aliases: ["裸體", "赤身", "光身", "沒穿衣服", "一絲不掛", "羞恥裸露"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "卸除一切偽裝與防備、真實脆弱暴露", weight: 0.72 },
      "4": { text: "本我真實與被公眾凝視評判的羞恥焦慮", weight: 0.70 },
      "16": { text: "跨文化象徵：坦誠相見與剝除社會面具後的純真", weight: 0.69 }
    },
    source_ref: "1,4,16",
    notes: "動作情境"
  },
  {
    symbol: "漂浮",
    aliases: ["漂浮", "懸浮空中", "浮游", "漂在水面", "凌空漂浮"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "放下抵抗順應生命之流、超然脫俗體驗", weight: 0.72 },
      "2": { text: "身心深度放鬆、精神漫遊於重力之外", weight: 0.77 },
      "13": { text: "清醒夢中極為高頻的美妙自我覺察體驗", weight: 0.75 }
    },
    source_ref: "1,2,13",
    notes: "動作情境"
  },
  {
    symbol: "哭泣",
    aliases: ["哭泣", "痛哭", "流淚", "抽泣", "悲傷大哭", "淚流滿面"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "積壓已久情緒的健康宣洩與心靈解凍", weight: 0.73 },
      "7": { text: "與內在哀傷和解、淚水具有深層洗滌淨化力量", weight: 0.76 },
      "8": { text: "真情流露、卸除日間堅強偽裝後的自我撫慰", weight: 0.74 }
    },
    source_ref: "1,7,8",
    notes: "動作情境"
  },
  {
    symbol: "窒息",
    aliases: ["窒息", "喘不過氣", "呼吸困難", "被掐住脖子", "缺氧"],
    tags: ["動作情境", "噩夢危機"],
    tag_ids: [5, 6],
    book_interpret: {
      "1": { text: "現實生活環境過載、情緒空間被逼迫至極限", weight: 0.75 },
      "9": { text: "創傷壓力下呼吸道痙攣與恐慌發作映射", weight: 0.76 },
      "22": { text: "睡眠呼吸暫停或胸腔壓迫的生理直接報警", weight: 0.73 }
    },
    source_ref: "1,9,22",
    notes: "動作情境"
  },
  {
    symbol: "重逢",
    aliases: ["重逢", "久別重逢", "再相遇", "遇見舊人", "再次相聚"],
    tags: ["動作情境"],
    tag_ids: [5],
    book_interpret: {
      "1": { text: "找回內心曾割捨遺失的珍貴部分", weight: 0.72 },
      "8": { text: "情感未了之結的圓滿修復契機", weight: 0.75 },
      "15": { text: "跨越時空與過去自我對話的心靈和解", weight: 0.73 }
    },
    source_ref: "1,8,15",
    notes: "動作情境"
  },

  // 9. 噩夢危機
  {
    symbol: "洪水",
    aliases: ["洪水", "大水氾濫", "山洪", "暴雨淹浸", "水漫金山", "漫水"],
    tags: ["噩夢危機", "自然物象"],
    tag_ids: [6, 8],
    book_interpret: {
      "1": { text: "壓抑已久的情感洪流衝破防線、無法遏止", weight: 0.73 },
      "3": { text: "潛意識大氾濫、毀滅舊秩序以迎接滌淨", weight: 0.81 },
      "20": { text: "情緒完全失控帶來的壓倒性恐慌噩夢", weight: 0.77 }
    },
    source_ref: "1,3,20",
    notes: "噩夢危機"
  },
  {
    symbol: "火災",
    aliases: ["火災", "大火燒屋", "發生火災", "火場", "火海逃生", "失火"],
    tags: ["噩夢危機", "自然物象"],
    tag_ids: [6, 8],
    book_interpret: {
      "1": { text: "劇烈衝突升溫、危在旦夕的轉折考驗", weight: 0.72 },
      "10": { text: "狂熱情緒與毀滅性能量急需疏導", weight: 0.78 },
      "20": { text: "被迫放棄舊有資產與生活防禦的極端危機", weight: 0.76 }
    },
    source_ref: "1,10,20",
    notes: "噩夢危機"
  },
  {
    symbol: "地震",
    aliases: ["地震", "地動山搖", "房屋震塌", "地陷", "劇烈震動"],
    tags: ["噩夢危機", "自然物象"],
    tag_ids: [6, 8],
    book_interpret: {
      "1": { text: "人生根基動搖、最信賴的依靠突遭崩塌", weight: 0.72 },
      "15": { text: "安全感全線瓦解帶來的生存危機震撼", weight: 0.74 },
      "22": { text: "不可抗拒的大震盪引發的深度身心焦慮", weight: 0.71 }
    },
    source_ref: "1,15,22",
    notes: "噩夢危機"
  },
  {
    symbol: "海嘯",
    aliases: ["海嘯", "滔天巨浪", "巨浪翻滾", "海嘯來襲"],
    tags: ["噩夢危機", "自然物象"],
    tag_ids: [6, 8],
    book_interpret: {
      "1": { text: "集體無意識巨大衝擊、個人意志無法匹敵", weight: 0.75 },
      "3": { text: "超個人不可控的情緒巨浪衝垮現代理智防線", weight: 0.82 },
      "20": { text: "面臨滅頂之災時急欲逃往高處的心靈求生本能", weight: 0.78 }
    },
    source_ref: "1,3,20",
    notes: "噩夢危機"
  },
  {
    symbol: "車禍／墜機",
    aliases: ["撞車", "交通意外", "翻車", "空難", "墜機", "車禍"],
    tags: ["噩夢危機"],
    tag_ids: [6],
    book_interpret: {
      "1": { text: "人生急進步調突遭猛烈挫敗、被迫停下", weight: 0.73 },
      "9": { text: "生活失控與不可挽回後果的強烈焦慮驚悸", weight: 0.75 },
      "20": { text: "追求速度與控制感過度後的崩解警鐘", weight: 0.74 }
    },
    source_ref: "1,9,20",
    notes: "噩夢危機"
  }
];

function enrichAliases(aliases: string[], symbol: string): string[] {
  const set = new Set<string>();
  
  // Add symbol itself (Traditional & Simplified)
  const symTrad = s2t(symbol);
  const symSimp = t2s(symbol);
  set.add(symTrad);
  set.add(symSimp);

  // If symbol contains slashes like '雷電／閃電'
  if (symbol.includes('／')) {
    const parts = symbol.split('／');
    for (const p of parts) {
      set.add(s2t(p.trim()));
      set.add(t2s(p.trim()));
    }
  }

  for (const a of aliases) {
    if (!a) continue;
    const trad = s2t(a.trim());
    const simp = t2s(a.trim());
    if (trad) set.add(trad);
    if (simp) set.add(simp);
  }

  // Remove empty string
  set.delete('');
  return Array.from(set);
}

export function buildCompleteSymbols(): SymbolOutput[] {
  return rawSymbols.map((item, index) => {
    const symbol_id = index + 1;
    const enrichedAliases = enrichAliases(item.aliases, item.symbol);
    return {
      symbol_id,
      symbol: item.symbol,
      alias_list: enrichedAliases,
      tags: item.tags,
      tag_ids: item.tag_ids,
      book_interpret: item.book_interpret,
      source_ref: item.source_ref,
      notes: item.notes,
    };
  });
}

function main() {
  const symbols = buildCompleteSymbols();
  console.log(`Generated ${symbols.length} complete symbols with bilingual Trad/Simp aliases!`);

  // 1. Write clean JSON to server/data/dream_symbols_complete.json
  const jsonPath = path.resolve(process.cwd(), 'server/data/dream_symbols_complete.json');
  fs.writeFileSync(jsonPath, JSON.stringify(symbols, null, 2), 'utf8');
  console.log(`Saved JSON database to ${jsonPath}`);

  // Also write to src/data/dream_symbols_complete.json for frontend bundle access
  const srcJsonPath = path.resolve(process.cwd(), 'src/data/dream_symbols_complete.json');
  fs.writeFileSync(srcJsonPath, JSON.stringify(symbols, null, 2), 'utf8');
  console.log(`Saved JSON database to ${srcJsonPath}`);

  // 2. Read books from dreamAstraData
  const dreamAstraDataOld = fs.readFileSync(path.resolve(process.cwd(), 'server/dreamAstraData.ts'), 'utf8');
  const booksMatch = dreamAstraDataOld.match(/export const DREAM_BOOKS: DreamBookRecord\[\] = (\[[\s\S]*?\n\];)/);
  if (!booksMatch) {
    console.error('Failed to parse DREAM_BOOKS');
    return;
  }
  const booksContent = booksMatch[1];

  const updatedTags = [
    { tag_id: 1, tag_name: "人物", tag_desc: "夢中人物與原型投射" },
    { tag_id: 2, tag_name: "動物", tag_desc: "動物意象與本能象徵" },
    { tag_id: 3, tag_name: "場景", tag_desc: "夢境空間環境與場域" },
    { tag_id: 4, tag_name: "身體", tag_desc: "身體部位與生理感覺" },
    { tag_id: 5, tag_name: "動作", tag_desc: "夢中行為、互動與動態事件" },
    { tag_id: 6, tag_name: "噩夢", tag_desc: "高頻焦慮、驚恐與創傷性主題" },
    { tag_id: 7, tag_name: "物件", tag_desc: "象徵器具、符號與道具" },
    { tag_id: 8, tag_name: "自然物象", tag_desc: "天象、氣候、地質與自然元素" },
    { tag_id: 9, tag_name: "香港本土場景", tag_desc: "港式本土場景、在地集體記憶與民間意象" }
  ];

  const dreamSymbolsRecords = symbols.map(s => ({
    symbol_id: s.symbol_id,
    symbol: s.symbol,
    alias_list: s.alias_list,
    tags: s.tags,
    book_interpret_json: s.book_interpret,
    book_interpret: s.book_interpret,
    source_ref: s.source_ref,
    notes: s.notes,
    tag_ids: s.tag_ids
  }));

  const newDreamAstraTs = `/**
 * DreamAstra 完整主庫數據 (22 經典著作 + 9 標籤 + ${symbols.length} 權威心理意象)
 * 涵蓋榮格派、精神分析、本土意象、自然物象、動物原型、香港本土場景、生理夢理論與夢工作實務
 * 支援繁體中文、簡體中文雙向檢索與同義詞對照
 */

export interface DreamBookRecord {
  book_id: number;
  book_name: string;
  title_zh: string;
  title_en: string;
  book_name_en: string;
  author: string;
  school: string;
  global_weight: number;
  core_theory: string;
  process: string[];
  forbidden: string[];
  scene_match: string[];
  description: string;
}

export interface DreamTagRecord {
  tag_id: number;
  tag_name: string;
  tag_desc: string;
}

export interface DreamSymbolRecord {
  symbol_id: number;
  symbol: string;
  alias_list: string[];
  tags?: string[];
  book_interpret_json: Record<string, { text: string; weight: number } | string>;
  book_interpret?: Record<string, { text: string; weight: number } | string>;
  source_ref: string;
  notes: string;
  tag_ids: number[];
}

export const DREAM_BOOKS: DreamBookRecord[] = ${booksContent}

export const DREAM_TAGS: DreamTagRecord[] = ${JSON.stringify(updatedTags, null, 2)};

export const DREAM_SYMBOLS: DreamSymbolRecord[] = ${JSON.stringify(dreamSymbolsRecords, null, 2)};
`;

  fs.writeFileSync(path.resolve(process.cwd(), 'server/dreamAstraData.ts'), newDreamAstraTs, 'utf8');
  console.log(`Updated server/dreamAstraData.ts with ${symbols.length} symbols!`);

  // 3. Generate SQL statements for dream_symbol and dream_symbol_tag
  const symbolInserts = symbols.map(s => {
    const aliasJson = JSON.stringify(s.alias_list).replace(/'/g, "''");
    const bookJson = JSON.stringify(s.book_interpret).replace(/'/g, "''");
    const notes = (s.notes || '').replace(/'/g, "''");
    const ref = (s.source_ref || '').replace(/'/g, "''");
    const sym = s.symbol.replace(/'/g, "''");
    return `(${s.symbol_id},'${sym}','${aliasJson}','${bookJson}','${ref}','${notes}')`;
  }).join(',\n');

  const tagInserts: string[] = [];
  symbols.forEach(s => {
    (s.tag_ids || []).forEach(tid => {
      tagInserts.push(`(${s.symbol_id},${tid})`);
    });
  });

  const sqlPath = path.resolve(process.cwd(), 'server/sql/dreamastra_master.sql');
  if (fs.existsSync(sqlPath)) {
    const existingSql = fs.readFileSync(sqlPath, 'utf8');
    const symbolSplit = existingSql.split('INSERT INTO dream_symbol (symbol_id, symbol, alias_list, book_interpret_json, source_ref, notes) VALUES');
    if (symbolSplit.length === 2) {
      const restSplit = symbolSplit[1].split('-- 4. 標籤關聯表');
      if (restSplit.length === 2) {
        const newSql = `${symbolSplit[0]}INSERT INTO dream_symbol (symbol_id, symbol, alias_list, book_interpret_json, source_ref, notes) VALUES\n${symbolInserts};\n\n-- 4. 標籤關聯表\nCREATE TABLE dream_symbol_tag (\n  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\n  symbol_id INT UNSIGNED NOT NULL,\n  tag_id INT UNSIGNED NOT NULL,\n  UNIQUE KEY uk_symbol_tag (symbol_id, tag_id),\n  FOREIGN KEY (symbol_id) REFERENCES dream_symbol(symbol_id) ON DELETE CASCADE,\n  FOREIGN KEY (tag_id) REFERENCES dream_tag(tag_id) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nINSERT INTO dream_symbol_tag (symbol_id, tag_id) VALUES\n${tagInserts.join(',\n')}\nON DUPLICATE KEY UPDATE tag_id=EXCLUDED.tag_id;\n\n${restSplit[1].split('ON DUPLICATE KEY UPDATE')[0].includes('analysis_rules') ? '' : ''}`;
        fs.writeFileSync(sqlPath, newSql, 'utf8');
        console.log(`Updated server/sql/dreamastra_master.sql with ${symbols.length} symbols & ${tagInserts.length} tag mappings!`);
      }
    }
  }
}

main();
