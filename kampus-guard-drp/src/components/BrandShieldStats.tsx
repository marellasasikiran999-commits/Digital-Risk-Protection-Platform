import React from 'react';
import { Shield, AlertTriangle, Users, Smartphone } from 'lucide-react';
import type { DashboardSummary } from '../utils/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollReveal } from './ui/ScrollReveal';

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
      badgeVariant: 'default' as const,
      svgAnimation: (
        <svg viewBox="0 0 100 24" className="w-full h-5 text-blue-400">
          <circle cx="10" cy="12" r="3" fill="currentColor">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="10" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
            <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <line x1="20" y1="12" x2="80" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3">
            <animate attributeName="stroke-dashoffset" values="0;-6" dur="1s" repeatCount="indefinite" />
          </line>
          <circle cx="90" cy="12" r="3" fill="currentColor" />
        </svg>
      )
    },
    {
      title: 'Suspicious Candidates',
      count: summary?.suspicious_candidates !== undefined ? String(summary.suspicious_candidates) : '23',
      growth: '+28%',
      isPositive: false,
      subtitle: 'Social: 16 | Apps: 7',
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      strokeColor: '#f43f5e',
      badgeVariant: 'destructive' as const,
      svgAnimation: (
        <svg viewBox="0 0 100 24" className="w-full h-5 text-rose-400">
          <g>
            <rect x="15" y="6" width="70" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <rect x="20" y="8" width="60" height="8" rx="1.5" fill="currentColor" opacity="0.2">
              <animate attributeName="width" values="10;60;10" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite" />
            </rect>
          </g>
        </svg>
      )
    },
    {
      title: 'Critical Severity',
      count: (summary?.critical !== undefined && summary.critical > 0)
        ? String(summary.critical)
        : (summary?.high !== undefined ? String(summary.high) : '8'),
      growth: 'Needs Action',
      isPositive: false,
      subtitle: 'Immediate takedown required',
      icon: Shield,
      iconBg: 'bg-rose-600/15 text-rose-300 border border-rose-500/30',
      strokeColor: '#f43f5e',
      badgeVariant: 'destructive' as const,
      svgAnimation: (
        <svg viewBox="0 0 100 24" className="w-full h-5 text-rose-500">
          <path d="M 10 18 Q 30 4 50 14 T 90 6" fill="none" stroke="currentColor" strokeWidth="1.5">
            <animate attributeName="stroke-width" values="1.5;2.5;1.5" dur="1.8s" repeatCount="indefinite" />
          </path>
          <circle cx="90" cy="6" r="3" fill="currentColor">
            <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      )
    },
    {
      title: 'Social Media Findings',
      count: summary?.social_findings !== undefined ? String(summary.social_findings) : '15',
      growth: '5 Resolved',
      isPositive: true,
      subtitle: 'Homoglyph spoof alerts',
      icon: Users,
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      strokeColor: '#06b6d4',
      badgeVariant: 'cyber' as const,
      svgAnimation: (
        <svg viewBox="0 0 100 24" className="w-full h-5 text-cyan-400">
          <path d="M 15 12 A 8 8 0 0 1 25 6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M 12 12 A 12 12 0 0 1 28 3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.7;0.1" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
          </path>
          <circle cx="20" cy="14" r="2" fill="currentColor" />
          <line x1="35" y1="12" x2="85" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2">
            <animate attributeName="stroke-dashoffset" values="0;-4" dur="0.8s" repeatCount="indefinite" />
          </line>
        </svg>
      )
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
      badgeVariant: 'secondary' as const,
      svgAnimation: (
        <svg viewBox="0 0 100 24" className="w-full h-5 text-indigo-400">
          <rect x="25" y="4" width="50" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="30" y1="6" x2="70" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.3">
            <animate attributeName="y1" values="6;18;6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="6;18;6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </line>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Big Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2 pb-1">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase mb-1">
            <span className="w-6 h-px bg-cyan-400" />
            <span>02 // SURVEILLANCE TELEMETRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Live Threat Surface &amp; Perimeter Metrics
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Event Stream Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <ScrollReveal key={idx} delay={idx * 60} direction="up" distance={20} duration={650}>
              <Card
                className="p-5 card-glow-top transition-all duration-300 space-y-3 relative overflow-hidden group glass-panel-hover hud-bracket"
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
                  <span className="text-3xl lg:text-4xl font-black text-white tracking-tight font-display metric-glow group-hover:translate-x-0.5 transition-transform">
                    {card.count}
                  </span>
                  <Badge variant={card.badgeVariant} className="text-[10px] py-0.5 px-2 font-mono">
                    {card.growth}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-cyber pt-0.5">
                  <span>{card.subtitle}</span>
                </div>

                {/* Optimus-style Interactive Animated SVG Telemetry Meter */}
                <div className="pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {card.svgAnimation}
                </div>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
};
