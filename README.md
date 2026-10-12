# DreamWisdom 系統架構

```mermaid
flowchart LR
    User[網站訪客 / 會員] --> Frontend[前端 DreamWisdom<br/>Render:DreamofWisdom<br/>dreamofwisdom.com]

    %% 前端呼叫 Auth 會員服務
    Frontend -->|註冊 / 登入 / 忘記密碼 / OAuth| Auth[會員認證服務<br/>DreamofWisdom-Auth Node.js<br/>dreamofwisdom-auth.onrender.com]
    Auth -->|查詢/寫入會員資料| Mongo[(MongoDB Atlas)]
    Auth -->|登入成功 返回 userId| Frontend

    %% 前端呼叫 AI解夢 + 夢境紀錄服務
    Frontend -->|解夢、儲存夢境、讀取夢境歷史| API[AI解夢&夢境紀錄<br/>dream-api Flask<br/>dream-api-gfrb.onrender.com]
    API -->|寫入/查詢夢境紀錄| Mongo

    %% 資料庫 Collection 分離
    subgraph MongoDB Atlas
        C1[users 集合<br/>會員：email、密碼雜湊、userId、星星幣]
        C2[dream_records 集合<br/>夢境紀錄：userId、夢內容、解夢結果、建立時間]
    end
