import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { User, Mail, Lock, Image as ImageIcon, UserPlus, ArrowRight, Check, X, UploadCloud, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register, promptGoogleSignIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are permitted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar file cannot exceed 5MB');
      return;
    }
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: reader.result as string,
            filename: `avatar_${file.name}`,
          }),
        });
        const data = await res.json();
        if (res.ok && data.file?.url) {
          setPhotoUrl(data.file.url);
          toast.success('Avatar uploaded to backend file system!');
        } else {
          toast.error(data.error || 'Failed to upload avatar');
        }
      } catch {
        toast.error('Network error during avatar upload');
      } finally {
        setUploadingAvatar(false);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Password validation rules
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isPasswordValid) {
      const err = 'Password must be at least 6 characters with at least 1 uppercase and 1 lowercase letter.';
      setFormError(err);
      toast.error(err);
      return;
    }

    setLoading(true);
    const success = await register(name, email, password, photoUrl);
    setLoading(false);
    if (success) {
      toast.success('Registration successful! Please sign in with your credentials.');
      navigate('/login');
    } else {
      setFormError('Failed to create account. Email may already be in use.');
    }
  };

  const handleGoogle = () => {
    promptGoogleSignIn();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl p-8 border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-2xl">
        
        {/* Brand Lockup */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/30 dark:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Create Creator Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join StudioSpace to book creative workspaces or monetize your studio
          </p>
        </div>

        {/* Inline Error Message */}
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
            {formError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Chen"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@agency.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Profile Photo (Upload or URL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Profile Photo (Optional)
              </label>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{uploadingAvatar ? 'Uploading...' : 'Upload File'}</span>
              </button>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAvatarFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Upload file above or paste image link"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {photoUrl && (
              <div className="mt-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={photoUrl} alt="Avatar Preview" className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                    {photoUrl.startsWith('/uploads/') ? 'Stored in backend file system' : photoUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                  title="Remove avatar"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Strict Password Validation Checklist */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-[11px]">
              <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Password Requirements:</span>
              
              <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>Minimum 6 characters</span>
              </div>

              <div className={`flex items-center gap-2 ${hasUpperCase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                {hasUpperCase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>At least 1 uppercase letter (A-Z)</span>
              </div>

              <div className={`flex items-center gap-2 ${hasLowerCase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                {hasLowerCase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>At least 1 lowercase letter (a-z)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-[11px] uppercase tracking-wider text-slate-400">or sign up with</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Google Social Button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Register with Google</span>
        </button>

        {/* Link to Login */}
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>

      </div>
    </div>
  );
};
