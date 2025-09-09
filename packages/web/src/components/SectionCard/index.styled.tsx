import { styled } from '@mui/material/styles'
import { Card, CardContent, Box } from '@mui/material'

export const FullWidthSection = styled(Box)({
  gridColumn: 'auto',
})

export const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '120px',
  height: 'auto',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
    '&:before': {
      opacity: 1,
    },
  },
}))

export const SectionHeader = styled('div')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
}))

export const HeaderContent = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const StyledIcon = styled('div')({
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    padding: '0.25rem',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
})

export const ItemCount = styled('span')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  background: 'rgba(102, 126, 234, 0.1)',
  padding: '0.2rem 0.5rem',
  borderRadius: '12px',
  minWidth: '1.5rem',
  textAlign: 'center',
}))

export const SectionContent = styled(CardContent)({
  padding: '1.25rem',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  '&:last-child': {
    paddingBottom: '1.25rem',
  },
})
