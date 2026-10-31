import Link from "next/link";
import {
  Aperture,
  X,
  Camera,
  PlaySquare,
  UsersRound,
} from "lucide-react";

const PLATFORM_LINKS = [
  { label: "Explore Workspaces", href: "/explore" },
  { label: "List Your Studio", href: "/studio/create" },
  { label: "Booking Manager", href: "/dashboard" },
  { label: "Host Dashboard", href: "/dashboard" },
];

const CATEGORY_LINKS = [
  { label: "Photo Studios", href: "/explore?category=photo" },
  { label: "Sound Stages", href: "/explore?category=sound" },
  { label: "Podcast Rooms", href: "/explore?category=podcast" },
  { label: "Music Suites", href: "/explore?category=music" },
  { label: "Art Workshops", href: "/explore?category=art" },
];

const LEGAL_LINKS = [
  { label: "Host Liability Protection", href: "/legal/host-liability" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Security Standards", href: "/legal/security" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background text-foreground">
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand + description */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative p-1.5 bg-primary/10 rounded-lg">
                <Aperture
                  className="h-6 w-6 text-primary drop-shadow-[0_0_10px_rgba(99,102,241,0.55)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-secondary">
                  StudioSpace
                </span>
              </div>
            </div>
            <p className="text-muted leading-relaxed mb-6">
              The peer-to-peer marketplace uniting visionary photographers,
              audio engineers, filmmakers, and studio hosts. Seamlessly reserve
              creative workspaces with guaranteed availability and transparent
              hourly rates.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="X"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <PlaySquare className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <UsersRound className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator Dispatch */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Creator Dispatch
            </h3>
            <p className="text-sm text-muted mb-4">
              Receive newly vetted studio openings and exclusive creator
              production discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="producer@agency.com"
                className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-background/50 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <button className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-primary-hover hover:shadow-[0_0_28px_rgba(99,102,241,0.55)] transition-all whitespace-nowrap">
                Join Dispatch
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
            <p>
              &copy; 2026 StudioSpace Technologies Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
