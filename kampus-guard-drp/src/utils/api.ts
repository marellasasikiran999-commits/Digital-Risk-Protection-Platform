/**
 * API Client connecting React Frontend to FastAPI + SQLite Backend.
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

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

// 1. Fetch Brands
export async function getBrandsAPI(): Promise<Brand[]> {
  const res = await fetch(`${API_BASE_URL}/api/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
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
  const res = await fetch(`${API_BASE_URL}/api/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brand)
  });
  if (!res.ok) throw new Error('Failed to save brand');
  return res.json();
}

// 3. Fetch Findings (with Filters & Search)
export async function getFindingsAPI(params: {
  brand?: string;
  finding_type?: string;
  risk_level?: string;
  status?: string;
  search?: string;
}): Promise<Finding[]> {
  const query = new URLSearchParams();
  if (params.brand && params.brand !== 'all') query.set('brand', params.brand);
  if (params.finding_type && params.finding_type !== 'all') query.set('finding_type', params.finding_type);
  if (params.risk_level && params.risk_level !== 'all') query.set('risk_level', params.risk_level);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.search && params.search.trim()) query.set('search', params.search.trim());

  const res = await fetch(`${API_BASE_URL}/api/findings?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch findings');
  return res.json();
}

// 4. Update Status (Mark as Legitimate, Takedown, In-progress)
export async function updateFindingStatusAPI(id: string, status: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/findings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

// 5. Run Social Scan
export async function runSocialScanAPI(brand_name: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/scans/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand_name })
  });
  if (!res.ok) throw new Error('Social scan failed');
  return res.json();
}

// 6. Run App Store Scan
export async function runAppScanAPI(brand_name: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/scans/apps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand_name })
  });
  if (!res.ok) throw new Error('App scan failed');
  return res.json();
}

// 7. Get Dashboard Summary (Live Metrics)
export async function getDashboardSummaryAPI(brand?: string): Promise<DashboardSummary> {
  const query = brand && brand !== 'all' ? `?brand=${encodeURIComponent(brand)}` : '';
  const res = await fetch(`${API_BASE_URL}/api/dashboard/summary${query}`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

// 8. Export CSV URL
export function getExportCSVUrl(brand?: string): string {
  const query = brand && brand !== 'all' ? `?brand=${encodeURIComponent(brand)}` : '';
  return `${API_BASE_URL}/api/reports/export${query}`;
}
