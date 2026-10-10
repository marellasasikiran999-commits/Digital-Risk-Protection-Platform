import React from 'react';
import { 
  Shield, LayoutDashboard, Building2, Radio, Smartphone, Sparkles
} from 'lucide-react';

interface BrandShieldSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  threatCounts?: {
    social: number;
    app: number;
    total: number;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const BrandShieldSidebar: React.FC<BrandShieldSidebarProps> = ({
  activeTab,
  setActiveTab,
  threatCounts = { social: 15, app: 8, total: 23 }
}) => {
  const navSections: NavSection[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'brands', label: 'Brands & Assets', icon: Building2 }
      ]
    },
    {
      title: 'INTELLIGENCE LABS',
      items: [
        { 
          id: 'social', 
          label: 'Social Media Monitor', 
          icon: Radio, 
          badge: `${threatCounts.social} ALERTS` 
        },
        { 
          id: 'appstore', 
          label: 'App Store Monitor', 
          icon: Smartphone, 
          badge: `${threatCounts.app} APKS` 
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#090D16]/95 border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 select-none z-30 min-h-screen backdrop-blur-md">
      <div className="space-y-6">
        {/* Digital Risk Protection Platform Logo Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#0a1020] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-black text-white tracking-tight uppercase leading-tight font-sans">
              Digital Risk Protection
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-cyber">Platform</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-cyber font-bold">
                ENTERPRISE
              </span>
            </div>
          </div>
        </div>

        {/* Grouped Navigation List: Pristine 4-Tab Functional Architecture */}
        <nav className="space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 block font-cyber">
                {section.title}
              </span>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30 border border-blue-400/40'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#111827]/70 hover:border-slate-800 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && !isActive && (
                        <span className="text-[8px] font-cyber font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Telemetry Status Card */}
      <div className="p-4 rounded-2xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden shadow-xl card-glow-top">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[9px] font-cyber text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE DEFENSE
          </span>
        </div>
        <h4 className="text-xs font-bold text-white leading-tight">0% False-Positive Filter</h4>
        <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
          Whitelisted asset baseline active. Rogue candidate triage online.
        </p>
      </div>
    </aside>
  );
};
