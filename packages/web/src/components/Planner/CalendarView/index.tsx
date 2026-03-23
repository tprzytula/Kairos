import { useState, useMemo } from 'react'
import { useAppState } from '../../../providers/AppStateProvider'
import { ActionName } from '../../../providers/AppStateProvider/enums'
import { IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import dayjs, { Dayjs } from 'dayjs'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../types/mealPlan'
import { IAdventure } from '../../../types/adventure'
import DayPreviewDrawer from '../../DayPreviewDrawer'
import {
  Container,
  CalendarHeader,
  MonthLabel,
  WeekDayHeader,
  WeekDayLabel,
  CalendarGrid,
  DayCell,
  DayNumber,
  TodoDot,
  CompletedTodoDot,
  NoDueDateSection,
  NoDueDateHeader,
  NoDueDateItem,
  CompletedNoDueDateItem,
  BirthdayCakeIcon,
  MealPlanIcon,
  AdventureCalendarIcon,
} from './index.styled'

// Jan 4 2021 was a Monday — generate Mon-first weekday labels via browser locale
const WEEK_DAYS = Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(2021, 0, 4 + i))
)

interface ICalendarViewProps {
  visibleToDoItems: ITodoItem[]
  onItemClick: (id: string) => void
  birthdayItems?: IBirthdayItem[]
  onBirthdayClick?: (id: string) => void
  mealPlans?: IMealPlan[]
  onAddMealPlan?: (date: string) => void
  onMealPlanClick?: (mealPlan: IMealPlan) => void
  onAddTask?: (date: string) => void
  adventures?: IAdventure[]
  onAdventureClick?: (id: string) => void
}

