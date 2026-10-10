import React, { useState } from 'react';
import type { SocialThreat } from '../types';
import { Radio, AlertTriangle, ShieldCheck, ShieldAlert, Eye, FileText, CheckCircle2, Search } from 'lucide-react';

interface SocialMonitoringProps {
  threats: SocialThreat[];
  onSelectThreat: (threat: SocialThreat) => void;
  onUpdateThreatStatus: (id: string, newStatus: SocialThreat['status']) => void;
}

export const SocialMonitoring: React.FC<SocialMonitoringProps> = ({
  threats,
  onSelectThreat,
  onUpdateThreatStatus
}) => {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredThreats = threats.filter((t) => {
    if (platformFilter !== 'all' && t.platform !== platformFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.handle.toLowerCase().includes(q) ||
        t.accountName.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRiskBadge = (level: SocialThreat['riskLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-950/90 text-rose-300 border-rose-800/80 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
      case 'HIGH':
        return 'bg-amber-950/90 text-amber-300 border-amber-800/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case 'MEDIUM':
        return 'bg-yellow-950/90 text-yellow-300 border-yellow-800/80';
      case 'LOW':
        return 'bg-blue-950/90 text-blue-300 border-blue-800/80';
      case 'SAFE':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-800/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Scanned Social Profiles</span>
            <p className="text-3xl font-black text-white mt-1">18,420</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center shadow-lg shadow-blue-950/40">
            <Radio className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Flagged Impersonators</span>
            <p className="text-3xl font-black text-rose-400 mt-1">
              {threats.filter((t) => !t.isOfficial).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800/50 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Homoglyph Attacks</span>
            <p className="text-3xl font-black text-purple-400 mt-1">
              {threats.filter((t) => t.hasHomoglyph).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center shadow-lg shadow-purple-950/40">
            <AlertTriangle className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Whitelisted Official (0% FP)</span>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              {threats.filter((t) => t.isOfficial).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search handle, name or bio keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono"
          />
        </div>

        {/* Platform Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-slate-400 font-bold mr-1">Platform:</span>
          {['all', 'twitter', 'linkedin', 'instagram', 'telegram'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                platformFilter === p
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="FLAGGED">Flagged</option>
            <option value="TAKEDOWN_REQUESTED">Takedown Pending</option>
            <option value="WHITELISTED">Whitelisted</option>
          </select>
        </div>
      </div>

      {/* Threat Cards List */}
      <div className="space-y-4">
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            className={`bg-slate-900/90 border rounded-2xl p-6 transition-all shadow-xl hover:border-slate-700 backdrop-blur-xl ${
              threat.isOfficial
                ? 'border-emerald-800/60 bg-slate-900/60 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                : threat.riskLevel === 'CRITICAL'
                ? 'border-rose-900/60 shadow-[0_0_25px_rgba(244,63,94,0.1)]'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              {/* Account Info */}
              <div className="flex items-start gap-4">
                <img
                  src={threat.avatarUrl}
                  alt={threat.accountName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-lg shrink-0"
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-base font-black text-white tracking-tight">{threat.accountName}</span>
                    <span className="text-xs text-cyan-400 font-mono font-bold">{threat.handle}</span>

                    <span className="px-2.5 py-0.5 text-[10px] uppercase font-black rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      {threat.platform}
                    </span>

                    <span
                      className={`px-3 py-0.5 text-[10px] font-black rounded-full border ${getRiskBadge(
                        threat.riskLevel
                      )}`}
                    >
                      {threat.isOfficial ? 'SAFE (OFFICIAL ASSET)' : `${threat.riskLevel} RISK (${threat.riskScore}/100)`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{threat.bio}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                    <span>Followers: <strong className="text-white">{threat.followerCount.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Posts: <strong className="text-white">{threat.postCount}</strong></span>
                    <span>•</span>
                    <span>Detected: {threat.detectionDate}</span>
                  </div>
                </div>
              </div>

              {/* Action & Metrics */}
              <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                {!threat.isOfficial && (
                  <div className="text-right mr-2 hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-mono block">pHash Visual Match</span>
                    <span
                      className={`text-sm font-black ${
                        threat.logoSimilarityScore > 90
                          ? 'text-rose-400'
                          : threat.logoSimilarityScore > 75
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {threat.logoSimilarityScore}% Match
                    </span>
                  </div>
                )}

                <button
                  onClick={() => onSelectThreat(threat)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-700 shadow-md"
                >
                  <Eye className="w-4 h-4 text-cyan-400" /> Visual Triage
                </button>

                {!threat.isOfficial && (
                  <button
                    onClick={() =>
                      onUpdateThreatStatus(
                        threat.id,
                        threat.status === 'TAKEDOWN_REQUESTED' ? 'FLAGGED' : 'TAKEDOWN_REQUESTED'
                      )
                    }
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg ${
                      threat.status === 'TAKEDOWN_REQUESTED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    }`}
                  >
                    {threat.status === 'TAKEDOWN_REQUESTED' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Takedown Pending
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" /> Issue DMCA Takedown
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Triggers Breakdown Footer */}
            {threat.hasHomoglyph || threat.phishingKeywordsFound.length > 0 ? (
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Detection Signals:</span>
                {threat.hasHomoglyph && (
                  <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/60 rounded-lg text-[11px] font-mono font-bold">
                    Homoglyph: {threat.homoglyphDetails}
                  </span>
                )}

                {threat.phishingKeywordsFound.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-800/60 rounded-lg text-[11px] font-mono font-bold"
                  >
                    Keyword: "{kw}"
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
