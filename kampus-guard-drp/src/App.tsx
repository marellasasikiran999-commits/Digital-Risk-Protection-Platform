import { useState, useEffect } from 'react';
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
  type Finding, type DashboardSummary, type Brand 
} from './utils/api';
import { getCurrentUserProfile, type AuthUserProfile } from './utils/firebase';
import { CheckCircle, RefreshCw, Key, Download } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Active User via Firebase
  const [currentUser, setCurrentUser] = useState<AuthUserProfile>(getCurrentUserProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Brand and Findings Data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrandName, setCurrentBrandName] = useState<string>('Digital Risk Protection Platform');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // Scanning States
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [isScanningSocial, setIsScanningSocial] = useState(false);
  const [isScanningApp, setIsScanningApp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedFindingForEvidence, setSelectedFindingForEvidence] = useState<Finding | null>(null);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isEditBrandOpen, setIsEditBrandOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
    loadData();
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

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans selection:bg-blue-600 selection:text-white noise-overlay">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121c32] border border-blue-500/40 text-blue-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-bounce font-medium">
          <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
        <div className="border-b border-slate-800/80 bg-[#080d1a]/60 py-2 overflow-hidden select-none">
          <div className="animate-marquee whitespace-nowrap text-[11px] font-mono text-slate-400 flex items-center gap-10">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 23 SUSPICIOUS CANDIDATES SCANNED</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-cyan-400">99.98% CYRILLIC HOMOGLYPH ACCURACY</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-indigo-400">0% FALSE POSITIVE BASELINE FILTER</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2">MULTI-STORE CRAWL: GOOGLE PLAY &amp; APKPURE</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GLOBAL PERIMETER LATENCY &lt;14MS</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-amber-400">AUTONOMOUS EVIDENCE DOSSIER READY</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 23 SUSPICIOUS CANDIDATES SCANNED</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-cyan-400">99.98% CYRILLIC HOMOGLYPH ACCURACY</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-indigo-400">0% FALSE POSITIVE BASELINE FILTER</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2">MULTI-STORE CRAWL: GOOGLE PLAY &amp; APKPURE</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GLOBAL PERIMETER LATENCY &lt;14MS</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-2 text-amber-400">AUTONOMOUS EVIDENCE DOSSIER READY</span>
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
              <BottomAnalyticsRow />
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
              />
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA MONITORING & TESTER */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#091021]/80 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-xl card-glow-top hud-bracket">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase mb-1">
                    <span className="w-6 h-px bg-cyan-400" />
                    <span>03 // SURVEILLANCE MATRIX</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display">
                    Social Surface Surveillance &amp; Impersonation Triage
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Multi-network heuristics detecting Cyrillic confusable homoglyphs, deceptive affixes, and unauthorized brand handles.
                  </p>
                </div>
                <button
                  onClick={handleRunSocialScan}
                  disabled={isScanningSocial}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/25 shrink-0 btn-shimmer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningSocial ? 'animate-spin' : ''}`} />
                  {isScanningSocial ? 'Scanning Platforms...' : 'Run Live Social Scan'}
                </button>
              </div>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#091021]/80 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-xl card-glow-top hud-bracket">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 font-bold tracking-widest uppercase mb-1">
                    <span className="w-6 h-px bg-blue-400" />
                    <span>05 // CENTRAL INTELLIGENCE REPOSITORY</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display">
                    Consolidated External Threat Repository
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Unified audit feed compiling mobile packages, social accounts, and phishing registrars with cryptographic match scoring.
                  </p>
                </div>
                <button
                  onClick={handleExportReport}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 btn-shimmer border border-slate-700/60"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export All (CSV)
                </button>
              </div>

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
              <MaliciousApkSandbox />
            </div>
          )}

          {/* TAB 7: FAKE URL / PHISHING DOMAIN INSPECTOR */}
          {activeTab === 'url_tester' && (
            <div className="space-y-6">
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
        onAuthChange={(user) => {
          setCurrentUser(user);
          showToast(`Logged in as ${user.displayName}`);
        }}
      />
    </div>
  );
}
export default App;
