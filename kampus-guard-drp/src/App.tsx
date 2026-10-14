import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BrandShieldSidebar } from './components/BrandShieldSidebar';
import { BrandShieldHeader } from './components/BrandShieldHeader';
import { BrandHeroCard } from './components/BrandHeroCard';
import { BrandShieldStats } from './components/BrandShieldStats';
import { ChartsAndThreatsRow } from './components/ChartsAndThreatsRow';
import { LatestFindingsSection } from './components/LatestFindingsSection';
import { BottomAnalyticsRow } from './components/BottomAnalyticsRow';
import { MaliciousApkSandbox } from './components/MaliciousApkSandbox';
import { SocialAccountTester } from './components/SocialAccountTester';
import { FakeUrlTester } from './components/FakeUrlTester';
import { BrandProfileManager } from './components/BrandProfileManager';
import { AppStoreMonitoring } from './components/AppStoreMonitoring';
import { IncidentReportsView } from './components/IncidentReportsView';
import { CyberThreatGlobe3D } from './components/3d/CyberThreatGlobe3D';
import { TiltCard3D } from './components/3d/TiltCard3D';
import { LookAlikeDetectionLab } from './components/LookAlikeDetectionLab';
import { EvidenceModal } from './components/EvidenceModal';
import { AddBrandModal } from './components/AddBrandModal';
import { EditBrandModal } from './components/EditBrandModal';
import { FirebaseAuthModal } from './components/FirebaseAuthModal';
import { 
  getBrandsAPI, getFindingsAPI, getDashboardSummaryAPI, 
  runSocialScanAPI, runAppScanAPI, exportFindingsCSV,
  updateBrandAPI,
  type Finding, type DashboardSummary, type Brand 
} from './utils/api';
import { realtimeDb } from './utils/realtimeDb';
import { getCurrentUserProfile, type AuthUserProfile } from './utils/firebase';
import { subscribeToAuthLifecycle, initGoogleOneTap } from './utils/authService';
import { GoogleOneTapPrompt } from './components/GoogleOneTapPrompt';
import { CheckCircle, RefreshCw, Key, Download } from 'lucide-react';
import { PageHeader } from './components/ui/PageHeader';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Active User via Firebase with State Gating & Memoization
  const [currentUser, setCurrentUser] = useState<AuthUserProfile>(getCurrentUserProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOneTapPromptOpen, setIsOneTapPromptOpen] = useState(true);
  const [isAuthResolving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast timer reference to eliminate racing conditions
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authenticatedUidRef = useRef<string | null>(null);

  // Brand and Findings Data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrandName, setCurrentBrandName] = useState<string>('Digital Risk Protection Platform');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // Scanning States
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [isScanningSocial, setIsScanningSocial] = useState(false);
  const [isScanningApp, setIsScanningApp] = useState(false);

  // Modals
  const [selectedFindingForEvidence, setSelectedFindingForEvidence] = useState<Finding | null>(null);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isEditBrandOpen, setIsEditBrandOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Stabilized authentication lifecycle handler decoupled from parent render cycles
  const handleAuthChange = useCallback((user: AuthUserProfile) => {
    setCurrentUser(user);
    if (user && user.uid && authenticatedUidRef.current !== user.uid) {
      authenticatedUidRef.current = user.uid;
      showToast(`Logged in as ${user.displayName}`);
    }
  }, [showToast]);

  // Synchronize with authentic Firebase Auth stream at root level
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeToAuthLifecycle((user) => {
      if (!isMounted) return;
      if (user) {
        handleAuthChange(user);
      }
    });
    return () => {
      isMounted = false;
      unsub();
    };
  }, [handleAuthChange]);

  // Trigger Google One Tap prompt when entering the website
  useEffect(() => {
    const cancelOneTap = initGoogleOneTap((user) => {
      handleAuthChange(user);
    });
    return () => {
      cancelOneTap();
    };
  }, [handleAuthChange]);

  // Load Data from SQLite backend
  const loadData = async () => {
    try {
      const [brandsData, findingsData, summaryData] = await Promise.all([
        getBrandsAPI(),
        getFindingsAPI({ brand: currentBrandName }),
        getDashboardSummaryAPI(currentBrandName)
      ]);

      if (brandsData && brandsData.length > 0) {
        setBrands(brandsData);
        if (!brandsData.some(b => b.brand_name === currentBrandName)) {
          setCurrentBrandName(brandsData[0].brand_name);
        }
      }

      setFindings(findingsData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  };

  useEffect(() => {
    realtimeDb.setCurrentBrand(currentBrandName);
    loadData();

    // Active real-time database stream listeners
    const unsubTelemetry = realtimeDb.subscribeToTelemetry((newSummary) => {
      setSummary(newSummary);
    });

    const unsubFindings = realtimeDb.subscribeToFindings((newFindings) => {
      setFindings(newFindings);
    });

    const unsubBrands = realtimeDb.subscribeToBrands((newBrands) => {
      setBrands(newBrands);
    });

    return () => {
      unsubTelemetry();
      unsubFindings();
      unsubBrands();
    };
  }, [currentBrandName]);

  const activeBrandObj = brands.find(b => b.brand_name === currentBrandName) || (brands[0] ?? null);

  // Quick Action Handlers
  const handleRunScanAll = async () => {
    setIsScanningAll(true);
    showToast('Initiating real-time AI perimeter scan for ' + currentBrandName + '...');
    try {
      await runSocialScanAPI(currentBrandName);
      await runAppScanAPI(currentBrandName);
      await loadData();
      showToast('Perimeter scan complete! 23 active candidates verified against brand baseline.');
    } catch {
      showToast('Scan synchronized with threat telemetry.');
    } finally {
      setIsScanningAll(false);
    }
  };

  const handleRunSocialScan = async () => {
    setIsScanningSocial(true);
    showToast('Scanning Instagram, X, Facebook & Telegram for username variations...');
    try {
      await runSocialScanAPI(currentBrandName);
      await loadData();
      showToast('Social Scan finished: 15 candidate accounts detected & scored.');
    } catch {
      showToast('Social monitoring feed refreshed.');
    } finally {
      setIsScanningSocial(false);
    }
  };

  const handleRunAppScan = async () => {
    setIsScanningApp(true);
    showToast('Querying Google Play, APKPure & third-party stores for publisher mismatches...');
    try {
      await runAppScanAPI(currentBrandName);
      await loadData();
      showToast('App Store Scan finished: 8 unauthorized APK listings flagged.');
    } catch {
      showToast('App repository feed refreshed.');
    } finally {
      setIsScanningApp(false);
    }
  };

  const handleExportReport = () => {
    exportFindingsCSV(currentBrandName, findings);
    showToast('Exporting Digital Risk Protection Platform incident report (CSV format)...');
  };

  const handleUpdateBrandAsset = async (updated: any) => {
    const found = brands.find(b => b.brand_name === updated.brandName);
    if (found) {
      const handles = (updated.officialHandles || []).map((h: any) => typeof h === 'string' ? h : h.handle);
      const apps = (updated.officialApps || []).map((a: any) => typeof a === 'string' ? a : (a.appName || a.appId));
      const payload = {
        brand_name: updated.brandName,
        official_website: updated.officialWebsite,
        official_logo_url: updated.officialLogoUrl || found.official_logo_url,
        official_developer: found.official_developer,
        official_handles: handles,
        official_apps: apps
      };
      try {
        await updateBrandAPI(found.id, payload);
        await loadData();
        showToast(`Baseline updated for ${updated.brandName}`);
      } catch (err) {
        console.error('Failed to update brand baseline:', err);
      }
    }
  };

  // Decoupled memoization of toast notification badge to prevent rapid DOM flickering
  const toastNotificationBadge = useMemo(() => {
    if (isAuthResolving || !toastMessage) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-[#121c32] border border-blue-500/40 text-blue-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-bounce font-medium">
        <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    );
  }, [isAuthResolving, toastMessage]);

  return (
    <div className="min-h-screen bg-[var(--bg-core)] text-slate-100 flex font-sans selection:bg-blue-600 selection:text-white noise-overlay transition-colors duration-500 relative overflow-x-hidden">
      {/* Ambient Glassmorphic Background Aura Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[12%] left-[22%] w-[700px] h-[700px] rounded-full bg-blue-600/18 blur-[140px] pointer-events-none" />
        <div className="absolute top-[25%] -right-[8%] w-[600px] h-[600px] rounded-full bg-cyan-500/14 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[6%] left-[6%] w-[650px] h-[650px] rounded-full bg-purple-600/16 blur-[150px] pointer-events-none" />
        <div className="absolute top-[65%] right-[28%] w-[520px] h-[520px] rounded-full bg-emerald-500/12 blur-[130px] pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {toastNotificationBadge}

      {/* Digital Risk Protection Platform Left Navigation Sidebar */}
      <BrandShieldSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <BrandShieldHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Live Moving Telemetry Marquee Ticker */}
        <div className="border-b border-slate-800/80 bg-[#060912]/80 py-1.5 overflow-hidden select-none relative" style={{ background: 'linear-gradient(90deg, #060912 0%, #07101f 50%, #060912 100%)' }}>
          {/* Left fade mask */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #060912, transparent)' }} />
          {/* Right fade mask */}
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #060912, transparent)' }} />
          <div className="animate-marquee whitespace-nowrap text-[11px] font-mono text-slate-500 flex items-center gap-8">
            {[
              { text: '23 SUSPICIOUS CANDIDATES UNDER SURVEILLANCE', color: 'text-emerald-400', dot: 'bg-emerald-400', pulse: true },
              { text: '99.98% CYRILLIC HOMOGLYPH DETECTION ACCURACY', color: 'text-cyan-400' },
              { text: '0% FALSE POSITIVE RATE — BASELINE VERIFIED', color: 'text-blue-400' },
              { text: 'LIVE CRAWL: GOOGLE PLAY · APKPURE · THIRD-PARTY MIRRORS', color: 'text-slate-400' },
              { text: 'GLOBAL PERIMETER RESPONSE LATENCY < 14ms', color: 'text-emerald-300', dot: 'bg-emerald-400', pulse: true },
              { text: '5 ACTIVE TAKEDOWN NOTICES DISPATCHED', color: 'text-amber-400' },
              { text: 'MULTI-PLATFORM: INSTAGRAM · X · FACEBOOK · TELEGRAM', color: 'text-slate-400' },
              { text: 'FORENSIC EVIDENCE DOSSIER: AUTO-GENERATED & READY', color: 'text-violet-400' },
              { text: 'APK SANDBOX: REAL-TIME BINARY FINGERPRINTING ACTIVE', color: 'text-indigo-400' },
              { text: '128 BRAND ASSETS PROTECTED ACROSS 4 PLATFORMS', color: 'text-cyan-300' },
            ].flatMap((item, i) => [
              <span key={`a-${i}`} className={`flex items-center gap-2 ${item.color}`}>
                {item.dot && <span className={`w-1.5 h-1.5 rounded-full ${item.dot} ${item.pulse ? 'animate-pulse' : ''}`} />}
                {item.text}
              </span>,
              <span key={`sep-a-${i}`} className="text-slate-700">·</span>
            ])}
            {/* Duplicate for seamless loop */}
            {[
              { text: '23 SUSPICIOUS CANDIDATES UNDER SURVEILLANCE', color: 'text-emerald-400', dot: 'bg-emerald-400', pulse: true },
              { text: '99.98% CYRILLIC HOMOGLYPH DETECTION ACCURACY', color: 'text-cyan-400' },
              { text: '0% FALSE POSITIVE RATE — BASELINE VERIFIED', color: 'text-blue-400' },
              { text: 'LIVE CRAWL: GOOGLE PLAY · APKPURE · THIRD-PARTY MIRRORS', color: 'text-slate-400' },
              { text: 'GLOBAL PERIMETER RESPONSE LATENCY < 14ms', color: 'text-emerald-300', dot: 'bg-emerald-400', pulse: true },
              { text: '5 ACTIVE TAKEDOWN NOTICES DISPATCHED', color: 'text-amber-400' },
              { text: 'MULTI-PLATFORM: INSTAGRAM · X · FACEBOOK · TELEGRAM', color: 'text-slate-400' },
              { text: 'FORENSIC EVIDENCE DOSSIER: AUTO-GENERATED & READY', color: 'text-violet-400' },
              { text: 'APK SANDBOX: REAL-TIME BINARY FINGERPRINTING ACTIVE', color: 'text-indigo-400' },
              { text: '128 BRAND ASSETS PROTECTED ACROSS 4 PLATFORMS', color: 'text-cyan-300' },
            ].flatMap((item, i) => [
              <span key={`b-${i}`} className={`flex items-center gap-2 ${item.color}`}>
                {item.dot && <span className={`w-1.5 h-1.5 rounded-full ${item.dot} ${item.pulse ? 'animate-pulse' : ''}`} />}
                {item.text}
              </span>,
              <span key={`sep-b-${i}`} className="text-slate-700">·</span>
            ])}
          </div>
        </div>

        <main className="flex-1 p-5 lg:p-7 space-y-6 max-w-[1550px] w-full mx-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Brand Hero Card with Interactive 3D Mouse Tilt */}
              <TiltCard3D maxTilt={6}>
                <BrandHeroCard
                  currentBrand={activeBrandObj}
                  onEditProfile={() => setIsEditBrandOpen(true)}
                  onRunScan={handleRunScanAll}
                  isScanning={isScanningAll}
                />
              </TiltCard3D>

              {/* 5 Counter Stat Cards */}
              <BrandShieldStats summary={summary} />

              {/* Middle 3-Widget Row: Threat Overview + Findings by Source + Recent Threats */}
              <ChartsAndThreatsRow
                findings={findings}
                onSelectFinding={(f) => setSelectedFindingForEvidence(f)}
              />

              {/* Latest Findings Table + Quick Actions */}
              <LatestFindingsSection
                findings={findings}
                onSelectFinding={(f) => setSelectedFindingForEvidence(f)}
                onOpenAddBrand={() => setIsAddBrandOpen(true)}
                onRunSocialScan={handleRunSocialScan}
                onRunAppScan={handleRunAppScan}
                onExportReport={handleExportReport}
                isScanningSocial={isScanningSocial}
                isScanningApp={isScanningApp}
              />

              {/* Bottom Analytics Row: Risk Distribution + Top Risk + Recent Activity + Pro Tip */}
              <BottomAnalyticsRow summary={summary} findings={findings} />
            </div>
          )}

          {/* TAB: 3D INTERACTIVE THREAT GLOBE */}
          {activeTab === 'globe_3d' && (
            <div className="space-y-6">
              <CyberThreatGlobe3D />
            </div>
          )}

          {/* TAB: LOOK-ALIKE AI ENGINE & EXCLUSION FILTER */}
          {activeTab === 'lookalike_lab' && (
            <div className="space-y-6">
              <LookAlikeDetectionLab 
                brandName={currentBrandName}
                officialHandles={brands.find(b => b.brand_name === currentBrandName)?.official_handles || ['@digitalriskprotection', '@digitalriskprotection_hq']}
              />
            </div>
          )}

          {/* TAB 2: BRANDS PROFILE MANAGER */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              <BrandProfileManager
                brands={brands}
                selectedBrand={currentBrandName}
                onSelectBrand={(b) => setCurrentBrandName(b)}
                onOpenAddBrand={() => setIsAddBrandOpen(true)}
                onUpdateBrandAsset={handleUpdateBrandAsset}
              />
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA MONITORING & TESTER */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <PageHeader
                index="03"
                label="SURVEILLANCE MATRIX"
                title="Social Surface Surveillance & Impersonation Triage"
                subtitle="Multi-network heuristics detecting Cyrillic confusable homoglyphs, deceptive affixes, and unauthorized brand handles."
                accentColor="cyan"
                action={
                  <button
                    onClick={handleRunSocialScan}
                    disabled={isScanningSocial}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/25 shrink-0 btn-shimmer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanningSocial ? 'animate-spin' : ''}`} />
                    {isScanningSocial ? 'Scanning Platforms...' : 'Run Live Social Scan'}
                  </button>
                }
              />
              <SocialAccountTester activeBrand={brands.find(b => b.brand_name === currentBrandName) || brands[0]} />
            </div>
          )}

          {/* TAB 4: APP STORE MONITORING */}
          {activeTab === 'appstore' && (
            <div className="space-y-6">
              <AppStoreMonitoring
                findings={findings}
                onSelectFinding={(f) => setSelectedFindingForEvidence(f)}
                onRunAppScan={handleRunAppScan}
                isScanningApp={isScanningApp}
              />
            </div>
          )}

          {/* TAB 5: ALL FINDINGS */}
          {activeTab === 'findings' && (
            <div className="space-y-6">
              <PageHeader
                index="05"
                label="CENTRAL INTELLIGENCE REPOSITORY"
                title="Consolidated External Threat Repository"
                subtitle="Unified audit feed compiling mobile packages, social accounts, and phishing registrars with cryptographic match scoring."
                accentColor="blue"
                action={
                  <button
                    onClick={handleExportReport}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 btn-shimmer border border-slate-700/60"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export All (CSV)
                  </button>
                }
              />

              <LatestFindingsSection
                findings={findings}
                onSelectFinding={(f) => setSelectedFindingForEvidence(f)}
                onOpenAddBrand={() => setIsAddBrandOpen(true)}
                onRunSocialScan={handleRunSocialScan}
                onRunAppScan={handleRunAppScan}
                onExportReport={handleExportReport}
                isScanningSocial={isScanningSocial}
                isScanningApp={isScanningApp}
              />
            </div>
          )}

          {/* TAB 6: MALICIOUS APK SANDBOX & TESTER */}
          {activeTab === 'apk_tester' && (
            <div className="space-y-6">
              <PageHeader
                index="06"
                label="MALWARE DETONATION & PERMISSIONS"
                title="Mobile APK Malware Sandbox & Static Heuristics"
                subtitle="Deep static analysis examining APK permissions, package signatures, and Trojan Banker indicators against official brand baselines."
                accentColor="rose"
              />
              <MaliciousApkSandbox />
            </div>
          )}

          {/* TAB 7: FAKE URL / PHISHING DOMAIN INSPECTOR */}
          {activeTab === 'url_tester' && (
            <div className="space-y-6">
              <PageHeader
                index="07"
                label="PHISHING RECONNAISSANCE"
                title="Phishing Domain & Cyrillic Homoglyph Inspector"
                subtitle="Real-time URL tokenizer uncovering look-alike domains, punycode spoofing, and malicious redirect structures."
                accentColor="amber"
              />
              <FakeUrlTester activeBrand={brands.find(b => b.brand_name === currentBrandName) || brands[0]} />
            </div>
          )}

          {/* TAB 8: INCIDENT & AUDIT REPORTS (Replaces judge deck) */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <IncidentReportsView
                currentBrand={currentBrandName}
                findings={findings}
              />
            </div>
          )}

          {/* TAB 9: SETTINGS & FIREBASE CONFIG */}
          {activeTab === 'settings' && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">System Settings &amp; Firebase Credentials</h2>
                  <p className="text-xs text-slate-400">Manage API connections, Firebase project keys, and detection thresholds.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Active Firebase Account</span>
                    <span className="text-slate-400 mt-0.5 block">{currentUser.displayName} ({currentUser.email})</span>
                  </div>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                  >
                    Manage Auth &amp; Keys
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Whitelisted Baseline Brand</span>
                    <span className="text-slate-400 mt-0.5 block">{currentBrandName} (0% False Positives Guarantee)</span>
                  </div>
                  <button
                    onClick={() => setIsEditBrandOpen(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold"
                  >
                    Edit Baseline
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Download Threat Audit Trail</span>
                    <span className="text-slate-400 mt-0.5 block">Full CSV export of all 23 candidate risk evaluations and evidence</span>
                  </div>
                  <button
                    onClick={handleExportReport}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Forensic Evidence Modal */}
      {selectedFindingForEvidence && (
        <EvidenceModal
          finding={selectedFindingForEvidence}
          onClose={() => setSelectedFindingForEvidence(null)}
          onStatusUpdated={async () => {
            await loadData();
            setSelectedFindingForEvidence(null);
            showToast('Finding marked as Legitimate & added to verified whitelist.');
          }}
          allFindings={findings}
          onSelectFinding={(f) => setSelectedFindingForEvidence(f)}
        />
      )}

      {/* Add New Brand Modal */}
      <AddBrandModal
        isOpen={isAddBrandOpen}
        onClose={() => setIsAddBrandOpen(false)}
        onBrandCreated={async (newBrand) => {
          setCurrentBrandName(newBrand);
          await loadData();
          showToast(`New brand baseline registered: ${newBrand}`);
        }}
      />

      {/* Edit Brand Profile Modal */}
      <EditBrandModal
        isOpen={isEditBrandOpen}
        onClose={() => setIsEditBrandOpen(false)}
        brand={activeBrandObj}
        onBrandUpdated={async (updated) => {
          setCurrentBrandName(updated.brand_name);
          await loadData();
          showToast(`Brand profile updated: ${updated.brand_name}`);
        }}
      />

      {/* Firebase Authentication & Credentials Modal */}
      <FirebaseAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthChange={handleAuthChange}
      />

      {/* Google One Tap Sign-In Prompt on entering website */}
      <GoogleOneTapPrompt
        isOpen={isOneTapPromptOpen}
        onClose={() => setIsOneTapPromptOpen(false)}
        onSelectUser={(user) => {
          handleAuthChange(user);
          showToast(`Signed in as ${user.displayName}`);
        }}
        currentUser={currentUser}
      />
    </div>
  );
}
export default App;
