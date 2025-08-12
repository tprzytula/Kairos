import { useState, useCallback, useEffect } from 'react'
import { Box, Collapse, IconButton } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GroceryItem from '../GroceryItem'
import SwipeableList from '../SwipeableList'
import { IGroceryCategorySectionProps } from './types'
import { CategoryHeader, CategoryTitle, ItemCountChip, CategoryContent, CategoryWrapper, CategoryIconCircle, ChevronBox } from './index.styled'
import { GroceryCategory } from '../../enums/groceryCategory'

const CATEGORY_META: Record<GroceryCategory, { emoji: string; bg: string; fg: string }> = {
  [GroceryCategory.PRODUCE]: { emoji: '🥬', bg: '#ecfdf5', fg: '#047857' },
  [GroceryCategory.DAIRY]: { emoji: '🧀', bg: '#fff7ed', fg: '#9a3412' },
  [GroceryCategory.MEAT]: { emoji: '🥩', bg: '#fef2f2', fg: '#991b1b' },
  [GroceryCategory.FROZEN]: { emoji: '🧊', bg: '#eff6ff', fg: '#1d4ed8' },
  [GroceryCategory.BAKERY]: { emoji: '🥖', bg: '#fffbeb', fg: '#92400e' },
  [GroceryCategory.PANTRY]: { emoji: '🫘', bg: '#faf5ff', fg: '#7e22ce' },
  [GroceryCategory.BEVERAGES]: { emoji: '🧃', bg: '#f0f9ff', fg: '#0c4a6e' },
  [GroceryCategory.HOUSEHOLD]: { emoji: '🧻', bg: '#f8fafc', fg: '#0f172a' },
  [GroceryCategory.OTHER]: { emoji: '🧺', bg: '#f4f4f5', fg: '#374151' },
}

export const GroceryCategorySection = ({ 
  categoryLabel,
  category,
  items, 
  onDelete, 
  onEdit,
  expandTo,
  expandKey,
}: IGroceryCategorySectionProps) => {
  const [internalExpanded, setInternalExpanded] = useState(true)
  const isExpanded = expandTo !== null && expandTo !== undefined ? expandTo : internalExpanded

  // When expandKey changes, apply expandTo to force all open/close synchronously
  useEffect(() => {
    if (expandTo !== null && expandTo !== undefined) {
      setInternalExpanded(expandTo)
    }
  }, [expandKey])

  const handleToggleExpanded = useCallback(() => {
    setInternalExpanded(!internalExpanded)
  }, [internalExpanded])

  if (items.length === 0) {
    return null
  }

  return (
    <CategoryWrapper>
      <CategoryHeader onClick={handleToggleExpanded}>
        <Box display="flex" alignItems="center" gap={1.25}>
          <CategoryIconCircle bg={CATEGORY_META[category].bg} fg={CATEGORY_META[category].fg}>
            {CATEGORY_META[category].emoji}
          </CategoryIconCircle>
          <CategoryTitle>{categoryLabel}</CategoryTitle>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <ItemCountChip label={items.length} size="small" />
          <IconButton size="small" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            <ChevronBox expanded={isExpanded}>
              <ExpandMoreIcon />
            </ChevronBox>
          </IconButton>
        </Box>
      </CategoryHeader>

      <Collapse in={isExpanded}>
        <CategoryContent>
          <SwipeableList
            component={GroceryItem}
            list={items}
            onSwipeAction={onDelete}
            onEditAction={onEdit}
            threshold={0.3}
          />
        </CategoryContent>
      </Collapse>
    </CategoryWrapper>
  )
}

export default GroceryCategorySection