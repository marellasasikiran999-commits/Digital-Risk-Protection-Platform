import React from 'react';
import { 
  Shield, LayoutDashboard, Building2, Radio, Smartphone, 
  Search, FileText, Settings, Bug, Globe, Sparkles, ShieldCheck
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
        { id: 'globe_3d', label: '3D Threat Globe', icon: Globe, badge: '3D LIVE', badgeColor: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/8' },
        { id: 'brands', label: 'Brand Baseline & Assets', icon: Building2 },
        { id: 'findings', label: 'Threat Triage Feed', icon: Search }
      ]
    },
    {
      title: 'INTELLIGENCE & SCANNERS',
      items: [
        { id: 'lookalike_lab', label: 'Look-alike AI Engine', icon: Sparkles, badge: 'AI', badgeColor: 'text-violet-400 border-violet-500/25 bg-violet-500/8' },
        { id: 'social', label: 'Social Media Monitor', icon: Radio },
        { id: 'appstore', label: 'App Store Monitor', icon: Smartphone },
        { id: 'url_tester', label: 'Phishing Inspector', icon: Globe, badge: 'LIVE', badgeColor: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/8' },
        { id: 'apk_tester', label: 'APK Malware Sandbox', icon: Bug, badge: 'SCAN', badgeColor: 'text-rose-400 border-rose-500/25 bg-rose-500/8' }
      ]
    },
    {
      title: 'GOVERNANCE & AUDIT',
      items: [
        { id: 'reports', label: 'Incident Reports', icon: FileText },
        { id: 'settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-60 bg-[var(--bg-sidebar)]/95 border-r border-[var(--border-color)] flex flex-col justify-between p-3 shrink-0 select-none z-30 min-h-screen backdrop-blur-2xl transition-colors duration-300">
      <div className="space-y-5">
        {/* Logo Header */}
        <div className="flex items-center gap-3 px-2 pt-2 pb-1">
          <div className="w-9 h-9 rounded-xl theme-logo-bg p-0.5 flex items-center justify-center shadow-lg shrink-0">
            <div className="w-full h-full bg-[var(--bg-core)] rounded-[10px] flex items-center justify-center transition-colors">
              <Shield className="w-4.5 h-4.5 theme-accent-text" style={{ width: '18px', height: '18px' }} />
            </div>
          </div>
          <div>
            <h1 className="text-[11px] font-black text-white tracking-wider uppercase leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Digital Risk<br/>Protection
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] theme-accent-text font-bold uppercase tracking-wider font-mono">Platform</span>
              <span className="text-[8px] text-slate-600 font-mono">v3.0</span>
            </div>
          </div>
        </div>

        {/* Security Mesh badge */}
        <div className="mx-1 px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center gap-2 transition-colors">
          <ShieldCheck className="w-3.5 h-3.5 theme-accent-text shrink-0" />
          <div>
            <span className="text-[9px] font-bold text-white block font-mono uppercase tracking-wider">Enterprise SOC Edition</span>
            <span className="text-[8px] text-slate-500 font-mono">Autonomous Perimeter Defense</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.15em] px-2 block">
                {section.title}
              </span>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
                        isActive
                          ? 'nav-active-item text-white shadow-lg border'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                      }`}
                      style={isActive ? {} : { '--tw-bg-opacity': '0.04' } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate leading-tight">{item.label}</span>
                      </div>

                      {'badge' in item && item.badge && !isActive && (
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${(item as {badge?: string; badgeColor?: string}).badgeColor || 'text-cyan-400 border-blue-500/20 bg-blue-500/8'}`}>
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
      <div className="p-3 rounded-2xl bg-gradient-to-b from-[#0d1829] to-[#090f1d] border border-blue-900/25 relative overflow-hidden shadow-xl mt-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="flex items-center justify-between mb-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/12 border border-blue-500/20 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <h4 className="text-[11px] font-bold text-white leading-tight">Perimeter Surveillance</h4>
        <p className="text-[10px] text-slate-500 mt-1 leading-snug font-sans">Continuous monitoring across all registered brand surfaces.</p>
      </div>
    </aside>
  );
};
