import { styled } from '@mui/system'

export const ApplicationContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  background: theme.palette.custom.background,
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100dvh',
  position: 'relative',
  overflow: 'hidden',
}))

export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxHeight: '1000px',
  maxWidth: '400px',
  height: '100%',
  width: '100%',
  margin: 0,
  overflow: 'auto',
  overscrollBehavior: 'none',
  WebkitOverflowScrolling: 'touch',
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  paddingLeft: 'env(safe-area-inset-left)',
  paddingRight: 'env(safe-area-inset-right)',
  boxSizing: 'border-box',
  position: 'relative',
  willChange: 'transform',
  transform: 'translateZ(0)',
})
