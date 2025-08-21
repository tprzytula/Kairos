import { styled } from '@mui/material/styles'
import { Box, Card } from '@mui/material'

export const DashboardHeaderContainer = styled(Box)({
  padding: '0.75rem 0 0.5rem 0',
  width: '100%',
  maxWidth: 'none',
  alignSelf: 'stretch',
  boxSizing: 'border-box'
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
  opacity: 0.8,
  transition: 'opacity 0.3s ease',
  '@media (max-width: 480px)': {
    fontSize: '0.75rem',
  },
}))

export const BrandingSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
})

export const UserSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

export const UserAvatar = styled('div')({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '50%',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: '2px solid rgba(102, 126, 234, 0.2)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: 'white',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover': {
    borderColor: 'rgba(102, 126, 234, 0.6)',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    '&::after': {
      content: '"Click to logout"',
      position: 'absolute',
      bottom: '-2.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      whiteSpace: 'nowrap',
      opacity: 1,
      pointerEvents: 'none',
      zIndex: 1000,
    },
  },
  '&:focus': {
    outline: '2px solid rgba(102, 126, 234, 0.6)',
    outlineOffset: '2px',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
})

export const BrandingInfo = styled('div')({
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
  color: theme.palette.text.secondary,
  letterSpacing: '0.25px',
  display: 'flex',
  alignItems: 'center',
  opacity: 0.7,
  transition: 'all 0.3s ease',
  '@media (max-width: 480px)': {
    fontSize: '0.65rem',
  },
}))