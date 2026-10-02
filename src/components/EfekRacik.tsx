// ============================================================
// src/components/EfekRacik.tsx
// Kumpulan efek visual meja racik:
//  - JellyBesar      : bola jelly besar (hasil racikan / tanda tanya)
//  - PusaranSihir    : pusaran cahaya saat mengaduk
//  - PercikSihir     : bintang-bintang kecil yang berputar
//  - KembangApi      : letupan kembang api saat hasil ditemukan
//  - GelembungTanya  : tanda tanya melayang
//  - TombolJelly     : tombol bergaya jelly
// ============================================================

import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export type Palet = [string, string, string]

const WARNA_PERCIK = ['#ffd86b', '#b58cff', '#7de0ff', '#ff9ad5', '#9be37a']

/** Titik pusat efek (jarak dari dasar gelas, px) */
export const PUSAT_Y = 120

// ------------------------------------------------------------
// Jelly besar
// ------------------------------------------------------------
const BENTUK_BESAR = [
  '50% 50% 50% 50% / 50% 50% 50% 50%',
  '58% 42% 55% 45% / 50% 58% 42% 50%',
  '44% 56% 40% 60% / 56% 44% 60% 40%',
  '50% 50% 46% 46% / 62% 62% 38% 38%',
  '50% 50% 50% 50% / 50% 50% 50% 50%',
]

interface JellyBesarProps {
  palet: Palet
  ukuran?: number
  cahaya?: string
  delay?: number
  children: ReactNode
}

export function JellyBesar({
  palet,
  ukuran = 120,
  cahaya,
  delay = 0,
  children,
}: JellyBesarProps) {
  const [terang, dasar, gelap] = palet
  const f = ukuran / 100

  return (
    <motion.div
      style={{ position: 'relative', width: ukuran, height: ukuran }}
      initial={{ scale: 0, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 9, delay }}
    >
      {cahaya && (
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: -40 * f,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${cahaya} 0%, transparent 68%)`,
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 32% 26%, ${terang} 0%, ${dasar} 52%, ${gelap} 100%)`,
          boxShadow: [
            `inset ${-7 * f}px ${-10 * f}px ${16 * f}px rgba(0,0,0,0.14)`,
            `inset ${5 * f}px ${7 * f}px ${12 * f}px rgba(255,255,255,0.65)`,
            `0 ${12 * f}px ${16 * f}px ${-8 * f}px rgba(40,50,70,0.35)`,
          ].join(', '),
        }}
        animate={{
          scaleX: [1, 1.07, 0.95, 1.04, 1],
          scaleY: [1, 0.93, 1.06, 0.97, 1],
          borderRadius: BENTUK_BESAR,
          y: [0, -8, 0],
        }}
        transition={{
          scaleX: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          scaleY: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          borderRadius: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
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
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: '#3a3f4a',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.18))',
          }}
        >
          {children}
        </span>
      </motion.div>
    </motion.div>
  )
}

// ------------------------------------------------------------
// Pusaran sihir (saat mengaduk)
// ------------------------------------------------------------
const MASK_CINCIN =
  'radial-gradient(circle, transparent 22%, black 34%, black 52%, transparent 72%)'

