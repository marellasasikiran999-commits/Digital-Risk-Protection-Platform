import React from 'react';
import { Shield, ArrowRight, CheckCircle2, Smartphone, Radio } from 'lucide-react';

export const BottomAnalyticsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Risk Distribution Donut Chart */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white">Risk Distribution</h3>

        <div className="flex items-center gap-4 pt-1">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="transparent" />
              {/* Critical Red 22% */}
              <circle cx="50" cy="50" r="38" stroke="#f43f5e" strokeWidth="12" fill="transparent" strokeDasharray="52 238" strokeDashoffset="0" />
              {/* High Orange 30% */}
              <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="71 238" strokeDashoffset="-52" />
              {/* Medium Yellow 30% */}
              <circle cx="50" cy="50" r="38" stroke="#fbbf24" strokeWidth="12" fill="transparent" strokeDasharray="71 238" strokeDashoffset="-123" />
              {/* Low Green 18% */}
              <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="44 238" strokeDashoffset="-194" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-white">23</span>
              <span className="text-[9px] text-slate-400 font-mono">Findings</span>
            </div>
          </div>

          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical (80-100)</span>
              <strong className="text-white">5 22%</strong>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-orange-500" /> High (60-79)</span>
              <strong className="text-white">7 30%</strong>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-400" /> Medium (30-59)</span>
              <strong className="text-white">7 30%</strong>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Low (0-29)</span>
              <strong className="text-white">4 18%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Risk Brands matching screenshot */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white">Top Risk Candidates</h3>

        <div className="space-y-2 text-xs">
          {[
            { rank: 1, name: 'Digital Risk Protection Pro', score: 88, color: 'bg-rose-500/20 text-rose-400' },
            { rank: 2, name: 'DRP Rewards Wallet', score: 82, color: 'bg-rose-500/20 text-rose-400' },
            { rank: 3, name: '@drp_support24', score: 76, color: 'bg-orange-500/20 text-orange-400' },
            { rank: 4, name: 'DRP Official Clone', score: 65, color: 'bg-orange-500/20 text-orange-400' },
            { rank: 5, name: 'DRP Sentinel Harvester', score: 54, color: 'bg-amber-500/20 text-amber-400' }
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-1.5 rounded-lg bg-[#141e33] border border-slate-800/80">
              <div className="flex items-center gap-2 truncate">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                  {item.rank}
                </span>
                <span className="text-white font-semibold truncate">{item.name}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${item.color}`}>
                {item.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Activity Feed matching screenshot */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white">Recent Activity</h3>

        <div className="space-y-2 text-xs">
          {[
            { text: 'App scan completed - 12 new findings', time: '2 hours ago', icon: Smartphone, color: 'text-blue-400' },
            { text: 'Social media scan completed - 8 new findings', time: '4 hours ago', icon: Radio, color: 'text-purple-400' },
            { text: 'Brand profile updated - Digital Risk Protection Platform', time: '6 hours ago', icon: Shield, color: 'text-emerald-400' },
            { text: 'Finding marked as legitimate - @drp_whitelist', time: '8 hours ago', icon: CheckCircle2, color: 'text-cyan-400' }
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <div key={i} className="flex items-start gap-2.5 p-1.5 rounded-lg bg-[#141e33]/60">
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${act.color}`} />
                <div className="min-w-0">
                  <span className="text-slate-200 block truncate text-[11px]">{act.text}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">{act.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Pro Tip Card matching screenshot */}
      <div className="bg-gradient-to-br from-[#121c33] via-[#0f172a] to-[#0a0f1d] border border-blue-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold text-blue-300">Pro Tip</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Enable regular scans to catch new impersonation attempts early and protect your brand reputation.
        </p>

        <button className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 pt-1">
          Learn More <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
