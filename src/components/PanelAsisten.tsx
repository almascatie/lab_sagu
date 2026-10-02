// ============================================================
// src/components/PanelAsisten.tsx
// Caca Ela — ucapan status dalam bubble, nama dalam plakat jelly
// ============================================================

import { motion } from 'motion/react'
import asistenImg from '../assets/asisten.svg'
import { PlakNama, UcapanStatus, type StatusKarakter } from './KarakterUI'

interface Props {
  status: StatusKarakter
}

const UCAPAN: Record<StatusKarakter, string> = {
  menunggu: 'Siap mencatat…',
  loading: 'Menyiapkan catatan…',
  sukses: 'Mantapp!',
  error: 'Hmm, gagal…',
}

export function PanelAsisten({ status }: Props) {
  return (
    <motion.aside
      initial={{ x: 280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 280, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="flex flex-col items-center justify-center gap-2 overflow-hidden"
    >
      <UcapanStatus status={status} teks={UCAPAN} ekor="kanan" />

      <motion.img
        src={asistenImg}
        alt="Caca Ela"
        className="w-[80%] max-w-[200px] select-none pointer-events-none drop-shadow-lg"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
        draggable={false}
      />

      <PlakNama
        nama="Caca Ela"
        peran="Asisten"
        ikon="📒"
        palet={['#ffeef3', '#f6c3d3', '#d58aa6']}
        warnaTeks="#6b2140"
        delay={0.35}
      />
    </motion.aside>
  )
}
