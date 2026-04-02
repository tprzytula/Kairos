import { IStep } from '../../api/toDoList/retrieve/types'

export interface StepCompletionEvent {
  previousSteps: IStep[]
  updatedSteps: IStep[]
  toggledStepId: string
  newIsDone: boolean
}

export interface StepRewardState {
  milestoneReached: 50 | 75 | 100 | null
  isAllComplete: boolean
  streakCount: number
  shouldConfetti: boolean
  percentComplete: number
}
