import React from 'react'
import { ITodoItem } from '../../../../../../api/toDoList/retrieve/types'
import { getDueDateClass } from '../../../../../../utils/dateTime'
import { TaskRow, TaskDot, TaskName, OverdueBadge, MoreCount } from './index.styled'

interface ITodayTasksCardProps {
  sortedItems: ITodoItem[]
}

const getTodayBounds = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const end = start + 24 * 60 * 60 * 1000
  return { start, end }
}

export const TodayTasksCard: React.FC<ITodayTasksCardProps> = ({ sortedItems }) => {
  const { start, end } = getTodayBounds()

  const overdueItems = sortedItems.filter(item => item.dueDate && item.dueDate < start)
  const todayItems = sortedItems.filter(item => item.dueDate && item.dueDate >= start && item.dueDate < end)
  const displayItems = todayItems.slice(0, 3)
  const moreCount = todayItems.length - displayItems.length

  if (todayItems.length === 0 && overdueItems.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No tasks for today</span>
  }

  return (
    <>
      {overdueItems.length > 0 && (
        <OverdueBadge>{overdueItems.length} overdue</OverdueBadge>
      )}
      {displayItems.map(item => (
        <TaskRow key={item.id}>
          <TaskDot $class={getDueDateClass(item.dueDate)} />
          <TaskName>{item.name}</TaskName>
        </TaskRow>
      ))}
      {moreCount > 0 && <MoreCount>+{moreCount} more</MoreCount>}
      {todayItems.length === 0 && overdueItems.length > 0 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No tasks due today</span>
      )}
    </>
  )
}

export default TodayTasksCard
