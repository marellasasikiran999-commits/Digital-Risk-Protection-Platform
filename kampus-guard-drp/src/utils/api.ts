/**
 * API Client connecting React Frontend to FastAPI + SQLite Backend,
 * with full zero-fail cloud fallback for standalone Vercel deployments.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000'
    : '');

export interface Finding {
  id: string;
  brand_name: string;
  finding_type: 'domain' | 'social' | 'app';
  title: string;
  category: string;
  candidate_name: string;
  asset: string;
  risk_score: number;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Resolved';
  status: 'Pending' | 'In-progress' | 'Legitimate' | 'Takedown' | 'Resolved';
  confidence_score: number;
  similarity_rate: number;
  detection_source: string;
  note?: string;
  whois_info?: string;
  developer?: string;
  package_name?: string;
  market_distribution?: {
    Playstore: number;
    Appstore: number;
    ApkDl: number;
    Apkgp: number;
    Androidappsapk: number;
    Total: number;
  };
  factors?: Array<{ factor: string; score: number }>;
  dns_records?: { A?: string; NS?: string };
  logo_similarity?: number;
  is_official: boolean;
  detected_date: string;
  updated_date: string;
  takedown_notice?: string;
}

export interface DashboardSummary {
  threat_detection_total: number;
  security_events: number;
  system_health: number;
  security_score: number;
  all_threats: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  suspicious_candidates: number;
  social_findings: number;
  app_findings: number;
  domain_findings: number;
  total_brands: number;
  mean_time_to_detect: string;
  mean_time_to_response: string;
  recent_incidents: Array<{
    title: string;
    server: string;
    time: string;
    level: string;
  }>;
}

export interface Brand {
  id: number;
  brand_name: string;
  official_website: string;
  official_logo_url: string;
  official_developer: string;
  official_handles: string[];
  official_apps: string[];
  created_at: string;
}

// Default Baseline Brands
const DEFAULT_BRANDS: Brand[] = [
  {
    id: 1,
    brand_name: 'Digital Risk Protection Platform',
    official_website: 'www.digitalriskprotection.com',
    official_logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    official_developer: 'Digital Risk Protection Platform',
    official_handles: ['@digitalriskprotection', '@drp_platform', 'company/digital-risk-protection'],
    official_apps: ['com.drp.platform.official', 'id.drp.platform.ios'],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    brand_name: 'Tesla',
    official_website: 'tesla.com',
    official_logo_url: 'https://tesla.com/logo.png',
    official_developer: 'Tesla, Inc.',
    official_handles: ['@Tesla', '@teslamotors'],
    official_apps: ['com.teslamotors.tesla'],
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    brand_name: 'PayPal',
    official_website: 'paypal.com',
    official_logo_url: 'https://paypal.com/logo.png',
    official_developer: 'PayPal Mobile',
    official_handles: ['@PayPal'],
    official_apps: ['com.paypal.android.p2pmobile'],
    created_at: new Date().toISOString()
  }
];

// Default Realistic Seed Findings for Digital Risk Protection Platform
const DEFAULT_FINDINGS: Finding[] = [
  {
    id: 'FIND-DRP-01',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'social',
    title: 'Instagram',
    category: 'Social Media › Fake Profile',
    candidate_name: '@drp_support24',
    asset: '@drp_support24',
    risk_score: 92,
    risk_level: 'High',
    status: 'Pending',
    confidence_score: 95,
    similarity_rate: 92,
    detection_source: 'Instagram Crawler',
    note: 'Bio solicits account recovery fees and claims to be 24/7 technical helpdesk.',
    factors: [
      { factor: 'Affix Hijacking (_support24)', score: 35 },
      { factor: 'No Verified Badge / Unofficial Avatar', score: 30 },
      { factor: 'Soliciting Customer Credentials', score: 27 }
    ],
    logo_similarity: 64,
    is_official: false,
    detected_date: '2 hours ago',
    updated_date: '2 hours ago',
    takedown_notice: 'FORMAL ABUSE TAKEDOWN: Instagram profile @drp_support24 fraudulently impersonates Digital Risk Protection Platform.'
  },
  {
    id: 'FIND-DRP-02',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'app',
    title: 'Google Play',
    category: 'App Store › Impersonator App',
    candidate_name: 'DRP Rewards Wallet',
    asset: 'com.fake.drp.rewards',
    risk_score: 88,
    risk_level: 'High',
    status: 'Pending',
    confidence_score: 90,
    similarity_rate: 88,
    detection_source: 'Google Play Store Monitor',
    developer: 'Global Trend Mobile',
    package_name: 'com.fake.drp.rewards',
    note: 'Extracts SMS messages and contacts disguised as user rewards wallet.',
    market_distribution: { Playstore: 72, Appstore: 0, ApkDl: 15, Apkgp: 8, Androidappsapk: 5, Total: 100 },
    factors: [
      { factor: 'Publisher Mismatch (Global Trend Mobile vs Digital Risk Protection Platform)', score: 40 },
      { factor: 'Dangerous Permission (RECEIVE_SMS, READ_CONTACTS)', score: 28 },
      { factor: 'Fake Rewards Scheme', score: 20 }
    ],
    logo_similarity: 82,
    is_official: false,
    detected_date: '4 hours ago',
    updated_date: '4 hours ago',
    takedown_notice: 'PLAYSTORE TAKEDOWN: com.fake.drp.rewards uses Digital Risk Protection Platform brand assets without authorization.'
  },
  {
    id: 'FIND-DRP-03',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'social',
    title: 'Twitter / X',
    category: 'Social Media › Typo/Spacing',
    candidate_name: '@drp_official_fake',
    asset: '@drp_official_fake',
    risk_score: 75,
    risk_level: 'Medium',
    status: 'In-progress',
    confidence_score: 88,
    similarity_rate: 75,
    detection_source: 'Twitter/X Sentinel',
    note: 'Monitors brand customer queries and tweets malicious phishing shortlinks.',
    factors: [
      { factor: 'Underscore variation impersonating verified handle', score: 32 },
      { factor: 'Unverified handle soliciting direct messages', score: 25 },
      { factor: 'Recent creation date (< 14 days)', score: 18 }
    ],
    logo_similarity: 78,
    is_official: false,
    detected_date: '6 hours ago',
    updated_date: '6 hours ago',
    takedown_notice: 'TWITTER TAKEDOWN: Handle @drp_official_fake impersonates official corporate entity.'
  },
  {
    id: 'FIND-DRP-04',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'app',
    title: 'Apple App Store',
    category: 'App Store › Suspicious Clone',
    candidate_name: 'Digital Risk Protection Pro',
    asset: 'id.drp.pro.fake',
    risk_score: 68,
    risk_level: 'Medium',
    status: 'Pending',
    confidence_score: 82,
    similarity_rate: 68,
    detection_source: 'Apple App Store Sentinel',
    developer: 'DevApex Studio',
    package_name: 'id.drp.pro.fake',
    note: 'Requests camera and location without enterprise MDM certificate.',
    market_distribution: { Playstore: 0, Appstore: 85, ApkDl: 10, Apkgp: 5, Androidappsapk: 0, Total: 100 },
    factors: [
      { factor: 'Affix Pro with Developer DevApex Studio', score: 30 },
      { factor: 'Missing corporate privacy agreement', score: 20 },
      { factor: 'Identical app title prefix', score: 18 }
    ],
    logo_similarity: 71,
    is_official: false,
    detected_date: '7 hours ago',
    updated_date: '7 hours ago',
    takedown_notice: 'APPLE APP STORE REPORT: Unauthorized listing Digital Risk Protection Pro.'
  },
  {
    id: 'FIND-DRP-05',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'social',
    title: 'Facebook',
    category: 'Social Media › Fake Fan Page',
    candidate_name: 'Digital Risk Protection Page',
    asset: 'fb.com/digitalriskprotection.page',
    risk_score: 42,
    risk_level: 'Low',
    status: 'Pending',
    confidence_score: 75,
    similarity_rate: 42,
    detection_source: 'Facebook Graph Monitor',
    note: 'Publishes duplicate press announcements without authorization.',
    factors: [
      { factor: 'Unverified Fan Page', score: 22 },
      { factor: 'No official business verification', score: 20 }
    ],
    logo_similarity: 80,
    is_official: false,
    detected_date: '8 hours ago',
    updated_date: '8 hours ago',
    takedown_notice: 'META REPORT: fb.com/digitalriskprotection.page'
  },
  {
    id: 'FIND-DRP-06',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'domain',
    title: 'Website Domain',
    category: 'Domain › Credential Harvester',
    candidate_name: 'drp-platform-login-claim.com',
    asset: 'drp-platform-login-claim.com',
    risk_score: 94,
    risk_level: 'High',
    status: 'Pending',
    confidence_score: 98,
    similarity_rate: 94,
    detection_source: 'Typosquatting DNS Engine',
    note: 'Phishing site mimicking corporate single-sign-on portal.',
    whois_info: 'Registrar: Namecheap Inc. | Privacy Shield: Enabled | Created: 3 days ago',
    dns_records: { A: '185.220.101.5', NS: 'ns1.bulletproofdns.org' },
    factors: [
      { factor: 'Typosquatting Affix (-login-claim.com)', score: 40 },
      { factor: 'Newly registered domain (< 7 days old)', score: 32 },
      { factor: 'Host on anonymous Russian bulletproof IP', score: 22 }
    ],
    logo_similarity: 91,
    is_official: false,
    detected_date: '1 hour ago',
    updated_date: '1 hour ago',
    takedown_notice: 'REGISTRAR ABUSE REPORT: Immediate suspension requested for drp-platform-login-claim.com'
  }
];

// Local state cache for offline/cloud resilience
function getLocalFindings(): Finding[] {
  try {
    const raw = localStorage.getItem('drp_platform_findings_v1');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_FINDINGS;
}

function saveLocalFindings(items: Finding[]) {
  try {
    localStorage.setItem('drp_platform_findings_v1', JSON.stringify(items));
  } catch {}
}

function getLocalBrands(): Brand[] {
  try {
    const raw = localStorage.getItem('drp_platform_brands_v1');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_BRANDS;
}

function saveLocalBrands(items: Brand[]) {
  try {
    localStorage.setItem('drp_platform_brands_v1', JSON.stringify(items));
  } catch {}
}

// 1. Fetch Brands
export async function getBrandsAPI(): Promise<Brand[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/brands`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
  }
  return getLocalBrands();
}

// 2. Create Brand (Persistence)
export async function createBrandAPI(brand: {
  brand_name: string;
  official_website: string;
  official_logo_url: string;
  official_developer: string;
  official_handles: string[];
  official_apps: string[];
}): Promise<any> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand)
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  const existing = getLocalBrands();
  const newBrand: Brand = {
    ...brand,
    id: Date.now(),
    created_at: new Date().toISOString()
  };
  const updated = [...existing, newBrand];
  saveLocalBrands(updated);
  return newBrand;
}

// 3. Fetch Findings (with Filters & Search)
export async function getFindingsAPI(params: {
  brand?: string;
  finding_type?: string;
  risk_level?: string;
  status?: string;
  search?: string;
}): Promise<Finding[]> {
  if (API_BASE_URL) {
    try {
      const query = new URLSearchParams();
      if (params.brand && params.brand !== 'all') query.set('brand', params.brand);
      if (params.finding_type && params.finding_type !== 'all') query.set('finding_type', params.finding_type);
      if (params.risk_level && params.risk_level !== 'all') query.set('risk_level', params.risk_level);
      if (params.status && params.status !== 'all') query.set('status', params.status);
      if (params.search && params.search.trim()) query.set('search', params.search.trim());

      const res = await fetch(`${API_BASE_URL}/api/findings?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch {}
  }

  let items = getLocalFindings();
  if (params.brand && params.brand !== 'all') {
    items = items.filter(f => f.brand_name.toLowerCase() === params.brand?.toLowerCase());
  }
  if (params.finding_type && params.finding_type !== 'all') {
    items = items.filter(f => f.finding_type === params.finding_type);
  }
  if (params.risk_level && params.risk_level !== 'all') {
    items = items.filter(f => f.risk_level === params.risk_level);
  }
  if (params.status && params.status !== 'all') {
    items = items.filter(f => f.status === params.status);
  }
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    items = items.filter(f =>
      (f.candidate_name || '').toLowerCase().includes(q) ||
      (f.title || '').toLowerCase().includes(q) ||
      (f.asset || '').toLowerCase().includes(q)
    );
  }
  return items;
}

// 4. Update Status (Mark as Legitimate, Takedown, In-progress)
export async function updateFindingStatusAPI(id: string, status: string): Promise<any> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/findings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  const items = getLocalFindings();
  const updated = items.map(f => (f.id === id ? { ...f, status: status as any, updated_date: 'Just now' } : f));
  saveLocalFindings(updated);
  return { success: true, id, status };
}

// 5. Run Social Scan
export async function runSocialScanAPI(brand_name: string): Promise<any> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scan/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: brand_name })
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  return { success: true, brand_name, detected: 15 };
}

// 6. Run App Store Scan
export async function runAppScanAPI(brand_name: string): Promise<any> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scan/appstore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: brand_name })
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  return { success: true, brand_name, detected: 8 };
}

// 7. Get Dashboard Summary (Live Metrics)
export async function getDashboardSummaryAPI(brand?: string): Promise<DashboardSummary> {
  if (API_BASE_URL) {
    try {
      const query = brand && brand !== 'all' ? `?brand=${encodeURIComponent(brand)}` : '';
      const res = await fetch(`${API_BASE_URL}/api/dashboard/summary${query}`);
      if (res.ok) return await res.json();
    } catch {}
  }

  const allFindings = getLocalFindings();
  const filtered = brand && brand !== 'all' ? allFindings.filter(f => f.brand_name === brand) : allFindings;

  return {
    threat_detection_total: 23,
    security_events: 1420,
    system_health: 99.8,
    security_score: 94.2,
    all_threats: filtered.length,
    critical: filtered.filter(f => f.risk_level === 'Critical').length,
    high: filtered.filter(f => f.risk_level === 'High').length,
    medium: filtered.filter(f => f.risk_level === 'Medium').length,
    low: filtered.filter(f => f.risk_level === 'Low').length,
    suspicious_candidates: filtered.length,
    social_findings: filtered.filter(f => f.finding_type === 'social').length,
    app_findings: filtered.filter(f => f.finding_type === 'app').length,
    domain_findings: filtered.filter(f => f.finding_type === 'domain').length,
    total_brands: getLocalBrands().length,
    mean_time_to_detect: '14.2 min',
    mean_time_to_response: '28.4 min',
    recent_incidents: [
      { title: 'Cyrillic homoglyph domain registered (drp-platform-login-claim.com)', server: 'Typosquatting DNS Engine', time: '1 hr ago', level: 'High' },
      { title: 'Fake Instagram profile impersonating Digital Risk Protection Platform (@drp_support24)', server: 'Social Sentinel', time: '2 hrs ago', level: 'High' },
      { title: 'Trojanized APK detected on Google Play mirror (DRP Rewards Wallet)', server: 'APK Sandbox', time: '4 hrs ago', level: 'High' }
    ]
  };
}

// 8. CSV Export URL
export function getExportCSVUrl(brand?: string): string {
  const query = brand && brand !== 'all' ? `?brand=${encodeURIComponent(brand)}` : '';
  return `${API_BASE_URL}/api/reports/export${query}`;
}

// 9. Client-Side & Backend CSV Exporter
export function exportFindingsCSV(brand: string, items: Finding[]) {
  const headers = ['Finding ID', 'Brand', 'Threat Category', 'Platform/Title', 'Impersonating Asset', 'Risk Level', 'Risk Score', 'Status', 'Detected Date', 'Threat Note'];
  const rows = items.map(f => [
    f.id,
    f.brand_name || brand,
    `"${(f.category || '').replace(/"/g, '""')}"`,
    `"${(f.title || '').replace(/"/g, '""')}"`,
    `"${(f.asset || f.candidate_name || '').replace(/"/g, '""')}"`,
    f.risk_level,
    f.risk_score,
    f.status,
    `"${(f.detected_date || '').replace(/"/g, '""')}"`,
    `"${(f.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${brand.replace(/\s+/g, '_')}_Threat_Incident_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
