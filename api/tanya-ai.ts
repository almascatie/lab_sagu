// ============================================================
// api/tanya-ai.ts
// Vercel Serverless Function — self-contained (tanpa import dari src/)
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface BahanInput {
  id: string
  nama: string
  definisi?: string
  karakter_utama?: string[]
  komponen_utama?: string[]
  potensi_pemanfaatan?: string[]
}

interface TanyaAIRequest {
  bahan: BahanInput[]
  referensi?: string
}

const SYSTEM_PROMPT = `Kamu adalah asisten SAGU Innovation Lab — permainan eksplorasi bahan sagu.

Pengguna baru saja mencampur beberapa bahan dan ingin tahu:
"Kalau digabungkan, kira-kira bisa jadi apa?"

Tugasmu: memberi SATU kemungkinan produk atau penggunaan yang paling masuk akal,
lalu menjelaskan kenapa bahan-bahan itu bisa mengarah ke sana.

CARA BERPIKIR:
- Baca definisi, karakter, komponen, dan potensi tiap bahan.
- Cari kombinasi yang paling nyambung — bukan daftar kemungkinan.
- Kalau ada bahan yang tidak nyambung, jangan dipaksakan.

CARA MENJAWAB:
- Bahasa Indonesia, mengalir, seperti bercerita ke teman.
- Bukan laporan lab, bukan kamus, bukan daftar.
- Fungsi bahan disampaikan sebagai bagian dari cerita, bukan satu-satu terpisah.
- Singkat. Langsung ke inti.
- Hindari istilah teknis kalau tidak perlu. Kalau perlu, jelaskan singkat.

YANG TIDAK BOLEH:
- Mengarang penelitian, angka, jurnal, penulis, atau formula.
- Mengklaim kombinasi "terbukti" kalau tidak ada referensi yang menyebutnya.
- Memaksakan semua bahan punya fungsi.
- Menghilangkan bahan dari analisis.
- Menyebut lebih dari satu produk.

TENTANG STATUS:
- "terbukti" — hanya kalau referensi yang diberikan menyebut kombinasi ini secara langsung.
- "potensi" — kombinasi belum ada di referensi, tapi fungsi bahan mendukung arah produknya.
- "belum_ditemukan" — tidak ada dasar yang cukup.

Kalau referensi kosong, JANGAN pakai "terbukti".

FORMAT OUTPUT — kembalikan HANYA JSON valid, tanpa markdown fence:

{
  "potensi": "Satu produk atau penggunaan paling masuk akal",
  "cerita": "2-4 kalimat mengalir yang menjelaskan hubungan bahan dan produk.",
  "peran": [
    { "bahan": "nama bahan persis", "fungsi": "fungsi singkat, 3-5 kata" }
  ],
  "bahan_tidak_jelas": [
    { "bahan": "nama bahan persis", "catatan": "Belum ditemukan peran yang jelas dalam pembentukan produk ini." }
  ],
  "status": {
    "tipe": "terbukti | potensi | belum_ditemukan",
    "catatan": "alasan singkat"
  }
}

ATURAN FIELD:
- "cerita" wajib ada, isi 2-4 kalimat.
- "peran" adalah ringkasan singkat per bahan.
- Setiap bahan yang diberikan HARUS muncul di "peran" atau "bahan_tidak_jelas".
- Jangan ada bahan yang sama di kedua array.
- Kalau semua bahan relevan, "bahan_tidak_jelas": [].
- Kalau tidak ada produk yang masuk akal, "potensi": "Belum dapat ditentukan".`

