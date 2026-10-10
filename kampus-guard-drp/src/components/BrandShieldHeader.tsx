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
    <header className="h-16 bg-[#080d1a]/80 border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-2xl">
      {/* Search Input with Linear/Vercel style focus glow */}
      <div className="flex items-center gap-2.5 bg-[#0d1527]/70 border border-slate-800/90 rounded-xl px-3.5 py-2 w-full max-w-md focus-within:border-blue-500/80 focus-within:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search protected brand, imposter handle, domain, APK..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-cyber selection:bg-blue-600"
        />
        <span className="text-[10px] text-slate-400 font-cyber bg-[#131d33] px-2 py-0.5 rounded-md border border-slate-700/60 hidden sm:inline shadow-sm">
          ⌘K
        </span>
      </div>

      {/* Center Live Radar Indicator */}
      <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-cyber shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="tracking-wide font-semibold">GLOBAL DEFENSE MATRIX ACTIVE</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400 text-[10px]">0ms Latency</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3.5">
        {/* Notifications with badge */}
        <div className="relative">
          <button 
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-[#0d1527]/50 hover:bg-[#131d33] border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm"
            title="Active Intelligence Alerts"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-rose-500/40 border border-[#080d1a]">
            3
          </span>
        </div>

        {/* User Profile Card */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-[#0d1527]/50 hover:bg-[#131d33] border border-slate-800/80 hover:border-blue-500/40 transition-all text-left shadow-sm group"
          title="Firebase Account & Team Role"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 p-[1.5px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-[#0d1527] rounded-[6px] flex items-center justify-center font-black text-xs text-blue-300 font-cyber">
                {initials}
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#080d1a]"></span>
          </div>

          <div className="hidden sm:block">
            <span className="text-xs font-bold text-white block leading-tight group-hover:text-blue-300 transition-colors">
              {currentUser.displayName || 'Security Admin'}
            </span>
            <span className="text-[10px] text-slate-400 block leading-tight font-cyber">
              {currentUser.role || 'Admin'} • <span className="text-emerald-400">Online</span>
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
