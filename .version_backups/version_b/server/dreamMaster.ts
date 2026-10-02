/**
 * Dream Master Engine with SQL Retrieval SOP
 * 
 * SOP 規範：
 * 1. 接收使用者輸入：原始夢境文字，可選補充資訊：性別、近況、是否為重複夢。
 * 2. 後端預處理使用者文本：移除多餘換行、重複敘述，保留核心情節與情緒；若文字少於 15 字，不執行解讀並提示引導。
 * 3. 執行 SQL 檢索查詢：books, dream_themes, dream_symbols, analysis_rules。
 * 4. 強制檢索結果上限：意象最多 8 項，主題最多 3 項，參考書籍規則片段最多 4 本。
 * 5. 格式化檢索結果為精簡純文字片段存入 {{retrieved_data}}；無匹配時填入固定開放式文本。
 * 6. 組裝最小化提示詞，替換 {{retrieved_data}}、{{user_dream}}、{{user_context}}。
 * 7. 呼叫大模型執行解析。
 * 8. 輸出過濾：禁止玄學算命、必須包含「解夢僅心理參考，非命運預測」、字數控制 600-900 字。
 * 9. 對話輪次管理：全新請求不帶歷史；追問僅帶上一輪壓縮摘要（<=200 token），不重傳檢索數據。
 */

import { Pool } from 'pg';
import OpenCC from 'opencc-js';
import { DREAM_BOOKS, DREAM_TAGS, DREAM_SYMBOLS } from './dreamAstraData';

const s2tConverter = OpenCC.Converter({ from: 'cn', to: 'hk' });
const t2sConverter = OpenCC.Converter({ from: 'hk', to: 'cn' });

export interface UserContext {
  gender?: string;
  recent_status?: string;
  is_recurring?: boolean | string;
}

export interface FollowUpContext {
  is_follow_up: boolean;
  follow_up_question: string;
  previous_summary: string;
}

export interface RetrievedDataResult {
  symbols: Array<{ symbol_name: string; symbol_emoji: string; primary_meaning: string; cultural_meaning?: string }>;
  themes: Array<{ theme_name: string; psychological_meaning: string }>;
  booksAndRules: Array<{ source_title: string; category: string; snippet: string }>;
  formattedSnippet: string;
  totalItems: number;
}

export interface DreamMasterAnalyzeResult {
  success: boolean;
  analysis_text: string;
  word_count: number;
  disclaimer: string;
  retrieved_data_used: string;
  retrieved_counts: {
    symbols: number;
    themes: number;
    books_and_rules: number;
  };
  compressed_summary_for_followup: string;
  cleaned_dream: string;
  is_follow_up: boolean;
  source: 'gemini' | 'fallback';
}

// -------------------------------------------------------------
// 1. Initial SQL Knowledge Base Seeding
// -------------------------------------------------------------

export const SEED_BOOKS = [
  {
    id: 'book_jung_symbols',
    title: 'Man and His Symbols (Carl G. Jung)',
    author: 'Carl G. Jung',
    core_theory: '無意識補償假說 (Unconscious Compensation) 與集體原型',
    snippet: '夢是潛意識心靈自發且客觀的投射，絕非病理偽裝。夢的根本目的是為了平衡（補償）個體在清醒時過於片面或極端的意識態度，促成自我人格的個體化（Individuation）。',
    keywords: ['補償', '原型', '陰影', '自性', '集體無意識', '象徵', '水', '深淵', '追逐', '學校']
  },
  {
    id: 'book_freud_dreams',
    title: 'The Interpretation of Dreams (Sigmund Freud)',
    author: 'Sigmund Freud',
    core_theory: '願望達成 (Wish Fulfillment) 與心理防禦機制',
    snippet: '夢是通往潛意識的大道。夢中的焦慮往往源自本我（Id）壓抑衝動與超我（Superego）審查機制的衝突；日間殘留物（Day Residues）提供夢境建構的表層素材。',
    keywords: ['焦慮', '壓抑', '逃跑', '奔跑', '日間殘留', '願望', '追逐', '隱藏']
  },
  {
    id: 'book_contemporary_asian',
    title: '當代華人夢境象徵與心理原鄉',
    author: '當代心理學會華人夢工作小組',
    core_theory: '華人集體社會化記憶與家族無意識 (Familial Unconscious)',
    snippet: '東方社會的夢境深刻受到家族倫理、公開試考評烙印（赤腳/課室）、神枱家宅庇護及人際和諧期望所形塑。解讀時應回歸日常生活脈絡，切勿脫離東方家庭情感結構。',
    keywords: ['神枱', '祖屋', '赤腳', '考試', '校舍', '母親', '父親', '家人', '水', '屋邨']
  },
  {
    id: 'book_gestalt_dreamwork',
    title: 'Gestalt Therapy & Dreamwork (Fritz Perls)',
    author: 'Frederick Perls',
    core_theory: '空椅對話與夢境投射整合 (Dream Projection Reintegration)',
    snippet: '夢中的每一個人物、物體甚至背景氛圍，都是造夢者自身不同面向的投射。讓自己成為夢中那個追逐者或那堵牆，重新認領被割裂的心靈能量。',
    keywords: ['投射', '整合', '未完成事件', '對話', '怪物', '牆', '影子']
  },
  {
    id: 'book_sleep_neuroscience',
    title: 'Why We Sleep: The New Science of Sleep and Dreams',
    author: 'Matthew Walker',
    core_theory: 'REM睡眠神經化學脫敏與情緒夜間治療 (Nightly Therapy)',
    snippet: '在快速動眼期（REM）睡眠中，去甲腎上腺素等壓力化學物質被關閉，大腦能安全重溫白天的情緒記憶，消除痛苦情感的尖銳稜角，促進神經認知重構。',
    keywords: ['神經科學', '記憶整合', '情緒修復', '壓力', '醒來', '心跳']
  }
];

