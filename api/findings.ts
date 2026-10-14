import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbFindings, saveDbFinding, updateFindingStatus, Finding } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/findings
  if (req.method === 'GET') {
    const { brand, finding_type, risk_level, status, search } = req.query;
    let items = getDbFindings(brand as string);

    if (finding_type && finding_type !== 'all') {
      items = items.filter(f => f.finding_type === finding_type);
    }
    if (risk_level && risk_level !== 'all') {
      items = items.filter(f => f.risk_level.toLowerCase() === (risk_level as string).toLowerCase());
    }
    if (status && status !== 'all') {
      items = items.filter(f => f.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      items = items.filter(f =>
        f.candidate_name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.asset.toLowerCase().includes(q)
      );
    }

    return res.status(200).json(items);
  }

  // POST /api/findings
  if (req.method === 'POST') {
    const body = req.body || {};
    const newFinding: Finding = {
      id: body.id || `MANUAL-${Date.now()}`,
      brand_name: body.brand_name || 'Digital Risk Protection Platform',
      finding_type: body.finding_type || 'social',
      title: body.title || 'Manual Inspection',
      category: body.category || 'Manual Review',
      candidate_name: body.candidate_name || body.id,
      asset: body.asset || body.candidate_name || '',
      risk_score: Number(body.risk_score || 0),
      risk_level: body.risk_level || 'Medium',
      status: body.status || 'Pending',
      confidence_score: Number(body.confidence_score || 85),
      similarity_rate: Number(body.similarity_rate || 80),
      detection_source: body.detection_source || 'Manual Analyst Triage',
      note: body.note || '',
      factors: Array.isArray(body.factors) ? body.factors : [],
      is_official: Boolean(body.is_official),
      detected_date: 'Just now',
      updated_date: 'Just now',
      takedown_notice: body.takedown_notice || ''
    };

    saveDbFinding(newFinding);
    return res.status(201).json({ status: 'created', finding: newFinding });
  }

  // PATCH /api/findings (Status mutation)
  if (req.method === 'PATCH') {
    const { id, status } = req.body || {};
    if (!id || !status) {
      return res.status(400).json({ error: 'id and status are required' });
    }

    const updated = updateFindingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Finding not found' });
    }

    return res.status(200).json({ status: 'updated', id, new_status: status });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
