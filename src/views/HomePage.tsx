import React, { useState, useEffect } from 'react';
import { Studio, StudioCategory } from '../types/index.ts';
import { StudioCard } from '../components/StudioCard.tsx';
import { SkeletonCard } from '../components/SkeletonCard.tsx';
import { SpotlightHeroBanner } from '../components/SpotlightHeroBanner.tsx';
import { SoundStageHeroSection } from '../components/SoundStageHeroSection.tsx';
import { 
  Camera, 
  Mic2, 
  Radio, 
  Music, 
  Palette, 
  ArrowRight, 
  CheckCircle2,
  Award
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

const CATEGORIES: { name: StudioCategory; icon: any; count: string; desc: string }[] = [
  {
    name: 'Photo Studios',
    icon: Camera,
    count: '24+ Studios',
    desc: 'Infinity cycloramas, natural daylight lofts & strobe packages.',
  },
  {
    name: 'Sound Stages',
    icon: Mic2,
    count: '16+ Stages',
    desc: 'Tuned live rooms, floating floors & vintage analog consoles.',
  },
  {
    name: 'Podcast Rooms',
    icon: Radio,
    count: '18+ Suites',
    desc: 'Multi-mic video broadcast desks with real-time ISO switching.',
  },
  {
    name: 'Music Suites',
    icon: Music,
    count: '14+ Suites',
    desc: 'Dolby Atmos monitoring, vocal booths & vintage synthesizers.',
  },
  {
    name: 'Art Workshops',
    icon: Palette,
    count: '12+ Ateliers',
    desc: 'High-ceiling industrial lofts with timber workbenches & easels.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/studios?featured=true&limit=6');
        if (res.ok) {
          const data = await res.json();
          setFeaturedStudios(data.studios || []);
        }
      } catch (err) {
        console.error('Error fetching featured studios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full flex flex-col space-y-16 pb-20">
      
      
      <SoundStageHeroSection navigate={navigate} />

      
      <section id="explore-curated-studios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Curated Production Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Browse by Creative Discipline
            </h2>
          </div>
          <button
            onClick={() => navigate('/studios')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>View all disciplines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(`/studios?category=${encodeURIComponent(cat.name)}`)}
                className="group cursor-pointer p-5 rounded-2xl border transition-all duration-300 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 hover:border-indigo-500/50 hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5 block">
                  {cat.count}
                </span>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">
              Hand-Selected Locations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Featured Studio Spaces
            </h2>
          </div>
          <button
            onClick={() => navigate('/studios')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Explore all listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            featuredStudios.map(studio => (
              <StudioCard
                key={studio.id}
                studio={studio}
                onSelect={(id) => navigate(`/studios/${id}`)}
              />
            ))
          )}
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SpotlightHeroBanner navigate={navigate} />
      </section>

      
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="rounded-3xl p-8 sm:p-12 border bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Frictionless Production
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              How Workspace Booking Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              No endless broker emails or hidden studio fees. Reserve verified creator spaces in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            
            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-mono font-bold text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Discover Your Space
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter by acoustic rating, power Camlock drops, ceiling height, cyclorama size, and gear packages.
              </p>
            </div>

            
            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono font-bold text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Select Hours & Date
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose hourly blocks with instant conflict detection to guarantee zero double-booking collisions.
              </p>
            </div>

            
            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-bold text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Book Instantly
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Transparent itemized checkout with automatic liability insurance and secure security deposit holding.
              </p>
            </div>

            
            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-mono font-bold text-sm flex items-center justify-center">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create & Produce
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct dock access codes, on-site studio host greetings, and dedicated high-speed fiber connection.
              </p>
            </div>

          </div>
        </div>
      </section>

      
      <section id="about-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              Verified Trust & Safety
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Backed by $1M Host Liability Protection & 24/7 Producer Support
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every studio on StudioSpace undergoes physical on-site sound insulation auditing, power feed validation, and verified equipment inventories so you never walk into an unready stage.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    $1,000,000 Host & Equipment Guarantee
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Comprehensive property and gear damage coverage protecting hosts and visiting production crews.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    Strict Zero Double-Booking Collision Guarantee
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Real-time atomic interval locks prevent overlapping reservations. Your call sheet schedule is always sacred.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    24/7 Production Day Dispatch
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Direct hotline for loading dock coordination, breaker resets, and emergency equipment spares.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">StudioSpace Certified</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Audio, Light & Safety Audit</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                100% Verified
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">Average Review Rating</span>
                <span className="text-sm font-bold font-mono text-amber-500 dark:text-amber-400">4.96 / 5.0</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">Total Host Payout Guarantee</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">$1,000,000</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">Production On-Time Arrival</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">99.8%</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Ready to monetize your space?</span>
              <button
                onClick={() => navigate('/add-studio')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>List a Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
