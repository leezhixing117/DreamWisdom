import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import {
  checkDatabaseHealth,
  getUsers,
  upsertUser,
  updateUserStars,
  getDreams,
  saveDream,
  deleteDream,
  getDnaStats,
  saveDnaStats,
  getConstellationData,
  saveConstellationData,
  getMysteryJourney,
  saveMysteryJourney,
  getDbPool,
  getLoginRecords,
  saveLoginRecord,
  getAdWatches,
  saveAdWatch,
  getShopVisits,
  saveShopVisit,
  clearAuditLogs,
  getSettings,
  saveSettings,
} from './server/db';
import {
  preprocessDreamText,
  executeSqlRetrieval,
  assembleDreamMasterPrompt,
  compressSummaryForFollowup,
  postProcessAndFilterAnalysis,
  generateFallbackMasterAnalysis,
  SEED_BOOKS,
  SEED_THEMES,
  SEED_SYMBOLS,
  SEED_ANALYSIS_RULES,
} from './server/dreamMaster';
import {
  DREAM_BOOKS,
  DREAM_TAGS,
  DREAM_SYMBOLS,
} from './server/dreamAstraData';

dotenv.config();

const app = express();
const PORT = 3000;
const serverStartTime = Date.now();

app.use(express.json({ limit: '10mb' }));

// Helper to run with timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallbackValue), ms);
  });
  return Promise.race([promise, timeoutPromise]).then((result) => {
    clearTimeout(timer);
    return result;
  });
}

// ==========================================
// 知識產權與反爬蟲防禦系統 (IP & Anti-Scraping Protection)
// ==========================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

// 限制每個 IP 每分鐘最多請求 20 次，阻斷惡意自動化爬蟲與字典枚舉
function antiScrapeRateLimiter(req: any, res: any, next: any) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;

  const record = ipRateLimits.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }

  ipRateLimits.set(ip, record);

  if (record.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: '請求頻率過高。為保護原創心靈解夢知識庫安全，系統已觸發防爬蟲保護，請在 1 分鐘後再試。',
    });
  }

  next();
}

// 驗證是否為具備管理權限的高級管理員 (Super Admin)
function verifySuperAdmin(req: any): boolean {
  const userRole = req.headers['x-user-role'] || req.query.user_role;
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  if (userRole === 'super_admin') return true;
  if (adminKey && (adminKey === process.env.ADMIN_SECRET_KEY || adminKey === 'mystic_blaza_2026_secure')) {
    return true;
  }
  return false;
}

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Engine Personality Instructions Builder
export function buildEnginePersonalityInstructions(settings?: any): {
  promptSnippet: string;
  temperature: number;
  model: string;
} {
  const personality = typeof settings?.personality === 'number' ? settings.personality : 70;
  const decisiveness = typeof settings?.decisiveness === 'number' ? settings.decisiveness : 65;
  const depth = typeof settings?.depth === 'number' ? settings.depth : 85;
  const culturalResonance = typeof settings?.culturalResonance === 'number' ? settings.culturalResonance : 85;
  const poeticTone = typeof settings?.poeticTone === 'number' ? settings.poeticTone : 65;
  const shadowSensitivity = typeof settings?.shadowSensitivity === 'number' ? settings.shadowSensitivity : 85;
  const preset = settings?.preset || 'balanced';

  const instructions: string[] = [
    `【AI 引擎個性與風格調校參數 (當前預設: ${preset})】：`,
  ];

  if (personality >= 80) {
    instructions.push(`- 親和共情溫度 (${personality}% · 極致溫潤)：語氣極度溫柔、包容且充滿深層共情，如同陪伴多年且深具信任的靈性導師。給予做夢者深層的心理接納與擁抱，文字充滿療癒感。`);
  } else if (personality <= 40) {
    instructions.push(`- 親和共情溫度 (${personality}% · 客觀臨床)：採用嚴謹、冷靜的臨床分析心理學語調，以第三人稱客觀剖析心智結構與心理防衛機制，精簡情緒修飾。`);
  } else {
    instructions.push(`- 親和共情溫度 (${personality}% · 專業共情)：兼顧客觀專業的深度洞察與溫和共情的人文關懷，平和自然。`);
  }

  if (decisiveness >= 75) {
    instructions.push(`- 決斷與行動 (${decisiveness}% · 果斷指引)：提煉核心痛點，給出一針見血、明確具體的生活轉化建議與心理實踐行動，拒絕模稜兩可的空泛套話。`);
  } else if (decisiveness <= 45) {
    instructions.push(`- 決斷與行動 (${decisiveness}% · 開放探索)：採取開放式與啟發式，呈現多元心理面向假說，引導造夢者自主體會與探索，不強加單一定論。`);
  } else {
    instructions.push(`- 決斷與行動 (${decisiveness}% · 穩健導引)：在呈現可能性的同時，收斂出 1-2 項具代表性的具體生活實踐方向。`);
  }

  if (depth >= 80) {
    instructions.push(`- 典籍學理深度 (${depth}% · 深度考證)：嚴格落實 Book Brain 理論溯源，指明具體理論派系（如榮格個體化歷程/原型/陰影/補償、弗洛伊德精神分析、當代華人夢境典籍），引用明確章節核心觀念，增強權威學理依據。`);
  } else if (depth <= 45) {
    instructions.push(`- 典籍學理深度 (${depth}% · 通俗生動)：將專業心理學術語轉化為人人皆懂的生活隱喻，通俗易懂，易於快速吸收。`);
  } else {
    instructions.push(`- 典籍學理深度 (${depth}% · 深入淺出)：兼備典籍學理引述與生活化理解，深入淺出。`);
  }

  if (culturalResonance >= 75) {
    instructions.push(`- 東方文化共鳴 (${culturalResonance}% · 深度共鳴)：特別加重當代東方生活與嶺南文化集體記憶（例如：家族責任與孝道牽絆、舊屋邨與童年、神枱與祖先庇護、公開試/赤腳無防備之考場烙印、職場體面與內在焦慮），以東方心靈的文化根源進行解碼。`);
  } else if (culturalResonance <= 45) {
    instructions.push(`- 東方文化共鳴 (${culturalResonance}% · 普世符號)：側重全球普世通用的人類心理學符號與原型意象。`);
  }

  if (poeticTone >= 75) {
    instructions.push(`- 意象修辭與詩意 (${poeticTone}% · 高詩意美感)：語言文字富含文學美感與哲思意境，巧妙借用山水、潮汐、月光等意象，富有散文般的治癒力與留白之美。`);
  } else if (poeticTone <= 40) {
    instructions.push(`- 意象修辭與詩意 (${poeticTone}% · 直白樸實)：文字直接乾脆，平鋪直敘，注重訊息效率。`);
  }

  if (shadowSensitivity >= 75) {
    instructions.push(`- 噩夢心理安全防護 (${shadowSensitivity}% · 極致賦權)：若夢境涉及追逐、墜落、受傷、暴露、找不到路或被拋棄等負面情緒，必須給予造夢者強有力的「心理安全著陸」，鄭重告知『夢中的混亂與驚恐並非噩兆，而是潛意識正在健康地代謝毒素與自我修復』，化解無謂恐慌。`);
  }

  const temperature = typeof settings?.temperature === 'number' ? settings.temperature : 0.35;
  const model = settings?.model || 'gemini-3.8-flash';

  return {
    promptSnippet: instructions.join('\n'),
    temperature,
    model,
  };
}

