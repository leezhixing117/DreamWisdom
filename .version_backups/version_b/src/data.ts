import { BookBrainItem, DreamEntry, EngineSettings, EnginePresetType, User, DreamDNA, ConstellationNode, ConstellationLink, ThirtyNightsJourney, DetectiveQuestion, AdVideoItem } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_super_mystic',
    email: 'mysticblaza@gmail.com',
    display_name: 'Mystic Blaza',
    role: 'super_admin',
    password: 'Abc123',
    stars: 999,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user_admin_boyman',
    email: 'admin@dreamwisdom.com',
    display_name: 'Alex (內容管理員)',
    role: 'admin',
    password: 'Abc123',
    stars: 999,
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'user_paid',
    email: 'pro.dreamer@gmail.com',
    display_name: 'Elena (付費會員)',
    role: 'paid',
    password: 'Abc123',
    stars: 999,
    created_at: '2026-09-05T12:30:00Z',
  },
  {
    id: 'user_free',
    email: 'free.user@gmail.com',
    display_name: 'Chris (一般會員)',
    role: 'free',
    password: 'Abc123',
    stars: 6,
    created_at: '2026-09-10T14:15:00Z',
  },
  {
    id: 'user_boyman',
    email: 'boyman131418@gmail.com',
    display_name: 'Boyman (創始高級管理員)',
    role: 'super_admin',
    password: 'Abc123',
    stars: 999,
    created_at: '2026-09-01T00:00:00Z',
  },
];

export const INITIAL_BOOKS: BookBrainItem[] = [
  {
    id: 'book1',
    title: 'Man and His Symbols (Carl G. Jung)',
    file_name: 'man-and-his-symbols.pdf',
    status: 'ready',
    total_pages: 320,
    processed_pages: 320,
    created_at: '2026-09-01T12:00:00Z',
  },
  {
    id: 'book2',
    title: 'The Interpretation of Dreams (Sigmund Freud)',
    file_name: 'interpretation-of-dreams.pdf',
    status: 'ready',
    total_pages: 544,
    processed_pages: 544,
    created_at: '2026-09-02T16:00:00Z',
  },
  {
    id: 'book3',
    title: '當代華人夢境象徵與心理原鄉 (Contemporary Asian Dream Symbolism)',
    file_name: 'asian-dream-archetypes.pdf',
    status: 'ready',
    total_pages: 280,
    processed_pages: 280,
    created_at: '2026-09-08T10:00:00Z',
  },
  {
    id: 'book4',
    title: 'Dreaming: A Very Short Introduction (J. Allan Hobson)',
    file_name: 'dreaming-short-intro.pdf',
    status: 'ready',
    total_pages: 156,
    processed_pages: 156,
    created_at: '2026-09-12T09:20:00Z',
  },
];

export interface EnginePresetDefinition {
  id: EnginePresetType;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  settings: Partial<EngineSettings>;
}

export const ENGINE_PRESETS: EnginePresetDefinition[] = [
  {
    id: 'balanced',
    name: '平衡全維度標準',
    badge: '⚖️ 推薦基準',
    tagline: '學理深度與共情溫度的黃金平衡',
    description: '兼具榮格典籍學理、當代東方生活文化共鳴與溫潤撫慰，給予清晰具體的生活轉化指引。適合日常絕大多數夢境。',
    settings: {
      personality: 70,
      decisiveness: 65,
      depth: 85,
      culturalResonance: 85,
      poeticTone: 65,
      shadowSensitivity: 85,
      temperature: 0.35,
      model: 'gemini-3.8-flash',
      preset: 'balanced',
    },
  },
  {
    id: 'empathetic',
    name: '暖心心靈陪伴師',
    badge: '🌿 溫潤治癒',
    tagline: '極致溫柔、深層共情與安全著陸',
    description: '大幅提升共情溫度與心靈擁抱感，降低晦澀術語阻隔。對噩夢、焦慮夢給予強大的情緒承接與安全感。',
    settings: {
      personality: 95,
      decisiveness: 45,
      depth: 65,
      culturalResonance: 80,
      poeticTone: 85,
      shadowSensitivity: 98,
      temperature: 0.40,
      model: 'gemini-3.8-flash',
      preset: 'empathetic',
    },
  },
  {
    id: 'scholar',
    name: '嚴謹榮格臨床學者',
    badge: '🏛️ 學理考證',
    tagline: '客觀精準、原著理論溯源與無意識剖析',
    description: '嚴格基於榮格分析心理學、精神分析與典籍章節，客觀解構心理防衛機制、原型投射與個體化歷程。',
    settings: {
      personality: 35,
      decisiveness: 75,
      depth: 98,
      culturalResonance: 60,
      poeticTone: 40,
      shadowSensitivity: 70,
      temperature: 0.20,
      model: 'gemini-3.8-flash',
      preset: 'scholar',
    },
  },
  {
    id: 'asianMentor',
    name: '當代東方生活導師',
    badge: '🏮 嶺南共鳴',
    tagline: '深扣華人家族倫理、考場職場烙印與實用轉化',
    description: '特別加重當代華人生活背景、家族責任、神枱祖先意象與社會化焦慮，一針見血提煉切實生活轉化方針。',
    settings: {
      personality: 75,
      decisiveness: 90,
      depth: 80,
      culturalResonance: 98,
      poeticTone: 55,
      shadowSensitivity: 80,
      temperature: 0.30,
      model: 'gemini-3.8-flash',
      preset: 'asianMentor',
    },
  },
  {
    id: 'poeticZen',
    name: '哲思禪意引導者',
    badge: '🌌 詩意留白',
    tagline: '散文詩意、意象深遠與心靈直覺啟迪',
    description: '語言優美如東方散文，借水月潮汐、山林光影比喻心靈自性，引發造夢者更宏大的直覺覺察。',
    settings: {
      personality: 80,
      decisiveness: 50,
      depth: 75,
      culturalResonance: 85,
      poeticTone: 98,
      shadowSensitivity: 80,
      temperature: 0.50,
      model: 'gemini-3.8-flash',
      preset: 'poeticZen',
    },
  },
];

