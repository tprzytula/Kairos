import { styled } from '@mui/material/styles'
import { COLORS, GRADIENTS } from '../../constants/colors'

export const RecipeListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  paddingTop: '0.875rem',
})

export const StickyHeader = styled('div')({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  paddingBottom: '0.25rem',
  transition: 'box-shadow 0.2s ease',
  '&.stuck': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
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
    background: COLORS.orange.bgSubtle,
    borderColor: COLORS.orange.borderSubtle,
    boxShadow: `0 0 0 3px ${COLORS.orange.focus}`,
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

export const FilterChipsContainer = styled('div')({
  display: 'flex',
  gap: '0.375rem',
  overflowX: 'auto',
  paddingBottom: '0.25rem',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

export const RecipeGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.75rem',
})

export const FilterButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid rgba(0,0,0,0.12)',
  background: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
  color: 'rgba(0,0,0,0.54)',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: COLORS.orange.border,
    background: COLORS.orange.bgSubtle,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  },
})

export const FilterBadge = styled('span')({
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: GRADIENTS.orange,
  color: 'white',
  fontSize: '0.6rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
