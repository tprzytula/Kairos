import React from 'react'
import SectionCard from '../../../../components/SectionCard'
import HomeGroceryItemPlaceholder from '../HomeGroceryItemPlaceholder'
import GroceryStatsGrid from './components/GroceryStatsGrid'
import EmptyState from '../shared/EmptyState'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { IGrocerySectionProps } from './types'

export const GrocerySection: React.FC<IGrocerySectionProps> = ({
  groceryStats,
  isLoading,
  onGroceryItemClick
}) => {
  return (
    <SectionCard
      icon={ShoppingCartIcon}
      title="Grocery List"
      count={groceryStats.totalItems}
    >
      {isLoading ? (
        <HomeGroceryItemPlaceholder />
      ) : (
        <>
          {groceryStats.totalItems > 0 ? (
            <GroceryStatsGrid
              groceryStats={groceryStats}
              onGroceryItemClick={onGroceryItemClick}
            />
          ) : (
            <EmptyState>No grocery items found</EmptyState>
          )}
        </>
      )}
    </SectionCard>
  )
}

export default GrocerySection
