"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Aperture,
  Sun,
  Moon,
  Home,
  Search,
  HelpCircle,
  Info,
  User,
  LayoutDashboard,
  Plus,
  Building2,
  Calendar,
  LogOut,
  ChevronDown,
  Menu,
  X as XIcon,
} from "lucide-react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "studiospace-theme";

const NAV_LINKS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/explore", label: "Explore Studios", Icon: Search },
  { href: "/how-it-works", label: "How It Works", Icon: HelpCircle },
  { href: "/about", label: "About Us", Icon: Info },
];

export interface NavbarProps {
  isAuthenticated?: boolean;
  user?: { name: string; role: string; avatar?: string } | null;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
}

export function Navbar({
  isAuthenticated = false,
  user = null,
  onLogin,
  onRegister,
  onLogout,
}: NavbarProps = {}) {
  const pathname = usePathname();

  // --- Theme state ---------------------------------------------------------
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  }, [theme]);

  // --- Auth dropdown state -------------------------------------------------
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDropdown();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [closeDropdown]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative p-1.5 bg-primary/10 rounded-lg">
            <Aperture
              className="h-6 w-6 text-primary drop-shadow-[0_0_10px_rgba(99,102,241,0.55)]"
            />
            <span className="absolute -inset-0.5 rounded-lg border border-primary/30 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-secondary">
              StudioSpace
            </span>
            <span className="text-xs text-muted uppercase tracking-wider">
              Creative Workspaces
            </span>
          </div>
        </Link>

        {/* Desktop navigation + actions */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-8 ml-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              const Icon = link.Icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? "text-primary underline underline-offset-4 decoration-primary/80"
                      : "text-muted hover:text-primary group"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                      active ? "text-primary" : "text-muted"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="transition-colors duration-200">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {isAuthenticated ? (
              <ProfileDropdown
                user={user}
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
                ref={profileButtonRef}
                dropdownRef={dropdownRef}
                onLogout={onLogout}
              />
            ) : (
              <>
                <Link href="/login">
                  <span className="text-sm font-medium text-muted hover:text-primary transition-colors">
                    Sign In
                  </span>
                </Link>
                <Link href="/register">
                  <button className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-primary-hover hover:shadow-[0_0_28px_rgba(99,102,241,0.55)] transition-all">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-card text-foreground hover:bg-primary/5 transition-colors"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            <XIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && mounted && (
        <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          <div className="relative w-full max-w-md mx-auto bg-card border border-border border-t-0 rounded-b-xl shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Aperture className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-secondary">
                    StudioSpace
                  </span>
                  <span className="text-xs text-muted uppercase tracking-wider">
                    Creative Workspaces
                  </span>
                </div>
              </Link>
              <button
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-background text-foreground hover:bg-primary/5 transition-colors"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  <link.Icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-6 py-4 border-t border-border">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="w-full justify-between" />
              {isAuthenticated ? (
                <div className="mt-4">
                  <ProfileDropdown
                    user={user}
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}
                    ref={profileButtonRef}
                    dropdownRef={dropdownRef}
                    onLogout={onLogout}
                    mobile
                  />
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-muted border border-border rounded-lg hover:bg-primary/5 hover:text-primary transition-colors" onClick={onLogin}>
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-primary-hover transition-all" onClick={onRegister}>
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ThemeToggle({
  theme,
  toggleTheme,
  className,
}: {
  theme: Theme;
  toggleTheme: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative inline-flex items-center justify-center h-9 w-9 shrink-0
        rounded-lg border border-border bg-card text-muted
        hover:text-primary hover:bg-primary/5 transition-colors
        ${className ?? ""}
      `}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Light mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Dark mode</span>
        </>
      )}
    </button>
  );
}

function AuthButtons({
  onLogin,
  onRegister,
}: {
  onLogin?: () => void;
  onRegister?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <button
          onClick={onLogin}
          className="px-4 py-2 text-sm font-medium text-muted border border-border rounded-lg hover:bg-white/5 hover:border-primary/50 hover:text-primary transition-all"
        >
          Login
        </button>
      </Link>
      <Link href="/register">
        <button
          onClick={onRegister}
          className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-primary-hover hover:shadow-[0_0_28px_rgba(99,102,241,0.55)] transition-all"
        >
          Register
        </button>
      </Link>
    </div>
  );
}

interface ProfileDropdownProps {
  user: { name: string; role: string; avatar?: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ref: React.Ref<HTMLButtonElement>;
  dropdownRef: React.Ref<HTMLDivElement>;
  onLogout?: () => void;
  mobile?: boolean;
}

function ProfileDropdown({
  user,
  open,
  onOpenChange,
  ref,
  dropdownRef,
  onLogout,
  mobile = false,
}: ProfileDropdownProps) {
  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const items = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: Plus,
      label: "Add New Studio",
      href: "/studio/create",
    },
    {
      icon: Building2,
      label: "My Studio Listings",
      href: "/my-studios",
    },
    {
      icon: Calendar,
      label: "My Bookings",
      href: "/bookings",
    },
    {
      icon: LogOut,
      label: "Logout",
      href: "#",
      destructive: true,
    },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef as unknown as React.Ref<HTMLDivElement>}>
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(!open);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-foreground rounded-lg hover:bg-primary/5 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="h-10 w-10 rounded-full border-2 border-ring/40 bg-card object-cover p-[1px]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border-2 border-ring/40 bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shadow-[0_0_15px_rgba(99,102,241,0.35)]">
            {initials}
          </div>
        )}
        <span className={mobile ? "hidden" : "ml-1 block truncate max-w-[140px]"}>
          {user?.name}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform duration-200" aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 z-50 glass rounded-xl border border-border p-2 shadow-2xl animate-in fade-in zoom-in duration-200"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted truncate">{user?.role}</p>
          </div>
          <div className="border-y border-border/50 my-1" />
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.destructive) {
                  e.preventDefault();
                  onLogout?.();
                }
                onOpenChange(false);
              }}
              className={`
                flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
                ${item.destructive
                  ? "text-red-soft hover:bg-red-soft/10 hover:text-red-soft-hover"
                  : "text-muted hover:bg-white/5 hover:text-primary"}
              `}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
