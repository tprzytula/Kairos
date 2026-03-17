import React from 'react'
import SectionCard from '../../../../components/SectionCard'
import HomeGroceryItemPlaceholder from '../HomeGroceryItemPlaceholder'
import GroceryStatsGrid from './components/GroceryStatsGrid'
import EmptyState from '../shared/EmptyState'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { IGrocerySectionProps } from './types'
import { SECTION_GRADIENTS } from '../../../../constants/sectionColors'

export const GrocerySection: React.FC<IGrocerySectionProps> = ({
  groceryStats,
  shops,
  isLoading,
  onGroceryItemClick,
  onNavigate
}) => {
  return (
    <SectionCard
      icon={ShoppingCartIcon}
      title="Grocery List"
      count={groceryStats.totalItems}
      accentGradient={SECTION_GRADIENTS.grocery}
      accentBadgeColor="rgba(17, 153, 142, 0.12)"
      onHeaderClick={onNavigate}
    >
      {isLoading ? (
        <HomeGroceryItemPlaceholder />
      ) : (
        <>
          {groceryStats.totalItems > 0 ? (
            <GroceryStatsGrid
              groceryStats={groceryStats}
              shops={shops}
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
