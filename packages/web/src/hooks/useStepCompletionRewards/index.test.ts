import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStepCompletionRewards } from '.'
import { IStep } from '../../api/toDoList/retrieve/types'

vi.mock('../useHapticFeedback', () => ({
  useHapticFeedback: () => ({ triggerHaptic: vi.fn() }),
}))

vi.mock('../../utils/audio/completionSound', () => ({
  playCompletionSound: vi.fn(),
}))

const makeSteps = (doneCount: number, total: number): IStep[] =>
  Array.from({ length: total }, (_, i) => ({
    id: `step-${i}`,
    name: `Step ${i}`,
    isDone: i < doneCount,
  }))

describe('Given the useStepCompletionRewards hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should detect the 50% milestone', () => {
    const { result } = renderHook(() => useStepCompletionRewards())

    const previousSteps = makeSteps(1, 4)
    const updatedSteps = makeSteps(2, 4)

    let state: ReturnType<typeof result.current.processStepToggle>
    act(() => {
      state = result.current.processStepToggle({
        previousSteps,
        updatedSteps,
        toggledStepId: 'step-1',
        newIsDone: true,
      })
    })

    expect(state!.milestoneReached).toBe(50)
    expect(state!.percentComplete).toBe(50)
    expect(state!.shouldConfetti).toBe(false)
  })

  it('should detect the 75% milestone', () => {
    const { result } = renderHook(() => useStepCompletionRewards())

    const previousSteps = makeSteps(2, 4)
    const updatedSteps = makeSteps(3, 4)

    let state: ReturnType<typeof result.current.processStepToggle>
    act(() => {
      state = result.current.processStepToggle({
        previousSteps,
        updatedSteps,
        toggledStepId: 'step-2',
        newIsDone: true,
      })
    })

    expect(state!.milestoneReached).toBe(75)
    expect(state!.percentComplete).toBe(75)
  })

  it('should detect the 100% milestone and trigger confetti', () => {
    const { result } = renderHook(() => useStepCompletionRewards())

    const previousSteps = makeSteps(3, 4)
    const updatedSteps = makeSteps(4, 4)

    let state: ReturnType<typeof result.current.processStepToggle>
    act(() => {
      state = result.current.processStepToggle({
        previousSteps,
        updatedSteps,
        toggledStepId: 'step-3',
        newIsDone: true,
      })
    })

    expect(state!.milestoneReached).toBe(100)
    expect(state!.isAllComplete).toBe(true)
    expect(state!.shouldConfetti).toBe(true)
  })

  it('should not trigger confetti when unchecking at 100%', () => {
    const { result } = renderHook(() => useStepCompletionRewards())

    const previousSteps = makeSteps(4, 4)
    const updatedSteps = makeSteps(3, 4)

    let state: ReturnType<typeof result.current.processStepToggle>
    act(() => {
      state = result.current.processStepToggle({
        previousSteps,
        updatedSteps,
        toggledStepId: 'step-3',
        newIsDone: false,
      })
    })

    expect(state!.shouldConfetti).toBe(false)
    expect(state!.isAllComplete).toBe(false)
  })

  it('should increment streak when checking steps rapidly', () => {
    const { result } = renderHook(() => useStepCompletionRewards())

    act(() => {
      result.current.processStepToggle({
        previousSteps: makeSteps(0, 4),
        updatedSteps: makeSteps(1, 4),
        toggledStepId: 'step-0',
        newIsDone: true,
      })
    })

    let state: ReturnType<typeof result.current.processStepToggle>
    act(() => {
      state = result.current.processStepToggle({
        previousSteps: makeSteps(1, 4),
        updatedSteps: makeSteps(2, 4),
        toggledStepId: 'step-1',
        newIsDone: true,
      })
    })

    expect(state!.streakCount).toBe(2)
  })

  it('should reset streak on uncheck', () => {
    const { result } = renderHook(() => useStepCompletionRewards())

    act(() => {
      result.current.processStepToggle({
        previousSteps: makeSteps(0, 4),
        updatedSteps: makeSteps(1, 4),
        toggledStepId: 'step-0',
        newIsDone: true,
      })
    })

    let state: ReturnType<typeof result.current.processStepToggle>
    act(() => {
      state = result.current.processStepToggle({
        previousSteps: makeSteps(1, 4),
        updatedSteps: makeSteps(0, 4),
        toggledStepId: 'step-0',
        newIsDone: false,
      })
    })

    expect(state!.streakCount).toBe(0)
  })

  it('should return no milestone when none is crossed', () => {
    const { result } = renderHook(() => useStepCompletionRewards())

    let state: ReturnType<typeof result.current.processStepToggle>
    act(() => {
      state = result.current.processStepToggle({
        previousSteps: makeSteps(0, 10),
        updatedSteps: makeSteps(1, 10),
        toggledStepId: 'step-0',
        newIsDone: true,
      })
    })

    expect(state!.milestoneReached).toBeNull()
    expect(state!.percentComplete).toBe(10)
  })
})
