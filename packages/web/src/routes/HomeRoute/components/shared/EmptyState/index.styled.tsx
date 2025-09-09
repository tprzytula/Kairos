import { styled } from '@mui/material/styles'

export const StyledEmptyState = styled('div')(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  padding: '1rem',
}))
