import { styled } from '@mui/material/styles'
import { Box, Card } from '@mui/material'

export const HomeHeaderContainer = styled(Box)({
  padding: '0.5rem 0 0.5rem 0',
  width: '100%',
  boxSizing: 'border-box',
})

export const HomeHeaderCard = styled(Card)({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.10)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  position: 'relative',
  overflow: 'hidden',
  padding: '1rem 1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 1,
  },
})

export const GreetingSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
})

export const GreetingText = styled('div')(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  letterSpacing: '0.2px',
  '@media (max-width: 480px)': {
    fontSize: '1rem',
  },
}))

export const DateText = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
  opacity: 0.75,
}))
