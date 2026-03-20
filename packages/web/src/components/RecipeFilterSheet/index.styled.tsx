import { styled } from '@mui/material/styles'
import { Box, Button } from '@mui/material'

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
  color: '#f97316',
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
  borderColor: 'rgba(249, 115, 22, 0.4)',
  color: '#f97316',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    borderColor: '#f97316',
    background: 'rgba(249, 115, 22, 0.05)',
  },
})
