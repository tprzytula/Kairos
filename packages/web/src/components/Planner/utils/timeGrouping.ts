import { ITodoItem } from '../../../api/toDoList/retrieve/types'

export enum TimeGroup {
  OVERDUE = 'overdue',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'thisWeek',
  NEXT_WEEK = 'nextWeek',
  LATER = 'later',
  NO_DUE_DATE = 'noDueDate'
}

export interface IGroupedTodoItem {
  group: TimeGroup
  groupLabel: string
  items: ITodoItem[]
  priority: number
}

export const TIME_GROUP_META: Record<TimeGroup, { 
  emoji: string
  bg: string
  fg: string
  priority: number 
}> = {
  [TimeGroup.OVERDUE]: { emoji: '⚠️', bg: '#fef2f2', fg: '#dc2626', priority: 1 },
  [TimeGroup.TODAY]: { emoji: '📅', bg: '#ecfdf5', fg: '#059669', priority: 2 },
  [TimeGroup.TOMORROW]: { emoji: '📌', bg: '#eff6ff', fg: '#2563eb', priority: 3 },
  [TimeGroup.THIS_WEEK]: { emoji: '📆', bg: '#fefce8', fg: '#ca8a04', priority: 4 },
  [TimeGroup.NEXT_WEEK]: { emoji: '🗓️', bg: '#f0f9ff', fg: '#0284c7', priority: 5 },
  [TimeGroup.LATER]: { emoji: '⏳', bg: '#f8fafc', fg: '#64748b', priority: 6 },
  [TimeGroup.NO_DUE_DATE]: { emoji: '📝', bg: '#f5f5f5', fg: '#6b7280', priority: 7 },
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
  startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
  
  return date >= startOfWeek && date <= endOfWeek
}

const isNextWeek = (date: Date): boolean => {
  const today = new Date()
  const startOfNextWeek = new Date(today)
  startOfNextWeek.setDate(today.getDate() - today.getDay() + 8) // Next Monday
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

const getGroupLabel = (group: TimeGroup, itemsCount: number): string => {
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

export const groupTodosByTime = (todos: ITodoItem[]): IGroupedTodoItem[] => {
  const groups = new Map<TimeGroup, ITodoItem[]>()
  
  // Initialize all groups
  Object.values(TimeGroup).forEach(group => {
    groups.set(group, [])
  })
  
  // Group todos by time
  todos.forEach(todo => {
    const group = getTimeGroup(todo.dueDate)
    const existingItems = groups.get(group) || []
    groups.set(group, [...existingItems, todo])
  })
  
  // Sort items within each group by due date
  groups.forEach((items, group) => {
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
        groupLabel: getGroupLabel(group, items.length),
        items,
        priority: TIME_GROUP_META[group].priority
      })
    }
  })
  
  // Sort by priority
  result.sort((a, b) => a.priority - b.priority)
  
  return result
}

export const getTotalItemsCount = (groupedItems: IGroupedTodoItem[]): number => {
  return groupedItems.reduce((total, group) => total + group.items.length, 0)
}
