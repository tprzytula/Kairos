import { styled } from '@mui/material/styles'

export const NoiseStats = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '0.5rem',
  padding: '0.5rem 0',
})

export const NoiseStatBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 0.5rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(102, 126, 234, 0.12)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  minHeight: '65px',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.06)',
    borderColor: 'rgba(102, 126, 234, 0.25)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
  },
}))

export const NoiseStatCount = styled('div')(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  marginBottom: '0.25rem',
  lineHeight: 1,
}))

export const NoiseStatLabel = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  lineHeight: 1.2,
}))
