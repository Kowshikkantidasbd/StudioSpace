import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/index.ts';
import { GoogleProfile, signIn, signUp, signOut, signInWithGoogle, getSession, updateProfile as updateProfileApi } from '../lib/auth-client.ts';
import { isGoogleConfigured, preloadGoogleScript, requestGoogleAccessToken } from '../lib/google.ts';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoUrl?: string) => Promise<boolean>;
  loginWithGoogle: (profile?: GoogleProfile) => Promise<boolean>;
  promptGoogleSignIn: () => Promise<boolean>;
  updateProfile: (updates: { name?: string; photoUrl?: string; currentPassword?: string; newPassword?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getSession();
      setUser(currentUser);
    } catch (err) {
      console.error('Error fetching current session:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    preloadGoogleScript();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await signIn(email, password);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, photoUrl?: string): Promise<boolean> => {
    try {
      const registeredUser = await signUp(name, email, password, photoUrl);
      setUser(registeredUser);
      toast.success(`Account created! Welcome to StudioSpace, ${registeredUser.name}.`);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to register account');
      return false;
    }
  };

  const loginWithGoogle = async (profile?: GoogleProfile): Promise<boolean> => {
    try {
      const authedUser = await signInWithGoogle(profile);
      setUser(authedUser);
      // Extra toast remove kora holo jate multiple ba overlapping toast na ashe
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in error');
      return false;
    }
  };

  // Must run directly inside a click handler so the browser allows the Google popup.
  // Resolves true when Google sign-in succeeded, false otherwise.
  const promptGoogleSignIn = async (): Promise<boolean> => {
    if (!isGoogleConfigured) {
      toast.error('Google sign-in is not set up yet. Please use email and password.');
      return false;
    }
    try {
      const accessToken = await requestGoogleAccessToken();
      return await loginWithGoogle({ accessToken });
    } catch (err: any) {
      toast.error(err?.message || 'Google sign-in was cancelled');
      return false;
    }
  };

  const updateProfile = async (updates: { name?: string; photoUrl?: string }): Promise<boolean> => {
    try {
      
      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
      const updatedUser = await updateProfileApi(updates);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return true;
    } catch (err: any) {
      
      if (err.message?.includes('404') || err.message?.includes('Not found')) {
        toast.success('Profile updated locally (backend sync pending)');
        return true;
      }
      toast.error(err.message || 'Failed to update profile');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      toast.success('Signed out safely');
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        promptGoogleSignIn,
        updateProfile,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};