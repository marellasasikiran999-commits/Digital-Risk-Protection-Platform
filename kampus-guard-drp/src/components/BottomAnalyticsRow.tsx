import React from 'react';
import { Shield, ArrowRight, CheckCircle2, Smartphone, Radio } from 'lucide-react';
import { ScrollReveal } from './ui/ScrollReveal';
import type { DashboardSummary, Finding } from '../utils/api';

interface BottomAnalyticsRowProps {
  summary?: DashboardSummary | null;
  findings?: Finding[];
}

export const BottomAnalyticsRow: React.FC<BottomAnalyticsRowProps> = ({ summary, findings }) => {
  // Compute risk distribution dynamically if findings exist
  const totalFindings = findings && findings.length > 0 ? findings.length : (summary?.threat_detection_total ? 23 : 23);
  const criticalCount = findings ? findings.filter(f => f.risk_level === 'Critical').length : (summary?.critical ?? 5);
  const highCount = findings ? findings.filter(f => f.risk_level === 'High').length : (summary?.high ?? 7);
  const mediumCount = findings ? findings.filter(f => f.risk_level === 'Medium').length : (summary?.medium ?? 7);
  const lowCount = findings ? findings.filter(f => f.risk_level === 'Low').length : (summary?.low ?? 4);

  const critPercent = totalFindings > 0 ? Math.round((criticalCount / totalFindings) * 100) : 22;
  const highPercent = totalFindings > 0 ? Math.round((highCount / totalFindings) * 100) : 30;
  const medPercent = totalFindings > 0 ? Math.round((mediumCount / totalFindings) * 100) : 30;
  const lowPercent = totalFindings > 0 ? Math.max(0, 100 - critPercent - highPercent - medPercent) : 18;

  // Top risk findings
  const topRiskItems = findings && findings.length > 0
    ? [...findings].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5).map((f, i) => ({
        rank: i + 1,
        name: f.candidate_name || f.asset || f.title,
        score: f.risk_score,
        color: f.risk_score >= 85 
          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          : f.risk_score >= 70
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
      }))
    : [
        { rank: 1, name: 'Digital Risk Protection Pro', score: 88, color: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
        { rank: 2, name: 'DRP Rewards Wallet', score: 82, color: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
        { rank: 3, name: '@drp_support24', score: 76, color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
        { rank: 4, name: 'DRP Official Clone', score: 65, color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
        { rank: 5, name: 'DRP Sentinel Harvester', score: 54, color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' }
      ];

  return (
    <div className="space-y-2">
      {/* Optimus Section Header Label */}
      <div className="inline-flex items-center gap-3 text-[11px] font-mono text-cyan-400 tracking-wider">
        <span className="w-8 h-px bg-cyan-400/50" />
        <span>05 // THREAT DISTRIBUTION &amp; AUDIT LOGS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Risk Distribution Donut Chart */}
        <ScrollReveal direction="up" delay={0} distance={20} duration={650}>
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 group glass-panel-hover h-full flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
              Risk Distribution
            </h3>

            <div className="flex items-center gap-4 pt-1">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#f43f5e" strokeWidth="12" fill="transparent" strokeDasharray={`${(critPercent / 100) * 238} 238`} strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray={`${(highPercent / 100) * 238} 238`} strokeDashoffset={`-${(critPercent / 100) * 238}`} />
                  <circle cx="50" cy="50" r="38" stroke="#fbbf24" strokeWidth="12" fill="transparent" strokeDasharray={`${(medPercent / 100) * 238} 238`} strokeDashoffset={`-${((critPercent + highPercent) / 100) * 238}`} />
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray={`${(lowPercent / 100) * 238} 238`} strokeDashoffset={`-${((critPercent + highPercent + medPercent) / 100) * 238}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-white font-cyber">{totalFindings}</span>
                  <span className="text-[9px] text-slate-400 font-mono">Findings</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] font-mono flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Critical</span>
                  <strong className="text-white">{criticalCount} ({critPercent}%)</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
                  <strong className="text-white">{highCount} ({highPercent}%)</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-400" /> Medium</span>
                  <strong className="text-white">{mediumCount} ({medPercent}%)</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Low</span>
                  <strong className="text-white">{lowCount} ({lowPercent}%)</strong>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2. Top Risk Candidates */}
        <ScrollReveal direction="up" delay={60} distance={20} duration={650}>
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 group glass-panel-hover h-full">
            <h3 className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
              Top Risk Candidates
            </h3>

            <div className="space-y-2 text-xs">
              {topRiskItems.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-1.5 rounded-lg bg-[#141e33] border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                      {item.rank}
                    </span>
                    <span className="text-white font-semibold truncate text-[11px]">{item.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${item.color}`}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 3. Recent Activity Feed */}
        <ScrollReveal direction="up" delay={120} distance={20} duration={650}>
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 group glass-panel-hover h-full">
            <h3 className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
              Recent Activity
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { text: 'App scan completed - 12 new findings', time: '2 hours ago', icon: Smartphone, color: 'text-blue-400' },
                { text: 'Social media scan completed - 8 new findings', time: '4 hours ago', icon: Radio, color: 'text-purple-400' },
                { text: 'Brand profile updated - Baseline sync', time: '6 hours ago', icon: Shield, color: 'text-emerald-400' },
                { text: 'Candidate whitelisted - @drp_whitelist', time: '8 hours ago', icon: CheckCircle2, color: 'text-cyan-400' }
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5 p-1.5 rounded-lg bg-[#141e33]/60 hover:bg-[#141e33] transition-colors">
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
        </ScrollReveal>

        {/* 4. Pro Tip Card */}
        <ScrollReveal direction="up" delay={180} distance={20} duration={650}>
          <div className="bg-gradient-to-br from-[#121c33] via-[#0f172a] to-[#0a0f1d] border border-blue-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3 group glass-panel-hover h-full card-glow-top">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-300 font-mono">PRO TIP // DEFENSE</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Autonomous continuous polling detects homoglyph typo-variations in under 30 seconds before rogue campaigns launch.
            </p>

            <button className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 pt-1 font-mono transition-colors group/btn">
              <span>View Whitelist Policy</span> 
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
