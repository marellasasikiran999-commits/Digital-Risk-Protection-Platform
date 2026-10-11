import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Palette, Check } from 'lucide-react';
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
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('drp-theme') || 'cyber-obsidian';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('drp-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeMenuOpen]);

  const themes = [
    { id: 'cyber-obsidian', name: 'Cyber Obsidian', color: 'bg-cyan-400', desc: 'Electric Cyan & Deep Blue' },
    { id: 'midnight-violet', name: 'Midnight Violet', color: 'bg-purple-500', desc: 'Royal Indigo & Neon Purple' },
    { id: 'sentinel-emerald', name: 'Sentinel Emerald', color: 'bg-emerald-400', desc: 'Matrix Emerald & Teal' },
    { id: 'crimson-strike', name: 'Crimson Strike', color: 'bg-rose-500', desc: 'Blood Rose & Incident Red' },
  ];

  const initials = currentUser.displayName 
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'SA';

  return (
    <header className="h-16 bg-[var(--bg-header)]/90 border-b border-[var(--border-color)] px-6 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-2xl transition-colors duration-300">
      {/* Search Input with Linear/Vercel style focus glow */}
      <div className="flex items-center gap-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 w-full max-w-md focus-within:border-[var(--border-highlight)] focus-within:shadow-[0_0_15px_-3px_var(--accent-glow)] transition-all">
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
      <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="tracking-wide font-semibold">SURVEILLANCE SURFACES ACTIVE</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400 text-[10px]">0% False-Positive Filter Engaged</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3.5">
        {/* Dynamic Theme Preset Switcher */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-[var(--border-highlight)] transition-all shadow-sm flex items-center gap-2 text-xs font-mono"
            title="Theme Palette Presets"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline capitalize">{theme.replace('-', ' ')}</span>
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-2 z-50 space-y-1 font-sans backdrop-blur-2xl">
              <span className="text-[10px] font-mono text-slate-400 px-2 py-1 block uppercase tracking-wider">
                Cyber Defense Themes
              </span>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    theme === t.id
                      ? 'bg-blue-600/20 text-white border border-[var(--border-highlight)]'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    <div className="text-left">
                      <span className="block">{t.name}</span>
                      <span className="text-[9px] text-slate-400 block">{t.desc}</span>
                    </div>
                  </div>
                  {theme === t.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications with badge */}
        <div className="relative">
          <button 
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-slate-700 transition-all shadow-sm"
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
          className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-[var(--border-highlight)] transition-all text-left shadow-sm group"
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