export const INITIAL_SETTINGS: EngineSettings = {
  personality: 70,
  decisiveness: 65,
  depth: 85,
  culturalResonance: 85,
  poeticTone: 65,
  shadowSensitivity: 85,
  preset: 'balanced',
  temperature: 0.35,
  model: 'gemini-3.8-flash',
};

export const INITIAL_DREAMS: DreamEntry[] = [
  {
    id: 'd1',
    title: '回到舊學校，無穿鞋找課室',
    dream_text: '我夢到自己返回以前讀書的舊學校，但走廊所有人都不認得我。我一直推開一扇扇門找課室，最後赫然發現自己沒有穿鞋……',
    rawCantoneseTranscription: '我頭先發咗個好奇怪嘅夢呀，我好似返咗以前讀書嗰間學校，但係走廊啲同學同老師全部都唔認得我。我一直推開啲門搵緊課室，但係行到最後先發覺自己原來冇著鞋……',
    created_at: '2026-09-14T23:40:00Z',
    report_json: {
      title: '迷途於昔日校園：身份割裂與未設防的暴露感',
      summary: '這個夢境正在處理「身份蛻變」與「自我歸屬」的深層張力。重點並非課室本身，而是身處最熟悉的場域卻失去保護（沒有鞋）與認同（無人相認），呈現出人生過渡期中「找不到出口」的困頓。',
      symbols: [
        { symbol: '🏫 舊學校 / 會考課室', meaning: '昔日被規範、評核、競爭與成長期身份的象徵標籤', culturalContext: '在華人成長經驗中，校園常代表社會化期望與集體同輩壓力的烙印。' },
        { symbol: '🚪 重複推開的門', meaning: '試圖轉換心境或跨越人生階段的渴望，門後的不確定反映方向焦慮' },
        { symbol: '👣 赤腳 / 缺乏鞋履', meaning: '心理防備被剝奪，在外界凝視下感到脆弱且缺乏接地保護' },
      ],
      perspectives: [
        {
          name: '榮格分析心理學',
          text: '「學校」代表舊人格（Old Ego）的孵化地；當場景依然熟悉但所有人不再認識你，代表你在個體化（Individuation）歷程中正在與過去的自我剝離。',
        },
        {
          name: '現代睡眠認知科學',
          text: 'REM 睡眠中海馬迴正在將近期現實生活中的評價壓力，與過往青少年時期的被評核記憶進行交叉神經編碼。',
        },
      ],
      questions: [
        '最近是否有某個工作或社交場合，讓你暗中覺得「需要重新證明自己」？',
        '「沒有穿鞋」讓你最害怕的是骯髒、受傷，還是被他人看見無助？',
        '如果再選一扇門推開，你直覺希望裡面是一片寬闊平原還是安靜的家？',
      ],
      sources: [
        { book_title: 'Man and His Symbols (Carl G. Jung)', page_start: 18, page_end: 20 },
        { book_title: '當代華人夢境象徵與心理原鄉', page_start: 74, page_end: 78 },
      ],
      fourLayers: {
        asianCulturalLayer: {
          title: '東方文化層 · 功名枷鎖與同輩軌跡',
          description: '舊校園與考試是華人社會集體潛意識中的「及格認證考場」。即便離開學校多年，當現實出現職場升遷、社會地位或家庭期待的變動時，心靈便本能召喚出校舍的無力感。',
          keywords: ['學校會考', '同輩比較', '缺乏認證'],
        },
        jungianLayer: {
          title: '榮格心理層 · 人格面具 (Persona) 的脫落',
          description: '失去鞋子象徵著失去支撐自我站立的社會面具。沒有鞋直接接觸冷硬地面，代表潛意識要求你正視最赤裸真實的感受，而非依賴外在成就包裝。',
          archetype: 'Persona & Shadow (面具與陰影)',
        },
        personalLayer: {
          title: '個人生活層 · 渴望新定位',
          description: '你正處在一個需要確認「我現在是誰」的階段，身邊環境的轉換讓你渴望找回過往那種清晰的歸屬指引。',
        },
        integrationAction: {
          title: '療癒與整合行動',
          advice: '這週練習給自己寫一句肯定話：「我已經不需要當年的校規來證明自己的價值。」允許自己赤腳歇息。',
        },
      },
      detectiveAnswers: {
        feeling: '驚慌與尷尬',
        shoes: '中途低頭才猛然發現赤腳',
        recentEvent: '正面臨職業轉換或評核階段',
      },
      dnaContribution: {
        dominantSymbol: '門',
        dominantEmotion: '焦慮',
        themeDetected: '找不到出口',
      },
    },
  },
  {
    id: 'd2',
    title: '被黑影追逐，躲入祖屋舊居',
    dream_text: '有人在身後緊迫追逐，我一直沿著舊式屋邨走廊狂奔，最後推開了小時候住過的木門舊居躲在神枱旁，門外傳來急促敲門聲……',
    rawCantoneseTranscription: '我有個好驚嘅夢，有人喺後面追住我，我係咁跑，走入咗以前舊屋邨嗰度，我匿咗入舊屋神枱側邊，出面係咁敲門……',
    created_at: '2026-09-10T22:18:00Z',
    report_json: {
      title: '被追逐與退避：回到舊有避風港的防衛直覺',
      summary: '逃跑代表生活中即將逼近的責任或被壓抑的焦慮。而躲進童年舊居神枱旁，體現了當外界壓力超過臨界時，潛意識召喚童年最原始的安全感與祖蔭庇佑。',
      symbols: [
        { symbol: '🏃 被追逐狂奔', meaning: '清醒時拖延面對的衝突、決策或心靈陰影正在加速逼近' },
        { symbol: '🏚️ 舊居祖屋', meaning: '童年安全感的避難所，退行（Regression）尋求庇護' },
        { symbol: '🕯️ 神枱 / 祖先牌位', meaning: '東方家族潛意識中的道德倫理約束與祖蔭庇佑的雙重投射' },
      ],
      perspectives: [
        {
          name: '榮格陰影整合',
          text: '身後的追逐者本質是你排斥承認的情感力量。只有在安全感充盈時轉身凝視，陰影才能轉化為生命力量。',
        },
        {
          name: '華人民俗心理學',
          text: '祖屋與神枱在廣東與嶺南文化中是家族秩序的錨點。夢見在此躲藏，暗示現實正面臨家庭期待與個人自由的權衡。',
        },
      ],
      questions: [
        '現實中有哪件事，是你這幾天最想「躲進房裡不用面對」的？',
        '舊居裡那種熟悉的木頭與線香味，帶給你的是安全感還是喘不過氣的窒息？',
      ],
      sources: [
        { book_title: 'The Interpretation of Dreams (Sigmund Freud)', page_start: 142, page_end: 145 },
        { book_title: '當代華人夢境象徵與心理原鄉', page_start: 112, page_end: 118 },
      ],
      fourLayers: {
        asianCulturalLayer: {
          title: '東方文化層 · 祖先神枱與家宅庇護',
          description: '神枱象徵家宅的神聖界線與血脈根基。當你躲在神枱旁，你正在本能尋找文化深處「受祖先庇佑」的防護罩，隔絕外界世俗的催逼。',
          keywords: ['神枱', '舊式屋邨', '祖先庇蔭'],
        },
        jungianLayer: {
          title: '榮格心理層 · 陰影追逐 (Shadow Pursuit)',
          description: '被追趕是陰影想要進入意識的信號。追趕你的不是敵人，而是你不敢表露的憤怒、慾望或疲憊。',
          archetype: 'Shadow (陰影)',
        },
        personalLayer: {
          title: '個人生活層 · 緊繃神經需鬆綁',
          description: '生活節奏已逼近過載，你需要劃出物理與心理的界限，給自己一個不受外界敲門打擾的靜止時空。',
        },
        integrationAction: {
          title: '療癒與整合行動',
          advice: '花十分鐘深呼吸，想像自己轉過身，對夢中的敲門聲平靜說：「我知道你在，但我現在需要休息，我們明天再談。」',
        },
      },
      detectiveAnswers: {
        feeling: '心跳急促、極度恐懼',
        shoes: '穿著拖鞋逃跑',
        recentEvent: '家庭決策或緊迫截止日逼近',
      },
      dnaContribution: {
        dominantSymbol: '舊居',
        dominantEmotion: '焦慮',
        themeDetected: '找不到出口',
      },
    },
  },
  {
    id: 'd3',
    title: '海潮升高，孤身在屋頂俯瞰',
    dream_text: '海水一路無聲無息地升高，水面漫過了熟悉的街道，水色幽藍深邃。我爬到了最高處的屋頂，看著一片平靜而浩瀚的水面，周圍異常安靜。',
    rawCantoneseTranscription: '海水一路升，浸過晒啲街同窗，我企喺屋頂望住個海，雖然好靜，但係個心好震……',
    created_at: '2026-09-04T21:05:00Z',
    report_json: {
      title: '水象初現：潛意識情緒水位的漫漲與理智自保',
      summary: '這是你夢境宇宙中【水】的第一次重大顯現（狀態：平靜深邃的水位上升）。海水代表龐大無意識的情感儲存池，站在屋頂俯瞰象徵理性正在努力維持防禦與觀察視角。',
      symbols: [
        { symbol: '🌊 海水上升 (第一次：平靜深水)', meaning: '被壓抑的情感、淚水或內在焦慮正在無聲浸潤現實日常' },
        { symbol: '🏠 攀上屋頂', meaning: '理智自我（Ego）試圖以居高臨下的防衛姿態保持超脫與自全' },
      ],
      perspectives: [
        {
          name: '榮格無意識汪洋原型',
          text: '水是心靈無意識的最典型象徵。當海水漫漲，代表心靈要求你承認那些被理性忽略的情緒浪潮。',
        },
      ],
      questions: [
        '最近是否有某種無以名狀的情緒，正在如海水般悄悄淹過你的生活邊界？',
        '夢中的安靜，究竟是平靜還是無路可退的屏息？',
      ],
      sources: [
        { book_title: 'Man and His Symbols (Carl G. Jung)', page_start: 110, page_end: 114 },
      ],
      fourLayers: {
        asianCulturalLayer: {
          title: '東方文化層 · 順水與溺水的情感暗湧',
          description: '東方文化視水為包容，但亦有「水能載舟亦能覆舟」的敬畏。夢中水勢升高而不暴烈，象徵隱忍已久的情緒累積。',
          keywords: ['水漫金山', '情感淹沒', '孤島屋頂'],
        },
        jungianLayer: {
          title: '榮格心理層 · 大母神之水 (Mother Ocean)',
          description: '無垠的深海代表潛意識的孕育與吞噬力量，呼喚個人從過度的理性防衛中降落。',
          archetype: 'The Great Mother / Unconscious',
        },
        personalLayer: {
          title: '個人生活層 · 情感承載極限',
          description: '你在白天過度習慣「我很理性、我沒事」，但夜間夢境忠實反映了情感即將滿溢的信號。',
        },
        integrationAction: {
          title: '療癒與整合行動',
          advice: '洗個熱水澡或在水邊散步，主動允許自己釋放積累的眼淚或疲勞。',
        },
      },
      dnaContribution: {
        dominantSymbol: '水',
        dominantEmotion: '困惑',
        themeDetected: '水之演進',
      },
    },
  },
  {
    id: 'd4',
    title: '洪水翻滾，涉水渡海尋找母親',
    dream_text: '天色昏暗，原本平靜的水突然變成翻滾的洪水。我看見母親站在彼岸對我招手，我不得不跳入急流渡海，水流很急但最終抵達了岸邊。',
    rawCantoneseTranscription: '洪水好犀利，我見到我阿媽喺對面叫我，水好急，我好驚咁游過去搵佢……',
    created_at: '2026-08-28T19:30:00Z',
    report_json: {
      title: '水象演進（二至三階段）：從洪水衝擊到勇渡彼岸',
      summary: '你夢中的【水】已從先前的「平靜上升」演變為「洶湧洪水」，隨後進階為「渡海追尋」。母親的出現點亮了彼岸的方向，代表你開始主動迎向情緒急流，跨越心靈深層的情感創傷。',
      symbols: [
        { symbol: '🌊 翻滾急流 (第二次/第三次水象：洪水與渡海)', meaning: '情緒危機的激化，迫使主體不再僅僅躲在屋頂，而是必須親自涉水' },
        { symbol: '👵 岸邊招手的母親', meaning: '心靈深處最原始的撫慰、母性源頭與根源渴望' },
      ],
      perspectives: [
        {
          name: '榮格英雄歷程 (Night Sea Journey)',
          text: '涉水渡海是經典的英雄夜航神話，代表主動進入無意識深淵以贏得心靈的重生與整合。',
        },
      ],
      questions: [
        '母親在夢中的眼神，讓你感受到的是指責還是接納？',
        '面對急流跳下去的那一秒，支撐你的力量是什麼？',
      ],
      sources: [
        { book_title: 'Man and His Symbols (Carl G. Jung)', page_start: 125, page_end: 130 },
      ],
      fourLayers: {
        asianCulturalLayer: {
          title: '東方文化層 · 慈母呼喚與孝道牽絆',
          description: '母親在華人文化中往往代表情感的核心錨點與牽掛。在洶湧波濤中奔向母親，展現了對親情認同與情感依戀的深層召喚。',
          keywords: ['母子情結', '渡海彼岸', '血脈呼喚'],
        },
        jungianLayer: {
          title: '榮格心理層 · 阿尼瑪 (Anima) 與夜海漂航',
          description: '跳入洪流代表意識決定放棄高高在上的防禦，主動投身心靈轉化。',
          archetype: 'The Night Journey',
        },
        personalLayer: {
          title: '個人生活層 · 渴望被接納',
          description: '在近期挑戰中，你非常渴望得到長輩或至親無條件的肯定與溫暖擁抱。',
        },
        integrationAction: {
          title: '療癒與整合行動',
          advice: '給母親打通電話，或在心裡給予那個年幼的自己一個深深的擁抱。',
        },
      },
      dnaContribution: {
        dominantSymbol: '水',
        dominantEmotion: '焦慮',
        themeDetected: '水之演進',
      },
    },
  },
  {
    id: 'd5',
    title: '海潮退去，靜立岸邊看見晨曦',
    dream_text: '這一次水不再淹沒街道，我從容地站在開闊的海岸邊。遠方的巨浪漸漸平息成溫柔的白色浪花，海風很清涼，我身後是一扇敞開的木門。',
    rawCantoneseTranscription: '我企喺海邊，今次啲水冇浸上嚟，好平靜，我後面有道木門開咗，我望住個海好舒服……',
    created_at: '2026-08-20T06:15:00Z',
    report_json: {
      title: '水象完形（第四階段）：站在岸邊，水的角色正在改變',
      summary: '你的 30 日夢境星圖在此展現了驚人的演變弧度：水從平靜（第一次）→ 洪水（第二次）→ 渡海（第三次）→ 到如今的【站在岸邊（第四次）】。水的角色徹底改變，從吞噬威脅轉變為平靜的力量蓄水池！',
      symbols: [
        { symbol: '🌊 平靜海岸 (第四次水象：岸邊靜立)', meaning: '潛意識與意識達成和解，不再被情緒洪流淹沒，而是擁有了健康的心理邊界' },
        { symbol: '🚪 敞開的木門', meaning: '走出心靈死胡同，找到了通往現實新天地的真正出口' },
      ],
      perspectives: [
        {
          name: '榮格自性化 (Individuation)',
          text: '當危險的海洋轉變為岸邊的風景，代表個體化歷程邁入了整合階段，內在的風暴已被你成功轉化為生命閱歷。',
        },
      ],
      questions: [
        '回顧這一個月的生活，是否有某個原本讓你很痛苦的執念，不知不覺間已經慢慢放下了？',
        '身後敞開的木門，你準備跨步走向哪裡？',
      ],
      sources: [
        { book_title: 'Man and His Symbols (Carl G. Jung)', page_start: 220, page_end: 225 },
      ],
      fourLayers: {
        asianCulturalLayer: {
          title: '東方文化層 · 苦盡甘來，雲開見月',
          description: '東方哲學講求「物極必反，否極泰來」。歷經驚滔駭浪後回歸岸邊晨曦，代表心境歷經淬鍊後的自洽與澄明。',
          keywords: ['風平浪靜', '彼岸抵達', '心境釋懷'],
        },
        jungianLayer: {
          title: '榮格心理層 · 自性 (Self) 的整合',
          description: '你不再在洪水中掙扎，而是站在穩固的陸地上觀照深海，象徵自我與大自然（潛意識）建立了平等的對話。',
          archetype: 'The Self (自性整合)',
        },
        personalLayer: {
          title: '個人生活層 · 韌性重現',
          description: '你比自己想像的更堅強。過去幾週的內在掙扎正在結案，心理彈性已大幅提升。',
        },
        integrationAction: {
          title: '療癒與整合行動',
          advice: '為自己慶祝這次心靈的蛻變，在筆記本上記錄下這份久違的平靜感受。',
        },
      },
      dnaContribution: {
        dominantSymbol: '水',
        dominantEmotion: '平靜',
        themeDetected: '水之演進',
      },
    },
  },
];

