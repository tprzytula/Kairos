import { styled } from '@mui/material/styles'
import { Card } from '@mui/material'

export const HeaderWrapper = styled('div')({
  width: '100%',
})

export const HeaderCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  margin: '0.75rem 0 0.5rem 0',
  width: '100%',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 0.8,
  },
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-1px)',
    '&:before': {
      opacity: 1,
    },
  },
}))

export const HeaderContent = styled('div')({
  padding: '1rem 1.25rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  width: '100%',
  boxSizing: 'border-box',
})

export const HeaderTitle = styled('h1')(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  margin: 0,
  lineHeight: 1.1,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}))

export const HeaderIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  },
}))

export const HeaderStats = styled('div')({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  flexWrap: 'wrap',
  maxWidth: '100%',
  overflow: 'hidden',
})

export const StatItem = styled('div')<{ wide?: boolean }>(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '50px',
  maxWidth: '70px',
  flex: '1 1 auto',
  textAlign: 'center',
}))

export const StatValue = styled('div')(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  lineHeight: 1,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}))

export const StatLabel = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  marginTop: '0.25rem',
  textAlign: 'center',
  lineHeight: 1.2,
}))