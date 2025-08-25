import { useState, useCallback, useEffect } from 'react'
import { Box, Collapse, IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ToDoItem from '../ToDoItem'
import SwipeableList from '../SwipeableList'
import { IToDoTimeSectionProps } from './types'
import { TimeWrapper, TimeHeader, TimeTitle, ItemCountChip, TimeContent, TimeIconCircle, ChevronBox } from './index.styled'
import { TIME_GROUP_META, TimeGroup } from '../ToDoList/utils/timeGrouping'

export const ToDoTimeSection = ({ 
  group,
  groupLabel,
  items, 
  onSwipeAction,
  onEditAction,
  expandTo,
  expandKey,
}: IToDoTimeSectionProps) => {
  const [internalExpanded, setInternalExpanded] = useState(true)
  const isExpanded = internalExpanded

  // When expandKey changes, apply expandTo to force all open/close synchronously
  useEffect(() => {
    if (expandTo !== null && expandTo !== undefined) {
      setInternalExpanded(expandTo)
    }
  }, [expandKey, expandTo])

  const handleToggleExpanded = useCallback(() => {
    setInternalExpanded(!internalExpanded)
  }, [internalExpanded])

  if (items.length === 0) {
    return null
  }

  const meta = (typeof group === 'string' && !(group in TIME_GROUP_META)) ? {
    emoji: '✅',
    bg: '#f0f9ff',
    fg: '#0284c7'
  } : TIME_GROUP_META[group as TimeGroup]

  return (
    <TimeWrapper>
      <TimeHeader onClick={handleToggleExpanded}>
        <Box display="flex" alignItems="center" gap={1.25}>
          <TimeIconCircle bg={meta.bg} fg={meta.fg}>
            {meta.emoji}
          </TimeIconCircle>
          <TimeTitle>{groupLabel}</TimeTitle>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <ItemCountChip label={items.length} size="small" />
          <IconButton size="small" aria-label={isExpanded ? 'Collapse' : 'Expand'} onClick={handleToggleExpanded}>
            <ChevronBox expanded={isExpanded}>
              <ExpandMoreIcon />
            </ChevronBox>
          </IconButton>
        </Box>
      </TimeHeader>

      <Collapse in={isExpanded} timeout={120}>
        <TimeContent>
          <SwipeableList
            component={ToDoItem}
            list={items}
            onSwipeAction={onSwipeAction}
            onEditAction={onEditAction}
            threshold={0.3}
          />
        </TimeContent>
      </Collapse>
    </TimeWrapper>
  )
}

export default ToDoTimeSection