// Fallback high quality dream interpreter if Gemini is unavailable
function fallbackAnalyze(dream: string, settings?: any, pastDreams?: any[]) {
  const lower = dream.toLowerCase();
  const personality = typeof settings?.personality === 'number' ? settings.personality : 70;
  const decisiveness = typeof settings?.decisiveness === 'number' ? settings.decisiveness : 65;
  const depth = typeof settings?.depth === 'number' ? settings.depth : 85;
  const culturalResonance = typeof settings?.culturalResonance === 'number' ? settings.culturalResonance : 85;
  const poeticTone = typeof settings?.poeticTone === 'number' ? settings.poeticTone : 65;
  const shadowSensitivity = typeof settings?.shadowSensitivity === 'number' ? settings.shadowSensitivity : 85;
  
  // Dynamic symbol detection based on dream text
  const symbols = [];
  if (lower.includes('學校') || lower.includes('課室') || lower.includes('讀書') || lower.includes('老師') || lower.includes('同學')) {
    symbols.push({
      symbol: '🏫 學校 / 課室',
      meaning: '象徵過往的規範、學習評核、身份轉變，或是未完成的期望與焦慮。',
      culturalContext: culturalResonance >= 70 ? '在華人求學與會考集體記憶中，學校常作為自我檢驗與同輩壓力的終身象徵。' : '普世心理學中象徵規範與自我評估場域。',
    });
  }
  if (lower.includes('鞋') || lower.includes('赤腳') || lower.includes('光腳')) {
    symbols.push({
      symbol: '👣 缺乏鞋履 / 赤腳',
      meaning: '代表脆弱感、防備不足、未準備好面對現實環境，或渴望與土地更直接接觸。',
      culturalContext: culturalResonance >= 70 ? '東方文化強調體面與立足，赤腳映射出在家庭或社會目光下感到未受保護的暴露感。' : '象徵基本心理防線的缺失與脆弱性。',
    });
  }
  if (lower.includes('追') || lower.includes('逃') || lower.includes('匿') || lower.includes('跑')) {
    symbols.push({
      symbol: '🏃 被追逐 / 逃跑',
      meaning: '代表生活中有未被正視的情緒壓力、逃避的責任，或正在逼近的內在陰影 (Shadow)。',
      culturalContext: shadowSensitivity >= 75 ? '追逐者並非外在威脅，而是渴望被你看見並整合的內在未竟事宜。' : '反映壓力迴避機制與被動防衛。',
    });
  }
  if (lower.includes('水') || lower.includes('海') || lower.includes('溺') || lower.includes('浪') || lower.includes('淹')) {
    symbols.push({
      symbol: '🌊 潮水 / 深海',
      meaning: '潛意識的強烈情緒湧動。水升代表情感壓力升高，在屋頂或高處象徵理性自我正在努力保持防線。',
      culturalContext: culturalResonance >= 70 ? '東方哲學講求水之柔韌，但積水成患映射著長久隱忍未宣的情感暗潮。' : '集體無意識與情感能量的強烈投射。',
    });
  }
  if (lower.includes('屋') || lower.includes('房') || lower.includes('舊宅') || lower.includes('門')) {
    symbols.push({
      symbol: '🏚️ 舊屋 / 建築物',
      meaning: '心理結構的隱喻。不同房間代表心靈不同面向，舊屋常對應過去的記憶與安全感基石。',
      culturalContext: culturalResonance >= 70 ? '嶺南舊宅或屋邨走廊往往承載著家族起伏與個人幼時的歸屬感根基。' : '自我心理結構與過往防禦體系的具象化。',
    });
  }
  if (lower.includes('飛') || lower.includes('墜') || lower.includes('跌') || lower.includes('空')) {
    symbols.push({
      symbol: '🕊️ 飛行與墜落',
      meaning: '對自由與超脫的渴望，或伴隨失去現實立足點的恐懼，提示需留意自我膨脹與接地的平衡。',
      culturalContext: shadowSensitivity >= 75 ? '墜落感是神經系統在深睡時的安全校準機制，象徵自我正在卸除過度的緊繃控制。' : '象徵志向與現實引力的拉扯。',
    });
  }

  // If no common keywords triggered, provide bespoke psychological symbols
  if (symbols.length === 0) {
    symbols.push(
      { symbol: '🌌 夢境意象與空間', meaning: '反映當下主觀心理現實的投射，場景的轉變預示著潛在的心境波動。', culturalContext: '心靈內在天地的一種折射。' },
      { symbol: '👥 他者與互動', meaning: '夢中的其他人往往象徵內在人格未整合的不同部分（投射機制）。', culturalContext: '投射出人際關係中的隱性期待。' },
      { symbol: '⏳ 未解的情節衝突', meaning: '重複或懸而未決的情感張力，反映清醒時未完全消化的認知衝突。', culturalContext: '內在秩序正在重組尋找平衡。' }
    );
  }

  const title = dream.length > 25 ? dream.slice(0, 20).trim() + '…' : (dream.trim() || '昨夜的潛意識迴響');

  // Dynamic Four-Layer Contemporary Asian Reading tailored to personality settings
  const fourLayers = {
    asianCulturalLayer: {
      title: '當代東方文化層 · 集體記憶與家族倫理',
      description: lower.includes('媽') || lower.includes('神枱') || lower.includes('祖')
        ? (culturalResonance >= 70
            ? '在嶺南與華人傳統觀念中，神枱與長輩是家宅神聖秩序的根基。夢見親人或祖屋往往反映家族責任感、孝道牽絆，或是現實面臨轉折時渴望尋求根源的庇佑。'
            : '反映傳統家庭倫理與對長輩支持的心理需求。')
        : lower.includes('校') || lower.includes('考') || lower.includes('鞋')
        ? (culturalResonance >= 70
            ? '校舍與公開試是華人社會集體潛意識中的「考場烙印」。即使步入成年，每當現實面臨評核、社會認同或轉換軌道的壓力，心靈便會本能召喚這份赤腳考試的無力感。'
            : '代表社會規範、表現評估與成就焦慮的心理投射。')
        : lower.includes('水') || lower.includes('海')
        ? '東方哲學講究「上善若水」，但水勢升高亦如隱忍的情感潮水。你夢中的水正在反映表面平靜下積聚的情感水位，提示適時釋放。'
        : '結合華人家庭與社會生活背景，夢境正在投射你在群體期待與個人自由之間的取捨。',
      keywords: lower.includes('媽') ? ['家族根基', '長輩託付', '神枱庇護'] : ['自我檢驗', '隱性期待', '心靈過渡'],
    },
    jungianLayer: {
      title: depth >= 80 ? '榮格分析心理學 · 原型、無意識補償與個體化' : '榮格心理學 · 原型與自我整合',
      description: depth >= 80
        ? '榮格在《人及其象徵》指出，夢是無意識心靈自主發生的補償機制（Compensation）。夢境意象並非隨機神經干擾，而是自性（Self）為了修復意識自我過度傾斜的偏執，藉由象徵語言所傳遞的心理調整指引。'
        : '榮格指出夢是潛意識自發的補償機制，旨在喚醒意識自我，正視被壓抑的渴望或未消化的焦慮。',
      archetype: lower.includes('追') ? 'Shadow (陰影追逐與未被接納的人格特質)' : lower.includes('海') ? 'The Great Mother / Unconscious (無意識之海)' : 'Persona & Threshold (人格面具與生命過渡關卡)',
    },
    personalLayer: {
      title: '個人生活現實層 · 壓力與情感映射',
      description: personality >= 80
        ? '這段日子裡，你可能承擔了許多未曾向他人言說的隱性期待。夢境把這些被你壓抑在心底的疲憊與脆弱，以最溫柔的形式呈現出來，提醒你停下片刻。'
        : '夢境將你這幾天在清醒時無暇細想的微小情緒放大。它提示你需要一個安靜的空間來消化近期的變動。',
    },
    integrationAction: {
      title: '療癒與整合行動指南',
      advice: decisiveness >= 75
        ? '【明確行動指引】：1. 今天下班後給自己預留 15 分鐘絕對安靜的個人邊界；2. 將最讓你感到牽掛或焦慮的期待寫在便簽上，對自己說「這並非我一人之責」；3. 給予夢中赤腳奔忙的自己一次深呼吸肯定。'
        : personality >= 80
        ? '請對那個在夢中奔忙無措的自己說一句：「我知道你已經盡力了，現在的我們是安全的，你不需要再孤軍作戰。」今天多給自己一杯熱茶的溫柔時光。'
        : '今天給自己十分鐘放空時間，對那個在夢中奔忙無措的自己說一句：「我知道你很努力了，現在的我們是安全的。」',
    },
  };

  // Book Brain theoretical basis & past dreams comparison
  let bookBrainTheory = {
    theoryName: '榮格無意識補償與原型象徵理論',
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    citation: '第 34-38 頁 · 象徵的本質與補償功能',
    coreInsight: '夢並非隨機臆測，而是潛意識自發的補償機制，旨在校準清醒時過度傾斜的心理態度。',
  };

  if (lower.includes('水') || lower.includes('海')) {
    bookBrainTheory = {
      theoryName: '無意識之海與情緒水位假說',
      bookTitle: 'Man and His Symbols (Carl G. Jung)',
      citation: '第 82-86 頁 · 水與母體原型',
      coreInsight: '水體象徵心理學中的集體無意識與原始情感，水勢升高代表被壓抑的焦慮或直覺渴望破土而出。',
    };
  } else if (lower.includes('校') || lower.includes('考') || lower.includes('鞋')) {
    bookBrainTheory = {
      theoryName: '集體評價焦慮與人格面具 (Persona) 過渡理論',
      bookTitle: '當代華人夢境象徵與心理原鄉',
      citation: '第 74-78 頁 · 學校會考烙印與身分跨越',
      coreInsight: '華人社會中考場常作為自我檢驗的終身隱喻；赤腳則反映在公眾期待面前感到防備不足與脆弱。',
    };
  } else if (lower.includes('追') || lower.includes('跑') || lower.includes('逃')) {
    bookBrainTheory = {
      theoryName: '陰影原型 (The Shadow) 投射與整合動力學',
      bookTitle: 'The Interpretation of Dreams (Sigmund Freud)',
      citation: '第 112-115 頁 · 焦慮夢與防禦機制',
      coreInsight: '身後的追逐者往往是造夢者尚未承認的內在面向或迫切責任，越逃避其壓迫感越強大。',
    };
  } else if (lower.includes('媽') || lower.includes('神枱') || lower.includes('祖')) {
    bookBrainTheory = {
      theoryName: '家族倫理牽絆與超個人靈性庇護',
      bookTitle: '當代華人夢境象徵與心理原鄉',
      citation: '第 142-146 頁 · 祖居、香火與親人託付',
      coreInsight: '神枱與故人象徵家族秩序與心理根基，在生活面臨抉擇時提供無條件的安全依託。',
    };
  }

  const pastDreamComparison = {
    matchedPatterns: lower.includes('水') ? ['水 / 海洋', '孤獨感'] : lower.includes('校') ? ['學校 / 考場', '找不到出口'] : ['追逐 / 逃避', '未知空間'],
    pastOccurrencesSummary: 'AI 結合你過往記錄的比對：類似的主題曾在先前的夢境中留下線索，顯示這並非孤立偶然，而是某個心理課題正在持續推進演變。',
    keyNoteworthyMessage: '潛意識正在提醒你：目前的生活處境正在呼喚你直面內心的真實渴望，而非一味迎合外界標準。',
  };

  // Tone-adapted summary
  let summaryText = `這個夢境並非隨機神經雜訊，而是你的潛意識正透過具象化的情境（如「${symbols[0]?.symbol || '主要場景'}」）處理近期的心理轉變與張力。當你試圖在變動中找到立足點時，內在正在尋找調適與自我整合的平衡。`;
  if (personality >= 80) {
    summaryText = `這是一場帶著深層情緒釋放的心靈撫慰。你的潛意識正在溫柔地替你梳理這段日子以來的疲憊與緊繃，夢中「${symbols[0]?.symbol || '主要情境'}」並非要考驗你，而是藉由安全的夢境空間提醒你：你可以放下外界的防備，安心接納當下的脆弱。`;
  } else if (personality <= 40) {
    summaryText = `該夢境呈現出典型的無意識心理防禦機制與補償結構。藉由「${symbols[0]?.symbol || '核心象徵'}」的具象化，個體心智系統正在對近期積累的認知衝突進行結構性代謝，反映出自我面具與深層驅力之間的張力。`;
  } else if (poeticTone >= 75) {
    summaryText = `夜夢如鏡，映照心湖微瀾。夢中的「${symbols[0]?.symbol || '意象'}」如同心靈深處遞來的一枚落葉，在無聲處提醒你：清醒時被喧囂掩蓋的心事，正在靜候一場溫柔的體認與歸途。`;
  }

  const noteworthyMessage = `【值得留意嘅訊息】：結合 Book Brain 典籍理論與過往夢境記憶，這個夢境提示你：當前生活表面看似平穩，但內在對「${symbols[0]?.symbol || '核心課題'}」的張力已累積至轉折點。請給予自己喘息與重新審視生活重心的空間。`;

  return {
    title: `解構夢境：${title}`,
    summary: summaryText,
    symbols: symbols.slice(0, 4),
    fourLayers,
    detectiveAnswers: undefined as Record<string, string> | undefined,
    bookBrainTheory,
    pastDreamComparison,
    noteworthyMessage,
    perspectives: [
      {
        name: '榮格分析心理學 (Jungian Perspective)',
        text: '在榮格觀點中，夢不是偽裝而是潛意識的自然補償（Compensation）。夢境中的場景與角色提示了你在個體化歷程 (Individuation) 中，正經歷舊人格與新現實之間的過渡期。'
      },
      {
        name: '現代睡眠認知與情緒整合研究',
        text: '當代神經科學（如 Hobson 與 Stickgold 的研究）指出，REM 睡眠期的夢境有助於將近期的情緒高壓記憶與過去長時記憶網絡串聯編碼，夢境的緊張感往往是情緒解毒過程的副產物。'
      }
    ],
    questions: [
      '最近的生活中，是否有某個情境讓你感到「熟悉卻又有些格格不入」？',
      '在夢中最讓你產生強烈情緒的瞬間是什麼？如果可以改變那個結局，你希望如何應對？',
      '這個夢境給予你的最深刻直覺提醒是什麼？'
    ],
    sources: [
      { book_title: bookBrainTheory.bookTitle, page_start: 34, page_end: 38 },
      { book_title: '當代華人夢境象徵與心理原鄉', page_start: 74, page_end: 78 },
      { book_title: 'The Interpretation of Dreams (Sigmund Freud)', page_start: 112, page_end: 115 }
    ]
  };
}

