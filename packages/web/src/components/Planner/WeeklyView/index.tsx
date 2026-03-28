import { useState, useMemo, useCallback } from 'react'
import { useSwipeToNavigate } from '../../../hooks/useSwipeToNavigate'
import { IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import dayjs, { Dayjs } from 'dayjs'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../types/mealPlan'
import { IAdventure } from '../../../types/adventure'
import { buildAdventuresByDay, getAdventurePosition, AdventurePosition } from '../../../utils/adventure'
import {
  WeeklyContainer,
  WeekHeader,
  WeekRangeLabel,
  TodayButton,
  WeekRowsWrapper,
  DayRow,
  DayRowHeader,
  DayName,
  DayNumber,
  DayRowItems,
  DayItem,
  OverdueDayItem,
  CompletedDayItem,
  BirthdayItem,
  BirthdayIconStyled,
  MealItem,
  MealIconStyled,
  AdventureConnectedDayWrapper,
} from './index.styled'
import PrivateItemBadge from '../../PrivateItemBadge'
import AdventureWeeklyItem from './AdventureWeeklyItem'

interface IWeeklyViewProps {
  visibleToDoItems: ITodoItem[]
  onItemClick: (id: string) => void
  birthdayItems?: IBirthdayItem[]
  onBirthdayClick?: (id: string) => void
  mealPlans?: IMealPlan[]
  onAddMealPlan?: (date: string) => void
  onMealPlanClick?: (mealPlan: IMealPlan) => void
  adventures?: IAdventure[]
  onAdventureClick?: (id: string) => void
}

const getWeekStart = (d: Dayjs): Dayjs => {
  const day = d.day()
  const diff = -((day - 1 + 7) % 7)
  return d.startOf('day').add(diff, 'day')
}

const WeeklyView = ({
  visibleToDoItems,
  onItemClick,
  birthdayItems = [],
  onBirthdayClick,
  mealPlans = [],
  onAddMealPlan: _onAddMealPlan,
  onMealPlanClick,
  adventures = [],
  onAdventureClick,
}: IWeeklyViewProps) => {
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(() => getWeekStart(dayjs()))
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)
  const today = dayjs()
  const [adventureWidths, setAdventureWidths] = useState<Map<string, number>>(() => new Map())

  const handleAdventureMeasure = useCallback((id: string, width: number) => {
    setAdventureWidths(prev => {
      if (prev.get(id) === width) return prev
      const next = new Map(prev)
      next.set(id, width)
      return next
    })
  }, [])

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => currentWeek.add(i, 'day')),
    [currentWeek]
  )

