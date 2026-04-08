import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IAdventure } from '../../../types/adventure'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
import { IOfficeAttendance } from '../../../types/officeAttendance'

export enum TimeGroup {
  OVERDUE = 'overdue',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'thisWeek',
  NEXT_WEEK = 'nextWeek',
  LATER = 'later',
  NO_DUE_DATE = 'noDueDate',
}

export interface IGroupedTodoItem {
  group: TimeGroup
  groupLabel: string
  items: ITodoItem[]
  priority: number
}

export const TIME_GROUP_META: Record<
  TimeGroup,
  {
    emoji: string
    bg: string
    fg: string
    priority: number
  }
> = {
  [TimeGroup.OVERDUE]: {
    emoji: '⚠️',
    bg: '#fef2f2',
    fg: '#dc2626',
    priority: 1,
  },
  [TimeGroup.TODAY]: { emoji: '📅', bg: '#ecfdf5', fg: '#059669', priority: 2 },
  [TimeGroup.TOMORROW]: {
    emoji: '📌',
    bg: '#eff6ff',
    fg: '#2563eb',
    priority: 3,
  },
  [TimeGroup.THIS_WEEK]: {
    emoji: '📆',
    bg: '#fefce8',
    fg: '#ca8a04',
    priority: 4,
  },
  [TimeGroup.NEXT_WEEK]: {
    emoji: '🗓️',
    bg: '#f0f9ff',
    fg: '#0284c7',
    priority: 5,
  },
  [TimeGroup.LATER]: { emoji: '⏳', bg: '#f8fafc', fg: '#64748b', priority: 6 },
  [TimeGroup.NO_DUE_DATE]: {
    emoji: '📝',
    bg: '#f5f5f5',
    fg: '#6b7280',
    priority: 7,
  },
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return date.toDateString() === tomorrow.toDateString()
}

const isThisWeek = (date: Date): boolean => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - ((today.getDay() - 1 + 7) % 7)) // Monday
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday

  return date >= startOfWeek && date <= endOfWeek
}

const isNextWeek = (date: Date): boolean => {
  const today = new Date()
  const startOfNextWeek = new Date(today)
  startOfNextWeek.setDate(today.getDate() - ((today.getDay() - 1 + 7) % 7) + 7) // Next Monday
  const endOfNextWeek = new Date(startOfNextWeek)
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6) // Next Sunday

  return date >= startOfNextWeek && date <= endOfNextWeek
}

const getTimeGroup = (dueDate?: number): TimeGroup => {
  if (!dueDate) {
    return TimeGroup.NO_DUE_DATE
  }

  const date = new Date(dueDate)
  const now = new Date()

  if (date < now && !isToday(date)) {
    return TimeGroup.OVERDUE
  }

  if (isToday(date)) {
    return TimeGroup.TODAY
  }

  if (isTomorrow(date)) {
    return TimeGroup.TOMORROW
  }

  if (isThisWeek(date)) {
    return TimeGroup.THIS_WEEK
  }

  if (isNextWeek(date)) {
    return TimeGroup.NEXT_WEEK
  }

  return TimeGroup.LATER
}

const getTodoGroupLabel = (group: TimeGroup, itemsCount: number): string => {
  switch (group) {
    case TimeGroup.OVERDUE:
      return itemsCount === 1 ? 'Overdue' : `Overdue (${itemsCount})`
    case TimeGroup.TODAY:
      return 'Due Today'
    case TimeGroup.TOMORROW:
      return 'Due Tomorrow'
    case TimeGroup.THIS_WEEK:
      return 'This Week'
    case TimeGroup.NEXT_WEEK:
      return 'Next Week'
    case TimeGroup.LATER:
      return 'Later'
    case TimeGroup.NO_DUE_DATE:
      return 'No Due Date'
    default:
      return 'Unknown'
  }
}

const getDateGroupLabel = (group: TimeGroup, itemsCount: number): string => {
  const count = itemsCount > 1 ? ` (${itemsCount})` : ''
  switch (group) {
    case TimeGroup.TODAY:
      return `Today${count}`
    case TimeGroup.TOMORROW:
      return `Tomorrow${count}`
    case TimeGroup.THIS_WEEK:
      return `This Week${count}`
    case TimeGroup.NEXT_WEEK:
      return `Next Week${count}`
    case TimeGroup.LATER:
      return `Later${count}`
    default:
      return `Upcoming${count}`
  }
}

export const getUnifiedGroupLabel = (
  group: TimeGroup,
  totalCount: number
): string => {
  switch (group) {
    case TimeGroup.OVERDUE:
      return totalCount === 1 ? 'Overdue' : `Overdue (${totalCount})`
    case TimeGroup.TODAY:
      return 'Today'
    case TimeGroup.TOMORROW:
      return 'Tomorrow'
    case TimeGroup.THIS_WEEK:
      return 'This Week'
    case TimeGroup.NEXT_WEEK:
      return 'Next Week'
    case TimeGroup.LATER:
      return 'Later'
    case TimeGroup.NO_DUE_DATE:
      return 'No Due Date'
    default:
      return 'Unknown'
  }
}

