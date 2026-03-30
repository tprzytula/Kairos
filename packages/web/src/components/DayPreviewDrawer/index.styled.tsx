import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
export {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
} from '../DrawerHeader/index.styled'

export const DAY_PREVIEW_GRADIENT = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'

export const DrawerTitleGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
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

export const TimeBadge = styled('span')({
  fontSize: '0.6rem',
  fontWeight: 600,
  color: '#6366f1',
  backgroundColor: '#eef2ff',
  padding: '1px 5px',
  borderRadius: '4px',
  marginRight: '4px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
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
