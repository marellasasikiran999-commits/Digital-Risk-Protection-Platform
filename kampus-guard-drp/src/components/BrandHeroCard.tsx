import React from 'react';
import { 
  Globe, Smartphone, User, Play, Edit3, CheckCircle, ExternalLink
} from 'lucide-react';
import type { Brand } from '../utils/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { HologramShield3D } from './3d/HologramShield3D';

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
    <Card className="p-6 relative overflow-hidden backdrop-blur-2xl bg-[#091021]/80 border-slate-800/80 shadow-2xl card-glow-top">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Brand Details & Verified Badge with 3D Hologram Shield */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 overflow-hidden">
            <div className="w-full h-full bg-[#0a1020] rounded-[14px] flex items-center justify-center relative">
              <HologramShield3D size={52} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-black text-white tracking-tight">{brandName}</h2>
              <Badge variant="success" className="gap-1.5 py-0.5 px-2.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Verified Asset Baseline</span>
              </Badge>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Autonomous Brand Protection • Whitelisted Defense Active
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-2 pt-1 text-slate-400">
              <span className="p-1.5 rounded-lg bg-[#0e1629] border border-slate-800 hover:border-slate-700 hover:text-pink-400 cursor-pointer transition-all" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </span>
              <span className="p-1.5 rounded-lg bg-[#0e1629] border border-slate-800 hover:border-slate-700 hover:text-white cursor-pointer transition-all" title="Twitter / X">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </span>
              <span className="p-1.5 rounded-lg bg-[#0e1629] border border-slate-800 hover:border-slate-700 hover:text-blue-400 cursor-pointer transition-all" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/></svg>
              </span>
              <span className="p-1.5 rounded-lg bg-[#0e1629] border border-slate-800 hover:border-slate-700 hover:text-cyan-400 cursor-pointer transition-all" title="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Middle Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs border-y lg:border-y-0 lg:border-x border-slate-800/80 py-3 lg:py-0 lg:px-6 w-full lg:w-auto">
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 font-cyber uppercase tracking-wider">Official Domain</span>
            <a 
              href={`https://${website.replace(/^https?:\/\//, '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:text-cyan-400 font-cyber font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{website}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 font-cyber uppercase tracking-wider">Official App</span>
            <span className="text-white font-cyber font-semibold flex items-center gap-1.5 truncate">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{appName}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 font-cyber uppercase tracking-wider">Authorized Publisher</span>
            <span className="text-white font-cyber font-semibold flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{publisher}</span>
            </span>
          </div>
        </div>

        {/* Right CTA Actions with shadcn Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onEditProfile}
            className="flex-1 sm:flex-initial"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit Profile</span>
          </Button>

          <Button
            variant="cyber"
            onClick={onRunScan}
            disabled={isScanning}
            className="flex-1 sm:flex-initial"
          >
            <Play className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Now'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
