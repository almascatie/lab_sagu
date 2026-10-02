// ============================================================
// src/hooks/useSound.ts
// Hook toggle suara on/off dengan localStorage
// ============================================================

import { useState, useEffect } from 'react'
import { setSuaraAktif } from '../lib/sound'

const KEY = 'sagu:suara'

export function useSound() {
  const [aktif, setAktif] = useState(() => {
    try {
      const v = localStorage.getItem(KEY)
      return v === null ? true : v === '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    setSuaraAktif(aktif)
    try {
      localStorage.setItem(KEY, aktif ? '1' : '0')
    } catch {
      // abaikan
    }
  }, [aktif])

  return { aktif, setAktif }
}