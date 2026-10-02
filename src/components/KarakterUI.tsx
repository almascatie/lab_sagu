// ============================================================
// src/components/KarakterUI.tsx
// Dipakai PanelProfesor & PanelAsisten:
//  - PlakNama     : plakat nama bergaya jelly (ikon + nama + peran)
//  - UcapanStatus : ucapan status dalam bubble, pop saat status berganti
// ============================================================

import { AnimatePresence, motion } from 'motion/react'
import { BubbleSpeech } from './BubbleSpeech'

export type StatusKarakter = 'menunggu' | 'loading' | 'sukses' | 'error'

// ------------------------------------------------------------
// Plakat nama
// ------------------------------------------------------------
type Palet = [string, string, string]

interface PropsPlak {
  nama: string
  peran: string
  ikon: string
  palet: Palet
  /** warna teks (gelap, kontras dengan palet) */
  warnaTeks: string
  delay?: number
}

export function PlakNama({
  nama,
  peran,
  ikon,
  palet,
  warnaTeks,
  delay = 0.2,
}: PropsPlak) {
  const [terang, dasar, gelap] = palet

  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0, y: 14 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 11, delay }}
      whileHover={{
        scaleX: 1.06,
        scaleY: 0.96,
        transition: { type: 'spring', stiffness: 500, damping: 9 },
      }}
      whileTap={{
        scaleX: 1.1,
        scaleY: 0.88,
        transition: { type: 'spring', stiffness: 600, damping: 8 },
      }}
      className="relative inline-flex items-center gap-2.5 select-none"
      style={{
        padding: '7px 18px 7px 8px',
        borderRadius: 22,
        background: `radial-gradient(circle at 25% 15%, ${terang} 0%, ${dasar} 60%, ${gelap} 100%)`,
        boxShadow: [
          'inset -3px -5px 9px rgba(0,0,0,0.12)',
          'inset 3px 4px 8px rgba(255,255,255,0.75)',
          '0 10px 14px -8px rgba(40,50,70,0.45)',
        ].join(', '),
        color: warnaTeks,
      }}
    >
      {/* Kilau */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 4,
          left: 46,
          width: 36,
          height: 9,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
          filter: 'blur(2px)',
          transform: 'rotate(-6deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Lencana ikon */}
      <span
        aria-hidden
        className="grid place-items-center shrink-0"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          fontSize: 18,
          lineHeight: 1,
          background:
            'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.55))',
          boxShadow:
            'inset -2px -3px 5px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.12)',
        }}
      >
        {ikon}
      </span>

      <span className="flex flex-col leading-tight text-left">
        <span className="text-[15px] font-extrabold tracking-tight">{nama}</span>
        <span className="text-[11px] font-medium opacity-75">{peran}</span>
      </span>
    </motion.div>
  )
}

// ------------------------------------------------------------
// Ucapan status (bubble)
// ------------------------------------------------------------
interface PropsUcapan {
  status: StatusKarakter
  teks: Record<StatusKarakter, string>
  /** arah ekor bubble (menuju karakter di bawahnya) */
  ekor?: 'kiri' | 'kanan'
}

const GAYA: Record<
  StatusKarakter,
  { warna: 'netral' | 'violet' | 'hijau'; teks: string }
> = {
  menunggu: { warna: 'netral', teks: 'text-[#6b5a44]' },
  loading: { warna: 'violet', teks: 'text-violet-900' },
  sukses: { warna: 'hijau', teks: 'text-emerald-900 font-semibold' },
  error: { warna: 'netral', teks: 'text-red-700' },
}

export function UcapanStatus({ status, teks, ekor = 'kiri' }: PropsUcapan) {
  const gaya = GAYA[status]

  return (
    // tinggi dicadangkan supaya karakter tidak naik-turun saat bubble berganti
    <div className="flex items-end justify-center min-h-[72px] w-full px-2">
      <AnimatePresence mode="wait">
        <div key={status}>
          <BubbleSpeech
            warna={gaya.warna}
            bentuk={status === 'sukses' ? 1 : status === 'loading' ? 3 : 0}
            ekor={ekor}
            padat
          >
            <div className="flex items-center gap-2">
              {status === 'loading' && (
                <div className="flex gap-1 shrink-0" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="block w-1.5 h-1.5 rounded-full bg-violet-600"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.18,
                      }}
                    />
                  ))}
                </div>
              )}
              <p className={`text-[13px] leading-snug ${gaya.teks}`}>
                {teks[status]}
              </p>
            </div>
          </BubbleSpeech>
        </div>
      </AnimatePresence>
    </div>
  )
}
