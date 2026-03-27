import { useRef, useCallback } from 'react'

const DEAD_ZONE = 5
const DEFAULT_THRESHOLD = 50

interface UseSwipeToNavigateOptions {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
  disabled?: boolean
}

type GestureState = 'idle' | 'pending' | 'active' | 'cancelled'

export const useSwipeToNavigate = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = DEFAULT_THRESHOLD,
  disabled = false,
}: UseSwipeToNavigateOptions) => {
  const gestureState = useRef<GestureState>('idle')
  const startX = useRef(0)
  const startY = useRef(0)
  const currentDeltaX = useRef(0)

  const reset = useCallback(() => {
    gestureState.current = 'idle'
    startX.current = 0
    startY.current = 0
    currentDeltaX.current = 0
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || e.button !== 0) return
      startX.current = e.clientX
      startY.current = e.clientY
      currentDeltaX.current = 0
      gestureState.current = 'pending'
    },
    [disabled],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const state = gestureState.current
      if (state === 'idle' || state === 'cancelled' || disabled) return

      const deltaX = e.clientX - startX.current
      const deltaY = e.clientY - startY.current

      if (state === 'pending') {
        const absDx = Math.abs(deltaX)
        const absDy = Math.abs(deltaY)

        if (absDx < DEAD_ZONE && absDy < DEAD_ZONE) return

        if (absDy > absDx) {
          gestureState.current = 'cancelled'
          return
        }

        gestureState.current = 'active'
      }

      currentDeltaX.current = deltaX
    },
    [disabled],
  )

  const onPointerUp = useCallback(() => {
    if (gestureState.current === 'active') {
      const delta = currentDeltaX.current
      if (Math.abs(delta) >= threshold) {
        if (delta < 0) {
          onSwipeLeft()
        } else {
          onSwipeRight()
        }
      }
    }
    reset()
  }, [threshold, onSwipeLeft, onSwipeRight, reset])

  const onPointerCancel = useCallback(() => {
    reset()
  }, [reset])

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  }
}
