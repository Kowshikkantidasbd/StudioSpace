import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Activity, 
  Gem, 
  Zap, 
  X, 
  Calendar,
  Layers,
  Music2
} from 'lucide-react';
import { BookingModal } from './BookingModal.tsx';
import { Studio } from '../types/index.ts';

interface SoundStageHeroSectionProps {
  navigate: (path: string) => void;
  onExploreClick?: () => void;
}

export const SoundStageHeroSection: React.FC<SoundStageHeroSectionProps> = ({ navigate }) => {
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'liveroom' | 'specs'>('console');
  const [activeBookingStudio, setActiveBookingStudio] = useState<Studio | null>(null);

  // Equalizer visualizer bars (varying heights)
  const equalizerBars = [
    { h: 'h-4', delay: '0ms' },
    { h: 'h-7', delay: '150ms' },
    { h: 'h-10', delay: '300ms' },
    { h: 'h-6', delay: '100ms' },
    { h: 'h-12', delay: '250ms' },
    { h: 'h-8', delay: '400ms' },
    { h: 'h-5', delay: '200ms' },
    { h: 'h-11', delay: '350ms' },
    { h: 'h-7', delay: '50ms' },
    { h: 'h-9', delay: '180ms' },
    { h: 'h-4', delay: '280ms' },
    { h: 'h-6', delay: '120ms' },
  ];

  const handleOpenBooking = async () => {
    try {
      const res = await fetch('/api/studios/studio-2');
      if (res.ok) {
        const data = await res.json();
        setActiveBookingStudio(data.studio);
      } else {
        navigate('/studios/studio-2');
      }
    } catch {
      navigate('/studios/studio-2');
    }
  };

  return (
    <div className="relative w-full bg-slate-950 text-white overflow-hidden select-none min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
      
      {/* 1. Full-Bleed Studio Atmosphere Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/hero_cinema_soundstage_neon_1793482006959.jpg"
          alt="StudioSpace Flagship Cinema Sound Stage"
          className="w-full h-full object-cover object-center scale-100 lg:scale-[1.02] transition-transform duration-1000"
        />

        {/* Cinematic Vignette & Gradient Overlays */}
        {/* Left side deep shade for typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 md:via-slate-950/50 to-transparent" />
        
        {/* Top & bottom smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />

        {/* Ambient Purple Lighting Glow on the Floor matching the mockup */}
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[300px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[400px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* 2. Floor Neon Light Ribbon Curves (SVG identical to mockup) */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <svg
          className="absolute bottom-0 right-0 w-full h-[220px] sm:h-[320px] opacity-75"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 300 320 C 650 290 850 140 1440 210"
            stroke="url(#neonPurpleGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]"
          />
          <path
            d="M 450 320 C 720 280 1000 190 1440 260"
            stroke="url(#neonIndigoGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_10px_rgba(129,140,248,0.7)]"
          />
          <defs>
            <linearGradient id="neonPurpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
              <stop offset="30%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#d946ef" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="neonIndigoGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="40%" stopColor="#818cf8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Hero Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20 lg:py-28">
        <div className="max-w-2xl space-y-5 sm:space-y-7">
          
          {/* Top Pill Badge: Flagship Cinema Sound Stage */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-950/50 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-medium backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:border-purple-400/60 transition-all">
            <span className="flex items-center gap-0.5 text-purple-400">
              <span className="w-1 h-3.5 bg-purple-400 rounded-full animate-pulse" />
              <span className="w-1 h-2.5 bg-purple-400/80 rounded-full" />
              <span className="w-1 h-4 bg-purple-300 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-purple-400/70 rounded-full" />
            </span>
            <span>
              <strong className="font-bold text-white">Flagship</strong> Cinema Sound Stage
            </span>
          </div>

          {/* Main Display Headline (Two-line typographic lockup) */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Where Sound Meets
            </h1>
            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.45)]">
                Cinematic Acoustics
              </span>
            </h1>
          </div>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
            Reserve acoustically calibrated live rooms, vintage Neve consoles, and STC-68 floating tracking stages with transparent hourly pricing.
          </p>

          {/* 3-Column Feature Highlight Row (Responsive: stacks gracefully on mobile, 3-cols on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-1 sm:pt-2 max-w-lg">
            {/* 1. Premium Sound Studios */}
            <div className="flex items-center gap-3 p-2 sm:p-0 rounded-xl bg-slate-900/50 sm:bg-transparent border border-slate-800/60 sm:border-0 backdrop-blur-sm sm:backdrop-blur-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-white leading-tight">Premium</span>
                <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">Sound Studios</span>
              </div>
            </div>

            {/* 2. Industry-Grade Equipment */}
            <div className="flex items-center gap-3 p-2 sm:p-0 rounded-xl bg-slate-900/50 sm:bg-transparent border border-slate-800/60 sm:border-0 backdrop-blur-sm sm:backdrop-blur-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-white leading-tight">Industry-Grade</span>
                <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">Equipment</span>
              </div>
            </div>

            {/* 3. Instant Booking */}
            <div className="flex items-center gap-3 p-2 sm:p-0 rounded-xl bg-slate-900/50 sm:bg-transparent border border-slate-800/60 sm:border-0 backdrop-blur-sm sm:backdrop-blur-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-white leading-tight">Instant</span>
                <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">Booking</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Full-width friendly on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto">
            
            {/* Primary CTA: Explore Studios */}
            <button
              onClick={() => navigate('/studios')}
              className="group w-full sm:w-auto justify-center px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Studios</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA: Watch Tour */}
            <button
              onClick={() => setTourModalOpen(true)}
              className="group w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm border border-slate-700/80 hover:border-slate-500 flex items-center gap-2.5 backdrop-blur-md transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3 h-3 fill-white text-white translate-x-0.5" />
              </div>
              <span>Watch Tour</span>
            </button>

          </div>

        </div>
      </div>

      {/* 4. Bottom-Left Audio Spectrum Equalizer Graphic (hidden on small mobile to preserve clean layout) */}
      <div className="absolute bottom-6 left-8 z-10 hidden sm:flex items-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
        {equalizerBars.map((bar, i) => (
          <div
            key={i}
            className={`w-1.5 ${bar.h} bg-gradient-to-t from-purple-600 via-purple-400 to-indigo-300 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]`}
            style={{ animationDelay: bar.delay }}
          />
        ))}
      </div>

      {/* 5. Interactive Studio Tour Modal (Fully mobile responsive) */}
      {tourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-lg animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <Music2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">The Resonance Stage & Neve Suite Tour</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate">Williamsburg, Brooklyn · STC-68 Calibrated Live Room</p>
                </div>
              </div>

              <button
                onClick={() => setTourModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Media Preview */}
            <div className="relative h-48 sm:h-72 w-full bg-black overflow-hidden group shrink-0">
              <img
                src="/assets/images/hero_cinema_soundstage_neon_1793482006959.jpg"
                alt="Cinema Sound Stage Virtual Tour"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              {/* Audio Playback simulator */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0 cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate text-[11px] sm:text-xs">Acoustic Response Test (24-bit 96kHz)</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Neve 8068 Preamp & Barefoot MicroMain27 Monitoring</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">STC-68 Verified</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Scrollable on small mobile) */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6 pt-2 sm:pt-3 gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('console')}
                className={`pb-2.5 sm:pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'console'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Analog Console & Mics
              </button>
              <button
                onClick={() => setActiveTab('liveroom')}
                className={`pb-2.5 sm:pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'liveroom'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Floating Live Room
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 sm:pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Acoustic Architecture
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 text-xs text-slate-300 flex-1">
              {activeTab === 'console' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5 sm:space-y-2">
                    <p className="font-bold text-white text-xs sm:text-sm">Vintage Neve 8068 Desk</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">32 Channels with original 31102 mic preamp/EQ modules, discrete Class-A circuitry, and custom Marinair transformers.</p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5 sm:space-y-2">
                    <p className="font-bold text-white text-xs sm:text-sm">Monitoring & Converters</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">Barefoot Sound MicroMain27 active 3.5-way monitors paired with Burl Audio Mothership 32-channel conversion.</p>
                  </div>
                </div>
              )}

              {activeTab === 'liveroom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5 sm:space-y-2">
                    <p className="font-bold text-white text-xs sm:text-sm">1,100 sq.ft. Hardwood Live Stage</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">Floating concrete foundation isolated on elastomeric spring mounts to eliminate subway rumble and exterior vibrations.</p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5 sm:space-y-2">
                    <p className="font-bold text-white text-xs sm:text-sm">Featured Instruments</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">1974 Steinway Model B 7ft Grand Piano, 1968 Ludwig Super Classic Drum Kit, vintage Rhodes Mark I electric piano.</p>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <p className="text-base sm:text-lg font-bold text-purple-400">STC 68</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">Isolation Rating</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <p className="text-base sm:text-lg font-bold text-indigo-400">0.42s</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">RT60 Decay Time</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <p className="text-base sm:text-lg font-bold text-emerald-400">NC 15</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">HVAC Noise Criteria</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <p className="text-base sm:text-lg font-bold text-amber-400">3-Phase</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">Camlock Clean Power</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Responsive stack on mobile) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3.5 sm:p-4 px-4 sm:px-6 border-t border-slate-800 bg-slate-950/80 gap-3 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
                Rate: <strong className="text-white text-xs sm:text-sm">$160/hr</strong> · Instant Calendar Confirmation
              </span>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setTourModalOpen(false);
                    navigate('/studios/studio-2');
                  }}
                  className="flex-1 sm:flex-initial text-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  View Full Listing
                </button>
                <button
                  onClick={() => {
                    setTourModalOpen(false);
                    handleOpenBooking();
                  }}
                  className="flex-1 sm:flex-initial text-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  Book ($160/hr)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Quick Booking Modal */}
      {activeBookingStudio && (
        <BookingModal
          studio={activeBookingStudio}
          isOpen={Boolean(activeBookingStudio)}
          onClose={() => setActiveBookingStudio(null)}
          onRequireAuth={() => {
            setActiveBookingStudio(null);
            navigate('/login');
          }}
          onSuccess={() => {
            setActiveBookingStudio(null);
            navigate('/my-bookings');
          }}
        />
      )}

    </div>
  );
};