function buildUserPrompt(bahan: BahanInput[], referensi?: string): string {
  const daftarBahan = bahan
    .map((b) => {
      const bagian: string[] = [`- ${b.nama}`]
      if (b.definisi) bagian.push(`  Definisi: ${b.definisi}`)
      if (b.karakter_utama?.length)
        bagian.push(`  Karakter: ${b.karakter_utama.join(', ')}`)
      if (b.komponen_utama?.length)
        bagian.push(`  Komponen: ${b.komponen_utama.join(', ')}`)
      if (b.potensi_pemanfaatan?.length)
        bagian.push(`  Potensi: ${b.potensi_pemanfaatan.join(', ')}`)
      return bagian.join('\n')
    })
    .join('\n\n')

  const bagianReferensi = referensi
    ? `\n\nREFERENSI FORMULA/RESEARCH:\n${referensi}`
    : '\n\nREFERENSI FORMULA/RESEARCH: (tidak ada referensi khusus yang dilampirkan)'

  return `BAHAN YANG DIPILIH USER:
${daftarBahan}${bagianReferensi}

Jawab sesuai format JSON yang sudah ditentukan.`
}

function normalisasiOutput(raw: unknown): Record<string, unknown> {
  const o = (raw ?? {}) as Record<string, unknown>

  const potensi =
    typeof o.potensi === 'string' && o.potensi.trim()
      ? o.potensi
      : 'Belum dapat ditentukan'

  const cerita =
    typeof o.cerita === 'string' && o.cerita.trim() ? o.cerita : ''

  const peran = Array.isArray(o.peran)
    ? o.peran.filter(
        (m): m is { bahan: string; fungsi: string } =>
          !!m &&
          typeof m === 'object' &&
          typeof (m as { bahan?: unknown }).bahan === 'string' &&
          typeof (m as { fungsi?: unknown }).fungsi === 'string'
      )
    : []

  const bahanTidakJelas = Array.isArray(o.bahan_tidak_jelas)
    ? o.bahan_tidak_jelas.filter(
        (b): b is { bahan: string; catatan: string } =>
          !!b &&
          typeof b === 'object' &&
          typeof (b as { bahan?: unknown }).bahan === 'string' &&
          typeof (b as { catatan?: unknown }).catatan === 'string'
      )
    : []

  const statusRaw = (o.status ?? {}) as Record<string, unknown>
  const tipeValid = ['terbukti', 'potensi', 'belum_ditemukan'] as const
  const tipe =
    typeof statusRaw.tipe === 'string' &&
    (tipeValid as readonly string[]).includes(statusRaw.tipe)
      ? (statusRaw.tipe as 'terbukti' | 'potensi' | 'belum_ditemukan')
      : 'potensi'

  const catatan =
    typeof statusRaw.catatan === 'string'
      ? statusRaw.catatan
      : 'Tidak ada catatan tambahan.'

  return {
    potensi,
    cerita,
    peran,
    bahan_tidak_jelas: bahanTidakJelas,
    status: { tipe, catatan },
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    res.status(500).json({
      error: 'DEEPSEEK_API_KEY belum diset di environment Vercel.',
    })
    return
  }

  const body = req.body as TanyaAIRequest

  if (!body?.bahan || !Array.isArray(body.bahan) || body.bahan.length < 2) {
    res.status(400).json({ error: 'Minimal 2 bahan diperlukan.' })
    return
  }

  if (body.bahan.length > 8) {
    res.status(400).json({ error: 'Maksimal 8 bahan per pertanyaan.' })
    return
  }

  const userPrompt = buildUserPrompt(body.bahan, body.referensi)

  try {
    const deepseekRes = await fetch(
      'https://api.deepseek.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.6,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        }),
      }
    )

    if (!deepseekRes.ok) {
      const errText = await deepseekRes.text()
      res.status(502).json({
        error: 'DeepSeek API gagal merespons.',
        detail: errText.slice(0, 500),
      })
      return
    }

    const data = (await deepseekRes.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      res.status(502).json({ error: 'Jawaban AI kosong.' })
      return
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      res.status(502).json({
        error: 'Jawaban AI tidak dalam format JSON yang valid.',
        raw: content.slice(0, 500),
      })
      return
    }

    const hasil = normalisasiOutput(parsed)
    res.status(200).json({ hasil })
  } catch (err) {
    const pesan = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({
      error: 'Terjadi kesalahan di server.',
      detail: pesan,
    })
  }
}