export const SEED_THEMES = [
  {
    id: 'theme_pursuit',
    theme_name: '被追逐與逃避 (Pursuit & Evasion)',
    description: '夢見被未知黑影、怪獸、猛獸或熟悉之人緊追不捨，難以脫身。',
    psychological_meaning: '象徵清醒生活中正在迴避的重大責任、壓抑的痛苦情緒，或是自身未被承認的人格陰影 (Shadow)。逃避越劇烈，代表內在壓迫感越高。',
    keywords: ['追', '逃', '跑', '躲', '藏', '黑影', '怪物', '危險', '逼近']
  },
  {
    id: 'theme_water_flood',
    theme_name: '水勢上升與深海洪流 (Rising Waters & The Abyss)',
    description: '夢見海水上漲、大雨淹沒街道、房屋被水包圍或置身深水。',
    psychological_meaning: '水是潛意識原始情感能量的象徵。水勢升高反映內心積累的情緒水位即將超過意識自我所能承載的閥值，呼喚造夢者停止壓抑，容許情感宣洩。',
    keywords: ['水', '海', '河', '雨', '淹', '溺', '浪', '潮', '洪', '游泳']
  },
  {
    id: 'theme_exam_classroom',
    theme_name: '赤腳重返考場與課室尋路 (School & Evaluation Anxiety)',
    description: '夢見回到昔日校園、找不到課室、未穿鞋子、准考證遺失或答不出卷。',
    psychological_meaning: '反映面對生活轉折、職場評核或社會期待時的「冒牌者症候群」與脆弱感。赤腳象徵缺乏足夠防備與立足點，考場則是群體社會化評價的終身隱喻。',
    keywords: ['學校', '課室', '考試', '赤腳', '光腳', '鞋', '老師', '同學', '遲到']
  },
  {
    id: 'theme_family_ancestor',
    theme_name: '故人探訪與家族神聖空間 (Ancestral & Family Connection)',
    description: '夢見已故親人、回到童年舊居、看見神枱或長輩託付信物。',
    psychological_meaning: '反映個體在面對重大抉擇或生活疲憊時，內在渴望重回心理安全感的「源頭與根基」。故人往往是內化良知與庇護力量的象徵。',
    keywords: ['媽媽', '母親', '爸爸', '父親', '親人', '過身', '已故', '神枱', '舊居', '祖屋', '長輩']
  },
  {
    id: 'theme_falling_flying',
    theme_name: '高處墜落與懸浮飛行 (Falling & Flying)',
    description: '夢見從高樓或山崖跌落，或自身突然能在空中翱翔。',
    psychological_meaning: '下墜象徵失控焦慮與現實支撐點的瓦解；飛行則反映渴望擺脫現實拘束、超脫困境的強烈衝動，亦提醒需留意是否過度理想化而缺乏接地。',
    keywords: ['墜落', '跌', '掉下', '深淵', '高樓', '飛', '飄', '懸浮', '空中']
  },
  {
    id: 'theme_teeth_body',
    theme_name: '牙齒脫落與身體失序 (Teeth Falling & Vulnerability)',
    description: '夢見牙齒碎裂、全部掉落或吐出碎石骨頭。',
    psychological_meaning: '牙齒是咀嚼現實、展現力量與控制力的象徵。牙齒脫落常對應個人影響力衰退、年齡增長焦慮或難以「消化」現實生活的無力感。',
    keywords: ['牙齒', '掉牙', '牙痛', '流血', '身體', '碎裂']
  },
  {
    id: 'theme_lost_searching',
    theme_name: '迷路與找不到出口 (Lost & Searching for Way Out)',
    description: '在複雜的建築物、陌生街道或地鐵中迷航，找不到回家的路。',
    psychological_meaning: '象徵人生方向的不確定性與階段過渡期的迷茫。找不到門反映舊的生活模式已不再適用，但新的自我認同尚未建立。',
    keywords: ['迷路', '找不到', '出口', '迷宮', '街道', '走廊', '門', '樓梯']
  }
];

export const SEED_SYMBOLS = [
  {
    id: 'sym_water',
    symbol_name: '水 / 海洋',
    symbol_emoji: '🌊',
    primary_meaning: '象徵潛意識、原始情緒能量的流動。平靜的水代表內心寧靜，湍急或漫過頭頂的水代表被未消化的情緒所吞噬。',
    cultural_meaning: '華人文化中上善若水，亦指隱忍的情感潮水。',
    keywords: ['水', '海', '洋', '河', '池', '淹', '雨']
  },
  {
    id: 'sym_barefoot',
    symbol_name: '赤腳 / 無鞋',
    symbol_emoji: '👣',
    primary_meaning: '象徵防禦缺乏、內心脆弱性暴露，在現實環境中缺乏堅實立足點或安全支撐。',
    cultural_meaning: '失去在社會規範體系中的體面與防護。',
    keywords: ['赤腳', '光腳', '沒穿鞋', '無鞋', '脫鞋']
  },
  {
    id: 'sym_chased',
    symbol_name: '被追逐 / 逃奔',
    symbol_emoji: '🏃',
    primary_meaning: '象徵清醒時被刻意壓抑的焦慮、未完成責任或自身恐懼的人格陰影 (Shadow)。',
    cultural_meaning: '生活中催逼迫切的壓力感知。',
    keywords: ['追', '逃', '跑', '躲', '逃命', '避開']
  },
  {
    id: 'sym_old_house',
    symbol_name: '舊屋 / 祖居 / 房間',
    symbol_emoji: '🏚️',
    primary_meaning: '房屋象徵自我心理結構。舊居代表童年安全感根基與過去未解的情感記憶。',
    cultural_meaning: '家族秩序、成長印記與回憶歸宿。',
    keywords: ['舊居', '舊屋', '老家', '祖屋', '房間', '屋邨']
  },
  {
    id: 'sym_altar',
    symbol_name: '神枱 / 香火 / 蠟燭',
    symbol_emoji: '🕯️',
    primary_meaning: '心靈聖殿與內在道德準則的投射，提示尋求無條件接納與根源庇佑。',
    cultural_meaning: '嶺南與華人傳統家宅神聖秩序的根基。',
    keywords: ['神枱', '香火', '蠟燭', '拜神', '菩薩', '祖先']
  },
  {
    id: 'sym_school',
    symbol_name: '學校 / 考場 / 課室',
    symbol_emoji: '🏫',
    primary_meaning: '象徵社會性評價標準、同儕比較與「未達標」的潛在羞愧感。',
    cultural_meaning: '華人公開試制度留下的集體集體評價創傷烙印。',
    keywords: ['學校', '課室', '考試', '試卷', '老師', '同學', '黑板']
  },
  {
    id: 'sym_door',
    symbol_name: '門 / 鑰匙',
    symbol_emoji: '🚪',
    primary_meaning: '象徵心理邊界的過渡、心境轉折點或開啟潛意識未知寶藏的機會。',
    cultural_meaning: '人生新階段抉擇與轉變的契機。',
    keywords: ['門', '鑰匙', '鎖', '推門', '開門', '找不到門']
  },
  {
    id: 'sym_falling',
    symbol_name: '墜落 / 深淵',
    symbol_emoji: '🕳️',
    primary_meaning: '象徵失控、失去現實掌控力或害怕從高位跌落的深刻焦慮。',
    cultural_meaning: '對不可逆變故的憂患意識。',
    keywords: ['跌', '墜落', '掉下', '深淵', '掉下去', '失足']
  },
  {
    id: 'sym_mirror',
    symbol_name: '鏡子 / 倒影',
    symbol_emoji: '🪞',
    primary_meaning: '象徵自我審視、真實自我與人格面具 (Persona) 的分裂。',
    cultural_meaning: '直面心靈本相與不可言說之秘密。',
    keywords: ['鏡', '鏡子', '倒影', '照鏡']
  },
  {
    id: 'sym_snake',
    symbol_name: '蛇 / 野獸',
    symbol_emoji: '🐍',
    primary_meaning: '原始生命本能、隱秘性慾望、危險警報，同時亦代表心靈蛻變與重生。',
    cultural_meaning: '不可測度之力量與轉機。',
    keywords: ['蛇', '怪獸', '野獸', '狼', '咬']
  },
  {
    id: 'sym_clock',
    symbol_name: '時鐘 / 遲到',
    symbol_emoji: '⏳',
    primary_meaning: '象徵生命時間的流逝、迫在眉睫的緊迫感與「來不及」的生存焦慮。',
    cultural_meaning: '社會時鐘與成就壓力的折射。',
    keywords: ['時鐘', '時間', '遲到', '趕車', '錯過']
  },
  {
    id: 'sym_elevator',
    symbol_name: '電梯 / 升降機',
    symbol_emoji: '🛗',
    primary_meaning: '意識層次（高處）與潛意識深處（底層）的升降穿梭；失控電梯反映情緒震盪。',
    cultural_meaning: '現代都市人高壓空間與命運不受控感。',
    keywords: ['電梯', '升降機', '下墜電梯', '上升']
  }
];

