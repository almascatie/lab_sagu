// ============================================================
// src/components/PanelJawabanAI.tsx
// 4 bubble kotak-rounded (grid 2x2) yang "terpecah" dari bubble loading
// (asalX/asalY = titik awal mendekati pusat, lalu menyebar dengan pegas)
// ============================================================

import { BAHAN } from '../data'
import { BubbleSpeech } from './BubbleSpeech'
import type { JawabanAI } from '../hooks/useTanyaAI'

interface Props {
  jawaban: JawabanAI
  dariCache?: boolean
}

const LABEL_STATUS: Record<
  JawabanAI['status']['tipe'],
  {
    teks: string
    chip: string
    warna: 'hijau' | 'amber' | 'netral'
  }
> = {
  terbukti: {
    teks: '✓ Didukung referensi',
    chip: 'text-emerald-800 border-emerald-600/40 bg-emerald-50/80',
    warna: 'hijau',
  },
  potensi: {
    teks: '◐ Potensi / interpretasi',
    chip: 'text-amber-800 border-amber-600/40 bg-amber-50/80',
    warna: 'amber',
  },
  belum_ditemukan: {
    teks: '◌ Belum ditemukan',
    chip: 'text-neutral-700 border-neutral-400 bg-neutral-100/80',
    warna: 'netral',
  },
}

function cariIkon(namaBahan: string): string | null {
  const b = BAHAN.find(
    (x) => x.nama.toLowerCase() === namaBahan.toLowerCase(),
  )
  return b?.ikon ?? null
}

export function PanelJawabanAI({ jawaban, dariCache }: Props) {
  const status =
    LABEL_STATUS[jawaban.status.tipe] ?? LABEL_STATUS.belum_ditemukan

  return (
    // overflow aman: tidak ada margin negatif, posisi tidak beraturan
    // dibuat lewat self-start / self-end / self-center
    <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-x-5 gap-y-1 w-full">
      {/* 1. Potensi — kanan */}
      <div className="w-full">
        <BubbleSpeech
          warna="violet"
          bentuk={1}
          ekor="kanan"
          delay={0.05}
          asalX={160}
          asalY={50}
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="text-xs font-semibold text-violet-700">
              ✨ Potensi
            </div>
            {dariCache && (
              <span className="text-[10px] text-secondary-lab">cache</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-violet-900 leading-snug">
            {jawaban.potensi}
          </h3>
        </BubbleSpeech>
      </div>

      {/* 2. Kenapa bisa begitu — kiri */}
      {jawaban.cerita && (
        <div className="w-full md:mt-3">
          <BubbleSpeech
            warna="netral"
            bentuk={0}
            ekor="kiri"
            delay={0.18}
            asalX={-160}
            asalY={50}
          >
            <div className="text-xs font-semibold text-secondary-lab mb-1.5">
              Kenapa bisa begitu
            </div>
            <p className="text-sm text-primary-lab leading-relaxed">
              {jawaban.cerita}
            </p>
          </BubbleSpeech>
        </div>
      )}

      {/* 3. Peran tiap bahan — tengah agak kanan */}
      {jawaban.peran.length > 0 && (
        <div className="w-full">
          <BubbleSpeech
            warna="netral"
            bentuk={3}
            ekor="kanan"
            delay={0.31}
            asalX={160}
            asalY={-90}
          >
            <div className="text-xs font-semibold text-secondary-lab mb-2">
              Peran tiap bahan
            </div>
            <ul className="space-y-1.5">
              {jawaban.peran.map((m, i) => {
                const ikon = cariIkon(m.bahan)
                return (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-primary-lab"
                  >
                    {ikon && (
                      <span className="text-lg leading-none shrink-0">
                        {ikon}
                      </span>
                    )}
                    <span className="font-medium text-violet-800">
                      {m.bahan}
                    </span>
                    <span className="text-secondary-lab">—</span>
                    <span>{m.fungsi}</span>
                  </li>
                )
              })}
            </ul>

            {jawaban.bahan_tidak_jelas.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[rgba(107,90,68,0.2)]">
                <div className="text-xs font-semibold text-secondary-lab mb-1.5">
                  Tanpa peran jelas
                </div>
                <ul className="space-y-1">
                  {jawaban.bahan_tidak_jelas.map((b, i) => {
                    const ikon = cariIkon(b.bahan)
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-secondary-lab"
                      >
                        {ikon && (
                          <span className="text-base leading-none shrink-0 opacity-60">
                            {ikon}
                          </span>
                        )}
                        <div>
                          <span className="font-medium text-primary-lab">
                            {b.bahan}
                          </span>
                          <span> — {b.catatan}</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </BubbleSpeech>
        </div>
      )}

      {/* 4. Status — kiri, warna ikut status */}
      <div className="w-full md:mt-3">
        <BubbleSpeech
          warna={status.warna}
          bentuk={2}
          ekor="kiri"
          delay={0.44}
          asalX={-160}
          asalY={-90}
        >
          <div className="text-xs font-semibold text-secondary-lab mb-2">
            Status
          </div>
          <span
            className={`inline-block text-[11px] px-2.5 py-1 rounded-lg border ${status.chip}`}
          >
            {status.teks}
          </span>
          {jawaban.status.catatan && (
            <p className="mt-2 text-[11px] text-secondary-lab italic">
              {jawaban.status.catatan}
            </p>
          )}
        </BubbleSpeech>
      </div>
    </div>
  )
}
