import { useState, useMemo } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import dayjs, { Dayjs } from 'dayjs'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
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
  DayDetailPanel,
  DayDetailHeader,
  DayDetailItem,
  CompletedDayDetailItem,
  DayDetailEmpty,
  NoDueDateSection,
  NoDueDateHeader,
  NoDueDateItem,
  CompletedNoDueDateItem,
  BirthdayCakeIcon,
  BirthdayDayDetailItem,
} from './index.styled'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface ICalendarViewProps {
  visibleToDoItems: ITodoItem[]
  onItemClick: (id: string) => void
  birthdayItems?: IBirthdayItem[]
  onBirthdayClick?: (id: string) => void
  onAddBirthday?: () => void
}

const CalendarView = ({ visibleToDoItems, onItemClick, birthdayItems = [], onBirthdayClick, onAddBirthday }: ICalendarViewProps) => {
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

  // Build the grid: pad the start with days from the previous month
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startPad = startOfMonth.day()
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

  const handleDayClick = (day: Dayjs, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return
    const key = day.format('YYYY-MM-DD')
    setSelectedDay(prev => (prev === key ? null : key))
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
        {onAddBirthday && (
          <Tooltip title="Add birthday">
            <IconButton size="small" onClick={onAddBirthday} aria-label="Add birthday">
              <CakeIcon sx={{ color: '#db2777', fontSize: '1.2rem' }} />
            </IconButton>
          </Tooltip>
        )}
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

          return (
            <DayCell
              key={index}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              onClick={() => handleDayClick(day, isCurrentMonth)}
            >
              <DayNumber isToday={isToday} isSelected={isSelected}>{day.date()}</DayNumber>
              <TodoDot count={pendingCount}>{pendingCount > 0 ? pendingCount : ''}</TodoDot>
              <CompletedTodoDot count={completedCount}>{completedCount > 0 ? completedCount : ''}</CompletedTodoDot>
              {hasBirthday && <BirthdayCakeIcon />}
            </DayCell>
          )
        })}
      </CalendarGrid>

      {selectedDay && (
        <DayDetailPanel>
          <DayDetailHeader>
            {dayjs(selectedDay).format('dddd, D MMMM')}
          </DayDetailHeader>
          {selectedDayPendingTodos.length === 0 && selectedDayCompletedTodos.length === 0 ? (
            <DayDetailEmpty>No tasks on this day</DayDetailEmpty>
          ) : (
            <>
              {selectedDayPendingTodos.map(todo => (
                <DayDetailItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                  {todo.name}
                </DayDetailItem>
              ))}
              {selectedDayCompletedTodos.map(todo => (
                <CompletedDayDetailItem key={todo.id} onClick={() => onItemClick(todo.id)}>
                  {todo.name}
                </CompletedDayDetailItem>
              ))}
            </>
          )}
        {selectedDayBirthdays.length > 0 && (
          <>
            {selectedDayBirthdays.map(birthday => (
              <BirthdayDayDetailItem key={birthday.id} onClick={() => onBirthdayClick?.(birthday.id)}>
                <CakeIcon sx={{ fontSize: '0.9rem', color: '#db2777', flexShrink: 0 }} />
                {birthday.name}
              </BirthdayDayDetailItem>
            ))}
          </>
        )}
        </DayDetailPanel>
      )}

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