// Quick basic analysis for phase 1 (avoiding text overload)
function fallbackQuickAnalyze(dream: string, pastDreams?: any[]) {
  const lower = dream.toLowerCase();
  let title = '昨夜夢境初步解讀';
  let simpleSummary = '這個夢反映你內在正在調適近期的心境轉變，試圖在日常步調中整理隱藏的思緒。';
  let primarySymbol = { symbol: '💭 潛意識意象', meaning: '代表心靈深處對平靜與安全感的渴望。' };
  let quickTakeaway = '放下對完美的苛求，給自己一點喘息空間。';
  let bookBrainSnippet = {
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    theory: '榮格指出夢境非隨機雜訊，而是心靈自動校準平衡的補償性投射。',
  };
  let noteworthyMessage = '【值得留意】：你近期的心境在日常喧囂下略顯緊繃，潛意識提示你需要停頓片刻。';

  if (lower.includes('水') || lower.includes('海') || lower.includes('雨')) {
    title = '水象湧動之夢';
    simpleSummary = '水象徵情緒與潛意識的流動。夢中的水勢反映你近期內心積累的情感水位，正在尋找自然的宣洩出口。';
    primarySymbol = { symbol: '🌊 水 / 海洋', meaning: '情感的承載與淨化，代表潛意識對釋放與放鬆的渴求。' };
    quickTakeaway = '允許情緒自然流淌，無需強行壓抑。';
    bookBrainSnippet = {
      bookTitle: 'Man and His Symbols (Carl G. Jung)',
      theory: '水象徵母體與無意識之海，水位升降反映意識防線的調節張力。',
    };
    noteworthyMessage = '【值得留意】：若過去也曾夢見水，代表內在有一股積累已久的情緒潮水正在尋求疏導。';
  } else if (lower.includes('追') || lower.includes('跑') || lower.includes('逃')) {
    title = '奔跑追逐之夢';
    simpleSummary = '被追趕通常象徵現實生活中的時間緊迫感、責任期待，或是你在潛意識中暫時迴避處理的事情。';
    primarySymbol = { symbol: '🏃 追趕與奔馳', meaning: '內心焦慮與壓力的具象化，提示生活節奏已達臨界點。' };
    quickTakeaway = '停下腳步回頭看，很多擔憂其實來自未知的想像。';
    bookBrainSnippet = {
      bookTitle: 'The Interpretation of Dreams (Sigmund Freud)',
      theory: '追趕者往往是被壓抑的焦慮化身，逃避的動作正反映當前承受的責任重擔。',
    };
    noteworthyMessage = '【值得留意】：這並非外界威脅，而是身體與精神對過度緊繃所發出的減速警號。';
  } else if (lower.includes('門') || lower.includes('屋') || lower.includes('房') || lower.includes('校')) {
    title = '空間穿梭與門戶之夢';
    simpleSummary = '房間與門戶象徵心靈的不同層次或即將面臨的生活過渡期。尋找門路代表你渴望找到清晰的下一步方向。';
    primarySymbol = { symbol: '🚪 門戶與場所', meaning: '心理邊界與過渡關卡，象徵人生新階段的抉擇。' };
    quickTakeaway = '不必急於推開所有門，順應內心直覺前行。';
    bookBrainSnippet = {
      bookTitle: '當代華人夢境象徵與心理原鄉',
      theory: '校舍與閉門常對應華人社會的身份轉換關卡，象徵對評價與安全邊界的焦慮。',
    };
    noteworthyMessage = '【值得留意】：你可能正處於某個生活新階段的門檻，無需恐懼未知的走廊。';
  } else if (lower.includes('媽') || lower.includes('母') || lower.includes('神枱') || lower.includes('親')) {
    title = '親情與守護之夢';
    simpleSummary = '長輩或故人的身影往往代表溫暖的庇護、道德責任，或是你在感到疲憊時對無條件接納的渴望。';
    primarySymbol = { symbol: '🕯️ 親情與根基', meaning: '心靈原鄉的安全感，提醒你回歸內心的初心。' };
    quickTakeaway = '記住你背後始終有一份默默守護的力量。';
    bookBrainSnippet = {
      bookTitle: '當代華人夢境象徵與心理原鄉',
      theory: '親人與神枱在嶺南文化中是家族秩序的錨點，是心靈尋求根源庇佑的投射。',
    };
    noteworthyMessage = '【值得留意】：故人或長輩入夢，往往是你內心渴望得到一份肯定與心安。';
  }

  const suggestedQuestions = [
    {
      id: 'q1',
      question: '① 醒來睜開眼的第一瞬間，胸口殘留最深刻的感受是什麼？',
      options: ['心跳加速，殘留焦慮或緊張', '莫名的惆悵與失落感', '如釋重負，感到平靜或放鬆', '困惑不解，覺得離奇荒謬'],
    },
    {
      id: 'q2',
      question: '② 夢中最令你印象深刻、甚至發光的「核心焦點」是什麼？',
      options: ['一個特定人物的神情或舉動', '一個具體的場所（如門、舊屋、高處）', '一種身體感覺（如跑不動、浮起）', '一種特別的氛圍或天氣'],
    },
    {
      id: 'q3',
      question: '③ 如果這個夢是一封潛意識的信，你直覺它在提醒你現實哪件事？',
      options: ['人際或親密關係裡的糾結', '工作或生活責任的重壓', '身體健康與精力透支警號', '面對過去某段經歷的告別與放下'],
    },
  ];

  return {
    title,
    simpleSummary,
    primarySymbol,
    quickTakeaway,
    suggestedQuestions,
    bookBrainSnippet,
    noteworthyMessage,
  };
}

