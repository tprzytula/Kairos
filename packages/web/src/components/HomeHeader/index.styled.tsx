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
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  padding: '1.25rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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

export const BrandingSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  alignItems: 'flex-start',
  flexShrink: 0,
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
  fontSize: '0.72rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  letterSpacing: '0.4px',
  opacity: 0.65,
  fontFamily: 'monospace',
}))

export const GreetingSection = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto auto',
  gridTemplateAreas: `
    "icon greeting"
    ". date"
  `,
  columnGap: '0.5rem',
  rowGap: '0.125rem',
  alignItems: 'center',
  flex: 1,
  justifyContent: 'center',
})

export const GreetingText = styled('div')(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  letterSpacing: '0.5px',
  '@media (max-width: 480px)': {
    fontSize: '1rem',
  },
}))

export const DateText = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
  opacity: 0.8,
  '@media (max-width: 480px)': {
    fontSize: '0.75rem',
  },
}))

export const RightSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.35rem',
  flexShrink: 0,
})

export const ProjectName = styled('div')(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: '600',
  color: theme.palette.text.primary,
  lineHeight: '1.2',
  textAlign: 'right',
  '@media (max-width: 480px)': {
    fontSize: '0.8rem',
  },
}))
