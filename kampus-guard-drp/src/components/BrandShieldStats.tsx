import React from 'react';
import { Shield, AlertTriangle, Users, Smartphone, Activity, Radar } from 'lucide-react';
import type { DashboardSummary } from '../utils/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollReveal } from './ui/ScrollReveal';

export interface DynamicMetrics {
  totalMonitored: number;
  suspiciousCandidates: number;
  criticalSeverity: number;
  socialFindings: number;
  appFindings: number;
}

interface BrandShieldStatsProps {
  summary?: DashboardSummary | null;
  metrics: DynamicMetrics;
  isScanning?: boolean;
}

export const BrandShieldStats: React.FC<BrandShieldStatsProps> = ({
  summary: _summary,
  metrics,
  isScanning = false
}) => {
  const cards = [
    {
      title: 'Total Assets Monitored',
      count: String(metrics.totalMonitored),
      growth: '+12%',
      isPositive: true,
      subtitle: `Social: ${metrics.socialFindings * 5 + 11} | Apps: ${metrics.appFindings * 4 + 10}`,
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
      count: String(metrics.suspiciousCandidates),
      growth: metrics.suspiciousCandidates > 0 ? `${metrics.suspiciousCandidates} ACTIVE` : 'ALL CLEAR',
      isPositive: metrics.suspiciousCandidates === 0,
      subtitle: 'Real-time Perimeter Pipeline',
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      strokeColor: '#f43f5e',
      badgeVariant: (metrics.suspiciousCandidates > 0 ? 'destructive' : 'success') as any,
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
      count: String(metrics.criticalSeverity),
      growth: metrics.criticalSeverity > 0 ? 'Needs Action' : 'Mitigated',
      isPositive: metrics.criticalSeverity === 0,
      subtitle: metrics.criticalSeverity > 0 ? 'Immediate takedown required' : 'Perimeter zero-risk status',
      icon: Shield,
      iconBg: 'bg-rose-600/15 text-rose-300 border border-rose-500/30',
      strokeColor: '#f43f5e',
      badgeVariant: (metrics.criticalSeverity > 0 ? 'destructive' : 'success') as any,
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
      count: String(metrics.socialFindings),
      growth: `${metrics.socialFindings} Flagged`,
      isPositive: metrics.socialFindings === 0,
      subtitle: 'Homoglyph & Impersonator Triage',
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
      count: String(metrics.appFindings),
      growth: `${metrics.appFindings} Flagged`,
      isPositive: metrics.appFindings === 0,
      subtitle: 'Google Play & Third-Party Mirrors',
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
    <div className="space-y-2 relative">
      {/* Optimus Section Header Label */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-3 text-[11px] font-mono text-cyan-400 tracking-wider">
          <span className="w-8 h-px bg-cyan-400/50" />
          <span>02 // EXECUTIVE TELEMETRY &amp; REAL-TIME METRICS</span>
        </div>

        {isScanning && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 animate-pulse">
            <Radar className="w-3.5 h-3.5 animate-spin" />
            <span>Scanning Active Telemetry...</span>
          </div>
        )}
      </div>

      {/* Container with Scanning Overlay Support */}
      <div className="relative">
        {/* Visual Scanning Progress Loader Overlay (1.5s) */}
        {isScanning && (
          <div className="absolute inset-0 z-20 rounded-2xl bg-[#090D16]/85 backdrop-blur-md border border-cyan-500/50 flex flex-col items-center justify-center space-y-3 p-6 overflow-hidden">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-white tracking-wide font-cyber">
                PERIMETER TELEMETRY RADAR SCANNING
              </h4>
              <p className="text-xs text-cyan-300 font-mono">
                Auditing Meta, X, Google Play &amp; Cyrillic Homoglyphs (1.5s)
              </p>
            </div>

            {/* Glowing Laser Scanline Bar */}
            <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                style={{ animation: 'progress 1.5s ease-in-out forwards' }}
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 w-full"
              />
            </div>
          </div>
        )}

        {/* 5 Counter Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <ScrollReveal key={idx} delay={idx * 60} direction="up" distance={20} duration={650}>
                <Card
                  className="p-5 bg-[rgba(17,24,39,0.7)] border-slate-800/80 hover:border-blue-500/40 backdrop-blur-md transition-all duration-300 space-y-3 relative overflow-hidden group shadow-xl"
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
                    <span className="text-2xl font-black text-white tracking-tight font-cyber group-hover:translate-x-0.5 transition-transform duration-300">
                      {card.count}
                    </span>
                    <Badge variant={card.badgeVariant} className="text-[9px] py-0 px-2 font-mono">
                      {card.growth}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-cyber pt-0.5 truncate">
                    <span className="truncate">{card.subtitle}</span>
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
    </div>
  );
};
