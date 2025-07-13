import { styled } from '@mui/material/styles'
import { Card, CardActionArea, CardContent, CardMedia, CardProps } from '@mui/material'
import { SwipeAction } from 'react-swipeable-list'

export const Container = styled(({ isPurchased, ...props }: { isPurchased: boolean } & CardProps) => (
  <Card {...props} />
))(({ isPurchased }: { isPurchased: boolean }) => ({
  display: 'flex',
  width: '100%',
  borderRadius: '16px',
  minHeight: '72px',
  margin: '8px 0',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  opacity: isPurchased ? 0.65 : 1,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  boxShadow: isPurchased 
    ? '0 1px 3px rgba(0, 0, 0, 0.06)' 
    : '0 2px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  backgroundColor: isPurchased ? '#f8f9fa' : '#ffffff',
  '&:hover': {
    boxShadow: isPurchased 
      ? '0 1px 3px rgba(0, 0, 0, 0.06)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: isPurchased ? 'none' : 'translateY(-1px)',
  },
  '&::after': isPurchased ? {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '2px',
    backgroundColor: '#999',
    borderRadius: '1px',
  } : {},
}))

export const ActionArea = styled(CardActionArea)({
  display: 'flex',
  padding: '16px',
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
})

export const Media = styled(CardMedia)(({
  width: '56px',
  height: '56px',
  position: 'relative',
  flexShrink: 0,
  borderRadius: '12px',
  marginRight: '16px',
  backgroundColor: '#f5f5f5',
  border: '1px solid rgba(0, 0, 0, 0.08)',
}))

export const Content = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  flexGrow: 1,
  overflow: 'hidden',
  minWidth: 0,
  padding: '0 !important',
})

export const Name = styled('div')({
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'left',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: '1.4',
  color: '#1a1a1a',
  letterSpacing: '-0.005em',
})

export const SwipeableDeleteAction = styled(SwipeAction)({
  backgroundColor: '#FF5E69',
  color: 'white',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '16px',
})

export const ActionContainer = styled(CardContent)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '8px 12px !important',
  minWidth: '90px',
  flexShrink: 0,
  borderLeft: '1px solid rgba(0, 0, 0, 0.06)',
  minHeight: '56px', // Fixed height to ensure consistent alignment
})

export const QuantityDisplay = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px', // Fixed width instead of minWidth to ensure consistent button positioning
  height: '40px', // Fixed height for consistent alignment
  gap: '1px',
  padding: '2px 4px',
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  borderRadius: '6px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
})

export const QuantityText = styled('div')({
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '1.1',
  color: '#1a1a1a',
})

export const UnitText = styled('div')({
  fontSize: '9px',
  fontWeight: 500,
  lineHeight: '1',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
})

export const DeleteButtonIcon = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
})