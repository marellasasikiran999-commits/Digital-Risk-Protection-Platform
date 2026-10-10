import React, { useState } from 'react';
import type { SocialThreat, AppStoreThreat, OfficialBrandAsset } from '../types';
import { X, ShieldAlert, CheckCircle, FileText, Copy, AlertOctagon } from 'lucide-react';

interface ThreatDetailModalProps {
  threat: SocialThreat | AppStoreThreat | null;
  brandAsset: OfficialBrandAsset;
  onClose: () => void;
}

export const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({
  threat,
  brandAsset,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!threat) return null;

  const isSocial = 'platform' in threat;
  const threatTitle = isSocial ? (threat as SocialThreat).accountName : (threat as AppStoreThreat).appName;
  const threatHandleOrId = isSocial ? (threat as SocialThreat).handle : (threat as AppStoreThreat).appId;
  const threatLogo = isSocial ? (threat as SocialThreat).avatarUrl : (threat as AppStoreThreat).iconUrl;

  // Generate automated formal DMCA & Abuse Notice text
  const takedownNoticeText = `
FORMAL DIGITAL RISK PROTECTION TAKEDOWN REQUEST
=====================================================
TO: Platform Abuse & Legal Department (${isSocial ? (threat as SocialThreat).platform.toUpperCase() : (threat as AppStoreThreat).store.toUpperCase()})
DATE: ${new Date().toISOString().split('T')[0]}
CASE REF: KG-TAKEDOWN-${threat.id.toUpperCase()}

RE: IMPERSONATION & BRAND INFRINGEMENT NOTICE FOR "${brandAsset.brandName}"

1. LEGITIMATE BRAND IDENTITY:
   - Brand Name: ${brandAsset.brandName}
   - Official Website: ${brandAsset.officialWebsite}
   - Authorized Publisher/Entity: ${brandAsset.officialPublishers[0] || 'BrandShield Security Corp'}

2. INFRINGING & IMPERSONATING TARGET ASSET:
   - Target Name/Title: ${threatTitle}
   - Target Identifier: ${threatHandleOrId}
   - Risk Criticality Score: ${threat.riskScore}/100 (${threat.riskLevel})
   - Perceptual Visual Hash Match: ${threat.logoSimilarityScore}%

3. EVIDENCE OF FRAUD & MALICIOUS INTENT:
   - Impersonation of official brand identity and logos without authorization.
   - User deception score: High risk of credential theft, phishing, or financial scam.

REQUEST:
Please immediately suspend/remove the infringing account/app referenced above under relevant Terms of Service and IP Policy.

Submitted via BrandShield AI (Digital Risk Protection Platform) on behalf of ${brandAsset.brandName}.
`.trim();

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(takedownNoticeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              Threat Triage & Asset Comparison — Case #{threat.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Side-by-Side Asset Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Official Asset Box */}
            <div className="bg-slate-950 border border-emerald-800/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Official Registered Asset
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={brandAsset.officialLogoUrl}
                  alt={brandAsset.brandName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{brandAsset.brandName}</h4>
                  <p className="text-xs text-slate-400 font-mono">Official Website: {brandAsset.officialWebsite}</p>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                    Publisher: {brandAsset.officialPublishers[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Flagged Impersonator Asset Box */}
            <div className="bg-slate-950 border border-rose-800/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  Flagged Impersonator Asset
                </span>
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={threatLogo}
                  alt={threatTitle}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-rose-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{threatTitle}</h4>
                  <p className="text-xs text-cyan-300 font-mono">{threatHandleOrId}</p>
                  <span className="text-[11px] text-rose-400 font-semibold block mt-1">
                    Perceptual Logo Match: {threat.logoSimilarityScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics Breakdown */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-300">Risk Assessment Trigger Breakdown</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Overall Risk Score</span>
                <span className="text-sm font-bold text-rose-400">{threat.riskScore}/100 ({threat.riskLevel})</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Name Similarity</span>
                <span className="text-sm font-bold text-cyan-400">{threat.nameSimilarityScore}%</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Logo Hash Match</span>
                <span className="text-sm font-bold text-purple-400">{threat.logoSimilarityScore}%</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Triage Status</span>
                <span className="text-xs font-bold text-amber-300 uppercase">{threat.status}</span>
              </div>
            </div>
          </div>

          {/* DMCA Takedown Notice Generator Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Automated Legal DMCA / Platform Abuse Takedown Generator
              </h4>
              <button
                onClick={handleCopyNotice}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied to Clipboard!' : 'Copy DMCA Notice'}
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-300 text-[11px] font-mono p-4 rounded-lg overflow-x-auto border border-slate-800 whitespace-pre-wrap">
              {takedownNoticeText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
