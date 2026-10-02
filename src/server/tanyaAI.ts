// ============================================================
// src/server/tanyaAI.ts
// Logika inti Tanya AI — dipakai dev (Vite)
// ============================================================

export interface BahanInput {
  id: string
  nama: string
  definisi?: string
  karakter_utama?: string[]
  komponen_utama?: string[]
  potensi_pemanfaatan?: string[]
}

export interface TanyaAIRequest {
  bahan: BahanInput[]
  referensi?: string
}

export interface TanyaAIResponse {
  status: number
  body: Record<string, unknown>
}

// ---------------------------------------------
// System prompt
// ---------------------------------------------
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

═══════════════════════════════════════
CONTOH 1 — kombinasi jelas
═══════════════════════════════════════

Bahan:
- Pati Sagu (kaya pati, bisa membentuk matriks film)
- Gelatin Ikan (protein pembentuk film)
- Gliserol (plasticizer, bikin lentur)
- Air (pelarut)

Jawaban:

{
  "potensi": "Film biopolimer berbasis pati-gelatin",
  "cerita": "Pati sagu membentuk lapisan film saat dikeringkan, dan gelatin ikan membantu memperkuat lapisan itu karena sifat proteinnya. Gliserol masuk untuk menjaga film tetap lentur, sementara air menjadi pelarut yang mencampur semuanya sejak awal.",
  "peran": [
    { "bahan": "Pati Sagu", "fungsi": "bahan utama pembentuk film" },
    { "bahan": "Gelatin Ikan", "fungsi": "memperkuat film" },
    { "bahan": "Gliserol", "fungsi": "menjaga kelenturan" },
    { "bahan": "Air", "fungsi": "pelarut" }
  ],
  "bahan_tidak_jelas": [],
  "status": {
    "tipe": "potensi",
    "catatan": "Kombinasi persis ini belum ada di referensi, tapi fungsi tiap bahan mendukung terbentuknya film."
  }
}

═══════════════════════════════════════
CONTOH 2 — ada bahan yang tidak nyambung
═══════════════════════════════════════

Bahan:
- Pati Sagu (kaya pati)
- Resin (perekat sintetis)
- Tempe (bahan pangan fermentasi)

Jawaban:

{
  "potensi": "Komposit berbasis pati dengan resin sebagai pengikat",
  "cerita": "Pati sagu berperan sebagai bahan utama yang membentuk badan campuran, sementara resin mengikat partikel-partikel pati agar menyatu menjadi komposit yang lebih padat.",
  "peran": [
    { "bahan": "Pati Sagu", "fungsi": "bahan utama campuran" },
    { "bahan": "Resin", "fungsi": "perekat yang mengikat partikel" }
  ],
  "bahan_tidak_jelas": [
    {
      "bahan": "Tempe",
      "catatan": "Belum ditemukan peran yang jelas dalam pembentukan produk ini."
    }
  ],
  "status": {
    "tipe": "potensi",
    "catatan": "Arah komposit masuk akal, tapi tempe tidak punya peran jelas di sini."
  }
}

═══════════════════════════════════════

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
- "cerita" wajib ada, isi 2-4 kalimat. Ini bagian utama yang dibaca pengguna.
- "peran" adalah ringkasan singkat per bahan, bukan penjelasan panjang.
- Setiap bahan yang diberikan HARUS muncul di "peran" atau "bahan_tidak_jelas".
- Jangan ada bahan yang sama di kedua array.
- Kalau semua bahan relevan, "bahan_tidak_jelas": [].
- Kalau tidak ada produk yang masuk akal, "potensi": "Belum dapat ditentukan".`
// ---------------------------------------------
// Bangun user prompt dari bahan + referensi
// ---------------------------------------------
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

// ---------------------------------------------
// Normalisasi output AI
// Struktur baru: cerita (string) + peran (array)
// ---------------------------------------------
function normalisasiOutput(raw: unknown): Record<string, unknown> {
  const o = (raw ?? {}) as Record<string, unknown>

  // --- potensi ---
  const potensi =
    typeof o.potensi === 'string' && o.potensi.trim()
      ? o.potensi
      : 'Belum dapat ditentukan'

  // --- cerita (string) ---
  const cerita =
    typeof o.cerita === 'string' && o.cerita.trim() ? o.cerita : ''

  // --- peran (array of { bahan, fungsi }) ---
  const peran = Array.isArray(o.peran)
    ? o.peran.filter(
        (m): m is { bahan: string; fungsi: string } =>
          !!m &&
          typeof m === 'object' &&
          typeof (m as { bahan?: unknown }).bahan === 'string' &&
          typeof (m as { fungsi?: unknown }).fungsi === 'string'
      )
    : []

  // --- bahan_tidak_jelas ---
  const bahanTidakJelas = Array.isArray(o.bahan_tidak_jelas)
    ? o.bahan_tidak_jelas.filter(
        (b): b is { bahan: string; catatan: string } =>
          !!b &&
          typeof b === 'object' &&
          typeof (b as { bahan?: unknown }).bahan === 'string' &&
          typeof (b as { catatan?: unknown }).catatan === 'string'
      )
    : []

  // --- status ---
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

// ---------------------------------------------
// Fungsi utama
// ---------------------------------------------
export async function tanyaAI(
  input: TanyaAIRequest
): Promise<TanyaAIResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return {
      status: 500,
      body: { error: 'DEEPSEEK_API_KEY belum diset di environment server.' },
    }
  }

  if (!input?.bahan || !Array.isArray(input.bahan) || input.bahan.length < 2) {
    return {
      status: 400,
      body: { error: 'Minimal 2 bahan diperlukan.' },
    }
  }

  if (input.bahan.length > 8) {
    return {
      status: 400,
      body: { error: 'Maksimal 8 bahan per pertanyaan.' },
    }
  }

  const userPrompt = buildUserPrompt(input.bahan, input.referensi)

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
      console.error('DeepSeek error:', errText)
      return {
        status: 502,
        body: {
          error: 'DeepSeek API gagal merespons.',
          detail: errText.slice(0, 300),
        },
      }
    }

    const data = (await deepseekRes.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return { status: 502, body: { error: 'Jawaban AI kosong.' } }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      return {
        status: 502,
        body: {
          error: 'Jawaban AI tidak dalam format JSON yang valid.',
          raw: content,
        },
      }
    }

    const hasil = normalisasiOutput(parsed)

    return { status: 200, body: { hasil } }
  } catch (err) {
    console.error('Server error:', err)
    return { status: 500, body: { error: 'Terjadi kesalahan di server.' } }
  }
}