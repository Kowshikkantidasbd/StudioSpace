import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Server, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext.tsx';

export interface BackendFile {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface BackendFileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helpText?: string;
  presets?: { label: string; url: string }[];
}

export const BackendFileUpload: React.FC<BackendFileUploadProps> = ({
  label,
  value,
  onChange,
  required = false,
  helpText = 'Upload files directly to the server backend file system or select from storage.',
  presets = [],
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'storage' | 'link'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverFiles, setServerFiles] = useState<BackendFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [customUrl, setCustomUrl] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCustomUrl(value);
  }, [value]);

  // Load files from backend file system when storage tab is opened
  const fetchBackendFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch('/api/upload', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setServerFiles(data.files || []);
      } else {
        toast.error('Failed to load files from backend storage');
      }
    } catch {
      toast.error('Network error connecting to backend file system');
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'storage') {
      fetchBackendFiles();
    }
  }, [activeTab]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcessFile = (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload photos.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files (JPG, PNG, WebP, GIF, SVG) are permitted');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB maximum limit');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const reader = new FileReader();
    reader.onload = async () => {
      setUploadProgress(65);
      const dataUrl = reader.result as string;

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl,
            filename: file.name,
          }),
        });

        const result = await response.json();
        if (response.ok && result.file?.url) {
          setUploadProgress(100);
          onChange(result.file.url);
          toast.success(`Uploaded "${file.name}" to backend file system!`);
          if (activeTab === 'storage') {
            fetchBackendFiles();
          }
        } else {
          toast.error(result.error || 'Failed to save file to backend');
        }
      } catch (err) {
        toast.error('Upload failed due to network error');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      toast.error('Failed to read selected file from device');
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleProcessFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteBackendFile = async (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    if (!confirm(`Delete "${filename}" from server backend storage?`)) return;

    try {
      const res = await fetch(`/api/upload/${filename}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success(`File "${filename}" removed from backend`);
        setServerFiles(prev => prev.filter(f => f.filename !== filename));
        if (value.endsWith(filename)) {
          onChange('');
        }
      } else {
        toast.error('Failed to delete file from backend');
      }
    } catch {
      toast.error('Network error during file deletion');
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success('File URL copied to clipboard');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {helpText}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'storage'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Server Storage</span>
            {serverFiles.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[9px] rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold">
                {serverFiles.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Presets & URL</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Upload directly to backend file system */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-4 ring-indigo-500/10'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Click to select or drag & drop files here
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Saved directly to server storage (<code className="text-indigo-600 dark:text-indigo-400">/public/uploads/</code>) · Up to 10MB
                </p>
              </div>

              {isUploading && (
                <div className="w-full max-w-xs space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Uploading to backend storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Backend File System Storage Browser */}
      {activeTab === 'storage' && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Server Storage Files ({serverFiles.length})
              </span>
            </div>
            <button
              type="button"
              onClick={fetchBackendFiles}
              disabled={loadingFiles}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loadingFiles ? 'animate-spin' : ''}`} />
              <span>Refresh Storage</span>
            </button>
          </div>

          {loadingFiles ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-500" />
              <p>Reading backend storage directory...</p>
            </div>
          ) : serverFiles.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <AlertCircle className="w-6 h-6 mx-auto text-slate-400" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No files uploaded to backend yet
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload your first image using the "Upload File" tab above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
              {serverFiles.map((f) => {
                const isSelected = value === f.url;
                return (
                  <div
                    key={f.filename}
                    onClick={() => {
                      onChange(f.url);
                      toast.success(`Selected "${f.filename}"`);
                    }}
                    className={`group relative rounded-xl border overflow-hidden p-2 text-left transition-all cursor-pointer bg-white dark:bg-slate-800/90 ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 mb-2">
                      <img
                        src={f.url}
                        alt={f.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate" title={f.filename}>
                      {f.filename}
                    </p>
                    
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>{formatFileSize(f.size)}</span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteBackendFile(e, f.filename)}
                        title="Delete from server"
                        className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Presets & Custom URL Link */}
      {activeTab === 'link' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Direct Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  onChange(e.target.value);
                }}
                placeholder="https://... or /assets/..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  onChange(customUrl);
                  toast.success('Applied custom image link');
                }}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 dark:bg-slate-700 text-white cursor-pointer hover:bg-slate-900"
              >
                Apply
              </button>
            </div>
          </div>

          {presets.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Or select high-res studio preset:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presets.map((preset, idx) => {
                  const isSelected = value === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(preset.url);
                        toast.success(`Selected "${preset.label}"`);
                      }}
                      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full aspect-video object-cover" />
                      <p className="p-2 text-[10px] font-semibold text-slate-900 dark:text-slate-200 bg-white/95 dark:bg-slate-950/90 truncate">
                        {preset.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Selected Image Preview Card */}
      {value && (
        <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-xs flex items-center gap-3">
          <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
            <img src={value} alt="Current Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                Active Studio Image
              </span>
              {value.startsWith('/uploads/') && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  Backend File System
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate mt-1">
              {value}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleCopyLink(value)}
              title="Copy URL"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              title="Clear selection"
              className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
