import React, { useState } from 'react';
import { getDeepDreamAnalysis } from './services/dreamApi';

export default function DreamDeepAnalyze() {
  // 狀態
  const [dreamText, setDreamText] = useState('');
  const [simpleResult, setSimpleResult] = useState('');
  const [step, setStep] = useState(1);
  const [adCount1, setAdCount1] = useState(0); // 簡單解夢 3個廣告
  const [adCount2, setAdCount2] = useState(0); // 深度解夢 額外3個廣告
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [deepResult, setDeepResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 前端本地簡單解夢（唔打API，唔耗token，150字內）
  function generateSimpleDreamAnalysis(dream) {
    if (!dream.trim()) return '';
    return `你夢見：${dream.slice(0,70)}。夢中體驗反映內在潛意識情緒，代表你正面對改變、釋放壓力。請留意夢裡帶出嘅感受，情緒往往比畫面更重要，呢個夢係內心整理感受嘅訊號。`;
  }

  // 睇廣告按鈕 - 第一步（解鎖簡單解夢）
  const handleWatchAd1 = () => {
    const newCount = adCount1 + 1;
    setAdCount1(newCount);
    if (newCount >=3) {
      // 夠3個廣告，生成簡單解夢，跳去第二步（3條問題）
      const simpleText = generateSimpleDreamAnalysis(dreamText);
      setSimpleResult(simpleText);
      setStep(2);
    }
  }

  // 睇廣告按鈕 - 第二步（睇齊3個廣告 → 去到step3，顯示按鈕去觸發API）
  const handleWatchAd2 = () => {
    const newCount = adCount2 +1;
    setAdCount2(newCount);
    if(newCount >=3){
      setStep(3);
    }
  }

  // 點擊按鈕，呼叫後端 Python API
  const handleRunDeepAnalysis = async () => {
    setLoading(true);
    try {
      // payload 完全配合 Postman 測試成功嘅API格式
      const payload = {
        dream_content: dreamText,
        simple_analysis: simpleResult,
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        past_records: ""
      }
      const analysisText = await getDeepDreamAnalysis(payload);
      setDeepResult(analysisText);
    } catch(err) {
      setDeepResult("連接後端API失敗，請稍後再試。");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div style={{maxWidth:"720px", margin:"3rem auto", padding:"0 1rem"}}>
      <h2 style={{textAlign:"center"}}>夢境深度解析</h2>

      {/* Step1：輸入夢境 + 睇3廣告解鎖簡單解夢 */}
      {step ===1 && (
        <div>
          <p>請寫低你的夢境內容：</p>
          <textarea
            value={dreamText}
            onChange={(e)=>setDreamText(e.target.value)}
            placeholder="描述你嘅夢..."
            style={{width:"100%", minHeight:"140px", padding:"12px", borderRadius:"8px"}}
          />
          <div style={{margin:"1rem 0"}}>
            <p>已觀看廣告：{adCount1}/3，睇齊3個就會得到簡單解夢</p>
            <button
              onClick={handleWatchAd1}
              disabled={!dreamText.trim()}
              style={{padding:"8px 16px"}}
            >
              觀看廣告
            </button>
          </div>
        </div>
      )}

      {/* Step2：顯示簡單解夢 + 3條問題，再睇3廣告解鎖深度分析 */}
      {step ===2 && (
        <div>
          <div style={{background:"#f8fafc", padding:"16px", borderRadius:"8px"}}>
            <h4>簡單解夢</h4>
            <p>{simpleResult}</p>
          </div>
          <div style={{margin:"1.5rem 0"}}>
            <h4>請回答以下3條問題：</h4>
            <div style={{marginBottom:"12px"}}>
              <label>1. 在夢裡，你是旁觀者，還是親身參與夢中事件？</label>
              <input
                type="text"
                value={answers.q1}
                onChange={(e)=>setAnswers({...answers, q1:e.target.value})}
                style={{width:"100%", padding:"8px", marginTop:"4px"}}
              />
            </div>
            <div style={{marginBottom:"12px"}}>
              <label>2. 夢境結束時，有冇出現一個明確的結局，或是夢是突然中斷？</label>
              <input
                type="text"
                value={answers.q2}
                onChange={(e)=>setAnswers({...answers, q2:e.target.value})}
                style={{width:"100%", padding:"8px", marginTop:"4px"}}
              />
            </div>
            <div style={{marginBottom:"12px"}}>
              <label>3. 夢裡的環境，感覺熟悉還是完全陌生？</label>
              <input
                type="text"
                value={answers.q3}
                onChange={(e)=>setAnswers({...answers, q3:e.target.value})}
                style={{width:"100%", padding:"8px", marginTop:"4px"}}
              />
            </div>
          </div>
          <div>
            <p>已觀看廣告：{adCount2}/3，睇齊3個就可以使用AI深度詳細解夢</p>
            <button
              onClick={handleWatchAd2}
              disabled={!answers.q1 || !answers.q2 || !answers.q3}
              style={{padding:"8px 16px"}}
            >
              觀看廣告
            </button>
          </div>
        </div>
      )}

      {/* Step3：深度解夢區，按鈕手動觸發API */}
      {step ===3 && (
        <div style={{background:"#f0f7ff", padding:"20px", borderRadius:"10px"}}>
          <h4>深度詳細解夢</h4>
          {!deepResult ? (
            <button
              onClick={handleRunDeepAnalysis}
              disabled={loading}
              style={{padding:"10px 20px"}}
            >
              {loading ? "AI分析中，請稍候..." : "開始深度解析"}
            </button>
          ) : (
            <p>{deepResult}</p>
          )}
        </div>
      )}
    </div>
  )
}
