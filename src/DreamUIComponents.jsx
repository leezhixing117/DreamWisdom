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
