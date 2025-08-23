import { styled } from '@mui/material/styles'
import { Card } from '@mui/material'

export const AppInfoCardContainer = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: 'none',
  marginTop: '0.75rem',
  marginBottom: '0.5rem',
  alignSelf: 'stretch',
  boxSizing: 'border-box',
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
    transform: 'translateY(-2px) scale(1.005)',
    '&:before': {
      opacity: 1,
    },
  },
}))

export const AppInfoCardContent = styled('div')({
  padding: '1.2rem 1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
})

export const BrandingSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  alignItems: 'flex-start',
})

export const AppBranding = styled('div')(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  lineHeight: '1.2',
  '@media (max-width: 480px)': {
    fontSize: '1.1rem',
  },
}))

export const ProjectName = styled('div')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '600',
  color: theme.palette.text.primary,
  lineHeight: '1.2',
  textAlign: 'right',
  transition: 'all 0.3s ease',
  '@media (max-width: 480px)': {
    fontSize: '0.9rem',
  },
}))

export const VersionText = styled('div')(({ theme }) => ({
  fontSize: '0.72rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  letterSpacing: '0.4px',
  opacity: 0.65,
  transition: 'all 0.3s ease',
  fontFamily: 'monospace',
  '@media (max-width: 480px)': {
    fontSize: '0.68rem',
  },
}))
