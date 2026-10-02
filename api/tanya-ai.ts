// ============================================================
// api/tanya-ai.ts
// Vercel Serverless Function — wrapper tipis
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { tanyaAI } from '../src/server/tanyaAI'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const hasil = await tanyaAI(req.body as Parameters<typeof tanyaAI>[0])
  res.status(hasil.status).json(hasil.body)
}