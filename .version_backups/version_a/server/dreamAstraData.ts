/**
 * DreamAstra 完整主庫數據 (22 經典著作 + 9 標籤 + 152 權威心理意象)
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

export const DREAM_BOOKS: DreamBookRecord[] = [
  {
    "book_id": 1,
    "book_name": "解夢全書",
    "title_zh": "解夢全書",
    "title_en": "",
    "book_name_en": "",
    "author": "朱建軍",
    "school": "本土意象",
    "global_weight": 0.65,
    "core_theory": "夢是個體內在心理意象的投射，重視意象對話與夢者當下生活處境，不主張吉凶預言。",
    "process": [
      "提取夢中核心意象",
      "開展意象對話",
      "連結近期現實事件",
      "給出心理啟示"
    ],
    "forbidden": [
      "照字解籤",
      "簡單斷定吉兇",
      "脫離夢者現實下定論"
    ],
    "scene_match": [
      "日常情緒夢",
      "重複夢",
      "壓力夢",
      "生活化意象夢"
    ],
    "description": "夢是個體內在心理意象的投射，重視意象對話與夢者當下生活處境，不主張吉凶預言。"
  },
  {
    "book_id": 2,
    "book_name": "榮格解夢書：夢的理論與解析",
    "title_zh": "榮格解夢書：夢的理論與解析",
    "title_en": "",
    "book_name_en": "",
    "author": "榮格",
    "school": "榮格派",
    "global_weight": 0.8,
    "core_theory": "夢來自無意識，具有補償功能；需區分個人無意識內容與集體無意識原型。",
    "process": [
      "區分個人素材與原型素材",
      "辨識夢的補償作用",
      "象徵擴充",
      "關聯自性化歷程"
    ],
    "forbidden": [
      "所有意象硬套原型",
      "忽略個人經驗",
      "把夢當預言"
    ],
    "scene_match": [
      "神話感夢",
      "原型夢",
      "轉折期夢境"
    ],
    "description": "夢來自無意識，具有補償功能；需區分個人無意識內容與集體無意識原型。"
  },
  {
    "book_id": 3,
    "book_name": "人及其象徵",
    "title_zh": "人及其象徵",
    "title_en": "Man and His Symbols",
    "book_name_en": "Man and His Symbols",
    "author": "Carl Gustav Jung",
    "school": "榮格派",
    "global_weight": 0.85,
    "core_theory": "象徵是人類共通心靈語言，原型透過夢、神話、民俗顯現。",
    "process": [
      "辨識原型象徵",
      "參考跨文化象徵",
      "對照夢者主觀感受"
    ],
    "forbidden": [
      "機械查表解夢",
      "跳過夢者主觀感受"
    ],
    "scene_match": [
      "古老神聖意象夢",
      "跨文化象徵夢"
    ],
    "description": "象徵是人類共通心靈語言，原型透過夢、神話、民俗顯現。"
  },
  {
    "book_id": 4,
    "book_name": "夢的解析",
    "title_zh": "夢的解析",
    "title_en": "The Interpretation of Dreams",
    "book_name_en": "The Interpretation of Dreams",
    "author": "Sigmund Freud",
    "school": "精神分析",
    "global_weight": 0.6,
    "core_theory": "夢是被壓抑願望的滿足；需分顯夢與隱夢，透過自由聯想拆解夢的工作機制。",
    "process": [
      "分離顯夢與隱夢",
      "自由聯想",
      "辨識凝縮、置換、象徵、二次修飾",
      "回溯早年經驗"
    ],
    "forbidden": [
      "全部意象歸為性象徵",
      "只挖童年創傷",
      "所有夢都解為願望達成"
    ],
    "scene_match": [
      "壓抑衝突夢",
      "扭曲劇情夢"
    ],
    "description": "夢是被壓抑願望的滿足；需分顯夢與隱夢，透過自由聯想拆解夢的工作機制。"
  },
  {
    "book_id": 5,
    "book_name": "夢：牛津通識讀本",
    "title_zh": "夢：牛津通識讀本",
    "title_en": "Dreaming : A Very Short Introduction",
    "book_name_en": "Dreaming : A Very Short Introduction",
    "author": "J. Allan Hobson",
    "school": "生理夢理論",
    "global_weight": 0.4,
    "core_theory": "REM睡眠期大腦隨機神經激發，心智將雜訊編織成故事；可同時保留心理意義。",
    "process": [
      "評估睡眠背景",
      "區分生理素材與心理建構",
      "拒絕超自然預測"
    ],
    "forbidden": [
      "全盤否定心理意義",
      "用生理理論取代心理解析",
      "神秘主義"
    ],
    "scene_match": [
      "混亂破碎夢",
      "睡眠品質差的夢"
    ],
    "description": "REM睡眠期大腦隨機神經激發，心智將雜訊編織成故事；可同時保留心理意義。"
  },
  {
    "book_id": 6,
    "book_name": "Inner Work",
    "title_zh": "Inner Work",
    "title_en": "Inner Work",
    "book_name_en": "Inner Work",
    "author": "Robert A. Johnson",
    "school": "榮格派",
    "global_weight": 0.75,
    "core_theory": "把榮格原型理論落實到日常夢，強調區分外在人物與內在人格面向投射。",
    "process": [
      "完整紀錄夢與感受",
      "自由聯想人物與意象",
      "區分現實人物與內在投射",
      "轉化為現實行動"
    ],
    "forbidden": [
      "只做理論不解行動",
      "把內在投射當現實他人"
    ],
    "scene_match": [
      "人物眾多的夢",
      "人際關係夢"
    ],
    "description": "把榮格原型理論落實到日常夢，強調區分外在人物與內在人格面向投射。"
  },
  {
    "book_id": 7,
    "book_name": "你是做夢大師",
    "title_zh": "你是做夢大師",
    "title_en": "Living Your Dreams",
    "book_name_en": "Living Your Dreams",
    "author": "Gayle Delaney",
    "school": "夢工作實務",
    "global_weight": 0.7,
    "core_theory": "夢屬於做夢者本人；強調主觀感受與孵夢技術，反對通用意象表硬套。",
    "process": [
      "紀錄夢境細節",
      "詢問意象對自己的意義",
      "孵夢",
      "回應現實疑問"
    ],
    "forbidden": [
      "解夢師替夢者下定義",
      "忽略個人聯想"
    ],
    "scene_match": [
      "重複夢",
      "噩夢",
      "有現實困惑的夢"
    ],
    "description": "夢屬於做夢者本人；強調主觀感受與孵夢技術，反對通用意象表硬套。"
  },
  {
    "book_id": 8,
    "book_name": "夢的工作：榮格取向實務",
    "title_zh": "夢的工作：榮格取向實務",
    "title_en": "",
    "book_name_en": "",
    "author": "James A. Hall",
    "school": "榮格派",
    "global_weight": 0.72,
    "core_theory": "榮格派臨床夢解析，重視原型與個人聯想結合。",
    "process": [
      "建立安全探索氛圍",
      "區分原型與個人經驗",
      "探索夢中人物的內在面向",
      "整合到自我認知"
    ],
    "forbidden": [
      "過度抽象化",
      "忽略夢者情緒"
    ],
    "scene_match": [
      "長期重複夢",
      "原型感強的夢"
    ],
    "description": "榮格派臨床夢解析，重視原型與個人聯想結合。"
  },
  {
    "book_id": 9,
    "book_name": "夢的力量",
    "title_zh": "夢的力量",
    "title_en": "The Power of Dreams",
    "book_name_en": "The Power of Dreams",
    "author": "Montague Ullman",
    "school": "夢工作實務",
    "global_weight": 0.68,
    "core_theory": "夢具有自我療癒傾向，團體夢工作有助於把隱隱約約的訊息變成語言。",
    "process": [
      "團體傾聽",
      "避免解釋衝動",
      "幫助夢者自己看見",
      "支持夢者行動化"
    ],
    "forbidden": [
      "搶先解釋",
      "把夢當成病理症狀"
    ],
    "scene_match": [
      "孤獨感強的夢",
      "難以說清的夢"
    ],
    "description": "夢具有自我療癒傾向，團體夢工作有助於把隱隱約約的訊息變成語言。"
  },
  {
    "book_id": 10,
    "book_name": "原型心理學",
    "title_zh": "原型心理學",
    "title_en": "The Archetypes and the Collective Unconscious",
    "book_name_en": "The Archetypes and the Collective Unconscious",
    "author": "Carl Gustav Jung",
    "school": "榮格派",
    "global_weight": 0.82,
    "core_theory": "原型是集體無意識中的先天結構，透過神話、夢、象徵顯現。",
    "process": [
      "辨識原型模式",
      "連接神話母題",
      "評估原型在當下的活躍程度"
    ],
    "forbidden": [
      "把所有意象都當原型",
      "忽略個人層次"
    ],
    "scene_match": [
      "神話母題明顯的夢"
    ],
    "description": "原型是集體無意識中的先天結構，透過神話、夢、象徵顯現。"
  },
  {
    "book_id": 11,
    "book_name": "夢、幻覺與象徵",
    "title_zh": "夢、幻覺與象徵",
    "title_en": "Dreams, Hallucinations, and Symbols",
    "book_name_en": "Dreams, Hallucinations, and Symbols",
    "author": "Edward Edinger",
    "school": "榮格派",
    "global_weight": 0.7,
    "core_theory": "夢中象徵具有轉化功能，自性化過程常透過象徵逐步展開。",
    "process": [
      "辨識轉化象徵",
      "觀察象徵序列",
      "連接人格整合"
    ],
    "forbidden": [
      "單象徵單義解讀",
      "忽略象徵變化"
    ],
    "scene_match": [
      "有明顯象徵序列的夢"
    ],
    "description": "夢中象徵具有轉化功能，自性化過程常透過象徵逐步展開。"
  },
  {
    "book_id": 12,
    "book_name": "精神分析引論",
    "title_zh": "精神分析引論",
    "title_en": "Introductory Lectures on Psycho-Analysis",
    "book_name_en": "Introductory Lectures on Psycho-Analysis",
    "author": "Sigmund Freud",
    "school": "精神分析",
    "global_weight": 0.55,
    "core_theory": "夢是精神分析理解潛意識的重要入口，需透過自由聯想接近隱夢思緒。",
    "process": [
      "自由聯想",
      "辨識壓抑",
      "分析夢的工作",
      "建立轉移關係理解"
    ],
    "forbidden": [
      "簡約化還原",
      "過早確定病因"
    ],
    "scene_match": [
      "內心衝突明顯的夢"
    ],
    "description": "夢是精神分析理解潛意識的重要入口，需透過自由聯想接近隱夢思緒。"
  },
  {
    "book_id": 13,
    "book_name": "夢的神經科學",
    "title_zh": "夢的神經科學",
    "title_en": "The Neuroscience of Sleep and Dreams",
    "book_name_en": "The Neuroscience of Sleep and Dreams",
    "author": "Robert Stickgold",
    "school": "生理夢理論",
    "global_weight": 0.42,
    "core_theory": "夢與睡眠階段、記憶鞏固、情緒處理密切相關。",
    "process": [
      "考慮睡眠結構",
      "區分記憶片段與心理意義",
      "避免玄學"
    ],
    "forbidden": [
      "否定主觀意義",
      "把夢全還原為隨機雜訊"
    ],
    "scene_match": [
      "破碎、記憶感強的夢"
    ],
    "description": "夢與睡眠階段、記憶鞏固、情緒處理密切相關。"
  },
  {
    "book_id": 14,
    "book_name": "孵夢指南",
    "title_zh": "孵夢指南",
    "title_en": "Dream Incubation",
    "book_name_en": "Dream Incubation",
    "author": "Kelly Bulkeley",
    "school": "夢工作實務",
    "global_weight": 0.66,
    "core_theory": "人可以主動向夢提出問題，引導夢境圍繞現實議題展開。",
    "process": [
      "睡前陳述問題",
      "保持開放態度",
      "醒後立即紀錄",
      "尋找象徵答案"
    ],
    "forbidden": [
      "期待字面答案",
      "過度執著特定結果"
    ],
    "scene_match": [
      "有現實疑問的夢"
    ],
    "description": "人可以主動向夢提出問題，引導夢境圍繞現實議題展開。"
  },
  {
    "book_id": 15,
    "book_name": "夢境的智慧",
    "title_zh": "夢境的智慧",
    "title_en": "The Wisdom of the Dream",
    "book_name_en": "The Wisdom of the Dream",
    "author": "Stephen Segaller",
    "school": "榮格派",
    "global_weight": 0.74,
    "core_theory": "夢不是純粹混亂，而是在試圖告訴夢者關於自己的事。",
    "process": [
      "傾聽夢的整體氛圍",
      "辨識重複主題",
      "連接當下自我狀態"
    ],
    "forbidden": [
      "只看單一意象",
      "忽略整體情緒"
    ],
    "scene_match": [
      "重複主題夢"
    ],
    "description": "夢不是純粹混亂，而是在試圖告訴夢者關於自己的事。"
  },
  {
    "book_id": 16,
    "book_name": "夢的象徵辭典",
    "title_zh": "夢的象徵辭典",
    "title_en": "Dictionary of Dream Symbols",
    "book_name_en": "Dictionary of Dream Symbols",
    "author": "Eric Ackroyd",
    "school": "綜合意象",
    "global_weight": 0.6,
    "core_theory": "夢意象有跨文化重複模式，但必須與夢者個人經驗結合。",
    "process": [
      "參考跨文化模式",
      "核對個人經驗",
      "優先夢者感受"
    ],
    "forbidden": [
      "查表式解夢",
      "忽略文化差異"
    ],
    "scene_match": [
      "常見象徵夢"
    ],
    "description": "夢意象有跨文化重複模式，但必須與夢者個人經驗結合。"
  },
  {
    "book_id": 17,
    "book_name": "夜之語言：夢的心理學",
    "title_zh": "夜之語言：夢的心理學",
    "title_en": "The Language of the Night",
    "book_name_en": "The Language of the Night",
    "author": "Marion Woodman",
    "school": "榮格派",
    "global_weight": 0.71,
    "core_theory": "夢與身體、陰性原型、創傷轉化密切相關。",
    "process": [
      "留意身體感",
      "辨識陰性原型",
      "連結創傷與轉化"
    ],
    "forbidden": [
      "忽略身體訊息",
      "只做理性分析"
    ],
    "scene_match": [
      "身體感強的夢"
    ],
    "description": "夢與身體、陰性原型、創傷轉化密切相關。"
  },
  {
    "book_id": 18,
    "book_name": "自我與原型",
    "title_zh": "自我與原型",
    "title_en": "The Self and the Archetypes",
    "book_name_en": "The Self and the Archetypes",
    "author": "Edward Edinger",
    "school": "榮格派",
    "global_weight": 0.73,
    "core_theory": "自性化是人格整合的過程，夢中常出現自性符號。",
    "process": [
      "辨識自性符號",
      "觀察人格整合程度",
      "連結生命階段"
    ],
    "forbidden": [
      "把自性化簡單視為成功",
      "忽略痛苦轉化"
    ],
    "scene_match": [
      "人生轉折夢"
    ],
    "description": "自性化是人格整合的過程，夢中常出現自性符號。"
  },
  {
    "book_id": 19,
    "book_name": "睡眠與夢心理學",
    "title_zh": "睡眠與夢心理學",
    "title_en": "",
    "book_name_en": "",
    "author": "高宜安",
    "school": "本土意象",
    "global_weight": 0.58,
    "core_theory": "華人夢境有其文化特殊性，需結合本土生活經驗理解。",
    "process": [
      "考慮文化背景",
      "連結家庭關係",
      "區分文化聯想與個人聯想"
    ],
    "forbidden": [
      "全盤套用西方象徵",
      "忽略華人家庭議題"
    ],
    "scene_match": [
      "家庭、祖輩、文化意象明顯的夢"
    ],
    "description": "華人夢境有其文化特殊性，需結合本土生活經驗理解。"
  },
  {
    "book_id": 20,
    "book_name": "夢的故事",
    "title_zh": "夢的故事",
    "title_en": "Dream Stories",
    "book_name_en": "Dream Stories",
    "author": "Patricia Garfield",
    "school": "夢工作實務",
    "global_weight": 0.67,
    "core_theory": "噩夢可以被重新講述，重複夢往往是未被處理訊息的提醒。",
    "process": [
      "紀錄重複模式",
      "重新敘事",
      "把恐懼變成可處理訊息"
    ],
    "forbidden": [
      "把噩夢當純預兆",
      "強壓恐懼"
    ],
    "scene_match": [
      "重複噩夢"
    ],
    "description": "噩夢可以被重新講述，重複夢往往是未被處理訊息的提醒。"
  },
  {
    "book_id": 21,
    "book_name": "潛意識的發現",
    "title_zh": "潛意識的發現",
    "title_en": "The Discovery of the Unconscious",
    "book_name_en": "The Discovery of the Unconscious",
    "author": "Henri Ellenberger",
    "school": "精神分析",
    "global_weight": 0.52,
    "core_theory": "夢解析思想有其歷史源流，精神分析只是其中一支。",
    "process": [
      "避免單一學派獨斷",
      "保持方法論自覺"
    ],
    "forbidden": [
      "把所有夢都精神分析化"
    ],
    "scene_match": [
      "學派綜合評估"
    ],
    "description": "夢解析思想有其歷史源流，精神分析只是其中一支。"
  },
  {
    "book_id": 22,
    "book_name": "夢與創傷",
    "title_zh": "夢與創傷",
    "title_en": "Dreams and Trauma",
    "book_name_en": "Dreams and Trauma",
    "author": "Deirdre Barrett",
    "school": "生理夢理論",
    "global_weight": 0.45,
    "core_theory": "創傷夢具有重複性，是大腦試圖處理未完成創傷的訊號。",
    "process": [
      "辨識創傷重複",
      "區分創傷再現與整合夢",
      "必要時建議專業協助"
    ],
    "forbidden": [
      "輕率解讀創傷夢",
      "鼓勵危險自我處理"
    ],
    "scene_match": [
      "創傷重複夢"
    ],
    "description": "創傷夢具有重複性，是大腦試圖處理未完成創傷的訊號。"
  }
];

export const DREAM_TAGS: DreamTagRecord[] = [
  {
    "tag_id": 1,
    "tag_name": "人物",
    "tag_desc": "夢中人物與原型投射"
  },
  {
    "tag_id": 2,
    "tag_name": "動物",
    "tag_desc": "動物意象與本能象徵"
  },
  {
    "tag_id": 3,
    "tag_name": "場景",
    "tag_desc": "夢境空間環境與場域"
  },
  {
    "tag_id": 4,
    "tag_name": "身體",
    "tag_desc": "身體部位與生理感覺"
  },
  {
    "tag_id": 5,
    "tag_name": "動作",
    "tag_desc": "夢中行為、互動與動態事件"
  },
  {
    "tag_id": 6,
    "tag_name": "噩夢",
    "tag_desc": "高頻焦慮、驚恐與創傷性主題"
  },
  {
    "tag_id": 7,
    "tag_name": "物件",
    "tag_desc": "象徵器具、符號與道具"
  },
  {
    "tag_id": 8,
    "tag_name": "自然物象",
    "tag_desc": "天象、氣候、地質與自然元素"
  },
  {
    "tag_id": 9,
    "tag_name": "香港本土場景",
    "tag_desc": "港式本土場景、在地集體記憶與民間意象"
  }
];

export const DREAM_SYMBOLS: DreamSymbolRecord[] = [
  {
    "symbol_id": 1,
    "symbol": "祖母",
    "alias_list": [
      "祖母",
      "嫲嫲",
      "奶奶",
      "外婆",
      "姥姥",
      "阿婆",
      "婆婆"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "象徵庇護、舊時情感、內心母性原型",
        "weight": 0.7
      },
      "3": {
        "text": "大母神原型",
        "weight": 0.8
      },
      "10": {
        "text": "正向大母神：滋養、包容",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "象徵庇護、舊時情感、內心母性原型",
        "weight": 0.7
      },
      "3": {
        "text": "大母神原型",
        "weight": 0.8
      },
      "10": {
        "text": "正向大母神：滋養、包容",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 2,
    "symbol": "祖父",
    "alias_list": [
      "祖父",
      "爺爺",
      "爷爷",
      "阿公",
      "外公",
      "老爺",
      "老爷",
      "阿爺",
      "阿爷"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "代表權威、經驗、精神指引",
        "weight": 0.7
      },
      "3": {
        "text": "智慧老人原型",
        "weight": 0.8
      },
      "10": {
        "text": "智慧老人原型",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "1": {
        "text": "代表權威、經驗、精神指引",
        "weight": 0.7
      },
      "3": {
        "text": "智慧老人原型",
        "weight": 0.8
      },
      "10": {
        "text": "智慧老人原型",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 3,
    "symbol": "小偷",
    "alias_list": [
      "小偷",
      "賊",
      "贼",
      "盜賊",
      "盗贼",
      "扒手",
      "竊賊",
      "窃贼"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "恐懼失去、被壓抑慾望",
        "weight": 0.6
      },
      "4": {
        "text": "本我衝動外化",
        "weight": 0.7
      },
      "6": {
        "text": "陰影原型",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "恐懼失去、被壓抑慾望",
        "weight": 0.6
      },
      "4": {
        "text": "本我衝動外化",
        "weight": 0.7
      },
      "6": {
        "text": "陰影原型",
        "weight": 0.76
      }
    },
    "source_ref": "1,4,6",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 4,
    "symbol": "流浪漢",
    "alias_list": [
      "流浪漢",
      "流浪汉",
      "流浪人",
      "乞丐",
      "露宿者",
      "無家者",
      "无家者"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "被遺棄的自我部分",
        "weight": 0.7
      },
      "6": {
        "text": "陰影原型",
        "weight": 0.8
      },
      "8": {
        "text": "未整合人格碎片",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "被遺棄的自我部分",
        "weight": 0.7
      },
      "6": {
        "text": "陰影原型",
        "weight": 0.8
      },
      "8": {
        "text": "未整合人格碎片",
        "weight": 0.71
      }
    },
    "source_ref": "1,6,8",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 5,
    "symbol": "女巫",
    "alias_list": [
      "女巫",
      "巫婆",
      "巫女",
      "妖婆"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "陰性陰影、直覺、操縱感",
        "weight": 0.7
      },
      "3": {
        "text": "負面大母神原型",
        "weight": 0.8
      },
      "10": {
        "text": "負面大母神",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "陰性陰影、直覺、操縱感",
        "weight": 0.7
      },
      "3": {
        "text": "負面大母神原型",
        "weight": 0.8
      },
      "10": {
        "text": "負面大母神",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 6,
    "symbol": "醫生",
    "alias_list": [
      "醫生",
      "医生",
      "醫師",
      "医师",
      "大夫",
      "心理醫生",
      "心理医生"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在療癒者、修復渴望",
        "weight": 0.7
      },
      "3": {
        "text": "療癒者原型",
        "weight": 0.8
      },
      "8": {
        "text": "心靈自我修復象徵",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "內在療癒者、修復渴望",
        "weight": 0.7
      },
      "3": {
        "text": "療癒者原型",
        "weight": 0.8
      },
      "8": {
        "text": "心靈自我修復象徵",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,8",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 7,
    "symbol": "小孩",
    "alias_list": [
      "小孩",
      "孩童",
      "細路",
      "细路",
      "小朋友",
      "兒童",
      "儿童",
      "嬰孩",
      "婴孩"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在孩童、初心與脆弱",
        "weight": 0.7
      },
      "3": {
        "text": "內在孩童原型",
        "weight": 0.8
      },
      "10": {
        "text": "新生潛能與脆弱整合",
        "weight": 0.79
      }
    },
    "book_interpret": {
      "1": {
        "text": "內在孩童、初心與脆弱",
        "weight": 0.7
      },
      "3": {
        "text": "內在孩童原型",
        "weight": 0.8
      },
      "10": {
        "text": "新生潛能與脆弱整合",
        "weight": 0.79
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 8,
    "symbol": "敵人",
    "alias_list": [
      "敵人",
      "敌人",
      "仇敵",
      "仇敌",
      "對手",
      "对手",
      "仇人"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內心陰影投射、對抗焦慮",
        "weight": 0.7
      },
      "6": {
        "text": "陰影投射",
        "weight": 0.8
      },
      "8": {
        "text": "未整合的人格面向",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "內心陰影投射、對抗焦慮",
        "weight": 0.7
      },
      "6": {
        "text": "陰影投射",
        "weight": 0.8
      },
      "8": {
        "text": "未整合的人格面向",
        "weight": 0.73
      }
    },
    "source_ref": "1,6,8",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 9,
    "symbol": "司機",
    "alias_list": [
      "司機",
      "司机",
      "駕駛員",
      "驾驶员",
      "開車的人",
      "开车的人",
      "司機師傅",
      "司机师傅"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生方向掌控者、主導意志",
        "weight": 0.7
      },
      "2": {
        "text": "意識或無意識的掌控狀態",
        "weight": 0.76
      },
      "7": {
        "text": "控制權爭奪與信賴主題",
        "weight": 0.69
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生方向掌控者、主導意志",
        "weight": 0.7
      },
      "2": {
        "text": "意識或無意識的掌控狀態",
        "weight": 0.76
      },
      "7": {
        "text": "控制權爭奪與信賴主題",
        "weight": 0.69
      }
    },
    "source_ref": "1,2,7",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 10,
    "symbol": "聖者／隱士",
    "alias_list": [
      "聖者／隱士",
      "圣者／隐士",
      "聖者",
      "圣者",
      "隱士",
      "隐士",
      "聖人",
      "圣人",
      "智者",
      "高僧",
      "道士"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在智慧指引、超然獨處",
        "weight": 0.7
      },
      "3": {
        "text": "智慧老人原型",
        "weight": 0.8
      },
      "10": {
        "text": "智慧老人與超越功能",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "1": {
        "text": "內在智慧指引、超然獨處",
        "weight": 0.7
      },
      "3": {
        "text": "智慧老人原型",
        "weight": 0.8
      },
      "10": {
        "text": "智慧老人與超越功能",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 11,
    "symbol": "父親",
    "alias_list": [
      "父親",
      "父亲",
      "爸爸",
      "老豆",
      "爹哋",
      "老爹"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "秩序與社會法則、認同與審查",
        "weight": 0.7
      },
      "3": {
        "text": "父性原型與精神權威",
        "weight": 0.82
      },
      "4": {
        "text": "超我監督者與道德規範",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "秩序與社會法則、認同與審查",
        "weight": 0.7
      },
      "3": {
        "text": "父性原型與精神權威",
        "weight": 0.82
      },
      "4": {
        "text": "超我監督者與道德規範",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,4",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 12,
    "symbol": "母親",
    "alias_list": [
      "母親",
      "母亲",
      "媽媽",
      "妈妈",
      "阿媽",
      "阿妈",
      "媽咪",
      "妈咪",
      "娘親",
      "娘亲"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "滋養庇護與原生安全感、情感牽絆",
        "weight": 0.72
      },
      "3": {
        "text": "大母神原型、包容與吞噬兩面性",
        "weight": 0.84
      },
      "10": {
        "text": "母性無意識、生命滋育之源",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "1": {
        "text": "滋養庇護與原生安全感、情感牽絆",
        "weight": 0.72
      },
      "3": {
        "text": "大母神原型、包容與吞噬兩面性",
        "weight": 0.84
      },
      "10": {
        "text": "母性無意識、生命滋育之源",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 13,
    "symbol": "陌生人",
    "alias_list": [
      "陌生人",
      "路人",
      "陌生男子",
      "陌生女子",
      "未知的人"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "2": {
        "text": "未被意識化的未知人格片段",
        "weight": 0.75
      },
      "3": {
        "text": "阿尼瑪或阿尼姆斯的初級投射",
        "weight": 0.78
      },
      "6": {
        "text": "潛在陰影或未開發心靈特質",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "2": {
        "text": "未被意識化的未知人格片段",
        "weight": 0.75
      },
      "3": {
        "text": "阿尼瑪或阿尼姆斯的初級投射",
        "weight": 0.78
      },
      "6": {
        "text": "潛在陰影或未開發心靈特質",
        "weight": 0.72
      }
    },
    "source_ref": "2,3,6",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 14,
    "symbol": "前任",
    "alias_list": [
      "前任",
      "前男友",
      "前女友",
      "前夫",
      "前妻",
      "舊情人",
      "旧情人"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "4": {
        "text": "未竟的情感遺憾與壓抑慾望",
        "weight": 0.7
      },
      "8": {
        "text": "心靈情結未整合之投射載體",
        "weight": 0.73
      },
      "15": {
        "text": "對過去親密連結模式的反思",
        "weight": 0.68
      }
    },
    "book_interpret": {
      "4": {
        "text": "未竟的情感遺憾與壓抑慾望",
        "weight": 0.7
      },
      "8": {
        "text": "心靈情結未整合之投射載體",
        "weight": 0.73
      },
      "15": {
        "text": "對過去親密連結模式的反思",
        "weight": 0.68
      }
    },
    "source_ref": "4,8,15",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 15,
    "symbol": "嬰兒",
    "alias_list": [
      "嬰兒",
      "婴儿",
      "初生嬰兒",
      "初生婴儿",
      "BB",
      "赤子",
      "小寶寶",
      "小宝宝",
      "小嬰兒",
      "小婴儿"
    ],
    "tags": [
      "人物原型"
    ],
    "book_interpret_json": {
      "2": {
        "text": "新生自我與自性化初始萌芽",
        "weight": 0.76
      },
      "3": {
        "text": "神聖孩童原型、無窮可能性",
        "weight": 0.81
      },
      "10": {
        "text": "需要悉心呵護的全新心靈狀態",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "2": {
        "text": "新生自我與自性化初始萌芽",
        "weight": 0.76
      },
      "3": {
        "text": "神聖孩童原型、無窮可能性",
        "weight": 0.81
      },
      "10": {
        "text": "需要悉心呵護的全新心靈狀態",
        "weight": 0.77
      }
    },
    "source_ref": "2,3,10",
    "notes": "人物原型",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 16,
    "symbol": "太陽",
    "alias_list": [
      "太陽",
      "太阳",
      "日光",
      "日頭",
      "日头",
      "朝陽",
      "朝阳",
      "烈日",
      "夕陽",
      "夕阳",
      "陽光",
      "阳光"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "2": {
        "text": "意識的主導之光、理智與明晰",
        "weight": 0.78
      },
      "3": {
        "text": "自性（Self）的崇高象徵",
        "weight": 0.83
      },
      "10": {
        "text": "陽性創造原則、驅散無意識迷霧",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "2": {
        "text": "意識的主導之光、理智與明晰",
        "weight": 0.78
      },
      "3": {
        "text": "自性（Self）的崇高象徵",
        "weight": 0.83
      },
      "10": {
        "text": "陽性創造原則、驅散無意識迷霧",
        "weight": 0.76
      }
    },
    "source_ref": "2,3,10",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 17,
    "symbol": "月亮",
    "alias_list": [
      "月亮",
      "月",
      "月球",
      "月光",
      "滿月",
      "满月",
      "殘月",
      "残月",
      "新月",
      "血月"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "2": {
        "text": "潛意識情緒潮汐、直覺與靈感",
        "weight": 0.79
      },
      "3": {
        "text": "陰性本質與阿尼瑪心靈映照",
        "weight": 0.82
      },
      "6": {
        "text": "無意識幽微面貌、夜間心靈漫遊",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "2": {
        "text": "潛意識情緒潮汐、直覺與靈感",
        "weight": 0.79
      },
      "3": {
        "text": "陰性本質與阿尼瑪心靈映照",
        "weight": 0.82
      },
      "6": {
        "text": "無意識幽微面貌、夜間心靈漫遊",
        "weight": 0.75
      }
    },
    "source_ref": "2,3,6",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 18,
    "symbol": "星星",
    "alias_list": [
      "星星",
      "星",
      "星空",
      "流星",
      "恆星",
      "恒星",
      "銀河",
      "银河",
      "星座"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "3": {
        "text": "超個人命運指引、茫茫夜色中的希望",
        "weight": 0.8
      },
      "10": {
        "text": "無意識星群、多重原型靈光乍現",
        "weight": 0.77
      },
      "16": {
        "text": "跨文化中神聖守護與心靈座標",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "3": {
        "text": "超個人命運指引、茫茫夜色中的希望",
        "weight": 0.8
      },
      "10": {
        "text": "無意識星群、多重原型靈光乍現",
        "weight": 0.77
      },
      "16": {
        "text": "跨文化中神聖守護與心靈座標",
        "weight": 0.72
      }
    },
    "source_ref": "3,10,16",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 19,
    "symbol": "彩虹",
    "alias_list": [
      "彩虹",
      "虹",
      "彩雲",
      "彩云",
      "虹霓",
      "雨後彩虹",
      "雨后彩虹",
      "天邊彩虹",
      "天边彩虹"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "暴風雨後的平靜、創傷修復的契機",
        "weight": 0.72
      },
      "3": {
        "text": "意識與無意識天地相通的和解橋樑",
        "weight": 0.81
      },
      "16": {
        "text": "希望與整合的跨文化神聖契約",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "暴風雨後的平靜、創傷修復的契機",
        "weight": 0.72
      },
      "3": {
        "text": "意識與無意識天地相通的和解橋樑",
        "weight": 0.81
      },
      "16": {
        "text": "希望與整合的跨文化神聖契約",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,16",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 20,
    "symbol": "雷電／閃電",
    "alias_list": [
      "雷電／閃電",
      "雷电／闪电",
      "雷電",
      "雷电",
      "閃電",
      "闪电",
      "打雷",
      "雷聲",
      "雷声",
      "霹靂",
      "霹雳",
      "雷暴"
    ],
    "tags": [
      "自然物象",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "2": {
        "text": "意識突如其來的頓悟、直覺靈光",
        "weight": 0.76
      },
      "9": {
        "text": "潛在創傷壓力與受驚嚇的神經反應",
        "weight": 0.71
      },
      "10": {
        "text": "天神憤怒原型、壓抑情緒的破土爆發",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "2": {
        "text": "意識突如其來的頓悟、直覺靈光",
        "weight": 0.76
      },
      "9": {
        "text": "潛在創傷壓力與受驚嚇的神經反應",
        "weight": 0.71
      },
      "10": {
        "text": "天神憤怒原型、壓抑情緒的破土爆發",
        "weight": 0.78
      }
    },
    "source_ref": "2,9,10",
    "notes": "自然物象",
    "tag_ids": [
      8,
      6
    ]
  },
  {
    "symbol_id": 21,
    "symbol": "暴風雨／颱風",
    "alias_list": [
      "暴風雨／颱風",
      "暴风雨／台风",
      "暴風雨",
      "暴风雨",
      "颱風",
      "台风",
      "打風",
      "打风",
      "颶風",
      "飓风",
      "狂風暴雨",
      "狂风暴雨",
      "十號風球",
      "十号风球"
    ],
    "tags": [
      "自然物象",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生活環境壓倒性壓力、無力掌控感",
        "weight": 0.73
      },
      "9": {
        "text": "強烈情緒激盪與防禦機制瓦解危機",
        "weight": 0.75
      },
      "20": {
        "text": "焦慮噩夢中極為高頻的邊界失守象徵",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "生活環境壓倒性壓力、無力掌控感",
        "weight": 0.73
      },
      "9": {
        "text": "強烈情緒激盪與防禦機制瓦解危機",
        "weight": 0.75
      },
      "20": {
        "text": "焦慮噩夢中極為高頻的邊界失守象徵",
        "weight": 0.72
      }
    },
    "source_ref": "1,9,20",
    "notes": "自然物象",
    "tag_ids": [
      8,
      6
    ]
  },
  {
    "symbol_id": 22,
    "symbol": "雪／冰雪",
    "alias_list": [
      "雪／冰雪",
      "雪",
      "冰雪",
      "下雪",
      "積雪",
      "积雪",
      "暴風雪",
      "暴风雪",
      "結冰",
      "结冰",
      "冰山"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "感情冰凍、心理距離與孤獨疏離感",
        "weight": 0.7
      },
      "7": {
        "text": "未被表達的冰封感受、壓抑的熱情",
        "weight": 0.74
      },
      "16": {
        "text": "冬眠沈澱、靜待春暖復甦的轉化期",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "感情冰凍、心理距離與孤獨疏離感",
        "weight": 0.7
      },
      "7": {
        "text": "未被表達的冰封感受、壓抑的熱情",
        "weight": 0.74
      },
      "16": {
        "text": "冬眠沈澱、靜待春暖復甦的轉化期",
        "weight": 0.71
      }
    },
    "source_ref": "1,7,16",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 23,
    "symbol": "火／烈火",
    "alias_list": [
      "火／烈火",
      "火",
      "烈火",
      "火光",
      "大火",
      "燃燒",
      "燃烧",
      "火焰",
      "篝火"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "激情、狂熱與難以壓制的憤怒衝動",
        "weight": 0.72
      },
      "3": {
        "text": "心理煉金術中的轉化之火、淨化過程",
        "weight": 0.81
      },
      "16": {
        "text": "毀滅舊事物以騰出新生空間的偉力",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "激情、狂熱與難以壓制的憤怒衝動",
        "weight": 0.72
      },
      "3": {
        "text": "心理煉金術中的轉化之火、淨化過程",
        "weight": 0.81
      },
      "16": {
        "text": "毀滅舊事物以騰出新生空間的偉力",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,16",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 24,
    "symbol": "雲／烏雲",
    "alias_list": [
      "雲／烏雲",
      "云／乌云",
      "雲",
      "云",
      "烏雲",
      "乌云",
      "黑雲",
      "黑云",
      "密雲",
      "密云",
      "白雲",
      "白云",
      "雲層",
      "云层"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "心頭籠罩的疑慮、憂鬱與焦慮陰影",
        "weight": 0.7
      },
      "5": {
        "text": "思想飄忽不定的流動狀態",
        "weight": 0.68
      },
      "16": {
        "text": "遮蔽真相的幻象、等待日光穿透",
        "weight": 0.69
      }
    },
    "book_interpret": {
      "1": {
        "text": "心頭籠罩的疑慮、憂鬱與焦慮陰影",
        "weight": 0.7
      },
      "5": {
        "text": "思想飄忽不定的流動狀態",
        "weight": 0.68
      },
      "16": {
        "text": "遮蔽真相的幻象、等待日光穿透",
        "weight": 0.69
      }
    },
    "source_ref": "1,5,16",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 25,
    "symbol": "霧",
    "alias_list": [
      "霧",
      "雾",
      "大霧",
      "大雾",
      "濃霧",
      "浓雾",
      "薄霧",
      "薄雾",
      "迷霧",
      "迷雾"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "2": {
        "text": "意識與無意識交界處的迷茫困局",
        "weight": 0.74
      },
      "7": {
        "text": "缺乏邊界感、自我認知模糊未定型",
        "weight": 0.72
      },
      "15": {
        "text": "人生方向暫時失去清晰視角的過渡期",
        "weight": 0.7
      }
    },
    "book_interpret": {
      "2": {
        "text": "意識與無意識交界處的迷茫困局",
        "weight": 0.74
      },
      "7": {
        "text": "缺乏邊界感、自我認知模糊未定型",
        "weight": 0.72
      },
      "15": {
        "text": "人生方向暫時失去清晰視角的過渡期",
        "weight": 0.7
      }
    },
    "source_ref": "2,7,15",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 26,
    "symbol": "瀑布",
    "alias_list": [
      "瀑布",
      "水瀑",
      "飛瀑",
      "飞瀑",
      "水簾",
      "水帘"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "情緒劇烈傾瀉、不可逆的心靈衝擊",
        "weight": 0.71
      },
      "3": {
        "text": "潛意識能量由高處向深處極速轉化",
        "weight": 0.78
      },
      "8": {
        "text": "壓抑已久的話語或情感勢不可擋",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "情緒劇烈傾瀉、不可逆的心靈衝擊",
        "weight": 0.71
      },
      "3": {
        "text": "潛意識能量由高處向深處極速轉化",
        "weight": 0.78
      },
      "8": {
        "text": "壓抑已久的話語或情感勢不可擋",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,8",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 27,
    "symbol": "大地／泥土",
    "alias_list": [
      "大地／泥土",
      "大地",
      "泥土",
      "土地",
      "土壤",
      "地面",
      "泥濘",
      "泥泞"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "現實安全感的根基、踏實落地的承托",
        "weight": 0.72
      },
      "3": {
        "text": "母性大地原型、孕育萬物之基質",
        "weight": 0.8
      },
      "10": {
        "text": "身心回歸本質的扎根力量",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "現實安全感的根基、踏實落地的承托",
        "weight": 0.72
      },
      "3": {
        "text": "母性大地原型、孕育萬物之基質",
        "weight": 0.8
      },
      "10": {
        "text": "身心回歸本質的扎根力量",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 28,
    "symbol": "泉水／水井",
    "alias_list": [
      "泉水／水井",
      "泉水",
      "水井",
      "泉眼",
      "湧泉",
      "涌泉",
      "古井",
      "深井"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "2": {
        "text": "潛意識深處源源不絕的滋養與靈感",
        "weight": 0.77
      },
      "3": {
        "text": "智慧與真知之泉、自性源泉",
        "weight": 0.81
      },
      "10": {
        "text": "向內探求所觸及的最清澈心理本能",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "2": {
        "text": "潛意識深處源源不絕的滋養與靈感",
        "weight": 0.77
      },
      "3": {
        "text": "智慧與真知之泉、自性源泉",
        "weight": 0.81
      },
      "10": {
        "text": "向內探求所觸及的最清澈心理本能",
        "weight": 0.75
      }
    },
    "source_ref": "2,3,10",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 29,
    "symbol": "樹木／大樹",
    "alias_list": [
      "樹木／大樹",
      "树木／大树",
      "樹木",
      "树木",
      "大樹",
      "大树",
      "森林之樹",
      "森林之树",
      "古樹",
      "古树",
      "枯樹",
      "枯树",
      "神木"
    ],
    "tags": [
      "自然物象"
    ],
    "book_interpret_json": {
      "2": {
        "text": "自性化歷程的活生生象徵、個體生命之樹",
        "weight": 0.8
      },
      "3": {
        "text": "向下扎根深層無意識、向上枝展意識天空",
        "weight": 0.84
      },
      "10": {
        "text": "人格成長、堅韌不拔與時間的累積",
        "weight": 0.79
      }
    },
    "book_interpret": {
      "2": {
        "text": "自性化歷程的活生生象徵、個體生命之樹",
        "weight": 0.8
      },
      "3": {
        "text": "向下扎根深層無意識、向上枝展意識天空",
        "weight": 0.84
      },
      "10": {
        "text": "人格成長、堅韌不拔與時間的累積",
        "weight": 0.79
      }
    },
    "source_ref": "2,3,10",
    "notes": "自然物象",
    "tag_ids": [
      8
    ]
  },
  {
    "symbol_id": 30,
    "symbol": "鹿",
    "alias_list": [
      "鹿",
      "雄鹿",
      "小鹿",
      "梅花鹿"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "靈敏、純真、溫和本能追求",
        "weight": 0.7
      },
      "3": {
        "text": "柔和本能與心靈引導者",
        "weight": 0.6
      },
      "10": {
        "text": "溫和本能原型",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "靈敏、純真、溫和本能追求",
        "weight": 0.7
      },
      "3": {
        "text": "柔和本能與心靈引導者",
        "weight": 0.6
      },
      "10": {
        "text": "溫和本能原型",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 31,
    "symbol": "貓",
    "alias_list": [
      "貓",
      "猫",
      "野貓",
      "野猫",
      "家貓",
      "家猫",
      "貓咪",
      "猫咪",
      "花貓",
      "花猫",
      "黑貓",
      "黑猫",
      "白貓",
      "白猫"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "直覺、敏銳、獨立邊界",
        "weight": 0.7
      },
      "3": {
        "text": "陰性本能與神祕心靈連結",
        "weight": 0.6
      },
      "10": {
        "text": "獨立本能原型、保護私密自主空間",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "直覺、敏銳、獨立邊界",
        "weight": 0.7
      },
      "3": {
        "text": "陰性本能與神祕心靈連結",
        "weight": 0.6
      },
      "10": {
        "text": "獨立本能原型、保護私密自主空間",
        "weight": 0.71
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 32,
    "symbol": "孔雀",
    "alias_list": [
      "孔雀",
      "雄孔雀",
      "孔雀開屏",
      "孔雀开屏"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "虛榮展現或自性光彩散發",
        "weight": 0.6
      },
      "15": {
        "text": "自我呈現與渴求他人注視",
        "weight": 0.66
      },
      "16": {
        "text": "跨文化象徵：自性完美與斑斕生命力",
        "weight": 0.58
      }
    },
    "book_interpret": {
      "1": {
        "text": "虛榮展現或自性光彩散發",
        "weight": 0.6
      },
      "15": {
        "text": "自我呈現與渴求他人注視",
        "weight": 0.66
      },
      "16": {
        "text": "跨文化象徵：自性完美與斑斕生命力",
        "weight": 0.58
      }
    },
    "source_ref": "1,15,16",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 33,
    "symbol": "綿羊",
    "alias_list": [
      "綿羊",
      "绵羊",
      "羊",
      "羊羣",
      "羊群",
      "羔羊"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "順從群體、溫馴犧牲、缺乏主見",
        "weight": 0.6
      },
      "15": {
        "text": "渴望群體歸屬與被接納的安全感",
        "weight": 0.65
      },
      "16": {
        "text": "溫順與無防備心理防線",
        "weight": 0.57
      }
    },
    "book_interpret": {
      "1": {
        "text": "順從群體、溫馴犧牲、缺乏主見",
        "weight": 0.6
      },
      "15": {
        "text": "渴望群體歸屬與被接納的安全感",
        "weight": 0.65
      },
      "16": {
        "text": "溫順與無防備心理防線",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 34,
    "symbol": "蝙蝠",
    "alias_list": [
      "蝙蝠",
      "蝠"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "黑暗感知、恐懼未知、回聲定位直覺",
        "weight": 0.6
      },
      "7": {
        "text": "在盲目環境中仰賴個人深層直覺生存",
        "weight": 0.65
      },
      "16": {
        "text": "文化雙重性：西方恐懼陰影 vs 東方福氣",
        "weight": 0.59
      }
    },
    "book_interpret": {
      "1": {
        "text": "黑暗感知、恐懼未知、回聲定位直覺",
        "weight": 0.6
      },
      "7": {
        "text": "在盲目環境中仰賴個人深層直覺生存",
        "weight": 0.65
      },
      "16": {
        "text": "文化雙重性：西方恐懼陰影 vs 東方福氣",
        "weight": 0.59
      }
    },
    "source_ref": "1,7,16",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 35,
    "symbol": "狼",
    "alias_list": [
      "狼",
      "野狼",
      "狼羣",
      "狼群",
      "孤狼"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "野性生存力量、原始本能活力",
        "weight": 0.7
      },
      "3": {
        "text": "未馴服的原始心靈衝動",
        "weight": 0.7
      },
      "10": {
        "text": "野生本能原型、忠於群體或獨立孤傲",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "野性生存力量、原始本能活力",
        "weight": 0.7
      },
      "3": {
        "text": "未馴服的原始心靈衝動",
        "weight": 0.7
      },
      "10": {
        "text": "野生本能原型、忠於群體或獨立孤傲",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 36,
    "symbol": "馬",
    "alias_list": [
      "馬",
      "马",
      "野馬",
      "野马",
      "駿馬",
      "骏马",
      "白馬",
      "白马",
      "黑馬",
      "黑马"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "強盛生命力、向目標奔騰的動能",
        "weight": 0.7
      },
      "3": {
        "text": "身體本能與能量載具",
        "weight": 0.7
      },
      "10": {
        "text": "本能奔馳原型、意識與軀體協同",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "強盛生命力、向目標奔騰的動能",
        "weight": 0.7
      },
      "3": {
        "text": "身體本能與能量載具",
        "weight": 0.7
      },
      "10": {
        "text": "本能奔馳原型、意識與軀體協同",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 37,
    "symbol": "蛇",
    "alias_list": [
      "蛇",
      "大蛇",
      "毒蛇",
      "青蛇",
      "白蛇",
      "蟒蛇"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "轉化蛻變、深層慾望與自我修復",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生原型與自性化守護神",
        "weight": 0.8
      },
      "4": {
        "text": "原始本能衝動與性心理驅力",
        "weight": 0.6
      }
    },
    "book_interpret": {
      "1": {
        "text": "轉化蛻變、深層慾望與自我修復",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生原型與自性化守護神",
        "weight": 0.8
      },
      "4": {
        "text": "原始本能衝動與性心理驅力",
        "weight": 0.6
      }
    },
    "source_ref": "1,3,4",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 38,
    "symbol": "鷹",
    "alias_list": [
      "鷹",
      "鹰",
      "雄鷹",
      "雄鹰",
      "老鷹",
      "老鹰",
      "獵鷹",
      "猎鹰"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "高層遠見、洞察全局的超拔視角",
        "weight": 0.7
      },
      "3": {
        "text": "精神超越原型、凌空俯瞰人生",
        "weight": 0.8
      },
      "10": {
        "text": "理智凌越情感的清澈認知",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "高層遠見、洞察全局的超拔視角",
        "weight": 0.7
      },
      "3": {
        "text": "精神超越原型、凌空俯瞰人生",
        "weight": 0.8
      },
      "10": {
        "text": "理智凌越情感的清澈認知",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 39,
    "symbol": "老鼠",
    "alias_list": [
      "老鼠",
      "鼠",
      "耗子",
      "小老鼠"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "微小侵蝕焦慮、瑣碎生存煩惱",
        "weight": 0.6
      },
      "16": {
        "text": "隱匿未被察覺的底層壓力威脅",
        "weight": 0.57
      },
      "19": {
        "text": "華人夢境常見的日常小擔憂投射",
        "weight": 0.56
      }
    },
    "book_interpret": {
      "1": {
        "text": "微小侵蝕焦慮、瑣碎生存煩惱",
        "weight": 0.6
      },
      "16": {
        "text": "隱匿未被察覺的底層壓力威脅",
        "weight": 0.57
      },
      "19": {
        "text": "華人夢境常見的日常小擔憂投射",
        "weight": 0.56
      }
    },
    "source_ref": "1,16,19",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 40,
    "symbol": "龍",
    "alias_list": [
      "龍",
      "龙",
      "神龍",
      "神龙",
      "巨龍",
      "巨龙",
      "青龍",
      "青龙",
      "金龍",
      "金龙",
      "黑龍",
      "黑龙",
      "龍王",
      "龙王"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "3": {
        "text": "潛意識巨大能量結晶、自性整合的終極考驗",
        "weight": 0.83
      },
      "10": {
        "text": "古老原始大能、神聖守護或毀滅性力量",
        "weight": 0.8
      },
      "19": {
        "text": "中華文化中吉祥、尊貴與天道意志的體現",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "3": {
        "text": "潛意識巨大能量結晶、自性整合的終極考驗",
        "weight": 0.83
      },
      "10": {
        "text": "古老原始大能、神聖守護或毀滅性力量",
        "weight": 0.8
      },
      "19": {
        "text": "中華文化中吉祥、尊貴與天道意志的體現",
        "weight": 0.78
      }
    },
    "source_ref": "3,10,19",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 41,
    "symbol": "老虎",
    "alias_list": [
      "老虎",
      "虎",
      "猛虎",
      "白虎",
      "大白虎"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "不可忽視的強烈攻擊性與威嚴震懾力",
        "weight": 0.73
      },
      "3": {
        "text": "陽性威嚴本能、爭奪支配權的心理原力",
        "weight": 0.78
      },
      "19": {
        "text": "威猛避邪與內在恐懼並存的雙重投射",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "不可忽視的強烈攻擊性與威嚴震懾力",
        "weight": 0.73
      },
      "3": {
        "text": "陽性威嚴本能、爭奪支配權的心理原力",
        "weight": 0.78
      },
      "19": {
        "text": "威猛避邪與內在恐懼並存的雙重投射",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,19",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 42,
    "symbol": "獅子",
    "alias_list": [
      "獅子",
      "狮子",
      "雄獅",
      "雄狮",
      "母獅",
      "母狮",
      "幼獅",
      "幼狮",
      "獅羣",
      "狮群"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "2": {
        "text": "意識王者尊嚴、追求掌控與榮耀的主導動能",
        "weight": 0.76
      },
      "3": {
        "text": "太陽本能、狂野激情的自主整合",
        "weight": 0.79
      },
      "16": {
        "text": "高貴勇氣、王權與不可侵犯的領地意識",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "2": {
        "text": "意識王者尊嚴、追求掌控與榮耀的主導動能",
        "weight": 0.76
      },
      "3": {
        "text": "太陽本能、狂野激情的自主整合",
        "weight": 0.79
      },
      "16": {
        "text": "高貴勇氣、王權與不可侵犯的領地意識",
        "weight": 0.72
      }
    },
    "source_ref": "2,3,16",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 43,
    "symbol": "狗／流浪狗",
    "alias_list": [
      "狗／流浪狗",
      "狗",
      "流浪狗",
      "犬",
      "小狗",
      "惡狗",
      "恶狗",
      "家犬",
      "黑狗"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "忠實陪伴、守護本能與對信任的渴求",
        "weight": 0.71
      },
      "7": {
        "text": "被忽略或遺棄的內在忠誠特質",
        "weight": 0.72
      },
      "10": {
        "text": "忠誠夥伴原型、保護者與攻擊防線",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "忠實陪伴、守護本能與對信任的渴求",
        "weight": 0.71
      },
      "7": {
        "text": "被忽略或遺棄的內在忠誠特質",
        "weight": 0.72
      },
      "10": {
        "text": "忠誠夥伴原型、保護者與攻擊防線",
        "weight": 0.75
      }
    },
    "source_ref": "1,7,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 44,
    "symbol": "鳥／飛鳥",
    "alias_list": [
      "鳥／飛鳥",
      "鸟／飞鸟",
      "鳥",
      "鸟",
      "飛鳥",
      "飞鸟",
      "小鳥",
      "小鸟",
      "青鳥",
      "青鸟",
      "喜鵲",
      "喜鹊",
      "飛禽",
      "飞禽"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "心靈自由渴望、遠走高飛的超脫遐想",
        "weight": 0.7
      },
      "3": {
        "text": "靈性追求與思想超拔、阿尼瑪信使",
        "weight": 0.81
      },
      "6": {
        "text": "跨越意識與潛意識邊界的羽翼象徵",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "心靈自由渴望、遠走高飛的超脫遐想",
        "weight": 0.7
      },
      "3": {
        "text": "靈性追求與思想超拔、阿尼瑪信使",
        "weight": 0.81
      },
      "6": {
        "text": "跨越意識與潛意識邊界的羽翼象徵",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,6",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 45,
    "symbol": "烏鴉",
    "alias_list": [
      "烏鴉",
      "乌鸦",
      "黑鳥",
      "黑鸟",
      "寒鴉",
      "寒鸦"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "3": {
        "text": "陰影信使、幽微直覺與心理警示",
        "weight": 0.77
      },
      "10": {
        "text": "死亡與轉化的先兆、看清不可見之物",
        "weight": 0.76
      },
      "16": {
        "text": "跨文化中智者化身與陰影界引路人",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "3": {
        "text": "陰影信使、幽微直覺與心理警示",
        "weight": 0.77
      },
      "10": {
        "text": "死亡與轉化的先兆、看清不可見之物",
        "weight": 0.76
      },
      "16": {
        "text": "跨文化中智者化身與陰影界引路人",
        "weight": 0.71
      }
    },
    "source_ref": "3,10,16",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 46,
    "symbol": "蝴蝶",
    "alias_list": [
      "蝴蝶",
      "破繭成蝶",
      "破茧成蝶",
      "彩蝶",
      "蝶"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "2": {
        "text": "心理結構蛻變、靈魂美麗昇華",
        "weight": 0.78
      },
      "3": {
        "text": "走出束縛 cocoon 邁向新生命階段",
        "weight": 0.81
      },
      "10": {
        "text": "自性綻放原型、由沉重化為輕盈",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "2": {
        "text": "心理結構蛻變、靈魂美麗昇華",
        "weight": 0.78
      },
      "3": {
        "text": "走出束縛 cocoon 邁向新生命階段",
        "weight": 0.81
      },
      "10": {
        "text": "自性綻放原型、由沉重化為輕盈",
        "weight": 0.76
      }
    },
    "source_ref": "2,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 47,
    "symbol": "魚／游魚",
    "alias_list": [
      "魚／遊魚",
      "鱼／游鱼",
      "魚",
      "鱼",
      "遊魚",
      "游鱼",
      "金魚",
      "金鱼",
      "錦鯉",
      "锦鲤",
      "大魚",
      "大鱼"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "2": {
        "text": "潛意識深海靈感初現、豐沛心靈養分",
        "weight": 0.77
      },
      "3": {
        "text": "基督魚原型、深海自性之源",
        "weight": 0.81
      },
      "10": {
        "text": "無意識深處靈活生存的本能力量",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "2": {
        "text": "潛意識深海靈感初現、豐沛心靈養分",
        "weight": 0.77
      },
      "3": {
        "text": "基督魚原型、深海自性之源",
        "weight": 0.81
      },
      "10": {
        "text": "無意識深處靈活生存的本能力量",
        "weight": 0.75
      }
    },
    "source_ref": "2,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 48,
    "symbol": "烏龜／龜",
    "alias_list": [
      "烏龜／龜",
      "乌龟／龟",
      "烏龜",
      "乌龟",
      "龜",
      "龟",
      "海龜",
      "海龟",
      "金錢龜",
      "金钱龟",
      "老龜",
      "老龟"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "漫長時間沉澱、固若金湯的心理防禦護盾",
        "weight": 0.7
      },
      "3": {
        "text": "古老沉穩智慧、與大地同壽的耐心",
        "weight": 0.78
      },
      "19": {
        "text": "玄武神獸文化、延年益壽與風水安穩",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "漫長時間沉澱、固若金湯的心理防禦護盾",
        "weight": 0.7
      },
      "3": {
        "text": "古老沉穩智慧、與大地同壽的耐心",
        "weight": 0.78
      },
      "19": {
        "text": "玄武神獸文化、延年益壽與風水安穩",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,19",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 49,
    "symbol": "鯨魚／海豚",
    "alias_list": [
      "鯨魚／海豚",
      "鲸鱼／海豚",
      "鯨魚",
      "鲸鱼",
      "海豚",
      "白鯨",
      "白鲸",
      "藍鯨",
      "蓝鲸",
      "虎鯨",
      "虎鲸"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "3": {
        "text": "大母神深海懷抱、集體無意識巨大引路者",
        "weight": 0.82
      },
      "10": {
        "text": "超個人心靈溝通與深邃包容的智慧",
        "weight": 0.79
      },
      "16": {
        "text": "深海中浮出水面呼吸的意識復甦過程",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "3": {
        "text": "大母神深海懷抱、集體無意識巨大引路者",
        "weight": 0.82
      },
      "10": {
        "text": "超個人心靈溝通與深邃包容的智慧",
        "weight": 0.79
      },
      "16": {
        "text": "深海中浮出水面呼吸的意識復甦過程",
        "weight": 0.73
      }
    },
    "source_ref": "3,10,16",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 50,
    "symbol": "蜘蛛",
    "alias_list": [
      "蜘蛛",
      "蜘蛛網",
      "蜘蛛网",
      "毒蜘蛛",
      "大蜘蛛"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人際關係糾纏控制、難以擺脫的心理網羅",
        "weight": 0.71
      },
      "3": {
        "text": "命運編織者、負面母神束縛原型",
        "weight": 0.79
      },
      "10": {
        "text": "密閉空間中的隱密窺視與捕食恐慌",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "人際關係糾纏控制、難以擺脫的心理網羅",
        "weight": 0.71
      },
      "3": {
        "text": "命運編織者、負面母神束縛原型",
        "weight": 0.79
      },
      "10": {
        "text": "密閉空間中的隱密窺視與捕食恐慌",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 51,
    "symbol": "狐狸",
    "alias_list": [
      "狐狸",
      "白狐",
      "狐仙",
      "野狐"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "狡黠靈巧、逢凶化吉的自保策略",
        "weight": 0.69
      },
      "16": {
        "text": "直覺變通與邊界試探的本能靈性",
        "weight": 0.72
      },
      "19": {
        "text": "東方神怪文化中的魅惑與因緣業力投射",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "狡黠靈巧、逢凶化吉的自保策略",
        "weight": 0.69
      },
      "16": {
        "text": "直覺變通與邊界試探的本能靈性",
        "weight": 0.72
      },
      "19": {
        "text": "東方神怪文化中的魅惑與因緣業力投射",
        "weight": 0.71
      }
    },
    "source_ref": "1,16,19",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 52,
    "symbol": "牛",
    "alias_list": [
      "牛",
      "黃牛",
      "黄牛",
      "水牛",
      "公牛",
      "耕牛"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "默默耕耘、勤奮奉獻、承載厚重負擔",
        "weight": 0.71
      },
      "16": {
        "text": "被壓抑的頑固脾氣與強大耐力",
        "weight": 0.7
      },
      "19": {
        "text": "農耕文明中深層接地氣的安心依靠",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "默默耕耘、勤奮奉獻、承載厚重負擔",
        "weight": 0.71
      },
      "16": {
        "text": "被壓抑的頑固脾氣與強大耐力",
        "weight": 0.7
      },
      "19": {
        "text": "農耕文明中深層接地氣的安心依靠",
        "weight": 0.73
      }
    },
    "source_ref": "1,16,19",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 53,
    "symbol": "鳳凰",
    "alias_list": [
      "鳳凰",
      "凤凰",
      "不死鳥",
      "不死鸟",
      "朱雀"
    ],
    "tags": [
      "動物原型"
    ],
    "book_interpret_json": {
      "3": {
        "text": "極致自性化象徵、浴火重生的心靈涅槃",
        "weight": 0.84
      },
      "10": {
        "text": "自性自體圓滿、超越創傷痛苦的精神頂點",
        "weight": 0.82
      },
      "19": {
        "text": "中華文化中高貴、和諧與圓滿吉祥印記",
        "weight": 0.79
      }
    },
    "book_interpret": {
      "3": {
        "text": "極致自性化象徵、浴火重生的心靈涅槃",
        "weight": 0.84
      },
      "10": {
        "text": "自性自體圓滿、超越創傷痛苦的精神頂點",
        "weight": 0.82
      },
      "19": {
        "text": "中華文化中高貴、和諧與圓滿吉祥印記",
        "weight": 0.79
      }
    },
    "source_ref": "3,10,19",
    "notes": "動物原型",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 54,
    "symbol": "神枱／神案",
    "alias_list": [
      "神枱／神案",
      "神台／神案",
      "神枱",
      "神台",
      "神案",
      "神龕",
      "神龛",
      "神位",
      "拜神",
      "香案",
      "祖先位",
      "拜拜"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "家族傳承期許、孝道道德監管、神聖庇護",
        "weight": 0.75
      },
      "10": {
        "text": "超我對個人意志的注視、代際罪疚與歸屬",
        "weight": 0.78
      },
      "19": {
        "text": "嶺南與港式民間信仰中心、內在尋求精神安定",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "家族傳承期許、孝道道德監管、神聖庇護",
        "weight": 0.75
      },
      "10": {
        "text": "超我對個人意志的注視、代際罪疚與歸屬",
        "weight": 0.78
      },
      "19": {
        "text": "嶺南與港式民間信仰中心、內在尋求精神安定",
        "weight": 0.76
      }
    },
    "source_ref": "1,10,19",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 55,
    "symbol": "舊居／祖屋／唐樓",
    "alias_list": [
      "舊居／祖屋／唐樓",
      "旧居／祖屋／唐楼",
      "舊居",
      "旧居",
      "祖屋",
      "唐樓",
      "唐楼",
      "老屋",
      "老家",
      "故居",
      "老房子",
      "童年舊居",
      "童年旧居"
    ],
    "tags": [
      "香港本土場景",
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "童年原生家庭回憶、難以磨滅的根基情感",
        "weight": 0.75
      },
      "2": {
        "text": "舊有人格框架架構、未解的情感結案",
        "weight": 0.78
      },
      "20": {
        "text": "高頻成人回溯場景、面對過往創傷的起點",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "童年原生家庭回憶、難以磨滅的根基情感",
        "weight": 0.75
      },
      "2": {
        "text": "舊有人格框架架構、未解的情感結案",
        "weight": 0.78
      },
      "20": {
        "text": "高頻成人回溯場景、面對過往創傷的起點",
        "weight": 0.74
      }
    },
    "source_ref": "1,2,20",
    "notes": "香港本土場景",
    "tag_ids": [
      9,
      3
    ]
  },
  {
    "symbol_id": 56,
    "symbol": "公屋長廊／公共屋邨",
    "alias_list": [
      "公屋長廊／公共屋邨",
      "公屋长廊／公共屋邨",
      "公屋長廊",
      "公屋长廊",
      "公共屋邨",
      "屋邨",
      "屋村",
      "公屋",
      "長廊",
      "长廊",
      "走廊",
      "長走廊",
      "长走廊",
      "邨屋"
    ],
    "tags": [
      "香港本土場景",
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "高密度都市人際擠壓、邊界失防壓迫感",
        "weight": 0.74
      },
      "8": {
        "text": "集體生活安全感與私人隱私被窺視的矛盾",
        "weight": 0.72
      },
      "20": {
        "text": "狹長通道奔逃噩夢高發地、急欲擺脫注視",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "高密度都市人際擠壓、邊界失防壓迫感",
        "weight": 0.74
      },
      "8": {
        "text": "集體生活安全感與私人隱私被窺視的矛盾",
        "weight": 0.72
      },
      "20": {
        "text": "狹長通道奔逃噩夢高發地、急欲擺脫注視",
        "weight": 0.75
      }
    },
    "source_ref": "1,8,20",
    "notes": "香港本土場景",
    "tag_ids": [
      9,
      3
    ]
  },
  {
    "symbol_id": 57,
    "symbol": "叮叮車／電車",
    "alias_list": [
      "叮叮車／電車",
      "叮叮车／电车",
      "叮叮車",
      "叮叮车",
      "電車",
      "电车",
      "香港電車",
      "香港电车",
      "叮叮",
      "港島電車",
      "港岛电车"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "慢節奏生活反思、快節奏生活中的懷舊沉澱",
        "weight": 0.72
      },
      "7": {
        "text": "沿既定軌道行駛的心靈確定性與安全感",
        "weight": 0.7
      },
      "15": {
        "text": "穿梭時空市井記憶、沉澱繁雜心緒的避難所",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "慢節奏生活反思、快節奏生活中的懷舊沉澱",
        "weight": 0.72
      },
      "7": {
        "text": "沿既定軌道行駛的心靈確定性與安全感",
        "weight": 0.7
      },
      "15": {
        "text": "穿梭時空市井記憶、沉澱繁雜心緒的避難所",
        "weight": 0.71
      }
    },
    "source_ref": "1,7,15",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 58,
    "symbol": "天星小輪／渡輪",
    "alias_list": [
      "天星小輪／渡輪",
      "天星小轮／渡轮",
      "天星小輪",
      "天星小轮",
      "渡輪",
      "渡轮",
      "小輪",
      "小轮",
      "輪渡",
      "轮渡",
      "維港小輪",
      "维港小轮"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生兩岸過渡擺渡、短暫航行的喘息時光",
        "weight": 0.73
      },
      "7": {
        "text": "心靈過渡期、暫時跳脫喧囂岸上的抽離視角",
        "weight": 0.72
      },
      "15": {
        "text": "浪漫記憶與告別舊旅途的情感儀式感",
        "weight": 0.7
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生兩岸過渡擺渡、短暫航行的喘息時光",
        "weight": 0.73
      },
      "7": {
        "text": "心靈過渡期、暫時跳脫喧囂岸上的抽離視角",
        "weight": 0.72
      },
      "15": {
        "text": "浪漫記憶與告別舊旅途的情感儀式感",
        "weight": 0.7
      }
    },
    "source_ref": "1,7,15",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 59,
    "symbol": "茶餐廳／冰室",
    "alias_list": [
      "茶餐廳／冰室",
      "茶餐厅／冰室",
      "茶餐廳",
      "茶餐厅",
      "冰室",
      "港式茶餐廳",
      "港式茶餐厅",
      "大排檔",
      "大排档",
      "茶記",
      "茶记"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "市井煙火氣充電站、接地氣的溫暖日常",
        "weight": 0.71
      },
      "8": {
        "text": "世俗生活的歸屬感、在忙碌喧鬧中尋求慰藉",
        "weight": 0.72
      },
      "15": {
        "text": "人情味連結、平凡生活的安穩錨點",
        "weight": 0.69
      }
    },
    "book_interpret": {
      "1": {
        "text": "市井煙火氣充電站、接地氣的溫暖日常",
        "weight": 0.71
      },
      "8": {
        "text": "世俗生活的歸屬感、在忙碌喧鬧中尋求慰藉",
        "weight": 0.72
      },
      "15": {
        "text": "人情味連結、平凡生活的安穩錨點",
        "weight": 0.69
      }
    },
    "source_ref": "1,8,15",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 60,
    "symbol": "維多利亞港／維港",
    "alias_list": [
      "維多利亞港／維港",
      "维多利亚港／维港",
      "維多利亞港",
      "维多利亚港",
      "維港",
      "维港",
      "香港海港",
      "海傍",
      "港灣",
      "港湾"
    ],
    "tags": [
      "香港本土場景",
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "繁華景致與內心漂泊孤獨的鮮明對照",
        "weight": 0.72
      },
      "3": {
        "text": "開闊視野心靈容器、眺望遠方彼岸的渴望",
        "weight": 0.78
      },
      "8": {
        "text": "城市集體身分認同與時代變遷的心潮起伏",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "繁華景致與內心漂泊孤獨的鮮明對照",
        "weight": 0.72
      },
      "3": {
        "text": "開闊視野心靈容器、眺望遠方彼岸的渴望",
        "weight": 0.78
      },
      "8": {
        "text": "城市集體身分認同與時代變遷的心潮起伏",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,8",
    "notes": "香港本土場景",
    "tag_ids": [
      9,
      3
    ]
  },
  {
    "symbol_id": 61,
    "symbol": "霓虹燈招牌",
    "alias_list": [
      "霓虹燈招牌",
      "霓虹灯招牌",
      "霓虹燈",
      "霓虹灯",
      "招牌",
      "招牌燈",
      "招牌灯"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "流光溢彩的集體鄉愁、往日繁盛的幻影",
        "weight": 0.71
      },
      "8": {
        "text": "都市慾望流動與光影下的真實自我隱藏",
        "weight": 0.73
      },
      "16": {
        "text": "時代更迭落幕的感傷、對消失時光的留戀",
        "weight": 0.7
      }
    },
    "book_interpret": {
      "1": {
        "text": "流光溢彩的集體鄉愁、往日繁盛的幻影",
        "weight": 0.71
      },
      "8": {
        "text": "都市慾望流動與光影下的真實自我隱藏",
        "weight": 0.73
      },
      "16": {
        "text": "時代更迭落幕的感傷、對消失時光的留戀",
        "weight": 0.7
      }
    },
    "source_ref": "1,8,16",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 62,
    "symbol": "旺角金魚街",
    "alias_list": [
      "旺角金魚街",
      "旺角金鱼街",
      "金魚街",
      "金鱼街",
      "金魚袋",
      "金鱼袋",
      "旺角"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "裝在透明塑膠袋裡的脆弱生命力、狹縫生存",
        "weight": 0.73
      },
      "7": {
        "text": "被觀看與商品化的人格特質、渴望解脫",
        "weight": 0.72
      },
      "8": {
        "text": "在擁擠城市中對靈動生機的深切期盼",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "裝在透明塑膠袋裡的脆弱生命力、狹縫生存",
        "weight": 0.73
      },
      "7": {
        "text": "被觀看與商品化的人格特質、渴望解脫",
        "weight": 0.72
      },
      "8": {
        "text": "在擁擠城市中對靈動生機的深切期盼",
        "weight": 0.71
      }
    },
    "source_ref": "1,7,8",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 63,
    "symbol": "黃大仙／廟宇求籤",
    "alias_list": [
      "黃大仙／廟宇求籤",
      "黄大仙／庙宇求签",
      "黃大仙",
      "黄大仙",
      "廟宇求籤",
      "庙宇求签",
      "黃大仙廟",
      "黄大仙庙",
      "廟宇",
      "庙宇",
      "求籤",
      "求签",
      "解籤",
      "解签",
      "拜神",
      "籤文",
      "签文"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "面對命運不確定性的焦慮交託、尋求啟示",
        "weight": 0.74
      },
      "10": {
        "text": "向神聖原型尋求指引、排解前途未知恐慌",
        "weight": 0.78
      },
      "19": {
        "text": "傳統民間慰藉、將無助轉化為行動希望",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "面對命運不確定性的焦慮交託、尋求啟示",
        "weight": 0.74
      },
      "10": {
        "text": "向神聖原型尋求指引、排解前途未知恐慌",
        "weight": 0.78
      },
      "19": {
        "text": "傳統民間慰藉、將無助轉化為行動希望",
        "weight": 0.75
      }
    },
    "source_ref": "1,10,19",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 64,
    "symbol": "燒衣／冥鏹祭拜",
    "alias_list": [
      "燒衣／冥鏹祭拜",
      "烧衣／冥镪祭拜",
      "燒衣",
      "烧衣",
      "冥鏹祭拜",
      "冥镪祭拜",
      "冥鏹",
      "冥镪",
      "紙錢",
      "纸钱",
      "冥幣",
      "冥币",
      "燒紙",
      "烧纸",
      "化寶",
      "化宝",
      "盂蘭",
      "盂兰",
      "鬼節祭拜",
      "鬼节祭拜"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "對逝去親友的深層哀傷與內疚彌補",
        "weight": 0.75
      },
      "10": {
        "text": "陰影和解儀式、心理斷捨離與祝福放手",
        "weight": 0.78
      },
      "19": {
        "text": "生死界限跨越、撫慰未竟之願的安魂儀軌",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "對逝去親友的深層哀傷與內疚彌補",
        "weight": 0.75
      },
      "10": {
        "text": "陰影和解儀式、心理斷捨離與祝福放手",
        "weight": 0.78
      },
      "19": {
        "text": "生死界限跨越、撫慰未竟之願的安魂儀軌",
        "weight": 0.76
      }
    },
    "source_ref": "1,10,19",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 65,
    "symbol": "紙紮",
    "alias_list": [
      "紙紮",
      "纸扎",
      "紙紮祭品",
      "纸扎祭品",
      "紙紮人",
      "纸扎人",
      "冥界紙紮",
      "冥界纸扎"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "虛實邊界的幻覺體驗、死亡焦慮的具象化",
        "weight": 0.73
      },
      "4": {
        "text": "替身補償心理、將無力承受之物外化成型",
        "weight": 0.7
      },
      "19": {
        "text": "幽明兩隔的代償心態、敬畏與忌憚交織",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "虛實邊界的幻覺體驗、死亡焦慮的具象化",
        "weight": 0.73
      },
      "4": {
        "text": "替身補償心理、將無力承受之物外化成型",
        "weight": 0.7
      },
      "19": {
        "text": "幽明兩隔的代償心態、敬畏與忌憚交織",
        "weight": 0.74
      }
    },
    "source_ref": "1,4,19",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 66,
    "symbol": "麻雀／打麻雀",
    "alias_list": [
      "麻雀／打麻雀",
      "麻雀",
      "打麻雀",
      "麻將",
      "麻将",
      "打麻將",
      "打麻将",
      "雀局",
      "十三幺",
      "食糊"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生活失控下的掌控慾重奪、機率與命運搏擊",
        "weight": 0.72
      },
      "8": {
        "text": "人情世故算計、博弈壓力與社交娛樂假面",
        "weight": 0.73
      },
      "19": {
        "text": "風水輪流轉的無常觀、期待轉運心態",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "生活失控下的掌控慾重奪、機率與命運搏擊",
        "weight": 0.72
      },
      "8": {
        "text": "人情世故算計、博弈壓力與社交娛樂假面",
        "weight": 0.73
      },
      "19": {
        "text": "風水輪流轉的無常觀、期待轉運心態",
        "weight": 0.71
      }
    },
    "source_ref": "1,8,19",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 67,
    "symbol": "竹棚／搭棚",
    "alias_list": [
      "竹棚／搭棚",
      "竹棚",
      "搭棚",
      "高空搭棚",
      "建築棚架",
      "建筑棚架",
      "杉木架"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "高空懸危中的堅韌生命力、靈活生存智慧",
        "weight": 0.74
      },
      "7": {
        "text": "暫時性心理支撐、在動盪不穩中負重前行",
        "weight": 0.72
      },
      "20": {
        "text": "高空墜落恐懼與對脆弱支撐的信賴焦慮",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "高空懸危中的堅韌生命力、靈活生存智慧",
        "weight": 0.74
      },
      "7": {
        "text": "暫時性心理支撐、在動盪不穩中負重前行",
        "weight": 0.72
      },
      "20": {
        "text": "高空墜落恐懼與對脆弱支撐的信賴焦慮",
        "weight": 0.75
      }
    },
    "source_ref": "1,7,20",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 68,
    "symbol": "劏房／棺材房",
    "alias_list": [
      "劏房／棺材房",
      "㓥房／棺材房",
      "劏房",
      "㓥房",
      "棺材房",
      "籠屋",
      "笼屋",
      "隔斷房",
      "隔断房",
      "蝸居",
      "蜗居",
      "窄房"
    ],
    "tags": [
      "香港本土場景",
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "心靈空間極限壓迫、生存焦慮與尊嚴考驗",
        "weight": 0.75
      },
      "8": {
        "text": "喘不過氣的窒息感、渴望突破困局的強烈呼號",
        "weight": 0.74
      },
      "20": {
        "text": "密閉空間恐懼與生活無奈感的核心象徵",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "心靈空間極限壓迫、生存焦慮與尊嚴考驗",
        "weight": 0.75
      },
      "8": {
        "text": "喘不過氣的窒息感、渴望突破困局的強烈呼號",
        "weight": 0.74
      },
      "20": {
        "text": "密閉空間恐懼與生活無奈感的核心象徵",
        "weight": 0.76
      }
    },
    "source_ref": "1,8,20",
    "notes": "香港本土場景",
    "tag_ids": [
      9,
      3
    ]
  },
  {
    "symbol_id": 69,
    "symbol": "回南天／潮濕牆壁",
    "alias_list": [
      "回南天／潮濕牆壁",
      "回南天／潮湿墙壁",
      "回南天",
      "潮濕牆壁",
      "潮湿墙壁",
      "潮濕",
      "潮湿",
      "牆壁發黴",
      "墙壁发霉",
      "濕氣",
      "湿气",
      "滲水",
      "渗水",
      "發黴",
      "发霉"
    ],
    "tags": [
      "香港本土場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "揮之不去的黏稠鬱悶、未被清理的情緒濕毒",
        "weight": 0.72
      },
      "7": {
        "text": "生活邊界被外界水汽滲透侵蝕的無力感",
        "weight": 0.71
      },
      "22": {
        "text": "身心疲憊與環境重擔壓迫的身心生理反應",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "揮之不去的黏稠鬱悶、未被清理的情緒濕毒",
        "weight": 0.72
      },
      "7": {
        "text": "生活邊界被外界水汽滲透侵蝕的無力感",
        "weight": 0.71
      },
      "22": {
        "text": "身心疲憊與環境重擔壓迫的身心生理反應",
        "weight": 0.73
      }
    },
    "source_ref": "1,7,22",
    "notes": "香港本土場景",
    "tag_ids": [
      9
    ]
  },
  {
    "symbol_id": 70,
    "symbol": "圖書館",
    "alias_list": [
      "圖書館",
      "图书馆",
      "圖書室",
      "图书室",
      "藏書閣",
      "藏书阁"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內心知識、記憶集合與智慧尋求",
        "weight": 0.7
      },
      "2": {
        "text": "集體記憶庫",
        "weight": 0.7
      },
      "3": {
        "text": "集體潛意識知識之海",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "內心知識、記憶集合與智慧尋求",
        "weight": 0.7
      },
      "2": {
        "text": "集體記憶庫",
        "weight": 0.7
      },
      "3": {
        "text": "集體潛意識知識之海",
        "weight": 0.77
      }
    },
    "source_ref": "1,2,3",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 71,
    "symbol": "港口",
    "alias_list": [
      "港口",
      "碼頭",
      "码头",
      "港灣",
      "港湾"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生重大轉折與啟航過渡",
        "weight": 0.7
      },
      "7": {
        "text": "過渡場域與心靈驛站",
        "weight": 0.68
      },
      "15": {
        "text": "生命階段交界、揚帆或泊岸",
        "weight": 0.67
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生重大轉折與啟航過渡",
        "weight": 0.7
      },
      "7": {
        "text": "過渡場域與心靈驛站",
        "weight": 0.68
      },
      "15": {
        "text": "生命階段交界、揚帆或泊岸",
        "weight": 0.67
      }
    },
    "source_ref": "1,7,15",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 72,
    "symbol": "旅館／酒店",
    "alias_list": [
      "旅館／酒店",
      "旅馆／酒店",
      "旅館",
      "旅馆",
      "酒店",
      "賓館",
      "宾馆",
      "飯店",
      "饭店",
      "客棧",
      "客栈"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "過渡階段、無常居所",
        "weight": 0.7
      },
      "2": {
        "text": "暫時人格狀態、未安定生活",
        "weight": 0.73
      },
      "6": {
        "text": "非永久空間與身份遊移",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "過渡階段、無常居所",
        "weight": 0.7
      },
      "2": {
        "text": "暫時人格狀態、未安定生活",
        "weight": 0.73
      },
      "6": {
        "text": "非永久空間與身份遊移",
        "weight": 0.71
      }
    },
    "source_ref": "1,2,6",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 73,
    "symbol": "墳墓",
    "alias_list": [
      "墳墓",
      "坟墓",
      "墳",
      "坟",
      "墓穴",
      "墳頭",
      "坟头",
      "墓地",
      "墓碑"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "舊自我徹底結束、心靈埋葬",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生原型循環",
        "weight": 0.8
      },
      "10": {
        "text": "舊人格死寂以迎接嶄新個體化",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "1": {
        "text": "舊自我徹底結束、心靈埋葬",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生原型循環",
        "weight": 0.8
      },
      "10": {
        "text": "舊人格死寂以迎接嶄新個體化",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 74,
    "symbol": "森林",
    "alias_list": [
      "森林",
      "樹林",
      "树林",
      "山林",
      "密林"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "潛意識幽深探索、未知冒險",
        "weight": 0.7
      },
      "3": {
        "text": "集體潛意識廣袤領域",
        "weight": 0.8
      },
      "10": {
        "text": "本能野性與迷宮試煉場域",
        "weight": 0.79
      }
    },
    "book_interpret": {
      "1": {
        "text": "潛意識幽深探索、未知冒險",
        "weight": 0.7
      },
      "3": {
        "text": "集體潛意識廣袤領域",
        "weight": 0.8
      },
      "10": {
        "text": "本能野性與迷宮試煉場域",
        "weight": 0.79
      }
    },
    "source_ref": "1,3,10",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 75,
    "symbol": "學校",
    "alias_list": [
      "學校",
      "学校",
      "學堂",
      "学堂",
      "校園",
      "校园",
      "教室",
      "課室",
      "课室"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生重要課題、被審視與評價焦慮",
        "weight": 0.7
      },
      "5": {
        "text": "成年人高頻壓力回溯夢場景",
        "weight": 0.4
      },
      "20": {
        "text": "考核與自我價值認同試煉",
        "weight": 0.65
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生重要課題、被審視與評價焦慮",
        "weight": 0.7
      },
      "5": {
        "text": "成年人高頻壓力回溯夢場景",
        "weight": 0.4
      },
      "20": {
        "text": "考核與自我價值認同試煉",
        "weight": 0.65
      }
    },
    "source_ref": "1,5,20",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 76,
    "symbol": "橋",
    "alias_list": [
      "橋",
      "桥",
      "橋樑",
      "桥梁",
      "天橋",
      "天桥",
      "跨海大橋",
      "跨海大桥"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "重大生活狀態過渡、連通兩端",
        "weight": 0.7
      },
      "2": {
        "text": "心理邊界與內外整合連接",
        "weight": 0.74
      },
      "3": {
        "text": "跨越內在鴻溝與抉擇關頭",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "重大生活狀態過渡、連通兩端",
        "weight": 0.7
      },
      "2": {
        "text": "心理邊界與內外整合連接",
        "weight": 0.74
      },
      "3": {
        "text": "跨越內在鴻溝與抉擇關頭",
        "weight": 0.75
      }
    },
    "source_ref": "1,2,3",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 77,
    "symbol": "家／房屋",
    "alias_list": [
      "家／房屋",
      "家",
      "房屋",
      "房子",
      "大屋",
      "居所",
      "屋企",
      "房間",
      "房间",
      "卧室"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在自我結構、心靈避風港",
        "weight": 0.8
      },
      "2": {
        "text": "心靈空間結構、各房間代表不同心理層次",
        "weight": 0.8
      },
      "3": {
        "text": "房屋即心靈自我（Self）的整體映射",
        "weight": 0.82
      }
    },
    "book_interpret": {
      "1": {
        "text": "內在自我結構、心靈避風港",
        "weight": 0.8
      },
      "2": {
        "text": "心靈空間結構、各房間代表不同心理層次",
        "weight": 0.8
      },
      "3": {
        "text": "房屋即心靈自我（Self）的整體映射",
        "weight": 0.82
      }
    },
    "source_ref": "1,2,3",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 78,
    "symbol": "洞穴",
    "alias_list": [
      "洞穴",
      "山洞",
      "穴位",
      "地洞",
      "石洞"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "退入深層潛意識尋求避難",
        "weight": 0.7
      },
      "3": {
        "text": "母性潛意識回歸與孵化之地",
        "weight": 0.7
      },
      "10": {
        "text": "大母神子宮原型空間、涅槃轉折點",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "退入深層潛意識尋求避難",
        "weight": 0.7
      },
      "3": {
        "text": "母性潛意識回歸與孵化之地",
        "weight": 0.7
      },
      "10": {
        "text": "大母神子宮原型空間、涅槃轉折點",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,10",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 79,
    "symbol": "山",
    "alias_list": [
      "山",
      "高山",
      "崇山",
      "峯頂",
      "峰顶",
      "山脈",
      "山脉"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "宏遠目標、精神攀登的高度挑戰",
        "weight": 0.7
      },
      "3": {
        "text": "超越精神境界與艱辛考驗",
        "weight": 0.77
      },
      "10": {
        "text": "攀登英雄之旅原型、站在巔峰視界",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "宏遠目標、精神攀登的高度挑戰",
        "weight": 0.7
      },
      "3": {
        "text": "超越精神境界與艱辛考驗",
        "weight": 0.77
      },
      "10": {
        "text": "攀登英雄之旅原型、站在巔峰視界",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 80,
    "symbol": "地下室",
    "alias_list": [
      "地下室",
      "地庫",
      "地库",
      "藏寶室",
      "藏宝室",
      "地下藏室"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "被壓抑記憶、未曾正視的往事",
        "weight": 0.7
      },
      "2": {
        "text": "最深層無意識陰影藏匿處",
        "weight": 0.7
      },
      "4": {
        "text": "本我衝動與不可告人之願",
        "weight": 0.58
      }
    },
    "book_interpret": {
      "1": {
        "text": "被壓抑記憶、未曾正視的往事",
        "weight": 0.7
      },
      "2": {
        "text": "最深層無意識陰影藏匿處",
        "weight": 0.7
      },
      "4": {
        "text": "本我衝動與不可告人之願",
        "weight": 0.58
      }
    },
    "source_ref": "1,2,4",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 81,
    "symbol": "天台",
    "alias_list": [
      "天台",
      "屋頂",
      "屋顶",
      "樓頂",
      "楼顶",
      "頂樓",
      "顶楼"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "開闊理智視野、脫離日常局限",
        "weight": 0.7
      },
      "2": {
        "text": "意識頂層與仰望星空邊界",
        "weight": 0.73
      },
      "3": {
        "text": "俯瞰人生格局的大局觀",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "開闊理智視野、脫離日常局限",
        "weight": 0.7
      },
      "2": {
        "text": "意識頂層與仰望星空邊界",
        "weight": 0.73
      },
      "3": {
        "text": "俯瞰人生格局的大局觀",
        "weight": 0.74
      }
    },
    "source_ref": "1,2,3",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 82,
    "symbol": "監獄",
    "alias_list": [
      "監獄",
      "监狱",
      "牢獄",
      "牢狱",
      "牢房",
      "看守所",
      "鐵籠",
      "铁笼"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我設限、道德或情感的無形囚禁",
        "weight": 0.7
      },
      "6": {
        "text": "內在束縛感與行動自由被剝奪",
        "weight": 0.72
      },
      "15": {
        "text": "分辨外界壓迫或自加枷鎖的契機",
        "weight": 0.68
      }
    },
    "book_interpret": {
      "1": {
        "text": "自我設限、道德或情感的無形囚禁",
        "weight": 0.7
      },
      "6": {
        "text": "內在束縛感與行動自由被剝奪",
        "weight": 0.72
      },
      "15": {
        "text": "分辨外界壓迫或自加枷鎖的契機",
        "weight": 0.68
      }
    },
    "source_ref": "1,6,15",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 83,
    "symbol": "醫院",
    "alias_list": [
      "醫院",
      "医院",
      "病院",
      "診所",
      "诊所",
      "急症室",
      "病房"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "身心修復需求、療癒與被照料渴望",
        "weight": 0.7
      },
      "7": {
        "text": "心理創傷的急救與脆弱修補",
        "weight": 0.68
      },
      "22": {
        "text": "心身疲憊創傷中的安全避護所",
        "weight": 0.44
      }
    },
    "book_interpret": {
      "1": {
        "text": "身心修復需求、療癒與被照料渴望",
        "weight": 0.7
      },
      "7": {
        "text": "心理創傷的急救與脆弱修補",
        "weight": 0.68
      },
      "22": {
        "text": "心身疲憊創傷中的安全避護所",
        "weight": 0.44
      }
    },
    "source_ref": "1,7,22",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 84,
    "symbol": "沙漠",
    "alias_list": [
      "沙漠",
      "荒漠",
      "戈壁",
      "沙丘"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "孤獨枯竭、缺乏情感滋潤的荒涼感",
        "weight": 0.7
      },
      "3": {
        "text": "心靈荒漠之試煉、尋求甘霖之行",
        "weight": 0.74
      },
      "10": {
        "text": "乾涸考驗原型、激發最頑強求生意志",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "孤獨枯竭、缺乏情感滋潤的荒涼感",
        "weight": 0.7
      },
      "3": {
        "text": "心靈荒漠之試煉、尋求甘霖之行",
        "weight": 0.74
      },
      "10": {
        "text": "乾涸考驗原型、激發最頑強求生意志",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,10",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 85,
    "symbol": "海洋",
    "alias_list": [
      "海洋",
      "大海",
      "海",
      "汪洋",
      "大洋",
      "深海"
    ],
    "tags": [
      "建築場景",
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "浩瀚集體潛意識、無邊情感洪流",
        "weight": 0.7
      },
      "3": {
        "text": "水原型、孕育萬物的大母體",
        "weight": 0.8
      },
      "10": {
        "text": "深不可測的深層心理能量儲備庫",
        "weight": 0.79
      }
    },
    "book_interpret": {
      "1": {
        "text": "浩瀚集體潛意識、無邊情感洪流",
        "weight": 0.7
      },
      "3": {
        "text": "水原型、孕育萬物的大母體",
        "weight": 0.8
      },
      "10": {
        "text": "深不可測的深層心理能量儲備庫",
        "weight": 0.79
      }
    },
    "source_ref": "1,3,10",
    "notes": "建築場景",
    "tag_ids": [
      3,
      8
    ]
  },
  {
    "symbol_id": 86,
    "symbol": "河流",
    "alias_list": [
      "河流",
      "溪水",
      "河",
      "溪流",
      "江河",
      "河道"
    ],
    "tags": [
      "建築場景",
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生命自然流動、心境順勢而為",
        "weight": 0.7
      },
      "2": {
        "text": "流動的心靈能量（Libido）引導",
        "weight": 0.74
      },
      "3": {
        "text": "情感流動順暢與否的晴雨表",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "生命自然流動、心境順勢而為",
        "weight": 0.7
      },
      "2": {
        "text": "流動的心靈能量（Libido）引導",
        "weight": 0.74
      },
      "3": {
        "text": "情感流動順暢與否的晴雨表",
        "weight": 0.75
      }
    },
    "source_ref": "1,2,3",
    "notes": "建築場景",
    "tag_ids": [
      3,
      8
    ]
  },
  {
    "symbol_id": 87,
    "symbol": "超市",
    "alias_list": [
      "超市",
      "商場",
      "商场",
      "超級市場",
      "超级市场",
      "百貨公司",
      "百货公司"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生活豐富選擇、慾望與滿足對比",
        "weight": 0.7
      },
      "5": {
        "text": "尋找生活補給品、自我價值評價",
        "weight": 0.65
      },
      "15": {
        "text": "社會消費主義下的內心匱乏與填補",
        "weight": 0.67
      }
    },
    "book_interpret": {
      "1": {
        "text": "生活豐富選擇、慾望與滿足對比",
        "weight": 0.7
      },
      "5": {
        "text": "尋找生活補給品、自我價值評價",
        "weight": 0.65
      },
      "15": {
        "text": "社會消費主義下的內心匱乏與填補",
        "weight": 0.67
      }
    },
    "source_ref": "1,5,15",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 88,
    "symbol": "車站",
    "alias_list": [
      "車站",
      "车站",
      "火車站",
      "火车站",
      "地鐵站",
      "地铁站",
      "巴士站",
      "月台"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生旅程過渡、等待與出發抉擇",
        "weight": 0.7
      },
      "7": {
        "text": "錯過班次焦慮、時間節奏掌控挑戰",
        "weight": 0.68
      },
      "15": {
        "text": "邁向下一站的人生起點",
        "weight": 0.67
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生旅程過渡、等待與出發抉擇",
        "weight": 0.7
      },
      "7": {
        "text": "錯過班次焦慮、時間節奏掌控挑戰",
        "weight": 0.68
      },
      "15": {
        "text": "邁向下一站的人生起點",
        "weight": 0.67
      }
    },
    "source_ref": "1,7,15",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 89,
    "symbol": "教堂",
    "alias_list": [
      "教堂",
      "寺廟",
      "寺庙",
      "聖堂",
      "圣堂",
      "禮拜堂",
      "礼拜堂"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "崇高敬畏、心靈救贖與沉思庇護",
        "weight": 0.7
      },
      "3": {
        "text": "神聖原型、尋求超越現世的安寧",
        "weight": 0.78
      },
      "16": {
        "text": "道德審查與內在良知對話場域",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "崇高敬畏、心靈救贖與沉思庇護",
        "weight": 0.7
      },
      "3": {
        "text": "神聖原型、尋求超越現世的安寧",
        "weight": 0.78
      },
      "16": {
        "text": "道德審查與內在良知對話場域",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,16",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 90,
    "symbol": "電梯／升降機",
    "alias_list": [
      "電梯／升降機",
      "电梯／升降机",
      "電梯",
      "电梯",
      "升降機",
      "升降机",
      "搭電梯",
      "搭电梯",
      "電梯失控",
      "电梯失控",
      "電梯墜落",
      "电梯坠落"
    ],
    "tags": [
      "建築場景",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "社會階層升沉焦慮、失重恐慌",
        "weight": 0.74
      },
      "20": {
        "text": "極高頻都市焦慮夢、控制權被機械剝奪",
        "weight": 0.76
      },
      "22": {
        "text": "身體前庭失重感與自律神經緊張反應",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "社會階層升沉焦慮、失重恐慌",
        "weight": 0.74
      },
      "20": {
        "text": "極高頻都市焦慮夢、控制權被機械剝奪",
        "weight": 0.76
      },
      "22": {
        "text": "身體前庭失重感與自律神經緊張反應",
        "weight": 0.71
      }
    },
    "source_ref": "1,20,22",
    "notes": "建築場景",
    "tag_ids": [
      3,
      6
    ]
  },
  {
    "symbol_id": 91,
    "symbol": "迷宮",
    "alias_list": [
      "迷宮",
      "迷宫",
      "迷道",
      "死衚衕",
      "死胡同",
      "走不出的房間",
      "走不出的房间"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "2": {
        "text": "內在追尋自性中心的複雜心靈旅途",
        "weight": 0.77
      },
      "3": {
        "text": "考驗意志與辨識力的英雄困局",
        "weight": 0.8
      },
      "21": {
        "text": "面對心靈米諾陶洛斯（陰影）的試煉",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "2": {
        "text": "內在追尋自性中心的複雜心靈旅途",
        "weight": 0.77
      },
      "3": {
        "text": "考驗意志與辨識力的英雄困局",
        "weight": 0.8
      },
      "21": {
        "text": "面對心靈米諾陶洛斯（陰影）的試煉",
        "weight": 0.75
      }
    },
    "source_ref": "2,3,21",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 92,
    "symbol": "浴室／洗手間",
    "alias_list": [
      "浴室／洗手間",
      "浴室／洗手间",
      "浴室",
      "洗手間",
      "洗手间",
      "衞生間",
      "卫生间",
      "廁所",
      "厕所",
      "沖涼房",
      "冲凉房",
      "浴缸"
    ],
    "tags": [
      "建築場景"
    ],
    "book_interpret_json": {
      "1": {
        "text": "心理排毒、清理內疚羞恥與負面雜念",
        "weight": 0.74
      },
      "4": {
        "text": "本能排泄與私密界限被窺視的不安",
        "weight": 0.72
      },
      "7": {
        "text": "卸下面具、回歸純淨肉身真我",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "心理排毒、清理內疚羞恥與負面雜念",
        "weight": 0.74
      },
      "4": {
        "text": "本能排泄與私密界限被窺視的不安",
        "weight": 0.72
      },
      "7": {
        "text": "卸下面具、回歸純淨肉身真我",
        "weight": 0.73
      }
    },
    "source_ref": "1,4,7",
    "notes": "建築場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 93,
    "symbol": "鑰匙",
    "alias_list": [
      "鑰匙",
      "钥匙",
      "金鑰匙",
      "金钥匙",
      "門匙",
      "门匙",
      "鑰匙扣",
      "钥匙扣"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "解決困境之關鍵、解密意識之門",
        "weight": 0.7
      },
      "3": {
        "text": "啟蒙之鑰、打開心靈全新邊界",
        "weight": 0.8
      },
      "4": {
        "text": "權力掌控與打開禁錮慾望之工具",
        "weight": 0.6
      }
    },
    "book_interpret": {
      "1": {
        "text": "解決困境之關鍵、解密意識之門",
        "weight": 0.7
      },
      "3": {
        "text": "啟蒙之鑰、打開心靈全新邊界",
        "weight": 0.8
      },
      "4": {
        "text": "權力掌控與打開禁錮慾望之工具",
        "weight": 0.6
      }
    },
    "source_ref": "1,3,4",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 94,
    "symbol": "鏡子",
    "alias_list": [
      "鏡子",
      "镜子",
      "梳妝鏡",
      "梳妆镜",
      "照鏡",
      "照镜",
      "碎鏡",
      "碎镜",
      "鏡面",
      "镜面"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我審視、照見真實內心",
        "weight": 0.7
      },
      "2": {
        "text": "自我認知（Ego）與面具（Persona）的對話",
        "weight": 0.74
      },
      "6": {
        "text": "鏡中映照出未被察覺的陰影面向",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "自我審視、照見真實內心",
        "weight": 0.7
      },
      "2": {
        "text": "自我認知（Ego）與面具（Persona）的對話",
        "weight": 0.74
      },
      "6": {
        "text": "鏡中映照出未被察覺的陰影面向",
        "weight": 0.73
      }
    },
    "source_ref": "1,2,6",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 95,
    "symbol": "船",
    "alias_list": [
      "船",
      "小船",
      "巨輪",
      "巨轮",
      "帆船",
      "木船"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "心靈航行容器、渡過情緒風浪",
        "weight": 0.7
      },
      "3": {
        "text": "穿越無意識汪洋的堅固載體",
        "weight": 0.77
      },
      "16": {
        "text": "生命的漂浮旅程與命運方向盤",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "心靈航行容器、渡過情緒風浪",
        "weight": 0.7
      },
      "3": {
        "text": "穿越無意識汪洋的堅固載體",
        "weight": 0.77
      },
      "16": {
        "text": "生命的漂浮旅程與命運方向盤",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,16",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 96,
    "symbol": "燈籠／燈",
    "alias_list": [
      "燈籠／燈",
      "灯笼／灯",
      "燈籠",
      "灯笼",
      "燈",
      "灯",
      "枱燈",
      "台灯",
      "手電筒",
      "手电筒",
      "蠟燭",
      "蜡烛"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "黑暗中的意識光芒、照亮迷途",
        "weight": 0.7
      },
      "3": {
        "text": "精神真理與希望火種",
        "weight": 0.76
      },
      "10": {
        "text": "智慧老人手中提引的覺察之燈",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "黑暗中的意識光芒、照亮迷途",
        "weight": 0.7
      },
      "3": {
        "text": "精神真理與希望火種",
        "weight": 0.76
      },
      "10": {
        "text": "智慧老人手中提引的覺察之燈",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 97,
    "symbol": "衣服",
    "alias_list": [
      "衣服",
      "衣物",
      "衫",
      "服裝",
      "服装",
      "外套",
      "裙子",
      "換衣服",
      "换衣服"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "社會角色打扮、對外形象",
        "weight": 0.7
      },
      "3": {
        "text": "人格面具（Persona）的具體化體現",
        "weight": 0.79
      },
      "4": {
        "text": "掩飾真實本能慾望的偽裝外衣",
        "weight": 0.65
      }
    },
    "book_interpret": {
      "1": {
        "text": "社會角色打扮、對外形象",
        "weight": 0.7
      },
      "3": {
        "text": "人格面具（Persona）的具體化體現",
        "weight": 0.79
      },
      "4": {
        "text": "掩飾真實本能慾望的偽裝外衣",
        "weight": 0.65
      }
    },
    "source_ref": "1,3,4",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 98,
    "symbol": "寶石",
    "alias_list": [
      "寶石",
      "宝石",
      "鑽石",
      "钻石",
      "玉石",
      "水晶",
      "翡翠",
      "寶物",
      "宝物"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "2": {
        "text": "歷經高壓磨礪而成的自性（Self）結晶",
        "weight": 0.78
      },
      "3": {
        "text": "不可動搖的最高心靈價值與珍貴特質",
        "weight": 0.82
      },
      "10": {
        "text": "純淨發光的自性原型",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "2": {
        "text": "歷經高壓磨礪而成的自性（Self）結晶",
        "weight": 0.78
      },
      "3": {
        "text": "不可動搖的最高心靈價值與珍貴特質",
        "weight": 0.82
      },
      "10": {
        "text": "純淨發光的自性原型",
        "weight": 0.77
      }
    },
    "source_ref": "2,3,10",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 99,
    "symbol": "錢／金錢",
    "alias_list": [
      "錢／金錢",
      "钱／金钱",
      "錢",
      "钱",
      "金錢",
      "金钱",
      "鈔票",
      "钞票",
      "硬幣",
      "硬币",
      "財富",
      "财富",
      "銀紙",
      "银纸"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我價值認同、現實生存安全資本",
        "weight": 0.7
      },
      "4": {
        "text": "心理能量交換載體、自尊匱乏補償",
        "weight": 0.68
      },
      "8": {
        "text": "生活掌控感與得失焦慮的具體投射",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "自我價值認同、現實生存安全資本",
        "weight": 0.7
      },
      "4": {
        "text": "心理能量交換載體、自尊匱乏補償",
        "weight": 0.68
      },
      "8": {
        "text": "生活掌控感與得失焦慮的具體投射",
        "weight": 0.71
      }
    },
    "source_ref": "1,4,8",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 100,
    "symbol": "門",
    "alias_list": [
      "門",
      "门",
      "大門",
      "大门",
      "房門",
      "房门",
      "木門",
      "木门",
      "鐵門",
      "铁门",
      "門鎖",
      "门锁"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "心理界限防線、轉換機遇通道",
        "weight": 0.7
      },
      "2": {
        "text": "意識與無意識世界的過渡關口",
        "weight": 0.75
      },
      "3": {
        "text": "打開心靈新維度的契機或緊閉設防",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "心理界限防線、轉換機遇通道",
        "weight": 0.7
      },
      "2": {
        "text": "意識與無意識世界的過渡關口",
        "weight": 0.75
      },
      "3": {
        "text": "打開心靈新維度的契機或緊閉設防",
        "weight": 0.77
      }
    },
    "source_ref": "1,2,3",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 101,
    "symbol": "鐘錶／時鐘",
    "alias_list": [
      "鐘錶／時鐘",
      "钟表／时钟",
      "鐘錶",
      "钟表",
      "時鐘",
      "时钟",
      "鬧鐘",
      "闹钟",
      "手錶",
      "手表",
      "鐘",
      "钟",
      "時鐘倒數",
      "时钟倒数"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "時間壓迫感、生命歲月流逝焦慮",
        "weight": 0.7
      },
      "5": {
        "text": "錯失良機的緊迫逼迫感",
        "weight": 0.67
      },
      "20": {
        "text": "生活步調失調引發的焦慮鬧鈴",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "時間壓迫感、生命歲月流逝焦慮",
        "weight": 0.7
      },
      "5": {
        "text": "錯失良機的緊迫逼迫感",
        "weight": 0.67
      },
      "20": {
        "text": "生活步調失調引發的焦慮鬧鈴",
        "weight": 0.71
      }
    },
    "source_ref": "1,5,20",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 102,
    "symbol": "武器",
    "alias_list": [
      "武器",
      "兵刃",
      "軍火",
      "军火",
      "刀劍",
      "刀剑",
      "防身物",
      "槍支",
      "枪支"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "反擊自衛機制、被壓抑的攻擊原動力",
        "weight": 0.7
      },
      "4": {
        "text": "本能破壞衝動與自我保護武裝",
        "weight": 0.68
      },
      "6": {
        "text": "直面內心陰影威脅時的抗衡力量",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "反擊自衛機制、被壓抑的攻擊原動力",
        "weight": 0.7
      },
      "4": {
        "text": "本能破壞衝動與自我保護武裝",
        "weight": 0.68
      },
      "6": {
        "text": "直面內心陰影威脅時的抗衡力量",
        "weight": 0.73
      }
    },
    "source_ref": "1,4,6",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 103,
    "symbol": "書本",
    "alias_list": [
      "書本",
      "书本",
      "書",
      "书",
      "典籍",
      "日記",
      "日记",
      "筆記",
      "笔记"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生閱歷與知識尋求、解答未知疑惑",
        "weight": 0.7
      },
      "2": {
        "text": "生命歷史的銘刻記錄、自我回顧",
        "weight": 0.72
      },
      "8": {
        "text": "精神權威指引與追尋真理象徵",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生閱歷與知識尋求、解答未知疑惑",
        "weight": 0.7
      },
      "2": {
        "text": "生命歷史的銘刻記錄、自我回顧",
        "weight": 0.72
      },
      "8": {
        "text": "精神權威指引與追尋真理象徵",
        "weight": 0.71
      }
    },
    "source_ref": "1,2,8",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 104,
    "symbol": "車輛",
    "alias_list": [
      "車輛",
      "车辆",
      "汽車",
      "汽车",
      "私家車",
      "私家车",
      "巴士",
      "的士",
      "車",
      "车"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生前進載體、生活軌跡控制感",
        "weight": 0.7
      },
      "2": {
        "text": "自我主控力與前進動能平衡",
        "weight": 0.74
      },
      "7": {
        "text": "煞車失靈或失控反映的生活超載狀態",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生前進載體、生活軌跡控制感",
        "weight": 0.7
      },
      "2": {
        "text": "自我主控力與前進動能平衡",
        "weight": 0.74
      },
      "7": {
        "text": "煞車失靈或失控反映的生活超載狀態",
        "weight": 0.72
      }
    },
    "source_ref": "1,2,7",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 105,
    "symbol": "梯子",
    "alias_list": [
      "梯子",
      "樓梯",
      "楼梯",
      "階梯",
      "阶梯",
      "梯級",
      "梯级",
      "木梯",
      "旋轉樓梯",
      "旋转楼梯"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生進階與意識層次攀升",
        "weight": 0.7
      },
      "2": {
        "text": "無意識向意識轉化（或反向）的通道",
        "weight": 0.75
      },
      "3": {
        "text": "步步為營的心靈成長考驗",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生進階與意識層次攀升",
        "weight": 0.7
      },
      "2": {
        "text": "無意識向意識轉化（或反向）的通道",
        "weight": 0.75
      },
      "3": {
        "text": "步步為營的心靈成長考驗",
        "weight": 0.76
      }
    },
    "source_ref": "1,2,3",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 106,
    "symbol": "窗",
    "alias_list": [
      "窗",
      "窗户",
      "窗框",
      "落地窗",
      "窗子",
      "窗台"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "向外界窺探的視窗、渴望連結的通道",
        "weight": 0.7
      },
      "2": {
        "text": "心靈透光的縫隙、獲取全新視野",
        "weight": 0.72
      },
      "3": {
        "text": "內在世界與客觀現實的互動屏障",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "向外界窺探的視窗、渴望連結的通道",
        "weight": 0.7
      },
      "2": {
        "text": "心靈透光的縫隙、獲取全新視野",
        "weight": 0.72
      },
      "3": {
        "text": "內在世界與客觀現實的互動屏障",
        "weight": 0.74
      }
    },
    "source_ref": "1,2,3",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 107,
    "symbol": "鎖",
    "alias_list": [
      "鎖",
      "锁",
      "門鎖",
      "门锁",
      "銅鎖",
      "铜锁",
      "密碼鎖",
      "密码锁",
      "鎖頭",
      "锁头",
      "鎖鏈",
      "锁链"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "情感封閉、拒絕敞開心扉的自我保護",
        "weight": 0.7
      },
      "4": {
        "text": "嚴密壓抑本我慾望的防禦機制",
        "weight": 0.68
      },
      "6": {
        "text": "被鎖在暗處的心靈創傷與祕密",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "情感封閉、拒絕敞開心扉的自我保護",
        "weight": 0.7
      },
      "4": {
        "text": "嚴密壓抑本我慾望的防禦機制",
        "weight": 0.68
      },
      "6": {
        "text": "被鎖在暗處的心靈創傷與祕密",
        "weight": 0.72
      }
    },
    "source_ref": "1,4,6",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 108,
    "symbol": "劍",
    "alias_list": [
      "劍",
      "剑",
      "寶劍",
      "宝剑",
      "利劍",
      "利剑",
      "長劍",
      "长剑"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "2": {
        "text": "鋒利理智與果斷辨析力、斬斷猶豫情絲",
        "weight": 0.76
      },
      "3": {
        "text": "英雄屠龍的意志武器、正義力量",
        "weight": 0.81
      },
      "10": {
        "text": "決斷力原型、劃清心理邊界的利器",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "2": {
        "text": "鋒利理智與果斷辨析力、斬斷猶豫情絲",
        "weight": 0.76
      },
      "3": {
        "text": "英雄屠龍的意志武器、正義力量",
        "weight": 0.81
      },
      "10": {
        "text": "決斷力原型、劃清心理邊界的利器",
        "weight": 0.77
      }
    },
    "source_ref": "2,3,10",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 109,
    "symbol": "花朵",
    "alias_list": [
      "花朵",
      "花",
      "鮮花",
      "鲜花",
      "玫瑰",
      "蓮花",
      "莲花",
      "荷花",
      "花開",
      "花开"
    ],
    "tags": [
      "物件道具",
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生命綻放的美好、純真愛意萌芽",
        "weight": 0.7
      },
      "3": {
        "text": "曼陀羅中心盛開、心靈圓滿象徵",
        "weight": 0.81
      },
      "10": {
        "text": "自性美麗綻放與脆弱生命力的循環",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "生命綻放的美好、純真愛意萌芽",
        "weight": 0.7
      },
      "3": {
        "text": "曼陀羅中心盛開、心靈圓滿象徵",
        "weight": 0.81
      },
      "10": {
        "text": "自性美麗綻放與脆弱生命力的循環",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件道具",
    "tag_ids": [
      7,
      8
    ]
  },
  {
    "symbol_id": 110,
    "symbol": "種子",
    "alias_list": [
      "種子",
      "种子",
      "樹種",
      "树种",
      "種芽",
      "种芽",
      "胚芽"
    ],
    "tags": [
      "物件道具",
      "自然物象"
    ],
    "book_interpret_json": {
      "2": {
        "text": "心靈潛能萌芽、蘊含整座森林的自性",
        "weight": 0.77
      },
      "3": {
        "text": "等待適合土壤孕育的全新希望",
        "weight": 0.81
      },
      "10": {
        "text": "生命起源原型、深埋泥土中的生命力",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "2": {
        "text": "心靈潛能萌芽、蘊含整座森林的自性",
        "weight": 0.77
      },
      "3": {
        "text": "等待適合土壤孕育的全新希望",
        "weight": 0.81
      },
      "10": {
        "text": "生命起源原型、深埋泥土中的生命力",
        "weight": 0.76
      }
    },
    "source_ref": "2,3,10",
    "notes": "物件道具",
    "tag_ids": [
      7,
      8
    ]
  },
  {
    "symbol_id": 111,
    "symbol": "面具",
    "alias_list": [
      "面具",
      "面罩",
      "假面",
      "人皮面具",
      "假臉",
      "假脸"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "2": {
        "text": "適應社會要求的人格面具（Persona）",
        "weight": 0.79
      },
      "3": {
        "text": "遮蔽脆弱真實自我的防禦外殼",
        "weight": 0.81
      },
      "10": {
        "text": "害怕真實自我被看穿的深刻焦慮",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "2": {
        "text": "適應社會要求的人格面具（Persona）",
        "weight": 0.79
      },
      "3": {
        "text": "遮蔽脆弱真實自我的防禦外殼",
        "weight": 0.81
      },
      "10": {
        "text": "害怕真實自我被看穿的深刻焦慮",
        "weight": 0.76
      }
    },
    "source_ref": "2,3,10",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 112,
    "symbol": "棺材",
    "alias_list": [
      "棺材",
      "棺木",
      "靈柩",
      "灵柩",
      "棺槨",
      "棺椁"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "對過去生活模式的徹底封存與告別",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生儀式、舊我埋葬迎接新生",
        "weight": 0.8
      },
      "10": {
        "text": "心理終結原型、不可逆的轉折點",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "1": {
        "text": "對過去生活模式的徹底封存與告別",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生儀式、舊我埋葬迎接新生",
        "weight": 0.8
      },
      "10": {
        "text": "心理終結原型、不可逆的轉折點",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 113,
    "symbol": "電話／手機",
    "alias_list": [
      "電話／手機",
      "电话／手机",
      "電話",
      "电话",
      "手機",
      "手机",
      "智能手機",
      "智能手机",
      "打電話",
      "打电话",
      "屏幕",
      "短訊",
      "短讯"
    ],
    "tags": [
      "物件道具"
    ],
    "book_interpret_json": {
      "1": {
        "text": "溝通渴望與失聯焦慮、外界認可需求",
        "weight": 0.72
      },
      "5": {
        "text": "資訊超載帶來的精神緊繃與打擾不安",
        "weight": 0.69
      },
      "15": {
        "text": "現代人際邊界脆弱與渴望即時回應的心理投射",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "溝通渴望與失聯焦慮、外界認可需求",
        "weight": 0.72
      },
      "5": {
        "text": "資訊超載帶來的精神緊繃與打擾不安",
        "weight": 0.69
      },
      "15": {
        "text": "現代人際邊界脆弱與渴望即時回應的心理投射",
        "weight": 0.71
      }
    },
    "source_ref": "1,5,15",
    "notes": "物件道具",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 114,
    "symbol": "丟失錢包／丟失手機",
    "alias_list": [
      "丟失錢包／丟失手機",
      "丢失钱包／丢失手机",
      "丟失錢包",
      "丢失钱包",
      "丟失手機",
      "丢失手机",
      "丟手機",
      "丢手机",
      "丟錢包",
      "丢钱包",
      "丟失證件",
      "丢失证件",
      "遺失",
      "遗失",
      "不見了手機",
      "不见了手机",
      "不見了錢包",
      "不见了钱包"
    ],
    "tags": [
      "物件道具",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生活掌控感剝離、自我身份認同危機",
        "weight": 0.74
      },
      "4": {
        "text": "焦慮遺失珍貴自尊、無法自立的深層恐慌",
        "weight": 0.71
      },
      "20": {
        "text": "現代人常見的核心安全感喪失噩夢主題",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "生活掌控感剝離、自我身份認同危機",
        "weight": 0.74
      },
      "4": {
        "text": "焦慮遺失珍貴自尊、無法自立的深層恐慌",
        "weight": 0.71
      },
      "20": {
        "text": "現代人常見的核心安全感喪失噩夢主題",
        "weight": 0.75
      }
    },
    "source_ref": "1,4,20",
    "notes": "物件道具",
    "tag_ids": [
      7,
      6
    ]
  },
  {
    "symbol_id": 115,
    "symbol": "眼睛",
    "alias_list": [
      "眼睛",
      "雙眼",
      "双眼",
      "目光",
      "眼球",
      "盲眼",
      "睜開眼",
      "睁开眼"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我洞察之窗、覺察真相的清醒意志",
        "weight": 0.7
      },
      "3": {
        "text": "心靈之靈光、被注視審判的焦慮",
        "weight": 0.79
      },
      "4": {
        "text": "窺探慾望與看穿偽裝的直覺能力",
        "weight": 0.68
      }
    },
    "book_interpret": {
      "1": {
        "text": "自我洞察之窗、覺察真相的清醒意志",
        "weight": 0.7
      },
      "3": {
        "text": "心靈之靈光、被注視審判的焦慮",
        "weight": 0.79
      },
      "4": {
        "text": "窺探慾望與看穿偽裝的直覺能力",
        "weight": 0.68
      }
    },
    "source_ref": "1,3,4",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 116,
    "symbol": "心臟",
    "alias_list": [
      "心臟",
      "心脏",
      "胸膛",
      "心跳",
      "劇烈心跳",
      "剧烈心跳",
      "心痛"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "最真實情感核心、生命跳動的原動力",
        "weight": 0.7
      },
      "3": {
        "text": "真誠之源、愛與熱忱的最高本質",
        "weight": 0.8
      },
      "22": {
        "text": "自律神經與心身健康警示反應",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "最真實情感核心、生命跳動的原動力",
        "weight": 0.7
      },
      "3": {
        "text": "真誠之源、愛與熱忱的最高本質",
        "weight": 0.8
      },
      "22": {
        "text": "自律神經與心身健康警示反應",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,22",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 117,
    "symbol": "牙齒",
    "alias_list": [
      "牙齒",
      "牙齿",
      "牙齒脱落",
      "牙齿脱落",
      "掉牙",
      "落牙",
      "牙痛",
      "蛀牙",
      "門牙",
      "门牙",
      "碎牙"
    ],
    "tags": [
      "身體原型",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "成長與衰老焦慮、控制感剝奪、言語悔恨",
        "weight": 0.72
      },
      "4": {
        "text": "去勢焦慮與攻擊力量被削弱的恐慌",
        "weight": 0.68
      },
      "20": {
        "text": "全球高頻噩夢、深層尊嚴與形象受損焦慮",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "成長與衰老焦慮、控制感剝奪、言語悔恨",
        "weight": 0.72
      },
      "4": {
        "text": "去勢焦慮與攻擊力量被削弱的恐慌",
        "weight": 0.68
      },
      "20": {
        "text": "全球高頻噩夢、深層尊嚴與形象受損焦慮",
        "weight": 0.77
      }
    },
    "source_ref": "1,4,20",
    "notes": "身體原型",
    "tag_ids": [
      4,
      6
    ]
  },
  {
    "symbol_id": 118,
    "symbol": "皮膚",
    "alias_list": [
      "皮膚",
      "皮肤",
      "表皮",
      "傷痕",
      "伤痕",
      "疹子",
      "敏感"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我與外界的第一道防禦邊界",
        "weight": 0.7
      },
      "7": {
        "text": "人際接觸的敏感度與被侵犯的不適感",
        "weight": 0.73
      },
      "22": {
        "text": "心身壓力引發的生理邊界敏感警號",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "自我與外界的第一道防禦邊界",
        "weight": 0.7
      },
      "7": {
        "text": "人際接觸的敏感度與被侵犯的不適感",
        "weight": 0.73
      },
      "22": {
        "text": "心身壓力引發的生理邊界敏感警號",
        "weight": 0.71
      }
    },
    "source_ref": "1,7,22",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 119,
    "symbol": "頭",
    "alias_list": [
      "頭",
      "头",
      "腦袋",
      "脑袋",
      "頭部",
      "头部",
      "頭顱",
      "头颅",
      "思想"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "理智控制中樞、過度思慮的疲憊負擔",
        "weight": 0.7
      },
      "4": {
        "text": "意識自我（Ego）至高意志的體現",
        "weight": 0.69
      },
      "5": {
        "text": "理性與感性拉鋸引發的頭部緊繃",
        "weight": 0.67
      }
    },
    "book_interpret": {
      "1": {
        "text": "理智控制中樞、過度思慮的疲憊負擔",
        "weight": 0.7
      },
      "4": {
        "text": "意識自我（Ego）至高意志的體現",
        "weight": 0.69
      },
      "5": {
        "text": "理性與感性拉鋸引發的頭部緊繃",
        "weight": 0.67
      }
    },
    "source_ref": "1,4,5",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 120,
    "symbol": "手",
    "alias_list": [
      "手",
      "手掌",
      "手指",
      "雙手",
      "双手",
      "握手",
      "拳頭",
      "拳头",
      "抓取"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "行動實踐力、人際連結與給予照料",
        "weight": 0.7
      },
      "7": {
        "text": "掌控環境的能力、握緊或放手的抉擇",
        "weight": 0.72
      },
      "10": {
        "text": "創造與構建命運的原型工具",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "行動實踐力、人際連結與給予照料",
        "weight": 0.7
      },
      "7": {
        "text": "掌控環境的能力、握緊或放手的抉擇",
        "weight": 0.72
      },
      "10": {
        "text": "創造與構建命運的原型工具",
        "weight": 0.74
      }
    },
    "source_ref": "1,7,10",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 121,
    "symbol": "腳",
    "alias_list": [
      "腳",
      "脚",
      "雙腳",
      "双脚",
      "赤腳",
      "赤脚",
      "腳掌",
      "脚掌",
      "無法邁步",
      "无法迈步",
      "腳步",
      "脚步"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "立足大地之根基、前進道路的踏實度",
        "weight": 0.7
      },
      "7": {
        "text": "赤腳無鞋反映的心靈無防備與現實缺乏保障",
        "weight": 0.73
      },
      "10": {
        "text": "扎根現實與邁向未來的生命步態",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "立足大地之根基、前進道路的踏實度",
        "weight": 0.7
      },
      "7": {
        "text": "赤腳無鞋反映的心靈無防備與現實缺乏保障",
        "weight": 0.73
      },
      "10": {
        "text": "扎根現實與邁向未來的生命步態",
        "weight": 0.74
      }
    },
    "source_ref": "1,7,10",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 122,
    "symbol": "血",
    "alias_list": [
      "血",
      "鮮血",
      "鲜血",
      "流血",
      "血液",
      "血跡",
      "血迹",
      "吐血"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "最寶貴生命能量的損耗或熱情爆發",
        "weight": 0.7
      },
      "4": {
        "text": "心靈受創傷、無法遮掩的痛楚付出",
        "weight": 0.69
      },
      "9": {
        "text": "創傷體驗再現與生命能量的呼救信號",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "最寶貴生命能量的損耗或熱情爆發",
        "weight": 0.7
      },
      "4": {
        "text": "心靈受創傷、無法遮掩的痛楚付出",
        "weight": 0.69
      },
      "9": {
        "text": "創傷體驗再現與生命能量的呼救信號",
        "weight": 0.73
      }
    },
    "source_ref": "1,4,9",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 123,
    "symbol": "骨頭",
    "alias_list": [
      "骨頭",
      "骨头",
      "白骨",
      "骸骨",
      "骨骼",
      "肋骨",
      "斷骨",
      "断骨"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人格核心支撐架構、不可瓦解的原則底線",
        "weight": 0.7
      },
      "3": {
        "text": "剝除一切虛偽偽裝後的生命本質真理",
        "weight": 0.78
      },
      "10": {
        "text": "即使肉身消逝依然長存的心靈印記",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "人格核心支撐架構、不可瓦解的原則底線",
        "weight": 0.7
      },
      "3": {
        "text": "剝除一切虛偽偽裝後的生命本質真理",
        "weight": 0.78
      },
      "10": {
        "text": "即使肉身消逝依然長存的心靈印記",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 124,
    "symbol": "頭髮",
    "alias_list": [
      "頭髮",
      "头发",
      "長髮",
      "长发",
      "短髮",
      "短发",
      "剪頭髮",
      "剪头发",
      "掉頭髮",
      "掉头发",
      "脱髮",
      "脱发",
      "梳頭",
      "梳头"
    ],
    "tags": [
      "身體原型"
    ],
    "book_interpret_json": {
      "1": {
        "text": "個人魅力、思緒牽絆與三千煩惱絲",
        "weight": 0.7
      },
      "4": {
        "text": "生命力量象徵與剪髮帶來的脫胎換骨感",
        "weight": 0.68
      },
      "19": {
        "text": "華人文化中精氣神外顯與告別往事的決心",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "個人魅力、思緒牽絆與三千煩惱絲",
        "weight": 0.7
      },
      "4": {
        "text": "生命力量象徵與剪髮帶來的脫胎換骨感",
        "weight": 0.68
      },
      "19": {
        "text": "華人文化中精氣神外顯與告別往事的決心",
        "weight": 0.71
      }
    },
    "source_ref": "1,4,19",
    "notes": "身體原型",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 125,
    "symbol": "追逐",
    "alias_list": [
      "追逐",
      "被追",
      "逃跑",
      "狂奔逃命",
      "追趕",
      "追赶",
      "逃脱"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "逃避現實沉重焦慮、未正視的陰影步步進逼",
        "weight": 0.72
      },
      "4": {
        "text": "本能願望受超我審查追逼的具象化恐懼",
        "weight": 0.7
      },
      "6": {
        "text": "被追趕者實為自己未整合的陰影投射",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "1": {
        "text": "逃避現實沉重焦慮、未正視的陰影步步進逼",
        "weight": 0.72
      },
      "4": {
        "text": "本能願望受超我審查追逼的具象化恐懼",
        "weight": 0.7
      },
      "6": {
        "text": "被追趕者實為自己未整合的陰影投射",
        "weight": 0.78
      }
    },
    "source_ref": "1,4,6",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 126,
    "symbol": "尋找東西",
    "alias_list": [
      "尋找東西",
      "寻找东西",
      "找東西",
      "找东西",
      "找尋",
      "找寻",
      "丟失尋找",
      "丢失寻找",
      "找路",
      "翻找"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "追尋失落的自我拼圖、精神價值重拾",
        "weight": 0.7
      },
      "5": {
        "text": "對生活中某項未達成目標的焦慮執念",
        "weight": 0.68
      },
      "8": {
        "text": "探索潛意識深處迷失的初心與靈感",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "追尋失落的自我拼圖、精神價值重拾",
        "weight": 0.7
      },
      "5": {
        "text": "對生活中某項未達成目標的焦慮執念",
        "weight": 0.68
      },
      "8": {
        "text": "探索潛意識深處迷失的初心與靈感",
        "weight": 0.72
      }
    },
    "source_ref": "1,5,8",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 127,
    "symbol": "溺水",
    "alias_list": [
      "溺水",
      "浸水",
      "沉入水中",
      "快要淹死",
      "沉沒",
      "沉没",
      "淹水"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "情緒洪流排山倒海、失去主控權的窒息感",
        "weight": 0.73
      },
      "3": {
        "text": "被潛意識母體汪洋吞噬的恐慌危機",
        "weight": 0.8
      },
      "20": {
        "text": "極高頻情緒過載噩夢、急需浮出水面呼吸",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "情緒洪流排山倒海、失去主控權的窒息感",
        "weight": 0.73
      },
      "3": {
        "text": "被潛意識母體汪洋吞噬的恐慌危機",
        "weight": 0.8
      },
      "20": {
        "text": "極高頻情緒過載噩夢、急需浮出水面呼吸",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,20",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 128,
    "symbol": "墜落",
    "alias_list": [
      "墜落",
      "坠落",
      "高處跌落",
      "高处跌落",
      "跌落",
      "懸崖掉下",
      "悬崖掉下",
      "失足",
      "掉下去"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "失去安全支撐、期待落空、失控恐懼",
        "weight": 0.72
      },
      "17": {
        "text": "入睡期前庭神經肌肉抽搐引發的生理夢境",
        "weight": 0.68
      },
      "20": {
        "text": "失去地面著力點的心靈墜地危機",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "失去安全支撐、期待落空、失控恐懼",
        "weight": 0.72
      },
      "17": {
        "text": "入睡期前庭神經肌肉抽搐引發的生理夢境",
        "weight": 0.68
      },
      "20": {
        "text": "失去地面著力點的心靈墜地危機",
        "weight": 0.76
      }
    },
    "source_ref": "1,17,20",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 129,
    "symbol": "考試／答不出題",
    "alias_list": [
      "考試／答不出題",
      "考试／答不出题",
      "考試",
      "考试",
      "答不出題",
      "答不出题",
      "答不出",
      "遲到考試",
      "迟到考试",
      "做試卷",
      "做试卷",
      "考場",
      "考场",
      "答卷"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "社會評價焦慮、完美主義苛責自我的縮影",
        "weight": 0.72
      },
      "5": {
        "text": "人生重要關卡前夜的自我能力懷疑與演練",
        "weight": 0.69
      },
      "20": {
        "text": "成年人長久難以釋懷的求學時期審判情結",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "社會評價焦慮、完美主義苛責自我的縮影",
        "weight": 0.72
      },
      "5": {
        "text": "人生重要關卡前夜的自我能力懷疑與演練",
        "weight": 0.69
      },
      "20": {
        "text": "成年人長久難以釋懷的求學時期審判情結",
        "weight": 0.77
      }
    },
    "source_ref": "1,5,20",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 130,
    "symbol": "遲到",
    "alias_list": [
      "遲到",
      "迟到",
      "趕不及",
      "赶不及",
      "錯過班車",
      "错过班车",
      "錯過飛機",
      "错过飞机",
      "趕不上",
      "赶不上",
      "誤機",
      "误机"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "錯失良機恐懼、生活節奏失控的自責感",
        "weight": 0.7
      },
      "5": {
        "text": "潛意識對某項承諾的真實抗拒與逃避",
        "weight": 0.68
      },
      "20": {
        "text": "緊迫時間壓力下的心理警鐘鳴響",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "錯失良機恐懼、生活節奏失控的自責感",
        "weight": 0.7
      },
      "5": {
        "text": "潛意識對某項承諾的真實抗拒與逃避",
        "weight": 0.68
      },
      "20": {
        "text": "緊迫時間壓力下的心理警鐘鳴響",
        "weight": 0.73
      }
    },
    "source_ref": "1,5,20",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 131,
    "symbol": "飛翔",
    "alias_list": [
      "飛翔",
      "飞翔",
      "飛",
      "飞",
      "升空",
      "凌空飛行",
      "凌空飞行",
      "飛起",
      "飞起",
      "翱翔"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "擺脫現世沉重枷鎖、追求絕對心靈自由",
        "weight": 0.72
      },
      "2": {
        "text": "精神自我超越與自性向上伸展之翼",
        "weight": 0.78
      },
      "3": {
        "text": "飛翔伴隨的過度膨脹警示（伊卡洛斯警鐘）",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "擺脫現世沉重枷鎖、追求絕對心靈自由",
        "weight": 0.72
      },
      "2": {
        "text": "精神自我超越與自性向上伸展之翼",
        "weight": 0.78
      },
      "3": {
        "text": "飛翔伴隨的過度膨脹警示（伊卡洛斯警鐘）",
        "weight": 0.77
      }
    },
    "source_ref": "1,2,3",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 132,
    "symbol": "躲藏",
    "alias_list": [
      "躲藏",
      "藏起來",
      "藏起来",
      "匿藏",
      "躲避",
      "匿埋",
      "藏身"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "害怕受傷被批判、尋求安全的避風防線",
        "weight": 0.7
      },
      "4": {
        "text": "壓抑不可告人之秘密或脆弱感受",
        "weight": 0.68
      },
      "7": {
        "text": "暫時退避以積蓄力量的面對策略",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "害怕受傷被批判、尋求安全的避風防線",
        "weight": 0.7
      },
      "4": {
        "text": "壓抑不可告人之秘密或脆弱感受",
        "weight": 0.68
      },
      "7": {
        "text": "暫時退避以積蓄力量的面對策略",
        "weight": 0.71
      }
    },
    "source_ref": "1,4,7",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 133,
    "symbol": "殺人",
    "alias_list": [
      "殺人",
      "杀人",
      "殺害",
      "杀害",
      "奪命",
      "夺命",
      "動手殺人",
      "动手杀人",
      "終結對手",
      "终结对手"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "渴望徹底終結某種心理特質或窒息關係",
        "weight": 0.71
      },
      "4": {
        "text": "強烈壓抑攻擊衝動的極端戲劇化宣洩",
        "weight": 0.7
      },
      "6": {
        "text": "殺死象徵與過去負面人格徹底割席決心",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "渴望徹底終結某種心理特質或窒息關係",
        "weight": 0.71
      },
      "4": {
        "text": "強烈壓抑攻擊衝動的極端戲劇化宣洩",
        "weight": 0.7
      },
      "6": {
        "text": "殺死象徵與過去負面人格徹底割席決心",
        "weight": 0.77
      }
    },
    "source_ref": "1,4,6",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 134,
    "symbol": "死亡",
    "alias_list": [
      "死亡",
      "死掉",
      "逝世",
      "斷氣",
      "断气",
      "離世",
      "离世",
      "葬禮",
      "葬礼",
      "臨終",
      "临终"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "舊生命週期的終結、重大心理蛻變轉折點",
        "weight": 0.75
      },
      "3": {
        "text": "死亡-重生原型核心、鳳凰涅槃必經之路",
        "weight": 0.84
      },
      "10": {
        "text": "舊我消亡方有新我誕生的必然規律",
        "weight": 0.8
      }
    },
    "book_interpret": {
      "1": {
        "text": "舊生命週期的終結、重大心理蛻變轉折點",
        "weight": 0.75
      },
      "3": {
        "text": "死亡-重生原型核心、鳳凰涅槃必經之路",
        "weight": 0.84
      },
      "10": {
        "text": "舊我消亡方有新我誕生的必然規律",
        "weight": 0.8
      }
    },
    "source_ref": "1,3,10",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 135,
    "symbol": "奔跑",
    "alias_list": [
      "奔跑",
      "跑步",
      "拼命跑",
      "向前衝",
      "向前冲",
      "飛奔",
      "飞奔",
      "狂奔"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "奮力爭取目標的昂揚動能或奔逃自保",
        "weight": 0.7
      },
      "5": {
        "text": "面對急迫挑戰時全力以赴的精神調動",
        "weight": 0.69
      },
      "17": {
        "text": "運動神經元活躍釋放的充沛心理能量",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "奮力爭取目標的昂揚動能或奔逃自保",
        "weight": 0.7
      },
      "5": {
        "text": "面對急迫挑戰時全力以赴的精神調動",
        "weight": 0.69
      },
      "17": {
        "text": "運動神經元活躍釋放的充沛心理能量",
        "weight": 0.71
      }
    },
    "source_ref": "1,5,17",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 136,
    "symbol": "迷路",
    "alias_list": [
      "迷路",
      "找不到路",
      "走失",
      "迷失方向",
      "兜圈子"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生路口徘徊迷茫、價值觀混淆未定",
        "weight": 0.71
      },
      "2": {
        "text": "原有地圖失效、等待內在指南針重新校準",
        "weight": 0.75
      },
      "8": {
        "text": "脫離常規軌道後的探險契機",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生路口徘徊迷茫、價值觀混淆未定",
        "weight": 0.71
      },
      "2": {
        "text": "原有地圖失效、等待內在指南針重新校準",
        "weight": 0.75
      },
      "8": {
        "text": "脫離常規軌道後的探險契機",
        "weight": 0.72
      }
    },
    "source_ref": "1,2,8",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 137,
    "symbol": "受傷",
    "alias_list": [
      "受傷",
      "受伤",
      "流血受傷",
      "流血受伤",
      "骨折",
      "創口",
      "创口",
      "傷痛",
      "伤痛",
      "疼痛"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "情感遭受打擊、心靈防線破損需要療傷",
        "weight": 0.72
      },
      "7": {
        "text": "提醒自己尊重脆弱、給予溫柔關懷",
        "weight": 0.73
      },
      "9": {
        "text": "過去創傷情結被現實刺激重新觸動喚醒",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "情感遭受打擊、心靈防線破損需要療傷",
        "weight": 0.72
      },
      "7": {
        "text": "提醒自己尊重脆弱、給予溫柔關懷",
        "weight": 0.73
      },
      "9": {
        "text": "過去創傷情結被現實刺激重新觸動喚醒",
        "weight": 0.76
      }
    },
    "source_ref": "1,7,9",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 138,
    "symbol": "結婚",
    "alias_list": [
      "結婚",
      "结婚",
      "婚禮",
      "婚礼",
      "完婚",
      "披嫁衣",
      "新娘",
      "新郎"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "2": {
        "text": "意識與無意識神秘結合（Coniunctio）",
        "weight": 0.8
      },
      "3": {
        "text": "內在陽性與陰性力量的圓滿整合與協調",
        "weight": 0.83
      },
      "10": {
        "text": "進入全新人生階段的成熟心理契約",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "2": {
        "text": "意識與無意識神秘結合（Coniunctio）",
        "weight": 0.8
      },
      "3": {
        "text": "內在陽性與陰性力量的圓滿整合與協調",
        "weight": 0.83
      },
      "10": {
        "text": "進入全新人生階段的成熟心理契約",
        "weight": 0.78
      }
    },
    "source_ref": "2,3,10",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 139,
    "symbol": "分手",
    "alias_list": [
      "分手",
      "離異",
      "离异",
      "決裂",
      "决裂",
      "斷絕關係",
      "断绝关系",
      "感情破裂",
      "説再見",
      "说再见"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "4": {
        "text": "痛苦斬斷舊有依附關係、面對分離焦慮",
        "weight": 0.71
      },
      "8": {
        "text": "心理獨立與重新找回自主邊界的必修課",
        "weight": 0.74
      },
      "15": {
        "text": "哀傷歷程重整、為下一段心靈連結騰出空間",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "4": {
        "text": "痛苦斬斷舊有依附關係、面對分離焦慮",
        "weight": 0.71
      },
      "8": {
        "text": "心理獨立與重新找回自主邊界的必修課",
        "weight": 0.74
      },
      "15": {
        "text": "哀傷歷程重整、為下一段心靈連結騰出空間",
        "weight": 0.72
      }
    },
    "source_ref": "4,8,15",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 140,
    "symbol": "開槍",
    "alias_list": [
      "開槍",
      "开枪",
      "射擊",
      "射击",
      "扣扳機",
      "扣扳机",
      "中槍",
      "中枪",
      "槍戰",
      "枪战"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "劇烈爆發的果斷意志、了結糾纏僵局",
        "weight": 0.7
      },
      "4": {
        "text": "攻擊性本能爆發與直截了當的邊界劃定",
        "weight": 0.69
      },
      "6": {
        "text": "自我防衛極端手段、消除重大威脅之企圖",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "劇烈爆發的果斷意志、了結糾纏僵局",
        "weight": 0.7
      },
      "4": {
        "text": "攻擊性本能爆發與直截了當的邊界劃定",
        "weight": 0.69
      },
      "6": {
        "text": "自我防衛極端手段、消除重大威脅之企圖",
        "weight": 0.74
      }
    },
    "source_ref": "1,4,6",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 141,
    "symbol": "被綁",
    "alias_list": [
      "被綁",
      "被绑",
      "被捆綁",
      "被捆绑",
      "失去行動自由",
      "失去行动自由",
      "動彈不得",
      "动弹不得",
      "繩索束縛",
      "绳索束缚"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "無力抵抗外界現實壓迫、內在被動癱瘓感",
        "weight": 0.73
      },
      "6": {
        "text": "被某種執念或道德愧疚牢牢鎖死",
        "weight": 0.75
      },
      "9": {
        "text": "創傷壓制無助狀態重現、急需找回話語權",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "無力抵抗外界現實壓迫、內在被動癱瘓感",
        "weight": 0.73
      },
      "6": {
        "text": "被某種執念或道德愧疚牢牢鎖死",
        "weight": 0.75
      },
      "9": {
        "text": "創傷壓制無助狀態重現、急需找回話語權",
        "weight": 0.76
      }
    },
    "source_ref": "1,6,9",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 142,
    "symbol": "斷電",
    "alias_list": [
      "斷電",
      "断电",
      "跳閘",
      "跳闸",
      "漆黑一片",
      "停電",
      "停电",
      "忽然全黑"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "意識理智控制中斷、面對深不見底的無意識",
        "weight": 0.71
      },
      "5": {
        "text": "心理能量耗竭、心力交瘁時的保護性跳閘",
        "weight": 0.7
      },
      "20": {
        "text": "失去外界資訊依靠時的突發慌亂感",
        "weight": 0.72
      }
    },
    "book_interpret": {
      "1": {
        "text": "意識理智控制中斷、面對深不見底的無意識",
        "weight": 0.71
      },
      "5": {
        "text": "心理能量耗竭、心力交瘁時的保護性跳閘",
        "weight": 0.7
      },
      "20": {
        "text": "失去外界資訊依靠時的突發慌亂感",
        "weight": 0.72
      }
    },
    "source_ref": "1,5,20",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 143,
    "symbol": "裸體",
    "alias_list": [
      "裸體",
      "裸体",
      "赤身",
      "光身",
      "沒穿衣服",
      "没穿衣服",
      "一絲不掛",
      "一丝不挂",
      "羞恥裸露",
      "羞耻裸露"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "卸除一切偽裝與防備、真實脆弱暴露",
        "weight": 0.72
      },
      "4": {
        "text": "本我真實與被公眾凝視評判的羞恥焦慮",
        "weight": 0.7
      },
      "16": {
        "text": "跨文化象徵：坦誠相見與剝除社會面具後的純真",
        "weight": 0.69
      }
    },
    "book_interpret": {
      "1": {
        "text": "卸除一切偽裝與防備、真實脆弱暴露",
        "weight": 0.72
      },
      "4": {
        "text": "本我真實與被公眾凝視評判的羞恥焦慮",
        "weight": 0.7
      },
      "16": {
        "text": "跨文化象徵：坦誠相見與剝除社會面具後的純真",
        "weight": 0.69
      }
    },
    "source_ref": "1,4,16",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 144,
    "symbol": "漂浮",
    "alias_list": [
      "漂浮",
      "懸浮空中",
      "悬浮空中",
      "浮游",
      "漂在水面",
      "凌空漂浮"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "放下抵抗順應生命之流、超然脫俗體驗",
        "weight": 0.72
      },
      "2": {
        "text": "身心深度放鬆、精神漫遊於重力之外",
        "weight": 0.77
      },
      "13": {
        "text": "清醒夢中極為高頻的美妙自我覺察體驗",
        "weight": 0.75
      }
    },
    "book_interpret": {
      "1": {
        "text": "放下抵抗順應生命之流、超然脫俗體驗",
        "weight": 0.72
      },
      "2": {
        "text": "身心深度放鬆、精神漫遊於重力之外",
        "weight": 0.77
      },
      "13": {
        "text": "清醒夢中極為高頻的美妙自我覺察體驗",
        "weight": 0.75
      }
    },
    "source_ref": "1,2,13",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 145,
    "symbol": "哭泣",
    "alias_list": [
      "哭泣",
      "痛哭",
      "流淚",
      "流泪",
      "抽泣",
      "悲傷大哭",
      "悲伤大哭",
      "淚流滿面",
      "泪流满面"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "積壓已久情緒的健康宣洩與心靈解凍",
        "weight": 0.73
      },
      "7": {
        "text": "與內在哀傷和解、淚水具有深層洗滌淨化力量",
        "weight": 0.76
      },
      "8": {
        "text": "真情流露、卸除日間堅強偽裝後的自我撫慰",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "積壓已久情緒的健康宣洩與心靈解凍",
        "weight": 0.73
      },
      "7": {
        "text": "與內在哀傷和解、淚水具有深層洗滌淨化力量",
        "weight": 0.76
      },
      "8": {
        "text": "真情流露、卸除日間堅強偽裝後的自我撫慰",
        "weight": 0.74
      }
    },
    "source_ref": "1,7,8",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 146,
    "symbol": "窒息",
    "alias_list": [
      "窒息",
      "喘不過氣",
      "喘不过气",
      "呼吸困難",
      "呼吸困难",
      "被掐住脖子",
      "缺氧"
    ],
    "tags": [
      "動作情境",
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "現實生活環境過載、情緒空間被逼迫至極限",
        "weight": 0.75
      },
      "9": {
        "text": "創傷壓力下呼吸道痙攣與恐慌發作映射",
        "weight": 0.76
      },
      "22": {
        "text": "睡眠呼吸暫停或胸腔壓迫的生理直接報警",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "現實生活環境過載、情緒空間被逼迫至極限",
        "weight": 0.75
      },
      "9": {
        "text": "創傷壓力下呼吸道痙攣與恐慌發作映射",
        "weight": 0.76
      },
      "22": {
        "text": "睡眠呼吸暫停或胸腔壓迫的生理直接報警",
        "weight": 0.73
      }
    },
    "source_ref": "1,9,22",
    "notes": "動作情境",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 147,
    "symbol": "重逢",
    "alias_list": [
      "重逢",
      "久別重逢",
      "久别重逢",
      "再相遇",
      "遇見舊人",
      "遇见旧人",
      "再次相聚"
    ],
    "tags": [
      "動作情境"
    ],
    "book_interpret_json": {
      "1": {
        "text": "找回內心曾割捨遺失的珍貴部分",
        "weight": 0.72
      },
      "8": {
        "text": "情感未了之結的圓滿修復契機",
        "weight": 0.75
      },
      "15": {
        "text": "跨越時空與過去自我對話的心靈和解",
        "weight": 0.73
      }
    },
    "book_interpret": {
      "1": {
        "text": "找回內心曾割捨遺失的珍貴部分",
        "weight": 0.72
      },
      "8": {
        "text": "情感未了之結的圓滿修復契機",
        "weight": 0.75
      },
      "15": {
        "text": "跨越時空與過去自我對話的心靈和解",
        "weight": 0.73
      }
    },
    "source_ref": "1,8,15",
    "notes": "動作情境",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 148,
    "symbol": "洪水",
    "alias_list": [
      "洪水",
      "大水氾濫",
      "大水泛滥",
      "山洪",
      "暴雨淹浸",
      "水漫金山",
      "漫水"
    ],
    "tags": [
      "噩夢危機",
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "壓抑已久的情感洪流衝破防線、無法遏止",
        "weight": 0.73
      },
      "3": {
        "text": "潛意識大氾濫、毀滅舊秩序以迎接滌淨",
        "weight": 0.81
      },
      "20": {
        "text": "情緒完全失控帶來的壓倒性恐慌噩夢",
        "weight": 0.77
      }
    },
    "book_interpret": {
      "1": {
        "text": "壓抑已久的情感洪流衝破防線、無法遏止",
        "weight": 0.73
      },
      "3": {
        "text": "潛意識大氾濫、毀滅舊秩序以迎接滌淨",
        "weight": 0.81
      },
      "20": {
        "text": "情緒完全失控帶來的壓倒性恐慌噩夢",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,20",
    "notes": "噩夢危機",
    "tag_ids": [
      6,
      8
    ]
  },
  {
    "symbol_id": 149,
    "symbol": "火災",
    "alias_list": [
      "火災",
      "火灾",
      "大火燒屋",
      "大火烧屋",
      "發生火災",
      "发生火灾",
      "火場",
      "火场",
      "火海逃生",
      "失火"
    ],
    "tags": [
      "噩夢危機",
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "劇烈衝突升溫、危在旦夕的轉折考驗",
        "weight": 0.72
      },
      "10": {
        "text": "狂熱情緒與毀滅性能量急需疏導",
        "weight": 0.78
      },
      "20": {
        "text": "被迫放棄舊有資產與生活防禦的極端危機",
        "weight": 0.76
      }
    },
    "book_interpret": {
      "1": {
        "text": "劇烈衝突升溫、危在旦夕的轉折考驗",
        "weight": 0.72
      },
      "10": {
        "text": "狂熱情緒與毀滅性能量急需疏導",
        "weight": 0.78
      },
      "20": {
        "text": "被迫放棄舊有資產與生活防禦的極端危機",
        "weight": 0.76
      }
    },
    "source_ref": "1,10,20",
    "notes": "噩夢危機",
    "tag_ids": [
      6,
      8
    ]
  },
  {
    "symbol_id": 150,
    "symbol": "地震",
    "alias_list": [
      "地震",
      "地動山搖",
      "地动山摇",
      "房屋震塌",
      "地陷",
      "劇烈震動",
      "剧烈震动"
    ],
    "tags": [
      "噩夢危機",
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生根基動搖、最信賴的依靠突遭崩塌",
        "weight": 0.72
      },
      "15": {
        "text": "安全感全線瓦解帶來的生存危機震撼",
        "weight": 0.74
      },
      "22": {
        "text": "不可抗拒的大震盪引發的深度身心焦慮",
        "weight": 0.71
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生根基動搖、最信賴的依靠突遭崩塌",
        "weight": 0.72
      },
      "15": {
        "text": "安全感全線瓦解帶來的生存危機震撼",
        "weight": 0.74
      },
      "22": {
        "text": "不可抗拒的大震盪引發的深度身心焦慮",
        "weight": 0.71
      }
    },
    "source_ref": "1,15,22",
    "notes": "噩夢危機",
    "tag_ids": [
      6,
      8
    ]
  },
  {
    "symbol_id": 151,
    "symbol": "海嘯",
    "alias_list": [
      "海嘯",
      "海啸",
      "滔天巨浪",
      "巨浪翻滾",
      "巨浪翻滚",
      "海嘯來襲",
      "海啸来袭"
    ],
    "tags": [
      "噩夢危機",
      "自然物象"
    ],
    "book_interpret_json": {
      "1": {
        "text": "集體無意識巨大衝擊、個人意志無法匹敵",
        "weight": 0.75
      },
      "3": {
        "text": "超個人不可控的情緒巨浪衝垮現代理智防線",
        "weight": 0.82
      },
      "20": {
        "text": "面臨滅頂之災時急欲逃往高處的心靈求生本能",
        "weight": 0.78
      }
    },
    "book_interpret": {
      "1": {
        "text": "集體無意識巨大衝擊、個人意志無法匹敵",
        "weight": 0.75
      },
      "3": {
        "text": "超個人不可控的情緒巨浪衝垮現代理智防線",
        "weight": 0.82
      },
      "20": {
        "text": "面臨滅頂之災時急欲逃往高處的心靈求生本能",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,20",
    "notes": "噩夢危機",
    "tag_ids": [
      6,
      8
    ]
  },
  {
    "symbol_id": 152,
    "symbol": "車禍／墜機",
    "alias_list": [
      "車禍／墜機",
      "车祸／坠机",
      "車禍",
      "车祸",
      "墜機",
      "坠机",
      "撞車",
      "撞车",
      "交通意外",
      "翻車",
      "翻车",
      "空難",
      "空难"
    ],
    "tags": [
      "噩夢危機"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生急進步調突遭猛烈挫敗、被迫停下",
        "weight": 0.73
      },
      "9": {
        "text": "生活失控與不可挽回後果的強烈焦慮驚悸",
        "weight": 0.75
      },
      "20": {
        "text": "追求速度與控制感過度後的崩解警鐘",
        "weight": 0.74
      }
    },
    "book_interpret": {
      "1": {
        "text": "人生急進步調突遭猛烈挫敗、被迫停下",
        "weight": 0.73
      },
      "9": {
        "text": "生活失控與不可挽回後果的強烈焦慮驚悸",
        "weight": 0.75
      },
      "20": {
        "text": "追求速度與控制感過度後的崩解警鐘",
        "weight": 0.74
      }
    },
    "source_ref": "1,9,20",
    "notes": "噩夢危機",
    "tag_ids": [
      6
    ]
  }
];
