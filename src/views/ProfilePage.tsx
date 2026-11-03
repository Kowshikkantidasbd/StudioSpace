import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Mail, User as UserIcon, Image as ImageIcon, Save, ArrowLeft, ArrowRight, Upload, ShieldAlert, Key } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePageProps {
  navigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/60 to-indigo-900">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/60 to-indigo-900 px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-800/60 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl text-center">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please sign in to view and edit your profile.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer shadow-lg shadow-indigo-500/30"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ dataUrl: base64String, filename: file.name }),
          });
          const data = await res.json();
          if (res.ok && data.file?.url) {
            setPhotoUrl(data.file.url);
            toast.success('Image uploaded successfully! Click Save Changes.');
          } else {
            toast.error(data.error || 'Failed to upload image');
          }
        } catch (err) {
          toast.error('Image upload failed');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword && !currentPassword) {
      toast.error('Please enter your current password to set a new password');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const success = await updateProfile({
        name: name.trim() || user.name,
        photoUrl: photoUrl.trim() || undefined,
        currentPassword: currentPassword.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });

      if (success) {
        toast.success('Profile updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <UserIcon className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              Profile Settings
            </h1>
            <p className="text-sm text-slate-400">
              Update your account information and password below.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Profile Photo
                </label>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={
                    photoUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
                  }
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border border-slate-700 bg-slate-800"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="w-full px-3 py-2 text-xs text-slate-300 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
                  />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-500" />
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 text-xs text-white bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
              </div>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-3 text-xs text-slate-400 bg-slate-800/30 border border-slate-700/60 rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Change Password (Optional)
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 text-xs text-white bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full px-4 py-3 text-xs text-white bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl font-semibold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};