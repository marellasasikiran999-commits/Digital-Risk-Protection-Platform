import React from 'react';
import { Shield, AlertTriangle, Users, Smartphone } from 'lucide-react';
import type { DashboardSummary } from '../utils/api';

interface BrandShieldStatsProps {
  summary: DashboardSummary | null;
}

export const BrandShieldStats: React.FC<BrandShieldStatsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Total Assets Monitored',
      count: summary?.threat_detection_total ? String(summary.threat_detection_total) : '128',
      growth: '↑ 12%',
      growthColor: 'text-emerald-400',
      subtitle: 'Social: 86 | Apps: 42',
      icon: Shield,
      iconBg: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
      strokeColor: '#3b82f6'
    },
    {
      title: 'Suspicious Candidates',
      count: summary?.suspicious_candidates ? String(summary.suspicious_candidates) : '23',
      growth: '↑ 28%',
      growthColor: 'text-rose-400',
      subtitle: 'Social: 16 | Apps: 7',
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      strokeColor: '#f43f5e'
    },
    {
      title: 'High Risk',
      count: summary?.high ? String(summary.high) : '8',
      growth: '↑ 60%',
      growthColor: 'text-rose-400',
      subtitle: 'Requires immediate review',
      icon: Shield,
      iconBg: 'bg-rose-600/20 text-rose-400 border border-rose-600/30',
      strokeColor: '#f43f5e'
    },
    {
      title: 'Social Media Findings',
      count: summary?.social_findings ? String(summary.social_findings) : '15',
      growth: '↑ 20%',
      growthColor: 'text-emerald-400',
      subtitle: 'Resolved: 5',
      icon: Users,
      iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      strokeColor: '#06b6d4'
    },
    {
      title: 'App Store Findings',
      count: summary?.app_findings ? String(summary.app_findings) : '8',
      growth: '↑ 50%',
      growthColor: 'text-emerald-400',
      subtitle: 'Resolved: 3',
      icon: Smartphone,
      iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      strokeColor: '#a855f7'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{card.title}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-white tracking-tight">{card.count}</span>
              <span className={`text-xs font-mono font-bold ${card.growthColor}`}>{card.growth}</span>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{card.subtitle}</span>
            </div>

            {/* Sparkline decoration at the bottom */}
            <div className="h-6 w-full pt-1 opacity-70">
              <svg className="w-full h-full" viewBox="0 0 100 20">
                <path
                  d="M 0 15 Q 25 18 50 10 T 100 5"
                  fill="none"
                  stroke={card.strokeColor}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
