import { styled } from '@mui/material/styles'
import { Card, CardContent } from '@mui/material'

const shimmer = `
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

export const Container = styled(Card)(({ theme }) => ({
  display: 'flex',
  borderRadius: '16px',
  minHeight: '81px',
  margin: '4px 0',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxSizing: 'border-box',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  backgroundColor: '#ffffff',
  padding: '16px 20px',
  opacity: 0.6,
}))

export const Content = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  flexGrow: 1,
  padding: '0 !important',
  gap: '4px',
})

export const TimeContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const TimeIcon = styled('div')(({ theme }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  backgroundColor: theme.palette.custom?.surfaces?.secondary || '#f1f5f9',
  flexShrink: 0,
  background: `linear-gradient(90deg, ${theme.palette.custom?.surfaces?.secondary || '#f1f5f9'} 0%, ${theme.palette.custom?.surfaces?.hover || '#f8fafc'} 50%, ${theme.palette.custom?.surfaces?.secondary || '#f1f5f9'} 100%)`,
  backgroundSize: '200px 100%',
  animation: 'shimmer 1.5s infinite linear',
  [shimmer]: '',
}))

export const AbsoluteTime = styled('div')(({ theme }) => ({
  height: '16px',
  width: '140px',
  borderRadius: '4px',
  background: `linear-gradient(90deg, ${theme.palette.custom?.surfaces?.secondary || '#f1f5f9'} 0%, ${theme.palette.custom?.surfaces?.hover || '#f8fafc'} 50%, ${theme.palette.custom?.surfaces?.secondary || '#f1f5f9'} 100%)`,
  backgroundSize: '200px 100%',
  animation: 'shimmer 1.5s infinite linear',
  [shimmer]: '',
}))

export const RelativeTime = styled('div')(({ theme }) => ({
  height: '13px',
  width: '60px',
  borderRadius: '4px',
  marginTop: '2px',
  background: `linear-gradient(90deg, ${theme.palette.custom?.surfaces?.secondary || '#f1f5f9'} 0%, ${theme.palette.custom?.surfaces?.hover || '#f8fafc'} 50%, ${theme.palette.custom?.surfaces?.secondary || '#f1f5f9'} 100%)`,
  backgroundSize: '200px 100%',
  animation: 'shimmer 1.5s infinite linear',
  [shimmer]: '',
}))