export const groupTodosByTime = (todos: ITodoItem[]): IGroupedTodoItem[] => {
  const groups = new Map<TimeGroup, ITodoItem[]>()

  // Initialize all groups
  Object.values(TimeGroup).forEach((group) => {
    groups.set(group, [])
  })

  // Group todos by time
  todos.forEach((todo) => {
    const group = getTimeGroup(todo.dueDate)
    const existingItems = groups.get(group) || []
    groups.set(group, [...existingItems, todo])
  })

  // Sort items within each group by due date
  groups.forEach((items, _group) => {
    items.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate - b.dueDate
    })
  })

  // Convert to array and filter out empty groups
  const result: IGroupedTodoItem[] = []

  groups.forEach((items, group) => {
    if (items.length > 0) {
      result.push({
        group,
        groupLabel: getTodoGroupLabel(group, items.length),
        items,
        priority: TIME_GROUP_META[group].priority,
      })
    }
  })

  // Sort by priority
  result.sort((a, b) => a.priority - b.priority)

  return result
}

export const getTotalItemsCount = (
  groupedItems: IGroupedTodoItem[]
): number => {
  return groupedItems.reduce((total, group) => total + group.items.length, 0)
}

export interface IGroupedAdventureItem {
  group: TimeGroup
  groupLabel: string
  items: IAdventure[]
  priority: number
}

export const getTimeGroupForDateString = (dateString: string): TimeGroup => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (date < today) {
    return TimeGroup.OVERDUE
  }

  if (isToday(date)) {
    return TimeGroup.TODAY
  }

  if (isTomorrow(date)) {
    return TimeGroup.TOMORROW
  }

  if (isThisWeek(date)) {
    return TimeGroup.THIS_WEEK
  }

  if (isNextWeek(date)) {
    return TimeGroup.NEXT_WEEK
  }

  return TimeGroup.LATER
}

interface IGroupedDateItem<T> {
  group: TimeGroup
  groupLabel: string
  items: T[]
  priority: number
}

const groupByDateString = <T>(
  items: T[],
  getDate: (item: T) => string
): IGroupedDateItem<T>[] => {
  const groups = new Map<TimeGroup, T[]>()

  items.forEach((item) => {
    const group = getTimeGroupForDateString(getDate(item))
    if (group === TimeGroup.OVERDUE) return
    const existing = groups.get(group) || []
    groups.set(group, [...existing, item])
  })

  groups.forEach((groupItems) => {
    groupItems.sort((a, b) => getDate(a).localeCompare(getDate(b)))
  })

  const result: IGroupedDateItem<T>[] = []

  groups.forEach((groupItems, group) => {
    if (groupItems.length > 0) {
      result.push({
        group,
        groupLabel: getDateGroupLabel(group, groupItems.length),
        items: groupItems,
        priority: TIME_GROUP_META[group].priority,
      })
    }
  })

  result.sort((a, b) => a.priority - b.priority)

  return result
}

export const groupAdventuresByTime = (
  adventures: IAdventure[]
): IGroupedAdventureItem[] => groupByDateString(adventures, (a) => a.date)

export interface IBirthdayWithNextDate extends IBirthdayItem {
  nextDate: string
}

export interface IGroupedBirthdayItem {
  group: TimeGroup
  groupLabel: string
  items: IBirthdayWithNextDate[]
  priority: number
}

export const getNextBirthdayDate = (month: number, day: number): string => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisYear = new Date(now.getFullYear(), month - 1, day)

  const target =
    thisYear >= today
      ? thisYear
      : new Date(now.getFullYear() + 1, month - 1, day)

  const y = target.getFullYear()
  const m = String(target.getMonth() + 1).padStart(2, '0')
  const d = String(target.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const groupBirthdaysByTime = (
  birthdays: IBirthdayItem[]
): IGroupedBirthdayItem[] => {
  const enriched: IBirthdayWithNextDate[] = birthdays.map((birthday) => ({
    ...birthday,
    nextDate: getNextBirthdayDate(birthday.month, birthday.day),
  }))

  return groupByDateString(enriched, (b) => b.nextDate)
}

export interface IGroupedOfficeAttendanceItem {
  group: TimeGroup
  groupLabel: string
  items: IOfficeAttendance[]
  priority: number
}

export const groupOfficeAttendanceByTime = (
  attendance: IOfficeAttendance[]
): IGroupedOfficeAttendanceItem[] =>
  groupByDateString(attendance, (a) => a.date)
