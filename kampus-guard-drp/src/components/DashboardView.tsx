import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, Radio, Smartphone, Search, Download, 
  CheckCircle2, Activity, Layers, Mail, Key, Cloud, Cpu, Plus
} from 'lucide-react';
import type { Finding, DashboardSummary, Brand } from '../utils/api';
import { runSocialScanAPI, runAppScanAPI, updateFindingStatusAPI, getExportCSVUrl } from '../utils/api';

interface DashboardViewProps {
  summary: DashboardSummary | null;
  findings: Finding[];
  currentBrand: string;
  brands: Brand[];
  onSelectBrand: (brandName: string) => void;
  onOpenAddBrand: () => void;
  onSelectFindingForEvidence: (finding: Finding) => void;
  onRefreshData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  findings,
  currentBrand,
  brands,
  onSelectBrand,
  onOpenAddBrand,
  onSelectFindingForEvidence,
  onRefreshData
}) => {
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scanning, setScanning] = useState<string | null>(null);

  // Filtered findings list
  const filteredFindings = findings.filter((f) => {
    if (activeRiskFilter !== 'all' && f.risk_level.toLowerCase() !== activeRiskFilter.toLowerCase()) return false;
    if (activeTypeFilter !== 'all' && f.finding_type !== activeTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.candidate_name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        (f.developer && f.developer.toLowerCase().includes(q)) ||
        (f.note && f.note.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRunSocialScan = async () => {
    setScanning('social');
    try {
      await runSocialScanAPI(currentBrand);
      await onRefreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(null);
    }
  };

  const handleRunAppScan = async () => {
    setScanning('app');
    try {
      await runAppScanAPI(currentBrand);
      await onRefreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(null);
    }
  };

  const handleMarkLegitimate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await updateFindingStatusAPI(id, 'Legitimate');
      await onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    window.open(getExportCSVUrl(currentBrand), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Row: Title + Filter Pills + Brand Switcher + Add Brand */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">Security Operations Center</h1>
            <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Live Threat Engine
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>Protected Brand Target:</span>
            <select
              value={currentBrand}
              onChange={(e) => onSelectBrand(e.target.value)}
              className="bg-[#121824] border border-slate-800 text-orange-400 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.brand_name}>
                  {b.brand_name}
                </option>
              ))}
            </select>
            <button
              onClick={onOpenAddBrand}
              className="ml-2 text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Brand
            </button>
          </div>
        </div>

        {/* Top Right Filter Pills matching Image 1 */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#121824] border border-slate-800/80 p-1 rounded-2xl">
          {[
            { id: 'all', label: `All Threats`, count: summary?.all_threats || findings.length },
            { id: 'critical', label: 'Critical', count: summary?.critical || findings.filter(f => f.risk_level === 'Critical').length },
            { id: 'high', label: 'High', count: summary?.high || findings.filter(f => f.risk_level === 'High').length },
            { id: 'medium', label: 'Medium', count: summary?.medium || findings.filter(f => f.risk_level === 'Medium').length },
            { id: 'low', label: 'Low', count: summary?.low || findings.filter(f => f.risk_level === 'Low').length }
          ].map((pill) => {
            const isActive = activeRiskFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveRiskFilter(pill.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {pill.label} <span className="opacity-70 font-mono">({pill.count})</span>
              </button>
            );
          })}

          <button
            onClick={handleExportCSV}
            title="Download CSV findings report"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg ml-1"
          >
            <Download className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Cards Grid (Matching Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Threat Detection with Glowing Red Sparkline */}
        <div className="bg-[#121824] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Threat Detection</span>
            <span className="text-slate-500 text-lg leading-none">• • •</span>
          </div>
          <div>
            <span className="text-3xl font-black text-rose-500 tracking-tight">
              {summary ? summary.threat_detection_total.toLocaleString() : '2,853'}
            </span>
          </div>
          {/* Sparkline SVG */}
          <div className="h-14 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 200 50">
              <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,40 Q30,45 50,30 T100,20 T150,15 T200,30 L200,50 L0,50 Z"
                fill="url(#redGrad)"
              />
              <path
                d="M0,40 Q30,45 50,30 T100,20 T150,15 T200,30"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
              />
              <circle cx="20" cy="38" r="3" fill="#f43f5e" />
              <circle cx="50" cy="30" r="3" fill="#f43f5e" />
              <circle cx="100" cy="20" r="3" fill="#f43f5e" />
              <circle cx="150" cy="15" r="3" fill="#f43f5e" />
              <circle cx="190" cy="28" r="3" fill="#f43f5e" />
            </svg>
          </div>
        </div>

        {/* Card 2: Security Events with Glowing Blue Tile Heatmap */}
        <div className="bg-[#121824] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Security Events</span>
            <span className="text-slate-500 text-lg leading-none">• • •</span>
          </div>
          <div>
            <span className="text-3xl font-black text-cyan-400 tracking-tight">
              {summary ? summary.security_events.toLocaleString() : '15,366'}
            </span>
          </div>
          {/* 3x6 grid block tiles matching Image 1 */}
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`h-3 rounded-md transition-all ${
                  i % 3 === 0
                    ? 'bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : (i % 2 === 0 ? 'bg-blue-600/60' : 'bg-blue-950')
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card 3: System Health with Mon-Sat vertical indicators */}
        <div className="bg-[#121824] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>System Health</span>
            <span className="text-slate-500 text-lg leading-none">• • •</span>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-400 tracking-tight">
              {summary ? `${summary.system_health}%` : '98.7%'}
            </span>
          </div>
          {/* Mon-Sat pills */}
          <div className="flex items-end justify-between pt-1 text-[10px] font-mono text-slate-500">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div 
                  className={`w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] ${
                    idx === 4 ? 'h-5' : 'h-7'
                  }`}
                />
                <span>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Recent Security Incidents List */}
        <div className="bg-[#121824] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Recent Security Incidents</span>
            <span className="text-slate-500 text-lg leading-none">• • •</span>
          </div>
          <div className="space-y-2 text-xs">
            {(summary?.recent_incidents || []).slice(0, 3).map((inc, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e131d] border border-slate-800/80">
                <div className="truncate pr-2">
                  <span className="text-white font-bold block truncate">{inc.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{inc.server} • {inc.time}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  inc.level === 'Critical' ? 'bg-rose-950 text-rose-300' : (inc.level === 'High' ? 'bg-orange-950 text-orange-300' : 'bg-blue-950 text-blue-300')
                }`}>
                  {inc.level}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveRiskFilter('all')}
            className="text-[11px] text-orange-400 hover:text-orange-300 font-bold flex items-center justify-end w-full pt-1"
          >
            View All Incidents →
          </button>
        </div>
      </div>

      {/* Middle Row: Security Score Bar + AI Action Callout + Scanners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#121824] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Security Score</span>
            <span className="text-xs text-emerald-400 font-bold">Strong</span>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {summary ? summary.security_score : 847}
            <span className="text-sm text-slate-500 font-normal">/1000</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all"
              style={{ width: `${(summary ? summary.security_score : 847) / 10}%` }}
            />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-4 lg:pt-0 lg:pl-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Live Scanner Engine Execution</h3>
            <p className="text-xs text-slate-400">
              Run active Jaro-Winkler, Unicode Homoglyph &amp; Mobile Publisher Mismatch scans against {currentBrand}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunSocialScan}
              disabled={scanning !== null}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              <Radio className={`w-4 h-4 ${scanning === 'social' ? 'animate-spin' : ''}`} />
              {scanning === 'social' ? 'Scanning Social...' : 'Run Social Media Scan'}
            </button>

            <button
              onClick={handleRunAppScan}
              disabled={scanning !== null}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all border border-slate-700 disabled:opacity-50"
            >
              <Smartphone className={`w-4 h-4 ${scanning === 'app' ? 'animate-spin' : ''}`} />
              {scanning === 'app' ? 'Auditing Stores...' : 'Run App Store Scan'}
            </button>
          </div>
        </div>
      </div>

      {/* Security Tools Grid (Matching Image 1) */}
      <div className="bg-[#121824] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" /> Integrated Security Modules
          </h3>
          <span className="text-xs text-slate-500">8 Active Systems Online</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          {[
            { name: 'SIEM', role: 'Security Information', status: 'Active', icon: Shield, color: 'text-blue-400' },
            { name: 'Vuln Scanner', role: 'Network Security', status: 'Running', icon: AlertTriangle, color: 'text-orange-400' },
            { name: 'EDR', role: 'Endpoint Detection', status: 'Monitoring', icon: Cpu, color: 'text-rose-400' },
            { name: 'IDS / IPS', role: 'Intrusion Prevention', status: 'Alert', icon: Activity, color: 'text-purple-400' },
            { name: 'Email Sec', role: 'Anti-Phishing', status: 'Protected', icon: Mail, color: 'text-emerald-400' },
            { name: 'IAM', role: 'Identity Access', status: 'Configured', icon: Key, color: 'text-amber-400' },
            { name: 'CASB', role: 'Cloud Security', status: 'Active', icon: Cloud, color: 'text-cyan-400' },
            { name: 'SOAR', role: 'Auto Remediation', status: 'Automating', icon: Layers, color: 'text-pink-400' }
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <div key={tool.name} className="bg-[#0e131d] border border-slate-800/80 rounded-xl p-3 space-y-2 hover:border-slate-700 transition-all">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <Icon className={`w-3.5 h-3.5 ${tool.color}`} />
                </div>
                <div>
                  <strong className="text-white block font-bold truncate">{tool.name}</strong>
                  <span className="text-[10px] text-slate-500 block truncate">{tool.role}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">• {tool.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Threat Findings Table Section (with Search, Filters, View, and Mark as Legitimate) */}
      <div className="bg-[#121824] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Active Candidate Findings &amp; Threat Dossiers</h3>
            <p className="text-xs text-slate-400">Click "View" on any row to open the complete forensic evidence breakdown (Image 2 &amp; 3).</p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-[#0e131d] border border-slate-800 rounded-xl px-3.5 py-2 w-full sm:w-80">
            <Search className="w-4 h-4 text-orange-400 shrink-0" />
            <input
              type="text"
              placeholder="Search candidate, domain, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono"
            />
          </div>
        </div>

        {/* Source Filter Pills (All / Domains / Social / Apps) */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <span className="text-xs text-slate-400 font-bold mr-1">Filter Source:</span>
          {[
            { id: 'all', label: 'All Sources' },
            { id: 'domain', label: 'Phishing Domains' },
            { id: 'social', label: 'Social Profiles' },
            { id: 'app', label: 'Rogue Mobile APKs' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTypeFilter(type.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeTypeFilter === type.id
                  ? 'bg-slate-800 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Findings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3">ID &amp; Type</th>
                <th className="py-3 px-3">Candidate Finding</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Similarity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFindings.map((finding) => (
                <tr 
                  key={finding.id}
                  onClick={() => onSelectFindingForEvidence(finding)}
                  className="hover:bg-[#151d2d] cursor-pointer transition-all"
                >
                  <td className="py-3 px-3 font-mono">
                    <span className="text-slate-300 font-bold block">{finding.id}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{finding.finding_type}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold block">{finding.candidate_name}</span>
                      {finding.is_official && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                          OFFICIAL WHITELISTED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block truncate max-w-xs">{finding.title}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {finding.category}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                      finding.risk_level === 'Critical' 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/80' 
                        : (finding.risk_level === 'High' ? 'bg-orange-950 text-orange-300 border border-orange-800/80' : (finding.risk_level === 'Medium' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800/80' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'))
                    }`}>
                      {finding.risk_score}/100 • {finding.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                    {finding.similarity_rate}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-bold ${finding.status === 'Legitimate' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {finding.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFindingForEvidence(finding);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold text-xs border border-orange-500/30 transition-all flex items-center gap-1"
                      >
                        View
                      </button>

                      {finding.status !== 'Legitimate' && (
                        <button
                          onClick={(e) => handleMarkLegitimate(e, finding.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1"
                          title="Verify as safe legitimate asset"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Legitimate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFindings.length === 0 && (
            <div className="text-center py-8 text-slate-500 font-mono text-xs">
              No matching findings detected for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
