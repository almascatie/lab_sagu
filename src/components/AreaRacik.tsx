// ============================================================
// src/components/AreaRacik.tsx
// + wadah (gelas) diturunkan
// ============================================================

import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useRacikStore } from '../stores/racikStore'
import { putarClick, putarSwoosh } from '../lib/sound'
import type { HasilRacik as HasilTipe } from '../types'
import { MejaRacik, type FaseRacik } from './MejaRacik'

interface Props {
  hasil: HasilTipe | null
  onCampur: () => void
  onRacikLagi: () => void
  onBukaModalFormula: () => void
  onMulaiAI: () => void
  panelAI?: ReactNode
  modeAI?: boolean
}

export function AreaRacik({
  hasil,
  onCampur,
  onRacikLagi,
  onBukaModalFormula,
  onMulaiAI,
  panelAI,
  modeAI,
}: Props) {
  const { bahanDipilih, reset } = useRacikStore()
  const [fase, setFase] = useState<FaseRacik>('idle')

  const siapCampur = bahanDipilih.length >= 2
  const sudahCampur = hasil !== null
  const sedangMengaduk = fase === 'mengaduk' || fase === 'goyang'

  return (
    <main className="flex flex-col p-6 pt-32 overflow-hidden min-h-0 gap-3">
      <MejaRacik
        hasil={hasil}
        onBukaModalFormula={onBukaModalFormula}
        onMulaiAI={onMulaiAI}
        panelAI={panelAI}
        modeAI={modeAI}
        onFaseBerubah={setFase}
      />

      <div className="shrink-0 flex items-center justify-between gap-4">
        <button
          onClick={() => {
            putarClick()
            reset()
          }}
          disabled={bahanDipilih.length === 0 || sedangMengaduk}
          className="
            text-xs px-4 py-2.5 rounded-lg
            bg-white/70 backdrop-blur border border-[var(--panel-border)]
            text-secondary-lab hover:text-primary-lab hover:bg-white/90
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          ↺ Reset
        </button>

        {!sudahCampur ? (
          <motion.button
            onClick={onCampur}
            disabled={!siapCampur}
            whileHover={siapCampur ? { scale: 1.03 } : {}}
            whileTap={siapCampur ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="btn-campur px-8 py-3 rounded-2xl text-sm"
          >
            CAMPUR →
          </motion.button>
        ) : (
          <motion.button
            onClick={() => {
              putarSwoosh()
              onRacikLagi()
            }}
            disabled={sedangMengaduk}
            whileHover={sedangMengaduk ? {} : { scale: 1.03 }}
            whileTap={sedangMengaduk ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="btn-campur px-8 py-3 rounded-2xl text-sm"
          >
            {sedangMengaduk ? 'Mengaduk…' : '↺ Racik Lagi'}
          </motion.button>
        )}
      </div>
    </main>
  )
}