import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Plus, Radio, 
  Download, Search, Globe, Terminal
} from 'lucide-react';
import type { Finding } from '../utils/api';
import { ScrollReveal } from './ui/ScrollReveal';

interface LatestFindingsSectionProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onOpenAddBrand: () => void;
  onRunSocialScan: () => void;
  onRunAppScan: () => void;
  onExportReport: () => void;
  isScanningSocial: boolean;
  isScanningApp: boolean;
  onMarkSafe?: (id: string) => void;
  onTakedown?: (id: string) => void;
}

export const LatestFindingsSection: React.FC<LatestFindingsSectionProps> = ({
  findings,
  onSelectFinding,
  onOpenAddBrand,
  onRunSocialScan,
  onRunAppScan,
  onExportReport,
  isScanningSocial,
  isScanningApp,
  onMarkSafe,
  onTakedown
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState('');
  const [activeStep, setActiveStep] = useState<number>(0);

  // Auto-cycle through the 3 pipeline steps every 6 seconds if user doesn't click
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const filtered = findings.filter((f) => {
    if (filter === 'high' && f.risk_level !== 'High' && f.risk_level !== 'Critical') return false;
    if (filter === 'medium' && f.risk_level !== 'Medium') return false;
    if (filter === 'low' && f.risk_level !== 'Low') return false;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      return (
        f.candidate_name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        (f.note && f.note.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getPlatformIcon = (sourceOrType: string) => {
    const p = sourceOrType.toLowerCase();
    if (p.includes('instagram') || p.includes('x') || p.includes('twitter') || p.includes('facebook') || p.includes('social')) {
      return <Radio className="w-4 h-4 text-cyan-400" />;
    }
    if (p.includes('google') || p.includes('play') || p.includes('apple') || p.includes('app')) {
      return <Smartphone className="w-4 h-4 text-purple-400" />;
    }
    return <Globe className="w-4 h-4 text-emerald-400" />;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-rose-600 text-white font-black';
    if (score >= 60) return 'bg-orange-600 text-white font-black';
    if (score >= 45) return 'bg-amber-500 text-slate-950 font-bold';
    return 'bg-emerald-600 text-white font-bold';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Pending') return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    if (status === 'In Review' || status === 'In-progress') return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
  };

  const steps = [
    {
      num: 'I',
      title: 'Perimeter Ingestion',
      desc: 'Real-time crawler across Instagram, X, Facebook, and Google Play app registries.',
      code: `// Multi-Signal Crawler Ingestion
const candidate = await drp.ingest({
  sources: ['meta', 'x_stream', 'playstore'],
  homoglyphAudit: true
});
// 23 active candidate signatures flagged`
    },
    {
      num: 'II',
      title: 'Zero False Positive Audit',
      desc: 'Levenshtein distance & Cyrillic look-alike verification with whitelist baseline exclusion.',
      code: `// Strict Whitelist Baseline Protection
if (brand.official_handles.includes(handle)) {
  return bypass({ reason: 'OFFICIAL_WHITELIST' });
}
const visualScore = matchLogoHash(candidate.logo);
assert(riskScore >= 75); // Mitigate spoofing`
    },
    {
      num: 'III',
      title: 'Autonomous Mitigation Dossier',
      desc: 'Automatic SHA256 evidence hashing, cryptographic snapshot, and one-click takedown export.',
      code: `// Cryptographic Evidence Package
const dossier = await generateDossier({
  candidate: '@drp_support24',
  sha256: '9f86d081884c7d659a2feaa0c55ad015',
  legalFormat: 'CSV_DMCA_TAKEDOWN'
});
// Ready for automated enforcement`
    }
  ];

  return (
    <div className="space-y-2">
      {/* Optimus Section Header Label */}
      <div className="inline-flex items-center gap-3 text-[11px] font-mono text-cyan-400 tracking-wider">
        <span className="w-8 h-px bg-cyan-400/50" />
        <span>04 // ACTIVE THREAT REPOSITORY &amp; PIPELINE ENGINE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Latest Findings Table (col-span-8) */}
        <div className="lg:col-span-8">
          <ScrollReveal direction="up" delay={0} distance={24} duration={700}>
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 group glass-panel-hover">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white mr-2 group-hover:translate-x-1 transition-transform">
                    Latest Findings
                  </h3>
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filter === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({findings.length})
                  </button>
                  <button
                    onClick={() => setFilter('high')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filter === 'high' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Critical/High ({findings.filter(f => (f.risk_level === 'Critical' || f.risk_level === 'High') && f.status !== 'Resolved').length})
                  </button>
                  <button
                    onClick={() => setFilter('medium')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filter === 'medium' ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Medium ({findings.filter(f => f.risk_level === 'Medium' && f.status !== 'Resolved').length})
                  </button>
                  <button
                    onClick={() => setFilter('low')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filter === 'low' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Whitelisted ({findings.filter(f => f.status === 'Resolved' || f.status === 'Legitimate').length})
                  </button>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search findings..."
                    className="w-full bg-[#141e33] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Findings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="py-2.5 px-2">Type</th>
                      <th className="py-2.5 px-2">Candidate Identity</th>
                      <th className="py-2.5 px-2">Perimeter</th>
                      <th className="py-2.5 px-2">Risk</th>
                      <th className="py-2.5 px-2">Flagged Reason</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filtered.map((item) => (
                      <tr 
                        key={item.id}
                        onClick={() => onSelectFinding(item)}
                        className="hover:bg-[#141f36] cursor-pointer transition-colors group/row"
                      >
                        <td className="py-3 px-2">
                          <div className="w-8 h-8 rounded-xl bg-[#121c30] border border-slate-800 flex items-center justify-center group-hover/row:border-blue-500/40 transition-colors">
                            {getPlatformIcon(item.detection_source || item.finding_type)}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-white font-bold block truncate max-w-[150px] group-hover/row:text-cyan-300 transition-colors">{item.candidate_name}</span>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">{item.category || item.finding_type}</span>
                        </td>
                        <td className="py-3 px-2 text-slate-300 font-medium">
                          {item.finding_type === 'app' ? 'Mobile App' : (item.finding_type === 'domain' ? 'Domain' : 'Social Media')}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono ${getScoreBadge(item.risk_score)}`}>
                            {item.risk_score}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-300 max-w-[180px]">
                          <span className="block truncate text-[11px]">{item.note || 'Similar name + extra word / No official logo'}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectFinding(item);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#14213d] hover:bg-blue-600 hover:text-white text-blue-400 font-bold text-xs border border-blue-500/20 transition-all font-mono"
                            >
                              View
                            </button>
                            {onMarkSafe && item.status !== 'Resolved' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkSafe(item.id);
                                }}
                                className="px-2 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-600 hover:text-white text-emerald-300 font-bold text-xs border border-emerald-500/20 transition-all font-mono"
                                title="Mark Safe (0% False Positive)"
                              >
                                Safe
                              </button>
                            )}
                            {onTakedown && item.status !== 'Resolved' && item.status !== 'In-progress' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTakedown(item.id);
                                }}
                                className="px-2 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-600 hover:text-white text-rose-300 font-bold text-xs border border-rose-500/20 transition-all font-mono"
                                title="Simulate Takedown"
                              >
                                Takedown
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Quick Actions Stack & Optimus Process Pipeline (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <ScrollReveal direction="up" delay={120} distance={24} duration={700}>
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 glass-panel-hover">
              <h3 className="text-sm font-bold text-white mb-2">Perimeter Actions</h3>

              <div className="space-y-2 text-xs font-bold font-mono">
                <button
                  onClick={onOpenAddBrand}
                  className="w-full p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  + Add New Brand Baseline
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onRunSocialScan}
                    disabled={isScanningSocial}
                    className="p-2.5 rounded-xl bg-[#121c32] hover:bg-[#182645] border border-slate-700/80 text-slate-200 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 text-[11px]"
                  >
                    <Radio className={`w-3.5 h-3.5 text-cyan-400 ${isScanningSocial ? 'animate-spin' : ''}`} />
                    {isScanningSocial ? 'Scanning...' : 'Social Scan'}
                  </button>

                  <button
                    onClick={onRunAppScan}
                    disabled={isScanningApp}
                    className="p-2.5 rounded-xl bg-[#121c32] hover:bg-[#182645] border border-slate-700/80 text-slate-200 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 text-[11px]"
                  >
                    <Smartphone className={`w-3.5 h-3.5 text-purple-400 ${isScanningApp ? 'animate-spin' : ''}`} />
                    {isScanningApp ? 'Auditing...' : 'App Scan'}
                  </button>
                </div>

                <button
                  onClick={onExportReport}
                  className="w-full p-2.5 rounded-xl bg-[#121c32] hover:bg-[#182645] border border-slate-700/80 text-slate-200 flex items-center justify-center gap-2 transition-all text-xs"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Export Incident Dossier (CSV)
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Optimus Delta Interactive Process Pipeline Module */}
          <ScrollReveal direction="up" delay={200} distance={24} duration={700}>
            <div className="bg-[#0a1020] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden group glass-panel-hover">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Autonomous Pipeline
                </span>
                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE STEP {activeStep + 1}/3
                </span>
              </div>

              {/* Step Selectors with animated progress indicator */}
              <div className="space-y-2">
                {steps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all duration-300 relative border ${
                        isActive
                          ? 'bg-[#121c33] border-cyan-500/40 text-white shadow-md'
                          : 'bg-[#0a1020] border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0f172a]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`font-mono text-xs font-bold ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                          {step.num}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold leading-tight truncate">{step.title}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{step.desc}</p>
                        </div>
                      </div>

                      {/* Optimus-style animated progress bar */}
                      {isActive && (
                        <div className="mt-2 h-0.5 bg-cyan-950 rounded-full overflow-hidden">
                          <div 
                            key={activeStep} 
                            style={{ animation: 'progress 6s linear forwards' }} 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-0" 
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Optimus Delta Code / Telemetry Inspector */}
              <div className="rounded-xl bg-[#060a14] border border-slate-800 p-3 font-mono text-[10px] text-slate-300 relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 text-slate-500 text-[9px]">
                  <span>pipeline_runner.ts</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
                <pre className="text-cyan-300/90 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                  <code>{steps[activeStep].code}</code>
                </pre>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};
