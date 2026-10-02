// ============================================================
// src/components/MejaRacik.tsx
// Meja racik + bubble awan untuk hasil
// ============================================================

import { useEffect, useState, useRef, type ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { motion, AnimatePresence } from 'motion/react'
import { BAHAN } from '../data'
import { useRacikStore } from '../stores/racikStore'
import { KartuBahan } from './KartuBahan'
import { PALET, paletKategori } from './BolaBahan'
import { BubbleSpeech } from './BubbleSpeech'
import {
  putarPlopp,
  putarChime,
  putarBoop,
  putarWhoosh,
  putarBuzz,
  putarSparkle,
  mulaiBubble,
  stopBubble,
} from '../lib/sound'
import {
  GelembungTanya,
  JellyBesar,
  KembangApi,
  PercikSihir,
  PUSAT_Y,
  PusaranSihir,
  TombolJelly,
} from './EfekRacik'
import type { HasilRacik as HasilTipe, Bahan } from '../types'

const LEBAR = 280
const TINGGI = 300
const LEBAR_DALAM = 210
const DASAR = 14
const DURASI_ADUK = 2.5
const DURASI_ADUK_MS = 2600
const DURASI_GOYANG_MS = 800
const SKALA_AI = 0.5

export type FaseRacik = 'idle' | 'mengaduk' | 'goyang' | 'tampil'

interface Props {
  hasil: HasilTipe | null
  onBukaModalFormula: () => void
  onMulaiAI: () => void
  panelAI?: ReactNode
  modeAI?: boolean
  onFaseBerubah?: (fase: FaseRacik) => void
}

function tataTumpukan(n: number, px: number) {
  const jarak = px * 0.86
  const kap = Math.max(2, Math.floor((LEBAR_DALAM - px) / jarak) + 1)
  const hasil: { x: number; y: number }[] = []
  let baris = 0
  let i = 0
  while (i < n) {
    const cap = baris % 2 === 0 ? kap : Math.max(1, kap - 1)
    const isi = Math.min(cap, n - i)
    for (let k = 0; k < isi; k++) {
      hasil.push({
        x: (k - (isi - 1) / 2) * jarak,
        y: -(baris * jarak * 0.82),
      })
      i++
    }
    baris++
  }
  return hasil
}

export function MejaRacik({
  hasil,
  onBukaModalFormula,
  onMulaiAI,
  panelAI,
  modeAI = false,
  onFaseBerubah,
}: Props) {
  const { bahanDipilih, hapusBahan } = useRacikStore()
  const [fase, setFase] = useState<FaseRacik>('idle')

  const { ref, isDropTarget } = useDroppable({ id: 'area-racik' })

  // Sound saat bahan ditambah
  const prevJumlah = useRef(0)
  useEffect(() => {
    if (bahanDipilih.length > prevJumlah.current) {
      putarPlopp()
    }
    prevJumlah.current = bahanDipilih.length
  }, [bahanDipilih.length])

  // Sound & fase saat hasil berubah
  useEffect(() => {
    if (!hasil) {
      setFase('idle')
      stopBubble()
      return
    }
    if (hasil.tipe === 'tidak_valid') {
      setFase('goyang')
      putarBuzz()
      return
    }
    setFase('mengaduk')
    putarWhoosh()
    setTimeout(() => mulaiBubble(), 300)
  }, [hasil])

  // Setelah mengaduk selesai → tampilkan hasil
  useEffect(() => {
    if (fase !== 'mengaduk' && fase !== 'goyang') return
    const t = setTimeout(
      () => {
        stopBubble()
        setFase('tampil')
        if (hasil?.tipe === 'produk_jadi' || hasil?.tipe === 'produk_varian') {
          putarChime()
        } else if (hasil?.tipe === 'kombinasi_baru') {
          putarBoop()
        }
      },
      fase === 'mengaduk' ? DURASI_ADUK_MS : DURASI_GOYANG_MS,
    )
    return () => clearTimeout(t)
  }, [fase, hasil])

  // Laporkan fase ke parent
  useEffect(() => {
    onFaseBerubah?.(fase)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase])

  const bahanTampil = bahanDipilih
    .map((id) => BAHAN.find((x) => x.id === id))
    .filter((b): b is Bahan => Boolean(b))
  const n = bahanTampil.length
  const px = n > 6 ? 50 : 68
  const layoutKartu = px === 50 ? 'mini' : 'rak'
  const tumpuk = tataTumpukan(n, px)

  const mengaduk = fase === 'mengaduk'
  const tampil = fase === 'tampil'

  const produk =
    hasil && (hasil.tipe === 'produk_jadi' || hasil.tipe === 'produk_varian')
      ? hasil.produk
      : null
  const kombinasiBaru = hasil?.tipe === 'kombinasi_baru'

  // Mode AI → gelas mengecil, susun vertikal
  const gelasMengecil = modeAI && !!panelAI
  const skalaGelas = gelasMengecil ? SKALA_AI : 1
  const susunVertikal = gelasMengecil

  const sembunyikanBola =
    mengaduk || (tampil && !!hasil && hasil.tipe !== 'tidak_valid')

  const guncang =
    fase === 'mengaduk'
      ? { rotate: [0, -1.4, 1.4, -1, 1, 0], x: 0 }
      : fase === 'goyang'
        ? { x: [0, -10, 10, -8, 8, -4, 4, 0], rotate: 0 }
        : { rotate: 0, x: 0 }

  return (
    <div
      ref={ref}
      className={`
        relative flex-1 min-h-0 rounded-3xl
        border-2 border-dashed
        flex items-center justify-center gap-4 p-4
        ${susunVertikal ? 'flex-col' : ''}
        transition-all duration-300
        ${
          isDropTarget
            ? 'border-[rgba(90,143,74,0.9)] bg-[rgba(90,143,74,0.08)] shadow-[inset_0_0_60px_rgba(90,143,74,0.12)]'
            : 'border-transparent'
        }
      `}
    >
      {/* ===================== GELAS LAB ===================== */}
      <motion.div
        className={`relative shrink-0 ${susunVertikal ? 'order-2' : ''}`}
        initial={false}
        animate={{
          width: LEBAR * skalaGelas,
          height: TINGGI * skalaGelas,
          y: 0,
          opacity: gelasMengecil ? 0.85 : 1,
        }}
        transition={{ type: 'spring', stiffness: 140, damping: 20 }}
      >
        <motion.div
          className="absolute bottom-0 left-1/2"
          style={{
            width: LEBAR,
            height: TINGGI,
            marginLeft: -LEBAR / 2,
            transformOrigin: '50% 100%',
          }}
          animate={{
            ...guncang,
            scale: isDropTarget ? 1.03 : skalaGelas,
          }}
          transition={{
            rotate: guncang.rotate
              ? { duration: 0.45, repeat: Infinity }
              : undefined,
            x: guncang.x ? { duration: 0.6 } : undefined,
            scale: { type: 'spring', stiffness: 180, damping: 22 },
          }}
        >
          {/* Badan kaca */}
          <div
            aria-hidden
            className="absolute left-0 right-0 bottom-0"
            style={{
              top: 22,
              borderRadius: '8px 8px 70px 70px',
              border: '3px solid rgba(255,255,255,0.85)',
              borderTop: 'none',
              background:
                'linear-gradient(100deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.10) 30%, rgba(200,225,235,0.14) 70%, rgba(255,255,255,0.34) 100%)',
              boxShadow: [
                'inset 0 -18px 30px rgba(120,150,170,0.25)',
                'inset 0 0 24px rgba(255,255,255,0.5)',
                isDropTarget
                  ? '0 0 36px 4px rgba(90,143,74,0.45)'
                  : '0 20px 30px -12px rgba(40,50,70,0.35)',
              ].join(', '),
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              transition: 'box-shadow 0.3s ease',
            }}
          />

          {/* Garis ukur */}
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} aria-hidden>
              <div
                style={{
                  position: 'absolute',
                  right: 12,
                  bottom: 50 + k * 44,
                  width: k % 2 ? 22 : 12,
                  height: 2,
                  borderRadius: 1,
                  background: 'rgba(90,110,130,0.45)',
                  zIndex: 2,
                }}
              />
              {k % 2 === 1 && (
                <span
                  style={{
                    position: 'absolute',
                    right: 40,
                    bottom: 50 + k * 44 - 6,
                    fontSize: 8,
                    color: 'rgba(90,110,130,0.7)',
                    zIndex: 2,
                  }}
                >
                  {(k + 1) * 100}
                </span>
              )}
            </div>
          ))}

          {/* Petunjuk kosong */}
          <AnimatePresence>
            {n === 0 && !hasil && (
              <motion.div
                key="kosong"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 text-center pointer-events-none"
                style={{ bottom: 88, zIndex: 6 }}
              >
                <div className="text-4xl mb-2 opacity-40">✦</div>
                <p className="text-muted-lab text-sm italic">
                  {isDropTarget ? 'Lepaskan di sini' : 'Tarik bahan ke sini'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tumpukan jelly */}
          <AnimatePresence>
            {bahanTampil.map((b, i) => {
              const pos = tumpuk[i]
              if (!pos) return null
              return (
                <motion.div
                  key={b.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    bottom: DASAR,
                    width: px,
                    height: px,
                    marginLeft: -px / 2,
                    zIndex: 5 + i,
                  }}
                  initial={{ x: pos.x, y: -TINGGI + 20, opacity: 1 }}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    opacity: sembunyikanBola ? 0 : 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    x: { type: 'spring', stiffness: 220, damping: 16 },
                    y: { duration: 0.5, ease: [0.55, 0, 0.9, 0.55] },
                    opacity: { duration: 0 },
                  }}
                >
                  <motion.div
                    initial={{ scaleX: 0.8, scaleY: 1.25 }}
                    animate={{
                      scaleX: [0.8, 1.35, 0.9, 1.08, 0.97, 1],
                      scaleY: [1.25, 0.62, 1.12, 0.92, 1.03, 1],
                    }}
                    transition={{
                      duration: 0.9,
                      delay: 0.45,
                      times: [0, 0.2, 0.45, 0.65, 0.85, 1],
                    }}
                    style={{ transformOrigin: '50% 100%' }}
                  >
                    <motion.div
                      animate={{
                        scaleX: [1, 1.035, 0.98, 1],
                        scaleY: [1, 0.96, 1.03, 1],
                      }}
                      transition={{
                        duration: 2.4 + (i % 3) * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1.4,
                      }}
                      style={{ transformOrigin: '50% 100%' }}
                    >
                      <KartuBahan
                        id={`meja-${b.id}`}
                        bahan={b}
                        layout={layoutKartu}
                        draggable={false}
                        onClick={() => {
                          if (fase === 'idle') hapusBahan(b.id)
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Bola berputar + sihir */}
          {mengaduk && (
            <>
              <div
                className="absolute left-1/2 pointer-events-none"
                style={{ bottom: PUSAT_Y, width: 0, height: 0, zIndex: 10 }}
              >
                {bahanTampil.map((b, i) => {
                  const pos = tumpuk[i]
                  if (!pos) return null
                  const sudut = (i / n) * Math.PI * 2
                  const r = 60 + (i % 3) * 16
                  const ox = Math.cos(sudut) * r
                  const oy = Math.sin(sudut) * r
                  const by = PUSAT_Y - (DASAR + px / 2 - pos.y)
                  const times = [0, 0.25, 0.8, 1]
                  return (
                    <motion.div
                      key={b.id}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0,
                      }}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 1440 }}
                      transition={{
                        duration: DURASI_ADUK,
                        ease: 'easeInOut',
                      }}
                    >
                      <motion.div
                        style={{
                          position: 'absolute',
                          left: -px / 2,
                          top: -px / 2,
                        }}
                        initial={{ x: pos.x, y: by, scale: 1, rotate: 0 }}
                        animate={{
                          x: [pos.x, ox, ox, 0],
                          y: [by, oy, oy, 0],
                          scale: [1, 1, 1, 0.25],
                          rotate: -1440,
                        }}
                        transition={{
                          x: {
                            duration: DURASI_ADUK,
                            times,
                            ease: 'easeInOut',
                          },
                          y: {
                            duration: DURASI_ADUK,
                            times,
                            ease: 'easeInOut',
                          },
                          scale: { duration: DURASI_ADUK, times },
                          rotate: {
                            duration: DURASI_ADUK,
                            ease: 'easeInOut',
                          },
                        }}
                      >
                        <KartuBahan
                          id={`aduk-${b.id}`}
                          bahan={b}
                          layout={layoutKartu}
                          draggable={false}
                        />
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
              <PusaranSihir durasi={DURASI_ADUK} />
              <PercikSihir durasi={DURASI_ADUK} />
            </>
          )}

          {/* Jelly hasil */}
          {tampil && produk && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 70,
                  marginLeft: -55,
                  zIndex: 25,
                }}
              >
                <JellyBesar
                  palet={paletKategori(produk.kategori)}
                  ukuran={110}
                  cahaya="rgba(255,216,107,0.75)"
                >
                  <span style={{ fontSize: 48, lineHeight: 1 }}>
                    {produk.ikon}
                  </span>
                </JellyBesar>
              </div>
              <KembangApi />
            </>
          )}

          {/* Jelly tanda tanya */}
          {tampil && kombinasiBaru && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 70,
                marginLeft: -55,
                width: 110,
                height: 110,
                zIndex: 25,
              }}
            >
              <GelembungTanya />
              <JellyBesar
                palet={PALET[5]}
                ukuran={110}
                cahaya="rgba(139,109,201,0.7)"
              >
                <span
                  style={{
                    fontSize: 58,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: '#fff',
                    textShadow: '0 2px 6px rgba(80,50,140,0.55)',
                  }}
                >
                  ?
                </span>
              </JellyBesar>
            </div>
          )}

          {/* Kilau + bibir gelas */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: 14,
              top: 48,
              bottom: 62,
              width: 9,
              borderRadius: 10,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.08))',
              filter: 'blur(1px)',
              zIndex: 40,
            }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              right: 18,
              top: 76,
              height: 60,
              width: 4,
              borderRadius: 10,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))',
              zIndex: 40,
            }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top: 14,
              left: -10,
              right: -10,
              height: 14,
              borderRadius: 10,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(220,235,240,0.6))',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
              zIndex: 41,
            }}
          />
        </motion.div>
      </motion.div>

      {/* ===================== PANEL BUBBLE ===================== */}
      <AnimatePresence>
        {tampil && hasil && (
          <motion.div
            key="panel-hasil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: produk ? 0.9 : 0.4, duration: 0.3 }}
            className={`
              flex-1 min-w-0 min-h-0 max-h-full
              flex flex-col
              px-3 py-2
              overflow-y-auto overflow-x-hidden scroll-soft
              ${susunVertikal ? 'order-1 w-full' : ''}
            `}
          >
            <div
              className={`w-full my-auto mx-auto ${
                susunVertikal ? 'max-w-[920px]' : 'max-w-[440px]'
              }`}
            >
              <AnimatePresence mode="wait">
                {modeAI && panelAI ? (
                  <div key="ai">{panelAI}</div>
                ) : (
                  <div key="awal">
                    <IsiHasilBubble
                      hasil={hasil}
                      onBukaModalFormula={onBukaModalFormula}
                      onMulaiAI={onMulaiAI}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ------------------------------------------------------------
// Isi panel hasil — bubble untuk semua tipe
// ------------------------------------------------------------
function IsiHasilBubble({
  hasil,
  onBukaModalFormula,
  onMulaiAI,
}: {
  hasil: HasilTipe
  onBukaModalFormula: () => void
  onMulaiAI: () => void
}) {
  if (hasil.tipe === 'tidak_valid') {
    return (
      <BubbleSpeech warna="netral" bentuk={2} ekor="samping" delay={0.2}>
        <p className="text-sm text-amber-700">⚠ {hasil.pesan}</p>
      </BubbleSpeech>
    )
  }

  if (hasil.tipe === 'produk_jadi' || hasil.tipe === 'produk_varian') {
    return (
      <BubbleSpeech warna="hijau" bentuk={1} ekor="samping" delay={0.2}>
        <div className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold">
          {hasil.tipe === 'produk_jadi' ? '✓ Produk Jadi' : '≈ Varian'}
        </div>
        <h3 className="text-xl font-bold text-primary-lab mt-1.5">
          {hasil.produk.nama}
        </h3>
        <p className="text-xs text-secondary-lab mt-1">
          {hasil.produk.kategori} · {hasil.produk.bahan_dasar}
        </p>
        <div className="mt-4">
          <TombolJelly warna="hijau" onClick={onBukaModalFormula}>
            Lihat Formula
          </TombolJelly>
        </div>
      </BubbleSpeech>
    )
  }

  if (hasil.tipe === 'kombinasi_baru') {
    return (
      <BubbleSpeech warna="violet" bentuk={1} ekor="samping" delay={0.2}>
        <div className="text-[10px] uppercase tracking-widest text-violet-700 font-semibold">
          ◌ Kombinasi Baru
        </div>
        <h3 className="text-lg font-bold text-primary-lab mt-1.5">
          Belum ada formula ini
        </h3>
        <p className="text-xs text-secondary-lab mt-1">
          Coba tanya AI — mungkin ada petunjuk.
        </p>
        <div className="mt-4">
          <TombolJelly
            warna="ungu"
            onClick={() => {
              putarSparkle()
              onMulaiAI()
            }}
          >
            ✨ Tanya AI
          </TombolJelly>
        </div>
      </BubbleSpeech>
    )
  }

  return null
}