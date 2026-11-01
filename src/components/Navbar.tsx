import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { 
  Sun, 
  Moon, 
  PlusCircle, 
  Layers, 
  Calendar, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  Heart,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Studios', path: '/studios' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'About Us', path: '/#about-us' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(path.replace('/#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path === '/studios' && (currentPath === '/studios' || currentPath.startsWith('/studios/'))) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b bg-white/95 dark:bg-slate-950/85 border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Logo Wordmark matching reference design */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600/15 dark:bg-purple-500/20 border border-purple-500/30 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-all shadow-sm shadow-purple-500/10">
            <svg
              className="w-5 h-5 text-purple-600 dark:text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Studio<span className="text-purple-600 dark:text-purple-400">Space</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase text-slate-500 dark:text-slate-400 font-semibold">
              Creative Workspaces
            </span>
          </div>
        </button>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => {
            const active = isActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-sm font-medium transition-colors relative py-1 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'text-purple-600 dark:text-purple-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Theme Toggle & Auth Controls) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Theme Toggle Button (Circular Matching Design) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark and Light mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Unauthenticated vs Authenticated UI */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all focus:outline-none cursor-pointer"
              >
                <img
                  src={user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500"
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:inline" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/my-listings');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/add-studio');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Add New Studio
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/my-listings');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      My Studio Listings
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/my-bookings');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      My Bookings
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/saved-studios');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      Saved Studios
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700/60 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="hidden sm:inline-flex px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.45)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-t border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl text-slate-800 dark:text-slate-200 space-y-3 shadow-2xl animate-fadeIn">
          
          {/* User Profile Card on Mobile if Authenticated */}
          {user ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <img
                src={user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/register');
                }}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-purple-600/30 cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

          {/* Primary Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-2 block">
              Navigation
            </span>
            {navLinks.map(link => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />}
                </button>
              );
            })}
          </div>

          {/* Authenticated Actions */}
          {user && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-2 block">
                Workspace Controls
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/add-studio');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Studio</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/my-listings');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-500" />
                <span>My Studio Listings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/my-bookings');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>My Bookings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/saved-studios');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span>Saved Studios</span>
              </button>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
