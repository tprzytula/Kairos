import { styled } from '@mui/material/styles'

const TODAY_COLOR = '#6366f1'
const BORDER_COLOR = '#f1f5f9'

export const ExpandedDayContainer = styled('div')<{ isToday?: boolean }>(({ isToday }) => ({
  backgroundColor: isToday ? '#f5f3ff' : '#fafbfc',
  borderLeft: `2px solid ${isToday ? TODAY_COLOR : '#e2e8f0'}`,
  borderRight: `1.5px solid ${isToday ? '#a5b4fc' : BORDER_COLOR}`,
  borderBottom: `1.5px solid ${isToday ? '#a5b4fc' : BORDER_COLOR}`,
  borderRadius: '0 0 12px 12px',
  marginTop: '-2px',
  overflow: 'hidden',
}))

export const AllDaySection = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
  padding: '8px 10px 8px 58px',
  borderBottom: `1px solid ${BORDER_COLOR}`,
  minHeight: '32px',
  alignItems: 'center',
})

export const AllDayLabel = styled('div')({
  fontSize: '0.6rem',
  fontWeight: 700,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  width: '48px',
  marginLeft: '-48px',
  textAlign: 'right',
  paddingRight: '8px',
  flexShrink: 0,
})

export const HourBlocksContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

export const HourBlock = styled('div')<{ hasItems?: boolean }>(({ hasItems }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  minHeight: hasItems ? '36px' : '28px',
  borderBottom: `1px solid ${BORDER_COLOR}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}))

export const HourLabel = styled('div')({
  width: '48px',
  flexShrink: 0,
  fontSize: '0.6rem',
  fontWeight: 600,
  color: '#94a3b8',
  textAlign: 'right',
  paddingRight: '10px',
  paddingTop: '6px',
  lineHeight: 1,
})

export const HourContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  padding: '4px 8px',
  alignContent: 'flex-start',
})

export const CurrentTimeIndicator = styled('div')({
  position: 'relative',
  height: '2px',
  backgroundColor: TODAY_COLOR,
  margin: '0 8px 0 48px',
  borderRadius: '1px',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-4px',
    top: '-3px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: TODAY_COLOR,
  },
})

export const EmptyHourDot = styled('div')({
  width: '4px',
  height: '4px',
  borderRadius: '50%',
  backgroundColor: '#e2e8f0',
  marginTop: '4px',
})

export const ExpandIndicator = styled('div')<{ expanded: boolean }>(({ expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  color: '#94a3b8',
  fontSize: '0.9rem',
  marginTop: '2px',
}))
