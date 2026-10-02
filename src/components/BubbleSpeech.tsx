// ============================================================
// src/components/BubbleSpeech.tsx
// Balon bicara bergaya jelly:
//  - muncul dengan pegas (overshoot) dari titik asal
//  - mengapung + bernapas (squish halus) terus-menerus
//  - kenyal saat di-hover / ditekan
//  - ekor berupa tetesan jelly kecil, ikut bergoyang
//  - saat dihapus: "pop" (mengecil sebentar lalu membesar & hilang)
// ============================================================

import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Palet = [string, string, string]

const PALET_BUBBLE: Record<string, Palet> = {
  netral: ['#fbf9f4', '#eae2d2', '#c8bea6'], // krem lembut
  violet: ['#f0eaff', '#d3c5f0', '#9f8bd1'], // ungu AI
  hijau: ['#f4fff0', '#bfe3a4', '#7fb869'], // hijau sukses
  amber: ['#fff8e6', '#f6dfa0', '#d8b45a'], // potensi / interpretasi
}

// Kotak rounded: radius dibuat sedikit tidak sama supaya tetap terasa jelly
const BENTUK = [
  '28px 24px 30px 22px',
  '24px 30px 22px 28px',
  '30px 22px 28px 26px',
  '22px 28px 24px 30px',
]

type Tetes = {
  s: number
  left?: number | string
  right?: number | string
  top?: number | string
  bottom?: number | string
}

interface Props {
  warna?: keyof typeof PALET_BUBBLE
  bentuk?: number
  /** kiri/kanan = ekor di bawah, samping = ekor di sisi kiri (menghadap gelas) */
  ekor?: 'kiri' | 'kanan' | 'samping' | 'tidak'
  delay?: number
  /** titik asal kemunculan (px, relatif posisi akhir) — dipakai untuk efek "terpecah" */
  asalX?: number
  asalY?: number
  melayang?: boolean
  /** padding lebih kecil, untuk ucapan singkat */
  padat?: boolean
  children: ReactNode
  className?: string
}

export function BubbleSpeech({
  warna = 'netral',
  bentuk = 0,
  ekor = 'tidak',
  delay = 0,
  asalX = 0,
  asalY = 0,
  melayang = true,
  padat = false,
  children,
  className = '',
}: Props) {
  const kurangiGerak = useReducedMotion()
  const [terang, dasar, gelap] = PALET_BUBBLE[warna] ?? PALET_BUBBLE.netral
  const bentukFinal = BENTUK[bentuk % BENTUK.length]
  const durasiMengambang = 3.2 + (bentuk % 4) * 0.5

  const tetes: Tetes[] =
    ekor === 'kiri'
      ? [
          { s: 16, left: 36, bottom: -12 },
          { s: 9, left: 26, bottom: -26 },
        ]
      : ekor === 'kanan'
        ? [
            { s: 16, right: 36, bottom: -12 },
            { s: 9, right: 26, bottom: -26 },
          ]
        : ekor === 'samping'
          ? [
              { s: 16, left: -12, top: '58%' },
              { s: 9, left: -27, top: 'calc(58% + 16px)' },
            ]
          : []

  const gayaTetes = (t: Tetes): CSSProperties => ({
    position: 'absolute',
    width: t.s,
    height: t.s,
    left: t.left,
    right: t.right,
    top: t.top,
    bottom: t.bottom,
    borderRadius: '50%',
    background: `radial-gradient(circle at 35% 30%, ${terang} 0%, ${dasar} 55%, ${gelap} 100%)`,
    boxShadow: [
      'inset -2px -3px 5px rgba(0,0,0,0.12)',
      'inset 2px 2px 4px rgba(255,255,255,0.7)',
      '0 4px 6px -3px rgba(40,50,70,0.3)',
    ].join(', '),
  })

  return (
    <motion.div
      initial={
        kurangiGerak
          ? false
          : { scale: 0.25, opacity: 0, x: asalX, y: asalY + 14 }
      }
      animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
      exit={
        kurangiGerak
          ? { opacity: 0 }
          : {
              scale: [1, 0.86, 1.4],
              opacity: [1, 1, 0],
              transition: { duration: 0.3, times: [0, 0.4, 1] },
            }
      }
      transition={{ type: 'spring', stiffness: 320, damping: 11, delay }}
      className={`relative ${className}`}
      style={{
        transformOrigin: '50% 100%',
        marginBottom: ekor === 'kiri' || ekor === 'kanan' ? 28 : 0,
        marginLeft: ekor === 'samping' ? 30 : 0,
      }}
    >
      {/* Lapisan jelly: mengapung, bernapas, kenyal */}
      <motion.div
        style={{ position: 'relative', transformOrigin: '50% 70%' }}
        animate={
          kurangiGerak || !melayang
            ? undefined
            : {
                y: [0, -5, 0],
                scaleX: [1, 1.018, 0.99, 1],
                scaleY: [1, 0.985, 1.014, 1],
              }
        }
        transition={{
          duration: durasiMengambang,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.9,
        }}
        whileHover={{
          scaleX: 1.035,
          scaleY: 0.985,
          transition: { type: 'spring', stiffness: 500, damping: 9 },
        }}
        whileTap={{
          scaleX: 1.08,
          scaleY: 0.9,
          transition: { type: 'spring', stiffness: 600, damping: 8 },
        }}
      >
        {/* Balon */}
        <div
          style={{
            position: 'relative',
            background: `radial-gradient(circle at 30% 20%, ${terang} 0%, ${dasar} 60%, ${gelap} 100%)`,
            borderRadius: bentukFinal,
            boxShadow: [
              'inset -4px -6px 10px rgba(0,0,0,0.10)',
              'inset 4px 5px 9px rgba(255,255,255,0.75)',
              '0 10px 16px -8px rgba(40,50,70,0.35)',
            ].join(', '),
            padding: padat ? '10px 18px' : '18px 24px',
          }}
        >
          {/* Kilau */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 9,
              left: 22,
              width: 40,
              height: 14,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
              filter: 'blur(3px)',
              transform: 'rotate(-22deg)',
              pointerEvents: 'none',
            }}
          />
          {children}
        </div>

        {/* Ekor: tetesan jelly */}
        {tetes.map((t, i) => (
          <span key={i} aria-hidden style={gayaTetes(t)} />
        ))}
      </motion.div>
    </motion.div>
  )
}
