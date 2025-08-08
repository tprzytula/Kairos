import { styled } from '@mui/material/styles'
import { Button, Typography } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2em',
  width: 'calc(100% - 2em)',
  margin: '0 0.5em',
  padding: '0 0.5em',
  height: '100%',
  minHeight: 0,
})

export const Header = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  textAlign: 'center',
  margin: '0 0 16px 0',
  letterSpacing: '-0.005em',
}))

export const ScrollableList = styled('div')({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingRight: '4px',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '2px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(0, 0, 0, 0.3)',
  },
})

export const EmptyState = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  gap: '12px',
  opacity: 0.6,
}))

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  textAlign: 'center',
}))



export const DateGroup = styled('div')({
  marginBottom: '2px',
})

export const DateHeader = styled('div')(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '4px',
  marginTop: '4px',
  padding: '6px 12px 6px 4px',
  position: 'sticky',
  top: '0',
  backgroundColor: theme.palette.background.default,
  backdropFilter: 'blur(8px)',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 200ms ease-in-out',
  borderBottom: `2px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: theme.palette.custom?.surfaces?.hover || 'rgba(0, 0, 0, 0.02)',
  },
  '&:first-of-type': {
    marginTop: '8px',
  },
}))

export const DateHeaderContent = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
})

export const ItemCount = styled('span')(({ theme }) => ({
  fontSize: '11px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  opacity: 0.7,
}))

export const StatsContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const PeakTime = styled('span')(({ theme }) => ({
  fontSize: '10px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  opacity: 0.6,
}))

export const MiniTimeline = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  marginLeft: '8px',
})

export const TimelineBar = styled('div')(({ height, color }: { height: number; color?: string }) => ({
  width: '3px',
  height: `${height}px`,
  backgroundColor: color || 'rgba(16, 185, 129, 0.6)',
  borderRadius: '1px',
  transition: 'all 200ms ease-in-out',
}))

export const ExpandIcon = styled('div')(({ isExpanded }: { isExpanded: boolean }) => ({
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 200ms ease-in-out',
  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
}))

export const CollapsibleContent = styled('div')(({ isExpanded }: { isExpanded: boolean }) => ({
  overflow: 'hidden',
  maxHeight: isExpanded ? '2000px' : '0',
  transition: 'max-height 300ms ease-in-out',
}))

export const AddNoiseTrackingItemButton = styled(Button)(({ theme }) => ({
  marginBottom: '1em',
  alignSelf: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '0.5em',
  padding: '0.75em 1.5em',
  fontSize: '1.1em',
  fontWeight: 600,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    backgroundColor: theme.palette.primary.dark,
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }
}))

export const ViewToggleContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
  paddingRight: '4px',
})

export const ViewToggleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  minWidth: '40px',
  padding: '8px',
  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: '8px',
  transition: 'all 200ms ease-in-out',
  '&:hover': {
    backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  '&:not(:last-child)': {
    marginRight: '8px',
  },
}))

export const SimpleListContainer = styled('div')({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingRight: '4px',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '2px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(0, 0, 0, 0.3)',
  },
})

export const SimpleListItem = styled('div')(({ theme }) => ({
  padding: '6px 12px',
  margin: '1px 4px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: 400,
  color: theme.palette.text.primary,
  lineHeight: '1.3',
  fontFamily: 'monospace',
  transition: 'all 200ms ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
}))
