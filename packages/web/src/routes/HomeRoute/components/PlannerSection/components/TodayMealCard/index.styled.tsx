import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

export const MealRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
})

export const MealThumbnail = styled('img')({
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  objectFit: 'cover',
  flexShrink: 0,
})

export const MealThumbnailPlaceholder = styled(Box)<{ seed: number }>(({ seed }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  flexShrink: 0,
  background: GRADIENTS[seed % GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255,255,255,0.85)',
  fontWeight: 700,
  fontSize: '0.85rem',
  userSelect: 'none',
}))

export const MealName = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  lineHeight: '1.3',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}))

export const AdditionalMeals = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
}))
