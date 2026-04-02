import { useCallback, useRef, useState } from 'react'
import { useHapticFeedback } from '../useHapticFeedback'
import { playCompletionSound } from '../../utils/audio/completionSound'
import { StepCompletionEvent, StepRewardState } from './types'

const STREAK_WINDOW_MS = 3000
const MILESTONES = [50, 75, 100] as const

const calcPercent = (steps: { isDone: boolean }[]): number => {
  if (steps.length === 0) return 0
  return Math.round((steps.filter(s => s.isDone).length / steps.length) * 100)
}

export const useStepCompletionRewards = (): {
  processStepToggle: (event: StepCompletionEvent) => StepRewardState
  streakCount: number
  resetStreak: () => void
} => {
  const { triggerHaptic } = useHapticFeedback()
  const [streakCount, setStreakCount] = useState(0)
  const lastToggleTimeRef = useRef(0)

  const resetStreak = useCallback((): void => {
    setStreakCount(0)
  }, [])

  const processStepToggle = useCallback((event: StepCompletionEvent): StepRewardState => {
    const { previousSteps, updatedSteps, newIsDone } = event
    const prevPercent = calcPercent(previousSteps)
    const newPercent = calcPercent(updatedSteps)

    let milestoneReached: 50 | 75 | 100 | null = null
    for (const threshold of MILESTONES) {
      if (prevPercent < threshold && newPercent >= threshold) {
        milestoneReached = threshold
      }
    }

    const isAllComplete = newPercent === 100
    const shouldConfetti = milestoneReached === 100 && newIsDone

    // Streak tracking
    let newStreakCount = 0
    if (newIsDone) {
      const now = Date.now()
      const timeSinceLast = now - lastToggleTimeRef.current
      if (timeSinceLast < STREAK_WINDOW_MS && lastToggleTimeRef.current > 0) {
        newStreakCount = streakCount + 1
      } else {
        newStreakCount = 1
      }
      lastToggleTimeRef.current = now
    }
    setStreakCount(newStreakCount)

    // Haptic feedback
    if (newIsDone) {
      if (milestoneReached === 100) {
        triggerHaptic('heavy')
      } else if (milestoneReached === 50 || milestoneReached === 75) {
        triggerHaptic('medium')
      } else {
        triggerHaptic('light')
      }
    } else {
      triggerHaptic('selection')
    }

    // Sound at 100%
    if (shouldConfetti) {
      playCompletionSound()
    }

    return {
      milestoneReached,
      isAllComplete,
      streakCount: newStreakCount,
      shouldConfetti,
      percentComplete: newPercent,
    }
  }, [streakCount, triggerHaptic])

  return { processStepToggle, streakCount, resetStreak }
}

export default useStepCompletionRewards
