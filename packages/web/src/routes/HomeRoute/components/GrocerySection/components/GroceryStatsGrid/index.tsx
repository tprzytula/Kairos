import React from 'react'
import { IGroceryStatsGridProps } from './types'
import {
  GroceryStats,
  GroceryImagesGrid,
  GroceryImageItem,
  GroceryImageOverflow
} from './index.styled'

export const GroceryStatsGrid: React.FC<IGroceryStatsGridProps> = ({
  groceryStats,
  onGroceryItemClick
}) => {
  return (
    <GroceryStats>
      <GroceryImagesGrid itemCount={groceryStats.displayItems.length}>
        {groceryStats.displayItems.map((item) => (
          <GroceryImageItem
            key={item.id}
            style={{
              backgroundImage: item.imagePath ? `url(${item.imagePath})` : 'none'
            }}
            title={`${item.name} (${item.quantity} ${item.unit})`}
            onClick={(event) => onGroceryItemClick(item, event)}
          >
            {!item.imagePath && item.name.charAt(0).toUpperCase()}
          </GroceryImageItem>
        ))}
        {groceryStats.hasOverflow && (
          <GroceryImageOverflow title={`+${groceryStats.unpurchasedItems.length - 9} more items`}>
            +{groceryStats.unpurchasedItems.length - 9}
          </GroceryImageOverflow>
        )}
      </GroceryImagesGrid>
    </GroceryStats>
  )
}

export default GroceryStatsGrid
