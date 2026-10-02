import fs from 'fs';
import path from 'path';
import { DREAM_BOOKS, DREAM_TAGS, DREAM_SYMBOLS } from '../server/dreamAstraData';

function escapeSql(str: string | undefined | null): string {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

let sql = `-- ============================================
-- DreamAstra 完整主庫 SQL
-- 22 本經典文獻 + 7 標籤 + ${DREAM_SYMBOLS.length} 核心意象 + 標籤關聯
-- ============================================

DROP TABLE IF EXISTS dream_symbol_tag;
DROP TABLE IF EXISTS dream_tag;
DROP TABLE IF EXISTS dream_symbol;
DROP TABLE IF EXISTS dream_book;

-- 1. 書籍主表 (包含完整學派、全域權重、核心理論、解讀四步流程、反向禁忌、場景匹配)
CREATE TABLE dream_book (
  book_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  book_name VARCHAR(255) NOT NULL,
  title_zh VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) DEFAULT NULL,
  author VARCHAR(128) DEFAULT NULL,
  school VARCHAR(64) DEFAULT NULL,
  global_weight FLOAT DEFAULT 0.50,
  core_theory TEXT DEFAULT NULL,
  process JSON NOT NULL DEFAULT ('[]'),
  forbidden JSON NOT NULL DEFAULT ('[]'),
  scene_match JSON NOT NULL DEFAULT ('[]'),
  description TEXT DEFAULT NULL,
  UNIQUE KEY uk_book_name (book_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO dream_book (book_id, book_name, title_zh, title_en, author, school, global_weight, core_theory, process, forbidden, scene_match, description) VALUES
${DREAM_BOOKS.map((b) => {
  const proc = escapeSql(JSON.stringify(b.process || []));
  const forb = escapeSql(JSON.stringify(b.forbidden || []));
  const scen = escapeSql(JSON.stringify(b.scene_match || []));
  return `(${b.book_id},'${escapeSql(b.book_name)}','${escapeSql(b.title_zh)}','${escapeSql(b.title_en)}','${escapeSql(b.author)}','${escapeSql(b.school)}',${b.global_weight},'${escapeSql(b.core_theory)}','${proc}','${forb}','${scen}','${escapeSql(b.description)}')`;
}).join(',\n')};

-- 2. 標籤主表
CREATE TABLE dream_tag (
  tag_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(64) NOT NULL,
  tag_desc TEXT DEFAULT NULL,
  UNIQUE KEY uk_tag_name (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO dream_tag (tag_id, tag_name, tag_desc) VALUES
${DREAM_TAGS.map((t) => 
  `(${t.tag_id},'${escapeSql(t.tag_name)}','${escapeSql(t.tag_desc)}')`
).join(',\n')};

-- 3. 意象主表
CREATE TABLE dream_symbol (
  symbol_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(128) NOT NULL,
  alias_list JSON NOT NULL DEFAULT ('[]'),
  book_interpret_json JSON NOT NULL DEFAULT ('{}'),
  source_ref VARCHAR(512) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_symbol (symbol),
  INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO dream_symbol (symbol_id, symbol, alias_list, book_interpret_json, source_ref, notes) VALUES
${DREAM_SYMBOLS.map((s) => {
  const aliasJson = escapeSql(JSON.stringify(s.alias_list));
  const bookJson = escapeSql(JSON.stringify(s.book_interpret_json));
  return `(${s.symbol_id},'${escapeSql(s.symbol)}','${aliasJson}','${bookJson}','${escapeSql(s.source_ref)}','${escapeSql(s.notes)}')`;
}).join(',\n')};

-- 4. 標籤關聯表
CREATE TABLE dream_symbol_tag (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  UNIQUE KEY uk_symbol_tag (symbol_id, tag_id),
  FOREIGN KEY (symbol_id) REFERENCES dream_symbol(symbol_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES dream_tag(tag_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 標籤關聯查詢批次寫入 (基於意象名稱動態關聯)
INSERT INTO dream_symbol_tag(symbol_id, tag_id) SELECT symbol_id, 1 FROM dream_symbol WHERE symbol IN ('祖母','祖父','小偷','流浪漢','女巫','醫生','小孩','敵人','司機','聖者／隱士') ON DUPLICATE KEY IGNORE;
INSERT INTO dream_symbol_tag(symbol_id, tag_id) SELECT symbol_id, 2 FROM dream_symbol WHERE symbol IN ('鹿','貓','孔雀','綿羊','蝙蝠','狼','馬','蛇','鷹','老鼠') ON DUPLICATE KEY IGNORE;
INSERT INTO dream_symbol_tag(symbol_id, tag_id) SELECT symbol_id, 3 FROM dream_symbol WHERE symbol IN ('圖書館','港口','旅館／酒店','墳墓','森林','學校','橋','家／房屋','洞穴','山','地下室','天台','監獄','醫院','沙漠','海洋','河流','超市','車站','教堂') ON DUPLICATE KEY IGNORE;
INSERT INTO dream_symbol_tag(symbol_id, tag_id) SELECT symbol_id, 4 FROM dream_symbol WHERE symbol IN ('眼睛','心臟','牙齒','皮膚','頭','手','腳','血','骨頭','頭髮') ON DUPLICATE KEY IGNORE;
INSERT INTO dream_symbol_tag(symbol_id, tag_id) SELECT symbol_id, 5 FROM dream_symbol WHERE symbol IN ('追逐','尋找東西','溺水','墜落','考試／答不出題','遲到','飛翔','躲藏','殺人','死亡','奔跑','迷路','受傷','結婚','分手','開槍','被綁','斷電','洪水','火災','地震','裸體') ON DUPLICATE KEY IGNORE;
INSERT INTO dream_symbol_tag(symbol_id, tag_id) SELECT symbol_id, 6 FROM dream_symbol WHERE symbol IN ('追逐','溺水','墜落','考試／答不出題','牙齒','洪水','地震') ON DUPLICATE KEY IGNORE;
INSERT INTO dream_symbol_tag(symbol_id, tag_id) SELECT symbol_id, 7 FROM dream_symbol WHERE symbol IN ('鑰匙','鏡子','船','燈籠／燈','衣服','寶石','錢／金錢','門','鐘錶／時鐘','武器','書本','車輛','梯子','窗','鎖','劍','花朵','種子','面具','棺材') ON DUPLICATE KEY IGNORE;
`;

// Generate symbol_tag mappings
const tagMappings: Array<{ symbol_id: number; tag_id: number }> = [];
for (const s of DREAM_SYMBOLS) {
  for (const tid of s.tag_ids) {
    tagMappings.push({ symbol_id: s.symbol_id, tag_id: tid });
  }
}

sql += `INSERT INTO dream_symbol_tag (symbol_id, tag_id) VALUES\n`;
sql += tagMappings.map((m) => `(${m.symbol_id},${m.tag_id})`).join(',\n') + ';\n';

fs.mkdirSync(path.join(process.cwd(), 'server', 'sql'), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });

fs.writeFileSync(path.join(process.cwd(), 'server', 'sql', 'dreamastra_master.sql'), sql, 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'public', 'dreamastra_master.sql'), sql, 'utf8');

console.log(`✅ Generated dreamastra_master.sql successfully with 22 books, 7 tags, ${DREAM_SYMBOLS.length} symbols, and ${tagMappings.length} symbol-tag links.`);
