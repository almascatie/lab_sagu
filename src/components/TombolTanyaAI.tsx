// ============================================================
// src/components/TombolTanyaAI.tsx
// Tombol "Tanya AI" — muncul saat kombinasi belum ditemukan
// ============================================================

import { motion } from 'motion/react'

interface Props {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

export function TombolTanyaAI({ onClick, disabled, loading }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.04 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="
        inline-flex items-center gap-2
        px-4 py-2 rounded-xl text-xs font-medium
        bg-violet-600/90 hover:bg-violet-500
        disabled:bg-neutral-800 disabled:text-neutral-500
        disabled:cursor-not-allowed
        border border-violet-500/40
      "
    >
      <span>{loading ? '⏳' : '✨'}</span>
      <span>{loading ? 'Bertanya...' : 'Tanya AI'}</span>
    </motion.button>
  )
}