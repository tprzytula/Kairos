import { styled } from '@mui/material/styles'
import { themedShimmerStyles } from '../../../../../../utils/styles/shimmer'

export const TaskListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
})

export const ExpandButton = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.3rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  padding: '0.35rem',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(124, 58, 237, 0.02) 100%)',
  border: '1px solid rgba(99, 102, 241, 0.1)',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.08)',
    borderColor: 'rgba(99, 102, 241, 0.18)',
    color: theme.palette.text.primary,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}))

export const EmptyMessage = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: '0.5rem 0',
}))

export const TaskPlaceholderCard = styled('div')({
  borderRadius: '12px',
  padding: '0.5rem 0.65rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,1) 100%)',
  border: '1px solid rgba(99, 102, 241, 0.08)',
})

export const TaskPlaceholderTitle = styled('div')(({ theme }) => ({
  height: '0.85rem',
  width: '68%',
  borderRadius: '4px',
  ...themedShimmerStyles(theme),
}))

export const TaskPlaceholderMeta = styled('div')(({ theme }) => ({
  height: '0.65rem',
  width: '40%',
  borderRadius: '4px',
  marginTop: '0.35rem',
  ...themedShimmerStyles(theme),
}))
