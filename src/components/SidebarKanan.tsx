// ============================================================
// src/components/SidebarKanan.tsx
// Rak bahan tambahan — bola kategori + bola bahan
// ============================================================

import { useState } from 'react'
import { motion } from 'motion/react'
import { BAHAN } from '../data'
import { useRacikStore } from '../stores/racikStore'
import { BolaBahan } from './BolaBahan'
import { BolaKategori } from './BolaKategori'
import type { KategoriBahan } from '../types'

type Kat = Exclude<KategoriBahan, 'dasar'>

const URUTAN: Kat[] = ['aditif', 'filler', 'perekat', 'pangan', 'biomassa', 'tradisional']

const KATEGORI: Record<Kat, { label: string; panjang: string; ikon: string }> = {
  aditif: { label: 'Aditif', panjang: 'Plasticizer & Aditif', ikon: '🧴' },
  filler: { label: 'Filler', panjang: 'Penguat & Filler', ikon: '🧱' },
  perekat: { label: 'Perekat', panjang: 'Perekat & Resin', ikon: '🧪' },
  pangan: { label: 'Pangan', panjang: 'Pangan', ikon: '🍞' },
  biomassa: { label: 'Biomassa', panjang: 'Biomassa & Pertanian', ikon: '🌴' },
  tradisional: { label: 'Tradisional', panjang: 'Tradisional', ikon: '🪢' },
}

const OFFSET_BENTUK: Record<Kat, number> = {
  aditif: 0, filler: 2, perekat: 4, pangan: 1, biomassa: 3, tradisional: 5,
}

export function SidebarKanan() {
  const { bahanDipilih, tambahBahan } = useRacikStore()
  const [aktif, setAktif] = useState<Kat>('aditif')
  const [sorot, setSorot] = useState<string | null>(null)

  const tambahan = BAHAN.filter((b) => b.kategori !== 'dasar')
  const tampil = tambahan.filter((b) => b.kategori === aktif)

  const jumlahTerpilih = (k: Kat) =>
    tambahan.filter((b) => b.kategori === k && bahanDipilih.includes(b.id)).length

  return (
    <aside className="p-2 flex flex-col gap-3 overflow-hidden min-h-0">
          <header className="panel-glass rounded-2xl px-3 py-2.5 shrink-0">
            <h2 className="label-section !text-[var(--text-secondary)]">
              Bahan Tambahan
            </h2>
 
          </header>

      {/* Bola kategori */}
      <div className="shrink-0 grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center px-1 pt-1">
        {URUTAN.map((k) => (
          <BolaKategori
            key={k}
            kategori={k}
            label={KATEGORI[k].label}
            ikon={KATEGORI[k].ikon}
            aktif={aktif === k}
            jumlahTerpilih={jumlahTerpilih(k)}
            onClick={() => setAktif(k)}
          />
        ))}
      </div>

      {/* Judul daftar */}
      <p className="shrink-0 px-2 text-[10px] uppercase tracking-widest text-muted-lab mt-2">
        {KATEGORI[aktif].panjang}
      </p>

      {/* Daftar bola bahan */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-soft px-1 pb-2">
        {tampil.length === 0 ? (
          <p className="text-[11px] text-muted-lab italic py-6 text-center">
            Belum ada bahan di kategori ini.
          </p>
        ) : (
          <div
            key={aktif}
            className="grid grid-cols-3 gap-x-2 gap-y-4 justify-items-center pt-1"
          >
            {tampil.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 12,
                  delay: Math.min(i, 12) * 0.025,
                }}
              >
                <BolaBahan
                  id={b.id}
                  nama={b.nama}
                  ikon={b.ikon}
                  kategori={b.kategori}
                  bentuk={i + OFFSET_BENTUK[b.kategori as Kat]}
                  ukuran="kecil"
                  terpilih={bahanDipilih.includes(b.id)}
                  onClick={() => tambahBahan(b.id)}
                  onSorot={setSorot}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Nama lengkap bahan yang disorot */}
<div
  className="
    shrink-0 mx-1 rounded-2xl px-3 py-2 text-[11px] text-center truncate
    panel-glass text-primary-lab
  "
>
  {sorot ?? (
    <span className="text-secondary-lab">
      Arahkan ke bahan untuk lihat nama
    </span>
  )}
</div>
    </aside>
  )
}