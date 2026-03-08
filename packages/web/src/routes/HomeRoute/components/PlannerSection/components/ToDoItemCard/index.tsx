import React from 'react'
import { IToDoItemCardProps } from './types'
import {
  CompactItemText,
  CompactItemHeader,
  CompactItemContent,
  CompactItemMeta,
  CompactDescription,
  DueDateText,
  ExpandedToDoContent,
  ExpandedDescription,
  ExpandedMetadata,
  MetadataRow,
  MetadataContent,
  MetadataLabel,
  MetadataValue,
} from './index.styled'

const formatFullDate = (dueDate: number): string => {
  const date = new Date(dueDate)
  const datePart = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return `${datePart} at ${timePart}`
}

export const ToDoItemCard: React.FC<IToDoItemCardProps> = ({
  item,
  dueDateText,
  dueDateClass,
  isExpanded,
  onClick
}) => {
  return (
    <CompactItemText $isExpanded={isExpanded} onClick={onClick}>
      <CompactItemHeader>
        <CompactItemContent>
          {item.name}
          {!isExpanded && item.description && (
            <CompactDescription>
              {item.description.length > 50
                ? `${item.description.substring(0, 50)}...`
                : item.description}
            </CompactDescription>
          )}
        </CompactItemContent>
        {dueDateText && (
          <CompactItemMeta>
            <DueDateText className={dueDateClass}>
              {dueDateText}
            </DueDateText>
          </CompactItemMeta>
        )}
      </CompactItemHeader>
      {isExpanded && (item.description || item.dueDate) && (
        <ExpandedToDoContent>
          {item.description && (
            <ExpandedDescription>
              {item.description}
            </ExpandedDescription>
          )}
          {item.dueDate && (
            <ExpandedMetadata>
              <MetadataRow>
                <MetadataContent>
                  <MetadataLabel>Due Date</MetadataLabel>
                  <MetadataValue>{formatFullDate(item.dueDate)}</MetadataValue>
                </MetadataContent>
              </MetadataRow>
            </ExpandedMetadata>
          )}
        </ExpandedToDoContent>
      )}
    </CompactItemText>
  )
}

export default ToDoItemCard
