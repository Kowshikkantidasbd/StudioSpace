import React, { useState, useEffect } from 'react';
import { Studio, StudioCategory } from '../types/index.ts';
import { StudioCard } from '../components/StudioCard.tsx';
import { SkeletonCard } from '../components/SkeletonCard.tsx';
import { Search, SlidersHorizontal, RotateCcw, Building2 } from 'lucide-react';

interface ExplorePageProps {
  initialCategory?: string;
  navigate: (path: string) => void;
}

const CATEGORIES: ('All' | StudioCategory)[] = [
  'All',
  'Photo Studios',
  'Sound Stages',
  'Podcast Rooms',
  'Music Suites',
  'Art Workshops',
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ initialCategory, navigate }) => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(300);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (maxPrice < 300) {
        params.append('maxPrice', maxPrice.toString());
      }

      const res = await fetch(`/api/studios?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudios(data.studios || []);
      }
    } catch (err) {
      console.error('Error fetching studios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudios();
    }, 200);
    return () => clearTimeout(timeout);
  }, [selectedCategory, search, maxPrice]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setMaxPrice(300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      
      {/* Page Title & Subtitle */}
      <div>
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
          Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
          Explore Creative Workspaces
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Book verified sound stages, photo cycloramas, podcast studios, and daylight workshops.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="p-5 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location (e.g. Brooklyn, Arts District), gear..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by workspace category"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Workspace Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Slider Filter */}
          <div className="md:col-span-3 flex flex-col justify-center">
            <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <SlidersHorizontal className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                Max Hourly Rate:
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                ${maxPrice}/hr
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={300}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

        </div>

        {/* Quick Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
          {(selectedCategory !== 'All' || search || maxPrice < 300) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors ml-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{studios.length}</span> verified spaces
        </span>
      </div>

      {/* Studios Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : studios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map(studio => (
            <StudioCard
              key={studio.id}
              studio={studio}
              onSelect={(id) => navigate(`/studios/${id}`)}
            />
          ))}
        </div>
      ) : (
        /* Empty State with CTA */
        <div className="p-12 text-center rounded-3xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 max-w-lg mx-auto my-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No Studios Found
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We couldn't find any studio workspaces matching your current search or price criteria. Try adjusting your parameters or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
