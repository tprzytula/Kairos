import styled from '@emotion/styled'
import { Box, Chip, Typography } from '@mui/material'

export const CategoryWrapper = styled(Box)({
  marginBottom: 8,
})

export const CategoryHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
  borderRadius: 14,
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.06)',
  border: '1px solid rgba(102,126,234,0.12)',
  backgroundClip: 'padding-box, border-box',
  backgroundImage:
    'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%), linear-gradient(180deg, rgba(102,126,234,0.18), rgba(124,58,237,0.10))',
  cursor: 'pointer',
  transition: 'all 200ms ease-in-out',
  '&:hover': {
    transform: 'translateY(-0.5px)',
    boxShadow: '0 6px 14px rgba(102, 126, 234, 0.12)',
  },
}))

export const CategoryTitle = styled(Typography)({
  fontWeight: 600,
  color: '#111827',
  fontSize: '0.95rem',
  letterSpacing: '-0.01em',
})

export const ItemCountChip = styled(Chip)({
  height: 18,
  borderRadius: 999,
  fontSize: 10,
  paddingInline: 2,
  backgroundColor: '#eef2ff',
  color: '#4f46e5',
  fontWeight: 700,
  border: '1px solid rgba(79,70,229,0.22)',
})

export const CategoryContent = styled(Box)({
  paddingTop: 4,
})

export const CategoryIconCircle = styled(Box)<{ bg?: string; fg?: string }>(({ bg = '#eef2ff', fg = '#4f46e5' }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: bg,
  color: fg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 700,
  boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.04)',
}))

export const ChevronBox = styled(Box)<{ expanded: boolean }>(({ expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 200ms ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  opacity: 0.7,
}))