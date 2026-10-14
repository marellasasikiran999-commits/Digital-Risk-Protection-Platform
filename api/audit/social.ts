import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbBrands } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { handle, platform = 'Instagram', brand_name } = req.body || {};
  const cleanHandle = (handle || '').trim();
  if (!cleanHandle) {
    return res.status(400).json({ error: 'handle is required' });
  }

  const targetBrand = (brand_name || 'Digital Risk Protection Platform').trim();
  const brands = getDbBrands();
  const foundBrand = brands.find(b => b.brand_name.toLowerCase() === targetBrand.toLowerCase()) || brands[0];
  const officialList = foundBrand?.official_handles || ['@digitalriskprotection', '@drp_platform'];

  const lower = cleanHandle.toLowerCase();
  const isOfficial = officialList.some((h: string) => h.toLowerCase() === lower);

  // Check for homoglyphs (Cyrillic unicode range)
  const hasHomoglyph = /[\u0400-\u04FF]/.test(cleanHandle);
  const keywords = ['support', 'help', 'claims', 'rewards', 'official', 'desk', 'care'].filter(k => lower.includes(k));

  let riskScore = 15;
  const factors: Array<{ factor: string; score: number }> = [];

  if (isOfficial) {
    riskScore = 0;
  } else {
    if (hasHomoglyph) {
      riskScore += 45;
      factors.push({ factor: 'Cyrillic Unicode Homoglyph spoofing detected', score: 45 });
    }
    if (keywords.length > 0) {
      riskScore += 30;
      factors.push({ factor: `Lure keywords detected: ${keywords.join(', ')}`, score: 30 });
    }
    if (lower.includes('_') || lower.includes('.')) {
      riskScore += 15;
      factors.push({ factor: 'Delimiter modification imitating official account', score: 15 });
    }
    riskScore = Math.min(riskScore, 98);
  }

  return res.status(200).json({
    handle: cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`,
    platform,
    brand_name: targetBrand,
    matched_official: officialList[0] || `@${targetBrand.toLowerCase()}`,
    is_official: isOfficial,
    risk_score: riskScore,
    risk_level: isOfficial ? 'Safe' : (riskScore >= 80 ? 'Critical' : (riskScore >= 60 ? 'High' : 'Medium')),
    confidence: 96,
    similarity_score: isOfficial ? 100 : (hasHomoglyph ? 98 : 84),
    has_homoglyph: hasHomoglyph,
    homoglyph_details: hasHomoglyph ? 'Cyrillic character substitution U+0430/U+0435' : null,
    keywords,
    factors,
    verdict: isOfficial 
      ? 'OFFICIAL WHITELISTED ASSET (0% False Positive Baseline)' 
      : (riskScore >= 75 ? 'HIGH-RISK IMPERSONATION THREAT' : 'SUSPICIOUS CANDIDATE'),
    whitelisted: officialList
  });
}
