import React, { useMemo, useState } from 'react';
import { ExternalLink, Loader2, PackageSearch, Radar, TriangleAlert } from 'lucide-react';
import type { Finding } from '../../utils/api';
import { auditPackageAPI, type AuditedPackageResult } from '../../utils/api';
import { FindingsFeed } from './FindingsFeed';
import { SectionHeader } from './SectionHeader';
import { RiskBadge } from './RiskBadge';

interface AppStoreMonitoringViewProps {
  brandName: string;
  findings: Finding[];
  onOpenEvidence: (finding: Finding) => void;
  onSetStatus: (finding: Finding, status: string) => void;
  onRunScan: () => void;
  isScanning: boolean;
  onAfterAudit: () => void;
  busyId: string | null;
}

const SAMPLE_PACKAGES = ['com.apkpure.aegon', 'com.whatsapp', 'com.fake.drp.rewards'];

/**
 * App store monitoring: scans the app surface against the publisher baseline,
 * audits an individual package on demand, and lists every evaluated listing.
 */
export const AppStoreMonitoringView: React.FC<AppStoreMonitoringViewProps> = ({
  brandName, findings, onOpenEvidence, onSetStatus, onRunScan, isScanning, onAfterAudit, busyId,
}) => {
  const [packageId, setPackageId] = useState('');
  const [audit, setAudit] = useState<AuditedPackageResult | null>(null);
  const [auditing, setAuditing] = useState(false);

  const apps = useMemo(() => findings.filter((f) => f.finding_type === 'app'), [findings]);

  const flagged = apps.filter((f) => !f.is_official);
  const official = apps.filter((f) => f.is_official);
  const publisherMismatch = flagged.filter((f) => /publisher/i.test(JSON.stringify(f.factors || [])));
  const critical = flagged.filter((f) => f.risk_level === 'Critical');

  const runPackageAudit = async (value?: string) => {
    const target = (value ?? packageId).trim();
    if (!target) return;
    setPackageId(target);
    setAuditing(true);
    try {
      const result = await auditPackageAPI(target, brandName);
      setAudit(result);
      onAfterAudit();
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="App store monitoring"
        title="Impersonator app & rogue publisher detection"
        subtitle={`Listings are compared against ${brandName}'s registered applications and authorised publisher signature. A matching package ID from an authorised publisher is treated as an official asset and is never flagged.`}
        stats={[
          { label: 'Listings evaluated', value: apps.length, tone: 'accent' },
          { label: 'Flagged as impersonation', value: flagged.length, tone: 'danger' },
          { label: 'Official apps excluded', value: official.length, tone: 'safe' },
          { label: 'Publisher mismatches', value: publisherMismatch.length, tone: 'danger' },
        ]}
        action={
          <button
            type="button"
            onClick={onRunScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-60"
          >
            {isScanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Radar className="h-3.5 w-3.5" />}
            {isScanning ? 'Querying stores…' : 'Run app store scan'}
          </button>
        }
      />

      {critical.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/[0.05] p-4">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-xs leading-relaxed text-rose-200">
            <span className="font-bold">{critical.length} critical listing{critical.length === 1 ? '' : 's'}</span>{' '}
            combine an unauthorised publisher with high-risk permissions such as SMS interception or overlay injection.
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold text-white">Audit a package ID</h2>
          <p className="max-w-3xl text-[11px] text-slate-400">
            Inspect any package against the authorised publisher baseline. The backend probes the live store listing
            when it is reachable and falls back to mirror-repository heuristics otherwise, then records the verdict.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5">
            <PackageSearch className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <input
              value={packageId}
              onChange={(event) => setPackageId(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') runPackageAudit();
              }}
              placeholder="com.example.suspicious.app"
              className="w-full bg-transparent font-mono text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => runPackageAudit()}
            disabled={auditing || !packageId.trim()}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 transition-colors hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {auditing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageSearch className="h-3.5 w-3.5" />}
            Audit package
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Try</span>
          {SAMPLE_PACKAGES.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => runPackageAudit(sample)}
              className="rounded-md border border-slate-700 bg-slate-800/50 px-2 py-0.5 font-mono text-[10px] text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              {sample}
            </button>
          ))}
        </div>

        {audit && (
          <div
            className={`mt-4 rounded-xl border p-4 ${
              audit.is_official ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-rose-500/30 bg-rose-500/[0.05]'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-white">{audit.app_name}</span>
              <RiskBadge level={audit.is_official ? 'SAFE' : audit.risk_level} score={audit.is_official ? undefined : audit.risk_score} />
              <span className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-300">
                {String(audit.store).replace('_', ' ')}
              </span>
            </div>

            <p className="mt-1 font-mono text-[11px] text-cyan-400">{audit.package_name}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">{audit.note}</p>

            <div className="mt-3 grid grid-cols-2 gap-3 font-mono text-[11px] sm:grid-cols-4">
              <div>
                <p className="text-slate-500">Publisher</p>
                <p className="truncate text-rose-300" title={audit.publisher}>
                  {audit.publisher}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Installs</p>
                <p className="text-slate-200">{audit.downloads}</p>
              </div>
              <div>
                <p className="text-slate-500">Rating</p>
                <p className="text-slate-200">{audit.rating} / 5</p>
              </div>
              <div>
                <p className="text-slate-500">Publisher mismatch</p>
                <p className={audit.is_publisher_mismatch ? 'text-rose-300' : 'text-emerald-300'}>
                  {audit.is_publisher_mismatch ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {audit.permissions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {audit.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] text-rose-300"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            )}

            <a
              href={audit.store_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open store listing
            </a>
          </div>
        )}
      </section>

      <FindingsFeed
        findings={apps}
        onOpenEvidence={onOpenEvidence}
        onSetStatus={onSetStatus}
        busyId={busyId}
        emptyLabel="No app listings recorded yet. Run an app store scan to evaluate the mobile surface."
      />
    </div>
  );
};
