import { useState, useMemo } from 'react'
import { IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import dayjs, { Dayjs } from 'dayjs'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import {
  Container,
  CalendarHeader,
  MonthLabel,
  WeekDayHeader,
  WeekDayLabel,
  CalendarGrid,
  DayCell,
  DayNumber,
  TodoChip,
  MoreLabel,
  NoDueDateSection,
  NoDueDateHeader,
  NoDueDateItem,
} from './index.styled'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_VISIBLE_TODOS = 2

interface ICalendarViewProps {
  visibleToDoItems: ITodoItem[]
  onItemClick: (id: string) => void
}

const CalendarView = ({ visibleToDoItems, onItemClick }: ICalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(() => dayjs().startOf('month'))
  const today = dayjs()

  const goToPrevMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'))
  const goToNextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'))

  const itemsWithDueDate = useMemo(
    () => visibleToDoItems.filter(item => item.dueDate != null),
    [visibleToDoItems]
  )
  const itemsWithoutDueDate = useMemo(
    () => visibleToDoItems.filter(item => item.dueDate == null),
    [visibleToDoItems]
  )

  // Map from "YYYY-MM-DD" -> ITodoItem[]
  const todosByDay = useMemo(() => {
    const map = new Map<string, ITodoItem[]>()
    for (const item of itemsWithDueDate) {
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

  // Build the grid: pad the start with days from the previous month
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startPad = startOfMonth.day() // 0 = Sun
    const endPad = 6 - endOfMonth.day()

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
          const dayTodos = todosByDay.get(key) ?? []
          const visibleTodos = dayTodos.slice(0, MAX_VISIBLE_TODOS)
          const remaining = dayTodos.length - visibleTodos.length

          return (
            <DayCell key={index} isToday={isToday} isCurrentMonth={isCurrentMonth}>
              <DayNumber isToday={isToday}>{day.date()}</DayNumber>
              {visibleTodos.map(todo => (
                <TodoChip key={todo.id} onClick={() => onItemClick(todo.id)}>{todo.name}</TodoChip>
              ))}
              {remaining > 0 && (
                <MoreLabel>+{remaining} more</MoreLabel>
              )}
            </DayCell>
          )
        })}
      </CalendarGrid>

      {itemsWithoutDueDate.length > 0 && (
        <NoDueDateSection>
          <NoDueDateHeader>📝 No Due Date</NoDueDateHeader>
          {itemsWithoutDueDate.map(item => (
            <NoDueDateItem key={item.id} onClick={() => onItemClick(item.id)}>{item.name}</NoDueDateItem>
          ))}
        </NoDueDateSection>
      )}
    </Container>
  )
}

export default CalendarView
