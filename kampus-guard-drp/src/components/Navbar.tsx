import React, { useState } from 'react';
import { Shield, Radio, CheckCircle, Building2, Plus, Search, FileText } from 'lucide-react';
import type { OfficialBrandAsset } from '../types';

interface NavbarProps {
  currentBrand: OfficialBrandAsset;
  onSelectBrand: (brandName: string) => void;
  brandList: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isScanning: boolean;
  onRunScan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBrand,
  onSelectBrand,
  brandList,
  activeTab,
  setActiveTab,
  isScanning,
  onRunScan
}) => {
  const [customSearch, setCustomSearch] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    onSelectBrand(customSearch.trim());
    setCustomSearch('');
    setShowCustomInput(false);
  };

  return (
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50 shadow-2xl">
      {/* Top Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-300 px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-bold">
            Live Protection Active
          </span>
          <span className="hidden sm:inline text-slate-400">Autonomous External Threat &amp; Impersonation Monitoring</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Asset Whitelist Enforced (0% False Positives)
          </span>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                  GuardPulse <span className="text-cyan-400 text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 ml-1">DRP</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Digital Risk Protection Platform</p>
            </div>
          </div>

          {/* Center Brand Switcher & Search Bar */}
          <div className="flex items-center gap-2">
            {!showCustomInput ? (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400 font-semibold">Protected Brand:</span>
                <select
                  value={currentBrand.brandName}
                  onChange={(e) => onSelectBrand(e.target.value)}
                  className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer pr-1"
                >
                  {brandList.map((brand) => (
                    <option key={brand} value={brand} className="bg-slate-900 text-white font-semibold">
                      {brand}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="ml-1 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 text-[10px] font-bold flex items-center gap-1 border border-slate-700/60"
                  title="Test any custom brand name"
                >
                  <Plus className="w-3 h-3 text-cyan-400" /> New Brand
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 bg-slate-900 border border-cyan-500/50 rounded-xl px-3 py-1 shadow-lg shadow-cyan-500/10">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Enter brand name..."
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  className="bg-transparent text-xs text-cyan-300 font-mono focus:outline-none w-48"
                  autoFocus
                />
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-2.5 py-1 rounded text-[10px]">
                  Monitor
                </button>
                <button type="button" onClick={() => setShowCustomInput(false)} className="text-slate-400 hover:text-white text-xs px-1">
                  ✕
                </button>
              </form>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRunScan}
              disabled={isScanning}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-xl ${
                isScanning
                  ? 'bg-amber-600/50 text-amber-200 border border-amber-500/40 cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95'
              }`}
            >
              <Radio className={`w-4 h-4 ${isScanning ? 'animate-spin text-amber-300' : 'text-slate-950'}`} />
              {isScanning ? 'Scanning Feeds...' : 'Run Security Scan'}
            </button>
          </div>
        </div>

        {/* Clean Enterprise Tabs */}
        <nav className="flex items-center gap-1 border-t border-slate-800/80 pt-1 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Threat Dashboard', icon: Shield },
            { id: 'social', label: 'Social Media Protection', icon: Radio },
            { id: 'app_store', label: 'App Store Defense', icon: Shield },
            { id: 'lookalike', label: 'Look-Alike & Typosquat Radar', icon: Building2 },
            { id: 'brand_profile', label: 'Brand Assets & Whitelist', icon: Building2 },
            { id: 'architecture', label: 'System Architecture', icon: CheckCircle },
            { id: 'reports', label: 'Incident Reports', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-slate-900/80 shadow-[0_-5px_15px_rgba(6,182,212,0.1)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
