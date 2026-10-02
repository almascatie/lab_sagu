// ============================================================
// src/components/BolaBahan.tsx
// Satu bahan = satu "jelly" 3D minimalis (ikon + nama).
// Ukuran: mini / kecil / besar
// ============================================================

import { useDraggable } from '@dnd-kit/react'
import { motion } from 'motion/react'
import { putarTick } from '../lib/sound'

// Palet pastel: [terang, dasar, gelap]
export const PALET: [string, string, string][] = [
  ['#fffdf5', '#f6dfa6', '#d9b45f'],
  ['#f4fff0', '#bfe3a4', '#7fb869'],
  ['#fff5ef', '#f5c3a3', '#d98d66'],
  ['#f3f8ff', '#b9d3f2', '#7ea6d6'],
  ['#fff4fa', '#f1c0d9', '#cf86ae'],
  ['#f8f4ff', '#d3c5f0', '#9f8bd1'],
]

const PALET_KATEGORI: Record<string, number> = {
  dasar: 0,
  aditif: 3,
  filler: 5,
  perekat: 2,
  pangan: 0,
  biomassa: 1,
  tradisional: 4,
}

export function paletKategori(kategori: string) {
  return PALET[PALET_KATEGORI[kategori] ?? 0]
}

export const BENTUK = [
  '50% 50% 50% 50% / 50% 50% 50% 50%',
  '58% 42% 55% 45% / 50% 58% 42% 50%',
  '50% 50% 46% 46% / 62% 62% 38% 38%',
  '32% 32% 32% 32% / 32% 32% 32% 32%',
  '40% 60% 60% 40% / 60% 40% 60% 40%',
  '44% 56% 40% 60% / 56% 44% 60% 40%',
]

const UKURAN = {
  mini: { px: 54, ikon: 18, font: 8, pad: 4, baris: 2 },
  kecil: { px: 74, ikon: 21, font: 8.5, pad: 5, baris: 3 },
  besar: { px: 100, ikon: 28, font: 10.5, pad: 8, baris: 2 },
}

function indeksWarna(teks: string) {
  let h = 0
  for (let i = 0; i < teks.length; i++) h = (h * 31 + teks.charCodeAt(i)) >>> 0
  return h % PALET.length
}

function labelPendek(nama: string) {
  const m = nama.match(/\(([^)]+)\)/)
  if (m) return m[1]
  return nama.split('/')[0].trim()
}

type Props = {
  /** ID untuk dnd-kit (harus unik) */
  id: string
  /** ID bahan asli (untuk data) */
  bahanId?: string
  nama: string
  ikon?: string
  kategori?: string
  bentuk?: number
  warna?: number
  ukuran?: 'mini' | 'kecil' | 'besar'
  terpilih?: boolean
  draggable?: boolean
  onClick?: () => void
  onSorot?: (nama: string | null) => void
}

export function BolaBahan({
  id,
  bahanId,
  nama,
  ikon,
  kategori,
  bentuk = 0,
  warna,
  ukuran = 'besar',
  terpilih = false,
  draggable = true,
  onClick,
  onSorot,
}: Props) {
  const { ref, isDragging } = useDraggable({
    id,
    disabled: !draggable,
    data: { bahanId: bahanId ?? id },
  })

  const u = UKURAN[ukuran]
  const f = u.px / 100

  const [terang, dasar, gelap] =
    warna !== undefined
      ? PALET[warna % PALET.length]
      : kategori && kategori !== 'dasar'
        ? paletKategori(kategori)
        : PALET[indeksWarna(bahanId ?? id)]

  const awal = BENTUK[bentuk % BENTUK.length]
  const alt = BENTUK[(bentuk + 2) % BENTUK.length]

  return (
    <div
      ref={ref} 
onClick={() => {
        if (onClick) {
          putarTick()
          onClick()
        }
      }}      onPointerEnter={() => onSorot?.(nama)}
      onPointerLeave={() => onSorot?.(null)}
      title={nama}
      className={
        draggable
          ? 'cursor-grab active:cursor-grabbing select-none touch-none'
          : 'cursor-pointer select-none touch-none'
      }
      style={{ width: u.px, height: u.px, zIndex: isDragging ? 50 : 1 }}
    >
      <motion.div
        initial={{ borderRadius: awal }}
        whileHover={{ scaleX: 1.07, scaleY: 1.07, borderRadius: alt }}
        whileTap={{ scaleX: 1.16, scaleY: 0.82 }}
        animate={
          isDragging
            ? {
                scaleX: [1.06, 0.93, 1.08, 0.96, 1.06],
                scaleY: [0.94, 1.08, 0.93, 1.05, 0.94],
                borderRadius: [awal, alt, awal, alt, awal],
              }
            : { scaleX: 1, scaleY: 1, borderRadius: awal }
        }
        transition={
          isDragging
            ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 520, damping: 8, mass: 0.8 }
        }
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 32% 26%, ${terang} 0%, ${dasar} 52%, ${gelap} 100%)`,
          boxShadow: [
            `inset ${-7 * f}px ${-10 * f}px ${16 * f}px rgba(0,0,0,0.14)`,
            `inset ${5 * f}px ${7 * f}px ${12 * f}px rgba(255,255,255,0.65)`,
            isDragging
              ? `0 ${22 * f}px ${26 * f}px ${-10 * f}px rgba(40,50,70,0.35)`
              : `0 ${10 * f}px ${14 * f}px ${-7 * f}px rgba(40,50,70,0.3)`,
            terpilih
              ? `0 0 0 2px #ffffff, 0 0 0 ${4.5 * f + 1}px ${gelap}`
              : '0 0 0 0 transparent',
          ].join(', '),
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 9 * f,
            left: 17 * f,
            width: 30 * f,
            height: 15 * f,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            filter: `blur(${3 * f}px)`,
            transform: 'rotate(-28deg)',
          }}
        />

        <span
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ color: '#3a3f4a', padding: u.pad, gap: 2 }}
        >
          <span
            style={{
              fontSize: u.ikon,
              lineHeight: 1,
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))',
            }}
          >
            {ikon ?? '🌴'}
          </span>
          <span
            style={{
              fontSize: u.font,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: 0.1,
              overflowWrap: 'anywhere',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: u.baris,
              overflow: 'hidden',
            }}
          >
            {ukuran === 'besar' ? nama : labelPendek(nama)}
          </span>
        </span>

        {terpilih && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: -1,
              right: -1,
              width: 20 * Math.max(f, 0.85),
              height: 20 * Math.max(f, 0.85),
              borderRadius: '50%',
              background: gelap,
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
            }}
          >
            ✓
          </span>
        )}
      </motion.div>
    </div>
  )
}