import { styled } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ExploreIcon from '@mui/icons-material/Explore'
import { AdventurePosition } from '../../../utils/adventure'

const TODAY_COLOR = '#6366f1'
const TODAY_BG = '#eef2ff'
const TODAY_BORDER = '#a5b4fc'
const OVERDUE_COLOR = '#ef4444'
const MEAL_COLOR = '#f59e0b'
const MEAL_BG = '#fffbeb'
const BIRTHDAY_COLOR = '#ec4899'
const BIRTHDAY_BG = '#fdf2f8'
const ADVENTURE_COLOR = '#06b6d4'
const ADVENTURE_BG = '#ecfeff'
const BORDER_COLOR = '#f1f5f9'

export const WeeklyContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: '#f8fafc',
})

export const WeekHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px 10px',
  flexShrink: 0,
  gap: '8px',
})

export const WeekRangeLabel = styled(Typography)({
  fontWeight: 700,
  fontSize: '1rem',
  color: '#0f172a',
  flex: 1,
  textAlign: 'center',
  letterSpacing: '-0.01em',
})

export const TodayButton = styled(Button)({
  fontSize: '0.72rem',
  fontWeight: 600,
  minWidth: 'auto',
  padding: '4px 12px',
  textTransform: 'none',
  borderRadius: '20px',
  color: TODAY_COLOR,
  borderColor: TODAY_BORDER,
  '&:hover': {
    backgroundColor: TODAY_BG,
    borderColor: TODAY_COLOR,
  },
})

export const WeekRowsWrapper = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '0 12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  '&::-webkit-scrollbar': { width: '4px' },
  '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '4px' },
})

interface IDayRowProps {
  isToday?: boolean
  adventureContinuesToNext?: boolean
  adventureContinuesFromPrev?: boolean
}

const getDayRowBorderRadius = (toNext?: boolean, fromPrev?: boolean) => {
  const topLeft = fromPrev ? '4px' : '12px'
  const topRight = fromPrev ? '4px' : '12px'
  const bottomRight = toNext ? '4px' : '12px'
  const bottomLeft = toNext ? '4px' : '12px'
  return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`
}

export const DayRow = styled('div')<IDayRowProps>(({ isToday, adventureContinuesToNext, adventureContinuesFromPrev }) => {
  const isSpanning = adventureContinuesToNext || adventureContinuesFromPrev
  const borderColor = isToday ? TODAY_BORDER : isSpanning ? ADVENTURE_COLOR : BORDER_COLOR
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: getDayRowBorderRadius(adventureContinuesToNext, adventureContinuesFromPrev),
    borderLeft: `1.5px solid ${borderColor}`,
    borderRight: `1.5px solid ${borderColor}`,
    borderBottom: `1.5px solid ${borderColor}`,
    borderTop: adventureContinuesFromPrev ? 'none' : `1.5px solid ${borderColor}`,
    backgroundColor: isToday ? TODAY_BG : '#ffffff',
    boxShadow: isToday ? '0 2px 8px rgba(99,102,241,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    minHeight: '40px',
    transition: 'box-shadow 0.15s ease',
  }
})

export const AdventureConnectedDayWrapper = styled('div')({
  marginTop: '-4px',
})

export const DayRowHeader = styled('div')<IDayRowProps>(({ isToday }) => ({
  width: '64px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 8px',
  background: isToday
    ? `linear-gradient(135deg, ${TODAY_COLOR} 0%, #818cf8 100%)`
    : 'transparent',
  borderRight: `1px solid ${isToday ? TODAY_BORDER : BORDER_COLOR}`,
}))

export const DayRowItems = styled('div')({
  flex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
  padding: '7px 8px',
  alignContent: 'flex-start',
})

export const DayName = styled('div')<IDayRowProps>(({ isToday }) => ({
  fontSize: '0.65rem',
  fontWeight: 700,
  color: isToday ? 'rgba(255,255,255,0.75)' : '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  lineHeight: 1,
  marginBottom: '5px',
}))

