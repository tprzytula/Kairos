import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'

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
  flex: 1,
  textAlign: 'center',
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
  isSelected?: boolean
}

export const DayCell = styled('div')<IDayCellProps>(({ isToday, isCurrentMonth, isSelected }) => ({
  minHeight: '48px',
  padding: '4px',
  borderRadius: '6px',
  backgroundColor: isSelected ? '#dbeafe' : isToday ? '#ecfdf5' : isCurrentMonth ? '#ffffff' : '#f9fafb',
  border: isSelected ? '1.5px solid #2563eb' : isToday ? '1.5px solid #059669' : '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  boxSizing: 'border-box',
  opacity: isCurrentMonth ? 1 : 0.4,
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: isSelected ? '#bfdbfe' : isToday ? '#d1fae5' : '#f3f4f6',
  },
}))

export const DayNumber = styled(Typography)<{ isToday?: boolean; isSelected?: boolean }>(({ isToday, isSelected }) => ({
  fontSize: '0.8rem',
  fontWeight: isToday || isSelected ? 700 : 400,
  color: isSelected ? '#2563eb' : isToday ? '#059669' : '#374151',
  lineHeight: 1.2,
}))

export const TodoDot = styled('div')<{ count?: number }>(({ count = 0 }) => ({
  width: count > 0 ? 'auto' : '0',
  minWidth: count > 0 ? '18px' : '0',
  height: count > 0 ? '16px' : '0',
  padding: count > 0 ? '0 4px' : '0',
  borderRadius: '8px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '0.6rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  visibility: count > 0 ? 'visible' : 'hidden',
}))

export const DayDetailPanel = styled('div')({
  marginTop: '0.75em',
  padding: '0.75em',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  border: '1px solid #bfdbfe',
})

export const DayDetailHeader = styled(Typography)({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#1d4ed8',
  marginBottom: '0.5em',
})

export const DayDetailItem = styled('div')({
  fontSize: '0.9rem',
  color: '#374151',
  padding: '8px 10px',
  borderBottom: '1px solid #dbeafe',
  cursor: 'pointer',
  borderRadius: '4px',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#dbeafe',
  },
})

export const DayDetailEmpty = styled(Typography)({
  fontSize: '0.85rem',
  color: '#6b7280',
  fontStyle: 'italic',
})

export const NoDueDateSection = styled('div')({
  marginTop: '0.75em',
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

export const NoDueDateItem = styled('div')({
  fontSize: '0.9rem',
  color: '#374151',
  padding: '8px 10px',
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

export const CompletedTodoDot = styled('div')<{ count?: number }>(({ count = 0 }) => ({
  width: count > 0 ? 'auto' : '0',
  minWidth: count > 0 ? '18px' : '0',
  height: count > 0 ? '16px' : '0',
  padding: count > 0 ? '0 4px' : '0',
  borderRadius: '8px',
  backgroundColor: '#059669',
  color: '#ffffff',
  fontSize: '0.6rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  visibility: count > 0 ? 'visible' : 'hidden',
}))

export const CompletedDayDetailItem = styled('div')({
  fontSize: '0.9rem',
  color: '#6b7280',
  textDecoration: 'line-through',
  padding: '8px 10px',
  borderBottom: '1px solid #dbeafe',
  cursor: 'pointer',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&::before': {
    content: '"✓"',
    color: '#059669',
    fontWeight: 700,
    textDecoration: 'none',
    flexShrink: 0,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#dbeafe',
  },
})

export const CompletedNoDueDateItem = styled('div')({
  fontSize: '0.9rem',
  color: '#6b7280',
  textDecoration: 'line-through',
  padding: '8px 10px',
  borderBottom: '1px solid #e5e7eb',
  cursor: 'pointer',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&::before': {
    content: '"✓"',
    color: '#059669',
    fontWeight: 700,
    textDecoration: 'none',
    flexShrink: 0,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#e5e7eb',
  },
})

export const BirthdayCakeIcon = styled(CakeIcon)({
  fontSize: '0.85rem',
  color: '#db2777',
})

export const BirthdayDayDetailItem = styled('div')({
  fontSize: '0.9rem',
  color: '#9d174d',
  padding: '8px 10px',
  borderBottom: '1px solid #fbcfe8',
  cursor: 'pointer',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#fce7f3',
  },
})
