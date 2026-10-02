// ============================================================
// src/main.tsx
// Entry point — bersihkan cache lama saat startup
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { bersihkanCacheVersiLama } from './lib/aiCache'

// Bersihkan cache format lama (sekali per load)
bersihkanCacheVersiLama()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)