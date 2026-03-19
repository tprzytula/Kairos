import { styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const RecipeCard = styled(Paper)({
  borderRadius: '12px',
  border: '1px solid rgba(249, 115, 22, 0.1)',
  background: 'rgba(249, 115, 22, 0.03)',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.15)',
    transform: 'translateY(-1px)',
  },
})

export const RecipeCardTapArea = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.625rem',
  transition: 'background 0.15s ease',
  '&:hover': {
    background: 'rgba(249, 115, 22, 0.04)',
  },
  '&:active': {
    background: 'rgba(249, 115, 22, 0.09)',
  },
})

export const RecipeThumbnail = styled('img')({
  width: '90px',
  height: '90px',
  objectFit: 'cover',
  borderRadius: '10px',
  flexShrink: 0,
  display: 'block',
})

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

export const RecipePlaceholder = styled(Box)<{ seed?: number }>(({ seed = 0 }) => ({
  width: '90px',
  height: '90px',
  borderRadius: '10px',
  flexShrink: 0,
  background: PLACEHOLDER_GRADIENTS[seed % PLACEHOLDER_GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const RecipeCardBody = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
})

export const RecipeCardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const RecipeInteractiveArea = styled(Box)({
  padding: '0 0.625rem 0.625rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
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

export const SelectableIngredientRow = styled(IngredientItemRow)<{ isDeselected?: boolean }>(({ isDeselected }) => ({
  cursor: 'pointer',
  opacity: isDeselected ? 0.4 : 1,
  transition: 'opacity 0.15s ease',
  borderRadius: '6px',
  padding: '2px 4px',
  '&:hover': {
    background: 'rgba(249, 115, 22, 0.08)',
  },
}))
