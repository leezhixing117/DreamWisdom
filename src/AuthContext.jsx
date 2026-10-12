import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 從 localStorage 讀取上次登入資訊
  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem("dream_auth");
    if(saved) {
      try {
        return JSON.parse(saved);
      }catch(e){
        return null;
      }
    }
    return null;
  });

  // 登入成功，存入資料同 localStorage
  const login = (userInfo) => {
    setAuthData(userInfo);
    localStorage.setItem("dream_auth", JSON.stringify(userInfo));
  };

  // 登出，清除狀態同 localStorage
  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("dream_auth");
  };

  // 提取常用變數
  const userId = authData?._id || null;
  const email = authData?.email || null;
  const starCoins = authData?.starCoins || 0;
  const isLogin = !!authData;

  return (
    <AuthContext.Provider value={{
      userId,
      email,
      starCoins,
      isLogin,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// 自訂Hook，組件直接 import 使用
export const useAuth = () => useContext(AuthContext);
