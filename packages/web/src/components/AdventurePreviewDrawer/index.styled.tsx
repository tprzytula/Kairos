import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { PLACEHOLDER_GRADIENTS } from '../../constants/colors'

const ADVENTURE_TEAL = '#0891b2'

export const HeroImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '12px',
  display: 'block',
})

export const HeroPlaceholder = styled(Box)<{ seed?: number }>(({ seed = 0 }) => ({
  width: '100%',
  height: '200px',
  borderRadius: '12px',
  background: PLACEHOLDER_GRADIENTS[seed % PLACEHOLDER_GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const AdventureName = styled('h2')({
  margin: 0,
  fontSize: '1.35rem',
  fontWeight: 700,
  color: 'rgba(0, 0, 0, 0.87)',
  lineHeight: 1.3,
})

export const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '0.5rem',
})

export const SectionLabel = styled('span')({
  fontWeight: 600,
  fontSize: '0.75rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  color: ADVENTURE_TEAL,
})

export const DetailRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'rgba(0, 0, 0, 0.6)',
  fontSize: '0.9rem',
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    color: ADVENTURE_TEAL,
  },
})

export const NotesText = styled('p')({
  margin: 0,
  fontSize: '0.95rem',
  color: 'rgba(0, 0, 0, 0.75)',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
})

export const NoNotesText = styled('p')({
  margin: 0,
  fontSize: '0.875rem',
  color: 'rgba(0, 0, 0, 0.35)',
  fontStyle: 'italic',
})

export const Footer = styled(Box)({
  padding: '0.5rem 1.25rem',
  paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})
