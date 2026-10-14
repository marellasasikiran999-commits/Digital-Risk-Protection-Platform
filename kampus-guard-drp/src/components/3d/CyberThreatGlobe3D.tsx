import React, { useEffect, useState } from 'react';
import { 
  Shield, Zap, Radio, Crosshair
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ThreatPoint {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  type: string;
  ip: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  score: number;
  details: string;
}

const THREAT_DATA: ThreatPoint[] = [
  {
    id: 't-1',
    name: 'Cyrillic Homoglyph Phishing Farm',
    city: 'Moscow',
    country: 'Russia',
    lat: 55.75,
    lng: 37.61,
    type: 'Unicode Spoof (U+0430 Confusable)',
    ip: '185.220.***.*** (External C2)',
    severity: 'CRITICAL',
    score: 98,
    details: 'Spawning live fake portals with Cyrillic lookalikes targeting customer login forms.'
  },
  {
    id: 't-2',
    name: 'Counterfeit APK Mirror Dropper',
    city: 'Shenzhen',
    country: 'China',
    lat: 22.54,
    lng: 114.05,
    type: 'Trojan-Banker.AndroidOS',
    ip: '113.108.***.*** (Trojan Mirror)',
    severity: 'CRITICAL',
    score: 94,
    details: 'Hosting cracked companion APKs injecting SYSTEM_ALERT_WINDOW overlay screens.'
  },
  {
    id: 't-3',
    name: 'BankBot SMS Token Interceptor',
    city: 'São Paulo',
    country: 'Brazil',
    lat: -23.55,
    lng: -46.63,
    type: 'Spyware SMS Stealer',
    ip: '177.18.***.*** (Botnet Gateway)',
    severity: 'HIGH',
    score: 89,
    details: 'Harvesting incoming SMS OTP codes via unauthorized background notification listener.'
  },
  {
    id: 't-4',
    name: 'Affix Customer Support Scams',
    city: 'Lagos',
    country: 'Nigeria',
    lat: 6.52,
    lng: 3.37,
    type: 'Social Media Impersonation',
    ip: '102.164.***.*** (Phishing Relay)',
    severity: 'HIGH',
    score: 87,
    details: 'Operating deceptive Twitter/Instagram accounts (@brand_support24) claiming official affiliation.'
  },
  {
    id: 't-5',
    name: 'Bulletproof Fast-Flux Proxy',
    city: 'Frankfurt',
    country: 'Germany',
    lat: 50.11,
    lng: 8.68,
    type: 'Typosquat Resolver',
    ip: '194.26.***.*** (Fast-Flux C2)',
    severity: 'CRITICAL',
    score: 96,
    details: 'Rotates IP addresses every 120 seconds across 40+ proxy hosts to evade domain takedowns.'
  },
  {
    id: 't-6',
    name: 'Credential Harvesting Gateway',
    city: 'Bucharest',
    country: 'Romania',
    lat: 44.42,
    lng: 26.10,
    type: 'Combo-squat Domain',
    ip: '89.38.***.*** (Credential Farm)',
    severity: 'MEDIUM',
    score: 78,
    details: 'Spoofed rewards landing pages luring users to submit SSO corporate credentials.'
  }
];

export const CyberThreatGlobe3D: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatPoint>(THREAT_DATA[0]);
  const [interceptCount, setInterceptCount] = useState(1420);

  // Live intercept ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setInterceptCount(c => c + Math.floor(Math.random() * 3) + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="p-6 relative overflow-hidden backdrop-blur-2xl bg-gradient-to-r from-blue-950/40 via-[#0a1020] to-[#070b16] border-blue-500/20 card-glow-top">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase mb-1.5">
              <span className="w-6 h-px bg-cyan-400" />
              <span>02 // GLOBAL THREAT RADAR</span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display">
                Global Cyber Threat Matrix &amp; Vector Globe
              </h1>
              <Badge variant="success" className="font-mono text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Defense Mesh Active</span>
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time threat surveillance telemetry. Select any active vector node to inspect origin telemetry, IP coordinates, and dispatch automated mitigations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0b1222]/80 border border-slate-800 rounded-xl px-4 py-2 text-right font-cyber">
              <span className="text-[10px] text-slate-400 block uppercase">Threats Intercepted Today</span>
              <span className="text-lg font-black text-emerald-400">{interceptCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Active Threat Vectors Matrix (Col Span 7) */}
        <Card className="lg:col-span-7 p-6 overflow-hidden relative shadow-2xl bg-[#060a14]/90 border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Top Vectors HUD */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="font-cyber font-bold text-cyan-300">06 ACTIVE THREAT VECTORS</span>
                </Badge>
                <span className="text-[11px] text-slate-400 font-cyber hidden sm:inline">
                  Real-time Ingestion Stream
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-cyber text-emerald-400 font-semibold uppercase tracking-wider">
                  Live Telemetry
                </span>
              </div>
            </div>

            {/* Grid of the 6 Active Threat Vectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {THREAT_DATA.map((threat) => {
                const isSelected = selectedThreat.id === threat.id;
                const isCritical = threat.severity === 'CRITICAL';

                return (
                  <button
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'border-cyan-400/80 bg-gradient-to-br from-cyan-950/40 via-[#0c162d] to-[#070d1e] shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : 'border-slate-800/80 bg-[#090f1f]/60 hover:bg-[#0c162d]/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Vector Meta */}
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block truncate">
                          {threat.type}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-0.5 truncate font-sans">
                          {threat.name}
                        </h4>
                      </div>
                      <Badge
                        variant={isCritical ? 'destructive' : 'warning'}
                        className="text-[10px] font-mono font-bold shrink-0"
                      >
                        {threat.score}
                      </Badge>
                    </div>

                    {/* Threat Details Snippet */}
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {threat.details}
                    </p>

                    {/* Bottom Location & IP Telemetry */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 w-full">
                      <span className="flex items-center gap-1 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {threat.city}, {threat.country}
                      </span>
                      <span className="text-slate-400 truncate max-w-[140px]">
                        {threat.ip.split(' ')[0]}
                      </span>
                    </div>

                    {/* Selected Active Glow Accent */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-bl-md shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom HUD Defense Telemetry Strip */}
          <div className="p-3.5 mt-4 rounded-xl border border-slate-800/80 bg-[#080d1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] font-cyber text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-semibold">Perimeter Defense: Active</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>Geospatial Coverage: 100%</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400/80">
              LATENCY: 12ms // C2_HEURISTICS: ENGAGED
            </span>
          </div>
        </Card>

        {/* Right Threat Node Inspection Card (Col Span 5) */}
        <Card className="lg:col-span-5 p-6 space-y-4 shadow-xl flex flex-col justify-between bg-[#060a14]/90 border-slate-800">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" /> Inspected Threat Node
              </h3>
              <Badge variant={selectedThreat.severity === 'CRITICAL' ? 'destructive' : 'warning'}>
                {selectedThreat.severity} THREAT
              </Badge>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Target Threat Score Banner */}
              <div className="p-4 rounded-xl border border-rose-800/60 bg-rose-950/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block font-cyber text-rose-300">
                    {selectedThreat.type}
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block font-sans">
                    {selectedThreat.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-cyber mt-0.5">
                    {selectedThreat.city}, {selectedThreat.country}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-cyber text-rose-400">{selectedThreat.score}</span>
                  <span className="text-[10px] block opacity-80 font-cyber">/ 100</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-[#0b1222]/80 p-4 rounded-xl border border-slate-800 space-y-2.5 font-cyber text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Attacker IP Address:</span>
                  <span className="text-cyan-300 font-bold">{selectedThreat.ip}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-white">{selectedThreat.lat.toFixed(2)}°, {selectedThreat.lng.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Target Protected Entity:</span>
                  <span className="text-emerald-400 font-bold">Digital Risk Protection</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Mitigation Status:</span>
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Neutralized by Perimeter
                  </span>
                </div>
              </div>

              {/* Attack Narrative */}
              <div className="bg-[#0b1222]/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-bold text-[11px] font-cyber uppercase tracking-wider">
                  Behavioral Intelligence:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedThreat.details}
                </p>
              </div>

              {/* Quick Node Selector */}
              <div>
                <span className="text-slate-400 block font-bold text-[11px] font-cyber uppercase tracking-wider mb-2">
                  Select Threat Vector to Focus:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {THREAT_DATA.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedThreat(t)}
                      className={`text-[10px] font-cyber px-2.5 py-1.5 rounded-lg border text-left truncate transition-all cursor-pointer ${
                        selectedThreat.id === t.id
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 font-bold'
                          : 'border-slate-800 bg-[#0b1222]/50 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {t.city} ({t.score})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                alert(`Automated Countermeasure Dispatched for IP ${selectedThreat.ip}! Upstream ISP notified.`);
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Dispatch Automated ISP Takedown</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
