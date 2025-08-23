import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider, useGroceryListContext } from '../../providers/GroceryListProvider'
import { useAppState } from '../../providers/AppStateProvider'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import { Container, ScrollableContainer } from './index.styled'
import { useState, useCallback, useMemo } from 'react'
import { removeGroceryItems } from '../../api/groceryList'
import { showAlert } from '../../utils/alert'
import { ActionName } from '../../providers/AppStateProvider/enums'
import { GroceryViewMode } from '../../enums/groceryCategory'

const GroceryListContent = () => {
  const { groceryList, viewMode, setViewMode, refetchGroceryList } = useGroceryListContext()
  const { state: { purchasedItems }, dispatch } = useAppState()
  
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

  const statusText = useMemo(() => {
    const totalItems = groceryList.length;
    const purchasedCount = purchasedItems.size;
    
    if (totalItems === 0) {
      return "Your grocery list is empty";
    }
    
    if (purchasedCount === 0) {
      return "Tap items to mark as purchased";
    }
    
    return `${purchasedCount} of ${totalItems} item${totalItems === 1 ? '' : 's'} purchased`;
  }, [groceryList.length, purchasedItems.size]);

  const clearPurchasedItems = useCallback((purchasedItems: Set<string>) => {
    dispatch({ 
      type: ActionName.CLEAR_PURCHASED_ITEMS, 
      payload: Array.from(purchasedItems) 
    })
  }, [dispatch])

  const removePurchasedItems = useCallback(async () => {
    try {
      await removeGroceryItems(Array.from(purchasedItems));
      clearPurchasedItems(purchasedItems)
      refetchGroceryList()
    } catch (error) {
      console.error("Failed to remove purchased items:", error);
      showAlert({
        description: "Failed to remove purchased items",
        severity: "error",
      }, dispatch)
    }
  }, [purchasedItems, dispatch, refetchGroceryList, clearPurchasedItems])

  const handleViewModeChange = useCallback((newViewMode: GroceryViewMode) => {
    setViewMode(newViewMode)
  }, [setViewMode])

  const getViewToggleIcon = () => {
    const effectiveMode = viewMode === GroceryViewMode.ALPHABETICAL ? GroceryViewMode.ALPHABETICAL : GroceryViewMode.CATEGORIZED
    return effectiveMode === GroceryViewMode.CATEGORIZED ? <ViewModuleIcon /> : <SortByAlphaIcon />
  }

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Grocery List"
        icon={<ShoppingCartIcon />}
        stats={stats}
      />
      <Container>
        <ActionButtonsBar
          expandCollapseButton={{
            isExpanded: allExpanded,
            onToggle: toggleAll,
            children: allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />
          }}
          actionButton={{
            isEnabled: purchasedItems.size > 0,
            onClick: removePurchasedItems,
            children: "Remove Purchased Items",
            statusText: statusText,
          }}
          viewToggleButton={{
            children: getViewToggleIcon(),
            onClick: () => {
              const VIEW_MODE_CYCLE = [GroceryViewMode.CATEGORIZED, GroceryViewMode.ALPHABETICAL]
              const currentIndex = VIEW_MODE_CYCLE.indexOf(viewMode)
              const nextIndex = (currentIndex + 1) % VIEW_MODE_CYCLE.length
              const nextMode = VIEW_MODE_CYCLE[nextIndex]
              handleViewModeChange(nextMode)
            },
          }}
        />
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
