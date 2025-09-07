import { styled } from '@mui/material/styles'
import { Card, CardActionArea, CardContent, CardMedia, CardProps } from '@mui/material'

export const Container = styled((props: CardProps) => (
  <Card {...props} />
))({
  display: 'flex',
  width: '100%',
  borderRadius: '14px',
  minHeight: '72px',
  margin: '2px 0',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  transition: 'all 200ms ease-in-out',
  position: 'relative',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  backgroundColor: '#ffffff',
  '&:hover': {
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-0.5px)',
  },
})

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
  marginRight: '14px',
  backgroundColor: theme.palette.custom?.surfaces?.secondary,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
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

export const MetaInfo = styled('div')(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  marginTop: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const IconContainer = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  color: 'rgba(0, 0, 0, 0.5)',
})
