import { useState, useCallback } from 'react'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { IUseHomeInteractions, NoiseView, IPopupPosition } from './types'

export const useHomeInteractions = (): IUseHomeInteractions => {
  const [selectedGroceryItem, setSelectedGroceryItem] = useState<IGroceryItem | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [anchorPosition, setAnchorPosition] = useState<IPopupPosition | undefined>(undefined)
  const [isToDoItemsExpanded, setIsToDoItemsExpanded] = useState(false)
  const [noiseView, setNoiseView] = useState<NoiseView>('overview')
  const [expandedToDoItems, setExpandedToDoItems] = useState<Set<string>>(new Set())

  const calculatePopupPosition = useCallback((
    item: IGroceryItem, 
    event: React.MouseEvent<HTMLDivElement>
  ): IPopupPosition => {
    const rect = event.currentTarget.getBoundingClientRect()
    const bubbleMaxWidth = 240
    const bubbleWidth = bubbleMaxWidth
    const viewportWidth = window.innerWidth
    const padding = 16
    
    const idealCenterX = rect.left + rect.width / 2 + window.scrollX
    
    const minCenterX = window.scrollX + padding + bubbleWidth / 2
    const maxCenterX = window.scrollX + viewportWidth - padding - bubbleWidth / 2
    
    const adjustedCenterX = Math.max(minCenterX, Math.min(maxCenterX, idealCenterX))
    
    const arrowOffset = idealCenterX - adjustedCenterX
    
    return {
      top: rect.bottom + window.scrollY + 8,
      left: adjustedCenterX,
      arrowOffset: arrowOffset,
    }
  }, [])

  const handleGroceryItemClick = useCallback((item: IGroceryItem, event: React.MouseEvent<HTMLDivElement>) => {
    const position = calculatePopupPosition(item, event)
    
    setSelectedGroceryItem(item)
    setAnchorPosition(position)
    setIsPopupOpen(true)
  }, [calculatePopupPosition])

  const handlePopupClose = useCallback(() => {
    setIsPopupOpen(false)
    setSelectedGroceryItem(null)
    setAnchorPosition(undefined)
  }, [])

  const handleToggleToDoItems = useCallback(() => {
    setIsToDoItemsExpanded(prev => !prev)
  }, [])

  const handleNoiseViewChange = useCallback((view: NoiseView) => {
    setNoiseView(view)
  }, [])

  const handleToDoItemToggle = useCallback((itemId: string) => {
    setExpandedToDoItems(prev => {
      const newExpandedItems = new Set(prev)
      if (newExpandedItems.has(itemId)) {
        newExpandedItems.delete(itemId)
      } else {
        newExpandedItems.add(itemId)
      }
      return newExpandedItems
    })
  }, [])

  return {
    selectedGroceryItem,
    isPopupOpen,
    anchorPosition,
    isToDoItemsExpanded,
    noiseView,
    expandedToDoItems,
    handleGroceryItemClick,
    handlePopupClose,
    handleToggleToDoItems,
    handleNoiseViewChange,
    handleToDoItemToggle
  }
}

export default useHomeInteractions
