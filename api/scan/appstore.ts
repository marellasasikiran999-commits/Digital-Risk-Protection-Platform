import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbBrands, getDbFindings, saveDbFinding, Finding } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { brand_name, brand } = req.body || {};
  const targetBrand = (brand_name || brand || 'Digital Risk Protection Platform').trim();
  const brands = getDbBrands();
  const foundBrand = brands.find(b => b.brand_name.toLowerCase() === targetBrand.toLowerCase()) || brands[0];

  const appCandidates = [
    {
      pkg: `com.cloned.${targetBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.vault`,
      title: `${targetBrand} Secure Vault`,
      publisher: 'Apex Rogue Dev Ltd',
      store: 'Google Play',
      risk: 94,
      perms: ['RECEIVE_SMS', 'SYSTEM_ALERT_WINDOW']
    },
    {
      pkg: `com.unauthorized.${targetBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.fastpay`,
      title: `${targetBrand} Quick Rewards`,
      publisher: 'Global Mobile Monetizer',
      store: 'APKPure',
      risk: 86,
      perms: ['REQUEST_INSTALL_PACKAGES', 'READ_CONTACTS']
    }
  ];

  appCandidates.forEach((app, idx) => {
    const isOfficial = (foundBrand?.official_apps || []).some((a: string) => a.toLowerCase() === app.pkg.toLowerCase());
    const finding: Finding = {
      id: `SCAN-APP-${Date.now()}-${idx}`,
      brand_name: targetBrand,
      finding_type: 'app',
      title: app.title,
      category: 'App Store › Impersonator App',
      candidate_name: app.title,
      asset: app.pkg,
      matched_official: foundBrand?.official_apps[0] || `com.${targetBrand.toLowerCase()}.official`,
      risk_score: isOfficial ? 0 : app.risk,
      risk_level: isOfficial ? 'Safe' : (app.risk >= 90 ? 'Critical' : 'High'),
      status: isOfficial ? 'Legitimate' : 'Pending',
      confidence_score: 96,
      similarity_rate: app.risk,
      detection_source: `${app.store} Sentinel`,
      developer: app.publisher,
      package_name: app.pkg,
      threat_reason: isOfficial ? 'Verified publisher baseline' : `Publisher Mismatch (${app.publisher}) + Invasive Permissions`,
      note: `Detected unverified sideload APK across third-party repositories.`,
      factors: [
        { factor: `Publisher Mismatch (${app.publisher})`, score: 40 },
        { factor: `Invasive Permissions: ${app.perms.join(', ')}`, score: 30 }
      ],
      is_official: isOfficial,
      detected_date: 'Just now',
      updated_date: 'Just now',
      takedown_notice: isOfficial ? undefined : `STORE TAKEDOWN NOTICE: Infringing package ${app.pkg} illegally uses ${targetBrand} brand identity.`
    };
    saveDbFinding(finding);
  });

  const allFindings = getDbFindings(targetBrand);
  return res.status(200).json({
    status: 'success',
    brand: targetBrand,
    candidates_evaluated: appCandidates.length,
    new_findings_count: appCandidates.length,
    flagged_count: appCandidates.length,
    whitelisted_count: foundBrand?.official_apps.length || 2,
    total_active_threats: allFindings.length
  });
}
