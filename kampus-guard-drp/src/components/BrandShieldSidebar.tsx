import React from 'react';
import { 
  Shield, LayoutDashboard, Building2, Radio, Smartphone, 
  Search, FileText, Settings, Bug, Globe
} from 'lucide-react';

interface BrandShieldSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BrandShieldSidebar: React.FC<BrandShieldSidebarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'brands', label: 'Brands', icon: Building2 },
    { id: 'social', label: 'Social Media Monitoring', icon: Radio },
    { id: 'appstore', label: 'App Store Monitoring', icon: Smartphone },
    { id: 'findings', label: 'Findings', icon: Search },
    { id: 'apk_tester', label: 'Malicious APK Sandbox', icon: Bug },
    { id: 'url_tester', label: 'Fake URL Inspector', icon: Globe },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 select-none z-30 min-h-screen">
      <div className="space-y-6">
        {/* BrandShield AI Logo Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#0d1424] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-black text-white tracking-tight uppercase leading-tight">
              Digital Risk Protection
            </h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Platform</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121b2d]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card matching Image: Stronger Brands Safer Communities */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#111a2e] to-[#0d1526] border border-blue-900/40 relative overflow-hidden shadow-xl">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mb-2">
          <Shield className="w-4 h-4 text-blue-400" />
        </div>
        <h4 className="text-xs font-bold text-white leading-tight">Stronger Brands</h4>
        <h4 className="text-xs font-bold text-blue-400 leading-tight">Safer Communities</h4>
        <p className="text-[10px] text-slate-400 mt-1">Detect. Analyze. Protect.</p>
      </div>
    </aside>
  );
};
