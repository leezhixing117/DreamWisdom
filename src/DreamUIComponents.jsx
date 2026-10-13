import React from 'react';

// 意象標籤按鈕
export function TagButton({tag, selected, onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding:"6px 10px",
        borderRadius:"8px",
        border:"1px solid #cbd5e1",
        background: selected ? "#3b82f6" : "#f8fafc",
        color: selected ? "#fff" : "#1e293b",
        cursor:"pointer"
      }}
    >
      {tag.label}
    </button>
  )
}

// 三步問題表單元件
export function QuestionForm({answers, onChange}) {
  return (
    <div style={{margin:"1.5rem 0"}}>
      <h4 style={{marginBottom:"12px", color:"#1e293b"}}>請回答以下3條問題：</h4>
      <div style={{marginBottom:"12px"}}>
        <label style={{color:"#1e293b"}}>1. 在夢裡，你是旁觀者，還是親身參與夢中事件？</label>
        <input
          type="text"
          value={answers.q1}
          onChange={(e)=>onChange('q1', e.target.value)}
          style={{width:"100%", padding:"10px", marginTop:"4px", borderRadius:"6px", border:"1px solid #cbd5e1", color:"#1e293b"}}
        />
      </div>
      <div style={{marginBottom:"12px"}}>
        <label style={{color:"#1e293b"}}>2. 夢境結束時，有冇出現一個明確的結局，或是夢是突然中斷？</label>
        <input
          type="text"
          value={answers.q2}
          onChange={(e)=>onChange('q2', e.target.value)}
          style={{width:"100%", padding:"10px", marginTop:"4px", borderRadius:"6px", border:"1px solid #cbd5e1", color:"#1e293b"}}
        />
      </div>
      <div style={{marginBottom:"12px"}}>
        <label style={{color:"#1e293b"}}>3. 夢裡的環境，感覺熟悉還是完全陌生？</label>
        <input
          type="text"
          value={answers.q3}
          onChange={(e)=>onChange('q3', e.target.value)}
          style={{width:"100%", padding:"10px", marginTop:"4px", borderRadius:"6px", border:"1px solid #cbd5e1", color:"#1e293b"}}
        />
      </div>
    </div>
  )
}

// 解夢操作按鈕區域（新加入，包含星星判斷、廣告進度、深度解夢按鈕）
export function DreamActionButtons({
  userInfo,
  dreamStep,
  onBasicAnalyze,
  onDeepAnalyze,
  onWatchAd
}) {
  const { stars = 0, adWatchCount = 0 } = userInfo || {};
  const hasFinishedBasicAndQuiz = dreamStep === "quizDone";
  const enoughBasic = stars >= 3;
  const enoughDeep = stars >= 3;
  const canDeepAnalyze = hasFinishedBasicAndQuiz && enoughDeep;

  return (
    <div style={{marginTop:"20px"}}>
      {!enoughBasic ? (
        <div>
          <p style={{textAlign:"center", color:"#475569"}}>儲星進度：{adWatchCount} / 3（睇3個廣告獲得3星）</p>
          <button
            onClick={onWatchAd}
            style={{
              width:"100%",
              background:"#2277dd",
              color:"white",
              border:"none",
              borderRadius:"999px",
              padding:"20px 40px",
              fontSize:"24px",
              cursor:"pointer"
            }}
          >
            觀看廣告賺星星 →
          </button>
        </div>
      ) : (
        <>
          {dreamStep === "input" && (
            <button
              onClick={onBasicAnalyze}
              style={{
                width:"100%",
                background:"#1688ee",
                color:"white",
                border:"none",
                borderRadius:"999px",
                padding:"20px 40px",
                fontSize:"24px",
                cursor:"pointer"
              }}
            >
              記錄夢境開始分析 →
            </button>
          )}

          {hasFinishedBasicAndQuiz && (
            <div style={{marginTop:"16px"}}>
              {canDeepAnalyze ? (
                <button
                  onClick={onDeepAnalyze}
                  style={{
                    width:"100%",
                    background:"#1b4cf0",
                    color:"white",
                    border:"none",
                    borderRadius:"999px",
                    padding:"20px 40px",
                    fontSize:"24px",
                    cursor:"pointer"
                  }}
                >
                  ✨ 提交拆解夢境 (DreamWisdom AI) →
                </button>
              ) : (
                <div>
                  <p style={{textAlign:"center", color:"#475569"}}>儲星進度：{adWatchCount} / 3</p>
                  <button
                    onClick={onWatchAd}
                    style={{
                      width:"100%",
                      background:"#2277dd",
                      color:"white",
                      border:"none",
                      borderRadius:"999px",
                      padding:"20px 40px",
                      fontSize:"24px",
                      cursor:"pointer"
                    }}
                  >
                    觀看廣告賺星星 →
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
