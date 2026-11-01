import React, { useState } from 'react';
import { Studio } from '../types/index.ts';
import { BookingModal } from './BookingModal.tsx';
import { 
  Users, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  X, 
  CheckCircle2
} from 'lucide-react';

interface SpotlightHeroBannerProps {
  navigate: (path: string) => void;
}

// Studio data matching studio-3
const SPOTLIGHT_STUDIO: Studio = {
  id: 'studio-3',
  title: 'Acoustic Podcast Lounge & Live Soundstage',
  category: 'Podcast Rooms',
  hourlyRate: 65,
  securityDeposit: 150,
  capacity: 8,
  location: 'West Loop, Chicago, IL',
  address: '320 N Morgan St, Chicago, IL 60607',
  imageUrl: '/assets/images/hero_podcast_suite_1793389977711.jpg',
  galleryImages: [
    '/assets/images/hero_podcast_suite_1793389977711.jpg',
    '/assets/images/hero_sound_stage_1793389976920.jpg',
    '/assets/images/hero_photo_studio_1793389976489.jpg',
  ],
  amenities: [
    'Rodecaster Pro II Integrated Console',
    '4x Shure SM7B Microphones with Cloudlifters',
    'RGB Aperture Video Lights',
    '3-Angle 4K Blackmagic Studio Cameras',
    'ATEM Mini Extreme ISO Switcher',
    'Acoustic Felt Wall Diffusers',
    'Ultra-Fast Fiber 1Gbps Internet',
    'Comfortable Herman Miller Seating'
  ],
  overview: 'Sound-treated environment with multi-mic setups, cinema camera rigs, and real-time streaming capabilities for creators.',
  dimensions: '18ft x 22ft · 11ft Acoustic Drop',
  powerSupply: 'Surge-isolated 20A commercial circuit',
  noiseIsolation: 'NRC 0.95 Acoustic Panels & Double Seals',
  rating: 4.9,
  reviewCount: 32,
  hostId: 'host-3',
  hostName: 'Julian Chen',
  hostEmail: 'julian@echostream.co',
  hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  isFeatured: true,
  createdAt: new Date('2026-02-12').toISOString(),
};

