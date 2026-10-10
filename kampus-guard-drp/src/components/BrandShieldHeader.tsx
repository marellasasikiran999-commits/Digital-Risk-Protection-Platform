import React from 'react';
import { Search, Bell } from 'lucide-react';
import type { AuthUserProfile } from '../utils/firebase';

interface BrandShieldHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: AuthUserProfile;
  onOpenAuthModal: () => void;
}

export const BrandShieldHeader: React.FC<BrandShieldHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuthModal
}) => {
  const initials = currentUser.displayName 
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'SA';

  return (
    <header className="h-16 bg-[#0a0f1d] border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-xl">
      {/* Search Input matching screenshot */}
      <div className="flex items-center gap-2.5 bg-[#101726] border border-slate-800 rounded-xl px-3.5 py-2 w-full max-w-md focus-within:border-blue-500 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search brand, account, app, domain..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono"
        />
        <span className="text-[10px] text-slate-500 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60 hidden sm:inline">
          Ctrl + K
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Notifications with badge 3 */}
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
            3
          </span>
        </div>

        {/* User Profile: Security Admin */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#121b2d] border border-transparent hover:border-slate-800 transition-all text-left"
          title="Firebase Account & Credentials"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-600/30">
            {initials}
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-white block leading-tight">{currentUser.displayName || 'Security Admin'}</span>
            <span className="text-[10px] text-slate-400 block leading-tight font-mono">{currentUser.role || 'Admin'} (Firebase)</span>
          </div>
        </button>
      </div>
    </header>
  );
};