// DREAM DNA™️ - Initial Fingerprint
export const INITIAL_DREAM_DNA: DreamDNA = {
  totalDreams: 5,
  symbols: [
    {
      name: '水 / 海洋',
      count: 4,
      category: 'element',
      evolution: [
        { dreamId: 'd3', dreamTitle: '海潮升高，孤身在屋頂', date: '2026-09-04', state: '第一次：平靜水位無聲上升' },
        { dreamId: 'd4', dreamTitle: '洪水翻滾，涉水渡海', date: '2026-08-28', state: '第二次：急流洪水衝擊' },
        { dreamId: 'd4', dreamTitle: '洪水翻滾，涉水渡海', date: '2026-08-28', state: '第三次：勇敢跳入水中渡海' },
        { dreamId: 'd5', dreamTitle: '海潮退去，靜立岸邊', date: '2026-08-20', state: '第四次：站在岸邊，水成為身外風景' },
      ],
    },
    {
      name: '門',
      count: 3,
      category: 'place',
      evolution: [
        { dreamId: 'd1', dreamTitle: '舊校找課室', date: '2026-09-14', state: '推開一扇扇門卻空無一人' },
        { dreamId: 'd2', dreamTitle: '逃入舊居', date: '2026-09-10', state: '反鎖木門躲避追逐' },
        { dreamId: 'd5', dreamTitle: '站在岸邊', date: '2026-08-20', state: '身後敞開的木門迎向晨光' },
      ],
    },
    {
      name: '被追趕 / 逃避',
      count: 3,
      category: 'action',
      evolution: [
        { dreamId: 'd2', dreamTitle: '逃入舊居', date: '2026-09-10', state: '沿屋邨狂奔' },
        { dreamId: 'd1', dreamTitle: '舊校找課室', date: '2026-09-14', state: '赤腳躲避他人目光' },
        { dreamId: 'd4', dreamTitle: '涉水渡海', date: '2026-08-28', state: '被身後急流推動' },
      ],
    },
    {
      name: '舊居 / 祖屋',
      count: 2,
      category: 'place',
      evolution: [
        { dreamId: 'd2', dreamTitle: '逃入舊居', date: '2026-09-10', state: '舊屋邨神枱旁躲藏' },
        { dreamId: 'd1', dreamTitle: '舊校找課室', date: '2026-09-14', state: '舊時生活軌跡重現' },
      ],
    },
    {
      name: '母親',
      count: 2,
      category: 'character',
      evolution: [
        { dreamId: 'd4', dreamTitle: '涉水渡海', date: '2026-08-28', state: '站在彼岸招手指引' },
        { dreamId: 'd2', dreamTitle: '逃入舊居', date: '2026-09-10', state: '神枱家宅氣息的延伸' },
      ],
    },
  ],
  emotionRatios: [
    { emotion: '焦慮與緊繃', percentage: 68, color: '#aa9cff' },
    { emotion: '平靜與釋懷', percentage: 18, color: '#78e1b5' },
    { emotion: '迷惘與困惑', percentage: 14, color: '#71d9ff' },
  ],
  recurringThemes: [
    {
      theme: '「找不到出口」Theme',
      count: 4,
      description: '在封閉或變換的空間中（學校、舊屋、屋頂），反覆經歷想尋找目的地卻始終受阻的阻滯感。',
    },
    {
      theme: '「水象質變」Theme',
      count: 4,
      description: '從平靜水深 → 洪水爆發 → 渡海航行 → 岸邊止步，反映情感自我調節能力的逐步成熟。',
    },
    {
      theme: '「回歸童年庇護」Theme',
      count: 2,
      description: '在極度壓力下自動召喚童年舊居與祖蔭，顯現出對無條件安全感的依戀。',
    },
  ],
  narrativeFingerprint:
    '你過去 18 日有 4 個完全不同的夢，但全部出現同一種模式——你總是在尋找一個地方，卻去不到；同時，你夢中的「水」正在經歷由恐懼威脅轉化為自我平靜的驚人歷程。',
  updatedAt: '2026-09-15T12:00:00Z',
};

