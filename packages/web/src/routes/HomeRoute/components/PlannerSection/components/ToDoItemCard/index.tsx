import React from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
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
  MetadataIcon,
  MetadataContent,
  MetadataLabel,
  MetadataValue,
  DueDateChip
} from './index.styled'

export const ToDoItemCard: React.FC<IToDoItemCardProps> = ({
  item,
  dueDateText,
  dueDateClass,
  isExpanded,
  onToggle
}) => {
  return (
    <CompactItemText $isExpanded={isExpanded} onClick={onToggle}>
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
      {isExpanded && (
        <ExpandedToDoContent>
          {item.description && (
            <ExpandedDescription>
              {item.description}
            </ExpandedDescription>
          )}
          {item.dueDate && (
            <ExpandedMetadata>
              <MetadataRow>
                <MetadataIcon>
                  <CalendarTodayIcon />
                </MetadataIcon>
                <MetadataContent>
                  <MetadataLabel>Due Date</MetadataLabel>
                  <MetadataValue>
                    <DueDateChip 
                      $isOverdue={dueDateClass === 'overdue'}
                      $isToday={dueDateClass === 'today'}
                      $isSoon={dueDateClass === 'soon'}
                    >
                      <CalendarTodayIcon />
                      {new Date(item.dueDate).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric'
                      })} at {new Date(item.dueDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </DueDateChip>
                  </MetadataValue>
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
