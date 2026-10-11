import React from 'react';
import { 
  Globe, Smartphone, User, Edit3, CheckCircle, ExternalLink,
  ShieldCheck, Zap, Activity
} from 'lucide-react';
import type { Brand } from '../utils/api';
import { HologramShield3D } from './3d/HologramShield3D';
import { ScrollReveal } from './ui/ScrollReveal';

interface BrandHeroCardProps {
  currentBrand: Brand | null;
  onEditProfile: () => void;
  onRunScan: () => void;
  isScanning: boolean;
}

export const BrandHeroCard: React.FC<BrandHeroCardProps> = ({
  currentBrand,
  onEditProfile,
  onRunScan,
  isScanning
}) => {
  const brandName = currentBrand?.brand_name || 'Digital Risk Protection Platform';
  const website = currentBrand?.official_website || 'www.digitalriskprotection.com';
  const appName = currentBrand?.official_apps?.[0] || 'DRP Official App';
  const publisher = currentBrand?.official_developer || 'Digital Risk Protection Platform';

  return (
    <ScrollReveal direction="up" distance={24} duration={750}>
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl group transition-colors duration-300">
        {/* Gradient glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--accent-glow-1)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--accent-glow-2)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border-highlight)] to-transparent" />
        
        {/* Top HUD bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border-color)] relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--accent-primary)]/60" />
            <span className="text-[10px] font-mono theme-accent-text tracking-[0.2em] uppercase font-bold">01 // Executive Brand Perimeter</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold">Perimeter Active</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 hidden sm:inline">Latency: <span className="text-cyan-400 font-bold">14ms</span></span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-blue-300 hidden sm:inline font-bold">LIVE</span>
          </div>
        </div>

        <div className="p-6 relative z-10">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
            
            {/* LEFT: Brand Identity */}
            <div className="flex items-start gap-5 flex-1 min-w-0">
              {/* 3D Shield Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-xl shadow-blue-500/30 shrink-0" style={{ filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.4))' }}>
                <div className="w-full h-full bg-[#080e1e] rounded-[14px] flex items-center justify-center overflow-hidden">
                  <HologramShield3D size={56} />
                </div>
              </div>

              <div className="space-y-2.5 min-w-0">
                {/* VERIFIED badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
                  <CheckCircle className="w-3 h-3" />
                  VERIFIED BASELINE ACTIVE
                </div>

                {/* Main Brand Name — big, bold, impressive */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
                  {brandName}
                </h1>

                <p className="text-sm text-slate-400 max-w-2xl leading-relaxed hidden sm:block">
                  External attack surface surveillance protecting registered domains, authorized mobile apps, 
                  and official social assets from impersonation and rogue binary clones.
                </p>

                {/* Social platforms row */}
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { label: 'Instagram', color: 'hover:text-pink-400', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                    { label: 'X / Twitter', color: 'hover:text-slate-100', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                    { label: 'Facebook', color: 'hover:text-blue-500', svg: 'M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z' },
                    { label: 'LinkedIn', color: 'hover:text-blue-400', svg: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z' },
                  ].map((s) => (
                    <span key={s.label} title={s.label} className={`p-2 rounded-lg bg-[#0d1629] border border-slate-800/80 text-slate-400 ${s.color} cursor-pointer transition-all hover:border-slate-700`}>
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d={s.svg} /></svg>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER: Asset metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4 xl:gap-3 border-t xl:border-t-0 xl:border-l border-slate-800/60 pt-4 xl:pt-0 xl:pl-8 w-full xl:w-72 shrink-0">
              {[
                { icon: Globe, color: 'text-blue-400', label: 'Official Domain', value: website, link: `https://${website.replace(/^https?:\/\//, '')}` },
                { icon: Smartphone, color: 'text-indigo-400', label: 'Official App', value: appName },
                { icon: User, color: 'text-cyan-400', label: 'Authorized Publisher', value: publisher },
              ].map(({ icon: Icon, color, label, value, link }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-[#070c1a]/60 border border-slate-800/40 hover:border-slate-700/60 transition-all group/item">
                  <div className={`w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 block font-mono uppercase tracking-wider mb-0.5">{label}</span>
                    {link ? (
                      <a href={link} target="_blank" rel="noreferrer" className="text-white hover:text-cyan-400 font-semibold text-xs flex items-center gap-1 transition-colors truncate font-mono">
                        <span className="truncate">{value}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-50 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-white font-semibold text-xs block truncate font-mono">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Actions */}
            <div className="flex xl:flex-col items-center gap-3 w-full sm:w-auto xl:w-auto shrink-0 border-t xl:border-t-0 xl:border-l border-slate-800/60 pt-4 xl:pt-0 xl:pl-8">
              <button
                onClick={onEditProfile}
                className="flex-1 xl:flex-none xl:w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1629] border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-semibold transition-all btn-shimmer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                Edit Profile
              </button>
              <button
                onClick={onRunScan}
                disabled={isScanning}
                className="flex-1 xl:flex-none xl:w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-60 btn-shimmer border border-blue-500/30"
                style={{ boxShadow: isScanning ? undefined : '0 0 20px -4px rgba(59,130,246,0.5)' }}
              >
                {isScanning ? (
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                {isScanning ? 'Scanning...' : 'Run Full Scan'}
              </button>

              {/* Live threat counter */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/8 border border-rose-500/20 text-xs w-full">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <div>
                  <span className="text-rose-300 font-bold block text-[11px]">23 Active Threats</span>
                  <span className="text-slate-500 text-[10px]">Under surveillance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};