// DREAM CONSTELLATION™️ - Initial Nodes & Links
export const INITIAL_CONSTELLATION_NODES: ConstellationNode[] = [
  {
    id: 'star_1',
    dreamId: 'd1',
    title: '舊校赤腳找課室',
    date: '2026-09-14',
    x: 22,
    y: 32,
    primarySymbol: '門 / 舊校',
    place: '舊學校',
    character: '舊同學',
    emotion: '焦慮',
    size: 14,
    magnitude: 3,
  },
  {
    id: 'star_2',
    dreamId: 'd2',
    title: '被追逐逃入舊居',
    date: '2026-09-10',
    x: 35,
    y: 68,
    primarySymbol: '舊居 / 神枱',
    place: '舊居屋邨',
    character: '神秘黑影',
    emotion: '驚恐',
    size: 16,
    magnitude: 4,
  },
  {
    id: 'star_3',
    dreamId: 'd3',
    title: '海潮升高登屋頂',
    date: '2026-09-04',
    x: 62,
    y: 45,
    primarySymbol: '海 (平靜水位)',
    place: '水邊屋頂',
    character: '獨自一人',
    emotion: '困惑',
    size: 18,
    magnitude: 4,
  },
  {
    id: 'star_4',
    dreamId: 'd4',
    title: '洪水翻滾渡海尋母',
    date: '2026-08-28',
    x: 75,
    y: 22,
    primarySymbol: '海 (急流洪水)',
    place: '急流大洋',
    character: '母親',
    emotion: '急迫',
    size: 20,
    magnitude: 5,
  },
  {
    id: 'star_5',
    dreamId: 'd5',
    title: '海潮退去靜立岸邊',
    date: '2026-08-20',
    x: 82,
    y: 72,
    primarySymbol: '海 (溫柔浪花)',
    place: '開闊海岸',
    character: '自性我',
    emotion: '平靜',
    size: 19,
    magnitude: 5,
  },
];

