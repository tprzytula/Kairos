import { styled } from '@mui/material/styles'
import { Card, CardActionArea, CardContent, CardMedia, CardProps } from '@mui/material'
import { SwipeAction } from 'react-swipeable-list'

export const Container = styled(({ isPurchased, ...props }: { isPurchased: boolean } & CardProps) => (
  <Card {...props} />
))(({ isPurchased, theme }: { isPurchased: boolean } & { theme: any }) => ({
  display: 'flex',
  width: '100%',
  borderRadius: '16px',
  minHeight: '80px',
  margin: '4px 0',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  opacity: isPurchased ? 0.65 : 1,
  transition: 'all 200ms ease-in-out',
  position: 'relative',
  boxShadow: isPurchased 
    ? '0 1px 3px rgba(0, 0, 0, 0.06)' 
    : '0 2px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  backgroundColor: isPurchased ? theme.palette.custom?.surfaces?.secondary : '#ffffff',
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
    backgroundColor: theme.palette.text.secondary,
    borderRadius: '1px',
  } : {},
}))

export const ActionArea = styled(CardActionArea)({
  display: 'flex',
  padding: '12px',
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
})

export const Media = styled(CardMedia)(({ theme }) => ({
  width: '68px',
  height: '68px',
  position: 'relative',
  flexShrink: 0,
  borderRadius: '12px',
  marginRight: '12px',
  backgroundColor: theme.palette.custom?.surfaces?.secondary,
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

export const Name = styled('div')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'left',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: '1.4',
  color: theme.palette.text.primary,
  letterSpacing: '-0.005em',
}))

export const SwipeableDeleteAction = styled(SwipeAction)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: 'white',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '16px',
}))

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
  minHeight: '68px', // Fixed height to ensure consistent alignment
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

export const QuantityText = styled('div')(({ theme }) => ({
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '1.1',
  color: theme.palette.text.primary,
}))

export const UnitText = styled('div')(({ theme }) => ({
  fontSize: '9px',
  fontWeight: 500,
  lineHeight: '1',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
}))

export const DeleteButtonIcon = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
})