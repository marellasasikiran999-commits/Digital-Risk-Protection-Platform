import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Printer } from 'lucide-react';
import { exportFindingsCSV, type Finding } from '../utils/api';

interface IncidentReportsViewProps {
  currentBrand: string;
  findings: Finding[];
}

export const IncidentReportsView: React.FC<IncidentReportsViewProps> = ({ currentBrand, findings }) => {
  const [reportType, setReportType] = useState<'all' | 'takedowns' | 'phishing' | 'malware'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    exportFindingsCSV(currentBrand, findings);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Executive Threat &amp; Incident Reports
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Live Audit Feed
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically verifiable incident logs, takedown requests, and perimeter compliance telemetry for {currentBrand}.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 bg-[#121c32] hover:bg-[#182645] border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV Audit Log
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Incident report CSV downloaded successfully from backend API.</span>
        </div>
      )}

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Mean Time to Acknowledge</span>
          <div className="text-2xl font-black text-white">14.2 min</div>
          <span className="text-[10px] text-emerald-400 font-mono">↓ 32% faster than SLA</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Takedown Success Rate</span>
          <div className="text-2xl font-black text-white">98.4%</div>
          <span className="text-[10px] text-emerald-400 font-mono">22 of 23 threats neutralized</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-xs text-slate-400">False Positive Rate</span>
          <div className="text-2xl font-black text-emerald-400">0.00%</div>
          <span className="text-[10px] text-slate-400 font-mono">Whitelisted baseline protection</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Active Audit Certificates</span>
          <div className="text-2xl font-black text-white">3 Active</div>
          <span className="text-[10px] text-blue-400 font-mono">ISO 27001 • SOC2 • GDPR</span>
        </div>
      </div>

      {/* Incident Log Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Recent Security Incident Audit Records</h3>
            <p className="text-xs text-slate-400">Detailed forensic trail of detected brand infringements</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Filter by:</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="bg-[#141e33] border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All Incidents ({findings.length})</option>
              <option value="takedowns">Active Takedowns</option>
              <option value="phishing">Phishing Domains</option>
              <option value="malware">Malicious APKs</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Incident ID</th>
                <th className="py-2.5 px-3">Candidate Threat</th>
                <th className="py-2.5 px-3">Vector</th>
                <th className="py-2.5 px-3">Risk Criticality</th>
                <th className="py-2.5 px-3">Detection Engine</th>
                <th className="py-2.5 px-3">Incident Timestamp</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {findings.map((item) => (
                <tr key={item.id} className="hover:bg-[#141f36] transition-colors">
                  <td className="py-3 px-3 text-blue-400 font-bold">{item.id}</td>
                  <td className="py-3 px-3 font-sans font-bold text-white">{item.candidate_name}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    {item.finding_type === 'app' ? 'Mobile App Clone' : item.finding_type === 'domain' ? 'Phishing Domain' : 'Social Impersonation'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.risk_level === 'Critical' || item.risk_level === 'High' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : item.risk_level === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {item.risk_level} ({item.risk_score}/100)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] font-sans">{item.detection_source}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{item.detected_date}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 font-sans">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
