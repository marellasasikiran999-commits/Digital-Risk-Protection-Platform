import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Finding } from '../../utils/api';
import { FindingCard } from './FindingCard';

type RiskFilter = 'all' | 'Critical' | 'High' | 'Medium' | 'Low';
type ClassFilter = 'all' | 'flagged' | 'official';

interface FindingsFeedProps {
  findings: Finding[];
  onOpenEvidence: (finding: Finding) => void;
  onSetStatus: (finding: Finding, status: string) => void;
  busyId?: string | null;
  emptyLabel?: string;
}

const RISK_ORDER: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3, SAFE: 4 };

/**
 * Filterable, searchable list of findings. Shared by the social and app-store
 * monitoring views so both surfaces behave identically for the analyst.
 */
export const FindingsFeed: React.FC<FindingsFeedProps> = ({
  findings, onOpenEvidence, onSetStatus, busyId = null, emptyLabel = 'No detections match the current filters.',
}) => {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState<RiskFilter>('all');
  const [klass, setKlass] = useState<ClassFilter>('flagged');
  const [showOfficial, setShowOfficial] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    const rows = findings.filter((finding) => {
      if (klass === 'flagged' && finding.is_official) return false;
      if (risk !== 'all' && finding.risk_level !== risk) return false;
      if (!term) return true;
      return (
        (finding.candidate_name || '').toLowerCase().includes(term) ||
        (finding.title || '').toLowerCase().includes(term) ||
        (finding.developer || '').toLowerCase().includes(term) ||
        (finding.detection_source || '').toLowerCase().includes(term) ||
        (finding.category || '').toLowerCase().includes(term)
      );
    });

    return rows.sort((a, b) => {
      if (a.is_official !== b.is_official) return a.is_official ? 1 : -1;
      if (a.risk_score !== b.risk_score) return b.risk_score - a.risk_score;
      return (RISK_ORDER[a.risk_level] ?? 9) - (RISK_ORDER[b.risk_level] ?? 9);
    });
  }, [findings, query, risk, klass]);

  const flaggedCount = findings.filter((f) => !f.is_official).length;
  const officialCount = findings.filter((f) => f.is_official).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search handle, app title, publisher, detection source…"
            className="w-full bg-transparent font-mono text-xs text-white placeholder-slate-600 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1.5 text-[11px] font-medium text-slate-500 lg:inline-flex">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Risk
          </span>
          {(['all', 'Critical', 'High', 'Medium', 'Low'] as RiskFilter[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setRisk(level)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                risk === level
                  ? 'bg-cyan-500 text-slate-950'
                  : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {level === 'all' ? 'All' : level}
            </button>
          ))}

          <div className="ml-1 flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setKlass('flagged')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                klass === 'flagged' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Threats {flaggedCount}
            </button>
            <button
              type="button"
              onClick={() => setKlass('all')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                klass === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All {flaggedCount + officialCount}
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500">
        Showing <span className="font-semibold text-slate-300">{filtered.length}</span> of {findings.length} evaluated assets
        {officialCount > 0 && (
          <>
            {' · '}
            <button
              type="button"
              onClick={() => setShowOfficial((value) => !value)}
              className="text-emerald-400 underline decoration-dotted underline-offset-2 hover:text-emerald-300"
            >
              {showOfficial ? 'hide' : 'show'} {officialCount} official assets excluded by the baseline
            </button>
          </>
        )}
      </p>

      {showOfficial && officialCount > 0 && (
        <div className="space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.03] p-4">
          <p className="text-xs font-semibold text-emerald-300">
            Official assets from the brand profile — verified and deliberately excluded from flagging
          </p>
          <div className="flex flex-wrap gap-2">
            {findings
              .filter((finding) => finding.is_official)
              .map((finding) => (
                <span
                  key={finding.id}
                  className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-200"
                >
                  {finding.candidate_name}
                </span>
              ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
          <p className="text-sm text-slate-400">{emptyLabel}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onOpenEvidence={onOpenEvidence}
              onSetStatus={onSetStatus}
              busy={busyId === finding.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
