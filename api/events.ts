import type { VercelRequest, VercelResponse } from '@vercel/node';
import { computeSummary } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  const summary = computeSummary('Digital Risk Protection Platform');
  res.write(`data: ${JSON.stringify({ type: 'TELEMETRY_UPDATE', summary })}\n\n`);

  res.end();
}
