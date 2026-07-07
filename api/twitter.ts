import type { VercelRequest, VercelResponse } from '@vercel/node';

const X_API_BASE = 'https://api.twitter.com/2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const bearerToken = req.headers.authorization?.replace('Bearer ', '');
  if (!bearerToken) return res.status(400).json({ error: 'Bearer token required in Authorization header' });

  const { endpoint, ...params } = req.query;
  if (!endpoint || typeof endpoint !== 'string') return res.status(400).json({ error: 'endpoint query param required' });

  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');

  try {
    const url = `${X_API_BASE}/${endpoint}${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from X API', details: String(err) });
  }
}
