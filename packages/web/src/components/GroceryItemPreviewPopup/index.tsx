import React from 'react'
import { createPortal } from 'react-dom'
import { IGroceryItemPreviewPopupProps } from './types'
import { 
  BubbleContainer,
  BubbleOverlay,
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
  if (!open || !item || !anchorPosition) return null

  const bubbleStyle = {
    top: anchorPosition.top,
    left: anchorPosition.left,
  }

  return createPortal(
    <>
      <BubbleOverlay onClick={onClose} />
      <BubbleContainer
        style={bubbleStyle}
        $arrowOffset={anchorPosition.arrowOffset}
        role="tooltip"
        aria-label={`${item.name} - ${item.quantity} ${item.unit}`}
      >
        <ItemDetails>
          <ItemName>{item.name}</ItemName>
          <ItemQuantity>{item.quantity} {item.unit}</ItemQuantity>
        </ItemDetails>
      </BubbleContainer>
    </>,
    document.body
  )
}

export default GroceryItemPreviewPopup
