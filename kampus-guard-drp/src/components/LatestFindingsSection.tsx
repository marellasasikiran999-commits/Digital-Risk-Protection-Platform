import React, { useState } from 'react';
import { 
  Smartphone, Plus, Radio, 
  Download, Search, Globe 
} from 'lucide-react';
import type { Finding } from '../utils/api';

interface LatestFindingsSectionProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onOpenAddBrand: () => void;
  onRunSocialScan: () => void;
  onRunAppScan: () => void;
  onExportReport: () => void;
  isScanningSocial: boolean;
  isScanningApp: boolean;
}

export const LatestFindingsSection: React.FC<LatestFindingsSectionProps> = ({
  findings,
  onSelectFinding,
  onOpenAddBrand,
  onRunSocialScan,
  onRunAppScan,
  onExportReport,
  isScanningSocial,
  isScanningApp
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState('');

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Latest Findings Table (col-span-8) */}
      <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white mr-2">Latest Findings</h3>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (23)
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'high' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              High (8)
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'medium' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Medium (7)
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'low' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Low (8)
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search findings..."
              className="w-full bg-[#141e33] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Findings Table matching screenshot */}
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
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr 
                  key={item.id}
                  onClick={() => onSelectFinding(item)}
                  className="hover:bg-[#141f36] cursor-pointer transition-all"
                >
                  <td className="py-3 px-2">
                    <div className="w-8 h-8 rounded-xl bg-[#121c30] border border-slate-800 flex items-center justify-center">
                      {getPlatformIcon(item.detection_source || item.finding_type)}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-white font-bold block truncate max-w-[150px]">{item.candidate_name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{item.category || item.finding_type}</span>
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
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${getStatusBadge(item.status)}`}>
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
                        className="px-3 py-1 rounded-lg bg-[#14213d] hover:bg-blue-600 hover:text-white text-blue-400 font-bold text-xs border border-blue-500/20 transition-all"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Stack matching screenshot (col-span-4) */}
      <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white mb-2">Quick Actions</h3>

        <div className="space-y-2.5 text-xs font-bold">
          <button
            onClick={onOpenAddBrand}
            className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Add New Brand
          </button>

          <button
            onClick={onRunSocialScan}
            disabled={isScanningSocial}
            className="w-full p-3 rounded-xl bg-[#121c32] hover:bg-[#182645] border border-slate-700/80 text-slate-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Radio className={`w-4 h-4 text-cyan-400 ${isScanningSocial ? 'animate-spin' : ''}`} />
            {isScanningSocial ? 'Scanning Social Platforms...' : 'Run Social Media Scan'}
          </button>

          <button
            onClick={onRunAppScan}
            disabled={isScanningApp}
            className="w-full p-3 rounded-xl bg-[#121c32] hover:bg-[#182645] border border-slate-700/80 text-slate-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Smartphone className={`w-4 h-4 text-purple-400 ${isScanningApp ? 'animate-spin' : ''}`} />
            {isScanningApp ? 'Auditing Repositories...' : 'Run App Store Scan'}
          </button>

          <button
            onClick={onExportReport}
            className="w-full p-3 rounded-xl bg-[#121c32] hover:bg-[#182645] border border-slate-700/80 text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export Report (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
