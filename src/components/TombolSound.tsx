// ============================================================
// src/components/TombolSound.tsx
// Toggle suara on/off
// ============================================================

import { motion } from 'motion/react'
import { useSound } from '../hooks/useSound'
import { putarClick } from '../lib/sound'

export function TombolSound() {
  const { aktif, setAktif } = useSound()

  return (
    <motion.button
      onClick={() => {
        if (!aktif) putarClick()
        setAktif(!aktif)
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={aktif ? 'Matikan suara' : 'Nyalakan suara'}
      className="
        w-9 h-9 rounded-full
        bg-white/70 backdrop-blur border border-[var(--panel-border)]
        text-secondary-lab hover:text-primary-lab hover:bg-white/90
        flex items-center justify-center text-base
        transition
      "
    >
      {aktif ? '🔊' : '🔇'}
    </motion.button>
  )
}