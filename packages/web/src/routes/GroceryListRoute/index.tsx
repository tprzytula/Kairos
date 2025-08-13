import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider, useGroceryListContext } from '../../providers/GroceryListProvider'
import { RemovePurchasedItemsButton } from '../../components/RemovePurchasedItemsButton'
import { useAppState } from '../../providers/AppStateProvider'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import GroceryViewModeToggle from '../../components/GroceryViewModeToggle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Container, ScrollableContainer } from './index.styled'
import { Box, IconButton } from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import { useState, useCallback } from 'react'

const GroceryListContent = () => {
  const { groceryList, viewMode, setViewMode } = useGroceryListContext()
  const { state: { purchasedItems } } = useAppState()
  
  const unpurchasedItems = groceryList.filter(item => !purchasedItems.has(item.id))
  const purchasedCount = groceryList.length - unpurchasedItems.length
  
  const stats = [
    { value: groceryList.length, label: 'Total Items' },
    { value: unpurchasedItems.length, label: 'Remaining' },
    { value: purchasedCount, label: 'Purchased' }
  ]
  
  const [allExpanded, setAllExpanded] = useState<boolean>(true)
  const [expandKey, setExpandKey] = useState<number>(0)
  const toggleAll = useCallback(() => {
    setAllExpanded((v) => !v)
    setExpandKey((k) => k + 1)
  }, [])

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Grocery List"
        icon={<ShoppingCartIcon />}
        stats={stats}
      />
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <IconButton aria-label={allExpanded ? 'Collapse all' : 'Expand all'} onClick={toggleAll} size="small">
              {allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            </IconButton>
            <Box flex={1}>
              <RemovePurchasedItemsButton />
            </Box>
          </Box>
          <GroceryViewModeToggle 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Box>
        <ScrollableContainer>
          <GroceryList allExpanded={allExpanded} expandKey={expandKey} />
        </ScrollableContainer>
      </Container>
    </StandardLayout>
  )
}

export const GroceryListRoute = () => {
  return (
    <GroceryListProvider>
      <GroceryListContent />
    </GroceryListProvider>
  )
}

export default GroceryListRoute
