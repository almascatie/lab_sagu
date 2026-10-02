// ============================================================
// src/data/index.ts
// Re-export data JSON dengan tipe yang sudah dikunci
// ============================================================

import bahanRaw from './bahan.json'
import produkRaw from './produk.json'
import resepRaw from './resep.json'

import type { Bahan, Produk, Resep } from '../types'

export const BAHAN: Bahan[] = bahanRaw as Bahan[]
export const PRODUK: Produk[] = produkRaw as Produk[]
export const RESEP: Resep[] = resepRaw as Resep[]

// Helper cepat
export const getBahan = (id: string) => BAHAN.find((b) => b.id === id)
export const getProduk = (id: string) => PRODUK.find((p) => p.id === id)
export const getResep = (id: string) => RESEP.find((r) => r.id === id)