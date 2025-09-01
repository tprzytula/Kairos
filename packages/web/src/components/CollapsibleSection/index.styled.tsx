import styled from '@emotion/styled'
import { Box, Chip, Typography } from '@mui/material'

export const SectionWrapper = styled(Box)({
  marginBottom: 2,
})

export const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 8px',
  background: '#ffffff',
  borderRadius: 8,
  boxShadow: '0 2px 6px rgba(102, 126, 234, 0.05)',
  border: '1px solid rgba(102,126,234,0.12)',
  backgroundClip: 'padding-box, border-box',
  backgroundImage:
    'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%), linear-gradient(180deg, rgba(102,126,234,0.18), rgba(124,58,237,0.10))',
  cursor: 'pointer',
  transition: 'all 200ms ease-in-out',
  '&:hover': {
    transform: 'translateY(-0.25px)',
    boxShadow: '0 4px 10px rgba(102, 126, 234, 0.08)',
  },
})

export const SectionTitle = styled(Typography)({
  fontWeight: 500,
  color: '#111827',
  fontSize: '0.8rem',
  letterSpacing: '-0.01em',
})

export const ItemCountChip = styled(Chip)({
  height: 14,
  borderRadius: 999,
  fontSize: 8,
  paddingInline: 1,
  backgroundColor: '#eef2ff',
  color: '#4f46e5',
  fontWeight: 700,
  border: '1px solid rgba(79,70,229,0.22)',
})

export const SectionContent = styled(Box)({
  paddingTop: 1,
})

export const SectionIconCircle = styled(Box, {
  shouldForwardProp: (prop) => !['bg', 'fg'].includes(prop),
})<{ bg?: string; fg?: string }>(({ bg = '#eef2ff', fg = '#4f46e5' }) => ({
  width: 18,
  height: 18,
  borderRadius: '50%',
  backgroundColor: bg,
  color: fg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  fontWeight: 700,
  boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.04)',
}))

export const ChevronBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>(({ expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 120ms ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  opacity: 0.7,
}))
