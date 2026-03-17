import { useState, useMemo, useRef, useEffect } from 'react'
import { IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import dayjs, { Dayjs } from 'dayjs'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../types/mealPlan'
import {
  WeeklyContainer,
  WeekHeader,
  WeekRangeLabel,
  TodayButton,
  WeekGridWrapper,
  WeekGrid,
  DayColumn,
  DayColumnHeader,
  DayName,
  DayNumber,
  DayColumnBody,
  DayItem,
  OverdueDayItem,
  CompletedDayItem,
  BirthdayItem,
  BirthdayIconStyled,
  MealItem,
  MealIconStyled,
} from './index.styled'

interface IWeeklyViewProps {
  visibleToDoItems: ITodoItem[]
  onItemClick: (id: string) => void
  birthdayItems?: IBirthdayItem[]
  onBirthdayClick?: (id: string) => void
  mealPlans?: IMealPlan[]
  onAddMealPlan?: (date: string) => void
  onMealPlanClick?: (mealPlan: IMealPlan) => void
}

const WeeklyView = ({
  visibleToDoItems,
  onItemClick,
  birthdayItems = [],
  onBirthdayClick,
  mealPlans = [],
  onAddMealPlan,
  onMealPlanClick,
}: IWeeklyViewProps) => {
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(() => dayjs().startOf('week'))
  const today = dayjs()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const todayColumnRef = useRef<HTMLDivElement>(null)

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => currentWeek.add(i, 'day')),
    [currentWeek]
  )

  // Scroll to today's column whenever the week changes
  useEffect(() => {
    const wrapper = wrapperRef.current
    const todayEl = todayColumnRef.current
    if (wrapper && todayEl) {
      const scrollLeft =
        todayEl.offsetLeft - wrapper.clientWidth / 2 + todayEl.clientWidth / 2
      wrapper.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
    }
  }, [currentWeek])

  const goToPrevWeek = () => setCurrentWeek(prev => prev.subtract(1, 'week'))
  const goToNextWeek = () => setCurrentWeek(prev => prev.add(1, 'week'))
  const goToToday = () => setCurrentWeek(dayjs().startOf('week'))

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

  const isCurrentWeek = today.isSame(currentWeek, 'week')

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

      <WeekGridWrapper ref={wrapperRef}>
        <WeekGrid>
          {weekDays.map(day => {
            const key = day.format('YYYY-MM-DD')
            const isToday = day.isSame(today, 'day')
            const isOverdue = day.isBefore(today, 'day')
            const pendingTodos = pendingTodosByDay.get(key) ?? []
            const completedTodos = completedTodosByDay.get(key) ?? []
            const birthdayKey = `${day.month() + 1}-${day.date()}`
            const dayBirthdays = birthdaysByDay.get(birthdayKey) ?? []
            const dayMeals = mealPlansByDay.get(key) ?? []

            return (
              <DayColumn
                key={key}
                isToday={isToday}
                ref={isToday ? todayColumnRef : undefined}
              >
                <DayColumnHeader isToday={isToday}>
                  <DayName isToday={isToday}>{day.format('ddd')}</DayName>
                  <DayNumber isToday={isToday}>{day.date()}</DayNumber>
                </DayColumnHeader>

                <DayColumnBody>
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


                </DayColumnBody>
              </DayColumn>
            )
          })}
        </WeekGrid>
      </WeekGridWrapper>
    </WeeklyContainer>
  )
}

export default WeeklyView