const goToPrevWeek = useCallback(() => {
    setCurrentWeek(prev => prev.subtract(1, 'week'))
    setAnimationDirection('right')
  }, [])
  const goToNextWeek = useCallback(() => {
    setCurrentWeek(prev => prev.add(1, 'week'))
    setAnimationDirection('left')
  }, [])
  const goToToday = () => setCurrentWeek(getWeekStart(dayjs()))

  const { handlers: swipeHandlers } = useSwipeToNavigate({
    onSwipeLeft: goToNextWeek,
    onSwipeRight: goToPrevWeek,
  })

  const weekRangeLabel = useMemo(() => {
    const start = weekDays[0]
    const end = weekDays[6]
    if (start.month() === end.month()) {
      return `${start.format('MMM D')} – ${end.format('D, YYYY')}`
    }
    if (start.year() === end.year()) {
      return `${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`
    }
    return `${start.format('MMM D, YYYY')} – ${end.format('MMM D, YYYY')}`
  }, [weekDays])

  const itemsWithDueDate = useMemo(
    () => visibleToDoItems.filter(item => item.dueDate != null),
    [visibleToDoItems]
  )

  const pendingTodosByDay = useMemo(() => {
    const map = new Map<string, ITodoItem[]>()
    for (const item of itemsWithDueDate.filter(i => !i.isDone)) {
      const key = dayjs(item.dueDate!).format('YYYY-MM-DD')
      const existing = map.get(key)
      if (existing) {
        existing.push(item)
      } else {
        map.set(key, [item])
      }
    }
    return map
  }, [itemsWithDueDate])

  const completedTodosByDay = useMemo(() => {
    const map = new Map<string, ITodoItem[]>()
    for (const item of itemsWithDueDate.filter(i => i.isDone)) {
      const key = dayjs(item.dueDate!).format('YYYY-MM-DD')
      const existing = map.get(key)
      if (existing) {
        existing.push(item)
      } else {
        map.set(key, [item])
      }
    }
    return map
  }, [itemsWithDueDate])

  const birthdaysByDay = useMemo(() => {
    const map = new Map<string, IBirthdayItem[]>()
    for (const item of birthdayItems) {
      const key = `${item.month}-${item.day}`
      const existing = map.get(key)
      if (existing) {
        existing.push(item)
      } else {
        map.set(key, [item])
      }
    }
    return map
  }, [birthdayItems])

  const mealPlansByDay = useMemo(() => {
    const map = new Map<string, IMealPlan[]>()
    for (const plan of mealPlans) {
      const existing = map.get(plan.date)
      if (existing) {
        existing.push(plan)
      } else {
        map.set(plan.date, [plan])
      }
    }
    return map
  }, [mealPlans])

  const adventuresByDay = useMemo(() => buildAdventuresByDay(adventures), [adventures])

  const isCurrentWeek = getWeekStart(today).isSame(currentWeek, 'day')

  return (
    <WeeklyContainer>
      <WeekHeader>
        <IconButton size="small" onClick={goToPrevWeek} aria-label="Previous week">
          <ChevronLeftIcon />
        </IconButton>
        <WeekRangeLabel>{weekRangeLabel}</WeekRangeLabel>
        {!isCurrentWeek && (
          <TodayButton variant="outlined" size="small" onClick={goToToday}>
            Today
          </TodayButton>
        )}
        <IconButton size="small" onClick={goToNextWeek} aria-label="Next week">
          <ChevronRightIcon />
        </IconButton>
      </WeekHeader>

      <WeekRowsWrapper $animationDirection={animationDirection} {...swipeHandlers}>
        {weekDays.map(day => {
          const key = day.format('YYYY-MM-DD')
          const isToday = day.isSame(today, 'day')
          const isOverdue = day.isBefore(today, 'day')
          const pendingTodos = pendingTodosByDay.get(key) ?? []
          const completedTodos = completedTodosByDay.get(key) ?? []
          const birthdayKey = `${day.month() + 1}-${day.date()}`
          const dayBirthdays = birthdaysByDay.get(birthdayKey) ?? []
          const dayMeals = mealPlansByDay.get(key) ?? []
          const dayAdventures = adventuresByDay.get(key) ?? []

          const hasAdventureContinuingToNext = dayAdventures.some(
            a => {
              const pos = getAdventurePosition(a, key)
              return pos === AdventurePosition.Start || pos === AdventurePosition.Middle
            }
          )
          const hasAdventureContinuingFromPrev = dayAdventures.some(
            a => {
              const pos = getAdventurePosition(a, key)
              return pos === AdventurePosition.Middle || pos === AdventurePosition.End
            }
          )

          const Wrapper = hasAdventureContinuingFromPrev ? AdventureConnectedDayWrapper : 'div'

          return (
            <Wrapper key={key}>
              <DayRow
                isToday={isToday}
                adventureContinuesToNext={hasAdventureContinuingToNext}
                adventureContinuesFromPrev={hasAdventureContinuingFromPrev}
              >
                <DayRowHeader isToday={isToday}>
                  <DayName isToday={isToday}>{day.format('ddd')}</DayName>
                  <DayNumber isToday={isToday}>{day.date()}</DayNumber>
                </DayRowHeader>

                {dayAdventures
                  .filter(a => getAdventurePosition(a, key) !== AdventurePosition.Single)
                  .map(adventure => (
                    <AdventureWeeklyItem
                      key={adventure.id}
                      adventure={adventure}
                      dayKey={key}
                      onClick={() => onAdventureClick?.(adventure.id)}
                      onMeasure={handleAdventureMeasure}
                      measuredWidth={adventureWidths.get(adventure.id)}
                    />
                  ))}

                <DayRowItems>
                  {pendingTodos.map(todo =>
                    isOverdue ? (
                      <OverdueDayItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                        {todo.name}
                        {todo.visibility === 'private' && <PrivateItemBadge />}
                      </OverdueDayItem>
                    ) : (
                      <DayItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                        {todo.name}
                        {todo.visibility === 'private' && <PrivateItemBadge />}
                      </DayItem>
                    )
                  )}
                  {completedTodos.map(todo => (
                    <CompletedDayItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                      {todo.name}
                      {todo.visibility === 'private' && <PrivateItemBadge />}
                    </CompletedDayItem>
                  ))}
                  {dayBirthdays.map(birthday => (
                    <BirthdayItem key={birthday.id} onClick={() => onBirthdayClick?.(birthday.id)}>
                      <BirthdayIconStyled />
                      {birthday.name}
                      {birthday.visibility === 'private' && <PrivateItemBadge />}
                    </BirthdayItem>
                  ))}
                  {dayMeals.map(plan => (
                    <MealItem key={plan.id} onClick={() => onMealPlanClick?.(plan)}>
                      <MealIconStyled />
                      {plan.recipeName}
                      {plan.visibility === 'private' && <PrivateItemBadge />}
                    </MealItem>
                  ))}
                  {dayAdventures
                    .filter(a => getAdventurePosition(a, key) === AdventurePosition.Single)
                    .map(adventure => (
                      <AdventureWeeklyItem
                        key={adventure.id}
                        adventure={adventure}
                        dayKey={key}
                        onClick={() => onAdventureClick?.(adventure.id)}
                      />
                    ))}
                </DayRowItems>
              </DayRow>
            </Wrapper>
          )
        })}
      </WeekRowsWrapper>
    </WeeklyContainer>
  )
}

export default WeeklyView
