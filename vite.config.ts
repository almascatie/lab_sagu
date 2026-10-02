// ============================================================
// vite.config.ts
// Vite + Tailwind + middleware /api/tanya-ai (dev only)
// ============================================================

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.DEEPSEEK_API_KEY =
    process.env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY

  return {
    plugins: [
      react(),
      tailwindcss(),

      {
        name: 'api-tanya-ai',
        configureServer(server) {
          server.middlewares.use(
            '/api/tanya-ai',
            async (req: IncomingMessage, res: ServerResponse) => {
              if (req.method !== 'POST') {
                res.statusCode = 405
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Method not allowed' }))
                return
              }

              let raw = ''
              req.on('data', (chunk) => (raw += chunk))
              req.on('end', async () => {
                try {
                  const body = JSON.parse(raw || '{}')
                  const { tanyaAI } = await import('./src/server/tanyaAI')
                  const hasil = await tanyaAI(body)

                  res.statusCode = hasil.status
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(hasil.body))
                } catch (err) {
                  console.error('[api/tanya-ai] error:', err)
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'Body request tidak valid.' }))
                }
              })
            }
          )
        },
      },
    ],
  }
})