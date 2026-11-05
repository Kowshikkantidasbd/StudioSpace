import React, { useRef, useState } from 'react';
import { UploadCloud, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleStudioUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const SimpleStudioUpload: React.FC<SimpleStudioUploadProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are permitted');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Photo cannot exceed 10MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            dataUrl: reader.result as string,
            filename: `studio_${file.name}`,
          }),
        });
        const data = await res.json();
        if (res.ok && data.file?.url) {
          onChange(data.file.url);
          toast.success('Photo uploaded!');
        } else {
          toast.error(data.error || 'Failed to upload photo');
        }
      } catch {
        toast.error('Network error during upload');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <UploadCloud className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </button>

      {value && (
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
          <img src={value} alt="Studio" className="w-20 h-14 rounded-lg object-cover" />
          <span className="flex-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">{value}</span>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
            title="Remove photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};