export const DayNumber = styled('div')<IDayRowProps>(({ isToday }) => ({
  fontSize: '1.5rem',
  fontWeight: isToday ? 800 : 600,
  color: isToday ? '#ffffff' : '#1e293b',
  lineHeight: 1,
}))


const baseItem = {
  fontSize: '0.72rem',
  padding: '5px 7px 5px 9px',
  borderRadius: '8px',
  cursor: 'pointer',
  wordBreak: 'break-word' as const,
  lineHeight: 1.4,
  transition: 'all 0.12s ease',
  flexShrink: 0,
}

export const DayItem = styled('div')({
  ...baseItem,
  color: '#334155',
  backgroundColor: '#f8fafc',
  borderLeft: `3px solid ${TODAY_COLOR}`,
  '&:hover': {
    backgroundColor: TODAY_BG,
    color: '#3730a3',
  },
})

export const OverdueDayItem = styled('div')({
  ...baseItem,
  color: '#7f1d1d',
  backgroundColor: '#fff5f5',
  borderLeft: `3px solid ${OVERDUE_COLOR}`,
  '&:hover': {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
})

export const CompletedDayItem = styled('div')({
  ...baseItem,
  color: '#94a3b8',
  backgroundColor: '#f9fafb',
  borderLeft: '3px solid #cbd5e1',
  textDecoration: 'line-through',
  opacity: 0.7,
  '&:hover': {
    opacity: 1,
    backgroundColor: '#f1f5f9',
  },
})

export const BirthdayItem = styled('div')({
  ...baseItem,
  color: '#831843',
  backgroundColor: BIRTHDAY_BG,
  borderLeft: `3px solid ${BIRTHDAY_COLOR}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '4px',
  '&:hover': {
    backgroundColor: '#fce7f3',
  },
})

export const BirthdayIconStyled = styled(CakeIcon)({
  fontSize: '0.7rem',
  color: BIRTHDAY_COLOR,
  flexShrink: 0,
  marginTop: '2px',
})

export const MealItem = styled('div')({
  ...baseItem,
  color: '#78350f',
  backgroundColor: MEAL_BG,
  borderLeft: `3px solid ${MEAL_COLOR}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '4px',
  '&:hover': {
    backgroundColor: '#fef3c7',
  },
})

export const MealIconStyled = styled(RestaurantIcon)({
  fontSize: '0.7rem',
  color: MEAL_COLOR,
  flexShrink: 0,
  marginTop: '2px',
})

export const AdventureItem = styled('div')<{ position?: AdventurePosition }>(({ position = AdventurePosition.Single }) => {
  const isMulti = position !== AdventurePosition.Single
  if (isMulti) {
    return {
      fontSize: '0.72rem',
      padding: '5px 7px 5px 9px',
      cursor: 'pointer',
      wordBreak: 'break-word' as const,
      lineHeight: 1.4,
      transition: 'all 0.12s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#ffffff',
      backgroundColor: ADVENTURE_COLOR,
      margin: '-7px -8px',
      borderRadius: 0,
      '&:hover': {
        backgroundColor: '#0891b2',
      },
    }
  }
  return {
    ...baseItem,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '4px',
    color: '#0e7490',
    backgroundColor: ADVENTURE_BG,
    borderLeft: `3px solid ${ADVENTURE_COLOR}`,
    '&:hover': {
      backgroundColor: '#cffafe',
    },
  }
})

export const AdventureIconStyled = styled(ExploreIcon)({
  fontSize: '0.7rem',
  color: 'inherit',
  flexShrink: 0,
  marginTop: '2px',
})

export const AddMealButton = styled('div')({
  fontSize: '0.68rem',
  color: '#94a3b8',
  padding: '7px 6px',
  cursor: 'pointer',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  fontWeight: 600,
  marginTop: 'auto',
  border: '1.5px dashed #e2e8f0',
  letterSpacing: '0.02em',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: MEAL_BG,
    color: MEAL_COLOR,
    borderColor: MEAL_COLOR,
    borderStyle: 'solid',
  },
})
