import React, { ReactNode } from 'react'
import { useAuth } from 'react-oidc-context'
import LoginScreen from '../LoginScreen'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth()

  if (auth.isLoading) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: 9999
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    )
  }

  if (auth.error) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: 9999
      }}>
        <div style={{ color: 'white', fontSize: '18px', textAlign: 'center' }}>
          <div>Authentication Error</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>
            {auth.error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}>
        <LoginScreen />
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
