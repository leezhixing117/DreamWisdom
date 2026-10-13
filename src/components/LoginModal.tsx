import React, { useState } from 'react';
// 改咗呢行，加咗 .js
import { loginUser, registerUser, sendResetCode, resetPassword } from '../services/dreamApi.js';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onCancel, onSuccess }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{type:'success'|'error', text:string}|null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
    newPassword: ''
  });

  const resetState = () => {
    setMsg(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
      newPassword: ''
    });
  };

  const switchMode = (m: Mode) => {
    resetState();
    setMode(m);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === 'login') {
        const res = await loginUser(formData.email, formData.password);
        localStorage.setItem('token', res.token);
        setMsg({type:'success', text:'登入成功'});
        setTimeout(()=>{
          onSuccess();
          onCancel();
        }, 800);
      } else if (mode === 'register') {
        if(formData.password !== formData.confirmPassword){
          setMsg({type:'error', text:'兩次密碼唔一樣'});
          setLoading(false);
          return;
        }
        await registerUser(formData.email, formData.password);
        setMsg({type:'success', text:'註冊成功，請登入'});
        setTimeout(()=>switchMode('login'), 1200);
      } else if (mode === 'forgot') {
        await sendResetCode(formData.email);
        setMsg({type:'success', text:'驗證碼已發送到你電郵'});
        setTimeout(()=>switchMode('reset'), 1200);
      } else if (mode === 'reset') {
        await resetPassword(formData.email, formData.code, formData.newPassword);
        setMsg({type:'success', text:'密碼重設成功，請登入'});
        setTimeout(()=>switchMode('login'), 1200);
      }
    } catch (e: any) {
      setMsg({type:'error', text: e?.message || '操作失敗，請稍後再試'});
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch(mode) {
      case 'login': return '登入';
      case 'register': return '註冊帳號';
      case 'forgot': return '忘記密碼';
      case 'reset': return '重設密碼';
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
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
          <h3 style={{margin:0}}>{getTitle()}</h3>
          <button onClick={onCancel} style={{border:'none', background:'transparent', fontSize:'20px', cursor:'pointer'}}>×</button>
        </div>

        {msg && (
          <div style={{
            padding:'8px 12px', borderRadius:'6px', marginBottom:'16px',
            background: msg.type==='success' ? '#ecfdf3' : '#fef2f2',
            color: msg.type==='success' ? '#065f46' : '#991b1b'
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'12px'}}>
            <label style={{display:'block', marginBottom:'4px'}}>電郵</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{width:'100%', padding:'8px', boxSizing:'border-box'}}
              placeholder="your@email.com"
            />
          </div>

          {mode === 'login' && (
            <div style={{marginBottom:'12px'}}>
              <label style={{display:'block', marginBottom:'4px'}}>密碼</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{width:'100%', padding:'8px', boxSizing:'border-box'}}
                placeholder="密碼"
              />
            </div>
          )}

          {mode === 'register' && (
            <>
              <div style={{marginBottom:'12px'}}>
                <label style={{display:'block', marginBottom:'4px'}}>密碼</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{width:'100%', padding:'8px', boxSizing:'border-box'}}
                  placeholder="設定密碼（最少6位）"
                />
              </div>
              <div style={{marginBottom:'12px'}}>
                <label style={{display:'block', marginBottom:'4px'}}>確認密碼</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{width:'100%', padding:'8px', boxSizing:'border-box'}}
                  placeholder="確認密碼"
                />
              </div>
            </>
          )}

          {mode === 'reset' && (
            <>
              <div style={{marginBottom:'12px'}}>
                <label style={{display:'block', marginBottom:'4px'}}>驗證碼</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  style={{width:'100%', padding:'8px', boxSizing:'border-box'}}
                  placeholder="6位數字驗證碼"
                />
              </div>
              <div style={{marginBottom:'12px'}}>
                <label style={{display:'block', marginBottom:'4px'}}>新密碼</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{width:'100%', padding:'8px', boxSizing:'border-box'}}
                  placeholder="新密碼（最少6位）"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width:'100%', padding:'10px',
              background:'#1677ff', color:'white', border:'none',
              borderRadius:'6px', cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '處理中...' : (
              mode === 'login' ? '登入'
              : mode === 'register' ? '註冊'
              : mode === 'forgot' ? '發送驗證碼'
              : '重設密碼'
            )}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'16px'}}>
          {mode === 'login' && (
            <>
              <button type="button" onClick={()=>switchMode('register')} style={{border:'none', background:'transparent', color:'#1677ff', cursor:'pointer'}}>未有帳號？註冊</button>
              <span style={{margin:'0 6px'}}>|</span>
              <button type="button" onClick={()=>switchMode('forgot')} style={{border:'none', background:'transparent', color:'#1677ff', cursor:'pointer'}}>忘記密碼</button>
            </>
          )}
          {mode === 'register' && (
            <button type="button" onClick={()=>switchMode('login')} style={{border:'none', background:'transparent', color:'#1677ff', cursor:'pointer'}}>已有帳號？登入</button>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <button type="button" onClick={()=>switchMode('login')} style={{border:'none', background:'transparent', color:'#1677ff', cursor:'pointer'}}>返回登入</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
