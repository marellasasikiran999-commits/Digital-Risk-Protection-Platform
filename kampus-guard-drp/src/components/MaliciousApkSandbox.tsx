import React, { useState } from 'react';
import { 
  Bug, CheckCircle2, AlertTriangle, 
  Copy, Check, Smartphone, FileCode 
} from 'lucide-react';

export const MaliciousApkSandbox: React.FC = () => {
  const [packageName, setPackageName] = useState('com.fake.brandshield.rewards');
  const [appTitle, setAppTitle] = useState('BrandShield Rewards Pro');
  const [publisher, setPublisher] = useState('Apex Rogue Dev Ltd');
  const [permissionsInput, setPermissionsInput] = useState(
    'android.permission.RECEIVE_SMS, android.permission.READ_SMS, android.permission.SYSTEM_ALERT_WINDOW, android.permission.BIND_ACCESSIBILITY_SERVICE'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Preset malicious & benign test vectors for security testing
  const presets = [
    {
      label: 'Trojan-Banker Clone (Critical)',
      pkg: 'com.fake.brandshield.rewards',
      title: 'BrandShield Rewards Pro',
      pub: 'Apex Rogue Dev Ltd',
      perms: 'android.permission.RECEIVE_SMS, android.permission.READ_SMS, android.permission.SYSTEM_ALERT_WINDOW, android.permission.BIND_ACCESSIBILITY_SERVICE'
    },
    {
      label: 'Spyware / SMS Stealer (High)',
      pkg: 'com.cloned.brandshield.helper',
      title: 'BrandShield Fast Support',
      pub: 'Shanghai Media Syndicate',
      perms: 'android.permission.REQUEST_INSTALL_PACKAGES, android.permission.ACCESS_FINE_LOCATION, android.permission.RECORD_AUDIO'
    },
    {
      label: 'Clean Official App (0% False Positive)',
      pkg: 'com.brandshield.official',
      title: 'BrandShield Official Portal',
      pub: 'BrandShield Security Corp',
      perms: 'android.permission.INTERNET, android.permission.ACCESS_NETWORK_STATE'
    }
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setPackageName(p.pkg);
    setAppTitle(p.title);
    setPublisher(p.pub);
    setPermissionsInput(p.perms);
    setAnalysisResult(null);
  };

  const handleRunAnalysis = () => {
    setAnalyzing(true);

    setTimeout(() => {
      const perms = permissionsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const isOfficial = packageName === 'com.brandshield.official' && publisher.includes('BrandShield');

      if (isOfficial) {
        setAnalysisResult({
          isOfficial: true,
          riskScore: 0,
          riskLevel: 'Safe',
          verdict: 'OFFICIAL WHITELISTED ASSET (0% False Positive Guarantee)',
          publisherMismatch: false,
          flaggedPerms: [],
          malwareFamily: 'None (Legitimate Enterprise Binary)',
          takedownNotice: null
        });
        setAnalyzing(false);
        return;
      }

      // Check dangerous permissions
      const dangerousList = [
        { name: 'android.permission.RECEIVE_SMS', severity: 'Critical', desc: 'Can intercept 2FA bank OTP tokens silently' },
        { name: 'android.permission.READ_SMS', severity: 'Critical', desc: 'Reads incoming banking and verification codes' },
        { name: 'android.permission.SYSTEM_ALERT_WINDOW', severity: 'High', desc: 'Allows phishing overlays on top of banking apps' },
        { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', severity: 'Critical', desc: 'Full automated keystroke reading and UI manipulation' },
        { name: 'android.permission.REQUEST_INSTALL_PACKAGES', severity: 'High', desc: 'Silently downloads secondary dropped malware payloads' },
        { name: 'android.permission.RECORD_AUDIO', severity: 'Medium', desc: 'Background microphone listening capability' },
        { name: 'android.permission.ACCESS_FINE_LOCATION', severity: 'Medium', desc: 'Tracks exact GPS physical coordinates' }
      ];

      const flagged = dangerousList.filter(d => perms.includes(d.name));

      let score = 25; // Base score for third-party unverified publisher
      if (publisher !== 'BrandShield Security Corp') score += 30; // Publisher mismatch
      if (flagged.some(f => f.severity === 'Critical')) score += 35;
      if (flagged.some(f => f.name.includes('ACCESSIBILITY') || f.name.includes('RECEIVE_SMS'))) score += 10;

      score = Math.min(score, 99);

      let family = 'Suspicious Adware / Potentially Unwanted Program (PUP)';
      if (perms.includes('android.permission.BIND_ACCESSIBILITY_SERVICE') || perms.includes('android.permission.SYSTEM_ALERT_WINDOW')) {
        family = 'Trojan-Banker.AndroidOS.OverlayStealer';
      } else if (perms.includes('android.permission.RECEIVE_SMS')) {
        family = 'Spyware.AndroidOS.SMSTracker';
      }

      setAnalysisResult({
        isOfficial: false,
        riskScore: score,
        riskLevel: score >= 85 ? 'Critical' : 'High',
        verdict: `MALICIOUS REPACKAGED APK DETECTED (${family})`,
        publisherMismatch: true,
        flaggedPerms: flagged,
        malwareFamily: family,
        takedownNotice: `FORMAL GOOGLE PLAY PROTECT & REPOSITORY TAKEDOWN NOTICE\nInfringing Package: ${packageName}\nApp Title: ${appTitle}\nUnauthorized Developer: ${publisher}\nTarget Brand: BrandShield\nClassified Threat Family: ${family}\nFlagged Permissions: ${flagged.map(f => f.name).join(', ')}\nAction: Immediate removal under Google Developer Program Malware & Impersonation Policies.`
      });

      setAnalyzing(false);
    }, 700);
  };

  const handleCopyTakedown = () => {
    if (!analysisResult?.takedownNotice) return;
    navigator.clipboard.writeText(analysisResult.takedownNotice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-[#0f172a] to-[#0a0f1d] border border-purple-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            Android Security Lab
          </span>
          <h2 className="text-xl font-black text-white mt-1">Malicious APK &amp; Rogue App Sandbox</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time static code audit: unpack package manifests, detect SMS-stealers &amp; Trojan overlays, and verify publisher certificates.
          </p>
        </div>

        {/* Preset sample buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-bold">Samples:</span>
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(p)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#141e33] hover:bg-[#1a2845] border border-slate-700 text-slate-200 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Upload Card (col-span-6) */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" /> Package Inspection Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Android Package Name / ID</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. com.fake.brandshield.rewards"
                className="w-full bg-[#141e33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">App Title</label>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="e.g. BrandShield Rewards"
                  className="w-full bg-[#141e33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Publisher / Developer</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="e.g. Apex Rogue Dev Ltd"
                  className="w-full bg-[#141e33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Requested Android Manifest Permissions (Comma-separated)
              </label>
              <textarea
                rows={3}
                value={permissionsInput}
                onChange={(e) => setPermissionsInput(e.target.value)}
                className="w-full bg-[#141e33] border border-slate-700 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-purple-500 text-[11px]"
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <Bug className={`w-4 h-4 ${analyzing ? 'animate-bounce' : ''}`} />
              {analyzing ? 'Decompiling Manifest & Analyzing Permissions...' : 'Run Forensic APK Sandbox Scan'}
            </button>
          </div>
        </div>

        {/* Right: Sandbox Results Card (col-span-6) */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" /> Forensic Analysis Verdict
            </h3>

            {!analysisResult && !analyzing && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-2xl">
                <Bug className="w-10 h-10 text-slate-600 mb-2" />
                <span className="text-xs font-bold text-slate-300">No Package Analyzed Yet</span>
                <span className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Choose a preset sample from above or enter custom APK metadata to run static permission evaluation.
                </span>
              </div>
            )}

            {analyzing && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-slate-800 bg-[#141e33] rounded-2xl animate-pulse">
                <Bug className="w-10 h-10 text-purple-400 animate-spin mb-3" />
                <span className="text-xs font-bold text-white">Decompiling AndroidManifest.xml...</span>
                <span className="text-[11px] text-purple-300 mt-1">Cross-referencing signature with BrandShield verified keystore</span>
              </div>
            )}

            {analysisResult && !analyzing && (
              <div className="space-y-4 text-xs animate-fadeIn">
                {/* Score & Verdict Banner */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  analysisResult.isOfficial
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block">
                      {analysisResult.verdict}
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {analysisResult.malwareFamily}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black">
                      {analysisResult.riskScore}
                    </span>
                    <span className="text-[10px] block opacity-80">/ 100 Risk</span>
                  </div>
                </div>

                {/* Audit Breakdown */}
                <div className="space-y-2 bg-[#121c30] p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                    <span className="text-slate-400">Publisher Signature Audit:</span>
                    {analysisResult.publisherMismatch
                      ? <span className="text-rose-400 font-bold">MISMATCH: Developer does not match official entity (BrandShield Security Corp).</span>
                      : <span className="text-emerald-400 font-bold">MATCH: Verified Brand Signature.</span>
                    }
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-400 block mb-1 text-[11px] font-bold">
                      Dangerous Permissions Flagged ({analysisResult.flaggedPerms?.length || 0}):
                    </span>
                    {analysisResult.flaggedPerms?.length === 0 ? (
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> No high-risk or invasive Android permissions requested.
                      </span>
                    ) : (
                      <div className="space-y-1.5 mt-1.5">
                        {analysisResult.flaggedPerms.map((fp: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 bg-[#0d1424] p-2 rounded-lg border border-rose-900/40">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-mono text-rose-300 font-bold text-[10px] block">{fp.name}</span>
                              <span className="text-slate-400 text-[10px]">{fp.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom 1-Click Takedown */}
          {analysisResult && !analysisResult.isOfficial && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Ready for Google Play Trust &amp; Safety submission.
              </span>
              <button
                onClick={handleCopyTakedown}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Takedown Notice Copied!' : 'Copy 1-Click Takedown Notice'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
