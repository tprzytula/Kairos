import { useState, useEffect, useCallback } from 'react'

export interface IInternetConnectivityState {
  isOnline: boolean
  wasOffline: boolean
}

export const useInternetConnectivity = () => {
  const [state, setState] = useState<IInternetConnectivityState>({
    isOnline: navigator.onLine,
    wasOffline: false
  })

  const handleOnline = useCallback(() => {
    setState(prev => ({
      isOnline: true,
      wasOffline: prev.wasOffline || !prev.isOnline
    }))
  }, [])

  const handleOffline = useCallback(() => {
    setState(prev => ({
      isOnline: false,
      wasOffline: true
    }))
  }, [])

  const resetOfflineState = useCallback(() => {
    setState(prev => ({
      ...prev,
      wasOffline: false
    }))
  }, [])

  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleOnline, handleOffline])

  return {
    isOnline: state.isOnline,
    wasOffline: state.wasOffline,
    resetOfflineState
  }
}