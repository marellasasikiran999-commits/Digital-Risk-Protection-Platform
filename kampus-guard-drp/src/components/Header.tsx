import React from 'react';
import { Radio, ShieldAlert, FileText, Search, Building2, Plus, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddBrand: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddBrand,
  onRefresh,
  isRefreshing
}) => {
  return (
    <header className="bg-[#0f141c] border-b border-slate-800/80 sticky top-0 z-40 px-6 py-3.5 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Top Navigation Tabs matching Image 1 */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'monitoring', label: 'Security Monitoring', icon: Radio },
            { id: 'threats', label: 'Threat Analysis', icon: ShieldAlert },
            { id: 'reports', label: 'Incident Reports', icon: FileText },
            { id: 'brands', label: 'Brand Profiles', icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Section: Search & Analyst Profile matching Image 1 */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-[#141b26] border border-slate-800 rounded-xl px-3 py-1.5 w-60">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search threats..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono"
            />
          </div>

          <button
            onClick={onOpenAddBrand}
            title="Register New Brand Baseline"
            className="p-2 text-orange-400 hover:text-orange-300 bg-[#141b26] border border-orange-500/30 rounded-xl hover:bg-slate-800 flex items-center gap-1 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            title="Refresh findings from SQLite"
            className="p-2 text-slate-400 hover:text-white bg-[#141b26] border border-slate-800 rounded-xl hover:bg-slate-800"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          {/* User profile badge matching Image 1: Alex Mitchell Security Analyst (3) */}
          <div className="flex items-center gap-2.5 bg-[#141b26] border border-slate-800/80 rounded-xl px-3 py-1.5">
            <div className="relative">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs">
                AM
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                3
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">Alex Mitchell</span>
              <span className="text-[10px] text-slate-400 block leading-tight">Security Analyst</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
