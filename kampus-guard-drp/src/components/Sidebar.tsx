import React from 'react';
import { Shield, BarChart2, FileText, Layers, Users, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', icon: BarChart2, label: 'Security Operations' },
    { id: 'threats', icon: Shield, label: 'Threat Analysis' },
    { id: 'reports', icon: FileText, label: 'Incident Reports' },
    { id: 'tools', icon: Layers, label: 'Security Tools' },
    { id: 'team', icon: Users, label: 'Analysts' }
  ];

  return (
    <aside className="w-16 bg-[#0f141c] border-r border-slate-800/80 flex flex-col items-center py-5 justify-between shrink-0 select-none z-30">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={() => setActiveView('dashboard')}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
          title="GuardPulse Security Operations Center"
        >
          <div className="w-full h-full bg-[#121824] rounded-[10px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-orange-400" />
          </div>
        </button>

        {/* Nav Items */}
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-lg shadow-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings */}
      <button 
        onClick={() => setActiveView('settings')}
        title="Settings & Whitelist Configurations"
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          activeView === 'settings'
            ? 'bg-orange-500 text-slate-950 shadow-lg'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        }`}
      >
        <Settings className="w-5 h-5" />
      </button>
    </aside>
  );
};
