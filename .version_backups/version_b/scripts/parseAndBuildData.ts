import fs from 'fs';
import path from 'path';

// 1. User's 22 Books JSON
const rawBooks = [
  { "book_id": 1, "title_zh": "解夢全書", "title_en": "", "author": "朱建軍", "school": "本土意象", "global_weight": 0.65, "core_theory": "夢是個體內在心理意象的投射，重視意象對話與夢者當下生活處境，不主張吉凶預言。", "process": [ "提取夢中核心意象", "開展意象對話", "連結近期現實事件", "給出心理啟示" ], "forbidden": [ "照字解籤", "簡單斷定吉兇", "脫離夢者現實下定論" ], "scene_match": ["日常情緒夢", "重複夢", "壓力夢", "生活化意象夢"] },
  { "book_id": 2, "title_zh": "榮格解夢書：夢的理論與解析", "title_en": "", "author": "榮格", "school": "榮格派", "global_weight": 0.80, "core_theory": "夢來自無意識，具有補償功能；需區分個人無意識內容與集體無意識原型。", "process": [ "區分個人素材與原型素材", "辨識夢的補償作用", "象徵擴充", "關聯自性化歷程" ], "forbidden": [ "所有意象硬套原型", "忽略個人經驗", "把夢當預言" ], "scene_match": ["神話感夢", "原型夢", "轉折期夢境"] },
  { "book_id": 3, "title_zh": "人及其象徵", "title_en": "Man and His Symbols", "author": "Carl Gustav Jung", "school": "榮格派", "global_weight": 0.85, "core_theory": "象徵是人類共通心靈語言，原型透過夢、神話、民俗顯現。", "process": [ "辨識原型象徵", "參考跨文化象徵", "對照夢者主觀感受" ], "forbidden": [ "機械查表解夢", "跳過夢者主觀感受" ], "scene_match": ["古老神聖意象夢", "跨文化象徵夢"] },
  { "book_id": 4, "title_zh": "夢的解析", "title_en": "The Interpretation of Dreams", "author": "Sigmund Freud", "school": "精神分析", "global_weight": 0.60, "core_theory": "夢是被壓抑願望的滿足；需分顯夢與隱夢，透過自由聯想拆解夢的工作機制。", "process": [ "分離顯夢與隱夢", "自由聯想", "辨識凝縮、置換、象徵、二次修飾", "回溯早年經驗" ], "forbidden": [ "全部意象歸為性象徵", "只挖童年創傷", "所有夢都解為願望達成" ], "scene_match": ["壓抑衝突夢", "扭曲劇情夢"] },
  { "book_id": 5, "title_zh": "夢：牛津通識讀本", "title_en": "Dreaming : A Very Short Introduction", "author": "J. Allan Hobson", "school": "生理夢理論", "global_weight": 0.40, "core_theory": "REM睡眠期大腦隨機神經激發，心智將雜訊編織成故事；可同時保留心理意義。", "process": [ "評估睡眠背景", "區分生理素材與心理建構", "拒絕超自然預測" ], "forbidden": [ "全盤否定心理意義", "用生理理論取代心理解析", "神秘主義" ], "scene_match": ["混亂破碎夢", "睡眠品質差的夢"] },
  { "book_id": 6, "title_zh": "Inner Work", "title_en": "Inner Work", "author": "Robert A. Johnson", "school": "榮格派", "global_weight": 0.75, "core_theory": "把榮格原型理論落實到日常夢，強調區分外在人物與內在人格面向投射。", "process": [ "完整紀錄夢與感受", "自由聯想人物與意象", "區分現實人物與內在投射", "轉化為現實行動" ], "forbidden": [ "只做理論不解行動", "把內在投射當現實他人" ], "scene_match": ["人物眾多的夢", "人際關係夢"] },
  { "book_id": 7, "title_zh": "你是做夢大師", "title_en": "Living Your Dreams", "author": "Gayle Delaney", "school": "夢工作實務", "global_weight": 0.70, "core_theory": "夢屬於做夢者本人；強調主觀感受與孵夢技術，反對通用意象表硬套。", "process": [ "紀錄夢境細節", "詢問意象對自己的意義", "孵夢", "回應現實疑問" ], "forbidden": [ "解夢師替夢者下定義", "忽略個人聯想" ], "scene_match": ["重複夢", "噩夢", "有現實困惑的夢"] },
  { "book_id": 8, "title_zh": "夢的工作：榮格取向實務", "title_en": "", "author": "James A. Hall", "school": "榮格派", "global_weight": 0.72, "core_theory": "榮格派臨床夢解析，重視原型與個人聯想結合。", "process": [ "建立安全探索氛圍", "區分原型與個人經驗", "探索夢中人物的內在面向", "整合到自我認知" ], "forbidden": [ "過度抽象化", "忽略夢者情緒" ], "scene_match": ["長期重複夢", "原型感強的夢"] },
  { "book_id": 9, "title_zh": "夢的力量", "title_en": "The Power of Dreams", "author": "Montague Ullman", "school": "夢工作實務", "global_weight": 0.68, "core_theory": "夢具有自我療癒傾向，團體夢工作有助於把隱隱約約的訊息變成語言。", "process": [ "團體傾聽", "避免解釋衝動", "幫助夢者自己看見", "支持夢者行動化" ], "forbidden": [ "搶先解釋", "把夢當成病理症狀" ], "scene_match": ["孤獨感強的夢", "難以說清的夢"] },
  { "book_id": 10, "title_zh": "原型心理學", "title_en": "The Archetypes and the Collective Unconscious", "author": "Carl Gustav Jung", "school": "榮格派", "global_weight": 0.82, "core_theory": "原型是集體無意識中的先天結構，透過神話、夢、象徵顯現。", "process": [ "辨識原型模式", "連接神話母題", "評估原型在當下的活躍程度" ], "forbidden": [ "把所有意象都當原型", "忽略個人層次" ], "scene_match": ["神話母題明顯的夢"] },
  { "book_id": 11, "title_zh": "夢、幻覺與象徵", "title_en": "Dreams, Hallucinations, and Symbols", "author": "Edward Edinger", "school": "榮格派", "global_weight": 0.70, "core_theory": "夢中象徵具有轉化功能，自性化過程常透過象徵逐步展開。", "process": [ "辨識轉化象徵", "觀察象徵序列", "連接人格整合" ], "forbidden": [ "單象徵單義解讀", "忽略象徵變化" ], "scene_match": ["有明顯象徵序列的夢"] },
  { "book_id": 12, "title_zh": "精神分析引論", "title_en": "Introductory Lectures on Psycho-Analysis", "author": "Sigmund Freud", "school": "精神分析", "global_weight": 0.55, "core_theory": "夢是精神分析理解潛意識的重要入口，需透過自由聯想接近隱夢思緒。", "process": [ "自由聯想", "辨識壓抑", "分析夢的工作", "建立轉移關係理解" ], "forbidden": [ "簡約化還原", "過早確定病因" ], "scene_match": ["內心衝突明顯的夢"] },
  { "book_id": 13, "title_zh": "夢的神經科學", "title_en": "The Neuroscience of Sleep and Dreams", "author": "Robert Stickgold", "school": "生理夢理論", "global_weight": 0.42, "core_theory": "夢與睡眠階段、記憶鞏固、情緒處理密切相關。", "process": [ "考慮睡眠結構", "區分記憶片段與心理意義", "避免玄學" ], "forbidden": [ "否定主觀意義", "把夢全還原為隨機雜訊" ], "scene_match": ["破碎、記憶感強的夢"] },
  { "book_id": 14, "title_zh": "孵夢指南", "title_en": "Dream Incubation", "author": "Kelly Bulkeley", "school": "夢工作實務", "global_weight": 0.66, "core_theory": "人可以主動向夢提出問題，引導夢境圍繞現實議題展開。", "process": [ "睡前陳述問題", "保持開放態度", "醒後立即紀錄", "尋找象徵答案" ], "forbidden": [ "期待字面答案", "過度執著特定結果" ], "scene_match": ["有現實疑問的夢"] },
  { "book_id": 15, "title_zh": "夢境的智慧", "title_en": "The Wisdom of the Dream", "author": "Stephen Segaller", "school": "榮格派", "global_weight": 0.74, "core_theory": "夢不是純粹混亂，而是在試圖告訴夢者關於自己的事。", "process": [ "傾聽夢的整體氛圍", "辨識重複主題", "連接當下自我狀態" ], "forbidden": [ "只看單一意象", "忽略整體情緒" ], "scene_match": ["重複主題夢"] },
  { "book_id": 16, "title_zh": "夢的象徵辭典", "title_en": "Dictionary of Dream Symbols", "author": "Eric Ackroyd", "school": "綜合意象", "global_weight": 0.60, "core_theory": "夢意象有跨文化重複模式，但必須與夢者個人經驗結合。", "process": [ "參考跨文化模式", "核對個人經驗", "優先夢者感受" ], "forbidden": [ "查表式解夢", "忽略文化差異" ], "scene_match": ["常見象徵夢"] },
  { "book_id": 17, "title_zh": "夜之語言：夢的心理學", "title_en": "The Language of the Night", "author": "Marion Woodman", "school": "榮格派", "global_weight": 0.71, "core_theory": "夢與身體、陰性原型、創傷轉化密切相關。", "process": [ "留意身體感", "辨識陰性原型", "連結創傷與轉化" ], "forbidden": [ "忽略身體訊息", "只做理性分析" ], "scene_match": ["身體感強的夢"] },
  { "book_id": 18, "title_zh": "自我與原型", "title_en": "The Self and the Archetypes", "author": "Edward Edinger", "school": "榮格派", "global_weight": 0.73, "core_theory": "自性化是人格整合的過程，夢中常出現自性符號。", "process": [ "辨識自性符號", "觀察人格整合程度", "連結生命階段" ], "forbidden": [ "把自性化簡單視為成功", "忽略痛苦轉化" ], "scene_match": ["人生轉折夢"] },
  { "book_id": 19, "title_zh": "睡眠與夢心理學", "title_en": "", "author": "高宜安", "school": "本土意象", "global_weight": 0.58, "core_theory": "華人夢境有其文化特殊性，需結合本土生活經驗理解。", "process": [ "考慮文化背景", "連結家庭關係", "區分文化聯想與個人聯想" ], "forbidden": [ "全盤套用西方象徵", "忽略華人家庭議題" ], "scene_match": ["家庭、祖輩、文化意象明顯的夢"] },
  { "book_id": 20, "title_zh": "夢的故事", "title_en": "Dream Stories", "author": "Patricia Garfield", "school": "夢工作實務", "global_weight": 0.67, "core_theory": "噩夢可以被重新講述，重複夢往往是未被處理訊息的提醒。", "process": [ "紀錄重複模式", "重新敘事", "把恐懼變成可處理訊息" ], "forbidden": [ "把噩夢當純預兆", "強壓恐懼" ], "scene_match": ["重複噩夢"] },
  { "book_id": 21, "title_zh": "潛意識的發現", "title_en": "The Discovery of the Unconscious", "author": "Henri Ellenberger", "school": "精神分析", "global_weight": 0.52, "core_theory": "夢解析思想有其歷史源流，精神分析只是其中一支。", "process": [ "避免單一學派獨斷", "保持方法論自覺" ], "forbidden": [ "把所有夢都精神分析化" ], "scene_match": ["學派綜合評估"] },
  { "book_id": 22, "title_zh": "夢與創傷", "title_en": "Dreams and Trauma", "author": "Deirdre Barrett", "school": "生理夢理論", "global_weight": 0.45, "core_theory": "創傷夢具有重複性，是大腦試圖處理未完成創傷的訊號。", "process": [ "辨識創傷重複", "區分創傷再現與整合夢", "必要時建議專業協助" ], "forbidden": [ "輕率解讀創傷夢", "鼓勵危險自我處理" ], "scene_match": ["創傷重複夢"] }
];

