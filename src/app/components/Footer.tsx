"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ApertureLogo } from "./ApertureLogo";

/* Inline brand icons (lucide-react no longer ships brand logos). */
type IconProps = { className?: string };

function XLogo({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function InstagramIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function YouTubeIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}
function LinkedInIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function GitHubIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

const CATEGORIES = [["Photo Studios", "photo"], ["Sound Stages", "sound"], ["Podcast Rooms", "podcast"], ["Music Suites", "music"], ["Art Workshops", "art"]];
const PLATFORM = [["List Your Studio", "/studios/new"], ["How Booking Works", "/how-it-works"], ["$1M Host Guarantee", "/guarantee"], ["Transparent Pricing", "/pricing"], ["Creator Guidelines", "/guidelines"], ["Safety & Verification", "/safety"]];
const SOCIAL = [
  { label: "X (Twitter)", href: "https://x.com", node: <XLogo /> },
  { label: "Instagram", href: "https://instagram.com", node: <InstagramIcon /> },
  { label: "YouTube", href: "https://youtube.com", node: <YouTubeIcon /> },
  { label: "LinkedIn", href: "https://linkedin.com", node: <LinkedInIcon /> },
  { label: "GitHub", href: "https://github.com", node: <GitHubIcon /> },
];
const linkCls = "text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400";
const head = "text-sm font-bold text-slate-900 dark:text-white";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true); setEmail("");
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <ApertureLogo />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">StudioSpace</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Connecting creators, directors, audio engineers, and photographers with extraordinary production spaces worldwide.
          </p>
          <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
            <a href="mailto:support@studiospace.io" className="hover:text-indigo-500">support@studiospace.io</a> | <a href="tel:+1800555788346" className="hover:text-indigo-500">+1 (800) 555-STUDIO</a>
          </p>
        </div>

        <div>
          <h3 className={head}>Studio Categories</h3>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.map(([l, c]) => <li key={c}><Link className={linkCls} href={`/studios?category=${c}`}>{l}</Link></li>)}
          </ul>
        </div>

        <div>
          <h3 className={head}>Platform & Hosts</h3>
          <ul className="mt-4 space-y-2.5">
            {PLATFORM.map(([l, h]) => <li key={h}><Link className={linkCls} href={h}>{l}</Link></li>)}
          </ul>
        </div>

        <div>
          <h3 className={head}>Join the Creator Network</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Receive exclusive invites to new stage openings, gear discounts, and off-peak rate drops.</p>
          <form onSubmit={submit} className="relative mt-4">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input id="newsletter" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com"
              className="w-full rounded-full border border-slate-300 bg-white py-3 pl-5 pr-14 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400" />
            <button type="submit" aria-label="Subscribe" className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500">
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p role="status" aria-live="polite" className={`mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600 transition-opacity dark:text-emerald-400 ${done ? "opacity-100" : "opacity-0"}`}>
            <CheckCircle2 className="h-4 w-4" /> You’re in. Check your inbox to confirm.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
          <p className="text-xs text-slate-600 dark:text-slate-400">© 2026 StudioSpace Inc. All rights reserved.</p>
          <p className="flex flex-wrap justify-center gap-x-2 text-xs text-slate-600 dark:text-slate-400">
            <Link href="/privacy" className="hover:text-indigo-500">Privacy Policy</Link> ·
            <Link href="/terms" className="hover:text-indigo-500">Terms of Service</Link> ·
            <Link href="/security" className="hover:text-indigo-500">Security & Escrow</Link>
          </p>
          <ul className="flex items-center gap-4">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-300">{s.node}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}