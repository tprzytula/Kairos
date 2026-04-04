import React, { useState } from 'react'
import { Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { ITodoItem } from '../../../../../../api/toDoList/retrieve/types'
import TaskCard from '../TaskCard'
import { TaskListContainer, ExpandButton, EmptyMessage, TaskPlaceholderCard, TaskPlaceholderTitle, TaskPlaceholderMeta } from './index.styled'

const DEFAULT_VISIBLE = 2

interface TaskListProps {
  items: ITodoItem[]
  isLoading?: boolean
  isError?: boolean
  onStepToggle: (todoId: string, stepId: string, isDone: boolean) => void
  onCardClick: (item: ITodoItem) => void
  onMarkDone?: (id: string) => void
}

const TaskPlaceholder: React.FC = () => (
  <TaskListContainer>
    <TaskPlaceholderCard>
      <TaskPlaceholderTitle />
      <TaskPlaceholderMeta />
    </TaskPlaceholderCard>
    <TaskPlaceholderCard>
      <TaskPlaceholderTitle />
      <TaskPlaceholderMeta />
    </TaskPlaceholderCard>
  </TaskListContainer>
)

const TaskList: React.FC<TaskListProps> = ({ items, isLoading, isError, onStepToggle, onCardClick, onMarkDone }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading && items.length === 0) {
    return <TaskPlaceholder />
  }

  if (items.length === 0) {
    return <EmptyMessage>{isError ? 'Unable to load tasks' : 'No tasks planned — enjoy the day!'}</EmptyMessage>
  }

  const visibleItems = items.slice(0, DEFAULT_VISIBLE)
  const hiddenItems = items.slice(DEFAULT_VISIBLE)
  const hasMore = hiddenItems.length > 0

  return (
    <TaskListContainer>
      {visibleItems.map(item => (
        <TaskCard
          key={item.id}
          item={item}
          onStepToggle={onStepToggle}
          onCardClick={onCardClick}
          onMarkDone={onMarkDone}
        />
      ))}

      {hasMore && (
        <>
          <Collapse in={isExpanded} timeout={250}>
            <TaskListContainer>
              {hiddenItems.map(item => (
                <TaskCard
                  key={item.id}
                  item={item}
                  onStepToggle={onStepToggle}
                  onCardClick={onCardClick}
                />
              ))}
            </TaskListContainer>
          </Collapse>
          <ExpandButton onClick={() => setIsExpanded(v => !v)}>
            {isExpanded ? (
              <>Show less <ExpandLessIcon sx={{ fontSize: '0.85rem' }} /></>
            ) : (
              <>{hiddenItems.length} more {hiddenItems.length === 1 ? 'task' : 'tasks'} <ExpandMoreIcon sx={{ fontSize: '0.85rem' }} /></>
            )}
          </ExpandButton>
        </>
      )}
    </TaskListContainer>
  )
}

export default TaskList
