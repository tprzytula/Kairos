import { styled } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import RestaurantIcon from '@mui/icons-material/Restaurant'

export const WeeklyContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 0.5em',
  boxSizing: 'border-box',
})

export const WeekHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.5em',
})

export const WeekRangeLabel = styled(Typography)({
  fontWeight: 600,
  fontSize: '1rem',
  flex: 1,
  textAlign: 'center',
})

export const TodayButton = styled(Button)({
  fontSize: '0.75rem',
  minWidth: 'auto',
  padding: '2px 8px',
  textTransform: 'none',
  color: '#059669',
  borderColor: '#059669',
  '&:hover': {
    backgroundColor: '#d1fae5',
    borderColor: '#059669',
  },
})

export const WeekGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
  overflowX: 'auto',
})

interface IDayColumnProps {
  isToday?: boolean
}

export const DayColumn = styled('div')<IDayColumnProps>(({ isToday }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  borderRadius: '8px',
  border: isToday ? '1.5px solid #059669' : '1px solid #e5e7eb',
  backgroundColor: isToday ? '#ecfdf5' : '#ffffff',
  overflow: 'hidden',
}))

export const DayColumnHeader = styled('div')<IDayColumnProps>(({ isToday }) => ({
  textAlign: 'center',
  padding: '6px 4px',
  backgroundColor: isToday ? '#d1fae5' : '#f9fafb',
  borderBottom: isToday ? '1px solid #a7f3d0' : '1px solid #e5e7eb',
}))

export const DayName = styled(Typography)<IDayColumnProps>(({ isToday }) => ({
  fontSize: '0.65rem',
  fontWeight: 600,
  color: isToday ? '#059669' : '#6b7280',
  textTransform: 'uppercase',
  lineHeight: 1.2,
}))

export const DayNumber = styled(Typography)<IDayColumnProps>(({ isToday }) => ({
  fontSize: '0.9rem',
  fontWeight: isToday ? 700 : 500,
  color: isToday ? '#059669' : '#374151',
  lineHeight: 1.2,
}))

export const DayColumnBody = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '4px',
  gap: '2px',
  minHeight: '80px',
})

export const DayItem = styled('div')({
  fontSize: '0.75rem',
  color: '#374151',
  padding: '4px 6px',
  borderRadius: '4px',
  cursor: 'pointer',
  wordBreak: 'break-word',
  lineHeight: 1.3,
  '&:hover': {
    backgroundColor: '#dbeafe',
  },
})

export const OverdueDayItem = styled('div')({
  fontSize: '0.75rem',
  color: '#dc2626',
  padding: '4px 6px',
  borderRadius: '4px',
  cursor: 'pointer',
  wordBreak: 'break-word',
  lineHeight: 1.3,
  '&:hover': {
    backgroundColor: '#fee2e2',
  },
})

export const CompletedDayItem = styled('div')({
  fontSize: '0.75rem',
  color: '#9ca3af',
  textDecoration: 'line-through',
  padding: '4px 6px',
  borderRadius: '4px',
  cursor: 'pointer',
  wordBreak: 'break-word',
  lineHeight: 1.3,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '3px',
  '&::before': {
    content: '"✓"',
    color: '#059669',
    fontWeight: 700,
    textDecoration: 'none',
    flexShrink: 0,
    fontSize: '0.65rem',
  },
  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
})

export const BirthdayItem = styled('div')({
  fontSize: '0.75rem',
  color: '#9d174d',
  padding: '4px 6px',
  borderRadius: '4px',
  cursor: 'pointer',
  wordBreak: 'break-word',
  lineHeight: 1.3,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '3px',
  '&:hover': {
    backgroundColor: '#fce7f3',
  },
})

export const BirthdayIconStyled = styled(CakeIcon)({
  fontSize: '0.75rem',
  color: '#db2777',
  flexShrink: 0,
  marginTop: '1px',
})

export const MealItem = styled('div')({
  fontSize: '0.75rem',
  color: '#92400e',
  padding: '4px 6px',
  borderRadius: '4px',
  cursor: 'pointer',
  wordBreak: 'break-word',
  lineHeight: 1.3,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '3px',
  '&:hover': {
    backgroundColor: '#fef3c7',
  },
})

export const MealIconStyled = styled(RestaurantIcon)({
  fontSize: '0.75rem',
  color: '#d97706',
  flexShrink: 0,
  marginTop: '1px',
})

export const AddMealButton = styled('div')({
  fontSize: '0.7rem',
  color: '#d97706',
  padding: '3px 6px',
  cursor: 'pointer',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  fontWeight: 500,
  marginTop: 'auto',
  '&:hover': {
    backgroundColor: '#fef3c7',
  },
})
