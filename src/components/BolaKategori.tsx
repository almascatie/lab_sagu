// ============================================================
// src/components/BolaKategori.tsx
// Bola kategori — tombol untuk memilih kategori bahan
// ============================================================

import { motion } from 'motion/react'
import { paletKategori } from './BolaBahan'
import { putarClick } from '../lib/sound'

interface Props {
  kategori: string
  label: string
  ikon: string
  aktif: boolean
  jumlahTerpilih: number
  onClick: () => void
}

export function BolaKategori({
  kategori,
  label,
  ikon,
  aktif,
  jumlahTerpilih,
  onClick,
}: Props) {
  const [terang, dasar, gelap] = paletKategori(kategori)
  const px = 56

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        onClick={() => {
          putarClick()
          onClick()
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scaleX: 1.12, scaleY: 0.85 }}
        transition={{ type: 'spring', stiffness: 520, damping: 9 }}
        className="relative cursor-pointer select-none touch-none"
        style={{
          width: px,
          height: px,
          borderRadius: '50%',
          background: aktif
            ? `radial-gradient(circle at 32% 26%, ${terang} 0%, ${dasar} 52%, ${gelap} 100%)`
            : 'rgba(255, 255, 255, 0.7)',
          boxShadow: aktif
            ? [
                'inset -4px -6px 9px rgba(0,0,0,0.14)',
                'inset 3px 4px 7px rgba(255,255,255,0.65)',
                '0 6px 8px -5px rgba(40,50,70,0.35)',
                `0 0 0 2px #ffffff, 0 0 0 4px ${gelap}`,
              ].join(', ')
            : [
                'inset -3px -4px 7px rgba(0,0,0,0.08)',
                'inset 2px 3px 6px rgba(255,255,255,0.7)',
                '0 3px 5px -3px rgba(40,50,70,0.25)',
              ].join(', '),
        }}
        title={label}
      >
        {/* Kilau */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 5,
            left: 9,
            width: 18,
            height: 9,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            filter: 'blur(2px)',
            transform: 'rotate(-28deg)',
          }}
        />

        {/* Ikon */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: 24, lineHeight: 1 }}
        >
          {ikon}
        </span>

        {/* Badge jumlah terpilih */}
        {jumlahTerpilih > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              minWidth: 18,
              height: 18,
              padding: '0 4px',
              borderRadius: 9,
              background: gelap,
              color: '#fff',
              fontSize: 10,
              fontWeight: 800,
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
            }}
          >
            {jumlahTerpilih}
          </span>
        )}
      </motion.button>

      {/* Label di bawah bola */}
      <span
        className="text-[9px] font-bold uppercase tracking-wider"
        style={{ color: aktif ? '#3a3f4a' : '#98876e' }}
      >
        {label}
      </span>
    </div>
  )
}