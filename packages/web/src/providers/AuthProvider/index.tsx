import React, { ReactNode, useEffect } from 'react'
import { AuthProvider as OidcAuthProvider, useAuth } from 'react-oidc-context'
import { oidcConfig } from '../../config/oidc'

interface AuthProviderProps {
  children: ReactNode
}

const AuthStateMonitor: React.FC = () => {
  const auth = useAuth()

  useEffect(() => {
    console.log('[Auth] Authentication state changed:', {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      hasUser: !!auth.user,
      hasAccessToken: !!auth.user?.access_token,
      hasRefreshToken: !!auth.user?.refresh_token,
      tokenExpiry: auth.user?.expires_at ? new Date(auth.user.expires_at * 1000).toISOString() : 'unknown',
      error: auth.error?.message
    })

    if (auth.user?.expires_at) {
      const expiresAt = new Date(auth.user.expires_at * 1000)
      const now = new Date()
      const timeUntilExpiry = expiresAt.getTime() - now.getTime()
      
      if (timeUntilExpiry > 0) {
        console.log(`[Auth] Token expires in ${Math.round(timeUntilExpiry / 1000 / 60)} minutes`)
      } else {
        console.warn('[Auth] Token appears to be expired')
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, auth.error])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('oidc.')) {
        console.log('[Auth] Authentication storage changed:', {
          key: e.key,
          oldValue: e.oldValue ? 'present' : 'null',
          newValue: e.newValue ? 'present' : 'null'
        })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return null
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <OidcAuthProvider {...oidcConfig}>
      <AuthStateMonitor />
      {children}
    </OidcAuthProvider>
  )
}

export default AuthProvider
