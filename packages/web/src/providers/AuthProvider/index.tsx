import React, { ReactNode, useEffect } from 'react'
import { AuthProvider as OidcAuthProvider, useAuth } from 'react-oidc-context'
import { oidcConfig } from '../../config/oidc'

interface AuthProviderProps {
  children: ReactNode
}

const TokenRefreshHandler: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth()

  useEffect(() => {
    const attemptTokenRefresh = async () => {
      if (auth.isLoading || auth.isAuthenticated) {
        return
      }

      if (auth.user) {
        try {
          await auth.signinSilent()
        } catch (error) {
          console.warn('Silent token refresh failed on app startup:', error)
        }
      }
    }

    attemptTokenRefresh()
  }, [auth.isLoading, auth.isAuthenticated, auth.user])

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') {
        return
      }

      if (auth.isLoading || auth.isAuthenticated) {
        return
      }

      if (auth.user) {
        try {
          await auth.signinSilent()
        } catch (error) {
          console.warn('Token refresh on app visibility failed:', error)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user])

  return <>{children}</>
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <OidcAuthProvider {...oidcConfig}>
      <TokenRefreshHandler>
        {children}
      </TokenRefreshHandler>
    </OidcAuthProvider>
  )
}

export default AuthProvider
