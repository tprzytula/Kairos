import { useState, useEffect } from 'react'
import { VersionInfo } from '../../types/version'
import { UseVersionResult } from './types'

export const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.startsWith('192.168.') ||
         window.location.hostname.endsWith('.local')
}

export const useVersion = (): UseVersionResult => {
  const [version, setVersion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // If running on localhost, return 'localhost' immediately
        if (isLocalhost()) {
          setVersion('localhost')
          return
        }
        
        const response = await fetch('/version.json')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch version: ${response.status}`)
        }
        
        const versionInfo: VersionInfo = await response.json()
        setVersion(`v${versionInfo.version}`)
      } catch (err) {
        console.warn('Failed to fetch version from version.json:', err)
        setError('Failed to load version')
        setVersion(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVersion()
  }, [])

  return { version, isLoading, error }
}