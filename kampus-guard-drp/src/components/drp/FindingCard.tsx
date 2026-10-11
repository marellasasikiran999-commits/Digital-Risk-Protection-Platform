import React from 'react';
import {
  FileSearch, ShieldAlert, ShieldCheck, Smartphone, Globe, Radio,
} from 'lucide-react';
import type { Finding } from '../../utils/api';
import { RiskBadge, StatusBadge } from './RiskBadge';

const TYPE_META: Record<string, { icon: React.ElementType; label: string }> = {
  social: { icon: Radio, label: 'Social Profile' },
  app: { icon: Smartphone, label: 'Mobile App' },
  domain: { icon: Globe, label: 'Domain' },
};

interface FindingCardProps {
  finding: Finding;
  onOpenEvidence: (finding: Finding) => void;
  onSetStatus: (finding: Finding, status: string) => void;
  busy?: boolean;
}

/**
 * Single detection row. Renders the candidate asset, the signals that produced
 * its score, and the triage actions available to the analyst.
 */
export const FindingCard: React.FC<FindingCardProps> = ({
  finding, onOpenEvidence, onSetStatus, busy = false,
}) => {
  const meta = TYPE_META[finding.finding_type] || TYPE_META.domain;
  const Icon = meta.icon;
  const isWhitelisted = finding.is_official;
  const factors = finding.factors || [];

  const accent = isWhitelisted
    ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
    : finding.risk_level === 'Critical'
    ? 'border-rose-500/30 bg-rose-500/[0.03]'
    : 'border-slate-800 bg-slate-900/40';

  return (
    <div className={`rounded-2xl border ${accent} p-4 sm:p-5 transition-colors hover:border-slate-700`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              isWhitelisted
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-slate-700 bg-slate-800/60 text-cyan-400'
            }`}
          >
            {isWhitelisted ? <ShieldCheck className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-mono text-sm font-semibold text-white">
                {finding.candidate_name}
              </span>
              <span className="rounded-md border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                {meta.label}
              </span>
              <RiskBadge
                level={isWhitelisted ? 'SAFE' : finding.risk_level}
                score={isWhitelisted ? undefined : finding.risk_score}
              />
              <StatusBadge status={finding.status} />
            </div>

            <p className="text-xs font-medium text-slate-300">{finding.title}</p>
            <p className="text-[11px] text-slate-400">{finding.category}</p>

            {finding.note && (
              <p className="max-w-3xl text-xs leading-relaxed text-slate-400">{finding.note}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-[11px] text-slate-500">
              <span>
                Source: <span className="text-slate-300">{finding.detection_source}</span>
              </span>
              {!isWhitelisted && (
                <>
                  <span>
                    Name match: <span className="text-slate-300">{finding.similarity_rate}%</span>
                  </span>
                  <span>
                    Confidence: <span className="text-slate-300">{finding.confidence_score}%</span>
                  </span>
                </>
              )}
              <span>
                Official asset: <span className="text-slate-300">{finding.asset}</span>
              </span>
            </div>

            {factors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {factors.map((factor, index) => (
                  <span
                    key={index}
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-mono ${
                      isWhitelisted
                        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300'
                    }`}
                    title={factor.factor}
                  >
                    {factor.factor.length > 62 ? `${factor.factor.slice(0, 62)}…` : factor.factor}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenEvidence(finding)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-[11px] font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            <FileSearch className="h-3.5 w-3.5 text-cyan-400" />
            Evidence
          </button>

          {!isWhitelisted && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => onSetStatus(finding, 'Legitimate')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Legitimate
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onSetStatus(finding, finding.status === 'Takedown' ? 'Pending' : 'Takedown')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-rose-500 disabled:opacity-50"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                {finding.status === 'Takedown' ? 'Undo takedown' : 'Request takedown'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