export const INITIAL_CONSTELLATION_LINKS: ConstellationLink[] = [
  {
    sourceId: 'star_1',
    targetId: 'star_2',
    relationType: 'place',
    relationLabel: '同一主題：過去記憶的封閉空間 (舊校 ↔ 舊居)',
  },
  {
    sourceId: 'star_2',
    targetId: 'star_3',
    relationType: 'emotion',
    relationLabel: '情緒延續：從被追逐的急促，轉化為水漫街道的緊繃',
  },
  {
    sourceId: 'star_3',
    targetId: 'star_4',
    relationType: 'symbol',
    relationLabel: '同一象徵：水 (平靜水位 → 猛烈洪水)',
  },
  {
    sourceId: 'star_4',
    targetId: 'star_5',
    relationType: 'symbol',
    relationLabel: '同一象徵：水 (波濤渡海 → 岸邊止步，角色蛻變)',
  },
  {
    sourceId: 'star_2',
    targetId: 'star_4',
    relationType: 'character',
    relationLabel: '隱含連結：神枱祖屋與彼岸母親的母性脈絡',
  },
  {
    sourceId: 'star_1',
    targetId: 'star_5',
    relationType: 'opposite_ending',
    relationLabel: '相反結局：失落課室 (無門可出) ↔ 岸邊晨光 (敞開木門)',
  },
];

