import { useMemo } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Collapse } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ExploreIcon from '@mui/icons-material/Explore'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../types/mealPlan'
import { IAdventure } from '../../../types/adventure'
import { buildTimeSlots, formatHour, HOUR_SLOTS, IExpandedItem } from './expandedDayUtils'
import {
  DayItem,
  OverdueDayItem,
  CompletedDayItem,
  BirthdayItem,
  BirthdayIconStyled,
  MealItem,
  MealIconStyled,
} from './index.styled'
import {
  ExpandedDayContainer,
  AllDaySection,
  AllDayLabel,
  HourBlocksContainer,
  HourBlock,
  HourLabel,
  HourContent,
  CurrentTimeIndicator,
} from './ExpandedDayView.styled'
import PrivateItemBadge from '../../PrivateItemBadge'

interface IExpandedDayViewProps {
  day: Dayjs
  isExpanded: boolean
  pendingTodos: ITodoItem[]
  completedTodos: ITodoItem[]
  birthdays: IBirthdayItem[]
  meals: IMealPlan[]
  adventures: IAdventure[]
  isOverdue: boolean
  isToday: boolean
  onItemClick: (id: string) => void
  onBirthdayClick?: (id: string) => void
  onMealPlanClick?: (mealPlan: IMealPlan) => void
  onAdventureClick?: (id: string) => void
}

const renderItem = (
  item: IExpandedItem,
  onItemClick: (id: string) => void,
  onBirthdayClick?: (id: string) => void,
  onMealPlanClick?: (mealPlan: IMealPlan) => void,
  onAdventureClick?: (id: string) => void,
) => {
  const badge = item.isPrivate ? <PrivateItemBadge /> : null

  switch (item.type) {
    case 'todo':
      return (
        <DayItem key={item.id} onClick={() => onItemClick(item.id)}>
          {item.time && <TimeTag>{item.time}</TimeTag>}
          {item.label}
          {badge}
        </DayItem>
      )
    case 'overdueTodo':
      return (
        <OverdueDayItem key={item.id} onClick={() => onItemClick(item.id)}>
          {item.time && <TimeTag>{item.time}</TimeTag>}
          {item.label}
          {badge}
        </OverdueDayItem>
      )
    case 'completedTodo':
      return (
        <CompletedDayItem key={item.id} onClick={() => onItemClick(item.id)}>
          {item.time && <TimeTag>{item.time}</TimeTag>}
          {item.label}
          {badge}
        </CompletedDayItem>
      )
    case 'birthday':
      return (
        <BirthdayItem key={item.id} onClick={() => onBirthdayClick?.(item.id)}>
          <BirthdayIconStyled />
          {item.label}
          {badge}
        </BirthdayItem>
      )
    case 'meal':
      return (
        <MealItem key={item.id} onClick={() => onMealPlanClick?.(item.raw as IMealPlan)}>
          <MealIconStyled />
          {item.label}
          {badge}
        </MealItem>
      )
    case 'adventure':
      return (
        <AdventureExpandedItem key={item.id} onClick={() => onAdventureClick?.(item.id)}>
          <ExploreIcon sx={{ fontSize: '0.7rem', color: '#06b6d4', flexShrink: 0, marginTop: '2px' }} />
          {item.time && <TimeTag>{item.time}</TimeTag>}
          {item.label}
          {badge}
        </AdventureExpandedItem>
      )
    default:
      return null
  }
}

const ExpandedDayView = ({
  day: _day,
  isExpanded,
  pendingTodos,
  completedTodos,
  birthdays,
  meals,
  adventures,
  isOverdue,
  isToday,
  onItemClick,
  onBirthdayClick,
  onMealPlanClick,
  onAdventureClick,
}: IExpandedDayViewProps) => {
  const timeSlots = useMemo(
    () => buildTimeSlots(pendingTodos, completedTodos, birthdays, meals, adventures, isOverdue),
    [pendingTodos, completedTodos, birthdays, meals, adventures, isOverdue],
  )

  const currentHour = isToday ? dayjs().hour() : -1
  const currentMinute = isToday ? dayjs().minute() : 0

  return (
    <Collapse in={isExpanded} timeout={150}>
      <ExpandedDayContainer isToday={isToday}>
        {timeSlots.allDay.length > 0 && (
          <AllDaySection>
            <AllDayLabel>All day</AllDayLabel>
            {timeSlots.allDay.map(item =>
              renderItem(item, onItemClick, onBirthdayClick, onMealPlanClick, onAdventureClick),
            )}
          </AllDaySection>
        )}

        <HourBlocksContainer>
          {HOUR_SLOTS.map(hour => {
            const items = timeSlots.hourly.get(hour) ?? []
            const showTimeLine = isToday && hour === currentHour

            return (
              <div key={hour}>
                {showTimeLine && (
                  <CurrentTimeIndicator
                    style={{ marginTop: `${(currentMinute / 60) * 100}%` }}
                  />
                )}
                <HourBlock hasItems={items.length > 0}>
                  <HourLabel>{formatHour(hour)}</HourLabel>
                  <HourContent>
                    {items.map(item =>
                      renderItem(item, onItemClick, onBirthdayClick, onMealPlanClick, onAdventureClick),
                    )}
                  </HourContent>
                </HourBlock>
              </div>
            )
          })}
        </HourBlocksContainer>
      </ExpandedDayContainer>
    </Collapse>
  )
}

// Small inline styled components used only here
import { styled } from '@mui/material/styles'

const TimeTag = styled('span')({
  fontSize: '0.6rem',
  fontWeight: 600,
  color: '#6366f1',
  backgroundColor: '#eef2ff',
  padding: '1px 5px',
  borderRadius: '4px',
  marginRight: '4px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
})

const AdventureExpandedItem = styled('div')({
  fontSize: '0.72rem',
  padding: '5px 7px 5px 9px',
  borderRadius: '8px',
  cursor: 'pointer',
  wordBreak: 'break-word',
  lineHeight: 1.4,
  transition: 'all 0.12s ease',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '4px',
  color: '#0e7490',
  backgroundColor: '#ecfeff',
  borderLeft: '3px solid #06b6d4',
  '&:hover': {
    backgroundColor: '#cffafe',
  },
})

export default ExpandedDayView
