import { useCallback } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import { GroceryViewMode } from '../../enums/groceryCategory'
import { IGroceryViewModeToggleProps } from './types'

const VIEW_MODE_CYCLE = [GroceryViewMode.CATEGORIZED, GroceryViewMode.ALPHABETICAL]

const VIEW_MODE_ICONS = {
  [GroceryViewMode.CATEGORIZED]: ViewModuleIcon,
  [GroceryViewMode.ALPHABETICAL]: SortByAlphaIcon,
}

export const GroceryViewModeToggle = ({ viewMode, onViewModeChange }: IGroceryViewModeToggleProps) => {
  const handleClick = useCallback(() => {
    const currentIndex = VIEW_MODE_CYCLE.indexOf(viewMode)
    const nextIndex = (currentIndex + 1) % VIEW_MODE_CYCLE.length
    const nextMode = VIEW_MODE_CYCLE[nextIndex]
    onViewModeChange(nextMode)
  }, [viewMode, onViewModeChange])

  const effectiveMode = viewMode === GroceryViewMode.ALPHABETICAL ? GroceryViewMode.ALPHABETICAL : GroceryViewMode.CATEGORIZED
  const IconComponent = VIEW_MODE_ICONS[effectiveMode]
  const currentLabel = effectiveMode === GroceryViewMode.CATEGORIZED ? 'Groups' : 'A–Z'
  const nextIndex = (VIEW_MODE_CYCLE.indexOf(viewMode) + 1) % VIEW_MODE_CYCLE.length
  const nextLabel = VIEW_MODE_CYCLE[nextIndex] === GroceryViewMode.CATEGORIZED ? 'Groups' : 'A–Z'

  return (
    <Tooltip title={`Current: ${currentLabel}. Click for ${nextLabel}`}>
      <IconButton 
        onClick={handleClick}
        size="large"
        aria-label={`Switch from ${currentLabel} to ${nextLabel} view`}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  )
}

export default GroceryViewModeToggle