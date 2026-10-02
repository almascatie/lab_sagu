// ============================================================
// src/hooks/useTanyaAI.ts
// Hook untuk memanggil /api/tanya-ai + cache
// ============================================================

import { useState, useCallback } from 'react'
import { buildPayload } from '../lib/aiPrompt'
import { ambilCache, simpanCache } from '../lib/aiCache'

export interface JawabanAI {
  potensi: string
  cerita: string
  peran: { bahan: string; fungsi: string }[]
  bahan_tidak_jelas: { bahan: string; catatan: string }[]
  status: {
    tipe: 'terbukti' | 'potensi' | 'belum_ditemukan'
    catatan: string
  }
}

interface State {
  loading: boolean
  error: string | null
  jawaban: JawabanAI | null
  dariCache: boolean
}

const INITIAL: State = {
  loading: false,
  error: null,
  jawaban: null,
  dariCache: false,
}

export function useTanyaAI() {
  const [state, setState] = useState<State>(INITIAL)

  const tanya = useCallback(async (bahanIds: string[]) => {
    const cached = ambilCache(bahanIds)
    if (cached) {
      setState({
        loading: false,
        error: null,
        jawaban: cached as JawabanAI,
        dariCache: true,
      })
      return
    }

    setState({ loading: true, error: null, jawaban: null, dariCache: false })

    try {
      const payload = buildPayload(bahanIds)
      const res = await fetch('/api/tanya-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(
          (errData as { error?: string }).error || `HTTP ${res.status}`
        )
      }

      const data = (await res.json()) as { hasil: JawabanAI }
      const hasil = data.hasil

      simpanCache(bahanIds, hasil)

      setState({
        loading: false,
        error: null,
        jawaban: hasil,
        dariCache: false,
      })
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'Gagal memanggil AI.',
        jawaban: null,
        dariCache: false,
      })
    }
  }, [])

  const reset = useCallback(() => setState(INITIAL), [])

  return { ...state, tanya, reset }
}