const CalendarView = ({
  visibleToDoItems,
  onItemClick,
  birthdayItems = [],
  onBirthdayClick,
  mealPlans = [],
  onAddMealPlan,
  onMealPlanClick,
  onAddTask,
  adventures = [],
  onAdventureClick,
}: ICalendarViewProps) => {
  const { dispatch } = useAppState()
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(() => dayjs().startOf('month'))
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const today = dayjs()

  const goToPrevMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, 'month'))
    setSelectedDay(null)
  }
  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, 'month'))
    setSelectedDay(null)
  }

  const itemsWithDueDate = useMemo(
    () => visibleToDoItems.filter(item => item.dueDate != null),
    [visibleToDoItems]
  )
  const itemsWithoutDueDate = useMemo(
    () => visibleToDoItems.filter(item => item.dueDate == null),
    [visibleToDoItems]
  )

  // Map from "YYYY-MM-DD" -> ITodoItem[] (pending only)
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

  // Map from "YYYY-MM-DD" -> ITodoItem[] (completed only)
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

  const selectedDayPendingTodos = useMemo(
    () => (selectedDay ? (pendingTodosByDay.get(selectedDay) ?? []) : []),
    [selectedDay, pendingTodosByDay]
  )

  const selectedDayCompletedTodos = useMemo(
    () => (selectedDay ? (completedTodosByDay.get(selectedDay) ?? []) : []),
    [selectedDay, completedTodosByDay]
  )

  const isSelectedDayOverdue = useMemo(
    () => selectedDay ? dayjs(selectedDay).isBefore(today, 'day') : false,
    [selectedDay, today]
  )

  // Map "month-day" -> IBirthdayItem[] for current month display
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

  const selectedDayBirthdays = useMemo(() => {
    if (!selectedDay) return []
    const d = dayjs(selectedDay)
    const key = `${d.month() + 1}-${d.date()}`
    return birthdaysByDay.get(key) ?? []
  }, [selectedDay, birthdaysByDay])

  // Map from "YYYY-MM-DD" -> IMealPlan[]
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

  const selectedDayMealPlans = useMemo(
    () => (selectedDay ? (mealPlansByDay.get(selectedDay) ?? []) : []),
    [selectedDay, mealPlansByDay]
  )

  // Map from "YYYY-MM-DD" -> IAdventure[]
  const adventuresByDay = useMemo(() => {
    const map = new Map<string, IAdventure[]>()
    for (const adventure of adventures) {
      const existing = map.get(adventure.date)
      if (existing) {
        existing.push(adventure)
      } else {
        map.set(adventure.date, [adventure])
      }
    }
    return map
  }, [adventures])

  const selectedDayAdventures = useMemo(
    () => (selectedDay ? (adventuresByDay.get(selectedDay) ?? []) : []),
    [selectedDay, adventuresByDay]
  )

  // Build the grid: pad the start with days from the previous month
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startPad = (startOfMonth.day() + 6) % 7
    const endPad = 6 - (endOfMonth.day() + 6) % 7

    const days: Dayjs[] = []
    for (let i = startPad - 1; i >= 0; i--) {
      days.push(startOfMonth.subtract(i + 1, 'day'))
    }
    for (let d = 0; d < endOfMonth.date(); d++) {
      days.push(startOfMonth.add(d, 'day'))
    }
    for (let i = 0; i < endPad; i++) {
      days.push(endOfMonth.add(i + 1, 'day'))
    }
    return days
  }, [currentMonth])

  const handleDayClick = (day: Dayjs, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return
    const key = day.format('YYYY-MM-DD')
    setSelectedDay(prev => {
      const next = prev === key ? null : key
      dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: next })
      return next
    })
  }

  return (
    <Container>
      <CalendarHeader>
        <IconButton size="small" onClick={goToPrevMonth} aria-label="Previous month">
          <ChevronLeftIcon />
        </IconButton>
        <MonthLabel>{currentMonth.format('MMMM YYYY')}</MonthLabel>
        <IconButton size="small" onClick={goToNextMonth} aria-label="Next month">
          <ChevronRightIcon />
        </IconButton>
      </CalendarHeader>

      <WeekDayHeader>
        {WEEK_DAYS.map(day => (
          <WeekDayLabel key={day}>{day}</WeekDayLabel>
        ))}
      </WeekDayHeader>

      <CalendarGrid>
        {calendarDays.map((day, index) => {
          const key = day.format('YYYY-MM-DD')
          const isCurrentMonth = day.month() === currentMonth.month()
          const isToday = day.isSame(today, 'day')
          const isSelected = selectedDay === key
          const pendingCount = pendingTodosByDay.get(key)?.length ?? 0
          const completedCount = completedTodosByDay.get(key)?.length ?? 0
          const birthdayKey = `${day.month() + 1}-${day.date()}`
          const hasBirthday = isCurrentMonth && (birthdaysByDay.get(birthdayKey)?.length ?? 0) > 0
          const hasMealPlan = isCurrentMonth && (mealPlansByDay.get(key)?.length ?? 0) > 0
          const hasAdventure = isCurrentMonth && (adventuresByDay.get(key)?.length ?? 0) > 0

          return (
            <DayCell
              key={index}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              onClick={() => handleDayClick(day, isCurrentMonth)}
            >
              <DayNumber isToday={isToday} isSelected={isSelected}>{day.date()}</DayNumber>
              <TodoDot count={pendingCount} isOverdue={isCurrentMonth && day.isBefore(today, 'day')}>{pendingCount > 0 ? pendingCount : ''}</TodoDot>
              <CompletedTodoDot count={completedCount}>{completedCount > 0 ? completedCount : ''}</CompletedTodoDot>
              {hasBirthday && <BirthdayCakeIcon />}
              {hasMealPlan && <MealPlanIcon />}
              {hasAdventure && <AdventureCalendarIcon />}
            </DayCell>
          )
        })}
      </CalendarGrid>

      <DayPreviewDrawer
        open={selectedDay !== null}
        selectedDay={selectedDay}
        pendingTodos={selectedDayPendingTodos}
        completedTodos={selectedDayCompletedTodos}
        isOverdue={isSelectedDayOverdue}
        birthdays={selectedDayBirthdays}
        mealPlans={selectedDayMealPlans}
        adventures={selectedDayAdventures}
        onClose={() => {
          setSelectedDay(null)
          dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: null })
        }}
        onTodoClick={onItemClick}
        onBirthdayClick={onBirthdayClick}
        onAddMealPlan={onAddMealPlan}
        onMealPlanClick={onMealPlanClick}
        onAdventureClick={onAdventureClick}
        onAddTask={onAddTask}
      />

      {itemsWithoutDueDate.length > 0 && (
        <NoDueDateSection>
          <NoDueDateHeader>📝 No Due Date</NoDueDateHeader>
          {itemsWithoutDueDate.map(item => (
            item.isDone ? (
              <CompletedNoDueDateItem key={item.id} onClick={() => onItemClick(item.id)}>
                {item.name}
              </CompletedNoDueDateItem>
            ) : (
              <NoDueDateItem key={item.id} onClick={() => onItemClick(item.id)}>
                {item.name}
              </NoDueDateItem>
            )
          ))}
        </NoDueDateSection>
      )}
    </Container>
  )
}

export default CalendarView
