# DreamWisdom 3頁正式上線前端與 API 部署手冊

本目錄包含 DreamWisdom 獨立完整 3 頁前端（首頁、解夢報告頁、解夢選物店），內嵌 CSS / JS 與 CDN，可直接部署於任何靜態伺服器（Netlify / Vercel / Nginx）或配合 Node.js / Express 後端正式上線。

---

## 📁 檔案結構說明

| 檔案名稱 | 頁面定位 | 核心功能與商業規則 |
| :--- | :--- | :--- |
| `index.html` (或 `home.html`) | **頁1｜首頁** | 專為香港廣東話設計嘅夢境宇宙。首屏記夢輸入框、可折疊記夢引導、意象標籤快捷填入、三步驟解析、DREAM DNA / 星圖解析 / 30 晚潛意識檔案卡片、可折疊香港心理支援熱線、FAQ 手風琴。<br>**商業規則：首頁嚴禁出現商品。** |
| `report.html` | **頁2｜解夢報告頁** | 展示用戶夢境原文、AI 主題摘要、榮格原型意象拆解、給清醒自我的三道反思題、全站免責。報告渲染完畢後**懶加載**推薦 2-3 件商品，附帶「身心靈輔助非醫療」醒目說明與選物店按鈕。支援後端動態注入 `window.__DREAM_THEME__`。 |
| `shop.html` | **頁3｜解夢選物店** | 選物店為主要變現入口。Banner + 商店免責宣告、精選儀式套裝區、分類橫向標籤（200ms 防抖）、商品網格（桌面 3 欄 / 平板 2 欄 / 手機 1 欄，每頁 12 件支援分頁）、商品詳情 Modal、記憶體購物車抽屜。右下角隱藏管理員入口（需 HttpOnly Cookie 鑑權，提供分類增刪改與二次確認）。 |
| `api.js` | **通用 API 模組** | 封裝所有 API 請求（`loadShopBootstrap`, `loadProducts`, `loadCategories`, `createCategory`, `updateCategory`, `removeCategory`, `loadRecommendProducts`）。實作 5 秒記憶體快取、200ms 防抖、403 鑑權失敗攔截、記憶體購物車管理。<br>**完全移除 localStorage，前端不持久存業務數據。** |

---

## 🎨 視覺強制規範

1. **嚴禁任何紫色**：
   - 主色：`#4A47A3`（深天體靛青藍）
   - 輔色：`#8BA690`（尤加利鼠尾草綠）
   - 點綴：`#D97706`（溫潤琥珀金）
   - 底色：淺冰藍漸變（`linear-gradient(145deg, #f0f6fa 0%, #e6eef8 45%, #f4f8fc 100%)`）
2. **字體階層**：
   - Hero 大標：`Playfair Display`（搭配繁體明體 `Noto Serif TC`）
   - 其餘介面與正文：`Inter`（搭配繁體黑體 `Noto Sans TC`）
   - 桌面正文：17px，手機正文：16px
3. **介面質感**：
   - 半透大圓角毛玻璃卡片（`border-radius: 24px`，`backdrop-filter: blur(16px)`）
   - 柔和上浮動效（`translateY(-3px)`，無閃爍）
   - 按鈕點擊熱區 ≥ 48px，適應手機虛擬鍵盤避讓。

---

## 🛡️ 安全與認證架構 (Cookie 鑑權)

- **完全移除 localStorage / sessionStorage**：前端不留存任何業務敏感或身份憑證數據，徹底阻斷 XSS 竊取 token 之風險。
- **管理員認證**：
  - 登入成功後，後端透過 Set-Cookie 發放：
    ```http
    Set-Cookie: dw_admin_token=<token>; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; Secure
    ```
  - 前端請求皆自帶 `credentials: 'include'`，**不手動設置 Authorization Header**。
  - 寫入接口（`POST/PUT/DELETE /api/categories`）均嚴格校驗 Cookie，若未授權或 Cookie 失效，後端返回 `403 Forbidden`，前端自動彈窗提示「管理員權限不足，請重新登入」。

---

## ⚡ API 清單與效能優化

| 接口 | 方法 | 快取與鑑權策略 | 說明 |
| :--- | :--- | :--- | :--- |
| `/api/categories` | GET | `Cache-Control: public, max-age=60` | 獲取所有分類，前端 5 秒記憶體快取 |
| `/api/categories` | POST | 需 HttpOnly Cookie，`no-store` | 新增分類，成功後清空快取 |
| `/api/categories/:id` | PUT | 需 HttpOnly Cookie，`no-store` | 編輯分類，成功後清空快取 |
| `/api/categories/:id` | DELETE | 需 HttpOnly Cookie，`no-store` | 刪除分類（二次確認），成功後清空快取 |
| `/api/products` | GET | `Cache-Control: public, max-age=60` | 商品分頁與分類篩選（`categoryId`, `page`, `limit=12`） |
| `/api/shop-bootstrap` | GET | `Cache-Control: public, max-age=60` | 合併回傳分類、初始商品與精選套裝 |
| `/api/recommend-products` | GET | `Cache-Control: public, max-age=60` | 解夢報告頁專用，依夢境主題推薦 2-3 件商品 |
| `/api/admin/login` | POST | `no-store` | 驗證管理員密碼並寫入 HttpOnly Cookie |
| `/api/admin/logout` | POST | `no-store` | 清除 HttpOnly Cookie |
| `/api/admin/status` | GET | `no-store` | 檢查當前 Cookie 是否具備管理員權限 |

### 建議之生產環境 Redis 快取配置
後端在處理 `/api/categories`、`/api/shop-bootstrap` 與 `/api/products` 時，可將序列化 JSON 存入 Redis（Key 前綴 `dw:shop:`，TTL 設定 300 秒）。當管理員執行分類新增、修改或刪除時，主動調用 `redis.del('dw:shop:*')` 使快取即時失效。

---

## ⚠️ 全站免責宣告規範

> 「⚠️ 本平台不是心理治療/精神科服務，只屬心理學自我反思工具，不作吉凶預測。重複夢魘有困擾可參考香港心理支援熱線。選物店產品只係身心靈輔助物件，非醫療，不能取代專業心理服務。」