// 30 NIGHTS DREAM MYSTERY™️ - Initial Progress
export const INITIAL_THIRTY_NIGHTS: ThirtyNightsJourney = {
  completedNights: 5,
  targetNights: 30,
  currentStreak: 4,
  clues: [
    {
      night: 1,
      dreamId: 'd5',
      date: 'Day 1 · 啟航',
      clueTitle: '第一塊拼圖：水面初現',
      clueText: '海風初起，你第一次在夢中留下了與水共存的記憶坐標。',
      unlocked: true,
    },
    {
      night: 3,
      dreamId: 'd4',
      date: 'Day 3 · 激化',
      clueTitle: '第二塊拼圖：洪流與母親',
      clueText: '情緒水位劇增，彼岸親人的招手成為渡海的原動力。',
      unlocked: true,
    },
    {
      night: 5,
      dreamId: 'd3',
      date: 'Day 5 · 孤島俯瞰',
      clueTitle: '第三塊拼圖：理智的高台',
      clueText: '屋頂的平靜只是暫停鍵，潛意識在提醒你不要永遠將情感拒於千里。',
      unlocked: true,
    },
    {
      night: 7,
      dreamId: 'd2',
      date: 'Day 7 · 陰影警報',
      clueTitle: '第四塊拼圖：舊居門外的腳步',
      clueText: '追趕你的東西正在逼近，童年神枱為你擋下了第一波衝擊。',
      unlocked: true,
    },
    {
      night: 9,
      dreamId: 'd1',
      date: 'Day 9 · 赤腳的呼喊',
      clueTitle: '第五塊拼圖：找不到出口的走廊',
      clueText: '舊學校的門一扇扇關閉，你終於發現問題不在門，而在於你是否願意停下腳步。',
      unlocked: true,
    },
    {
      night: 14,
      date: 'Day 14 · 中程密碼',
      clueTitle: '未解線索：陰影的真面目',
      clueText: '持續記錄至第 14 夜解鎖：那個追你的人，究竟長著誰的面孔？',
      unlocked: false,
    },
    {
      night: 21,
      date: 'Day 21 · 轉型密碼',
      clueTitle: '未解線索：水與門的終極交會',
      clueText: '持續記錄至第 21 夜解鎖：當水流穿過木門，新的自性將會誕生。',
      unlocked: false,
    },
    {
      night: 30,
      date: 'Day 30 · 全境揭密',
      clueTitle: '終極密碼：你的夢在反覆講甚麼',
      clueText: '集齊 30 夜夢境，生成個人年度專屬【潛意識密碼全息報告書】。',
      unlocked: false,
    },
  ],
  overallMysteryReport: {
    title: '30 Nights Dream Mystery · 階段揭示',
    coreMetaphor: '「從避風港到大海的朝聖者」',
    deepSynthesis: '你的夢境在過去 30 日經歷了從「退縮舊屋」到「勇涉急流」再到「自立岸邊」的英雄之旅。你原本畏懼被他人評判（赤腳學校），如今潛意識正在建立屬於你自己的安歇港灣。',
    subconsciousDirective: '不要害怕那些反覆敲門的陰影，它是你遺落已久的生命力。下次夢見門，大膽迎向它。',
  },
};

