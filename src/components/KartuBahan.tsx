// ============================================================
// src/components/KartuBahan.tsx
// Kartu bahan — 3 layout (rak/meja/mini), semua berbentuk bola jelly
// Pakai BolaBahan supaya konsisten dengan sidebar.
// ============================================================

import { BolaBahan } from './BolaBahan'
import type { Bahan } from '../types'

interface Props {
  bahan: Bahan
  onClick?: () => void
  variant?: 'default' | 'terpilih'
  draggable?: boolean
  layout?: 'rak' | 'meja' | 'mini'
  /**
   * Override ID untuk dnd-kit.
   * Kartu di meja racik wajib pakai ID berbeda dari sidebar
   * supaya tidak bentrok.
   */
  id?: string
  /**
   * Nomor bentuk bola (0..5). Kalau tidak diisi, diturunkan dari id bahan.
   */
  bentuk?: number
}

// Bentuk bola dari hash id — biar tiap bahan punya bentuk khas
function bentukDariId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h % 6
}

export function KartuBahan({
  bahan,
  onClick,
  variant = 'default',
  draggable = true,
  layout = 'rak',
  id,
  bentuk,
}: Props) {
  const terpilih = variant === 'terpilih'
  const bentukFinal = bentuk ?? bentukDariId(bahan.id)

  // Ukuran bola per layout
  const ukuran =
    layout === 'mini' ? 'mini' : layout === 'meja' ? 'besar' : 'kecil'

  // ID unik untuk dnd-kit (di meja harus beda dari sidebar)
  const idDnd = id ?? `bahan-${bahan.id}`

  return (
    <BolaBahan
      id={idDnd}
      bahanId={bahan.id}
      nama={bahan.nama}
      ikon={bahan.ikon}
      kategori={bahan.kategori}
      bentuk={bentukFinal}
      ukuran={ukuran}
      terpilih={terpilih}
      draggable={draggable}
      onClick={onClick}
    />
  )
}