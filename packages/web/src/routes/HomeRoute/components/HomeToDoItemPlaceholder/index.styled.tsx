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
  '&:hover': {
    backgroundColor: theme.palette.custom?.surfaces?.secondary,
  },
}))

export const NamePlaceholder = styled('div')(({ theme }) => ({
  fontSize: '0.95rem',
  lineHeight: '1.2',
  height: '1.14rem',
  width: '70%',
  background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
}))

export const DescriptionPlaceholder = styled('div')(({ theme }) => ({
  fontSize: '0.85rem',
  lineHeight: '1.2',
  height: '1.02rem',
  width: '50%',
  background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
  marginTop: '0.25rem',
}))