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
import { IOfficeAttendance } from '../../../types/officeAttendance'
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
import { Avatar } from '@mui/material'
import PrivateItemBadge from '../../PrivateItemBadge'
import AdventureWeeklyItem from './AdventureWeeklyItem'
import DayPreviewDrawer from '../../DayPreviewDrawer'

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
  onAddAdventure?: (date: string) => void
  onAddTask?: (date: string) => void
  officeAttendance?: IOfficeAttendance[]
  onRemoveAttendance?: (id: string) => void
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
  onAddAdventure,
  onAddTask,
  officeAttendance = [],
  onRemoveAttendance,
}: IWeeklyViewProps) => {
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(() => getWeekStart(dayjs()))
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)
  const today = dayjs()
  const [adventureWidths, setAdventureWidths] = useState<Map<string, number>>(() => new Map())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

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

  const handleDayClick = useCallback((dayKey: string) => {
    setSelectedDay(dayKey)
  }, [])

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

  const officeAttendanceByDay = useMemo(() => {
    const map = new Map<string, IOfficeAttendance[]>()
    for (const entry of officeAttendance) {
      const existing = map.get(entry.date)
      if (existing) {
        existing.push(entry)
      } else {
        map.set(entry.date, [entry])
      }
    }
    return map
  }, [officeAttendance])

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
          const dayOfficeAttendance = officeAttendanceByDay.get(key) ?? []

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

          const singleDayAdventures = dayAdventures.filter(
            a => getAdventurePosition(a, key) === AdventurePosition.Single
          )

          return (
            <Wrapper key={key}>
              <DayRow
                isToday={isToday}
                adventureContinuesToNext={hasAdventureContinuingToNext}
                adventureContinuesFromPrev={hasAdventureContinuingFromPrev}
                onClick={() => handleDayClick(key)}
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
                      <OverdueDayItem key={todo.id} onClick={(e) => { e.stopPropagation(); onItemClick(todo.id) }}>
                        {todo.name}
                        {todo.visibility === 'private' && <PrivateItemBadge />}
                      </OverdueDayItem>
                    ) : (
                      <DayItem key={todo.id} onClick={(e) => { e.stopPropagation(); onItemClick(todo.id) }}>
                        {todo.name}
                        {todo.visibility === 'private' && <PrivateItemBadge />}
                      </DayItem>
                    )
                  )}
                  {completedTodos.map(todo => (
                    <CompletedDayItem key={todo.id} onClick={(e) => { e.stopPropagation(); onItemClick(todo.id) }}>
                      {todo.name}
                      {todo.visibility === 'private' && <PrivateItemBadge />}
                    </CompletedDayItem>
                  ))}
                  {dayBirthdays.map(birthday => (
                    <BirthdayItem key={birthday.id} onClick={(e) => { e.stopPropagation(); onBirthdayClick?.(birthday.id) }}>
                      <BirthdayIconStyled />
                      {birthday.name}
                      {birthday.visibility === 'private' && <PrivateItemBadge />}
                    </BirthdayItem>
                  ))}
                  {dayMeals.map(plan => (
                    <MealItem key={plan.id} onClick={(e) => { e.stopPropagation(); onMealPlanClick?.(plan) }}>
                      <MealIconStyled />
                      {plan.recipeName}
                      {plan.visibility === 'private' && <PrivateItemBadge />}
                    </MealItem>
                  ))}
                  {singleDayAdventures.map(adventure => (
                    <AdventureWeeklyItem
                      key={adventure.id}
                      adventure={adventure}
                      dayKey={key}
                      onClick={() => onAdventureClick?.(adventure.id)}
                    />
                  ))}
                  {dayOfficeAttendance.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
                      {dayOfficeAttendance.slice(0, 4).map(entry => (
                        <Avatar
                          key={entry.id}
                          src={entry.userAvatar}
                          sx={{
                            width: 20,
                            height: 20,
                            fontSize: '0.55rem',
                            bgcolor: '#0284c7',
                            fontWeight: 600,
                          }}
                        >
                          {entry.userName.charAt(0).toUpperCase()}
                        </Avatar>
                      ))}
                      {dayOfficeAttendance.length > 4 && (
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600 }}>
                          +{dayOfficeAttendance.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </DayRowItems>
              </DayRow>
            </Wrapper>
          )
        })}
      </WeekRowsWrapper>

      <DayPreviewDrawer
        open={selectedDay !== null}
        selectedDay={selectedDay}
        pendingTodos={selectedDay ? (pendingTodosByDay.get(selectedDay) ?? []) : []}
        completedTodos={selectedDay ? (completedTodosByDay.get(selectedDay) ?? []) : []}
        isOverdue={selectedDay ? dayjs(selectedDay).isBefore(today, 'day') : false}
        birthdays={selectedDay ? (birthdaysByDay.get(`${dayjs(selectedDay).month() + 1}-${dayjs(selectedDay).date()}`) ?? []) : []}
        mealPlans={selectedDay ? (mealPlansByDay.get(selectedDay) ?? []) : []}
        adventures={selectedDay ? (adventuresByDay.get(selectedDay) ?? []) : []}
        officeAttendance={selectedDay ? (officeAttendanceByDay.get(selectedDay) ?? []) : []}
        onClose={() => setSelectedDay(null)}
        onTodoClick={onItemClick}
        onBirthdayClick={onBirthdayClick}
        onAddMealPlan={_onAddMealPlan}
        onMealPlanClick={onMealPlanClick}
        onAdventureClick={onAdventureClick}
        onAddAdventure={onAddAdventure}
        onAddTask={onAddTask}
        onRemoveAttendance={onRemoveAttendance}
      />
    </WeeklyContainer>
  )
}

export default WeeklyView
