import React, { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router'

const AuthCallback: React.FC = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('AuthCallback - Auth state:', { 
      isLoading: auth.isLoading, 
      isAuthenticated: auth.isAuthenticated, 
      error: auth.error?.message 
    })

    // Wait for loading to finish
    if (auth.isLoading) {
      return
    }

    // If authentication succeeded, redirect to home
    if (auth.isAuthenticated) {
      console.log('Authentication successful, redirecting to home')
      navigate('/')
      return
    }

    // If there's an error, log it and redirect
    if (auth.error) {
      console.error('Authentication callback error:', auth.error)
      navigate('/')
      return
    }

    // If not loading, not authenticated, and no error, something went wrong
    console.warn('Unexpected auth state during callback')
  }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate])

  if (auth.error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px', textAlign: 'center' }}>
          <div>Authentication Error</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>
            {auth.error.message}
          </div>
          <div style={{ fontSize: '12px', marginTop: '16px', opacity: 0.8 }}>
            Redirecting to home...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ color: 'white', fontSize: '18px', textAlign: 'center' }}>
        <div>Completing authentication...</div>
        <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>
          Please wait while we sign you in
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
