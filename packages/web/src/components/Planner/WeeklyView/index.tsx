import { useState, useMemo } from 'react'
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
  const diff = day === 0 ? -6 : 1 - day
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
  const today = dayjs()

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => currentWeek.add(i, 'day')),
    [currentWeek]
  )

const goToPrevWeek = () => setCurrentWeek(prev => prev.subtract(1, 'week'))
  const goToNextWeek = () => setCurrentWeek(prev => prev.add(1, 'week'))
  const goToToday = () => setCurrentWeek(getWeekStart(dayjs()))

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

      <WeekRowsWrapper>
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

                <DayRowItems>
                  {pendingTodos.map(todo =>
                    isOverdue ? (
                      <OverdueDayItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                        {todo.name}
                      </OverdueDayItem>
                    ) : (
                      <DayItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                        {todo.name}
                      </DayItem>
                    )
                  )}
                  {completedTodos.map(todo => (
                    <CompletedDayItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                      {todo.name}
                    </CompletedDayItem>
                  ))}
                  {dayBirthdays.map(birthday => (
                    <BirthdayItem key={birthday.id} onClick={() => onBirthdayClick?.(birthday.id)}>
                      <BirthdayIconStyled />
                      {birthday.name}
                    </BirthdayItem>
                  ))}
                  {dayMeals.map(plan => (
                    <MealItem key={plan.id} onClick={() => onMealPlanClick?.(plan)}>
                      <MealIconStyled />
                      {plan.recipeName}
                    </MealItem>
                  ))}
                  {dayAdventures.map(adventure => (
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
