'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, PlusCircle, Layers, Calendar, LogOut, ChevronDown, Menu, X, Heart, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Explore Studios', path: '/studios' },
  { label: 'How It Works', path: '/#how-it-works' },
  { label: 'About Us', path: '/#about-us' },
];

const MENU_ITEMS = [
  { icon: PlusCircle, label: 'Add New Studio', path: '/add-studio', color: 'text-indigo-600 dark:text-indigo-400' },
  { icon: Layers, label: 'My Studio Listings', path: '/my-listings', color: 'text-amber-500 dark:text-amber-400' },
  { icon: Calendar, label: 'My Bookings', path: '/my-bookings', color: 'text-emerald-600 dark:text-emerald-400' },
  { icon: Heart, label: 'Saved Studios (Wishlist)', path: '/saved-studios', color: 'text-red-500' },
];

export function Navbar() {
  const router = useRouter();
  const currentPath = usePathname();
  const navigate = (path: string) => router.push(path);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDropdownOpen(false); setMobileOpen(false); } };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const go = (path: string) => {
    setMobileOpen(false);
    setDropdownOpen(false);
    if (path.startsWith('/#')) {
      const id = path.slice(2);
      if (currentPath !== '/') { navigate('/'); setTimeout(() => scrollTo(id), 150); } else scrollTo(id);
    } else navigate(path);
  };

  const isActive = (path: string) =>
    path === '/' ? currentPath === '/' : path === '/studios' ? currentPath.startsWith('/studios') : false;

  const avatar = user && (user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`);
  const initial = user?.name?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Brand lockup */}
        <button onClick={() => go('/')} aria-label="StudioSpace home" className="flex items-center gap-2.5 text-left rounded-lg focus-visible:outline-2 focus-visible:outline-indigo-500">
          <svg viewBox="0 0 32 32" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" className="w-9 h-9 shrink-0" aria-hidden>
            <circle cx="16" cy="16" r="13" />
            <path d="M16 3l5.5 9.5M27.9 9.5H17M27.9 22.5L22.4 13M16 29l-5.5-9.5M4.1 22.5H15M4.1 9.5L9.6 19" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">StudioSpace</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-indigo-500">Creative Workspaces</span>
          </span>
        </button>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map(l => (
            <button key={l.path} onClick={() => go(l.path)} aria-current={isActive(l.path) ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                isActive(l.path)
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}>
              {l.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(o => !o)} aria-haspopup="menu" aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {avatar ? (
                    <img src={avatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500"
                      onError={e => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold grid place-items-center">{initial}</span>
                  )}
                  <span className="text-sm font-semibold max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl animate-fadeIn">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      {MENU_ITEMS.map(({ icon: Icon, label, path, color }) => (
                        <button key={path} role="menuitem" onClick={() => go(path)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Icon className={`w-4 h-4 ${color}`} /> {label}
                        </button>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-slate-200 dark:border-slate-800">
                      <button role="menuitem" onClick={() => { setDropdownOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sign In
                </button>
                <button onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-colors">
                  Register <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu" aria-expanded={mobileOpen}
            className="md:hidden w-9 h-9 grid place-items-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 animate-fadeIn">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <button key={l.path} onClick={() => go(l.path)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm ${isActive(l.path)
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'font-medium text-slate-700 dark:text-slate-200'}`}>
                {l.label}
              </button>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <p className="px-3 text-xs text-slate-600 dark:text-slate-400 truncate">{user.name} · {user.email}</p>
                {MENU_ITEMS.map(({ icon: Icon, label, path, color }) => (
                  <button key={path} onClick={() => go(path)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200">
                    <Icon className={`w-4 h-4 ${color}`} /> {label}
                  </button>
                ))}
                <button onClick={() => { setMobileOpen(false); logout(); }} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => go('/login')} className="py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-semibold">Sign In</button>
                <button onClick={() => go('/register')} className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold">
                  Register <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;