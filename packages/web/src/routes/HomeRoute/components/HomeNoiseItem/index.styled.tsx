import { styled } from '@mui/material/styles'

export const NoiseItem = styled('li')(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
  padding: '0.6rem 0.8rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)',
  borderRadius: '10px',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  cursor: 'pointer',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0 10px 10px 0',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    transform: 'translateX(2px)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    '&:before': {
      opacity: 1,
    },
  },
}))

export const TimeElapsed = styled('span')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: '500',
}))