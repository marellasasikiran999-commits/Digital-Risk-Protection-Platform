import React from 'react';

export interface HeaderStat {
  label: string;
  value: string | number;
  tone?: 'default' | 'danger' | 'safe' | 'accent';
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats?: HeaderStat[];
  action?: React.ReactNode;
}

const TONE: Record<string, string> = {
  default: 'text-white',
  danger: 'text-rose-400',
  safe: 'text-emerald-400',
  accent: 'text-cyan-400',
};

/**
 * Standard page header used by every monitoring surface: eyebrow label, title,
 * explanatory subtitle, a compact metric strip and an optional action control.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow, title, subtitle, stats = [], action,
}) => (
  <header className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
          <span className="h-px w-6 bg-cyan-400" />
          {eyebrow}
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h1>
        <p className="max-w-3xl text-xs leading-relaxed text-slate-400 sm:text-[13px]">{subtitle}</p>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>

    {stats.length > 0 && (
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className={`mt-0.5 font-mono text-lg font-bold ${TONE[stat.tone || 'default']}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    )}
  </header>
);
