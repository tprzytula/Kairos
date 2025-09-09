import { styled } from '@mui/material/styles'

export const NoiseDetailHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
  paddingBottom: '0.5rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

export const NoiseDetailTitle = styled('h3')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '600',
  color: theme.palette.text.primary,
  margin: 0,
}))

export const NoiseBackButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
}))

export const NoiseDetailList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxHeight: '300px',
  overflowY: 'auto',
})

export const NoiseDetailItem = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem',
  backgroundColor: theme.palette.background.default,
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
}))

export const NoiseDetailDate = styled('div')(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
}))

export const NoiseDetailTime = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}))

export const NoiseDetailEmpty = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: '2rem',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}))