// Detective Question Presets
export function generateDetectiveQuestions(dreamText: string): DetectiveQuestion[] {
  const t = dreamText.toLowerCase();

  if (t.includes('蛇') || t.includes('snake')) {
    return [
      {
        id: 'q1',
        question: '① 你在夢中見到蛇的第一個瞬間，身體最直接的感受是什麼？',
        options: ['恐懼心驚，想拔腿就跑', '充滿好奇，想走近看清', '異常平靜，甚至有共鳴感', '純粹厭惡，感到噁心不適'],
      },
      {
        id: 'q2',
        question: '② 蛇在夢中有沒有主動接近你？它的動態是怎樣的？',
        options: ['正悄悄向我靠近或纏繞', '保持距離與我冷冷對視', '正迅速逃離或鑽入洞穴', '隱匿在草叢或暗處伺機而動'],
      },
      {
        id: 'q3',
        question: '③ 最近的現實生活中，是否有某個重大關係、環境或身體狀態正在經歷轉變？',
        options: ['是，正面臨不得不變的轉折', '有潛在危機，但我一直拖延面對', '正渴望擺脫舊有的束縛蛻皮新生', '生活很平靜，沒有明顯變化'],
      },
    ];
  }

  if (t.includes('水') || t.includes('海') || t.includes('淹') || t.includes('雨') || t.includes('河')) {
    return [
      {
        id: 'q1',
        question: '① 夢中的水，水質與流速帶給你什麼感覺？',
        options: ['清澈見底，但深不見底', '混濁洶湧，充滿泥沙急流', '溫柔溫暖，像沐浴其中', '冰冷刺骨，令人窒息'],
      },
      {
        id: 'q2',
        question: '② 面對這片水，你當時身處的位置與狀態是？',
        options: ['站在岸邊或高處俯瞰觀察', '水已經漫過腳踝、腰部或胸口', '在水中拼命游泳或掙扎求生', '自在漂浮，隨波逐流'],
      },
      {
        id: 'q3',
        question: '③ 這幾天醒來時，有沒有某種情緒（悲傷、焦慮或委屈）讓你覺得快要「滿出來」？',
        options: ['有，已經快要壓抑不住了', '偶爾有，但習慣用理智壓下來', '最近情緒非常平穩舒暢', '不是情緒，而是工作責任快把我淹沒'],
      },
    ];
  }

  if (t.includes('追') || t.includes('逃') || t.includes('跑') || t.includes('匿') || t.includes('藏')) {
    return [
      {
        id: 'q1',
        question: '① 身後追你的存在，你感應到它是什麼？',
        options: ['清晰的面孔（熟人或過往仇怨）', '模糊的黑影或無法形容的怪物', '某種無形的制度、法律或催迫力量', '看不見但能強烈聽見沉重腳步聲'],
      },
      {
        id: 'q2',
        question: '② 在逃跑過程中，你的身體雙腿是什麼感覺？',
        options: ['像灌了鉛一樣沉重，想跑卻跑不快', '健步如飛，敏捷地跳躍穿梭', '最後找到了一個安全隱密的角落躲下', '眼看快被追上，驚嚇得醒了過來'],
      },
      {
        id: 'q3',
        question: '③ 現實生活中有沒有一件事情或談話，是你心裡一直知道該做卻在逃避的？',
        options: ['有，一段該挑明講的關係或決定', '有一份工作或責任快到最後期限', '在逃避面對自己內心的真實感受', '沒有，最近生活節奏很從容'],
      },
    ];
  }

  if (t.includes('媽') || t.includes('母') || t.includes('爸') || t.includes('父') || t.includes('長輩') || t.includes('報夢') || t.includes('拜神') || t.includes('白事')) {
    return [
      {
        id: 'q1',
        question: '① 親人或長輩出現在夢中時，他們的氣色與神情是怎樣的？',
        options: ['安詳慈愛，帶著微笑或點頭', '面容憂戚或有話想說卻說不出', '和平日清醒時一模一樣的生活瑣碎互動', '面容模糊，但能強烈確認就是對方'],
      },
      {
        id: 'q2',
        question: '② 他們有沒有留下任何物品、交代言語，或做出特定手勢？',
        options: ['有遞給我某樣東西（食物、鑰匙或信件）', '講了一句讓人深思的話或叮嚀', '只是靜靜陪伴在旁注視我', '夢裡只是日常同桌吃飯或同走一段路'],
      },
      {
        id: 'q3',
        question: '③ 最近逢年過節、生忌死忌，或是你近期是否特別思念家鄉與根基？',
        options: ['是，最近日子特殊或生活遇到難處特別想念他', '正在面臨家庭或家族關係的抉擇', '已經很久沒想起了，突然夢到覺得很有靈性', '沒有特殊節日，純屬巧合'],
      },
    ];
  }

  // Default Universal Detective Questions
  return [
    {
      id: 'q1',
      question: '① 醒來睜開眼的那一瞬間，殘留在胸口的第一個情緒是什麼？',
      options: ['強烈的焦慮或心有餘悸', '莫名的悵惘與深深失落', '如釋重負或奇異的平靜', '困惑不解，覺得離奇荒謬'],
    },
    {
      id: 'q2',
      question: '② 夢中最讓你印象深刻、甚至發光的「核心焦點」是什麼？',
      options: ['一個特定的人物或動物的神情', '一個特定的空間場所（門、舊屋、高處）', '一項動作（尋找、逃跑、等待）', '一種顏色或特別的氣候天氣'],
    },
    {
      id: 'q3',
      question: '③ 如果這個夢是一封信，你直覺覺得它是在提醒你現在的哪一方面？',
      options: ['人際與親密關係中的糾結', '事業/學業上對未來的迷惘與期許', '身體健康與心理能量的透支警戒', '向過去的某段經歷正式告別'],
    },
  ];
}

