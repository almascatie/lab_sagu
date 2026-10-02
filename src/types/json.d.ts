// ============================================================
// src/types/json.d.ts
// Deklarasi modul JSON agar TypeScript tidak komplain saat import
// ============================================================

declare module '*.json' {
  const value: unknown
  export default value
}