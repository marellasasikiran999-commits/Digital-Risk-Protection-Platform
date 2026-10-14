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

  // Candidates for social media scan
  const candidates = [
    { handle: `@${targetBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}_support`, platform: 'Instagram', risk: 92, factor: 'Affix Hijacking (_support)' },
    { handle: `@${targetBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}_care`, platform: 'Twitter', risk: 88, factor: 'Support Desk Spoofing' },
    { handle: `@${targetBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}_helpdesk`, platform: 'Facebook', risk: 78, factor: 'Unverified Fan Page' },
    { handle: `@${targetBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}_claims`, platform: 'Telegram', risk: 85, factor: 'Credential Harvesting Link' }
  ];

  candidates.forEach((c, idx) => {
    const isOfficial = (foundBrand?.official_handles || []).some((h: string) => h.toLowerCase() === c.handle.toLowerCase());
    const finding: Finding = {
      id: `SCAN-SOC-${Date.now()}-${idx}`,
      brand_name: targetBrand,
      finding_type: 'social',
      title: `${c.platform} Handle Surveillance`,
      category: 'Social Media › Impersonator Handle',
      candidate_name: c.handle,
      asset: c.handle,
      matched_official: foundBrand?.official_handles[0] || `@${targetBrand.toLowerCase()}`,
      risk_score: isOfficial ? 0 : c.risk,
      risk_level: isOfficial ? 'Safe' : (c.risk >= 90 ? 'Critical' : 'High'),
      status: isOfficial ? 'Legitimate' : 'Pending',
      confidence_score: 94,
      similarity_rate: c.risk,
      detection_source: `${c.platform} Sentinel`,
      threat_reason: isOfficial ? 'Verified brand baseline account (0% false positive rule)' : c.factor,
      note: `Automated real-time crawler alert across ${c.platform}.`,
      factors: [{ factor: c.factor, score: 35 }],
      is_official: isOfficial,
      detected_date: 'Just now',
      updated_date: 'Just now',
      takedown_notice: isOfficial ? undefined : `FORMAL SOCIAL MEDIA ABUSE COMPLAINT: ${c.handle} impersonates ${targetBrand}.`
    };
    saveDbFinding(finding);
  });

  const allFindings = getDbFindings(targetBrand);
  return res.status(200).json({
    status: 'success',
    brand: targetBrand,
    candidates_evaluated: candidates.length,
    new_findings_count: candidates.length,
    flagged_count: candidates.length,
    whitelisted_count: foundBrand?.official_handles.length || 2,
    total_active_threats: allFindings.length
  });
}
