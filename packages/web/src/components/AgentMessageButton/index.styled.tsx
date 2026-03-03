import { styled } from '@mui/material/styles'
import { Box, Card } from '@mui/material'

export const AgentMessageButtonContainer = styled(Box)({
  padding: '0 0 0.5rem 0',
  width: '100%',
  alignSelf: 'stretch',
  boxSizing: 'border-box',
})

export const AgentMessageCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  padding: '1rem 1.25rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 1,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
}))

export const AgentMessageLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

export const AgentIconBox = styled(Box)({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: 'white',
  },
})

export const AgentMessageLabel = styled('span')(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: '600',
  color: theme.palette.text.primary,
  letterSpacing: '0.3px',
}))

export const AgentMessageRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const MessageCountBadge = styled('span')({
  fontSize: '0.7rem',
  fontWeight: '600',
  color: 'white',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '0.15rem 0.45rem',
  borderRadius: '10px',
  minWidth: '1.25rem',
  textAlign: 'center',
  lineHeight: 1.4,
})
