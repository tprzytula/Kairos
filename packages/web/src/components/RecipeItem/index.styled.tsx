import { styled } from '@mui/material/styles'
import { Box, Paper, Typography, Chip } from '@mui/material'
import { PLACEHOLDER_GRADIENTS } from '../../constants/colors'

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
