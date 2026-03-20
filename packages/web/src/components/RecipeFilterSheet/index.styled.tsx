import { styled } from '@mui/material/styles'
import { Box, Button } from '@mui/material'
import { COLORS } from '../../constants/colors'

export const FilterSheetContent = styled(Box)({
  padding: '0 1.25rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
})

export const FilterSectionTitle = styled('span')({
  fontWeight: 600,
  fontSize: '0.75rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  color: COLORS.orange.primary,
})

export const FilterChipGrid = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
  marginTop: '0.5rem',
})

export const ClearButton = styled(Button)({
  alignSelf: 'center',
  borderRadius: '8px',
  borderColor: COLORS.orange.muted,
  color: COLORS.orange.primary,
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    borderColor: COLORS.orange.primary,
    background: COLORS.orange.bgHover,
  },
})
