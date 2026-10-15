import React from 'react';

export const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-blue-600 selection:text-white p-6 md:p-12 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono">// COMPLIANCE &amp; LEGAL</span>
            <h1 className="font-heading italic text-4xl md:text-5xl mt-2 tracking-tight text-white">Privacy Policy</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-900 border border-white/20 hover:border-white/40 text-xs font-medium rounded-md transition-colors text-white"
            >
              Return to Console
            </button>
          )}
        </div>

        {/* Content Section in Liquid Glass */}
        <div className="liquid-glass rounded-xl p-8 space-y-6 text-sm text-white/90 leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-heading italic text-2xl text-white">1. Information Architecture &amp; Data Collection</h2>
            <p>
              The Digital Risk Protection Platform operates strictly as an external cyber intelligence and attack surface surveillance engine. We collect verified enterprise brand baselines, domain lookups, and public network metadata exclusively for brand preservation, unauthorized rogue app detection, and homoglyph phishing remediation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading italic text-2xl text-white">2. Passive Telemetry &amp; External Scans</h2>
            <p>
              All external threat scans—including Google Play metadata, APK mirror lookups, and public social surface handles—are executed passively via public APIs and open threat intelligence repositories. No internal customer network access is solicited, logged, or retained without explicit cryptographic authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading italic text-2xl text-white">3. Cryptographic Storage &amp; Firebase Security</h2>
            <p>
              Authentication tokens and user identities managed through Google One Tap and Firebase Authentication adhere strictly to OAuth 2.0 and zero-knowledge encryption standards. Threat findings, audit logs, and risk dossiers are stored in isolated tenant spaces with row-level security policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading italic text-2xl text-white">4. Data Deletion &amp; Takedown Integrity</h2>
            <p>
              Enterprises retain absolute control over registered brand baselines. Exported audit dossiers and CSV reports reflect immutable point-in-time forensic snapshots, while active surveillance feeds can be purged or paused immediately through the System Settings workspace.
            </p>
          </section>
        </div>

        <div className="text-xs text-white/40 font-mono text-center pt-8 border-t border-white/10">
          Last revised: October 2026 • Digital Risk Protection Platform Architecture
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
