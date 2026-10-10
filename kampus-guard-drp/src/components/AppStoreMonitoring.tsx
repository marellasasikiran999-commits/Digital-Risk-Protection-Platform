import React, { useState } from 'react';
import type { AppStoreThreat } from '../types';
import { Smartphone, Search } from 'lucide-react';

interface AppStoreMonitoringProps {
  threats?: AppStoreThreat[];
  findings?: any[];
  onSelectFinding?: (finding: any) => void;
  onSelectThreat?: (threat: AppStoreThreat) => void;
  onUpdateThreatStatus?: (id: string, newStatus: AppStoreThreat['status']) => void;
}

export const AppStoreMonitoring: React.FC<AppStoreMonitoringProps> = ({
  threats: initialThreats,
  onSelectFinding,
  onSelectThreat
}) => {
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const defaultThreats: AppStoreThreat[] = [
    {
      id: 'app-threat-1',
      store: 'google_play',
      appName: 'Digital Risk Protection Rewards',
      appId: 'com.fake.drp.rewards',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.fake.drp.rewards',
      iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      publisherName: 'Global Trend Mobile',
      rating: 4.8,
      downloadsCount: '50,000+',
      updatedDate: '2026-10-08',
      descriptionSnippet: 'Rewards portal harvesting SMS and contacts',
      riskScore: 88,
      riskLevel: 'HIGH',
      logoSimilarityScore: 82,
      nameSimilarityScore: 92,
      isPublisherMismatch: true,
      suspiciousPermissions: ['RECEIVE_SMS', 'READ_CONTACTS', 'SYSTEM_ALERT_WINDOW'],
      status: 'FLAGGED',
      isOfficial: false
    },
    {
      id: 'app-threat-2',
      store: 'apple_app_store',
      appName: 'Digital Risk Protection Pro',
      appId: 'id.drp.pro.fake',
      storeUrl: 'https://apps.apple.com/app/drp-pro/id987654321',
      iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      publisherName: 'DevApex Studio',
      rating: 4.1,
      downloadsCount: '10,000+',
      updatedDate: '2026-10-06',
      descriptionSnippet: 'Unauthorized commercial client',
      riskScore: 68,
      riskLevel: 'MEDIUM',
      logoSimilarityScore: 71,
      nameSimilarityScore: 85,
      isPublisherMismatch: true,
      suspiciousPermissions: [],
      status: 'INVESTIGATING',
      isOfficial: false
    },
    {
      id: 'app-threat-3',
      store: 'google_play',
      appName: 'Digital Risk Protection Fast Support',
      appId: 'com.cloned.drp.helper',
      storeUrl: 'https://apkpure.com/drp-fast-support/com.cloned.drp.helper',
      iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      publisherName: 'Shanghai Media Syndicate',
      rating: 3.2,
      downloadsCount: '5,000+',
      updatedDate: '2026-10-09',
      descriptionSnippet: 'Rogue support helper payload',
      riskScore: 94,
      riskLevel: 'CRITICAL',
      logoSimilarityScore: 91,
      nameSimilarityScore: 95,
      isPublisherMismatch: true,
      suspiciousPermissions: ['REQUEST_INSTALL_PACKAGES', 'RECORD_AUDIO', 'ACCESS_FINE_LOCATION'],
      status: 'TAKEDOWN_REQUESTED',
      isOfficial: false
    }
  ];

  const threatsList = (initialThreats && initialThreats.length > 0) ? initialThreats : defaultThreats;

  const filtered = threatsList.filter((t) => {
    if (storeFilter !== 'all' && t.store !== storeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.appName.toLowerCase().includes(q) ||
        t.publisherName.toLowerCase().includes(q) ||
        t.appId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              App Store &amp; Repository Monitor
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                8 Apps Monitored
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated detection of unauthorized APK mirrors, repackaged clones, and publisher mismatches.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search package ID, app name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141e33] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="bg-[#141e33] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              <option value="all">All Stores</option>
              <option value="google_play">Google Play</option>
              <option value="apple_app_store">Apple Store</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#141e33] border border-slate-700 flex items-center justify-center p-2 shrink-0">
                    <Smartphone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{t.appName}</h3>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">{t.appId}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {t.riskScore}/100
                </span>
              </div>

              <div className="p-3 bg-[#121c30] rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Store:</span>
                  <span className="text-white font-medium capitalize">{t.store.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Publisher:</span>
                  <span className="text-rose-400 font-semibold truncate max-w-[150px]">{t.publisherName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Downloads:</span>
                  <span className="text-white font-mono">{t.downloadsCount}</span>
                </div>
                {t.suspiciousPermissions && t.suspiciousPermissions.length > 0 && (
                  <div className="pt-1 border-t border-slate-800">
                    <span className="text-rose-400 font-bold block text-[10px]">
                      Flagged: {t.suspiciousPermissions.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectFinding) onSelectFinding({ id: t.id, candidate_name: t.appName, risk_score: t.riskScore, risk_level: t.riskLevel });
                  if (onSelectThreat) onSelectThreat(t);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
              >
                Inspect Threat
              </button>
              <a
                href={t.storeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#141e33] hover:bg-[#1a2845] border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Store Link
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
