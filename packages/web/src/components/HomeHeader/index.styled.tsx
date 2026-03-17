import { styled } from '@mui/material/styles'
import { Box, Card } from '@mui/material'

export const HomeHeaderContainer = styled(Box)({
  padding: '0.5rem 0 0.5rem 0',
  width: '100%',
  boxSizing: 'border-box',
})

export const HomeHeaderCard = styled(Card)({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden',
  padding: '1rem 1.25rem',
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  gap: '0.5rem',
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

export const BrandingSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
  alignItems: 'flex-start',
})

export const AppBranding = styled('div')({
  fontSize: '1.2rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '0.5px',
  lineHeight: '1.2',
  '@media (max-width: 480px)': {
    fontSize: '1.1rem',
  },
})

export const VersionText = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  letterSpacing: '0.3px',
  opacity: 0.6,
  fontFamily: 'monospace',
}))

export const ProjectName = styled('div')(({ theme }) => ({
  fontSize: '0.72rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  opacity: 0.75,
  maxWidth: '120px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const GreetingSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.1rem',
})

export const GreetingRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
})

export const GreetingText = styled('div')(({ theme }) => ({
  fontSize: '1.05rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  letterSpacing: '0.3px',
  '@media (max-width: 480px)': {
    fontSize: '0.95rem',
  },
}))

export const DateText = styled('div')(({ theme }) => ({
  fontSize: '0.78rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
  opacity: 0.75,
  textAlign: 'center',
}))

export const AvatarSection = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
})
