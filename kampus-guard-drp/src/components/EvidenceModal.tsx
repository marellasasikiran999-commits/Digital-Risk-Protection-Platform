import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, CheckCircle2 } from 'lucide-react';
import type { Finding } from '../utils/api';
import { updateFindingStatusAPI } from '../utils/api';

interface EvidenceModalProps {
  finding: Finding | null;
  onClose: () => void;
  onStatusUpdated: (updatedId: string, newStatus: string) => void;
  allFindings?: Finding[];
  onSelectFinding?: (f: Finding) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  finding,
  onClose,
  onStatusUpdated,
  allFindings = [],
  onSelectFinding
}) => {
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!finding) return null;

  const handleMarkLegitimate = async () => {
    setActionLoading(true);
    try {
      await updateFindingStatusAPI(finding.id, 'Legitimate');
      onStatusUpdated(finding.id, 'Legitimate');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyTakedown = () => {
    const text = finding.takedown_notice || `FORMAL DMCA TAKEDOWN NOTICE\nInfringing Target: ${finding.candidate_name}\nTarget Brand: ${finding.brand_name}\nRisk Score: ${finding.risk_score}/100`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isApp = finding.finding_type === 'app';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#101622] border border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="bg-[#141b2a] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-mono tracking-wider text-orange-400 font-bold bg-orange-950/80 border border-orange-800/80 px-2.5 py-1 rounded-lg">
              Forensic Evidence Dossier
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {finding.id}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Two Column Layout matching Image 2 & 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Related Findings List (matching Image 2 left panel) */}
          <div className="lg:col-span-4 bg-[#0d131d] border-r border-slate-800 p-4 space-y-3 overflow-y-auto max-h-[600px] hidden sm:block">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 font-bold">
              <span>Related Threats ({allFindings.length || 1})</span>
              <span className="text-[10px] text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded font-mono">Active Monitoring</span>
            </div>

            <div className="space-y-2">
              {(allFindings.length ? allFindings : [finding]).map((item, idx) => {
                const isSelected = item.id === finding.id;
                const badgeColor = item.risk_level === 'Critical' ? 'bg-rose-500 text-white' : (item.risk_level === 'High' ? 'bg-orange-500 text-slate-950' : 'bg-amber-400 text-slate-950');

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectFinding && onSelectFinding(item)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-[#151d2d] border-orange-500/80 shadow-lg' 
                        : 'bg-[#101622]/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${badgeColor}`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-200 block truncate">{item.title}</span>
                      <span className="text-[10px] text-slate-400 block truncate font-mono">{item.candidate_name}</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">{item.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Forensic Evidence Sheet (matching Image 2 & 3 right card) */}
          <div className="lg:col-span-8 p-6 space-y-6 overflow-y-auto bg-[#101622]">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{finding.title}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-black rounded-lg ${
                    finding.risk_level === 'Critical' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                      : (finding.risk_level === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40')
                  }`}>
                    {finding.risk_level}
                  </span>
                  <a href={finding.candidate_name.startsWith('http') ? finding.candidate_name : `https://${finding.candidate_name}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 mt-1">Asset: <span className="text-orange-400 font-mono font-bold">{finding.asset}</span> • ID: <span className="font-mono">{finding.id}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-xl font-semibold border border-slate-700">
                  Status: <strong className="text-orange-400">{finding.status}</strong>
                </span>
              </div>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d131d] p-3.5 rounded-2xl border border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Detected Date</span>
                <span className="text-slate-300 font-bold">{finding.detected_date || '5 August, 2025'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Updated Date</span>
                <span className="text-slate-300 font-bold">{finding.updated_date || '5 August, 2025'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Similarity Rate</span>
                <span className="text-cyan-400 font-bold">{finding.similarity_rate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Confidence Score</span>
                <span className="text-orange-400 font-bold">{finding.confidence_score}%</span>
              </div>
            </div>

            {/* If Mobile App (Image 3 layout with Donut Chart) */}
            {isApp && (
              <div className="bg-[#0d131d] border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Market Distribution Breakdown</span>
                  <span className="text-xs text-orange-400 font-mono">Total Repackaged: 40 Assets</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  {/* CSS SVG Donut Chart (Matching Image 3) */}
                  <div className="flex items-center justify-center relative">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                      {/* Playstore (25) - Blue */}
                      <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="150 238" strokeDashoffset="0" />
                      {/* Appstore (10) - Pink */}
                      <circle cx="50" cy="50" r="38" stroke="#ec4899" strokeWidth="12" fill="transparent" strokeDasharray="60 238" strokeDashoffset="-150" />
                      {/* ApkDl (3) - Green */}
                      <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="18 238" strokeDashoffset="-210" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-white">40</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Total</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#141b2a]">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Playstore</span>
                      <strong className="text-white">25</strong>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#141b2a]">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Appstore</span>
                      <strong className="text-white">10</strong>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#141b2a]">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ApkDl</span>
                      <strong className="text-white">3</strong>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#141b2a]">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Apkgp</span>
                      <strong className="text-white">1</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Developer / Publisher:</span>
                    <strong className="text-rose-400">{finding.developer || 'Telegram Messenger LLP'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Package Name:</span>
                    <strong className="text-white font-mono">{finding.package_name || 'com.app.travelbuddy'}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Note & Whois (Matching Image 2 exact details) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0d131d] border border-slate-800 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Forensic Note:</span>
                <p className="text-slate-200 leading-relaxed">{finding.note || 'SSL certificate is valid for less than 90 days, indicating stronger impersonation.'}</p>
              </div>

              <div className="bg-[#0d131d] border border-slate-800 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Whois / Origin:</span>
                <p className="text-slate-200 font-mono leading-relaxed">{finding.whois_info || 'Registrar - DeltaWave Domains Ltd. Registrant Country - QZ'}</p>
              </div>
            </div>

            {/* Risk Factors Breakdown */}
            {finding.factors && finding.factors.length > 0 && (
              <div className="bg-[#0d131d] border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs uppercase font-bold text-orange-400 tracking-wider block font-mono">
                  Why is this suspicious? (Risk Factors Breakdown)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {finding.factors.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#141b2a] border border-slate-800/80">
                      <span className="text-slate-300 font-medium">{f.factor}</span>
                      <span className="text-orange-400 font-bold font-mono">+{f.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Row: "Mark as Legitimate" & "Copy Takedown" */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkLegitimate}
                  disabled={actionLoading || finding.status === 'Legitimate'}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {finding.status === 'Legitimate' ? 'Marked as Legitimate (Safe)' : 'Mark as Legitimate'}
                </button>

                <button
                  onClick={handleCopyTakedown}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-all border border-slate-700"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
                  {copied ? 'Takedown Notice Copied!' : 'Copy Legal DMCA Notice'}
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
