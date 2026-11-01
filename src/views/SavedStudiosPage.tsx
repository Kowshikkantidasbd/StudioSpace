import React, { useState, useEffect } from 'react';
import { Studio } from '../types/index.ts';
import { StudioCard } from '../components/StudioCard.tsx';
import { SkeletonCard } from '../components/SkeletonCard.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Heart, Building2, ArrowRight } from 'lucide-react';

interface SavedStudiosPageProps {
  navigate: (path: string) => void;
}

export const SavedStudiosPage: React.FC<SavedStudiosPageProps> = ({ navigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [savedStudios, setSavedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setSavedStudios(data.studios || []);
      }
    } catch (err) {
      console.error('Error fetching saved wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto my-32 p-8 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading your saved studios...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
          <Heart className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In Required</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please sign in to view your saved wishlist and favorite production spaces.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-red-500">
              Personal Wishlist
            </span>
            <span className="text-xs text-slate-400">· Saved Spaces</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            My Saved Studio Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Keep track of your favorite cycloramas, podcast suites, and sound stages for upcoming shoots.
          </p>
        </div>

        <button
          onClick={() => navigate('/studios')}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-indigo-500" />
          <span>Explore More Studios</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : savedStudios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedStudios.map(studio => (
            <StudioCard
              key={studio.id}
              studio={studio}
              isInitiallySaved={true}
              onSelect={(id) => navigate(`/studios/${id}`)}
              onToggleWishlist={(studioId, saved) => {
                if (!saved) {
                  setSavedStudios(prev => prev.filter(s => s.id !== studioId));
                }
              }}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 max-w-lg mx-auto my-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Discover premier photo stages, acoustically treated live rooms, and podcast broadcast suites, then click the heart icon to save them here.
          </p>
          <button
            onClick={() => navigate('/studios')}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Browse Available Studios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
