import React from 'react';
import {
  Building2, Loader2, Radar, ShieldAlert, ShieldCheck, Smartphone, TrendingUp,
} from 'lucide-react';
import type { DashboardSummary, Finding } from '../../utils/api';
import { RiskBadge } from './RiskBadge';

interface DashboardViewProps {
  brandName: string;
  summary: DashboardSummary | null;
  findings: Finding[];
  onOpenEvidence: (finding: Finding) => void;
  onRunFullScan: () => void;
  onRunSocialScan: () => void;
  onRunAppScan: () => void;
  isScanning: boolean;
}

interface StatProps {
  label: string;
  value: number | string;
  hint: string;
  icon: React.ElementType;
  tone: 'danger' | 'warn' | 'safe' | 'accent';
}

const TONES: Record<string, { ring: string; text: string; icon: string }> = {
  danger: { ring: 'border-rose-500/25', text: 'text-rose-400', icon: 'bg-rose-500/10 text-rose-400' },
  warn: { ring: 'border-amber-500/25', text: 'text-amber-400', icon: 'bg-amber-500/10 text-amber-400' },
  safe: { ring: 'border-emerald-500/25', text: 'text-emerald-400', icon: 'bg-emerald-500/10 text-emerald-400' },
  accent: { ring: 'border-cyan-500/25', text: 'text-cyan-400', icon: 'bg-cyan-500/10 text-cyan-400' },
};

const Stat: React.FC<StatProps> = ({ label, value, hint, icon: Icon, tone }) => {
  const t = TONES[tone];
  return (
    <div className={`rounded-2xl border ${t.ring} bg-slate-900/50 p-4`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${t.icon}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className={`mt-2 font-mono text-2xl font-bold ${t.text}`}>{value}</p>
      <p className="mt-1 text-[10px] leading-snug text-slate-500">{hint}</p>
    </div>
  );
};

const RISK_ROWS: Array<{ key: 'critical' | 'high' | 'medium' | 'low'; label: string; bar: string }> = [
  { key: 'critical', label: 'Critical', bar: 'bg-rose-500' },
  { key: 'high', label: 'High', bar: 'bg-amber-500' },
  { key: 'medium', label: 'Medium', bar: 'bg-yellow-500' },
  { key: 'low', label: 'Low', bar: 'bg-sky-500' },
];

/**
 * Command centre: portfolio-level counts, risk distribution, and the highest
 * priority detections currently sitting in the repository.
 */
export const DashboardView: React.FC<DashboardViewProps> = ({
  brandName, summary, findings, onOpenEvidence, onRunFullScan, onRunSocialScan, onRunAppScan, isScanning,
}) => {
  const threats = findings.filter((finding) => !finding.is_official);
  const topThreats = [...threats].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5);
  const total = summary?.all_threats ?? findings.length;
  const maxRisk = Math.max(
    1,
    ...RISK_ROWS.map((row) => (summary ? summary[row.key] : threats.filter((f) => f.risk_level.toLowerCase() === row.key).length)),
  );

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
              <span className="h-px w-6 bg-cyan-400" />
              Command centre
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Digital risk posture — {brandName}
            </h1>
            <p className="max-w-3xl text-xs leading-relaxed text-slate-400 sm:text-[13px]">
              Live view of impersonating social profiles and suspicious mobile listings detected against the
              registered brand baseline. Official assets are verified and excluded, so every count below is a real
              threat candidate.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRunFullScan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-60"
            >
              {isScanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Radar className="h-3.5 w-3.5" />}
              {isScanning ? 'Scanning…' : 'Run full scan'}
            </button>
            <button
              type="button"
              onClick={onRunSocialScan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-60"
            >
              <Radar className="h-3.5 w-3.5 text-cyan-400" />
              Social only
            </button>
            <button
              type="button"
              onClick={onRunAppScan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-60"
            >
              <Smartphone className="h-3.5 w-3.5 text-violet-400" />
              App stores only
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Threat candidates"
          value={threats.length}
          hint="Impersonating assets currently requiring triage"
          icon={ShieldAlert}
          tone="danger"
        />
        <Stat
          label="Critical severity"
          value={summary?.critical ?? threats.filter((f) => f.risk_level === 'Critical').length}
          hint="Highest priority — escalate for takedown first"
          icon={TrendingUp}
          tone="warn"
        />
        <Stat
          label="Official assets excluded"
          value={summary?.whitelisted_assets ?? findings.filter((f) => f.is_official).length}
          hint="Verified against the brand baseline and never flagged"
          icon={ShieldCheck}
          tone="safe"
        />
        <Stat
          label="Protected brands"
          value={summary?.total_brands ?? 1}
          hint={`${total} total evaluations on record`}
          icon={Building2}
          tone="accent"
        />
      </div>
<div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-sm font-bold text-white">Risk distribution</h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Breakdown of impersonation candidates by severity across every monitored surface.
          </p>

          <div className="mt-4 space-y-3">
            {RISK_ROWS.map((row) => {
              const count = summary
                ? summary[row.key]
                : threats.filter((finding) => finding.risk_level.toLowerCase() === row.key).length;
              const width = Math.round((count / maxRisk) * 100);
              return (
                <div key={row.key}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">{row.label}</span>
                    <span className="font-mono text-slate-400">{count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${row.bar} transition-all duration-500`}
                      style={{ width: `${Math.max(width, count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-800 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Social</p>
              <p className="mt-0.5 font-mono text-base font-bold text-cyan-400">
                {summary?.social_findings ?? findings.filter((f) => f.finding_type === 'social').length}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">App stores</p>
              <p className="mt-0.5 font-mono text-base font-bold text-violet-400">
                {summary?.app_findings ?? findings.filter((f) => f.finding_type === 'app').length}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Resolved</p>
              <p className="mt-0.5 font-mono text-base font-bold text-emerald-400">{summary?.resolved ?? 0}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Priority queue</h2>
              <p className="mt-1 text-[11px] text-slate-400">Highest scored impersonation candidates awaiting triage.</p>
            </div>
          </div>

          {topThreats.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-800 p-6 text-center">
              <p className="text-xs text-slate-400">
                No threats recorded yet. Run a full scan to evaluate the brand against social and app surfaces.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {topThreats.map((finding) => (
                <li key={finding.id}>
                  <button
                    type="button"
                    onClick={() => onOpenEvidence(finding)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-semibold text-white">{finding.candidate_name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                        {finding.title} · {finding.detection_source}
                      </p>
                    </div>
                    <RiskBadge level={finding.risk_level} score={finding.risk_score} className="shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
