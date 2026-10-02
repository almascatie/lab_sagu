// ============================================================
// src/App.tsx
// Update kecil: PanelAI tanpa handler tombol
// ============================================================

import { useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { AnimatePresence } from 'motion/react'
import { SidebarKiri } from './components/SidebarKiri'
import { SidebarKanan } from './components/SidebarKanan'
import { AreaRacik } from './components/AreaRacik'
import { ModalFormula } from './components/ModalFormula'
import { PanelProfesor } from './components/PanelProfesor'
import { PanelAsisten } from './components/PanelAsisten'
import { PanelAI } from './components/PanelAI'
import { useRacikStore } from './stores/racikStore'
import { useTanyaAI } from './hooks/useTanyaAI'
import { racik } from './hooks/useMesinRacik'
import type { HasilRacik as HasilTipe } from './types'
import { LatarLab } from './components/LatarLab'


export default function App() {
  const { bahanDipilih, tambahBahan, reset } = useRacikStore()
  const [hasil, setHasil] = useState<HasilTipe | null>(null)
  const [modalFormulaTerbuka, setModalFormulaTerbuka] = useState(false)
  const [modeAI, setModeAI] = useState(false)

  const ai = useTanyaAI()

  const fokus = bahanDipilih.length > 0

  const handleCampur = () => {
    setHasil(racik(bahanDipilih))
    if (modeAI) {
      setModeAI(false)
      ai.reset()
    }
  }

  const handleRacikLagi = () => {
    setHasil(null)
    setModeAI(false)
    ai.reset()
    reset()
  }

  const handleMulaiAI = () => {
    if (!hasil || hasil.tipe !== 'kombinasi_baru') return
    setModeAI(true)
    ai.tanya(hasil.bahan)
  }

  const handleDragEnd = (event: any) => {
    const source = event?.operation?.source
    const target = event?.operation?.target
    if (!source || !target) return
    if (target.id !== 'area-racik') return

    const bahanId = source?.data?.bahanId as string | undefined
    if (bahanId) tambahBahan(bahanId)
  }

  const produkUntukModal =
    hasil && (hasil.tipe === 'produk_jadi' || hasil.tipe === 'produk_varian')
      ? hasil.produk
      : null
  const resepUntukModal =
    hasil && (hasil.tipe === 'produk_jadi' || hasil.tipe === 'produk_varian')
      ? hasil.resep
      : null

  const statusAI: 'menunggu' | 'loading' | 'sukses' | 'error' = ai.loading
    ? 'loading'
    : ai.error
      ? 'error'
      : ai.jawaban
        ? 'sukses'
        : 'menunggu'

  const panelAI = (
    <PanelAI
      loading={ai.loading}
      error={ai.error}
      jawaban={ai.jawaban}
      dariCache={ai.dariCache}
    />
  )

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
   <div className={`lab-background ${fokus ? 'is-blurred' : ''}`}>
  <LatarLab />
</div>
      <div
        className={`lab-background-overlay ${fokus ? 'is-focused' : ''}`}
      />

      <div className="h-screen w-screen overflow-hidden flex flex-col relative">
        <header className="shrink-0 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-primary-lab">
                Sagu{' '}
                <span className="text-secondary-lab">Innovation Lab</span>
              </h1>
              <p className="text-[11px] text-muted-lab">
                Meja eksplorasi bahan sagu
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-lab">
            Sprint A — Visual
          </span>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-[260px_1fr_260px] gap-3 px-4 pb-4">
          <AnimatePresence mode="wait">
            {modeAI ? (
              <PanelProfesor key="profesor" status={statusAI} />
            ) : (
              <SidebarKiri key="sidebar-kiri" />
            )}
          </AnimatePresence>

          <AreaRacik
            hasil={hasil}
            onCampur={handleCampur}
            onRacikLagi={handleRacikLagi}
            onBukaModalFormula={() => setModalFormulaTerbuka(true)}
            onMulaiAI={handleMulaiAI}
            panelAI={modeAI ? panelAI : undefined}
            modeAI={modeAI}
          />

          <AnimatePresence mode="wait">
            {modeAI ? (
              <PanelAsisten key="asisten" status={statusAI} />
            ) : (
              <SidebarKanan key="sidebar-kanan" />
            )}
          </AnimatePresence>
        </div>
      </div>

      <ModalFormula
        terbuka={modalFormulaTerbuka}
        produk={produkUntukModal}
        resep={resepUntukModal}
        onTutup={() => setModalFormulaTerbuka(false)}
      />
    </DragDropProvider>
  )
}