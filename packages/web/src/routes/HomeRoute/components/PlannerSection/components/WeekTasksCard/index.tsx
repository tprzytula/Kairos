import React from 'react'
import { ITodoItem } from '../../../../../../api/toDoList/retrieve/types'
import { getDueDateClass } from '../../../../../../utils/dateTime'
import { TaskRow, TaskDot, TaskName, TaskSubLine, MoreCount } from '../TodayTasksCard/index.styled'

interface IWeekTasksCardProps {
  sortedItems: ITodoItem[]
}

const getWeekBounds = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const end = start + 7 * 24 * 60 * 60 * 1000
  return { start, end }
}

const getDayLabel = (dueDate: number): string => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const diff = Math.floor((dueDate - todayStart) / (24 * 60 * 60 * 1000))
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return new Date(dueDate).toLocaleDateString('en-US', { weekday: 'short' })
}

export const WeekTasksCard: React.FC<IWeekTasksCardProps> = ({ sortedItems }) => {
  const { start, end } = getWeekBounds()
  const weekItems = sortedItems.filter(item => item.dueDate && item.dueDate >= start && item.dueDate < end)

  if (weekItems.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No tasks this week</span>
  }

  const top3 = weekItems.slice(0, 3)
  const rest = weekItems.slice(3)

  return (
    <>
      {top3.map(item => (
        <div key={item.id}>
          <TaskRow>
            <TaskDot $class={getDueDateClass(item.dueDate)} />
            <TaskName>{item.name}</TaskName>
          </TaskRow>
          {item.dueDate && (
            <TaskSubLine>{getDayLabel(item.dueDate)}</TaskSubLine>
          )}
        </div>
      ))}
      {rest.length > 0 && <MoreCount>+{rest.length} more</MoreCount>}
    </>
  )
}

export default WeekTasksCard
