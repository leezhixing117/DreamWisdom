import { useState } from 'react';

export default function DreamDeepAnalyze() {
  // 夢境資料
  const [dreamContent, setDreamContent] = useState("");
  const [simpleResult, setSimpleResult] = useState("");
  const [q1Ans, setQ1Ans] = useState("");
  const [q2Ans, setQ2Ans] = useState("");
  const [q3Ans, setQ3Ans] = useState("");

  const [deepResult, setDeepResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===== 廣告觀看計數（核心業務邏輯）=====
  const [adCountSimple, setAdCountSimple] = useState(0); // 簡單解夢：需要3個廣告
  const [adCountDeep, setAdCountDeep] = useState(0);     // 深度解夢額外：再多3個廣告

  // 解鎖判斷
  const canSimpleAnalyze = adCountSimple >= 3;
  const canDeepAnalyze = canSimpleAnalyze && adCountDeep >= 3;

  // 模擬觀看廣告函數，真實環境就綁定廣告SDK的onAdComplete事件
  const watchAdSimple = () => {
    if(adCountSimple < 3) setAdCountSimple(prev => prev + 1);
  }
  const watchAdDeep = () => {
    if(adCountDeep < 3) setAdCountDeep(prev => prev + 1);
  }

  // 呼叫API
  const fetchDeepAnalysis = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("https://dream-api-gfrb.onrender.com/dream_analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dream_content: dreamContent,
          simple_analysis: simpleResult,
          q1: q1Ans,
          q2: q2Ans,
          q3: q3Ans
        })
      });
      const data = await res.json();
      setDeepResult(data.deep_analysis);
    } catch (err) {
      console.error(err);
      setErrorMsg("深度解夢載入失敗，Render服務可能休眠，請重新點擊嘗試");
    } finally {
      setLoading(false);
    }
  };

  // 前端本地簡單解夢（唔耗token）
  const runSimpleAnalyze = () => {
    if(!canSimpleAnalyze) return;
    // 你之後可以替換成你本地大量知識庫邏輯
    setSimpleResult("呢個夢象徵你渴望自由，想擺脫現有束縛，內心有強烈嘅突破慾望。");
  }

  return (
    <div style={{maxWidth:700, margin:"30px auto", padding:"20px"}}>
      <h3>輸入你的夢境</h3>
      <textarea
        value={dreamContent}
        onChange={(e)=>setDreamContent(e.target.value)}
        style={{width:"100%", height:80}}
        placeholder="描述你的夢境..."
      />

      <div style={{margin:"20px 0"}}>
        <h4>簡單解夢（觀看3個廣告解鎖）</h4>
        <p>已觀看廣告：{adCountSimple}/3</p>
        <button onClick={watchAdSimple} disabled={canSimpleAnalyze}>
          觀看廣告 +1
        </button>
        <button onClick={runSimpleAnalyze} disabled={!canSimpleAnalyze} style={{marginLeft:10}}>
          生成簡單解夢
        </button>
        {simpleResult && <div style={{marginTop:10, padding:10, border:"1px solid #ccc"}}>{simpleResult}</div>}
      </div>

      {canSimpleAnalyze && (
        <div style={{margin:"20px 0"}}>
          <h4>補充3條問題</h4>
          <p>1. 在夢裡，你是旁觀者，還是親身參與夢中事件？</p>
          <input type="text" value={q1Ans} onChange={(e)=>setQ1Ans(e.target.value)} style={{width:"100%"}}/>

          <p style={{marginTop:10}}>2. 夢境結束時，有冇出現一個明確的結局，或是夢是突然中斷？</p>
          <input type="text" value={q2Ans} onChange={(e)=>setQ2Ans(e.target.value)} style={{width:"100%"}}/>

          <p style={{marginTop:10}}>3. 夢裡的環境，感覺熟悉還是完全陌生？</p>
          <input type="text" value={q3Ans} onChange={(e)=>setQ3Ans(e.target.value)} style={{width:"100%"}}/>

          <div style={{marginTop:20}}>
            <h4>深度詳細解夢（額外再睇3個廣告）</h4>
            <p>額外已觀看廣告：{adCountDeep}/3</p>
            <button onClick={watchAdDeep} disabled={adCountDeep >=3}>
              觀看廣告 +1
            </button>

            <button
              onClick={fetchDeepAnalysis}
              disabled={loading || !canDeepAnalyze}
              style={{marginLeft:10, padding:"10px 16px"}}
            >
              {loading ? "正在生成深度解夢..." : "開始深度詳細解夢"}
            </button>
          </div>
        </div>
      )}

      {errorMsg && <p style={{color:"red", marginTop:15}}>{errorMsg}</p>}

      {deepResult && (
        <div style={{marginTop:25, border:"1px solid #ddd", padding:15}}>
          <h4>深度詳細解夢結果</h4>
          <p style={{whiteSpace:"pre-line"}}>{deepResult}</p>
        </div>
      )}
    </div>
  )
}
