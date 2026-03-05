import { styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const RecipeCard = styled(Paper)({
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  background: 'rgba(102, 126, 234, 0.03)',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const RecipeCardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const RecipeCardActions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})
