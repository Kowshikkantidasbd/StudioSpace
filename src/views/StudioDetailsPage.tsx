import React, { useState, useEffect } from 'react';
import { Studio } from '../types/index.ts';
import { BookingModal } from '../components/BookingModal.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Star, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Check, 
  Zap, 
  Volume2, 
  Maximize2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

interface StudioDetailsPageProps {
  studioId: string;
  navigate: (path: string) => void;
}

export const StudioDetailsPage: React.FC<StudioDetailsPageProps> = ({ studioId, navigate }) => {
  const { user } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {

    const checkWishlist = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/wishlist');
        if (res.ok) {
          const data = await res.json();
          if (data.studioIds && data.studioIds.includes(studioId)) {
            setIsSaved(true);
          }
        }
      } catch {
        
      }
    };
    checkWishlist();
  }, [user, studioId]);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.info('Please sign in to save studios to your wishlist');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studioId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
        if (data.saved) {
          toast.success('Studio saved to your wishlist!');
        } else {
          toast.info('Studio removed from wishlist');
        }
      } else {
        toast.error(data.error || 'Failed to update wishlist');
      }
    } catch {
      toast.error('Network error updating wishlist');
    }
  };

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await fetch(`/api/studios/${studioId}`);
        if (res.ok) {
          const data = await res.json();
          setStudio(data.studio);
        }
      } catch (err) {
        console.error('Error fetching studio details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudio();
  }, [studioId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="aspect-[21/9] w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Studio Not Found</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">The requested workspace may have been unpublished or removed.</p>
        <button
          onClick={() => navigate('/studios')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white cursor-pointer"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const gallery = studio.galleryImages && studio.galleryImages.length > 0
    ? studio.galleryImages
    : [studio.imageUrl];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8 w-full space-y-8">
      
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/studios')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studios</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleWishlist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-red-500/40 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
            <span>{isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
          </button>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-semibold">
            {studio.category}
          </span>
        </div>
      </div>

      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {studio.title}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{studio.rating.toFixed(2)}</span>
              <span className="text-slate-500 dark:text-slate-400">({studio.reviewCount} verified reviews)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>{studio.address || studio.location}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Max Capacity {studio.capacity} creators</span>
            </div>
          </div>
        </div>

        
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            ${studio.hourlyRate}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ hour</span>
        </div>
      </div>

      
      <div className="space-y-3">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700/80 shadow-2xl">
          <img
            src={gallery[activeImageIdx]}
            alt={`${studio.title} view ${activeImageIdx + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/hero_photo_studio_1793389976489.jpg';
            }}
          />

          
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIdx(prev => (prev === 0 ? gallery.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/60 transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIdx(prev => (prev + 1) % gallery.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/60 transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-mono border border-slate-700/60">
            {activeImageIdx + 1} / {gallery.length} Photos
          </div>
        </div>

        
        {gallery.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === activeImageIdx
                    ? 'border-indigo-500 scale-102 ring-2 ring-indigo-500/20'
                    : 'border-slate-300 dark:border-slate-700/80 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        

        <div className="lg:col-span-2 space-y-8">
          
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Dimensions</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {studio.dimensions || '35ft x 50ft · 16ft'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Power Feed</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {studio.powerSupply || '100A 3-Phase Camlock'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Isolation</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {studio.noiseIsolation || 'Quiet Studio (STC 55)'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
                <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Crew Limit</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                Up to {studio.capacity} People
              </p>
            </div>
          </div>

          
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Workspace Overview
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {studio.overview}
            </p>
          </div>

          
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Included Amenities & Equipment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {studio.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200"
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={studio.hostAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={studio.hostName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Verified Studio Host
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {studio.hostName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{studio.hostEmail}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Identity & Facility Verified
              </span>
            </div>
          </div>

        </div>

        
        <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/90 shadow-xl space-y-6">
          
          <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                  ${studio.hourlyRate}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ hour</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{studio.rating.toFixed(2)}</span>
              </div>
            </div>
          </div>

          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Standard 4-Hour Session</span>
              <span className="font-mono tabular-nums font-semibold">${studio.hourlyRate * 4}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Platform Service Fee (10%)</span>
              <span className="font-mono tabular-nums">${Math.round(studio.hourlyRate * 4 * 0.1)}</span>
            </div>
            {studio.securityDeposit > 0 && (
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Refundable Deposit</span>
                <span className="font-mono tabular-nums">${studio.securityDeposit}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
              <span>Est. 4-Hour Total</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                ${studio.hourlyRate * 4 + Math.round(studio.hourlyRate * 4 * 0.1) + studio.securityDeposit}
              </span>
            </div>
          </div>

          
          <button
            onClick={() => setIsBookingOpen(true)}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book Workspace Now
          </button>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
            You won't be charged until the studio host confirms availability.
          </p>
        </div>

      </div>

      
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
              ${studio.hourlyRate}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ hr</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Verified Availability
          </span>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Reserve Space</span>
        </button>
      </div>

      
      <BookingModal
        studio={studio}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => {
          navigate('/my-bookings');
        }}
        onRequireAuth={() => {
          setIsBookingOpen(false);
          navigate('/login');
        }}
      />

    </div>
  );
};
