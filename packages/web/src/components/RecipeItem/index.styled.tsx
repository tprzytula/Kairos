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

export const RecipeCoverImage = styled('img')({
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '10px 10px 0 0',
  margin: '-1rem -1rem 0',
  display: 'block',
  width: 'calc(100% + 2rem)',
})

export const IngredientList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  paddingTop: '0.25rem',
})

export const IngredientItemRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const IngredientIcon = styled('img')({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
})
