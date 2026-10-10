import React from 'react';
import { ChevronDown, Radio, Smartphone, Globe } from 'lucide-react';
import type { Finding } from '../utils/api';

interface ChartsAndThreatsRowProps {
  onSelectFinding: (finding: Finding) => void;
  findings: Finding[];
}

export const ChartsAndThreatsRow: React.FC<ChartsAndThreatsRowProps> = ({
  onSelectFinding,
  findings
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Threat Overview Chart (col-span-5) */}
      <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Threat Overview</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-[#141e33] px-2.5 py-1 rounded-lg border border-slate-700/60 cursor-pointer">
            <span>Last 7 days</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Low</span>
        </div>

        {/* Multi-line SVG chart */}
        <div className="h-44 w-full pt-2">
          <svg className="w-full h-full" viewBox="0 0 350 140">
            {/* Grid Lines */}
            <line x1="30" y1="20" x2="340" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="30" y1="50" x2="340" y2="50" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="30" y1="80" x2="340" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="30" y1="110" x2="340" y2="110" stroke="#1e293b" strokeDasharray="3 3" />

            {/* High Threat line (Rose) */}
            <path
              d="M 30 100 Q 80 85 130 90 T 230 40 T 330 35"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
            />
            {/* Medium Threat line (Amber) */}
            <path
              d="M 30 110 Q 80 95 130 80 T 230 70 T 330 65"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
            />
            {/* Low Threat line (Emerald) */}
            <path
              d="M 30 120 Q 80 115 130 105 T 230 100 T 330 95"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
            />

            {/* Current Day Point */}
            <circle cx="330" cy="35" r="4" fill="#f43f5e" />
            <circle cx="330" cy="65" r="4" fill="#fbbf24" />
            <circle cx="330" cy="95" r="4" fill="#34d399" />

            {/* X-axis days */}
            <text x="30" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">Mon</text>
            <text x="80" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">Tue</text>
            <text x="130" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">Wed</text>
            <text x="180" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">Thu</text>
            <text x="230" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">Fri</text>
            <text x="280" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">Sat</text>
            <text x="325" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">Sun</text>
          </svg>
        </div>
      </div>

      {/* 2. Findings by Source Donut Chart (col-span-3) */}
      <div className="lg:col-span-3 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Findings by Source</h3>

        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="transparent" />
              {/* Social Media 65% (Cyan/Blue) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#06b6d4"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="155 238"
                strokeDashoffset="0"
              />
              {/* App Store 35% (Purple) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#8b5cf6"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="83 238"
                strokeDashoffset="-155"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">23</span>
              <span className="text-[10px] text-slate-400 font-mono">Total Threats</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Social (65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-slate-300">App Store (35%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Threats List (col-span-4) */}
      <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <h3 className="text-sm font-bold text-white">Recent Threats</h3>
          <span className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer">
            Live Stream
          </span>
        </div>

        <div className="space-y-2 text-xs overflow-y-auto max-h-56">
          {[
            { name: '@drp_support24', sub: 'Instagram • Fake profile', level: 'High', time: '2h ago', icon: Radio, color: 'text-pink-400', badge: 'bg-rose-500/20 text-rose-400 border border-rose-500/40' },
            { name: 'DRP Rewards Wallet', sub: 'Google Play • Fake app', level: 'High', time: '3h ago', icon: Smartphone, color: 'text-emerald-400', badge: 'bg-rose-500/20 text-rose-400 border border-rose-500/40' },
            { name: '@drp_official_fake', sub: 'X (Twitter) • Impersonation', level: 'Medium', time: '4h ago', icon: Radio, color: 'text-cyan-400', badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' },
            { name: 'Digital Risk Protection Pro', sub: 'App Store • Suspicious clone', level: 'Medium', time: '6h ago', icon: Smartphone, color: 'text-blue-400', badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' },
            { name: 'drp-platform-login.com', sub: 'Domain • Credential harvester', level: 'High', time: '1h ago', icon: Globe, color: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400 border border-rose-500/40' }
          ].map((t, idx) => {
            const Icon = t.icon;
            const findingObj = findings.find(f => f.candidate_name.includes(t.name) || f.title.includes(t.name)) || findings[0];

            return (
              <div 
                key={idx}
                onClick={() => findingObj && onSelectFinding(findingObj)}
                className="flex items-center justify-between p-2 rounded-xl bg-[#121c30] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                  </div>
                  <div className="truncate">
                    <span className="text-white font-bold block truncate">{t.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{t.sub}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.badge}`}>
                    {t.level}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{t.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
