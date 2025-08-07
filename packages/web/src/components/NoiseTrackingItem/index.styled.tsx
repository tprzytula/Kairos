import { styled } from '@mui/material/styles'
import { Button, Card, CardContent, IconButton } from '@mui/material'

export const Container = styled(Card)(({ theme }) => ({
  display: 'flex',
  borderRadius: '16px',
  minHeight: '70px',
  margin: '4px 0',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxSizing: 'border-box',
  transition: 'all 200ms ease-in-out',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  backgroundColor: '#ffffff',
  padding: '16px 20px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}))

export const Content = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  flexGrow: 1,
  padding: '0 !important',
  gap: '4px',
})

export const TimeContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const TimeIcon = styled('div')({
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  opacity: 0.7,
})

export const AbsoluteTime = styled('div')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  letterSpacing: '-0.005em',
}))

export const RelativeTime = styled('div')(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  opacity: 0.8,
  marginTop: '2px',
}))

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  margin: '0',
  padding: '8px',
  color: theme.palette.error.main,
  opacity: 0.6,
  transition: 'all 200ms ease-in-out',
  '&:hover': {
    opacity: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
    transform: 'scale(1.1)',
  },
}))
