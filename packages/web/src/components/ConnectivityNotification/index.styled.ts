import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const NotificationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOffline',
})<{ isOffline?: boolean }>(() => ({
  position: 'fixed',
  bottom: 95,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  width: '100%',
  maxWidth: '280px',
  padding: '0 16px',
  pointerEvents: 'none',
}))

export const NotificationCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<{ severity: 'error' | 'success' }>(({ severity }) => {
  const isError = severity === 'error'
  
  return {
    borderRadius: '12px',
    padding: '0.5rem 0.75rem',
    minHeight: '44px',
    backdropFilter: 'blur(20px)',
    border: isError 
      ? '1px solid rgba(255, 255, 255, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: 'auto',
    cursor: severity === 'success' ? 'pointer' : 'default',
    color: '#ffffff',
    
    background: isError 
      ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.98) 0%, rgba(239, 68, 68, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(5, 150, 105, 0.98) 0%, rgba(16, 185, 129, 0.95) 100%)',
    
    boxShadow: isError
      ? `0 4px 16px rgba(220, 38, 38, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)`
      : `0 4px 16px rgba(5, 150, 105, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)`,

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      borderRadius: '12px 12px 0 0',
      background: isError 
        ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)'
        : 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
      opacity: 0.9,
    },

    ...(severity === 'success' && {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: `0 6px 20px rgba(5, 150, 105, 0.4), 0 3px 12px rgba(0, 0, 0, 0.15)`,
      },
    }),
  }
})

export const NotificationContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  position: 'relative',
  zIndex: 1,
  minHeight: '32px',
})

export const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  '& .MuiSvgIcon-root': {
    fontSize: '16px',
    filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))',
    color: 'rgba(255, 255, 255, 0.95)',
  },
})

export const NotificationText = styled(Box)({
  flex: 1,
  fontSize: '0.8rem',
  fontWeight: '500',
  letterSpacing: '-0.01em',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  color: 'rgba(255, 255, 255, 0.98)',
})

export const CloseButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.35)',
    transform: 'scale(1.1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.95)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
  },
})

export const AnimatedNotificationContainer = styled(NotificationContainer, {
  shouldForwardProp: (prop) => prop !== 'isOffline',
})<{ isOffline?: boolean }>({
  '@keyframes slideInFromBottom': {
    '0%': {
      transform: 'translateY(100%) translateX(-50%) scale(0.95)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0) translateX(-50%) scale(1)',
      opacity: 1,
    },
  },
  '@keyframes slideOutToBottom': {
    '0%': {
      transform: 'translateY(0) translateX(-50%) scale(1)',
      opacity: 1,
    },
    '100%': {
      transform: 'translateY(100%) translateX(-50%) scale(0.95)',
      opacity: 0,
    },
  },
  animation: 'slideInFromBottom 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  '&.exit': {
    animation: 'slideOutToBottom 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  },
})