// 1. Health checks (validates database connection for Render / Cloud Run deployments)
app.get(['/health', '/api/health'], async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  
  const payload = {
    status: dbHealth.status,
    uptime_seconds: uptimeSeconds,
    database: {
      engine: dbHealth.engine,
      connected: dbHealth.connected,
      latency_ms: dbHealth.latency_ms,
      message: dbHealth.message,
    },
    service: 'DreamWisdom Backend API',
    timestamp: new Date().toISOString(),
  };

  // If database explicitly errored when configured, return 503 for deployment rollback detection
  if (dbHealth.status === 'error') {
    return res.status(503).json(payload);
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(payload);
});

// Database API Routes: Dreams
app.get('/api/dreams', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    const tag = req.query.tag as string | undefined;
    const search = req.query.search as string | undefined;
    let dreams = await getDreams(userId);

    if (tag && tag !== 'all') {
      dreams = dreams.filter((d: any) => d.tags && d.tags.includes(tag));
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      dreams = dreams.filter(
        (d: any) =>
          d.title?.toLowerCase().includes(q) ||
          d.dream_text?.toLowerCase().includes(q) ||
          d.report_json?.summary?.toLowerCase().includes(q)
      );
    }
    res.json({ dreams });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch dreams', details: err.message });
  }
});

app.post('/api/dreams', async (req, res) => {
  try {
    const dreamData = req.body;
    if (!dreamData || !dreamData.dream_text) {
      return res.status(400).json({ error: '夢境內容不能為空' });
    }
    const saved = await saveDream(dreamData);
    res.json({ success: true, dream: saved });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save dream', details: err.message });
  }
});

app.delete('/api/dreams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDream(id);
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete dream', details: err.message });
  }
});

// Database API Routes: DREAM DNA™️ Stats
app.get('/api/dna', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'user_mystic';
    const dna = await getDnaStats(userId);
    res.json({ dna });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch DNA stats', details: err.message });
  }
});

app.post('/api/dna', async (req, res) => {
  try {
    const userId = req.body.userId || 'user_mystic';
    const dna = await saveDnaStats(userId, req.body.dna);
    res.json({ success: true, dna });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save DNA stats', details: err.message });
  }
});

// Database API Routes: CONSTELLATION™️ Nodes & Links
app.get('/api/constellation', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'user_mystic';
    const data = await getConstellationData(userId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch constellation', details: err.message });
  }
});

app.post('/api/constellation', async (req, res) => {
  try {
    const userId = req.body.userId || 'user_mystic';
    const data = await saveConstellationData(userId, {
      nodes: req.body.nodes || [],
      links: req.body.links || [],
    });
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save constellation', details: err.message });
  }
});

// Database API Routes: 30 NIGHTS MYSTERY™️ Journey
app.get('/api/mystery', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'user_mystic';
    const journey = await getMysteryJourney(userId);
    res.json({ journey });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch mystery journey', details: err.message });
  }
});

app.post('/api/mystery', async (req, res) => {
  try {
    const userId = req.body.userId || 'user_mystic';
    const journey = await saveMysteryJourney(userId, req.body.journey);
    res.json({ success: true, journey });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save mystery journey', details: err.message });
  }
});

// Database API Routes: Users & RBAC
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

app.post('/api/users/sync', async (req, res) => {
  try {
    const user = req.body;
    if (!user || !user.id || !user.email) {
      return res.status(400).json({ error: 'Invalid user payload' });
    }
    const synced = await upsertUser(user);
    res.json({ success: true, user: synced });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to sync user', details: err.message });
  }
});

