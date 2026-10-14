import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Palette, Check, ShieldAlert, CheckCheck, Trash2 } from 'lucide-react';
import type { AuthUserProfile } from '../utils/firebase';

interface SecurityNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  read: boolean;
}

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

  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<SecurityNotification[]>([
    {
      id: 'n-1',
      title: 'Cyrillic Homoglyph Detected',
      message: 'Spoofed phishing domain drp-plаtform.com (U+0430 confusable) registered.',
      time: '12m ago',
      severity: 'critical',
      read: false
    },
    {
      id: 'n-2',
      title: 'Counterfeit APK Mirror Active',
      message: 'Trojan-Banker clone com.fake.drp.rewards discovered on APKPure mirror.',
      time: '34m ago',
      severity: 'critical',
      read: false
    },
    {
      id: 'n-3',
      title: 'Social Impersonation Alert',
      message: 'Fraudulent support account @drp_support24 flagged on Instagram.',
      time: '1h ago',
      severity: 'high',
      read: false
    },
    {
      id: 'n-4',
      title: 'Automated DMCA Dispatched',
      message: 'Registrar cease-and-desist packet compiled and sent to bulletproof host.',
      time: '2h ago',
      severity: 'info',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('drp-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    if (isThemeMenuOpen || isNotifMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeMenuOpen, isNotifMenuOpen]);

  const themes = [
    { id: 'cyber-obsidian', name: 'Cyber Obsidian', color: 'bg-cyan-400', desc: 'Electric Cyan & Deep Blue' },
    { id: 'midnight-violet', name: 'Midnight Violet', color: 'bg-purple-500', desc: 'Royal Indigo & Neon Purple' },
    { id: 'sentinel-emerald', name: 'Sentinel Emerald', color: 'bg-emerald-400', desc: 'Matrix Emerald & Teal' },
    { id: 'crimson-strike', name: 'Crimson Strike', color: 'bg-rose-500', desc: 'Blood Rose & Incident Red' },
  ];

  const initials = currentUser.displayName 
    ? currentUser.displayName.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : (currentUser.email ? currentUser.email.slice(0, 2).toUpperCase() : 'SA');

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
            className="p-2.5 text-slate-300 hover:text-white rounded-xl glass-btn border border-[var(--border-color)] hover:border-[var(--border-highlight)] transition-all shadow-sm flex items-center gap-2 text-xs font-mono"
            title="Theme Palette Presets"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline capitalize">{theme.replace('-', ' ')}</span>
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel border border-white/10 rounded-xl shadow-2xl p-2 z-50 space-y-1 font-sans backdrop-blur-2xl">
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

        {/* Notifications with interactive badge & dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl glass-btn border border-[var(--border-color)] hover:border-slate-700 transition-all shadow-sm relative"
            title="Active Intelligence Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-rose-500/40 border border-[#080d1a] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl font-sans">
              <div className="p-3.5 border-b border-[var(--border-color)] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 theme-accent-text" />
                  <span className="text-xs font-bold text-white tracking-wide">Threat Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white text-[10px] flex items-center gap-1 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3 h-3 text-cyan-400" />
                      <span>Read all</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-rose-400 transition-colors"
                      title="Clear notifications"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs font-mono">
                    No active threat notifications. All perimeters secure.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => toggleNotificationRead(notif.id)}
                      className={`p-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer flex items-start gap-3 text-left ${
                        !notif.read ? 'bg-white/[0.02]' : 'opacity-70'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        notif.severity === 'critical' ? 'bg-rose-500 shadow-sm shadow-rose-500/50' :
                        notif.severity === 'high' ? 'bg-amber-400 shadow-sm shadow-amber-400/50' :
                        'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                      } ${!notif.read ? 'animate-pulse' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[var(--border-color)] bg-white/[0.01] text-center">
                <span className="text-[10px] font-mono text-slate-500">
                  Real-Time SOC Event Stream Active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-xl glass-btn border border-[var(--border-color)] hover:border-[var(--border-highlight)] transition-all text-left shadow-sm group"
          title="Firebase Account & Team Role"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 p-[1.5px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-[#0d1527] rounded-[6px] flex items-center justify-center font-black text-xs text-blue-300 font-cyber overflow-hidden relative">
                <span className="select-none">{initials}</span>
                {currentUser.photoURL && (
                  <img 
                    src={currentUser.photoURL} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover rounded-[5px]" 
                  />
                )}
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#080d1a]"></span>
          </div>

          <div className="hidden sm:block">
            <span className="text-xs font-bold text-white block leading-tight group-hover:text-blue-300 transition-colors">
              {currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Security Admin')}
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
