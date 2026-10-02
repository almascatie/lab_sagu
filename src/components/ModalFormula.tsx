// ============================================================
// src/components/ModalFormula.tsx
// Modal menampilkan formula lengkap sebuah produk
// ============================================================

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BAHAN } from '../data'
import type { Produk, Resep } from '../types'

interface Props {
  terbuka: boolean
  produk: Produk | null
  resep: Resep | null
  onTutup: () => void
}

export function ModalFormula({ terbuka, produk, resep, onTutup }: Props) {
  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!terbuka) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onTutup()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [terbuka, onTutup])

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (!terbuka) return
    const asli = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = asli
    }
  }, [terbuka])

  if (!produk || !resep) {
    return null
  }

  const rasioEntries = Object.entries(resep.rasio)

  return (
    <AnimatePresence>
      {terbuka && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onTutup}
          className="
            fixed inset-0 z-50
            bg-black/70 backdrop-blur-sm
            flex items-center justify-center p-4
          "
        >
          {/* Panel modal */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-lg max-h-[85vh] overflow-y-auto
              rounded-3xl border border-neutral-700
              bg-neutral-900 shadow-2xl
              p-6
            "
          >
            {/* Tombol tutup */}
            <button
              onClick={onTutup}
              aria-label="Tutup"
              className="
                absolute top-4 right-4
                w-8 h-8 rounded-full
                flex items-center justify-center
                text-neutral-400 hover:text-white
                hover:bg-neutral-800
                transition
              "
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-4">
              Formula
            </div>

            {/* Produk */}
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl leading-none shrink-0">
                {produk.ikon}
              </div>
              <div>
                <h2 className="text-2xl font-bold leading-tight">
                  {produk.nama}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {produk.kategori} · Bahan dasar: {produk.bahan_dasar}
                </p>
              </div>
            </div>

            {/* Bahan */}
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-3">
                Bahan
              </div>
              <ul className="space-y-2">
                {resep.bahan_ids.map((id) => {
                  const b = BAHAN.find((x) => x.id === id)
                  if (!b) return null

                  // Cari rasio untuk bahan ini
                  const rasioKey = Object.keys(resep.rasio).find(
                    (k) =>
                      k.toLowerCase() === b.id.toLowerCase() ||
                      k.toLowerCase() === b.nama.toLowerCase()
                  )
                  const rasio = rasioKey ? resep.rasio[rasioKey] : null

                  return (
                    <li
                      key={id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="text-2xl leading-none shrink-0">
                        {b.ikon}
                      </span>
                      <span className="text-neutral-100 flex-1">
                        {b.nama}
                      </span>
                      {rasio && (
                        <span className="text-emerald-300 text-xs font-medium">
                          {rasio}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Proses */}
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                Proses
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed">
                {resep.proses}
              </p>
            </div>

            {/* Catatan */}
            {resep.catatan && (
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                  Catatan
                </div>
                <p className="text-sm text-neutral-300 italic leading-relaxed">
                  {resep.catatan}
                </p>
              </div>
            )}

            {/* Rasio lengkap (kalau ada yang tidak terpasang ke bahan) */}
            {rasioEntries.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                  Rasio
                </div>
                <ul className="text-sm text-neutral-300 space-y-1">
                  {rasioEntries.map(([k, v]) => (
                    <li key={k}>
                      <span className="text-neutral-500">{k}:</span>{' '}
                      <span className="text-emerald-300">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tombol tutup bawah */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onTutup}
                className="
                  text-xs px-5 py-2 rounded-xl
                  bg-neutral-800 border border-neutral-700
                  hover:bg-neutral-700
                  transition
                "
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}