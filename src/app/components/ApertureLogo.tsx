export function ApertureLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="16" cy="16" r="13" />
      <path d="M16 3l5.5 9.5M27.9 9.5H17M27.9 22.5L22.4 13M16 29l-5.5-9.5M4.1 22.5H15M4.1 9.5L9.6 19" />
    </svg>
  );
}

export default ApertureLogo;