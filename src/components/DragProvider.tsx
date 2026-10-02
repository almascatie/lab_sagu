// ============================================================
// src/components/DragProvider.tsx
// Provider @dnd-kit yang meneruskan onDragEnd
// ============================================================

import { DragDropProvider } from '@dnd-kit/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onDragEnd: (event: unknown) => void
}

export function DragProvider({ children, onDragEnd }: Props) {
  return (
    <DragDropProvider
      onDragEnd={onDragEnd as never}
    >
      {children}
    </DragDropProvider>
  )
}