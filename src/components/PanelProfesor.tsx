// ============================================================
// src/components/PanelProfesor.tsx
// Bang Sagu — ucapan status dalam bubble, nama dalam plakat jelly
// ============================================================

import { motion } from 'motion/react'
import profesorImg from '../assets/profesor.svg'
import { PlakNama, UcapanStatus, type StatusKarakter } from './KarakterUI'

interface Props {
  status: StatusKarakter
}

const UCAPAN: Record<StatusKarakter, string> = {
  menunggu: 'Menunggu racikanmu…',
  loading: 'Sedang menganalisis…',
  sukses: 'Sudah ketemu!',
  error: 'Ada yang salah…',
}

export function PanelProfesor({ status }: Props) {
  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="flex flex-col items-center justify-center gap-2 overflow-hidden"
    >
      <UcapanStatus status={status} teks={UCAPAN} ekor="kiri" />

      <motion.img
        src={profesorImg}
        alt="Bang Sagu"
        className="w-[80%] max-w-[200px] select-none pointer-events-none drop-shadow-lg"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        draggable={false}
      />

      <PlakNama
        nama="Bang Sagu"
        peran="Profesor"
        ikon="🧪"
        palet={['#fff3d6', '#f3cf7a', '#c99a3a']}
        warnaTeks="#5a3b05"
        delay={0.2}
      />
    </motion.aside>
  )
}
