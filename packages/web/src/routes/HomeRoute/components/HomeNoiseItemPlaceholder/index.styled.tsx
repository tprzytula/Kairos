import { styled, keyframes } from '@mui/material/styles'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

export const PlaceholderBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 0.5rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(102, 126, 234, 0.12)',
  minHeight: '65px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
}))

export const CountPlaceholder = styled('div')(({ theme }) => ({
  height: '1.1rem',
  width: '2rem',
  background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
  marginBottom: '0.25rem',
}))

export const LabelPlaceholder = styled('div')(({ theme }) => ({
  height: '0.7rem',
  width: '3.5rem',
  background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
}))