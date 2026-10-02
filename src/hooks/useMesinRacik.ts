// ============================================================
// src/hooks/useMesinRacik.ts
// Mesin racik: bahan -> cek resep -> hasil
// ============================================================

import { BAHAN, PRODUK, RESEP } from '../data'
import type { HasilRacik } from '../types'

export function racik(bahanDipilih: string[]): HasilRacik {
  // 1. Validasi minimal 2 bahan
  if (bahanDipilih.length < 2) {
    return {
      tipe: 'tidak_valid',
      pesan: 'Butuh minimal 2 bahan untuk dicampur.',
    }
  }

  // 2. Cek ada bahan dasar sagu?
  const adaSagu = bahanDipilih.some((id) => {
    const b = BAHAN.find((x) => x.id === id)
    return b?.asal_sagu === true
  })

  if (!adaSagu) {
    return {
      tipe: 'kombinasi_baru',
      bahan: bahanDipilih,
      pesan:
        'Belum ada bahan dasar sagu. Tambahkan pati, ela, daun, kulit, atau pelepah.',
    }
  }

  // 3. Normalisasi: buang duplikat + urutkan
  const setBahan = [...new Set(bahanDipilih)].sort()

  // 4. Cari resep yang cocok
  for (const r of RESEP) {
    const setResep = [...r.bahan_ids].sort()

    const cocok =
      setBahan.length === setResep.length &&
      setBahan.every((b, i) => b === setResep[i])

    if (cocok) {
      const p = PRODUK.find((x) => x.id === r.produk_id)
      if (p) {
        return {
          tipe: 'produk_jadi',
          produk: p,
          resep: r,
          pesan: 'Formula ditemukan!',
        }
      }
    }
  }

  // 5. Tidak cocok -> kombinasi baru
  return {
    tipe: 'kombinasi_baru',
    bahan: setBahan,
    pesan: 'Kombinasi baru. Belum ada formula persis.',
  }
}