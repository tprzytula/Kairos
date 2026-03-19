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

export const BirthdayCard = styled(MiniCard)({
  cursor: 'pointer',
  '&:before': {
    background: 'linear-gradient(90deg, #ec4899 0%, #f093fb 100%)',
  },
})

export const BirthdayCardIcon = styled(MiniCardIcon)({
  '& .MuiSvgIcon-root': {
    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  },
})

export const MiniCardBody = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  overflow: 'hidden',
})

