import { styled } from '@mui/material/styles'

export const CompactItemList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
})

export const MoreItemsIndicator = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: '0.75rem 1rem',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(102, 126, 234, 0.02) 100%)',
  borderRadius: '8px',
  border: '1px solid rgba(102, 126, 234, 0.12)',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    color: theme.palette.text.primary,
  },
}))
