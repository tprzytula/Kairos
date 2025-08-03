export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection'

export interface IUseHapticFeedbackReturn {
  triggerHaptic: (type?: HapticFeedbackType) => void
}