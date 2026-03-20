import { renderHook, act } from '@testing-library/react'
import { useDragToClose } from './index'

const createPointerEvent = (clientY: number) =>
  ({ clientY, pointerId: 1, currentTarget: { setPointerCapture: vi.fn() } }) as any

describe('useDragToClose', () => {
  describe('initial state', () => {
    it('should return dragOffset of 0', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      expect(result.current.dragOffset).toBe(0)
    })

    it('should return isDragging as false', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      expect(result.current.isDragging.current).toBe(false)
    })
  })

  describe('onPointerDown', () => {
    it('should set isDragging to true', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      act(() => {
        result.current.onPointerDown(createPointerEvent(100))
      })

      expect(result.current.isDragging.current).toBe(true)
    })

    it('should capture pointer on the element', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))
      const setPointerCapture = vi.fn()
      const event = { clientY: 100, pointerId: 42, currentTarget: { setPointerCapture } } as any

      act(() => {
        result.current.onPointerDown(event)
      })

      expect(setPointerCapture).toHaveBeenCalledWith(42)
    })
  })

  describe('onPointerMove', () => {
    it('should update dragOffset as pointer moves down', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      act(() => { result.current.onPointerDown(createPointerEvent(100)) })
      act(() => { result.current.onPointerMove(createPointerEvent(160)) })

      expect(result.current.dragOffset).toBe(60)
    })

    it('should clamp dragOffset to 0 when moving upward past start', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      act(() => { result.current.onPointerDown(createPointerEvent(200)) })
      act(() => { result.current.onPointerMove(createPointerEvent(100)) })

      expect(result.current.dragOffset).toBe(0)
    })

    it('should not update dragOffset when not dragging', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      act(() => { result.current.onPointerMove(createPointerEvent(200)) })

      expect(result.current.dragOffset).toBe(0)
    })
  })

  describe('onPointerUp', () => {
    it('should reset dragOffset to 0', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      act(() => { result.current.onPointerDown(createPointerEvent(100)) })
      act(() => { result.current.onPointerMove(createPointerEvent(150)) })
      act(() => { result.current.onPointerUp(createPointerEvent(150)) })

      expect(result.current.dragOffset).toBe(0)
    })

    it('should reset isDragging to false', () => {
      const { result } = renderHook(() => useDragToClose({ onClose: vi.fn() }))

      act(() => { result.current.onPointerDown(createPointerEvent(100)) })
      act(() => { result.current.onPointerUp(createPointerEvent(150)) })

      expect(result.current.isDragging.current).toBe(false)
    })

    it('should call onClose when offset meets the default threshold', () => {
      const onClose = vi.fn()
      const { result } = renderHook(() => useDragToClose({ onClose }))

      act(() => { result.current.onPointerDown(createPointerEvent(0)) })
      act(() => { result.current.onPointerUp(createPointerEvent(100)) })

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when offset exceeds the default threshold', () => {
      const onClose = vi.fn()
      const { result } = renderHook(() => useDragToClose({ onClose }))

      act(() => { result.current.onPointerDown(createPointerEvent(0)) })
      act(() => { result.current.onPointerUp(createPointerEvent(200)) })

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose when offset is below the default threshold', () => {
      const onClose = vi.fn()
      const { result } = renderHook(() => useDragToClose({ onClose }))

      act(() => { result.current.onPointerDown(createPointerEvent(0)) })
      act(() => { result.current.onPointerUp(createPointerEvent(99)) })

      expect(onClose).not.toHaveBeenCalled()
    })

    it('should respect a custom threshold', () => {
      const onClose = vi.fn()
      const { result } = renderHook(() => useDragToClose({ onClose, threshold: 50 }))

      act(() => { result.current.onPointerDown(createPointerEvent(0)) })
      act(() => { result.current.onPointerUp(createPointerEvent(50)) })

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose when releasing without a prior pointerdown', () => {
      const onClose = vi.fn()
      const { result } = renderHook(() => useDragToClose({ onClose }))

      act(() => { result.current.onPointerUp(createPointerEvent(200)) })

      expect(onClose).not.toHaveBeenCalled()
    })
  })
})
