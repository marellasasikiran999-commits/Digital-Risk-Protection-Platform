import React, { useState } from 'react';
import { 
  Smartphone, Search, RefreshCw, AlertTriangle, 
  CheckCircle, FileText, ShieldAlert
} from 'lucide-react';
import type { Finding, Brand } from '../utils/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollReveal } from './ui/ScrollReveal';

interface AppStoreMonitoringProps {
  findings: Finding[];
  onMarkSafe: (id: string) => void;
  onTakedown: (id: string) => void;
  onSelectFinding: (finding: Finding) => void;
  onRunAppScan: () => void;
  isScanningApp: boolean;
  activeBrand?: Brand;
}

export const AppStoreMonitoring: React.FC<AppStoreMonitoringProps> = ({
  findings,
  onMarkSafe,
  onTakedown,
  onSelectFinding,
  onRunAppScan,
  isScanningApp,
  activeBrand
}) => {
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const brandName = activeBrand?.brand_name || 'Digital Risk Protection Platform';
  const officialPublisher = activeBrand?.official_developer || 'Digital Risk Protection Platform';

  // Filter only app findings
  const appFindings = findings.filter(f => f.finding_type === 'app');

  const filtered = appFindings.filter((item) => {
    const plat = (item.detection_source || '').toLowerCase();
    if (storeFilter === 'google_play' && !plat.includes('play') && !plat.includes('google')) return false;
    if (storeFilter === 'apple' && !plat.includes('apple') && !plat.includes('ios')) return false;
    if (storeFilter === 'mirror' && (plat.includes('play') || plat.includes('apple'))) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.candidate_name.toLowerCase().includes(q) ||
        (item.package_name && item.package_name.toLowerCase().includes(q)) ||
        (item.developer && item.developer.toLowerCase().includes(q)) ||
        item.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-[#111827]/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-purple-400" />
              App Store &amp; Repository Monitor
            </h2>
            <Badge variant="cyber">
              {filtered.length} APK CLONES DETECTED
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auditing Google Play Store, APKPure, and mirror repositories for "{brandName}" unauthorized clones, publisher mismatches against "{officialPublisher}", and malicious repackaging.
          </p>
        </div>

        <Button
          variant="cyber"
          onClick={onRunAppScan}
          disabled={isScanningApp}
          className="shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanningApp ? 'animate-spin' : ''}`} />
          <span>{isScanningApp ? 'Auditing App Repositories...' : 'Run Live App Store Scan'}</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStoreFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              storeFilter === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white bg-[#111827]'
            }`}
          >
            All Repositories ({appFindings.length})
          </button>
          <button
            onClick={() => setStoreFilter('google_play')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              storeFilter === 'google_play' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-white bg-[#111827]'
            }`}
          >
            Google Play
          </button>
          <button
            onClick={() => setStoreFilter('mirror')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              storeFilter === 'mirror' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white bg-[#111827]'
            }`}
          >
            Third-Party Mirrors
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search package ID, publisher, clone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>
      </div>

      {/* App Threat Triage Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const isResolved = item.status === 'Resolved' || item.status === 'Legitimate';
          const isTakedown = item.status === 'In-progress' || item.status === 'Takedown';
          const isScenarioB = (item.developer && item.developer.includes('Partners')) || item.candidate_name.includes('Wallet Pro');

          return (
            <ScrollReveal key={item.id} direction="up" distance={16} duration={600}>
              <Card className="p-5 bg-[rgba(17,24,39,0.7)] border-slate-800/80 hover:border-purple-500/40 backdrop-blur-md transition-all space-y-4 shadow-xl flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#141e33] border border-slate-700 flex items-center justify-center p-2 shrink-0">
                        <Smartphone className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white text-sm truncate max-w-[170px]">
                            {item.candidate_name}
                          </h3>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          {item.package_name || item.asset}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                      isResolved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : item.risk_score >= 85
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {isResolved ? 'SAFE' : `${item.risk_score}/100`}
                    </span>
                  </div>

                  {isScenarioB && (
                    <div className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center gap-1.5 text-[10px] text-rose-300 font-mono font-bold">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>SCENARIO B // PUBLISHER MISMATCH FLAGGED</span>
                    </div>
                  )}

                  {/* Telemetry Details */}
                  <div className="p-3 bg-[#0d1424]/90 rounded-xl border border-slate-800/80 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Store:</span>
                      <span className="text-white font-medium">{item.detection_source || 'Google Play Store'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Publisher:</span>
                      <span className="text-rose-400 font-bold truncate max-w-[150px]">
                        {item.developer || 'Digital Risk Partners LLC'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Official Dev:</span>
                      <span className="text-emerald-400 truncate max-w-[150px]">
                        {officialPublisher}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Flagged Risk:</span>
                      <span className="text-amber-300 truncate max-w-[170px]">
                        {item.note || 'RECEIVE_SMS, SYSTEM_ALERT_WINDOW'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Triage Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectFinding(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#14213d] hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/30 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Inspect Threat
                    </button>

                    {!isResolved && !isTakedown && (
                      <button
                        onClick={() => onTakedown(item.id)}
                        className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1"
                        title="Simulate automated Play Protect takedown"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Takedown
                      </button>
                    )}
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => onMarkSafe(item.id)}
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1"
                      title="Whitelist official package under verified asset baseline"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Safe / Whitelist Package
                    </button>
                  )}
                </div>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
};
