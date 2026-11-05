import React, { useState, useRef } from 'react';
import { UploadCloud, Trash2, Plus, Image as ImageIcon, Check, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext.tsx';

interface GalleryFileUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  mainImageUrl: string;
  onSetMainImage: (url: string) => void;
}

export const GalleryFileUpload: React.FC<GalleryFileUploadProps> = ({
  images,
  onChange,
  mainImageUrl,
  onSetMainImage,
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload photos.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are permitted');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size cannot exceed 10MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: reader.result as string,
            filename: file.name,
          }),
        });
        const data = await res.json();
        if (res.ok && data.file?.url) {
          onChange([...images, data.file.url]);
          toast.success(`Added "${file.name}" to gallery`);
        } else {
          toast.error(data.error || 'Failed to upload photo to backend');
        }
      } catch {
        toast.error('Upload failed');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    toast.info('Image removed from gallery');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
            Studio Gallery Showcase (Multiple Photos)
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Upload multiple photos to the backend file system for guests to tour your space.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Uploading...' : 'Add Gallery Photo'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadImage(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((imgUrl, idx) => {
          const isMain = mainImageUrl === imgUrl;
          return (
            <div
              key={idx}
              className={`group relative rounded-xl border overflow-hidden p-1.5 transition-all bg-white dark:bg-slate-800/90 ${
                isMain
                  ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                {isMain && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-indigo-600 text-white flex items-center gap-1 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Cover
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1.5 px-1">
                <button
                  type="button"
                  onClick={() => {
                    onSetMainImage(imgUrl);
                    toast.success('Set as primary cover image');
                  }}
                  className={`text-[10px] font-medium transition-colors cursor-pointer ${
                    isMain
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {isMain ? 'Current Cover' : 'Set as Cover'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Upload Placeholder Slot */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 aspect-video flex flex-col items-center justify-center p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <UploadCloud className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">Upload Photo</span>
        </button>
      </div>
    </div>
  );
};