export function PusaranSihir({ durasi = 2.5 }: { durasi?: number }) {
  const times = [0, 0.2, 0.8, 1]
  return (
    <div
      className="absolute left-1/2 pointer-events-none"
      style={{ bottom: PUSAT_Y, width: 0, height: 0, zIndex: 8 }}
    >
      {/* Pusaran besar */}
      <motion.div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          left: -150,
          top: -150,
          borderRadius: '50%',
          background:
            'conic-gradient(from 0deg, transparent 0%, #b58cff 12%, #7de0ff 24%, transparent 38%, #ffd86b 52%, transparent 66%, #ff9ad5 80%, transparent 100%)',
          WebkitMaskImage: MASK_CINCIN,
          maskImage: MASK_CINCIN,
          filter: 'blur(5px)',
        }}
        initial={{ rotate: 0, scale: 0.2, opacity: 0 }}
        animate={{
          rotate: 1440,
          scale: [0.2, 1, 1, 0.15],
          opacity: [0, 0.95, 0.95, 0],
        }}
        transition={{
          rotate: { duration: durasi, ease: 'easeInOut' },
          scale: { duration: durasi, times },
          opacity: { duration: durasi, times },
        }}
      />

      {/* Pusaran kecil berlawanan arah */}
      <motion.div
        style={{
          position: 'absolute',
          width: 170,
          height: 170,
          left: -85,
          top: -85,
          borderRadius: '50%',
          background:
            'conic-gradient(from 90deg, transparent 0%, #ffffff 15%, transparent 35%, #ffd86b 60%, transparent 85%)',
          WebkitMaskImage: MASK_CINCIN,
          maskImage: MASK_CINCIN,
          filter: 'blur(3px)',
        }}
        initial={{ rotate: 0, scale: 0.2, opacity: 0 }}
        animate={{
          rotate: -1800,
          scale: [0.2, 1, 1, 0.1],
          opacity: [0, 0.9, 0.9, 0],
        }}
        transition={{
          rotate: { duration: durasi, ease: 'easeInOut' },
          scale: { duration: durasi, times },
          opacity: { duration: durasi, times },
        }}
      />

      {/* Inti cahaya */}
      <motion.div
        style={{
          position: 'absolute',
          width: 90,
          height: 90,
          left: -45,
          top: -45,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(181,140,255,0.55) 45%, transparent 72%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0.6, 1.1, 1.9], opacity: [0, 0.6, 0.9, 0] }}
        transition={{ duration: durasi, times: [0, 0.4, 0.8, 1] }}
      />
    </div>
  )
}

