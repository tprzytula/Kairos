export interface PWAUpdateState {
  isUpdateAvailable: boolean
  isUpdating: boolean
  updateError: string | null
  isOnline: boolean
}

export interface PWAUpdateActions {
  checkForUpdate: () => Promise<void>
  installUpdate: () => void
  dismissUpdate: () => void
}

export interface UsePWAUpdateReturn extends PWAUpdateState, PWAUpdateActions {}