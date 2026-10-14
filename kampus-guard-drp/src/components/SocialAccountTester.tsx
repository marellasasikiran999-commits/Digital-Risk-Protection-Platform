import React, { useState, useEffect } from 'react';
import { 
  Radio, Copy, Check, ExternalLink, ShieldCheck
} from 'lucide-react';
import type { Brand } from '../utils/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { realtimeDb } from '../utils/realtimeDb';
import { evaluateInstagramHandle } from '../utils/instagramEngine.js';

interface SocialAccountTesterProps {
  activeBrand?: Brand;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const SocialAccountTester: React.FC<SocialAccountTesterProps> = ({ activeBrand }) => {
  const [handle, setHandle] = useState('@drp_support24');
  const [platform, setPlatform] = useState('Instagram');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const brandName = activeBrand?.brand_name || 'Digital Risk Protection Platform';
  const officialList = (activeBrand?.official_handles && activeBrand.official_handles.length > 0)
    ? activeBrand.official_handles
    : ['@digitalriskprotection', '@digitalriskprotection_hq'];

  // 4 Explicit Test Scenario Vectors benchmarked for Live Social Surveillance
  const samples = [
    { label: 'Instagram Affix Impersonator', handle: '@drp_support24', platform: 'Instagram' },
    { label: 'Core Deceptive Affix', handle: '@digitalrisk_core', platform: 'Instagram' },
    { label: 'Fake Helpdesk Impersonator', handle: '@bycom_helpdesk_official', platform: 'Instagram' },
    { label: 'Official Whitelisted Handle', handle: '@digitalriskprotection', platform: 'Instagram' }
  ];

  // Auto-parse full URLs if user pastes from Instagram address bar or app
  const parseSocialInput = (input: string) => {
    const raw = input.trim();
    if (!raw) return { handle: '', platform: platform };

    // Instagram URL: https://instagram.com/username or https://www.instagram.com/username/?igsh=...
    const instaMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/i);
    if (instaMatch) {
      return { handle: `@${instaMatch[1]}`, platform: 'Instagram' };
    }

    // Twitter / X URL
    const xMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/([a-zA-Z0-9_]+)/i);
    if (xMatch) {
      return { handle: `@${xMatch[1]}`, platform: 'Twitter' };
    }