// Map into DreamBookRecord
export interface FullBookRecord {
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

const fullBooks: FullBookRecord[] = rawBooks.map(b => ({
  book_id: b.book_id,
  book_name: b.title_zh,
  title_zh: b.title_zh,
  title_en: b.title_en,
  book_name_en: b.title_en,
  author: b.author,
  school: b.school,
  global_weight: b.global_weight,
  core_theory: b.core_theory,
  process: b.process,
  forbidden: b.forbidden,
  scene_match: b.scene_match,
  description: b.core_theory,
}));

// 2. Tags Definition matching User's Exact SQL
export const fullTags = [
  { tag_id: 1, tag_name: '人物', tag_desc: '夢中人物與原型投射' },
  { tag_id: 2, tag_name: '動物', tag_desc: '動物意象與本能象徵' },
  { tag_id: 3, tag_name: '場景', tag_desc: '夢境空間環境與場域' },
  { tag_id: 4, tag_name: '身體', tag_desc: '身體部位與生理感覺' },
  { tag_id: 5, tag_name: '動作', tag_desc: '夢中行為、互動與動態事件' },
  { tag_id: 6, tag_name: '噩夢', tag_desc: '高頻焦慮、驚恐與創傷性主題' },
  { tag_id: 7, tag_name: '物件', tag_desc: '象徵器具、符號與道具' },
];

const userTagRules: Array<{ tag_id: number; symbols: string[] }> = [
  {
    tag_id: 1,
    symbols: ['祖母','祖父','小偷','流浪漢','女巫','醫生','小孩','敵人','司機','聖者／隱士'],
  },
  {
    tag_id: 2,
    symbols: ['鹿','貓','孔雀','綿羊','蝙蝠','狼','馬','蛇','鷹','老鼠'],
  },
  {
    tag_id: 3,
    symbols: ['圖書館','港口','旅館／酒店','墳墓','森林','學校','橋','家／房屋','洞穴','山','地下室','天台','監獄','醫院','沙漠','海洋','河流','超市','車站','教堂'],
  },
  {
    tag_id: 4,
    symbols: ['眼睛','心臟','牙齒','皮膚','頭','手','腳','血','骨頭','頭髮'],
  },
  {
    tag_id: 5,
    symbols: ['追逐','尋找東西','溺水','墜落','考試／答不出題','遲到','飛翔','躲藏','殺人','死亡','奔跑','迷路','受傷','結婚','分手','開槍','被綁','斷電','洪水','火災','地震','裸體'],
  },
  {
    tag_id: 6,
    symbols: ['追逐','溺水','墜落','考試／答不出題','牙齒','洪水','地震'],
  },
  {
    tag_id: 7,
    symbols: ['鑰匙','鏡子','船','燈籠／燈','衣服','寶石','錢／金錢','門','鐘錶／時鐘','武器','書本','車輛','梯子','窗','鎖','劍','花朵','種子','面具','棺材'],
  },
];

// 3. User's SQL items from prompt
// Let's create an exact parser for the SQL tuples provided:
const rawSqlTuples = `
('祖母',JSON_ARRAY('嫲嫲','奶奶'),JSON_OBJECT('1',JSON_OBJECT('text','象徵庇護、舊時情感、內心母性原型','weight',0.70),'3',JSON_OBJECT('text','大母神原型','weight',0.80),'10',JSON_OBJECT('text','正向大母神：滋養、包容','weight',0.75)),'1,3,10','人物'),
('祖父',JSON_ARRAY('爺爺'),JSON_OBJECT('1',JSON_OBJECT('text','代表權威、經驗、精神指引','weight',0.70),'3',JSON_OBJECT('text','智慧老人原型','weight',0.80),'10',JSON_OBJECT('text','智慧老人原型','weight',0.78)),'1,3,10','人物'),
('小偷',JSON_ARRAY('賊','盜賊'),JSON_OBJECT('1',JSON_OBJECT('text','恐懼失去、被壓抑慾望','weight',0.60),'4',JSON_OBJECT('text','本我衝動外化','weight',0.70),'6',JSON_OBJECT('text','陰影原型','weight',0.76)),'1,4,6','人物'),
('流浪漢',JSON_ARRAY('流浪人','乞丐'),JSON_OBJECT('1',JSON_OBJECT('text','被遺棄的自我部分','weight',0.70),'6',JSON_OBJECT('text','陰影原型','weight',0.80),'8',JSON_OBJECT('text','未整合人格碎片','weight',0.71)),'1,6,8','人物'),
('女巫',JSON_ARRAY('巫婆'),JSON_OBJECT('1',JSON_OBJECT('text','陰性陰影、直覺、操縱感','weight',0.70),'3',JSON_OBJECT('text','負面大母神原型','weight',0.80),'10',JSON_OBJECT('text','負面大母神','weight',0.77)),'1,3,10','人物'),
('醫生',JSON_ARRAY('醫師','大夫'),JSON_OBJECT('1',JSON_OBJECT('text','內在療癒者','weight',0.70),'3',JSON_OBJECT('text','療癒者原型','weight',0.80),'8',JSON_OBJECT('text','心靈修復象徵','weight',0.72)),'1,3,8','人物'),
('小孩',JSON_ARRAY('孩童','細路','小朋友'),JSON_OBJECT('1',JSON_OBJECT('text','內在孩童','weight',0.70),'3',JSON_OBJECT('text','內在孩童原型','weight',0.80),'10',JSON_OBJECT('text','脆弱與潛能','weight',0.79)),'1,3,10','人物'),
('敵人',JSON_ARRAY('仇敵','對手'),JSON_OBJECT('1',JSON_OBJECT('text','內心陰影投射','weight',0.70),'6',JSON_OBJECT('text','陰影投射','weight',0.80),'8',JSON_OBJECT('text','未整合人格面向','weight',0.73)),'1,6,8','人物'),
('司機',JSON_ARRAY('駕駛員'),JSON_OBJECT('1',JSON_OBJECT('text','人生方向的掌控者','weight',0.70),'2',JSON_OBJECT('text','意識或潛意識主導','weight',0.76),'7',JSON_OBJECT('text','控制權主題','weight',0.69)),'1,2,7','人物'),
('聖者／隱士',JSON_ARRAY('聖人'),JSON_OBJECT('1',JSON_OBJECT('text','內在智慧、獨處','weight',0.70),'3',JSON_OBJECT('text','智慧老人原型','weight',0.80),'10',JSON_OBJECT('text','智慧老人','weight',0.78)),'1,3,10','人物'),
('鹿',JSON_ARRAY('雄鹿','小鹿'),JSON_OBJECT('1',JSON_OBJECT('text','靈敏、純真、精神追求','weight',0.70),'3',JSON_OBJECT('text','柔和本能','weight',0.60),'10',JSON_OBJECT('text','溫和本能原型','weight',0.72)),'1,3,10','動物'),
('貓',JSON_ARRAY('野貓','家貓'),JSON_OBJECT('1',JSON_OBJECT('text','直覺、獨立','weight',0.70),'3',JSON_OBJECT('text','陰性本能','weight',0.60),'10',JSON_OBJECT('text','獨立本能原型','weight',0.71)),'1,3,10','動物'),
('孔雀',JSON_ARRAY(),JSON_OBJECT('1',JSON_OBJECT('text','虛榮或自我展現','weight',0.60),'16',JSON_OBJECT('text','跨文化：吉祥或炫耀','weight',0.58),'15',JSON_OBJECT('text','自我呈現','weight',0.66)),'1,15,16','動物'),
('綿羊',JSON_ARRAY('羊'),JSON_OBJECT('1',JSON_OBJECT('text','順服、缺乏主見','weight',0.60),'16',JSON_OBJECT('text','溫馴與犧牲','weight',0.57),'15',JSON_OBJECT('text','順從群體','weight',0.65)),'1,15,16','動物'),
('蝙蝠',JSON_ARRAY(),JSON_OBJECT('1',JSON_OBJECT('text','黑暗感知、恐懼','weight',0.60),'16',JSON_OBJECT('text','文化差異極大','weight',0.59),'7',JSON_OBJECT('text','個人感受優先','weight',0.65)),'1,7,16','動物'),
('狼',JSON_ARRAY('野狼'),JSON_OBJECT('1',JSON_OBJECT('text','野性、生存力量','weight',0.70),'3',JSON_OBJECT('text','未馴服本能','weight',0.70),'10',JSON_OBJECT('text','野生本能原型','weight',0.74)),'1,3,10','動物'),
('馬',JSON_ARRAY('野馬','駿馬'),JSON_OBJECT('1',JSON_OBJECT('text','生命力、前進動能','weight',0.70),'3',JSON_OBJECT('text','身體本能','weight',0.70),'10',JSON_OBJECT('text','本能原型','weight',0.73)),'1,3,10','動物'),
('蛇',JSON_ARRAY('大蛇'),JSON_OBJECT('1',JSON_OBJECT('text','轉化、慾望、重生','weight',0.70),'3',JSON_OBJECT('text','死亡-重生原型','weight',0.80),'4',JSON_OBJECT('text','性能量象徵','weight',0.60)),'1,3,4','動物'),
('鷹',JSON_ARRAY('雄鷹','老鷹'),JSON_OBJECT('1',JSON_OBJECT('text','高層視角、遠見','weight',0.70),'3',JSON_OBJECT('text','精神原型','weight',0.80),'10',JSON_OBJECT('text','精神原型','weight',0.76)),'1,3,10','動物'),
('老鼠',JSON_ARRAY('鼠'),JSON_OBJECT('1',JSON_OBJECT('text','微小恐懼','weight',0.60),'16',JSON_OBJECT('text','微小威脅','weight',0.57),'19',JSON_OBJECT('text','華人夢境常見小煩惱','weight',0.56)),'1,16,19','動物'),
('圖書館',JSON_ARRAY('圖書室'),JSON_OBJECT('1',JSON_OBJECT('text','內心知識、記憶集合','weight',0.70),'2',JSON_OBJECT('text','集體記憶','weight',0.70),'3',JSON_OBJECT('text','集體潛意識','weight',0.77)),'1,2,3','場景'),
('港口',JSON_ARRAY('碼頭'),JSON_OBJECT('1',JSON_OBJECT('text','人生轉折','weight',0.70),'7',JSON_OBJECT('text','過渡場域','weight',0.68),'15',JSON_OBJECT('text','階段交界','weight',0.67)),'1,7,15','場景'),
('旅館／酒店',JSON_ARRAY('酒店','賓館'),JSON_OBJECT('1',JSON_OBJECT('text','過渡階段','weight',0.70),'2',JSON_OBJECT('text','暫時人格狀態','weight',0.73),'6',JSON_OBJECT('text','非永久空間','weight',0.71)),'1,2,6','場景'),
('墳墓',JSON_ARRAY('墳','墓穴','墳頭'),JSON_OBJECT('1',JSON_OBJECT('text','舊自我結束','weight',0.70),'3',JSON_OBJECT('text','死亡-重生','weight',0.80),'10',JSON_OBJECT('text','舊人格埋葬','weight',0.78)),'1,3,10','場景'),
('森林',JSON_ARRAY('樹林','山林'),JSON_OBJECT('1',JSON_OBJECT('text','潛意識探索','weight',0.70),'3',JSON_OBJECT('text','集體潛意識','weight',0.80),'10',JSON_OBJECT('text','潛意識場域','weight',0.79)),'1,3,10','場景'),
('學校',JSON_ARRAY('學堂','校園'),JSON_OBJECT('1',JSON_OBJECT('text','人生課題','weight',0.70),'5',JSON_OBJECT('text','壓力相關夢','weight',0.40),'20',JSON_OBJECT('text','成年人高頻回溯場景','weight',0.65)),'1,5,20','場景'),
('橋',JSON_ARRAY('橋樑'),JSON_OBJECT('1',JSON_OBJECT('text','狀態過渡','weight',0.70),'2',JSON_OBJECT('text','邊界與連接','weight',0.74),'3',JSON_OBJECT('text','跨過內在鴻溝','weight',0.75)),'1,2,3','場景'),
('家／房屋',JSON_ARRAY('房子','大屋','居所','屋企'),JSON_OBJECT('1',JSON_OBJECT('text','內心自我','weight',0.80),'2',JSON_OBJECT('text','心靈結構','weight',0.80),'3',JSON_OBJECT('text','房屋即心靈','weight',0.82)),'1,2,3','場景'),
('洞穴',JSON_ARRAY('山洞'),JSON_OBJECT('1',JSON_OBJECT('text','退入潛意識','weight',0.70),'3',JSON_OBJECT('text','母性潛意識','weight',0.70),'10',JSON_OBJECT('text','大母神空間','weight',0.75)),'1,3,10','場景'),
('山',JSON_ARRAY('高山'),JSON_OBJECT('1',JSON_OBJECT('text','目標、精神高度','weight',0.70),'3',JSON_OBJECT('text','精神高度','weight',0.77),'10',JSON_OBJECT('text','攀登原型','weight',0.76)),'1,3,10','場景'),
('地下室',JSON_ARRAY('地庫'),JSON_OBJECT('1',JSON_OBJECT('text','被壓抑記憶','weight',0.70),'2',JSON_OBJECT('text','最深層潛意識','weight',0.70),'4',JSON_OBJECT('text','被壓抑本我','weight',0.58)),'1,2,4','場景'),
('天台',JSON_ARRAY('屋頂'),JSON_OBJECT('1',JSON_OBJECT('text','精神層面','weight',0.70),'2',JSON_OBJECT('text','意識頂層','weight',0.73),'3',JSON_OBJECT('text','俯瞰人生','weight',0.74)),'1,2,3','場景'),
('監獄',JSON_ARRAY('牢獄','牢房'),JSON_OBJECT('1',JSON_OBJECT('text','自我設限','weight',0.70),'6',JSON_OBJECT('text','內在束縛','weight',0.72),'15',JSON_OBJECT('text','分辨外在限制或自我設限','weight',0.68)),'1,6,15','場景'),
('醫院',JSON_ARRAY('病院'),JSON_OBJECT('1',JSON_OBJECT('text','療癒需求','weight',0.70),'7',JSON_OBJECT('text','身體或心理修復','weight',0.68),'22',JSON_OBJECT('text','創傷夢中的安全象徵','weight',0.44)),'1,7,22','場景'),
('沙漠',JSON_ARRAY('荒漠'),JSON_OBJECT('1',JSON_OBJECT('text','孤獨、能量枯竭','weight',0.70),'3',JSON_OBJECT('text','心靈荒漠','weight',0.74),'10',JSON_OBJECT('text','乾涸原型','weight',0.73)),'1,3,10','場景'),
('海洋',JSON_ARRAY('大海','海'),JSON_OBJECT('1',JSON_OBJECT('text','集體潛意識','weight',0.70),'3',JSON_OBJECT('text','水原型','weight',0.80),'10',JSON_OBJECT('text','大海原型','weight',0.79)),'1,3,10','場景'),
('河流',JSON_ARRAY('溪水','河'),JSON_OBJECT('1',JSON_OBJECT('text','生命流動','weight',0.70),'2',JSON_OBJECT('text','流動心靈能量','weight',0.74),'3',JSON_OBJECT('text','情緒流動','weight',0.75)),'1,2,3','場景'),
('超市',JSON_ARRAY('商場'),JSON_OBJECT('1',JSON_OBJECT('text','大量選擇','weight',0.70),'7',JSON_OBJECT('text','人生選項','weight',0.67),'19',JSON_OBJECT('text','現代華人夢常見場景','weight',0.57)),'1,7,19','場景'),
('車站',JSON_ARRAY('火車站'),JSON_OBJECT('1',JSON_OBJECT('text','等待轉變','weight',0.70),'7',JSON_OBJECT('text','過渡場域','weight',0.68),'15',JSON_OBJECT('text','人生選擇點','weight',0.67)),'1,7,15','場景'),
('教堂',JSON_ARRAY('廟宇','寺廟'),JSON_OBJECT('1',JSON_OBJECT('text','精神寄託','weight',0.70),'3',JSON_OBJECT('text','神聖空間','weight',0.78),'10',JSON_OBJECT('text','自性原型場域','weight',0.77)),'1,3,10','場景'),
('鑰匙',JSON_ARRAY('鎖匙'),JSON_OBJECT('1',JSON_OBJECT('text','解開謎團','weight',0.70),'3',JSON_OBJECT('text','打開潛意識','weight',0.70),'10',JSON_OBJECT('text','開啟符號','weight',0.74)),'1,3,10','物件'),
('鏡子',JSON_ARRAY('鏡'),JSON_OBJECT('1',JSON_OBJECT('text','看見真實自我','weight',0.70),'6',JSON_OBJECT('text','面對陰影','weight',0.80),'8',JSON_OBJECT('text','自我映照','weight',0.73)),'1,6,8','物件'),
('船',JSON_ARRAY('船隻','小舟','輪船'),JSON_OBJECT('1',JSON_OBJECT('text','生命旅程','weight',0.70),'2',JSON_OBJECT('text','心靈承載','weight',0.74),'3',JSON_OBJECT('text','情緒之舟','weight',0.75)),'1,2,3','物件'),
('燈籠／燈',JSON_ARRAY('燈光','燈籠','燈火'),JSON_OBJECT('1',JSON_OBJECT('text','覺察、方向','weight',0.70),'3',JSON_OBJECT('text','意識之光','weight',0.70),'10',JSON_OBJECT('text','光明原型','weight',0.74)),'1,3,10','物件'),
('衣服',JSON_ARRAY('衫','衣物','服裝'),JSON_OBJECT('1',JSON_OBJECT('text','社會面具','weight',0.70),'4',JSON_OBJECT('text','人格偽裝','weight',0.60),'6',JSON_OBJECT('text','人格面具','weight',0.72)),'1,4,6','物件'),
('寶石',JSON_ARRAY('珠寶','寶玉'),JSON_OBJECT('1',JSON_OBJECT('text','內在珍貴特質','weight',0.70),'3',JSON_OBJECT('text','自性內核','weight',0.70),'10',JSON_OBJECT('text','寶石原型','weight',0.76)),'1,3,10','物件'),
('錢／金錢',JSON_ARRAY('鈔票','銀紙'),JSON_OBJECT('1',JSON_OBJECT('text','自我價值','weight',0.70),'4',JSON_OBJECT('text','能量與資源','weight',0.60),'7',JSON_OBJECT('text','感受優先','weight',0.67)),'1,4,7','物件'),
('門',JSON_ARRAY('門戶'),JSON_OBJECT('1',JSON_OBJECT('text','轉換邊界','weight',0.70),'2',JSON_OBJECT('text','心靈邊界','weight',0.74),'3',JSON_OBJECT('text','意識與潛意識邊界','weight',0.75)),'1,2,3','物件'),
('鐘錶／時鐘',JSON_ARRAY('手錶'),JSON_OBJECT('1',JSON_OBJECT('text','時間壓力','weight',0.70),'5',JSON_OBJECT('text','限時焦慮','weight',0.40),'13',JSON_OBJECT('text','記憶提取','weight',0.41)),'1,5,13','物件'),
('武器',JSON_ARRAY('兵器'),JSON_OBJECT('1',JSON_OBJECT('text','攻擊性、界限','weight',0.70),'4',JSON_OBJECT('text','攻擊驅動','weight',0.60),'6',JSON_OBJECT('text','陰影力量','weight',0.72)),'1,4,6','物件'),
('書本',JSON_ARRAY('書籍'),JSON_OBJECT('1',JSON_OBJECT('text','學習、訊息','weight',0.70),'2',JSON_OBJECT('text','內在知識','weight',0.73),'14',JSON_OBJECT('text','接收內在訊息','weight',0.64)),'1,2,14','物件'),
('車輛',JSON_ARRAY('汽車','車'),JSON_OBJECT('1',JSON_OBJECT('text','自我前進','weight',0.70),'2',JSON_OBJECT('text','自我載具','weight',0.74),'7',JSON_OBJECT('text','控制權主題','weight',0.69)),'1,2,7','物件'),
('梯子',JSON_ARRAY('樓梯'),JSON_OBJECT('1',JSON_OBJECT('text','階段成長','weight',0.70),'2',JSON_OBJECT('text','心靈層級','weight',0.73),'3',JSON_OBJECT('text','向上邁進','weight',0.74)),'1,2,3','物件'),
('窗',JSON_ARRAY('窗戶'),JSON_OBJECT('1',JSON_OBJECT('text','視角、開放度','weight',0.70),'2',JSON_OBJECT('text','心靈視窗','weight',0.73),'8',JSON_OBJECT('text','意識觀察','weight',0.70)),'1,2,8','物件'),
('鎖',JSON_ARRAY('鎖頭'),JSON_OBJECT('1',JSON_OBJECT('text','封閉、秘密','weight',0.70),'3',JSON_OBJECT('text','心靈封閉','weight',0.72),'14',JSON_OBJECT('text','尋求解鎖','weight',0.62)),'1,3,14','物件'),
('劍',JSON_ARRAY('寶劍'),JSON_OBJECT('1',JSON_OBJECT('text','界限、分辨','weight',0.70),'3',JSON_OBJECT('text','劃清界限','weight',0.74),'10',JSON_OBJECT('text','劍原型','weight',0.75)),'1,3,10','物件'),
('花朵',JSON_ARRAY('花'),JSON_OBJECT('1',JSON_OBJECT('text','生命力、綻放','weight',0.70),'3',JSON_OBJECT('text','自性綻放','weight',0.73),'10',JSON_OBJECT('text','花朵原型','weight',0.74)),'1,3,10','物件'),
('種子',JSON_ARRAY(),JSON_OBJECT('1',JSON_OBJECT('text','潛能','weight',0.70),'3',JSON_OBJECT('text','潛藏原型','weight',0.72),'10',JSON_OBJECT('text','種子原型','weight',0.73)),'1,3,10','物件'),
('面具',JSON_ARRAY(),JSON_OBJECT('1',JSON_OBJECT('text','社會偽裝','weight',0.70),'4',JSON_OBJECT('text','防禦機制','weight',0.60),'6',JSON_OBJECT('text','人格面具','weight',0.75)),'1,4,6','物件'),
('棺材',JSON_ARRAY('棺木'),JSON_OBJECT('1',JSON_OBJECT('text','舊狀態結束','weight',0.70),'3',JSON_OBJECT('text','死亡重生','weight',0.77),'10',JSON_OBJECT('text','埋葬舊人格','weight',0.76)),'1,3,10','物件'),
('眼睛',JSON_ARRAY('雙眼','眼'),JSON_OBJECT('1',JSON_OBJECT('text','洞察力','weight',0.70),'3',JSON_OBJECT('text','看見真實','weight',0.70),'10',JSON_OBJECT('text','眼睛原型','weight',0.74)),'1,3,10','身體'),
('心臟',JSON_ARRAY('心'),JSON_OBJECT('1',JSON_OBJECT('text','真實情感','weight',0.70),'3',JSON_OBJECT('text','自性核心','weight',0.74),'10',JSON_OBJECT('text','心臟原型','weight',0.73)),'1,3,10','身體'),
('牙齒',JSON_ARRAY('牙'),JSON_OBJECT('1',JSON_OBJECT('text','自信、力量','weight',0.70),'4',JSON_OBJECT('text','經典夢主題','weight',0.50),'5',JSON_OBJECT('text','體感觸發','weight',0.40)),'1,4,5','身體,噩夢'),
('皮膚',JSON_ARRAY('肌膚'),JSON_OBJECT('1',JSON_OBJECT('text','自我邊界','weight',0.70),'2',JSON_OBJECT('text','心靈外層','weight',0.73),'17',JSON_OBJECT('text','邊界受傷','weight',0.69)),'1,2,17','身體'),
('頭',JSON_ARRAY('腦袋'),JSON_OBJECT('1',JSON_OBJECT('text','自我認同','weight',0.70),'2',JSON_OBJECT('text','意識中心','weight',0.73),'4',JSON_OBJECT('text','自我受損','weight',0.56)),'1,2,4','身體'),
('手',JSON_ARRAY('手掌'),JSON_OBJECT('1',JSON_OBJECT('text','行動、創造','weight',0.70),'15',JSON_OBJECT('text','抓取與給予','weight',0.67),'16',JSON_OBJECT('text','跨文化：行動能力','weight',0.58)),'1,15,16','身體'),
('腳',JSON_ARRAY('雙腳'),JSON_OBJECT('1',JSON_OBJECT('text','立足點','weight',0.70),'15',JSON_OBJECT('text','人生根基','weight',0.67),'16',JSON_OBJECT('text','前進能力','weight',0.58)),'1,15,16','身體'),
('血',JSON_ARRAY('血液'),JSON_OBJECT('1',JSON_OBJECT('text','生命力','weight',0.70),'4',JSON_OBJECT('text','生命能量','weight',0.60),'16',JSON_OBJECT('text','跨文化：生命、創傷','weight',0.58)),'1,4,16','身體'),
('骨頭',JSON_ARRAY('骨'),JSON_OBJECT('1',JSON_OBJECT('text','內在根基','weight',0.70),'15',JSON_OBJECT('text','最真實本質','weight',0.67),'16',JSON_OBJECT('text','堅固、底層','weight',0.58)),'1,15,16','身體'),
('頭髮',JSON_ARRAY('毛髮'),JSON_OBJECT('1',JSON_OBJECT('text','魅力、生命力','weight',0.70),'15',JSON_OBJECT('text','自信','weight',0.67),'19',JSON_OBJECT('text','華人夢中常連結形象','weight',0.57)),'1,15,19','身體'),
('追逐',JSON_ARRAY('被追','追趕'),JSON_OBJECT('1',JSON_OBJECT('text','逃避壓力','weight',0.70),'4',JSON_OBJECT('text','被壓抑衝動','weight',0.70),'6',JSON_OBJECT('text','陰影追趕','weight',0.76)),'1,4,6','動作,噩夢'),
('尋找東西',JSON_ARRAY('找東西','搜尋物件'),JSON_OBJECT('1',JSON_OBJECT('text','尋找失落自我','weight',0.70),'7',JSON_OBJECT('text','內在渴求','weight',0.60),'14',JSON_OBJECT('text','孵夢主題','weight',0.63)),'1,7,14','動作'),
('溺水',JSON_ARRAY('遇溺'),JSON_OBJECT('1',JSON_OBJECT('text','被情緒淹沒','weight',0.70),'4',JSON_OBJECT('text','本我過度湧入','weight',0.60),'5',JSON_OBJECT('text','呼吸體感觸發','weight',0.40)),'1,4,5','動作,噩夢'),
('墜落',JSON_ARRAY('跌落','往下掉','墮下'),JSON_OBJECT('1',JSON_OBJECT('text','失控、安全感','weight',0.70),'4',JSON_OBJECT('text','控制感崩塌','weight',0.60),'5',JSON_OBJECT('text','入睡肌抽躍','weight',0.50)),'1,4,5','動作,噩夢'),
('考試／答不出題',JSON_ARRAY('測驗','考場'),JSON_OBJECT('1',JSON_OBJECT('text','自我懷疑','weight',0.70),'5',JSON_OBJECT('text','壓力夢','weight',0.40),'20',JSON_OBJECT('text','高頻壓力夢','weight',0.65)),'1,5,20','動作,噩夢'),
('遲到',JSON_ARRAY('趕唔切'),JSON_OBJECT('1',JSON_OBJECT('text','錯過機會','weight',0.70),'15',JSON_OBJECT('text','內在錯失感','weight',0.67),'16',JSON_OBJECT('text','現代夢常見','weight',0.57)),'1,15,16','動作'),
('飛翔',JSON_ARRAY('飛'),JSON_OBJECT('1',JSON_OBJECT('text','自由、超越','weight',0.70),'3',JSON_OBJECT('text','精神向上','weight',0.70),'10',JSON_OBJECT('text','自由原型','weight',0.73)),'1,3,10','動作'),
('躲藏',JSON_ARRAY('匿藏'),JSON_OBJECT('1',JSON_OBJECT('text','逃避','weight',0.70),'15',JSON_OBJECT('text','不想面對','weight',0.67),'16',JSON_OBJECT('text','保護自己','weight',0.57)),'1,15,16','動作'),
('殺人',JSON_ARRAY('殺死'),JSON_OBJECT('1',JSON_OBJECT('text','終結舊人格','weight',0.70),'4',JSON_OBJECT('text','消除內在面向','weight',0.60),'15',JSON_OBJECT('text','結束舊狀態','weight',0.67)),'1,4,15','動作'),
('死亡',JSON_ARRAY('死','死去'),JSON_OBJECT('1',JSON_OBJECT('text','轉變','weight',0.70),'3',JSON_OBJECT('text','死亡重生','weight',0.80),'10',JSON_OBJECT('text','原型過渡','weight',0.77)),'1,3,10','動作'),
('奔跑',JSON_ARRAY('跑'),JSON_OBJECT('1',JSON_OBJECT('text','逃離或追尋','weight',0.70),'15',JSON_OBJECT('text','主動前進或逃離','weight',0.67),'16',JSON_OBJECT('text','行動強度','weight',0.57)),'1,15,16','動作'),
('迷路',JSON_ARRAY('唔識路','迷失'),JSON_OBJECT('1',JSON_OBJECT('text','方向迷惘','weight',0.70),'15',JSON_OBJECT('text','自我定位','weight',0.67),'16',JSON_OBJECT('text','過渡狀態','weight',0.57)),'1,15,16','動作'),
('受傷',JSON_ARRAY('傷口'),JSON_OBJECT('1',JSON_OBJECT('text','內心創傷','weight',0.70),'15',JSON_OBJECT('text','情緒受傷','weight',0.67),'22',JSON_OBJECT('text','創傷夢常見','weight',0.43)),'1,15,22','動作'),
('結婚',JSON_ARRAY('婚禮'),JSON_OBJECT('1',JSON_OBJECT('text','人格整合','weight',0.70),'3',JSON_OBJECT('text','陰陽整合','weight',0.80),'18',JSON_OBJECT('text','自性化','weight',0.72)),'1,3,18','動作'),
('分手',JSON_ARRAY('離開'),JSON_OBJECT('1',JSON_OBJECT('text','分離、放下','weight',0.70),'15',JSON_OBJECT('text','結束舊連結','weight',0.67),'16',JSON_OBJECT('text','分離主題','weight',0.57)),'1,15,16','動作'),
('開槍',JSON_ARRAY('射擊'),JSON_OBJECT('1',JSON_OBJECT('text','釋放攻擊','weight',0.70),'4',JSON_OBJECT('text','攻擊驅動','weight',0.60),'15',JSON_OBJECT('text','界限宣示','weight',0.67)),'1,4,15','動作'),
('被綁',JSON_ARRAY('綑綁'),JSON_OBJECT('1',JSON_OBJECT('text','行動受限','weight',0.70),'15',JSON_OBJECT('text','內心束縛','weight',0.67),'16',JSON_OBJECT('text','無法自主','weight',0.57)),'1,15,16','動作'),
('斷電',JSON_ARRAY('無電','燈滅'),JSON_OBJECT('1',JSON_OBJECT('text','失去覺察','weight',0.70),'15',JSON_OBJECT('text','看不清','weight',0.67),'16',JSON_OBJECT('text','現代意象','weight',0.57)),'1,15,16','動作'),
('洪水',JSON_ARRAY('大水'),JSON_OBJECT('1',JSON_OBJECT('text','情緒爆發','weight',0.70),'3',JSON_OBJECT('text','無意識衝擊','weight',0.80),'10',JSON_OBJECT('text','水原型','weight',0.77)),'1,3,10','動作,噩夢'),
('火災',JSON_ARRAY('起火','火'),JSON_OBJECT('1',JSON_OBJECT('text','憤怒、淨化','weight',0.70),'10',JSON_OBJECT('text','火原型','weight',0.74),'16',JSON_OBJECT('text','跨文化：毀滅與淨化','weight',0.59)),'1,10,16','動作'),
('地震',JSON_ARRAY('地動'),JSON_OBJECT('1',JSON_OBJECT('text','根基動搖','weight',0.70),'15',JSON_OBJECT('text','安全感崩塌','weight',0.67),'22',JSON_OBJECT('text','創傷夢常見','weight',0.44)),'1,15,22','動作,噩夢'),
('裸體',JSON_ARRAY('光身','赤身'),JSON_OBJECT('1',JSON_OBJECT('text','暴露、無防備','weight',0.70),'4',JSON_OBJECT('text','本我真實','weight',0.60),'16',JSON_OBJECT('text','跨文化：羞恥與真實','weight',0.59)),'1,4,16','動作')
`;

// Helper to evaluate MySQL JSON_ARRAY / JSON_OBJECT
function parseJsonArray(...args: any[]) {
  return args;
}
function parseJsonObject(...args: any[]) {
  const obj: Record<string, any> = {};
  for (let i = 0; i < args.length; i += 2) {
    obj[String(args[i])] = args[i + 1];
  }
  return obj;
}

// Transform the raw SQL tuples into JS array
const convertedTuples = rawSqlTuples
  .trim()
  .replace(/;\s*$/, '')
  .split('\n')
  .map(line => {
    line = line.trim();
    if (line.startsWith('(')) {
      line = '[' + line.slice(1);
    }
    if (line.endsWith('),')) {
      line = line.slice(0, -2) + '],';
    } else if (line.endsWith(')')) {
      line = line.slice(0, -1) + ']';
    }
    return line;
  })
  .join('\n');

const evalSafe = `
const JSON_ARRAY = (...args) => args;
const JSON_OBJECT = (...args) => {
  const obj = {};
  for (let i = 0; i < args.length; i += 2) {
    obj[String(args[i])] = args[i + 1];
  }
  return obj;
};
return [
${convertedTuples}
];
`;

const parsedRawSymbols: Array<[string, string[], any, string, string]> = new Function(evalSafe)();

console.log(`Parsed ${parsedRawSymbols.length} raw symbols from user SQL.`);

// Map into DreamSymbolRecord
const fullSymbols = parsedRawSymbols.map((item, idx) => {
  const symbol = item[0];
  const alias_list = item[1] || [];
  const book_interpret_json = item[2] || {};
  const source_ref = typeof item[3] === 'string' ? item[3] : '';
  const notes = typeof item[4] === 'string' ? item[4] : (typeof item[3] === 'string' && !item[4] ? '' : (item[4] || ''));
  
  if (!item[4]) {
    console.log(`Warning at index ${idx}:`, item);
  }

  // Calculate tag_ids strictly from userTagRules
  const tag_ids: number[] = [];
  for (const rule of userTagRules) {
    if (rule.symbols.includes(symbol)) {
      tag_ids.push(rule.tag_id);
    }
  }
  if (tag_ids.length === 0) {
    tag_ids.push(1);
  }

  return {
    symbol_id: idx + 1,
    symbol,
    alias_list,
    book_interpret_json,
    source_ref,
    notes,
    tag_ids,
  };
});

// Output TypeScript data file
const tsContent = `/**
 * DreamAstra 完整主庫數據 (22 經典著作 + 7 標籤 + ${fullSymbols.length} 權威心理意象)
 * 涵蓋榮格派、精神分析、本土意象、生理夢理論與夢工作實務
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
  book_interpret_json: Record<string, { text: string; weight: number } | string>;
  source_ref: string;
  notes: string;
  tag_ids: number[];
}

export const DREAM_BOOKS: DreamBookRecord[] = ${JSON.stringify(fullBooks, null, 2)};

export const DREAM_TAGS: DreamTagRecord[] = ${JSON.stringify(fullTags, null, 2)};

export const DREAM_SYMBOLS: DreamSymbolRecord[] = ${JSON.stringify(fullSymbols, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'server', 'dreamAstraData.ts'), tsContent, 'utf8');
console.log('✅ Updated server/dreamAstraData.ts successfully!');
