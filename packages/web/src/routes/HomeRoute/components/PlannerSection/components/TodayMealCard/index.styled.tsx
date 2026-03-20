import { styled, keyframes } from '@mui/material/styles'
import { Box } from '@mui/material'
import { PLACEHOLDER_GRADIENTS } from '../../../../../../constants/placeholderGradients'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

// Carousel outer container — clips slides
export const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '16px',
  height: '200px',
  cursor: 'grab',
  '&:active': { cursor: 'grabbing' },
})

// Sliding track
export const CarouselTrack = styled(Box)<{ offset: number }>(({ offset }) => ({
  display: 'flex',
  height: '100%',
  transform: `translateX(-${offset * 100}%)`,
  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
}))

// Each slide takes full width
export const CarouselSlide = styled(Box)({
  flexShrink: 0,
  width: '100%',
  height: '100%',
  position: 'relative',
})

export const CarouselDots = styled(Box)({
  position: 'absolute',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '5px',
  zIndex: 3,
})

export const CarouselDot = styled('button')<{ active: boolean }>(({ active }) => ({
  width: active ? '18px' : '6px',
  height: '6px',
  borderRadius: '3px',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
  transition: 'all 0.25s ease',
  flexShrink: 0,
}))

export const HeroWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
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
  background: PLACEHOLDER_GRADIENTS[seed % PLACEHOLDER_GRADIENTS.length],
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

export const MealPlanBadge = styled(Box)({
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: 4,
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.6rem',
  fontWeight: 700,
  color: 'white',
  background: 'rgba(0,0,0,0.42)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderRadius: '20px',
  padding: '0.25rem 0.6rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  '& .MuiSvgIcon-root': {
    fontSize: '0.7rem',
  },
})

export const EmptyState = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  padding: '1.2rem',
}))

export const SkeletonContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '200px',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: theme.palette.custom?.surfaces?.secondary || '#f5f5f5',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
    backgroundSize: '200px 100%',
    animation: `${shimmer} 1.5s infinite`,
  },
}))

export const SkeletonBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: 1,
  width: '80px',
  height: '20px',
  borderRadius: '20px',
  backgroundColor: theme.palette.action.selected,
}))

export const SkeletonOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '1rem 1.1rem 0.9rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
})

export const SkeletonLine = styled(Box)(({ theme }) => ({
  height: '10px',
  borderRadius: '4px',
  backgroundColor: theme.palette.action.selected,
}))

export const SkeletonTitle = styled(Box)(({ theme }) => ({
  height: '20px',
  borderRadius: '4px',
  backgroundColor: theme.palette.action.selected,
}))
