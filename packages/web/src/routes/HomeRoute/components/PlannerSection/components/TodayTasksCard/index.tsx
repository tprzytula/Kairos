import React from 'react'
import { Collapse } from '@mui/material'
import { ITodoItem } from '../../../../../../api/toDoList/retrieve/types'
import { getDueDateClass } from '../../../../../../utils/dateTime'
import { TaskRow, TaskDot, TaskName, OverdueBadge, MoreCount, TaskSubLine } from './index.styled'

interface ITodayTasksCardProps {
  sortedItems: ITodoItem[]
  isExpanded?: boolean
}

const getTodayBounds = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const end = start + 24 * 60 * 60 * 1000
  return { start, end }
}

const getTaskSubLine = (item: ITodoItem): string | null => {
  const parts: string[] = []
  if (item.description) parts.push(item.description)
  if (item.steps && item.steps.length > 0) {
    const doneCount = item.steps.filter(s => s.isDone).length
    parts.push(`${doneCount} / ${item.steps.length} steps`)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

const TaskEntry: React.FC<{ item: ITodoItem; showDetails: boolean }> = ({ item, showDetails }) => {
  const subLine = getTaskSubLine(item)
  return (
    <div>
      <TaskRow>
        <TaskDot $class={getDueDateClass(item.dueDate)} />
        <TaskName>{item.name}</TaskName>
      </TaskRow>
      {showDetails && subLine && <TaskSubLine>{subLine}</TaskSubLine>}
    </div>
  )
}

export const TodayTasksCard: React.FC<ITodayTasksCardProps> = ({ sortedItems, isExpanded = false }) => {
  const { start, end } = getTodayBounds()

  const overdueItems = sortedItems.filter(item => item.dueDate && item.dueDate < start)
  const todayItems = sortedItems.filter(item => item.dueDate && item.dueDate >= start && item.dueDate < end)

  if (todayItems.length === 0 && overdueItems.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No tasks for today</span>
  }

  const top3 = todayItems.slice(0, 3)
  const rest = todayItems.slice(3)

  return (
    <>
      {overdueItems.length > 0 && (
        <OverdueBadge>{overdueItems.length} overdue</OverdueBadge>
      )}
      {todayItems.length === 0 && overdueItems.length > 0 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No tasks due today</span>
      )}
      {top3.map(item => (
        <TaskEntry key={item.id} item={item} showDetails={isExpanded} />
      ))}
      {rest.length > 0 && (
        <>
          <Collapse in={isExpanded} timeout={150}>
            {rest.map(item => (
              <TaskEntry key={item.id} item={item} showDetails={isExpanded} />
            ))}
          </Collapse>
          {!isExpanded && <MoreCount>+{rest.length} more</MoreCount>}
        </>
      )}
    </>
  )
}

export default TodayTasksCard
