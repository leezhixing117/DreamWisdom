import React, { useState } from 'react';
import { loginAccount, registerWithCode, sendRegisterCode, sendResetPwdCode, resetPassword } from '../services/dreamApi.js';

type Mode = 'login' | 'register' | 'sendRegisterCode' | 'forgot' | 'resetPwd';

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onCancel, onSuccess }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');

  const resetForm = () => {
    setMsg(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCode('');
  };

  const switchMode = (newMode: Mode) => {
    resetForm();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === 'login') {
        await loginAccount({ email, password });
        setMsg({ type: 'success', text: '登入成功' });
        setTimeout(() => {
          onSuccess();
          onCancel();
        }, 800);
      } else if (mode === 'sendRegisterCode') {
        await sendRegisterCode(email);
        setMsg({ type: 'success', text: '註冊驗證碼已發送到你信箱' });
        setMode('register');
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setMsg({ type: 'error', text: '兩次密碼唔一樣' });
          setLoading(false);
          return;
        }
        await registerWithCode({ email, password, code });
        setMsg({ type: 'success', text: '註冊成功' });
        setTimeout(() => {
          onSuccess();
          onCancel();
        }, 800);
      } else if (mode === 'forgot') {
        await sendResetPwdCode(email);
        setMsg({ type: 'success', text: '重設密碼驗證碼已發送' });
        setMode('resetPwd');
      } else if (mode === 'resetPwd') {
        await resetPassword({ email, code, newPassword: password });
        setMsg({ type: 'success', text: '密碼重設成功，可以登入' });
        setTimeout(() => switchMode('login'), 1200);
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err?.message || '操作失敗，請再試' });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return '會員登入';
      case 'sendRegisterCode': return '註冊 - 輸入電郵';
      case 'register': return '驗證註冊';
      case 'forgot': return '忘記密碼';
      case 'resetPwd': return '重設密碼';
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
    }}>
      <div style={{
        background: 'white', padding: '24px', borderRadius: '12px',
        width: '420px', maxWidth: '90vw'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>{getTitle()}</h3>
          <button onClick={onCancel} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        {msg && (
          <div style={{
            padding: '8px 12px', borderRadius: '6px', marginBottom: '16px',
            background: msg.type === 'success' ? '#ecfdf3' : '#fef2f2',
            color: msg.type === 'success' ? '#065f46' : '#991b1b'
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>電郵</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="your@email.com"
            />
          </div>

          {(mode === 'login' || mode === 'resetPwd') && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>密碼</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                placeholder="輸入密碼"
              />
            </div>
          )}

          {mode === 'register' && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>驗證碼</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="信箱收到嘅6位數字"
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>密碼</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="設定密碼（最少6位）"
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>確認密碼</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="再輸入一次密碼"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '10px',
              background: '#1677ff', color: 'white', border: 'none',
              borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '處理中...' :
              mode === 'login' ? '登入' :
              mode === 'sendRegisterCode' ? '發送註冊驗證碼' :
              mode === 'register' ? '確認註冊' :
              mode === 'forgot' ? '發送重設密碼驗證碼' :
              '確認重設密碼'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => switchMode('sendRegisterCode')} style={{ border: 'none', background: 'transparent', color: '#1677ff', cursor: 'pointer' }}>未有帳號？註冊</button>
              <span style={{ margin: '0 6px' }}>|</span>
              <button type="button" onClick={() => switchMode('forgot')} style={{ border: 'none', background: 'transparent', color: '#1677ff', cursor: 'pointer' }}>忘記密碼</button>
            </>
          )}
          {(mode === 'sendRegisterCode' || mode === 'register') && (
            <button type="button" onClick={() => switchMode('login')} style={{ border: 'none', background: 'transparent', color: '#1677ff', cursor: 'pointer' }}>返回登入</button>
          )}
          {(mode === 'forgot' || mode === 'resetPwd') && (
            <button type="button" onClick={() => switchMode('login')} style={{ border: 'none', background: 'transparent', color: '#1677ff', cursor: 'pointer' }}>返回登入</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
