import React from 'react';

export const TermsAndConditions = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-blue-600 selection:text-white p-6 md:p-12 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono">// TERMS OF ENGAGEMENT</span>
            <h1 className="font-heading italic text-4xl md:text-5xl mt-2 tracking-tight text-white">Terms and Conditions</h1>
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
            <h2 className="font-heading italic text-2xl text-white">1. Authorized Operational Scope</h2>
            <p>
              The Digital Risk Protection Platform is provided solely for proactive enterprise defense, brand asset monitoring, authorized domain reconnaissance, and mobile APK binary inspection. Users warrant that all registered brand profiles and domain assets under surveillance belong to their entity or authorized partners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading italic text-2xl text-white">2. Heuristic Scans &amp; Accuracy Guarantees</h2>
            <p>
              Automated algorithmic evaluations, including Levenshtein distance metrics, homoglyph character substitutions, and APK permission heuristics, represent objective algorithmic indicators. While designed with baseline exclusion filters to prevent false positives, final takedown notices and forensic submissions should be reviewed by a qualified security analyst.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading italic text-2xl text-white">3. Takedown Actions &amp; Third-Party Networks</h2>
            <p>
              Takedown workflows, registrar abuse notices, and app store flag submissions are routed to independent third-party platforms (registrars, social platforms, and application repositories). Operational dispatch latency and takedown enforcement are governed by the respective platform policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading italic text-2xl text-white">4. Anti-Abuse &amp; Service Boundaries</h2>
            <p>
              Reverse engineering, denial of service against platform endpoints, or unauthorized scanning of non-affiliated brands is strictly prohibited and subject to immediate credential termination.
            </p>
          </section>
        </div>

        <div className="text-xs text-white/40 font-mono text-center pt-8 border-t border-white/10">
          Last revised: October 2026 • Digital Risk Protection Platform Legal Framework
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