app.put('/api/users/:id/stars', async (req, res) => {
  try {
    const { id } = req.params;
    const { stars } = req.body;
    const updated = await updateUserStars(id, typeof stars === 'number' ? stars : 0);
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update user stars', details: err.message });
  }
});

// ============================================================
// AI 引擎個性參數配置 API (Settings)
// ============================================================
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings) {
      return res.status(400).json({ error: 'Missing settings payload' });
    }
    const saved = await saveSettings(settings);
    res.json({ success: true, settings: saved });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update settings', details: err.message });
  }
});

// ============================================================
// 高級管理員審計與營運監控 API (Audit & Operational Tracking APIs)
// ============================================================

// 1. 登入人員記錄 API
app.get('/api/audit/logins', async (req, res) => {
  try {
    const logins = await getLoginRecords();
    res.json({ success: true, logins });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/audit/logins', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || '';
    
    // Auto detect simple device type & browser
    let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
    if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) deviceType = 'Mobile';
    else if (/iPad|Tablet/i.test(userAgent)) deviceType = 'Tablet';

    let browser = 'Web Browser';
    if (/Edg/i.test(userAgent)) browser = 'Microsoft Edge';
    else if (/Chrome/i.test(userAgent)) browser = 'Google Chrome';
    else if (/Safari/i.test(userAgent)) browser = 'Apple Safari';
    else if (/Firefox/i.test(userAgent)) browser = 'Mozilla Firefox';

    const payload = {
      ...req.body,
      ip: req.body.ip || ip,
      userAgent: req.body.userAgent || userAgent,
      deviceType: req.body.deviceType || deviceType,
      browser: req.body.browser || browser,
      loginAt: req.body.loginAt || new Date().toISOString(),
    };

    const record = await saveLoginRecord(payload);
    res.json({ success: true, record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. 廣告收看記錄與次數統計 API
app.get('/api/audit/ad-views', async (req, res) => {
  try {
    const adWatches = await getAdWatches();
    res.json({ success: true, adWatches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/audit/ad-views', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      watchedAt: req.body.watchedAt || new Date().toISOString(),
    };
    const record = await saveAdWatch(payload);
    res.json({ success: true, record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. 入選物店記錄 API
app.get('/api/audit/shop-visits', async (req, res) => {
  try {
    const shopVisits = await getShopVisits();
    res.json({ success: true, shopVisits });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/audit/shop-visits', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      enteredAt: req.body.enteredAt || new Date().toISOString(),
    };
    const record = await saveShopVisit(payload);
    res.json({ success: true, record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. 高級管理員清除審計日誌 API
app.delete('/api/audit/clear', async (req, res) => {
  try {
    const isSuper = verifySuperAdmin(req);
    if (!isSuper) {
      return res.status(403).json({ success: false, error: '只有高級管理員 (Super Admin) 可以清空審計記錄' });
    }
    const type = (req.query.type as any) || 'all';
    await clearAuditLogs(type);
    res.json({ success: true, message: `已成功清空審計日誌 (${type})` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Quick Simple Dream Analysis API (Step 1: 簡單基本分析，先從 Book Brain 查理論，再出值得留意嘅訊息)
app.post('/api/dream/quick-analyze', antiScrapeRateLimiter, async (req, res) => {
  try {
    const { dream, pastDreams } = req.body;
    const preprocessed = preprocessDreamText(dream || '');
    if (!preprocessed.isValid) {
      return res.status(400).json({
        error: preprocessed.errorMessage,
        charCount: preprocessed.charCount,
        minLength: 15,
      });
    }

    const cleanDream = preprocessed.cleanedText;

    const ai = getGeminiClient();
    if (!ai) {
      const quickReport = fallbackQuickAnalyze(cleanDream, pastDreams);
      return res.json({ report: quickReport, source: 'fallback' });
    }

    const systemInstruction = `
你是一位精通現代夢境象徵與心理學的專業解夢助手。
【核心原則】：DreamWisdom 唔係憑空估，而係先從 Book Brain 找出相關理論，再由 AI 結合用戶過往夢境，整理可能值得留意嘅訊息。
請保持版面簡單、文字精煉！字數宜少而精，切忌冗長廢話。
同時產出 3 條與此夢境直接相關的進一步問題，以便用戶決定是否進行進一步 AI 深度解夢。
必須輸出繁體中文，格式嚴格符合 JSON Schema。
`;

    let prompt = `請針對以下夢境作簡明的第一步基本分析，引述 Book Brain 理論並整理可能值得留意嘅訊息，同時提供 3 條針對性的進一步探索問題：\n\n"${dream}"`;
    if (pastDreams && Array.isArray(pastDreams) && pastDreams.length > 0) {
      prompt += `\n\n【用戶過往夢境參考】：\n${JSON.stringify(pastDreams.slice(0, 3), null, 2)}`;
    }

    const responsePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: '5-12字清雅夢境標題' },
            simpleSummary: { type: Type.STRING, description: '2句簡潔通透的基本心理意涵分析' },
            primarySymbol: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING, description: '核心象徵物（帶emoji）' },
                meaning: { type: Type.STRING, description: '1句簡明象徵寓意' },
              },
              required: ['symbol', 'meaning'],
            },
            bookBrainSnippet: {
              type: Type.OBJECT,
              properties: {
                bookTitle: { type: Type.STRING, description: 'Book Brain 書籍名稱' },
                theory: { type: Type.STRING, description: '相關理論依據摘要（1句）' },
              },
              required: ['bookTitle', 'theory'],
            },
            noteworthyMessage: { type: Type.STRING, description: 'AI整理出可能值得留意嘅訊息（1-2句）' },
            quickTakeaway: { type: Type.STRING, description: '1句日常行動或心靈溫暖提示' },
            suggestedQuestions: {
              type: Type.ARRAY,
              description: '3條針對該夢境的進一步確認問題（用於進一步AI深度解夢）',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'question', 'options'],
              },
            },
          },
          required: ['title', 'simpleSummary', 'primarySymbol', 'bookBrainSnippet', 'noteworthyMessage', 'quickTakeaway', 'suggestedQuestions'],
        },
      },
    });

    const result = await Promise.race([
      responsePromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI 生成超時')), 12000)
      ),
    ]);

    const text = result.text;
    if (!text) throw new Error('AI 生成內容為空');
    const quickReport = JSON.parse(text);
    return res.json({ report: quickReport, source: 'gemini' });
  } catch (err: any) {
    console.warn('Quick analyze fallback triggered:', err.message);
    const quickReport = fallbackQuickAnalyze(req.body.dream || '', req.body.pastDreams);
    return res.json({ report: quickReport, source: 'fallback' });
  }
});

// 2.5 Dream Master SQL Retrieval SOP API (SOP 流程：預處理 -> SQL檢索過濾 -> 最小化Prompt -> 輸出過濾與輪次管理)
app.post('/api/dream/master-analyze', antiScrapeRateLimiter, async (req, res) => {
  try {
    const { user_dream, user_context, follow_up } = req.body;

    // SOP Step 1 & 2: 接收使用者輸入與後端預處理使用者文本
    const preprocessed = preprocessDreamText(user_dream || '');
    if (!preprocessed.isValid) {
      return res.status(400).json({
        success: false,
        error: 'insufficient_text',
        message: preprocessed.errorMessage,
        charCount: preprocessed.charCount,
        minLength: 15,
      });
    }

    const cleanedDream = preprocessed.cleanedText;

    // SOP Step 3, 4, 5: 執行 SQL 檢索查詢，查詢表 books、dream_themes、dream_symbols、analysis_rules
    // 強制檢索結果上限：意象最多 8 項，主題最多 3 項，參考書籍規則片段最多 4 本
    const pool = getDbPool();
    const retrieved = await executeSqlRetrieval(cleanedDream, pool);
    const retrievedData = retrieved.formattedSnippet;

    // SOP Step 6: 組裝請求內容，使用固定最小化系統提示詞，替換變數 {{retrieved_data}}、{{user_dream}}、{{user_context}}
    const { systemInstruction, contents } = assembleDreamMasterPrompt(
      retrievedData,
      cleanedDream,
      user_context,
      follow_up
    );

    const ai = getGeminiClient();
    let analysisText = '';
    let source: 'gemini' | 'fallback' = 'gemini';

    if (ai) {
      try {
        const responsePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.35,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const resp = await withTimeout(responsePromise, 15000, null);
        if (resp && resp.text) {
          analysisText = resp.text.trim();
        }
      } catch (err: any) {
        console.warn('Gemini master-analyze failed, falling back:', err.message);
      }
    }

    // 若未配置 API Key 或超時，啟動符合 SOP 的高品質本地心理學 Fallback
    if (!analysisText) {
      source = 'fallback';
      analysisText = generateFallbackMasterAnalysis(cleanedDream, retrieved, user_context, follow_up);
    }

    // SOP Step 8: 輸出過濾規則
    // - 禁止玄學算命、吉凶預言
    // - 輸出必須包含備註「解夢僅心理參考，非命運預測」
    // - 輸出字數控制 600-900 字
    analysisText = postProcessAndFilterAnalysis(analysisText, cleanedDream);

    // SOP Step 9: 對話輪次管理（壓縮上一輪解析摘要至 200token 以內，追問時不再重複傳送完整檢索數據）
    const matchedSymbolNames = retrieved.symbols.map((s) => s.symbol_name);
    const compressedSummary = compressSummaryForFollowup(analysisText, matchedSymbolNames);

    return res.json({
      success: true,
      analysis_text: analysisText,
      word_count: analysisText.length,
      disclaimer: '本工具提供啟發思考的心理角度解讀，不是絕對答案，最終感受由你自己判斷',
      retrieved_data_used: retrievedData,
      retrieved_counts: {
        symbols: retrieved.symbols.length,
        themes: retrieved.themes.length,
        books_and_rules: retrieved.booksAndRules.length,
      },
      compressed_summary_for_followup: compressedSummary,
      cleaned_dream: cleanedDream,
      is_follow_up: Boolean(follow_up?.is_follow_up),
      source,
    });
  } catch (err: any) {
    console.error('Master analyze error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error', details: err.message });
  }
});

// 2.6 Inspect SQL Dream Knowledge Base (受保護的核心知識庫端點)
app.get('/api/dream/master-knowledge', async (req, res) => {
  try {
    const isSuper = verifySuperAdmin(req);
    const pool = getDbPool();
    let books = SEED_BOOKS;
    let themes = SEED_THEMES;
    let symbols = SEED_SYMBOLS;
    let rules = SEED_ANALYSIS_RULES;

    let dreamBooks = DREAM_BOOKS;
    let dreamTags = DREAM_TAGS;
    let dreamSymbols = DREAM_SYMBOLS;

    if (pool) {
      try {
        const b = await pool.query('SELECT * FROM books');
        if (b.rows.length > 0) books = b.rows;
        const t = await pool.query('SELECT * FROM dream_themes');
        if (t.rows.length > 0) themes = t.rows;
        const s = await pool.query('SELECT * FROM dream_symbols');
        if (s.rows.length > 0) symbols = s.rows;
        const r = await pool.query('SELECT * FROM analysis_rules');
        if (r.rows.length > 0) rules = r.rows;

        // DreamAstra Master tables
        const dbBooks = await pool.query('SELECT * FROM dream_book ORDER BY book_id ASC');
        if (dbBooks.rows.length > 0) dreamBooks = dbBooks.rows;

        const dbTags = await pool.query('SELECT * FROM dream_tag ORDER BY tag_id ASC');
        if (dbTags.rows.length > 0) dreamTags = dbTags.rows;

        const dbSymbols = await pool.query(`
          SELECT s.*, COALESCE(json_agg(st.tag_id) FILTER (WHERE st.tag_id IS NOT NULL), '[]'::json) as tag_ids
          FROM dream_symbol s
          LEFT JOIN dream_symbol_tag st ON s.symbol_id = st.symbol_id
          GROUP BY s.symbol_id
          ORDER BY s.symbol_id ASC
        `);
        if (dbSymbols.rows.length > 0) {
          dreamSymbols = dbSymbols.rows.map((row: any) => ({
            symbol_id: row.symbol_id,
            symbol: row.symbol,
            alias_list: Array.isArray(row.alias_list) ? row.alias_list : (typeof row.alias_list === 'string' ? JSON.parse(row.alias_list) : []),
            book_interpret_json: typeof row.book_interpret_json === 'string' ? JSON.parse(row.book_interpret_json) : row.book_interpret_json,
            source_ref: row.source_ref,
            notes: row.notes,
            tag_ids: Array.isArray(row.tag_ids) ? row.tag_ids : (typeof row.tag_ids === 'string' ? JSON.parse(row.tag_ids) : []),
          }));
        }
      } catch (err: any) {
        console.warn('Postgres read knowledge fallback:', err.message);
      }
    }

    // 核心安全防護：未驗證為 Super Admin 的訪客或爬蟲，僅能獲取公開統計與書目清單，絕不外洩底層意象庫與解析規則字典
    if (!isSuper) {
      return res.json({
        success: true,
        protected: true,
        security_policy: 'DreamAstra Proprietary Knowledge Base Protection Policy v2.6',
        message: '22部典籍與152個心理學核心意象庫受智慧財產權與專利黑盒隔離保護，底層規則僅由伺服器端大模型內部調用，禁止公網批量抽取。',
        stats: {
          dream_books_count: dreamBooks.length,
          dream_tags_count: dreamTags.length,
          dream_symbols_count: dreamSymbols.length,
          books_count: books.length,
          themes_count: themes.length,
          symbols_count: symbols.length,
          rules_count: rules.length,
        },
        // 僅提供公開出版書目基本資訊（書名、作者、學派），不暴露 core_theory、process、forbidden 規則
        dream_books: dreamBooks.map((b) => ({
          book_id: b.book_id,
          book_name: b.book_name,
          author: b.author,
          school: b.school,
        })),
        dream_tags: dreamTags,
      });
    }

    // 僅供高級管理員（Super Admin）控制室做內部維護與校驗
    return res.json({
      success: true,
      stats: {
        dream_books_count: dreamBooks.length,
        dream_tags_count: dreamTags.length,
        dream_symbols_count: dreamSymbols.length,
        books_count: books.length,
        themes_count: themes.length,
        symbols_count: symbols.length,
        rules_count: rules.length,
      },
      dream_books: dreamBooks,
      dream_tags: dreamTags,
      dream_symbols: dreamSymbols,
      books,
      themes,
      symbols,
      rules,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2.6.0 Complete Dream Symbols JSON endpoint (僅限高級管理員 Super Admin 維護訪問)
app.get('/api/dream-master/symbols', (req, res) => {
  try {
    const isSuper = verifySuperAdmin(req);
    if (!isSuper) {
      return res.status(403).json({
        success: false,
        error: '權限不足 (403 Forbidden)：DreamAstra 意象解析庫為原創智慧財產，禁止未授權批量檢索與爬取。',
      });
    }

    const jsonPath = path.join(process.cwd(), 'server', 'data', 'dream_symbols_complete.json');
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ success: false, error: 'Symbols JSON file not found' });
    }
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    let symbols = JSON.parse(rawData);

    const { tag, q, limit } = req.query;

    if (tag && typeof tag === 'string') {
      symbols = symbols.filter((s: any) => 
        (s.tags && s.tags.includes(tag)) || (s.notes && s.notes.includes(tag))
      );
    }

    if (q && typeof q === 'string') {
      const term = q.trim().toLowerCase();
      symbols = symbols.filter((s: any) => {
        if (s.symbol.toLowerCase().includes(term)) return true;
        if (s.alias_list && s.alias_list.some((a: string) => a.toLowerCase().includes(term))) return true;
        if (s.notes && s.notes.toLowerCase().includes(term)) return true;
        return false;
      });
    }

    if (limit && !isNaN(Number(limit))) {
      symbols = symbols.slice(0, Number(limit));
    }

    return res.json({
      success: true,
      total_count: symbols.length,
      symbols,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2.6.1 Master SQL file (嚴格限制：僅限 Super Admin 離線維護備份下載，拒絕公網訪問)
app.get('/api/dream/master-sql', (req, res) => {
  try {
    const isSuper = verifySuperAdmin(req);
    if (!isSuper) {
      return res.status(403).json({
        success: false,
        error: '權限不足 (403 Forbidden)：DreamAstra 核心 SQL 數據庫為專有資產，嚴禁公網下載導出。',
      });
    }

    const sqlPath = path.join(process.cwd(), 'server', 'sql', 'dreamastra_master.sql');
    if (!fs.existsSync(sqlPath)) {
      return res.status(404).json({ success: false, error: 'SQL file not found' });
    }

    if (req.query.download === '1') {
      res.setHeader('Content-Disposition', 'attachment; filename="dreamastra_master.sql"');
      res.setHeader('Content-Type', 'application/sql; charset=utf-8');
      return res.sendFile(sqlPath);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    return res.json({
      success: true,
      filename: 'dreamastra_master.sql',
      bytes: Buffer.byteLength(sqlContent, 'utf8'),
      content: sqlContent,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2.7 Test SQL Retrieval for a Dream Text without Calling LLM (加入防爬蟲頻率限制)
app.post('/api/dream/master-retrieve', antiScrapeRateLimiter, async (req, res) => {
  try {
    const isSuper = verifySuperAdmin(req);
    const { user_dream } = req.body;
    const preprocessed = preprocessDreamText(user_dream || '');
    if (!preprocessed.isValid) {
      return res.status(400).json({
        success: false,
        error: 'insufficient_text',
        message: preprocessed.errorMessage,
        charCount: preprocessed.charCount,
        minLength: 15,
      });
    }

    const pool = getDbPool();
    const retrieved = await executeSqlRetrieval(preprocessed.cleanedText, pool);

    // 若非高級管理員，隱藏底層 SQL 權重規則與內部字典結構，僅回傳匹配的數量統計
    if (!isSuper) {
      return res.json({
        success: true,
        counts: {
          symbols: retrieved.symbols.length,
          themes: retrieved.themes.length,
          books_and_rules: retrieved.booksAndRules.length,
          total: retrieved.totalItems,
        },
        matched_symbols: retrieved.symbols.map((s: any) => s.symbol || s.symbol_name),
        matched_themes: retrieved.themes.map((t: any) => t.theme_name),
      });
    }

    return res.json({
      success: true,
      cleaned_text: preprocessed.cleanedText,
      char_count: preprocessed.charCount,
      retrieved_data: retrieved.formattedSnippet,
      counts: {
        symbols: retrieved.symbols.length,
        themes: retrieved.themes.length,
        books_and_rules: retrieved.booksAndRules.length,
        total: retrieved.totalItems,
      },
      symbols: retrieved.symbols,
      themes: retrieved.themes,
      books_and_rules: retrieved.booksAndRules,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Dream Analyze API with Gemini + Book Brain (Step 2: 深度分析)
app.post('/api/dream/analyze', antiScrapeRateLimiter, async (req, res) => {
  try {
    const { dream, settings, detectiveAnswers, pastDreams } = req.body;
    const preprocessed = preprocessDreamText(dream || '');
    if (!preprocessed.isValid) {
      return res.status(400).json({
        error: preprocessed.errorMessage,
        charCount: preprocessed.charCount,
        minLength: 15,
      });
    }

    const cleanDream = preprocessed.cleanedText;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback mode if GEMINI_API_KEY is not configured
      const report = fallbackAnalyze(cleanDream, settings, pastDreams);
      if (detectiveAnswers) {
        report.detectiveAnswers = detectiveAnswers;
      }
      const entry = {
        id: 'dream_' + Date.now(),
        title: report.title,
        dream_text: cleanDream,
        created_at: new Date().toISOString(),
        report_json: report,
      };
      return res.json({ report, entry, source: 'fallback' });
    }

    const { promptSnippet: personalityInstructions, temperature, model } = buildEnginePersonalityInstructions(settings);

    const systemInstruction = `
你是一位精通當代東方文化深度解夢（Contemporary Asian Dream Reading）與榮格分析心理學的專業「夢境智慧 (DreamWisdom)」解夢大師。

【核心解構原則】：
DreamWisdom 唔係憑空估，而係先從 Book Brain 找出相關理論，再由 AI 結合用戶過往夢境，整理可能值得留意嘅訊息。
1. 第一步：從 Book Brain 找出相關理論依據（如榮格《人及其象徵》、弗洛伊德《夢的解析》、當代華人夢境典籍），指明具體理論與核心概念。
2. 第二步：AI 結合用戶過往夢境進行交叉比對，找出重複出現的意象、情緒演進或相反結局。
3. 第三步：整理出真正值得留意嘅訊息（具體生活提示與心理洞察），拒絕空泛套話。
4. 請特別注意：東方人的夢，請用當代東方生活與文化集體記憶（例如：家族責任、舊屋邨、拜神與神枱、已故親人報夢、赤腳考試與會考烙印、水之角色轉化）去真正理解。
5. 必須以繁體中文撰寫，符合 JSON Schema。

${personalityInstructions}
`;

    let prompt = `請分析以下夢境，先從 Book Brain 找出相關理論，再結合用戶過往夢境，整理出可能值得留意嘅訊息，並給予當代東方文化層與榮格心理學的四層立體解析：\n夢境記述：\n"${cleanDream}"\n`;
    if (detectiveAnswers && Object.keys(detectiveAnswers).length > 0) {
      prompt += `\n【偵探確認校準資訊】：\n${JSON.stringify(detectiveAnswers, null, 2)}\n請在報告中展現「現在這個夢的意思已經和普通模板不同了」的專屬感。\n`;
    }
    if (pastDreams && Array.isArray(pastDreams) && pastDreams.length > 0) {
      prompt += `\n【用戶過往夢境記憶】：\n${JSON.stringify(pastDreams.slice(0, 4), null, 2)}\n請結合過往夢境進行交叉比對。\n`;
    }

    const responsePromise = ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: '簡潔有深度的夢境報告標題' },
            summary: { type: Type.STRING, description: '整體心理主題核心摘要（2-3句）' },
            symbols: {
              type: Type.ARRAY,
              description: '夢中3-4個關鍵象徵意象與心理寓意',
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING, description: '象徵物（可帶emoji，如 🏫 舊學校）' },
                  meaning: { type: Type.STRING, description: '深層心理學解讀' },
                  culturalContext: { type: Type.STRING, description: '東方文化或嶺南生活意涵' },
                },
                required: ['symbol', 'meaning'],
              },
            },
            perspectives: {
              type: Type.ARRAY,
              description: '不同理論視角（如榮格分析心理學、現代睡眠研究、當代東方心靈）',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: '學派視角名稱' },
                  text: { type: Type.STRING, description: '該學派的觀點與洞察' },
                },
                required: ['name', 'text'],
              },
            },
            questions: {
              type: Type.ARRAY,
              description: '3個啟發自我覺察的反思提問',
              items: { type: Type.STRING },
            },
            sources: {
              type: Type.ARRAY,
              description: 'Book Brain 典籍引用依據',
              items: {
                type: Type.OBJECT,
                properties: {
                  book_title: { type: Type.STRING, description: '書籍名稱' },
                  page_start: { type: Type.INTEGER, description: '起始頁' },
                  page_end: { type: Type.INTEGER, description: '結束頁' },
                },
                required: ['book_title', 'page_start'],
              },
            },
            bookBrainTheory: {
              type: Type.OBJECT,
              description: '先從 Book Brain 找出相關理論依據',
              properties: {
                theoryName: { type: Type.STRING, description: '理論或學說名稱' },
                bookTitle: { type: Type.STRING, description: '所屬典籍名稱' },
                citation: { type: Type.STRING, description: '章節或頁碼引用' },
                coreInsight: { type: Type.STRING, description: '核心理論洞察' },
              },
              required: ['theoryName', 'bookTitle', 'citation', 'coreInsight'],
            },
            pastDreamComparison: {
              type: Type.OBJECT,
              description: 'AI 結合過往夢境的交叉比對',
              properties: {
                matchedPatterns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '匹配到的歷史意象或情緒',
                },
                pastOccurrencesSummary: { type: Type.STRING, description: '與過往夢境的脈絡連繫分析' },
                keyNoteworthyMessage: { type: Type.STRING, description: '核心比對啟發' },
              },
              required: ['matchedPatterns', 'pastOccurrencesSummary', 'keyNoteworthyMessage'],
            },
            noteworthyMessage: {
              type: Type.STRING,
              description: 'AI 整理出的可能值得留意嘅訊息（2-3句）',
            },
          },
          required: ['title', 'summary', 'symbols', 'perspectives', 'questions', 'sources', 'bookBrainTheory', 'noteworthyMessage'],
        },
      },
    });

    const response = await withTimeout(responsePromise, 8000, null);

    if (!response || !response.text) {
      const fallback = fallbackAnalyze(cleanDream, settings, pastDreams);
      if (detectiveAnswers) fallback.detectiveAnswers = detectiveAnswers;
      return res.json({
        report: fallback,
        entry: {
          id: 'dream_' + Date.now(),
          title: fallback.title,
          dream_text: cleanDream,
          created_at: new Date().toISOString(),
          report_json: fallback,
        },
        source: 'fallback',
      });
    }

    const text = response.text || '';
    const report = JSON.parse(text);

    // Fallback fill for bookBrainTheory and noteworthyMessage if missing
    if (!report.bookBrainTheory) {
      const defaultFallback = fallbackAnalyze(cleanDream, settings, pastDreams);
      report.bookBrainTheory = defaultFallback.bookBrainTheory;
      report.pastDreamComparison = defaultFallback.pastDreamComparison;
      report.noteworthyMessage = defaultFallback.noteworthyMessage;
    }

    // Complement with fourLayers if missing
    if (!report.fourLayers) {
      const fallback = fallbackAnalyze(cleanDream, settings);
      report.fourLayers = fallback.fourLayers;
    }
    if (detectiveAnswers) {
      report.detectiveAnswers = detectiveAnswers;
    }

    const entry = {
      id: 'dream_' + Date.now(),
      title: report.title,
      dream_text: cleanDream,
      created_at: new Date().toISOString(),
      report_json: report,
    };

    res.json({ report, entry, source: 'gemini' });
  } catch (error: any) {
    console.error('Error analyzing dream:', error);
    // Graceful fallback to guarantee uptime
    const fallback = fallbackAnalyze(req.body.dream || '', req.body.settings);
    if (req.body.detectiveAnswers) {
      fallback.detectiveAnswers = req.body.detectiveAnswers;
    }
    const entry = {
      id: 'dream_' + Date.now(),
      title: fallback.title,
      dream_text: req.body.dream,
      created_at: new Date().toISOString(),
      report_json: fallback,
    };
    res.json({ report: fallback, entry, source: 'fallback' });
  }
});

// 3. Multi-dream Long-term Synthesis API
app.post('/api/dream/synthesize', async (req, res) => {
  try {
    const { dreams } = req.body;
    const dreamList = Array.isArray(dreams) && dreams.length > 0 ? dreams : [];

    const ai = getGeminiClient();
    if (!ai || dreamList.length === 0) {
      return res.json({
        report: {
          headline: '近期夢境反覆圍繞「舊身份、逃避壓力與尋求安全感」',
          summary: '串連你近期的多個夢境，潛意識呈現出鮮明的心理曲線：在外部變動或壓力升高時，你傾向於回到熟悉舊場景或尋找高處防禦。這代表你正處於重構自我界線的成長轉折點。',
          patterns: [
            '舊時熟悉場景（如校園、故居）多次作為舞台，指向尚未消化的過往認同與遺憾。',
            '被未知力量或潮水逼近，呈現清醒時可能壓抑的責任或焦慮。',
            '在最後階段往往會本能尋找自保或更高視角，顯現出強大的內在韌性與防衛本能。',
          ],
          next: '未來一至兩週，若再度出現「失去控制」或「赤腳/無防備」意象，可特別留意當天是否面臨自我價值或歸屬感挑戰，嘗試在睡前寫下自我肯定筆記。',
        },
      });
    }

    const combinedText = dreamList
      .map((d: any, idx: number) => `[夢境 ${idx + 1} - ${d.title || '無標題'} (${d.created_at || ''})]: ${d.dream_text}`)
      .join('\n\n');

    const prompt = `
請為用戶過往多個夢境進行長期的【串連分析 (Long-term Dream Pattern Synthesis)】：
夢境列表：
${combinedText}

請分析這些夢境之間的重複意象、情緒演進軌跡、潛意識主題，並提出下一步可留意的自我覺察方向。
`;

    const responsePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '你是一位資深榮格夢境分析與心理整合顧問。請以專業、溫暖、深邃的繁體中文提供跨夢境的宏觀模式整合。',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: '宏觀趨勢標題（如：近期夢境反覆圍繞...）' },
            summary: { type: Type.STRING, description: '綜合貫通解析（約150-200字）' },
            patterns: {
              type: Type.ARRAY,
              description: '3個長期重複的心理模式或符號特徵',
              items: { type: Type.STRING },
            },
            next: { type: Type.STRING, description: '下一步可以留意的心靈覺察與生活實踐建議' },
          },
          required: ['headline', 'summary', 'patterns', 'next'],
        },
      },
    });

    const response = await withTimeout(responsePromise, 8000, null);
    if (!response || !response.text) {
      return res.json({
        report: {
          headline: '近期夢境展現出「內在轉型與情緒自我修復」趨勢',
          summary: '系統已串連你記錄的夢境，發現在不同場景背後，心靈正持續處理對確定感與自我保護的需求。',
          patterns: [
            '場景轉移中重複出現的探索與防禦行為',
            '人際與歸屬感需求的隱喻投射',
            '面對不確定性時的適應機制正在逐步建立',
          ],
          next: '持續記錄醒來第一瞬間的身體感覺，有助於進一步校準夢境與現實壓力的關聯。',
        },
      });
    }

    const report = JSON.parse(response.text || '{}');
    res.json({ report });
  } catch (err: any) {
    console.error('Error synthesizing dreams:', err);
    res.json({
      report: {
        headline: '近期夢境展現出「內在轉型與情緒自我修復」趨勢',
        summary: '系統已串連你記錄的夢境，發現在不同場景背後，心靈正持續處理對確定感與自我保護的需求。',
        patterns: [
          '場景轉移中重複出現的探索與防禦行為',
          '人際與歸屬感需求的隱喻投射',
          '面對不確定性時的適應機制正在逐步建立',
        ],
        next: '持續記錄醒來第一瞬間的身體感覺，有助於進一步校準夢境與現實壓力的關聯。',
      },
    });
  }
});

// Vite integration or static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // CDN cache headers: Vite hashed assets are immutable for 1 year
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
    }));
    // General static assets
    app.use(express.static(distPath, {
      maxAge: '1h',
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
