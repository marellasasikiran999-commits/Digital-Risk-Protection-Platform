import React from 'react';

const RISK_STYLES: Record<string, string> = {
  Critical: 'bg-rose-500/12 text-rose-300 border-rose-500/35',
  High: 'bg-amber-500/12 text-amber-300 border-amber-500/35',
  Medium: 'bg-yellow-500/12 text-yellow-200 border-yellow-500/30',
  Low: 'bg-sky-500/12 text-sky-300 border-sky-500/30',
  SAFE: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/35',
  Resolved: 'bg-slate-500/12 text-slate-300 border-slate-500/30',
};

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  'In-progress': 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  Takedown: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  Resolved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  Legitimate: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
};

interface RiskBadgeProps {
  level: string;
  score?: number;
  className?: string;
}

/** Coloured pill rendering a risk level, optionally with its numeric score. */
export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, className = '' }) => {
  const style = RISK_STYLES[level] || RISK_STYLES.Low;
  const label = typeof score === 'number' ? `${level} ${score}` : level;
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${style} ${className}`}
    >
      {label}
    </span>
  );
};

/** Coloured pill rendering the triage status of a finding. */
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold whitespace-nowrap ${
      STATUS_STYLES[status] || STATUS_STYLES.Pending
    } ${className}`}
  >
    {status}
  </span>
);
