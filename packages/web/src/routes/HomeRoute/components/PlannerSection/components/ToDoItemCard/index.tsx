import React from 'react'
import { IToDoItemCardProps } from './types'
import {
  CompactItemText,
  CompactItemHeader,
  CompactItemContent,
  CompactItemMeta,
  CompactDescription,
  DueDateText,
} from './index.styled'

export const ToDoItemCard: React.FC<IToDoItemCardProps> = ({
  item,
  dueDateText,
  dueDateClass,
  onClick
}) => {
  return (
    <CompactItemText onClick={onClick}>
      <CompactItemHeader>
        <CompactItemContent>
          {item.name}
          {item.description && (
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
    </CompactItemText>
  )
}

export default ToDoItemCard
