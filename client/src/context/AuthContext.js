import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Load persisted user on mount ─────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('travelUser');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('travelUser'); }
    }
    setLoading(false);
  }, []);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('travelUser', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  // ─── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    localStorage.setItem('travelUser', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('travelUser');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
