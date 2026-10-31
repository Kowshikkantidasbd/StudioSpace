'use client';

/**
 * Demo auth: stores the user in localStorage so the Navbar works with no backend.
 * Replace the bodies of login/register/logout with real API calls later;
 * the shape of the context stays the same.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoUrl?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const KEY = 'studiospace_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const save = (u: User | null) => {
    setUser(u);
    try { u ? localStorage.setItem(KEY, JSON.stringify(u)) : localStorage.removeItem(KEY); } catch {}
  };

  const login = async (email: string) => {
    const name = email.split('@')[0] || 'Creator';
    save({ id: crypto.randomUUID(), name: name[0].toUpperCase() + name.slice(1), email, photoUrl: '' });
    return true;
  };

  const register = async (name: string, email: string, _password: string, photoUrl = '') => {
    save({ id: crypto.randomUUID(), name, email, photoUrl });
    return true;
  };

  const logout = async () => save(null);

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}