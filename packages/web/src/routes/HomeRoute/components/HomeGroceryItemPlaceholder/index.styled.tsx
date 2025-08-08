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
  position: 'relative',
  lineHeight: '1.2',
  height: '1.14rem',
  '&:hover': {
    backgroundColor: theme.palette.custom?.surfaces?.secondary,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0.75rem',
    left: '1rem',
    right: '30%',
    height: '1.14rem',
    background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
    backgroundSize: '200px 100%',
    animation: `${shimmer} 1.5s infinite`,
    borderRadius: '4px',
  },
}))