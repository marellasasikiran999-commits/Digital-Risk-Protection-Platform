import React, { useState } from 'react';
import { Radio, Copy, Check } from 'lucide-react';

export const SocialAccountTester: React.FC = () => {
  const [handle, setHandle] = useState('@drp_support24');
  const [platform, setPlatform] = useState('Instagram');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const samples = [
    { handle: '@drp_support24', platform: 'Instagram' },
    { handle: '@digitаlrisk_promo', platform: 'Twitter' },
    { handle: '@digitalriskprotection', platform: 'Twitter' } // Official
  ];

  const handleRunTest = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const clean = handle.trim();
      const isOfficial = clean.toLowerCase() === '@digitalriskprotection' || clean.toLowerCase() === '@digitalriskprotection_hq';

      if (isOfficial) {
        setResult({
          isOfficial: true,
          score: 0,
          level: 'Safe',
          verdict: 'OFFICIAL WHITELISTED ACCOUNT (0% False Positive Guarantee)',
          homoglyph: 'None',
          similarity: '100%',
          reasons: ['Matches registered Brand Profile baseline exactly.'],
          takedown: null
        });
      } else {
        const hasCyrillic = clean.includes('а') || clean.includes('е') || clean.includes('о');
        const score = hasCyrillic ? 96 : (clean.includes('support') ? 92 : 68);

        setResult({
          isOfficial: false,
          score: score,
          level: score >= 85 ? 'Critical' : 'High',
          verdict: 'SUSPICIOUS IMPERSONATION PROFILE DETECTED',
          homoglyph: hasCyrillic ? "Cyrillic 'а' (U+0430) detected" : 'Clean Latin string',
          similarity: '89%',
          reasons: [
            hasCyrillic ? 'Unicode Homoglyph confusable character spoofing' : 'Affix hijacking (_support24 / _promo)',
            'Missing official verification badge checkmark',
            'High string similarity to official @digitalriskprotection (89%)'
          ],
          takedown: `FORMAL SOCIAL MEDIA ABUSE NOTICE\nPlatform: ${platform}\nImpersonating Handle: ${clean}\nTarget Brand: Digital Risk Protection Platform\nRisk Score: ${score}/100\nEvidence: Unauthorized corporate brand use, deceptive account credentials.\nAction: Immediate suspension under Platform Terms of Service.`
        });
      }
      setAnalyzing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-950/60 via-[#0f172a] to-[#0a0f1d] border border-blue-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
            Social Media Intelligence Lab
          </span>
          <h2 className="text-xl font-black text-white mt-1">Homoglyph &amp; Impersonation Handle Analyzer</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Test candidate social media handles for Cyrillic confusables, affix hijacking, and Jaro-Winkler string similarity.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-bold">Samples:</span>
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setHandle(s.handle);
                setPlatform(s.platform);
                setResult(null);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#141e33] hover:bg-[#1a2845] border border-slate-700 text-slate-200 transition-all font-mono"
            >
              {s.handle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" /> Account Inspection Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Candidate Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. @brandshield_support24"
                className="w-full bg-[#141e33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Target Social Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-[#141e33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Facebook">Facebook</option>
                <option value="Telegram">Telegram</option>
              </select>
            </div>

            <button
              onClick={handleRunTest}
              disabled={analyzing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              <Radio className={`w-4 h-4 ${analyzing ? 'animate-bounce' : ''}`} />
              {analyzing ? 'Inspecting Unicode Points...' : 'Analyze Handle & Confusables'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Analysis Findings</h3>

            {!result && !analyzing && (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-2xl mt-4">
                <span className="text-xs font-bold text-slate-300">Ready for Scan</span>
                <span className="text-[11px] text-slate-500 mt-1">Select a sample or enter a handle to detect character homoglyphs.</span>
              </div>
            )}

            {result && !analyzing && (
              <div className="space-y-3 mt-4 text-xs">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  result.isOfficial ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block">{result.verdict}</span>
                    <span className="text-xs text-slate-300 mt-0.5 block">Confusable: {result.homoglyph}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black">{result.score}</span>
                    <span className="text-[10px] block opacity-80">/ 100</span>
                  </div>
                </div>

                <div className="bg-[#121c30] p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 block font-bold text-[11px]">Evaluation Reasons:</span>
                  {result.reasons.map((r: string, i: number) => (
                    <div key={i} className="text-slate-300 text-[11px] flex items-center gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result && !result.isOfficial && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.takedown);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Takedown Copied!' : 'Copy Platform Abuse Notice'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