    // Facebook URL
    const fbMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9._]+)/i);
    if (fbMatch) {
      return { handle: `@${fbMatch[1]}`, platform: 'Facebook' };
    }

    // Telegram URL
    const tgMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?t\.me\/([a-zA-Z0-9_]+)/i);
    if (tgMatch) {
      return { handle: `@${tgMatch[1]}`, platform: 'Telegram' };
    }

    // Plain username or @handle
    if (!raw.startsWith('@')) {
      return { handle: `@${raw}`, platform: platform };
    }

    return { handle: raw, platform: platform };
  };

  const handleInputChange = (val: string) => {
    const parsed = parseSocialInput(val);
    setHandle(parsed.handle);
    if (parsed.platform && parsed.platform !== platform) {
      setPlatform(parsed.platform);
    }
  };

  const getLiveProfileUrl = (candidate: string, plat: string) => {
    const raw = candidate.trim().replace(/^@/, '');
    if (!raw) return '#';
    switch (plat.toLowerCase()) {
      case 'twitter':
      case 'twitter / x':
        return `https://x.com/${raw}`;
      case 'instagram':
        return `https://www.instagram.com/${raw}/`;
      case 'facebook':
        return `https://facebook.com/${raw}`;
      case 'telegram':
        return `https://t.me/${raw}`;
      default:
        return `https://google.com/search?q=${encodeURIComponent(raw + ' ' + plat)}`;
    }
  };

  // Live Detection Filter Logic
  const handleRunTest = (targetHandle = handle, targetPlatform = platform) => {
    const clean = (targetHandle || handle).trim();
    if (!clean) return;
    
    // Non-intrusive button state indicator without unmounting cards
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 200);

    const evalResult = evaluateInstagramHandle(clean, {
      brandName,
      officialHandles: officialList,
      platform: targetPlatform
    });

    setResult(evalResult);

    realtimeDb.applyNewFinding({
      id: `FIND-SOC-${clean.replace(/[^a-zA-Z0-9_.-]/g, '_')}`,
      brand_name: brandName,
      finding_type: 'social',
      title: targetPlatform,
      category: evalResult.isOfficial ? 'Social Media › Official Asset' : 'Social Media › Impersonator Profile',
      candidate_name: clean,
      asset: clean,
      risk_score: evalResult.score,
      risk_level: (evalResult.level === 'Safe' ? 'Low' : evalResult.level) as any,
      status: evalResult.isOfficial ? 'Legitimate' : 'Pending',
      confidence_score: 95,
      similarity_rate: parseInt(evalResult.similarity) || 85,
      detection_source: `${targetPlatform} Sentinel`,
      threat_reason: evalResult.reasons[0] || 'Evaluated via Instagram Engine',
      note: `Target handle evaluated with risk score ${evalResult.score}/100.`,
      factors: evalResult.factors.length > 0 ? evalResult.factors : [
        { factor: 'Handle proximity check', score: 30 }
      ],
      is_official: evalResult.isOfficial,
      detected_date: 'Just now',
      updated_date: 'Just now',
      takedown_notice: evalResult.takedown || undefined
    });
  };

  // Immediate Initial Evaluation on mount (avoids layout shift or blank container)
  useEffect(() => {
    handleRunTest('@drp_support24', 'Instagram');
  }, []);

  // Real-Time Event Hook: reacts immediately when 'Run Live Social Scan' is invoked at platform level
  useEffect(() => {
    const onLiveSocialScanTrigger = () => {
      handleRunTest(handle, platform);
    };
    window.addEventListener('drp:run-live-social-scan', onLiveSocialScanTrigger);
    return () => window.removeEventListener('drp:run-live-social-scan', onLiveSocialScanTrigger);
  }, [handle, platform]);

  const liveUrl = getLiveProfileUrl(handle, platform);

  return (
    <div className="space-y-6">
      {/* Top Banner with Editorial Heading */}
      <Card className="p-6 relative overflow-hidden backdrop-blur-2xl bg-gradient-to-r from-pink-950/20 via-[#0a1020] to-[#070b16] border-pink-500/20 card-glow-top">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyber" className="bg-pink-500/10 text-pink-400 border-pink-500/30 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram &amp; Social Sentinel</span>
              </Badge>
              <Badge variant="success">
                <ShieldCheck className="w-3 h-3" /> Real Profiles &amp; URLs Supported
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-2 tracking-tight font-display">
              Instagram Impersonation &amp; Homoglyph Inspector
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Audit live Instagram accounts, Cyrillic letter swaps, and deceptive brand affixes against your baseline: <strong className="text-cyan-300 font-cyber">{brandName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-bold font-cyber">Test Scenarios:</span>
            {samples.map((s, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  setHandle(s.handle);
                  setPlatform(s.platform);
                  handleRunTest(s.handle, s.platform);
                }}
                className="font-cyber text-[11px] h-8 hover:border-pink-500/40"
              >
                <span>{s.handle}</span>
                <span className="text-[9px] text-slate-500 font-sans ml-1">({s.label.split(' ')[1] || s.label})</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Step-by-Step Instagram Testing Guide */}
      <div className="bg-[#0b1222]/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
              <InstagramIcon className="w-4 h-4 text-pink-400" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              How to Test Any Instagram Account (Step-by-Step)
            </h3>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-[11px] text-slate-400 hover:text-white font-mono transition-colors"
          >
            {showGuide ? '[Hide Guide]' : '[Show Guide]'}
          </button>
        </div>

        {showGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1 text-xs">
            <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-black uppercase font-mono text-cyan-400 block">Step 1 // Grab Handle or URL</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                In Instagram, open the profile you want to audit. Copy either their username (e.g. <strong className="text-white">@username</strong>) or the URL from the browser bar (<strong className="text-slate-400">instagram.com/username</strong>).
              </p>
            </div>

            <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-black uppercase font-mono text-pink-400 block">Step 2 // Paste &amp; Run Audit</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Paste it into the <strong className="text-white">Candidate Handle</strong> field below. The engine auto-cleans the URL, parses the handle, and checks for Cyrillic homoglyph swaps (<strong className="text-yellow-400">а</strong>, <strong className="text-yellow-400">о</strong>, <strong className="text-yellow-400">р</strong>).
              </p>
            </div>

            <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-black uppercase font-mono text-emerald-400 block">Step 3 // Triage &amp; Legal Takedown</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Review the threat score. If fraudulent, copy the pre-drafted <strong className="text-white">Formal Meta Abuse Notice</strong> with 1-click and submit it directly to Meta / Instagram’s official reporting portal.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form with shadcn Card & Input */}
        <Card className="lg:col-span-6 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" /> Account Inspection Parameters
            </h3>
            <Badge variant="secondary" className="text-[9px]">Live Audit</Badge>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold font-cyber text-[11px]">
                  Candidate Instagram Handle or Profile Link
                </label>
                {handle.trim() && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <span>Open Live on {platform}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <Input
                type="text"
                value={handle}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && handle.trim()) {
                    handleRunTest(handle, platform);
                  }
                }}
                placeholder="Paste Instagram URL (e.g. instagram.com/scam_help) or @handle"
                className="font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Accepts <code className="text-slate-400">@username</code> or full URLs like <code className="text-slate-400">https://instagram.com/profile</code>
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 font-cyber text-[11px]">
                Target Social Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-[#0d1527]/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-cyber transition-all"
              >
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Facebook">Facebook</option>
                <option value="Telegram">Telegram</option>
              </select>
            </div>

            <div className="bg-[#0b1222]/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400 font-cyber">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>Active Brand Baseline:</span>
                <span className="text-cyan-300 font-bold">{brandName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Whitelisted Official Handles:</span>
                <span className="text-emerald-400 text-[10px]">{officialList.join(', ')}</span>
              </div>
            </div>

            <Button
              variant="cyber"
              size="lg"
              onClick={() => handleRunTest(handle, platform)}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-500 hover:to-blue-500"
            >
              <Radio className={`w-4 h-4 ${analyzing ? 'animate-bounce' : ''}`} />
              <span>{analyzing ? 'Inspecting Unicode Points & Homoglyphs...' : 'Analyze Handle & Confusables'}</span>
            </Button>
          </div>
        </Card>

        {/* Right Findings Card */}
        <Card className="lg:col-span-6 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Analysis Findings</h3>
              {result && (
                <Badge variant={result.isOfficial ? 'success' : (result.level?.toLowerCase() === 'medium' ? 'warning' : 'destructive')}>
                  {result.level?.toUpperCase()}
                </Badge>
              )}
            </div>

            {!result && (
              <div className="h-56 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800/80 rounded-2xl mt-4 bg-[#0a1020]/40">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-3">
                  <InstagramIcon className="w-6 h-6 text-pink-400" />
                </div>
                <span className="text-xs font-bold text-slate-200 font-cyber">Ready for Instagram Audit</span>
                <span className="text-[11px] text-slate-400 mt-1.5 max-w-sm">
                  Enter an Instagram profile or pick one of the presets on the top right to audit Unicode homoglyphs, deceptive affixes, and whitelist status.
                </span>
              </div>
            )}

            {result && (
              <div className="space-y-3.5 mt-4 text-xs">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  result.isOfficial 
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300' 
                    : result.level?.toLowerCase() === 'medium'
                    ? 'bg-amber-950/30 border-amber-800/80 text-amber-300'
                    : 'bg-rose-950/30 border-rose-800/80 text-rose-300'
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block font-cyber">{result.verdict}</span>
                    <span className="text-xs text-slate-200 mt-0.5 block font-cyber">{result.homoglyph}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-cyber">Similarity Index: {result.similarity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-cyber">{result.score}</span>
                    <span className="text-[10px] block opacity-80 font-cyber">/ 100</span>
                  </div>
                </div>

                <div className="bg-[#0b1222]/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 block font-bold text-[11px] font-cyber uppercase tracking-wider">Evaluation Reasons:</span>
                  {result.reasons.map((r: string, i: number) => (
                    <div key={i} className="text-slate-300 text-[11px] flex items-center gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result && !result.isOfficial && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View on {platform}</span>
                  </a>
                </Button>

                {platform === 'Instagram' && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-pink-500/40 hover:bg-pink-500/10 text-pink-300"
                  >
                    <a
                      href="https://help.instagram.com/contact/636276399721841"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                      <span>Meta Abuse Portal</span>
                    </a>
                  </Button>
                )}
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(result.takedown);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Notice Copied!' : 'Copy Platform Abuse Notice'}</span>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
