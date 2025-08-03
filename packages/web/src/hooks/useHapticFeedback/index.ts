import { useCallback } from 'react'

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection'

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10)
          break
        case 'medium':
          navigator.vibrate(20)
          break
        case 'heavy':
          navigator.vibrate(30)
          break
        case 'selection':
          navigator.vibrate([5, 5, 5])
          break
        default:
          navigator.vibrate(10)
      }
    }
  }, [])

  return { triggerHaptic }
}

export default useHapticFeedback