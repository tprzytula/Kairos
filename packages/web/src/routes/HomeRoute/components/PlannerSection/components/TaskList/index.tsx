import React, { useState } from 'react'
import { Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { ITodoItem } from '../../../../../../api/toDoList/retrieve/types'
import TaskCard from '../TaskCard'
import { TaskListContainer, ExpandButton, EmptyMessage } from './index.styled'

const DEFAULT_VISIBLE = 2

interface TaskListProps {
  items: ITodoItem[]
  onStepToggle: (todoId: string, stepId: string, isDone: boolean) => void
  onCardClick: (item: ITodoItem) => void
}

const TaskList: React.FC<TaskListProps> = ({ items, onStepToggle, onCardClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (items.length === 0) {
    return <EmptyMessage>No tasks planned — enjoy the day!</EmptyMessage>
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
