// ============================================================
// src/stores/racikStore.ts
// Zustand store untuk state area racik
// ============================================================

import { create } from 'zustand'

interface RacikStore {
  bahanDipilih: string[]
  tambahBahan: (id: string) => void
  hapusBahan: (id: string) => void
  reset: () => void
  setBahan: (ids: string[]) => void
}

export const useRacikStore = create<RacikStore>()((set) => ({
  bahanDipilih: [],

  tambahBahan: (id) =>
    set((s) => ({
      bahanDipilih: s.bahanDipilih.includes(id)
        ? s.bahanDipilih
        : [...s.bahanDipilih, id],
    })),

  hapusBahan: (id) =>
    set((s) => ({
      bahanDipilih: s.bahanDipilih.filter((b) => b !== id),
    })),

  reset: () => set({ bahanDipilih: [] }),

  setBahan: (ids) => set({ bahanDipilih: ids }),
}))