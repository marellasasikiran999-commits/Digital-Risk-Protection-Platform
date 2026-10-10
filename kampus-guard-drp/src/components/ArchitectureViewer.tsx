import React from 'react';
import { Cpu, Database, Network, Layers, ShieldCheck } from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-2">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          Security Infrastructure &amp; Topology
        </span>
        <h2 className="text-xl font-bold text-white">System Architecture & Data Pipeline Topology</h2>
        <p className="text-xs text-slate-400 max-w-3xl">
          Comprehensive technical overview covering external social and app store crawler ingestion, 
          multi-factor detection logic, logo perceptual hashing, official asset exclusion filters, and automated triage storage.
        </p>
      </div>

      {/* Visual Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stage 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">Stage 1</span>
            <Network className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Data Feed Ingestion</h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Twitter / X API Crawler</li>
            <li>LinkedIn & Instagram Scrapers</li>
            <li>Google Play Store Scraper</li>
            <li>Apple App Store API</li>
          </ul>
        </div>

        {/* Stage 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Stage 2</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Exclusion Filter Engine</h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Brand Handle Matcher</li>
            <li>App Package ID Whitelist</li>
            <li>Verified Domain Check</li>
            <li className="text-emerald-400 font-bold">0% False Positive Filter</li>
          </ul>
        </div>

        {/* Stage 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded">Stage 3</span>
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Detection & AI Pipeline</h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Jaro-Winkler Similarity</li>
            <li>Unicode Homoglyph Scanner</li>
            <li>pHash Logo Visual Matcher</li>
            <li>Phishing Intent NLP</li>
          </ul>
        </div>

        {/* Stage 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded">Stage 4</span>
            <Database className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Triage & Remediation</h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Risk Level Classifier (0-100)</li>
            <li>Side-by-Side Asset Review</li>
            <li>DMCA Notice Generator</li>
            <li>Incident Report Exporter</li>
          </ul>
        </div>
      </div>

      {/* Structured Code Schema Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Multi-Factor Risk Scoring Formula
        </h3>

        <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
          <div className="text-cyan-400 font-bold">// Composite Risk Calculation Matrix</div>
          <div className="text-slate-400">
            Score = (Name_Similarity × 0.35) + (Logo_pHash_Match × 0.35) + (Homoglyph_Bonus × 0.15) + (Phishing_Intent_Keywords × 0.15)
          </div>
          <div className="text-amber-300 pt-2">
            IF (IsWhitelistedOfficialAsset(targetHandle)) RETURN RiskScore = 0 [SAFE - EXCLUDED];
          </div>
        </div>
      </div>
    </div>
  );
};
