import { styled } from '@mui/material/styles'

export const RecipeListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  paddingTop: '0.875rem',
})

export const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  borderRadius: '12px',
  background: 'rgba(0, 0, 0, 0.025)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s ease',
  '&:focus-within': {
    background: 'rgba(249, 115, 22, 0.04)',
    borderColor: 'rgba(249, 115, 22, 0.25)',
    boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.08)',
  },
}))

export const SearchIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.disabled,
  flexShrink: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  },
}))

export const SearchInput = styled('input')(({ theme }) => ({
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  fontFamily: 'inherit',
  '&::placeholder': {
    color: theme.palette.text.disabled,
  },
}))

export const EmptyStateContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 0',
  gap: '0.75rem',
})

export const NoMatchContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem 0',
  gap: '0.5rem',
})
