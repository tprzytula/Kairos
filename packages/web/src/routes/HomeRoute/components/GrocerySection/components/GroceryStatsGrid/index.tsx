import React from 'react'
import { IGroceryStatsGridProps } from './types'
import {
  GroceryStats,
  GroceryImagesGrid,
  GroceryImageItem,
  GroceryImageOverflow,
} from './index.styled'
import ShopIconBadge from '../../../../../../components/ShopIconBadge'

export const GroceryStatsGrid: React.FC<IGroceryStatsGridProps> = ({
  groceryStats,
  shops,
  onGroceryItemClick
}) => {
  return (
    <GroceryStats>
      <GroceryImagesGrid itemCount={groceryStats.displayItems.length}>
        {groceryStats.displayItems.map((item) => {
          const shop = shops.find(s => s.id === item.shopId) ?? null
          return (
            <GroceryImageItem
              key={item.id}
              style={{
                backgroundImage: item.imagePath ? `url(${item.imagePath})` : 'none'
              }}
              title={`${item.name} (${item.quantity} ${item.unit})`}
              onClick={(event) => onGroceryItemClick(item, event)}
            >
              {!item.imagePath && item.name.charAt(0).toUpperCase()}
              {shop && (
                <ShopIconBadge shop={shop} size={16} bottom="2px" right="2px" />
              )}
            </GroceryImageItem>
          )
        })}
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
