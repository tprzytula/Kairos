import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

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

export const MonthLabel = styled(Typography)({
  fontWeight: 600,
  fontSize: '1rem',
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

interface IDayCellProps {
  isToday?: boolean
  isCurrentMonth?: boolean
}

export const DayCell = styled('div')<IDayCellProps>(({ isToday, isCurrentMonth }) => ({
  minHeight: '60px',
  padding: '4px',
  borderRadius: '6px',
  backgroundColor: isToday ? '#ecfdf5' : isCurrentMonth ? '#ffffff' : '#f9fafb',
  border: isToday ? '1.5px solid #059669' : '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  boxSizing: 'border-box',
  opacity: isCurrentMonth ? 1 : 0.4,
}))

export const DayNumber = styled(Typography)<{ isToday?: boolean }>(({ isToday }) => ({
  fontSize: '0.75rem',
  fontWeight: isToday ? 700 : 400,
  color: isToday ? '#059669' : '#374151',
  lineHeight: 1.2,
}))

export const TodoChip = styled('div')({
  backgroundColor: '#eff6ff',
  color: '#2563eb',
  fontSize: '0.65rem',
  padding: '2px 4px',
  borderRadius: '3px',
  cursor: 'pointer',
  lineHeight: 1.4,
  wordBreak: 'break-word',
  '&:hover': {
    backgroundColor: '#dbeafe',
  },
})

export const MoreLabel = styled(Typography)({
  fontSize: '0.6rem',
  color: '#6b7280',
  paddingLeft: '2px',
})

export const NoDueDateSection = styled('div')({
  marginTop: '1em',
  padding: '0.75em',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
})

export const NoDueDateHeader = styled(Typography)({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#6b7280',
  marginBottom: '0.5em',
})

export const NoDueDateItem = styled(Typography)({
  fontSize: '0.85rem',
  color: '#374151',
  padding: '6px 4px',
  borderBottom: '1px solid #e5e7eb',
  cursor: 'pointer',
  borderRadius: '4px',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#e5e7eb',
  },
})
