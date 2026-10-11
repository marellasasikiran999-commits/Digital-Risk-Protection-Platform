import React, { useMemo, useState } from 'react';
import { AtSign, Loader2, Radar, ShieldCheck, TriangleAlert } from 'lucide-react';
import type { Finding } from '../../utils/api';
import { auditSocialHandleAPI } from '../../utils/api';
import { FindingsFeed } from './FindingsFeed';
import { SectionHeader } from './SectionHeader';
import { RiskBadge } from './RiskBadge';

interface HandleAudit {
  handle: string;
  is_official: boolean;
  risk_score: number;
  risk_level: string;
  similarity_score: number;
  matched_official: string;
  has_homoglyph: boolean;
  homoglyph_details?: string;
  keywords: string[];
  factors: Array<{ factor: string; score: number }>;
  verdict: string;
}

interface SocialMonitoringViewProps {
  brandName: string;
  findings: Finding[];
  onOpenEvidence: (finding: Finding) => void;
  onSetStatus: (finding: Finding, status: string) => void;
  onRunScan: () => void;
  isScanning: boolean;
  busyId: string | null;
}

const PLATFORM_SUGGESTIONS = ['twitter', 'instagram', 'facebook', 'telegram', 'tiktok'];

/**
 * Social surface monitoring: runs the brand-baseline scan, lets an analyst probe
 * an individual handle, and lists every candidate the engine evaluated.
 */
export const SocialMonitoringView: React.FC<SocialMonitoringViewProps> = ({
  brandName, findings, onOpenEvidence, onSetStatus, onRunScan, isScanning, busyId,
}) => {
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [audit, setAudit] = useState<HandleAudit | null>(null);
  const [auditing, setAuditing] = useState(false);

  const social = useMemo(() => findings.filter((f) => f.finding_type === 'social'), [findings]);

  const flagged = social.filter((f) => !f.is_official);
  const official = social.filter((f) => f.is_official);
  const homoglyph = flagged.filter((f) => /homoglyph/i.test(`${f.title} ${f.category}`));
  const critical = flagged.filter((f) => f.risk_level === 'Critical');

  const runHandleAudit = async () => {
    const value = handle.trim();
    if (!value) return;
    setAuditing(true);
    try {
      const result = await auditSocialHandleAPI(value, brandName, platform);
      setAudit(result as HandleAudit | null);
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Social media monitoring"
        title="Impersonating profile & scam account detection"
        subtitle={`Every candidate handle is scored against the registered official accounts for ${brandName}. Registered official accounts short-circuit to risk 0, so the brand's own profiles are never flagged.`}
        stats={[
          { label: 'Handles evaluated', value: social.length, tone: 'accent' },
          { label: 'Flagged as impersonation', value: flagged.length, tone: 'danger' },
          { label: 'Official accounts excluded', value: official.length, tone: 'safe' },
          { label: 'Homoglyph attacks', value: homoglyph.length, tone: 'danger' },
        ]}
        action={
          <button
            type="button"
            onClick={onRunScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-60"
          >
            {isScanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Radar className="h-3.5 w-3.5" />}
            {isScanning ? 'Scanning surfaces…' : 'Run social scan'}
          </button>
        }
      />

      {critical.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/[0.05] p-4">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-xs leading-relaxed text-rose-200">
            <span className="font-bold">{critical.length} critical impersonation{critical.length === 1 ? '' : 's'}</span>{' '}
            detected. These handles combine a brand token with scam lures and should be escalated for takedown first.
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold text-white">Probe a single handle</h2>
            <p className="max-w-2xl text-[11px] text-slate-400">
              Enter any username to see exactly how the engine scores it: homoglyph analysis, digit look-alike
              normalisation, brand-token detection and similarity to the nearest official account.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
            <div className="flex min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5">
              <AtSign className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <input
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') runHandleAudit();
                }}
                placeholder="e.g. drp_supp0rt24"
                className="w-full bg-transparent font-mono text-xs text-white placeholder-slate-600 outline-none"
              />
            </div>

            <select
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none"
            >
              {PLATFORM_SUGGESTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={runHandleAudit}
              disabled={auditing || !handle.trim()}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 transition-colors hover:bg-cyan-500/20 disabled:opacity-50"
            >
              {auditing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Score handle
            </button>
          </div>
        </div>

        {audit && (
          <div
            className={`mt-4 rounded-xl border p-4 ${
              audit.is_official
                ? 'border-emerald-500/30 bg-emerald-500/[0.05]'
                : audit.risk_score >= 65
                ? 'border-rose-500/30 bg-rose-500/[0.05]'
                : 'border-slate-700 bg-slate-950/60'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">{audit.handle}</span>
              <RiskBadge level={audit.is_official ? 'SAFE' : audit.risk_level} score={audit.is_official ? undefined : audit.risk_score} />
              <span className="font-mono text-[11px] text-slate-400">
                nearest official account: <span className="text-slate-200">{audit.matched_official}</span> ·{' '}
                {audit.similarity_score}% similar
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-300">{audit.verdict}</p>

            {audit.has_homoglyph && audit.homoglyph_details && (
              <p className="mt-2 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1.5 font-mono text-[11px] text-violet-200">
                {audit.homoglyph_details}
              </p>
            )}

            {audit.factors.length > 0 && (
              <ul className="mt-3 space-y-1">
                {audit.factors.map((factor, index) => (
                  <li key={index} className="flex items-start justify-between gap-4 text-[11px] text-slate-400">
                    <span>• {factor.factor}</span>
                    {factor.score > 0 && <span className="shrink-0 font-mono text-slate-300">+{factor.score}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <FindingsFeed
        findings={social}
        onOpenEvidence={onOpenEvidence}
        onSetStatus={onSetStatus}
        busyId={busyId}
        emptyLabel="No social candidates recorded yet. Run a social scan to evaluate the brand's social surface."
      />
    </div>
  );
};
