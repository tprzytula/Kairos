import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import RestaurantIcon from '@mui/icons-material/Restaurant'

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
  height: '80px',
  padding: '4px',
  borderRadius: '6px',
  backgroundColor: isSelected ? '#dbeafe' : isToday ? '#ecfdf5' : isCurrentMonth ? '#ffffff' : '#f9fafb',
  border: isSelected ? '1.5px solid #2563eb' : isToday ? '1.5px solid #059669' : '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  boxSizing: 'border-box',
  overflow: 'hidden',
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

export const TodoDot = styled('div')<{ count?: number; isOverdue?: boolean }>(({ count = 0, isOverdue = false }) => ({
  width: count > 0 ? 'auto' : '0',
  minWidth: count > 0 ? '18px' : '0',
  height: count > 0 ? '16px' : '0',
  padding: count > 0 ? '0 4px' : '0',
  borderRadius: '8px',
  backgroundColor: isOverdue ? '#dc2626' : '#2563eb',
  color: '#ffffff',
  fontSize: '0.6rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  visibility: count > 0 ? 'visible' : 'hidden',
}))

export const DrawerOverlay = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
})

export const BottomDrawer = styled('div')({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#eff6ff',
  borderRadius: '16px 16px 0 0',
  border: '1px solid #bfdbfe',
  borderBottom: 'none',
  boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.12)',
  zIndex: 1001,
  maxHeight: '50vh',
  overflowY: 'auto',
  padding: '0.75em',
})

export const DrawerHandle = styled('div')({
  width: '40px',
  height: '4px',
  backgroundColor: '#bfdbfe',
  borderRadius: '2px',
  margin: '0 auto 0.75em',
})

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

export const OverdueDayDetailItem = styled('div')({
  fontSize: '0.9rem',
  color: '#dc2626',
  padding: '8px 10px',
  borderBottom: '1px solid #fecaca',
  cursor: 'pointer',
  borderRadius: '4px',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#fee2e2',
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

export const MealPlanIcon = styled(RestaurantIcon)({
  fontSize: '0.85rem',
  color: '#d97706',
})

export const MealDayDetailItem = styled('div')({
  fontSize: '0.9rem',
  color: '#92400e',
  padding: '8px 10px',
  borderBottom: '1px solid #fde68a',
  cursor: 'pointer',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#fef3c7',
  },
})

export const MealsSectionHeader = styled(Typography)({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#d97706',
  marginTop: '0.5em',
  marginBottom: '0.25em',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})
