import { useCallback, useRef, useState } from 'react'

const DEFAULT_THRESHOLD = 100

interface UseDragToCloseOptions {
  onClose: () => void
  threshold?: number
}

interface UseDragToCloseResult {
  dragOffset: number
  isDragging: React.MutableRefObject<boolean>
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void
}

export const useDragToClose = ({ onClose, threshold = DEFAULT_THRESHOLD }: UseDragToCloseOptions): UseDragToCloseResult => {
  const [dragOffset, setDragOffset] = useState(0)
  const isDragging = useRef(false)
  const dragStartY = useRef(0)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    dragStartY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const offset = Math.max(0, e.clientY - dragStartY.current)
    setDragOffset(offset)
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      const finalOffset = Math.max(0, e.clientY - dragStartY.current)
      if (finalOffset >= threshold) {
        onClose()
      }
    }
    isDragging.current = false
    setDragOffset(0)
  }, [onClose, threshold])

  return { dragOffset, isDragging, onPointerDown, onPointerMove, onPointerUp }
}
