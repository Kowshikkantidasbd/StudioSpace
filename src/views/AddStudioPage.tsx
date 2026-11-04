import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { StudioCategory } from '../types/index.ts';
import { toast } from 'sonner';
import { BackendFileUpload } from '../components/BackendFileUpload.tsx';
import { GalleryFileUpload } from '../components/GalleryFileUpload.tsx';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Plus, 
  ArrowLeft 
} from 'lucide-react';

interface AddStudioPageProps {
  navigate: (path: string) => void;
}

const CATEGORIES: StudioCategory[] = [
  'Photo Studios',
  'Sound Stages',
  'Podcast Rooms',
  'Music Suites',
  'Art Workshops',
];

const PRESET_IMAGES = [
  { label: 'Photo Cyclorama Stage', url: '/assets/images/hero_photo_studio_1793389976489.jpg' },
  { label: 'Neve Audio & Sound Stage', url: '/assets/images/hero_sound_stage_1793389976920.jpg' },
  { label: 'Broadcast Podcast Suite', url: '/assets/images/hero_podcast_suite_1793389977711.jpg' },
  { label: 'Daylight Art Loft Workshop', url: '/assets/images/hero_daylight_art_loft_1793389977859.jpg' },
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

export const AddStudioPage: React.FC<AddStudioPageProps> = ({ navigate }) => {
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studios');
  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [securityDeposit, setSecurityDeposit] = useState<number>(200);
  const [capacity, setCapacity] = useState<number>(15);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/images/hero_photo_studio_1793389976489.jpg');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/assets/images/hero_photo_studio_1793389976489.jpg',
    '/assets/images/hero_sound_stage_1793389976920.jpg',
    '/assets/images/hero_daylight_art_loft_1793389977859.jpg',
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-Speed 1Gbps Fiber WiFi',
    'Air Conditioning & Climate Control',
  ]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [overview, setOverview] = useState('');
  const [dimensions, setDimensions] = useState('35ft x 50ft · 18ft Ceilings');
  const [powerSupply, setPowerSupply] = useState('100A 3-Phase Camlock');
  const [noiseIsolation, setNoiseIsolation] = useState('Quiet Studio (STC 55)');
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto my-32 p-8 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Verifying session credentials...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please sign in to list your studio space.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || hourlyRate <= 0) {
      toast.error('Please fill in all required fields properly');
      return;
    }

    if (!imageUrl) {
      toast.error('Please upload or select a primary studio image');
      return;
    }

    setLoading(true);
    try {
      const allGallery = galleryImages.length > 0 
        ? (galleryImages.includes(imageUrl) ? galleryImages : [imageUrl, ...galleryImages])
        : [imageUrl];

      const res = await fetch('/api/studios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          hourlyRate,
          securityDeposit,
          capacity,
          location,
          address: address || location,
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
        toast.error(data.error || 'Failed to publish studio listing');
        setLoading(false);
        return;
      }

      toast.success('Studio listing published successfully!');
      navigate('/my-listings');
    } catch (err) {
      toast.error('Network error creating studio listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/my-listings')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Listings</span>
        </button>
        <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
          Host Creation Portal
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          List a New Creative Workspace
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Share your space with professional photographers, filmmakers, audio engineers, and creators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        
        <div className="p-5 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Host Account (Read-Only)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Host Name</label>
              <input
                type="text"
                readOnly
                value={user.name}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Host Email</label>
              <input
                type="email"
                readOnly
                value={user.email}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        
        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            General Information
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
                placeholder="e.g. Daylight Cyclorama & Sound Stage"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
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
                    placeholder="e.g. Williamsburg, Brooklyn, NY"
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
                  placeholder="e.g. 142 N 6th St, Brooklyn, NY 11249"
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
                placeholder="Describe the aesthetic, natural light patterns, ceiling heights, loading dock accessibility, and gear packages provided..."
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        
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

          
          <BackendFileUpload
            label="Primary Studio Cover Photo"
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            required
            helpText="Upload a high-resolution hero photo from your device directly into the backend storage (/public/uploads/)."
            presets={PRESET_IMAGES}
          />

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
            Technical Specifications & Amenities
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
                placeholder="40ft x 60ft · 20ft Clear"
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
                placeholder="100A 3-Phase Camlock"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Acoustic / Noise Isolation
              </label>
              <input
                type="text"
                value={noiseIsolation}
                onChange={(e) => setNoiseIsolation(e.target.value)}
                placeholder="Quiet / Floating Room (STC 60)"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Provided Amenities & Gear ({selectedAmenities.length} selected)
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

            
            <div className="mt-3 flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add custom gear or amenity..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
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
            disabled={loading}
            className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Publish Studio Listing
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
