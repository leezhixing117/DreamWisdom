import React, { useState } from 'react';
import { getDeepDreamAnalysis } from './services/dreamApi';

export default function DreamDeepAnalyze() {
  // ========== 頁面狀態 ==========
  const [dreamText, setDreamText] = useState('');
  const [dreamType, setDreamType] = useState('普通夢境');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [simpleResult, setSimpleResult] = useState('');
  const [step, setStep] = useState(1);
  const [adCount1, setAdCount1] = useState(0); // 簡單解夢：3個廣告
  const [adCount2, setAdCount2] = useState(0); // 深度解夢：額外3個廣告
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [deepResult, setDeepResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 意象標籤庫
  const tagList = [
    { label: "海洋水流 +", value: "海洋水流" },
    { label: "赤腳無鞋 +", value: "赤腳無鞋" },
    { label: "被人追趕 +", value: "被人追趕" },
    { label: "舊居屋邨 +", value: "舊居屋邨" },
    { label: "家宅神檯 +", value: "家宅神檯" },
    { label: "課室考試 +", value: "課室考試" },
    { label: "緊閉門鎖 +", value: "緊閉門鎖" },
    { label: "高處墜落 +", value: "高處墜落" },
    { label: "脫落牙齒 +", value: "脫落牙齒" },
    { label: "神秘鑰匙 +", value: "神秘鑰匙" },
    { label: "飛翔羽翼 +", value: "飛翔羽翼" },
    { label: "迷宮走廊 +", value: "迷宮走廊" },
  ];

  // 切換意象標籤
  const toggleTag = (tagVal:string) => {
    if(selectedTags.includes(tagVal)){
      setSelectedTags(selectedTags.filter(item => item !== tagVal));
    }else{
      setSelectedTags([...selectedTags, tagVal]);
    }
  };

  // 前端本地簡單解夢（唔呼叫API，唔耗token，控制150字內）
  function generateSimpleDreamAnalysis(dream:string, tags:string[]) {
    if (!dream.trim()) return '';
    const tagStr = tags.length > 0 ? `，附加意象：${tags.join('、')}` : '';
    return `你記錄嘅夢境：${dream.slice(0,80)}。呢個夢反映潛意識嘅內在情緒，代表你正經歷內心轉變，釋放累積壓力。夢中嘅感受比畫面更重要，係心靈整理感受嘅訊號${tagStr}。`;
  }

  // 清空全部輸入內容
  const handleClearAll = () => {
    setDreamText('');
    setDreamType('普通夢境');
    setSelectedTags([]);
  };

  // Step1：觀看廣告，解鎖簡單解夢
  const handleWatchAd1 = () => {
    const newCount = adCount1 + 1;
    setAdCount1(newCount);
    if (newCount >=3) {
      const simpleText = generateSimpleDreamAnalysis(dreamText, selectedTags);
      setSimpleResult(simpleText);
      setStep(2);
    }
  };

  // Step2：觀看廣告，解鎖深度解析按鈕
  const handleWatchAd2 = () => {
    const newCount = adCount2 +1;
    setAdCount2(newCount);
    if(newCount >=3){
      setStep(3);
    }
  };

  // 呼叫後端Python API，生成榮格深度報告
  const handleRunDeepAnalysis = async () => {
    setLoading(true);
    try {
      const payload = {
        dream_content: dreamText,
        simple_analysis: simpleResult,
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        past_records: `夢境類型：${dreamType}，選取意象標籤：${selectedTags.join(',')}`
      }
      const analysisText = await getDeepDreamAnalysis(payload);
      setDeepResult(analysisText);
    } catch(err) {
      setDeepResult("連接後端API失敗，請稍後再試。");
      console.error(err);
    }
    setLoading(false);
  };

  const charCount = dreamText.length;
  const validTextRange = charCount >=30 && charCount <=200;

  return (
    <div style={{maxWidth:"1100px", margin:"2rem auto", padding:"0 1rem"}}>
      <h2 style={{textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px"}}>
        <span style={{color:"#3b82f6"}}>✦</span>
        記錄今晨夢境片段
      </h2>
      <p style={{textAlign:"right", color:"#666", fontSize:"14px"}}>以廣東話口語輸入即可 · 建議30–200字</p>

      {/* Step1：夢境輸入精美UI（完整保留你截圖版面） */}
      {step ===1 && (
        <div style={{background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"24px"}}>
          {/* 記夢引導按鈕 */}
          <div style={{marginBottom:"20px"}}>
            <p style={{margin:"0 0 10px 0", fontWeight:"500"}}>✦ 記夢引導（點擊帶入提示詞）：</p>
            <div style={{display:"flex", flexWrap:"wrap", gap:"10px"}}>
              <button type="button" onClick={()=>setDreamText(p=>p + "有邊啲人物？")} style={{padding:"8px 14px", borderRadius:"99px", border:"1px solid #cbd5e1", background:"#f8fafc"}}>👤 有邊啲人物？</button>
              <button type="button" onClick={()=>setDreamText(p=>p + "場景係邊度？")} style={{padding:"8px 14px", borderRadius:"99px", border:"1px solid #cbd5e1", background:"#f8fafc"}}>📍 場景係邊度？</button>
              <button type="button" onClick={()=>setDreamText(p=>p + "感覺如何？")} style={{padding:"8px 14px", borderRadius:"99px", border:"1px solid #cbd5e1", background:"#f8fafc"}}>☁️ 感覺如何？</button>
              <button type="button" onClick={()=>setDreamText(p=>p + "有特定物件？")} style={{padding:"8px 14px", borderRadius:"99px", border:"1px solid #cbd5e1", background:"#f8fafc"}}>📜 有特定物件？</button>
              <span style={{marginLeft:"auto", fontSize:"13px", color:"#64748b"}}>快速建立夢境骨架</span>
            </div>
          </div>

          {/* 夢境類型下拉 + 清空 */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
            <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
              <span>✦ 夢境類型：</span>
              <select value={dreamType} onChange={(e)=>setDreamType(e.target.value)} style={{padding:"6px 10px", borderRadius:"6px", border:"1px solid #cbd5e1"}}>
                <option value="普通夢境">普通夢境</option>
                <option value="清醒夢">清醒夢</option>
                <option value="噩夢">噩夢</option>
                <option value="重複夢">重複夢</option>
              </select>
            </div>
            <button onClick={handleClearAll} style={{background:"transparent", border:"none", color:"#64748b", cursor:"pointer"}}>清空重寫</button>
          </div>

          {/* 夢境文字輸入框 */}
          <textarea
            value={dreamText}
            onChange={(e)=>setDreamText(e.target.value)}
            placeholder="描述你嘅夢..."
            style={{width:"100%", minHeight:"160px", padding:"14px", borderRadius:"10px", border:"1px solid #cbd5e1", fontSize:"16px"}}
          />
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"10px 0 20px 0"}}>
            <span style={{color: validTextRange ? "#16a34a" : "#ef4444"}}>
              {validTextRange ? "✓ 字數符合標準，可隨時點擊下方按鈕提交拆解" : "字數需要維持30–200字"}
            </span>
            <span>已輸入：{charCount} / 30–200字</span>
          </div>

          {/* 補充意象詞標籤 */}
          <div style={{marginBottom:"24px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <p style={{fontWeight:"500"}}>✦ 補充意象詞（點擊帶入，高亮可移除）：</p>
              <span style={{fontSize:"13px", color:"#64748b"}}>展開四類分類標籤 ▼</span>
            </div>
            <div style={{display:"flex", flexWrap:"wrap", gap:"8px"}}>
              {tagList.map(tag => (
                <button
                  key={tag.value}
                  onClick={()=>toggleTag(tag.value)}
                  style={{
                    padding:"6px 10px",
                    borderRadius:"8px",
                    border:"1px solid #cbd5e1",
                    background: selectedTags.includes(tag.value) ? "#3b82f6" : "#f8fafc",
                    color: selectedTags.includes(tag.value) ? "#fff" : "#222",
                    cursor:"pointer"
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* 附加星圖解析選項 */}
          <div style={{marginBottom:"24px"}}>
            <label style={{display:"flex", alignItems:"flex-start", gap:"8px"}}>
              <input type="checkbox" />
              <span style={{fontSize:"14px", color:"#475569"}}>附加星圖解析（可選 · 預設關閉）<br/>結合天體相位與榮格共時性視角。手動勾選後納入AI報告章節；付費會員更可進入工作台使用旋轉星盤深入體驗。</span>
            </label>
          </div>

          {/* 廣告按鈕區 */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span style={{fontSize:"14px", color:"#475569"}}>✓ 絕不用於AI訓練 · 保證私隱安全</span>
            <div>
              <p style={{textAlign:"right", margin:"0 0 6px 0"}}>已觀看廣告：{adCount1}/3，睇齊3個就會得到簡單解夢</p>
              <button
                onClick={handleWatchAd1}
                disabled={!validTextRange}
                style={{
                  padding:"12px 22px",
                  borderRadius:"10px",
                  border:"none",
                  background: validTextRange ? "#2563eb" : "#94a3b8",
                  color:"white",
                  fontSize:"16px",
                  cursor: validTextRange ? "pointer":"not-allowed"
                }}
              >
                記錄夢境開始分析 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step2：顯示簡單解夢 + 3條問題表單，再睇3廣告解鎖深度分析 */}
      {step ===2 && (
        <div style={{background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"24px"}}>
          <div style={{background:"#f8fafc", padding:"16px", borderRadius:"10px"}}>
            <h4 style={{margin:"0 0 8px 0"}}>簡單解夢</h4>
            <p style={{whiteSpace:"pre-line"}}>{simpleResult}</p>
          </div>

          <div style={{margin:"1.5rem 0"}}>
            <h4 style={{marginBottom:"12px"}}>請回答以下3條問題：</h4>
            <div style={{marginBottom:"12px"}}>
              <label>1. 在夢裡，你是旁觀者，還是親身參與夢中事件？</label>
              <input
                type="text"
                value={answers.q1}
                onChange={(e)=>setAnswers({...answers, q1:e.target.value})}
                style={{width:"100%", padding:"10px", marginTop:"4px", borderRadius:"6px", border:"1px solid #cbd5e1"}}
              />
            </div>
            <div style={{marginBottom:"12px"}}>
              <label>2. 夢境結束時，有冇出現一個明確的結局，或是夢是突然中斷？</label>
              <input
                type="text"
                value={answers.q2}
                onChange={(e)=>setAnswers({...answers, q2:e.target.value})}
                style={{width:"100%", padding:"10px", marginTop:"4px", borderRadius:"6px", border:"1px solid #cbd5e1"}}
              />
            </div>
            <div style={{marginBottom:"12px"}}>
              <label>3. 夢裡的環境，感覺熟悉還是完全陌生？</label>
              <input
                type="text"
                value={answers.q3}
                onChange={(e)=>setAnswers({...answers, q3:e.target.value})}
                style={{width:"100%", padding:"10px", marginTop:"4px", borderRadius:"6px", border:"1px solid #cbd5e1"}}
              />
            </div>
          </div>

          <div style={{textAlign:"right"}}>
            <p style={{margin:"0 0 6px 0"}}>已觀看廣告：{adCount2}/3，睇齊3個就可以使用AI深度詳細解夢</p>
            <button
              onClick={handleWatchAd2}
              disabled={!answers.q1 || !answers.q2 || !answers.q3}
              style={{
                padding:"10px 20px",
                borderRadius:"8px",
                border:"none",
                background: answers.q1 && answers.q2 && answers.q3 ? "#2563eb" : "#94a3b8",
                color:"white",
                cursor: answers.q1 && answers.q2 && answers.q3 ? "pointer":"not-allowed"
              }}
            >
              觀看廣告
            </button>
          </div>
        </div>
      )}

      {/* Step3：深度榮格報告區，點按鈕呼叫API */}
      {step ===3 && (
        <div style={{background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"24px"}}>
          <h3 style={{textAlign:"center"}}>DreamWisdom 榮格心理自我反思報告</h3>
          {!deepResult ? (
            <div style={{textAlign:"center", padding:"2rem"}}>
              <button
                onClick={handleRunDeepAnalysis}
                disabled={loading}
                style={{
                  padding:"14px 26px",
                  borderRadius:"10px",
                  border:"none",
                  background:"#2563eb",
                  color:"white",
                  fontSize:"16px",
                  cursor: loading ? "not-allowed":"pointer"
                }}
              >
                {loading ? "AI分析中，請稍候..." : "開始深度榮格解析"}
              </button>
              <p style={{color:"#64748b", marginTop:"12px"}}>會消耗AI Token生成完整榮格心理報告</p>
            </div>
          ) : (
            <div style={{background:"#f0f7ff", padding:"20px", borderRadius:"10px"}}>
              <p style={{whiteSpace:"pre-line"}}>{deepResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
