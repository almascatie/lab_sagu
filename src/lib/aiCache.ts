// ============================================================
// src/lib/aiCache.ts
// Cache jawaban AI di localStorage
// ============================================================

// Prefix ber-versi — naikkan angka kalau format jawaban AI berubah
// v1 = format lama (mengapa)
// v2 = format baru (cerita + peran)
const PREFIX = 'ai_cache_v2:'
const MAX_ENTRIES = 100

export function buatKunciCache(bahanIds: string[]): string {
  const unik = [...new Set(bahanIds)].sort()
  return PREFIX + unik.join('+')
}

export function ambilCache(bahanIds: string[]): unknown | null {
  try {
    const raw = localStorage.getItem(buatKunciCache(bahanIds))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function simpanCache(bahanIds: string[], hasil: unknown): void {
  try {
    localStorage.setItem(buatKunciCache(bahanIds), JSON.stringify(hasil))
    bersihkanCacheLama()
  } catch {
    // localStorage penuh atau diblokir — abaikan
  }
}

// Hapus cache lama versi sebelumnya (v1 dan sebelumnya)
export function bersihkanCacheVersiLama(): void {
  try {
    const keysHapus: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k) continue
      // Hapus yang berawalan ai_cache: atau ai_cache_v1:
      if (
        (k.startsWith('ai_cache:') || k.startsWith('ai_cache_v1:')) &&
        !k.startsWith(PREFIX)
      ) {
        keysHapus.push(k)
      }
    }
    keysHapus.forEach((k) => localStorage.removeItem(k))
  } catch {
    // abaikan
  }
}

function bersihkanCacheLama(): void {
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(PREFIX)) keys.push(k)
    }
    if (keys.length > MAX_ENTRIES) {
      keys.slice(0, keys.length - MAX_ENTRIES).forEach((k) =>
        localStorage.removeItem(k)
      )
    }
  } catch {
    // abaikan
  }
}