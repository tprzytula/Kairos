import { styled } from '@mui/material/styles'
import { slideIn } from '../../utils/styles/stepAnimations'

export const BannerWrapper = styled('button')<{ $compact?: boolean }>(({ $compact }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  width: '100%',
  padding: $compact ? '0.4rem 0.5rem' : '0.6rem 0.75rem',
  border: 'none',
  borderRadius: $compact ? '8px' : '10px',
  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  color: 'white',
  fontSize: $compact ? '0.72rem' : '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  animation: `${slideIn} 0.3s ease forwards`,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '& svg': {
    fontSize: $compact ? '0.85rem' : '1rem',
  },
}))