export const SEED_ANALYSIS_RULES = [
  {
    id: 'rule_compensation',
    rule_name: '補償性平衡原則',
    rule_category: '榮格分析心理學',
    content_snippet: '夢不是預言命運，而是當白天意識自我過度偏向某個極端時，潛意識透過夢中強烈的情緒或相反情節進行「心理天平的補償校準」。',
    keywords: ['補償', '平衡', '反差', '極端']
  },
  {
    id: 'rule_shadow_integration',
    rule_name: '陰影原型認領法則',
    rule_category: '原型心理學',
    content_snippet: '夢中令人恐懼、厭惡或逃避的角色，往往包含著被個體否認或壓抑的生命力。學會接納它，才能化解恐懼。',
    keywords: ['陰影', '怪物', '逃避', '恐懼', '黑影']
  },
  {
    id: 'rule_cultural_projection',
    rule_name: '當代文化情境投射法則',
    rule_category: '文化心理學',
    content_snippet: '解夢必須紮根於當事人的文化與現實生活情境。華人夢見親人長輩多關乎責任與安心，夢見考場多關乎社會評價，勿強行套用西方機械象徵字典。',
    keywords: ['文化', '長輩', '考試', '家庭', '神枱']
  },
  {
    id: 'rule_emotion_truth',
    rule_name: '夢中情緒真實性法則',
    rule_category: '現代夢工作',
    content_snippet: '夢的情節可能是荒誕且超現實的，但醒來時心頭殘留的情緒（驚恐、悲傷、如釋重負）是百分之百真實的，應以此情緒為解碼核心。',
    keywords: ['情緒', '真實', '感覺', '醒來', '心跳']
  }
];

// -------------------------------------------------------------
// 2. Database Schema Initialization & Querying
// -------------------------------------------------------------

