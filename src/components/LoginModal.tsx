import React, { useState, useEffect } from 'react';
import { register, login } from '../services/dreamApi';

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
  availableUsers?: User[];
  bannedRecords?: BannedRecord[];
  onResetPassword?: (email: string, newPassword: string) => boolean;
  onOpenAdminSecurity?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  bannedRecords = [],
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 關閉時重置所有狀態
  useEffect(() => {
    if (!isOpen) {
      setMode('login');
      setEmail('');
      setDisplayName('');
      setPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setBusy(false);
    }
  }, [isOpen]);

  const isBanned = (checkEmail: string) => {
    return bannedRecords.some(b => b.email.toLowerCase() === checkEmail.toLowerCase());
  };

  // 註冊提交（暫時停用，保留代碼日後開放）
  /*
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('請輸入有效的電郵地址');
      return;
    }
    if (isBanned(cleanEmail)) {
      setErrorMessage('此電郵已被限制使用');
      return;
    }
    if (!cleanName) {
      setErrorMessage('請填寫顯示名稱');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('密碼最少6個字符');
      return;
    }

    setBusy(true);
    try {
      const res = await register({
        email: cleanEmail,
        password,
        displayName: cleanName
      });
      setSuccessMessage('註冊成功，已自動登入');
      setTimeout(() => {
        onLogin(res.user);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || '註冊失敗，請稍後再試');
    }
  };
  */

  // 密碼登入
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const cleanEmail = email.trim().toLowerCase();

    if (isBanned(cleanEmail)) {
      setErrorMessage('此電郵已被限制使用');
      return;
    }
    if (!password) {
      setErrorMessage('請輸入密碼');
      return;
    }

    setBusy(true);
    try {
      const res = await login({
        email: cleanEmail,
        password
      });
      setSuccessMessage('登入成功');
      setTimeout(() => {
        onLogin(res.user);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || '登入失敗，請檢查電郵及密碼');
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">帳號登入</h2>

        {/* ✅ 版本B 溫馨提示 */}
        <p style={{color: '#5a5a68', fontSize: '14px', lineHeight: '1.6', marginBottom: '18px'}}>
          💫 溫馨通知：現階段僅開放 Google 帳號登入。<br/>
          如果你的Google帳號登記電郵是 hotmail / yahoo，一樣可以正常登入；純Outlook、Yahoo帳號暫時未能使用，後續會陸續新增其他登入方式。
        </p>

        {/* 註冊Tab按鈕暫時隱藏 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('login')}
            className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
          >登入</button>
          {/*
          <button
            onClick={() => setMode('register')}
            className={`px-3 py-1 rounded ${mode === 'register' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
          >註冊</button>
          */}
        </div>

        {errorMessage && <p className="text-red-500 text-sm mb-3">{errorMessage}</p>}
        {successMessage && <p className="text-emerald-500 text-sm mb-3">{successMessage}</p>}

        <form onSubmit={handlePasswordLogin} className="space-y-3">
          <input
            className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
            type="email"
            placeholder="電郵 Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
            type="password"
            placeholder="密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-sky-600 text-white py-2 rounded disabled:opacity-50"
          >
            {busy ? '處理中...' : '登入'}
          </button>
        </form>

        {/* 之後就喺呢個位置加 Google 登入按鈕 */}

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 border rounded dark:text-white"
        >關閉</button>
      </div>
    </div>
  );
};
