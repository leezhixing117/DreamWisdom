import React, { useState, useEffect } from 'react';
// 相對路徑：由 components 返上 src 根目錄
import { DreamActionButtons, QuestionForm, TagButton } from '../DreamUIComponents.jsx';
import {
  getDreamAnalysis,
  saveDreamRecord,
  submitDreamQuiz,
  deepDreamAnalyze,
  watchAdGetStars,
  getMe
} from '../services/dreamApi.js';

export default function DreamPage() {
  const [dreamContent, setDreamContent] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [dreamStep, setDreamStep] = useState('input');
  const [userInfo, setUserInfo] = useState({ stars: 0, adWatchCount: 0 });
  const [currentDreamId, setCurrentDreamId] = useState(null);
  const [basicReport, setBasicReport] = useState('');
  const [deepReport, setDeepReport] = useState('');
  const [loading, setLoading] = useState(false);

  // 讀取用戶星星、廣告計數
  const fetchProfile = async () => {
    try {
      const res = await getMe();
      setUserInfo(res.user);
    } catch (err) {
      console.error('載入用戶資料失敗', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 基本解夢
  const handleBasicAnalyze = async () => {
    if (!dreamContent.trim()) return alert('請輸入你的夢境內容');
    setLoading(true);
    try {
      const res = await getDreamAnalysis({ dreamContent });
      setBasicReport(res.report);
      const saveRes = await saveDreamRecord({ dreamContent, basicReport: res.report });
      setCurrentDreamId(saveRes._id);
      setDreamStep('basicDone');
      fetchProfile();
    } catch (err) {
      alert(err.message || '基本解夢失敗');
    } finally {
      setLoading(false);
    }
  };

  // 問卷內容更新
  const handleQuizChange = (key, value) => {
    setQuizAnswers(prev => ({ ...prev, [key]: value }));
  };

  // 提交3條問題
  const handleSubmitQuiz = async () => {
    if (!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3) {
      return alert('請填妥全部3條問題');
    }
    setLoading(true);
    try {
      await submitDreamQuiz({ dreamId: currentDreamId, answers: quizAnswers });
      setDreamStep('quizDone');
    } catch (err) {
      alert(err.message || '提交問卷失敗');
    } finally {
      setLoading(false);
    }
  };

  // 深度解夢
  const handleDeepAnalyze = async () => {
    setLoading(true);
    try {
      const res = await deepDreamAnalyze({
        dreamId: currentDreamId,
        dreamContent,
        quizAnswers
      });
      setDeepReport(res.deepReport);
      fetchProfile();
    } catch (err) {
      alert(err.message || '深度解夢失敗');
    } finally {
      setLoading(false);
    }
  };

  // 觀看廣告領星星
  const handleWatchAd = async () => {
    setLoading(true);
    try {
      await watchAdGetStars();
      fetchProfile();
    } catch (err) {
      alert(err.message || '觀看廣告獎星失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 16px' }}>
      <h2 style={{ textAlign: 'center', color: '#1e293b' }}>夢境解讀</h2>

      {dreamStep === 'input' && (
        <div style={{ marginTop: '20px' }}>
          <textarea
            value={dreamContent}
            onChange={(e) => setDreamContent(e.target.value)}
            placeholder="請詳細描述你的夢境..."
            rows={6}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>
      )}

      {dreamStep === 'basicDone' && (
        <div style={{ marginTop: '20px' }}>
          <h4>初步解夢報告</h4>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
            {basicReport}
          </div>
          <QuestionForm answers={quizAnswers} onChange={handleQuizChange} />
          <button
            onClick={handleSubmitQuiz}
            disabled={loading}
            style={{ width: '100%', padding: '14px', marginTop: '10px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none' }}
          >
            提交問卷，開啟深度解讀
          </button>
        </div>
      )}

      {dreamStep === 'quizDone' && basicReport && (
        <div style={{ marginTop: '20px' }}>
          <h4>初步解夢報告</h4>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
            {basicReport}
          </div>
          {deepReport && (
            <>
              <h4 style={{ marginTop: '16px' }}>✨深度AI解讀報告</h4>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px' }}>
                {deepReport}
              </div>
            </>
          )}
        </div>
      )}

      <DreamActionButtons
        userInfo={userInfo}
        dreamStep={dreamStep}
        onBasicAnalyze={handleBasicAnalyze}
        onDeepAnalyze={handleDeepAnalyze}
        onWatchAd={handleWatchAd}
      />

      {loading && <p style={{ textAlign: 'center', marginTop: '12px' }}>處理中...</p>}
    </div>
  );
}
