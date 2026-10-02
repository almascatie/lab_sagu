// ============================================================
// src/lib/aiPrompt.ts
// Bangun payload untuk dikirim ke /api/tanya-ai
// ============================================================

import { BAHAN } from '../data'
import saguKnowledge from '../data/sagu.json'

interface BahanSaguKnowledge {
  id: string
  nama: string
  definisi?: string
  karakter_utama?: string[]
  komponen_utama?: string[]
  potensi_pemanfaatan?: string[]
}

const KNOWLEDGE = saguKnowledge as BahanSaguKnowledge[]

// Peta dari id bahan di bahan.json → id di sagu.json
const PETA_SAGU: Record<string, string> = {
  pati: 'pati_sagu',
  ela: 'ela_sagu',
  daun: 'daun_sagu',
  kulit: 'kulit_batang_sagu',
  pelepah: 'pelepah_sagu',
}

export interface PayloadAI {
  bahan: {
    id: string
    nama: string
    definisi?: string
    karakter_utama?: string[]
    komponen_utama?: string[]
    potensi_pemanfaatan?: string[]
  }[]
}

export function buildPayload(bahanIds: string[]): PayloadAI {
  const bahan = bahanIds
    .map((id) => {
      const b = BAHAN.find((x) => x.id === id)
      if (!b) return null

      // Cek apakah bahan ini punya knowledge sagu
      const saguId = PETA_SAGU[id]
      const k = saguId ? KNOWLEDGE.find((x) => x.id === saguId) : undefined

      return {
        id: b.id,
        nama: b.nama,
        definisi: k?.definisi,
        karakter_utama: k?.karakter_utama,
        komponen_utama: k?.komponen_utama,
        potensi_pemanfaatan: k?.potensi_pemanfaatan,
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  return { bahan }
}