export const INITIAL_AD_VIDEOS: AdVideoItem[] = [
  {
    id: 'ad_alien_dream_truth',
    title: '👽 星際對話 · 外星導師解密夢境的唯一真實',
    advertiser: 'Intergalactic Consciousness Lab (星際意識研究所)',
    tagline: '「你們人類以為清醒是真，我們外星人認為夢境才是唯一的真實。夢境是來自真實心靈的投射，它比你自認為的內心還要真實。」',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    durationSeconds: 15,
    rewardStars: 1,
    category: 'alien_philosophy',
    bgGradient: 'from-[#0b051d] via-[#1a0c3b] to-[#04010a]',
    accentColor: '#aa9cff',
    isActive: true,
    createdAt: '2026-09-17T08:00:00Z',
    dialogueDialogue: [
      {
        speaker: '地球探求者',
        text: '你們外星人對夢境是怎麼理解的？做夢才是真的？',
      },
      {
        speaker: '外星導師',
        text: '我們認為夢境是唯一的真實。夢境是來自真實心靈的投射，它比你自認為的內心還要真實。你們的意識被自我、被社會規則、被生存慾求層層過濾和編輯，而夢裡，這些過濾器都失效了。',
      },
      {
        speaker: '地球探求者',
        text: '那你們外星人還會做夢嗎？在夢裡可以清晰認識到自己在做夢嗎？',
      },
      {
        speaker: '外星導師',
        text: '我們會主動授權一部分意識讓它脫離過濾器進入野化狀態。直覺、情感、象徵超越邏輯的聯結，是你們遺忘了的頂級認知方式。屏幕前的你，可以開始記錄夢境了，歡迎你回來分享！',
      },
    ],
  },
  {
    id: 'ad_pomelo_lingli',
    title: '🌿 零離 · 廣東碌柚葉去霉開運香水 (贊助商)',
    advertiser: '零離 LINGLI 廣東草本療癒研究所',
    tagline: '「醒後一噴，驅除噩夢黏滯感。嶺南古法碌柚葉黃酮提取，重整磁場，迎納好運！」',
    posterUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
    durationSeconds: 12,
    rewardStars: 1,
    category: 'brand_sponsor',
    bgGradient: 'from-[#031c13] via-[#063321] to-[#010c08]',
    accentColor: '#78e1b5',
    isActive: true,
    createdAt: '2026-09-17T08:05:00Z',
    dialogueDialogue: [
      {
        speaker: '夢境守護者',
        text: '成日發噩夢或者俾鬼壓，醒咗個人好沉好重？',
      },
      {
        speaker: '零離香氛導師',
        text: '廣東人自古以碌柚葉去霉轉運。零離提煉天然碌柚葉黃酮，一噴掃除負能量氣場，即刻回復清爽精神！',
      },
      {
        speaker: '旁白',
        text: '解夢選物店現已上架，支援星星幣折抵換購。',
      },
    ],
  },
  {
    id: 'ad_deep_sleep_herbal',
    title: '🌙 夢境深眠 · 普羅旺斯薰衣草與洋甘菊舒眠枕霧',
    advertiser: 'Nocturne Botanical Lab',
    tagline: '「讓潛意識在天然植物香氛中安歇，減少驚醒，每夜收穫平靜而清晰的好夢。」',
    posterUrl: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?q=80&w=1200&auto=format&fit=crop',
    durationSeconds: 10,
    rewardStars: 1,
    category: 'healing_sound',
    bgGradient: 'from-[#0e0725] via-[#1a0f3d] to-[#070314]',
    accentColor: '#71d9ff',
    isActive: true,
    createdAt: '2026-09-17T08:10:00Z',
    dialogueDialogue: [
      {
        speaker: '催眠引導師',
        text: '放鬆眉心，深深吸氣……感受薰衣草與岩蘭草將白天的喧囂溫柔包裹。',
      },
      {
        speaker: '旁白',
        text: '睡前噴灑於枕巾，陪伴你進入深層 Delta 腦波，讓夢境成為療癒之源。',
      },
    ],
  },
  {
    id: 'ad_crystal_intuition',
    title: '💎 烏拉圭深紫晶與白水晶能量陣 · 直覺之眼',
    advertiser: 'Aura Sanctum 晶石工坊',
    tagline: '「淨化床頭負向氣場，增強清醒夢與靈性直覺，記錄靈感不再遺忘。」',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    durationSeconds: 10,
    rewardStars: 1,
    category: 'meditation_scene',
    bgGradient: 'from-[#1b092b] via-[#2f104a] to-[#0c0314]',
    accentColor: '#ffd27a',
    isActive: true,
    createdAt: '2026-09-17T08:15:00Z',
    dialogueDialogue: [
      {
        speaker: '晶石治療師',
        text: '紫水晶對應頂輪與第三眼，能安撫多夢焦慮，將混亂夢境轉化為覺察清明的洞見。',
      },
      {
        speaker: '旁白',
        text: '置於床頭或書桌，守護專屬你的夢境宇宙。',
      },
    ],
  },
];

// Convenient aliases for component imports
export const initialDreamDNA = INITIAL_DREAM_DNA;
export const initialConstellationNodes = INITIAL_CONSTELLATION_NODES;
export const initialConstellationLinks = INITIAL_CONSTELLATION_LINKS;
export const initialThirtyNightsJourney = INITIAL_THIRTY_NIGHTS;
export const initialDetectiveQuestions = generateDetectiveQuestions('');
export const initialAdVideos = INITIAL_AD_VIDEOS;