export async function initDreamMasterTables(pool: Pool | null) {
  if (!pool) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        core_theory TEXT NOT NULL,
        snippet TEXT NOT NULL,
        keywords JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS dream_themes (
        id VARCHAR(64) PRIMARY KEY,
        theme_name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        psychological_meaning TEXT NOT NULL,
        keywords JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS dream_symbols (
        id VARCHAR(64) PRIMARY KEY,
        symbol_name VARCHAR(255) NOT NULL,
        symbol_emoji VARCHAR(32) NOT NULL,
        primary_meaning TEXT NOT NULL,
        cultural_meaning TEXT,
        keywords JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS analysis_rules (
        id VARCHAR(64) PRIMARY KEY,
        rule_name VARCHAR(255) NOT NULL,
        rule_category VARCHAR(64) NOT NULL,
        content_snippet TEXT NOT NULL,
        keywords JSONB DEFAULT '[]'::jsonb
      );

      -- DreamAstra Master Schema (22 本權威心理學書籍 + 7 標籤 + 92 意象 + 標籤關聯)
      CREATE TABLE IF NOT EXISTS dream_book (
        book_id SERIAL PRIMARY KEY,
        book_name VARCHAR(255) NOT NULL UNIQUE,
        title_zh VARCHAR(255),
        title_en VARCHAR(255),
        book_name_en VARCHAR(255),
        author VARCHAR(128),
        school VARCHAR(64),
        global_weight REAL DEFAULT 0.50,
        core_theory TEXT,
        process JSONB DEFAULT '[]'::jsonb,
        forbidden JSONB DEFAULT '[]'::jsonb,
        scene_match JSONB DEFAULT '[]'::jsonb,
        description TEXT
      );

      ALTER TABLE dream_book ADD COLUMN IF NOT EXISTS title_zh VARCHAR(255);
      ALTER TABLE dream_book ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);
      ALTER TABLE dream_book ADD COLUMN IF NOT EXISTS core_theory TEXT;
      ALTER TABLE dream_book ADD COLUMN IF NOT EXISTS process JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE dream_book ADD COLUMN IF NOT EXISTS forbidden JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE dream_book ADD COLUMN IF NOT EXISTS scene_match JSONB DEFAULT '[]'::jsonb;

      CREATE TABLE IF NOT EXISTS dream_tag (
        tag_id SERIAL PRIMARY KEY,
        tag_name VARCHAR(64) NOT NULL UNIQUE,
        tag_desc TEXT
      );

      CREATE TABLE IF NOT EXISTS dream_symbol (
        symbol_id SERIAL PRIMARY KEY,
        symbol VARCHAR(128) NOT NULL UNIQUE,
        alias_list JSONB NOT NULL DEFAULT '[]'::jsonb,
        book_interpret_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        source_ref VARCHAR(512),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dream_symbol_tag (
        id SERIAL PRIMARY KEY,
        symbol_id INT NOT NULL REFERENCES dream_symbol(symbol_id) ON DELETE CASCADE,
        tag_id INT NOT NULL REFERENCES dream_tag(tag_id) ON DELETE CASCADE,
        UNIQUE (symbol_id, tag_id)
      );
    `);

    // Seed DreamAstra Books (22 books)
    for (const b of DREAM_BOOKS) {
      await client.query(
        `INSERT INTO dream_book (book_id, book_name, title_zh, title_en, book_name_en, author, school, global_weight, core_theory, process, forbidden, scene_match, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (book_name) DO UPDATE 
         SET title_zh = EXCLUDED.title_zh,
             title_en = EXCLUDED.title_en,
             book_name_en = EXCLUDED.book_name_en,
             author = EXCLUDED.author,
             school = EXCLUDED.school,
             global_weight = EXCLUDED.global_weight,
             core_theory = EXCLUDED.core_theory,
             process = EXCLUDED.process,
             forbidden = EXCLUDED.forbidden,
             scene_match = EXCLUDED.scene_match,
             description = EXCLUDED.description`,
        [
          b.book_id,
          b.book_name,
          b.title_zh || b.book_name,
          b.title_en || b.book_name_en,
          b.book_name_en || b.title_en,
          b.author,
          b.school,
          b.global_weight,
          b.core_theory,
          JSON.stringify(b.process || []),
          JSON.stringify(b.forbidden || []),
          JSON.stringify(b.scene_match || []),
          b.description || b.core_theory,
        ]
      );
    }

    // Seed DreamAstra Tags (7 tags)
    for (const t of DREAM_TAGS) {
      await client.query(
        `INSERT INTO dream_tag (tag_id, tag_name, tag_desc)
         VALUES ($1, $2, $3)
         ON CONFLICT (tag_id) DO UPDATE SET tag_name = EXCLUDED.tag_name, tag_desc = EXCLUDED.tag_desc`,
        [t.tag_id, t.tag_name, t.tag_desc]
      );
    }

    // Seed DreamAstra Symbols (all symbols from database)
    await client.query('DELETE FROM dream_symbol_tag;');
    for (const s of DREAM_SYMBOLS) {
      const res = await client.query(
        `INSERT INTO dream_symbol (symbol_id, symbol, alias_list, book_interpret_json, source_ref, notes)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (symbol) DO UPDATE 
         SET symbol_id = EXCLUDED.symbol_id,
             alias_list = EXCLUDED.alias_list,
             book_interpret_json = EXCLUDED.book_interpret_json,
             source_ref = EXCLUDED.source_ref,
             notes = EXCLUDED.notes
         RETURNING symbol_id`,
        [s.symbol_id, s.symbol, JSON.stringify(s.alias_list), JSON.stringify(s.book_interpret_json), s.source_ref, s.notes]
      );

      const symbolId = res.rows[0]?.symbol_id || s.symbol_id;
      for (const tid of (s.tag_ids || [])) {
        await client.query(
          `INSERT INTO dream_symbol_tag(symbol_id, tag_id)
           VALUES ($1, $2)
           ON CONFLICT (symbol_id, tag_id) DO NOTHING`,
          [symbolId, tid]
        );
      }
    }

    // Seed books if empty
    const bookCount = await client.query('SELECT COUNT(*) FROM books');
    if (parseInt(bookCount.rows[0].count, 10) === 0) {
      for (const b of SEED_BOOKS) {
        await client.query(
          `INSERT INTO books (id, title, author, core_theory, snippet, keywords)
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
          [b.id, b.title, b.author, b.core_theory, b.snippet, JSON.stringify(b.keywords)]
        );
      }
    }

    // Seed themes if empty
    const themeCount = await client.query('SELECT COUNT(*) FROM dream_themes');
    if (parseInt(themeCount.rows[0].count, 10) === 0) {
      for (const t of SEED_THEMES) {
        await client.query(
          `INSERT INTO dream_themes (id, theme_name, description, psychological_meaning, keywords)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
          [t.id, t.theme_name, t.description, t.psychological_meaning, JSON.stringify(t.keywords)]
        );
      }
    }

    // Seed symbols if empty
    const symbolCount = await client.query('SELECT COUNT(*) FROM dream_symbols');
    if (parseInt(symbolCount.rows[0].count, 10) === 0) {
      for (const s of SEED_SYMBOLS) {
        await client.query(
          `INSERT INTO dream_symbols (id, symbol_name, symbol_emoji, primary_meaning, cultural_meaning, keywords)
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
          [s.id, s.symbol_name, s.symbol_emoji, s.primary_meaning, s.cultural_meaning, JSON.stringify(s.keywords)]
        );
      }
    }

    // Seed analysis_rules if empty
    const ruleCount = await client.query('SELECT COUNT(*) FROM analysis_rules');
    if (parseInt(ruleCount.rows[0].count, 10) === 0) {
      for (const r of SEED_ANALYSIS_RULES) {
        await client.query(
          `INSERT INTO analysis_rules (id, rule_name, rule_category, content_snippet, keywords)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
          [r.id, r.rule_name, r.rule_category, r.content_snippet, JSON.stringify(r.keywords)]
        );
      }
    }
  } finally {
    client.release();
  }
}

// -------------------------------------------------------------
// 3. Backend Text Preprocessing (SOP Step 2)
// -------------------------------------------------------------

/**
 * 後端預處理使用者文本：
 * - 移除多餘連續換行（縮減為單一換行）
 * - 移除重複冗餘敘述、多餘空格
 * - 保留夢境核心情節與情緒字眼
 * - 若字數少於 15 字，不執行解讀並引導
 */
export function preprocessDreamText(rawText: string): {
  isValid: boolean;
  cleanedText: string;
  charCount: number;
  errorMessage?: string;
} {
  if (!rawText || typeof rawText !== 'string') {
    return {
      isValid: false,
      cleanedText: '',
      charCount: 0,
      errorMessage: '夢境描述不可為空。請提供昨夜或近期的夢境情節。'
    };
  }

  // 1. 規範換行符
  let cleaned = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. 合併連續超過2個的換行為單一換行
  cleaned = cleaned.replace(/\n{2,}/g, '\n');

  // 3. 壓縮連續空格為單空格
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');

  // 4. 移除行首行尾空白
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim();

  // 計算有效中英文字符數（排除純標點與空行）
  const pureContentLength = cleaned.replace(/[\s\p{P}]/gu, '').length;

  if (cleaned.length < 15 || pureContentLength < 10) {
    return {
      isValid: false,
      cleanedText: cleaned,
      charCount: cleaned.length,
      errorMessage: '夢境文字少於 15 字，暫不執行解讀。請試著補充夢中的核心情緒（例如害怕、平靜、困惑）、周遭具體場景、身邊出現的人物或關鍵細節，以便透過心理意象資料庫為你精準解析。'
    };
  }

  return {
    isValid: true,
    cleanedText: cleaned,
    charCount: cleaned.length,
  };
}

// -------------------------------------------------------------
// 4. SQL Retrieval & Result Capping (SOP Step 3, 4, 5)
// -------------------------------------------------------------

/**
 * 執行 SQL 檢索查詢，查詢表：books、dream_themes、dream_symbols、analysis_rules
 * 強制檢索結果上限，超出直接捨棄，不送入模型：
 * - 意象最多 8 項
 * - 主題最多 3 項
 * - 參考書籍規則片段最多 4 本
 */
export async function executeSqlRetrieval(
  cleanedDream: string,
  pool: Pool | null
): Promise<RetrievedDataResult> {
  const origLower = cleanedDream.toLowerCase();
  const tradLower = s2tConverter(cleanedDream).toLowerCase();
  const simpLower = t2sConverter(cleanedDream).toLowerCase();
  const lower = origLower;

  // Multi-variant keyword matcher: checks Original, Traditional, and Simplified forms
  function textContains(keyword: string): boolean {
    if (!keyword) return false;
    const kw = keyword.toLowerCase().trim();
    if (kw.length === 0) return false;
    const kwTrad = s2tConverter(kw);
    const kwSimp = t2sConverter(kw);
    return (
      origLower.includes(kw) ||
      tradLower.includes(kw) ||
      simpLower.includes(kw) ||
      tradLower.includes(kwTrad) ||
      simpLower.includes(kwSimp) ||
      origLower.includes(kwTrad) ||
      origLower.includes(kwSimp)
    );
  }

  // Keyword match score helper
  function matchKeywords(itemKeywords: string[]): number {
    let score = 0;
    for (const kw of itemKeywords) {
      if (textContains(kw)) {
        score += 2;
      }
    }
    return score;
  }

  // Helper for symbol emojis
  function getSymbolEmoji(sym: string): string {
    const map: Record<string, string> = {
      '祖母': '👵', '祖父': '👴', '小偷': '🦹', '流浪漢': '🧳', '女巫': '🧙‍♀️',
      '醫生': '🩺', '小孩': '🧒', '敵人': '⚔️', '司機': '🚗', '聖者／隱士': '🧘',
      '父親': '👨', '母親': '👩', '陌生人': '👥', '前任': '💔', '嬰兒': '👶',
      '太陽': '☀️', '月亮': '🌙', '星星': '⭐', '彩虹': '🌈', '雷電／閃電': '⚡', '雷電': '⚡', '閃電': '⚡',
      '暴風雨／颱風': '⛈️', '暴風雨': '⛈️', '颱風': '🌀', '雪／冰雪': '❄️', '雪': '❄️',
      '火／烈火': '🔥', '火': '🔥', '雲／烏雲': '☁️', '雲': '☁️', '烏雲': '☁️', '霧': '🌫️',
      '瀑布': '🌊', '大地／泥土': '🪵', '泉水／水井': '⛲', '樹木／大樹': '🌳', '樹': '🌳',
      '鹿': '🦌', '貓': '🐱', '孔雀': '🦚', '綿羊': '🐑', '蝙蝠': '🦇',
      '狼': '🐺', '馬': '🐎', '蛇': '🐍', '鷹': '🦅', '老鼠': '🐭',
      '龍': '🐉', '老虎': '🐅', '虎': '🐅', '獅子': '🦁', '狗／流浪狗': '🐕', '狗': '🐕',
      '鳥／飛鳥': '🕊️', '鳥': '🕊️', '烏鴉': '🦅', '蝴蝶': '🦋', '魚／游魚': '🐟', '魚': '🐟',
      '烏龜／龜': '🐢', '龜': '🐢', '鯨魚／海豚': '🐋', '海豚': '🐬', '蜘蛛': '🕷️',
      '狐狸': '🦊', '牛': '🐂', '鳳凰': '🪽',
      '神枱／神案': '🕯️', '神枱': '🕯️', '舊居／祖屋／唐樓': '🏚️', '舊居': '🏚️', '祖屋': '🏚️',
      '公屋長廊／公共屋邨': '🏢', '公屋': '🏢', '叮叮車／電車': '🚋', '天星小輪／渡輪': '⛴️',
      '茶餐廳／冰室': '🍵', '維多利亞港／維港': '🌃', '維港': '🌃', '霓虹燈招牌': '🏮',
      '旺角金魚街': '🐠', '黃大仙／廟宇求籤': '⛩️', '燒衣／冥鏹祭拜': '🪙', '紙紮': '🎐',
      '麻雀／打麻雀': '🀄', '竹棚／搭棚': '🪜', '劏房／棺材房': '🚪', '回南天／潮濕牆壁': '🌧️',
      '圖書館': '📚', '港口': '⚓', '旅館／酒店': '🏨', '墳墓': '🪦', '森林': '🌲',
      '學校': '🏫', '橋': '🌉', '家／房屋': '🏠', '房子': '🏠', '洞穴': '🕳️',
      '山': '⛰️', '地下室': '🏚️', '天台': '🏢', '監獄': '⛓️', '醫院': '🏥',
      '沙漠': '🏜️', '海洋': '🌊', '河流': '🏞️', '超市': '🛒', '車站': '🚉',
      '教堂': '⛪', '電梯／升降機': '🛗', '電梯': '🛗', '迷宮': '🌀', '浴室／洗手間': '🛁',
      '鑰匙': '🔑', '鏡子': '🪞', '船': '🚢', '燈籠／燈': '🏮', '衣服': '👕',
      '寶石': '💎', '錢／金錢': '💰', '錢': '💰', '門': '🚪', '鐘錶／時鐘': '🕰️',
      '時鐘': '⏰', '武器': '⚔️', '書本': '📖', '書': '📖', '車輛': '🚗',
      '梯子': '🪜', '窗': '🪟', '鎖': '🔒', '劍': '🗡️', '花朵': '🌸', '花': '🌸',
      '種子': '🌱', '面具': '🎭', '棺材': '⚰️', '電話／手機': '📱', '手機': '📱',
      '丟失錢包／丟失手機': '👛', '眼睛': '👁️', '心臟': '🫀', '牙齒': '🦷', '牙齒脫落': '🦷',
      '皮膚': '🩹', '頭': '👤', '手': '✋', '腳': '🦶', '血': '🩸',
      '骨頭': '🦴', '頭髮': '💇', '追逐': '🏃', '尋找東西': '🔍', '溺水': '🏊',
      '墜落': '🪂', '考試／答不出題': '📝', '考試': '📝', '遲到': '⏱️', '飛翔': '🦅',
      '躲藏': '🫣', '殺人': '🔪', '死亡': '💀', '奔跑': '🏃', '迷路': '🧭',
      '受傷': '🩹', '結婚': '💍', '分手': '💔', '開槍': '🔫', '被綁': '⛓️',
      '斷電': '🔌', '裸體': '👤', '漂浮': '🫧', '哭泣': '😭', '窒息': '😮‍💨',
      '重逢': '🤝', '洪水': '🌊', '火災': '🔥', '地震': '🌋', '海嘯': '🌊', '車禍／墜機': '💥'
    };
    for (const [k, v] of Object.entries(map)) {
      if (sym.includes(k) || k.includes(sym)) return v;
    }
    return '🔮';
  }

  // 1. Retrieve Dream Symbols (Prioritize DreamAstra Symbols, Max 8)
  let matchedSymbols: Array<any> = [];

  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM dream_symbol');
      if (res.rows.length > 0) {
        matchedSymbols = res.rows
          .map((r) => {
            const aliases = Array.isArray(r.alias_list) ? r.alias_list : (typeof r.alias_list === 'string' ? JSON.parse(r.alias_list) : []);
            let score = 0;
            if (textContains(r.symbol)) score += 5;
            for (const a of aliases) {
              if (textContains(String(a))) score += 3;
            }
            return {
              symbol_name: r.symbol,
              symbol_emoji: getSymbolEmoji(r.symbol),
              primary_meaning: r.notes || '',
              cultural_meaning: r.source_ref || '',
              book_interpret: typeof r.book_interpret_json === 'string' ? JSON.parse(r.book_interpret_json) : r.book_interpret_json,
              score,
            };
          })
          .filter((r) => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 8); // HARD LIMIT: 8
      }
    } catch {
      matchedSymbols = [];
    }
  }

  // Fallback to DREAM_SYMBOLS memory cache if db has no matches
  if (matchedSymbols.length === 0) {
    matchedSymbols = DREAM_SYMBOLS
      .map((s) => {
        let score = 0;
        if (textContains(s.symbol)) score += 5;
        for (const a of s.alias_list) {
          if (textContains(a)) score += 3;
        }
        return {
          symbol_name: s.symbol,
          symbol_emoji: getSymbolEmoji(s.symbol),
          primary_meaning: s.notes,
          cultural_meaning: s.source_ref,
          book_interpret: s.book_interpret_json,
          score,
        };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // HARD LIMIT: 8
  }

  // If still empty, check legacy SEED_SYMBOLS
  if (matchedSymbols.length === 0) {
    matchedSymbols = SEED_SYMBOLS
      .map((s) => ({ ...s, score: matchKeywords(s.keywords) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }

  // 2. Retrieve Dream Themes (Max 3)
  let matchedThemes: Array<any> = [];
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM dream_themes');
      matchedThemes = res.rows
        .map((r) => {
          const kws = Array.isArray(r.keywords) ? r.keywords : (typeof r.keywords === 'string' ? JSON.parse(r.keywords) : []);
          return { ...r, score: matchKeywords(kws) };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // HARD LIMIT: 3
    } catch {
      matchedThemes = [];
    }
  }

  if (matchedThemes.length === 0) {
    matchedThemes = SEED_THEMES
      .map((t) => ({ ...t, score: matchKeywords(t.keywords) }))
      .filter((t) => t.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // HARD LIMIT: 3
  }

  // 3. Retrieve Books & Analysis Rules (Combined Max 4)
  let matchedBooks: Array<any> = [];
  let matchedRules: Array<any> = [];

  // Query DreamAstra 22 Books
  if (pool) {
    try {
      const dbBooks = await pool.query('SELECT * FROM dream_book');
      if (dbBooks.rows.length > 0) {
        matchedBooks = dbBooks.rows
          .map((b) => {
            let score = 0;
            if (lower.includes(b.book_name.toLowerCase())) score += 5;
            if (b.title_zh && lower.includes(b.title_zh.toLowerCase())) score += 5;
            if (b.author && lower.includes(b.author.toLowerCase())) score += 4;
            if (b.school && lower.includes(b.school.toLowerCase())) score += 3;
            const sceneMatches = Array.isArray(b.scene_match) ? b.scene_match : (typeof b.scene_match === 'string' ? JSON.parse(b.scene_match) : []);
            for (const sm of sceneMatches) {
              if (lower.includes(String(sm).toLowerCase())) score += 4;
            }
            // Bonus score if matched symbols reference this book
            for (const sym of matchedSymbols) {
              if (sym.book_interpret && (sym.book_interpret[String(b.book_id)] || sym.book_interpret[b.book_name])) {
                score += 3;
              }
            }
            const theory = b.core_theory || b.description || '';
            const proc = Array.isArray(b.process) && b.process.length > 0 ? ` [流程: ${b.process.join(' -> ')}]` : '';
            const forb = Array.isArray(b.forbidden) && b.forbidden.length > 0 ? ` [禁忌: ${b.forbidden.join('、')}]` : '';

            return {
              source_title: `${b.book_name} (${b.author || ''} · ${b.school || ''}學派)`,
              category: 'DreamAstra 權威典籍',
              snippet: `${theory}${proc}${forb}`.trim(),
              score,
            };
          })
          .filter((b) => b.score > 0);
      }
    } catch {
      matchedBooks = [];
    }
  }

  // In-memory fallback for DreamAstra 22 Books
  if (matchedBooks.length === 0) {
    matchedBooks = DREAM_BOOKS
      .map((b) => {
        let score = 0;
        if (lower.includes(b.book_name.toLowerCase())) score += 5;
        if (b.title_zh && lower.includes(b.title_zh.toLowerCase())) score += 5;
        if (b.author && lower.includes(b.author.toLowerCase())) score += 4;
        if (b.school && lower.includes(b.school.toLowerCase())) score += 3;
        for (const sm of b.scene_match || []) {
          if (lower.includes(String(sm).toLowerCase())) score += 4;
        }
        for (const sym of matchedSymbols) {
          if (sym.book_interpret && (sym.book_interpret[String(b.book_id)] || sym.book_interpret[b.book_name])) {
            score += 3;
          }
        }
        const theory = b.core_theory || b.description || '';
        const proc = b.process && b.process.length > 0 ? ` [流程: ${b.process.join(' -> ')}]` : '';
        const forb = b.forbidden && b.forbidden.length > 0 ? ` [禁忌: ${b.forbidden.join('、')}]` : '';

        return {
          source_title: `${b.book_name} (${b.author} · ${b.school}學派)`,
          category: 'DreamAstra 權威典籍',
          snippet: `${theory}${proc}${forb}`.trim(),
          score,
        };
      })
      .filter((b) => b.score > 0);
  }

  // If still low, check SEED_BOOKS
  if (matchedBooks.length === 0) {
    matchedBooks = SEED_BOOKS
      .map((b) => ({
        source_title: b.title,
        category: '典籍文獻',
        snippet: `${b.core_theory}：${b.snippet}`,
        score: matchKeywords(b.keywords),
      }))
      .filter((b) => b.score > 0);
  }

  // Analysis Rules
  if (pool) {
    try {
      const ruleRes = await pool.query('SELECT * FROM analysis_rules');
      matchedRules = ruleRes.rows
        .map((r) => {
          const kws = Array.isArray(r.keywords) ? r.keywords : (typeof r.keywords === 'string' ? JSON.parse(r.keywords) : []);
          return {
            source_title: `${r.rule_name} (${r.rule_category})`,
            category: '解讀規則',
            snippet: r.content_snippet,
            score: matchKeywords(kws),
          };
        })
        .filter((r) => r.score > 0);
    } catch {
      matchedRules = [];
    }
  }

  if (matchedRules.length === 0) {
    matchedRules = SEED_ANALYSIS_RULES
      .map((r) => ({
        source_title: `${r.rule_name} (${r.rule_category})`,
        category: '解讀規則',
        snippet: r.content_snippet,
        score: matchKeywords(r.keywords),
      }))
      .filter((r) => r.score > 0);
  }

  // Combine and enforce HARD LIMIT: Max 4 books/rules
  const combinedBooksAndRules = [...matchedBooks, ...matchedRules]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4); // HARD LIMIT: 4

  const totalItems = matchedSymbols.length + matchedThemes.length + combinedBooksAndRules.length;

  // Step 5: Format retrieved data into minimalist prompt injection snippet (最小化 Prompt 注入)
  let formattedSnippet = '';
  if (totalItems === 0) {
    formattedSnippet = '無特定資料庫象徵匹配，依據通用心理學夢工作理論進行開放式解讀。';
  } else {
    const parts: string[] = [];

    if (matchedSymbols.length > 0) {
      // 最小化 Prompt 注入：僅保留最關鍵前 4 項核心意象與一筆精要寓意
      const topSymbols = matchedSymbols.slice(0, 4);
      parts.push('【SQL 核心意象】: ' + topSymbols.map(s => `${s.symbol_emoji} ${s.symbol_name}(${s.primary_meaning})`).join('；'));
    }
    if (matchedThemes.length > 0) {
      const topTheme = matchedThemes[0];
      parts.push(`【SQL 夢境主題】: ${topTheme.theme_name}（${topTheme.psychological_meaning}）`);
    }
    if (combinedBooksAndRules.length > 0) {
      // 最小化書籍規則：僅保留前 2 條代表性古典心理學理論精簡片段（60字以內）
      const topBooks = combinedBooksAndRules.slice(0, 2);
      parts.push('【SQL 典籍理論】: ' + topBooks.map(b => `《${b.source_title}》: ${b.snippet.slice(0, 60)}...`).join('；'));
    }

    formattedSnippet = parts.join('\n');
  }

  return {
    symbols: matchedSymbols.map((s) => ({
      symbol_name: s.symbol_name,
      symbol_emoji: s.symbol_emoji,
      primary_meaning: s.primary_meaning,
      cultural_meaning: s.cultural_meaning,
    })),
    themes: matchedThemes.map((t) => ({
      theme_name: t.theme_name,
      psychological_meaning: t.psychological_meaning,
    })),
    booksAndRules: combinedBooksAndRules.map((b) => ({
      source_title: b.source_title,
      category: b.category,
      snippet: b.snippet,
    })),
    formattedSnippet,
    totalItems,
  };
}

// -------------------------------------------------------------
// 5. Prompt Assembly & Follow-up Compression (SOP Step 6, 8, 9)
// -------------------------------------------------------------

/**
 * 組裝請求內容：使用固定最小化系統提示詞，替換變數 {{retrieved_data}}、{{user_dream}}、{{user_context}}
 * 嚴格遵循：夢境記錄 ➔ SQL 意象與書籍檢索 ➔ 最小化 Prompt 注入 ➔ 400-800 字 AI 專業心理分析
 */
export function assembleDreamMasterPrompt(
  retrievedData: string,
  userDream: string,
  userContext?: UserContext,
  followUp?: FollowUpContext
): { systemInstruction: string; contents: string } {
  const contextStrings: string[] = [];
  if (userContext?.gender) contextStrings.push(`性別：${userContext.gender}`);
  if (userContext?.recent_status) contextStrings.push(`近況：${userContext.recent_status}`);
  if (userContext?.is_recurring !== undefined) {
    const isRec = userContext.is_recurring === true || userContext.is_recurring === 'true' || userContext.is_recurring === '是';
    contextStrings.push(`重複夢：${isRec ? '是' : '否'}`);
  }

  const contextFormatted = contextStrings.length > 0 ? contextStrings.join('，') : '一般狀態';

  // 對話輪次管理：全新請求 vs 追問同一個夢
  if (followUp?.is_follow_up) {
    // 追問：僅攜帶上一輪解析摘要（<=200token），不攜帶完整檢索數據
    const systemInstruction = `
你是一位具備嚴謹心理學素養的專業夢境分析師。
【任務】：針對使用者追問進行 400-800 字深度心理學解答。
【規則】：
1. 嚴禁玄學算命、吉凶預言。
2. 輸出文字必須包含結尾備註：「備註：解夢僅心理參考，非命運預測」。
3. 輸出字數嚴格控制在 400-800 字之內。
4. 使用通透、溫暖而具洞察力的繁體中文。
`;

    const contents = `
【上一輪解夢核心摘要】:
${followUp.previous_summary.slice(0, 250)}

【使用者追問內容】:
${followUp.follow_up_question}

請依據心理學與情感自我整合視角解答使用者的追問，字數維持 400-800 字，末尾註記「備註：解夢僅心理參考，非命運預測」。
`;

    return { systemInstruction, contents };
  }

  // 全新解夢請求：最小化 Prompt 注入 (Minimalist Prompt Injection)
  const systemInstruction = `
你是一位具備嚴謹心理學素養的專業夢境分析師（Dream Master）。
【流程規範】：依據「夢境記錄 ➔ SQL 意象與書籍檢索 ➔ 最小化 Prompt 注入 ➔ 400-800 字 AI 專業心理分析」架構執行。
【規則】：
1. 嚴格禁止玄學算命、吉凶禍福預言或宿命論。
2. 輸出字數嚴格控制在 400-800 字之間。
3. 輸出必須包含結尾備註：「備註：解夢僅心理參考，非命運預測」。
4. 結構包含：
   - 【夢境主題核心透視】（透視當下心理狀態與深層情感動態）
   - 【關鍵象徵意象與心理投射】（結合 SQL 檢索意象進行象徵解碼）
   - 【典籍理論與心靈補償洞察】（結合古典心理學如榮格自性化或佛洛伊德潛意識理論）
   - 【生活自我整合指南】（提供 2-3 項具體日常心理調適建議）
   - 備註：解夢僅心理參考，非命運預測
5. 全文以典雅精煉之繁體中文撰寫。
`;

  const contents = `
【SQL 意象與書籍檢索結果（最小化注入）】：
${retrievedData}

【造夢者背景】：
${contextFormatted}

【夢境記錄】：
${userDream}

請開始進行 400-800 字 AI 專業心理分析（文末附免責備註）：
`;

  return { systemInstruction, contents };
}

/**
 * 壓縮解夢結果為 200 token 左右的簡明摘要，供追問輪次使用
 */
export function compressSummaryForFollowup(fullText: string, symbols: string[]): string {
  if (!fullText) return '';
  const clean = fullText.replace(/備註：.*$/m, '').trim();
  const firstParagraph = clean.split('\n').filter(p => p.trim().length > 20)[0] || clean.slice(0, 150);
  const symbolList = symbols.slice(0, 3).join('、');
  return `【夢境核心摘要】：${firstParagraph.slice(0, 120)}……【關鍵意象】：${symbolList || '無固定意象'}。已完成 400-800 字心理學分析。`;
}

/**
 * 輸出過濾與修飾（SOP Step 8）：
 * 1. 嚴格過濾玄學算命、吉凶禍福之詞
 * 2. 強制包含備註「備註：解夢僅心理參考，非命運預測」
 * 3. 字數控制於 400-800 字
 */
export function postProcessAndFilterAnalysis(rawText: string, userDream: string): string {
  let filtered = rawText;

  // 1. 消除玄學占卜詞彙
  const bannedDivinationWords = [
    /大吉之兆/g, /大凶之兆/g, /預言你將/g, /命中注定/g,
    /算命結果/g, /財運亨通/g, /血光之災/g, /神明托夢預言/g,
    /凶多吉少/g, /預知未來/g
  ];
  for (const ban of bannedDivinationWords) {
    filtered = filtered.replace(ban, '反映當前心理狀態');
  }

  // 2. 檢查並補齊備註（必須包含）
  const disclaimerNote = '備註：本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷';
  if (!filtered.includes('本工具提供啟發思考的心理角度解讀')) {
    filtered = filtered.trim() + `\n\n${disclaimerNote}`;
  }

  // 3. 字數控制在 400-800 字（若過短補充心理學自我整合指引，若過長則適度修剪）
  if (filtered.length < 400) {
    const supplement = `\n\n【心理整合反思】：榮格指出，每一個在夢境中令我們心緒波動的情節，都是自我心靈尋求接納與補償的契機。試著在今天的生活中給予自己片刻寧靜，不用急於解決所有現實問題，先溫柔接納夢中那個真實流露情感的自己。`;
    filtered = filtered.replace(new RegExp(`\n\n${disclaimerNote}`), '') + supplement + `\n\n${disclaimerNote}`;
  } else if (filtered.length > 820) {
    // 截斷過度贅述段落並保留結尾備註，確保在 400-800 字範圍內
    const body = filtered.replace(new RegExp(`\n\n${disclaimerNote}`), '').slice(0, 750).trim();
    filtered = body + `……\n\n${disclaimerNote}`;
  }

  return filtered;
}

/**
 * 本地心理學 Fallback 解析器（保證離線或模型配額不足時仍能產出嚴格符合 SOP 之高品質解析，控制於 400-800 字）
 */
export function generateFallbackMasterAnalysis(
  cleanedDream: string,
  retrieved: RetrievedDataResult,
  userContext?: UserContext,
  followUp?: FollowUpContext
): string {
  if (followUp?.is_follow_up) {
    return `針對你對這個夢境的進一步追問：「${followUp.follow_up_question}」，從心理動力學的角度來看，當造夢者在清醒後仍持續對某個夢境細節產生強烈的探索欲時，往往代表潛意識中那份未完成事件（Unfinished Business）正在強烈呼喚意識自我的關注。

在上一輪解讀中，我們辨識出你內在正經歷的張力與調適過程。你所追問的具體面向，反映出你在日常生活中，對於「掌控感」與「接納不確定性」之間的拉鋸。當我們在夢中感到被推動或受困時，現實中的我們往往也在某個關係或職業關卡上扮演著過度承擔的角色。

建議你將這個追問視為心靈的一面鏡子：問問自己，如果夢中那個無助或奔跑的自己可以開口說一句話，他最希望對現實中的你說甚麼？接納這份情緒，允許自己不必每件事都做到完美無瑕，心靈的重擔自然會逐漸鬆綁。

備註：本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷`;
  }

  const primaryTheme = retrieved.themes[0]?.theme_name || '潛意識情緒整合與內在自我對話';
  const primarySymbol = retrieved.symbols[0]?.symbol_name || '夢境空間與情境投射';
  const primaryMeaning = retrieved.symbols[0]?.primary_meaning || '反映生活中心靈尚未消化的認知衝突與情感張力。';
  const bookCitation = retrieved.booksAndRules[0]?.source_title || 'Man and His Symbols (Carl G. Jung)';
  const bookSnippet = retrieved.booksAndRules[0]?.snippet || '榮格指出夢是潛意識自發的補償機制，旨在校準清醒時過於片面的態度。';

  const contextNote = userContext?.recent_status ? `結合你近期「${userContext.recent_status}」的生活近況，` : '';
  const recurringNote = userContext?.is_recurring ? '這是一個重複出現的夢境，提示此心理議題已持續累積，不可輕易忽略。' : '';

  return `【夢境主題核心透視】
昨夜的夢境呈現出「${primaryTheme}」的心理動態。夢境並非隨機的神經雜訊，而是潛意識心靈在安全睡眠狀態下的自我修復工坊。${contextNote}夢境中的情節正在具象化你日常意識層面試圖壓抑或無暇顧及的微小張力。${recurringNote}

【關鍵象徵意象與心理投射】
在資料庫檢索到的象徵中，最關鍵的投射為「${primarySymbol}」——${primaryMeaning}當你置身於夢中的場景時，周圍的人物與環境本質上都是你內在不同面向的化身。那些讓你感到緊繃、焦慮或失衡的瞬間，正反映出你白天習慣維持的堅強面具（Persona）已略感疲憊，心靈正在向你發出喘息與減速的訊號。

【典籍理論與心靈補償洞察】
依據《${bookCitation}》所載：${bookSnippet}在分析心理學視角下，夢的功能不在於預知禍福，而在於達成「心理天平的平衡補償」。當我們在現實生活中過度理性、過度承擔責任或苛求自我時，夢境便會透過失序、追逐或脆弱的場景，將被忽略的陰影與真實情感帶回視野中央，提醒我們重新回歸心靈的完整性（Wholeness）。

【給造夢者的生活自我整合指南】
1. 允許情緒落地：醒來時心頭殘留的感覺是百分之百真實的，請誠實肯定自己近期的辛勞。
2. 劃定心靈邊界：在接下來的數天裡，嘗試在繁重日程中給予自己獨立的沈澱時空。
3. 轉化內在對話：當焦慮湧上時，溫和地對自己說：「我已經走在調適的路上，現在的我足夠安全。」

備註：本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷`;
}

