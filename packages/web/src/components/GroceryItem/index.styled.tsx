import { styled } from '@mui/material/styles'
import { Card, CardActionArea, CardContent, CardMedia, CardProps } from '@mui/material'

export const Container = styled(({ isPurchased, ...props }: { isPurchased: boolean } & CardProps) => (
  <Card {...props} />
))(({ isPurchased, theme }: { isPurchased: boolean } & { theme: any }) => ({
  display: 'flex',
  width: '100%',
  borderRadius: '14px',
  minHeight: '72px',
  margin: '2px 0',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  opacity: isPurchased ? 0.65 : 1,
  transition: 'all 200ms ease-in-out',
  position: 'relative',
  boxShadow: isPurchased 
    ? '0 1px 2px rgba(0, 0, 0, 0.05)' 
    : '0 1px 4px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  backgroundColor: isPurchased ? theme.palette.custom?.surfaces?.secondary : '#ffffff',
  '&:hover': {
    boxShadow: isPurchased 
      ? '0 1px 3px rgba(0, 0, 0, 0.06)' 
      : '0 3px 10px rgba(0, 0, 0, 0.12)',
    transform: isPurchased ? 'none' : 'translateY(-0.5px)',
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
  padding: '10px',
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
})

export const Media = styled(CardMedia)(({ theme }) => ({
  width: '60px',
  height: '60px',
  position: 'relative',
  flexShrink: 0,
  borderRadius: '10px',
  marginRight: '10px',
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

export const ActionContainer = styled(CardContent)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '6px 10px !important',
  minWidth: '84px',
  flexShrink: 0,
  borderLeft: '1px solid rgba(0, 0, 0, 0.06)',
  minHeight: '60px',
})

export const QuantityDisplay = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '34px',
  height: '36px',
  gap: '1px',
  padding: '2px 3px',
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  borderRadius: '6px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
})

export const QuantityText = styled('div')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '1.1',
  color: theme.palette.text.primary,
}))

export const UnitText = styled('div')(({ theme }) => ({
  fontSize: '8px',
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