import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { PULL_THRESHOLD } from './usePullToRefresh'

export const Wrapper = styled('div')({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
})

export const ScrollArea = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  paddingTop: '0.75rem',
  paddingBottom: '1rem',
})

export const IndicatorContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: `${PULL_THRESHOLD}px`,
  pointerEvents: 'none',
  zIndex: 1,
})
