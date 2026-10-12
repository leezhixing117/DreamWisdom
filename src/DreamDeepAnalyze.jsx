import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { getDeepDreamAnalysis, saveDreamRecord, getDreamHistory } from './services/dreamApi';
import { tagList, promptHints, generateSimpleDreamAnalysis } from './dreamStaticData';
import { TagButton, QuestionForm } from './DreamUIComponents';
import { referralList, referralDefault } from './referralContent';
import { shopProductList, shopDefaultIntro, shopAllLink, shopMoreText } from './shopContent';
import { matchItemsByKeywords } from './dreamMatchHelper';

export default function DreamDeepAnalyze() {
  // ========== 頁面狀態 ==========
  const { userId } = useAuth();
  const [dreamText, setDreamText] = useState('');
  const [dreamType, setDreamType] = useState('普通夢境');
  const [selectedTags, setSelectedTags] = useState([]);
  const [simpleResult, setSimpleResult] = useState('');
  const [step, setStep] = useState(1);
  const [adCount1, setAdCount1] = useState(0);
  const [adCount2, setAdCount2] = useState(0);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [deepResult, setDeepResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 最多返回2個推介
  const matchedReferrals = matchItemsByKeywords(deepResult, referralList, 2);
  const matchedProducts = matchItemsByKeywords(deepResult, shopProductList, 2);

  // 切換意象標籤
  const toggleTag = (tagVal) => {
    if(selectedTags.includes(tagVal)){
      setSelectedTags(selectedTags.filter(item => item !== tagVal));
    }else{
      setSelectedTags([...selectedTags, tagVal]);
    }
  };

  // 更新問卷答案
  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({...prev, [key]: value}))
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

      // 登入用戶自動儲存夢境紀錄
      if(userId) {
        await saveDreamRecord({
          userId: userId,
          dreamContent: dreamText,
          analysisResult: analysisText,
          createAt: new Date()
        });
      }
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
      <h2 style={{textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", color:"#1e293b"}}>
        <span style={{color:"#3b82f6"}}>✦</span>
        記錄今晨夢境片段
      </h2>
      <p style={{textAlign:"right", color:"#475569", fontSize:"14px"}}>以廣東話口語輸入即可 · 建議30–200字</p>

      {/* Step1：夢境輸入UI */}
      {step ===1 && (
        <div style={{background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"24px"}}>
          {/* 記夢引導按鈕 */}
          <div style={{marginBottom:"20px"}}>
            <p style={{margin:"0 0 10px 0", fontWeight:"500", color:"#1e293b"}}>✦ 記夢引導（點擊帶入提示詞）：</p>
            <div style={{display:"flex", flexWrap:"wrap", gap:"10px"}}>
              {promptHints.map((hint,idx)=>(
                <button
                  key={idx}
                  type="button"
                  onClick={()=>setDreamText(p=>p + hint)}
                  style={{padding:"8px 14px", borderRadius:"99px", border:"1px solid #cbd5e1", background:"#f8fafc", color:"#1e293b"}}
                >
                  {hint}
                </button>
              ))}
              <span style={{marginLeft:"auto", fontSize:"13px", color:"#475569"}}>快速建立夢境骨架</span>
            </div>
          </div>

          {/* 夢境類型下拉 + 清空 */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
            <div style={{display:"flex", alignItems:"center", gap:"8px", color:"#1e293b"}}>
              <span>✦ 夢境類型：</span>
              <select value={dreamType} onChange={(e)=>setDreamType(e.target.value)} style={{padding:"6px 10px", borderRadius:"6px", border:"1px solid #cbd5e1", color:"#1e293b"}}>
                <option value="普通夢境">普通夢境</option>
                <option value="清醒夢">清醒夢</option>
                <option value="噩夢">噩夢</option>
                <option value="重複夢">重複夢</option>
              </select>
            </div>
            <button onClick={handleClearAll} style={{background:"transparent", border:"none", color:"#475569", cursor:"pointer"}}>清空重寫</button>
          </div>

          {/* 夢境文字輸入框 */}
          <textarea
            value={dreamText}
            onChange={(e)=>setDreamText(e.target.value)}
            placeholder="描述你嘅夢..."
            style={{width:"100%", minHeight:"160px", padding:"14px", borderRadius:"10px", border:"1px solid #cbd5e1", fontSize:"16px", color:"#1e293b"}}
          />
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"10px 0 20px 0"}}>
            <span style={{color: validTextRange ? "#16a34a" : "#ef4444", fontWeight:500}}>
              {validTextRange ? "✓ 字數符合標準，可隨時點擊下方按鈕提交拆解" : "字數需要維持30–200字"}
            </span>
            <span style={{color:"#334155"}}>已輸入：{charCount} / 30–200字</span>
          </div>

          {/* 補充意象詞標籤 */}
          <div style={{marginBottom:"24px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <p style={{fontWeight:"500", color:"#1e293b"}}>✦ 補充意象詞（點擊帶入，高亮可移除）：</p>
              <span style={{fontSize:"13px", color:"#475569"}}>展開四類分類標籤 ▼</span>
            </div>
            <div style={{display:"flex", flexWrap:"wrap", gap:"8px"}}>
              {tagList.map(tag => (
                <TagButton
                  key={tag.value}
                  tag={tag}
                  selected={selectedTags.includes(tag.value)}
                  onClick={()=>toggleTag(tag.value)}
                />
              ))}
            </div>
          </div>

          {/* 附加星圖解析選項 */}
          <div style={{marginBottom:"24px"}}>
            <label style={{display:"flex", alignItems:"flex-start", gap:"8px"}}>
              <input type="checkbox" />
              <span style={{fontSize:"14px", color:"#334155"}}>附加星圖解析（可選 · 預設關閉）<br/>結合天體相位與榮格共時性視角。手動勾選後納入AI報告章節；付費會員更可進入工作台使用旋轉星盤深入體驗。</span>
            </label>
          </div>

          {/* 廣告按鈕區 */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span style={{fontSize:"14px", color:"#334155"}}>✓ 絕不用於AI訓練 · 保證私隱安全</span>
            <div>
              <p style={{textAlign:"right", margin:"0 0 6px 0", color:"#334155"}}>已觀看廣告：{adCount1}/3，睇齊3個就會得到簡單解夢</p>
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

      {/* Step2：簡單解夢 + 問卷元件QuestionForm */}
      {step ===2 && (
        <div style={{background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"24px"}}>
          <div style={{background:"#f8fafc", padding:"16px", borderRadius:"10px"}}>
            <h4 style={{margin:"0 0 8px 0", color:"#1e293b"}}>簡單解夢</h4>
            <p style={{whiteSpace:"pre-line", color:"#334155"}}>{simpleResult}</p>
          </div>

          <QuestionForm answers={answers} onChange={handleAnswerChange}/>

          <div style={{textAlign:"right"}}>
            <p style={{margin:"0 0 6px 0", color:"#334155"}}>已觀看廣告：{adCount2}/3，睇齊3個就可以使用AI深度詳細解夢</p>
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

      {/* Step3：深度榮格報告區 + 動態推介 */}
      {step ===3 && (
        <div style={{background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"24px"}}>
          <h3 style={{textAlign:"center", color:"#1e293b"}}>DreamWisdom 榮格心理自我反思報告</h3>
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
              <p style={{color:"#475569", marginTop:"12px"}}>會消耗AI Token生成完整榮格心理報告</p>
            </div>
          ) : (
            <>
              <div style={{background:"#f0f7ff", padding:"20px", borderRadius:"10px"}}>
                <p style={{whiteSpace:"pre-line", color:"#1e293b"}}>{deepResult}</p>
              </div>

              {/* 動態轉介推介 */}
              <div style={{marginTop:"32px", padding:"20px", background:"#f8fafc", borderRadius:"12px"}}>
                <h4 style={{color:"#1e293b"}}>根據你今次夢境嘅建議服務</h4>
                {matchedReferrals.length > 0 ? (
                  matchedReferrals.map(item => (
                    <div key={item.id} style={{marginBottom:"16px", borderBottom:"1px solid #e2e8f0", paddingBottom:"12px"}}>
                      <h5 style={{margin:0, color:"#1e293b"}}>{item.title}</h5>
                      <p style={{color:"#334155"}}>{item.description}</p>
                      <a href={item.link}>
                        <button style={{marginTop:"8px", padding:"8px 14px", background:"#2563eb", color:"#fff", border:"none", borderRadius:"8px"}}>
                          {item.buttonText}
                        </button>
                      </a>
                    </div>
                  ))
                ) : (
                  <>
                    <p style={{color:"#334155"}}>{referralDefault.description}</p>
                    <a href={referralDefault.link}>
                      <button style={{marginTop:"8px", padding:"8px 14px", background:"#2563eb", color:"#fff", border:"none", borderRadius:"8px"}}>
                        {referralDefault.buttonText}
                      </button>
                    </a>
                  </>
                )}
              </div>

              {/* 動態水晶產品推介，最多2個 + 前往選物店連結 */}
              {matchedProducts.length > 0 && (
                <div style={{marginTop:"24px", padding:"20px", background:"#f8fafc", borderRadius:"12px"}}>
                  <h4 style={{color:"#1e293b"}}>{shopDefaultIntro}</h4>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:"16px", marginTop:"16px"}}>
                    {matchedProducts.map(product=>(
                      <div key={product.id} style={{border:"1px solid #e2e8f0", borderRadius:"10px", padding:"12px"}}>
                        <h5 style={{margin:"0 0 6px 0", color:"#1e293b"}}>{product.name}</h5>
                        <p style={{fontSize:"13px", color:"#475569"}}>{product.desc}</p>
                        <p style={{fontWeight:"bold", color:"#2563eb"}}>{product.price}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{textAlign:"center", marginTop:"20px"}}>
                    <p style={{color:"#334155", marginBottom:8}}>{shopMoreText}</p>
                    <a href={shopAllLink}>
                      <button style={{padding:"9px 16px", background:"#2563eb", color:"#fff", border:"none", borderRadius:"8px"}}>
                        進入解夢選物店
                      </button>
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
