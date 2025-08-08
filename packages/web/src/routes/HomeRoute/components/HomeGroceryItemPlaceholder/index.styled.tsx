import { styled, keyframes } from '@mui/material/styles'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

export const PlaceholderContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0rem',
})

export const PlaceholderGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gridTemplateRows: 'repeat(2, 48px)',
  gap: '0.75rem',
  maxWidth: '100%',
  alignItems: 'center',
  justifyItems: 'center',
  marginTop: '0rem',
  marginBottom: '0rem',
  overflow: 'hidden',
})

export const PlaceholderImageBox = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '48px',
  height: '48px',
  borderRadius: '8px',
  backgroundColor: theme.palette.custom?.surfaces?.secondary || '#f5f5f5',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
    backgroundSize: '200px 100%',
    animation: `${shimmer} 1.5s infinite`,
  },
}))