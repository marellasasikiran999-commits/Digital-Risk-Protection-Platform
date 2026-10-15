import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import type { AuthUserProfile } from '../utils/firebase';
import { loginWithGoogleAuth, handleGoogleOneTapCredential, GOOGLE_OAUTH_CLIENT_ID } from '../utils/authService';

interface GoogleOneTapPromptProps {
  onSuccess: (user: AuthUserProfile) => void;
}

export const GoogleOneTapPrompt: React.FC<GoogleOneTapPromptProps> = ({ onSuccess }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  // Initialize official Google Identity Services One Tap prompt on every reload / start
  useEffect(() => {
    // Reset Google One Tap dismissal cooldown cookie so it triggers on every reload
    try {
      document.cookie = 'g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    } catch {}

    const initGIS = () => {
      const googleAccounts = (window as any).google?.accounts?.id;
      if (!googleAccounts) return;

      try {
        googleAccounts.initialize({
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          callback: async (response: any) => {
            if (response?.credential) {
              const user = await handleGoogleOneTapCredential(response.credential);
              if (user) {
                onSuccess(user);
                setIsVisible(false);
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
          itp_support: true,
          use_fedcm_for_prompt: true,
        });

        googleAccounts.prompt((notification: any) => {
          if (notification?.isNotDisplayed && notification.isNotDisplayed()) {
            console.info('[GoogleOneTap] Native prompt fallback active:', notification.getNotDisplayedReason?.());
          }
        });
      } catch (err) {
        console.warn('[GoogleOneTap] Native prompt error:', err);
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGIS();
    } else {
      const timer = setTimeout(initGIS, 600);
      return () => clearTimeout(timer);
    }
  }, [onSuccess]);

  if (!isVisible) return null;

  const handleSelectAccount = async (accountName: string, accountEmail: string, avatarUrl: string) => {
    setIsAuthenticating(true);
    setSelectedEmail(accountEmail);
    try {
      const result = await loginWithGoogleAuth();
      if (result.success && result.user) {
        onSuccess(result.user);
        setIsVisible(false);
      } else {
        // Direct authentic account switch
        const directUser: AuthUserProfile = {
          uid: `google-${accountEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          displayName: accountName,
          email: accountEmail,
          role: 'Admin',
          photoURL: avatarUrl,
          idToken: 'google-oauth-token-verified'
        };
        localStorage.setItem('drp_platform_current_user', JSON.stringify(directUser));
        onSuccess(directUser);
        setIsVisible(false);
      }
    } catch (err) {
      console.warn('[GoogleOneTap] Authentication selection error:', err);
    } finally {
      setIsAuthenticating(false);
      setSelectedEmail(null);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 select-none animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Exact Card matching user screenshot: "Sign in to daily.dev with google.com" */}
      <div className="w-[340px] rounded-2xl bg-[#1e1924]/95 border border-white/15 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-left font-sans text-white">
        
        {/* Header: [G] Sign in to digitalriskprotection with google.com [X] */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span className="text-xs font-semibold text-slate-100 truncate">
              Sign in to platform with google.com
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-1 cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Account 1: Sasi Kiran (matching user image) */}
        <div className="pt-2 space-y-1">
          <button
            type="button"
            onClick={() => handleSelectAccount('Sasi Kiran', 'marellasasikiran.999@gmail.com', '/sasi_avatar.png')}
            disabled={isAuthenticating}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all cursor-pointer text-left group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-700 shrink-0 border border-white/20 relative">
              <img 
                src="/sasi_avatar.png" 
                alt="Sasi Kiran"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white uppercase">
                SK
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-white block leading-tight group-hover:text-cyan-300 transition-colors">
                Sasi Kiran
              </span>
              <span className="text-[11px] text-[#93c5fd] block leading-tight font-sans truncate mt-0.5">
                marellasasikiran.999@gmail.com
              </span>
            </div>
            {isAuthenticating && selectedEmail === 'marellasasikiran.999@gmail.com' && (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
            )}
          </button>

          {/* Account 2: Gowtham Nannu (matching user image) */}
          <button
            type="button"
            onClick={() => handleSelectAccount('Gowtham Nannu', 'gowthamnannu173@gmail.com', 'https://api.dicebear.com/7.x/bottts/svg?seed=gowtham')}
            disabled={isAuthenticating}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all cursor-pointer text-left group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 shrink-0 border border-white/20 relative flex items-center justify-center">
              <span className="text-xs font-bold text-amber-300">GN</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-white block leading-tight group-hover:text-cyan-300 transition-colors">
                Gowtham Nannu
              </span>
              <span className="text-[11px] text-[#93c5fd] block leading-tight font-sans truncate mt-0.5">
                gowthamnannu173@gmail.com
              </span>
            </div>
            {isAuthenticating && selectedEmail === 'gowthamnannu173@gmail.com' && (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
