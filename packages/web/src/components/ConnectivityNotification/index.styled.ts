import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const NotificationContainer = styled(Box)({
  position: 'fixed',
  bottom: 110,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  width: '100%',
  maxWidth: '400px',
  padding: '0 16px',
  pointerEvents: 'none',
})

export const NotificationCard = styled(Box)<{ severity: 'error' | 'success' }>(({ severity }) => {
  const isError = severity === 'error'
  
  return {
    borderRadius: '16px',
    padding: '1rem 1.25rem',
    backdropFilter: 'blur(20px)',
    border: isError 
      ? '2px solid rgba(255, 255, 255, 0.4)'
      : '2px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: 'auto',
    cursor: severity === 'success' ? 'pointer' : 'default',
    color: '#ffffff',
    
    background: isError 
      ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.98) 0%, rgba(239, 68, 68, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(5, 150, 105, 0.98) 0%, rgba(16, 185, 129, 0.95) 100%)',
    
    boxShadow: isError
      ? `
          0 12px 40px rgba(220, 38, 38, 0.4),
          0 4px 16px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.1)
        `
      : `
          0 12px 40px rgba(5, 150, 105, 0.4),
          0 4px 16px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.1)
        `,

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      borderRadius: '16px 16px 0 0',
      background: isError 
        ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)'
        : 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
      opacity: 0.9,
    },

    ...(severity === 'error' && {
      animation: 'pulseError 2s ease-in-out infinite',
      '@keyframes pulseError': {
        '0%, 100%': {
          boxShadow: `
            0 12px 40px rgba(220, 38, 38, 0.4),
            0 4px 16px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1)
          `,
        },
        '50%': {
          boxShadow: `
            0 16px 48px rgba(220, 38, 38, 0.6),
            0 6px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            0 0 0 2px rgba(255, 255, 255, 0.2)
          `,
        },
      },
    }),

    ...(severity === 'success' && {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: `
          0 16px 48px rgba(5, 150, 105, 0.5),
          0 6px 20px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          0 0 0 2px rgba(255, 255, 255, 0.2)
        `,
      },
    }),
  }
})

export const NotificationContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  position: 'relative',
  zIndex: 1,
})

export const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(8px)',
  border: '2px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
    filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))',
    color: 'rgba(255, 255, 255, 0.95)',
  },
})

export const NotificationText = styled(Box)({
  flex: 1,
  fontSize: '0.95rem',
  fontWeight: '600',
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

export const AnimatedNotificationContainer = styled(NotificationContainer)({
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