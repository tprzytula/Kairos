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

export const HeroWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '200px',
  borderRadius: '16px',
  overflow: 'hidden',
})

export const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
})

export const HeroPlaceholder = styled(Box)<{ seed: number }>(({ seed }) => ({
  width: '100%',
  height: '100%',
  background: GRADIENTS[seed % GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const HeroPlaceholderInitial = styled('span')({
  fontSize: '4rem',
  fontWeight: 800,
  color: 'rgba(255,255,255,0.6)',
  userSelect: 'none',
  lineHeight: 1,
})

export const HeroOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '1rem 1.1rem 0.9rem',
  gap: '0.35rem',
})

export const HeroLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.65rem',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  '& .MuiSvgIcon-root': {
    fontSize: '0.75rem',
  },
})

export const HeroTitle = styled('div')({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#fff',
  lineHeight: '1.25',
  letterSpacing: '-0.01em',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
})

export const AdditionalMeals = styled('div')({
  display: 'flex',
  gap: '0.4rem',
  flexWrap: 'wrap',
  paddingTop: '0.1rem',
})

export const AdditionalMealPill = styled('span')({
  fontSize: '0.65rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.85)',
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(6px)',
  borderRadius: '20px',
  padding: '0.15rem 0.55rem',
  border: '1px solid rgba(255,255,255,0.22)',
})

export const EmptyState = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  padding: '1.2rem',
}))

// Legacy exports kept to avoid breaking any residual imports
export const MealRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
})

export const MealThumbnail = styled('img')({
  width: '48px',
  height: '48px',
  borderRadius: '8px',
  objectFit: 'cover',
  flexShrink: 0,
})

export const MealThumbnailPlaceholder = styled(Box)<{ seed: number }>(({ seed }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '8px',
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
