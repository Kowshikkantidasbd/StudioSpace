import Link from "next/link";
import {
  Star,
  Headphones,
  Zap,
  Shield,
  UsersRound,
  Play,
  ArrowRight,
  ChevronDown,
  Calendar,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden">
      {/* Background image + overlay */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505765746926-f9856913a1a4?q=80&w=2070&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(99,102,241,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex flex-col max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex-1 py-12 md:py-20 lg:py-24 flex flex-col justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold shadow-[0_0_24px_rgba(245,158,11,0.2)]">
            <Star className="h-4 w-4" />
            <span>Premium Creative Studio</span>
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight">
            <span className="block">Create. Record.</span>
            <span className="block text-yellow-400">Collaborate.</span>
          </h1>

          <p className="mt-5 text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Professional studios for creators, artists and innovators.{" "}
            <br />
            Book, record and bring your ideas to life.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/studios">
              <button className="flex items-center gap-2 px-7 py-3 rounded-full bg-yellow-400 text-black font-semibold tracking-tight shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-yellow-300 transition-all">
                <Calendar className="h-5 w-5" />
                Book a Studio <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/about">
              <button className="flex items-center gap-2 px-7 py-3 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all">
                <Play className="h-4 w-4" />
                Watch Tour
              </button>
            </Link>
          </div>

          {/* Feature row */}
          <div className="mt-16 border-t border-white/10 pt-12 md:mt-24 md:pt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <FeatureItem icon={<Headphones className="h-5 w-5 text-yellow-400" />}>
                State-of-the-Art Equipment
              </FeatureItem>
              <FeatureItem icon={<Zap className="h-5 w-5 text-yellow-400" />}>
                Ultra-Fast Booking
              </FeatureItem>
              <FeatureItem icon={<Shield className="h-5 w-5 text-yellow-400" />}>
                Secure &amp; Reliable
              </FeatureItem>
              <FeatureItem icon={<UsersRound className="h-5 w-5 text-yellow-400" />}>
                Trusted by Creators
              </FeatureItem>
            </div>
          </div>
        </div>

        {/* Scroll down */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors group">
            <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
          </div>
          <span className="text-xs text-white/60">Scroll Down</span>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, children }: { icon: React.ReactElement; children: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{children}</h3>
    </div>
  );
}
