import { styled } from '@mui/material/styles'
import { streakPulse } from '../../utils/styles/stepAnimations'

export const StreakBadge = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.15rem',
  padding: '0.1rem 0.35rem',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%)',
  border: '1px solid rgba(245, 158, 11, 0.25)',
  fontSize: '0.65rem',
  fontWeight: 700,
  color: '#d97706',
  animation: `${streakPulse} 0.35s ease forwards`,
  whiteSpace: 'nowrap',
  '& .streak-icon': {
    fontSize: '0.7rem',
    lineHeight: 1,
  },
})
