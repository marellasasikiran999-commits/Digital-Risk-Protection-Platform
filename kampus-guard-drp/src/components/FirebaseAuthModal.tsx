import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import { 
  logoutUser, 
  getCurrentUserProfile, 
  type AuthUserProfile 
} from '../utils/firebase';
import { 
  loginWithGoogleAuth, 
  subscribeToAuthLifecycle 
} from '../utils/authService';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthChange: (user: AuthUserProfile) => void;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthChange 
}) => {
  const [user, setUser] = useState<AuthUserProfile>(() => getCurrentUserProfile());
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  // Determine if user has logged in with an authentic Google identity
  const isGoogleUser = Boolean(
    user && 
    user.uid && 
    (user.idToken || user.photoURL?.includes('googleusercontent.com') || (user as any).provider === 'google.com')
  );

  useEffect(() => {
    if (isOpen) {
      setUser(getCurrentUserProfile());
      setStatusMessage(null);
    }
  }, [isOpen]);

  // Subscribe to Firebase Authentication state changes
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeToAuthLifecycle((authUser) => {
      if (!isMounted) return;
      if (authUser) {
        setUser(authUser);
        onAuthChange(authUser);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [onAuthChange]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const result = await loginWithGoogleAuth();
      if (result.success && result.user) {
        setUser(result.user);
        onAuthChange(result.user);
        setStatusMessage({ 
          text: `Signed in as ${result.user.displayName}`, 
          isError: false 
        });
        setTimeout(() => {
          onClose();
        }, 650);
      } else if (result.cancelled) {
        setStatusMessage({ text: result.error || 'Google Sign-in was cancelled.', isError: false });
      } else {
        setStatusMessage({ text: result.error || 'Google Authentication error.', isError: true });
      }
    } catch (err: any) {
      console.warn('[FirebaseAuthModal] Unexpected error during Google authentication:', err);
      setStatusMessage({ text: err?.message || 'Authentication error', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    const defaultUser = getCurrentUserProfile();
    setUser(defaultUser);
    onAuthChange(defaultUser);
    setStatusMessage({ text: 'Signed out successfully.', isError: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Exact Card Design matching User Specification */}
      <div className="relative w-full max-w-[390px] rounded-3xl bg-[#0c0d10] border border-white/10 p-8 pt-9 pb-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col items-center text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Heading: "Welcome back" */}
        <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
          Welcome back
        </h2>
        <p className="text-sm text-slate-400 mt-1.5 mb-7 font-sans">
          Sign in to your account
        </p>

        {/* Status Message Notification */}
        {statusMessage && (
          <div className={`w-full mb-5 p-3 rounded-2xl text-xs flex items-center justify-center gap-2 border font-medium ${
            statusMessage.isError 
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {statusMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span className="truncate">{statusMessage.text}</span>
          </div>
        )}

        {/* Exact Button: [ G Continue with Google ] */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-[#26262a] hover:bg-[#323238] active:scale-[0.98] text-white text-sm font-medium flex items-center justify-center gap-3 transition-all border border-white/10 shadow-lg cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Connecting Google popup...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Connected Google Session Details (if authenticated) */}
        {isGoogleUser && (
          <div className="w-full mt-6 pt-5 border-t border-white/10 flex flex-col items-center">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.04] border border-white/5 w-full mb-3 text-left">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 shrink-0 flex items-center justify-center font-bold text-white text-xs">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span>{user.displayName?.[0] || 'U'}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{user.displayName}</div>
                <div className="text-[10px] text-slate-400 truncate font-mono">{user.email}</div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Connected"></span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out / Switch account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
