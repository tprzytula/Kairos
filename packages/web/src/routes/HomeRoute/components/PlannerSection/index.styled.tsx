import { styled } from '@mui/material/styles'
import { Box, Card, CardContent } from '@mui/material'

export const MiniCardsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto auto',
  gap: '0.875rem',
  width: '100%',
})

export const MiniCard = styled(Card)({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '110px',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)',
    opacity: 1,
  },
  '&:active': {
    transform: 'scale(0.985)',
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.06)',
  },
})

export const MiniCardContent = styled(CardContent)({
  padding: '0.875rem',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  '&:last-child': {
    paddingBottom: '0.875rem',
  },
})

export const MiniCardHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  marginBottom: '0.25rem',
})

export const MiniCardIcon = styled('div')({
  '& .MuiSvgIcon-root': {
    fontSize: '0.85rem',
    padding: '0.2rem',
    borderRadius: '5px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    color: 'white',
    display: 'block',
  },
})

export const MiniCardTitle = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}))

export const MiniCardBody = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  overflow: 'hidden',
})

export const TaskCarouselWrapper = styled('div')({
  overflow: 'hidden',
  position: 'relative',
  flex: 1,
})

export const TaskCarouselTrack = styled('div')<{ $offset: number }>(({ $offset }) => ({
  display: 'flex',
  width: '200%',
  transform: `translateX(${-$offset * 50}%)`,
  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
}))

export const TaskCarouselSlide = styled('div')({
  width: '50%',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

export const TaskCarouselDots = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '4px',
  paddingTop: '0.35rem',
})

export const TaskCarouselDot = styled('div')<{ $active: boolean }>(({ $active }) => ({
  width: $active ? 12 : 5,
  height: 5,
  borderRadius: '3px',
  background: $active ? '#667eea' : '#d1d5db',
  transition: 'all 0.25s ease',
  cursor: 'pointer',
}))

// Kept for backward compatibility with existing tests
export const CompactItemList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
})

export const MoreItemsIndicator = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: '0.75rem 1rem',
  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.04) 0%, rgba(99, 102, 241, 0.02) 100%)',
  borderRadius: '8px',
  border: '1px solid rgba(14, 165, 233, 0.12)',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    borderColor: 'rgba(14, 165, 233, 0.2)',
    color: theme.palette.text.primary,
  },
}))
