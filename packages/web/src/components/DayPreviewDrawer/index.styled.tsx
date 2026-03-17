import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

export const DrawerContent = styled(Box)({
  padding: '1.25em',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  paddingBottom: 'max(1.25em, env(safe-area-inset-bottom))',
})

export const DrawerHeader = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.1rem',
  color: '#1d4ed8',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const DateLabel = styled(Typography)({
  fontSize: '0.9rem',
  color: '#6b7280',
  fontWeight: 500,
  marginTop: '2px',
  marginBottom: '8px',
})

export const SectionLabel = styled(Typography)<{ color?: string; borderColor?: string }>(
  ({ color = '#1d4ed8', borderColor = 'rgba(226, 232, 240, 0.9)' }) => ({
    fontSize: '0.7rem',
    fontWeight: 700,
    color,
    marginTop: '12px',
    marginBottom: '6px',
    paddingTop: '12px',
    borderTop: `1px solid ${borderColor}`,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  })
)
