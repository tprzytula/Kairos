import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IGroceryItemPreviewPopupProps } from './types'
import { 
  BubbleContainer,
  ItemDetails, 
  ItemName, 
  ItemQuantity 
} from './index.styled'

const GroceryItemPreviewPopup: React.FC<IGroceryItemPreviewPopupProps> = ({
  open,
  onClose,
  item,
  anchorPosition
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Don't close if clicking on the bubble itself
      if (bubbleRef.current?.contains(target)) {
        return
      }
      
      // Don't close if clicking on a grocery item (they have title attributes with pattern "ItemName (quantity unit)")
      const groceryItem = target.closest('[title*="("][title*=")"]')
      if (groceryItem) {
        return
      }
      
      // Close for all other clicks
      onClose()
    }

    // Add listener after a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick, true) // Use capture phase
    }, 50) // Reduced delay

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [open, onClose])

  if (!open || !item || !anchorPosition) return null

  const bubbleStyle = {
    top: anchorPosition.top,
    left: anchorPosition.left,
  }

  return createPortal(
    <BubbleContainer
      ref={bubbleRef}
      style={bubbleStyle}
      $arrowOffset={anchorPosition.arrowOffset}
      role="tooltip"
      aria-label={`${item.name} - ${item.quantity} ${item.unit}`}
      onClick={onClose}
    >
      <ItemDetails>
        <ItemName>{item.name}</ItemName>
        <ItemQuantity>{item.quantity} {item.unit}</ItemQuantity>
      </ItemDetails>
    </BubbleContainer>,
    document.body
  )
}

export default GroceryItemPreviewPopup
