import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbBrands, saveDbBrand, Brand } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(getDbBrands());
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const brandName = (body.brand_name || '').trim();
    if (!brandName) {
      return res.status(400).json({ error: 'brand_name is required' });
    }

    const newBrand: Brand = {
      id: Date.now(),
      brand_name: brandName,
      official_website: body.official_website || '',
      official_logo_url: body.official_logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      official_developer: body.official_developer || brandName,
      official_handles: Array.isArray(body.official_handles) ? body.official_handles : [],
      official_apps: Array.isArray(body.official_apps) ? body.official_apps : [],
      created_at: new Date().toISOString()
    };

    saveDbBrand(newBrand);
    return res.status(201).json({ status: 'created', brand_name: brandName, brand: newBrand });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
