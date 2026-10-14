import type { VercelRequest, VercelResponse } from '@vercel/node';
import { computeSummary } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { brand } = req.query;
  const summary = computeSummary(brand as string);
  return res.status(200).json(summary);
}
