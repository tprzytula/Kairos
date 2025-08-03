export interface PWAUpdateNotificationProps {
  // Component doesn't need props as it manages its own state
}

export interface UpdateNotificationState {
  isVisible: boolean
  message: string
  type: 'info' | 'error' | 'success'
}