import React, { useState, useEffect } from 'react';
import { Studio } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal.tsx';
import { toast } from 'sonner';
import { 
  Building2, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  MapPin, 
  Star 
} from 'lucide-react';

interface MyListingsPageProps {
  navigate: (path: string) => void;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({ navigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('/api/my-listings');
      if (res.ok) {
        const data = await res.json();
        setListings(data.studios || []);
      }
    } catch (err) {
      console.error('Error fetching user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyListings();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto my-32 p-8 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading your creator dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In Required</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please sign in to view and manage your studio listings.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleDeleteConfirm = async () => {
    if (!studioToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/studios/${studioToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete listing');
        setDeleting(false);
        return;
      }

      toast.success('Listing permanently removed from StudioSpace');
      setListings(prev => prev.filter(s => s.id !== studioToDelete.id));
      setDeleteModalOpen(false);
      setStudioToDelete(null);
    } catch (err) {
      toast.error('Network error during deletion');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">
            Host Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            My Studio Listings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Manage your peer-to-peer workspace availability, pricing, and details.
          </p>
        </div>

        <button
          onClick={() => navigate('/add-studio')}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Studio</span>
        </button>
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading your studio listings...
        </div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <span className="col-span-5">Studio Space</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-2">Hourly Rate</span>
            <span className="col-span-1">Capacity</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {listings.map(studio => (
            <div
              key={studio.id}
              className="p-5 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-4 items-center transition-all hover:border-slate-400 dark:hover:border-slate-600"
            >
              {/* Studio Info */}
              <div className="lg:col-span-5 flex items-center gap-3 sm:gap-4">
                <img
                  src={studio.imageUrl}
                  alt={studio.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-16 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {studio.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{studio.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 dark:text-amber-400 mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{studio.rating.toFixed(1)}</span>
                    <span className="text-slate-400 dark:text-slate-500">({studio.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Mobile details cluster */}
              <div className="flex lg:contents items-center justify-between border-t border-b lg:border-none py-2.5 lg:py-0 border-slate-100 dark:border-slate-700/60">
                {/* Category */}
                <div className="lg:col-span-2 text-xs">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                    {studio.category}
                  </span>
                </div>

                {/* Hourly Rate */}
                <div className="lg:col-span-2 text-xs">
                  <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1 text-xs">/ hr</span>
                </div>

                {/* Capacity */}
                <div className="lg:col-span-1 text-xs text-slate-600 dark:text-slate-300">
                  {studio.capacity} guests
                </div>
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 flex items-center justify-end gap-2 pt-1 lg:pt-0">
                <button
                  onClick={() => navigate(`/studios/${studio.id}`)}
                  title="View Public Listing"
                  className="flex-1 sm:flex-none p-2 sm:px-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/studios/edit/${studio.id}`)}
                  title="Edit Listing"
                  className="flex-1 sm:flex-none p-2 sm:px-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setStudioToDelete(studio);
                    setDeleteModalOpen(true);
                  }}
                  title="Delete Listing"
                  className="flex-1 sm:flex-none p-2 sm:px-2.5 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 max-w-lg mx-auto my-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No Active Studio Listings
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You haven't listed any creative workspaces on StudioSpace yet. Publish your photography stage, audio suite, or art loft to start receiving reservations.
          </p>
          <button
            onClick={() => navigate('/add-studio')}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Publish Your First Studio
          </button>
        </div>
      )}

      {/* Confirmation Modal Before Deleting */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        title="Delete Studio Listing?"
        itemDescription={studioToDelete ? `Are you sure you want to permanently delete "${studioToDelete.title}"? This listing will be instantly removed from search and direct links.` : ''}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setDeleteModalOpen(false);
          setStudioToDelete(null);
        }}
      />

    </div>
  );
};
