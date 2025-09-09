import { INoiseTimestampFormatted, DueDateClass } from './types'

export const formatDueDateRelative = (dueDate?: number): string => {
  if (!dueDate) return ''
  
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    const absDays = Math.abs(diffDays)
    if (absDays === 1) return 'overdue by 1 day'
    return `overdue by ${absDays} days`
  } else if (diffDays === 0) {
    return 'due today'
  } else if (diffDays === 1) {
    return 'due tomorrow'
  } else if (diffDays <= 7) {
    return `in ${diffDays} days`
  } else if (diffDays <= 30) {
    const weeks = Math.ceil(diffDays / 7)
    return weeks === 1 ? 'in 1 week' : `in ${weeks} weeks`
  } else {
    const months = Math.ceil(diffDays / 30)
    return months === 1 ? 'in 1 month' : `in ${months} months`
  }
}

export const getDueDateClass = (dueDate?: number): DueDateClass => {
  if (!dueDate) return ''
  
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays <= 3) return 'soon'
  return ''
}

export const formatNoiseTimestamp = (timestamp: number): INoiseTimestampFormatted => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  today.setHours(0, 0, 0, 0)
  yesterday.setHours(0, 0, 0, 0)
  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)
  
  if (dateOnly.getTime() === today.getTime()) {
    return {
      date: 'Today',
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return {
      date: 'Yesterday',
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  } else {
    return {
      date: date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