export const SpotlightHeroBanner: React.FC<SpotlightHeroBannerProps> = ({ navigate }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourAngle, setTourAngle] = useState<'wide' | 'control' | 'lights'>('wide');

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 my-6">
      
      {/* Background Image: Provided high-res podcast studio asset */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/hero_podcast_suite_1793389977711.jpg"
          alt="Acoustic Podcast Lounge & Live Soundstage"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-95 transform scale-102 transition-transform duration-1000"
        />

        {/* 70% Dark Gradient Mask Overlay to keep the center podcast host and mic setup softly visible */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />
        
        {/* Subtle radial & side depth scrims to ensure crisp contrast on Left & Right UI */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      {/* Main Grid: Left side hero info & Right side floating glassmorphism card */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* 👈 LEFT SIDE LAYOUT (Hero Content & Info Badge) */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          
          {/* 1. Top Badge: Glowing rounded capsule pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-md">
            <span>🎙️</span>
            <span>LIVE PODCAST & RECORDING SUITE</span>
          </div>

          {/* 2. Main Headline: Bold, crisp off-white typography */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight leading-[1.15] drop-shadow-md">
            Acoustic Podcast Lounge & Live Soundstage
          </h2>

          {/* 3. Subtitle / Description: 2-line clean subtext */}
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal drop-shadow">
            Sound-treated environment with multi-mic setups, cinema camera rigs, and real-time streaming capabilities for creators.
          </p>

          {/* 4. Rating & Rate Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
            {/* Hourly Rate Tag */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#6366F1] tracking-tight drop-shadow-[0_0_12px_rgba(99,102,241,0.4)] tabular-nums">
                $65
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300">/ hour</span>
            </div>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            {/* Rating Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[11px] sm:text-xs font-medium text-slate-200">
              <span className="text-amber-400">⭐</span>
              <span className="font-bold text-white tabular-nums">4.9</span>
              <span className="text-slate-400">(32 Verified Reviews)</span>
            </div>
          </div>

          {/* 5. Action Buttons (Optional CTA) */}
          <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Primary Solid Button */}
            <button
              onClick={() => navigate('/studios/studio-3')}
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#6366F1] hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <span>Explore Studio Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Glassmorphic Button */}
            <button
              onClick={() => setIsTourOpen(true)}
              className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl hover:border-slate-500 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer w-full sm:w-auto"
            >
              <Compass className="w-4 h-4 text-[#F59E0B]" />
              <span>Take Virtual Tour</span>
            </button>
          </div>

        </div>

        {/* 👉 RIGHT SIDE LAYOUT (Interactive Floating Booking Card) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          
          {/* Glassmorphism Card Container */}
          <div className="w-full max-w-md rounded-2xl border border-[#1E293B] bg-slate-900/75 backdrop-blur-xl shadow-2xl p-6 sm:p-7 space-y-6 transition-all hover:border-slate-700">
            
            {/* Card Header: "Reserve This Workspace" with green live status dot */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Reserve This Workspace
              </h2>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available Today</span>
              </div>
            </div>

            {/* Specification List */}
            <div className="space-y-3.5 text-xs text-slate-300">
              
              {/* Max Capacity */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Max Capacity
                </span>
                <span className="font-bold text-white font-mono">8 Creators</span>
              </div>

              {/* Security Deposit */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security Deposit
                </span>
                <span className="font-bold text-white font-mono">$150 (Refundable)</span>
              </div>

              {/* Featured Gear */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
                <span className="flex items-center gap-2 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  Featured Gear Included
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/70 text-slate-200 text-[11px]">
                    Rodecaster Pro II
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/70 text-slate-200 text-[11px]">
                    4x Shure SM7B
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/70 text-slate-200 text-[11px]">
                    RGB Aperture Lights
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Session Price Preview */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Instant Confirmation</span>
              <span className="text-white font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero Overlap Lock
              </span>
            </div>

            {/* Primary CTA Button: Full-width vibrant indigo with subtle glow */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#6366F1] hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_28px_rgba(99,102,241,0.7)] transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Book Workspace Now</span>
            </button>

          </div>

        </div>

      </div>

      {/* Interactive Booking Modal */}
      <BookingModal
        studio={SPOTLIGHT_STUDIO}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => navigate('/my-bookings')}
        onRequireAuth={() => {
          setIsBookingOpen(false);
          navigate('/login');
        }}
      />

      {/* Interactive Virtual Tour Modal */}
      {isTourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Interactive Stage Tour</h3>
                  <p className="text-xs text-slate-400">Acoustic Podcast Lounge & Live Soundstage</p>
                </div>
              </div>

              <button
                onClick={() => setIsTourOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tour Viewport */}
            <div className="relative mt-5 aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <img
                src={
                  tourAngle === 'wide'
                    ? '/assets/images/hero_podcast_suite_1793389977711.jpg'
                    : tourAngle === 'control'
                    ? '/assets/images/hero_sound_stage_1793389976920.jpg'
                    : '/assets/images/hero_photo_studio_1793389976489.jpg'
                }
                alt="Studio Tour Angle"
                className="w-full h-full object-cover transition-all duration-700"
              />

              {/* View Overlay Indicators */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-slate-950/85 border border-slate-700/80 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>CAM {tourAngle === 'wide' ? '01 · 4K CENTER PODCAST DESK' : tourAngle === 'control' ? '02 · AUDIO RACK & CONSOLE' : '03 · LIGHTING GRID & CYC'}</span>
              </div>

              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 z-10">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80">
                  <button
                    onClick={() => setTourAngle('wide')}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                      tourAngle === 'wide' ? 'bg-[#6366F1] text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Host & Guest Desk
                  </button>
                  <button
                    onClick={() => setTourAngle('control')}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                      tourAngle === 'control' ? 'bg-[#6366F1] text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Audio Control Deck
                  </button>
                  <button
                    onClick={() => setTourAngle('lights')}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                      tourAngle === 'lights' ? 'bg-[#6366F1] text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Aperture Lighting
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsTourOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors cursor-pointer text-center"
                >
                  Book This Suite
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
