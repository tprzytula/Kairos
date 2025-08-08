import { styled } from '@mui/material/styles'

export const ItemText = styled('li')(({ theme }) => ({
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  padding: '0.75rem 1rem',
  backgroundColor: theme.palette.custom?.surfaces?.primary,
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.custom?.surfaces?.secondary,
  },
}))