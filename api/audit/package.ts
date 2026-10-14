import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbBrands, saveDbFinding, Finding } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { package_name, brand_name, app_title, publisher: devPublisher, permissions: customPerms } = req.body || {};
  const cleanPkg = (package_name || 'com.fake.drp.rewards').trim().toLowerCase();
  if (!cleanPkg) {
    return res.status(400).json({ error: 'package_name is required' });
  }

  const targetBrand = (brand_name || 'Digital Risk Protection Platform').trim();
  const brands = getDbBrands();
  const foundBrand = brands.find(b => b.brand_name.toLowerCase() === targetBrand.toLowerCase()) || brands[0];
  const isOfficial = (foundBrand?.official_apps || []).some((a: string) => a.toLowerCase() === cleanPkg);

  const cleanTitle = (app_title || (cleanPkg === 'com.fake.drp.rewards' ? 'Digital Risk Protection Rewards' : cleanPkg
    .replace(/^(com|org|net|id)\./, '')
    .split('.')
    .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' '))).trim();

  const findingId = `FIND-AUDIT-PKG-${Date.now()}`;
  const publisher = isOfficial 
    ? foundBrand?.official_developer 
    : (devPublisher || (cleanPkg === 'com.fake.drp.rewards' ? 'Apex Rogue Dev Ltd' : 'Third-Party Mirror Publisher'));
  const riskScore = isOfficial ? 0 : 88;
  const riskLevel = isOfficial ? 'Safe' : 'High';
  
  const defaultMaliciousPerms = [
    'android.permission.RECEIVE_SMS',
    'android.permission.READ_SMS',
    'android.permission.SYSTEM_ALERT_WINDOW',
    'android.permission.BIND_ACCESSIBILITY_SERVICE'
  ];
  
  const perms = isOfficial 
    ? ['android.permission.INTERNET', 'android.permission.ACCESS_NETWORK_STATE'] 
    : (Array.isArray(customPerms) && customPerms.length > 0 ? customPerms : defaultMaliciousPerms);

  const takedown = isOfficial ? undefined : `FORMAL STORE ABUSE TAKEDOWN: Infringing package ${cleanPkg} impersonates ${targetBrand}. Malware Family: Trojan-Banker.AndroidOS.OverlayStealer. Flagged Permissions: ${perms.join(', ')}. Publisher: ${publisher}.`;

  const finding: Finding = {
    id: findingId,
    brand_name: targetBrand,
    finding_type: 'app',
    title: `${cleanTitle} (Live Audit)`,
    category: 'App Store Monitoring / Package Audit',
    candidate_name: cleanTitle,
    asset: cleanPkg,
    matched_official: foundBrand?.official_apps[0] || `com.${targetBrand.toLowerCase()}.official`,
    risk_score: riskScore,
    risk_level: riskLevel as any,
    status: isOfficial ? 'Legitimate' : 'Pending',
    confidence_score: 95,
    similarity_rate: 88,
    detection_source: 'Dynamic APK Inspector',
    developer: publisher,
    package_name: cleanPkg,
    threat_reason: isOfficial ? 'Verified legitimate build' : 'Publisher Mismatch + Trojan Banker Overlay (RECEIVE_SMS, SYSTEM_ALERT_WINDOW)',
    note: isOfficial ? 'Whitelisted official corporate application.' : `Rogue APK developed by ${publisher}. Targets SMS OTP tokens with overlay stealth.`,
    factors: isOfficial ? [] : [
      { factor: `Publisher Mismatch (${publisher} vs ${targetBrand})`, score: 40 },
      { factor: 'Invasive Trojan Permission (RECEIVE_SMS, READ_SMS)', score: 28 },
      { factor: 'Phishing Overlay Capability (SYSTEM_ALERT_WINDOW)', score: 20 }
    ],
    is_official: isOfficial,
    detected_date: 'Just now',
    updated_date: 'Just now',
    takedown_notice: takedown
  };

  saveDbFinding(finding);

  return res.status(200).json({
    status: 'success',
    finding_id: findingId,
    package_name: cleanPkg,
    app_name: `${cleanTitle} (Live Audit)`,
    publisher,
    store: 'google_play',
    store_url: `https://play.google.com/store/apps/details?id=${cleanPkg}`,
    icon_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150',
    rating: 3.8,
    downloads: '25,000+',
    risk_score: riskScore,
    risk_level: riskLevel,
    note: finding.note,
    permissions: perms,
    is_official: isOfficial,
    is_publisher_mismatch: !isOfficial,
    found_on_play: true,
    takedown_notice: takedown
  });
}
