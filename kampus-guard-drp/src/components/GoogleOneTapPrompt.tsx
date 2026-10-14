import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { AuthUserProfile } from '../utils/firebase';

interface GoogleOneTapPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: AuthUserProfile) => void;
  currentUser?: AuthUserProfile | null;
}

export const GoogleOneTapPrompt: React.FC<GoogleOneTapPromptProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  currentUser
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Gentle slide-in delay
      const timer = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  const accounts: AuthUserProfile[] = [
    {
      uid: 'google-sasi-kiran-999',
      displayName: 'Sasi Kiran',
      email: 'marellasasikiran.999@gmail.com',
      role: 'Admin',
      photoURL: '/sasi_avatar.png'
    },
    {
      uid: 'google-qiscet-sasi-kiran',
      displayName: '24491A4727 MARELLA SASI KIRAN',
      email: '24491a4727@qiscet.edu.in',
      role: 'Admin',
      photoURL: '/college_avatar.png'
    }
  ];

  const handleAccountClick = (acc: AuthUserProfile) => {
    localStorage.setItem('drp_platform_current_user', JSON.stringify(acc));
    onSelectUser(acc);
    onClose();
  };

  return (
    <aside 
      aria-label="Google Sign In Prompt"
      className={`fixed top-4 right-4 sm:right-6 z-[60] w-[340px] sm:w-[370px] transition-all duration-500 transform ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-[#1e1b22] border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden font-sans backdrop-blur-xl">
        {/* Header matching Google One Tap top bar */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#17141b]/80">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Google G Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span className="text-xs font-medium text-slate-200 truncate">
              Sign in to Digital Risk Protection with google.com
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Selection List */}
        <div className="divide-y divide-white/5 py-1">
          {accounts.map((acc) => {
            const isCurrentlyActive = currentUser?.email === acc.email;

            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleAccountClick(acc)}
                className="w-full px-4 py-3 text-left flex items-center gap-3.5 hover:bg-white/[0.06] transition-colors group cursor-pointer"
              >
                {/* Account Avatar */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-white/20 flex items-center justify-center shadow-sm">
                    {acc.photoURL ? (
                      <img 
                        src={acc.photoURL} 
                        alt={acc.displayName} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-xs font-bold text-white font-mono">
                        {acc.displayName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {isCurrentlyActive && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1e1b22]" />
                  )}
                </div>

                {/* Account Details */}
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-white block truncate group-hover:text-cyan-300 transition-colors">
                    {acc.displayName}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate font-sans">
                    {acc.email}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info matching Google prompt */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#17141b]/60 flex items-center justify-between text-[10px] text-slate-400 font-sans">
          <span>Google Identity Services</span>
          <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
      </div>
    </aside>
  );
};
