import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ExploreIcon from '@mui/icons-material/Explore'
import { AdventurePosition } from '../../../utils/adventure'

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

export const SwipeableCalendarBody = styled('div')<{
  $animationDirection: 'left' | 'right' | null
}>(({ $animationDirection }) => ({
  touchAction: 'pan-y',
  userSelect: 'none',
  willChange: $animationDirection ? 'transform, opacity' : 'auto',
  ...($animationDirection && {
    animation: `${$animationDirection === 'left' ? 'slideInFromRight' : 'slideInFromLeft'} 0.2s ease-out`,
  }),
  '@keyframes slideInFromRight': {
    from: { transform: 'translateX(30px)', opacity: 0.5 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  '@keyframes slideInFromLeft': {
    from: { transform: 'translateX(-30px)', opacity: 0.5 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none !important',
  },
}))

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

export const DayDetailPanel = styled('div')({
  marginTop: '0.75em',
  padding: '0.75em',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  border: '1px solid #bfdbfe',
})

export const DayDetailHeaderWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  paddingBottom: '10px',
  marginBottom: '8px',
  borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
})

export const DayDetailDayOfWeek = styled(Typography)({
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  lineHeight: 1,
})

export const DayDetailDateLabel = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: 1.2,
})

export const DayDetailHeader = styled(Typography)({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#1d4ed8',
  marginBottom: '0.5em',
})

export const DayDetailItem = styled('div')({
  fontSize: '0.875rem',
  color: '#1e3a5f',
  padding: '8px 10px 8px 12px',
  borderRadius: '8px',
  borderLeft: '3px solid #3b82f6',
  backgroundColor: '#f0f6ff',
  cursor: 'pointer',
  marginBottom: '4px',
  transition: 'all 0.12s ease',
  '&:last-child': {
    marginBottom: 0,
  },
  '&:hover': {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
})

export const OverdueDayDetailItem = styled('div')({
  fontSize: '0.875rem',
  color: '#7f1d1d',
  padding: '8px 10px 8px 12px',
  borderRadius: '8px',
  borderLeft: '3px solid #ef4444',
  backgroundColor: '#fff5f5',
  cursor: 'pointer',
  marginBottom: '4px',
  transition: 'all 0.12s ease',
  '&:last-child': {
    marginBottom: 0,
  },
  '&:hover': {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
})

export const DayDetailEmpty = styled(Typography)({
  fontSize: '0.875rem',
  color: '#94a3b8',
  fontStyle: 'italic',
  textAlign: 'center',
  padding: '20px 16px',
  display: 'block',
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
  fontSize: '0.875rem',
  color: '#94a3b8',
  textDecoration: 'line-through',
  padding: '8px 10px 8px 12px',
  borderRadius: '8px',
  borderLeft: '3px solid #cbd5e1',
  backgroundColor: '#f9fafb',
  cursor: 'pointer',
  marginBottom: '4px',
  opacity: 0.85,
  transition: 'all 0.12s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&::before': {
    content: '"✓"',
    color: '#10b981',
    fontWeight: 700,
    fontSize: '0.75rem',
    textDecoration: 'none',
    flexShrink: 0,
  },
  '&:last-child': {
    marginBottom: 0,
  },
  '&:hover': {
    opacity: 1,
    backgroundColor: '#f1f5f9',
  },
})

export const CompletedNoDueDateItem = styled('div')({
  fontSize: '0.875rem',
  color: '#94a3b8',
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
    color: '#10b981',
    fontWeight: 700,
    fontSize: '0.75rem',
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
  fontSize: '0.875rem',
  color: '#831843',
  padding: '8px 10px 8px 12px',
  borderRadius: '8px',
  borderLeft: '3px solid #ec4899',
  backgroundColor: '#fdf2f8',
  cursor: 'pointer',
  marginBottom: '4px',
  transition: 'all 0.12s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:last-child': {
    marginBottom: 0,
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
  fontSize: '0.875rem',
  color: '#78350f',
  padding: '8px 10px 8px 12px',
  borderRadius: '8px',
  borderLeft: '3px solid #f59e0b',
  backgroundColor: '#fffbeb',
  cursor: 'pointer',
  marginBottom: '4px',
  transition: 'all 0.12s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:last-child': {
    marginBottom: 0,
  },
  '&:hover': {
    backgroundColor: '#fef3c7',
  },
})

export const MealsSectionHeader = styled(Typography)({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: '#b45309',
  marginTop: '12px',
  marginBottom: '6px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(226, 232, 240, 0.9)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const MealsAddButton = styled('span')({
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#b45309',
  backgroundColor: 'rgba(245, 158, 11, 0.12)',
  border: '1.5px dashed #f59e0b',
  borderRadius: '6px',
  padding: '1px 8px',
  cursor: 'pointer',
  marginLeft: 'auto',
  transition: 'all 0.12s ease',
  lineHeight: 1.4,
  '&:hover': {
    backgroundColor: 'rgba(245, 158, 11, 0.22)',
    borderStyle: 'solid',
  },
})

export const AdventureCalendarIcon = styled(ExploreIcon)({
  fontSize: '0.85rem',
  color: '#06b6d4',
})

export const AdventureCountBadge = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
})

export const AdventureCountLabel = styled('span')({
  fontSize: '0.6rem',
  color: '#06b6d4',
  fontWeight: 600,
})

export const AdventureBar = styled('div')<{ position: AdventurePosition }>(({ position }) => ({
  height: '6px',
  marginTop: 'auto',
  marginLeft: '-4px',
  marginRight: '-4px',
  marginBottom: '-4px',
  width: 'calc(100% + 8px)',
  alignSelf: 'stretch',
  flexShrink: 0,
  backgroundColor: '#06b6d4',
  cursor: 'pointer',
  borderRadius:
    position === AdventurePosition.Start ? '3px 0 0 3px' :
    position === AdventurePosition.End ? '0 3px 3px 0' :
    position === AdventurePosition.Middle ? '0' :
    '3px',
}))

export const AdventureDayDetailItem = styled('div')({
  fontSize: '0.875rem',
  color: '#0e7490',
  padding: '8px 10px 8px 12px',
  borderRadius: '8px',
  borderLeft: '3px solid #06b6d4',
  backgroundColor: '#ecfeff',
  cursor: 'pointer',
  marginBottom: '4px',
  transition: 'all 0.12s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:last-child': {
    marginBottom: 0,
  },
  '&:hover': {
    backgroundColor: '#cffafe',
  },
})

export const AdventuresSectionHeader = styled(Typography)({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: '#0891b2',
  marginTop: '12px',
  marginBottom: '6px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(226, 232, 240, 0.9)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const TasksAddButton = styled('span')({
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#1d4ed8',
  backgroundColor: 'rgba(59, 130, 246, 0.12)',
  border: '1.5px dashed #3b82f6',
  borderRadius: '6px',
  padding: '1px 8px',
  cursor: 'pointer',
  marginLeft: 'auto',
  transition: 'all 0.12s ease',
  lineHeight: 1.4,
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.22)',
    borderStyle: 'solid',
  },
})

export const AdventuresAddButton = styled('span')({
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#0891b2',
  backgroundColor: 'rgba(6, 182, 212, 0.12)',
  border: '1.5px dashed #06b6d4',
  borderRadius: '6px',
  padding: '1px 8px',
  cursor: 'pointer',
  marginLeft: 'auto',
  transition: 'all 0.12s ease',
  lineHeight: 1.4,
  '&:hover': {
    backgroundColor: 'rgba(6, 182, 212, 0.22)',
    borderStyle: 'solid',
  },
})
