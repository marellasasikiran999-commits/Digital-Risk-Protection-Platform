import React, { useState } from 'react';
import { generateLookalikeVariants, checkHomoglyph, getJaroWinklerSimilarity } from '../utils/detectionEngine';
import { Sparkles } from 'lucide-react';

interface LookAlikeMatrixProps {
  brandName: string;
}

export const LookAlikeMatrix: React.FC<LookAlikeMatrixProps> = ({ brandName }) => {
  const [customInput, setCustomInput] = useState(`${brandName.replace(/a/i, 'а')}`); // Defaults to Cyrillic 'а' version of current brand name
  const variants = generateLookalikeVariants(brandName);

  const customHomoglyphResult = checkHomoglyph(customInput);
  const customSim = getJaroWinklerSimilarity(brandName, customHomoglyphResult.normalizedText);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/60 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                Advanced AI Security Module
              </span>
              <h2 className="text-xl font-extrabold text-white">Look-Alike & Homoglyph Name Detection Engine</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time detection engine for handle and domain typosquatting including Unicode homoglyphs (Cyrillic/Greek character swaps),
              character substitutions, affix additions, and spacing variations for <strong className="text-cyan-300 font-bold">{brandName}</strong>.
            </p>
          </div>
          <Sparkles className="w-10 h-10 text-purple-400 shrink-0 hidden sm:block animate-pulse" />
        </div>
      </div>

      {/* Interactive Live Playground */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-xl shadow-xl">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> Interactive Real-time Homoglyph Sandbox
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-semibold">Enter Any Test Handle, Domain, or Brand Name:</label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-sm font-mono text-cyan-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 shadow-inner"
            />
            <span className="text-[11px] text-slate-400 mt-1.5 block">
              Try typing <code className="text-amber-300 bg-slate-950 px-1 rounded font-mono">M1crosoft</code>, <code className="text-amber-300 bg-slate-950 px-1 rounded font-mono">T3sla</code>, or copy <code className="text-amber-300 bg-slate-950 px-1 rounded font-mono">Kаmpus.VC</code>
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 font-mono">
            <span className="text-xs font-bold text-slate-300 block">Detection Analysis Output:</span>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Jaro-Winkler Similarity to "{brandName}":</span>
              <span className="font-extrabold text-cyan-400">{customSim}% Match</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Unicode Homoglyph Flag:</span>
              <span className={`font-extrabold ${customHomoglyphResult.hasHomoglyph ? 'text-rose-400' : 'text-emerald-400'}`}>
                {customHomoglyphResult.hasHomoglyph ? 'DETECTED (HOMOGLYPH)' : 'CLEAN'}
              </span>
            </div>

            {customHomoglyphResult.hasHomoglyph && (
              <div className="text-[11px] bg-rose-950/60 border border-rose-800/60 rounded-lg p-2.5 text-rose-200 font-mono">
                Swapped Character: {customHomoglyphResult.details}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated Lookalike Threat Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Calculated Attack Vector Permutations for "{brandName}"
          </h3>
          <span className="text-xs text-slate-400 font-mono">{variants.length} Vectors Generated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider font-mono">
                <th className="pb-3 font-bold">Variant Handle / Domain</th>
                <th className="pb-3 font-bold">Obfuscation Technique</th>
                <th className="pb-3 font-bold">Similarity Score</th>
                <th className="pb-3 font-bold">Substituted Characters</th>
                <th className="pb-3 font-bold">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 font-bold text-cyan-300">{v.variantName}</td>
                  <td className="py-3 text-slate-300">{v.technique}</td>
                  <td className="py-3 text-cyan-400 font-extrabold">{v.similarityScore}%</td>
                  <td className="py-3 text-amber-300">
                    {v.confusableCharacters.map((c) => `${c.original} -> ${c.replaced}`).join(', ')}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${
                        v.riskSeverity === 'HIGH'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {v.riskSeverity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
