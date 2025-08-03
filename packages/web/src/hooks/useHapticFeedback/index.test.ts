import { renderHook, act } from '@testing-library/react'
import { useHapticFeedback } from './index'

// Mock navigator.vibrate
const mockVibrate = jest.fn()

Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
})

describe('useHapticFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should trigger light haptic feedback by default', () => {
    const { result } = renderHook(() => useHapticFeedback())

    act(() => {
      result.current.triggerHaptic()
    })

    expect(mockVibrate).toHaveBeenCalledWith(10)
  })

  it('should trigger light haptic feedback when specified', () => {
    const { result } = renderHook(() => useHapticFeedback())

    act(() => {
      result.current.triggerHaptic('light')
    })

    expect(mockVibrate).toHaveBeenCalledWith(10)
  })

  it('should trigger medium haptic feedback', () => {
    const { result } = renderHook(() => useHapticFeedback())

    act(() => {
      result.current.triggerHaptic('medium')
    })

    expect(mockVibrate).toHaveBeenCalledWith(20)
  })

  it('should trigger heavy haptic feedback', () => {
    const { result } = renderHook(() => useHapticFeedback())

    act(() => {
      result.current.triggerHaptic('heavy')
    })

    expect(mockVibrate).toHaveBeenCalledWith(30)
  })

  it('should trigger selection haptic feedback', () => {
    const { result } = renderHook(() => useHapticFeedback())

    act(() => {
      result.current.triggerHaptic('selection')
    })

    expect(mockVibrate).toHaveBeenCalledWith([5, 5, 5])
  })



  it('should fallback to light vibration for unknown type', () => {
    const { result } = renderHook(() => useHapticFeedback())

    act(() => {
      // @ts-ignore - testing invalid type
      result.current.triggerHaptic('unknown')
    })

    expect(mockVibrate).toHaveBeenCalledWith(10)
  })
})