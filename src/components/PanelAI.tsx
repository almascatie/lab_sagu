// ============================================================
// src/components/PanelAI.tsx
// Loading → bubble "menganalisis" → pop → terpecah jadi 4 bubble
// ============================================================

import { AnimatePresence, motion } from 'motion/react'
import { BubbleSpeech } from './BubbleSpeech'
import { PanelJawabanAI } from './PanelJawabanAI'
import type { JawabanAI } from '../hooks/useTanyaAI'

interface Props {
  loading: boolean
  error: string | null
  jawaban: JawabanAI | null
  dariCache: boolean
}

export function PanelAI({ loading, error, jawaban, dariCache }: Props) {
  return (
    <div className="w-full">
      {/* mode="wait": bubble loading pop dulu, baru 4 bubble muncul */}
      <AnimatePresence mode="wait">
        {loading && (
          <div key="loading" className="flex justify-center">
            <BubbleSpeech warna="violet" bentuk={3} ekor="kiri">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-600"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-violet-900">
                  Bang Sagu dan Caca Ela sedang menganalisis…
                </p>
              </div>
            </BubbleSpeech>
          </div>
        )}

        {!loading && error && (
          <div key="error" className="flex justify-center">
            <BubbleSpeech warna="netral" bentuk={2} ekor="kiri">
              <p className="text-sm text-red-700">⚠ {error}</p>
            </BubbleSpeech>
          </div>
        )}

        {!loading && !error && jawaban && (
          <div key="jawaban">
            <PanelJawabanAI jawaban={jawaban} dariCache={dariCache} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
