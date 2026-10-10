import React from 'react';
import { Shield, AlertTriangle, Users, Smartphone } from 'lucide-react';
import type { DashboardSummary } from '../utils/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface BrandShieldStatsProps {
  summary: DashboardSummary | null;
}

export const BrandShieldStats: React.FC<BrandShieldStatsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Total Assets Monitored',
      count: summary?.threat_detection_total ? String(summary.threat_detection_total) : '128',
      growth: '+12%',
      isPositive: true,
      subtitle: 'Social: 86 | Apps: 42',
      icon: Shield,
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      strokeColor: '#3b82f6',
      badgeVariant: 'default' as const
    },
    {
      title: 'Suspicious Candidates',
      count: summary?.suspicious_candidates ? String(summary.suspicious_candidates) : '23',
      growth: '+28%',
      isPositive: false,
      subtitle: 'Social: 16 | Apps: 7',
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      strokeColor: '#f43f5e',
      badgeVariant: 'destructive' as const
    },
    {
      title: 'Critical Severity',
      count: summary?.high ? String(summary.high) : '8',
      growth: 'Needs Action',
      isPositive: false,
      subtitle: 'Immediate takedown required',
      icon: Shield,
      iconBg: 'bg-rose-600/15 text-rose-300 border border-rose-500/30',
      strokeColor: '#f43f5e',
      badgeVariant: 'destructive' as const
    },
    {
      title: 'Social Media Findings',
      count: summary?.social_findings ? String(summary.social_findings) : '15',
      growth: '5 Resolved',
      isPositive: true,
      subtitle: 'Homoglyph spoof alerts',
      icon: Users,
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      strokeColor: '#06b6d4',
      badgeVariant: 'cyber' as const
    },
    {
      title: 'App Store Clones',
      count: summary?.app_findings ? String(summary.app_findings) : '8',
      growth: '3 Resolved',
      isPositive: true,
      subtitle: 'Google Play & Mirrors',
      icon: Smartphone,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      strokeColor: '#818cf8',
      badgeVariant: 'secondary' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <Card
            key={idx}
            className="p-5 hover:border-slate-700/80 transition-all duration-300 space-y-3 relative overflow-hidden group glass-panel-hover"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-cyber">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white tracking-tight font-cyber">
                {card.count}
              </span>
              <Badge variant={card.badgeVariant} className="text-[9px] py-0 px-2">
                {card.growth}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-cyber pt-0.5">
              <span>{card.subtitle}</span>
            </div>

            {/* Sparkline decoration at the bottom */}
            <div className="h-4 w-full opacity-60 group-hover:opacity-100 transition-opacity">
              <svg className="w-full h-full" viewBox="0 0 100 20">
                <path
                  d="M 0 15 Q 25 18 50 10 T 100 4"
                  fill="none"
                  stroke={card.strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
