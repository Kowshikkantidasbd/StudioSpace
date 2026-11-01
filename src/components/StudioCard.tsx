import React, { useState } from 'react';
import { Studio } from '../types/index.ts';
import { Star, MapPin, Users, ArrowUpRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { toast } from 'sonner';

interface StudioCardProps {
  studio: Studio;
  onSelect: (id: string) => void;
  isInitiallySaved?: boolean;
  onToggleWishlist?: (studioId: string, saved: boolean) => void;
}

export const StudioCard: React.FC<StudioCardProps> = ({ 
  studio, 
  onSelect,
  isInitiallySaved = false,
  onToggleWishlist
}) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [saving, setSaving] = useState(false);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Sign in to save this studio to your wishlist');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studioId: studio.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
        if (data.saved) {
          toast.success(`Saved "${studio.title}" to wishlist!`);
        } else {
          toast.info(`Removed from wishlist`);
        }
        onToggleWishlist?.(studio.id, data.saved);
      } else {
        toast.error(data.error || 'Failed to update wishlist');
      }
    } catch {
      toast.error('Network error updating wishlist');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(studio.id)}
      className="group cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/70 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:border-indigo-500/50 shadow-sm"
    >
      {/* Studio Image with category indicator and price tag overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={studio.imageUrl}
          alt={studio.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/images/hero_photo_studio_1793389976489.jpg';
          }}
        />
        {/* Contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

        {/* Top Floating Category and Rating + Heart Wishlist Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-slate-700/60 pointer-events-none">
            {studio.category}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-amber-400 text-xs font-semibold pointer-events-none">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{studio.rating.toFixed(2)}</span>
              <span className="text-slate-400 text-[10px]">({studio.reviewCount})</span>
            </div>

            {/* Heart Wishlist Button */}
            <button
              onClick={handleHeartClick}
              disabled={saving}
              title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
              className="p-1.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isSaved ? 'fill-red-500 text-red-500' : 'text-slate-300 hover:text-red-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom price callout */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-1 text-white">
          <span className="text-xl font-bold font-mono tabular-nums">${studio.hourlyRate}</span>
          <span className="text-xs text-slate-300 font-medium">/ hour</span>
        </div>
      </div>

      {/* Content body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {studio.title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{studio.location}</span>
          </div>

          <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {studio.overview}
          </p>
        </div>

        {/* Specs and View Details footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Up to {studio.capacity}</span>
            </div>
            {studio.securityDeposit > 0 && (
              <>
                <span>·</span>
                <span>${studio.securityDeposit} dep.</span>
              </>
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform cursor-pointer"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
