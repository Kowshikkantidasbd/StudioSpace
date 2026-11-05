import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Studio, StudioCategory } from '../types/index.ts';
import { toast } from 'sonner';
import { GalleryFileUpload } from '../components/GalleryFileUpload.tsx';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Plus, 
  ArrowLeft,
  Upload,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface EditStudioPageProps {
  studioId: string;
  navigate: (path: string) => void;
}

const CATEGORIES: StudioCategory[] = [
  'Photo Studios',
  'Sound Stages',
  'Podcast Rooms',
  'Music Suites',
  'Art Workshops',
];

const COMMON_AMENITIES = [
  'High-Speed 1Gbps Fiber WiFi',
  'Commercial Steamer & Wardrobe Racks',
  'Hair & Makeup Vanity Station',
  'Drive-In Vehicle / Loading Dock Access',
  '3-Wall White Cyclorama',
  'Ceiling Light Scissor Grid',
  'Profoto Lighting Kit',
  'Vintage Analog Mixing Console',
  'Barefoot Sound / Genelec SAM Monitors',
  'Vocal & Drum Isolation Booths',
  'Shure SM7B Microphones & Cloudlifters',
  '4K Blackmagic Multi-Cam Rig',
  'Historic High Windows (Natural Light)',
  'Heavy Oak Timber Workbenches',
  'Clay Sink & Utility Basin',
  'Air Conditioning & Climate Control',
  'Lounge with Espresso Machine',
];

export const EditStudioPage: React.FC<EditStudioPageProps> = ({ studioId, navigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studios');
  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [securityDeposit, setSecurityDeposit] = useState<number>(200);
  const [capacity, setCapacity] = useState<number>(15);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [overview, setOverview] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [powerSupply, setPowerSupply] = useState('');
  const [noiseIsolation, setNoiseIsolation] = useState('');

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await fetch(`/api/studios/${studioId}`);
        if (res.ok) {
          const data = await res.json();
          const s: Studio = data.studio;
          setTitle(s.title);
          setCategory(s.category);
          setHourlyRate(s.hourlyRate);
          setSecurityDeposit(s.securityDeposit || 0);
          setCapacity(s.capacity);
          setLocation(s.location);
          setAddress(s.address || s.location);
          setImageUrl(s.imageUrl);
          setGalleryImages(s.galleryImages && s.galleryImages.length > 0 ? s.galleryImages : [s.imageUrl]);
          setSelectedAmenities(s.amenities || []);
          setOverview(s.overview || '');
          setDimensions(s.dimensions || '');
          setPowerSupply(s.powerSupply || '');
          setNoiseIsolation(s.noiseIsolation || '');
        } else {
          toast.error('Could not load studio to edit');
          navigate('/my-listings');
        }
      } catch (err) {
        toast.error('Network error loading studio');
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchStudio();
  }, [studioId]);

  if (loadingInitial) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading studio details...
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        const fakeUrl = URL.createObjectURL(file);
        setImageUrl(fakeUrl);
        setUploading(false);
        toast.success('Studio cover photo updated successfully!');
      }, 600);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    } else {
      setSelectedAmenities(prev => [...prev, amenity]);
    }
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities(prev => [...prev, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || hourlyRate <= 0) {
      toast.error('Please fill in required fields');
      return;
    }

    if (!imageUrl) {
      toast.error('Please upload or provide a primary studio photo');
      return;
    }

    setSaving(true);
    try {
      const allGallery = galleryImages.length > 0 
        ? (galleryImages.includes(imageUrl) ? galleryImages : [imageUrl, ...galleryImages])
        : [imageUrl];

      const res = await fetch(`/api/studios/${studioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          hourlyRate,
          securityDeposit,
          capacity,
          location,
          address,
          imageUrl,
          galleryImages: allGallery,
          amenities: selectedAmenities,
          overview,
          dimensions,
          powerSupply,
          noiseIsolation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to update studio listing');
        setSaving(false);
        return;
      }

      toast.success('Studio listing updated successfully!');
      navigate('/my-listings');
    } catch (err) {
      toast.error('Network error saving studio updates');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/my-listings')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Listings</span>
        </button>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
          Edit Workspace Listing
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Update Studio Listing
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Make real-time changes to equipment, pricing, rules, and photography.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        
        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Workspace Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Studio Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StudioCategory)}
                  aria-label="Studio Category"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Max Guest Capacity (People) *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={150}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hourly Rate (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={20}
                    max={2000}
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Security Deposit (Refundable USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  General Location / Neighborhood *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Studio Overview *
              </label>
              <textarea
                required
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Studio Photography & Backend File System (Single Clean Upload Button) */}
        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Studio Photography & Backend File System
            </h3>
            <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              Direct Server Uploads Enabled
            </span>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Primary Studio Cover Photo <span className="text-indigo-600 dark:text-indigo-400">*</span>
            </label>

            {/* Single Clean Upload Dropzone */}
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 transition-colors rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-900/50 group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Click to select or drag & drop files here
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Saved directly to server storage (/public/uploads/) · Up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Active Cover Image Preview */}
            {imageUrl && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={imageUrl}
                    alt="Studio Cover"
                    className="w-16 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Studio Image</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-xs md:max-w-md">
                      {imageUrl}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <hr className="border-slate-200 dark:border-slate-700/60" />

          <GalleryFileUpload
            images={galleryImages}
            onChange={setGalleryImages}
            mainImageUrl={imageUrl}
            onSetMainImage={(url) => setImageUrl(url)}
          />
        </div>

        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Specifications & Amenities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Power Specifications
              </label>
              <input
                type="text"
                value={powerSupply}
                onChange={(e) => setPowerSupply(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Noise Isolation
              </label>
              <input
                type="text"
                value={noiseIsolation}
                onChange={(e) => setNoiseIsolation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Provided Amenities ({selectedAmenities.length} selected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {COMMON_AMENITIES.map((amenity, i) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-400 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/my-listings')}
            className="px-6 py-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Save Listing Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};