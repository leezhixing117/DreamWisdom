import React, { useState, useEffect } from 'react';
import { loginUser, sendRegisterCode, verifyRegister } from '../services/dreamApi';

type User = {
  _id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
};

type BannedRecord = {
  email: string;
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  bannedRecords?: BannedRecord[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  bannedRecords = [],
}) => {
  // mode: login / register / verifyCode
  const [mode, setMode] = useState<'login' | 'register' | 'verifyCode'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setMode('login');
      setEmail('');
      setPassword('');
      setCode('');
      setDisplayName('');
      setErrMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  const isBanned = (targetEmail: string) => {
    return bannedRecords.some(b => b.email.toLowerCase() === targetEmail.toLowerCase());
  };

  // 登入
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setSuccessMsg(null);
    const trimEmail = email.trim().toLowerCase();
    if (isBanned(trimEmail)) {
      setErrMsg('此電郵已被限制使用');
      return;
    }
    setBusy(true);
    try {
      const res = await loginUser({ email: trimEmail, password });
      localStorage.setItem('token', res.token);
      onLogin(res.user);
      onClose();
    } catch (err: any) {
      setErrMsg(err.message || '電郵或密碼錯誤');
    } finally {
      setBusy(false);
    }
  };

  // 註冊第一步：發送驗證碼
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setSuccessMsg(null);
    const trimEmail = email.trim().toLowerCase();
    if (isBanned(trimEmail)) {
      setErrMsg('此電郵已被限制使用');
      return;
    }
    if (!displayName.trim()) {
      setErrMsg('請輸入顯示名稱');
      return;
    }
    setBusy(true);
    try {
      await sendRegisterCode({ email: trimEmail, displayName: displayName.trim(), password });
      setSuccessMsg('驗證碼已發送到你的電郵，請查收');
      setMode('verifyCode');
    } catch (err: any) {
      setErrMsg(err.message || '發送驗證碼失敗');
    } finally {
      setBusy(false);
    }
  };

  // 註冊第二步：提交驗證碼完成註冊
  const handleVerifyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setSuccessMsg(null);
    setBusy(true);
    try {
      const res = await verifyRegister({
        email: email.trim().toLowerCase(),
        code,
        displayName: displayName.trim(),
        password
      });
      localStorage.setItem('token', res.token);
      onLogin(res.user);
      onClose();
    } catch (err: any) {
      setErrMsg(err.message || '驗證碼錯誤或已過期');
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'login' ? '帳號登入' : mode === 'register' ? '新用戶註冊' : '輸入驗證碼'}
        </h2>
        <p style={{color:'#5a5a68',fontSize:'14px',marginBottom:'18px'}}>
          💡 溫馨通知：現階段支援電郵註冊登入
        </p>

        {errMsg && <p className="text-red-500 mb-3">{errMsg}</p>}
        {successMsg && <p className="text-emerald-500 mb-3">{successMsg}</p>}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
              type="email"
              placeholder="電郵 Email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
            <input
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
              type="password"
              placeholder="密碼"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            >
              {busy ? '處理中...' : '登入'}
            </button>
            <button
              type="button"
              onClick={()=>setMode('register')}
              className="w-full text-blue-600 py-1"
            >
              未有帳號？按此註冊
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border py-2 rounded mt-1"
            >
              關閉
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleSendCode} className="space-y-3">
            <input
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
              type="text"
              placeholder="顯示名稱"
              value={displayName}
              onChange={e=>setDisplayName(e.target.value)}
              required
            />
            <input
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
              type="email"
              placeholder="電郵 Email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
            <input
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
              type="password"
              placeholder="設定密碼"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            >
              {busy ? '發送中...' : '發送電郵驗證碼'}
            </button>
            <button
              type="button"
              onClick={()=>setMode('login')}
              className="w-full text-blue-600 py-1"
            >
              已有帳號？去登入
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border py-2 rounded mt-1"
            >
              關閉
            </button>
          </form>
        )}

        {mode === 'verifyCode' && (
          <form onSubmit={handleVerifyRegister} className="space-y-3">
            <input
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
              type="text"
              placeholder="輸入6位數驗證碼"
              value={code}
              onChange={e=>setCode(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            >
              {busy ? '驗證中...' : '確認註冊'}
            </button>
            <button
              type="button"
              onClick={()=>setMode('register')}
              className="w-full text-blue-600 py-1"
            >
              重新發送驗證碼
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border py-2 rounded mt-1"
            >
              關閉
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
