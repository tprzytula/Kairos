import { styled } from '@mui/material/styles'
import { Box, Paper, Typography, Chip } from '@mui/material'

export const RecipeCard = styled(Paper)({
  borderRadius: '14px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
})

export const RecipeCardTapArea = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease',
  '&:active': {
    transform: 'scale(0.97)',
  },
})

export const RecipeThumbnail = styled('img')({
  width: '100%',
  aspectRatio: '4 / 5',
  objectFit: 'cover',
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
  width: '100%',
  aspectRatio: '4 / 5',
  background: PLACEHOLDER_GRADIENTS[seed % PLACEHOLDER_GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const RecipeCardBody = styled(Box)({
  padding: '0.625rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

export const RecipeName = styled(Typography)({
  fontWeight: 600,
  fontSize: '0.875rem',
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

export const RecipeMetaRow = styled(Box)({
  display: 'flex',
  gap: '0.3rem',
  flexWrap: 'wrap',
})

export const MetaChip = styled(Chip)({
  fontWeight: 500,
  fontSize: '0.65rem',
  height: '20px',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
})
