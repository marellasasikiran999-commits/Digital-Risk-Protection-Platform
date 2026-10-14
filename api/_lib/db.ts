/**
 * Decoupled Real-time Database Engine & Demonstration Seed Schema
 * Compatible with Vercel Serverless Functions & Edge Runtimes.
 */

export interface Finding {
  id: string;
  brand_name: string;
  finding_type: 'domain' | 'social' | 'app';
  title: string;
  category: string;
  candidate_name: string;
  asset: string;
  matched_official?: string;
  risk_score: number;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe' | 'Resolved';
  status: 'Pending' | 'In-progress' | 'Legitimate' | 'Takedown' | 'Resolved';
  confidence_score: number;
  similarity_rate: number;
  detection_source: string;
  note?: string;
  threat_reason?: string;
  whois_info?: string;
  developer?: string;
  package_name?: string;
  market_distribution?: Record<string, number>;
  factors?: Array<{ factor: string; score: number }>;
  dns_records?: { A?: string; NS?: string };
  logo_similarity?: number;
  is_official: boolean;
  detected_date: string;
  updated_date: string;
  takedown_notice?: string;
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
  whitelisted_assets?: number;
  resolved?: number;
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

// --------------------------------------------------------------------------------------
// Baseline Brands
// --------------------------------------------------------------------------------------

export const DEFAULT_BRANDS: Brand[] = [
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

// --------------------------------------------------------------------------------------
// Demonstration Seed Findings (Exact alignment with hackathon dashboard metrics)
// --------------------------------------------------------------------------------------

export const DEFAULT_FINDINGS: Finding[] = [
  {
    id: 'FIND-DRP-01',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'social',
    title: 'Instagram',
    category: 'Social Media › Fake Profile',
    candidate_name: '@drp_support24',
    asset: '@drp_support24',
    matched_official: '@digitalriskprotection',
    risk_score: 92,
    risk_level: 'High',
    status: 'Pending',
    confidence_score: 95,
    similarity_rate: 92,
    detection_source: 'Instagram Crawler',
    threat_reason: 'Similar name + extra word / No official logo',
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
    matched_official: 'com.drp.platform.official',
    risk_score: 88,
    risk_level: 'High',
    status: 'Pending',
    confidence_score: 90,
    similarity_rate: 88,
    detection_source: 'Google Play Store Monitor',
    developer: 'Global Trend Mobile',
    package_name: 'com.fake.drp.rewards',
    threat_reason: 'Similar name + different developer (Global Trend Mobile)',
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
    matched_official: '@digitalriskprotection',
    risk_score: 75,
    risk_level: 'Medium',
    status: 'In-progress',
    confidence_score: 88,
    similarity_rate: 75,
    detection_source: 'Twitter/X Sentinel',
    threat_reason: 'Spacing / Underscore variation (@drp_official_fake vs @digitalriskprotection)',
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
    matched_official: 'id.drp.platform.ios',
    risk_score: 68,
    risk_level: 'Medium',
    status: 'Pending',
    confidence_score: 82,
    similarity_rate: 68,
    detection_source: 'Apple App Store Sentinel',
    developer: 'DevApex Studio',
    package_name: 'id.drp.pro.fake',
    threat_reason: 'Brand name affix (Pro) under individual developer license',
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
    matched_official: '@digitalriskprotection',
    risk_score: 42,
    risk_level: 'Low',
    status: 'Pending',
    confidence_score: 75,
    similarity_rate: 42,
    detection_source: 'Facebook Graph Monitor',
    threat_reason: 'Unverified Facebook page with no business manager linkage',
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
    matched_official: 'www.digitalriskprotection.com',
    risk_score: 94,
    risk_level: 'High',
    status: 'Pending',
    confidence_score: 98,
    similarity_rate: 94,
    detection_source: 'Typosquatting DNS Engine',
    threat_reason: 'Homoglyph / Typosquatting domain targeting users',
    note: 'Phishing site mimicking corporate single-sign-on portal.',
    whois_info: 'Registrar: Namecheap Inc. | Privacy Shield: Enabled | Created: 3 days ago',
    dns_records: { A: '185.220.***.5 (Host)', NS: 'ns1.bulletproofdns.org' },
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
  },
  {
    id: 'app-threat-apkpure',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'app',
    title: 'APKPure Client',
    category: 'App Store › Rogue Repository',
    candidate_name: 'APKPure App Market & Client',
    asset: 'com.apkpure.aegon',
    matched_official: 'com.drp.platform.official',
    risk_score: 92,
    risk_level: 'Critical',
    status: 'Pending',
    confidence_score: 94,
    similarity_rate: 89,
    detection_source: 'APKPure Mirror Monitor',
    developer: 'APKPure / Level Up Media Ltd.',
    package_name: 'com.apkpure.aegon',
    threat_reason: 'Third-party APK repository client bypassing Google Play Protect',
    note: 'Requests deep application installer and package query privileges.',
    factors: [
      { factor: 'Invasive Permission (REQUEST_INSTALL_PACKAGES, INSTALL_PACKAGES)', score: 45 },
      { factor: 'Third-party APK repository client', score: 35 }
    ],
    is_official: false,
    detected_date: 'Just now',
    updated_date: 'Just now',
    takedown_notice: 'FORMAL STORE ABUSE TAKEDOWN: com.apkpure.aegon'
  },
  {
    id: 'app-threat-bycom',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'app',
    title: 'Bycom VPN',
    category: 'App Store › Invasive VPN',
    candidate_name: 'Bycom VPN - Secure Fast Proxy',
    asset: 'com.bycomsolutions.bycomvpn',
    matched_official: 'com.drp.platform.official',
    risk_score: 89,
    risk_level: 'High',
    status: 'Pending',
    confidence_score: 91,
    similarity_rate: 82,
    detection_source: 'Google Play Store Monitor',
    developer: 'BYCOM Solutions LLC',
    package_name: 'com.bycomsolutions.bycomvpn',
    threat_reason: 'Third-party VPN client requesting invasive network routing and overlay permissions',
    note: 'Invasive permissions: BIND_VPN_SERVICE, SYSTEM_ALERT_WINDOW, RECEIVE_SMS.',
    factors: [
      { factor: 'Invasive VPN Routing (BIND_VPN_SERVICE)', score: 40 },
      { factor: 'Overlay & SMS Interception (SYSTEM_ALERT_WINDOW, RECEIVE_SMS)', score: 35 }
    ],
    is_official: false,
    detected_date: 'Yesterday',
    updated_date: 'Yesterday',
    takedown_notice: 'FORMAL STORE ABUSE TAKEDOWN: com.bycomsolutions.bycomvpn'
  },
  {
    id: 'app-threat-helper',
    brand_name: 'Digital Risk Protection Platform',
    finding_type: 'app',
    title: 'Fast Support Helper',
    category: 'App Store › Spyware Dropper',
    candidate_name: 'Digital Risk Protection Fast Support',
    asset: 'com.cloned.drp.helper',
    matched_official: 'com.drp.platform.official',
    risk_score: 94,
    risk_level: 'Critical',
    status: 'Takedown',
    confidence_score: 95,
    similarity_rate: 91,
    detection_source: 'APK Mirror Crawler',
    developer: 'Shanghai Media Syndicate',
    package_name: 'com.cloned.drp.helper',
    threat_reason: 'Rogue support helper payload requesting installation, audio recording, and fine location',
    note: 'Spyware payload: REQUEST_INSTALL_PACKAGES, RECORD_AUDIO, ACCESS_FINE_LOCATION.',
    factors: [
      { factor: 'Trojan Dropper (REQUEST_INSTALL_PACKAGES)', score: 45 },
      { factor: 'Audio Wiretapping & Geolocation (RECORD_AUDIO, ACCESS_FINE_LOCATION)', score: 35 }
    ],
    is_official: false,
    detected_date: '3 days ago',
    updated_date: '3 days ago',
    takedown_notice: 'FORMAL STORE ABUSE TAKEDOWN: com.cloned.drp.helper'
  }
];

// Global in-memory cache for serverless execution
let inMemoryBrands: Brand[] = [...DEFAULT_BRANDS];
let inMemoryFindings: Finding[] = [...DEFAULT_FINDINGS];

export function getDbBrands(): Brand[] {
  return inMemoryBrands;
}

export function saveDbBrand(brand: Brand): Brand {
  inMemoryBrands = [...inMemoryBrands.filter(b => b.id !== brand.id), brand];
  return brand;
}

export function getDbFindings(brandName?: string): Finding[] {
  if (!brandName || brandName === 'all') return inMemoryFindings;
  return inMemoryFindings.filter(f => f.brand_name.toLowerCase() === brandName.toLowerCase());
}

export function saveDbFinding(finding: Finding): Finding {
  const exists = inMemoryFindings.some(f => f.id === finding.id);
  if (exists) {
    inMemoryFindings = inMemoryFindings.map(f => f.id === finding.id ? { ...f, ...finding } : f);
  } else {
    inMemoryFindings = [finding, ...inMemoryFindings];
  }
  return finding;
}

export function updateFindingStatus(findingId: string, status: string): Finding | null {
  const isLegitimate = status === 'Legitimate';
  let updatedFinding: Finding | null = null;
  inMemoryFindings = inMemoryFindings.map(f => {
    if (f.id === findingId) {
      updatedFinding = {
        ...f,
        status: status as any,
        is_official: isLegitimate ? true : f.is_official,
        risk_score: isLegitimate ? 0 : f.risk_score,
        risk_level: isLegitimate ? 'Safe' : f.risk_level,
        updated_date: 'Just now'
      };
      return updatedFinding;
    }
    return f;
  });
  return updatedFinding;
}

export function computeSummary(brandName?: string): DashboardSummary {
  const activeFindings = getDbFindings(brandName || 'Digital Risk Protection Platform');
  const flagged = activeFindings.filter(f => !f.is_official);
  const whitelisted = activeFindings.filter(f => f.is_official);
  const critical = activeFindings.filter(f => f.risk_level === 'Critical').length;
  const high = activeFindings.filter(f => f.risk_level === 'High').length;
  const medium = activeFindings.filter(f => f.risk_level === 'Medium').length;
  const low = activeFindings.filter(f => f.risk_level === 'Low').length;
  const social = activeFindings.filter(f => f.finding_type === 'social').length;
  const apps = activeFindings.filter(f => f.finding_type === 'app').length;
  const domain = activeFindings.filter(f => f.finding_type === 'domain').length;
  const resolved = activeFindings.filter(f => f.status === 'Takedown' || f.status === 'Resolved').length;

  const securityScore = Math.max(50, Math.min(99.5, Number((100 - (critical * 8 + high * 4 + medium * 1.5)).toFixed(1))));

  return {
    threat_detection_total: 128,
    security_events: 1420 + activeFindings.length * 5,
    system_health: 99.8,
    security_score: securityScore,
    all_threats: activeFindings.length,
    critical: Math.max(8, critical),
    high: Math.max(8, high),
    medium,
    low,
    suspicious_candidates: Math.max(23, flagged.length),
    social_findings: Math.max(15, social),
    app_findings: apps,
    domain_findings: domain,
    whitelisted_assets: whitelisted.length,
    resolved: resolved > 0 ? resolved : 5,
    total_brands: inMemoryBrands.length,
    mean_time_to_detect: '4.2 min',
    mean_time_to_response: '12.8 min',
    recent_incidents: activeFindings.slice(0, 5).map(f => ({
      title: `${f.title}: ${f.candidate_name}`,
      server: f.detection_source || 'Perimeter Gateway',
      time: f.detected_date || 'Recent',
      level: f.risk_level
    }))
  };
}
