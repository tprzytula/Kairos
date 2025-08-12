import { useState, useEffect } from 'react'
import { VersionInfo } from '../../../types/version'
import { UseVersionResult } from '../types'

// Mock function to control localhost detection in tests
export const isLocalhost = jest.fn(() => false)

export const useVersion = (): UseVersionResult => {
  const [version, setVersion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if running on localhost
        if (isLocalhost()) {
          setVersion('localhost')
          setIsLoading(false)
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