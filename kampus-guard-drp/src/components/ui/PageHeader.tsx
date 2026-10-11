import React from 'react';

interface PageHeaderProps {
  index: string;        // e.g. "03"
  label: string;        // e.g. "SURVEILLANCE MATRIX"
  title: string;        // Big heading
  subtitle?: string;    // Sub description
  accentColor?: 'cyan' | 'blue' | 'violet' | 'emerald' | 'rose' | 'amber' | 'indigo';
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

const colorMap = {
  cyan: { line: 'bg-cyan-400', text: 'text-cyan-400', glow: 'rgba(6,182,212,0.08)' },
  blue: { line: 'bg-blue-400', text: 'text-blue-400', glow: 'rgba(59,130,246,0.08)' },
  violet: { line: 'bg-violet-400', text: 'text-violet-400', glow: 'rgba(139,92,246,0.08)' },
  emerald: { line: 'bg-emerald-400', text: 'text-emerald-400', glow: 'rgba(16,185,129,0.08)' },
  rose: { line: 'bg-rose-400', text: 'text-rose-400', glow: 'rgba(244,63,94,0.08)' },
  amber: { line: 'bg-amber-400', text: 'text-amber-400', glow: 'rgba(251,191,36,0.08)' },
  indigo: { line: 'bg-indigo-400', text: 'text-indigo-400', glow: 'rgba(99,102,241,0.08)' },
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  index,
  label,
  title,
  subtitle,
  accentColor = 'cyan',
  action,
  badge
}) => {
  const c = colorMap[accentColor];
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-800/70 p-6 shadow-xl"
      style={{
        background: `radial-gradient(ellipse 80% 80% at 0% 0%, ${c.glow}, transparent), #091120cc`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px ${c.line} opacity-40`} />
      {/* Corner HUD brackets */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl ${c.line} opacity-60`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl opacity-40`} style={{ borderColor: accentColor === 'cyan' ? '#22d3ee' : undefined }} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Index + label */}
          <div className={`inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] uppercase ${c.text}`}>
            <span className={`w-6 h-px ${c.line}`} />
            <span>{index} // {label}</span>
          </div>

          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.025em' }}
          >
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {badge && <div className="pt-1">{badge}</div>}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
