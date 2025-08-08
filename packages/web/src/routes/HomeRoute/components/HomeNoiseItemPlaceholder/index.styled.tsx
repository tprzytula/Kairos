import { styled, keyframes } from '@mui/material/styles'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

export const PlaceholderItem = styled('li')(({ theme }) => ({
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  padding: '0.75rem 1rem',
  backgroundColor: theme.palette.custom?.surfaces?.primary,
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'background-color 0.2s ease',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.custom?.surfaces?.secondary,
  },
}))

export const TimePlaceholder = styled('div')(({ theme }) => ({
  fontSize: '0.95rem',
  lineHeight: '1.2',
  height: '1.14rem',
  width: '40%',
  background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
}))

export const ElapsedPlaceholder = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  lineHeight: '1.2',
  height: '0.96rem',
  width: '25%',
  background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
}))