import React from 'react';
import { 
  Shield, LayoutDashboard, Building2, Radio, Smartphone, 
  Search, FileText, Settings, Bug, Globe, Sparkles
} from 'lucide-react';

interface BrandShieldSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BrandShieldSidebar: React.FC<BrandShieldSidebarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const navSections = [
    {
      title: 'COMMAND CENTER',
      items: [
        { id: 'dashboard', label: 'Security Dashboard', icon: LayoutDashboard },
        { id: 'globe_3d', label: '3D Threat Globe', icon: Globe, badge: '3D LIVE' },
        { id: 'brands', label: 'Brand Baseline & Assets', icon: Building2 },
        { id: 'findings', label: 'Threat Triage Feed', icon: Search }
      ]
    },
    {
      title: 'INTELLIGENCE & SCANNERS',
      items: [
        { id: 'lookalike_lab', label: 'Look-alike AI Engine', icon: Sparkles, badge: 'INTERACTIVE' },
        { id: 'social', label: 'Social Media Monitor', icon: Radio },
        { id: 'appstore', label: 'App Store Monitor', icon: Smartphone },
        { id: 'url_tester', label: 'Phishing Domain Inspector', icon: Globe, badge: 'HOMOGLYPH' },
        { id: 'apk_tester', label: 'APK Malware Sandbox', icon: Bug, badge: 'MALWARE' }
      ]
    },
    {
      title: 'GOVERNANCE & AUDIT',
      items: [
        { id: 'reports', label: 'Executive Incident Reports', icon: FileText },
        { id: 'settings', label: 'System & Baseline Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#080d1a]/95 border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 select-none z-30 min-h-screen backdrop-blur-2xl">
      <div className="space-y-6">
        {/* Digital Risk Protection Platform Logo Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#0a1020] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-black text-white tracking-wider uppercase leading-tight font-display">
              Digital Risk Protection
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-cyber">Platform</span>
              <span className="text-[9px] text-slate-500 font-mono">v3.0.0</span>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2 block">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-bold shadow-lg shadow-blue-600/25 border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f172a]/70 hover:border-slate-800 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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

      {/* Bottom Status Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a1020] border border-blue-900/30 relative overflow-hidden shadow-xl card-glow-top">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[9px] font-cyber text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <h4 className="text-xs font-bold text-white leading-tight font-display">Perimeter Surveillance</h4>
        <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Continuous attack surface monitoring across registered brand assets.</p>
      </div>
    </aside>
  );
};
