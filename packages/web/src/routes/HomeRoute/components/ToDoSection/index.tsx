import React from 'react'
import SectionCard from '../../../../components/SectionCard'
import HomeToDoItemPlaceholder from '../HomeToDoItemPlaceholder'
import ToDoItemCard from './components/ToDoItemCard'
import EmptyState from '../shared/EmptyState'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { IToDoSectionProps } from './types'
import { formatDueDateRelative, getDueDateClass } from '../../../../utils/dateTime'
import { CompactItemList, MoreItemsIndicator } from './index.styled'

export const ToDoSection: React.FC<IToDoSectionProps> = ({
  toDoStats,
  isLoading,
  isExpanded,
  expandedItems,
  onToggleExpansion,
  onItemToggle
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <CompactItemList>
          {Array.from({ length: 3 }).map((_, index) => (
            <HomeToDoItemPlaceholder key={index} />
          ))}
        </CompactItemList>
      )
    }

    if (toDoStats.displayedItems.length === 0) {
      return <EmptyState>No pending to-do items found</EmptyState>
    }

    return (
      <CompactItemList>
        {toDoStats.displayedItems.map((item) => {
          const dueDateText = formatDueDateRelative(item.dueDate)
          const dueDateClass = getDueDateClass(item.dueDate)
          const isItemExpanded = expandedItems.has(item.id)
          
          return (
            <ToDoItemCard
              key={item.id}
              item={item}
              dueDateText={dueDateText}
              dueDateClass={dueDateClass}
              isExpanded={isItemExpanded}
              onToggle={() => onItemToggle(item.id)}
            />
          )
        })}
        {toDoStats.hasMoreItems && (
          <MoreItemsIndicator onClick={onToggleExpansion}>
            {isExpanded 
              ? 'Show less'
              : `+${toDoStats.pendingItems.length - 3} more items`
            }
          </MoreItemsIndicator>
        )}
      </CompactItemList>
    )
  }

  return (
    <SectionCard
      icon={ChecklistIcon}
      title="To-Do Items"
      count={toDoStats.pendingItems.length}
    >
      {renderContent()}
    </SectionCard>
  )
}

export default ToDoSection
