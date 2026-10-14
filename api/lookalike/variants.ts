import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { brand = 'Digital Risk Protection Platform' } = req.query;
  const brandName = brand as string;
  const clean = brandName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  const variants = [
    {
      variant: clean.replace(/a/i, 'а'),
      technique: 'Cyrillic Homoglyph Swap',
      category: 'swaps',
      similarityScore: 98,
      riskSeverity: 'HIGH',
      activeThreatCount: 1,
      status: 'Flagged'
    },
    {
      variant: clean.replace(/e/i, 'е').replace(/o/i, 'о'),
      technique: 'Multi-Cyrillic Homoglyph',
      category: 'swaps',
      similarityScore: 96,
      riskSeverity: 'HIGH',
      activeThreatCount: 2,
      status: 'Flagged'
    },
    {
      variant: clean.replace(/o/i, '0').replace(/i/i, '1'),
      technique: 'Digit Leetspeak Substitution',
      category: 'swaps',
      similarityScore: 92,
      riskSeverity: 'HIGH',
      activeThreatCount: 1,
      status: 'Flagged'
    },
    {
      variant: `${clean}_support24`,
      technique: 'Affix Hijacking',
      category: 'added_words',
      similarityScore: 89,
      riskSeverity: 'HIGH',
      activeThreatCount: 1,
      status: 'Flagged'
    },
    {
      variant: `${clean}_rewards_wallet`,
      technique: 'Lure Keyword Affix',
      category: 'added_words',
      similarityScore: 85,
      riskSeverity: 'MEDIUM',
      activeThreatCount: 1,
      status: 'Flagged'
    },
    {
      variant: `drp_${clean}`,
      technique: 'Delimiter Mod',
      category: 'spacing',
      similarityScore: 91,
      riskSeverity: 'HIGH',
      activeThreatCount: 1,
      status: 'Flagged'
    }
  ];

  return res.status(200).json({
    brand_name: brandName,
    seed_token: clean,
    official_handle: `@${clean}`,
    variants,
    techniques: ['Cyrillic Homoglyph Swap', 'Digit Leetspeak Substitution', 'Affix Hijacking', 'Delimiter Mod']
  });
}
