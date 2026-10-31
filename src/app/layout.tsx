import React from 'react';
import { ThemeProvider, useTheme } from '../context/ThemeContext.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { Toaster } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  navigate?: (path: string) => void;
}

function LayoutContent({ children, currentPath = '/', navigate = () => {} }: LayoutProps) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer navigate={navigate} />
      <Toaster
        theme={theme === 'dark' ? 'dark' : 'light'}
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}

export const RootLayout: React.FC<LayoutProps> = (props) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutContent {...props} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
