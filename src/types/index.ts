// ============================================================
// src/types/index.ts
// Tipe TypeScript untuk seluruh entitas SAGU Innovation Lab
// ============================================================

export type KategoriBahan =
  | 'dasar'
  | 'aditif'
  | 'filler'
  | 'perekat'
  | 'pangan'
  | 'biomassa'
  | 'tradisional'

export type KategoriProduk =
  | 'Material'
  | 'Pangan'
  | 'Energi'
  | 'Pertanian'
  | 'Bangunan'
  | 'Kerajinan'

export interface Bahan {
  id: string
  nama: string
  ikon: string
  kategori: KategoriBahan
  asal_sagu: boolean
}

export interface Produk {
  id: string
  nama: string
  ikon: string
  kategori: KategoriProduk
  bahan_dasar: string
}

export interface Resep {
  id: string
  produk_id: string
  bahan_ids: string[]
  rasio: Record<string, string>
  proses: string
  catatan: string | null
}

// Hasil dari mesin racik — discriminated union
export type HasilRacik =
  | {
      tipe: 'produk_jadi'
      produk: Produk
      resep: Resep
      pesan: string
    }
  | {
      tipe: 'produk_varian'
      produk: Produk
      resep: Resep
      pesan: string
    }
  | {
      tipe: 'kombinasi_baru'
      bahan: string[]
      pesan: string
    }
  | {
      tipe: 'tidak_valid'
      pesan: string
    }