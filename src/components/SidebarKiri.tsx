// ============================================================
// src/components/SidebarKiri.tsx
// + header dengan background
// ============================================================

import { motion } from 'motion/react'
import { BAHAN } from '../data'
import { useRacikStore } from '../stores/racikStore'
import { BolaBahan } from './BolaBahan'

export function SidebarKiri() {
  const { bahanDipilih, tambahBahan } = useRacikStore()
  const bahanSagu = BAHAN.filter((b) => b.kategori === 'dasar')

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="p-2 flex flex-col gap-3 overflow-y-auto overflow-x-hidden scroll-soft"
    >
      {/* Header dengan background */}
      <header className="panel-glass rounded-2xl px-3 py-2.5 shrink-0">
        <h2 className="label-section !text-[var(--text-secondary)]">
          Bahan Sagu
        </h2>
  
      </header>

      {/* Daftar bola bahan */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 justify-items-center px-1 pb-4">
        {bahanSagu.map((b) => (
          <BolaBahan
            key={b.id}
            id={`bahan-${b.id}`}
            bahanId={b.id}
            nama={b.nama}
            ikon={b.ikon}
            kategori={b.kategori}
            ukuran="besar"
            terpilih={bahanDipilih.includes(b.id)}
            onClick={() => tambahBahan(b.id)}
          />
        ))}
      </div>
    </motion.aside>
  )
}