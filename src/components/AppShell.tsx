'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from '../context/ThemeContext.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { useNavigate } from '../lib/useNavigate.ts';

function Shell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar currentPath={pathname || '/'} navigate={navigate} />
      <main className="flex-1 w-full">{children}</main>
      <Footer navigate={navigate} />
      <Toaster theme={theme === 'dark' ? 'dark' : 'light'} position="top-right" richColors closeButton />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Shell>{children}</Shell>
      </AuthProvider>
    </ThemeProvider>
  );
}
