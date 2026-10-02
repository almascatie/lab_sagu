// ============================================================
// src/lib/sound.ts
// Sound efek sintetis pakai Web Audio API — tanpa file MP3
// ============================================================

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let aktifGlobal = true

function pastikanCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function setSuaraAktif(aktif: boolean) {
  aktifGlobal = aktif
  if (!aktif) stopBubble()
}

export function getSuaraAktif() {
  return aktifGlobal
}

function nada(
  freq: number,
  durasi: number,
  opts: {
    tipe?: OscillatorType
    gain?: number
    slideKe?: number
    delay?: number
  } = {}
) {
  if (!aktifGlobal) return
  const c = pastikanCtx()
  if (!c || !masterGain) return
  const { tipe = 'sine', gain = 0.3, slideKe, delay = 0 } = opts

  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = tipe
  osc.frequency.setValueAtTime(freq, c.currentTime + delay)
  if (slideKe !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(slideKe, 1),
      c.currentTime + delay + durasi
    )
  }
  g.gain.setValueAtTime(0, c.currentTime + delay)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + durasi)
  osc.connect(g)
  g.connect(masterGain)
  osc.start(c.currentTime + delay)
  osc.stop(c.currentTime + delay + durasi + 0.05)
}

function noise(durasi: number, gainVal = 0.15, filterFreq = 1200) {
  if (!aktifGlobal) return
  const c = pastikanCtx()
  if (!c || !masterGain) return

  const bufferSize = c.sampleRate * durasi
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }

  const src = c.createBufferSource()
  src.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = filterFreq

  const g = c.createGain()
  g.gain.value = gainVal

  src.connect(filter)
  filter.connect(g)
  g.connect(masterGain)
  src.start()
}

// ------------------------------------------------------------
// Sound efek
// ------------------------------------------------------------

// Taruh bahan ke gelas — plopp
export function putarPlopp() {
  nada(700, 0.12, { tipe: 'sine', gain: 0.35, slideKe: 180 })
}

// Klik bahan di sidebar — tick
export function putarTick() {
  nada(1200, 0.04, { tipe: 'triangle', gain: 0.15 })
}

// Hapus bahan — pop
export function putarPop() {
  nada(400, 0.08, { tipe: 'square', gain: 0.2, slideKe: 120 })
}

// Tombol CAMPUR — whoosh
export function putarWhoosh() {
  noise(0.35, 0.2, 800)
}

// Loop bubble saat mengaduk
let bubbleLoop: number | null = null
export function mulaiBubble() {
  if (!aktifGlobal) return
  if (bubbleLoop !== null) return
  const mainBubble = () => {
    nada(300 + Math.random() * 500, 0.1, {
      tipe: 'sine',
      gain: 0.08,
      slideKe: 150,
    })
  }
  mainBubble()
  bubbleLoop = window.setInterval(mainBubble, 180)
}
export function stopBubble() {
  if (bubbleLoop !== null) {
    clearInterval(bubbleLoop)
    bubbleLoop = null
  }
}

// Hasil produk — chime
export function putarChime() {
  nada(523, 0.4, { tipe: 'sine', gain: 0.25 })
  nada(659, 0.5, { tipe: 'sine', gain: 0.22, delay: 0.08 })
  nada(784, 0.6, { tipe: 'sine', gain: 0.2, delay: 0.16 })
}

// Kombinasi baru — boop
export function putarBoop() {
  nada(400, 0.15, { tipe: 'triangle', gain: 0.25, slideKe: 800 })
  nada(800, 0.2, { tipe: 'triangle', gain: 0.2, delay: 0.15, slideKe: 500 })
}

// Klik Tanya AI — sparkle
export function putarSparkle() {
  for (let i = 0; i < 5; i++) {
    nada(1000 + i * 200, 0.08, {
      tipe: 'sine',
      gain: 0.12,
      delay: i * 0.04,
    })
  }
}

// Jawaban AI muncul — bell
export function putarBell() {
  nada(880, 0.8, { tipe: 'sine', gain: 0.22 })
  nada(1320, 0.6, { tipe: 'sine', gain: 0.12, delay: 0.05 })
}

// Error — buzz
export function putarBuzz() {
  nada(120, 0.25, { tipe: 'square', gain: 0.2 })
}

// Racik Lagi — swoosh
export function putarSwoosh() {
  noise(0.3, 0.18, 600)
  nada(500, 0.25, { tipe: 'sine', gain: 0.15, slideKe: 100 })
}

// Tombol umum — click
export function putarClick() {
  nada(600, 0.04, { tipe: 'square', gain: 0.12 })
}

// Buka modal — chime halus
export function putarBuka() {
  nada(660, 0.15, { tipe: 'sine', gain: 0.18, slideKe: 880 })
}

// Tutup modal — nada turun
export function putarTutup() {
  nada(660, 0.15, { tipe: 'sine', gain: 0.15, slideKe: 440 })
}