// ------------------------------------------------------------
// Percikan bintang yang berputar
// ------------------------------------------------------------
export function PercikSihir({ durasi = 2.5 }: { durasi?: number }) {
  const jumlah = 16
  return (
    <div
      className="absolute left-1/2 pointer-events-none"
      style={{ bottom: PUSAT_Y, width: 0, height: 0, zIndex: 12 }}
    >
      {Array.from({ length: jumlah }).map((_, i) => {
        const sudut = (i / jumlah) * 360
        const r1 = 130 + (i % 4) * 14
        const r2 = 34 + (i % 3) * 16
        const warna = WARNA_PERCIK[i % WARNA_PERCIK.length]
        return (
          <motion.div
            key={i}
            style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}
            initial={{ rotate: sudut }}
            animate={{ rotate: sudut + 900 + i * 20 }}
            transition={{ duration: durasi, ease: 'easeInOut' }}
          >
            <motion.span
              style={{
                position: 'absolute',
                left: -6,
                top: -8,
                fontSize: 10 + (i % 3) * 5,
                color: warna,
                textShadow: `0 0 8px ${warna}`,
                lineHeight: 1,
              }}
              initial={{ x: r1, opacity: 0 }}
              animate={{ x: [r1, r2, r2 * 0.5, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: durasi, times: [0, 0.35, 0.8, 1] }}
            >
              ✦
            </motion.span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ------------------------------------------------------------
// Kembang api
// ------------------------------------------------------------
const LEDAKAN = [
  { x: 0, y: -125, d: 0 },
  { x: -105, y: -35, d: 0.35 },
  { x: 105, y: -65, d: 0.7 },
  { x: -35, y: -180, d: 1.0 },
  { x: 70, y: -150, d: 1.25 },
]

export function KembangApi() {
  const jumlah = 22
  return (
    <div
      className="absolute left-1/2 pointer-events-none"
      style={{ bottom: PUSAT_Y, width: 0, height: 0, zIndex: 45 }}
    >
      {LEDAKAN.map((b, bi) => (
        <div key={bi} style={{ position: 'absolute', left: b.x, top: b.y }}>
          {/* Cincin kilat */}
          <motion.span
            style={{
              position: 'absolute',
              left: -5,
              top: -5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: `2px solid ${WARNA_PERCIK[bi % WARNA_PERCIK.length]}`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 9], opacity: [0.9, 0] }}
            transition={{ duration: 0.7, delay: b.d, ease: 'easeOut' }}
          />

          {/* Percikan */}
          {Array.from({ length: jumlah }).map((_, k) => {
            const a = (k / jumlah) * Math.PI * 2
            const jarak = 55 + ((k * 37) % 5) * 10
            const warna = WARNA_PERCIK[(k + bi) % WARNA_PERCIK.length]
            const dx = Math.cos(a) * jarak
            const dy = Math.sin(a) * jarak
            const durasi = 1.3
            return (
              <motion.span
                key={k}
                style={{
                  position: 'absolute',
                  left: -3,
                  top: -3,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: warna,
                  boxShadow: `0 0 8px 2px ${warna}`,
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
                animate={{
                  x: [0, dx, dx * 1.06],
                  y: [0, dy, dy + 32],
                  opacity: [0, 1, 1, 0],
                  scale: [1, 1, 0.3],
                }}
                transition={{
                  x: { duration: durasi, delay: b.d, times: [0, 0.55, 1], ease: 'easeOut' },
                  y: { duration: durasi, delay: b.d, times: [0, 0.55, 1], ease: 'easeOut' },
                  opacity: { duration: durasi, delay: b.d, times: [0, 0.08, 0.6, 1] },
                  scale: { duration: durasi, delay: b.d, times: [0, 0.55, 1] },
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// Tanda tanya melayang
// ------------------------------------------------------------
const GELEMBUNG = [
  { x: -80, d: 0, s: 18 },
  { x: 62, d: 0.7, s: 14 },
  { x: -32, d: 1.4, s: 12 },
  { x: 88, d: 2.0, s: 20 },
  { x: -105, d: 2.6, s: 13 },
]

export function GelembungTanya() {
  return (
    <>
      {GELEMBUNG.map((g, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute pointer-events-none font-bold"
          style={{
            left: '50%',
            top: 10,
            marginLeft: g.x,
            fontSize: g.s,
            color: '#8b6dc9',
            textShadow: '0 0 8px rgba(139,109,201,0.6)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -95, opacity: [0, 1, 0], x: [0, 8, -8, 0] }}
          transition={{
            y: { duration: 2.8, delay: g.d, repeat: Infinity, ease: 'easeOut' },
            opacity: {
              duration: 2.8,
              delay: g.d,
              repeat: Infinity,
              times: [0, 0.3, 1],
            },
            x: { duration: 2.8, delay: g.d, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          ?
        </motion.span>
      ))}
    </>
  )
}

// ------------------------------------------------------------
// Tombol jelly
// ------------------------------------------------------------
const WARNA_TOMBOL: Record<'ungu' | 'hijau', Palet> = {
  ungu: ['#e4d4ff', '#9a6df0', '#6d3fd6'],
  hijau: ['#c6f5b8', '#5a8f4a', '#3d6b30'],
}

const BENTUK_TOMBOL_AWAL = '40% 60% 55% 45% / 60% 50% 50% 40%'
const BENTUK_TOMBOL_ALT = '55% 45% 40% 60% / 50% 60% 40% 50%'

interface TombolJellyProps {
  children: ReactNode
  onClick?: () => void
  warna?: 'ungu' | 'hijau'
  disabled?: boolean
}

export function TombolJelly({
  children,
  onClick,
  warna = 'ungu',
  disabled = false,
}: TombolJellyProps) {
  const [terang, dasar, gelap] = WARNA_TOMBOL[warna]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ borderRadius: BENTUK_TOMBOL_AWAL }}
      animate={{
        scaleX: [1, 1.03, 0.98, 1],
        scaleY: [1, 0.96, 1.03, 1],
        borderRadius: BENTUK_TOMBOL_AWAL,
      }}
      transition={{
        scaleX: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
        scaleY: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
        borderRadius: { type: 'spring', stiffness: 520, damping: 8 },
      }}
      whileHover={{ scale: 1.08, borderRadius: BENTUK_TOMBOL_ALT }}
      whileTap={{ scaleX: 1.16, scaleY: 0.8 }}
      className="relative inline-flex items-center gap-1.5 text-xs font-bold text-white select-none disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        padding: '10px 22px',
        background: `radial-gradient(circle at 30% 22%, ${terang} 0%, ${dasar} 55%, ${gelap} 100%)`,
        boxShadow: [
          'inset -4px -6px 10px rgba(0,0,0,0.18)',
          'inset 3px 4px 8px rgba(255,255,255,0.55)',
          '0 8px 12px -6px rgba(40,50,70,0.4)',
        ].join(', '),
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </motion.button>
  )
}
