import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider, useGroceryListContext } from '../../providers/GroceryListProvider'
import { RemovePurchasedItemsButton } from '../../components/RemovePurchasedItemsButton'
import { useAppState } from '../../providers/AppStateProvider'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Container, ScrollableContainer } from './index.styled'

const GroceryListContent = () => {
  const { groceryList } = useGroceryListContext()
  const { state: { purchasedItems } } = useAppState()
  
  const unpurchasedItems = groceryList.filter(item => !purchasedItems.has(item.id))
  const purchasedCount = groceryList.length - unpurchasedItems.length
  
  const stats = [
    { value: groceryList.length, label: 'Total Items' },
    { value: unpurchasedItems.length, label: 'Remaining' },
    { value: purchasedCount, label: 'Purchased' }
  ]
  
  return (
    <StandardLayout>
      <ModernPageHeader
        title="Grocery List"
        icon={<ShoppingCartIcon />}
      />
      <Container>
        <RemovePurchasedItemsButton />
        <ScrollableContainer>
          <GroceryList />
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
