import { styled } from '@mui/material/styles'
import { Box, Card } from '@mui/material'

export const DashboardHeaderContainer = styled(Box)({
  padding: '1rem 0.75rem 0.75rem 0.75rem',
  width: '100%',
  maxWidth: 'none',
  alignSelf: 'stretch',
  boxSizing: 'border-box',
  '@media (max-width: 480px)': {
    padding: '0.75rem 0.5rem 0.6rem 0.5rem',
  },
})

export const DashboardHeaderCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  padding: '1.25rem',
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
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px) scale(1.01)',
    '&:before': {
      opacity: 1,
    },
  },
}))

export const GreetingSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})

export const GreetingText = styled('div')(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  letterSpacing: '0.5px',
  transition: 'color 0.3s ease',
  '@media (max-width: 480px)': {
    fontSize: '1rem',
  },
}))

export const DateText = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
  marginLeft: '2.1rem',
  opacity: 0.8,
  transition: 'opacity 0.3s ease',
  '@media (max-width: 480px)': {
    fontSize: '0.75rem',
    marginLeft: '2.1rem',
  },
}))

export const BrandingSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.25rem',
})

export const AppBranding = styled('div')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '@media (max-width: 480px)': {
    fontSize: '0.9rem',
  },
}))

export const VersionText = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: '500',
  color: '#4ade80',
  letterSpacing: '0.25px',
  display: 'flex',
  alignItems: 'center',
  opacity: 0.8,
  transition: 'opacity 0.3s ease',
  '@media (max-width: 480px)': {
    fontSize: '0.65rem',
  },
}))