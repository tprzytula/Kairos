import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

export const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem 1.25rem 1rem',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  flexShrink: 0,
})

export const DrawerHeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

export const DrawerIconBox = styled(Box)({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: 'white',
  },
})

export const DrawerTitleGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
})

export const DrawerTitle = styled('span')({
  fontSize: '1.1rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '0.3px',
})

export const DrawerSubtitle = styled(Typography)({
  fontSize: '0.8rem',
  color: '#6b7280',
  fontWeight: 500,
})

export const DrawerContent = styled(Box)({
  padding: '0.875rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
})

export const SectionLabel = styled(Typography)<{ color?: string }>(
  ({ color = '#1d4ed8' }) => ({
    fontSize: '0.7rem',
    fontWeight: 700,
    color,
    marginTop: '12px',
    marginBottom: '6px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(226, 232, 240, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  })
)
