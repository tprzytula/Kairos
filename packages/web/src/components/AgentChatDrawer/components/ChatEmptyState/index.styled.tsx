import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const EmptyStateContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  padding: '2rem',
  textAlign: 'center',
})

export const EmptyIconBox = styled(Box)({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.25rem',
  '& .MuiSvgIcon-root': {
    fontSize: '1.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
})

export const EmptyHeading = styled('span')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  letterSpacing: '0.3px',
}))

export const EmptySubtext = styled('span')(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  maxWidth: '18rem',
}))
