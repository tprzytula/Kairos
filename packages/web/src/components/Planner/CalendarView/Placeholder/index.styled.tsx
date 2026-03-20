import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { shimmerStyles } from '../../../../utils/styles/shimmer'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 0.5em',
  boxSizing: 'border-box',
})

export const CalendarHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.5em',
})

export const MonthLabelPlaceholder = styled('div')({
  width: 120,
  height: 20,
  borderRadius: 4,
  flex: 1,
  margin: '0 8px',
  ...shimmerStyles,
})

export const NavButtonPlaceholder = styled('div')({
  width: 34,
  height: 34,
  borderRadius: '50%',
  flexShrink: 0,
  ...shimmerStyles,
})

export const WeekDayHeader = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
  marginBottom: '2px',
})

export const WeekDayLabel = styled(Typography)({
  textAlign: 'center',
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#6b7280',
  padding: '4px 0',
})

export const CalendarGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
})

export const DayCellPlaceholder = styled('div')({
  height: '80px',
  padding: '4px',
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  boxSizing: 'border-box',
  overflow: 'hidden',
})

export const DayNumberPlaceholder = styled('div')({
  width: 20,
  height: 14,
  borderRadius: 3,
  ...shimmerStyles,
})
